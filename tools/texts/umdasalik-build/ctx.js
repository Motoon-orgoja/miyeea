// usage: node ctx.js <candidate ids…> — shows A and each witness around a candidate (framed by matched A words)
const fs = require('fs'), path = require('path'); const O = path.join(__dirname, 'out');
const { norm: norm0 } = require('./align.js');
const norm = w => norm0(w.replace(/ی/g, 'ي').replace(/[کڪ]/g, 'ك').replace(/[ہھ]/g, 'ه').replace(/[٠-٩۰-۹0-9]/g, ''));
const pj = ws => { const o = []; for (let i = 0; i < ws.length; i++) { if (/^(و|ف)?(ب|ل|ك)?$/.test(ws[i].n) && ws[i].n && ws[i + 1]) { ws[i + 1].n = ws[i].n + ws[i + 1].n; ws[i + 1].o = ws[i].o + ' ' + ws[i + 1].o; continue; } o.push(ws[i]); } return o; };
const items = JSON.parse(fs.readFileSync(path.join(O, 'A.json'), 'utf8')); const A0 = [];
items.forEach(it => { const t = it.t === 'h' ? it.title : it.text; if (t) t.split(/\s+/).forEach(o => { const n = norm(o); if (n) A0.push({ o, n }); }); });
const A = pj(A0);
const W = {}; for (const k of ['H', 'N', 'F']) W[k] = pj(fs.readFileSync(path.join(O, k + '.txt'), 'utf8').split(/\s+/).map(o => ({ o, n: norm(o) })).filter(t => t.n));
const M = {}; for (const k of ['H', 'N', 'F']) M[k] = JSON.parse(fs.readFileSync(path.join(O, 'map-' + k + '.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(O, 'candidates.json'), 'utf8'));
for (const id of process.argv.slice(2)) {
  const c = C[id - 1]; const W0 = Math.max(0, c.i0 - 7), W1 = Math.min(A.length, c.i1 + 7);
  console.log('#' + id, 'A:', A.slice(W0, c.i0).map(t => t.o).join(' '), '[' + A.slice(c.i0, c.i1).map(t => t.o).join(' ') + ']', A.slice(c.i1, W1).map(t => t.o).join(' '));
  for (const k of ['H', 'N', 'F']) {
    let l = W0; while (l < c.i0 && M[k][l] < 0) l++; let r = W1 - 1; while (r >= c.i1 && M[k][r] < 0) r--;
    if (M[k][l] < 0 || M[k][r] < 0 || M[k][r] - M[k][l] > 60) { console.log('   ' + k + ': -'); continue; }
    console.log('   ' + k + ':', W[k].slice(M[k][l], M[k][r] + 1).map(t => t.o).join(' '));
  }
}
