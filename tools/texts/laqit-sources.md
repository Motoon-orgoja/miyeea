# Texts report — عينية لقيط بن يعمر الإيادي «يا دار عمرة من محتلها الجرعا» (`laqit.txt`)

Scripts: `jahili-build/` (`cfg-laqit.js` witnesses, `dec-laqit.js` wording decisions, `laqit.voc.txt` the vocalized text, `manual.js` = check and build, `meter.js`, `bare.js`). Log: `jahili-build/out/laqit.manual-log.txt`; the order of each witness against the base: `out/laqit-order.json`. Raw pages: `raw/laqit/`.

## 1. Sources
- **Base (M), riwaya and order:** المكتبة الشاملة 740, ابن الشجري «مختارات شعراء العرب», القسم الأول, pp. 2–5: https://shamela.ws/book/740/2 — 56 verses with Ibn al-Shajari's glosses. **Partly vocalized** (about 18% of the letters: mostly endings).
- **D, vocalized:** المكتبة الشاملة 36072, البرقوقي «الذخائر والعبقريات», pp. 549–553: https://shamela.ws/book/36072/551 — 29 verses of the same riwaya (البرقوقي follows the Mukhtarat).
- **Z, vocalized:** المكتبة الشاملة 722, «أمالي المرزوقي», pp. 49–53: https://shamela.ws/book/722/49 — the other riwaya (57 verses, other order).
- **A:** aldiwan.net (الموسوعة الشعرية), https://www.aldiwan.net/poem103794.html — 60 verses (the Z riwaya with additions), vocalized in its own convention.
- The «أمالي ابن الشجري» (shamela 120922) also has the poem, but its web pages for it show only the footnotes, so it could not be used. No fully vocalized printed copy of the Mukhtarat riwaya was found.

## 2. Count
**56 verses**, as in M. Z has 57: it lacks M 12 «إني أراكم وأرضًا تعجبون بها», 28 «يسعى ويحسب أن المال مخلده», 29 «فاقنوا جيادكم» and has «أنتم فريقان هذا لا يقوم له»، «ولا يغرّنكم دنيا ولا طمع»، «هو الجلاء الذي تبقى مذلته»، «هو الفناء الذي يجتث أصلكم فشمّروا…»، «مستنجدًا يتحدى الناس كلهم». A has 60 (Z's additions plus «عبل الذراع أبيًّا ذا مزابنة»). Those verses were not added: the riwaya asked for is the Mukhtarat's. No verse was excluded for content.

## 3. Wording
Changed in M (typos of its digital copy), `dec-laqit.js`:
| v. | M | adopted | why |
|---|---|---|---|
| 29a | واحملوا ذماركم | **وَاحْمُوا** ذِمَارَكُمُ | M's wording does not scan; D + A; حمى الذِّمارَ (M's gloss: «الذمار: ما لزمك حفظه») |
| 34a | على ضنٍّ بدراكم | بِدَارِكُمُ | M's wording does not scan; Z + A |
| 52a | كما لكِ بن قنان | كَمَالِكِ بْنِ قَنَانٍ | spacing; Z + A |

Readings of M kept (selection; the full list is in the log): 9a «الْمُزْجِي مَطِيَّتَهُ إِلَى الْجَزِيرَةِ» (Z, A «المزجي على عجلٍ نحو الجزيرة»); 19b «حَرِيقُ غَابٍ» (Z, A «نارٍ»); 21a «عَنْ سَفَهٍ» (Z «عن عرض»); 23b «لَا تَفْزَعُونَ» (A «لا تجمعون»); 26 «حَصِدٍ يُصْبِحْ» (Z, A «حسنٍ يُضحِ»); 31 «جِيَادَكُمُ · النَّبْلَ» (Z «خيولكم · النبع»); 33b «أَهْلِيكُمُ» (Z, A «نسوتكم»); 34b «بِأَمْرِ الْحَازِمِ الْفَزَعَا» (Z, A «بأمرٍ حازمٍ فزعا»); 39b «مَجْدًا» (Z «عزًّا»); 44b «الْأَمْنَ» (Z «الأمر»); 47b «سَنَاهُ يَقْصِمُ» (= A; D «شَباهُ يَفْصِمُ», Z «أذاه يحطم»); 49 «مَا انْفَكَّ يَحْلُبُ هَذَا الدَّهْرَ» (D «مازال»; Z, A «درَّ الدهر»); 50b «مُسْتَحْكِمَ الرَّأْيِ» (= D; Z, A «السِّنّ»); 52b «عَمْرِو الْقَنَا» (Z, A «زيدِ القنا»); 53b «لِجَنْبِكَ قَبْلَ اللَّيْلِ» (Z «لنفسك قبل اليوم»); 54 «فَشَاوَرُوهُ … لَا عَاجِزًا نِكْسًا وَلَا وَرَعَا» (Z «فساوره … يختبل الرئبال والسبعا»); 55b «خَيْرَ الْعِلْمِ» (= D; Z «القول»); 56b «لِمَنْ رَأَى» (= D; A «فمن رأى»).

## 4. Vocalization — completed (base only partly vocalized)
- The text was vocalized in full in `laqit.voc.txt`; `manual.js` checks that its letters equal M's (after the 3 decisions above) and compares every mark with M, D, Z and A on the same word.
- **Marks in the text: 1927.** Printed identically by M or a witness on the same word: **1450 (75%)**. Supplied here: **477**, of which **341** are fixed by the spelling (the vowel before its madd letter, the sukun of the article and of و/ي after fatha) and **136** others — nearly all sukun on a medial letter, which D, Z and A never print (عَمْرَةَ، الْجِزْعِ، شَطْرِ…); the few supplied vowels are in words that only M has (مَطِيَّتَهُ، أَهْلِيكُمُ، الْحَازِمِ، فَشَاوَرُوهُ، فَأَلْفَوْهُ، عَمْرِو). Full list in the log.
- Coverage: M **17.5%** → **99.9%** (the only bare letter is the silent و of «عَمْرِو»).
- Chosen between the witnesses: 8a أُبَيِّنُهُمْ (Z; A أُبِينُهُم), 7a بِعَيْنِيَ (M, Z; A بِعَيْنَيَّ), 10b أَنِّي (M «أنى», A), 14a تَآوَوْكُمْ (M «تآووكم»; M: «ويروى تأيوكم»), 22b وَتَنْتِجُونَ (A; نَتَجَ الناقةَ), 31b وَالشِّرَعَا (A; Z الشَّرَع), 26b نَقَعَا (D; A نَقِعا), 28a يَحْسَبُ (D; A يحسِب), 29a فَاقْنُوا (D; A فاقنَوا), 39a «يَا قَوْمِ» (as M prints vv. 41–42; D, Z «يا قومُ»), 39b «قَدَ اشْفَقْتُ» (D: the hamza's vowel moved to the دال, as the meter requires; M «قد أشفقت»), 24a أَظَلَّكُمُ (meter; A).
- 35 marks differ from a witness (log): each is either the printed mark of M (8b سَاعَةً، 11b أَمْرُ، 32b الْخَيْلُ، 48a مُسَهَّدَ، 49a الدَّهْرَ، 54a عَلَلٍ…) or a slip of the witness (Z يسنَّونَ، آونةَ، A مَثلَ، الرَأَيَ، الأُقحوُان).
- **Meter (البسيط، الضرب مخبون فَعِلُن):** 112 of 112 hemistichs pass.

## 5. To verify
- 15b «الْقِلَعَا» (D; A «القَلَعا»): M glosses «القلع: السحاب العظيم» without marks.
- 39b «قَدَ اشْفَقْتُ» is written with the transferred vowel (as D); M writes the hamza.
- 54a «فَشَاوَرُوهُ» (M) against «فساوروه» (Z, A).
