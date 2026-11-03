// Downloads pages of a ketabonline.com book (API backend.ketabonline.com/api/v2/books/<id>/pages/<page_id>)
// into tools/texts/raw/nuridah/ko<id>.json as [{id, page, content}] (content = HTML as served).
// used for 1088 = حاشية الطحطاوي على مراقي الفلاح (دار الكتب العلمية ١٤١٨هـ، ت. الخالدي): pages 773–818 (الزكاة والحج)
// usage: node tools/texts/nuridah-fetch-ko.js 1088 773 818
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, r => {
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  const [book, from, to] = process.argv.slice(2), out = [];
  for (let p = +from; p <= +to; p++) {
    const j = JSON.parse(await get(`https://backend.ketabonline.com/api/v2/books/${book}/pages/${p}`));
    out.push({ id: j.id, page: j.page, content: j.content });
  }
  fs.writeFileSync(path.join(__dirname, 'raw/nuridah', 'ko' + book + '.json'), JSON.stringify(out, null, 1));
  console.log('pages', out.length);
})().catch(e => { console.error(e); process.exit(1); });
