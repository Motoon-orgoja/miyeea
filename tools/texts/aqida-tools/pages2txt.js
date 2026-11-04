// usage: node pages2txt.js <dir> > out.txt — concatenates Shamela ajax page JSONs into plain text, one <p> per line, page markers "=== page N"
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  let h = (d.nass || '') ;
  const foot = h.split(/<div class=['"]?hamesh/)[1] || '';
  h = h.split(/<div class=['"]?hamesh/)[0];
  const ps = h.split(/<\/p>|<br\s*\/?>/).map(p => p.replace(/<a [^>]*class="btn_tag[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()).filter(Boolean);
  console.log('=== page ' + f.replace('.json', '') + (d.pageNum ? ' (' + JSON.stringify(d.pageNum) + ')' : ''));
  ps.forEach(p => console.log(p));
  if (foot.trim()) console.log('--- foot: ' + foot.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}
