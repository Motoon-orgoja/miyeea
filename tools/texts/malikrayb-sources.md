# Texts report: يائية مالك بن الريب «ألا ليت شعري هل أبيتنّ ليلة» — `malikrayb.txt`

Scripts: `poems6-build/` (`parse.js`, `collate.js`, `build-manual.js`, `cfg.js`, `meter.js`). The vocalized text is typed in `poems6-build/malikrayb.voc.txt` and checked by `build-manual.js`. Raw files: `raw/malikrayb/`. Collation: `out/malikrayb.collation.txt`; log: `out/malikrayb.build-log.txt`.

## 1. Sources
**No fully vocalized copy of the circulated 58-verse recension was found.** The best available were used:
- **Base (A = W), partly vocalized (27.5%), 58 verses:** the circulated text, identical on aldiwan.net (https://www.aldiwan.net/poem80856.html) and Wikisource («مرثية مالك بن الريب», https://ar.wikisource.org/wiki/مرثية_مالك_بن_الريب). It fixes the wording and the order.
- **K, printed, unvocalized:** «خزانة الأدب» للبغدادي 2/203–207 (shamela 12732, pp. 673–676), the printed source of this 58-verse recension: https://shamela.ws/book/12732/673 (43 of its verses were matched by the script; its first page prints the opening verses in the commentary).
- **J, printed, vocalized (54%), 52-verse recension:** «جمهرة أشعار العرب» لأبي زيد القرشي (shamela 1487, pp. 541–548): https://shamela.ws/book/1487/541
- **Y, printed, unvocalized:** «أمالي اليزيدي» (shamela 8196, pp. 39–43). **I, printed, unvocalized:** «الاختيارين» للأخفش الأصغر (shamela 136, pp. 600–607).

## 2. Count
**58 verses**, the count of the circulated recension (الخزانة). The other recensions are shorter and differ in many words: J 52, Y about 50, I 53.

## 3. Wording
The recension of A was kept as it is; it was changed only where A has a slip that all the printed witnesses correct.

| v. | Adopted | A reading | Why |
|---|---|---|---|
| 1b | **بِجَنْبِ** الْغَضَا | بوادي الغضى | J + Y + I; the transmitted opening |
| 17a | يَدْعُو **صِحَابَهُ** | صحابتي | K + J + Y + I |
| 19a | وَأَشْقَرَ **مَحْبُوكٍ** | محبوكاً | K; adjective of a majrur noun (أشقرَ is ممنوع من الصرف) |
| 20a | **بِأَطْرَافِ** السُّمَيْنَةِ | بأطرف | typo; J + Y |
| 21a, 54a | **بِقَفْرَةٍ** | بقفزة | dotting typo; K + J + Y + I |
| 29a | **بِبُرْدِي** | بثوبي | K + J + Y + I |
| 41b | **بِفَلْجٍ** | بفلوج | K + J + Y + I; «بفلوج» breaks the meter |
| 43a | وَقَدْ **كَانَ** الظَّلَامُ | كاد | K + J + Y |
| spelling | الغضا، الرحى، رحًى، فبلّغَنْ | الغضى، الرحا، رحاً، فبلغاً | K / J |

Readings of the other recensions were not imported (J/Y/I: 6a أهل ودّي, 15b قد نهانيا, 19 خنذيذٍ … الدهر, 21b قبري, 22b وحلّ, 23a فإنني, 25b ما بيا, 26b القبر … ثم ابكيا ليا, 34a الشبيك … الوحش, 36a إنني, 37a الولدان بيتًا يجنّني, 41b رحى الحرب, 43a وعِينٌ, 44, 45b المنقيات, 48, 50 راكبًا … مالك, 51 وعطّل … ستبرد, 57a وابنتاها, 58). Readings of K kept out: 19a لجامه, 20a بأكناف, 30b إلى الهيجا, 32b ويومًا, 44 العبالي … الديافيا, 46b بنعيك, 51a وعطّل, 52b وانيا, 57a وابنتاها.

## 4. Harakat
- The base is only 27.5% vocalized and not consistently, so the full vocalization was typed by hand and then checked by script: the letters of every word against the base (after the decisions above), every mark against the marks of A and J on the same word, and the meter of every hemistich. **Coverage: 27.5% → 100%.**
- Of the 1955 vowel marks, **874 are printed identically by A or J** on the same word; **1081 were supplied** (sukun, vowels before madd letters, and case endings required by the syntax and the meter).
- **Marks changed against A** (all in the log): 6b الطِّبَّسَيْنِ → **الطَّبَسَيْنِ** (= J; طَبَس بفتحتين) · 31b وَالجارِ → **وَالْجَارَ** (coordinated with «ابنَ», the object of the masdar شتمي) · 37b الميراثُ → **الْمِيرَاثَ** (= J; object, «الموالي» is the subject) · 45b وبَوَلانَ → **وَبَوْلَانَ** (the meter needs a sakin و) · 1b, 5a, 37a, 48b: misplaced marks of A (الِقلاص، الأعاديَّ، بَثَّا، المرنبانيَّ).
- The 15 differences from J are differences of recension or typos of J (e.g. «لَياليِا», 45a «عَصِبَ الركبانُ», 44a «العيسُ» with another verb).
- **Meter (الطويل، الضرب مقبوض):** 116 of 116 hemistichs pass the scanner.

## 5. To verify
- The vocalization is mine where neither A nor J marks the word; a printed vocalized edition of the Khizana recension (or the diwan collected by نوري القيسي) should be compared when available.
- 31b وَالْجَارَ against A and J «والجارِ» (in J the construction is «شتمِ ابنِ العمِّ والجارِ», where the kasra is right).
- 49a رَهِينَةَ (hal); رَهِينَةُ is possible. No witness marks it.
- 9a يُرْجِعْنِي (A); يَرْجِعْنِي is possible.
- 14b مَنْ وَرَائِيَا (A); J «مِنْ ورائيا».
- 19a مَحْبُوكٍ: the circulated copies read «محبوكاً».
