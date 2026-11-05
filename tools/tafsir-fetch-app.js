// Downloads tafsirs from tafsir.app (one request per ayah, politely: 4 at a time) into tools/texts/raw/tafsir/app-<slug>/<s>.json,
// an array of the ayah texts ("" where the tafsir explains the ayah together with an earlier one). Resumable per sura.
// usage: node tools/tafsir-fetch-app.js <slug…>
const fs = require('fs'), path = require('path'), https = require('https');
const R = path.join(__dirname, 'texts/raw/tafsir'), counts = JSON.parse(fs.readFileSync(path.join(R, 'chapters.json'), 'utf8'));
const get = (url, tries = 6) => new Promise((ok, no) => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (motoon memorization app; tafsir ward)' } }, r => {
  let s = ''; r.setEncoding('utf8'); r.on('data', d => s += d); r.on('end', () => r.statusCode === 200 ? ok(s) : no(new Error(r.statusCode + ' ' + url)));
}).on('error', no)).catch(e => tries > 1 ? new Promise(w => setTimeout(w, 3000)).then(() => get(url, tries - 1)) : Promise.reject(e));
(async () => {
  for (const slug of process.argv.slice(2)) {
    const d = path.join(R, 'app-' + slug); fs.mkdirSync(d, { recursive: true });
    for (let s = 1; s <= 114; s++) {
      const f = path.join(d, s + '.json'); if (fs.existsSync(f)) continue; const out = [];
      for (let a = 1; a <= counts[s - 1]; a += 4)
        out.push(...await Promise.all(Array.from({ length: Math.min(4, counts[s - 1] - a + 1) }, (_, k) =>
          get(`https://tafsir.app/get.php?src=${slug}&s=${s}&a=${a + k}`).then(x => JSON.parse(x).data || ''))));
      fs.writeFileSync(f, JSON.stringify(out));
    }
    console.log(slug, 'done', new Date().toISOString());
  }
})().catch(e => { console.error(e.message); process.exit(1) });
