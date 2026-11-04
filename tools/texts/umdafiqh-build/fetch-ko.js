// Downloads all pages of a ketabonline.com book via backend.ketabonline.com/api/v2/books/<id>/pages/<n>
// into tools/texts/raw/umdafiqh/ko<id>.json as [{id, part, page, content}] (content = HTML as served).
// usage: node fetch-ko.js <book id> <from> <to>
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, r => {
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  const [book, from, to] = process.argv.slice(2), out = [], f = path.join(__dirname, '../raw/umdafiqh', 'ko' + book + '.json');
  const ids = []; for (let p = +from; p <= +to; p++) ids.push(p);
  let k = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (k < ids.length) {
      const p = ids[k++];
      for (let t = 0; t < 5; t++) {
        try { const j = JSON.parse(await get(`https://backend.ketabonline.com/api/v2/books/${book}/pages/${p}`)); const d = j.data || j;
          out.push({ id: p, part: d.part_name || d.part || null, page: d.page, content: d.content }); break; }
        catch (e) { await new Promise(r => setTimeout(r, 2000)); }
      }
    }
  }));
  out.sort((a, b) => a.id - b.id);
  fs.writeFileSync(f, JSON.stringify(out, null, 1));
  console.log(book, 'pages', out.length, 'of', ids.length);
})().catch(e => { console.error(e); process.exit(1); });
