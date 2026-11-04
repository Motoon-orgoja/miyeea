// Builds tools/texts/ibnashir.txt from the Habous (habous.gov.ma, via the Wayback Machine) text of المرشد المعين,
// extracted by habous-extract.js into raw/ibnashir/_habous.txt. Each change is listed in FIX with its reason; the
// witnesses are Mayyara's «الدر الثمين» (M, Shamela 14249) and the chariaa.weebly.com copy (C).
// usage: node build.js   (then node ../../build-poem.js ../ibnashir.txt __test '{"title":"x","sub":"x"}')
const fs = require('fs'), path = require('path');
const T = path.join(__dirname, '..');
const raw = fs.readFileSync(path.join(T, 'raw/ibnashir/_habous.txt'), 'utf8').split('\n');
let V = raw.filter(l => l.includes(' | ')).map(l => l.normalize('NFC'));
if (V.length !== 317) throw new Error('expected 317 verses, got ' + V.length);
const N = s => s.normalize('NFC');
// [verse number (1-based, Habous order), from, to, reason]
const FIX = [
  [1, 'عُبْدُ', 'عَبْدُ', 'fatha (typo)'],
  [1, 'ابْنُ عَاشِرٍ', 'بْنُ عَاشِرِ', 'M, C «بن»; the rhyme is -dirī (القادرِ)'],
  [1, 'مُتْبَدِأً', 'مُبْتَدِئًا', 'letters swapped (M, C مبتدئا)'],
  [3, 'وَءَالِهِ', 'وَآلِهِ', 'spelling of the madda'],
  [4, 'فَالْعَوْنُ', 'وَبَعْدُ فَالْعَوْنُ', 'H prints «(وَبَعْدُ)» on its own line; it is the start of the verse (M, C; meter)'],
  [10, 'أَّوَّلُ', 'أَوَّلُ', 'stray shadda on the hamza'],
  [24, 'لَمْيَكُ', 'لَمْ يَكُ', 'missing space'],
  [25, 'لانْتَفَى', 'لاَنْتَفَى', 'missing fatha'],
  [25, 'انْ حَتَمْ', 'انْحَتَمْ', 'one word (M, C)'],
  [28, 'وَالتَّالِي', 'وَالتَّالِ', 'M; meter (وَالتَّالِ فِسْ = --u-)'],
  [32, 'مُحَالُ', 'مُحَالٌ', 'M; meter (مُحَالُنِلْ = u-u-)'],
  [58, 'وَلِيَنْوِ', 'وَلْيَنْوِ', 'C; lam of the imperative after waw; meter'],
  [114, 'وَالثَّانِي مَا', 'وَالثَّانِي لَا مَا', 'M «والثّانِي لا ما»: the second sitting is sunna except the part with the salam (fard); without «لا» the hemistich is short'],
  [116, 'وَالْبَاقِي', 'وَالْبَاقِ', 'M; meter'],
  [163, 'جَمَاعَةُ', 'جَمَاعَةٌ', 'subject (مبتدأ); meter (جَمَاعَتُنْ = u-u-); C also has a tanween'],
  [187, 'الْعُشْرِ', 'الْعُشُرِ', 'meter only: «وَرُبُعُ الْعُشُرِ فِيهِمَا» = uuu- uuu-; عُشُر is a known form (see report)'],
  [243, 'الثَّنِيَةِ', 'الثَّنِيَّةِ', 'M; the word is ثَنِيَّة; meter'],
  [267, 'أَوْقَفَتْهُ', 'أَوْقَفْتَهُ', 'addressed to the pilgrim like «وَانْحَرْ … وَاحْلِقْ»; meter (أَوْقَفْتَهُو = --u-)'],
  [41, 'وَطَاعَةُ', 'فَصْلٌ وَطَاعَةُ', '«فصل» belongs to the verse (M, C; without it the hemistich is a foot short)'],
  [53, 'بِذَيْنْ"', 'بِذَيْنْ', 'stray quote mark'],
  [54, 'وَتَحْصُلُ', 'فَصْلٌ وَتَحْصُلُ', '«فصل» belongs to the verse (M, C; meter)'],
  [55, 'لِعاَدَةٍ', 'لِعَادَةٍ', 'fatha typed on the alif'],
  [63, 'مَضْمَضَةٌ', 'مَضْمَضَةُ', 'M, C; meter (مَضْمَضَةُ اسْتِنْشَاقٌ = -uu- --u-)'],
  [64, 'عَشْرَ', 'عْشَرَ', 'meter: «وَأَحَدَ عْشَرَ» (uuu- u-u-); Mayyara notes «تسكين العين من أربعة عشر لغة»'],
  [64, 'تَسْمِيَّةٌ', 'تَسْمِيَةٌ', 'stray shadda (M, C)'],
  [65, 'وَتَيَامُنُا لإِنَا', 'وَتَيَامُنُ الإِنَا', 'word boundary misplaced (M, C)'],
  [70, 'ذَاكِرُفَرْضِهِ', 'ذَاكِرُ فَرْضِهِ', 'missing space'],
  [72, 'نَوَاقِضُهُ', 'فَصْلٌ نَوَاقِضُهُ', '«فصل» belongs to the verse (M; meter)'],
  [78, 'فُرُوضُ', 'فَصْلٌ فُرُوضُ', '«فصل» belongs to the verse (M; meter)'],
  [81, 'مَضْمَضَةٌغَسْلُ', 'مَضْمَضَةٌ غَسْلُ', 'missing space'],
  [83, 'أَعْضَاءِالْوُضُو', 'أَعْضَاءِ الْوُضُو', 'missing space'],
  [84, 'تَبْدَأْ', 'تَبْدَأُ', 'M, C; meter (تَبْدَأُ فِلْ = -uu-)'],
  [84, 'ثُمَّكُفْ', 'ثُمَّ كُفْ', 'missing space'],
  [110, 'أَوِالْجُفُوفِ', 'أَوِ الْجُفُوفِ', 'missing space'],
  [112, 'الْوَافِيَةْ', 'الْوَاقِيَةْ', 'M, C, and Mayyara\'s commentary «سنتها السورة بعد الواقية»'],
  [113, 'بِمَحَلٍّلَهُمَا', 'بِمَحَلٍّ لَهُمَا', 'missing space'],
  [128, 'حِينَتَلاَهْ', 'حِينَ تَلاَهْ', 'missing space'],
  [129, 'فَخْدٍ', 'فَخْذٍ', 'dhal (C)'],
  [130, 'الرُّكُوعِوَزِدِ', 'الرُّكُوعِ وَزِدِ', 'missing space'],
  [132, 'الإِحْرَامِخُذَا', 'الإِحْرَامِ خُذَا', 'missing space'],
  [134, 'كََالسُّورَةِ', 'كَالسُّورَةِ', 'doubled fatha'],
  [138, 'كََذَا', 'كَذَا', 'doubled fatha'],
  [140, 'وَخَمْسُ', 'فَصْلٌ وَخَمْسُ', '«فصل» belongs to the verse (M; meter)'],
  [141, 'سِرٍّتَبِعَا', 'سِرٍّ تَبِعَا', 'missing space'],
  [142, 'عِيدٌاسْتِسْقَا', 'عِيدٌ اسْتِسْقَا', 'missing space'],
  [144, 'نُدِبَنَفْلٌ', 'نُدِبَ نَفْلٌ', 'missing space'],
  [146, 'ِلنَقْصِ', 'فَصْلٌ لِنَقْصِ', 'kasra typed before the lam; «فصل» belongs to the verse (M; meter)'],
  [147, 'إِِنْ', 'إِنْ', 'doubled kasra'],
  [148, 'مِنَْبعْدِ', 'مِنْ بَعْدِ', 'misplaced marks / space'],
  [151, 'وَعَمْدِشُرْبٍ', 'وَعَمْدِ شُرْبٍ', 'missing space'],
  [155, 'كَفِعْلِمَنْ', 'كَفِعْلِ مَنْ', 'missing space'],
  [159, 'بِمَوْطِنِ', 'فَصْلٌ بِمَوْطِنِ', '«فصل» belongs to the verse (M, C; meter)'],
  [160, 'بِكَ فْرَسَخٍ', 'بِكَفَرْسَخٍ', 'misplaced space (M, C)'],
  [162, 'وَسُنَّغُسْلٌ', 'وَسُنَّ غُسْلٌ', 'missing space'],
  [175, 'سَلَّمُ', 'سَلَّمَ', 'past verb (M, C)'],
  [209, 'زَكَاةُ الْفِطْرِصَاعٌ', 'فَصْلٌ زَكَاةُ الْفِطْرِ صَاعٌ', '«فصل» belongs to the verse (M; meter); missing space'],
  [210, 'مُسْلِم ٍ', 'مُسْلِمٍ', 'stray space'],
  [213, 'الشَّهْرُبِرُؤْيَةِ', 'الشَّهْرُ بِرُؤْيَةِ', 'missing space'],
  [227, 'وَكَفِّرْنَ', 'وَكَفِّرَنْ', 'M, C; meter (وَكَفِّرَنْ = u-u-)'],
  [227, 'أَوْعِتْقِ', 'أَوْ عِتْقِ', 'missing space'],
  [233, 'ثَلاَثٍبِمِنَى', 'ثَلاَثٍ بِمِنَى', 'missing space'],
  [247, 'بِالْيَدِخُذْ', 'بِالْيَدِ خُذْ', 'missing space'],
  [259, 'ثُمَّكُنْ', 'ثُمَّ كُنْ', 'missing space'],
  [264, 'وَأَسْرِعَنْفِي', 'وَأَسْرِعَنْ فِي', 'missing space'],
  [272, 'الإٍحْرَامُصَيْدَ', 'الإِحْرَامُ صَيْدَ', 'tanween typed for kasra; missing space'],
  [275, 'أَوِالرَّأْسِ', 'أَوِ الرَّأْسِ', 'missing space'],
  [280, 'ثُمَّبَاقِي', 'ثُمَّ بَاقِي', 'missing space'],
  [281, 'وَجَازَالاِسْتِظْلاَلُ', 'وَجَازَ الاِسْتِظْلاَلُ', 'missing space'],
  [286, 'وَسِرْلِقَبْرِ', 'وَسِرْ لِقَبْرِ', 'missing space'],
  [287, 'ثُمَّزِدْ', 'ثُمَّ زِدْ', 'missing space'],
  [290, 'وَادْخُلْضُحًى', 'وَادْخُلْ ضُحًى', 'missing space'],
  [294, 'سُبْلَ', 'سُبْلُ', 'predicate of «هِيَ» (M, C)'],
  [297, 'يَحْفَظُبَطْنَهُ', 'يَحْفَظُ بَطْنَهُ', 'missing space'],
  [305, 'بِالْقِسْطَاطِ', 'بِالْقِسْطَاسِ', 'M, C, Mayyara: «بالقسطاس… وهو الميزان»; rhymes with الأنفاس'],
  [309, 'خَوْفٌرَجَا', 'خَوْفٌ رَجَا', 'missing space'],
  [124, 'تأْمِينُ', 'تَأْمِينُ', 'missing fatha'],
  [157, 'لأِنْ', 'لِأَنْ', 'marks swapped (M, C «لأن»)'],
  [174, 'لاَ فْي', 'لاَ فِي', 'sukun for kasra'],
  [314, 'أَرْبَعَةٌ عَشْرٌ', 'أَرْبَعَةَ عْشَرَ', 'compound number is indeclinable; Mayyara: «أربعة عشرة… وتسكين العين من أربعة عشر لغة»; meter -uu- uuu-'],
];
const log = [];
for (const [n, a, b, why] of FIX) {
  const s = V[n - 1], A = N(a);
  if (!s.includes(A)) throw new Error('fix not found in verse ' + n + ': ' + a + '\n' + s);
  V[n - 1] = s.replace(A, N(b)); log.push([n, a, b, why]);
}
// global spelling normalizations (certain): «للهِ» → «لِلَّهِ», «الَذِي» → «الَّذِي», fatha doubled on a tanween
const G = [[/(^|\s)للهِ/g, '$1لِلَّهِ'], [/الَذِي/g, 'الَّذِي'], [/ًَ|ًَ/g, 'ً'], [/ِِ/g, 'ِ'], [/ََ/g, 'َ'],
  [/الإمَامِ/g, 'الإِمَامِ'],                                   // missing kasra under the hamza
  [/(^|\s)(وَ)?لأ([َُْ])/g, '$1$2لِأ$3'],        // prefixed lam with no kasra: لأَكْلٍ → لِأَكْلٍ
  [/لِلأ/g, 'لِلْأ'], [/لِلإ/g, 'لِلْإ'],                                         // article lam before hamza: sukun (as elsewhere in H)
  [/([ء-ي])ا([َّ]+)/g, '$1$2ا'],  // fatha/shadda typed on the alif (لاَ، إِلاَّ، بِماَ) → on the letter before it
  // …but not the article before a hamza-less alif (الاَخِرَانِ، الاَرْكَانِ: the fatha is the hamza's, read with naql): put it back
  [/(^|\s)((?:[وفبك][َِ])?)الَا/g, '$1$2الاَ']];
for (const [re, to] of G) V = V.map(s => { const t = s.replace(re, to); if (t !== s) log.push(['*', s.match(re)[0].trim(), typeof to === 'string' ? to.replace('$1', '') : '', 'global']); return t; });
V = V.map(s => s.replace(/ـ/g, '').replace(/ {2,}/g, ' ').trim());
// headings: first verse of each Habous page, with the page's title (marks completed, case of «في …» fixed)
const H = [
  [1, 'مُقَدِّمَةُ الْمَتْنِ'],
  [6, 'مُقَدِّمَةٌ لِكِتَابِ الاِعْتِقَادْ مُعِينَةٌ لِقَارِئِهَا عَلَى الْمُرَادْ'],
  [14, 'كِتَابُ أُمِّ الْقَوَاعِدِ وَمَا انْطَوَتْ عَلَيْهِ مِنَ الْعَقَائِدِ'],
  [41, 'فَصْلٌ فِي قَوَاعِدِ الإِسْلاَمِ'],
  [48, 'مُقَدِّمَةٌ مِنَ الأُصُولِ مُعِينَةٌ فِي فُرُوعِهَا عَلَى الْوُصُولِ'],
  [54, 'كِتَابُ الطَّهَارَةِ'],
  [57, 'فَصْلٌ فِي فَرَائِضِ الْوُضُوءِ'],
  [62, 'فَصْلٌ فِي سُنَنِ الْوُضُوءِ'],
  [72, 'فَصْلٌ فِي نَوَاقِضِ الْوُضُوءِ'],
  [78, 'فَصْلٌ فِي فَرَائِضِ الْغُسْلِ'],
  [81, 'سُنَنُ الْغُسْلِ'],
  [86, 'مُوجِبُ الْغُسْلِ'],
  [89, 'فَصْلٌ فِي التَّيَمُّمِ'],
  [92, 'فُرُوضُ التَّيَمُّمِ'],
  [95, 'سُنَنُ التَّيَمُّمِ'],
  [99, 'كِتَابُ الصَّلاَةِ'],
  [112, 'فَصْلٌ فِي سُنَنِ الصَّلاَةِ'],
  [124, 'فَصْلٌ فِي مَنْدُوبَاتِ الصَّلاَةِ'],
  [140, 'فَصْلٌ فِي فَرْضِ الْعَيْنِ وَفَرْضِ الْكِفَايَةِ'],
  [146, 'فَصْلٌ فِي سُجُودِ السَّهْوِ'],
  [159, 'فَصْلٌ فِي صَلاَةِ الْجُمُعَةِ'],
  [165, 'فَصْلٌ فِي شُرُوطِ الإِمَامِ'],
  [182, 'كِتَابُ الزَّكَاةِ'],
  [209, 'فَصْلٌ فِي زَكَاةِ الْفِطْرِ'],
  [211, 'كِتَابُ الصِّيَامِ'],
  [229, 'كِتَابُ الْحَجِّ'],
  [291, 'كِتَابُ مَبَادِئِ التَّصَوُّفِ وَهَوَادِي التَّعَرُّفْ'],
  [313, 'الْخَاتِمَةُ'],
];
// check the heading positions against the Habous page breaks
const starts = []; let k = 0;
for (const l of raw) { if (l.startsWith('# ')) starts.push(k + 1); else if (l.includes(' | ')) k++; }
const hs = H.map(h => h[0]);
if (JSON.stringify(hs) !== JSON.stringify(starts)) throw new Error('headings do not match page starts:\n' + hs + '\n' + starts);
const normH = t => N(t).replace(/([ء-ي])ا([َّ]+)/g, '$1$2ا');
const out = []; V.forEach((v, i) => { const h = H.find(x => x[0] === i + 1); if (h) out.push('## ' + normH(h[1])); out.push(v); });
fs.writeFileSync(path.join(T, 'ibnashir.txt'), out.join('\n') + '\n');
fs.writeFileSync(path.join(T, 'raw/ibnashir/_fixes.json'), JSON.stringify(log, null, 1));
console.log('verses', V.length, 'headings', H.length, 'fixes', log.length);
