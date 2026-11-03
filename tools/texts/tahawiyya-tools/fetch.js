// usage: node fetch.js <bookId> <firstPageId> <outDir> [maxPages]
// Saves each Shamela ajax pageContent JSON as it came, following nextId.
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  const [book, first, out, max = 2000] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  let id = +first, n = 0;
  while (id && n < +max) {
    const f = path.join(out, String(id).padStart(4, '0') + '.json');
    let s;
    if (fs.existsSync(f)) s = fs.readFileSync(f, 'utf8');
    else { s = await get(`https://shamela.ws/ajax/pageContent/${book}/${id}`); fs.writeFileSync(f, s); }
    const d = JSON.parse(s); id = d.nextId; n++;
  }
  console.log('pages', n);
})().catch(e => { console.error(e); process.exit(1); });
