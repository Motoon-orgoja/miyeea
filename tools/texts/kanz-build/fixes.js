// Letter-level corrections to the base (clear typos of the digital copy), each backed by a witness. Applied by rows.js
// before collation and vocalization. [page, find, replace, reason]
const FIX = [
  [215, 'وداره حرٌّة', 'وداره حرٌّ', 'التاء زائدة مع تنوين الراء؛ تبيين: «وَدَارُهُ حُرٌّ»'],
  [480, 'إلّا عند القاض', 'إلّا عند القاضي', 'سقطت الياء؛ تبيين والبحر: «الْقَاضِي»'],
  [517, 'إن صالحا عن دار بهما', 'إن صالحا عن داريهما', 'تصحيف؛ تبيين: «عَنْ دَارَيْهِمَا»'],
  [517, 'لو صالحا على دار بهما', 'لو صالحا على داريهما', 'تصحيف؛ تبيين: «عَلَى دَارَيْهِمَا»'],
  [518, 'ومن النكاحٍ', 'ومن نكاحٍ', 'أل مع التنوين؛ تبيين: «وَمِنْ نِكَاحٍ»'],
  [563, 'وأيٌّهما', 'وأيُّهما', 'تنوين في المضاف؛ تبيين: «وَأَيُّهُمَا»'],
  [566, 'حرّر البعضٌ', 'حرّر البعضُ', 'أل مع التنوين (تبيين: «حَرَّرَهُ بَعْضٌ»؛ أبقيت لفظ الأساس وصححت الحركة) — في مواضع التأكد'],
  [438, 'وبمكيالٌ أو ذراعٌ', 'وبمكيالٍ أو ذراعٍ', 'الباء الجارة مع تنوين الضم (تبيين: «وَمِكْيَالٌ أَوْ ذِرَاعٌ» بلا باء) — في مواضع التأكد'],
];
module.exports = rows => {
  const out = rows.map(r => Object.assign({}, r));
  for (const [page, a, b] of FIX) {
    const r = out.find(x => x.page === page && x.text.includes(a));
    if (!r) throw new Error('fix not found: ص' + page + ' ' + a);
    r.text = r.text.replace(a, b);
  }
  return out;
};
module.exports.FIX = FIX;
