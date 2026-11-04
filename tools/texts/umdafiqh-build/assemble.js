// Second half of build.js: turns the corrected token stream into ../umdafiqh.json (chapters = الأبواب, group = الكتاب).
// run through: node build.js
const fs = require('fs');
const { out, rows, fixVoc } = require('./build.js');
const C = { I: JSON.parse(fs.readFileSync(__dirname + '/out/align-idda.json', 'utf8')), Z: JSON.parse(fs.readFileSync(__dirname + '/out/align-azzuz.json', 'utf8')) };
const notes = []; // structural edits, for sources.md
// ---- row texts
const byRow = new Map();
for (const x of out) { if (!byRow.has(x.r)) byRow.set(x.r, []); byRow.get(x.r).push(x); }
const HON = [
  [/[-–]?\s*صلى الله عليه وسلم\s*[-–]?/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ '],
  [/[-–]?\s*رضي الله عنهما\s*[-–]?/g, ' رَضِيَ اللهُ عَنْهُمَا '], [/[-–]?\s*رضي الله عنها\s*[-–]?/g, ' رَضِيَ اللهُ عَنْهَا '],
  [/[-–]?\s*رضي الله عنهم\s*[-–]?/g, ' رَضِيَ اللهُ عَنْهُمْ '], [/[-–]?\s*رضي الله عنه\s*[-–]?/g, ' رَضِيَ اللهُ عَنْهُ '],
  [/[-–]?\s*عليه السلام\s*[-–]?/g, ' عَلَيْهِ السَّلَامُ '],
];
const bareW = t => t.replace(/[ً-ْ«﴿(]/g, '');
// fatha on a letter written with no mark before a plain long alif (the base leaves the lam of «لا» and some others bare:
// الصَّلاةِ → الصَّلَاةِ, لا → لَا); not on و/ي (plural alif, long vowels) nor on ب/ل before the article (بِالْ، لِلْ).
const alifFatha = w => w.replace(/(^|[ء-ي«﴿(][ً-ْ]*)([ب-ه])(?=ا(?![ً-ْ]))/g, (m, p, c, off, str) => {
  if (/[بل]/.test(c) && str[off + m.length + 1] === 'ل' && /^[وف]?$/.test(bareW(str.slice(0, off + p.length)))) return m;
  return p + c + 'َ';
});
const AYAT = [ // Qur'anic quotations checked against the Mushaf: only joins / endings the base had wrong
  [/مِنْ الْهَدْيِ/g, 'مِنَ الْهَدْيِ'], [/نَكَحْتُمْ الْمُؤْمِنَاتِ/g, 'نَكَحْتُمُ الْمُؤْمِنَاتِ'], [/يُؤَاخِذُكُمْ اللَّهُ/g, 'يُؤَاخِذُكُمُ اللَّهُ'],
  [/أَوْ الْوَالِدَيْنِ/g, 'أَوِ الْوَالِدَيْنِ'], [/قَوْلاً سَدِيداً \* يُصْلِحْ/g, 'قَوْلًا سَدِيدًا يُصْلِحْ'],
];
const clean = s => {
  s = s.replace(/\(\s*[*\d٠-٩]+\s*\)/g, ' ').replace(/\((آل عمران|النساء|الأحزاب): [\d،]+\)?،?/g, ' ').replace(/الآيَتَيْنِ\)/g, 'الآيَتَيْنِ،');
  for (const [re, v] of HON) s = s.replace(re, v);
  for (const [a, b] of AYAT) s = s.replace(a, b);
  s = s.replace(/عز وجل/g, 'عَزَّ وَجَلَّ').replace(/لا(َّ|َّ)/g, 'لَّا').replace(/لاَ/g, 'لَا').replace(/(^|[\s«(])([وفبل]?[َِ]?)ال(ا)ِ/g, '$1$2الِ$3').replace(/(^|[\s«(])([وفب]?[َِ]?)لِلا(ِ)?/g, '$1$2لِلِا').replace(/(^|\s)للهِ/g, '$1لِلَّهِ').replace(/(^|[\s«(])([وف]َ?)?بال/g, '$1$2بِال')
    // more marks the base leaves out where only one reading is possible: fatha before a final alif maqsura (عَلى → عَلَى),
    // ذلِكَ → ذَلِكَ, the preposition lam before hamza/alif (لأَنَّ → لِأَنَّ, لاِمْرَأَتِهِ → لِامْرَأَتِهِ)
    .replace(/([ب-ي])(?=ى(?![ً-ْ]))/g, '$1َ').replace(/([َ])َ/g, '$1')
    .replace(/ذلِكَ/g, 'ذَلِكَ').replace(/(^|[\s«(])([وف]َ?)?ل(?=[أإآ])/g, '$1$2لِ').replace(/(^|[\s«(])([وف]َ?)?لاِ/g, '$1$2لِا');
  s = fixVoc(s).replace(/\{/g, '﴿').replace(/\}/g, '﴾').split(' ').map(alifFatha).join(' ');
  return s.replace(/\s+/g, ' ').replace(/ ([،.؛:؟!»﴾)])/g, '$1').replace(/([«﴿(]) /g, '$1').replace(/([،؛:])(?=[^\s»﴾)])/g, '$1 ')
    .replace(/([.،؛:])\1+/g, '$1').replace(/^[،.؛:\s]+/, '').trim();
};
const FX = require('./fixes.js'), FXused = new Set();
const R = [];
for (const r of rows) {
  const toks = byRow.get(r); if (!toks) continue;
  const text = FX.apply(clean(toks.map(t => t.o).join(' ')), FXused);
  if (!text) continue;
  R.push({ r, toks, text });
}
// ---- structure
const bare = t => t.replace(/[ً-ْ]/g, '');
const isKitab = s => /^كتاب /.test(bare(s)) && s.split(' ').length <= 6;
const isBab = s => /^باب /.test(bare(s)) && s.split(' ').length <= 12;
const TITLE_FIX = { // titles typed without (full) vocalization or with a misprint in the base (keys without harakat)
  'باب الربا': 'بَابُ الرِّبَا', 'باب القرض': 'بَابُ الْقَرْضِ', 'باب صيام التطوع': 'بَابُ صِيَامِ التَّطَوُّعِ',
  'باب المحرمات في النكاح': 'بَابُ الْمُحَرَّمَاتِ فِي النِّكَاحِ', 'باب نكاح الكفار': 'بَابُ نِكَاحِ الْكُفَّارِ',
  'باب الهدي والأضحية': 'بَابُ الْهَدْيِ وَالْأُضْحِيَّةِ', 'باب كفارة القتل': 'بَابُ كَفَّارَةِ الْقَتْلِ',
  'باب حد السرقة': 'بَابُ حَدِّ السَّرِقَةِ', 'باب سجدتي السهو': 'بَابُ سَجْدَتَيِ السَّهْوِ', 'كتاب النكاح': 'كِتَابُ النِّكَاحِ',
};
const titleVoc = t => (TITLE_FIX[bare(t)] || t).replace(/^بابُ/, 'بَابُ').replace(/^كِتابُ/, 'كِتَابُ').replace(/^بَابُ ما /, 'بَابُ مَا ');
const chapters = [];
let group = 'مُقَدِّمَةُ الْمَتْنِ', ch = { title: 'مُقَدِّمَةُ الْمَتْنِ', group, rows: [] }, basmala = null;
chapters.push(ch);
for (const x of R) {
  let s = x.text.replace(/[.:]$/, '').trim();
  if (!basmala && /^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ$/.test(s)) { basmala = s; continue; }
  if (isKitab(s)) { s = titleVoc(s); group = s; ch = { title: s, group, rows: [] }; chapters.push(ch); continue; }
  if (isBab(s)) {
    s = titleVoc(s);
    if (ch.title === 'مُقَدِّمَةُ الْمَتْنِ' && /الْمِيَاهِ/.test(s)) { group = 'كِتَابُ الطَّهَارَةِ'; notes.push('أُضيف عنوان «كِتَابُ الطَّهَارَةِ» قبل باب أحكام المياه (ليس في متن وبل الغمامة، وهو في العدة وعزوز وابن تيمية).'); }
    if (ch.group === group && ch.title === group && !ch.rows.length) chapters.pop(); // kitab title directly followed by a bab
    ch = { title: s, group, rows: [] }; chapters.push(ch); continue;
  }
  const f = x.toks.find(t => t.t && t.t.a >= 0);
  if (/^فَصْلٌ/.test(s) && s.split(' ').length <= 14 && !/[،؛]/.test(s.replace(/:$/, ''))) {
    // the base prints the commentator's own sub-heading «فَصْلٌ فِي …»; only the word فصل is matn (when the copies have it)
    const a = f.t.a, inCopies = C.I.M[a] || C.Z.M[a];
    notes.push((inCopies ? 'فصل: أُبقيت كلمة «فَصْلٌ» وحُذف وصف الشارح: ' : 'حُذف عنوان الشارح (لا «فصل» في النسختين هنا): ') + s);
    if (inCopies) ch.rows.push({ fasl: true, text: 'فَصْلٌ:' });
    continue;
  }
  ch.rows.push({ text: x.text });
}
// ---- paragraphs
const words = s => s.split(' ').filter(Boolean);
const DD = require('./dedup.js'), DDused = new Set();
function paras(rows0) {
  // join the plain rows between فصل marks, so a repeat broken across rows can be removed
  const rowsIn = [];
  for (const r of rows0) { if (r.fasl || !rowsIn.length || rowsIn[rowsIn.length - 1].fasl) rowsIn.push({ ...r }); else rowsIn[rowsIn.length - 1].text += ' ' + r.text; }
  rowsIn.forEach(r => { if (!r.fasl) r.text = DD.apply(r.text, DDused); });
  const P = [];
  let units = []; // sentences: arrays of words; a fasl starts a new paragraph
  const flushUnits = () => { pack(units, P); units = []; };
  let buf = [], depth = 0;
  for (const r of rowsIn) {
    if (r.fasl) { if (buf.length) units.push(buf); buf = []; flushUnits(); buf = ['فَصْلٌ:']; continue; }
    for (const w of words(r.text)) {
      buf.push(w);
      depth += (w.match(/[«﴿]/g) || []).length - (w.match(/[»﴾]/g) || []).length;
      if (depth <= 0 && /[.؟!]["»﴾)]*$/.test(w)) { units.push(buf); buf = []; depth = 0; }
    }
  }
  if (buf.length) units.push(buf);
  flushUnits();
  return P.map(p => p.join(' '));
}
function splitLong(u, anyDepth) { // a sentence over 40 words: cut at «؛» then «،» (outside quotes), pieces of at least 8 words
  if (u.length <= 40) return [u];
  const cuts = []; let d = 0;
  u.forEach((w, i) => { d += (w.match(/[«﴿]/g) || []).length - (w.match(/[»﴾]/g) || []).length; if ((d <= 0 || anyDepth) && i < u.length - 1) { if (/؛$/.test(w)) cuts.push([i, 2]); else if (/[،:]$/.test(w)) cuts.push([i, 1]); } });
  let best = null;
  for (const [i, pr] of cuts) { const a = i + 1, b = u.length - a; if (a < 8 || b < 8) continue; const sc = pr * 100 - Math.abs(a - b); if (!best || sc > best[1]) best = [i, sc]; }
  if (!best) return anyDepth ? [u] : splitLong(u, true); // a long hadith: cut inside the quotation
  return [...splitLong(u.slice(0, best[0] + 1), anyDepth), ...splitLong(u.slice(best[0] + 1), anyDepth)];
}
function pack(units, P) {
  let cur = [];
  for (const u0 of units) for (const u of splitLong(u0)) {
    if (cur.length && (cur.length + u.length > 40 || (cur.length >= 8 && cur.length + u.length > 30))) { P.push(cur); cur = []; }
    cur = cur.concat(u);
  }
  if (cur.length) {
    if (cur.length < 8 && P.length && P[P.length - 1].length + cur.length <= 48 && P[P.length - 1][0] !== undefined) P[P.length - 1] = P[P.length - 1].concat(cur);
    else P.push(cur);
  }
}
// the base vocalizes the author's preface only in part; its wording is kept and the vocalization completed by me (sources.md)
const INTRO = [
  'الْحَمْدُ لِلَّهِ أَهْلِ الْحَمْدِ وَمُسْتَحِقِّهِ، حَمْدًا يَفْضُلُ عَلَى كُلِّ حَمْدٍ، كَفَضْلِ اللَّهِ عَلَى خَلْقِهِ.',
  'وَأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، شَهَادَةَ قَائِمٍ لِلَّهِ بِحَقِّهِ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، غَيْرَ مُرْتَابٍ فِي صِدْقِهِ، صَلَّى اللَّهُ عَلَيْهِ، وَعَلَى آلِهِ وَصَحْبِهِ، مَا جَادَ سَحَابٌ بِوَدْقِهِ، وَمَا رَعَدَ بَعْدَ بَرْقِهِ.',
  'هَذَا كِتَابُ أَحْكَامٍ فِي الْفِقْهِ، اخْتَصَرْتُهُ حَسَبَ الْإِمْكَانِ، وَاقْتَصَرْتُ فِيهِ عَلَى قَوْلٍ وَاحِدٍ؛ لِيَكُونَ عُمْدَةً لِقَارِئِهِ، وَلَا يَلْتَبِسَ عَلَيْهِ الصَّوَابُ بِاخْتِلَافِ الْوُجُوهِ وَالرِّوَايَاتِ.',
  'سَأَلَنِي بَعْضُ أَصْحَابِنَا تَلْخِيصَهُ؛ لِيَقْرُبَ عَلَى الْمُتَعَلِّمِينَ، وَيَسْهُلَ حِفْظُهُ عَلَى الطَّالِبِينَ؛ فَأَجَبْتُهُ إِلَى ذَلِكَ، مُعْتَمِدًا عَلَى اللَّهِ سُبْحَانَهُ فِي إِخْلَاصِ الْقَصْدِ لِوَجْهِهِ الْكَرِيمِ، وَالْمَعُونَةِ عَلَى الْوُصُولِ إِلَى رِضْوَانِهِ الْعَظِيمِ، وَهُوَ حَسْبُنَا وَنِعْمَ الْوَكِيلُ.',
  'وَأَوْدَعْتُهُ أَحَادِيثَ صَحِيحَةً؛ تَبَرُّكًا بِهَا، وَاعْتِمَادًا عَلَيْهَا، وَجَعَلْتُهَا مِنَ الصِّحَاحِ؛ لِأَسْتَغْنِيَ عَنْ نِسْبَتِهَا إِلَيْهَا.',
];
// words the base left without any vocalization (my vocalization, from the grammar of the sentence; listed in sources.md)
const WORDFIX = [
  [/حَبَسْتَنِي، قوله وَهُوَ/, 'حَبَسْتَنِي، وَهُوَ'], // «قوله» = the commentator's word left at the head of the page
  [/الأَرْبَعَةِ الأخرى/, 'الأَرْبَعَةِ الأُخْرَى'], [/زَادَ البنون/, 'زَادَ الْبَنُونَ'],
  [/مَعَ الإخوة وَالأَخَوَاتِ لِلأَبَوَيْنِ/, 'مَعَ الإِخْوَةِ وَالأَخَوَاتِ لِلأَبَوَيْنِ'], [/وَسَقَطَ الإخوة.(?=s|$)/, 'وَسَقَطَ الإِخْوَةُ.'],
  [/إِسْقَاطِ الإخوة/, 'إِسْقَاطِ الإِخْوَةِ'], [/وَبَنِي الإخوة،/, 'وَبَنِي الإِخْوَةِ،'], [/فَصَاعِدًا مِنَ الإخوة/, 'فَصَاعِدًا مِنَ الإِخْوَةِ'],
  [/كَبَنِي الإخوة/, 'كَبَنِي الإِخْوَةِ'], [/وَسَقَطَ الإخوة لِلأَبَوَيْنِ/, 'وَسَقَطَ الإِخْوَةُ لِلأَبَوَيْنِ'], [/وَبَنَاتُ الإخوة/, 'وَبَنَاتُ الإِخْوَةِ'],
  [/وَبَنُو الإخوة/, 'وَبَنُو الإِخْوَةِ'], [/الآخر (?=عَلَى)/, 'الآخَرِ '], [/وَالإخوة/g, 'وَالإِخْوَةُ'], [/قَبْلِ اختيارهَا/, 'قَبْلَ اخْتِيَارِهَا'], [/بِنسبَ،/, 'بِنَسَبٍ،'], [/وَبوْلُ/, 'وَبَوْلُ'], [/الآخر (?=مَمْلُوكاً)/, 'الآخَرَ '], [/بالزنَا/, 'بِالزِّنَا'], [/بالذِّمِّيِّ/, 'بِالذِّمِّيِّ'],
  [/رَسُولُ الله /, 'رَسُولُ اللهِ '], [/وَفِي الأشل/, 'وَفِي الأَشَلِّ'],
];
const J = {
  source: 'https://shamela.ws/book/145206 = https://ketabonline.com/ar/books/97048 (وبل الغمامة في شرح عمدة الفقه، عبد الله بن محمد الطيار، دار الوطن ١٤٢٩–١٤٣٢هـ، ٨ مجلدات: المتن المشكول بأعلى كل صفحة)',
  check: 'العدة شرح العمدة لبهاء الدين المقدسي (دار الحديث ١٤٢٤هـ = shamela 10908 / ketabonline 599) + عمدة الفقه ت. أحمد عزوز (المكتبة العصرية ١٤٢٥هـ = shamela 11315 / ketabonline 827) + نصوص المتن في شرح العمدة لابن تيمية (عطاءات العلم = shamela 151، الطهارة–الحج) + اقتباسات الشارح «قوله…» داخل وبل الغمامة — انظر umdafiqh-sources.md',
  basmala: basmala || 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', // printed at the head of the preface in the base
  chapters: chapters.filter(c => c.rows.length).map(c => ({ title: c.title, group: c.group, paras: c.title === 'مُقَدِّمَةُ الْمَتْنِ' ? INTRO : paras(c.rows).map(p => { for (const [a, b] of WORDFIX) p = p.replace(a, b); return require("./vocfix.js")(p); }) })),
};
fs.writeFileSync(__dirname + '/../umdafiqh.json', JSON.stringify(J, null, 1) + '\n');
FX.FIXES.forEach(([a], i) => { if (!FXused.has(i)) console.log('FIX NOT APPLIED:', a); });
DD.DEDUP.forEach(([a], i) => { if (!DDused.has(i)) console.log('DEDUP NOT APPLIED:', a.slice(0, 40)); });
fs.writeFileSync(__dirname + '/out/structure-notes.txt', notes.join('\n') + '\n');
const P = J.chapters.flatMap(c => c.paras), W = P.flatMap(words);
const len = P.map(p => words(p).length);
console.log('chapters', J.chapters.length, 'groups', new Set(J.chapters.map(c => c.group)).size, 'paras', P.length, 'words', W.length,
  'short<8', len.filter(n => n < 8).length, 'long>40', len.filter(n => n > 40).length);
const ar = W.filter(w => /[ء-ي]/.test(w));
console.log('vocalized words', ar.filter(w => /[ً-ْ]/.test(w)).length, 'of', ar.length);
