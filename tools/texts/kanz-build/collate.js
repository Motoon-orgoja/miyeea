// Word-by-word collation of the base (out/base-rows.json, after fixes.js) with a witness (out/<name>-words.json).
// Normalization (umdafiqh-build/align.js): harakat and tatweel removed, hamza forms / alif / yaa / taa marbuta unified.
// usage: node tools/texts/kanz-build/collate.js [tabyin|bahr]
//   -> out/collate-<name>.tsv (one line per hunk) and out/align-<name>.json (base word index -> witness word, for vocalize.js)
const fs = require('fs'), path = require('path'), { align, norm } = require('../umdafiqh-build/align.js');
const name = process.argv[2] || 'tabyin', out = path.join(__dirname, 'out');
const rows = require('./rows.js')();
const A = [], Ai = [];
rows.forEach((r, ri) => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ai.push(ri); } }));
const W = JSON.parse(fs.readFileSync(path.join(out, name + '-words.json'), 'utf8')).filter(x => norm(x.w));
const a = A.map(norm), b = W.map(x => norm(x.w)), ops = align(a, b), H = [], map = {};
let cur = null, lastA = -1;
for (const [o, i, j] of ops) {
  if (o === '=') { if (cur) { H.push(cur); cur = null; } lastA = i; map[i] = W[j].w; continue; }
  if (!cur) cur = { at: o === '-' ? i : lastA + 1, A: [], B: [], wp: null };
  if (o === '-') cur.A.push(A[i]); else { cur.B.push(W[j].w); cur.wp = cur.wp || W[j].vol; }
}
if (cur) H.push(cur);
const ctx = (i, n) => A.slice(Math.max(0, i - n), i).join(' ');
const at = h => Math.min(h.at, A.length - 1);
const lines = H.map((h, k) => [k + 1, 'ص' + rows[Ai[at(h)]].page, h.wp || '', h.A.join(' '), h.B.join(' '),
  ctx(h.at, 5) + ' ⟨…⟩ ' + A.slice(h.at + h.A.length, h.at + h.A.length + 4).join(' ')].join('\t'));
fs.writeFileSync(path.join(out, 'collate-' + name + '.tsv'), 'n\tbase page\twitness page\tbase\twitness\tcontext\n' + lines.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'align-' + name + '.json'), JSON.stringify(map));
const big = H.filter(h => h.A.length > 6 || h.B.length > 6);
console.log(name, 'base words', A.length, 'witness words', W.length, 'hunks', H.length,
  'base words matched', Object.keys(map).length, 'base-only', H.reduce((s, h) => s + h.A.length, 0), 'witness-only', H.reduce((s, h) => s + h.B.length, 0), 'hunks >6 words', big.length);
