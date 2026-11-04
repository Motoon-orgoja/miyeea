// usage: node get.js <url> <outfile>  — saves raw page as downloaded
const https = require('https'), fs = require('fs');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return ok(get(new URL(r.headers.location, u).href));
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b)));
}).on('error', no));
get(process.argv[2]).then(b => { fs.writeFileSync(process.argv[3], b); console.log(b.length); });
