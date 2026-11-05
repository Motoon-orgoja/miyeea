// Converts Quranpedia's official dumps (https://api.quranpedia.net/dumps/<name>.json.gz, saved in tools/texts/raw/tafsir/qp/:
// a tafsir book as <id>.json.gz, or a specialized one under its own name: asbab-book-…, e3rab-book-…, nasekh-book-…)
// into tools/texts/raw/tafsir/qp-<name>/<s>.json: per sura, one string per ayah ("" when the book has nothing there, or
// explains it with an earlier one), the same shape tools/tafsir-fetch-app.js writes. usage: node tools/tafsir-qp.js <name…>
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const R = path.join(__dirname, 'texts/raw/tafsir'), counts = JSON.parse(fs.readFileSync(path.join(R, 'chapters.json'), 'utf8'));
const num = s => +s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
for (const id of process.argv.slice(2)) {
  const J = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(R, 'qp', id + '.json.gz'))).toString());
  const S = counts.map(n => Array(n).fill(''));
  for (const a of J.ayahs) {
    let t = a.content.map(c => c.text || '').join('\n');
    if (!/^\d+$/.test(id)) {
      // a specialized book's entry opens with the sura's name when it is the sura's first («سُورَةُ البَقَرَة<br />…»)
      t = t.replace(/^\s*سُ?و?رَ?ةُ? ?[^<\n]{1,25}(<br \/>|<p[^>]*>[^<]*<\/p>|\n|$)/, '');
      // «قال اللَّه تعالى: (… (٩٧) … (١٠٣)» quotes the passage the entry is about: it covers those ayat too
      const q = /^[\s\S]{0,200}?قال الل[^ ]{0,4}ه تعالى: \(([\s\S]*?)<br/.exec(t);
      if (q) { const end = Math.max(0, ...[...q[1].matchAll(/\(([٠-٩]+)\)/g)].map(m => num(m[1])));
        for (let k = a.ayah; k < Math.min(end, counts[a.surah - 1]); k++) if (!S[a.surah - 1][k]) S[a.surah - 1][k] = t }
    }
    S[a.surah - 1][a.ayah - 1] = t;
  }
  const d = path.join(R, 'qp-' + id); fs.mkdirSync(d, { recursive: true });
  S.forEach((x, i) => fs.writeFileSync(path.join(d, (i + 1) + '.json'), JSON.stringify(x)));
  console.log(id, J.book.name, '·', J.ayahs.length, 'entries · version', J.license.version);
}
