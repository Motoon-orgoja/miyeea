// Orthographic fixes to the Rakaiz text of «قواعد الأصول», each logged (see qawaidusul-sources.md). rows -> rows
const CTX = [
  ['«الْمِشْكَاةٍ»', '«الْمِشْكَاةُ»', 'لا يجتمع التنوين و«ال»؛ وهو مبتدأ خبره «هِنْدِيَّةٌ»'],
  ['«الْإِسْتَبْرَق»', '«الْإِسْتَبْرَقُ»', 'إكمال حركة الآخر (مبتدأ خبره «فَارِسِيَّةٌ»)'],
];
const WORDS = {
  'للِانْكِسَارِ': 'لِلِانْكِسَارِ', 'وَشُرُوطُه': 'وَشُرُوطُهُ', 'ك«لَا': 'كَ«لَا', 'لِجِنْسِه': 'لِجِنْسِهِ', 'الصَّغِيرةِ': 'الصَّغِيرَةِ',
  'فَسَجَد': 'فَسَجَدَ', 'إحْدَى': 'إِحْدَى', 'خَمْسِمائَةِ': 'خَمْسِمِائَةِ', 'والْأَوَّلُ': 'وَالْأَوَّلُ',
};
// the base writes shadda before the vowel («لَّ» as ل+ّ+َ): bring the strings above to that order
const SF = s => s.replace(/([ًٌٍَُِ])ّ/g, 'ّ$1');
for (const c of CTX) { c[0] = SF(c[0]); c[1] = SF(c[1]); }
for (const k of Object.keys(WORDS)) { WORDS[SF(k)] = SF(WORDS[k]); }
WORDS['الله'] = 'اللهُ'; WORDS['من'] = 'مِنَ';
module.exports = rows => {
  const log = {}; let w = 0;
  for (const r of rows) {
    for (const [a, b, why, all] of CTX) if (r.text.includes(a)) { const n = r.text.split(a).length - 1; r.text = r.text.split(a).join(b); log['«' + a + '» ← «' + b + '»: ' + why] = (log['«' + a + '» ← «' + b + '»: ' + why] || 0) + n; }
    r.text = r.text.split(' ').map(t => { const m = t.match(/^([«(﴿-]*)(.*?)([.،:؛»)﴾!؟\-]*)$/); if (m && WORDS[m[2]]) { w++; return m[1] + WORDS[m[2]] + m[3]; } return t; }).join(' ');
  }
  log['إكمال شكل كلمات مفردة (جدول WORDS، ومنها «الله» ← «اللهُ» ٣ مرات في «صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ»، و«من» ← «مِنَ» في «وِزَانٌ مِنَ النَّوَاهِي»)'] = w; module.exports.log = log; return rows;
};
