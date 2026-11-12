# Texts report: المنفرجة لابن النحوي «اشتدي أزمة تنفرجي» — `munfarija.txt`

Scripts: `poems6-build/` (`parse.js`, `collate.js`, `build-manual.js`, `cfg.js`, `meter.js`). The vocalized text is typed in `poems6-build/munfarija.voc.txt` and checked by `build-manual.js`. Raw files: `raw/munfarija/`. Collation: `out/munfarija.collation.txt`; log: `out/munfarija.build-log.txt`.

## 1. Sources
- **Base (T), vocalized (72%), 40 verses:** «القصيدة المنفرجة» on ketabonline (book 102506), the bare matn of the commentary of زكريا الأنصاري in the edition of جميل عويضة (2009): https://ketabonline.com/ar/books/102506. It has many typing slips (حَتّي، يَضفَر، السُتَحيي، هُدِّى …). The commentary itself in that edition is ketabonline 57129 = 43621 (same text; kept in raw).
- **Z, printed, vocalized, 40 verses:** «المنفرجتان» (shamela 6167, pp. 4–95): the numbered lemmas of «الأضواء البهجة في إبراز دقائق المنفرجة» لزكريا الأنصاري in another edition, with the commentary: https://shamela.ws/book/6167/4
- **S, printed, unvocalized, 39 verses:** «طبقات الشافعية الكبرى» للسبكي (shamela 6739, pp. 2735–2738): https://shamela.ws/book/6739/2735
- «عنوان الدراية» للغبريني (shamela 96611) was fetched but gives another poem on the same rhyme; not used.

## 2. Count
**40 verses** in T and Z, same order: the count of the commented text. S has 39 (it lacks v. 39, on عثمان). No section titles in the sources.

## 3. Wording
| v. | Adopted | T reading | Why |
|---|---|---|---|
| 4b | **لِسُرُوحِ** الْأَنْفُسِ | بسروح | Z + S and the lemma of the commentary |
| 9a | وَمَعَايِشُهُمْ | ومعائشهم | Z + S |
| 21b | **يَظْفَرْ** | يضفر | typo; Z + S |
| 34a | وَعِيَابُ الْأَسْرَارِ **اجْتَمَعَتْ** | الأسرار **قد** اجتمعت | S. T + Z have a syllable too many; see §5 |
| 39a | وَأَبِي **عَمْرٍو ذِي** النُّورَيْنِ | عمرٍ وذي | spacing; the commentary: «أبي عمرو … ذي النورين» |
| 39b | **الْمُسْتَحْيِي** | السُتحيي | typo; Z «المستحي» |
| spelling | مُحْيٍ، حَجًا | مُحيى، حجىً | Z |

Kept with T + Z against S: 4b والمهج (S بالمهج) · 6a فلربّتما (S ولربّتما) · 8b فعلى درك (S فإلى; the commentary cites it as «نسخة») · 16b جئت (S سرت) · 30a وإذا (S فإذا). Typos of Z not counted: 8a «ونُزُلُهم», 13a «بقاء», 39a «عمرٍ ووذي».

## 4. Harakat
- The full vocalization is typed in `munfarija.voc.txt` and checked by script against T and Z word by word. **Coverage: 72.2% (T) → 99.9%** (the one unmarked letter is the silent و of «عَمْرٍو»).
- Of the 1019 vowel marks, **930 are printed identically by T or Z**; 89 were supplied (mostly sukun and the vowels before madd letters that T leaves out).
- **Corrected against both T and Z** (both print the same wrong mark; see §5):
  - 5b فاقصُد → **فَاقْصِدْ** (قصَد يقصِد).
  - 6b بِبِحور → **بِبُحُورِ** (plural of بَحْر).
  - 14b فاعجِل → **فَاعْجَلْ** (عجِل يعجَل).
  - 21a يخطِب → **يَخْطُبْ** (خطَب يخطُب).
  - 30a المقدامُ → **الْمِقْدَامَ** (khabar of كان).
  - 21b الغُنْجِ → **الْغُنُجِ** (the meter needs the second damma; الغُنُج is a form of the word).
- **Corrected from Z or the commentary (typos of T):** 7b سِعَةٍ → سَعَةٍ · 8a وَنَزُولهُمُ → وَنُزُولُهُمُ · 10b انتَسَجَتُ → انْتَسَجَتْ · 12a شَهِدتَ بِعَجائِبَها → شَهِدَتْ بِعَجَائِبِهَا · 14a هُدِّى → هُدًى · 25b الفَردَوسَ → الْفِرْدَوْسَ · 26a مَفُجَّرِها → مُفَجَّرِهَا · 34b تحَّتَ → تَحْتَ · 38b سارِيَةِ → سَارِيَةَ (علم ممنوع من الصرف; = Z).
- Kept with T against Z: 1a أَزْمَةُ (منادى; Z أزمةَ) · 18a فَهِجِ · 19b تَزْدَانُ · 37b اللَّهِجِ (the commentary: «بكسر الهاء»). 35b الْخَرْقُ and الْهَرَجِ follow the commentary («بفتح الخاء», «فتحها للوزن»); 13a حَجًا follows it too («بفتح الحاء»).
- **Meter (الخبب: فَعِلُنْ / فَعْلُنْ أربع مرات في الشطر):** 76 of 80 hemistichs pass alone; verses 36 and 39 are مدوَّران (the word «المهديّ» / the article of «المستحيي» is shared by the two hemistichs) and pass when scanned as one line. No failure.

## 5. Needs a decision / to verify
- **Tawassul:** none of the 40 verses is a tawassul by persons. The poem ends with صلوات on the Prophet ﷺ and the four caliphs (vv. 36–40); v. 38 mentions the كرامة of عمر in the story of سارية. Some circulated copies add closing verses of tawassul after v. 40; they are in none of T, Z, S and were not added.
- **34a** «وَعِيَابُ الْأَسْرَارِ اجْتَمَعَتْ» (S) was preferred to the commentary's «… الأسرار قد اجتمعت» (T + Z), which does not scan. The commentary cites a third reading that scans: «وعيابُ السرِّ قد اجتمعت». Choose between S and that one.
- The six corrections against both T and Z in §4 (فاقصِد، ببُحور، فاعجَل، يخطُب، المقدامَ، الغُنُج): T and Z agree on the other mark, so they may share one origin; the corrections follow the dictionaries, the syntax and the meter.
- 25a وَمَعَانِيهَا (T + Z, with a sakin ي); the nasb form «وَمَعَانِيَهَا» also scans.
- 36b الْهَادِي النَّاسِ (T + Z, إضافة); «الناسَ» is possible.
