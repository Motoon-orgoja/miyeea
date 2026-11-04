// usage: node fetch-pages.js <urlPrefix> <from> <to> <outDir> <filePrefix>
// saves each page's raw HTML as <outDir>/<filePrefix><n>.html
const https = require('https'), fs = require('fs'), path = require('path');
const get = (u, n = 0) => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && n < 5) return ok(get(new URL(r.headers.location, u).href, n + 1));
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  const [pre, a, b, dir, fp] = process.argv.slice(2);
  for (let p = +a; p <= +b; p++) {
    const f = path.join(dir, fp + p + '.html');
    if (fs.existsSync(f)) continue;
    fs.writeFileSync(f, await get(pre + p));
  }
})().catch(e => { console.error(e); process.exit(1); });
