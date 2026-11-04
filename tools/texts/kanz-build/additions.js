// Rows of the base that neither witness quotes as matn: share of the row's words aligned (=) with تبيين / البحر lemmata.
// Candidates = text rows of ≥3 words typed without any shadda/tanween in the digital copy (the signature of these additions),
// plus any row whose words are < 50% matched in both witnesses. usage: node additions.js -> out/additions.tsv
const fs = require('fs'), path = require('path'), { align, norm } = require('../umdafiqh-build/align.js');
const rows = require('./rows.js')();
const A = [], Ai = []; rows.forEach((r, ri) => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ai.push(ri); } }));
const cov = name => { const W = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', name + '-words.json'))).filter(x => norm(x.w)); const c = {};
  for (const [o, i] of align(A.map(norm), W.map(x => norm(x.w)))) if (o === '=') c[Ai[i]] = (c[Ai[i]] || 0) + 1; return c; };
const T = cov('tabyin'), B = cov('bahr'), n = {}; Ai.forEach(ri => n[ri] = (n[ri] || 0) + 1);
const out = [];
rows.forEach((r, ri) => { if (r.head || !n[ri]) return; const t = (T[ri] || 0) / n[ri], b = (B[ri] || 0) / n[ri];
  if (t < 0.5 && b < 0.5 && n[ri] >= 3) out.push([ri, 'ص' + r.page, Math.round(t * 100) + '%', Math.round(b * 100) + '%', r.text].join('\t')); });
fs.writeFileSync(path.join(__dirname, 'out/additions.tsv'), 'row\tpage\ttabyin\tbahr\ttext\n' + out.join('\n') + '\n');
console.log(out.length); console.log(out.join('\n'));
