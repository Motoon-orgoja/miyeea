# Texts report: زهدية أبي العتاهية «لِدُوا لِلْمَوْتِ وَابْنُوا لِلْخَرَابِ» — `zuhdabulatahiya.txt`

The scripts are in `hikma2-build/` and are shared by the three keys of this batch:
- `parse.js` parses the witnesses into `out/<unit>.json`.
- `collate.js` compares the texts word by word, using an LCS after stripping harakat and tatweel and unifying alef, yaa and taa marbuta. Output: `out/<unit>.collation.txt`.
- `build.js` applies the decisions, completes the vocalization and checks the meter. Output: `out/<key>.build-log.txt`.
- `meter.js` is the scanner of `hikma-build/meter.js` with الوافر added.

Raw files are in `raw/zuhdabulatahiya/`.

**Which poem:** «لدوا للموت وابنوا للخراب» was chosen.
- A critical edition of the diwan (Shukri Faysal, «أبو العتاهية: أشعاره وأخباره») is not available as digital text.
- This poem has two independent full digital texts. They agree on all 19 verses, in the same order.
- Its first 4 verses are also attested in a classical source.
- «أذل الحرص والطمع الرقابا» has only one digital text (Wikisource), so it is not better attested.

## 1. Sources
- **Base (A), vocalized:** aldiwan.net, «لدوا للموت وابنوا للخراب». This is the text of «الموسوعة الشعرية», vocalized in the al-Warrāq style: https://www.aldiwan.net/poem10340.html
- **Check 1 (W), partly vocalized:** Wikisource, https://ar.wikisource.org/wiki/لدوا_للموت_وابنوا_للخراب. Its text is the same as adab.com. Ketabonline 66706 «ديوان أبي العتاهية» has the same text and was not counted as a separate witness.
- **Check 2 (B), unvocalized, verses 1–4:** ابن عبد البر, «بهجة المجالس وأنس المجالس», باب من المواعظ الموجزة: https://shamela.ws/book/558/246

## 2. Count
- A and W have **19 verses**, in the same order.
- B quotes verses 1–4.

## 3. Wording
Rule: adopt the circulated wording, which is the majority of A, W and B. The meter overrides.

| v. | Adopted | A reading | Why |
|---|---|---|---|
| 1b | إِلَى **تَبَابِ** | ذَهابِ | W + B. It is also the wording quoted by ابن كثير، ابن تيمية، ابن القيم |
| 3b | **أَتَيْتَ فَمَا** تَحِيفُ وَلَا تُحَابِي | أَبيتَ فَلا تحيف ولا | B, the oldest witness. W has «أتيتَ وما … وما». Taking the majority of A, W and B word by word gives exactly B |

W has obvious corruptions: «وفاءِ» for وَفَازٍ, «نقلَّدت العظامُ من البرايا», «أحَلَّدَ». So the following readings were kept as in A:
- 2b مِنْ تُرَابِ. B has «للتراب».
- 5a وَيَا. W has أيا.
- 8 وَمَالِي … فَأَحْمَدَ غِبَّ عَاقِبَةِ. W has «فما لي … فأحمد منك عاقبة».
- 11b فَلَيْسَ. W has وليس.
- 12a وَفَازٍ.
- 14a تَقَلَّدْتُ الْعِظَامَ مِنَ الْخَطَايَا.
- 15b لَا أُوَفَّقُ لِلصَّوَابِ. W has «لا أفيق إلى الصواب».

## 4. Harakat
A's convention leaves out three kinds of marks:
- the vowel implied by a following madd letter;
- the sukun, which A never writes;
- the shadda of a sun letter after the article (e.g. «الدُنيا», «يَصيرُ», «اللَهِ»).

`build.js` restores exactly these marks, since they admit no other reading. It then checks every mark of the result against W. The remaining differences with W are listed in the build log. All of them are W errors or the gender question in §5.

- **Coverage** (voc.js): A **65.4%** → **99.8%** after completion.
- **Corrected:**
  - 6b «لي الدُنيا» → **لِيَ الدُّنْيَا**. This is W's reading; without it the hemistich does not scan.
  - 10b «ظِلَّ» → **ظِلِّ**. It is genitive (= W).
  - 15a «دَمتُ» → **دُمْتُ** (= W).
- **Meter:** all 38 hemistichs scan as الوافر.

## 5. To verify
- 10a «أَرَاكَ وَإِنْ طُلِبْتَ» and 12a «مِنْكَ»: A is masculine, addressed to الزمان of verses 6–9. W is feminine, «أراكِ وإنْ طُلِبْتِ … منكِ», addressed to الدنيا. A was kept.
- 6b «وَتَسْرِعُ»: this is A's mark. «وتُسْرِعُ» (form IV) is also possible. W is bare. A was kept.
- 8a «أَحْلُبُ» (A) and «أحلِبُ» (W): both are correct.
