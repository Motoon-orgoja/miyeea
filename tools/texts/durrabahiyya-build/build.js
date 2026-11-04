// Builds tools/texts/durrabahiyya.txt from ko.json (base: ketabonline 27181, ضبط أبي مالك العوضي).
// Every change to the base is listed in WORD / FIX / HEAD below and reported in durrabahiyya-sources.md.
// usage: node tools/texts/durrabahiyya-build/build.js [--diag]
const fs = require('fs'), path = require('path');
const ko = JSON.parse(fs.readFileSync(path.join(__dirname, 'ko.json'), 'utf8')).items;

// mechanical cleaning: footnote marks, editorial brackets, tatweel, punctuation, dashes; «?» in the KO dump is a lost hamzat-wasl alif
const clean = s => s.replace(/\{\d+\}/g, '').replace(/[()\[\]«»]/g, '').replace(/ـ/g, '').replace(/\?/g, 'ا')
  .replace(/[،؛:,.!؟]/g, '').replace(/\s-\s|^-\s|\s-$/g, ' ').replace(/\s+/g, ' ').trim();

// headings: [KO text after clean, written as]
const HEAD = {
  'مُقَدَِّمَةٌ': 'مُقَدِّمَةٌ',
  'بَابُ الإعْرَابِ': 'بَابُ الإِعْرَابِ',
  'بَابُ عَلاَمَاتِ الإعْرَابِ': 'بَابُ عَلاَمَاتِ الإِعْرَابِ',
  'فَصْلٌ الْمُعْرَبَاتُ': 'فَصْلٌ',
  'بَابُ الْمَعْرِفَةِ وَالنَّكِرةِ': 'بَابُ الْمَعْرِفَةِ وَالنَّكِرَةِ',
  'بَابُ مَرْفَوعَاتِ الأَسْمَاءِ': 'بَابُ مَرْفُوعَاتِ الأَسْمَاءِ',
  'بَابُ التَّوكِيدِ': 'بَابُ التَّوْكِيدِ',
  'بَاب الظَّرْفِ': 'بَابُ الظَّرْفِ',
  'بَابُ الْمَفْعُولِ لأَِجْلِهِ': 'بَابُ الْمَفْعُولِ لِأَجْلِهِ',
};

// marks are compared in canonical order (shadda first, then the rest), since the sources type them in varying order
const canon = w => { const r = []; for (const c of w) { if (/[ً-ْ]/.test(c) && r.length) r[r.length - 1].m.push(c); else r.push({ c, m: [] }); }
  return r.map(x => x.c + x.m.sort((p, q) => (p === q ? 0 : p === 'ّ' ? -1 : q === 'ّ' ? 1 : p < q ? -1 : 1)).join('')).join(''); };

// per-verse wording edits: [verse, from, to]  (from must occur exactly once in the cleaned verse «a | b»)
const FIX = [
  [3, 'فِي الْحَالِ', 'فِي الْحَانِ'],
  [21, 'ثَلاَثُها', 'ثَلاَثَةٌ'],
];
// double marks left by the editor («either reading is fine») or by typing: one reading kept, applied wherever the word occurs
const DOUBLE = {
  'اَلْحَمدُ': 'الْحَمْدُ', 'الطَّّلَبِ': 'الطَّلَبِ', 'الْحَِبْرُ': 'الْحَبْرُ', 'وَالْكَِلْمَةُ': 'وَالْكِلْمَةُ',
  'وَجَرّْْ': 'وَجَرّْ', 'كَأَحْمَدُْ': 'كَأَحْمَدُ', 'الأَعْبُدُْ': 'الأَعْبُدُ', 'نَحْوُِ': 'نَحْوُ',
  'مَحَلٍّّ': 'مَحَلٍّ', 'الْمَحَلْْ': 'الْمَحَلْ', 'هَمْزٌٍ': 'هَمْزٌ', 'وَنُونٌٍ': 'وَنُونٌ',
  'غَيْرَُ': 'غَيْرُ', 'اِِنْصِبْ': 'اِنْصِبْ', 'كُلٍّّ': 'كُلٍّ', 'الْمُؤَكِّّدُ': 'الْمُؤَكِّدُ',
  'مُؤَكِّّدٍ': 'مُؤَكِّدٍ', 'لأَِجْمَعَا': 'لِأَجْمَعَا', 'وَأَبْتَعٍِ': 'وَأَبْتَعٍ', 'كَِلْمَةً': 'كَلْمَةً',
  'الإِْثْنَيْنِ': 'الِاثْنَيْنِ', 'أَمَامَهُْ': 'أَمَامَهْ', 'قُدَّامَهُْ': 'قُدَّامَهْ', 'تِلْقَاءَهُْ': 'تِلْقَاءَهُ',
  'إِزَاءَهُْ': 'إِزَاءَهُ', 'رَِطْلٍ': 'رِطْلٍ', 'كُلٍّّ': 'كُلٍّ', 'وَنَحْوُِ': 'وَنَحْوُ',
  'أََو': 'أَوْ', 'الْمُقدَِّمَهْ': 'الْمُقَدِّمَهْ', 'النَّكِرَةْْ': 'النَّكِرَةْ', 'مُؤَثِّرَةْْ': 'مُؤَثِّرَةْ',
  'الظَّرْفِيَّةْْ': 'الظَّرْفِيَّةْ', 'الثَّّلاَثِ': 'الثَّلاَثِ', 'بِِنُونِهَا': 'بِنُونِهَا',
};
// whole-word fixes applied everywhere (typos shared by both sources / missing marks on a letter)
const WORD = {
  'لأَِرْبَعِ': 'لِأَرْبَعِ', 'الأَخَيرِ': 'الأَخِيرِ', 'الأَخَيْرِ': 'الأَخِيرِ', 'عَظَيمُ': 'عَظِيمُ', 'الْمَذْكَورِ': 'الْمَذْكُورِ',
  'مُحرَّكٍ': 'مُحَرَّكٍ', 'قائِمَانِ': 'قَائِمَانِ', 'قاضٍ': 'قَاضٍ', 'ناقِصٍ': 'نَاقِصٍ', 'بِالْعبَادِ': 'بِالْعِبَادِ',
  'بِالْمَعْطوفِ': 'بِالْمَعْطُوفِ', 'ضَمَائرٌ': 'ضَمَائِرٌ', 'الْمُضَارعِ': 'الْمُضَارِعِ',
  'وَلكِنْ': 'وَلَكِنْ', 'لكِنْ': 'لَكِنْ', 'الَّذي': 'الَّذِي', 'إِلى': 'إِلَى', 'كقَامَ': 'كَقَامَ', 'ومَا': 'وَمَا',
  'أفَادَ': 'أَفَادَ', 'والْخَفْضِ': 'وَالْخَفْضِ', 'وحَرْفِ': 'وَحَرْفِ', 'وافْعَلِي': 'وَافْعَلِي', 'كيَاتِي': 'كَيَاتِي',
  'وتُحْصَرُ': 'وَتُحْصَرُ', 'وتَا': 'وَتَا', 'فانْصِبْ': 'فَانْصِبْ', 'وتَتْرُكَ': 'وَتَتْرُكَ', 'فَإنْ': 'فَإِنْ', 'أَو': 'أَوْ',
  'إَعْرَابُهُمْ': 'إِعْرَابُهُمْ', 'الأسْمَا': 'الأَسْمَا', 'الأفْعَالِ': 'الأَفْعَالِ',
};

const out = [], log = []; let vn = 0;
const fixes = FIX.map(f => ({ v: f[0], from: f[1].split(' ').map(canon).join(' '), to: f[2], used: 0 }));
const MAP = {}; for (const [k, v] of Object.entries(Object.assign({}, WORD, DOUBLE))) MAP[canon(k)] = { from: k, to: v, used: 0 };
for (const x of ko) {
  if (x.h) { const h = clean(x.h).split(' ').map(canon).join(' '); const H2 = {}; for (const [k, v] of Object.entries(HEAD)) H2[k.split(' ').map(canon).join(' ')] = v; out.push('## ' + (H2[h] || h)); continue; }
  vn++;
  let v = x.v.map(clean).join(' | ').split(' ').map(canon).join(' ');
  v = v.split(' ').map(w => { const r = MAP[w]; if (r) { r.used++; log.push(vn + '\t' + w + '\t' + r.to); return r.to; } return w; }).join(' ');
  // a bare «إ» always takes kasra
  v = v.replace(/إ(?![ً-ْ])/g, m => { log.push(vn + '\tإ\tإِ'); return 'إِ'; });
  for (const f of fixes.filter(f => f.v === vn)) {
    const n = v.split(f.from).length - 1;
    if (n !== 1) throw new Error('verse ' + vn + ': «' + f.from + '» found ' + n + ' times in: ' + v);
    v = v.replace(f.from, f.to); f.used++;
  }
  out.push(v);
}
for (const r of Object.values(MAP)) if (!r.used) console.log('unused word fix', r.from);
for (const f of fixes) if (!f.used) throw new Error('unused fix ' + JSON.stringify(f));
if (vn !== 254) throw new Error('verse count ' + vn);
// sanity: no double marks, no stray brackets/punctuation
out.forEach((l, i) => {
  for (const w of l.split(' ')) if (/[ً-ِْ][ً-ِْ]/.test(w.replace(/ّ/g, '')) || /ّّ/.test(w)) console.log('DOUBLE MARK line', i + 1, w);
  if (/[()\[\]{}?،؛:]/.test(l)) console.log('STRAY line', i + 1, l);
});
fs.writeFileSync(path.join(__dirname, '..', 'durrabahiyya.txt'), out.join('\n') + '\n');
fs.writeFileSync(path.join(__dirname, 'word-fixes.log'), log.join('\n') + '\n');
console.log('verses', vn, 'headings', out.filter(l => l.startsWith('##')).length, 'word fixes', log.length);
