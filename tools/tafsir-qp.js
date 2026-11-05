// Converts Quranpedia's official tafsir dumps (https://api.quranpedia.net/dumps/tafsir-book-<id>.json.gz, saved in
// tools/texts/raw/tafsir/qp/) into tools/texts/raw/tafsir/qp-<id>/<s>.json: per sura, one string per ayah ("" when the
// book explains it with an earlier one), the same shape tools/tafsir-fetch-app.js writes. usage: node tools/tafsir-qp.js <id…>
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const R = path.join(__dirname, 'texts/raw/tafsir'), counts = JSON.parse(fs.readFileSync(path.join(R, 'chapters.json'), 'utf8'));
for (const id of process.argv.slice(2)) {
  const J = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(R, 'qp', id + '.json.gz'))).toString());
  const S = counts.map(n => Array(n).fill(''));
  for (const a of J.ayahs) S[a.surah - 1][a.ayah - 1] = a.content.map(c => c.text || '').join('\n');
  const d = path.join(R, 'qp-' + id); fs.mkdirSync(d, { recursive: true });
  S.forEach((x, i) => fs.writeFileSync(path.join(d, (i + 1) + '.json'), JSON.stringify(x)));
  console.log(id, J.book.name, '·', J.ayahs.length, 'entries · version', J.license.version);
}
