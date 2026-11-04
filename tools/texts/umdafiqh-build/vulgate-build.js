// Final step of the common-text edition: applies the hand vocalization (manual-voc-*.js) to the words vulgate.js left
// without marks, rebuilds titles and paragraphs, and writes ../umdafiqh.json.  usage: node vulgate-build.js
const fs = require('fs');
const { FW } = require('./vulgate.js');
const { runs } = require('./unvoc.js');
const { E, parse } = require('./voc-check.js');
const { norm } = require('./align.js');
const { paras } = require('./paras.js');
const MK = /[ً-ْ]/;
const core = o => (o.match(/[ء-ي][ء-يً-ْٰ]*/g) || []).join('');
const put = (x, w) => { // write word w (with its own punctuation, if any) into token x, keeping x's quotes/punctuation otherwise
  const pre = x.o.match(/^[^ء-ي]*/)[0], suf = x.o.match(/[^ء-يً-ْٰ]*$/)[0];
  const wpre = w.match(/^[^ء-ي]*/)[0], wsuf = w.match(/[^ء-يً-ْٰ]*$/)[0];
  let s = (wpre || pre) + core(w) + (wsuf || suf);
  if (pre.includes('«') && !s.includes('«')) s = '«' + s; if (suf.includes('»') && !s.includes('»')) s = s.replace(/([^ء-يً-ْ]*)$/, '»$1');
  x.o = s;
};
const stats = { hand: 0, handWords: 0, changed: [], pre: 0, next: 0 };
// ---- apply, from the last run backwards so indices stay valid
const T = FW.slice(), ORIG = FW.map(x => x.o);
for (let k = runs.length - 1; k >= 0; k--) {
  const [a, b] = runs[k], p = parse(E[k]);
  const ws = p.s ? p.s.split(' ').filter(Boolean) : [];
  if (p.next) { const nw = p.next[1].split(' '); for (let i = 0; i < p.next[0]; i++) put(T[b + 1 + i], nw[i]); stats.next += p.next[0]; }
  if (ws.length === b - a + 1) ws.forEach((w, i) => { put(T[a + i], w); T[a + i].voc = 'M'; });
  else { // wording mended by hand: new tokens; a heading at the end of the run keeps its words
    const old = T.slice(a, b + 1), tl = old.filter(x => x.title);
    const nt = ws.map((w, i) => ({ t: 'w', o: w, src: 'M', voc: 'M', title: (i >= ws.length - tl.length) ? tl[i - (ws.length - tl.length)].title : undefined }));
    T.splice(a, b - a + 1, ...nt);
  }
  if (p.pre) { const pw = p.pre[1].split(' '); for (let i = 0; i < p.pre[0]; i++) put(T[a - p.pre[0] + i], pw[i]); stats.pre += p.pre[0]; }
  stats.hand++; stats.handWords += ws.length;
  if (p.bang) stats.changed.push(ORIG.slice(a, b + 1).join(' ') + ' ← ' + (p.s || '(حذف)'));
}
// ---- I printed its headings inline: drop a copy of a heading's words standing right after (or before) the heading
for (let i = 0; i < T.length; i++) {
  if (!T[i].title || (T[i - 1] && T[i - 1].title === T[i].title)) continue;
  let j = i; while (T[j + 1] && T[j + 1].title === T[i].title) j++;
  const tn = T.slice(i, j + 1).map(x => norm(x.o)).join(' '), n = j - i + 1;
  const after = T.slice(j + 1, j + 1 + n), before = T.slice(i - n, i);
  if (after.every(x => !x.title) && after.map(x => norm(x.o)).join(' ') === tn) T.splice(j + 1, n);
  else if (i - n >= 0 && before.every(x => !x.title) && before.map(x => norm(x.o)).join(' ') === tn) { T.splice(i - n, n); i -= n; }
}
// words W gave marks to right after a word whose wording differs from W: their case ending may need a look
fs.writeFileSync(__dirname + '/out/boundary-words.txt', T.map((x, i) => (x.voc === 'W' && T[i - 1] && T[i - 1].voc === 'M') ? T.slice(Math.max(0, i - 3), i).map(y => y.o).join(' ') + ' ⟨' + x.o + '⟩ ' + T.slice(i + 1, i + 3).map(y => y.o).join(' ') : null).filter(Boolean).join('\n') + '\n');
const unv = T.filter(x => /[ء-ي]/.test(x.o) && !MK.test(x.o));
// ---- structure
const INTRO = [
  'الْحَمْدُ لِلَّهِ أَهْلِ الْحَمْدِ وَمُسْتَحِقِّهِ، حَمْدًا يَفْضُلُ عَلَى كُلِّ حَمْدٍ، كَفَضْلِ اللَّهِ عَلَى خَلْقِهِ.',
  'وَأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، شَهَادَةَ قَائِمٍ لِلَّهِ بِحَقِّهِ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، غَيْرَ مُرْتَابٍ فِي صِدْقِهِ، صَلَّى اللَّهُ عَلَيْهِ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ، مَا جَادَ سَحَابٌ بِوَدْقِهِ، وَمَا رَعَدَ بَعْدَ بَرْقِهِ.',
  'أَمَّا بَعْدُ: فَهَذَا كِتَابٌ فِي الْفِقْهِ، اخْتَصَرْتُهُ حَسَبَ الْإِمْكَانِ، وَاقْتَصَرْتُ فِيهِ عَلَى قَوْلٍ وَاحِدٍ؛ لِيَكُونَ عُمْدَةً لِقَارِئِهِ، فَلَا يَلْتَبِسُ الصَّوَابُ عَلَيْهِ بِاخْتِلَافِ الْوُجُوهِ وَالرِّوَايَاتِ.',
  'سَأَلَنِي بَعْضُ إِخْوَانِي تَلْخِيصَهُ؛ لِيَقْرُبَ عَلَى الْمُتَعَلِّمِينَ، وَيَسْهُلَ حِفْظُهُ عَلَى الطَّالِبِينَ، فَأَجَبْتُهُ إِلَى ذَلِكَ، مُعْتَمِدًا عَلَى اللَّهِ سُبْحَانَهُ فِي إِخْلَاصِ الْقَصْدِ لِوَجْهِهِ الْكَرِيمِ، وَالْمَعُونَةِ عَلَى الْوُصُولِ إِلَى رِضْوَانِهِ الْعَظِيمِ، وَهُوَ حَسْبُنَا وَنِعْمَ الْوَكِيلُ.',
  'وَأَوْدَعْتُهُ أَحَادِيثَ صَحِيحَةً؛ تَبَرُّكًا بِهَا، وَاعْتِمَادًا عَلَيْهَا، وَجَعَلْتُهَا مِنَ الصِّحَاحِ؛ لِأَسْتَغْنِيَ عَنْ نِسْبَتِهَا إِلَيْهَا.',
];
const tidy = s => s.replace(/\s+/g, ' ').replace(/ ([،.؛:؟!»﴾)])/g, '$1').replace(/([«﴿(]) /g, '$1').replace(/([.،؛:])\1+/g, '$1').replace(/\{/g, '﴿').replace(/\}/g, '﴾').trim();
const chapters = []; let group = null, ch = null, rows = [], cur = [];
const flushRow = () => { if (cur.length) rows.push({ text: tidy(cur.map(x => x.o).join(' ')) }); cur = []; };
const close = () => { flushRow(); if (ch) { ch.rows = rows; chapters.push(ch); } rows = []; };
let first = true;
for (let i = 0; i < T.length; i++) {
  const x = T[i];
  if (x.title) {
    let j = i; while (T[j + 1] && T[j + 1].title === x.title) j++;
    const t = tidy(T.slice(i, j + 1).map(y => y.o).join(' ')).replace(/[.:،]$/, ''), b = norm(T[i].o);
    i = j;
    if (first) { first = false; if (ch === null) { ch = { title: 'مُقَدِّمَةُ الْمَتْنِ', group: 'مُقَدِّمَةُ الْمَتْنِ', intro: true }; } }
    if (b === 'فصل') { flushRow(); rows.push({ fasl: true, text: 'فَصْلٌ:' }); continue; }
    if (b === 'كتاب') { close(); group = t; ch = { title: t, group }; continue; }
    if (ch && ch.title === group && !rows.length && !cur.length) { ch = { title: t, group }; continue; } // kitab title right before a bab
    close(); ch = { title: t, group: group || t }; continue;
  }
  if (!ch) ch = { title: 'مُقَدِّمَةُ الْمَتْنِ', group: 'مُقَدِّمَةُ الْمَتْنِ', intro: true };
  if (/^فَصْلٌ:?$/.test(core(x.o) ? x.o.replace(/[^ء-يً-ْ:]/g, '') : '') && cur.length) { flushRow(); rows.push({ fasl: true, text: 'فَصْلٌ:' }); continue; }
  cur.push(x);
}
close();
// last touches: no punctuation inside a Qur'anic quotation; stray marks
const POST = [[/أوْ/g, 'أَوْ'], [/خَيْراً﴾/g, 'خَيْرًا﴾'], [/إِصْلاحاً﴾/g, 'إِصْلَاحًا﴾'], [/،\)/g, '،'], [/إِلَّا الْمَكْتُوبَةُ وَإِذَا/g, 'إِلَّا الْمَكْتُوبَةُ». وَإِذَا']];
const post = p => { p = p.replace(/﴿[^﴾]*﴾/g, q => q.replace(/[،؛.:]/g, '').replace(/\s+/g, ' ')); for (const [a, b] of POST) p = p.replace(a, b); return p; };
const J = {
  source: 'عمدة الفقه ت. أحمد محمد عزوز (المكتبة العصرية ١٤٢٥هـ) = https://shamela.ws/book/11315 = https://ketabonline.com/ar/books/827 — اللفظ المتداول، مقابلًا بمتن «العدة شرح العمدة» (https://shamela.ws/book/10908)',
  check: 'الشكل منقول كلمةً كلمةً من متن «وبل الغمامة» المشكول (https://shamela.ws/book/145206، انظر umdafiqh.wabl.json) حيث اتفق اللفظ في ثلاث كلمات متتالية فأكثر، والباقي مكمَّل بالذكاء الاصطناعي — انظر umdafiqh-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  chapters: chapters.filter(c => c.intro || c.rows.some(r => !r.fasl)).map(c => ({ title: c.title, group: c.group, paras: c.intro ? INTRO : paras(c.rows).map(post) })),
};
fs.writeFileSync(__dirname + '/../umdafiqh.json', JSON.stringify(J, null, 1) + '\n');
const P = J.chapters.flatMap(c => c.paras), W = P.join(' ').split(' ').filter(w => /[ء-ي]/.test(w));
const L = P.map(p => p.split(' ').length);
const src = { W: 0, M: 0, H: 0, Z: 0 }; T.forEach(x => { if (/[ء-ي]/.test(x.o)) src[x.voc || (MK.test(x.o) ? 'Z' : 'none')] = (src[x.voc || (MK.test(x.o) ? 'Z' : 'none')] || 0) + 1; });
fs.writeFileSync(__dirname + '/out/vulgate-changed.txt', stats.changed.reverse().join('\n') + '\n');
console.log(JSON.stringify({ chapters: J.chapters.length, groups: new Set(J.chapters.map(c => c.group)).size, babs: J.chapters.filter(c => /^بَابُ/.test(c.title)).length,
  paras: P.length, words: W.length, minLen: Math.min(...L), maxLen: Math.max(...L), unvocalized: W.filter(w => !MK.test(w)).length,
  marksFrom: src, handRuns: stats.hand, handWords: stats.handWords, mendedRuns: stats.changed.length, nextFixed: stats.next, prevFixed: stats.pre }));
