// usage: node extract.js <dir> <from> <to> -> prints page text (nass) per page, one <p> per line
const fs = require('fs');
const [dir, a, b] = process.argv.slice(2);
for (let p = +a; p <= +b; p++) {
  const f = dir + '/' + p + '.html'; if (!fs.existsSync(f)) continue;
  const d = fs.readFileSync(f, 'utf8'); const i = d.indexOf('class="nass'); if (i < 0) continue;
  const t = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  console.log('=== page ' + p);
  for (const x of t.split(/<p[ >]/).map(b => b.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().replace(/\s*<div$/, '')).filter(Boolean)) console.log(x);
}
