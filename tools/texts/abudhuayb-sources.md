# Texts report: عينية أبي ذؤيب الهذلي «أمن المنون وريبها تتوجع» — `abudhuayb.txt`

Scripts: `poems7-build/` (see `farazdaq-sources.md`); `parse-abudhuayb.js`, and `build-merge.js` (the text keeps the wording and order of the base; its harakat are assembled letter by letter from the base, then from the witnesses, then from the logged list `MFIX` of `cfg.js`). Raw files: `raw/abudhuayb/`. Collation: `poems7-build/out/abudhuayb.collation.txt`; build log: `out/abudhuayb.build-log.txt`.

## 1. Sources
- **Base (F), printed, partly vocalized (65 verses):** «المفضليات»، ت أحمد شاكر وعبد السلام هارون, the last poem (shamela 6904, pp. 395–403): https://shamela.ws/book/6904/395
- **A, vocalized in the convention of الموسوعة الشعرية (69 verses), the diwan recension:** https://www.aldiwan.net/poem24106.html
- **D, printed, vocalized (66 verses found):** «ديوان الهذليين»، ط دار الكتب (shamela 17904, pp. 9–29): https://shamela.ws/book/17904/9
- **J, printed, vocalized (61 verses found), another recension:** «جمهرة أشعار العرب» (shamela 1487, pp. 479–496).
- **No fully vocalized copy of the Mufaddaliyyat recension exists online.** The digital copy of F marks 76.9% of the letters and has typing errors; the rest was completed as described in §4.

## 2. Count
**65 verses**, the count and order of المفضليات. The diwan (A, D) has four more verses that the Mufaddaliyyat does not transmit here: «لا بدّ من تلفٍ مقيمٍ», «ولقد أرى أنّ البكاء سفاهةٌ», «وليأتينّ عليك يومٌ» (المفضليات gives the first and third to متمّم بن نويرة, as the editor of D notes) and «والدهر لا يبقى … في رأس شاهقةٍ أعزُّ ممنَّعُ». The diwan also puts «كم من جميع الشمل» before «فلئن بهم فجع الزمان».

## 3. Wording
The readings of F are kept, including those peculiar to المفضليات:

| v. | F (adopted) | Diwan (A, D) |
|---|---|---|
| 4a | **أَمَّا** لِجِسْمِيَ أَنَّهُ (= J) | أنْ ما لجسميَ |
| 13b | **وَإِذَا** تُرَدُّ (= J) | فإذا |
| 14a | **وَلَئِنْ** بهم | فلئن |
| 15 | ملتئمِ **القُوَى / كانوا** بعيشٍ **قَبْلَنَا** | الهوى / باتوا بعيشٍ ناعمٍ |
| 20a | بِرَوْضِهِ (= J) | بروضةٍ |
| 24a | بين **نُبَايِعٍ** | يُنابعٍ |
| 31a | **وَنَفَرْنَ** | فنفرن |
| 36b | بني **تَزِيدَ** | يزيد |
| 38b | فإذا **رَأَى** الصبحَ | يرى |
| 44b | من **النَّضْخِ** المجدَّح | النضح |
| 47b | **يَتَضَوَّعُ** | يتضرّع |
| 48b | بيضٌ **رِهَابٌ** | رهافٌ |
| 54a | **فَشُرِّجَ لَحْمُهَا** | فشَرَّجَ لحمَها |
| 56a | **اسْتُغْضِبَتْ** | استُكرهت |
| 61b | **دَاوُودُ** | داودُ |

Corrected in F (typing errors of the digital copy, each against A + D): 44b المجذح → **المجدَّح** · 57b «أتيحله له» → **أُتِيحَ لَهُ** · 58b رَجْعُةْ → **رَجْعُهُ** · 65b ينقع → **يَنْفَعُ**. Verse 27 is split as J splits it («رَابِئِ الضُّ | رَبَاءِ»): F prints the whole word in the first hemistich.

## 4. Harakat
- **Coverage: F 76.9% → 100%.** Marks printed by F: 1565. **Supplied: 528** — 503 from A (the same word in the same verse, after completing A's own convention), 4 from J, and **21 by hand in 13 words** that only F has or that F leaves bare: 13b وَإِذَا · 14a وَلَئِنْ · 15a مُلْتَئِمِ (adjective of the majrur «جميعِ»; A's «ملتئمُ» not followed) · 15b قَبْلَنَا · 24a نُبَايِعٍ · 27a رَابِئِ · 31a وَنَفَرْنَ · 38b رَأَى · 44b النَّضْخِ · 47b يَتَضَوَّعُ · 48b رِهَابٌ · 55a قَانِئٍ · 57b جَرِيءٌ.
- **Corrected marks of F (20)**, all listed with their reason in the build log: 6b وَلُكُلِّ → وَلِكُلِّ · 8a أُدَافِعُ → أُدَافِعَ · 11b كُلًّ → كُلَّ · 14b لَمُفْجَّعُ → لَمُفَجَّعُ · 17b لِآِلِ → لِآلِ · 30a مُتَلَبَّبٍ → مُتَلَبِّبٍ · 30b وَأَقْطَعُ → **وَأَقْطُعُ** (A + D and the lexica: plural of قِطْع) · 31b جُرْشَعُ → جُرْشُعُ · 35a فَأَبَدَّهُنْ → فَأَبَدَّهُنَّ · 35b مُتَجَعْجَعُ → مُتَجَعْجِعُ · 36b بُرُودُ → **بُرُودَ** (second object of كُسِيَتْ) · 38b الصٌّبْحَ → الصُّبْحَ · 39a وَيُعُوذُ → وَيَعُوذُ · 41a يَشَرِّقُ → يُشَرِّقُ · 43a وَيَذُبُّهُنَ → وَيَذُبُّهُنَّ · 56a تَأَبَى → تَأْبَى · 58a يَعْدوُ → يَعْدُو · 60a كُلُّ → كُلٌّ · 64a نْفْسَيْهِمَا بِنَوَافِذِ → نَفْسَيْهِمَا بِنَوَافِذٍ.
- Marks of A not followed where F is bare: 50b **الْخَبْتِ** (D + J; A «الخُبت»), 41b أُولَى (A «أَولى»).
- **Meter (الكامل):** 130 of 130 hemistichs pass the scanner (v. 27 as one line, the word being split).

## 5. To verify
- 65b **لَوَ انَّ** شيئًا: F prints «لَوَ أن» with a fatha on the و, i.e. the hamza is dropped and its vowel carried to the و, which the meter requires (with «لَوْ أَنَّ» the foot is broken). It is written here without the hamza; A + D print «لو أنّ» unmarked.
- 58a **نَهْشُ** المُشاش (F); A + D «نَهِشُ». Both scan. F kept.
- 20b **فَيُجِدُّ** (F); A + D + J «فيَجِدُّ». Both scan. F kept.
- 45a لَمَّا **يُقْتِرَا** (F + J); A + D «يُقْتَرَا». F kept.
- 8a **حَرَصْتُ** (F + J); A + D «حَرِصْتُ» (both are forms of the verb).
- 54a فَشُرِّجَ لَحْمُهَا (F, passive); the diwan has the active «فشَرَّجَ لحمَها».
- 21b مَلَاوَةٍ (F, J); A + D «مِلاوة» (the word has the three vowels). 25a رِبَابَةٌ (F + D); A + J «رَبابة».
- 31a وَنَفَرْنَ and 38b رَأَى are attested only by the digital copy of F against A + D + J («فنفرن», «يرى»); they should be checked against the printed المفضليات.
