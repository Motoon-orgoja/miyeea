// Extracts the matn words quoted in «الروض المربع» ط ركائز (raw/zad/shamela147658/<page>.html): the matn is the text between
// parentheses in the page body (the commentary sits outside them). Footnotes (<p class="hamesh">) and footnote marks «(١)» are dropped,
// pages are joined in order so a parenthesis may run across pages. Output: out/rawd.txt — one matn segment per line, «#PAGE n» markers.
// usage: node extract-rawd.js [from page id] [to page id]
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '../raw/zad/shamela147658');
const ids = fs.readdirSync(dir).map(f => parseInt(f)).filter(n => n).sort((a, b) => a - b);
const from = +(process.argv[2] || 1), to = +(process.argv[3] || 1e9);
const out = []; let depth = 0, seg = [];
for (const id of ids) {
  if (id < from || id > to) continue;
  let h = fs.readFileSync(path.join(dir, id + '.html'), 'utf8');
  h = h.replace(/<hr>[\s\S]*$/, '').replace(/<p class="hamesh">[\s\S]*?<\/p>/g, '');
  let t = h.replace(/^<!--[\s\S]*?-->/, '').replace(/^[^>]*>/, '').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  t = t.replace(/\(\s*[٠-٩0-9]+\s*\)/g, ' '); // footnote marks
  out.push('#PAGE ' + id);
  const flush = () => { const s = seg.join('').replace(/s+/g, ' ').trim(); if (s) out.push(s); seg = []; };
  for (const ch of t.replace(/[ 	]+/g, ' ')) { // flat: a «(» inside an open parenthesis starts a new segment, a stray «)» is ignored
    if (ch === '(') { if (depth) flush(); depth = 1; continue; }
    if (ch === ')') { if (depth) flush(); depth = 0; continue; }
    if (depth) seg.push(ch);
  }
  if (depth) { out.push('#OPEN ' + id); } // parenthesis still open at page end (continues on next page)
}
fs.writeFileSync(path.join(__dirname, 'out/rawd.txt'), out.join('\n'));
console.log('segments', out.filter(l => !/^#/.test(l)).length);
