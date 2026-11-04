// Extracts the matn quotations of شرح العمدة لابن تيمية (ط. عطاءات العلم = shamela 151, raw/umdafiqh/shamela151/<page>.html):
// the editor prints each quoted piece of the matn as <span class="c2">(…)</span>. Covers الطهارة – الحج (part) only.
// usage: node extract-taymiyya.js  -> out/taymiyya.txt (#PAGE lines + one quotation per line)
const fs = require('fs'), D = __dirname + '/../raw/umdafiqh/shamela151/';
const files = fs.readdirSync(D).map(f => +f.replace('.html', '')).sort((a, b) => a - b);
const out = [];
for (const p of files) {
  const h = fs.readFileSync(D + p + '.html', 'utf8').split('<p class="hamesh">')[0].split('<hr')[0];
  out.push('#PAGE ' + p);
  const re = /<span class="c2">\(([^<]*?)\)<\/span>/g; let m;
  while ((m = re.exec(h))) { const t = m[1].trim(); if (/[\u0621-\u064A]{2}/.test(t) && !/^[\u0660-\u0669\d\s]+$/.test(t)) out.push(t); }
}
fs.writeFileSync(__dirname + '/out/taymiyya.txt', out.join('\n') + '\n');
console.log('quotes', out.filter(l => !l.startsWith('#')).length);
