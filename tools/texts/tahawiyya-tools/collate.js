// Word-by-word collation of two witnesses (LCS on normalized words), with a third witness consulted per hunk.
// usage: node collate.js <base.txt> <check.txt> <third.txt> [skipLinesRegex]
const fs = require('fs');
const [bf, cf, tf] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ْٰـ‌‍]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء$/, '').replace(/[^ء-ي]/g, '');
const words = s => s.replace(/^[٠-٩0-9]+\s*-\s*/gm, ' ').replace(/\([٠-٩0-9]+\)/g, ' ').split(/\s+/).map(w => [w, norm(w)]).filter(x => x[1]);
// joins «و» written apart
const fix = arr => { const o = []; for (const x of arr) { if (o.length && o[o.length - 1][1] === 'و') { const p = o.pop(); o.push([p[0] + x[0], 'و' + x[1]]); } else o.push(x); } return o; };
const B = fix(words(fs.readFileSync(bf, 'utf8'))), C = fix(words(fs.readFileSync(cf, 'utf8')));
const T = fix(words(fs.readFileSync(tf, 'utf8').replace(/^\d+\t/gm, ' '))).map(x => x[1]).join(' ');
const n = B.length, m = C.length;
const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
  L[i][j] = B[i][1] === C[j][1] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
let i = 0, j = 0, hunks = [];
while (i < n || j < m) {
  if (i < n && j < m && B[i][1] === C[j][1]) { i++; j++; continue; }
  const h = { bi: i, cj: j, b: [], c: [] };
  while ((i < n || j < m) && !(i < n && j < m && B[i][1] === C[j][1])) {
    if (j >= m || (i < n && L[i + 1][j] >= L[i][j + 1])) h.b.push(B[i++]); else h.c.push(C[j++]);
  }
  hunks.push(h);
}
const ctx = (k, len) => B.slice(Math.max(0, k - 3), k).map(x => x[0]).join(' ');
let k = 0;
for (const h of hunks) {
  const pre = B.slice(Math.max(0, h.bi - 2), h.bi).map(x => x[1]), post = B.slice(h.bi + h.b.length, h.bi + h.b.length + 2).map(x => x[1]);
  const probe = a => [...pre, ...a.map(x => x[1]), ...post].join(' ');
  const inT = s => T.includes(s);
  const tb = inT(probe(h.b)), tc = inT(probe(h.c));
  console.log(`#${++k} [${ctx(h.bi)}] BASE: «${h.b.map(x => x[0]).join(' ')}» | CHECK: «${h.c.map(x => x[0]).join(' ')}» | third: ${tb ? 'BASE' : tc ? 'CHECK' : '-'}`);
}
console.error('base words', n, 'check words', m, 'hunks', hunks.length);
