// Builds ../dalil.json from the collated words (collate.js -> out/tokens.json).  usage: node collate.js && node build.js
// Structure: كتاب = group; each باب is a chapter; a كتاب's text before its first باب is a chapter titled with the كتاب.
// «فصل» starts a paragraph «فَصْلٌ:», or «فَصْلٌ في …:» for the 19 titled فصول that M (the matn printed alone) has too
// (collate.js reduces the other «فصل في …» of F's index and of N's editor to the bare «فصل»).
// Cleaning: F's editorial brackets [ ] dropped (the words stay: the vote kept them, so M or N has them), «,» -> «،»,
// «كـ: x» -> «كx» (no tatweel), corrections of fixes.js; paragraphs by umdafiqh-build/paras.js (8–40 words, cut at «.»).
const fs = require('fs'), path = require('path');
const { paras } = require('./paras.js'); // umdafiqh-build/paras.js, a long list with no punctuation may also be cut before any و/ف word or «ثم»
const { norm } = require('../umdafiqh-build/align.js');
const T = require('./out/tokens.json'), FIX = require('./fixes.js');
const log = { headingTail: [], subtitles: [], tatweel: 0 };

// 1. words -> rows {kind:'kitab'|'bab'|'fasl'|'text', text}
const rows = []; let k = 0;
const isTitleStart = w => /^(كتاب|باب)$/.test(norm(w));
while (k < T.length) {
  const t = T[k];
  if (t.title === 'kitab' || t.title === 'bab') {
    const run = []; while (k < T.length && T[k].title === t.title && (run.length === 0 || !isTitleStart(T[k].o))) run.push(T[k++]);
    // words before «باب/كتاب» belong to the text before; a word ending in «:» or «.» and what follows start the text after
    let a = run.findIndex(x => isTitleStart(x.o));
    if (a < 0) { rows.push({ kind: 'text', text: run.map(x => x.o).join(' ') }); log.headingTail.push('not a heading: ' + run.map(x => x.o).join(' ')); continue; }
    if (a > 0) { rows.push({ kind: 'text', text: run.slice(0, a).map(x => x.o).join(' ') }); log.headingTail.push('before: ' + run.slice(0, a).map(x => x.o).join(' ')); }
    let b = run.findIndex((x, i) => i > a && /[:.]$/.test(x.o)); if (b < 0) b = run.length;
    if (b < run.length && /\.$/.test(run[b].o) && !/^(و?هي|و?هو)/.test(norm(run[b].o)) && run.slice(b + 1).length === 0) b++; // «… الآنية.»: the full stop of the heading itself
    const head = run.slice(a, b).map(x => x.o.replace(/[.:]$/, '')).join(' ');
    rows.push({ kind: t.title, text: head });
    if (b < run.length) { rows.push({ kind: 'text', text: run.slice(b).map(x => x.o).join(' ') }); log.headingTail.push(head + ' || ' + run.slice(b).map(x => x.o).join(' ')); }
    continue;
  }
  if (t.title === 'fasl' && norm(t.o) === 'فصل') {
    k++; const sub = []; while (k < T.length && T[k].title === 'fasl' && norm(T[k].o) !== 'فصل') sub.push(T[k++].o);
    if (sub.length) log.subtitles.push('فصل ' + sub.join(' '));
    rows.push({ kind: 'fasl', sub: sub.join(' ').replace(/[.:]$/, '') }); continue;
  }
  if (norm(t.o) === 'فصل' && (t.line || (T[k - 1] && /[.:]$/.test(T[k - 1].o)))) { // a bare «فصل» line of the text (M/N's «فصل» taken in by the vote)
    k++; const sub = []; while (k < T.length && T[k].title === 'fasl' && norm(T[k].o) !== 'فصل') sub.push(T[k++].o);
    if (sub.length) log.subtitles.push('فصل ' + sub.join(' '));
    rows.push({ kind: 'fasl', sub: sub.join(' ').replace(/[.:]$/, '') }); continue;
  }
  if (t.src === 'manual' && norm(t.o) === 'خاتمه') { rows.push({ kind: 'bab', text: 'خاتمة' }); k++; continue; }
  // body words (a stray fasl flag on a body word is ignored)
  const last = rows[rows.length - 1];
  if (last && last.kind === 'text' && !t.line) last.text += ' ' + t.o; else rows.push({ kind: 'text', text: t.o });
  k++;
}

// 1b. titled فصول that F prints as a bare «فصل» followed by the title as text (their wording as M prints it), and F's
//     index entry «[فصل في الجمع]» whose «في» the vote lost (M: «فصل في الجمع»)
const M_TITLES = ['في ذوي الأرحام', 'فيما يسقط الصداق وينصفه ويقرره', 'فيما يلحق من النسب', 'فيما إذا وصل بالإقرار ما يغيره'];
rows.forEach((r, i) => {
  if (r.kind !== 'fasl') return;
  if (r.sub === 'الجمع') { r.sub = 'في الجمع'; log.subtitles.push('فصل في الجمع («في» restored)'); return; }
  const nx = rows[i + 1]; if (r.sub || !nx || nx.kind !== 'text') return;
  const w = nx.text.split(' ');
  for (const t of M_TITLES) { const n = t.split(' ').length;
    if (w.slice(0, n).map(x => norm(x)).join(' ') === t.split(' ').map(norm).join(' ')) { r.sub = w.slice(0, n).join(' ').replace(/[.:]$/, ''); nx.text = w.slice(n).join(' '); log.subtitles.push('فصل ' + r.sub + ' (title printed as text in F)'); } }
});
// 2. cleaning of the text rows
const clean = s => s.normalize('NFC').replace(/\.\.+/g, '.').replace(/[\[\]]/g, '').replace(/,/g, '،').replace(/\s+([.:،؛؟])/g, '$1').replace(/\s+/g, ' ').trim()
  .replace(/([كلبف][َُِ]?)ـ:?\s+/g, (m, p) => { log.tatweel++; return p; });
// a mark printed on a long alif (N: «إلاَّ», «لاَ», «حالًاّ», «الماَءَ») belongs to the letter before it: «إلَّا», «لَا», «حالًّا», «الماءَ»
const alif = s => s.replace(/([ء-ي])([ً-ْ]*)ا([ًٌٍَُِّْ]+)/g, (m, c, pm, am) => {
  let o = pm; if (am.includes('ّ') && !o.includes('ّ')) o = 'ّ' + o;
  const v = am.replace('ّ', ''); if (v && !/[ًٌٍَُِْ]/.test(pm)) o += v;
  log.alif = (log.alif || 0) + 1; return c + o + 'ا';
});
// final ى for ي in F's digital copy, and stray marks on a final ى (from N): whole words only
const WORD_FIX = { 'وهى': 'وهي', 'وفى': 'وفي', 'والمصلِّى': 'والمصلِّي', 'وبالقُدْسى': 'وبالقُدْسي', 'ويكفى': 'ويكفي', 'ويكفىٍ': 'ويكفي',
  'قَضَىٍ': 'قَضَى', 'رمىٌ': 'رميٌ', 'إلىٍ': 'إلى', 'علىْ': 'على', 'والأوانى': 'والأواني', 'ليشترى': 'ليشتري', 'تشتهى': 'تشتهي', 'مدّعى': 'مدّعي' };
const wfix = s => s.split(' ').map(w => { const m = w.match(/^(.*?)([.:،؛؟]*)$/); if (WORD_FIX[m[1]]) { log.wordFix = (log.wordFix || 0) + 1; return WORD_FIX[m[1]] + m[2]; } return w; }).join(' ');
for (const r of rows) if (r.text) r.text = wfix(alif(clean(r.text)));

// 3. sections, then fixes on each section's joined text
const sections = []; let cur = { title: 'مُقَدِّمَةُ الْمُصَنِّفِ', group: 'مُقَدِّمَةُ الْمُصَنِّفِ', rows: [] }, group = null;
const close = () => { if (cur && cur.rows.length) sections.push(cur); };
for (const r of rows) {
  if (r.kind === 'kitab') { close(); group = r.text; cur = { title: r.text, group, rows: [] }; continue; }
  if (r.kind === 'bab') { close(); cur = { title: r.text, group, rows: [] }; continue; }
  if (r.kind === 'fasl') { cur.rows.push({ fasl: true, text: r.sub ? 'فَصْلٌ ' + clean(r.sub) + ':' : 'فَصْلٌ:' }); continue; }
  cur.rows.push({ text: r.text });
}
close();
const used = FIX.map(() => 0);
for (const s of sections) for (const r of s.rows) FIX.forEach(([a, b], i) => { while (r.text.includes(a)) { r.text = r.text.replace(a, b); used[i]++; } });
FIX.forEach(([a, , n], i) => { if (used[i] !== n) { console.error('fix applied', used[i], 'times, expected', n, ':', a); process.exitCode = 1; } });

const J = {
  source: 'دليل الطالب لنيل المطالب: ت. أبي قتيبة نظر محمد الفاريابي (دار طيبة ١٤٢٥هـ) = https://shamela.ws/book/11196، مقابلًا بطبعة المكتب الإسلامي (١٣٨٩هـ) = https://ketabonline.com/ar/books/10785 وبالمتن في «نيل المآرب» ت. الأشقر (مكتبة الفلاح ١٤٠٣هـ) = https://shamela.ws/book/96876',
  check: 'قوبلت النسخ الثلاث كلمةً كلمةً بسكربت، وأُخذ في كل خلاف ما اتفق عليه اثنان منها، والشكل الجزئي من متن «نيل المآرب» — انظر dalil-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  chapters: sections.map(s => ({ title: s.title.normalize('NFC'), group: s.group.normalize('NFC'), paras: paras(s.rows).map(p => p.normalize('NFC')) })),
};
fs.writeFileSync(path.join(__dirname, '../dalil.json'), JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(path.join(__dirname, 'out/build-log.json'), JSON.stringify(log, null, 1));
const P = J.chapters.flatMap(c => c.paras), L = P.map(p => p.split(' ').length), W = P.join(' ').split(' ').filter(w => /[ء-ي]/.test(w));
const letters = W.join('').replace(/[^ء-ي]/g, '').length, marks = (W.join('').match(/[ً-ْ]/g) || []).length;
console.log(JSON.stringify({ chapters: J.chapters.length, groups: new Set(J.chapters.map(c => c.group)).size, babs: J.chapters.filter(c => /^ب/.test(c.title)).length,
  fusul: P.filter(p => /^فَصْلٌ/.test(p)).length, paras: P.length, words: W.length, minLen: Math.min(...L), maxLen: Math.max(...L),
  short: L.filter(n => n < 8).length, long: L.filter(n => n > 40).length, wordsWithMarks: W.filter(w => /[ً-ْ]/.test(w)).length,
  marksPerLetter: +(marks / letters).toFixed(3), faslTitles: log.subtitles.length, headingTails: log.headingTail.length, tatweel: log.tatweel }));
