// Downloads Shamela pages raw into tools/texts/raw/safariniyya/<book>_<page>.html
// usage: node fetch.js <book> <from> <to>
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(new URL(r.headers.location, u).href).then(ok, no);
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
const [book, from, to] = process.argv.slice(2);
const dir = path.join(__dirname, '..', 'raw', 'safariniyya');
(async () => {
  for (let p = +from; p <= +to; p++) {
    const f = path.join(dir, book + '_' + p + '.html');
    if (fs.existsSync(f)) continue;
    const d = await get('https://shamela.ws/book/' + book + '/' + p);
    fs.writeFileSync(f, d); process.stdout.write(p + ' ');
  }
})();
