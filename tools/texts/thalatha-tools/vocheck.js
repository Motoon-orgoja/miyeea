// Lists words (outside ﴿﴾) that carry no harakat at all, or whose last letter has no mark
// (a final letter without a vowel/sukun/tanween — except alif, waw/ya of length, ى, and ة after a mark), per file.
const fs = require('fs');
for (const key of ['qawaidarba', 'thalatha']) {
  const J = JSON.parse(fs.readFileSync(__dirname + '/../' + key + '.json', 'utf8'));
  let tot = 0; const none = {}, bare = {};
  for (const p of J.chapters.flatMap(c => c.paras)) {
    for (const w0 of p.replace(/﴿[^﴾]*﴾/g, ' ').split(/\s+/)) {
      const w = w0.replace(/[^\u0621-\u0652\u0670]/g, ''); if (!w) continue; tot++;
      if (!/[\u064B-\u0652]/.test(w)) { none[w] = (none[w] || 0) + 1; continue }
      if (/[بتثجحخدذرزسشصضطظعغفقكلمنهةء]$/.test(w)) bare[w] = (bare[w] || 0) + 1;
    }
  }
  console.log(key, 'words', tot, '\n no marks:', JSON.stringify(none), '\n bare last letter:', JSON.stringify(bare));
}
