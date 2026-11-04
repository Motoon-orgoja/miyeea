// Places where the base (al-Zuhayri) stands alone: both check texts (al-Fahl, al-Fiqi) differ from it at the same words
// and agree with each other. usage: node threeway.js <coll-fahl.tsv> <coll-fiqi.tsv> <out tsv>
const fs = require('fs');
const [ff, qf, out] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي ]/g, '').replace(/\s+/g, ' ').trim();
const read = f => fs.readFileSync(f, 'utf8').trim().split('\n').slice(1).map(l => { const [at, no, s, e, q, o] = l.split('\t'); return { at, no, s: +s, e: +e, q: q || '', o: o || '' }; });
const F = read(ff), Q = read(qf), rows = [];
for (const f of F) {
  const q = Q.find(x => x.s === f.s && x.e === f.e && norm(x.o) === norm(f.o));
  if (q) rows.push([f.at, f.no, f.q, f.o].join('\t'));
}
fs.writeFileSync(out, 'hadith\tfahl_no\tzuhayri\tfahl=fiqi\n' + rows.join('\n') + '\n');
console.log('zuhayri alone', rows.length, 'of', F.length, 'fahl hunks;', Q.length, 'fiqi hunks');
