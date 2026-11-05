// Corrections applied by build.js to the collated text (out/tokens.json), each with its reason. [from, to, expected count]
// The «from» side is matched on the joined text of a كتاب/باب section after cleaning (brackets dropped, «,» -> «،»).
module.exports = [
  // Qur'anic quotations: the Mushaf's wording and marks inside ﴿﴾ (F prints them in braces, partly vocalized)
  ['{ربنَا وَلا تحمِّلْنا مَا لَا طَاقَةَ لَنَا بِهِ. الآية.', '﴿رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ﴾ الآية.', 1], // البقرة ٢٨٦
  ['{آلم} السّجْدة', '﴿الم﴾ السَّجْدَة', 1],
  ['{هَلْ أَتَى}', '﴿هَلْ أَتَى﴾', 1],
  // اللعان: F gives both formulas as the ayahs (النور ٧، ٩). M and N read the husband's «وأن لعنة الله عليه…» (a reading the
  // vote took in); F's ayah form is kept for both formulas so that they stay parallel — listed under «مواضع للتأكد».
  ['وإن لعنةَ اللهِ عليهِ إِنْ كَانَ مِنَ الْكَاذِبِين} النور:', '﴿أَنَّ لَعْنَتَ اللَّهِ عَلَيْهِ إِنْ كَانَ مِنَ الْكَاذِبِينَ﴾', 1],
  ['{أَنَّ غَضَبَ اللَّهِ عَلَيْهَا إِنْ كَانَ مِنَ الصَّادِقِينَ}', '﴿أَنَّ غَضَبَ اللَّهِ عَلَيْهَا إِنْ كَانَ مِنَ الصَّادِقِينَ﴾', 1],
  // N's marks against the matn's syntax or plain misprints of N (tanween on the first noun of an iḍāfa, a vowel on the wrong letter)
  ['سُبُعٍ رطلٍ', 'سُبُعِ رطلٍ', 1],
  ['فعلٍ الشيء', 'فعلِ الشيء', 1],
  ['غيرٍ الثلاثة', 'غيرِ الثلاثة', 1],
  ['تجميرٍ الكَعْبَةِ', 'تجميرِ الكَعْبَةِ', 1],
  ['كذُبابٍ الباقلًا', 'كذُبابِ الباقلا', 1], // «ذباب الباقلا»: no tanween on a word with the article
  ['جائزٍ التصرّف', 'جائزِ التصرّف', 1],
  ['وبموتٍ الموصى', 'وبموتِ الموصى', 1],
  ['كالِخرَب', 'كالخِرَب', 1],
  ['بمسِجدٍ', 'بمسجدٍ', 1],
  ['إذهاب كلُّ من', 'إذهاب كلِّ من', 1],
];
