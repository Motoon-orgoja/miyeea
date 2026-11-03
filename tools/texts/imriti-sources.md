# Texts report — نظم الورقات للعمريطي (`imriti.txt`)

Verse numbers below follow the standard numbering 1–211, which is the numbering of the base and of the Shamela text.

Comparison method: every source was stripped of harakat and tatweel, alef/yaa/hamza forms were unified, and each verse was compared word by word with every check source. This was done with a script (`cv.js` / `cv2.js` in scratchpad `waraqat_imriti/`), not by eye. Raw downloads are in `tools/texts/raw/imriti/`.

## Sources
- **Base (D): «تَسْهِيلُ الطُّرُقَاتِ فِي نَظْمِ الوَرَقَاتِ», «ضبط وتصحيح» الشيخ أحمد بن عمر الحازمي.**
  - Ketabonline 20490 (from الشاملة الذهبية): https://ketabonline.com/ar/books/20490 (pages 1–13).
  - The same edition is the islamhouse Word file, with identical text, footnotes and the 1–211 numbering: https://islamhouse.com/ar/books/286768 (`ar_Nazm_alwaraqat.doc`).
  - The script found no difference in verse wording between the two. Their only differences are footnotes and headings.
  - The verse structure was taken from the DOC, because it numbers every verse. The ketabonline page layout merges some headings into verses.
  - Fully vocalized. The editor gives 37 footnotes «وفي نسخة…».
- **Check 1 (K): ketabonline 27182** «نظم الورقات للعمريطي», fully vocalized, from «الجامع للمتون العلمية» (الشمراني) and مكتبة ابن تيمية. It has many typos (for example «تلاِستِدلالِ», «وَخِزبِهِ», and verse 170 b is corrupt). https://ketabonline.com/ar/books/27182
- **Check 2 (U): usul.ai «تسهيل الطرقات»**, edition «Special Shamela», unvocalized, numbered 1–211. https://usul.ai/ar/t/tashil/1 … /11
- **Not used:** the islamhouse PDF «تسهيل الطرقات» (سلسلة متون معهد السنة). Its text layer is broken (glyph-encoded). Shamela has no standalone copy of the nazm.

## Count
- **211 verses.** D, K and U all agree, verse for verse; no verse is missing or extra in any of them.
- The commonly cited figure varies by source (islamhouse and the blog «خزانة المنظومات» also give 211). The figure of about 214 mentioned in the task was not found in any source.
- The poem's own chronogram «أَبْيَاتُهَا فِي الْعَدِّ دُرٌّ» gives د4 + ر200 = 204. So the count the poet states differs from all copies by 7. This was left as is, and is noted here only.
- The year verse «فِي عَامِ طَاءٍ ثُمَّ ظَاءٍ ثُمَّ فَا» gives 9 + 900 + 80 = **989 AH** for the completion of the poem, in ربيع الثاني. So the poet was alive in 989. On that basis the meta says «ت بعد ٩٨٩هـ». Ketabonline 20490 says «ت 890» and usul.ai says «989».

## Headings (23)
- **D's own headings (20), kept:**
  - بَابُ أُصُولِ الْفِقْهِ، أَبْوَابُ أُصُولِ الْفِقْهِ، بَابُ أَقْسَامِ الْكَلَامِ، بَابُ الْأَمْرِ، بَابُ النَّهْيِ، بَابُ الْعَامِّ، بَابُ الْخَاصِّ، بَابُ الْمُجْمَلِ وَالْمُبَيَّنِ، بَابُ الْأَفْعَالِ، بَابُ النَّسْخِ
  - بَابٌ فِي التَّعَارُضِ بَيْنَ الْأَدِلَّةِ وَالتَّرْجِيحِ، بَابُ الْإِجْمَاعِ، بَابُ الْأَخْبَارِ، بَابُ الْقِيَاسِ، بَابُ تَرْتِيبِ الْأَدِلَّةِ، بَابُ صِفَةِ الْمُفْتِي وَالْمُسْتَفْتِي، فَرْعٌ، بَابُ الِاجْتِهَادِ
  - Typos fixed in two of them: «النَّهِي» → «النَّهْيِ», and «صِفَةِ ِالْمُفْتِي» (stray kasra) → «صِفَةِ الْمُفْتِي».
- **The three bare «فَصْلٌ» headings (verses 67, 167, 174)** were completed from D's own table of contents, so that sections are distinguishable:
  - «فَصْلٌ فِيمَنْ يَتَنَاوَلُهُ خِطَابُ التَّكْلِيفِ» (the wording of K's heading)
  - «فَصْلٌ فِي شُرُوطِ أَرْكَانِ الْقِيَاسِ»
  - «فَصْلٌ فِي الْحَظْرِ وَالْإِبَاحَةِ»
- **«مُقَدِّمَةٌ» (verse 1) and «الْخَاتِمَةُ» (verse 208)** are editorial headings that K prints in square brackets. They were added without brackets, as was done for tuhfa.

## Wording differences and the reading chosen
Rule: choose the reading two of the three texts agree on, with the meter checked. D's emendation was kept only where the reading of K and U is clearly corrupt or ungrammatical.

| Verse | Adopted | D (base) | K / U | Why |
|---|---|---|---|---|
| 14 b | مِنْ **عَاقِدٍ** هَذَانِ أَوْ مِنْ عَابِدِ | عاقد | قاعد / قاعد | Kept D. The meaning is contracts versus acts of worship. «قاعد» looks like a metathesis. See «مواضع للتأكد». |
| 32 a | وَالشَّكُّ **تَحْرِيرٌ** بِلَا رُجْحَانِ | تجويز | تحرير / تحرير | K, U. D's own footnote says «وفي نسخة تحرير. وما أثبته أوضح», so «تجويز» is the editor's emendation. |
| 74 b | مِنْ ذَاكَ مَا لِلشَّرْطِ **مِنْ جَزَاءِ** | والجزاء | من جزاء / من جزاء | K, U |
| 99 a | يُفِيدُ **مَا سُمِعْ** | من سَمِع | ما سُمِع / ما سمع | K, U, and D's footnote 20. The vocalization is the footnote's «مَا سُمِعْ». |
| 104 b | **فَطَاعَةٌ** أَوْ لَا فَفِعْلُ الْقُرْبَهْ | وطاعةً | فطاعةٌ / فطاعة | K, U, and D's footnote 21 |
| 124 b | كُلٌّ مِنَ الْوَصْفَيْنِ **فِي** وَجْهٍ ظَهَرْ | من | في / في | K, U, and D's footnote 25 |
| 144 b | جَمْعٌ لَنَا **عَنْ مِثْلِهِ** عَزَاهُ | لمثله | عن مثله / عن مثله | K, U, and D's footnote 27. The meter is sound either way. |
| 153 b | حَدَّثَنِي كَمَا **تَقُولُ** أَخْبَرَا | يقول | تقول / تقول | K, U, and D's footnote 29 |
| 166 a | **فَلْيُلْحَقِ** الرَّقِيقُ فِي الْإِتْلَافِ | فيُلحَق | فليلحق / فليلحق | K, U, and D's footnote 32 |
| 171 a | لَمْ **يَنْتَقِضْ** لَفْظًا وَلَا مَعْنًى | تنتقض | ينتقض / ينتقض | K, U |
| 179 a | إِلَّا **مَا** وَرَدْ | إن | ما / ما | K, U |
| 191 b | وَاللُّغَةِ الَّتِي أَتَتْ **مِنَ** الْعَرَبْ | عن | من / من | K, U, and D's footnote 36 |
| 194 b | فَعِلْمُ هَذَا الْقَدْرِ فِيهِ **كَافِي** | كافِ | كافي / كافي | K, U. The pronunciation is the same either way, since the rhyme vowel is lengthened. |
| 204 b | **وَالزَّاعِمِينَ** أَنَّهُمْ **لَنْ** يُبْعَثُوا | الزاعمين، لن | الزاعمون، لم / الزاعمون، لم | Kept D. «الزاعمين» is joined by ʿatf to «النصارى» in the genitive, and «لن» echoes ﴿زَعَمَ الَّذِينَ كَفَرُوا أَنْ لَنْ يُبْعَثُوا﴾. D's footnote 37 records «لم». See «مواضع للتأكد». |
| others | D | — | K: أظهرَ (2), صارَ (4), التصحيح (19), قد انتسخ (39), وذُو (68), فلينسخ (120), يلتحقُ (165); U: بالفقه (21), مطلق (41), يتقدم (87), العملي (182) | Each is a single-witness reading against the other two, or a typo. D was kept. |

## Corrections to D's vocalization and spelling (typos; each checked against K's vocalization and the meter)
- 5 الصِّغَاِر → الصِّغَارِ
- 7 فَلمْ → فَلَمْ
- 11 الْأََصْلُ → الْأَصْلُ
- 14 هذَانِ → هَذَانِ
- 15 فيِ → فِي
- 17 وَليْسَ → وَلَيْسَ
- 19 الصْحِيحِ → الصَّحِيحِ
- 20 تَعْتَددِ → تَعْتَدِدْ (rhymes with عُقِدْ)
- 24 بَسيِطًا → بَسِيطًا
- 26 حاصِلٌ → حَاصِلٌ
- 27 كاَلْمُسْتَفَادِ → كَالْمُسْتَفَادِ
- 31 فَالَّرَاجِحُ → فَالرَّاجِحُ
- 45 للِأَخْبَارِ → لِلْأَخْبَارِ
- 49 ثَلاثَةٌ / وَاللُّغَويُّ / الْعُرْفيُّ → ثَلَاثَةٌ / وَاللُّغَوِيُّ / الْعُرْفِيُّ
- 53 "كَمِثْلِِهِ" → كَمِثْلِهِ
- 54 "يُرِيدُ أَنْ يَنْْقَضَ" → يُرِيدُ أَنْ يَنْقَضَّ (as in the mushaf and K; the meter is sound)
- 55 وَحَدُّه استِدعَاء → وَحَدُّهُ اسْتِدْعَاءُ
- 56 حَيثُ القَرِبنَةُ انتَفَتْ → حَيْثُ الْقَرِينَةُ انْتَفَتْ
- 59 وَلمَ ْ يُفِدْ / لمَّ ْيَرِدْ → وَلَمْ يُفِدْ / لَمْ يَرِدْ
- 67 وَالمؤْمِنُونَ → وَالْمُؤْمِنُونَ
- 68, 84, 136 «لمَ ْ» → «لَمْ»
- 72 أَلفَاظُهُ → أَلْفَاظُهُ
- 73 بِالَّلَامِ → بِاللَّامِ
- 97, 99 مَعْنىً → مَعْنًى
- 116 مِْنهُمَا → مِنْهُمَا
- 153 وَقَاَل → وَقَالَ
- 154 أَخْبَرَني → أَخْبَرَنِي
- 165 فَلْيَلَْتَحِقْ → فَلْيَلْتَحِقْ
- 170 الَّّّتِي → الَّتِي
- 185 الْخَفي → الْخَفِي
- 192 سَائَلا → سَائِلَا
- 196 كَاَنَ → كَانَ
- 207 في ذَاكَ منْ → فِي ذَاكَ مِنْ
- 208 في → فِي
- 209 ظاءٍ → ظَاءٍ
- **Spacing:**
  - The detached «وَ » was joined to the next word (26 places, for example «وَ التَّقْصِيرِ» → «وَالتَّقْصِيرِ», «وَ صْفِهِ» → «وَصْفِهِ»).
  - Fused words were separated: لَامَعْ، مَالَمْ، لَاغَيْرِهَا، لَايُحْتَجُّ، أَوِاسْتِعَارَةٍ.
- **«الِإ» → «الْإِ»:** kasra on the lam of «ال» instead of under the hamza (10 places: الْإِبَاحَةِ، الْإِسْلَامُ، الْإِنْسَانِ، الْإِتْلَافِ، الْإِجْمَاعِ…).
- **Sukun added on lam al-qamariyya** where the base left it bare (62 places, for example الفِقْهِ → الْفِقْهِ, الكَلَامِ → الْكَلَامِ).
- **Not changed:** «بَسِيطًا اوْ مُرَكَّبًا» (24). The hamza is dropped for the meter, and K has the same.
- Footnote markers, verse numbers, tatweel, quotation marks and one colon (54) were removed.

## مواضع للتأكد
1. **14 b «مِنْ عَاقِدٍ»** against «مِنْ قَاعِدٍ» in both check texts. D was kept on meaning.
2. **204 b «وَالزَّاعِمِينَ… لَنْ»** against «وَالزَّاعِمُونَ… لَمْ» in both check texts. D was kept on grammar and the Qur'anic echo.
3. **13 b «مَعْ مَا حَرُمَا»** (D) against K's «حُرِّمَا». **48 b «قَدُمَا»** (D) against K's «قُدِّمَا». **43 a «الْكَلَامَ رَكَّبُوا»** (D) against K's «الْكلامُ». All three are vocalization differences only, and D was kept in each. They are worth confirming against a recording or a teacher.
4. **32 a «تَحْرِيرٌ»** follows the two copies and D's footnote, not D's own emendation «تجويز» (which the editor calls clearer). If the app should follow al-Hazimi exactly, revert this.
