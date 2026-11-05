# Texts report — الوصية الصغرى لشيخ الإسلام ابن تيمية (`wasiyyasughra.json`)

Method: every witness was turned into a word list and compared word by word with an LCS script after removing harakat/tatweel and unifying alef/yaa/taa-marbuta (no comparison by eye). Vocalization was compared letter by letter on every word the witnesses share.
Scripts: `tools/texts/tazkiya-build/` — `shamela-text.js`, `ko-text.js` (extraction), `wasiyya-stage1.js` (cleanup, Quran, rule fixes, filling bare letters from the Jum'a edition; conflicts in `out/w-conflicts.txt`), `wasiyya-build.js` (reviewed fixes, chapters, paragraphs). Full log: `out/wasiyyasughra-build.log`. Raw downloads: `tools/texts/raw/wasiyyasughra/`.

## Sources
- **Base (wording + vocalization): المكتبة الشاملة 7289 «مجموع الفتاوى»**, ج ١٠ ص ٦٥٣–٦٦٥ (book pages 5233–5245): https://shamela.ws/book/7289/5233. This is the circulated (متداول) text of the Wasiyya — the one in the commentaries — headed «سُؤَالُ أَبِي الْقَاسِمِ الْمَغْرِبِيِّ». The shamela copy is vocalized, but its vocalization has systematic slips (see below).
- **Check 1 (partly vocalized, critical): ketabonline 67493** «وصية شيخ الإسلام ابن تيمية إلى أبي القاسم السبتي، الشهيرة بالوصية الصغرى», تحقيق د. عبد المجيد بن جمعة (دار الفضيلة ١٤٣٤هـ): https://ketabonline.com/ar/books/67493. Hadith texts fully vocalized, the rest partly. Page 43 of the print is empty in the digital copy (no text lost: the collation shows no gap).
- **Check 2 (unvocalized): ketabonline 17512** «الوصية الجامعة لخير الدنيا والآخرة» (دار البشائر ١٤١٠هـ): https://ketabonline.com/ar/books/17512.
- Quran: api.quran.com `text_imlaei` (cached in `raw/wasiyyasughra/quran/`).
- No fully vocalized edition of the Wasiyya exists online as text (islamhouse/archive.org copies are scans). Hence base = the vocalized MF text, corrected.

## Count
- 2159 words, **97 paragraphs** in 5 chapters. The Wasiyya has no headings of its own: chapter 1 is MF's heading «سُؤَالُ أَبِي الْقَاسِمِ الْمَغْرِبِيِّ»; the other four titles are **editorial and unvocalized**, following the four questions: «الجواب: الوصية»، «أفضل الأعمال بعد الفرائض»، «أرجح المكاسب»، «الكتب التي يعتمد عليها في العلوم».
- Paragraph length 8–54 words (MF has almost no punctuation; long sentences were cut before a clause-opening word such as فَإِنَّ، لَكِنْ، وَأَمَّا).

## Wording
MF kept everywhere (owner rule: the circulated wording), except one evident slip:
| MF | Jum'a / Dar al-Bashair | Decision |
|---|---|---|
| «قال النبي ﷺ لِأَبِي لَبِيدٍ الأنصاري» | «لابن لبيد» (both) | **«لِابْنِ لَبِيدٍ»** — the hadith is of زياد بن لبيد الأنصاري |

Other differences of the Jum'a edition (MF kept; 62 hunks in all, list in `out/w-mf-vs-juma.txt`): the question's longer opening («الحمد لله على كل حال. هذا سؤال أبي القاسم القاسم بن يوسف … التجيبي السبتي»، and the epithets «سيدنا … الفقيه الهمام … الفاضل العالم … المبدع المغرب المعرب المفصح … أبقى الله علينا بركته»); «وكانوا يشبهونه»؛ «ثم إنّ الحق»؛ «إما تركُ»؛ «ما تمحو»؛ «صبوا على بوله»؛ order «هدي، وصدقة، وعتق، وصيام»؛ «تكفرها»؛ «أو عمل»؛ «في السنن»؛ «وله شواهد»؛ «قاله غير واحد»؛ «بعث الله به النبي»؛ «وإذ كان»؛ «بذلك»؛ «من عمل صالح»؛ «عن مَن»؛ «عبد الله بن عمرو» (MF: عُمَرَ)؛ «همّه»؛ «ونظراء ذلك»؛ «الرعد والمطر»؛ «ليبارك الله له»؛ «بناء»؛ «فيه كراهة»؛ «نشأ»؛ «المأثور» (MF: الموروث)؛ «أن لا»؛ «أبوابًا» (MF: إيعابًا)؛ the closing formula. Jum'a also lacks MF's «المأثورة» (الأذكار المأثورة) and adds صلى الله عليه وسلم / سبحانه وتعالى in several places. Dar al-Bashair has the same type of differences (74 hunks) and the slip «واتبع الحسنة السيئة».

## Vocalization
Base marks kept; every change is logged in `out/wasiyyasughra-build.log`.
- **Rule fixes of the digital copy (certain by grammar):** sukun before hamzat al-wasl → the connecting vowel, 44× (مِنْ الْ… → مِنَ الْ…، عَنْ الْ… → عَنِ الْ…، وَأَتْبِعْ السَّيِّئَةَ → وَأَتْبِعِ، وَخَالِقْ النَّاسَ → وَخَالِقِ، مِنْهُمْ ابْنُ → مِنْهُمُ ابْنُ، قَدْ ابْتُلِيَ → قَدِ ابْتُلِيَ …); bare hamza under alif given its kasra, 42× (إلَى → إِلَى); old spelling «وَاَللَّهِ/بِاَللَّهِ» → «وَاللَّهِ/بِاللَّهِ» 8×, «اُبْتُلِيَ/اُخْتُلِفَ» → «ابْتُلِيَ/اخْتُلِفَ» 4×.
- **Filled from the Jum'a edition** (base letter bare, Jum'a has the mark on the same word): 30 words, e.g. لَقِيت → لَقِيتُ، كُنْت → كُنْتَ (3×)، سَأَلْت → سَأَلْتَ، دَعَوْت → دَعَوْتُ، أَطْعَمْته → أَطْعَمْتُهُ، كَسَوْته، هَدَيْته، رَحْمَتِكَ، فَضْلِكَ، عِبَادِكَ، بِإِذْنِكَ، إِنَّكَ، وَمِيكَائِيلَ، لَأُحِبُّكَ، أَعْلَمُ الْأُمَّةِ، وَسَائِرِ الْأَعْمَالِ.
- **Reviewed fixes (36):** bare endings completed where only one vowel is possible (أَحْمَدُ بْنُ تَيْمِيَّةَ، عُيَيْنَةَ، أَبُو دَاوُدَ، لِعُمَرَ، قَوْلِهِ، مَتَى، قَطَعَكَ/حَرَمَكَ/ظَلَمَكَ، تَدَبَّرْتَ، نَصِيبِكَ ×3، وَاللَّهُ أَعْلَمُ، وَلَا أَعْلَمُ، أَنْفَعُ مِنْ صَحِيحِ…، وَسَائِرِ كَلَامِهِ); dropped tanween restored (بِخُلُقٍ حَسَنٍ ×2، بِمَنْزِلَةٍ عَلِيَّةٍ، بِرَتْوَةٍ، بِخُطْوَةٍ، بِمَعْرُوفٍ، بِإِشْرَافٍ، بِأَصْلٍ); لحن corrected: «وَصِيَّةً أَنْفَعُ» → أَنْفَعَ، «وَيُرْشِدُنِي/وَيُنَبِّهُنِي/وَيُبَيِّنُ» → subjunctive (after بِأَنْ يُوصِيَنِي)، «وَأَرْفَعُهَا … وَخَيْرٌ لَكُمْ» → وَأَرْفَعِهَا … وَخَيْرٍ (genitive, as in the hadith)، «يَكُونُ … أَفْضَلُ» → أَفْضَلَ، typos أَمَا بَيَانُ → أَمَّا، أَحَكَمَ → أَحْكَمَ; «أَمَّا الْكَفَّارَاتُ … وَأَمَّا الْكَفَّارَاتُ» → «إِمَّا … وَإِمَّا» (a division; no فـ follows; Jum'a: إمّا)؛ «مُوجِبُهَا / مُوجِبَ الذُّنُوبِ» → مُوجَب (what the sins entail; Jum'a).
- Quran: 11 citations put in ﴿﴾ with the Mushaf text (النساء ١٣١، التوبة ٦٩، الفاتحة ٥، هود ١٢٣، هود ٨٨/الشورى ١٠، العنكبوت ١٧ ×2، النساء ٣٢، الجمعة ١٠، الذاريات ٥٦–٥٨). Ibn Mas'ud's «كَانَ أُمَّةً قَانِتًا لِلَّهِ حَنِيفًا وَلَمْ يَكُ مِنَ الْمُشْرِكِينَ» is his own saying about Mu'adh and stays unbracketed.
- Punctuation: MF's braces around hadiths removed (a full stop added where a quotation ended without one, 8×); four stray «؟» of the digital copy (not questions) → «،».
- **Result:** no word is left without its vowels (script check `bare.js`: 0); 6838 of 7387 non-alif letters outside the Quran carry a mark (92.6%) — the rest are madd letters and the lam of «ال».

## مواضع للتأكد
- «فَإِنْ بَدَأْتَ بِنَصِيبِكَ مِنَ الْآخِرَةِ **مَرَّ** عَلَى نَصِيبِكَ مِنَ الدُّنْيَا **فَانْتَظَمَهُ**» (MF). Jum'a: «مُرَّ … فانتظِمه» (imperatives). Kept MF.
- «وَهِيَ أَرْبَعَةُ أَجْنَاسٍ: هَدْيٍ وَعِتْقٍ وَصَدَقَةٍ وَصِيَامٍ» (MF, genitive as substitute). Jum'a: nominative (هَديٌ، وصدقةٌ…). Both are correct Arabic.
- «وَجِمَاعُ الْخُلُقِ الْحَسَنِ» / «لَكِنَّ جِمَاعَ الْخَيْرِ» (MF). Jum'a: «جُمَّاع». Kept MF.
- «عَبْدِ اللَّهِ بْنِ عُمَرَ» (MF) vs «عمرو» (Jum'a) before «أكمل المؤمنين إيمانًا أحسنهم خلقًا». Kept MF (wording rule); the teacher may prefer Jum'a.
- «يُعْقِبُهُ» (MF) vs «يعقُبه» (Jum'a); «وَأَنَّهُ يُحْشَرُ» (MF) vs «يُحْشَرَ» (Jum'a). Kept MF.
