# Texts report: منظومة «السير إلى الله والدار الآخرة» (عبد الرحمن بن ناصر السعدي، ت ١٣٧٦هـ) — `sayrsaadi.txt`

Scripts: `batch5-build/` (`parse.js` + `parse-sayrsaadi.js`, `collate.js` → `out/sayrsaadi.collation.txt`, `build.js` + `cfg/sayrsaadi.js` → `sayrsaadi.txt`, log `out/sayrsaadi.build-log.txt`). Raw downloads: `raw/sayrsaadi/`.

## 1. Sources
- **Base (A):** «موارد الظمآن لدروس الزمان», عبد العزيز السلمان (the author's student: «لشيخنا عبد الرحمن الناصر السعدي»), Shamela book 7480, pp. 3272–3274: https://shamela.ws/book/7480/3272 — 17 verses, **vocalized (96.9% of letters)**, with a few typing slips in the marks.
- **Check 1 (B):** «مجموعة القصائد الزهديات», the same compiler, Shamela book 38155, pp. 223–225: https://shamela.ws/book/38155/223 — 17 verses, vocalized (87.5%), a separate typing (its own slips).
- **Check 2 (S), independent:** «منظومة في السير إلى الله والدار الآخرة — شرح وتعليق فؤاد أبو سعيد», saaid.org: https://saaid.org/book/20/13912.pdf (text layer extracted with pdftotext) — 18 numbered verses, vocalized, but the PDF text layer displaces the marks, so it is used for the wording and read by eye for the marks.
- Not found online as text: the author's own short sharh of the poem (in his collected works).

## 2. Count
**17 verses** (A = B). S numbers 18: it has one more verse between 14 and 15, which it prints in two corrupt forms, neither scanning («ألا بالله دعوت الخلائق والمشاهد كلها» / «رعوا الخلائق والمشاهد كلها» | «خوفًا على الإيمان من نقصان»). It is not in the two prints of the author's student, and no sound copy of it was found, so it is **not included** (see §5).

## 3. Wording (base A)
| v. | Adopted | A | Why |
|---|---|---|---|
| 17b | **تُفْضِي** إِلَى الْخَيْرَاتِ | تقضي | B + S |
Kept as in A + B against S: 2a «قَدْ أَخْلَصُوا» and 5a «قَدْ أَكْثَرُوا» (S drops «قد»; with «قد» the foot is sound by carrying the vowel of the hamza to the dal — «قَدَ اخْلَصُوا» — and without it the foot is موقوص), 9a «فَهُمُ بِهَا» (S «فهمْ»). Spelling: «الرَّحْمَنِ» written without the alef throughout (A writes «الرحمان» in 11 and 15), «فَهُمُ» for A's «فَهُمُوا».

## 4. Harakat
All marks are those of A except the corrections below (each logged with its reason in the build log):
- slips of A corrected from B and/or S: 2a مَشْيِهِمْ (A مَشِيهِمْ), 3a بَنَوْا (A بَنُوا), 3b لِلدَّيَّانِ (A لِلدِّيَانِ), 7a فِعْلُ (A فَعْلُ), 8a **صَبَرُوا** (A + S صَبَّرُوا, which breaks the meter; B صَبَرُوا), 9b جُنَّةٍ (A two kasras), 11a أُمُورِهِمْ (A أَمورهم), 12b فَتَبَوَّءُوا; 2a–5a وَهُمُ / فَهُمُ before «الَّذِينَ» (A وَهُمْ; B + S وَهُمُ);
- 2b **بِشِرْعَةِ** (S; A + B بِشَرْعَةِ);
- completed where A leaves the letter bare: the shadda of «الَّذِينَ / الَّذِي», the fatha before alef (مَلَا، الْخَلَائِقَ، الْإِعْلَانِ، لَا), «إِلَى», 10b بِالْقَلْبِ, 16b لِلَّهِ, the article's sukun.
- **Meter:** all 34 hemistichs scan as kāmil (ḍarb مقطوع). 2a and 5a scan with the hamza carried (above); 7b and 11b «مَعْ».

## 5. To verify / decide
- **The extra verse of S** (between «صحبوا الخلائق بالجسوم» and «عزفوا القلوب»): present only in the saaid.org lesson and corrupt there. If the printed collected works of السعدي have it, it should be added from the print (the poem would be 18 verses).
- 2a / 5a: kept with «قد» as the author's student prints them; the alternative is S's «فهمُ الذين أخلصوا / وهمُ الذين أكثروا».
- 9b «جُنَّةٍ» (all three sources mark the damma; «جَنَّةٍ» is the other possible reading).
