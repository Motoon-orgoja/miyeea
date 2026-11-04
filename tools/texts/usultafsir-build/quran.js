// copied from ../tawhid-tools/quran.js (uses ../raw/tawhid/quran_imlaei.json = api.quran.com text_imlaei)
// (copied from thalatha-tools/quran.js; + optional sura/aya hint) Replaces a Qur'an quote with the exact imla'i Mushaf text (api.quran.com text_imlaei).
// The quote is located by approximate matching (edit distance on a letter skeleton), so print/rasm differences
// (ياأيها، السموات، الّيل، أولائك) do not matter; the returned words are the Mushaf's, cut at the same word bounds.
const fs = require('fs'), path = require('path');
const Q = JSON.parse(fs.readFileSync(path.join(__dirname, '../raw/tawhid/quran_imlaei.json'), 'utf8')).verses;
const strip = s => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u200C\u200D\u200F]/g, '');
const skel = s => strip(s).replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
  .replace(/[ءا]/g, '').replace(/[^\u0621-\u064A]/g, '');
const verses = Q.map(v => { const [s, a] = v.verse_key.split(':').map(Number); const w = v.text_imlaei.split(/\s+/).filter(Boolean); return { s, a, w, k: w.map(skel) } });
function locate(quote, hint) {
  const qw = quote.split(/\s+/).map(skel).filter(Boolean), qs = qw.join('');
  // candidate verse: most quote words present
  let best = -1, bi = 0;
  verses.forEach((v, i) => { if (hint && hint.s && v.s !== hint.s) return; const set = new Set(v.k); let n = 0; for (const x of qw) if (set.has(x)) n++; const sc = n - 0.01 * v.k.length - (hint && hint.a ? 0.001 * Math.abs(v.a - hint.a) : 0); if (sc > best) { best = sc; bi = i } });
  const lo = Math.max(0, bi - 8), hi = Math.min(verses.length - 1, bi + 8), win = [];
  for (let i = lo; i <= hi; i++) if (verses[i].s === verses[bi].s) verses[i].w.forEach((w, j) => win.push({ v: i, w, k: verses[i].k[j] }));
  // text string with char -> word index
  let T = '', own = [];
  win.forEach((x, j) => { for (const c of x.k) { T += c; own.push(j) } });
  // semi-global DP: quote fully aligned, free start/end in T
  const n = qs.length, m = T.length; let prev = new Array(m + 1).fill(0), st = Array.from({ length: m + 1 }, (_, j) => j);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1), cst = new Array(m + 1); cur[0] = i; cst[0] = 0;
    for (let j = 1; j <= m; j++) {
      const d = prev[j - 1] + (qs[i - 1] === T[j - 1] ? 0 : 1), u = prev[j] + 1, l = cur[j - 1] + 1;
      if (d <= u && d <= l) { cur[j] = d; cst[j] = st[j - 1] } else if (u <= l) { cur[j] = u; cst[j] = st[j] } else { cur[j] = l; cst[j] = cst[j - 1] }
    }
    prev = cur; st = cst;
  }
  let e = 1; for (let j = 1; j <= m; j++) if (prev[j] < prev[e]) e = j;
  const sw = own[st[e]], ew = own[e - 1], parts = [];
  for (let j = sw; j <= ew; j++) { if (j > sw && win[j].v !== win[j - 1].v) parts.push('*'); parts.push(win[j].w) }
  const vs = [...new Set(win.slice(sw, ew + 1).map(x => x.v))].map(i => verses[i]);
  const text = parts.join(' ').replace(/[ۖ-ٰۭ]/g, '').replace(/ +/g, ' ').trim();
  return { text, cost: prev[e], len: n, ref: vs[0].s + ':' + vs[0].a + (vs.length > 1 ? '-' + vs[vs.length - 1].a : ''), same: skel(text) === qs };
}
module.exports = { locate, skel, strip };
