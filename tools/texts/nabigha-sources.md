# Texts report — معلقة النابغة الذبياني «يا دار ميّة بالعلياء فالسند» (`nabigha.txt`)

Scripts: `jahili-build/` (`lib.js` parsers, `cfg-nabigha.js` witnesses, `dec-nabigha.js` logged decisions, `build.js` = copy of `hamasa-build/build.js`, `meter.js`). Log: `jahili-build/out/nabigha-build-log.txt`. Raw pages: `raw/nabigha/`.

## 1. Sources
- **Base (T), vocalized:** المكتبة الشاملة 37488, الخطيب التبريزي «شرح القصائد العشر» (المنيرية ١٣٥٢هـ), pp. 306–321: https://shamela.ws/book/37488/307 — the verses are printed in parentheses with full vocalization (with typing slips, listed below). Riwaya, order and marks of T are kept unless stated.
- **S, unvocalized, printed:** المكتبة الشاملة 21574, «شرح المعلقات التسع» المنسوب لأبي عمرو الشيباني, تحقيق عمر الطباع, pp. 67–82: https://shamela.ws/book/21574/68 (its commentary follows T; its verse text is a separate typing from a manuscript).
- **A, vocalized:** aldiwan.net (= الموسوعة الشعرية), https://www.aldiwan.net/poem2003.html — the diwan riwaya; its convention (no sukun, no vowel before a madd letter) was completed mechanically before use.
- **W, vocalized:** ar.wikisource «معلقة النابغة الذبياني» (the first 50 lines, the vocalized copy): https://ar.wikisource.org/wiki/معلقة_النابغة_الذبياني
- Collation: every hemistich of the result was aligned word by word (LCS, harakat/tatweel removed, أ إ آ → ا، ى → ي، ة → ه) with S, A and W by `build.js`.

## 2. Count
**51 verses** = the 50 verses of T + «إِلَّا مَقَالَةَ أَقْوَامٍ شَقِيتُ بِهَا | كَانَتْ مَقَالَتُهُمْ قَرْعًا عَلَى الْكَبِدِ» (v. 40), which T lacks but S, A and W have; it is placed where S places it (after «ما إن أتيت بشيء»), and vocalized from A. S has the same 51 verses. A has 50 (it lacks v. 42 «هذا لأبرأ من قول قذفت به»), W has 50 (another mix of the two). Order of T kept; A puts «أنبئت أن أبا قابوس» (v. 49) before «مهلًا فداءٌ لك» and «احكم كحكم فتاة الحي» after «والخيل تمزع».

## 3. Wording: readings of T kept (T = the commentary's text; S mostly agrees with T)
| v. | Adopted (T) | Other | Note |
|---|---|---|---|
| 2a | أَصِيلًا كَيْ (T, S, W) | A أُصَيْلَانًا | T: «ويروى أصيلانا» |
| 3a | إِلَّا أَوَارِيَّ (T) | S, A, W «الأواريَّ» | T: «ويروى إلا أواريُّ، والنصب أجود» |
| 6a | أَضْحَتْ … وَأَضْحَى (T, S) | A, W أمست … وأمسى | |
| 9b | بِذِي الْجَلِيلِ (T, S) | A, W يومَ الجليل | |
| 14a | فَهَابَ ضُمْرَانُ (T) | S «فغاب»، A, W «وكان» | T: «وروى الأصمعي: وكان ضمران» |
| 15 | فَأَنْفَذَهَا · شَكَّ الْمُبَيْطِرِ (T, S) | A «فأنقذها · طعنَ» | |
| 21b | وَمَا أُحَاشِي (T, S) | A, W «ولا» | |
| 24a | فَمَنْ أَطَاعَ فَأَعْقِبْهُ (T, S) | A, W «فمن أطاعك فانفعه» | |
| 26 | سَابِقُهُ · سَبْقَ (T, A, W) | S «مائله · يكبو» | |
| 27b | حَمَامٍ سِرَاعٍ (T) | S, A, W «شِراع» | |
| 33a | الْمِائَةَ الْأَبْكَارَ (T, S) | A, W «المِئةَ المَعْكاءَ» | T: «ويروى المائة الجرجور» |
| 34a | وَالسَّاحِبَاتِ ذُيُولَ الْمِرْطِ (T, S) | A, W «والراكضات ذيول الرَّيْط» | T: «ويروى الراكضات» |
| 37a | قَدْ زُرْتُهُ حِجَجًا (T, S) | A, W «مسّحتُ كعبته» | |
| 38a | يَمْسَحُهَا (T) | S, A, W «تمسحها» | |
| 38b | وَالسَّنَدِ (T, S) | A, W «والسَّعَدِ» | T: «وروى أبو عبيدة: بين الغيل والسَّعَد» |
| 39 | مَا إِنْ أَتَيْتُ بِشَيْءٍ أَنْتَ تَكْرَهُهُ (T, S, W) | A «ما قلتُ من سيّئٍ مما أتيتَ به» | |
| 41b | بِالْحَسَدِ (T, S) | A, W «بالفَنَد» | |
| 44b | وَلَوْ (T, S) | A, W «وإن» | |
| 45–46 | جَاشَتْ غَوَارِبُهُ · مُزْبِدٍ · حُطَامٌ (T, S) | A, W «هبّ الرياحُ له · مُترَع · رُكام» | |
| 50 | لِقَائِلِهِ فَمَا عَرَضْتُ (T, S) | A, W «به حسنًا فلم أُعرِّض» | T: «ويروى: فإن تسمع به حسنا فلم أعرِّض» |
| 51 | تَا عِذْرَةٌ · قَدْ تَاهَ فِي الْبَلَدِ (T, S) | A, W «ذي عِذرةٌ · مُشاركُ النَّكَدِ» | T gives both as riwayas |

Not variants: S «القعد» (8b), «وخد» (9b), «بالمذرى» (15a), «تعقد» (25b), «الأكوام» (43a), «بركيد» (44a) are typos of S.

## 4. Wording / spelling corrections of T (typos of the digital copy)
| v. | T | adopted | why |
|---|---|---|---|
| 41b | بَأْتِيكَ | يَأْتِيكَ | S + A + W |
| 47b | بالخَيْزُارَنَةِ | بِالْخَيْزُرَانَةِ | letters inverted; S + A + W |
| 49a | أن … أو عَدَنِي | أَنَّ … أَوْعَدَنِي | spacing; S + A + W |
| 50b | أَبَيْنتَ | أَبَيْتَ | T's commentary «أبيت اللعن» |
| 51a | أن تَاعِذْرَةٌ | إِنَّ تَا عِذْرَةٌ | T's commentary «تا: بمعنى هذه»; S |

## 5. Harakat
- T is vocalized at **94.9%** of the letters that need a mark; the result is **100%** (1661/1661). 39 bare letters took the mark printed by A or W on the same word (list in the log: e.g. إِلَى، كَمَا، الْأَدْنَى، الْبَرِيَّةِ، الْمَلَّاحُ); a bare madd letter never takes a witness's mark. The article lam before a moon letter takes sukun (house convention), and «مِنْ/عَنْ» before hamzat al-wasl take their vowel (مِنَ الْجَوْزَاءِ، عَنِ الْفَنَدِ، مِنَ الرَّمَدِ).
- **Corrected in T (32 entries, `dec-nabigha.js` FIX):** ى → ي in أَوَارِيَّ، النُّؤْيَ، أَتِيٍّ، طَاوِي، تُزْجِي؛ shadda restored: الَّذِي، الشَّوَامِتِ؛ typos: بِالْمَسَدِ، خَارِجًا، الْبَعَدِ، فَكَمَّلَتْ، ذَلِكَ، الرَّمَدِ، الشُّؤْبُوبِ (majrur)، بِالْجَرَدِ، تَقْذِفَنِّي، فَأَعْقِبْهُ (imperative of أعقب)؛ bare hamza/letters: أَضْحَتْ، فَأَنْفَذَهَا، الْإِلَهُ، هَذَا لِأَبْرَأَ، الْأَسَدِ، فَمَا، إِلَى؛ case: «وَحْشِ وَجْرَةَ» (idafa; meter), «جَانِبَا نِيقٍ» (dual subject), «مِثْلَ الزُّجَاجَةِ» (object of تُتْبِعُهُ)؛ «مَا إِنْ أَتَيْتُ بِشَيْءٍ» (T's commentary «إنْ هنا توكيد»)؛ «إِلَيَّ يَدِي» (meter; A + W)؛ «إِنَّ لَهُ» (20a; T prints a bare «أن», A + W «إنّ»).
- **Two readings printed by T** (both vowels on one letter): 3b «النُّؤْيَ» and 33a «الْمِائَةَ الْأَبْكَارَ» → nasb (= A, W); 28a «الْحَمَامُ … وَنِصْفُهُ» → raf' (T's own letters; A, W).
- **Kept against a witness:** 8b صَرِيفَ (T: «والنصب أجود»; A صريفُ), 12b طَوْعُ (A, W طوعَ), 14b طَعْنُ (T: «ومن رفع طعن المعارك رفعه بيوزعه»), 22a سُلَيْمَانَ (A سليمانُ), 23b وَالْعُمُدِ (A, W العَمَد; both plurals), 38a الطَّيْرَ (nasb; A الطيرِ), 5b السِّجْفَيْنِ، 9b وَحَدِ، 10b الْمَصِيرِ، 14b الْمُحْجَرِ، 43b أُثَمِّرُ، 45b الْعَبْرَيْنِ.
- **Meter (البسيط، الضرب مخبون فَعِلُن):** 102 of 102 hemistichs pass the scanner.

## 6. To verify
- 44b «بِالرِّفَدِ»: T prints «بالرَّفَد»; the kasra is A's (الرِّفَد جمع رِفْدة). 24a «فَأَعْقِبْهُ»: T «فأَعْقَبْهُ».
- 37: «فلا لعمرُ الذي قد زرته حججًا … وما هُريق على الأنصاب من جسد» is a pre-Islamic oath (by the blood of the sacrifices on the أنصاب). It is not obscene and not about wine, so it was kept; remove it if the app should not carry it.
