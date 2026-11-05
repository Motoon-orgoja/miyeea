# Texts report — سلم الوصول إلى علم الأصول في توحيد الله واتباع الرسول (`sullamwusul.txt`)

Poem by حافظ بن أحمد بن علي الحكمي (ت ١٣٧٧هـ), رجز, **290 verses**, 15 `##` headings (the poem's own مقدمة / فصول / خاتمة).

How the comparison was done: every witness was parsed into verses (`parse.js`), the four verse lists were aligned 1:1 (all four have the same 290 verses in the same order), and every verse was compared word by word with an LCS script after stripping harakat, tatweel and punctuation and unifying alef / yaa / taa marbuta / hamza seats (`collate.js` → `out/collate.txt`). The verses quoted inside the sharh were found by script among all 515 verse lines of the book and matched to the matn by similarity (`mq.js` → `out/MQ.json`), then compared mark by mark (`cmp-mq.js`, `merge.js` → `out/merge-flags.txt`). No comparison by eye. Every verse of the result was scanned against الرجز (`rajaz.js`, the scanner from `ibnashir-build`); every verse it flags was then scanned by hand (see below).
Scripts: `tools/texts/sullamwusul-build/` — `get.js` / `fetch-sh.js` (download), `parse.js`, `collate.js`, `mq.js`, `cmp-mq.js`, `merge.js`, `fixes.tsv` (every manual change with its reason), `build.js` (writes `sullamwusul.txt` and `build-log.txt`), `coverage.js`, `show.js` (a verse in all witnesses). Raw downloads: `tools/texts/raw/sullamwusul/`.

## Sources
| Code | Source | Use |
|---|---|---|
| **FM** | المكتبة الشاملة 20854 «معارج القبول بشرح سلم الوصول», تحقيق عمر بن محمود أبو عمر (دار ابن القيم، الدمام، ط١ ١٤١٠هـ), vol. 1 pages 24–42 (printed 27–45): the whole matn printed before the sharh, https://shamela.ws/book/20854/24 — raw `sh20854_24…42.html` | **Base for wording, order, count and headings.** Vocalized, with footnotes by ابن الناظم (أحمد بن حافظ الحكمي): he follows the wording of المعارج ط١ «مراعاةً للشرح» and notes in the margin every reading of the poet's autograph fair copy (النسخة الخطية «المبيضة»). About 30 words are bare or misprinted (وعمله، بحُقّ، إذا، سجائب، العرض، وتما…). |
| **MQ** | the same book, pages 43–1229: the verses as quoted one by one in the poet's own sharh (283 of the 290 verses found), https://shamela.ws/book/20854 — raw `sh20854_*.html` | **Vocalization** (fully vocalized) and the المعارج wording. Typed independently of FM in Shamela, with its own slips (إيهام، الشرك، فيعو، عبّ…). |
| **WS** | ويكي مصدر «سلم الوصول إلى علم الأصول», https://ar.wikisource.org/wiki/سلم_الوصول_إلى_علم_الأصول — raw `wikisource.wiki` | Second, independent text. Partly vocalized, but its marks are careful and **metrical** (it writes الغَنِي، سبعُ أبحُرِ، الحِدْثان، مِرْيةَ، معْ كلِّ، الرُّسْلُ، ذنبِهْ…). Same 290 verses and the same headings. |
| **KO** | جامع الكتب الإسلامية 55403 «سلم الوصول إلى علم الأصول» (الشاملة الذهبية), numbered 1–290, https://ketabonline.com/ar/books/55403 — raw `ko55403.json` | Third text, partly vocalized, many spacing typos (و اجتبانا، كلاالعهدين). Never decides alone. |
| — | ketabonline 2555 is the same Dar Ibn al-Qayyim edition as FM/MQ, so it was not used separately. | |

**No fully vocalized stand-alone matn from a second independent edition was found online.** FM+MQ are one edition (but two separately typed and vocalized texts); WS is the independent check (wording and, where it has them, marks).

## Count and headings
- **290 verses** ✔ in all four witnesses, in the same order. The last verse says «أبياتها يُسْرٌ بعدّ الجُمَّل» = ي١٠ + س٦٠ + ر٢٠٠ = **270**: ابن الناظم (FM footnote) and WS both explain that 270 counts only the «scientific» verses; the 20 verses of the opening and of the closing are outside that count, and in the sharh the poet rephrased it «أبياتها المقصود يسرٌ فاعقل».
- **Verses that are in the autograph but not in المعارج** (FM prints them with a footnote; WS and KO have them too, so they are part of the circulated 290): 119 «فَحَذَرًا ثُمَّ حَذَارِ مِنْهُ…», 153–154 «فَلَيْتَ شِعْرِي مَنْ أَبَاحَ ذَلِكْ…» / «فَيَا شَدِيدَ الطَّوْلِ وَالْإِنْعَامِ…», 236 «أَمَّا مَتَى تُغْلَقُ عَنْ طَالِبِهَا…», 238 «أَرْسَلَهُ اللَّهُ إِلَيْنَا مُرْشِدَا…». Verses 133–134 dropped out of the printed verse text of المعارج ط١ but are explained in the sharh (FM footnote). Verse 162 is in المعارج but not in the autograph. All are kept: the result is exactly the circulated 290. Their vocalization is FM's (MQ does not quote them).
- **Headings:** FM's 14 headings (= WS/KO), plus «## سُلَّمُ الْوُصُولِ إِلَى عِلْمِ الْأُصُولِ» (the title as FM prints it) before v.1, because the 12 opening verses have no heading and the format needs one (WS calls them «افتتاح», not the author's word). Bare words in headings were supplied: «فصل» → «فَصْلٌ» (MQ); «وَبِمَا أَخَذَ اللَّهُ عَلَيْهِ بِهِ» and «يَتَبَرَّكُ بِشَجَرَةٍ أَوْ حَجَرٍ» (MQ's heading, same words); «الْيَوْمَ مِمَّا يَفْعَلُونَهُ … وَمَا» (MQ/KO; FM «اليوم, ما يفعلونه»); «وَأَنَّهُ تَحْتَ الْمَشِيئَةِ» (FM bare/misspelt «المشيءة»; WS/KO wording, the marks admit no other reading).

## Wording: المعارج (MQ) against the autograph (FM footnotes) — owner rule
FM follows المعارج except in the places below, where ابن الناظم printed the autograph reading. WS and KO (the circulated students' texts) follow FM in **every** one of them, so FM was kept unless the meter decided otherwise.

| Verse | Kept | المعارج ط١ (MQ) | Why |
|---|---|---|---|
| 168 | الْإِسْلَامُ مَبْنِيٌّ عَلَى | مَبْنِيًّا | FM/WS/KO; both scan. **Decision point** (owner rule names المعارج). |
| 175 | وَبِالْمَلَائِكِ الْكِرَامِ | وَبِالْمَلَائِكَةِ (also FM's text, autograph in footnote) | المعارج wording breaks the rajaz; the autograph reading is in FM's footnote and in WS. |
| 183 | وَأَنَّ كُلًّا مُقْعَدٌ | وَإِنَّ كُلَّ | ابن الناظم: المعارج is wrong here; FM/WS/KO. |
| 194 | وَشَهِدَ الْأَعْضَاءُ | (= kept) | **MQ kept against FM/WS/KO «وشهدت»**: «وَشَهِدَتِ الْأَعْضَاءُ» breaks the rajaz (WS can keep it only with naql «وشهدتْ لَعضاءُ»). |
| 197 | يَأْخُذُ بِالْيَمِينِ | يُؤْخَذُ | ابن الناظم: misprint in المعارج, corrected in its sharh. |
| 223 | لَا وَلَا صَفَرْ … أَخْبَرَ | وَلَا صَفَرَ … خَبَّرَ | FM/WS/KO; MQ's «لا هامةَ ولا صفرَ» breaks the meter. |
| 225 | وَهْوَ رُسُوخُ الْقَلْبِ | وَهِيَ | FM/WS/KO (refers to الإحسان). |
| 232 | ذَنْبِهْ وَإِلَى الْجِنَانِ يُخْرَجُ | ذَنْبِهِ إِلَى … يَخْرُجُ | the waw is in the autograph and in the sharh (ابن الناظم); with it the meter needs ذَنْبِهْ, as WS writes. |
| 250 | وَأَكْمَلَ اللَّهُ بِهِ | لَهُ | FM/WS/KO. **Decision point.** |
| 268 | لَا فِي نُبُوَّةٍ | وَلَا فِي | ابن الناظم: the waw is an error; it breaks the meter. |
| 278 | لِلَّهِ رَبِّ الْعَرْشِ | الله | ابن الناظم: corrected in the sharh. |

Other wording differences (all decided by the agreement of the other witnesses and the meter; FM/MQ typos not listed one by one, they are in `out/collate.txt` and `out/merge-flags.txt`):

| Verse | Kept | Other | Why |
|---|---|---|---|
| 36 | حَيٌّ وَقَيُّومٌ فَلَا يَنَامُ | لا (MQ) | meter; FM/WS/KO |
| 45 | وَعِلْمُهُ | وعمله (FM) | typo; MQ/WS/KO |
| 50 | سَبْعُ أَبْحُرِ | سَبْعَةُ (FM/MQ) | **meter**: «سبعةُ أبحرِ» breaks the rajaz; WS/KO have سبعُ. |
| 61 | فَيُقْبِلُ | فَيُقْبَلُ (MQ) | FM/WS/KO; see «to check» |
| 65 | وَأَنَّهُ يُرَى | وَإِنَّهُ (MQ) | FM/WS/KO |
| 67 | وَلَا إِبْهَامِ | إِيهَامِ (MQ) | FM/WS/KO (no footnote in FM, so it is المعارج's reading) |
| 75 | بِلَا تَرْدِيدِ | تردد (MQ) | rhyme; FM/WS/KO |
| 91 | الشَّرِيكِ | الشرك (MQ) | meter; FM/WS/KO |
| 94 | الْعِلْمُ وَالْيَقِينُ | وَالْعِلْمُ (MQ) | FM/WS/KO; both scan |
| 116 | وَفِيهِ قَدْ جَاءَ | (no قد, MQ) | meter; FM/WS/KO |
| 117 | إِذْ كُلُّ | إذا (FM) | meter; MQ/WS/KO |
| 135 | وَجَحَدْ | وحجد (FM) | typo |
| 149 | سُوحِهَا | سواحها (FM/KO) | MQ (المعارج)/WS; both scan |
| 179 | وَبِالْمَعَادِ أَيْقِنْ | وبالميعاد (FM); أَيْقَنَ (MQ/KO) | meter; WS; أيقنَ breaks the meter |
| 191 | سَحَائِبُ | سجائب (FM) | typo |
| 215 | رَبِّ الْعَرْشِ | العرض (FM/KO) | typo; MQ/WS |
| 219 | حَبُّ حَمِيلِ السَّيْلِ | عبّ (MQ) | typo |
| 222 | لَا طِيَرَ وَلَا | وَلَا طِيَرَ (MQ/KO) | meter; FM/WS |
| 233 | وَمَنْ يُنَاقَشِ | من (MQ) | meter |
| 270 | وَتَابِعُوهُ | وَتَابِعِيهِ (MQ) | FM/WS/KO |
| 279 | لِلْوَحْيَيْنِ | الوحيين (MQ) | meter |
| 282 | وَتَمَّ | وتما (FM) | typo |

Spelling only, not counted: فيما/في ما, بأنّ ما/بأنّما, the rhyme forms ـَا/ـًا, الشان/الشأن (kept FM's الشَّانِ, the rhyme with الأعوانِ needs the alif).

## Vocalization
- **Base marks:** FM. Where FM and MQ have the same letters, the marks of the two were merged letter by letter (`merge.js`): a mark present in one and missing in the other was added (≈40 missing shaddas / sukuns / tanween in FM, e.g. نَصِّ، الصَّلَاةِ، إِلَّا، الذَّرِّ). Where the two have **different** vowels, FM was kept unless the meter, the grammar or WS decided otherwise; every such change is in `fixes.tsv` / `build-log.txt` (55 lines). The main ones:
  - **meter:** وَهْوَ ↔ وَهُوَ (25, 43, 81, 103, 108), فَهْيَ (86), نُؤْمِنُ (180), نَهَرِ الْحَيَاةِ (218), light ya at the rhyme or inside the verse: الْأَزَلِي / الْعَلِي (30), الْغَنِي (46), النَّبِيْ (114), التِّرْمِذِي (158), الْعَلِي (265); الْحِدْثَانِ (57, WS), مَعْ كُلِّ (246, WS), الرُّسْلُ (206, WS/KO), أَثَرِ / رُوِي / عُمَرِ (159: the pausal أَثَرْ … عُمَرْ does not scan, MQ's kasra does).
  - **grammar / lexicon:** أَشْهَدْ / يُعْبَدْ (5, MQ/KO), بِحَقٍّ (16), خِتَامُ الْأَنْبِيَا (108), كَقَوْلِ السُّفَهَا (131), وَحَلُّهُ بِالْوَحْيِ (162, حَلّ السحر = النُّشرة), يَنْبُتُونَا (218), وَكُلَّ مَا إِلَيْهِ أُنْزِلَا (253, object of بلّغ), قَبُولِ السَّعْيِ (277), وَالسَّتْرَ لِلْعُيُوبِ (285), الْعَوَامِّ (118, MQ).
  - **error in all three edition texts:** 223 «لَا غَوْلَ» (FM/MQ/KO) → «لَا غُولَ»: the poet's own commentary on this verse explains «الْغُولُ / وَالْغُولِ», the hadith is «ولا غُولَ», and WS has غُولَ.
  - **rhyme of the first hemistich** (tanween dropped as in MQ/WS): عَيْنِ (113), أَقْسَامِ (128), هَاشِمِ (237).
- **Bare words in FM vocalized from the witnesses (32):** راض به (1, MQ), الواسع للأصوات (44, MQ), بالله العظيم (135), القبر سراجا (138), نحروا في (149), وخمسة منهم … والشورى تلا (178), the whole of v.206 (MQ), تحت (231), قد انتهيت (282), وادع لي (290), للباري (230) — all from MQ; مِرْيَةَ فَاحْذَرَنَّهْ (116) from WS (the only witness whose marks scan: MQ/KO «مِرْيَةٍ» breaks the rajaz).
- **Completed without a vocalized witness (certain):** أُولُو (178; bare in FM/MQ/WS, KO «أُوُلُو»), لَا (222).
- **Coverage:** every word of the file carries harakat; `coverage.js` finds 0 letters without a mark apart from the silent lam of «لِلنَّاسِ»-type words → **≈100% vocalized**.

## Meter
`rajaz.js` flags 28 of 290 verses; all were scanned by hand. 23 are scanner limits (unwritten long ā in إله / ذلك / الرحمن, أُولُو / أُولِي, لَهُ read as الله, silent alif of واو الجماعة, optional إشباع of هُ). Five need the usual dropping of a hamza (درج / نقل) that the edition does not write — kept as written, see below.

## مواضع للتأكد
1. **Hamza dropped in recitation (meter):** 25 «مِنْ كُلِّ الْأَوَامِرِ أَعْظَمُ» (WS writes «الأوامرَ ٱعْظمُ»), 179 «وَبِالْمَعَادِ أَيْقِنْ» (WS «ايْقِنْ»), 240 «بَعْدَ أَرْبَعِينَ» (read بعدَ رْبعين), 281 «لَيْسَ بِالْأَوْهَامِ» (WS «بالاَوْهام»), 167 «الِاسْلَامِ» (FM writes the naql). The file keeps the edition's spelling; the reciter drops the hamza.
2. **168 مَبْنِيٌّ / مَبْنِيًّا and 250 بِهِ / لَهُ:** kept the autograph + circulated reading; المعارج ط١ has the other. Owner's call if المعارج must win even here.
3. **50 «سَبْعُ أَبْحُرِ»** and **194 «وَشَهِدَ الْأَعْضَاءُ»**, **175 «وَبِالْمَلَائِكِ»**: chosen by the meter against part of the witnesses.
4. **61 فَيُقْبِلُ** (FM/WS) vs فَيُقْبَلُ (MQ); **84 دِقُّهُ وَجِلُّهُ** (FM/MQ, nominative) vs دِقَّهُ وَجِلَّهُ (WS/KO); **116 «بِلَا مِرْيَةَ»** (the only scanning form, WS); **290 «الْجُمَلِ»** (FM/MQ; WS «الجُمَّل», the usual form of the term). Kept as stated.
