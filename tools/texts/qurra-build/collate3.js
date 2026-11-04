// Third pass: compare each assembled verse with the verse lemmas that N quotes (lines «(A ... B)» and lines «A ... B»,
// and also bare lines in the commentary that look like verses). For each verse, take the most similar N line;
// when similarity ≥ 0.6 and the normalized words differ, print a word diff. Output: collation3.txt
const fs = require('fs'), path = require('path');
const norm = s => s.replace(/عبدالله/g, 'عبد الله').replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا')
  .replace(/ء/g, '').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^\u0621-\u064A ]/g, ' ').replace(/\s+/g, ' ').trim();
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'assembled.json'), 'utf8'));
const N = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'raw', 'qurra', 'ko97042.json'), 'utf8'));
const lines = [];
N.pages.forEach(p => (p.content || '').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').split('\n').forEach(l => { if (/\.\.\./.test(l)) lines.push({ pg: p.page, raw: l.trim(), w: norm(l).split(' ') }); }));
function lcs(a, b) { const d = Array(b.length + 1).fill(0); for (const x of a) { let prev = 0; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = x === b[j - 1] ? prev + 1 : Math.max(d[j], d[j - 1]); prev = t; } } return d[b.length]; }
function diff(a, b) { // word-level diff via DP table
  const n = a.length, m = b.length, T = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i][j] = a[i] === b[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
  const o = []; let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { i++; j++; continue; }
    const da = [], db = [];
    while (i < n && (j >= m || T[i + 1][j] >= T[i][j + 1]) && !(j < m && a[i] === b[j])) da.push(a[i++]);
    while (j < m && (i >= n || T[i][j + 1] > T[i + 1][j] || true) && !(i < n && a[i] === b[j])) { db.push(b[j++]); if (i < n && j < m && a[i] === b[j]) break; }
    o.push(`[${da.join(' ')} → ${db.join(' ')}]`);
  }
  return o.join(' ');
}
const out = []; let same = 0, nomatch = 0, dif = 0;
V.forEach(([a, b], i) => {
  const w = norm(a + ' ' + b).split(' ');
  let best = null, bs = 0;
  for (const L of lines) { const s = lcs(w, L.w) / Math.max(w.length, L.w.length); if (s > bs) { bs = s; best = L; } }
  if (!best || bs < 0.6) { nomatch++; return; }
  if (best.w.join(' ') === w.join(' ')) { same++; return; }
  dif++;
  out.push(`${i + 1}\t${a} | ${b}\n\tN p${best.pg}: ${best.raw}\n\t${diff(w, best.w)}`);
});
out.unshift(`verses ${V.length}: identical to an N lemma ${same}; differing ${dif}; no full lemma in N ${nomatch}`);
fs.writeFileSync(path.join(__dirname, 'collation3.txt'), out.join('\n'));
console.log(out[0]);
