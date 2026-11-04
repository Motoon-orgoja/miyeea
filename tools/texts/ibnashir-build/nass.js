// usage: node nass.js <html files...>  -> prints the nass text of each shamela page, paragraphs on separate lines, footnotes marked
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const d = fs.readFileSync(f, 'utf8');
  let t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  t = t.replace(/<div class=['"]?hamesh[\s\S]*$/, m => '\n[[HAMESH]] ' + m);
  const out = t.split(/<p[ >]|<br\s*\/?>/).map(b => b.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ').trim()).filter(Boolean);
  console.log('@@ ' + f.replace(/.*[\/]/, '') + '\n' + out.join('\n'));
}
