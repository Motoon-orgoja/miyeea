// Downloads the two Shamela editions used for «نور الإيضاح» into tools/texts/raw/nuridah/<book>.json
// (one entry per page: {id, num, html} where html is the inner «nass» block as served).
// 12117 = نور الإيضاح ونجاة الأرواح، ت. محمد أنيس مهرات (المكتبة العصرية)
// 412   = مراقي الفلاح شرح متن نور الإيضاح، اعتنى به نعيم زرزور (المكتبة العصرية ١٤٢٥هـ) — المتن مطبوع أعلى الصفحة
// usage: node tools/texts/nuridah-fetch.js 12117 412
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
  if (r.statusCode >= 300) { r.resume(); return ok(null); }
  const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8')));
}).on('error', no));
(async () => {
  for (const book of process.argv.slice(2)) {
    const out = [];
    for (let p = 1; ; p++) {
      const d = await get(`https://shamela.ws/book/${book}/${p}`);
      if (!d || !d.includes('class="nass')) break;
      const i = d.indexOf('class="nass');
      const num = (d.slice(i, i + 200).match(/data-page-num="([^"]*)"/) || [])[1];
      const html = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
      out.push({ id: p, num, html });
      if (p % 25 === 0) console.log(book, p);
    }
    fs.writeFileSync(path.join(__dirname, 'raw/nuridah', book + '.json'), JSON.stringify(out, null, 1));
    console.log(book, 'pages', out.length);
  }
})().catch(e => { console.error(e); process.exit(1); });
