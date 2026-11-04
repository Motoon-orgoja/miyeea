// Parses the stand-alone edition (Shamela 6382, أضواء السلف) into the ordered list of headings and verses.
// usage: node skeleton.js  → skeleton.json
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'safariniyya');
function nass(f) {
  const d = fs.readFileSync(path.join(RAW, f), 'utf8');
  const i = d.indexOf('class="nass'); if (i < 0) return [];
  const t = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  return t.replace(/<\/p>|<br\s*\/?>/g, '\n').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(s => s && s !== '<div');
}
const lines = [];
for (let p = 1; p <= 54; p++) for (const l of nass('6382_' + p + '.html')) lines.push({ p, l });
const items = []; let buf = null;
for (const { p, l } of lines) {
  if (/^بِسم الله/.test(l)) continue;
  let body = l.replace(/^[٠-٩0-9]+\s*-\s*/, '');
  const numbered = /^[٠-٩0-9]+\s*-/.test(l);
  const isVerse = /^\(/.test(body) || buf || numbered;
  if (!isVerse) {
    if (/^(الْبَاب|فصل|مُقَدّمَة|الخاتمة|الْخَاتِمَة)/.test(l)) items.push({ h: l, p });
    else items.push({ other: l, p });
    continue;
  }
  body = (buf ? buf + ' ' : '') + body;
  if (/^\(/.test(body) && !/\)\s*$|\(\s*$/.test(body) &&!/\.\.\./.test(body)) { buf = body; continue; } // verse continues on next line/page
  buf = null;
  body = body.replace(/^\(|[()]\s*$/g, '').trim();
  items.push({ v: body.split(/\s*\.\.\.\s*/), p });
}
// the 6382 TOC at the end of the book repeats "مقدمة ..." — drop anything after the last verse
const lastV = items.map(x => !!x.v).lastIndexOf(true);
const out = items.slice(0, lastV + 1);
fs.writeFileSync(path.join(__dirname, 'skeleton.json'), JSON.stringify(out, null, 1));
console.log('verses', out.filter(x => x.v).length, 'headings', out.filter(x => x.h).length);
out.filter(x => x.other || (x.v && x.v.length !== 2)).forEach(x => console.log(JSON.stringify(x)));
