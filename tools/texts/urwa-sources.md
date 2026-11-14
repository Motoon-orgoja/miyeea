# Texts report — مختارات من شعر عروة بن الورد في الكرم والإباء (`urwa.txt`)

Three pieces, 25 verses, each under its own «## heading». Scripts: `jahili-build/` (`cfg-urwa.js`, `dec-urwa.js`, `build.js`, `meter.js`, `bare.js`). Log: `jahili-build/out/urwa-build-log.txt`; order of the witnesses: `out/urwa-order.json`. Raw pages: `raw/urwa/`.

## 1. Sources
Base of every piece: **aldiwan.net = الموسوعة الشعرية** (vocalized; its convention — no sukun, no vowel before a madd letter — completed mechanically by `complete()`). Collated with:
1. **«إني امرؤ عافي إنائي شركة»** (الطويل, 3 verses = the حماسية of أبي تمام): A https://www.aldiwan.net/poem38307.html; M المرزوقي «شرح ديوان الحماسة» (shamela 26536, p. 1132); F الفارسي «شرح حماسة أبي تمام» (16435, p. 777); J الدينوري «المجالسة» (9948, p. 2373, vocalized); I «إيضاح شواهد الإيضاح» (9250, p. 59, vocalized, 2 verses).
2. **«أقلي عليّ اللوم يا ابنة منذر»** (الطويل): A https://www.aldiwan.net/poem38304.html (27 verses), of which **17** are taken: 1–7 (the reproach and his answer) and 13–21 (the two صعاليك), 27 (the guests). Left out: 8–12 and 22–26 (the wife's speech and the raids), as a selection. S «الأصمعيات» (shamela 6905, pp. 29–33), الأصمعية 10, 27 verses, partly vocalized; H «جمهرة أشعار العرب» (1487, pp. 405–410), 16 verses, vocalized.
3. **«ذريني للغنى أسعى»** (الوافر, 5 verses): A https://www.aldiwan.net/poem38297.html; Q القزويني «الإيضاح» (7380, p. 190); D «الدر الفريد» (20762, p. 2711, vocalized); L ابن أبي الدنيا «إصلاح المال» (13187, p. 465, vocalized); B الجاحظ «البخلاء» (10501, p. 231, 2 verses).

## 2. Count and content
25 verses (3 + 17 + 5). Nothing excluded for content (no wine or obscene verse in these pieces). Piece 2 contains the 7 verses of «لحى الله صعلوكًا» already published in `hamasa.txt` (same marks), with the verses around them.

## 3. Wording: changed in A (the old sources agree against it)
| piece/v. | A | adopted | witnesses |
|---|---|---|---|
| 2/1a | يا بِنْتَ مُنْذِرٍ | يَا **ابْنَةَ** مُنْذِرٍ | S + H |
| 2/1b | وَإِنْ لَمْ | **فَإِنْ** لَمْ | S + H |
| 2/16a | فَذالِكَ | فَذَلِكَ | spelling (S) |
| 3/1a | دَعِينِي | **ذَرِينِي** | Q + D + L + B (+ المقصور والممدود) |
| 3/3a | وَيُقْصِيهِ النَّدِيُّ | **يُبَاعِدُهُ الْقَرِيبُ** | Q (D «يساعده القريب», L «يباعده البذيء») |
| 3/4a | وَيُلْفَى ذُو الْغِنَى | **وَتَلْقَى ذَا** الْغِنَى | Q + D (L «وقد تلقى الغنيّ») |

Readings of A kept: 1/2b «بِوَجْهِي شُحُوبَ الْحَقِّ» (= M; F «بنفسي», J «بجسمي مسّ الحق»); 2/2b «قَبْلَ … الْبَيْعَ» (= S; H «قبلُ … الأمر»); 2/3b «فَوْقَ صُيَّرِ» (S «تحت صَبر»); 2/4b «رَأَتْهُ» (S «تراه»); 2/9a «مِنْ نَفْسِهِ» (= H; S «من دهره»); 2/10a «نَاعِسًا» (= H; S «قاعدًا»); 2/11 «قَلِيلُ التِّمَاسِ الزَّادِ … أَمْسَى» (S «قليلَ التماس المال … أضحى»); 2/13a «وَلَكِنَّ صُعْلُوكًا» (= H; S «ولله صعلوكٌ»); 3/2 «وَأَبْعَدُهُمْ … وَإِنْ أَمْسَى لَهُ حَسَبٌ» (= B, D; L «وأخملهم … وإن كانت له نعم»); 3/5 «قَلِيلٌ ذَنْبُهُ وَالذَّنْبُ جَمٌّ وَلَكِنْ لِلْغِنَى» (= Q; L «عيبه والعيب», D «ولكنّ الغنيّ»).

## 4. Harakat
- A as printed: 65.6% / 68.4% / 68.3% → **100%** (784/784) after completing its convention (fatha/kasra/damma before a madd letter 144, sukun 137 incl. article and diphthongs, sun-letter shadda 9). No mark was filled from a witness. `bare.js`: no letter left bare.
- **Corrected in A:** 2/7b وَمَنْظَرِ (S + H; A «ومُنظَر»), 2/12a يَسْتَعِنَّهُ (plural feminine; S + H; A «يستعِنُّه»), 2/15b تَشَوُّفَ أَهْلِ (S + H), 3/2b وَخَيْرُ (A leaves the خ bare, which its convention would read «خِير»), 3/4b فُؤَادُ صَاحِبِهِ (L; A «صاحبُه»).
- Kept against a witness: 1/3b قَرَاحَ (the lexica's vowel; J «قِراح»), 2/1a مُنْذِرٍ (= S; H «منذرِ»), 2/11a قَلِيلُ (S «قَليلَ»), 3/1b «شَرُّهُمُ الْفَقِيرُ» (= D; L «شرَّهم الفقيرَ»).
- **Meter:** pieces 1–2 الطويل, piece 3 الوافر. 49 of 50 hemistichs pass; 1/1a «إِنِّي امْرُؤٌ عَافِي إِنَائِيَ شِرْكَةٌ» scans only with الخَرْم (the first letter of فعولن dropped: «إِنْ نِمْ | رُؤُنْ عَا فِي…»), a license at the start of the verse. All the sources here print «إني»; «وإنّي» (البكري، التنبيه) would scan without it. Kept.

## 5. To verify
- 2/5b «مَحْضِرِي»: A's kasra (no witness marks the ض); the usual form is «مَحْضَر».
- 1/1a: «إني» (with الخرم) or «وإني».
