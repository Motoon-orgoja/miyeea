// Shared helpers for wasitiyya / lumaa: normalization, word diff, Qur'an lookup.
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw');
const HAR = /[ً-ْٰـۖ-ۭ]/g;
// skeleton used for comparison: no harakat/tatweel, unified alef/hamza/yaa/taa marbuta
const norm = w => w.replace(HAR, '').replace(/[أإآٱ]/g, 'ا').replace(/ؤ/g, 'و').replace(/[ئى]/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^ء-ي]/g, '');
const words = s => s.split(/\s+/).map(w => w.trim()).filter(w => norm(w));
// LCS diff on arrays of skeletons -> list of ops [{op:'=',a:i,b:j}|{op:'-',a:i}|{op:'+',b:j}]
function diff(A, B) {
  const n = A.length, m = B.length;
  // Myers-free simple approach: DP over a band would be faster, but n*m (~30M) fits in Uint16 rows? use Uint32 rows with full table of directions in Uint8
  const dir = new Uint8Array((n + 1) * (m + 1));
  let prev = new Uint32Array(m + 1), cur = new Uint32Array(m + 1);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (A[i] === B[j]) { cur[j] = prev[j + 1] + 1; dir[i * (m + 1) + j] = 1; }
      else if (prev[j] >= cur[j + 1]) { cur[j] = prev[j]; dir[i * (m + 1) + j] = 2; }
      else { cur[j] = cur[j + 1]; dir[i * (m + 1) + j] = 3; }
    }
    [prev, cur] = [cur, prev]; cur.fill(0);
  }
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m) {
    const d = dir[i * (m + 1) + j];
    if (d === 1) ops.push({ op: '=', a: i++, b: j++ }); else if (d === 2) ops.push({ op: '-', a: i++ }); else ops.push({ op: '+', b: j++ });
  }
  while (i < n) ops.push({ op: '-', a: i++ }); while (j < m) ops.push({ op: '+', b: j++ });
  return ops;
}
// group ops into hunks of differences with context
function hunks(ops, Aw, Bw, ctx = 3) {
  const out = []; let k = 0;
  while (k < ops.length) {
    if (ops[k].op === '=') { k++; continue; }
    let e = k; while (e < ops.length && ops[e].op !== '=') e++;
    const del = ops.slice(k, e).filter(o => o.op === '-').map(o => Aw[o.a]);
    const ins = ops.slice(k, e).filter(o => o.op === '+').map(o => Bw[o.b]);
    const firstA = ops.slice(0, k).reverse().find(o => o.a !== undefined);
    const ai = ops[k].a !== undefined ? ops[k].a : (firstA ? firstA.a + 1 : 0);
    const before = Aw.slice(Math.max(0, ai - ctx), ai).join(' ');
    const lastA = ops.slice(e).find(o => o.a !== undefined);
    const after = lastA ? Aw.slice(lastA.a, lastA.a + ctx).join(' ') : '';
    out.push({ at: ai, del, ins, before, after }); k = e;
  }
  return out;
}
// ---------- Qur'an (tanzil quran-simple via api.alquran.cloud), imla'i: pause marks and dagger alif removed ----------
let Q = null;
function quran() {
  if (Q) return Q;
  const j = JSON.parse(fs.readFileSync(path.join(RAW, 'quran', 'quran-simple.alquran-cloud.json'), 'utf8').replace(/^﻿/, ''));
  Q = { suras: [], flat: [] };
  const BASM = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
  j.data.surahs.forEach((s, si) => {
    Q.suras[si + 1] = { name: s.name, ayahs: [] };
    s.ayahs.forEach((a, ai) => {
      let t = a.text.replace(/^﻿/, '');
      if (ai === 0 && si > 0 && t.startsWith(BASM)) t = t.slice(BASM.length);
      t = imlai(t);
      const ws = words(t);
      Q.suras[si + 1].ayahs[ai + 1] = ws;
      ws.forEach((w, wi) => Q.flat.push({ s: si + 1, a: ai + 1, i: wi, w, n: norm(w) }));
    });
  });
  return Q;
}
function imlai(t) {
  return t.replace(/[ۖ-ۭ]/g, '').replace(/ٰ/g, '').replace(/ـ/g, '').replace(/\s+/g, ' ').trim();
}
// find quote (array of words) in the Qur'an: exact skeleton run. Returns [{s,a,i,len}] candidates
function findQuote(qw) {
  const F = quran().flat, qn = qw.map(norm), res = [];
  for (let k = 0; k + qn.length <= F.length; k++) {
    let ok = true;
    for (let t = 0; t < qn.length; t++) if (F[k + t].n !== qn[t]) { ok = false; break; }
    if (ok) res.push(k);
  }
  return res;
}
module.exports = { RAW, HAR, norm, words, diff, hunks, quran, findQuote, imlai };
