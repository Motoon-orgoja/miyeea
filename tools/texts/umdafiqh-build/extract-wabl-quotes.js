// Extracts the commentator's matn quotations «…» that follow «قوله» in the sharh part (below the ـــــ separator) of وبل الغمامة.
// These are a second, independent typing of the matn inside the same book (vocalized): used to catch digitization
// slips (omissions, page-break repeats) in the top-of-page matn.  usage: node extract-wabl-quotes.js > out/wabl-quotes.tsv
const J = require('../raw/umdafiqh/ko97048.json').filter(x => x.content);
const clean = h => h.replace(/<a [^>]*class="g-copy[\s\S]*?<\/a>/g, '').replace(/<a [^>]*class="g-footnote-link[\s\S]*?<\/a>/g, '')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const out = [];
for (const x of J) {
  const blocks = x.content.match(/<(p|div)[^>]*class="g-(paragraph|title)[\s\S]*?<\/\1>/g) || [];
  const sep = blocks.findIndex(b => /^ـ{5,}$/.test(clean(b)));
  if (sep < 0) continue;
  const t = blocks.slice(sep + 1).map(clean).join(' ');
  const re = /قوله:?\s*«([^»]{2,1500})»/g; let m;
  while ((m = re.exec(t))) out.push([x.id, x.page, x.part && x.part.name, m[1].trim()].join('\t'));
}
console.log(out.join('\n'));
