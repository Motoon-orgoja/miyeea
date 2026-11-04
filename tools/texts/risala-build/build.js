// Builds tools/texts/risala.json from the base F (al-Fawakih's vocalized matn), the reading decisions (out/decisions.json),
// T's punctuation and Qur'an brackets, T's bab headings, and T's colophon (absent from F).
// Writes also out/build-log.txt (every word that came from a witness, every vocalization rule applied).
// usage: node build.js
const fs = require('fs'), path = require('path');
const { align, norm } = require('./align');
const { load } = require('./tok');
const { paras } = require('./paras');
const voc = require('./vocfix');
const tstyle = require('./tstyle');
const fill = require('./fill');
// bab titles that T prints shorter than the matn: the title runs on to this word (bare, normalized)
const HEAD_END = { 20: 'ودفنه', 35: 'والولا', 36: 'والغصب' };
const canon = w => w.replace(/[ًٌٍَُِّْ]+/g, ''); // a witness word is looked up by its letters alone
const isUnvoc = require('./unvoc');
const MANUAL_VOC = Object.fromEntries(Object.entries(require('./manual-voc')).map(([k, v]) => [canon(k), v]));
const OUT = path.join(__dirname, 'out'), log = [];
const F = load('F'), T = load('T'), M = load('M'), Th = load('Th'), K = load('K');
const { vote } = require('./vcmp');
const dec = JSON.parse(fs.readFileSync(path.join(OUT, 'decisions.json'), 'utf8'));
const opsOf = X => align(F.map(x => x.n), X.map(x => x.n));
const OPS = { T: opsOf(T), M: opsOf(M), Th: opsOf(Th) };
// F index -> T index for matched words
const f2t = new Map(); for (const o of OPS.T) if (o[0] === '=') f2t.set(o[1], o[2]);
const f2k = new Map(); for (const o of opsOf(K)) if (o[0] === '=') f2k.set(o[1], o[2]);
// witness tokens covering F span [a,b): matched/deleted F words in the span and insertions at positions a..b
function span(k, a, b) {
  const X = { T, M, Th }[k], res = []; let pos = 0;
  for (const o of OPS[k]) {
    if (o[0] === '+') { if (pos >= a && pos <= b) res.push(X[o[2]]); continue; }
    if (o[1] >= a && o[1] < b && o[0] === '=') res.push(X[o[2]]);
    pos = o[1] + 1;
  }
  return res;
}
const PUN = /[،؛:.؟!,;]+$/;
const strip = w => w.replace(/[(){}\[\]"«»﴿﴾]/g, '');
const tail = w => (strip(w).match(/[،؛:.؟!]+$/) || [''])[0].replace(/,/g, '،').replace(/;/g, '؛');
const bare = w => strip(w).replace(/[،؛:.؟!,;\-–]+/g, '');
// ---- 1. word list from F with the decisions applied ----
const at = new Map(dec.map(d => [d.a, d]));
const out = []; // {w, f (F index or null), src}
for (let i = 0; i < F.length;) {
  const d = at.get(i);
  if (d) {
    let src = null, toks = null;
    for (const k of ['T', 'M', 'Th']) { const s = span(k, d.a, d.b); if (s.map(x => x.n).join(' ') === d.take) { src = k; toks = s; break; } }
    if (!toks) throw new Error('no witness tokens for decision at ' + d.a + ': ' + d.take);
    for (const x of toks) out.push({ w: src === 'T' ? strip(x.w) : bare(x.w), f: null, src, t: src === 'T' ? x : null, dec: d.a });
    log.push(`reading @${d.a} (${d.why}): «${F.slice(d.a, d.b).map(x => bare(x.w)).join(' ')}» → «${toks.map(x => strip(x.w)).join(' ')}» [${src}]`);
    if (d.b === d.a) { /* insertion only */ out.push({ w: F[i].w, f: i, src: 'F' }); i++; } else i = d.b;
    continue;
  }
  out.push({ w: F[i].w, f: i, src: 'F' }); i++;
}
// ---- 2. the colophon: T after the last word matched to F ----
let lastT = -1; for (const o of OPS.T) if (o[0] === '=') lastT = Math.max(lastT, o[2]);
const colo = T.slice(lastT + 1);
// The base stops before the author's colophon. T, M and Th print it; M and Th agree against T in eight places
// («أَنْ نَأْتِيَ بِهِ»، «تَعْلِيمِ ذَلِكَ»، «وَيَعْمَلُ»، «وَيُفْهِمُ»، «وَمِنَ السُّنَنِ»، «عَزَّ وَجَلَّ»، «فِيمَا كَلَّفَنَا»، «نَبِيِّهِ وَعَلَى آلِهِ»),
// so their wording is taken (2 against 1), with T's shakl where the words are T's and the rest vocalized by hand.
const COLOPHON = require('./colophon');
const cw = COLOPHON.split(' '), want = colo.map(x => x.n).join(' ');
for (const w of cw) out.push({ w, f: null, src: 'manual', t: null });
log.push('colophon (M+Th wording, T shakl): ' + COLOPHON);
log.push('colophon as T prints it: ' + colo.map(x => x.w).join(' '));
for (const o of out) if (o.src === 'T') o.w = tstyle(o.w);
// ---- 3. punctuation from T (al-Sanari's), the base's own where T has no word ----
for (const o of out) {
  const t = o.f !== null && f2t.has(o.f) ? T[f2t.get(o.f)] : o.t;
  const raw = o.w;
  let w = bare(raw);
  w += t ? tail(t.w) : tail(raw);
  o.w = w;
}
// ---- 3-. words taken from M/Th/T that the witness prints without full shakl: vocalized by hand (manual-voc.js) ----
for (const o of out) {
  if (o.src === 'F' || !isUnvoc(o.w)) continue; // only words the witness leaves (partly) bare
  const b = bare(o.w), m = MANUAL_VOC[canon(b)];
  if (!m) continue;
  if (norm(m) !== norm(b)) throw new Error('manual-voc letters differ: ' + b + ' / ' + m);
  o.w = o.w.replace(b, m); log.push(`voc (manual, witness word): ${b} → ${m}`);
}
// ---- 3a. Qur'an brackets ﴿﴾ where T has them, put on the first and last output word of each bracketed span ----
const tIdx = new Map(T.map((x, i) => [x, i])), t2o = new Map();
out.forEach((o, i) => { const ti = o.f !== null && f2t.has(o.f) ? f2t.get(o.f) : (o.t ? tIdx.get(o.t) : undefined); if (ti !== undefined) t2o.set(ti, i); });
let ayat = 0;
for (let ti = 0; ti < T.length; ti++) {
  if (!/﴿/.test(T[ti].w)) continue;
  let tj = ti; while (tj < T.length && !/﴾/.test(T[tj].w)) tj++;
  const m = []; for (let k = ti; k <= tj; k++) if (t2o.has(k)) m.push(t2o.get(k));
  if (!m.length) { log.push('ayah not placed: ' + T.slice(ti, tj + 1).map(x => x.w).join(' ')); continue; }
  const os = Math.min(...m), oe = Math.max(...m);
  out[os].w = out[os].w.replace(/^(«?)/, '$1﴿');
  out[oe].w = out[oe].w.replace(/([،؛:.؟!»]*)$/, '﴾$1');
  ayat++; ti = tj;
}
log.push('Quran spans bracketed: ' + ayat);
// ---- 3a2. hadith quotations: T prints them in parentheses; they become «…» on the mapped span ----
let quotes = 0;
for (let ti = 0; ti < T.length; ti++) {
  if (!/^[^ء-ي]*[(]/.test(T[ti].w)) continue;
  let tj = ti; while (tj < T.length && !/[)][^ء-ي]*$/.test(T[tj].w)) tj++;
  if (tj - ti > 80) continue;
  const m = []; for (let k = ti; k <= tj; k++) if (t2o.has(k)) m.push(t2o.get(k));
  // «(تعالى)»-type additions of T's manuscripts, and «(رَضِيَ اللهُ عَنْهَا)», are not quotations
  if (m.length < 2 || /^رَضِيَ/.test(T[ti].w.replace(/[(]/, ''))) { ti = tj; continue; }
  const os = Math.min(...m), oe = Math.max(...m);
  out[os].w = out[os].w.replace(/^/, '«');
  out[oe].w = out[oe].w.replace(/([،؛:.؟!﴾]*)$/, '»$1');
  quotes++; log.push('quote: ' + out.slice(os, oe + 1).map(o => o.w).join(' ').slice(0, 120)); ti = tj;
}
log.push('quotations marked: ' + quotes);
// ---- 3b. a letter the base leaves bare gets T's mark on the same letter (same letters only; nothing overwritten) ----
let filled = 0;
for (const o of out) {
  if (o.f === null || !f2t.has(o.f)) continue;
  const t = tstyle(T[f2t.get(o.f)].w), w = fill(o.w, t);
  if (w !== o.w) { log.push(`fill from T: ${o.w} → ${w}`); o.w = w; filled++; }
}
log.push('filled from T: ' + filled);
let filledK = 0;
for (const o of out) {
  if (o.f === null || !f2k.has(o.f)) continue;
  const w = fill(o.w, K[f2k.get(o.f)].w);
  if (w !== o.w) { log.push(`fill from K: ${o.w} → ${w}`); o.w = w; filledK++; }
}
log.push('filled from K: ' + filledK);
// ---- 4. bab headings: T's heading paragraphs, mapped onto the output ----
const t2out = new Map(); out.forEach((o, i) => { if (o.f !== null && f2t.has(o.f)) t2out.set(f2t.get(o.f), i); else if (o.t) t2out.set(T.indexOf(o.t), i); });
const heads = [];
const tParas = JSON.parse(fs.readFileSync(path.join(OUT, 'T.json'), 'utf8')).paras;
for (const hp of tParas.filter(p => p.head)) {
  const idx = T.map((x, i) => x.para === undefined ? -1 : i).filter(i => T[i].para.text === hp.text && T[i].para.page === hp.page);
  const ii = idx.map(i => t2out.get(i)).filter(x => x !== undefined);
  if (!ii.length) throw new Error('heading not found: ' + hp.text);
  heads.push({ s: Math.min(...ii), e: Math.max(...ii), T: hp.text });
}
heads.sort((a, b) => a.s - b.s);
for (const [k, endw] of Object.entries(HEAD_END)) {
  const h = heads[k - 1]; let e = h.e; while (e < h.e + 12 && norm(out[e].w) !== endw) e++;
  if (norm(out[e].w) !== endw) throw new Error('HEAD_END not found for heading ' + k); h.e = e;
}
// ---- 5. vocalization fixes over the whole word list ----
const words = out.map(o => o.w);
const vlog = voc(words); log.push(...vlog);
// ---- 5b. vowel vote: where T and K (al-Kifaya) agree on a letter's marks against the base, theirs are taken ----
const kv = w => voc([w.replace(/[^ء-ي ً-ْٰ]/g, '')])[0];
let voted = 0;
out.forEach((o, i) => {
  if (o.f === null || !f2t.has(o.f) || !f2k.has(o.f)) return;
  const t = [tstyle(T[f2t.get(o.f)].w)], k = [K[f2k.get(o.f)].w];
  // the witnesses get the same connected-speech repairs as the base before comparing (their next word is the base's)
  const nx = words[i + 1] || '';
  const tw = [t[0], nx]; voc(tw); const kw = [k[0], nx]; voc(kw);
  const r = vote(words[i], tw[0], kw[0]);
  if (r.changes.length) { log.push(`vowel vote (T+K): ${words[i]} → ${r.w}`); words[i] = r.w; voted++; }
});
log.push('vowel vote changes: ' + voted);
// ---- 5b2. hand corrections of vowels (manual-vowels.js) ----
for (const [prev, w, to, why, next] of require('./manual-vowels')) {
  let n = 0;
  for (let i = 1; i < words.length; i++) if (words[i] === w && words[i - 1] === prev && (next === undefined || words[i + 1] === next)) { words[i] = to; n++; }
  if (n !== 1) throw new Error(`manual-vowels: «${prev} ${w}» found ${n} times`);
  log.push(`vowel (manual): ${w} → ${to} — ${why}`);
}
// ---- 5c. what still differs from T (for review): K agrees with the base / K has no reading ----
const vcmp = require('./vcmp'), rem = [];
out.forEach((o, i) => {
  if (o.f === null || !f2t.has(o.f)) return;
  const nx = words[i + 1] || '', tw = [tstyle(T[f2t.get(o.f)].w), nx]; voc(tw);
  const d = vcmp(words[i].replace(/[^ء-ي ً-ْٰ]/g, ''), tw[0].replace(/[^ء-ي ً-ْٰ]/g, ''));
  if (!d || !d.length) return;
  const k = f2k.has(o.f) ? K[f2k.get(o.f)].w : '';
  rem.push([i, d.every(x => x.last) ? 'end' : 'inner', k ? 'K' : '-', words[i], tw[0], k, words.slice(Math.max(0, i - 5), i + 4).join(' ')].join('\t'));
});
fs.writeFileSync(path.join(OUT, 'vowel-remaining.tsv'), 'i\twhere\tK\tfinal\tT\tK\tcontext\n' + rem.join('\n') + '\n');
log.push('vowel differences left with T: ' + rem.length);
// ---- 6. chapters and paragraphs ----
const rows = (s, e) => [{ text: words.slice(s, e).join(' ') }];
const chapters = [];
const BASM = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ';
let start = 0;
if (words.slice(0, 4).map(norm).join(' ') === 'بسم الله الرحمن الرحيم') start = 4;
chapters.push({ title: 'مُقَدِّمَةُ الرِّسَالَةِ', paras: paras(rows(start, heads[0].s)) });
heads.forEach((h, k) => {
  const title = words.slice(h.s, h.e + 1).join(' ').replace(/[،:.]+$/, '');
  chapters.push({ title, paras: paras(rows(h.e + 1, k + 1 < heads.length ? heads[k + 1].s : words.length)) });
});
const J = {
  source: 'https://shamela.ws/book/21589 (الفواكه الدواني على رسالة ابن أبي زيد القيرواني للنفراوي، دار الفكر ١٤١٥هـ/١٩٩٥م: نص الرسالة المشكول بأعلى الصفحات)',
  check: 'https://shamela.ws/book/1430 (الرسالة، نسخة التتائي، جمع وتحقيق إبراهيم السناري، معهد المخطوطات العربية ١٤٤٢هـ) + https://shamela.ws/book/11373 (متن الرسالة، دار الفكر) + https://shamela.ws/book/7441 (متن الرسالة بأعلى «الثمر الداني» للآبي، المكتبة الثقافية)؛ والشكل مقابَل بنشرة السناري وبمتن «كفاية الطالب الرباني» https://shamela.ws/book/21597 — انظر risala-sources.md',
  basmala: BASM,
  chapters
};
fs.writeFileSync(path.join(__dirname, '..', 'risala.json'), JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(path.join(OUT, 'witness-words.txt'), out.map((o, i) => o.src !== 'F' ? [i, o.src, words[i], words.slice(Math.max(0, i - 4), i + 3).join(' ')].join('\t') : null).filter(Boolean).join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'build-log.txt'), log.join('\n') + '\n');
const np = chapters.reduce((n, c) => n + c.paras.length, 0), nw = words.length;
const lens = chapters.flatMap(c => c.paras.map(p => p.split(' ').length));
console.log('chapters', chapters.length, 'paras', np, 'words', nw, 'para len min/max', Math.min(...lens), Math.max(...lens));
