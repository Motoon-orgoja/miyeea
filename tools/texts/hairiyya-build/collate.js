// Word-by-word collation of the base (aql) against the other witnesses, after stripping harakat/tatweel and unifying alef/yaa/taa marbuta.
// usage: node collate.js [base.json]  (default: base = out/sources.json .aql ; or a final verse array file)
const fs = require('fs'), path = require('path');
const S = require('./out/sources.json');
const H = /[ً-ْٰـ]/g;
const norm = s => s.replace(H, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[،,:؛.!?«»"]/g, ' ').replace(/\s+/g, ' ').trim();
const base = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : S.aql;
const sim = (a, b) => { const A = new Set(norm(a).split(' ')), B = norm(b).split(' '); return B.filter(w => A.has(w)).length / Math.max(A.size, B.length); };
function lcsDiff(a, b) { // returns hunks [[aWords],[bWords]]
  const n = a.length, m = b.length, L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const hunks = []; let i = 0, j = 0, cur = null;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { if (cur) { hunks.push(cur); cur = null; } i++; j++; }
    else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) { (cur = cur || [[], []])[1].push(b[j++]); }
    else { (cur = cur || [[], []])[0].push(a[i++]); }
  }
  if (cur) hunks.push(cur); return hunks;
}
const report = {};
for (const w of ['barrak', 'hikma', 'badr']) {
  const W = S[w]; report[w] = { extra: [], diffs: [] };
  const used = new Set();
  for (const [n, a1, a2] of base) {
    let best = null, bs = 0;
    for (const v of W) { const s = sim(a1 + ' ' + a2, v[1] + ' ' + v[2]); if (s > bs) { bs = s; best = v; } }
    used.add(best[0]);
    for (const k of [0, 1]) {
      const hs = lcsDiff(norm([a1, a2][k]).split(' '), norm(best[1 + k]).split(' '));
      for (const h of hs) report[w].diffs.push(`${n}${k ? 'b' : 'a'} (${w} ${best[0]}): ${h[0].join(' ') || '∅'} → ${h[1].join(' ') || '∅'}`);
    }
  }
  report[w].extra = W.filter(v => !used.has(v[0])).map(v => v[0] + ': ' + v[1] + ' … ' + v[2]);
}
for (const w in report) { console.log('==== ' + w + ' — diffs: ' + report[w].diffs.length); report[w].diffs.forEach(d => console.log('  ' + d)); console.log('  extra verses not in base:'); report[w].extra.forEach(d => console.log('   + ' + d)); }
