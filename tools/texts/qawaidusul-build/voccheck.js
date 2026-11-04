// Lists words with a consonant that carries no mark (not counting: alif / alif maqsura / ta-less madd letters,
// the article's lam, a word-initial alif). usage: node voccheck.js <json|rows>
const fs = require('fs');
const src = process.argv[2];
const text = src ? JSON.parse(fs.readFileSync(src, 'utf8')).chapters.flatMap(c => [c.title, ...c.paras]).join(' ') : require('./rows.js')().map(r => r.text).join(' ');
const M = /[ً-ْٰ]/, bad = {};
let words = 0, badN = 0;
for (const w0 of text.split(/\s+/)) {
  const w = w0.replace(/[^ء-يً-ْٰ]/g, ''); if (!w) continue; words++;
  const L = []; for (const ch of w) { if (M.test(ch)) { if (L.length) L[L.length - 1].m += ch; } else L.push({ c: ch, m: '' }); }
  let miss = false;
  L.forEach((x, i) => {
    if (x.m) return;
    if (/[اىآ]/.test(x.c)) return;
    if (i === 0 && /[ا]/.test(x.c)) return;
    const prev = L[i - 1];
    if (/[وي]/.test(x.c) && prev && /[ُِ]/.test(prev.m)) return;          // madd
    if (x.c === 'ل' && prev && prev.c === 'ا' && (i === 1 || (i === 2 && /^[وفبكل]/.test(L[0].c)) || (i === 2 && L[0].c === 'ل'))) return; // article lam
    if (x.c === 'ل' && i === 1 && L[0].c === 'ل') return;                  // لِل
    if (x.c === 'ة' || x.c === 'ه' && i === L.length - 1 && false) return;
    if (x.c === 'و' && i === L.length - 1 && prev && prev.c === 'و') return; // ذَوُو
    if (x.c === 'ا') return;
    if (L[i + 1] && L[i + 1].c === 'ا' && /ً/.test(L[i + 1].m)) return;   // tanween written on the alif
    if (/^[وفبكتل]?[َِ]?الل[َّ]*ه/.test(w) && x.c === 'ل') return;            // Allah (fixed in build)
    miss = true;
  });
  if (miss) { badN++; bad[w0] = (bad[w0] || 0) + 1; }
}
console.log('words', words, 'with an unmarked consonant', badN);
console.log(Object.entries(bad).sort((a, b) => b[1] - a[1]).map(([w, n]) => w + (n > 1 ? '×' + n : '')).join(' | '));
