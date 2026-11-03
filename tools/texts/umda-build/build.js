// Builds tools/texts/umda.json from the raw Shamela pages of book 538 (عمدة الأحكام، ت عبد المحسن القاسم), pages 110–418.
// usage: node build.js <raw dir> <out json>
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const toInt = s => parseInt(s.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), 10);
// the honorifics are printed unvocalized (a symbol font on Shamela); write them out vocalized
const HON = [
  [/صلى الله عليه وسلم/g, 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'],
  [/رضي الله عنهما/g, 'رَضِيَ اللَّهُ عَنْهُمَا'], [/رضي الله عنهم/g, 'رَضِيَ اللَّهُ عَنْهُمْ'], [/رضي الله عنهن/g, 'رَضِيَ اللَّهُ عَنْهُنَّ'],
  [/رضي الله عنها/g, 'رَضِيَ اللَّهُ عَنْهَا'], [/رضي الله عنه/g, 'رَضِيَ اللَّهُ عَنْهُ'],
  [/عز وجل/g, 'عَزَّ وَجَلَّ'], [/عليهما السلام/g, 'عَلَيْهِمَا السَّلَامُ'], [/عليهم السلام/g, 'عَلَيْهِمُ السَّلَامُ'], [/عليه السلام/g, 'عَلَيْهِ السَّلَامُ'],
  [/رحمه الله/g, 'رَحِمَهُ اللَّهُ'], [/تبارك وتعالى/g, 'تَبَارَكَ وَتَعَالَى'], [/سبحانه وتعالى/g, 'سُبْحَانَهُ وَتَعَالَى'], [/(^|\s)تعالى(?=[\s،.:؛]|$)/g, '$1تَعَالَى'],
];
const clean = h => {
  let t = h.replace(/<a [\s\S]*?<\/a>/g, '')
    .replace(/<span class="c2">\s*\([٠-٩0-9]+\)\s*<\/span>/g, '')   // footnote marks
    .replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"');
  // Qur'an quotations; in the Friday-prayer hadith the source drops the closing brace of «هل أتى على الإنسان»
  t = t.replace(/\{([^}]*)\}/g, '﴿$1﴾').replace(/\{([^}«»]*?)\s*(?=»)/g, '﴿$1﴾');
  for (const [a, b] of HON) t = t.replace(a, b);
  // the editor's dotted line after a half-quoted verse (#214) is dropped
  // «بِـ ﴿…﴾»: the tatweel joining the preposition to a quoted sura is dropped (no tatweel in the app texts)
  return t.replace(/\s*\.{4,}/g, '').replace(/بِـ\s*﴿/g, 'بِ﴿').replace(/\s+/g, ' ').replace(/\s+([.،؛:؟!»)])/g, '$1').replace(/([«﴿(])\s+/g, '$1').trim();
};
// paragraphs in order; a paragraph cut by a page break is joined back
const paras = [];
for (let p = 110; p <= 418; p++) {
  const d = fs.readFileSync(path.join(dir, p + '.html'), 'utf8').split('<hr')[0].split('class="hamesh"')[0];
  d.split(/<p[ >]/).slice(1).forEach((h, k) => {
    h = h.split('</p>')[0];
    const rawi = (h.match(/<span class="c5">([\s\S]*?)<\/span>/) || [])[1];
    const t = clean(h); if (!t || /^\*[\s*]*$/.test(t) || /^تم بحمد الله$/.test(t.replace(/[ً-ْ]/g, ''))) return;
    const prev = paras[paras.length - 1];
    if (k === 0 && prev && !/[.»:؟!﴾]$/.test(prev.t) && !/^[٠-٩]+ -/.test(t) && !/^(كِتَابُ|بَابُ|بَابٌ)/.test(t)) { prev.t += ' ' + t; prev.joined = (prev.joined || []).concat(p); return; }
    paras.push({ pg: p, t, rawi: rawi && clean(rawi) });
  });
}
// classify
const isHead = t => /^(كِتَابُ|بَابُ|بَابٌ)/.test(t) && t.split(' ').length < 12;
const depth = t => (t.match(/«/g) || []).length - (t.match(/»/g) || []).length;
const TAKH = /^(وَ)?(أَخْرَجَهُ|ذَكَرَهُ|رَوَاهُ|أَخْرَجَ|ذَكَرَ)/;
const VAR = /^(وَفِي|وَلِ|وَلَهُ|وَلَهُمَا|زَادَ|وَعَنْ|وَعَنِ|قَالَ|وَقَالَ|وَأَنَّ|وَكَانَتْ|وَفِيهِ|وَحَدِيثُ|ثُمَّ|فَ)/;
const J = {
  source: 'https://shamela.ws/book/538 (عمدة الأحكام، تحقيق عبد المحسن بن محمد القاسم، محققة على نسخ عليها إجازة المصنف؛ مشكولة بالكامل) ص ١١٠–٤١٨',
  check: 'العمدة في الأحكام، تحقيق سمير الزهيري (مكتبة المعارف ١٤١٨هـ؛ OpenITI Sham19Y0017103) + متن العمدة داخل «إحكام الأحكام» لابن دقيق العيد (OpenITI Shamela0001665) — مقابلة آلية كلمة بكلمة، انظر umda-sources.md',
  notes: 'n = ترقيم نشرة القاسم (٤١٤ حديثًا، والروايات تابعة لحديثها). rawi = ما ميّزه المحقق بلون (الصحابي والإسناد) أو ما قبل أول «. gharib = شرح المصنف للغريب وتعليقاته بعد الحديث (من المتن، مفصول عن المتن ليُحفظ أو يُترك). takh = عبارات العزو القليلة التي في المتن (ذكره مسلم بتمامه…). intro = مقدمة المصنف.',
  intro: [], chapters: [] };
let kitab = null, chap = null, h = null, open = 0, n = 0;
const log = { gharib: [], takh: [], joined: [] };
for (const x of paras) {
  const t = x.t;
  if (x.joined) log.joined.push(x.pg + '→' + x.joined.join(','));
  if (isHead(t)) { open = 0;
    if (/^كِتَابُ/.test(t)) { kitab = t; chap = { title: t, group: t, hadiths: [] }; J.chapters.push(chap); }
    else { if (chap && chap.title === kitab && !chap.hadiths.length) J.chapters.pop(); chap = { title: t, group: kitab, hadiths: [] }; J.chapters.push(chap); }
    h = null; continue;
  }
  const m = t.match(/^([٠-٩]+) - (.*)$/);
  if (m && toInt(m[1]) === n + 1) {
    const k = toInt(m[1]); if (k !== ++n) throw new Error('numbering ' + n + ' vs ' + k);
    let body = m[2], rawi = '';
    if (x.rawi && body.startsWith(x.rawi)) { rawi = x.rawi; body = body.slice(x.rawi.length).trim(); }
    else { const i = body.indexOf('«'); if (i > 0) { rawi = body.slice(0, i).trim(); body = body.slice(i); } }
    h = { n: k, rawi, matn: body }; chap.hadiths.push(h); open = depth(t); continue;
  }
  if (!h) { J.intro.push(t); continue; }
  if (open === 0 && !t.includes('«') && TAKH.test(t)) { h.takh = (h.takh ? h.takh + ' ' : '') + t; log.takh.push(h.n + ': ' + t); }
  else if (open === 0 && !t.includes('«') && !VAR.test(t)) { h.gharib = (h.gharib ? h.gharib + ' ' : '') + t; log.gharib.push(h.n + ': ' + t); }
  else h.matn += ' ' + t;
  open += depth(t); if (open < 0) open = 0;
}
// a hadith whose lead-in ends a page (208, 276): split at the first quote mark
for (const c of J.chapters) for (const x of c.hadiths) if (!x.rawi) { const i = x.matn.indexOf('«'); if (i > 0 && x.matn.slice(0, i).split(' ').length < 40) { x.rawi = x.matn.slice(0, i).trim(); x.matn = x.matn.slice(i); } }
fs.writeFileSync(out, JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(out.replace(/\.json$/, '.build-log.txt'), ['# joined across pages', ...log.joined, '', '# takh', ...log.takh, '', '# gharib', ...log.gharib].join('\n') + '\n');
console.log('hadiths', n, 'chapters', J.chapters.length, 'gharib', log.gharib.length, 'takh', log.takh.length);
