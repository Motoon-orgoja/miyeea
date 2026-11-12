# Texts report: دالية أبي الخطاب الكلوذاني في العقيدة (ت ٥١٠هـ) — `kalwadhaniyya.txt`

Scripts: `four-build/` (`parse.js`, `collate.js` → `out/kalwadhaniyya.collation.txt`, `build.js` + `cfg/kalwadhaniyya.js` + `voc/kalwadhaniyya.txt` → `kalwadhaniyya.txt`, log `out/kalwadhaniyya.build-log.txt`). Raw downloads: `raw/kalwadhaniyya/`.

## 1. Sources
- **Base (A):** «شرح القصيدة الدالية», الشيخ عبد الرحمن بن ناصر البراك, عناية ياسر العسكر (دار ابن الجوزي، ط ١، ١٤٣٠هـ), Shamela, ketabonline 2384: https://ketabonline.com/ar/books/2384. The verses are numbered 1–45 and **vocalized** (89% of letters; it leaves bare the recurring «قالوا», «قلتُ», «في», the rhyme letter and a few others). The editor notes the variants of the copies and of ابن الجوزي's «المنتظم».
- **Check (B):** «شرح دالية أبي الخطاب الكلوذاني», هاني بن عبد الله الجبير, Shamela, ketabonline 10056: https://ketabonline.com/ar/books/10056. The full text is given before the commentary: **52 verses**, almost bare (10%).

The text is **fully vocalized**: A's marks, with the bare letters completed (`voc/kalwadhaniyya.txt`, checked by script: same letters as A in 88 of 90 hemistichs, the two others are the decisions below; every mark that differs from a printed mark is listed in §4).

## 2. Count — needs a decision
- **45 verses** = A. The poem is usually described as about fifty verses.
- B has **7 more verses**, which A's edition does not print (B puts most of them between brackets). They are **not** in `kalwadhaniyya.txt` because no vocalized source has them:
  - after v. 32 (حاميه في يوم العريش): «خير الصحابة والقرابة كلِّهِم | ذاك المؤيِّدُ قبل كل مُؤَيِّدِ» and «قالوا: فمن صديق أحمد؟ قلت: من | تصديقه بين الورى لم يُجحَدِ»
  - after v. 42 (ذاك الأمين المجتبى), five verses on العباس and the Abbasid caliphs: «ولعم سيدنا النبي مناقبٌ | لو عُدِّدت لم تنحصر بتعدُّدِ», «أعني أبا الفضل الذي استسقَى به | عمرُ أوان الجدب بين الشُهَّدِ», «ذاك الهُمامُ أبو الخلائف كلهم | نسقاً إلى المستظهرِ بن المقتدِي», «صلى عليه الله ما هبت صبا | وعلى بنيه الراكعين السُّجَّدِ», «وأدام دولتهم علينا سرمدا | ما حنَّ في الأسحار كل مغردِ».
- B also puts v. 15 (المشبِّه) before v. 13 (تصف الإله).

## 3. Wording (base A; B = الجبير)
| v. | Adopted | Other reading | Why |
|---|---|---|---|
| 23a | قُلْتُ مَا | A's digital copy adds «بِالعُيُونِ أَبِنْ لَنَا» | a repetition from v. 22; the commentary quotes the verse without it |
| 25b | **مِنْ غَيْرِ مَا حَدَثٍ وَغَيْرِ تَجَدُّدِ** | A: لا ريب فيه عند كل موحد (= 26b) | A prints one hemistich twice; this is the reading of المنتظم, which الشارح gives, prefers and then quotes as the poet's words; = B |
| 3b | وَخُذْ **بِهَذَا** تَهْتَدِي | B: بهديي | A kept (A notes the variant) |
| 4a | قَدْ **قَفَيْتُ** | B: قصدتُ | A kept (noted in A) |
| 8b | **يَوْمَ** الْجِدَالِ | B: عند | A kept (A notes the variant and calls it «أنسب») |
| 11a | **بِمَا** عَرَفَ | B: بم | A; B does not scan |
| 13b | **السَّرْمَدِ** | B: السرمدي | A |
| 16a | جِسْمًا **قُلْ لَنَا** | B: مثلَنا | A kept (noted in A) |
| 17b | **قُلْتُ الْأَمَاكِنُ لَا تُحِيطُ بِسَيِّدِي** | B: فأجبت بل في العلوِ مذهبُ أحمدِ | A kept (see §5) |
| 18a | **أَتَزْعُمُ** | B: فتزعم | A |
| 20b | قَوْمٌ **هُمُ نَقَلُوا شَرِيعَةَ أَحْمَدِ** | B: تمسّكهم بشرع محمدِ | A kept (noted in A) |
| 24 | **تَصِفْهُ بِأَنَّهُ** … نَقِيصَةٌ **بِالسَّيِّدِ** | B: فيوصف أنه … نقيصةُ المتوحدِ | A kept (the first is المنتظم's reading) |
| 26b | عِنْدَ كُلِّ **مُوَحِّدِ** | B: مسدَّدِ | A kept (noted in A) |
| 29a | **وَكَانَ كَانَ** نَقِيصَةً | B: لكان ذاك | A kept (noted in A) |
| 32b | **أَسْعَدَ** | B: يُسعِدُ | A |
| 33a | **ثَانِي** أَبِي بَكْرِ | B: تالي | A kept (B = المنتظم) |
| 34b | **سَنَدُ** الشَّرِيعَةِ | B: نصرَ | A kept (noted in A) |
| 35a | **مُجَاوِبًا** | B: مسارعًا | A |

## 4. Harakat
- Completed where A is bare: قَالُوا، قُلْتُ / فَقُلْتُ، فِي، لَمْ، لَوْ، فَهَلْ، لِلَّهِ, the fatha before a madd alef, the damma of the pronoun هُ (استواهُ، نزولُهُ، رؤيتُهُ، مرادُهُ، سبحانَهُ، بأنَّهُ), and the rhyme kasra in the 32 verses where A leaves the dāl bare.
- Marks changed against A (slips of the digital copy): 8a «مُهَذَّبِ» → **مُهَذَّبٍ** (the meter needs the tanwin); 17b «بِسَيِّدَي» → **بِسَيِّدِي**; 31b «قَبْلِ» → **قَبْلَ**; 32b «الغَاِر» → **الْغَارِ**, «مِنَ مُسْعِد» → **مِنْ مُسْعِدِ** (meter); 33a «فَمْن» → **فَمَنْ**.
- 41a «وَلِإِبْنِ هِنْدٍ»: the hamza is pronounced (A and B both write «ولإبن»); with hamzat al-waṣl the foot is short.
- **Meter:** all 90 hemistichs scan as kāmil, checked on the fully vocalized text. The pronoun هُ/هِ is read long in 20a (نَاقِلُهُ), 26b (فِيهِ) and 35b (عَنْهُ).

## 5. To verify / decide
- **The 7 verses of §2**: add them (they need vocalization from a printed edition, e.g. «المنتظم» لابن الجوزي) or keep A's 45.
- 25b: the reading of المنتظم was put in place of A's repeated hemistich.
- 17b: A's text «قلتُ: الأماكنُ لا تحيطُ بسيِّدي»; the other copies have «فأجبتُ: بل في العُلْوِ مذهبُ أحمدِ», which الشارح calls «أدلّ على المقصود».
- 34: A vocalizes «فاروقُ … والمهذَّبُ … سندُ» in the nominative; kept.
