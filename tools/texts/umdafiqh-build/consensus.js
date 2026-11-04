// Three-way check of the base (وبل الغمامة) against العدة (I), عزوز (Z), العبدلي (D) using out/align-*.json from collate.js.
// A region is reported when a base word is missing in both independent copies (I and Z), or when I and Z
// insert the same words at the same place (D, a copy of the Z text, is shown for information only). Each region shows the base words and every copy's reading there.
// usage: node consensus.js > out/consensus.tsv
const fs = require('fs');
const C = ['idda', 'azzuz', 'abdali'].map(n => JSON.parse(fs.readFileSync(__dirname + '/out/align-' + n + '.json', 'utf8')));
const A = C[0].A, N = A.length;
const sup = A.map((_, i) => C.reduce((s, c) => s + c.M[i], 0));
const insAt = i => C.map(c => (c.INS[i] || []).map(x => x.split('|')));
const flag = new Array(N + 1).fill(false);
for (let i = 0; i < N; i++) if (!C[0].M[i] && !C[1].M[i]) flag[i] = true;
for (let i = 0; i <= N; i++) {
  const ins = insAt(i).slice(0, 2).map(l => l.map(x => x[0]).join(' '));
  const cnt = {}; ins.filter(Boolean).forEach(s => cnt[s] = (cnt[s] || 0) + 1);
  if (Object.values(cnt).some(v => v >= 2)) flag[i] = 'ins';
}
const rows = [];
for (let i = 0; i <= N; i++) {
  if (!flag[i]) continue;
  let j = i; while (j + 1 <= N && flag[j + 1]) j++;
  // a region covers base words i..j (word j may be an 'ins' point only); copy readings = their matched words + insertions inside
  const base = A.slice(i, j + 1).filter((_, k) => flag[i + k] === true).map(t => t[1]).join(' ');
  const read = C.map(c => { const o = []; for (let k = i; k <= j + 1 && k <= N; k++) { (c.INS[k] || []).forEach(x => { if (k <= j || k === j + 1 && false) o.push(x.split('|')[1]); }); if (k <= j && k < N && c.M[k]) o.push(A[k][1].replace(/[\u064B-\u065F\u0670]/g, '')); } return o.join(' '); });
  const ctx = A.slice(Math.max(0, i - 4), i).map(t => t[1]).join(' ');
  rows.push([A[Math.min(i, N - 1)][2], i, j, ctx, base, ...read].join('\t'));
  i = j;
}
console.log('page\tfrom\tto\tcontext\tbase\tidda\tazzuz\tabdali\n' + rows.join('\n'));
console.error('regions', rows.length);
