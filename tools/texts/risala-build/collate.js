// Word-by-word collation of the base F (al-Fawakih) with T (al-Sanari/Tatai), M (Dar al-Fikr matn) and Th (al-Thamar al-Dani).
// Words are compared after normalize() (align.js: harakat and tatweel removed, أإآٱ→ا، ى→ي، ة→ه، ئ→ي، ؤ→و، ء dropped).
// Output out/collation.json: {F:[tokens], regions:[{a,b,F,T,M,Th}]}  — a region is a span [a,b) of F words where at least one
// witness reads differently; each witness reading is given in normalized words ('' = omits the span).
// usage: node collate.js
const fs = require('fs'), path = require('path');
const { align, norm } = require('./align');
const OUT = path.join(__dirname, 'out');
const { load } = require('./tok');
const W = { F: load('F'), T: load('T'), M: load('M'), Th: load('Th') };
const fn = W.F.map(x => x.n);
const regs = {}, cover = {};
for (const k of ['T', 'M', 'Th']) {
  const ops = align(fn, W[k].map(x => x.n)), R = [];
  let cur = null, lastA = 0;
  for (const o of ops) {
    if (o[0] === '=') { if (cur) { R.push(cur); cur = null; } lastA = o[1] + 1; continue; }
    if (!cur) cur = { a: lastA, b: lastA, w: [] };
    if (o[0] === '-') cur.b = o[1] + 1; else cur.w.push(W[k][o[2]].n);
  }
  if (cur) R.push(cur);
  // a witness that does not cover the start/end of F (M lacks the author's preface; the end of F stops before the colophon)
  // has no reading there: drop its leading/trailing region instead of counting it as an omission
  const eq = ops.filter(o => o[0] === '=');
  cover[k] = [eq[0][1], eq[eq.length - 1][1] + 1];
  regs[k] = R.filter(r => r.b > cover[k][0] && r.a < cover[k][1]);
  console.log(k, 'regions', R.length, 'F words changed', R.reduce((n, r) => n + r.b - r.a, 0), 'witness words', W[k].length);
}
// cluster overlapping / touching regions of the three witnesses
const all = [];
for (const k in regs) for (const r of regs[k]) all.push({ ...r, k });
all.sort((x, y) => x.a - y.a || x.b - y.b);
const cl = [];
for (const r of all) {
  const c = cl[cl.length - 1];
  if (c && (r.a < c.b || (r.a === c.b && (r.a === r.b || c.a === c.b)) || r.a === c.a)) { c.b = Math.max(c.b, r.b); c.rs.push(r); }
  else cl.push({ a: r.a, b: r.b, rs: [r] });
}
const reading = (c, k) => {
  if (c.a < cover[k][0] || c.b > cover[k][1]) return null; // outside this witness
  const mine = c.rs.filter(r => r.k === k), out = [];
  for (let i = c.a; i <= c.b; i++) {
    for (const r of mine) if (r.a === i) out.push(...r.w);
    if (i < c.b && !mine.some(r => i >= r.a && i < r.b)) out.push(fn[i]);
  }
  return out.join(' ');
};
const regions = cl.map(c => ({ a: c.a, b: c.b, F: fn.slice(c.a, c.b).join(' '), T: reading(c, 'T'), M: reading(c, 'M'), Th: reading(c, 'Th') }));
fs.writeFileSync(path.join(OUT, 'collation.json'), JSON.stringify({ F: W.F.map(x => ({ w: x.w, n: x.n, page: x.page })), regions }));
console.log('clusters', regions.length, 'coverage', JSON.stringify(cover), 'F words', fn.length);
