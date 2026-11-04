// Three-way view of every base×تبيين hunk: for the base words in the hunk, does البحر الرائق (B) have them?
// usage: node tools/texts/kanz-build/review.js  -> out/review.tsv  (n, page, base, tabyin, bahr-status, context)
//   bahr-status: «B=base» all base words of the hunk are matched in البحر; «B≠» none matched (البحر lacks them or quotes differently);
//   «B partial»; «—» the hunk is a pure addition in تبيين (no base words).
const fs = require('fs'), path = require('path'), { align, norm } = require('../umdafiqh-build/align.js');
const out = path.join(__dirname, 'out');
const rows = require('./rows.js')();
const A = [], Ai = [];
rows.forEach((r, ri) => r.text.split(' ').forEach(w => { if (norm(w)) { A.push(w); Ai.push(ri); } }));
const wit = name => {
  const W = JSON.parse(fs.readFileSync(path.join(out, name + '-words.json'), 'utf8')).filter(x => norm(x.w));
  const ops = align(A.map(norm), W.map(x => norm(x.w))), H = [], m = {}; let cur = null, lastA = -1;
  for (const [o, i, j] of ops) {
    if (o === '=') { if (cur) { H.push(cur); cur = null; } lastA = i; m[i] = j; continue; }
    if (!cur) cur = { at: o === '-' ? i : lastA + 1, A: [], ai: [], B: [], wp: null };
    if (o === '-') { cur.A.push(A[i]); cur.ai.push(i); } else { cur.B.push(W[j].w); cur.wp = cur.wp || W[j].vol; }
  }
  if (cur) H.push(cur);
  return { W, H, m };
};
const T = wit('tabyin'), B = wit('bahr');
// is the base word i "covered" by البحر's lemmata at all? (between two matched words that are close in البحر)
const bahrAround = (i0, i1) => {
  let l = i0 - 1; while (l >= 0 && B.m[l] === undefined) l--;
  let r = i1 + 1; while (r < A.length && B.m[r] === undefined) r++;
  if (l < 0 || r >= A.length || B.m[r] - B.m[l] > 40 || i1 - i0 > 60) return null;
  return B.W.slice(B.m[l] + 1, B.m[r]).map(x => x.w).join(' ');
};
const lines = T.H.map((h, k) => {
  let st = '—', bw = '';
  if (h.ai.length) {
    const n = h.ai.filter(i => B.m[i] !== undefined).length;
    st = n === h.ai.length ? 'B=base' : n ? 'B partial' : 'B≠';
    if (n < h.ai.length) { const s = bahrAround(h.ai[0], h.ai[h.ai.length - 1]); bw = s === null ? '(البحر لا يورده)' : s; }
  } else {
    const s = bahrAround(h.at, h.at - 1); bw = s === null ? '(البحر لا يورده)' : (s || '(=base)');
  }
  const at = Math.min(h.at, A.length - 1);
  return [k + 1, 'ص' + rows[Ai[at]].page, h.wp || '', h.A.join(' '), h.B.join(' '), st, bw,
    A.slice(Math.max(0, h.at - 5), h.at).join(' ') + ' ⟨…⟩ ' + A.slice(h.at + h.A.length, h.at + h.A.length + 4).join(' ')].join('\t');
});
fs.writeFileSync(path.join(out, 'review.tsv'), 'n\tbase page\ttabyin page\tbase\ttabyin\tbahr\tbahr reading\tcontext\n' + lines.join('\n') + '\n');
console.log('hunks', T.H.length, lines.reduce((m, l) => (m[l.split('\t')[5]] = (m[l.split('\t')[5]] || 0) + 1, m), {}));
