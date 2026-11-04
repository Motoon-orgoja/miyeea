// Builds tools/texts/bulugh.json from the raw Shamela pages of book 9111
// (بلوغ المرام، تحقيق سمير بن أمين الزهيري، دار الفلق ط٧ ١٤٢٤هـ — vocalized), pages 3–1522.
// usage: node build.js <raw dir> <out json>
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const toInt = s => parseInt(s.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), 10);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const bare = s => s.replace(/[ً-ٰٟـ]/g, '');
const log = { brackets: [], headfix: [], joined: [], dropped: [], after: [], misc: [] };

// honorifics: Shamela prints most of them unvocalized (symbol font); write them out vocalized
const HON = [
  [/صلى الله عليه وسلم/g, 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'], [/صَلَّى الله عَلَيْهِ وَسَلَّمَ/g, 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'],
  [/رضي الله عنهما/g, 'رَضِيَ اللَّهُ عَنْهُمَا'], [/رضي الله عنهم/g, 'رَضِيَ اللَّهُ عَنْهُمْ'], [/رضي الله عنهن/g, 'رَضِيَ اللَّهُ عَنْهُنَّ'],
  [/رضي الله عنها/g, 'رَضِيَ اللَّهُ عَنْهَا'], [/رضي الله عنه/g, 'رَضِيَ اللَّهُ عَنْهُ'], [/رَضِيَ اللَّهُ عنهما/g, 'رَضِيَ اللَّهُ عَنْهُمَا'],
  [/(^|[^َُِْ])عز وجل/g, '$1عَزَّ وَجَلَّ'], [/عليهما السلام/g, 'عَلَيْهِمَا السَّلَامُ'], [/عليهم السلام/g, 'عَلَيْهِمُ السَّلَامُ'], [/عليه السلام/g, 'عَلَيْهِ السَّلَامُ'],
  [/رحمه الله/g, 'رَحِمَهُ اللَّهُ'], [/تبارك وتعالى/g, 'تَبَارَكَ وَتَعَالَى'], [/سبحانه وتعالى/g, 'سُبْحَانَهُ وَتَعَالَى'],
];
const HONV = 'رَضِيَ اللَّهُ تَعَالَى عَنْهُمَا|رَضِيَ اللَّهُ تَعَالَى عَنْهَا|رَضِيَ اللَّهُ تَعَالَى عَنْهُ|عَزَّ وَجَلَّ|صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ|رَضِيَ اللَّهُ عَنْهُمَا|رَضِيَ اللَّهُ عَنْهُمْ|رَضِيَ اللَّهُ عَنْهُنَّ|رَضِيَ اللَّهُ عَنْهَا|رَضِيَ اللَّهُ عَنْهُ|عَلَيْهِ السَّلَامُ|عَلَيْهِمَا السَّلَامُ|رَحِمَهُ اللَّهُ';

const clean = (h, n) => {
  let t = h.replace(/<a [\s\S]*?<\/a>/g, '')
    .replace(/([٠-٩]+ - و )<span class="c2">(\([٠-٩]+\))<\/span>/, '$1$2')   // «٧٦٠ - و (٧٦١)»: a second number, not a footnote
    .replace(/<span class="c2">\s*\([٠-٩0-9]+\)\s*<\/span>/g, ' ')      // footnote marks
    .replace(/<span class="c3">\{([^}]*)\}<\/span>/g, '﴿$1﴾')          // Qur'an
    .replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"');
  t = t.replace(/\{([^}]*)\}/g, '﴿$1﴾');
  t = t.replace(/⦗[٠-٩]+⦘/g, ' ');                                     // printed page numbers
  t = t.replace(/(?<!و)\s\([٠-٩]+\)(?=\s|$|[.،,])/g, ' ').replace(/(?<!و)\s\([٠-٩]+\)$/g, '');   // stray footnote marks
  t = t.replace(/\[[٠-٩]+\]\s*-?/g, m => { log.misc.push(n + ': حذف ' + m.trim()); return ''; });   // editor's cross refs «[٩٧]-»
  // the editor's verse references «﴾ [البقرة: ١١٥]» / «﴾ البقرة: ١١٥» are not text
  t = t.replace(/(\}|﴾)((?:\s*الآية)?)\s*\[?\s*\(?[ء-يً-ْ]+:\s*[٠-٩]+\)?\]?/g, (m, a, b) => { log.misc.push(n + ': حذف الإحالة ' + m.slice(1).trim()); return a + b; });
  // one-letter brackets: the editor restored a letter of the next/previous word — rejoin it
  const LET = [[/\[أَ\] ونَهَارٍ/, 'أَوْ نَهَارٍ'], [/\[(?:وَ|و)\]\s*/, 'وَ'], [/\[أَ\]\s*/, 'أَ'], [/ـ\[ـهُ\]/, 'هُ'], [/\s*\[هُ\]/, 'هُ'], [/\[فـ\]\s*/, 'فَ']];
  for (const [a, b] of LET) t = t.replace(new RegExp(a.source, 'g'), m => { log.brackets.push(n + '\t' + m.trim() + ' → ' + b + ' (حرف ملحق بالكلمة)'); return b; });
  // editor's brackets: words the editor added from the other manuscript / the source — keep the words, drop the brackets
  t = t.replace(/\[([^\]]*)\]/g, (m, x) => { log.brackets.push(n + '\t' + x); return x; });
  // «وَ عَنْ», «وَ لَكِنْ»: a detached conjunction is a typing slip
  t = t.replace(/(^|\s)وَ\s+(?=[ء-ي])/g, (m, a) => { log.misc.push(n + ': وصل «وَ» المنفصلة'); return a + 'وَ'; });
  // two short pieces printed unvocalized
  t = t.replace(/وأشار إلِيه البخاري/, () => { log.misc.push(n + ': شكل «وَأَشَارَ إِلَيْهِ الْبُخَارِيُّ» (غير مشكول في المصدر)'); return 'وَأَشَارَ إِلَيْهِ الْبُخَارِيُّ'; })
    .replace(/(مِنَ التَّمْرِ) لا (يُعْلَمُ)/, (m, a, b) => { log.misc.push(n + ': شكل «لَا» (غير مشكولة)'); return a + ' لَا ' + b; });
  for (const [a, b] of HON) t = t.replace(a, b);
  // dashes printed around the honorifics are typography, not text
  t = t.replace(new RegExp('\\s*-\\s*(' + HONV + ')\\s*-?(?=[\\s:،,.;؛]|$)', 'g'), ' $1');
  t = t.replace(new RegExp('(' + HONV + ')\\s*-\\s*', 'g'), '$1 ');
  t = t.replace(/بِـ\s*([(﴿])/g, 'بِ$1');   // «بِـ (ق)»: tatweel joining the preposition to a quoted sura name
  t = t.replace(/,/g, '،').replace(/;/g, '؛').replace(/\?/g, '؟');
  return t.replace(/\s+/g, ' ').replace(/\s+([.،؛:؟!»)\]﴾])/g, '$1').replace(/([«﴿(])\s+/g, '$1').replace(/»\s*\./g, '».').trim();
};

const HEAD = /^(كتاب|باب|أبواب|فصل|أحاديث في)/;
// heading case endings that are plainly wrong in the source (lahn); fixed and logged
const HEADFIX = [['كتَابُ', 'كِتَابُ'], [/^بَاب /, 'بَابُ '], [/^كِتَاب /, 'كِتَابُ '], ['الزَّكَاةُ', 'الزَّكَاةِ'], ['صَلَاةُ الْجُمُعَةِ', 'صَلَاةِ الْجُمُعَةِ'],
  ['صَوْمُ التَّطَوُّعِ', 'صَوْمِ التَّطَوُّعِ'], ['وَقَتْلُ الْمُرْتَدِّ', 'وَقَتْلِ الْمُرْتَدِّ'], ['الْجِزْيَةَ وَالْهُدْنَةَ', 'الْجِزْيَةِ وَالْهُدْنَةِ'],
  ['الْأَيْمَانُ وَالنُّذُورُ', 'الْأَيْمَانِ وَالنُّذُورِ'], [/:$/, '']];

const paras = [];
for (let p = 2; p <= 1522; p++) {
  const d = fs.readFileSync(path.join(dir, p + '.html'), 'utf8').split('<hr')[0].split('class="hamesh"')[0];
  d.split(/<p[ >]/).slice(1).forEach(h => {
    h = h.split('</p>')[0];
    const t = clean(h, 'ص' + p);
    if (t) paras.push({ pg: p, t });
  });
}

const J = {
  source: 'https://shamela.ws/book/9111 (بلوغ المرام من أدلة الأحكام، تحقيق وتخريج سمير بن أمين الزهيري، دار الفلق، الرياض، ط٧ ١٤٢٤هـ؛ ترقيم الشاملة موافق للمطبوع؛ مشكول) ص ٣–١٥٢٢',
  check: 'بلوغ المرام، تحقيق د. ماهر ياسين الفحل (دار القبس ١٤٣٥هـ؛ OpenITI Sham19Y0017757) + بلوغ المرام، تحقيق محمد حامد الفقي (١٣٤٧هـ؛ OpenITI ShamAY0034283) — مقابلة آلية كلمة بكلمة؛ وقوبل الشكل بنسخة sunnah.com/bulugh. انظر bulugh-sources.md',
  notes: 'n = ترقيم نشرة الزهيري (١ إلى ١٥٨٢). label = الرقم كما طُبع حين يجمع الحديثُ رقمين («١٨٩ و١٩٠») أو يكون زيادة من النسخة «أ» («٢٠٣ (أ)»). rawi = ما قبل أول « (أو حتى أول «قال:» إن لم يكن في الحديث تنصيص). takh = عبارة التخريج والحكم في آخر الحديث (أخرجه/رواه/متفق عليه/وصححه…)، وما قبلها من تخريجات الروايات المتوسطة باقٍ في matn بترتيب المتن. after = كلام المصنف بعد حديث ليس منه (إحالة على باب). intro = مقدمة المصنف (غير مشكولة في المصدر).',
  intro: [], chapters: [] };

let kitab = null, chap = null, h = null, last = 0, stop = false;
for (const x of paras) {
  let t = x.t;
  if (stop) { log.dropped.push(x.pg + ': ' + t); continue; }
  if (/^آخِرُ الْكِتَابِ/.test(t)) { stop = true; log.dropped.push(x.pg + ': ' + t); continue; }
  // copyist's colophon at the middle of the book (p. 766)
  if (/^(قَالَ مُصَنِّفُهُ حَافِظُ|آخِرُ الْجُزْءِ الْأَوَّلِ|يَتْلُوهُ فِي الْجُزْءِ)/.test(t)) { log.dropped.push(x.pg + ': ' + t); continue; }
  const b = bare(t);
  if (HEAD.test(b) && t.split(' ').length < 12 && !/^[٠-٩]/.test(t)) {
    let tt = t; for (const [a, r] of HEADFIX) tt = tt.replace(a, r);
    if (tt !== t) log.headfix.push(t + ' → ' + tt);
    t = tt;
    if (/^كتاب/.test(b)) { kitab = t; chap = { title: t, group: t, hadiths: [] }; J.chapters.push(chap); }
    else {
      // «أحاديث في النكاح/الطلاق» directly after the kitab heading: the kitab chapter takes that title
      if (chap && chap.title === kitab && !chap.hadiths.length) J.chapters.pop();
      chap = { title: t, group: kitab, hadiths: [] }; J.chapters.push(chap);
    }
    h = null; continue;
  }
  // «١٨٩ - و ١٩٠ -», «٧٦٠ - و (٧٦١)», «٩٣٦ - و (٩٣٧) -», «٢٠٣ - (أ)»
  const m = t.match(/^([٠-٩]+)\s*-\s*(?:و\s*\(?([٠-٩]+)\)?\s*-?\s*)?(?:\((أ|ب)\)\s*)?(.*)$/);
  if (m) {
    const k = toInt(m[1]), k2 = m[2] && toInt(m[2]), sub = m[3];
    if (sub ? k !== last : k !== last + 1) throw new Error('numbering: after ' + last + ' got ' + k + (sub || '') + ' p' + x.pg);
    last = k2 || k;
    h = { n: k };
    if (k2) h.label = AR(k) + ' و' + AR(k2);
    if (sub) h.label = AR(k) + ' (' + sub + ')';
    h.matn = m[4].trim(); h.pg = x.pg;
    chap.hadiths.push(h); continue;
  }
  // author's line under a heading («بَابُ الْإِقْرَارِ — فِيهِ الَّذِي قَبْلَهُ وَمَا أَشْبَهَهُ»)
  if (!h) { if (!kitab) J.intro.push(t); else { chap.note = (chap.note ? chap.note + ' ' : '') + t; log.after.push(chap.title + ' (تحت العنوان): ' + t); } continue; }
  if (/^وَبَابُ /.test(t)) { h.after = (h.after ? h.after + ' ' : '') + t; log.after.push(h.n + ': ' + t); continue; }
  t = t.replace(/^-\s*/, '');
  h.matn += ' ' + t; log.joined.push(h.n + ' (ص' + x.pg + '): ' + t.slice(0, 50));
}

// ---- split rawi / matn / takh
// formulas matched without regard to harakat («مُتَّفَقٌ عَلَيْه» is sometimes printed short)
const fl = w => w.split('').map(c => c === ' ' ? '\\s+' : c + '[\\u064B-\\u0652\\u0670]*').join('');
const TAKH = '(?:' + fl('و') + ')?(?:' + ['أخرجه', 'أخرجهما', 'أخرجاه', 'رواه', 'رواهما', 'متفق عليه', 'صححه', 'حسنه', 'ضعفه', 'إسناده', 'بإسناد', 'أخرج'].map(fl).join('|') + ')';
const takhAt = s => {
  // takh = the attribution after the last closing quote mark (or, without quotes, the last sentence starting with a takh formula)
  const close = Math.max(s.lastIndexOf('»'), s.lastIndexOf('﴾'));
  const re = new RegExp('(^|[.»﴾؛:،]\\s*|\\s)(' + TAKH + ')(?=[\\s،.]|$)', 'g');
  let mm, cands = [];
  while ((mm = re.exec(s))) cands.push(mm.index + mm[1].length);
  cands = cands.filter(i => i > close);
  if (!cands.length) return -1;
  if (close >= 0) return cands[0];
  // no quote marks: first takh formula that starts a sentence (after «. » or at a «-» dash), else the last candidate
  const sent = cands.filter(i => /[.\-]\s*$/.test(s.slice(0, i)));
  return sent.length ? sent[0] : cands[cands.length - 1];
};
const stats = { noTakh: [], noRawi: [] };
for (const c of J.chapters) for (const x of c.hadiths) {
  let s = x.matn; delete x.matn;
  const i = takhAt(s);
  let takh = '';
  if (i > 0) { takh = s.slice(i).trim(); s = s.slice(0, i).trim(); } else stats.noTakh.push(x.n);
  s = s.replace(/\s*-\s*$/, '');
  let rawi = '';
  let q = -1; for (const mm of s.matchAll(/«([^«»]*)»/g)) { if (mm[1].trim().split(/\s+/).length > 2) { q = mm.index; break; } } if (q < 0 && !/«[^«»]*»/.test(s)) q = s.indexOf('«');
  if (q > 0 && s.slice(0, q).split(' ').length <= 45) { rawi = s.slice(0, q).trim(); s = s.slice(q); }
  else if (q < 0) {
    const c2 = s.search(/:\s/);
    if (c2 > 0 && s.slice(0, c2).split(' ').length <= 25) { rawi = s.slice(0, c2 + 1).trim(); s = s.slice(c2 + 1).trim(); }
    else { const r = s.match(new RegExp('^(.{0,200}?(?:' + HONV + '))\\s')); if (r) { rawi = r[1]; s = s.slice(r[0].length); } }
  }
  if (!rawi) stats.noRawi.push(x.n);
  const pg = x.pg; delete x.pg;
  Object.assign(x, { rawi, matn: s, takh });
  if (!takh) delete x.takh;
  // re-order keys
  const o = { n: x.n }; if (x.label) o.label = x.label; o.rawi = x.rawi; o.matn = x.matn; if (x.takh) o.takh = x.takh; if (x.after) o.after = x.after;
  for (const k of Object.keys(x)) delete x[k]; Object.assign(x, o);
}
const all = J.chapters.flatMap(c => c.hadiths);
// word-level corrections (typing slips and plain lahn in the digital copy); each must apply exactly once
const FIXES = [
  [1265, 'الْأَ نْصَارِيِّ', 'الْأَنْصَارِيِّ', 'كلمة مقطوعة بمسافة'],
  [1271, 'رَ ضِيَ', 'رَضِيَ', 'كلمة مقطوعة بمسافة'],
  [1152, 'وتَقَدَّمَ', 'وَتَقَدَّمَ', 'واو بلا حركة'],
  [1236, 'شَرِيكَ بْنُ', 'شَرِيكَ بْنَ', 'لحن: «ابن» نعت لاسم «أنّ» المنصوب'],
  [1104, 'عِرْقًا', 'عَرَقًا', 'العَرَق: المِكْتَل (كما في حديث المجامع في رمضان)؛ «عِرْق» لا يستقيم معنى'],
  [544, 'ِللْبُخَارِيِّ', 'لِلْبُخَارِيِّ', 'حركة اللام قبلها'],
  [1066, 'إِرْسَالَه ُ', 'إِرْسَالَهُ', 'حركة منفصلة بمسافة'],
  [1257, 'وَالْحَاكِم ُ', 'وَالْحَاكِمُ', 'حركة منفصلة بمسافة'],
  [1312, 'ِبهَا', 'بِهَا', 'حركة الباء قبلها'],
  [1327, 'عَمْرِو ٍ', 'عَمْرٍو', 'تنوين منفصل: عَمْرٍو'],
  [1328, 'مَسْجِد ٍ بَنِي', 'مَسْجِدِ بَنِي', 'حركة منفصلة، والكلمة مضافة'],
  [335, 'و: (', 'وَ: (', 'واو بلا حركة'],
  // found by comparing the harakat with sunnah.com/bulugh (vocal.js); each is the only possible reading
  [61, 'وَلَيَالِيَهِنَّ', 'وَلَيَالِيَهُنَّ', 'هاء الضمير بعد ياء مفتوحة مضمومة'],
  [267, 'هَصَرَ ظَهْرَهِ', 'هَصَرَ ظَهْرَهُ', 'مفعول به، والهاء بعد فتح مضمومة'],
  [272, 'يُخْتِمُ', 'يَخْتِمُ', 'خَتَمَ يَخْتِمُ (ثلاثي)'],
  [305, 'يَقْنَتُونَ', 'يَقْنُتُونَ', 'قَنَتَ يَقْنُتُ'],
  [1321, 'فَحَقَنَ دَمَهِ', 'فَحَقَنَ دَمَهُ', 'مفعول به، والهاء بعد فتح مضمومة'],
  [1333, 'فَأَكلُهُ', 'فَأَكْلُهُ', 'سكون ناقص (مصدر: أَكْلُه حرام)'],
  [289, 'وَلِلطَّبرَانِيِّ', 'وَلِلطَّبَرَانِيِّ', 'فتحة ناقصة'],
  [1559, 'إِلهَ', 'إِلَهَ', 'فتحة ناقصة'],
  [21, 'وعَنْ', 'وَعَنْ', 'فتحة ناقصة'],
  [32, 'وأَحْمَدُ', 'وَأَحْمَدُ', 'فتحة ناقصة'],
  [266, 'وهلِّلْهُ', 'وَهَلِّلْهُ', 'فتحتان ناقصتان'],
  [326, 'لمُسْلِمٍ', 'لِمُسْلِمٍ', 'كسرة ناقصة'],
  [330, 'فلْيُتِمَّ', 'فَلْيُتِمَّ', 'فتحة ناقصة'],
  [1201, 'ومُحَيِّصَةَ', 'وَمُحَيِّصَةَ', 'فتحة ناقصة'],
];
// «بنِ/بنُ» printed without the sukun on the ba (1–2 per hadith): completed everywhere
for (const h of all) for (const f of ['rawi', 'matn', 'takh']) if (h[f] && /(^|\s)بن[ِ]/.test(h[f])) {
  h[f] = h[f].replace(/(^|\s)بن([ُِ])/g, (m, a, v) => { log.misc.push(h.n + ': بن' + v + ' → بْن' + v + ' (سكون ناقص)'); return a + 'بْن' + v; });
}
for (const h of all) for (const f of ['rawi', 'matn', 'takh']) if (h[f] && /(^|\s)بنُ/.test(h[f])) h[f] = h[f].replace(/(^|\s)بنُ/g, (m, a) => { log.misc.push(h.n + ': بنُ → بْنُ (سكون ناقص)'); return a + 'بْنُ'; });
for (const [n, a, b, why] of FIXES) {
  const h = all.find(x => x.n === n); let k = 0;
  for (const f of ['rawi', 'matn', 'takh']) if (h[f] && h[f].includes(a)) { h[f] = h[f].replace(a, b); k++; }
  if (k !== 1) throw new Error('fix ' + n + ' ' + a + ' applied ' + k);
  log.misc.push(n + ': ' + a + ' → ' + b + ' (' + why + ')');
}
fs.writeFileSync(out, JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(path.join(__dirname, 'out', 'build-log.txt'), [
  '# headings fixed', ...log.headfix, '', '# editor brackets kept (number\\tcontent)', ...log.brackets, '', '# misc', ...log.misc,
  '', '# after-notes', ...log.after, '', '# dropped (colophons, editor epilogue)', ...log.dropped,
  '', '# paragraphs joined to the previous hadith', ...log.joined,
  '', '# no takh found', stats.noTakh.join(' '), '', '# no rawi', stats.noRawi.join(' ')].join('\n') + '\n');
console.log('entries', all.length, 'last n', last, 'chapters', J.chapters.length, 'kutub', new Set(J.chapters.map(c => c.group)).size,
  'brackets', log.brackets.length, 'noTakh', stats.noTakh.length, 'noRawi', stats.noRawi.length, 'intro', J.intro.length);
