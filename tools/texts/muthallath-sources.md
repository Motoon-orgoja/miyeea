# Texts report: نظم مثلث قطرب «يا مولعًا بالغضب» (سديد الدين المهلبي البهنسي، ت ٦٨٥هـ) — `muthallath.txt`

Scripts: `batch5-build/` (`parse.js` + `parse-muthallath.js`, `collate.js`, `show.js`, `build.js` + `cfg/muthallath.js` + `voc/muthallath.txt` → `muthallath.txt`, log `out/muthallath.build-log.txt`). Raw downloads: `raw/muthallath/`.

## 1. Sources
- **Base (D):** «مثلثات قطرب», midad.com: https://midad.com/article/212593 — the circulated text (each stanza followed by Ibn Zurayq's explanatory verse «بالفتح … والكسر … والضم …»); only the tri-vowel word of each hemistich is marked (8% of letters).
- **Check 1 (W):** Wikisource «يا مولعا بالغضب والهجر والتجنب» (wrongly filed under ابن مشرف): https://ar.wikisource.org/wiki/يا_مولعا_بالغضب_والهجر_والتجنب — the same circulated text in another typing, unvocalized, many slips.
- **Check 2 (Z):** the circulated text as printed at the end of the Shamela file «المثلثات اللغوية للمهلبي» (ketabonline 23174, pp. 53–56): https://ketabonline.com/ar/books/23174 — same family as D.
- **Check 3 (A), independent:** the stanzas as the author himself quotes and explains them in his sharh (same file, pp. 9–37, تحقيق د. جميل عويضة، ٢٠٠٧), about a quarter marked. The author says: «نظمت مثلث قطرب … على حروف المعجم، وهي ثلاثون نوعًا».
- Also downloaded, not this poem: ketabonline 17302 and 54434 («المورث لمشكل المثلث» لعبد العزيز المكناسي، ت ٩٦٤هـ: «حمدًا لبارئ الأنام»), a different nazm of the same book.

**No fully vocalized copy exists online** (the sources mark the key word only). The vocalization is **completed by AI** (`voc/muthallath.txt`), typed on the decided wording, keeping every mark of D / A on the tri-vowel words; the script proves the letters equal the base in 109 of 128 hemistichs, the other 19 being the decisions of §3.

## 2. Count and scope
**64 verses** = 32 four-hemistich stanzas, each written as two verses: the opening, 29 kinds on the letters of the alphabet (غمر، سلام، كلام، حرة، حلم، سبت، سهام، دعوة، شرب، خرق، لحا، ملا، شكل، صرة، كلا، قسط، عرف، جد، جوار، أمة، حمام، لمة، مسك، حجر، سقط، قمة، رقاق، صل، طلا) + «عمرت» = the author's thirty, and the closing stanza. Left out on purpose: the verses of Ibn Zurayq's sharh, his colophon, and the kinds the circulated text adds after the author's thirty (لقا، رشا، زجاج، منّة، قرى، ظلم، قطر).

## 3. Wording (base D)
| v. | Adopted | D | Why |
|---|---|---|---|
| 6b | بِكَفِّهِ **الْمُخْتَضِبِ** | المخضب | W + A |
| 15a | فِي يَوْمِ **السَّهَامْ** | يوم سهام | A; D a syllable short |
| 19 | **ذَلَقْتُ** نَحْوَ الشَّرْبِ \| فَلَمْ **أُذَدْ** عَنْ **شِرْبِي** | ذلفت … فلم أدر عن شرب | A (the author explains «ذلق»); D corrupt |
| 21b | مَعَ **الظَّرِيفِ** الْخِرْقِ | الطريق | A |
| 28b | فِي حُبِّهِ **وَا حَزَبِي** | واحزب | W «واحز بي»; see §5 |
| 31a | **نَبْتَ** الْكَلَا | بنت | W + Z + A |
| 33a | **طَارَحَنِي** | طرحني | W + A; meter |
| 40b | ثُمَّ **انْثَنَوْا** | انتنوا | Z + A |
| 43a | **لِأَطْيَارِ** | الأطيار | W + Z |
| 46b | وَلَا **لَقًى** مِنْ **نَشَبِ** | ولا نقي من نصب | A |
| 54a | **مُطَّرَحًا** | مطرح | A |
| 59b | **بِوَجْنَةٍ** | وجنة | A; D a syllable short |
| 62a | **وَأَرْضُهُ** قَدْ عَمُرَتْ | ورأسه | A (and the nazm of المكناسي) |
| 64a | **نَظَمْتُ فِي وَصْفِي** لَهُ | رضيت من حبي له | A; W «رثيت» |
Spelling only: 12a هَنَانِي, 16b بِضَوْئِهَا, 24a اللُّحَى, 32a الْكُلَى; the pausal ة written «ةْ».
Kept as in D (the circulated wording) against the author's sharh A: 2a هَجْرُكَ (A حبّك), 4a فَقُلْتُ يَا ذَا الْغُمْرِ (A يا أيّهاذا الغمرُ), 5a فَحَيَّا (A وحيّا), 8a فَصِرْتُ (A فسرت), 9a بِأَرْضٍ (A لأرضٍ), 11–12 «جُدْ فَالْأَدِيمُ … وَمَا هَنَانِي حُلْمُ» (A «جدنا الأديم … ولا هنا لي الحلم»), 14b الْمَهْمَهِ (A الفدفد), 16a تَرْمِي بِالسُّهَامْ (A إذ ترمي السهام), 18a فَقُلْتُ (A وقال), 22b عِنْدَ رُكُوبِ السَّبَبِ (A منه ركوب السبسب), 24b النَّسَبِ (A السبب), 27 (A corrupt), 29a فِي صَرَّةْ (A وصرّة), 30a صُرَّتِي (A صرّة), 32 فَشَجَّ … يُرَاقِبِ (A فشحّ … يرتقب), 34a فِي فِيهِ عِرْقُ (A لي فيه عرف), 37–38 (A عالٍ كريم … ألفيته كالجدّ المعطل المضطرب), 44b طَرَبِ (A كرب), 46a وَمَا (A ولا), 47b عَبِيرُ (A نسيم), 48a فَكَانَ مِنْهُ (A وكان معه), 49a مَلَتْ (A بلّت), 50b لَضَاقَ (A لضاع), 51–52 (A رمي … من خدّه), 54b, 56 قَبْلَ … أَمْ (A بعد … أو), 57b تَثِقْ (A تلذ), 58b الْمُجْدِبِ (A المجتذب / ولا ترتعب), 59a عَيْنِ (A وجه), 60 (A وطلية من الطلى غيداء لم تجتنب). Order: D has قمة before رقاق (A the reverse).

## 4. Harakat
- All marks beyond the tri-vowel words are AI-completed on grammar and meter. The fath / kasr / damm of every key word is as D and A print it (the build log lists 12 mark differences: D's typing «ٌّ» for «ُّ» six times, and A's own variants).
- Pausal rhymes are written with sukun (السَّلَامْ، حَرَّةْ); «بَقِي» (11b, 30a, 46a) is read with a quiescent ya, as the meter requires; 56a «هَلْ يَنْطِقُوا» as in all sources.
- **Meter:** all 128 hemistichs scan as مجزوء الرجز (مستفعلن with its usual variants; ḍarb مقطوع or مذيّل in the pausal stanzas).

## 5. To verify / decide
- **28b «وَا حَزَبِي»**: no witness is sound (W «واحز بي», D «واحزب», Z «والحزب», A «وأضر بي»); the letters of W were kept. The likely original is «وَا حَرَبِي».
- **Scope:** only the author's nazm (64 verses). If the app should carry the circulated text as memorized in the مجاميع (with Ibn Zurayq's «بالفتح …» verse after every stanza and the seven added kinds), it would be about 150 verses — say so and it can be built from the same files.
- Readings taken from the author's sharh against all circulated copies (19, 21b, 46b, 62a, 64a) — the circulated wording is given in §3.
- 22b «عِنْدَ رُكُوبِ السَّبَبِ», 38b «كَالْمُعْطَلِ الْمُخَرَّبِ», 52 «رَمْلُ السُّقْطِ وَمِيضُهُ» are kept from the circulated text though A reads otherwise; the vocalization of these is by sense.
- Category: no «اللغة» in the app list, so `c` = «النحو» (the sub line says «اللغة»).
