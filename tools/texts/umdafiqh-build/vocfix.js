// Mark-order repairs on a finished paragraph (the base sometimes types the marks after the long letter):
//   صَلىَّ → صَلَّى, عَلىَ → عَلَى, حَالاًّ → حَالًّا, plus two single misprints; a mark typed twice is written once.
module.exports = p => p
  .replace(/([ء-ي])ى(َّ|َّ)/g, '$1َّى')
  .replace(/([ء-ي])ىَ/g, '$1َى')
  .replace(/([ب-ي])ا(ًّ|ًّ)/g, '$1ًّا')
  .replace(/فُلاُنًا/g, 'فُلَانًا')
  .replace(/مَِا/g, 'مَا') // سَوِيقِهِمَِا → سَوِيقِهِمَا
  .replace(/([ً-ْ])\1+/g, '$1');
