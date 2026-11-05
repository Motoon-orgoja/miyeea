# Texts report: مائة المعاني والبيان (Ibn al-Shihna al-Halabi, d. 815 AH) — `miatmaani.txt`

How the collation was done:
- Each witness was parsed into its 100 verses (`miatmaani-build/parse-takwin.js`, `parse-D.js`, `parse-U.js`).
- The verses were compared word by word by script after stripping harakat and unifying alef/yaa/taa marbuta (`miatmaani-build/review.js` → `review.txt`). Base → final was checked with `wdiff.js` and `hdiff.js`; the list is in `miatmaani-build/harakat-changes.txt`.
- The meter was checked with a rajaz scanner (`miatmaani-build/rajaz.js`). Tested on `jawharmaknun.txt`, it leaves 8 of 582 hemistichs unparsed, all edge cases.
- Raw downloads are in `raw/miatmaani/`.

## 1. Sources
- **Base (T), fully vocalized, the circulated students' text:** تكوين الراسخين, «مائة المعاني والبيان», https://takw.in/lughah/balaghah/miah-almaani (reader page `raw/miatmaani/takwin-reader.html`). The Golden Shamela «مائة المعاني والبيان» (ketabonline 25439, `raw/miatmaani/ko25439.json`) is the same digital text. T agrees with **(ط)**, the matn printed in «مجموع مهمات المتون», in almost every place where the critical apparatus of D cites it (see below). So T is the circulated wording.
- **Check 1 (D), fully vocalized critical edition:** «دُرَر الفرائد المستحسنة في شرح منظومة ابن الشحنة» by Ibn ʿAbd al-Haqq al-ʿUmari, ed. Sulayman al-ʿUmayrat, Dar Ibn Hazm 2018. Ketabonline 97090 (`raw/miatmaani/ko97090.json`), pp. 91–105: the edited matn on its own, collated with 11 manuscripts plus ط, with footnotes.
- **Check 2 (U):** «منظومة ابن الشحنة في البلاغة», ed. Jamil ʿAbdallah ʿUwayda (2009). Ketabonline 26803 (`raw/miatmaani/ko26803.json`). It is based on a manuscript and lightly vocalized.

**Rule for wording.** The circulated reading (T = ط) is kept. A difference is resolved by the majority of T, D and U, with ط, as cited in D's apparatus, breaking ties. The meter overrides when the circulated reading does not scan.

## 2. Count and divisions
- **100 verses**, as the poem says («أبياتها عن مائة لم تزد»). T, D and U all have 100, in the same order.
- 13 headings. The ten chapter headings are T's (الباب الأول … الثامن، علم البيان، علم البديع، الخاتمة), with their vocalization normalized. «عِلْمُ الْمَعَانِي» before verse 11 is D's heading; T has none there. «مُقَدِّمَةٌ» before verse 1 is descriptive.

## 3. Wording differences (T = takwin/ط, D = al-ʿUmayrat, U = ʿUwayda)
| v. | Adopted | T reading | Why |
|---|---|---|---|
| 27 | وَبِإِضَافَةٍ **فَلِاخْتِصَارِ** | فَلِلِاخْتِصَارِ (= ط) | Meter: «…فَتِنْ فَلِلِخْ…» breaks the second foot. D and U agree |
| 36 | يَأْتِي **كَأَوْلَى** | كَالْأُولَى | D + U (ط is not cited, so it agrees with D) |
| 37 | وَالذِّكْرُ **أَوْ** يُفِيدُنَا تَعْيِينَهْ | قَدْ | D + U |
| 53 | **فَقَصْرُكَ الْوَصْفَ** عَلَى الْمَوْصُوفِ | فَقَصْرُ الْوَصْفِ | Meter: T and D's «فقصر صفةٍ» do not scan. U, and the manuscripts مد، هر، ظا in D's apparatus, read «فقصرك الوصف» |
| 62 | وَمَا \| **هَمْزًا عَدَا** تَصَوُّرٌ | عَدَا هَمْزَةً | Meter. D: «this is the reading of (ط)», and «عدا همزةً» does not scan |
| 64 | يَكُونُ **جَاءِ** | جَائِي | D + U; this is the spelling of the manqus (same pronunciation) |
| 68 | تَالِيَةٌ مِنْ **مَاضِيَهْ** | ثَانِيَهْ | D + U |
| 75 | مَا بِهِ يُعَرَّفُ | مَا بِهِ **قَدْ** يُعَرَّفُ | Meter: «قد» is extra. D + U |
| 76 | فَمَا بِهِ لَازِمُ **مَوْضُوعٍ** لَهْ | «فِما بِهِ لاَزِمُ مَا موُضوع لَهْ» | T is garbled and does not scan. D + U (ط: «فيما به لازم ما وُضِع له») |
| 85 | مُفْرَدٌ **اوْ** مُرَكَّبٌ | without أو | D + U, and the meter |
| 65 | بَعْدَهَا | «بَعْدَ هَا» | Spacing only |

Kept as in T against D:
- With ط: «أَنِّي أَنْظِمَا» (2), «إِنْ ذَا يُعْدَمَا» (10), «تَكُنْ مُعَرِّفَا» (21), «أَوْ قَصْدِ» (23), «تُفِيدُ» (26), «وَلِلِاخْتِبَارِ» (19), «زَائِدَا» (40), «بِاعْتِبَارِ» (41), «طَرِيقُهُ» (54), «وَأَنَّى» (61), «يَكُونُ» (63), «تَجِيءُ» (66), «فَافْصِلْ وَإِنْ تَوَسُّطٌ» (69), «وَضَرْبُ» (72), «اقْسِمَا… فَافْهَمَا» (84), «يُجْعَلُ» (86), «اسْتُطِيعَ» (96), «وَانْتِقَالِ… مُنْتَهَى الْمَقَالِ» (100).
- With U: «فِيهِ التَّمَنِّي» and «لَمْ يَكُنِ» (59), «فَمَعْلُومٌ» (57), «وَاحِدًا» (81), «مِثْلَ مَا» (55).
- Verse 77 «إِمَّا مَجَازٌ مِنْهُ وَاسْتِعَارَةُ… أَوْ كِنَايَةُ»: D and U lack the و, but their line does not scan, so T was kept.

## 4. Vocalization
- **Coverage:** 100% vocalized, checked by script for bare consonants. All 200 hemistichs scan as rajaz. The scanner flags only 58a; it scans by naql, as in the next point.
- T's vocalization was kept wherever it is possible. 359 occurrences were changed (list in `harakat-changes.txt`). Most of them are conventions:
  - the sukun of the article lam;
  - «لاَ» → «لَا»;
  - tanwin moved off the alif;
  - hamzat al-wasl written without hamza (وَالإِحْتِرَازِ → وَالِاحْتِرَازِ، لِلإِخْتِبَارِ → لِلِاخْتِبَارِ);
  - typing errors (القَّصْرُ، وَلِّوْ، الْبَيِّانِ، ظِّاهِرِ، اقْتِبِّاسٌ، وَتَّلْمِيحٌ، فَهًمٍ، تَعْظِيِمٍ).
- **Corrections of substance** (all as in D):
  - 6 «وَكَوْنِهِ مُخَالِفَ الْقِيَاسِ» (T وَكَونُهُ): it is coordinated with «غرابتِه» under «سلامته من».
  - 15 «إِنِ ابْتِدَائِيًّا» (T إِنْ ابْ…).
  - 18 «مَجَازٌ أُوِّلَا» (T مَجَازاً أَوَّلاَ; U also مجازٌ أُوِّلا).
  - 23–24 «وَعَلَمِيَّةٍ… وَصِلَةٍ» (T nominative): coordinated with «بِإِضْمَارٍ».
  - 33 «أَوْ رَدُّ سَامِعٍ» (T رَدِّ): coordinated with «تفصيلٌ».
  - 34 «فَلِاهْتِمَامٍ».
  - 45 «لَا كَوْنِ ذَاكَ» (T كَوْنُ).
  - 48 «غَيْرَ الْقَصْدِ» (T غيْرِ), the object of «توهُّم».
  - 51 «وَبَعْضَ مَعْمُولٍ عَلَى بَعْضٍ» (T وَبَعْضُ… بَعْضِ), the object of «قَدِّمْ».
  - 58 «يَسْتَدْعِي **الِانْشَاءُ**» (T الإِنْشَاءُ): the meter needs naql («يستدعِلِنْشاءُ»).
  - 63 «وَغَيْرِ ذَا» (T وَغَيْرُ).
  - 66 «ثُمَّ مَوْقِعَ الْإِنْشَاءِ» (T ثَمَّ).
  - 67 «وَالْحِرْصِ» (T وَالْحِرْصُ).
  - 74 «وَالِاعْتِرَاضِ» (T وَالاعْتِرَاضُ).
  - 84 «اقْسِمَا» with hamzat wasl (T أَقْسِما, which would mean "swear").
  - 91 «كَتَجْنِيسٍ وَرَدّ» (the device رَدّ العجز; T وَرَدْ).
  - 98 «يُنْقَلُ» (rhyme with أَشْمَلُ).
  - 99 «وَالتَّأَنُّقْ إِنْ تَسَلْ» (T وَالتَّأَنُّقُ أنْ تَسَل): meter.
  - 3 «أُرْجُوزَةً».
- **Hamza dropped for the meter** (pronunciation spelling, as in `jawharmaknun.txt`): «وَاحِدًا اوْ» (81), «مُفْرَدٌ اوْ… مُرْسَلًا اوِ» (85), «وَسَجْعٍ اوْ» (91). D writes «أَوْ» in all of them, but these lines only scan with the hamza dropped (naql).

## 5. مواضع للتأكد
1. Verse 9: «نَصِفُهْ» (T, D, U) was kept. ط reads «تَصِفُهْ».
2. Verse 53: «فقصرك الوصف» was adopted for the meter. Please confirm against a print of «مجموع مهمات المتون».
3. These are kept as in T, though D and U have the other vocalization:
   - 15 «فَلَا يُؤَكِّدُ» (D, U: يُؤَكَّدُ);
   - 30 «يَشْمُلُ» (D, U: يَشْمَلُ);
   - 86 «أَوِّلَهْ» (D: أَوَّلَهْ);
   - 72 «قَصْرٌ» (D: قِصْرٌ);
   - 5 «نُفْرَةٍ» (D: نَفْرَةٍ);
   - 55 «دِلَالَةُ» (D: دَلَالَةُ).

   Both forms are correct in every case.
4. Verse 10 differs in U («يقولُ والكِذْبُ خِلافُهُ اعْلَما»). The circulated «إِنْ ذَا يُعْدَمَا» (ط) was kept.
