// Extracts the plain matn of نخبة الفكر from the three Shamela editions saved in raw/nukhba/
// out: raw/nukhba/_base616.txt (with footnote markers kept as {n}), _notes616.txt, _itr1565.txt, _dar5940.txt
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'raw', 'nukhba');
const nass = f => { const d = fs.readFileSync(path.join(R, f), 'utf8'); return d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0].replace(/<\/div>\s*<div\s*$/, ''); };
const clean = h => h.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<br\s*\/?>/g, '\n').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ').split('\n').map(s => s.trim()).filter(Boolean);
// base: Shamela 616 (ت القاسم), pages 46–73
let base = [], notes = [];
for (let p = 46; p <= 73; p++) {
  const h = nass('s616_' + p + '.html');
  const [main, ham] = h.split(/<hr>/);
  const m = main.replace(/<span class="c2">\(([٠-٩]+)\)<\/span>/g, '{$1}');
  base.push('@' + p, ...clean(m));
  if (ham) notes.push('@' + p, ...clean(ham));
}
fs.writeFileSync(path.join(R, '_base616.txt'), base.join('\n') + '\n');
fs.writeFileSync(path.join(R, '_notes616.txt'), notes.join('\n') + '\n');
// check 1: Shamela 1565 (نزهة النظر ت عتر), matn printed separately at pp. 146–151
let itr = [];
for (let p = 146; p <= 151; p++) itr.push(...clean(nass('s1565_' + p + '.html')).map(s => s.replace(/\s*\([٠-٩]+\)/g, '')));
fs.writeFileSync(path.join(R, '_itr1565.txt'), itr.join('\n') + '\n');
// check 2: Shamela 5940 (ط دار الحديث), pp. 2–18; [..] are commentary insertions → removed
let dar = [];
for (let p = 2; p <= 18; p++) {
  const h = nass('s5940_' + p + '.html').split(/<hr>/)[0];
  dar.push(...clean(h.replace(/<span class="c4">\[[\s\S]*?\]<\/span>/g, '')).map(s => s.replace(/\[[^\]]*\]/g, '')));
}
fs.writeFileSync(path.join(R, '_dar5940.txt'), dar.join('\n') + '\n');
console.log(base.length, notes.length, itr.length, dar.length);
