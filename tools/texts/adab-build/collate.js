// Verse-by-verse, word-by-word collation of base.txt (Ajami ed., Shamela 54) with the verses quoted in غذاء الألباب (saffarini-verses.txt).
// Normalization: harakat/tatweel removed, أإآٱ→ا, ى→ي, ة→ه, punctuation dropped; a word split across the hemistichs is joined.
// usage: node collate.js <base.txt> <witness.txt> <out.txt>
const fs = require('fs');
const [bf, wf, of] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'ؤ').replace(/[^ء-ي]/g, '');
const toks = l => l.replace(/ـ\s*\|\s*ـ?/g, '').replace(/\s*\|\s*ـ/g, '').replace(/\|/g, ' ').split(/\s+/).map(w => ({ raw: w, n: norm(w) })).filter(x => x.n);
const lcs = (A, B, eq) => {
  const n = A.length, m = B.length, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = eq(A[i], B[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const pairs = []; let i = 0, j = 0;
  while (i < n && j < m) { if (eq(A[i], B[j])) { pairs.push([i, j]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return pairs;
};
const base = fs.readFileSync(bf, 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('##'));
const wit = fs.readFileSync(wf, 'utf8').split('\n').filter(l => l.trim());
const BT = base.map(toks), WT = wit.map(toks);
const score = (a, b) => lcs(a, b, (x, y) => x.n === y.n).length;
const sim = (i, j) => { const c = score(BT[i], WT[j]); return c >= Math.max(BT[i].length, WT[j].length) * 0.6; };
// best match anywhere (the witness orders many verses differently); keep a pair if ≥60% of the words agree
const vp = [];
for (let i = 0; i < BT.length; i++) {
  let best = -1, bs = 0;
  const set = new Set(BT[i].map(t => t.n));
  for (let j = 0; j < WT.length; j++) {
    let quick = 0; for (const t of WT[j]) if (set.has(t.n)) quick++;
    if (quick < Math.max(BT[i].length, WT[j].length) * 0.6) continue;
    const sc = score(BT[i], WT[j]); if (sc > bs) { bs = sc; best = j; }
  }
  if (best >= 0 && bs >= Math.max(BT[i].length, WT[best].length) * 0.6) vp.push([i, best]);
}
const out = []; let same = 0, diff = 0;
const paired = new Set(vp.map(p => p[0]));
for (const [i, j] of vp) {
  const A = BT[i], B = WT[j];
  const wp = lcs(A, B, (x, y) => x.n === y.n);
  if (wp.length === A.length && A.length === B.length) { same++; continue; }
  diff++;
  // hunks
  let ai = 0, bj = 0, hs = [];
  for (const [x, y] of wp.concat([[A.length, B.length]])) {
    if (x > ai || y > bj) hs.push('[' + A.slice(ai, x).map(t => t.raw).join(' ') + '] ⇐⇒ [' + B.slice(bj, y).map(t => t.raw).join(' ') + ']');
    ai = x + 1; bj = y + 1;
  }
  out.push((i + 1) + '\t' + hs.join(' ; ') + '\n\tB: ' + base[i] + '\n\tW: ' + wit[j]);
}
const unp = base.map((_, i) => i + 1).filter(i => !paired.has(i - 1));
out.unshift(`base ${base.length} witness lines ${wit.length} paired ${vp.length} identical ${same} differing ${diff}; unpaired base verses (${unp.length}): ${unp.join(',')}`);
fs.writeFileSync(of, out.join('\n') + '\n');
console.log(out[0]);
