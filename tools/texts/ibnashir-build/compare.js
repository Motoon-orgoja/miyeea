// Word-by-word comparison of two Arabic texts after normalization (harakat, tatweel, alef/yaa/taa-marbuta forms, punctuation).
// usage: node compare.js <a.txt> <b.txt> [context=3]   lines starting with @ or ## are ignored
const fs = require('fs');
const norm = w => w.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ؤ/g, 'ؤ').replace(/[^\u0621-\u064A]/g, '');
const words = f => fs.readFileSync(f, 'utf8').split('\n').filter(l => !/^(@|##)/.test(l)).join(' ').replace(/\{[٠-٩0-9]+\}/g, ' ')
  .replace(/\|/g, ' ').split(/\s+/).map(w => ({ raw: w, n: norm(w) })).filter(x => x.n);
const A = words(process.argv[2]), B = words(process.argv[3]), C = +(process.argv[4] || 3);
const n = A.length, m = B.length;
const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i].n === B[j].n ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
let i = 0, j = 0, hunks = [];
while (i < n || j < m) {
  if (i < n && j < m && A[i].n === B[j].n) { i++; j++; continue; }
  const si = i, sj = j;
  while ((i < n || j < m) && !(i < n && j < m && A[i].n === B[j].n)) { if (j >= m || (i < n && L[i + 1][j] >= L[i][j + 1])) i++; else j++; }
  hunks.push([si, i, sj, j]);
}
console.log('words', n, m, 'common', L[0][0], 'hunks', hunks.length);
for (const [a0, a1, b0, b1] of hunks) {
  const ctx = A.slice(Math.max(0, a0 - C), a0).map(x => x.raw).join(' ');
  console.log('… ' + ctx + ' [' + A.slice(a0, a1).map(x => x.raw).join(' ') + '] ⇐⇒ [' + B.slice(b0, b1).map(x => x.raw).join(' ') + '] ' + A.slice(a1, a1 + 2).map(x => x.raw).join(' '));
}
