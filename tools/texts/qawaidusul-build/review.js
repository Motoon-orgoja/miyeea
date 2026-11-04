// Prints the substantive hunks of a collation TSV (not spacing-only, not «فصل»), with the base edition's footnotes
// on that page that mention the hunk's words — the apparatus says which manuscripts read what.
// usage: node review.js <tsv> <rakaiz raw dir> > out/review.txt
const fs = require('fs'), { norm } = require('../umdafiqh-build/align.js'), { pages } = require('../akhsar-build/shamela-pages.js');
const [tsv, dir] = process.argv.slice(2);
const H = {}; for (const p of pages(dir, 1, 400)) H[p.page] = (H[p.page] || '') + '\n' + p.hamesh;
const j = s => s.split(' ').map(norm).join('');
const L = fs.readFileSync(tsv, 'utf8').trim().split('\n').slice(1).map(l => l.split('\t'));
let n = 0;
for (const [k, page, a, b, ctx] of L) {
  if (j(a) === j(b) || /^(فصل|والله اعلم فصل|والله اعلم)$/.test(a.split(' ').map(norm).join(' '))) continue;
  n++;
  const keys = (a + ' ' + b).split(' ').map(norm).filter(w => w.length > 2);
  const notes = (H[page] || '').split('\n').filter(l => l.trim() && keys.some(w => l.split(/\s+/).map(norm).includes(w)));
  console.log(`#${k} ص${page}  BASE[${a}]  OTHER[${b}]\n    ${ctx}` + (notes.length ? '\n    ⟶ ' + notes.join('\n    ⟶ ').slice(0, 400) : ''));
}
console.error('substantive', n);
