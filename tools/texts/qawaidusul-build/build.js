// Builds ../qawaidusul.json from the Rakaiz rows (extract-rakaiz.js -> fixes.js).  usage: node build.js
// The matn itself has only three أبواب and one «فَصْلٌ». group = the باب; chapters = sections cut where the matn turns to a new
// topic (the same points as the headings of the Rakaiz table of contents / the older print); their titles are labels, not matn words.
// Mechanical completions (logged): sukun on the article's lam before a moon letter (kasra before a wasl alif), shadda on the lam of «الله».
const fs = require('fs'), path = require('path');
const { paras } = require('../umdafiqh-build/paras.js');
const { norm } = require('../umdafiqh-build/align.js');
const rows = require('./rows.js')();
const SUN = 'تثدذرزسشصضطظلن', stat = { qamari: 0, allah: 0 };
const SF = s => s.replace(/([ًٌٍَُِ])ّ/g, 'ّ$1');      // this base writes shadda before the vowel
function complete(t) {
  return t.split(' ').map(w => {
    let x = w;
    x = x.replace(/^([«(﴿]?(?:[وف]َ)?(?:[بك][َِ]|تَ)?ال)له(?=[َُِ]|$|[^ء-ي])/, (m, p) => (stat.allah++, p + 'لَّه')).replace(/^([«(﴿]?(?:[وفك][َِ]?)?لِ)له(?=[َُِ])/, (m, p) => (stat.allah++, p + 'لَّه'));
    x = x.replace(/^([«(﴿]?(?:[وف]َ)?(?:[بك][َِ])?)ال(?=([ء-ي]))/, (m, p, c) => SUN.includes(c) || c === 'ل' ? m : (stat.qamari++, p + (c === 'ا' ? 'الِ' : 'الْ')))
         .replace(/^([«(﴿]?(?:[وف]َ)?لِ)ل(?=([ء-ي]))/, (m, p, c) => SUN.includes(c) || c === 'ل' ? m : (stat.qamari++, p + (c === 'ا' ? 'لِ' : 'لْ')));
    return SF(x);
  }).join(' ');
}
for (const r of rows) r.text = complete(r.text);
// [first words of the row that opens the section (normalized), section title]
const CUT = [
  ['الباب الاول في الحكم', 'الْحُكْمُ وَالْأَحْكَامُ التَّكْلِيفِيَّةُ'],
  ['ووضعيه وهي اربعه', 'الْأَحْكَامُ الْوَضْعِيَّةُ وَلَوَازِمُ الْحُكْمِ'],
  ['الباب الثاني في الادله', 'الْأَدِلَّةُ، وَالْأَصْلُ الْأَوَّلُ: الْكِتَابُ'],
  ['والسنه ما ورد', 'الْأَصْلُ الثَّانِي: السُّنَّةُ'],
  ['ثم ها هنا ابحاث', 'مَبَاحِثُ الْأَلْفَاظِ: اللُّغَاتُ وَالْحَقِيقَةُ وَالْمَجَازُ'],
  ['فان دل علي معني واحد', 'النَّصُّ وَالظَّاهِرُ وَالْمُجْمَلُ'],
  ['فان دل علي مفهومات', 'الْعَامُّ'],
  ['والخاص يقابل العام', 'الْخَاصُّ وَالتَّخْصِيصُ'],
  ['ومنه المطلق', 'الْمُطْلَقُ وَالْمُقَيَّدُ'],
  ['والامر استدعا الفعل', 'الْأَمْرُ'],
  ['والنهي يقابل الامر', 'النَّهْيُ'],
  ['واما المستفاد من فحوي', 'الْمَفْهُومُ'],
  ['ثم الذي يرفع الحكم', 'النَّسْخُ'],
  ['والاجماع واصله الاتفاق', 'الْأَصْلُ الثَّالِثُ: الْإِجْمَاعُ'],
  ['واما الاصل الرابع', 'الْأَصْلُ الرَّابِعُ: الِاسْتِصْحَابُ'],
  ['وقد اختلف في اصول', 'الْأُصُولُ الْمُخْتَلَفُ فِيهَا'],
  ['ومما يتفرع عن الاصول', 'الْقِيَاسُ'],
  ['والاستدلال ترتيب امور', 'الِاسْتِدْلَالُ'],
  ['فصل', 'تَرْتِيبُ الْأَدِلَّةِ وَالتَّرْجِيحُ'],
  ['الباب الثالث في الاجتهاد', 'الِاجْتِهَادُ'],
  ['والتقليد لغه', 'التَّقْلِيدُ'],
];
const N = t => t.split(' ').map(norm).filter(Boolean).join(' ');
const at = CUT.map(([k]) => { const i = rows.findIndex(r => N(r.text) === k || N(r.text).startsWith(k + ' ')); if (i < 0) throw new Error('no anchor ' + k); return i; });
at.forEach((v, k) => { if (k && v <= at[k - 1]) throw new Error('anchors out of order at ' + CUT[k][0]); });
const chapters = []; let ch = { title: SF('مُقَدِّمَةُ الْمُصَنِّفِ'), group: SF('مُقَدِّمَةُ الْمُصَنِّفِ'), rows: [] }, group = null;
rows.forEach((r, i) => {
  const k = at.indexOf(i);
  if (r.kind === 'bab') group = r.text;
  if (k >= 0) { if (ch.rows.length) chapters.push(ch); ch = { title: SF(CUT[k][1]), group: group, rows: [] }; }
  if (r.kind === 'bab') return;
  if (r.kind === 'fasl') { ch.rows.push({ fasl: true, text: 'فَصْلٌ:' }); return; }
  ch.rows.push({ text: r.text });
});
chapters.push(ch);
const J = {
  source: 'قواعد الأصول ومعاقد الفصول، ت. د. أنس اليتامى ود. عبد العزيز العيدان (ركائز ١٤٣٩هـ، مشكول، على نسختين خطيتين) = https://shamela.ws/book/19',
  check: 'قوبل كلمةً كلمةً بنشرة المستودع في الشاملة (OpenITI ShamAY0037576، طبعة قديمة غير مشكولة) — انظر qawaidusul-sources.md',
  basmala: SF('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'),
  chapters: chapters.map(c => ({ title: c.title, group: c.group, paras: paras(c.rows) })),
};
fs.writeFileSync(path.join(__dirname, '../qawaidusul.json'), JSON.stringify(J, null, 1) + '\n');
const P = J.chapters.flatMap(c => c.paras), L = P.map(p => p.split(' ').length), W = P.join(' ').split(' ').filter(w => /[ء-ي]/.test(w));
console.log(JSON.stringify({ chapters: J.chapters.length, paras: P.length, words: W.length, minLen: Math.min(...L), maxLen: Math.max(...L), ...stat }));
J.chapters.forEach(c => console.log(c.group, '>', c.title, c.paras.length));
