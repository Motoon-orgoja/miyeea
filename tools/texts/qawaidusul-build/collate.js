// Word-by-word collation of the base (out/rakaiz-rows.json, after fixes.js) with a second source's plain text.
// usage: node collate.js <second.txt> <out.tsv>    — hunks: «base words» vs «other words» with base context
const fs = require('fs'), path = require('path'), { align, norm } = require('../umdafiqh-build/align.js');
const rows = require('./rows.js')();
const A = [], Ai = []; rows.forEach((r, ri) => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ai.push(ri); } }));
const Braw = fs.readFileSync(process.argv[2], 'utf8').split(/\s+/).filter(w => norm(w));
const a = A.map(norm), b = Braw.map(norm), ops = align(a, b), H = [];
let cur = null, lastA = 0;
for (const [o, i, j] of ops) {
  if (o === '=') { if (cur) { H.push(cur); cur = null; } lastA = i; continue; }
  if (!cur) cur = { at: o === '-' ? i : lastA + 1, A: [], B: [] };
  if (o === '-') cur.A.push(A[i]); else cur.B.push(Braw[j]);
}
if (cur) H.push(cur);
const ctx = (i, n) => A.slice(Math.max(0, i - n), i).join(' ');
const out = H.map((h, k) => [k + 1, rows[Ai[Math.min(h.at, A.length - 1)]].page, h.A.join(' '), h.B.join(' '), ctx(h.at, 5) + ' ⟨…⟩ ' + A.slice(h.at + h.A.length, h.at + h.A.length + 4).join(' ')].join('\t'));
fs.writeFileSync(process.argv[3], 'n\tpage\tbase\tother\tcontext\n' + out.join('\n') + '\n');
console.log('base words', A.length, 'other words', Braw.length, 'hunks', H.length, 'base words differing', H.reduce((s, h) => s + h.A.length, 0));
