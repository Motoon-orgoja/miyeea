// Finds the places where the base (al-Qasim) stands alone: both check texts differ from it at the same words
// and agree with each other (same normalized replacement). usage: node threeway.js <coll-z.tsv> <coll-i.tsv> <out tsv>
const fs = require('fs');
const [zf, ifl, out] = process.argv.slice(2);
const norm = w => w.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^\u0621-\u064A ]/g, '').replace(/\s+/g, ' ').trim();
const read = f => fs.readFileSync(f, 'utf8').trim().split('\n').slice(1).map(l => { const [at, no, s, e, q, o] = l.split('\t'); return { at, no, s: +s, e: +e, q: q || '', o: o || '' }; });
const Z = read(zf), I = read(ifl), rows = [];
for (const z of Z) {
  const i = I.find(x => x.s === z.s && x.e === z.e && norm(x.o) === norm(z.o));
  if (i) rows.push([z.at, z.no, i.no, z.q, z.o].join('\t'));
}
fs.writeFileSync(out, 'hadith\tzuhayri_no\tihkam_no\tqasim\tzuhayri=ihkam\n' + rows.join('\n') + '\n');
console.log('qasim alone', rows.length, 'of', Z.length);
