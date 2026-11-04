// Readings decided by hand, by collation region «a:b» (F word span, see out/decisions.tsv). text = normalized words to adopt.
module.exports = {
  // ﴿وَلَا يَئُودُهُ حِفْظُهُمَا﴾: the base prints «يَؤُدُهُ», M/Th «يؤوده»; the mushaf spelling is T's «يَئُودُهُ»
  '486:487': { text: 'ييوده', why: 'لفظ المصحف «يَئُودُهُ» (T)' },
  // «فَإِنْ دَخَلَ بِهَا وَلَمْ يَعْلَمْ وَأَدَّى صَدَاقَهَا»: M/Th «ودى»، T «أدى»؛ the base's «وَأَدَّى» = T's word with the conjunction
  '13672:13673': { keep: true, why: 'الأساس «وَأَدَّى» (يوافق لفظ التحقيق «أدّى»)' },
};
