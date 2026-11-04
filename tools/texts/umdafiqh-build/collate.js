// Word-by-word collation of the وبل الغمامة matn (base) against a check copy.
// usage: node collate.js <idda|azzuz|abdali|quotes> [out/align-<name>.json] > out/diff-<name>.tsv
// (the optional json holds, per base word, matched 0/1 and the check-copy words inserted before it: used by consensus.js)
// Normalization: harakat, tatweel, punctuation removed; أإآٱ→ا, ى→ي, ة→ه, ئ→ي, ؤ→و, ء dropped; honorific formulas skipped.
// Alignment: unique 4-gram anchors common to both texts, longest increasing chain of anchors, Myers diff between anchors.
const fs = require('fs');
const norm = w => w.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^\u0621-\u064A]/g, '')
  .replace(/^(و|ف|ب|ل)?مايه$/, '$1ميه').replace(/^ابن$/, 'بن');
const HONOR = [['رضي', 'الله', /^عن(ه|ها|هما|هم|هن)$/], ['صلي', 'الله', 'عليه', 'وسلم'], ['عليه', 'السلام'], ['عز', 'وجل'], ['سبحانه', 'وتعالي'], ['تبارك', 'وتعالي'], ['رحمه', 'الله'], ['تعالي'], ['سبحانه']];
const toks = (s, tag) => {
  const t = s.split(/\s+/).map(w => ({ w: norm(w), o: w, tag })).filter(x => x.w), r = [];
  for (let i = 0; i < t.length; i++) {
    const h = HONOR.find(p => p.every((q, j) => t[i + j] && (q instanceof RegExp ? q.test(t[i + j].w) : t[i + j].w === q)));
    if (h) { i += h.length - 1; continue; }
    r.push(t[i]);
  }
  return r;
};
const A = [];
for (const l of fs.readFileSync(__dirname + '/out/wabl-matn.tsv', 'utf8').split('\n')) {
  const c = l.split('\t'); if (c[3] !== 'M') continue;
  A.push(...toks(c[4].replace(/(\. ?){3,}/g, ' '), 'W' + c[2] + '/' + c[1]));
}
const name = process.argv[2], B = [];
let page = '';
for (const l of fs.readFileSync(__dirname + '/out/' + name + '.txt', 'utf8').split('\n')) {
  if (/^#PAGE/.test(l)) { page = l.split(' ')[1]; continue; }
  B.push(...toks(l.replace(/^## /, '').replace(/\((\d+)\)/g, ' ').replace(/\[مقدمة\]|\(متن العمدة\)/g, ' '), name[0].toUpperCase() + page));
}
A.forEach((t, i) => t.i = i); B.forEach((t, i) => t.i = i);
// anchors
const K = 4, key = (X, i) => X.slice(i, i + K).map(t => t.w).join(' ');
const cnt = (X) => { const m = new Map(); for (let i = 0; i + K <= X.length; i++) { const k = key(X, i); m.set(k, m.has(k) ? -1 : i); } return m; };
const ma = cnt(A), mb = cnt(B), pairs = [];
for (const [k, i] of ma) if (i >= 0 && mb.get(k) >= 0) pairs.push([i, mb.get(k)]);
pairs.sort((x, y) => x[0] - y[0]);
// LIS on b
const tails = [], prev = new Array(pairs.length).fill(-1), tailIdx = [];
pairs.forEach((p, n) => {
  let lo = 0, hi = tails.length; while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < p[1]) lo = m + 1; else hi = m; }
  tails[lo] = p[1]; tailIdx[lo] = n; prev[n] = lo ? tailIdx[lo - 1] : -1;
});
let chain = []; for (let n = tailIdx[tails.length - 1]; n >= 0; n = prev[n]) chain.push(pairs[n]); chain.reverse();
function diff(a, b) {
  const n = a.length, m = b.length, max = n + m; if (!max) return [];
  const V = new Int32Array(2 * max + 2), trace = [];
  for (let d = 0; d <= max; d++) {
    trace.push(V.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && V[max + k - 1] < V[max + k + 1])) ? V[max + k + 1] : V[max + k - 1] + 1, y = x - k;
      while (x < n && y < m && a[x].w === b[y].w) { x++; y++; }
      V[max + k] = x;
      if (x >= n && y >= m) {
        const ops = []; let X = n, Y = m;
        for (let D = d; D > 0; D--) {
          const v = trace[D], Kk = X - Y;
          const pk = (Kk === -D || (Kk !== D && v[max + Kk - 1] < v[max + Kk + 1])) ? Kk + 1 : Kk - 1;
          const px = v[max + pk], py = px - pk;
          while (X > px && Y > py) ops.push(['=', a[--X], b[--Y]]);
          if (X === px) ops.push(['+', null, b[--Y]]); else ops.push(['-', a[--X], null]);
        }
        while (X > 0 && Y > 0) ops.push(['=', a[--X], b[--Y]]);
        return ops.reverse();
      }
    }
  }
}
let ops = [], ia = 0, ib = 0;
for (const [pa, pb] of chain) {
  if (pa < ia || pb < ib) continue;
  ops = ops.concat(diff(A.slice(ia, pa), B.slice(ib, pb)));
  ia = pa; ib = pb;
}
ops = ops.concat(diff(A.slice(ia), B.slice(ib)));
const hunks = []; let cur = null, lastA = null;
for (const [op, a, b] of ops) {
  if (op === '=') { if (cur) { hunks.push(cur); cur = null; } lastA = a; continue; }
  if (!cur) cur = { at: (a || lastA || { tag: '?' }).tag, s: a ? a.i : (lastA ? lastA.i + 1 : 0), z: b ? b.tag : '', A: [], B: [] };
  if (a) cur.A.push(a); if (b) { cur.B.push(b); if (!cur.z) cur.z = b.tag; }
}
if (cur) hunks.push(cur);
if (process.argv[3]) { const M = A.map(() => 0), INS = {}; let la = -1; for (const [op, a, b] of ops) { if (op === '=') { M[a.i] = 1; la = a.i; } else if (b) { (INS[la + 1] = INS[la + 1] || []).push(b.w + '|' + b.o + '|' + b.tag); } else la = a.i; } fs.writeFileSync(process.argv[3], JSON.stringify({ M, INS, A: A.map(t => [t.w, t.o, t.tag]) })); }
const ctx = i => A.slice(Math.max(0, i - 3), i).map(t => t.o).join(' ');
console.log('wabl_page\tother_page\tidx\tcontext\twabl\tother');
for (const h of hunks) console.log([h.at, h.z, h.s, ctx(h.s), h.A.map(t => t.o).join(' '), h.B.map(t => t.o).join(' ')].join('\t'));
const eq = ops.filter(o => o[0] === '=').length;
console.error(name, 'A', A.length, 'B', B.length, 'equal', eq, 'hunks', hunks.length, 'anchors', chain.length);
