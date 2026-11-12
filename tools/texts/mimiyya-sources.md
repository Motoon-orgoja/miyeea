# Texts report: ميمية ابن القيم «الرحلة إلى بلاد الأشواق» (ابن قيم الجوزية، ت ٧٥١هـ) — `mimiyya.txt`

Scripts: `four-build/` (`parse.js`, `collate.js` → `out/mimiyya.collation.txt`, `build.js` + `cfg/mimiyya.js` + `voc/mimiyya.txt` → `mimiyya.txt`, log `out/mimiyya.build-log.txt`). Raw downloads: `raw/mimiyya/`.

## 1. Sources
- **Base (A):** «القصيدة الميمية», Shamela (الشاملة الذهبية), ketabonline 54664: https://ketabonline.com/ar/books/54664. 229 verses in six parts with titles (القصيدة الميمية / مشهد الحجيج / انتفاضة البعث / أمنيات / سبيل النجاة / بلاد الأشواق); **half vocalized (50% of letters)**.
- **Check 1 (B):** «شرح القصيدة الميمية», سعد المزعل (سلسلة بحوث مجلة الحكمة ١٧), Shamela, ketabonline 22804: https://ketabonline.com/ar/books/22804. Its text is that of «مجموعة القصائد المفيدة» with the additions of مصطفى عراقي's «الرحلة إلى بلاد الأشواق»; 229 numbered verses, 69% vocalized, with many typing slips in the marks. (Two of its verses, 135 and 142, could not be read by the parser because a page break falls inside them; they are not variants.)
- **Check 2 (W):** Wikisource «القصيدة الميمية لابن القيم»: https://ar.wikisource.org/wiki/القصيدة_الميمية_لابن_القيم. It is the same typed copy as A (same marks), so it only counts where it differs from A (v. 97).

**No fully vocalized digital text was found.** The vocalization in `mimiyya.txt` is **completed by AI** (`voc/mimiyya.txt`): typed in full on A's wording, keeping the marks A prints (the exceptions are in §4), and checked by script: the letters equal the base in 451 of 460 hemistichs, the other 9 are the decisions of §3, and every hemistich scans.

## 2. Count
**230 verses.** A and B both have 229, but not the same ones: at v. 209 A runs two verses into one, and A has one verse that B gives only in a footnote (from «حادي الأرواح»). With A's verse 209 restored from B the total is 230 (the number usually given is «نحو ٢٣٠»).

## 3. Wording (base A)
| v. | Adopted | A | Why |
|---|---|---|---|
| 97b | **وَلَكِنْ** أَضَعْتَ الْحَزْمَ | ولو أضعتَ | B + W; A does not scan |
| 164a | **فَالْمَوْتُ** خَلْفَكَ **مُسْرِعٌ** | فالسَّيْرُ خلفَكَ مُسْرِعًا | B; the second hemistich («ما منه مفرّ») is about death |
| 174a | أَهْدَتْ إِلَى **الْوَجْهِ** نَضْرَةً | إلى القلب | B; ﴿وُجُوهٌ يَوْمَئِذٍ نَاضِرَةٌ﴾ |
| 185–186 | لَهَا فِرَقٌ … \| **بِجُمْلَتِهَا أَنَّ السُّلُوَّ مُحَرَّمُ** ثم تُذَكِّرُ بِالرَّحْمَنِ … \| **فَيَنْطِقُ بِالتَّسْبِيحِ لَا يَتَلَعْثَمُ** | the two second hemistichs exchanged, «تذكّر» first | B's order and pairing (the sense needs it) |
| 188b | لَيْسَ **يَهْرَمُ** | ليس يُهْزَمُ | B; A repeats the rhyme word of v. 187 |
| 209–210 | إِذَا هُمْ بِنُورٍ سَاطِعٍ قَدْ بَدَا لَهُمْ \| **وَقَدْ رَفَعُوا أَبْصَارَهُمْ فَإِذَا هُمُ** / **بِرَبِّهِمُ مِنْ فَوْقِهِمْ قَائِلٌ لَهُمْ** \| سَلَامٌ عَلَيْكُمْ طِبْتُمُ وَنَعِمْتُمُ | one verse: «إذا هم بنور ساطع قد بدا لهم \| سلام عليكم طبتم ونعمتم» | A drops two hemistichs; B has both verses |
| 217b | **بَلَى** سَوْفَ تَعْلَمُ | بل سوف | B; A does not scan |

Kept as in A against B: 3b دَعَوْهُمْ (B رعوهم), 21a إِذَا مَا اشْتَدَّ بِي (B «إذا اشتدّ بيَ», does not scan), 35a يَنْصَبُوا (B ينضبوا), 52a وَمَا عَايَنَتْ (B لِمَا), 88b وَدَانَتْ كُؤُوسُ (B ودنت, does not scan), 109b فَمَنْ ذَا الَّذِي (B فمن الذي, does not scan), 114a أَتَتْهُ (B أرته), 128b عَنْهُ (B منه), 138a تَرْتَضُونَهُ (B ترضونه), 161a وَإِنْ (B فإن), 168b نَتَنَعَّمُ (B يُتنعّم), 170a فَلِلَّهِ (B ولله), 175a لَوْ (B إنْ), 177b الْبَحْرَيْنِ (B الفجرين), 180a يَرَاهَا (B تراه), 182a عَنَاقِدَ (B عناقيد), 191a مِمَّا (B ممّن), 201a بِلَا (B لا, does not scan), 204b تَتَفَصَّمُ (B تتقصّم), 207a وَكَالشَّمْسِ (B أو الشمس), 225a مِنْهَا (B فيها).
Verse 211 «سَلَامٌ عَلَيْكُمْ يَسْمَعُونَ جَمِيعُهُمْ» is in A; B gives it only in a note as the reading of «حادي الأرواح».
Spelling only: A writes the long vowel of a pronoun with a waw (ولولاهمو، أنتمو، غبتموا…, 18 words) → «هُمُ»، «أنتُمُ»، «غبتُمُ» as B and W; 50a رُئِيَ; spacing in 135b, 157a, 162a. Words cut between the hemistichs are written with «ـ» on both sides (14, 16, 56, 76, 113, 123, 154, 170, 200, 219, 222).

## 4. Harakat
- Half of the letters had no mark in A; all were completed (AI), on grammar and meter.
- Marks changed against A — slips of the copy: 11a حُبِّهِمْ (A حبِّهُم), 19a نَسَمَاتِ الرِّيحِ (A نسماتٍ), 22a وَقُرْبِهِ, 24b صَبْرُهُ / فَهْوَ (meter), 27b وَلَبَّوْا (A ولبُّوا), 64b الْجَوَائِزُ (A الجوائزِ), 86a عِظَامُ (A عظامِ), 118b حَمِيدًا, 139b مُفَخَّمُ, 144b جَنَّةٍ, 157a حَالُكَ, 178b مَرْهَمُ (rhyme), 188b تَيَقَّنَ.
- Marks changed against A on the dictionary or the grammar (to verify): 36a **مُهَرَاقَةٍ** (A مُهْرَاقة, which is a syllable short), 49 **كُمِّلَ عِتْقُهُ** (B; A كَمَّلَ) and **يُسْتَسْعَى** (A and B يَستسعى), 61b **مِيسَمُ** (A مَيْسَم), 79b **تَشِبُّ** (B; A تشُبّ), 80a **يَثْنِي** (B; A يُثني), 89a **الْغِطَا**, 109a **نُصْحَ** (B; خبر كان), 114b **سَيَقْلِصُ … وَيُفْصَمُ** (A سَيُقْلَصُ … ويَفْصِمُ; B ويُفْصَمُ), 115b **الْحَرُورُ** (B), 124b **لَتَسْلُبُ** (A لتسلِب), 150b **عِيَانًا**, 161b **لَمْ أُوتَهُ** (A «أوتَهْ», a syllable short), 169b and 224b **يَبْسِمُ** (A يبسُم), 211b **تَسْلِيمَهُ** (object of يسمعون; A تسليمُهُ).
- **Meter:** all 460 hemistichs scan as ṭawīl (ʿarūḍ and ḍarb مفاعلن), checked on the fully vocalized text. Licenses the text itself requires: the pronouns هُمُ / كُمُ / تُمُ / هُ / هِ read long where the foot needs it; «فَهْوَ / وَهْوَ / وَهْيَ»; 56b «وَصَلَّوْا الْفَجْرَ» scans only with the waw dropped before the article (as A and B write it); 128a «يُدْلِيَ» (A's mark); 138a and 212b «أَنَا» short; 158b «بِالُاخْرَى» (the hamza dropped, A «بِالاْخْرَى»); 203a «أَفْيَحٍ» with tanwin.

## 5. To verify / decide
- **The whole vocalization**, since no vocalized source exists online; the printed «الرحلة إلى بلاد الأشواق» (مصطفى عراقي، مكتبة ابن تيمية ١٩٨٧) or شرح ابن عثيمين should settle it.
- **Count:** 230 = A's 229 + the verse restored at 209–210. If the app should follow B's printed recension only, v. 211 («سلام عليكم يسمعون جميعهم») would go and the count would be 229.
- 8b «وَأَنْعِمُ» and 63b «وَأَكْرِمُ»: the rhyme vowel on an imperative of wonder (A «وأنعِمْ» / W «وأنعِمُ»; A «وأكرمُ»).
- 79b «وَتَضْرِمُ» and 90b «يَضْرِمُ» are kept as both sources mark them (the dictionary form is تَضْرَمُ); 102a «تُحِلُّ» as both sources (تَحُلُّ is also possible); 117b «سَتُقْدِمُ» (A); 141b «وَالْقَالِ مُعْلِمُ» (A; B «والقالُ»).
- 88b «وَدَانَتْ كُؤُوسُ السَّيْرِ» (A): B «ودنت» and W «ودُنّت» do not scan; other prints have «ودارت».
- 174a, 177b, 164a, 188b: readings chosen between A and B on sense (see §3).
- The section titles are those of the Shamela file (they look like the headings of عراقي's book, not the author's); the first part has no title in the source, so it carries the file's own title «القصيدة الميمية».
