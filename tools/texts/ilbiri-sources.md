# Texts report — تائية الإلبيري «تفت فؤادك الأيام فتا» (`ilbiri.txt`)

Method: each witness was parsed into verses; verses were aligned and compared word by word with an LCS script after removing harakat and tatweel and unifying alef/yaa/taa-marbuta/hamza seats (no comparison by eye).
Scripts: `tools/texts/tazkiya-build/` — `ilbiri-parse.js` (→ `out/ilbiri-sources.json`), `collate-poem.js` (→ `out/ilbiri-vs-wiki.txt`, `out/ilbiri-vs-diwan.txt`), `ilbiri-build.js` (writes `ilbiri.txt`, log in `out/ilbiri-build.log`). Raw downloads: `tools/texts/raw/ilbiri/`.

## Sources
- **Base (wording + vocalization): المكتبة الشاملة 573** «متون طالب العلم – المستوى الثالث», جمع وتحقيق د. عبد المحسن بن محمد القاسم (ط. ٥، ١٤٤١هـ), section «منظومة أبي إسحاق الإلبيري», pages 25–45: https://shamela.ws/book/573/25. Critical text from seven manuscripts (الأسكوريال ٤٠٤/٢ dated ٦٧٦هـ، مركز الملك فيصل ×٢، الحسنية ×٢، القاسمية بالهامل، مؤسسة آل سعود بالدار البيضاء). Fully vocalized, 112 numbered verses, meter given as الوافر.
- **Check 1 (vocalized): ar.wikisource «تفت فؤادك الأيام فتا»** (the adab.com/aldiwan text that circulates on the web): https://ar.wikisource.org/wiki/تفت_فؤادك_الأيام_فتا. 112 verses.
- **Check 2 (lightly vocalized): المكتبة الشاملة 6869** «ديوان أبي إسحاق الإلبيري», تحقيق د. محمد رضوان الداية (دار قتيبة ١٤٠١هـ), pages 1–9: https://shamela.ws/book/6869/1. 110 verses; this digital copy has many typing slips (الغضب for العضب، شبقتا، وضاقي، الإسادة، كبرنا…), so it was used only to decide between the two others.
- Also looked at: the al-Qasim *sharh* PDF (a-alqasim.com, 112 verses, confirms the recension of the base; its text layer garbles the harakat, so not used for wording), al-azkar.com (web copy = Check 1).

## Count
- **112 verses** ✔ — the number the poet gives in the last verse («وَقَدْ أَرْدَفْتُهَا سِتّاً حِسَاناً | وَكَانَتْ قَبْلَ ذَا مِئَةً وَسِتَّا»), and the count of the base and of al-Qasim's sharh.
- **Recension difference (decision needed):** the base has v.105 «فَلَيْسَ الزُّهْدُ فِي الدُّنْيَا خُمُولاً | لَأَنْتَ بِهَا الأَمِيرُ إِذَا زَهِدْتَا» and does **not** have «فَرَاجِعْهَا وَدَعْ عَنْكَ الهُوَيْنَى | فَمَا بِالبُطْءِ تُدْرِكُ مَا طَلَبْتَا», which the web text (Wikisource/aldiwan/al-azkar) and the Dayah diwan have after v.29. Both recensions total 112. The base was kept as is (critical edition, the one taught in the متون طالب العلم programme). If the site prefers the web recension, swap these two verses (the vocalization of «فراجعها…» would then come from Wikisource).
- The Dayah diwan copy also lacks v.17 and v.81 and runs v.80/81 together; that is a defect of that copy.

## Wording differences (base kept unless marked)
| Verse | Base | Other reading | Decision |
|---|---|---|---|
| 8 | وَيَجْلُو … وَيَهْدِيكَ (subject: العلم) | وتجلو … وتهديك (Wikisource, diwan) | base |
| 12 | وَكَنْزٌ | وكنزاً (Wikisource) | base |
| **19** | **فِيهْ طُولَ بَاعٍ** | فِيهِ طَوِيلَ باعٍ (Wikisource, diwan) | **changed**: the base breaks the Wafir (two sakins «فِيهْ طُـ», the second foot is a syllable short); «فِيهِ طَوِيلَ» scans مفاعلتن |
| 25 | وَإِنْ كَبِرْتَا | إذا كبرتا (Wikisource, diwan) | base (same meter) |
| 26 | وَإِنْ فُقِدْتَا | وقد فقدتا (Wikisource, diwan) | base |
| 39 | اقْتَضَّ | افتضّ (Wikisource, diwan) | base (synonyms) |
| 41 | فَمَاذَا عِنْدَهُ | فما عنده (Wikisource) | base (the diwan agrees; فما breaks the meter) |
| 53 | مَا نِلْتَ مِنْهَا | فيها (Wikisource, diwan) | base |
| 57 | ذُو النُّونِ ابْنُ مَتَّى | بنُ (Wikisource) | base (spelling only) |
| 85 | كَمَا حَسِبْتَ | احتسبت (Wikisource, diwan) | base (احتسبت breaks the meter) |
| 92 | فَتَلْقَى البِرَّ | فتُلفى (Wikisource, diwan) | base |
| 108 | وَنَظَرْتَ فِيهَا | منها (Wikisource) | base (the diwan agrees) |
| 109 | النَّصَايِحَ | النَصائِحَ (Wikisource) | **spelling changed** to النَّصَائِحَ (the standard hamza spelling; same word) |

Only-diwan slips not followed: 11 الغضب، 14 «العلم التعلم»، 22 وضاقي/الإسادة، 34 «جعلت فو العلم»، 78 وخطبت، 83 وتنقيه، 86 كشف.

## Vocalization
- The base is fully vocalized in the edition's convention (madd letters and the lam of the article left bare). By letters: 3311 of 3607 non-alif letters carry a mark (91.8%); the unmarked ones are all madd و/ي or the lam of «ال». **No word is left without its vowels.**
- Added: none, except in v.19 (from Wikisource «طَويلَ», plus the kasra of the waw, the only possible vowel: طَوِيلَ).
- Editorial quote marks of the edition removed: v.6 and v.86 «أَبَا بَكْرٍ», v.35 «طَهَ», v.100 «كَـ «السَّامِرِيِّ»» → كَالسَّامِرِيِّ.
- Heading: one «## مَنْظُومَةُ أَبِي إِسْحَاقَ الإِلبِيْرِيّ», the edition's own title, as printed.
- `node tools/build-poem.js tools/texts/ilbiri.txt __test …` → 112 verses, 1 section ✔ (test file deleted).

## مواضع للتأكد
- The recension question above (v.105 «فليس الزهد…» vs «فراجعها ودع عنك الهوينى…»).
- v.8: the circulated web text reads «وتجلو … وتهديك» (feminine, referring to the knowledge-sciences); the base reads the masculine. Kept the base.
