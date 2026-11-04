// every ﴿…﴾ in tawhid.json must be the Mushaf's imla'i words exactly (located again from scratch)
const { locate } = require('./quran.js');
const J = require('../tawhid.json');
let ok = 0, bad = 0;
for (const t of J.chapters.flatMap(c => [c.title, ...c.paras])) for (const m of t.matchAll(/﴿([^﴾]+)﴾/g)) {
  for (const part of m[1].split(' … ')) {
    const r = locate(part);
    if (r.text.normalize('NFC') === part.normalize('NFC') && r.cost === 0) ok++; else { bad++; console.log('✗', part, '\n  →', r.text, r.ref, r.cost) }
  }
}
console.log('quotes ok', ok, 'bad', bad);
