# Texts report: رائية الخاقاني في التجويد (أبو مزاحم الخاقاني، ت ٣٢٥هـ) — `khaqaniyya.txt`

Scripts: `four-build/` (`parse.js` → `out/khaqaniyya.json`, `collate.js` → `out/khaqaniyya.collation.txt`, `build.js` + `cfg/khaqaniyya.js` → `khaqaniyya.txt` and `out/khaqaniyya.build-log.txt`). Raw downloads: `raw/khaqaniyya/`.

## 1. Sources
- **Base (A):** «منظومة أبي مزاحم الخاقاني = رائية الخاقاني في التجويد», Shamela (الشاملة الذهبية), ketabonline 102568: https://ketabonline.com/ar/books/102568. 51 numbered verses, vocalized (94.4% of letters; it mostly leaves the sukun unwritten).
- **Check 1 (B):** «القصيدة الخاقانية», ketabonline 15976: https://ketabonline.com/ar/books/15976. 51 verses, vocalized (91%). Its own note says it was vocalized from the text in د. غانم قدوري الحمد, «أبحاث في علم التجويد». It has many typing slips in the marks (الأجْرٍ، فَيهِ، مَعاُ، بِيْتَاً…).
- **Check 2 (C):** the series «أضواء من قناديل رائية الخاقاني» on ملتقى أهل التفسير (thread 56389): https://mtafsir.net/threads/56389/. Verses 1–15 and 19–37 as the commentator quotes them (34 verses). It starts from B's text and corrects it in places, so it is not fully independent of B.

No single fully vocalized print was found online; A is the best one. The result is **fully vocalized**: A, with the marks A leaves out taken from B/C (65 words, listed in the build log), the sukun written mechanically on a bare medial letter after a short vowel (20 letters), and 12 small completions/corrections (§4).

## 2. Count
**51 verses**, the number the poet states in v. 18 («وَأَبْيَاتُهَا خَمْسُونَ بَيْتًا وَوَاحِدٌ»). A = B = 51.

## 3. Wording (A against B and C)
| v. | Adopted | Other reading | Why |
|---|---|---|---|
| 9a | ابْنُ **الْكَثِيرِ** وَنَافِعٌ | A: ابنُ كثيرٍ | B + C; A's reading gives a مكفوف foot, the article gives a sound one |
| 3a | عَوْنِي **عَلَى** مَا نَوَيْتُهُ | B: عِلْمَ | A + C; B is a slip |
| 8b | رَبِّهِمُ **الْوِتْرِ** | B: للوتر | A + C |
| 9b | ابْنٌ **لِلْعَلَاءِ** | B, C: ابنُ العلاءِ | A; B's reading does not scan |
| 14a | **وَإِمَّا** حَدَرْنَا | B: وأمّا، C: ومهما | A |
| 15b | **لِيَدْرِي بِهِ** | B, C: لِيَدْرِيَهُ | A kept (see §5) |
| 25a | **وَإِنْ** أَنْتَ | B, C: فإن | A |
| 27b | **أَلَّا** تَزِيدَ | B, C: أن لا | spelling only |
| 28b | وَأَخْفِ **الْحَرْفَ** | B: الحروفَ | A + C; B does not scan |
| 30 | **لِجَزْمِهَا** … **لِلرَّفْعِ** | B, C: بجزمها … بالرفع | A |
| 33b | **وَيَاءٌ وَوَاوٌ** | B: وواو وياء | A |
| 34a | وَاشْدُدِ الْفَكَّ **عَامِدًا** | B: مُذْ أتى | A + C |
| 34b | فِي **الْفَتْحِ وَالضَّمِّ** | C: في فتحك الحرفَ | A + B |
| 35b | مَا كَانَ **لَحْنًا** | C: يخفى | A + B |
| 36a | **وَإِنْ تَكُ** | B: فإن يكُ | A |
| 37a | **وَرَقِّقْ** … **يَنْذَرِبْ** | B: وأرقق … تندرب | A |
| 42a | مِنْ قَبْلِ **مُدْغَمٍ** | B: ساكنٍ | A |
| 43b | **فَصَارَ** | B: فصارا | A |
| 48b | **فَقِسْهُ** عَلَيْهَا | B: فنبّه | A |
| 49b | **يُلَقَّنُهَا بَاغِي** التَّعَلُّمِ | B: يبيّنها راعي | A |
| 50b | لَدَى **الْفَجْرِ** | B: الفخر | A |

## 4. Harakat completed or corrected (all in `out/khaqaniyya.build-log.txt`)
- 8b «الوَِتْرِ» (A prints fatha and kasra together) → **الْوِتْرِ** (B, C).
- 9b «للعَلَاءِ» → **لِلْعَلَاءِ**; 30a «لِجزْمِها» → **لِجَزْمِهَا**; 50a «الَّذي» → **الَّذِي**; 46a «حُروفُ» → **حُرُوفُ**; the fatha before a madd alef in 32a, 32b, 40b, 47a; the nun of مِنْ / مَنْ in 2b, 6b, 15b.
- The rhyme kasra written where A leaves it out (35b, 36b, 51b). «يَنْبَغِى» → **يَنْبَغِي** (spelling).
- The two Quranic quotations are put between ﴿﴾ (41b ﴿إِيَّاكَ نَعْبُدُ﴾, 47b ﴿مِنْ خَيْلٍ﴾). The word «الزِّيادة» in v. 25 is cut between the hemistichs as in all three sources: «فَاحْذَرِ الزْـ | ـزِيَادَةَ».
- **Meter:** all 102 hemistichs scan as ṭawīl (ʿarūḍ مفاعلن, ḍarb مفاعيلن), checked on the fully vocalized text.

## 5. To verify
- 15b «لِيَدْرِي بِهِ مَنْ لَمْ يَكُنْ» (A) against «لِيَدْرِيَهُ مَنْ» (B, C). Both scan. A is kept because it is the base, but B/C's reading is the grammatical one (the verb is manṣūb) and may be the reading of غانم الحمد's edition.
- 7a «أَخْذَ الْقِرَاءَةِ سُنَّةٌ» (A, khabar) against «سُنَّةً» (B, C, ḥāl). A kept.
- 43b «ذُو الْخُبْرِ» (A) against «الخَبْرِ» (B); 40b «بِالشُّكْرِ» (A) against B's «بالشِّكر» (a slip).
- A printed critical edition (عبد العزيز القارئ، «قصيدتان في تجويد القرآن»؛ أو غانم قدوري الحمد) was not available online as text; the three points above should be checked against one.
