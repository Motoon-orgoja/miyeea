// usage: node get.js <url> [outfile]  — prints/saves the page (UTF-8)
const https = require('https'), fs = require('fs');
const get = (u, n = 0) => new Promise((ok, no) => https.get(encodeURI(decodeURI(u)), { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && n < 5) return ok(get(new URL(r.headers.location, u).href, n + 1));
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
module.exports = get;
if (require.main === module) get(process.argv[2]).then(s => { if (process.argv[3]) fs.writeFileSync(process.argv[3], s); else process.stdout.write(s); });
