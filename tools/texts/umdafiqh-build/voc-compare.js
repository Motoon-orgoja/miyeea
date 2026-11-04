// Compares the vocalization of the top-of-page matn (W) with the commentator's own quotations (Q) word by word,
// over the words that collate.js aligned as equal. Marks are normalized (sukun on long vowels dropped, mark order sorted).
// usage: node voc-compare.js > out/voc-diff.tsv   (idx, W word, Q word, context)
const fs = require('fs');
const Wd = JSON.parse(fs.readFileSync(__dirname + '/out/align-quotes.json', 'utf8'));
// re-run the alignment pairs: collate.js only stores matched flags, so recompute matched Q word per base index
const A = Wd.A;
// rebuild Q token stream and the '=' pairs by re-running the same diff (cheap enough: reuse collate's module form)
const { execFileSync } = require('child_process');
const pairs = JSON.parse(execFileSync(process.execPath, [__dirname + '/collate.js', 'quotes', '', '--pairs'], { maxBuffer: 1 << 28 }).toString().split('\n').find(l => l.startsWith('PAIRS ')).slice(6));
const nv = w => w.replace(/[^\u0621-\u064A\u064B-\u0652]/g, '').replace(/\u064F\u0648\u0652/g, '\u064F\u0648').replace(/\u0650\u064A\u0652/g, '\u0650\u064A')
  .replace(/([\u0621-\u064A])([\u064B-\u0652]+)/g, (m, c, k) => c + [...k].sort().join(''));
const out = [];
for (const [i, q] of pairs) {
  const w = A[i][1];
  if (!/[\u064B-\u0652]/.test(q)) continue;
  if (nv(w) !== nv(q)) out.push([i, w, q, A.slice(Math.max(0, i - 4), i + 3).map(t => t[1]).join(' ')].join('\t'));
}
console.log(out.join('\n'));
console.error('compared', pairs.length, 'differ', out.length);
