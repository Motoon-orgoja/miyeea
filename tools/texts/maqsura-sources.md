# Texts report: مقصورة ابن دريد (أبو بكر محمد بن الحسن بن دريد الأزدي، ت ٣٢١هـ) — `maqsura.txt`

Scripts: `batch5-build/` (`parse.js`, `collate.js` → `out/maqsura.collation.txt` and `out/maqsura.diffs.txt`, `show.js`, `build.js` + `complete.js` + `cfg/maqsura.js` → `maqsura.txt`, log `out/maqsura.build-log.txt`). Raw downloads: `raw/maqsura/`.

## 1. Sources
- **Base (W):** Wikisource «مقصورة ابن دريد»: https://ar.wikisource.org/wiki/مقصورة_ابن_دريد — 256 verses, the text of الموسوعة الشعرية in its convention (no sukun, no vowel before a madd letter, no shadda on a sun letter after the article): 59.8% of letters marked, and about 180 words are under-marked beyond that convention.
- **Check 1 (M):** «أمالي المرزوقي» (ت ٤٢١هـ), Shamela book 722, pages 55–60: https://shamela.ws/book/722/55 — 230 verses, an older recension that begins at «إمّا تري رأسي»; 28% marked (mostly endings).
- **Check 2 (J):** «جواهر الأدب» لأحمد الهاشمي, Shamela book 21505, pages 609–629: https://shamela.ws/book/21505/609 — 250 verses, thinly marked (12%), many typing slips; counts only where it agrees with M.
- Not found: the maqsura is **not** in the Shamela «ديوان ابن دريد» (ketabonline 66767, downloaded and searched), and no sharh (التبريزي، ابن خالويه، ابن هشام اللخمي) is on Shamela / ketabonline as text.

**No fully vocalized digital text was found.** The vocalization of `maqsura.txt` is W's marks + the marks its convention implies (restored by rule, `complete.js`) + **179 words completed or corrected by AI** (list: every `FIX` line of the build log, each with its reason), on the marks of M / J, the dictionary and the meter.

## 2. Count
**256 verses** (W). The number usually given is 229 (the recension commented by التبريزي) to 253/256 with the additions; M has 230 of them, J 250. 26 verses of W are not in M and 6 are not in J (`verse missing` lines of the collation); the opening verse «يا ظبية أشبه شيء بالمها» is one of those absent from M. Nothing was dropped.

## 3. Wording (base W)
Rule: W is kept unless M **and** J agree against it (or W breaks the meter / is an evident slip).
| v. | Adopted | W | Why |
|---|---|---|---|
| 23a | أَنِّي **ضَارِعٌ** | جازع | M + J |
| 41b | **فَاحْتَطَّ** | احتطّ | M + J |
| 55a | **وَأَوْجَبَ** | فأوجب | M + J |
| 80a | **خَاظٍ** نَحْضُهُ | خاطٍ | M; خَظَا لحمُه (J = W) |
| 80b | الْقُصَيْرَى | القصير | M + J; W a syllable short |
| 111a | **ضَبْعَيَّ** | ضبعي | M + J; meter |
| 119b | فِي **ظِلِّ** نَعِيمٍ | ظلَّيْ | M + J |
| 141a | **تَقُولُ** | يقول | M + J |
| 161a | **رَائِقٌ** | رائع | M + J |
| 170b | **فِيمَا** أَفَادَ | فيها | M + J |
| 172a | لَا **يَرْفَعُ** اللُّبُّ | ينفع | M + J |
| 177a | **رَنَتْ** | دنت | M + J |
| 189a | **لِلْمَوْتِ** خَلًى | للدهر | M + J |
| 197b | **يَرْدَعُهُ** | تردعه | M + J |
| 210a | **انْتَضَتْ** | اقتضت | M + J |
| 212b | **الْمَوْتُ أَسْنَاءَ** الرُّشَا | موتُه أسنى | M + J |
| 239a | **تَرَى الْقَاحِلَ** | يُرى القاحلُ | M + J |
| 255b | **أَتْبَعَ** | أنبع | M + J |
Layout: 25 and 209 re-cut at the hemistich boundary the meter requires; 54a «استعبرَ لا» (spacing); words cut between the hemistichs are written with «ـ» (109, 122).
Kept as in W against M + J: 72a «مَنِ انْتَخَى» (M + J «انتحى»; from النخوة). All other differences (M alone or J alone, about 150, see `out/maqsura.diffs.txt`) are kept as in W; the notable ones: 11b نَفَاذٌ (J نفاد), 15b أَرَبٍ (M أزل، J أدب), 19b الْمُنْتَهَى (M المنتشى، J المنتسى), 22a أَنْصَبْتَنِي (M أنضيتني), 24b مَا شَكَا (M اشتكى), 44a سُمًّا (M موتًا), 81a وَالْمَطَا (M والقرا), 82b اللَّبَانِ (M الذراع), 86a شَجْرُهُ (M نحره), 95a حَرْبٍ (M موت), 103a أَثْبَتَا (M ابتنيا), 118a امْتَطَيْتُهُ (M انتضيته), 159a عُدَّةً (M جُنّة), 195a لِلْأَمْرِ (M للشيء، J للسير), 196a مُولَعٌ (M موزع), 213a عُمْرَهُ (M دهره), 220 الْأَقْطَارِ / مَهْزُومِ (M الأرجاء / مهدوم), 244a يَا رُبَّ (M بل ربّ), 256 word order.

## 4. Harakat
- By rule (the base's convention): fatha / kasra / damma before madd letters (1149 / 267 / 99), sukun (1173 + 206 diphthongs + 281 article), shadda of sun letters (177).
- **179 words completed or corrected** (`FIX` lines of the log). Most are words W leaves partly or wholly bare (e.g. 8b جَفَا، 15a مَنْزِلَةٌ / خِلْتُهَا، 27 الْقَسْرِ / صَرْفِ الْقَضَا، 51a مُحْقَوْقِفٍ، 94a مَنْصُوبَةً).
- Marks **changed** against W (each with its reason in the log): 2a حَاكَى (W حاكي; M), 18a يَثْنِينِي (W يُثنيني), 23b تَعْرُقُنِي (W تُعرِقني), 26a نَفْثَةُ (W نفثةَ; M + J), 52b كَقِدْحِ (W كَقَدح), 62a بِذَاكَ (W بَذاك) and الْمَرَطَى, 63b مِيلَ (W مَيل), 72b وَمِنْ صَغَا (W ومَن), 80b جُرْشُعٌ (W جرشَع), 146a بَيْنَ (W بِين), 181b تِلْكَ (W تلكِ), 192b أَخْلَى (W أخلي; M + J), 214b أُسَى (W أَسى; M), 222b طُولِ (W طَول), 248a فَهْيَ (meter).
- Marks taken from M where W is bare: 152b مَرْهُوبَ، 217b نَئِيمَ … صَوْتَ، 150a الْتِوَاءٌ، 192a كُفْرَانَ، 223b مَسُّ.
- Marks of the result that differ from a mark printed in M or J: 100 lines in the log (almost all are slips of those two copies; the ones weighed: 48a خُوصٌ … ضُمَّرٌ (M جرًّا), 83b مِثْلَ (M مثلِ), 130a مَحَلَّ (M محلُّ)).
- **Meter:** all 512 hemistichs scan as rajaz (مستفعلن / متفعلن / مفتعلن / فَعَلَتُن). Read for the scan: 39a «أَنَا» short; 106a «سَمَوَا» (dual); 183b «مِ الْعِبْءِ» = من العبء; 109 and 122 run over the hemistich.

## 5. To verify / decide
- **The whole vocalization** against a printed sharh (التبريزي or ابن خالويه), since no fully vocalized digital source exists.
- Rare words whose marks rest on the dictionary only: 84b الْحُبَى، 114b «عَلَى أُوَارَى عَلَمٍ», 151a الشَّرِيُّ (the meter needs three syllables), 180b الذَّكَا، 236b مُدَّرَى، 248b كَلَا، 72b «مِنْ صَعَرٍ وَمِنْ صَغَا».
- Wording where the three witnesses disagree and W was kept: 11b نَفَاذٌ / نفاد، 19b الْمُنْتَهَى / المنتسى / المنتشى، 15b أَرَبٍ.
- Count / recension: 256 (W, with the additions) kept; the Tabrizi recension is 229.
