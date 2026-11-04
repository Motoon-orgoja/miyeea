// Brings a word taken from T (al-Sanari's edition) to the base's orthography of the shakl, without changing any vowel T gives:
//  - the name of God with its shadda and the lam of «لِ»: «اللهَ» → «اللَّهَ»، «للهِ» → «لِلَّهِ»، «باللهِ» → «بِاللَّهِ»
//  - the sukun on the lam of the article before a moon letter, which T leaves out: «الجَاهِلَ» → «الْجَاهِلَ»
//  - the vowel of a one-letter prefix before the article, which T sometimes leaves out: «والعَمَلُ» → «وَالْعَمَلُ»
module.exports = w => w
  .replace(/^([«﴿(]*)للهِ/, '$1لِلَّهِ')
  .replace(/^([«﴿(]*)بالله/, '$1بِالله').replace(/^([«﴿(]*)والله/, '$1وَالله').replace(/^([«﴿(]*)فالله/, '$1فَالله')
  .replace(/الله(?=[َُِ])/g, 'اللَّه')
  .replace(/^([«﴿(]*)و(?=ال)/, '$1وَ').replace(/^([«﴿(]*)ف(?=ال)/, '$1فَ').replace(/^([«﴿(]*)ب(?=ال)/, '$1بِ').replace(/^([«﴿(]*)ك(?=ال)/, '$1كَ')
  .replace(/^([«﴿(]*(?:[وفبك][َِ])?)ال(?=[ءأإآبجحخعغفقكمهوي])/, '$1الْ')
  .replace(/^([«﴿(]*)لل(?=[ءأإآبجحخعغفقكمهوي])/, '$1لِلْ');
