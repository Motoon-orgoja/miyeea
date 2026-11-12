# Texts report: نونية السخاوي «عمدة المفيد وعدة المجيد في معرفة التجويد» (علم الدين السخاوي، ت ٦٤٣هـ) — `sakhawiyya.txt`

Scripts: `four-build/` (`parse.js`, `collate.js` → `out/sakhawiyya.collation.txt`, `build.js` + `cfg/sakhawiyya.js` + `voc/sakhawiyya.txt` → `sakhawiyya.txt`, log `out/sakhawiyya.build-log.txt`). Raw downloads: `raw/sakhawiyya/`.

## 1. Sources
- **Base (B):** «نونية السخاوي», Shamela (الشاملة الذهبية), ketabonline 11685: https://ketabonline.com/ar/books/11685 (the file says it was taken from موقع شذرات شنقيطية). 64 numbered verses, **partly vocalized (28% of letters)**.
- **Check (A):** the poem as the author gives it at the end of «منهاج التوفيق إلى معرفة التجويد والتحقيق» in his own book «جمال القراء وكمال الإقراء» (ط. دار المأمون للتراث), Shamela 10460, pages 624–627: https://shamela.ws/book/10460/624. 64 verses, almost bare (9%), with several scanning/typing errors of the digital copy (والمذ، فاحل، خفصها، «غ@ الب»).
- The second Shamela edition of جمال القراء (37653, ت. عبد الحق) was searched for the poem and not found. The printed edition with full vocalization (عبد العزيز القارئ، «قصيدتان في تجويد القرآن») is not online as text.

**No fully vocalized digital text was found.** The vocalization in `sakhawiyya.txt` is therefore **completed by AI** (`voc/sakhawiyya.txt`): typed in full on B's wording, keeping every mark B and A print (8 exceptions listed in §4), and checked by script: the letters equal the base in 117 of 128 hemistichs, the other 11 are the decisions of §3, and every hemistich scans.

## 2. Count
**64 verses** in both sources (the number usually given for the poem).

## 3. Wording (base B; A = جمال القراء)
| v. | Adopted | Other reading | Why |
|---|---|---|---|
| 1b | وَيَرُودُ **شَأْوَ** أَئِمَّةِ الْإِتْقَانِ | B: شأنَ | A; the circulated reading |
| 29b | **وَوَلَا** يَحُضُّ | B: ولا يحضُّ | A; B is one syllable short |
| 37a | **فِي** نَحْوِ قُلْ رَبِّي | B: وفي نحو | A; B does not scan |
| 51b | كَذَاكَ وَأَيُّهَا الثَّقَلَانِ | B: كذا | A; B is one syllable short |
| 10a | وَجِبَاهُهُمْ **وَوُجُوهُهُمْ بَيِّنْ** بِلَا | A: وجباههم بيِّن وأوجههم بلا | B kept (both scan) |
| 11 | **وَالْغَيْنُ** قُلْ / **وَالْخَا وَحَيْثُ** | A: فالغين / والخاء حيث | B kept |
| 13b | وَالْكَافَ **خَلِّصْهَا** | A: خفصها (corrupt) | B |
| 14b | لِأَجْلِ **الْقُرْبِ** | A: القربة (does not scan) | B |
| 26b | **ذَرِبٍ** | A: دَرِب | B kept |
| 31b | **صُنْهُ** وَعَانِ | A: قِسْهُ | B kept |
| 35b | أَئِمَّةَ **الْإِتْقَانِ** | A: الأزمانِ | B kept (see §5) |
| 38 | **فَضَّلْنَا** عَلَى / **رِفْقٍ** | A: فصلنا / وفق | B (the Quranic word) |
| 45a | **وَادْفَعْ** | A: فادفع | B kept |
| 49 | **بَيِّنْهُ** وَذَا / فِي **نَحْوِ** | A: بين ذا وذا / في مثل | B kept |
| 53b | وَالْوَاوَ **عِنْدَ** الْفَاءِ | A: نحو | B kept |
| 54b | فِي **وِلْدَانِ** | A: الولدان (does not scan) | B |
| 56a | **وَيُبَيَّنُ** الْحَرْفُ | A: وتبين الحرف | B kept |
| 57b | يَظْهَرَ **الْأَخَوَانِ** | A: الإخوانِ | B kept |
| 63a | **وَانْظُرْ** | A: فانظر | B kept |

Spacing/spelling only: 1a «يا من», 2b «لا مدَّ» and the rhyme word «لِوَانِ» (B «لواني»), 23b, 33, 10a (B drops a letter: «ووُجُوُهُمْ»), 32a (the kaf joined to the quoted word).
Words cut between the hemistichs are written with «ـ» on both sides as in the other poems: 21, 32, 33, 35, 48, 51 («تَثْقَفَنْـ | ـنَهُمُ»: the cut falls inside the doubled nun), 57.

## 4. Harakat
- 71% of the letters had no mark in B; all were completed (AI), on grammar and meter. The Quranic example words are vocalized as in the muṣḥaf (جِبَاهُهُمْ، وُجُوهُهُمْ، أَحْيَيْنَا، يَتَّخِذُوهُ، أَضْلَلْنَ، غِيضَ، أَفَضْتُمْ، اضْطُرَّ، أَوَعَظْتَ، حَصَدْتُمْ، الْمُدْحَضِينَ، أُجِيبَتْ، أَظْفَرَكُمْ، بِمُذْعِنِينَ…), with the final mīm vowelled where the meter needs it (أَفَضْتُمُ، حَرَصْتُمُ، حَصَدْتُمُ).
- Marks that differ from a mark printed in a source (all 8): 13a «بَيِّنْ» (A «بيِّنٌ», which does not scan); 33b «اعْرِفْهُ» (A «اعْرفُه», misplaced); 62a «نَظْمُ» with B (A «نظمِ»); 35a «فَرَّطْتُ» and 48a «إِذْ ظَلَمُوا» (B writes the idghām: «فرَّطتُّ», «إذ ظَّلموا»); 43b «تَعَسُّرٍ» and 52a «الصَّفِيرُ» (B's marks are misplaced); 56a «وَيُبَيَّنُ» (B «ويُبَيِّنُ», see §5).
- **Meter:** all 128 hemistichs scan as kāmil (ḍarb مقطوع: مُتَفَاعِلْ), checked on the fully vocalized text. The pronoun هُ/هِ is read long where the foot needs it (12b سَبِّحْهُ, 33b اعْرِفْهُ, 49a and 58b بَيِّنْهُ, 5b and 37b فِيهِ, 17b تَفَشِّيهِ, 61b فَمِنْهُ).

## 5. To verify (on a printed, vocalized edition)
- **The whole vocalization**, since no vocalized source exists online; in particular the case of the example words and of «نحو» (written نَحْوَ as B marks it in v. 34).
- 35b «أَئِمَّةَ الْإِتْقَانِ» (B) repeats the rhyme word of v. 1; the author's book has «أئمةَ الأزمانِ».
- 56a «وَيُبَيَّنُ الْحَرْفُ الْمُشَدَّدُ مُوضَحًا»: B prints «ويُبَيِّنُ» with «الحرفُ» and «موضَحًا», which only agree in the passive.
- 20b «وَكَبَغْيُكُمْ» (the Quranic word quoted as it is; «وَكَبَغْيِكُمْ» is also possible), 53a «كَتَلْقَفُ مَا» (B's mark; the example is the sākin fāʾ of ﴿تَلْقَفْ مَا﴾), 59 «فَشَخْصٌ حَثَّهُ سَكْتٌ» (B's marks), 4b «فَيَفِرُّ» (A's mark).
- 10a, 31b, 49a: both readings scan; B kept.
