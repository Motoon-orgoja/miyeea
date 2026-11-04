// Generic word alignment used by vulgate.js (same method as collate.js): unique 4-gram anchors common to both
// sequences, longest increasing chain of anchors, Myers diff between consecutive anchors.
// align(a, b) with a, b = arrays of normalized words -> ops: ['=', i, j] | ['-', i, null] | ['+', null, j]
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي]/g, '')
  .replace(/^(و|ف|ب|ل)?مايه$/, '$1ميه').replace(/^ابن$/, 'بن');
function myers(a, b, oa, ob) {
  const n = a.length, m = b.length, max = n + m; if (!max) return [];
  const V = new Int32Array(2 * max + 2), trace = [];
  for (let d = 0; d <= max; d++) {
    trace.push(V.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && V[max + k - 1] < V[max + k + 1])) ? V[max + k + 1] : V[max + k - 1] + 1, y = x - k;
      while (x < n && y < m && a[x] === b[y]) { x++; y++; }
      V[max + k] = x;
      if (x >= n && y >= m) {
        const ops = []; let X = n, Y = m;
        for (let D = d; D > 0; D--) {
          const v = trace[D], K = X - Y;
          const pk = (K === -D || (K !== D && v[max + K - 1] < v[max + K + 1])) ? K + 1 : K - 1;
          const px = v[max + pk], py = px - pk;
          while (X > px && Y > py) { X--; Y--; ops.push(['=', oa + X, ob + Y]); }
          if (X === px) { Y--; ops.push(['+', null, ob + Y]); } else { X--; ops.push(['-', oa + X, null]); }
        }
        while (X > 0 && Y > 0) { X--; Y--; ops.push(['=', oa + X, ob + Y]); }
        return ops.reverse();
      }
    }
  }
}
function align(a, b) {
  const K = 4, key = (X, i) => X.slice(i, i + K).join(' ');
  const cnt = X => { const m = new Map(); for (let i = 0; i + K <= X.length; i++) { const k = key(X, i); m.set(k, m.has(k) ? -1 : i); } return m; };
  const ma = cnt(a), mb = cnt(b), pairs = [];
  for (const [k, i] of ma) if (i >= 0 && mb.get(k) >= 0) pairs.push([i, mb.get(k)]);
  pairs.sort((x, y) => x[0] - y[0]);
  const tails = [], prev = new Array(pairs.length).fill(-1), tailIdx = [];
  pairs.forEach((p, n) => {
    let lo = 0, hi = tails.length; while (lo < hi) { const md = (lo + hi) >> 1; if (tails[md] < p[1]) lo = md + 1; else hi = md; }
    tails[lo] = p[1]; tailIdx[lo] = n; prev[n] = lo ? tailIdx[lo - 1] : -1;
  });
  const chain = []; for (let n = tails.length ? tailIdx[tails.length - 1] : -1; n >= 0; n = prev[n]) chain.push(pairs[n]); chain.reverse();
  let ops = [], ia = 0, ib = 0;
  for (const [pa, pb] of chain) {
    if (pa < ia || pb < ib) continue;
    ops = ops.concat(myers(a.slice(ia, pa), b.slice(ib, pb), ia, ib));
    ia = pa; ib = pb;
  }
  return ops.concat(myers(a.slice(ia), b.slice(ib), ia, ib));
}
module.exports = { align, norm };
