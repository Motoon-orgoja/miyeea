// usage: node fetch-shamela.js <book> <from> <to> <outdir>  — saves the class="nass" part of each page as <page>.html (skips existing)
const https = require('https'), fs = require('fs'), path = require('path');
const [b, from, to, out] = process.argv.slice(2);
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => { const x = []; r.on('data', c => x.push(c)); r.on('end', () => ok(Buffer.concat(x).toString('utf8'))) }).on('error', no));
(async () => {
  const ids = []; for (let p = +from; p <= +to; p++) if (!fs.existsSync(path.join(out, p + '.html'))) ids.push(p);
  let k = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (k < ids.length) {
      const p = ids[k++]; let d = '';
      for (let t = 0; t < 5; t++) { try { d = await get(`https://shamela.ws/book/${b}/${p}`); if (d.includes('class="nass')) break; } catch (e) { } await new Promise(r => setTimeout(r, 2000)); }
      if (!d.includes('class="nass')) { console.log('fail', p); continue; }
      const title = (d.match(/<title>([^<]*)/) || [])[1] || '';
      fs.writeFileSync(path.join(out, p + '.html'), '<!-- ' + title + ' -->\n' + d.slice(d.indexOf('class="nass')).split('id="appended_pages"')[0]);
    }
  }));
  console.log('done');
})();
