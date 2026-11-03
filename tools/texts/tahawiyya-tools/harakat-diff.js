// Lists words that are identical in letters but differ in vocalization between two vocalized witnesses.
// Ignores sukun, the place of tanween fath (ـاً / ـًا), and hamzat-wasl marks.
// usage: node harakat-diff.js <a.txt> <b.txt>
const fs = require('fs');
const [af, bf] = process.argv.slice(2);
const letters = w => w.replace(/[ً-ْٰـ‌‍]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/[^ء-ي]/g, '');
const voc = w => w.normalize('NFC').replace(/[^ء-ْٰ]/g, '').replace(/[ً-ْٰ]+/g, m => [...m].sort().join('')).replace(/ْ/g, '').replace(/اً/g, 'ًا').replace(/ٱ/g, 'ا');
const toks = s => s.replace(/^\d+\t/gm, ' ').split(/\s+/).map(w => ({ w, l: letters(w), v: voc(w) })).filter(x => x.l);
const A = toks(fs.readFileSync(af, 'utf8')), B = toks(fs.readFileSync(bf, 'utf8'));
const n = A.length, m = B.length, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i].l === B[j].l ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
let i = 0, j = 0;
const hasH = v => /[ً-ِ]/.test(v);
while (i < n && j < m) {
  if (A[i].l === B[j].l) {
    const a = A[i].v, b = B[j].v;
    // compare only when both carry harakat and differ after stripping nothing
    if (a !== b && hasH(b)) console.log(`${A.slice(Math.max(0, i - 2), i).map(x => x.w).join(' ')} [${A[i].w}] vs [${B[j].w}]${hasH(a) ? '' : '  (A unvocalized)'}`);
    i++; j++;
  } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
}
