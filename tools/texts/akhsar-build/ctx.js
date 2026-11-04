// prints, for each hunk, base context and the second source's context (for deciding readings)
const fs = require('fs'), { align, norm } = require('../umdafiqh-build/align.js');
const rows = require('./rows.js')(); const A = [], Ap = [];
rows.forEach(r => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ap.push(r.page); } }));
const B = fs.readFileSync(process.argv[2], 'utf8').split(/\s+/).filter(w => norm(w));
const ops = align(A.map(norm), B.map(norm)); let cur = null, la = 0, lb = 0; const H = [];
for (const [o, i, j] of ops) { if (o === '=') { if (cur) { H.push(cur); cur = null; } la = i; lb = j; continue; } if (!cur) cur = { a: la + 1, b: lb + 1, A: [], B: [] }; if (o === '-') cur.A.push(i); else cur.B.push(j); }
if (cur) H.push(cur);
const want = new Set(process.argv.slice(3).map(Number));
H.forEach((h, k) => { if (!want.has(k + 1)) return; const ae = h.A.length ? h.A[h.A.length - 1] + 1 : h.a, be = h.B.length ? h.B[h.B.length - 1] + 1 : h.b;
  console.log('#' + (k + 1), 'ص' + Ap[Math.min(h.a, A.length - 1)], '\n  R:', A.slice(h.a - 6, h.a).join(' '), '[[', h.A.map(i => A[i]).join(' '), ']]', A.slice(ae, ae + 6).join(' '),
    '\n  A:', B.slice(h.b - 6, h.b).join(' '), '[[', h.B.map(j => B[j]).join(' '), ']]', B.slice(be, be + 6).join(' ')); });
