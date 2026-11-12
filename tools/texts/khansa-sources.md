# Texts report: رائية الخنساء في رثاء صخر «قذًى بعينكِ أم بالعين عوّار» — `khansa.txt`

Scripts: `poems7-build/` (see `farazdaq-sources.md`); `parse-khansa.js`; the fully vocalized text is typed in `poems7-build/khansa.voc.txt` and checked by `build-manual.js` (the letters of every word must equal the base; every mark is compared with the marks the witnesses print on the same word; meter of every hemistich). Raw files: `raw/khansa/`. Collation: `out/khansa.collation.txt`; build log: `out/khansa.build-log.txt`.

## 1. Sources
- **Base (W), about half vocalized (36 verses):** Wikisource, the diwan text of «الموسوعة الشعرية»: https://ar.wikisource.org/wiki/قذى_بعينكِ_أمْ_بالعينِ_عوَّارُ
- The same digital text, mark for mark: «ديوان الخنساء»، اعتنى به وشرحه حمدو طمّاس، دار المعرفة (ketabonline 102928, pp. 45–47): https://ketabonline.com/ar/books/102928 — and aldiwan.net (A, 27 verses: it drops vv. 9–14 and 26–28): https://www.aldiwan.net/poem21079.html
- Printed books quoting parts of the poem (other transmissions), collated for the wording and used for the marks they print:
  - **Mh, partly vocalized (18 verses):** «معاهد التنصيص» (shamela 6951, pp. 340–341): https://shamela.ws/book/6951/340
  - **Tz, lightly vocalized (15 verses):** «التعازي والمراثي» للمبرد (shamela 21554, pp. 85–86).
  - **Km (8 verses), Zh (7 verses), unvocalized:** «الكامل» للمبرد (shamela 8505, p. 1207), «زهر الآداب» (shamela 10768, pp. 971–972).
- **No fully vocalized copy of the poem was found** (shamela has no diwan of الخنساء; the diwan on ketabonline is the same half-vocalized text). The four books cover 20 of the 36 verses; vv. 4, 7, 8, 16, 18–23, 26, 27, 29–31, 36 have no second witness.

## 2. Count
**36 verses**, the diwan text and its order. The anthologies give 8–18 verses.

## 3. Wording
The wording of the diwan (W) is kept everywhere. Corrected: 1b «اذْخلتْ» → **إِذْ خَلَتْ** (spacing; = A, Mh). Hamzas that W leaves out («اذْ», «انَّ», «ابو», «اطوار», «اقبال» …) are written.

Readings of the other transmissions, not adopted:

| v. | W (adopted) | Other |
|---|---|---|
| 1 | قَذًى … أَمْ **ذَرَّفَتْ إِذْ** خَلَتْ (= Mh) | Tz «أقذًى … أم أوحشت أنْ خلت» |
| 3a | وَقَدْ **وَلَهَتْ** | Mh + Tz «ثكلت» |
| 6a | فِي صَرْفِهَا **عِبَرٌ** | Mh + Tz «غِيَرٌ» |
| 9 | **وَرَّادَ** مَاءٍ … أَهْلُ **الْمَوَارِدِ مَا** (= Mh, الحماسة البصرية) | Mh «وارد»; Tz + Km + Zh «أهل المياه فما / وما» |
| 11 | **وَمَا** عَجُولٌ … **تُطِيفُ بِهِ** … **إِعْلَانٌ وَإِسْرَارُ** | Mh + Tz «فما»; Km «تحنّ له»; Mh «إصغارٌ وإكبارُ» |
| 12a | تَرْتَعُ **مَا رَتَعَتْ** حَتَّى إِذَا **ادَّكَرَتْ** | Tz + Km «ما غفلت»; Zh «في غفلةٍ»; Mh «ترعى إذا نسيت حتى إذا ذكرت» |
| 14 | **بِأَوْجَدَ** مِنِّي **يَوْمَ** فَارَقَنِي … **وَلِلدَّهْرِ** | Km + Zh «بأوجع»; Mh + Tz + Zh «حين»; Km + Zh «وللعيش» |
| 32a | فِي جَوْفِ **لَحْدٍ** | Mh «رمسٍ» |
| 33 | **لِفِعْلِ** الْخَيْرِ ذُو **فَجَرٍ** … **بِالْخَيْرَاتِ أَمَّارُ** | Mh + Tz «بفعل»; Tz «ذو فخرٍ … في اللأواء صبّارُ» |
| 34a | **حَرِيبَتَهُ** | Tz «حلوبته» |
| 35a | حَارَ **حَادِيهِمْ** | Tz «هاديهم» |

## 4. Harakat
- **Coverage: W 49.8% → 100%** (the script's 99.7% counts «عَمْرٍو» and the second lam of «لِلدَّاعِينَ», which by convention carry no mark).
- **Vowel marks in the text: 1181. Printed identically by a witness on the same word (W, Mh, Tz): 620. Supplied by hand: 561.** The supplied marks are those the word, its case and the meter require (madd vowels, sukuns, the article, case endings fixed by the syntax and by the damma of the rhyme); the places where another vocalization is possible are listed in §5.
- Marks of a witness not followed (4): 4a خُنَاسٌ (W, with tanwin; Mh «خناسُ») · 28a مِثْلَ (W; Mh «مِثلُ») · Mh 5b «ضرِّارُ» and 24b «لريبةِ» are typos.
- **Meter (البسيط، الضرب مقطوع):** 72 of 72 hemistichs pass the scanner.

## 5. To verify
These marks are supplied (no witness prints them) and another reading exists or the form is rare:
- 3a وَلَهَتْ (also وَلِهَتْ). 4a مَا عَمَرَتْ (also عَمِرَتْ, «عاشت»).
- 4a / 5a خُنَاسٌ: W prints the tanwin; the name is diptote in prose (Mh «خُناسُ»). Both scan.
- 6b حَوْلٌ وَأَطْوَارُ (the turning of fate); «حِوَلٌ» also scans.
- 13a لَا تَسْمَنُ; 13b تَسْجَارُ. 20a مِلْجَاءُ.
- 21b مُعَاتِبٌ (active); «مُعاتَبٌ» is possible. 21b نَيَّارُ.
- 22b تُرَجَّمُ. 26a مَسْغَبِهِمْ. 26b مِيسَارُ. 31a مُؤْتَشَبٍ.
- 35a بِمَهْلَكَةٍ (the word has the three vowels on the لام). 35b الطِّخْيَةِ is W's (also «الطَّخية»).
- 36b مُرَّارُ (plural of مارّ; W «مرَّارُ» without the first vowel). 36a سَالُوهُ (W, with the hamza eased).
- 28a مِثْلَ الرُّدَيْنِيِّ (W; Mh «مثلُ»).
