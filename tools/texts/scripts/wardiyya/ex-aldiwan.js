// aldiwan.net poem28334 -> raw/wardiyya/D-aldiwan.verses.txt  (div.poem-line, two <span> hemistichs)
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '../../raw/wardiyya');
const s = fs.readFileSync(path.join(R, 'aldiwan-poem28334.html'), 'utf8');
const vs = [];
for (const m of s.matchAll(/<div class="poem-line">([\s\S]*?)<\/div>/g)) {
  const sp = [...m[1].matchAll(/<span>([\s\S]*?)<\/span>/g)].map(x => x[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
  if (sp.length === 2) vs.push(sp.join(' | ')); else console.error('line', sp);
}
fs.writeFileSync(path.join(R, 'D-aldiwan.verses.txt'), vs.join('\n') + '\n'); console.log('verses', vs.length);
