// usage: node select-wording.js <key> <base> <w1,w2> [<info1,...>]
// Chooses the wording by majority of three witnesses (base + w1 + w2) at every place where they differ (skeleton compare).
// All three differ -> base. Writes raw/<key>/selected.json [{w,src,si,q,br}] and raw/<key>/collation/wording-decisions.tsv
// Tie-breaker: the first info witness (A). If w1+w2 agree against the base but A reads like the base, the base is kept
// (w1 and w2 may descend from one printing). Manual overrides: raw/<key>/collation/wording-overrides.json
//   {"<base_pos>": {"take": "<witness>"} | {"text": "vocalized words"}} for places where all three differ.
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const { alignTo } = require('./align');
const [key, B, wl, il = ''] = process.argv.slice(2);
const load = k => JSON.parse(fs.readFileSync(path.join(RAW, key, k + '.stream.json'), 'utf8')).filter(x => x.w);
// a witness written «X?» abstains where it has no words at all for a base span of 3+ words (gaps in a partial witness)
const ABST = new Set(wl.split(',').filter(k => k.endsWith('?')).map(k => k.slice(0, -1)));
const S = { [B]: load(B) }; const W = wl.split(',').map(k => k.replace(/[?]$/, '')), I = il ? il.split(',') : [];
for (const k of [...W, ...I]) S[k] = load(k);
const base = S[B];
const ovf = path.join(RAW, key, 'collation', 'wording-overrides.json');
const OV = fs.existsSync(ovf) ? JSON.parse(fs.readFileSync(ovf, 'utf8')) : {};
const al = {}; for (const k of [...W, ...I]) al[k] = alignTo(base, S[k]);
const out = [], log = [];
const reading = (k, i, e) => { // indices in S[k] for base span [i,e)
  const a = al[k], r = [];
  for (let j = i; j <= e; j++) { r.push(...a.ins[j]); if (j < e && a.sub[j] >= 0) r.push(a.sub[j]); }
  return r;
};
const key2 = (k, idx) => idx.map(t => norm(S[k][t].w)).join(' ');
let i = 0;
const dirty = j => W.some(k => (j < base.length && al[k].sub[j] < 0) || al[k].ins[j].length);
while (i <= base.length) {
  if (!dirty(i)) { if (i < base.length) out.push({ ...base[i], src: B, si: i }); i++; continue; }
  let e = i; while (e < base.length && W.some(k => al[k].sub[e] < 0 || al[k].ins[e].length)) e++;
  // base span [i,e) plus insertions up to e (inclusive of ins[e])
  const rb = []; for (let j = i; j < e; j++) rb.push(j);
  const R = { [B]: rb }; for (const k of W) R[k] = reading(k, i, e);
  const keys = [B, ...W].map(k => key2(k, R[k]));
  let win = B, why = '';
  const abst = W.some(k => ABST.has(k) && !R[k].length && e - i >= 3);
  if (keys[1] === keys[2] && keys[1] !== keys[0] && !abst) win = W[0]; // the two witnesses agree against base
  if (abst) why = ' (' + [...ABST].join() + ' gap)';
  if (win !== B && I.length) { const ra = reading(I[0], i, e); if (key2(I[0], ra) === keys[0]) { win = B; why = ' (' + I[0] + ' = ' + B + ')'; } }
  const ov = OV[i];
  // take the winning tokens; prefer a vocalized witness for the tokens (W[0] if it agrees with winner)
  let take = win;
  const vocal = k => R[k].some(t => /[ً-ْ]/.test(S[k][t].w));
  if (win === W[0] && !vocal(W[0]) && keys[2] === keys[1] && vocal(W[1])) take = W[1];
  if (ov && ov.text) { for (const w of ov.text.split(' ')) out.push({ w, src: 'manual', si: -1 }); why = ' → manual'; }
  else if (ov && ov.take) { const rr = reading(ov.take, i, e); for (const t of rr) { const x = { ...S[ov.take][t], src: ov.take, si: t }; if (ov.noq && ov.noq.includes(norm(x.w))) delete x.q; out.push(x); } why = ' → ' + ov.take; } // noq: words of the witness that are not Qur'an (a gloss inside its braces)
  else for (const t of R[take]) out.push({ ...S[take][t], src: take, si: t });
  const show = k => R[k].map(t => S[k][t].w).join(' ') || '—';
  const info = I.map(k => k + ': ' + (reading(k, i, e).map(t => S[k][t].w).join(' ') || '—')).join(' ‖ ');
  const ctx = base.slice(Math.max(0, i - 3), i).map(x => x.w).join(' ');
  log.push([i, win === B ? (keys[0] !== keys[1] && keys[0] !== keys[2] && keys[1] !== keys[2] ? 'keep3 ' : 'keep ') + B + why : 'take ' + win + why, ctx, [B, ...W].map(k => k + ': ' + show(k)).join(' ‖ '), info].join('\t'));
  i = e + 1; if (e < base.length) { out.push({ ...base[e], src: B, si: e }); }
}
fs.writeFileSync(path.join(RAW, key, 'selected.json'), JSON.stringify(out));
fs.mkdirSync(path.join(RAW, key, 'collation'), { recursive: true });
fs.writeFileSync(path.join(RAW, key, 'collation', 'wording-decisions.tsv'), 'base_pos\tdecision\tcontext\treadings\tinfo\n' + log.join('\n') + '\n');
console.log('words', out.length, 'places', log.length, 'changed from base', log.filter(l => /\ttake /.test(l)).length);
