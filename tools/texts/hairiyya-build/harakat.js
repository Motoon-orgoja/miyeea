// Vocalization check: for every base word, compares letter by letter with the same-skeleton word in each vocalized witness
// (barrak, hikma) and prints positions where both carry a mark and the marks differ; also base words with no mark at all.
// usage: node harakat.js [base.json]
const fs = require('fs');
const S = require('./out/sources.json');
const base = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : S.aql;
const M = /[ً-ْ]/;
const sk = w => w.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const words = s => s.replace(/[،,:؛]/g, ' ').split(/\s+/).filter(Boolean);
const sim = (a, b) => { const A = new Set(words(a).map(sk)), B = words(b).map(sk); return B.filter(w => A.has(w)).length / Math.max(A.size, B.length); };
const marks = w => { const out = []; for (const ch of w.replace(/[ٰـ]/g, '')) { if (M.test(ch)) { if (out.length) out[out.length - 1] += ch; } else out.push(''); } return out.map(m => m.split('').sort().join('')); };
let bare = [];
for (const [n, a1, a2] of base) {
  const wit = {};
  for (const w of ['barrak', 'hikma']) { let best, bs = 0; for (const v of S[w]) { const s = sim(a1 + ' ' + a2, v[1] + ' ' + v[2]); if (s > bs) { bs = s; best = v; } } wit[w] = best; }
  for (const k of [0, 1]) for (const w of words([a1, a2][k])) {
    if (!M.test(w)) bare.push(n + (k ? 'b' : 'a') + ':' + w);
    const bm = marks(w), conf = [];
    for (const x in wit) {
      const ww = words(wit[x][1 + k]).find(z => sk(z) === sk(w)); if (!ww) continue;
      const wm = marks(ww); if (wm.length !== bm.length) continue;
      if (bm.some((m, i) => m && wm[i] && m !== wm[i])) conf.push(x + ': ' + ww);
    }
    if (conf.length) console.log(`${n}${k ? 'b' : 'a'} ${w} | ${conf.join(' | ')}`);
  }
}
console.log('bare words:', bare.join('  '));
