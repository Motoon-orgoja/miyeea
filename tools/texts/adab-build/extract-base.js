// Extracts the verses of منظومة الآداب from Shamela 54 (raw/adab/shamela54/p22..p99.html).
// Output: adab-build/base.txt (one verse per line «a | b», «## heading» before each section), adab-build/base-notes.txt (footnotes with verse numbers)
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..', 'raw', 'adab', 'shamela54');
const toInt = s => parseInt(s.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), 10);
const out = [], notes = [];
let n = 0, pendingHead = null, lastOnPage = [];
for (let p = 22; p <= 99; p++) {
  const d = fs.readFileSync(path.join(D, 'p' + p + '.html'), 'utf8');
  const t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  const lines = t.split(/<p[ >]|<br\s*\/?>/).map(b => b.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ').trim().replace(/\s*<div$/, '')).filter(Boolean);
  const pageVerses = {};
  for (const l of lines) {
    const m = l.match(/^([٠-٩]+)\s*-\s*(.+)$/);
    if (m) {
      const k = toInt(m[1]);
      if (k !== n + 1) throw new Error('numbering jump at page ' + p + ': expected ' + (n + 1) + ' got ' + k);
      n = k;
      let body = m[2];
      const marks = [...body.matchAll(/\(([٠-٩]+)\)/g)].map(x => x[1]);
      marks.forEach(mk => pageVerses[mk] = (pageVerses[mk] || []).concat(n));
      body = body.replace(/\s*\([٠-٩]+\)/g, '');
      const h = body.split(/\s*\.\.\.\s*/);
      if (h.length !== 2) throw new Error('verse ' + n + ' does not split: ' + body);
      if (pendingHead) { out.push('## ' + pendingHead); pendingHead = null; }
      out.push(h[0].trim() + ' | ' + h[1].trim());
      continue;
    }
    const f = l.match(/^\(([٠-٩]+)\)\s*(.+)$/);
    if (f) { notes.push('p' + p + ' v' + (pageVerses[f[1]] || ['?']).join(',') + ': ' + f[2]); continue; }
    if (/^\*+$/.test(l) || /^بِسْمِ اللَّهِ/.test(l) || /^قالَ الإمامُ/.test(l)) continue;
    if (p >= 24) pendingHead = l; else throw new Error('unexpected line p' + p + ': ' + l);
  }
}
fs.writeFileSync(path.join(__dirname, 'base.txt'), out.join('\n') + '\n');
fs.writeFileSync(path.join(__dirname, 'base-notes.txt'), notes.join('\n') + '\n');
console.log('verses', n, 'headings', out.filter(l => l.startsWith('##')).length, 'notes', notes.length);
