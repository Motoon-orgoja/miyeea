// Pulls one matn out of the extracted al-Qasim pages (s570.txt) as logical lines:
// a line cut by a page break (no closing punctuation) is joined to the first line of the next page.
// usage: node lines.js <s570.txt> <fromPage> <toPage> > out.txt
const fs = require('fs');
const [file, a, b] = process.argv.slice(2);
let page = 0; const out = []; let open = false;
for (const l of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^=== page (\d+)$/); if (m) { page = +m[1]; continue }
  if (page < +a || page > +b || !l.trim()) continue;
  if (open && out.length) out[out.length - 1] += ' ' + l.trim(); else out.push(l.trim());
  // a sentence/heading ends with . : ؟ ! » } or is a heading line; anything else continues on the next page
  const last = l.trim();
  open = !/[.:؟!»}\]*]$/.test(last) && !/^(القَاعِدَةُ|الأَصْلُ|\[)/.test(last) && last.length > 40;
}
console.log(out.join('\n'));
