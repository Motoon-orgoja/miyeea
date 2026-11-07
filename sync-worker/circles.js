// «الحلقات»: small groups of friends who follow each other's daily ward. Shared by worker.js (D1) and mock.js (memory).
// No accounts: each device keeps a random member id + token (the server keeps only the token's hash) and a nickname.
// A member shares only a nickname and a short status (streak, today's ward, progress per text); there is no chat,
// only preset cheers, so nothing written by one member reaches another except the nickname and the circle's name.
// Every call is POST /c/<action> with a JSON body:
//   new {mid,tok,name,cname,stat} → {id}          join {id,mid,tok,name,stat} → circle
//   get {id,mid,tok} → circle + my cheers + sent (what I sent today)   stat {ids,mid,tok,name,stat} → {ok}
//   cheer {id,mid,tok,to,kind} → {ok, sent: false if already sent today}             leave {id,mid,tok,who?} → {ok}     rename {id,mid,tok,cname} → {ok}
//   sub {mid,tok,sub:{endpoint,keys:{p256dh,auth}}, drop?} → {ok}   (this device's push subscription, or drop it)
//   me {mid,tok,day,left,rem} → {ok}   (for the daily reminder: today's tasks left, -1 for none, and the hour to remind, -1 off)
//   cfg {id,mid,tok,cfg:{note?,locked?,challenge?,admins?,track?,assign?}} → {ok}   (the owner or an admin; only the owner names admins)
//   pick {id,mid,tok,key} → {ok}   (in a circle where each member follows one text: the member's own text)
//   bonus {id,mid,tok,to,kind:'tsm'|'man',grade?:'a'|'b'|'c',pts?,why?} → {ok}   (an admin: a recitation heard and graded,
//     worth the circle's tasmee points × grade, or points given by hand with a reason)
// Rounds (cfg.round 'week' Saturday–Friday, or 'month'): «get» gives this round's points (round), the last round's (prev),
// and the record of past rounds (cfg.hist: the winner and the most improved of each), kept as each round ends.
// Points (cfg.pts, the admins choose): {day, tf, mem, tsm}, by default 10, 5, 2, 15.
// What a circle follows (cfg.track): {m:'all'} every text of each member (the default); {m:'one',k} one text for everyone;
// {m:'each',a:{mid:key}} each member one text (the member picks it, an admin may set it). The status then carries bks
// {key:[memorised, total, tasks left today]}, and the points count only the followed text.
// The circle's settings (cfg): note, a short pinned word from the admins; locked, no new members; admins, member ids;
// challenge {t: title, k: 'all'|'days'|'mem', a, b: first and last day}. Each status update also marks the member's day
// (days: done the ward, read the tafsir ward, how much memorised), and «get» adds the points of this week and of the
// challenge: a day the ward is done 10, a day the tafsir ward is read 5, each verse or passage newly memorised 2.
// A new cheer is also sent as a push notification to the devices the member subscribed (notify, given by the worker).
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', MAXM = 50, KINDS = ['dua', 'nudge', 'mabrook'];
const PTS = { day: 10, tf: 5, mem: 2, tsm: 15 }, KS = ['all', 'days', 'mem'], GRADE = { a: 1, b: 0.66, c: 0.2 };
const ptsOf = cfg => { const p = (cfg && cfg.pts) || {}; const o = {}; for (const k in PTS) o[k] = Number.isInteger(p[k]) ? p[k] : PTS[k]; return o };
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
// a round: this week (Saturday–Friday) or this month, and the one before a given round
const roundOf = (d, mode) => mode === 'month' ? [d.slice(0, 8) + '01', addD(addD(d.slice(0, 8) + '01', 32).slice(0, 8) + '01', -1)] : weekOf(d);
const before = (r, mode) => roundOf(addD(r[0], -1), mode);
const isKey = k => /^[a-z]{2,24}$/.test(k || '');
// the text a member follows in a circle (null: every text)
const keyOf = (cfg, mid) => { const t = cfg && cfg.track; return !t || t.m === 'all' ? null : t.m === 'one' ? t.k || '' : (t.a || {})[mid] || '' };
// the day row: the ward done, the tafsir read, memorised so far, and per text [memorised, its ward done] (bk), so the
// points can follow any text the circle chooses, even after it changes
const dayRow = s => {
  const bk = {}; Object.entries((s && s.bks) || {}).filter(([k]) => isKey(k)).slice(0, 40).forEach(([k, x]) => { bk[k] = [Math.max(0, +(x && x[0]) || 0), x && +x[2] === 0 && s.td ? 1 : 0] });
  return { d: isDay(s && s.day) ? s.day : day(), done: s && s.open === 0 && s.td ? 1 : 0, tf: s && s.tf ? 1 : 0, mem: Math.max(0, (+(s && s.v) || 0) + (+(s && s.u) || 0)), bk: JSON.stringify(bk) };
};
// points of each member between a and b (k: what counts)
function points(rows, a, b, k, cfg, bon) {
  const by = {}, W = ptsOf(cfg);
  for (const r of rows) (by[r.mid] = by[r.mid] || []).push(r);
  const out = {};
  // the points an admin gave in the round (heard recitations and given by hand)
  const extra = {}; (bon || []).filter(x => x.day >= a && x.day <= b).forEach(x => { const e = extra[x.mid] = extra[x.mid] || { p: 0, tsm: 0 }; e.p += x.pts; if (x.kind === 'tsm') e.tsm++ });
  for (const [mid, rs] of Object.entries(by)) {
    rs.sort((x, y) => x.day < y.day ? -1 : 1);
    // a circle that follows one text: that text's count and ward only
    const tk = keyOf(cfg, mid); if (tk !== null) rs.forEach(r => { let x = []; try { x = (JSON.parse(r.bk || '{}'))[tk] || [] } catch (e) { } r = Object.assign(r, { mem: x[0] || 0, done: x[1] || 0, tf: 0 }) });
    const before = rs.filter(r => r.day < a).pop(), inn = rs.filter(r => r.day >= a && r.day <= b);
    const days = inn.filter(r => r.done).length, tf = inn.filter(r => r.tf).length;
    const base = before ? before.mem : inn.length ? inn[0].mem : 0, mem = inn.length ? Math.max(0, inn[inn.length - 1].mem - base) : 0;
    const e = extra[mid] || { p: 0, tsm: 0 };
    out[mid] = { p: Math.max(0, (k === 'mem' ? 0 : days * W.day + tf * W.tf) + (k === 'days' ? 0 : mem * W.mem) + e.p), days, tf, mem, tsm: e.tsm, bonus: e.p };
  }
  for (const [mid, e] of Object.entries(extra)) if (!out[mid]) out[mid] = { p: Math.max(0, e.p), days: 0, tf: 0, mem: 0, tsm: e.tsm, bonus: e.p };
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
    const cfg = cfgOf(c), t = day(), [wa, wb] = weekOf(t), ch = cfg.challenge, mode = cfg.round === 'month' ? 'month' : 'week';
    const R = roundOf(t, mode), P = before(R, mode), PP = before(P, mode);
    const lo = [wa, R[0], PP[0], ch ? ch.a : wa].sort()[0], from = addD(lo, -60), rows = await db.days(id, from), bon = await db.bonuses(id, lo);
    const pts = (a, b, k = 'all') => points(rows.map(r => ({ ...r })), a, b, k, cfg, bon);
    const v = { id, name: c.name, owner: c.owner, cfg, today: t, members: ms.map(m => ({ mid: m.mid, name: m.name, stat: JSON.parse(m.stat || '{}'), at: m.at })) };
    v.week = { a: wa, b: wb, pts: pts(wa, wb) };
    v.round = { a: R[0], b: R[1], mode, pts: pts(R[0], R[1]) };
    v.prev = { a: P[0], b: P[1], pts: pts(P[0], P[1]) };
    if (ch) v.challenge = { ...ch, pts: pts(ch.a, ch.b, ch.k) };
    v.recent = bon.filter(x => x.day >= R[0]).sort((x, y) => y.at - x.at).slice(0, 20).map(x => ({ mid: x.mid, day: x.day, pts: x.pts, kind: x.kind, why: x.why, grade: x.grade }));
    // the record of rounds: when a round has ended, its winner and its most improved are kept once
    const hist = cfg.hist || [];
    if (!hist.some(h => h.a === P[0]) && rows.some(r => r.day >= P[0] && r.day <= P[1])) {
      const name = mid => (ms.find(x => x.mid === mid) || {}).name || '';
      const pp = v.prev.pts, ppp = pts(PP[0], PP[1]);
      const w = Object.entries(pp).filter(([, x]) => x.p > 0).sort((x, y) => y[1].p - x[1].p)[0];
      const im = Object.entries(pp).map(([mid, x]) => [mid, x.p - ((ppp[mid] || {}).p || 0)]).filter(([, d]) => d > 0).sort((x, y) => y[1] - x[1])[0];
      hist.unshift({ a: P[0], b: P[1], w: w ? [w[0], name(w[0]), w[1].p] : null, im: im && (!w || im[0] !== w[0]) ? [im[0], name(im[0]), im[1]] : null });
      cfg.hist = hist.slice(0, 26); await db.setCfg(id, JSON.stringify(cfg)); v.cfg = cfg;
    }
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
  if (action === 'me') {
    // the reminder belongs to this member's push subscriptions; with none yet there is nothing to keep
    const own = await db.subTh(b.mid); if (!own) return { ok: true }; if (own !== th) throw new E(403, 'member');
    const rem = Number.isInteger(b.rem) && b.rem >= -1 && b.rem <= 23 ? b.rem : 20, left = Number.isInteger(b.left) ? Math.max(-1, Math.min(99, b.left)) : -1;
    await db.setMe(b.mid, isDay(b.day) ? b.day : day(), left, rem); return { ok: true };
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
    if ('track' in n) {
      const t = n.track || {};
      if (t.m === 'one' && isKey(t.k)) cfg.track = { m: 'one', k: t.k };
      else if (t.m === 'each') cfg.track = { m: 'each', a: (cfg.track && cfg.track.a) || {} };
      else delete cfg.track;
    }
    if (n.assign && cfg.track && cfg.track.m === 'each') { const x = n.assign; if (!hex.test(x.mid || '') || !(await db.member(id, x.mid))) throw new E(400, 'assign');
      if (isKey(x.key)) cfg.track.a[x.mid] = x.key; else delete cfg.track.a[x.mid] }
    if (n.pts) { const p = {}; for (const k in PTS) { const x = Math.round(+n.pts[k]); p[k] = x >= 0 && x <= 50 ? x : PTS[k] } cfg.pts = p }
    if ('round' in n) { if (n.round === 'month') cfg.round = 'month'; else delete cfg.round }
    if ('admins' in n) {
      if (c.owner !== b.mid) throw new E(403, 'owner');
      const ms = new Set((await db.members(id)).map(x => x.mid));
      cfg.admins = (Array.isArray(n.admins) ? n.admins : []).filter(x => hex.test(x) && ms.has(x) && x !== c.owner).slice(0, 5);
      if (!cfg.admins.length) delete cfg.admins;
    }
    await db.setCfg(id, JSON.stringify(cfg)); return { ok: true };
  }
  if (action === 'bonus') {
    const c = await db.circle(id), cfg = cfgOf(c); if (!admin(c)) throw new E(403, 'owner');
    if (!hex.test(b.to || '') || !await db.member(id, b.to)) throw new E(400, 'bonus');
    let pts, kind = b.kind === 'tsm' ? 'tsm' : 'man', grade = null;
    if (kind === 'tsm') { grade = GRADE[b.grade] ? b.grade : 'a'; pts = Math.round(ptsOf(cfg).tsm * GRADE[grade]) }
    else { pts = Math.round(+b.pts); if (!(pts >= -50 && pts <= 50) || !pts) throw new E(400, 'bonus') }
    await db.addBonus(id, b.to, day(), pts, kind, grade, clean(b.why, 40), m.name, now);
    if (notify && kind === 'tsm') await notify(b.to, { t: c.name, b: m.name + ' سجّل تسميعك ✓ (+' + pts + ')', u: 'home.html' });
    return { ok: true, pts };
  }
  if (action === 'pick') {
    const c = await db.circle(id), cfg = cfgOf(c);
    if (!cfg.track || cfg.track.m !== 'each') throw new E(409, 'track');
    if (isKey(b.key)) cfg.track.a[b.mid] = b.key; else delete cfg.track.a[b.mid];
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
    setMe: (mid, d, left, rem) => run('UPDATE subs SET day=?,left=?,rem=? WHERE mid=?', d, left, rem, mid),
    // the devices to remind at this hour: the ward not opened today, or opened with tasks left
    dueSubs: async (hour, d) => (await D.prepare('SELECT ep,p256dh,auth,mid,day,left FROM subs WHERE COALESCE(rem,20)=? AND (day IS NULL OR day<>? OR left>0)').bind(hour, d).all()).results,
    setCfg: (id, cfg) => run('UPDATE circles SET cfg=? WHERE id=?', cfg, id),
    addBonus: (cid, mid, d, pts, kind, grade, why, by, at) => run('INSERT INTO bonus(cid,mid,day,pts,kind,grade,why,byname,at) VALUES(?,?,?,?,?,?,?,?,?)', cid, mid, d, pts, kind, grade, why, by, at),
    bonuses: async (cid, from) => (await D.prepare('SELECT mid,day,pts,kind,grade,why,at FROM bonus WHERE cid=? AND day>=?').bind(cid, from).all()).results,
    // one row a member a day; the ward and the tafsir stay done once done that day
    putDay: (cid, mid, r) => run('INSERT INTO days(cid,mid,day,done,tf,mem,bk) VALUES(?,?,?,?,?,?,?) ON CONFLICT(cid,mid,day) DO UPDATE SET done=MAX(done,excluded.done),tf=MAX(tf,excluded.tf),mem=excluded.mem,bk=excluded.bk', cid, mid, r.d, r.done, r.tf, r.mem, r.bk),
    days: async (cid, from) => (await D.prepare('SELECT mid,day,done,tf,mem,bk FROM days WHERE cid=? AND day>=?').bind(cid, from).all()).results,
    newCircle: (id, name, owner, at) => run('INSERT INTO circles(id,name,owner,created) VALUES(?,?,?,?)', id, name, owner, at),
    renameCircle: (id, name) => run('UPDATE circles SET name=? WHERE id=?', name, id),
    setOwner: (id, mid) => run('UPDATE circles SET owner=? WHERE id=?', mid, id),
    delCircle: async id => { await run('DELETE FROM cheers WHERE cid=?', id); await run('DELETE FROM days WHERE cid=?', id); await run('DELETE FROM bonus WHERE cid=?', id); await run('DELETE FROM circles WHERE id=?', id) },
    member: (cid, mid) => one('SELECT * FROM members WHERE cid=? AND mid=?', cid, mid),
    members: async cid => (await D.prepare('SELECT * FROM members WHERE cid=? ORDER BY joined').bind(cid).all()).results,
    count: async cid => (await one('SELECT COUNT(*) n FROM members WHERE cid=?', cid)).n,
    putMember: (cid, mid, th, name, stat, at) => run('INSERT INTO members(cid,mid,th,name,stat,at,joined) VALUES(?,?,?,?,?,?,?)', cid, mid, th, name, stat, at, at),
    updateMember: (cid, mid, name, stat, at) => run('UPDATE members SET name=?,stat=?,at=? WHERE cid=? AND mid=?', name, stat, at, cid, mid),
    delMember: async (cid, mid) => { await run('DELETE FROM members WHERE cid=? AND mid=?', cid, mid); await run('DELETE FROM days WHERE cid=? AND mid=?', cid, mid); await run('DELETE FROM bonus WHERE cid=? AND mid=?', cid, mid); await run('DELETE FROM cheers WHERE cid=? AND (tomid=? OR frommid=?)', cid, mid, mid) },
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
  const C = new Map(), M = new Map(), H = [], S = new Map(), DY = new Map(), BN = [];
  const k = (c, m) => c + '|' + m;
  return {
    circle: async id => C.get(id) || null,
    setMe: async (mid, d, left, rem) => { for (const x of S.values()) if (x.mid === mid) Object.assign(x, { day: d, left, rem }) },
    dueSubs: async (hour, d) => [...S.values()].filter(x => (x.rem ?? 20) === hour && (!x.day || x.day !== d || x.left > 0)),
    setCfg: async (id, cfg) => { C.get(id).cfg = cfg },
    addBonus: async (cid, mid, day, pts, kind, grade, why, byname, at) => { BN.push({ cid, mid, day, pts, kind, grade, why, byname, at }) },
    bonuses: async (cid, from) => BN.filter(x => x.cid === cid && x.day >= from),
    putDay: async (cid, mid, r) => { const kk = cid + '|' + mid + '|' + r.d, o = DY.get(kk); DY.set(kk, { cid, mid, day: r.d, done: Math.max(r.done, o ? o.done : 0), tf: Math.max(r.tf, o ? o.tf : 0), mem: r.mem, bk: r.bk }) },
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

// the daily reminder, run every hour by the worker's cron: one push to each device due at this hour (Amman time)
export async function remind(db, send) {
  const now = new Date(Date.now() + 3 * 36e5), hour = now.getUTCHours(), d = now.toISOString().slice(0, 10);
  for (const s of await db.dueSubs(hour, d)) {
    const msg = { t: 'حفظ المتون', b: s.day === d && s.left > 0 ? 'باقي عليك ' + (s.left === 1 ? 'مهمة وحدة' : s.left === 2 ? 'مهمتين' : String(s.left).replace(/\d/g, x => '٠١٢٣٤٥٦٧٨٩'[x]) + ' مهام') + ' من ورد اليوم 🤍' : 'ورد اليوم بانتظارك 🤍', u: 'home.html' };
    try { const st = await send(s, msg); if (st === 404 || st === 410) await db.delSub(s.ep) } catch (e) { }
  }
}
export async function pushTo(db, mid, msg, send) {
  for (const s of await db.subs(mid)) { try { const st = await send(s, msg); if (st === 404 || st === 410) await db.delSub(s.ep) } catch (e) { } }
}
