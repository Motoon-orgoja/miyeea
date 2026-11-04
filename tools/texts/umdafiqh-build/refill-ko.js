// Re-downloads the pages of raw/umdafiqh/ko<id>.json whose content is missing (rate-limited on the first pass).
// usage: node refill-ko.js <book id>
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, r => {
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  const f = path.join(__dirname, '../raw/umdafiqh', 'ko' + process.argv[2] + '.json'), J = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const x of J) if (!x.content) {
    for (let t = 0; t < 6; t++) {
      try { const s = await get(`https://backend.ketabonline.com/api/v2/books/${process.argv[2]}/pages/${x.id}`); const j = JSON.parse(s); const d = j.data || j;
        x.page = d.page; x.part = d.part_name || d.part || null; x.content = d.content; if (x.content !== undefined) break; }
      catch (e) { await new Promise(r => setTimeout(r, 3000)); }
    }
  }
  fs.writeFileSync(f, JSON.stringify(J, null, 1));
  console.log('missing now', J.filter(x => x.content === undefined).map(x => x.id).join(','));
})();
