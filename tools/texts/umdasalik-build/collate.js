// Word-by-word collation (by script) of the base A (shamela 37344, ط. قطر) against three independent witnesses
// H (ت. الحموي، دار ابن حزم: whole text, OCR), N (matn in «أنوار المسالك» ت. نويدر, OCR) and F (matn in «فيض الإله المالك», DKI, OCR).
// Each witness is aligned on A separately (align.js). A difference is a hunk: A span [i0,i1) + the witness words there.
// OCR noise is random, so a reading is taken seriously only when at least two independent witnesses print the SAME
// alternative over the SAME span of A ("votes"). Those hunks -> out/candidates.tsv for a decision by hand (manual.js).
// usage: node collate.js
const fs = require('fs'), path = require('path');
const { align, norm: norm0 } = require('./align.js');
const O = path.join(__dirname, 'out');
const norm = w => norm0(w.replace(/ی/g, 'ي').replace(/[کڪ]/g, 'ك').replace(/[ہھ]/g, 'ه').replace(/[٠-٩۰-۹0-9]/g, ''));
const prefixJoin = ws => { // a lone «و/ف/ب/ل/ك» (the commentaries print «(و) ثانيها … (طاهر)») belongs to the next word
  const out = [];
  for (let i = 0; i < ws.length; i++) {
    if (/^(و|ف)?(ب|ل|ك)?$/.test(ws[i].n) && ws[i].n && ws[i + 1]) { ws[i + 1].n = ws[i].n + ws[i + 1].n; continue; }
    out.push(ws[i]);
  }
  return out;
};
const toks = txt => prefixJoin(txt.split(/\s+/).map(o => ({ o, n: norm(o) })).filter(t => t.n));
// A, with a back-reference to the item (paragraph/heading) and word index
const Aitems = JSON.parse(fs.readFileSync(path.join(O, 'A.json'), 'utf8'));
const A = [];
Aitems.forEach((it, k) => {
  const txt = it.t === 'h' ? it.title : it.text;
  if (!txt) return;
  txt.split(/\s+/).forEach((o, w) => { const n = norm(o); if (n) A.push({ o, n, item: k, w }); });
});
const AA = prefixJoin(A);
const W = { H: toks(fs.readFileSync(path.join(O, 'H.txt'), 'utf8')), N: toks(fs.readFileSync(path.join(O, 'N.txt'), 'utf8')), F: toks(fs.readFileSync(path.join(O, 'F.txt'), 'utf8')) };
console.log('words A', AA.length, Object.entries(W).map(([k, v]) => k + ' ' + v.length).join(' '));
const hunks = {}, cover = {};
for (const [k, X] of Object.entries(W)) {
  const ops = align(AA.map(t => t.n), X.map(t => t.n));
  const m = new Int32Array(AA.length).fill(-1);
  for (const [op, i, j] of ops) if (op === '=') m[i] = j;
  // coverage: share of A words matched exactly
  cover[k] = (m.filter(x => x >= 0).length / AA.length * 100).toFixed(1) + '%';
  const H = [];
  let cur = null, lastJ = -1, lastI = -1;
  for (const [op, i, j] of ops) {
    if (op === '=') { if (cur) { cur.i1 = i; H.push(cur); cur = null; } lastI = i; lastJ = j; continue; }
    if (!cur) cur = { i0: lastI + 1, i1: null, x: [] };
    if (op === '+') cur.x.push(X[j]);
  }
  if (cur) { cur.i1 = AA.length; H.push(cur); }
  hunks[k] = H;
  fs.writeFileSync(path.join(O, 'map-' + k + '.json'), JSON.stringify(Array.from(m)));
}
console.log('exact coverage of A', JSON.stringify(cover));
// votes: a hunk of witness X is confirmed by witness Y when Y, between the A words that frame the hunk (nearest words of A
// that Y matched, at most 3 away), prints exactly X's words, or contains them while not containing A's words there.
const maps = {}; for (const k of Object.keys(W)) maps[k] = JSON.parse(fs.readFileSync(path.join(O, 'map-' + k + '.json'), 'utf8'));
const segOf = (k, i0, i1) => {
  const m = maps[k]; let l = i0 - 1, r = i1;
  while (l >= 0 && m[l] < 0 && i0 - 1 - l < 3) l--;
  while (r < AA.length && m[r] < 0 && r - i1 < 3) r++;
  if ((l >= 0 && m[l] < 0) || (r < AA.length && m[r] < 0)) return null;
  const j0 = l < 0 ? 0 : m[l] + 1, j1 = r >= AA.length ? W[k].length : m[r];
  if (j1 - j0 > 20) return null;
  return { pre: AA.slice(l + 1, i0).map(t => t.n), post: AA.slice(i1, r).map(t => t.n), y: W[k].slice(j0, j1) };
};
const votes = new Map();
for (const [k, H] of Object.entries(hunks)) for (const h of H) {
  // a witness that skips a long stretch (commentary not quoting, OCR loss) is no evidence
  if (h.i1 - h.i0 > 8 || h.x.length > 8) continue;
  // pure omissions in N/F mean only that the commentator did not quote the words
  if (!h.x.length && k !== 'H') continue;
  const key = h.i0 + ',' + h.i1 + ',' + h.x.map(t => t.n).join(' ');
  if (!votes.has(key)) votes.set(key, { i0: h.i0, i1: h.i1, x: h.x.map(t => t.n).join(' '), wit: {} });
  const v = votes.get(key); v.wit[k] = h.x.map(t => t.o).join(' ');
  const aw = AA.slice(h.i0, h.i1).map(t => t.n).join(' ');
  for (const y of Object.keys(W)) {
    if (y === k || v.wit[y]) continue;
    const sg = segOf(y, h.i0, h.i1); if (!sg) continue;
    const ys = ' ' + sg.y.map(t => t.n).join(' ') + ' ', full = ' ' + [...sg.pre, v.x, ...sg.post].filter(Boolean).join(' ') + ' ';
    const withA = ' ' + [...sg.pre, aw, ...sg.post].filter(Boolean).join(' ') + ' ';
    if (ys === full || (v.x && ys.includes(' ' + v.x + ' ') && !(aw && ys.includes(' ' + aw + ' ')) && ys !== withA)) v.wit[y] = sg.y.map(t => t.o).join(' ') + ' ~';
  }
}
// OCR loses/confuses dots: a reading with the same undotted skeleton (rasm) as A is no evidence
const rasm = s => s.replace(/[بتثنيئى]/g, 'ٮ').replace(/[جحخ]/g, 'ح').replace(/ذ/g, 'د').replace(/ز/g, 'ر').replace(/ش/g, 'س').replace(/ض/g, 'ص')
  .replace(/ظ/g, 'ط').replace(/غ/g, 'ع').replace(/[فق]/g, 'ڡ').replace(/ة/g, 'ه').replace(/ /g, '');
const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
let dots = 0, near = 0;
const cand = [...votes.values()].filter(v => {
  if (Object.keys(v.wit).length < 2) return false;
  const ra = rasm(AA.slice(v.i0, v.i1).map(t => t.n).join(' ')), rx = rasm(v.x);
  if (ra === rx) { dots++; return false; }
  // one letter more/less/other in the skeleton, voted only by the two vocalized OCRs (H, N): OCR noise (عجز/عجر, يقف/يف)
  v.near = lev(ra, rx) <= 1;
  if (v.near && !v.wit.F) { near++; return false; }
  return true;
}).sort((a, b) => a.i0 - b.i0);
console.log('dropped as OCR noise: same skeleton', dots, '; one skeleton letter, H+N only', near);
const ctx = (i0, i1) => AA.slice(Math.max(0, i0 - 4), i0).map(t => t.o).join(' ') + ' [' + AA.slice(i0, i1).map(t => t.o).join(' ') + '] ' + AA.slice(i1, i1 + 4).map(t => t.o).join(' ');
const rows = ['id\tpage\twitnesses\tA\twitness reading\tH\tN\tF\tcontext'];
cand.forEach((c, n) => {
  const it = Aitems[AA[Math.min(c.i0, AA.length - 1)].item];
  rows.push([n + 1, it.page, Object.keys(c.wit).join(''), AA.slice(c.i0, c.i1).map(t => t.o).join(' '), c.x, c.wit.H || '', c.wit.N || '', c.wit.F || '', ctx(c.i0, c.i1)].join('\t'));
});
fs.writeFileSync(path.join(O, 'candidates.tsv'), rows.join('\n') + '\n');
fs.writeFileSync(path.join(O, 'candidates.json'), JSON.stringify(cand.map(c => Object.assign({ a: AA.slice(c.i0, c.i1).map(t => t.o).join(' '), item: AA[Math.min(c.i0, AA.length - 1)].item }, c)), null, 1));
console.log('candidates (>=2 witnesses agree against A):', cand.length, ' by 3:', cand.filter(c => Object.keys(c.wit).length === 3).length);
