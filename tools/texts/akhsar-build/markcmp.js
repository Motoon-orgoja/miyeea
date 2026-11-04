// Compares the marks of aligned identical words in the base and a (partly vocalized) second source;
// prints words where both mark the same letter differently (a hint list for checking, not a decision).
// usage: node markcmp.js <second.txt> <out.txt>
const fs = require('fs'), { align, norm } = require('../umdafiqh-build/align.js');
const rows = require('./rows.js')(), A = [], Ap = [];
rows.forEach(r => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ap.push(r.page); } }));
const B = fs.readFileSync(process.argv[2], 'utf8').split(/\s+/).filter(w => norm(w));
const sk = w => { const L = []; for (const ch of w.replace(/[^ء-يً-ْ]/g, '')) { if (/[ً-ْ]/.test(ch)) { if (L.length) L[L.length - 1].m += ch; } else L.push({ c: ch.replace(/[أإآٱ]/, 'ا').replace('ى', 'ي'), m: '' }); } return L; };
const out = [];
for (const [o, i, j] of align(A.map(norm), B.map(norm))) {
  if (o !== '=') continue;
  const a = sk(A[i]), b = sk(B[j]); if (a.length !== b.length) continue;
  for (let k = 0; k < a.length; k++) {
    const x = a[k].m.replace('ّ', ''), y = b[k].m.replace('ّ', '');
    if (x && y && x !== y && !(k === a.length - 1 && /[ًٌٍ]/.test(x + y))) { out.push(Ap[i] + '\t' + A[i] + '\t' + B[j] + '\t' + A.slice(i - 3, i + 3).join(' ')); break; }
  }
}
fs.writeFileSync(process.argv[3], out.join('\n') + '\n'); console.log('conflicts', out.length);
