// Extracts the matn (top of each page, above the ـــــ separator) from وبل الغمامة (ketabonline 97048 = shamela 145206).
// usage: node extract-wabl.js > out/wabl-matn.tsv   (id \t page \t part \t kind \t text)
const J = require('../raw/umdafiqh/ko97048.json').filter(x => x.content);
const clean = h => h.replace(/<a [^>]*class="g-copy[\s\S]*?<\/a>/g, '').replace(/<a [^>]*class="g-footnote-link[\s\S]*?<\/a>/g, '')
  .replace(/<span class="g-parentheses">\s*\(\s*[0-9٠-٩]+\s*\)\s*<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const rows = [];
for (const x of J) {
  const blocks = x.content.match(/<(p|div)[^>]*class="g-(paragraph|title)[\s\S]*?<\/\1>/g) || [];
  const sep = blocks.findIndex(b => /^ـ{5,}$/.test(clean(b)));
  if (sep < 0) { rows.push([x.id, x.page, x.part && x.part.name, 'NOSEP', clean(blocks.map(clean).join(' ')).slice(0, 80)]); continue; }
  blocks.slice(0, sep).forEach(b => rows.push([x.id, x.page, x.part && x.part.name, /g-title/.test(b.slice(0, 60)) ? 'T' : 'M', clean(b)]));
}
console.log(rows.map(r => r.join('\t')).join('\n'));
