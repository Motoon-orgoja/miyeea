// Adds harakat from a vocalized filler text to a base text, verse by verse, word by word, letter by letter.
// Only where the base letter has no mark and the two words have the same letters. Never changes a base mark.
// usage: node merge-harakat.js <base.verses.txt> <filler.verses.txt> <out.verses.txt> <log.txt> [tag]
//   verses files: one verse per line «a | b» (lines starting with ## are kept as headings in base, ignored in filler)
// Verses are aligned automatically (LCS on verses sharing ≥ half of their normalized words).
const fs = require('fs');
const [baseF, fillF, outF, logF, tag = 'filler'] = process.argv.slice(2);
const MARK = /[ً-ْٰ]/;
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^ء-ي]/g, '');
const units = w => { const u = []; for (const ch of w.replace(/ـ/g, '')) { if (MARK.test(ch)) { if (u.length) u[u.length - 1].m += ch; } else u.push({ c: ch, m: '' }); } return u; };
const join = u => u.map(x => x.c + x.m).join('');
const sortM = m => [...m].sort().join('');
const lcs = (A, B, eq) => {
  const n = A.length, m = B.length, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = eq(A[i], B[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const pairs = []; let i = 0, j = 0;
  while (i < n && j < m) { if (eq(A[i], B[j])) { pairs.push([i, j]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return pairs;
};
const baseLines = fs.readFileSync(baseF, 'utf8').split('\n').filter(l => l.trim());
const fillLines = fs.readFileSync(fillF, 'utf8').split('\n').filter(l => l.trim() && !/^##/.test(l));
const bv = baseLines.map((l, i) => ({ l, i })).filter(x => !/^##/.test(x.l));
const nw = l => l.split(/\s+/).map(norm).filter(Boolean);
const sim = (a, b) => { const A = nw(a), B = nw(b); const c = lcs(A, B, (x, y) => x === y).length; return c >= Math.max(A.length, B.length) / 2; };
const vpairs = lcs(bv.map(x => x.l), fillLines, sim);
const log = []; let added = 0, conflicts = 0;
const out = baseLines.slice();
for (const [bi, fi] of vpairs) {
  const vn = bi + 1, base = bv[bi].l, fill = fillLines[fi];
  // keep the hemistich separator as its own token
  const bt = base.split(/\s+/), ft = fill.split(/\s+/);
  const wp = lcs(bt, ft, (x, y) => x !== '|' && norm(x) && norm(x) === norm(y));
  for (const [i, j] of wp) {
    const bu = units(bt[i]), fu = units(ft[j]);
    const bl = bu.map(x => x.c).join(''), fl = fu.map(x => x.c).join('');
    if (bu.length !== fu.length) { if (fu.some(x => x.m)) log.push(`skip ${vn} ${bt[i]} / ${ft[j]} (letters differ)`); continue; }
    const before = join(bu);
    for (let k = 0; k < bu.length; k++) {
      const b = bu[k], f = fu[k];
      if (!f.m) continue;
      if (!b.m) {
        if (/[اى]/.test(b.c) && !/[ً-ٍ]/.test(f.m)) continue; // never mark a bare alif / alif maqsura (except tanween)
        b.m = f.m; added++;
      } else if ([...b.m].every(c => f.m.includes(c)) && f.m.length > b.m.length && b.m === 'ّ') {
        b.m = f.m; added++; // base has only a shadda: take the filler's vowel on it
      } else if (sortM(b.m) !== sortM(f.m)) {
        conflicts++; log.push(`conflict ${vn} ${before} / ${ft[j]} (letter ${k + 1} «${b.c}»: base ${[...b.m].map(c => c.charCodeAt(0).toString(16)).join('+')} vs ${tag} ${[...f.m].map(c => c.charCodeAt(0).toString(16)).join('+')})`);
      }
    }
    const after = join(bu);
    if (after !== before) { log.push(`add ${vn} ${before} -> ${after} (${tag} ${ft[j]})`); bt[i] = after; }
    if (bl !== fl) log.push(`letters ${vn} ${bt[i]} / ${ft[j]}`);
  }
  out[bv[bi].i] = bt.join(' ');
}
const unpaired = bv.map((x, i) => i).filter(i => !vpairs.some(p => p[0] === i)).map(i => i + 1);
log.unshift(`verses base ${bv.length} filler ${fillLines.length} paired ${vpairs.length}; unpaired base verses: ${unpaired.join(',') || '-'}; marks added ${added}; conflicts ${conflicts}`);
fs.writeFileSync(outF, out.join('\n') + '\n');
fs.writeFileSync(logF, log.join('\n') + '\n');
console.log(log[0]);
