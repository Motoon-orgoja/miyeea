// Downloads the Quran text (Uthmani, quran.com) and the tafsirs into tools/texts/raw/tafsir/ (gitignored), resumable.
//   quran.com API v4: <id>/<surah>.json for the tafsirs it has; api.quran-tafseer.com for al-Jalalayn (one request per ayah).
// usage: node tools/tafsir-fetch.js [ids…]   (default: all)
const fs = require('fs'), path = require('path'), https = require('https'), http = require('http');
const R = path.join(__dirname, 'texts/raw/tafsir'); fs.mkdirSync(R, { recursive: true });
const QC = [16, 91, 14, 94, 93, 90, 15]; // muyassar, sa'di, ibn kathir, baghawi, wasit, qurtubi, tabari
const get = (url, tries = 5) => new Promise((ok, no) => (url.startsWith('https') ? https : http).get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (motoon app build)' } }, r => {
  let s = ''; r.setEncoding('utf8'); r.on('data', d => s += d); r.on('end', () => r.statusCode === 200 ? ok(s) : no(new Error(r.statusCode + ' ' + url)));
}).on('error', no)).catch(e => tries > 1 ? new Promise(w => setTimeout(w, 2000)).then(() => get(url, tries - 1)) : Promise.reject(e));
const want = process.argv.slice(2).map(Number);
(async () => {
  const qf = path.join(R, 'quran.json');
  if (!fs.existsSync(qf)) fs.writeFileSync(qf, await get('https://api.quran.com/api/v4/quran/verses/uthmani'));
  const counts = JSON.parse(await get('https://api.quran.com/api/v4/chapters?language=ar')).chapters.map(c => c.verses_count);
  fs.writeFileSync(path.join(R, 'chapters.json'), JSON.stringify(counts));
  for (const id of QC.filter(i => !want.length || want.includes(i))) {
    const d = path.join(R, String(id)); fs.mkdirSync(d, { recursive: true });
    for (let s = 1; s <= 114; s++) { const f = path.join(d, s + '.json'); if (fs.existsSync(f)) continue;
      fs.writeFileSync(f, await get(`https://api.quran.com/api/v4/tafsirs/${id}/by_chapter/${s}?per_page=300`)); }
    console.log('tafsir', id, 'done');
  }
  if (!want.length || want.includes(2)) { // al-Jalalayn
    const d = path.join(R, 'jalalayn'); fs.mkdirSync(d, { recursive: true });
    for (let s = 1; s <= 114; s++) { const f = path.join(d, s + '.json'); if (fs.existsSync(f)) continue; const out = [];
      for (let a = 1; a <= counts[s - 1]; a += 8) out.push(...await Promise.all(Array.from({ length: Math.min(8, counts[s - 1] - a + 1) }, (_, k) => get(`http://api.quran-tafseer.com/tafseer/2/${s}/${a + k}`).then(x => JSON.parse(x).text))));
      fs.writeFileSync(f, JSON.stringify(out)); }
    console.log('jalalayn done');
  }
})().catch(e => { console.error(e.message); process.exit(1) });
