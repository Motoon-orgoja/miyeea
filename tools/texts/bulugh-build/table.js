// Table of every al-Fahl difference, with the reading of each other check text at the same place
// («=» = same as the base al-Zuhayri; «=F» = same as al-Fahl). usage: node table.js <coll-fahl.tsv> <out tsv> <name=coll.tsv>...
const fs = require('fs');
const [ff, out, ...others] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي ]/g, '').replace(/\s+/g, ' ').trim();
const read = f => fs.readFileSync(f, 'utf8').trim().split('\n').slice(1).map(l => { const [at, no, s, e, q, o] = l.split('\t'); return { at, no, s: +s, e: +e, q: q || '', o: o || '' }; });
const F = read(ff), O = others.map(x => { const [n, f] = x.split('='); return { n, H: read(f) }; });
const cnt = {};
const rows = F.map(f => {
  const cols = O.map(({ H }) => {
    const q = H.find(x => x.s <= f.s && x.e >= f.e && (x.s < x.e || x.s === f.s));
    if (!q) return '=';
    if (norm(q.o) === norm(f.o)) return '=F';
    return q.o || '—';
  });
  const z = cols.filter(c => c === '=').length, fa = cols.filter(c => c === '=F').length;
  const kind = fa > z ? 'base-minority' : fa === z ? 'tie' : 'base-majority';
  cnt[kind] = (cnt[kind] || 0) + 1;
  return [f.at, f.no.replace('F', ''), f.q || '—', f.o || '—', ...cols, kind].join('\t');
});
fs.writeFileSync(out, ['hadith(zuhayri)', 'fahl_no', 'zuhayri (المعتمد)', 'fahl', ...O.map(o => o.n), 'kind'].join('\t') + '\n' + rows.join('\n') + '\n');
console.log(cnt);
