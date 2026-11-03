# Texts report — لامية الأفعال (`lamiyya.txt`)

Key `lamiyya` · ابن مالك (ت ٦٧٢هـ) · الصرف · البسيط · **114 verses**, 14 headings.

How the comparison was done: every verse was stripped of harakat and tatweel, alef/yaa/taa-marbuta/hamza seats were unified, and the
whole poem was compared word by word (LCS diff, script output) against the check source. Differences that disappear when spaces are
ignored (the check source splits words such as «و حر», «ال لزوم») were dropped automatically; the rest are listed below.
Scripts: `tools/texts/scripts/lamiyya/` (run from a scratch folder; inputs are in `raw/lamiyya/`).

## Sources
- **Base (vocalization + wording):** المكتبة الشاملة, book 344 «لامية الأفعال», تحقيق د. عبد المحسن بن محمد القاسم (series «متون طالب العلم»,
  1442هـ), edited from manuscripts with an apparatus. The base is the section «النظم مجردًا من حواشي التحقيق», pages 30–44:
  https://shamela.ws/book/344/30 … /344/44. Fully vocalized; the edition states «عدد أبياتها: ١١٤».
  The same edition's annotated copy («النظم مع حواشي التحقيق», pp. 45–115) was compared with the bare copy by script: identical in all
  114 verses (only a semicolon differs in v.13). Its footnotes were used to explain every difference below. Raw: `raw/lamiyya/shamela-344-p*.html`.
- **Check (independent edition):** «نظم لامية الأفعال», كتبها وضبطها وراجعها أبو مالك العوضي — Shamela book 37033 (repository), as
  preserved by OpenITI (diacritics stripped by OpenITI):
  https://raw.githubusercontent.com/OpenITI/0675AH/master/data/0672IbnMalik/0672IbnMalik.NazmLamiyyatAfcal/0672IbnMalik.NazmLamiyyatAfcal.ShamAY0037033-ara1
  (`raw/lamiyya/openiti-37033.txt`). This edition mostly follows the readings of بَحْرَق's commentary.
- Looked at, not used: Shamela 3863 «فتح المتعال» (verses only partly and automatically vocalized), Shamela 133416 (بحرق, no vocalization).

## Count
114 ✔ (the edition's count, which is the standard one; the check edition also has 114, and the introduction of the edition says «وحَوَتْ (١١٤) بيتاً»).

## Headings
As in the edition: «بَابُ أَبْنِيَةِ الْفِعْلِ الْمُجَرَّدِ وَتَصَارِيفِهِ» (5), «فَصْلٌ فِي اتِّصَالِ تَاءِ الضَّمِيرِ أَوْ نُونِهِ بِالْفِعْلِ» (28), «بَابُ أَبْنِيَةِ الْفِعْلِ الْمَزِيدِ فِيهِ» (30),
«فَصْلٌ فِي الْفِعْلِ الْمُضَارِعِ» (37), «فَصْلٌ فِي فِعْلِ مَا لَمْ يُسَمَّ فَاعِلُهُ» (43), «فَصْلٌ فِي فِعْلِ الْأَمْرِ» (47), «بَابُ أَبْنِيَةِ أَسْمَاءِ الْفَاعِلِينَ وَالْمَفْعُولِينَ» (51),
«بَابُ أَبْنِيَةِ الْمَصَادِرِ» (62), «فَصْلٌ يَتَضَمَّنُ أَبْنِيَةَ مَصَادِرِ مَا زَادَ عَلَى ثَلَاثَةِ أَحْرُفٍ» (78), «بَابُ الْمَفْعَلِ وَالْمَفْعِلِ وَمَعَانِيهِمَا» (90),
«فَصْلٌ فِي بِنَاءِ الْمَفْعَلَةِ» (104), «فَصْلٌ فِي اسْمِ الْآلَةِ» (107), «خَاتِمَةٌ» (110).
- The editor printed three headings (or parts of them) in square brackets as editorial additions: the whole of «فَصْلٌ فِي اتِّصَالِ تَاءِ الضَّمِيرِ…»,
  «فِي بِنَاءِ الْمَفْعَلَةِ» and «خَاتِمَةٌ». They were kept without the brackets, as was done for «الخاتمة» in تحفة الأطفال.
- **Added:** «## مُقَدِّمَةٌ» before verse 1. The edition has no heading for verses 1–4, and the app shows an empty section label without one.
  The check edition (Awadi/OpenITI) labels these verses «مقدمة». Remove it if a heading not in the base is unwanted.
- The colophon «تَمَّ بِحَمْدِ اللَّهِ» and the basmala were not included. The quotation marks around the cited forms («فَعْلَلَ») were removed.

## Wording differences: base vs. Awadi edition (base kept in every case)
| Verse | Base (القاسم) | Awadi | Note from the edition's apparatus / reason |
|---|---|---|---|
| 24 | فِي غَيْرِ هَذَا **لَدَى** الْحَلْقِيِّ | لذي | The apparatus notes no manuscript with لذي. Awadi flags it with his own footnote. |
| 29 | **فَمِنْـ \| ـهُ** اعْتَضْ | فعنه | «في نسخة على حاشية ج: فعنه». التلمساني: «وفي كثير من النسخ (فَعَنْهُ) وهو أحسن». **Noted for review.** |
| 34 | تَرَهْـ \| شَفَ | ترهشفت | التلمساني and the Short Commentary: «تَرَهْشَفْتُ». |
| 35 | كَلْتَبَ … ادْلَمَّسَ | كلتبت … اولمس | «في و، ي: كلتبت». Awadi's اولمس looks like a misprint. |
| 36 | اضْمُمَنْ **لِتَسَلْقَى** | تسلقى | Awadi drops the lam. |
| 54 | **وَمُشْبِهاً** عَجُلَا | ومشبه | The apparatus records مشبهٌ / مشبهٍ / مشبهاً. The edition chose the accusative. |
| 55 | الْجَذْلَانَ | الجزلان | A misprint in Awadi's copy. |
| 56 | خَفِيـ \| فٍ **أَشْيَبٍ طَيِّبٍ** | خفيف طيب أشيب | «في ج، ز، ن: طيِّب أشيب بتقديم وتأخير». |
| 57 | صَالِحٌ **مِنْ** كُلٍّ | في كل | Not in the apparatus. |
| 65 | مُجَرَّداً **أَوْ بِتَا** التَّأْنِيثِ | وبتا | «في ب، هـ، ي، ل، م: وبتا، وهو موافق لشرح البجائي وبحرق، والمثبت موافق لشرح التلمساني». |
| 88 | **تَبِنْ** بِهَا مَرَّةٌ | يبن | «في و: يبن بالياء». |
| 100 | وَاشْرُقَنْ **نُخِلَا** | بخلا | «في ب، ج، د، هـ، ح، ل، م، ن: بِخَلَا». The edition keeps نُخِلَا with التلمساني («أي غُربِل وأُزيل لَبْسُه»). **Noted for review.** |
| 103 | مَفْعَلٌ **أَوْ** مَفْعِلٌ | ومفعل | «في ز، ح: ومَفْعِلٌ بالواو». |
| 105 | عَنْهُمُ فِي **ذَا قَدِ** احْتُمِلَا | ذلك | «في د، هـ: ذلك … موافق لشرح بحرق، والمثبت موافق لشرح ابن الناظم والتلمساني». |
| 108 | **وَالْآتِ** مِنْ نَخَلَا | آلات | Not in the apparatus. The base means «what comes from نَخَلَ» (i.e. مُنْخُل). Awadi has «آلات» without و. |
| 112 | **وَالصَّحَابَةِ الْكِرَامِ** | الغر والصحب | «في د، هـ، م: الغُرِّ والصَّحْبِ … موافق لشرح بحرق، والمثبت موافق لشرح التلمساني». |
| 114 | مُسْتَبْشِراً **آمِناً** | جذلا | «في شرح بحرق: جذلا بدل آمناً». |
| 9, 23, 64 | حُلَى، قِلَى، رِضاً | حلا، قلا، رضى | Spelling of the final alif only. |

## Vocalization
- Taken from the edition without changes. No vocalization corrections were needed: the bare copy and the annotated copy agree letter for letter,
  and no word in the file is left without marks (about 96% of consonants are marked; the rest are mostly the lam of «ال»).
  Where the manuscripts differ on a vowel (e.g. 23 «غَيْرُ/غيرَ», 36 «بَيْطَرْتَ/بيطرتُ», 54 «عَجُلَا/عجِلا», 64 «وَصَلَاحٍ/وصلاحٌ», 65 «فَعَالَةٌ»),
  the editor's choice was kept. His apparatus gives the sharh evidence for each one (Shamela 344 pp. 46–115).
- The edition writes the dropped-hamza forms on purpose: «اوْ», «اشِعْ», «انْ», «الَاوَّلِ», «الَاخِرِ». These were kept.

## Mechanical changes
- Verse numbers, «…» (now « | »), quotation marks «», commas, colons, semicolons and the dashes in v.18 («قَسَّتْ - كَذَا -») were removed.
- A proclitic that the quote marks had separated was joined back to its word: «بِـ «فَعْلَلَ»» → «بِفَعْلَلَ», «كَـ «أَتَى»» → «كَأَتَى», «وَ «افْعَلَّ»» → «وَافْعَلَّ».
- **Words split across the two hemistichs** (32 verses: 6, 7, 13, 15–17, 28, 29, 33–36, 38, 39, 44, 46, 49, 53, 56, 57, 63, 70, 71, 73, 74, 78, 82,
  87, 90, 91, 95, 100). The edition prints these as «وَافْـ … ـتَحْ». The file follows the shatibiyya data: the first half ends with «ـ» and the
  second half starts without it («وَافْـ | تَحْ»). This is the only tatweel left in the file. In v.7 the edition prints «وَحِرْ … ـتَ», with the
  mark on the second half only, so the file has «وَحِرْـ | تَ».
- NFC, UTF-8 without BOM. `node tools/build-poem.js` passes: 114 verses, 14 sections.

## Places to verify
- 29 «فَمِنْهُ» vs «فَعَنْهُ», 100 «نُخِلَا» vs «بِخَلَا», 112/114: the edition's choice was kept. Some teachers memorize بحرق's readings
  (الغُرِّ والصَّحْبِ، جَذِلَا، ذلك، وبتا).
- The added «## مُقَدِّمَةٌ» heading (see Headings).
