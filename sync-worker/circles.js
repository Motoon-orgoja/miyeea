// «الحلقات»: small groups of friends who follow each other's daily ward. Shared by worker.js (D1) and mock.js (memory).
// No accounts: each device keeps a random member id + token (the server keeps only the token's hash) and a nickname.
// A member shares only a nickname and a short status (streak, today's ward, progress per text); there is no chat,
// only preset cheers, so nothing written by one member reaches another except the nickname and the circle's name.
// Every call is POST /c/<action> with a JSON body:
//   new {mid,tok,name,cname,stat} → {id}          join {id,mid,tok,name,stat} → circle
//   get {id,mid,tok} → circle + my cheers + sent (what I sent today)   stat {ids,mid,tok,name,stat} → {ok}
//   cheer {id,mid,tok,to,kind} → {ok, sent: false if already sent today}             leave {id,mid,tok,who?} → {ok}     rename {id,mid,tok,cname} → {ok}
//   sub {mid,tok,sub:{endpoint,keys:{p256dh,auth}}, drop?} → {ok}   (this device's push subscription, or drop it)
//   cfg {id,mid,tok,cfg:{note?,locked?,challenge?,admins?}} → {ok}   (the owner or an admin; only the owner names admins)
// The circle's settings (cfg): note, a short pinned word from the admins; locked, no new members; admins, member ids;
// challenge {t: title, k: 'all'|'days'|'mem', a, b: first and last day}. Each status update also marks the member's day
// (days: done the ward, read the tafsir ward, how much memorised), and «get» adds the points of this week and of the
// challenge: a day the ward is done 10, a day the tafsir ward is read 5, each verse or passage newly memorised 2.
// A new cheer is also sent as a push notification to the devices the member subscribed (notify, given by the worker).
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', MAXM = 50, KINDS = ['dua', 'nudge', 'mabrook'];
const PTS = { day: 10, tf: 5, mem: 2 }, KS = ['all', 'days', 'mem'];
const SAY = { dua: 'دعالك 🤲', nudge: 'ذكّرك بالورد 🔔', mabrook: 'بارك لك 🎉' };
const hex = /^[0-9a-f]{16,64}$/;
async function sha(t) { const d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mutoon-circle:' + t))); return [...d].map(b => b.toString(16).padStart(2, '0')).join('') }
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const newId = () => [...crypto.getRandomValues(new Uint8Array(8))].map(b => ALPH[b & 31]).join('');
const day = () => new Date(Date.now() + 3 * 36e5).toISOString().slice(0, 10);
const addD = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10) };
const isDay = d => /^\d{4}-\d{2}-\d{2}$/.test(d || '');
// this week: Saturday to Friday
const weekOf = d => { const w = (new Date(d + 'T12:00:00Z').getUTCDay() + 1) % 7; return [addD(d, -w), addD(d, 6 - w)] };
// the day row a status makes: the ward done, the tafsir ward read, memorised so far
const dayRow = s => ({ d: isDay(s && s.day) ? s.day : day(), done: s && s.open === 0 && s.td ? 1 : 0, tf: s && s.tf ? 1 : 0, mem: Math.max(0, (+(s && s.v) || 0) + (+(s && s.u) || 0)) });
// points of each member between a and b (k: what counts)
function points(rows, a, b, k) {
  const by = {};
  for (const r of rows) (by[r.mid] = by[r.mid] || []).push(r);
  const out = {};
  for (const [mid, rs] of Object.entries(by)) {
    rs.sort((x, y) => x.day < y.day ? -1 : 1);
    const before = rs.filter(r => r.day < a).pop(), inn = rs.filter(r => r.day >= a && r.day <= b);
    const days = inn.filter(r => r.done).length, tf = inn.filter(r => r.tf).length;
    const base = before ? before.mem : inn.length ? inn[0].mem : 0, mem = inn.length ? Math.max(0, inn[inn.length - 1].mem - base) : 0;
    out[mid] = { p: (k === 'mem' ? 0 : days * PTS.day + tf * PTS.tf) + (k === 'days' ? 0 : mem * PTS.mem), days, tf, mem };
  }
  return out;
}
const cfgOf = c => { try { return JSON.parse(c.cfg || '{}') } catch (e) { return {} } };
function statOf(s) { const j = JSON.stringify(s || {}); if (j.length > 3000) throw new E(413, 'stat'); return j }
class E extends Error { constructor(st, m) { super(m); this.st = st } }

export async function circles(action, b, db, notify) {
  const now = Date.now();
  if (!hex.test(b.mid || '') || !hex.test(b.tok || '')) throw new E(400, 'id');
  const th = await sha(b.tok);
  // the caller must already be in the circle, with the token that joined it
  const me = async id => { const m = await db.member(id, b.mid); if (!m || m.th !== th) throw new E(403, 'member'); return m };
  const view = async id => {
    const c = await db.circle(id); if (!c) throw new E(404, 'circle');
    const ms = await db.members(id);
    const cfg = cfgOf(c), t = day(), [wa, wb] = weekOf(t), ch = cfg.challenge;
    const from = addD(ch && ch.a < wa ? ch.a : wa, -60), rows = await db.days(id, from);
    const v = { id, name: c.name, owner: c.owner, cfg, today: t, members: ms.map(m => ({ mid: m.mid, name: m.name, stat: JSON.parse(m.stat || '{}'), at: m.at })) };
    v.week = { a: wa, b: wb, pts: points(rows, wa, wb, 'all') };
    if (ch) v.challenge = { ...ch, pts: points(rows, ch.a, ch.b, ch.k) };
    return v;
  };
  if (action === 'new') {
    const name = clean(b.name, 30), cname = clean(b.cname, 40); if (!name || !cname) throw new E(400, 'name');
    let id; for (let i = 0; i < 5 && (!id || await db.circle(id)); i++) id = newId();
    await db.newCircle(id, cname, b.mid, now);
    await db.putMember(id, b.mid, th, name, statOf(b.stat), now);
    await db.putDay(id, b.mid, dayRow(b.stat));
    return { id };
  }
  if (action === 'sub') {
    // a member id's subscriptions all belong to the token that first made one
    const own = await db.subTh(b.mid); if (own && own !== th) throw new E(403, 'member');
    const s = b.sub || {}, k = s.keys || {}, ep = String(s.endpoint || '');
    if (!/^https:\/\/[^\s]{10,900}$/.test(ep)) throw new E(400, 'sub');
    if (b.drop) { await db.delSub(ep); return { ok: true } }
    if (!/^[A-Za-z0-9_-]{80,100}$/.test(k.p256dh || '') || !/^[A-Za-z0-9_-]{16,30}$/.test(k.auth || '')) throw new E(400, 'sub');
    await db.putSub(b.mid, th, ep, k.p256dh, k.auth, now);
    return { ok: true };
  }
  const id = String(b.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (action === 'stat') {
    const ids = (Array.isArray(b.ids) ? b.ids : []).slice(0, 20), name = clean(b.name, 30), st = statOf(b.stat);
    for (const cid of ids) { const m = await db.member(cid, b.mid); if (m && m.th === th) { await db.updateMember(cid, b.mid, name || m.name, st, now); await db.putDay(cid, b.mid, dayRow(b.stat)) } }
    return { ok: true };
  }
  if (!/^[A-Z0-9]{8}$/.test(id)) throw new E(400, 'circle');
  if (action === 'join') {
    const c = await db.circle(id); if (!c) throw new E(404, 'circle');
    const name = clean(b.name, 30); if (!name) throw new E(400, 'name');
    const m = await db.member(id, b.mid);
    if (m) { if (m.th !== th) throw new E(403, 'member'); await db.updateMember(id, b.mid, name, statOf(b.stat), now) }
    else { if (cfgOf(c).locked) throw new E(423, 'locked'); if (await db.count(id) >= MAXM) throw new E(409, 'full'); await db.putMember(id, b.mid, th, name, statOf(b.stat), now) }
    await db.putDay(id, b.mid, dayRow(b.stat));
    return view(id);
  }
  const m = await me(id);
  const admin = c => c.owner === b.mid || (cfgOf(c).admins || []).includes(b.mid);
  if (action === 'get') { const v = await view(id); v.cheers = await db.takeCheers(id, b.mid); v.sent = await db.sentToday(id, b.mid, day()); return v }
  if (action === 'cheer') {
    if (!KINDS.includes(b.kind) || !hex.test(b.to || '') || b.to === b.mid || !await db.member(id, b.to)) throw new E(400, 'cheer');
    // one cheer of each kind from one member to another a day
    const added = await db.addCheer(id, b.to, b.mid, m.name, b.kind, day(), now);
    if (added && notify) { const c = await db.circle(id); await notify(b.to, { t: c.name, b: m.name + ' ' + SAY[b.kind], u: 'home.html' }) }
    return { ok: true, sent: added };
  }
  if (action === 'rename') {
    const c = await db.circle(id); if (!admin(c)) throw new E(403, 'owner');
    const cname = clean(b.cname, 40); if (!cname) throw new E(400, 'name'); await db.renameCircle(id, cname); return { ok: true };
  }
  if (action === 'cfg') {
    const c = await db.circle(id); if (!admin(c)) throw new E(403, 'owner');
    const cfg = cfgOf(c), n = b.cfg || {};
    if ('note' in n) { const t = clean(n.note, 200); if (t) cfg.note = t; else delete cfg.note }
    if ('locked' in n) { if (n.locked) cfg.locked = true; else delete cfg.locked }
    if ('challenge' in n) {
      const x = n.challenge;
      if (!x) delete cfg.challenge;
      else { const t = clean(x.t, 50), len = Math.round(+x.days); if (!t || !(len >= 1 && len <= 90) || !KS.includes(x.k)) throw new E(400, 'challenge');
        const a = isDay(x.a) ? x.a : day(); cfg.challenge = { t, k: x.k, a, b: addD(a, len - 1) } }
    }
    if ('admins' in n) {
      if (c.owner !== b.mid) throw new E(403, 'owner');
      const ms = new Set((await db.members(id)).map(x => x.mid));
      cfg.admins = (Array.isArray(n.admins) ? n.admins : []).filter(x => hex.test(x) && ms.has(x) && x !== c.owner).slice(0, 5);
      if (!cfg.admins.length) delete cfg.admins;
    }
    await db.setCfg(id, JSON.stringify(cfg)); return { ok: true };
  }
  if (action === 'leave') {
    const c = await db.circle(id), who = b.who && b.who !== b.mid ? b.who : b.mid, adm = cfgOf(c).admins || [];
    // an admin may take out a member, not the owner nor another admin
    if (who !== b.mid && !(c.owner === b.mid || admin(c) && who !== c.owner && !adm.includes(who))) throw new E(403, 'owner');
    await db.delMember(id, who);
    const rest = await db.members(id);
    if (!rest.length) await db.delCircle(id);
    else if (who === c.owner) await db.setOwner(id, rest.sort((x, y) => x.joined - y.joined)[0].mid);
    return { ok: true };
  }
  throw new E(404, 'action');
}

// the D1 tables (schema.sql) behind the same interface the mock keeps in memory
export function d1(D) {
  const one = (q, ...a) => D.prepare(q).bind(...a).first(), run = (q, ...a) => D.prepare(q).bind(...a).run();
  return {
    circle: id => one('SELECT id,name,owner,cfg FROM circles WHERE id=?', id),
    setCfg: (id, cfg) => run('UPDATE circles SET cfg=? WHERE id=?', cfg, id),
    // one row a member a day; the ward and the tafsir stay done once done that day
    putDay: (cid, mid, r) => run('INSERT INTO days(cid,mid,day,done,tf,mem) VALUES(?,?,?,?,?,?) ON CONFLICT(cid,mid,day) DO UPDATE SET done=MAX(done,excluded.done),tf=MAX(tf,excluded.tf),mem=excluded.mem', cid, mid, r.d, r.done, r.tf, r.mem),
    days: async (cid, from) => (await D.prepare('SELECT mid,day,done,tf,mem FROM days WHERE cid=? AND day>=?').bind(cid, from).all()).results,
    newCircle: (id, name, owner, at) => run('INSERT INTO circles(id,name,owner,created) VALUES(?,?,?,?)', id, name, owner, at),
    renameCircle: (id, name) => run('UPDATE circles SET name=? WHERE id=?', name, id),
    setOwner: (id, mid) => run('UPDATE circles SET owner=? WHERE id=?', mid, id),
    delCircle: async id => { await run('DELETE FROM cheers WHERE cid=?', id); await run('DELETE FROM days WHERE cid=?', id); await run('DELETE FROM circles WHERE id=?', id) },
    member: (cid, mid) => one('SELECT * FROM members WHERE cid=? AND mid=?', cid, mid),
    members: async cid => (await D.prepare('SELECT * FROM members WHERE cid=? ORDER BY joined').bind(cid).all()).results,
    count: async cid => (await one('SELECT COUNT(*) n FROM members WHERE cid=?', cid)).n,
    putMember: (cid, mid, th, name, stat, at) => run('INSERT INTO members(cid,mid,th,name,stat,at,joined) VALUES(?,?,?,?,?,?,?)', cid, mid, th, name, stat, at, at),
    updateMember: (cid, mid, name, stat, at) => run('UPDATE members SET name=?,stat=?,at=? WHERE cid=? AND mid=?', name, stat, at, cid, mid),
    delMember: async (cid, mid) => { await run('DELETE FROM members WHERE cid=? AND mid=?', cid, mid); await run('DELETE FROM days WHERE cid=? AND mid=?', cid, mid); await run('DELETE FROM cheers WHERE cid=? AND (tomid=? OR frommid=?)', cid, mid, mid) },
    addCheer: async (cid, to, from, name, kind, d, at) => (await run('INSERT OR IGNORE INTO cheers(cid,tomid,frommid,fromname,kind,day,at) VALUES(?,?,?,?,?,?,?)', cid, to, from, name, kind, d, at)).meta.changes > 0,
    sentToday: async (cid, from, d) => (await D.prepare('SELECT tomid,kind FROM cheers WHERE cid=? AND frommid=? AND day=?').bind(cid, from, d).all()).results.map(x => [x.tomid, x.kind]),
    subTh: async mid => (await one('SELECT th FROM subs WHERE mid=? LIMIT 1', mid) || {}).th,
    subs: async mid => (await D.prepare('SELECT ep,p256dh,auth FROM subs WHERE mid=?').bind(mid).all()).results,
    // a member keeps at most 5 devices: the newest
    putSub: async (mid, th, ep, p, a, at) => { await run('INSERT OR REPLACE INTO subs(ep,mid,th,p256dh,auth,at) VALUES(?,?,?,?,?,?)', ep, mid, th, p, a, at); await run('DELETE FROM subs WHERE mid=? AND ep NOT IN (SELECT ep FROM subs WHERE mid=? ORDER BY at DESC LIMIT 5)', mid, mid) },
    delSub: ep => run('DELETE FROM subs WHERE ep=?', ep),
    takeCheers: async (cid, to) => {
      const r = (await D.prepare('SELECT fromname,kind,at FROM cheers WHERE cid=? AND tomid=? AND seen=0 ORDER BY at').bind(cid, to).all()).results;
      if (r.length) await run('UPDATE cheers SET seen=1 WHERE cid=? AND tomid=?', cid, to);
      return r.map(x => ({ from: x.fromname, kind: x.kind, at: x.at }));
    },
  };
}

export function memory() {
  const C = new Map(), M = new Map(), H = [], S = new Map(), DY = new Map();
  const k = (c, m) => c + '|' + m;
  return {
    circle: async id => C.get(id) || null,
    setCfg: async (id, cfg) => { C.get(id).cfg = cfg },
    putDay: async (cid, mid, r) => { const kk = cid + '|' + mid + '|' + r.d, o = DY.get(kk); DY.set(kk, { cid, mid, day: r.d, done: Math.max(r.done, o ? o.done : 0), tf: Math.max(r.tf, o ? o.tf : 0), mem: r.mem }) },
    days: async (cid, from) => [...DY.values()].filter(r => r.cid === cid && r.day >= from),
    newCircle: async (id, name, owner) => { C.set(id, { id, name, owner }) },
    renameCircle: async (id, name) => { C.get(id).name = name },
    setOwner: async (id, mid) => { C.get(id).owner = mid },
    delCircle: async id => { C.delete(id) },
    member: async (cid, mid) => M.get(k(cid, mid)) || null,
    members: async cid => [...M.values()].filter(m => m.cid === cid).sort((a, b) => a.joined - b.joined),
    count: async cid => [...M.values()].filter(m => m.cid === cid).length,
    putMember: async (cid, mid, th, name, stat, at) => { M.set(k(cid, mid), { cid, mid, th, name, stat, at, joined: at }) },
    updateMember: async (cid, mid, name, stat, at) => Object.assign(M.get(k(cid, mid)), { name, stat, at }),
    delMember: async (cid, mid) => { M.delete(k(cid, mid)) },
    addCheer: async (cid, to, from, name, kind, d, at) => { if (H.some(h => h.cid === cid && h.to === to && h.from === from && h.kind === kind && h.d === d)) return false; H.push({ cid, to, from, name, kind, d, at, seen: 0 }); return true },
    sentToday: async (cid, from, d) => H.filter(h => h.cid === cid && h.from === from && h.d === d).map(h => [h.to, h.kind]),
    subTh: async mid => ([...S.values()].find(s => s.mid === mid) || {}).th,
    subs: async mid => [...S.values()].filter(s => s.mid === mid),
    putSub: async (mid, th, ep, p256dh, auth, at) => { S.set(ep, { mid, th, ep, p256dh, auth, at }) },
    delSub: async ep => { S.delete(ep) },
    takeCheers: async (cid, to) => H.filter(h => h.cid === cid && h.to === to && !h.seen).map(h => { h.seen = 1; return { from: h.name, kind: h.kind, at: h.at } }),
  };
}

// the HTTP side: POST /c/<action>, JSON in and out
export async function handle(req, db, cors, notify) {
  const m = new URL(req.url).pathname.match(/^\/c\/([a-z]+)$/);
  const json = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  if (!m || req.method !== 'POST') return json({ error: 'not found' }, 404);
  let b; try { const t = await req.text(); if (t.length > 8000) throw 0; b = JSON.parse(t) } catch (e) { return json({ error: 'body' }, 400) }
  try { return json(await circles(m[1], b, db, notify)) } catch (e) { return json({ error: e.message }, e.st || 500) }
}

export async function pushTo(db, mid, msg, send) {
  for (const s of await db.subs(mid)) { try { const st = await send(s, msg); if (st === 404 || st === 410) await db.delSub(s.ep) } catch (e) { } }
}
