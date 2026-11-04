// Extracts every «صدر ... عجز» line from غذاء الألباب (Shamela 25791, raw/adab/shamela25791-saffarini/p1..p1059.html).
// Output adab-build/saffarini-verses.txt: «a | b» per line, plus «@ pN» page markers (ignored by compare.js / merge-harakat.js? no: merge ignores only ##, so markers are written to a side file).
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..', 'raw', 'adab', 'shamela25791-saffarini');
const out = [], pages = [];
for (let p = 1; p <= 1059; p++) {
  const f = path.join(D, 'p' + p + '.html'); if (!fs.existsSync(f)) continue;
  const d = fs.readFileSync(f, 'utf8');
  let t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  t = t.replace(/<div class=['"]?hamesh[\s\S]*$/, '');
  for (let l of t.split(/<p[ >]|<br\s*\/?>/)) {
    l = l.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ').trim();
    const h = l.split(/\s*\.\.\.\s*/);
    if (h.length !== 2 || !h[0] || !h[1]) continue;
    if (h[0].length > 90 || h[1].length > 90) continue;
    out.push(h[0].replace(/^[«"(]+|[»")]+$/g, '').trim() + ' | ' + h[1].replace(/^[«"(]+|[»")]+$/g, '').trim());
    pages.push(p);
  }
}
fs.writeFileSync(path.join(__dirname, 'saffarini-verses.txt'), out.join('\n') + '\n');
fs.writeFileSync(path.join(__dirname, 'saffarini-pages.txt'), pages.join('\n') + '\n');
console.log('lines', out.length);
