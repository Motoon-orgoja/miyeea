// SUPERSEDED (first version, al-Qasim recension; kept for reference - the delivered file is built by build2.js). Builds a json from raw/tahawiyya/qasim.txt.
// usage: node build.js <qasim.txt> <out.json>
const fs = require('fs');
const [src, out] = process.argv.slice(2);
// NFC: canonical order of the marks (the source mixes shadda+fatha and fatha+shadda)
let L = fs.readFileSync(src, 'utf8').normalize('NFC').split('\n').filter(Boolean);
L.unshift(''); // 1-based like the line listing in the report
// ---- split long lines at a sentence start (the second part begins with the given words) ----
const SPLIT = { 25: 'فَمَنْ سَمِعَهُ', 28: 'لَا نَدْخُلُ فِي ذَلِكَ', 29: 'فَمَنْ رَامَ', 41: 'فَمَنْ سَأَلَ', 47: 'وَذَلِكَ مِنْ عَقْدِ', 111: 'ثُمَّ لِعُمَرَ' };
// ---- corrections (each one is listed in tahawiyya-sources.md) ----
const FIX0 = [
  [/\s*\([٠-٩]+\)/g, ''],                       // footnote markers
  [/^- /, ''],                                  // list bullet before أبي حنيفة
  [/\s*ـ\.$/, '.'],                             // closing dash of that list (line 7)
  [/ ـ /g, ' – '], [/ ـ([:،.])/g, ' –$1'],     // tatweel used as a dash
  [/‍/g, ''],
  [/يُسْئَلُ/g, 'يُسْأَلُ'],
  [/مَرْيَمَ _ج/g, 'مَرْيَمَ عَلَيْهِ السَّلَامُ'],
  [/يَسْتَحِلُّهُ/g, 'يَسْتَحِلَّهُ'],
  [/بُرَأَئُ/g, 'بُرَآءُ'],
  [/وَنَدْعُوا/g, 'وَنَدْعُو'],
  [/لَيْسَ فيه /g, 'لَيْسَ فِيهِ '],
  [/الَّتي/g, 'الَّتِي'], [/الِاسْتِطَاعَةُ التي/g, 'الِاسْتِطَاعَةُ الَّتِي'],
  [/وَهُوَ جلَّ جَلَالُهُ/g, 'وَهُوَ جَلَّ جَلَالُهُ'],
  [/والتَّابِعِينَ/g, 'وَالتَّابِعِينَ'],
  [/عَلَى أحَدِ/g, 'عَلَى أَحَدِ'],
  [/لِعَليِّ/g, 'لِعَلِيِّ'],
  [/دِينُ الإِسْلَام،/g, 'دِينُ الإِسْلَامِ،'],
  [/وَالأَرضِ/g, 'وَالأَرْضِ'],
  [/بِالرُّؤْيةِ/g, 'بِالرُّؤْيَةِ'],
  [/وَالاِسْتِسْلَامِ/g, 'وَالِاسْتِسْلَامِ'],
  [/لَقَدِ التَمَسَ/g, 'لَقَدِ الْتَمَسَ'],
  [/وُجُوهٌ يَوْمَئِذٍ نَّاضِرَةٌ \* إِلَى/g, 'وُجُوهٌ يَوْمَئِذٍ نَّاضِرَةٌ ۝ إِلَى'],
  [/\{/g, '﴿'], [/\}/g, '﴾'],
  [/\s+/g, ' '],
];
const FIX = FIX0.map(([a, b]) => [typeof a === 'string' ? a.normalize('NFC') : new RegExp(a.source.normalize('NFC'), a.flags), b.normalize('NFC')]);
for (const k in SPLIT) SPLIT[k] = SPLIT[k].normalize('NFC');
const hits = FIX.map(() => 0);
L = L.map(l => FIX.reduce((s, [a, b], k) => { const m = s.match(a); if (m) hits[k] += a.global ? m.length : 1; return s.replace(a, b); }, l).trim());
FIX.forEach(([a], k) => { if (!hits[k]) throw new Error('fix never applied: ' + a); });
console.log('fix hits', hits.join(' '));
const piece = (n, part) => {
  if (!SPLIT[n]) return L[n];
  const i = L[n].indexOf(SPLIT[n]); if (i < 0) throw new Error('split not found ' + n);
  return part === 'a' ? L[n].slice(0, i).trim() : L[n].slice(i).trim();
};
// ---- paragraphs: lists of source lines (n or 'na'/'nb' for halves) ----
const P = s => s.split(' ').map(g => g.split('+'));
const CH = [
  ['مقدمة المتن', '2+3+4+5+6 7+8'],
  ['التوحيد وصفات الله', '9+10 11+12 13+14 15+16 17 18'],
  ['الخلق والمشيئة', '19 20 21'],
  ['النبي صلى الله عليه وسلم', '22 23'],
  ['القرآن كلام الله', '24 25a 25b 26'],
  ['الرؤية والتسليم', '27 28a 28b 29a 29b 30'],
  ['التنزيه', '31 32'],
  ['المعراج والحوض والشفاعة والميثاق', '33 34+35 36'],
  ['القدر', '37 38 39+40 41a 41b 42 43 44 45 46 47a 47b 48'],
  ['العرش والكرسي والإيمان بالملائكة والكتب', '49 50 51'],
  ['أهل القبلة', '52 53+54+55 56+57 58+59 60+61 62'],
  ['الإيمان', '63+64 65 66+67 68 69 70'],
  ['أهل الكبائر', '71 72+73 74 75 76'],
  ['الجماعة وولاة الأمر', '77+78 79 80 81 82 83+84 85+86 87'],
  ['الملائكة والقبر واليوم الآخر', '88+89 90 91 92 93+94 95'],
  ['الاستطاعة وأفعال العباد', '96+97 98 99+100 101 102'],
  ['الدعاء وانتفاع الأموات', '103+104 105+106'],
  ['الصحابة والخلافة', '107 108+109+110 111a 111b 112 113 114'],
  ['العلماء والأولياء', '115 116 117'],
  ['أشراط الساعة', '118+119 120+121'],
  ['دين الإسلام والخاتمة', '122 123+124 125 126 127+128'],
];
const used = new Set();
const chapters = CH.map(([title, spec]) => ({ title, paras: P(spec).map(g => g.map(x => {
  const m = x.match(/^(\d+)([ab]?)$/); const n = +m[1]; used.add(x);
  return piece(n, m[2]);
}).join(' ')) }));
// every source line 2..128 used exactly once (129 «تَمَّ بِحَمْدِ اللهِ» is the print's colophon)
for (let n = 2; n <= 128; n++) {
  const k = SPLIT[n] ? [n + 'a', n + 'b'] : [String(n)];
  for (const x of k) if (!used.has(x)) throw new Error('line not used: ' + x);
}
const J = {
  source: 'https://shamela.ws/book/574/121 (متون طالب العلم - المستوى الرابع، جمع وتحقيق د. عبد المحسن القاسم، ط5 1440هـ: «العقيدة الطحاوية» مشكولة، محققة على 13 نسخة خطية)',
  check: 'https://shamela.ws/book/9568 (العقيدة الطحاوية شرح وتعليق الألباني، المكتب الإسلامي ط2 1414هـ) + https://shamela.ws/book/8352 (المتن في شرح ابن أبي العز، ط الرسالة، تحقيق التركي والأرنؤوط، مشكول) + https://ar.wikisource.org/wiki/متن_العقيدة_الطحاوية; collated word by word by script - see tahawiyya-sources.md',
  basmala: L[1],
  note: 'عناوين الأبواب تقسيم وصفي للتطبيق، وليست من المتن.',
  chapters,
};
fs.writeFileSync(out, JSON.stringify(J, null, 1) + '\n');
const all = chapters.flatMap(c => c.paras);
const wc = all.map(p => p.split(' ').length);
console.log('chapters', chapters.length, 'paras', all.length, 'words', wc.reduce((a, b) => a + b), 'min', Math.min(...wc), 'max', Math.max(...wc));
all.forEach((p, i) => { const w = p.split(' ').length; if (w < 8 || w > 45) console.log('len', w, i + 1, p.slice(0, 60)); });
