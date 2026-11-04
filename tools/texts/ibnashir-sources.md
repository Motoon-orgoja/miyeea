# Texts report — المرشد المعين على الضروري من علوم الدين، لابن عاشر (`ibnashir.txt`)

**How the text was collated**
- Every witness was stripped of harakat and tatweel, and alef/hamza/yaa/taa-marbuta forms were unified. The witnesses were then aligned word by word with an LCS script (`compare.js`).
- A three-way script (`vote.js`) listed every base word that neither witness supports.
- A second script (`harakat-vote.js`) listed every letter where both witnesses agree on a mark that differs from the base.
- The doubtful places were scanned by hand for the رجز meter. A rough scanner (`rajaz.js`) was used only as a hint. It raises many false alarms on the poem's usual licenses: naql of the hamza, «لِيمَانُ», and the shortened final yaa.

**Scripts:** `tools/texts/ibnashir-build/`
- `habous-fetch.js`, `habous-extract.js`, `mayyara-extract.js`, `web-extract.js`
- `compare.js`, `vote.js`, `harakat-vote.js`, `presence.js`, `markcheck.js`, `rajaz.js`
- `build.js` holds every change with its reason.

**Raw downloads:** `tools/texts/raw/ibnashir/`
- `habous/*.html`, `s14249_*.html`, `web/chariaa.html`
- The extracted text is in `_habous.txt`, `_mayyara.txt` and `web/chariaa.txt`.
- Every change applied is in `_fixes.json`.

## Sources
- **Base (H): وزارة الأوقاف والشؤون الإسلامية بالمغرب, habous.gov.ma.** «كتاب المرشد المعين على الضروري من علوم الدين لابن عاشر», category 1166: 28 articles, ids 7113–7225, published 2015. It is the only **standalone, fully vocalized** copy I found online.
  - The ministry site now shows "under maintenance" and the old pages return 404. The pages were therefore taken from the Wayback Machine (snapshots 2019–2020, raw `id_` mode). First page: https://web.archive.org/web/20190920052435/http://www.habous.gov.ma/…/1166-…/7113-… (the full list is in `raw/ibnashir/habous/_ids.json`).
  - H is fully vocalized but carelessly typed: many joined words («ثُمَّكُفْ»), a few wrong letters («مُتْبَدِأً», «الْقِسْطَاطِ»), and marks typed on the alif («لاَ», «بِماَ»).
  - It also turns the word «فَصْلٌ» that opens some verses into a page heading, which breaks the meter.
- **Check 1 (M): المكتبة الشاملة 14249**, «الدر الثمين والمورد المعين» by ميارة (d. 1072H, the author's student), ed. عبد الله المنشاوي, دار الحديث 2008. https://shamela.ws/book/14249/1 … /14249/619
  - The verses are partly vocalized, and the commentary often quotes and discusses single words.
  - Caveat: this digital copy **drops some verse blocks**, e.g. 81–83, 128–134, 156–158 and the zakat table for camels. The commentary still discusses them, but for the verse text those places rest on H and C only. `presence.js` lists them.
- **Check 2 (C): chariaa.weebly.com «متن ابن عاشر»**, a standalone copy. https://chariaa.weebly.com/160515781606-157515761606-1593157515881585.html
  - It is mostly unvocalized and has typos.
  - It lacks the 5 closing verses and one Hajj verse (250).
- **Searched with no usable result:**
  - shamela.ws: no standalone matn (checked the Maliki category, the متون collections and the author's page);
  - ketabonline (API search) and ar.wikisource;
  - OpenITI, which has only M's Shamela text;
  - a forum copy (elmcid.yoo7.com) with only the first verses.
- **Vocalization:** H is vocalized throughout. After the fixes, `markcheck.js` finds no consonant without a mark, apart from the regular cases: lam-alif, the article's lam before a sun letter, tanween alif, and «الله».

## Count
- **317 verses under 28 headings.** H, M and C all have the same 317 verses. No verse of H is missing from both M and C.
- **Author's own count:** the khatima says «أَبْيَاتُهُ أَرْبَعَةَ عْشَرَ تَصِلْ | مَعَ ثَلَاثِمِئَةٍ», i.e. 314. The printed vulgate has 317 (Wikipedia also says 317).
  - None of the three witnesses marks any verse as an addition, and I did not find the reason for the difference, so all 317 were kept.
  - One candidate is verse 105 «شَرْطُهَا الاِسْتِقْبَالُ طُهْرُ الْخَبَثِ…». M quotes it inside the commentary before verse 100; H and C have it after verse 104. **→ to confirm**
- **Headings** are H's page titles in H's order, and they fall exactly on H's page breaks (`build.js` checks this).
  - I completed their marks, and put «في» titles in the genitive: «فَصْلٌ فِي سُنَنِ الْوُضُوءِ» for H's «فصل في سُنَنُ الْوُضُوءِ».
  - The book-level titles are the author's own, as in M's table of contents: كتاب الطهارة، الصلاة، الزكاة، الصيام، الحج، مبادئ التصوف.
  - The finer «فصل» titles are H's.

## Changes to H's wording and vocalization (verse numbers follow the final file)
Most rows are typing slips. The substantive ones are:
- «وَبَعْدُ» restored at the start of verse 4;
- «فَصْلٌ» restored at the start of 41, 54, 72, 78, 140, 146, 159 and 209. M has it inside the verse, and without it each of these hemistichs is one foot short;
- «لَا» restored in 114 (from M; the meaning requires it);
- meter fixes in 28, 32, 58, 63, 64, 84, 116, 163, 187, 227, 243, 267 and 314.

| Verse | Habous | Written as | Reason |
|---|---|---|---|
| 1 | عُبْدُ | عَبْدُ | fatha (typo) |
| 1 | ابْنُ عَاشِرٍ | بْنُ عَاشِرِ | M, C «بن»; the rhyme is -dirī (القادرِ) |
| 1 | مُتْبَدِأً | مُبْتَدِئًا | letters swapped (M, C مبتدئا) |
| 3 | وَءَالِهِ | وَآلِهِ | spelling of the madda |
| 4 | فَالْعَوْنُ | وَبَعْدُ فَالْعَوْنُ | H prints «(وَبَعْدُ)» on its own line; it is the start of the verse (M, C; meter) |
| 10 | أَّوَّلُ | أَوَّلُ | stray shadda on the hamza |
| 24 | لَمْيَكُ | لَمْ يَكُ | missing space |
| 25 | لانْتَفَى | لاَنْتَفَى | missing fatha |
| 25 | انْ حَتَمْ | انْحَتَمْ | one word (M, C) |
| 28 | وَالتَّالِي | وَالتَّالِ | M; meter (وَالتَّالِ فِسْ = --u-) |
| 32 | مُحَالُ | مُحَالٌ | M; meter (مُحَالُنِلْ = u-u-) |
| 41 | وَطَاعَةُ | فَصْلٌ وَطَاعَةُ | «فصل» belongs to the verse (M, C; without it the hemistich is a foot short) |
| 53 | بِذَيْنْ" | بِذَيْنْ | stray quote mark |
| 54 | وَتَحْصُلُ | فَصْلٌ وَتَحْصُلُ | «فصل» belongs to the verse (M, C; meter) |
| 55 | لِعاَدَةٍ | لِعَادَةٍ | fatha typed on the alif |
| 58 | وَلِيَنْوِ | وَلْيَنْوِ | C; lam of the imperative after waw; meter |
| 63 | مَضْمَضَةٌ | مَضْمَضَةُ | M, C; meter (مَضْمَضَةُ اسْتِنْشَاقٌ = -uu- --u-) |
| 64 | عَشْرَ | عْشَرَ | meter: «وَأَحَدَ عْشَرَ» (uuu- u-u-); Mayyara notes «تسكين العين من أربعة عشر لغة» |
| 64 | تَسْمِيَّةٌ | تَسْمِيَةٌ | stray shadda (M, C) |
| 65 | وَتَيَامُنُا لإِنَا | وَتَيَامُنُ الإِنَا | word boundary misplaced (M, C) |
| 70 | ذَاكِرُفَرْضِهِ | ذَاكِرُ فَرْضِهِ | missing space |
| 72 | نَوَاقِضُهُ | فَصْلٌ نَوَاقِضُهُ | «فصل» belongs to the verse (M; meter) |
| 78 | فُرُوضُ | فَصْلٌ فُرُوضُ | «فصل» belongs to the verse (M; meter) |
| 81 | مَضْمَضَةٌغَسْلُ | مَضْمَضَةٌ غَسْلُ | missing space |
| 83 | أَعْضَاءِالْوُضُو | أَعْضَاءِ الْوُضُو | missing space |
| 84 | تَبْدَأْ | تَبْدَأُ | M, C; meter (تَبْدَأُ فِلْ = -uu-) |
| 84 | ثُمَّكُفْ | ثُمَّ كُفْ | missing space |
| 110 | أَوِالْجُفُوفِ | أَوِ الْجُفُوفِ | missing space |
| 112 | الْوَافِيَةْ | الْوَاقِيَةْ | M, C, and Mayyara's commentary «سنتها السورة بعد الواقية» |
| 113 | بِمَحَلٍّلَهُمَا | بِمَحَلٍّ لَهُمَا | missing space |
| 114 | وَالثَّانِي مَا | وَالثَّانِي لَا مَا | M «والثّانِي لا ما»: the second sitting is sunna except the part with the salam (fard); without «لا» the hemistich is short |
| 116 | وَالْبَاقِي | وَالْبَاقِ | M; meter |
| 124 | تأْمِينُ | تَأْمِينُ | missing fatha |
| 128 | حِينَتَلاَهْ | حِينَ تَلاَهْ | missing space |
| 129 | فَخْدٍ | فَخْذٍ | dhal (C) |
| 130 | الرُّكُوعِوَزِدِ | الرُّكُوعِ وَزِدِ | missing space |
| 132 | الإِحْرَامِخُذَا | الإِحْرَامِ خُذَا | missing space |
| 134 | كََالسُّورَةِ | كَالسُّورَةِ | doubled fatha |
| 138 | كََذَا | كَذَا | doubled fatha |
| 140 | وَخَمْسُ | فَصْلٌ وَخَمْسُ | «فصل» belongs to the verse (M; meter) |
| 141 | سِرٍّتَبِعَا | سِرٍّ تَبِعَا | missing space |
| 142 | عِيدٌاسْتِسْقَا | عِيدٌ اسْتِسْقَا | missing space |
| 144 | نُدِبَنَفْلٌ | نُدِبَ نَفْلٌ | missing space |
| 146 | ِلنَقْصِ | فَصْلٌ لِنَقْصِ | kasra typed before the lam; «فصل» belongs to the verse (M; meter) |
| 147 | إِِنْ | إِنْ | doubled kasra |
| 148 | مِنَْبعْدِ | مِنْ بَعْدِ | misplaced marks / space |
| 151 | وَعَمْدِشُرْبٍ | وَعَمْدِ شُرْبٍ | missing space |
| 155 | كَفِعْلِمَنْ | كَفِعْلِ مَنْ | missing space |
| 157 | لأِنْ | لِأَنْ | marks swapped (M, C «لأن») |
| 159 | بِمَوْطِنِ | فَصْلٌ بِمَوْطِنِ | «فصل» belongs to the verse (M, C; meter) |
| 160 | بِكَ فْرَسَخٍ | بِكَفَرْسَخٍ | misplaced space (M, C) |
| 162 | وَسُنَّغُسْلٌ | وَسُنَّ غُسْلٌ | missing space |
| 163 | جَمَاعَةُ | جَمَاعَةٌ | subject (مبتدأ); meter (جَمَاعَتُنْ = u-u-); C also has a tanween |
| 174 | لاَ فْي | لاَ فِي | sukun for kasra |
| 175 | سَلَّمُ | سَلَّمَ | past verb (M, C) |
| 187 | الْعُشْرِ | الْعُشُرِ | meter only: «وَرُبُعُ الْعُشُرِ فِيهِمَا» = uuu- uuu-; عُشُر is a known form (see report) |
| 209 | زَكَاةُ الْفِطْرِصَاعٌ | فَصْلٌ زَكَاةُ الْفِطْرِ صَاعٌ | «فصل» belongs to the verse (M; meter); missing space |
| 210 | مُسْلِم ٍ | مُسْلِمٍ | stray space |
| 213 | الشَّهْرُبِرُؤْيَةِ | الشَّهْرُ بِرُؤْيَةِ | missing space |
| 227 | وَكَفِّرْنَ | وَكَفِّرَنْ | M, C; meter (وَكَفِّرَنْ = u-u-) |
| 227 | أَوْعِتْقِ | أَوْ عِتْقِ | missing space |
| 233 | ثَلاَثٍبِمِنَى | ثَلاَثٍ بِمِنَى | missing space |
| 243 | الثَّنِيَةِ | الثَّنِيَّةِ | M; the word is ثَنِيَّة; meter |
| 247 | بِالْيَدِخُذْ | بِالْيَدِ خُذْ | missing space |
| 259 | ثُمَّكُنْ | ثُمَّ كُنْ | missing space |
| 264 | وَأَسْرِعَنْفِي | وَأَسْرِعَنْ فِي | missing space |
| 267 | أَوْقَفَتْهُ | أَوْقَفْتَهُ | addressed to the pilgrim like «وَانْحَرْ … وَاحْلِقْ»; meter (أَوْقَفْتَهُو = --u-) |
| 272 | الإٍحْرَامُصَيْدَ | الإِحْرَامُ صَيْدَ | tanween typed for kasra; missing space |
| 275 | أَوِالرَّأْسِ | أَوِ الرَّأْسِ | missing space |
| 280 | ثُمَّبَاقِي | ثُمَّ بَاقِي | missing space |
| 281 | وَجَازَالاِسْتِظْلاَلُ | وَجَازَ الاِسْتِظْلاَلُ | missing space |
| 286 | وَسِرْلِقَبْرِ | وَسِرْ لِقَبْرِ | missing space |
| 287 | ثُمَّزِدْ | ثُمَّ زِدْ | missing space |
| 290 | وَادْخُلْضُحًى | وَادْخُلْ ضُحًى | missing space |
| 294 | سُبْلَ | سُبْلُ | predicate of «هِيَ» (M, C) |
| 297 | يَحْفَظُبَطْنَهُ | يَحْفَظُ بَطْنَهُ | missing space |
| 305 | بِالْقِسْطَاطِ | بِالْقِسْطَاسِ | M, C, Mayyara: «بالقسطاس… وهو الميزان»; rhymes with الأنفاس |
| 309 | خَوْفٌرَجَا | خَوْفٌ رَجَا | missing space |
| 314 | أَرْبَعَةٌ عَشْرٌ | أَرْبَعَةَ عْشَرَ | compound number is indeclinable; Mayyara: «أربعة عشرة… وتسكين العين من أربعة عشر لغة»; meter -uu- uuu- |

### Global normalizations
These change nothing in pronunciation and were applied everywhere:
- A fatha or shadda typed on the alif was moved to the letter before it: «لاَ» → «لَا», «إِلاَّ» → «إِلَّا», «بِماَ» → «بِمَا». The one exception is the article before an alif with no hamza seat (الاَخِرَانِ، الاَرْكَانِ، وَالاَيْدِي). That fatha belongs to the dropped hamza (it is read with naql), so it stays as in H.
- «للهِ» → «لِلَّهِ», and «الَذِي» → «الَّذِي».
- Doubled marks were removed, including a fatha doubled on a fath tanween («مُمْكِنًَا»).
- The prefixed lam got its kasra: «لأَكْلٍ» → «لِأَكْلٍ», «لأَرْبَعِينَ» → «لِأَرْبَعِينَ».
- The article's lam got a sukun before a hamza: «لِلأُمِّيِّ» → «لِلْأُمِّيِّ».
- «الإمَامِ» → «الإِمَامِ».

## Witness readings not adopted (H kept)
| Verse | H (kept) | Other | Why |
|---|---|---|---|
| 44 | الاِيمَانُ | C «الإسلامُ» | M agrees with H, and the verse is about الإيمان |
| 57 | فَرَائِضُ الْوُضُوءِ سَبْعَةٌ وَهِي | M «فَصْلٌ فَرَائِضُ الْوُضُو سَبْعٌ وَهِي» | C agrees with H, and H's reading also scans (u-u- u-u- u-u-) |
| 60 | الأُذْنَيْنِ | M, C «الأُذُنَيْنِ» | the meter of «مَجْمَعَ الأُذْنَيْنِ» needs the sukun |
| 52, 177 | وَمَعْ / مَعْهُ | M, C «وَمَعَ / مَعَهُ» | the meter needs the sukun |
| 153 | بِفَصْلِ مَسْجِدٍ | M, C «بِفَضْلِ» | Mayyara explains it as «الخروج من المسجد», i.e. فَصْل. The ض looks like a misprint the two copies share → **to confirm** |
| 210 | بِجُلِّ عَيْشِ الْقَوْمِ | M, C «بحل» | it means the staple food of most people (جُلّ) |
| 224 | أَوْ لِرَفْضِ مَا بُنِيْ | M «بفرض», C «لفرض» | Mayyara's own commentary: «أو برفض ما بنى الصوم عليه وهو النية» |
| 250 | بَعْدُ اسْتَلِمِ | M «بعدُ فاستلم» (C lacks the verse) | the extra fāʾ breaks the meter |
| 287 | ثُمَّ زِدْ لِلصِّدِّيقْ | M «ثم سر إلى الصديق» | C agrees with H, and M's reading is a syllable too long |
| 314 | عَدُّ الرُّسُلْ | M «عَدَّ» | both are possible, so H was kept |
| many | tanween in lists (دَلْكٌ، دَفْنٌ، وِتْرٌ، نِصَابٌ، تَحِيَّةٌ…) | M and C often drop it | checked by hand one by one. Where both forms scan, H's grammatical tanween was kept. Where only the form without tanween scans, it was changed (63) |

## مواضع للتأكد
1. **The count:** 317 against the author's 314 (see Count above). Which three verses were added later is not settled here; verse 105 «شَرْطُهَا الاِسْتِقْبَالُ…» is a candidate.
2. **64 «وَأَحَدَ عْشَرَ الْفَضَائِلُ» and 314 «أَرْبَعَةَ عْشَرَ تَصِلْ».** The sukun on the ʿayn comes from the meter and from Mayyara's remark on 314 («وتسكين العين من أربعة عشر لغة»). No witness actually prints the sukun: H has «عَشْرَ» and «أَرْبَعَةٌ عَشْرٌ»; M has «عَشَرَ» and «أَرْبَعَةَ عَشْرَة».
3. **187 «وَرُبُعُ الْعُشُرِ فِيهِمَا وَجَبْ».** H and C have «الْعُشْرِ», which does not scan, and M's wording «شَرْعًا قَدْ وَجَبْ» does not scan either. With «الْعُشُر» (a valid form) the hemistich scans as uuu- uuu-. This change rests on the meter alone.
4. **153 «بِفَصْلِ»:** M and C have «بفضل» (see the table above).
5. **Final yaa read short.** H, M and C all write «بَاقِي» (280), «لِلْبَاقِي» (155), «وَالثَّانِي» (114) and «التَّسَاوِي» (22), but the meter reads them short (bāqi). M itself writes the short form in 28 and 116 («وَالتَّالِ», «وَالْبَاقِ»), so the short form was adopted only in those two verses.
6. **Verses 9 and 153 do not scan cleanly in any witness.** Verse 9 is «لِلضَّرُورِي وَالنَّظَرِي كُلٌّ قُسِمْ» (M has «ولِلضَّرورِيْ»). Both were left as in H.
