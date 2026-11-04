// Word-by-word collation (LCS on normalized words: no harakat/tatweel/punctuation, unified alef/yaa/taa marbuta/hamza seats)
// of the base (out/base.json, shamela 12081) against Wikisource «مقدمة في التفسير» (WS) and مجموع الفتاوى ج13 on Wikisource (MF).
// Qur'an quotes are left out of the comparison (they are replaced by the Mushaf text anyway).
// usage: node collate.js [base.json] -> out/collate-ws.txt, out/collate-mf.txt, out/hunks.json
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '../raw/usultafsir');
const base = JSON.parse(fs.readFileSync(process.argv[2] || path.join(__dirname, 'out/base.json'), 'utf8'));
const wiki = s => s.replace(/{{(?:ترويسة|رأسية)[\s\S]*?\n}}/g, ' ').replace(/{{صل}}/g, ' صلى الله عليه وسلم ').replace(/<ref[\s\S]*?<\/ref>/g, ' ')
  .replace(/{{[^}]*}}/g, ' ').replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/^=+.*=+$/gm, ' ').replace(/<[^>]+>/g, ' ');
const WS = wiki(fs.readFileSync(path.join(R, 'wikisource-muqaddima-fi-tafsir.wiki'), 'utf8'));
const MF = fs.readdirSync(R).filter(f => /^wikisource-majmu13-/.test(f)).sort().map(f => wiki(fs.readFileSync(path.join(R, f), 'utf8'))).join(' ');
const noQ = s => s.replace(/\{[^}]*\}|﴿[^﴾]*﴾/g, ' ¶ ').replace(/\[[^\]]*:[^\]]*\]/g, ' ');
const norm = w => w.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[ؤئ]/g, 'ء').replace(/[^ء-ي¶]/g, '');
const toks = s => noQ(s).split(/\s+/).map(w => ({ w, n: norm(w) })).filter(x => x.n);
// base tokens remember their chapter / paragraph
const B = []; base.forEach((c, ci) => c.paras.forEach((p, pi) => toks(p).forEach(t => B.push({ ...t, ci, pi }))));
function diff(A, Bt) { // Myers-free simple LCS with banded DP over word arrays (sizes ~10k) — uses greedy anchor on unique 4-grams then local DP
  const key = (arr, i) => arr.slice(i, i + 4).map(x => x.n).join(' ');
  const cntA = new Map(), cntB = new Map();
  for (let i = 0; i + 4 <= A.length; i++) cntA.set(key(A, i), (cntA.get(key(A, i)) || 0) + 1);
  for (let i = 0; i + 4 <= Bt.length; i++) cntB.set(key(Bt, i), (cntB.get(key(Bt, i)) || 0) + 1);
  const posB = new Map(); for (let i = 0; i + 4 <= Bt.length; i++) if (cntB.get(key(Bt, i)) === 1) posB.set(key(Bt, i), i);
  // anchors: unique in both, increasing in B (LIS)
  let anchors = []; for (let i = 0; i + 4 <= A.length; i++) { const k = key(A, i); if (cntA.get(k) === 1 && posB.has(k)) anchors.push([i, posB.get(k)]); }
  // LIS on b
  const tails = [], prev = new Array(anchors.length);
  anchors.forEach((a, idx) => { let lo = 0, hi = tails.length; while (lo < hi) { const m = (lo + hi) >> 1; if (anchors[tails[m]][1] < a[1]) lo = m + 1; else hi = m; } prev[idx] = lo ? tails[lo - 1] : -1; tails[lo] = idx; });
  let seq = []; for (let k = tails[tails.length - 1]; k >= 0 && k !== undefined; k = prev[k]) seq.push(anchors[k]); seq.reverse();
  const hunks = []; let ia = 0, ib = 0;
  const local = (a0, a1, b0, b1) => { // LCS DP on small ranges
    const a = A.slice(a0, a1), b = Bt.slice(b0, b1), n = a.length, m = b.length;
    if (n * m > 4e6) { if (n || m) hunks.push({ a0, a: a.map(x => x.w), b: b.map(x => x.w) }); return; }
    const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i].n === b[j].n ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    let i = 0, j = 0, cur = null;
    while (i < n || j < m) {
      if (i < n && j < m && a[i].n === b[j].n) { if (cur) { hunks.push(cur); cur = null; } i++; j++; }
      else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) { (cur = cur || { a0: a0 + i, a: [], b: [] }).b.push(b[j++].w); }
      else { (cur = cur || { a0: a0 + i, a: [], b: [] }).a.push(a[i++].w); }
    }
    if (cur) hunks.push(cur);
  };
  for (const [x, y] of seq) { if (x < ia || y < ib) continue; local(ia, x, ib, y); ia = x; ib = y; }
  local(ia, A.length, ib, Bt.length);
  return hunks;
}
const out = {};
for (const [name, txt] of [['ws', WS], ['mf', MF]]) {
  const T = toks(txt), hs = diff(B, T);
  out[name] = hs.map(h => ({ at: h.a0, ci: (B[h.a0] || B[B.length - 1]).ci, pi: (B[h.a0] || B[B.length - 1]).pi,
    ctx: B.slice(Math.max(0, h.a0 - 4), h.a0).map(x => x.w).join(' '), base: h.a.join(' '), other: h.b.join(' ') }));
  fs.writeFileSync(path.join(__dirname, `out/collate-${name}.txt`), out[name].map(h => `[${h.ci}.${h.pi}] …${h.ctx} | ${h.base || '∅'} → ${h.other || '∅'}`).join('\n'));
  console.log(name, 'base words', B.length, 'other words', T.length, 'hunks', hs.length);
}
fs.writeFileSync(path.join(__dirname, 'out/hunks.json'), JSON.stringify(out, null, 1));
