# Texts report — تحفة الطلاب (`tuhfatullab.txt`)

أبو بكر بن محمد بن عمر الملا الأحسائي الحنفي wrote this رجز poem on Hanafi fiqh. It abridges «المنظومة الهاملية», السراج علي بن موسى الهاملي's versification of «بداية المبتدي» by المرغيناني. The poet says this himself in introduction verses 10–14.

Verse numbers in this report are the line numbers in `tuhfatullab.txt`, counting from 1 to 1952 with the introduction included. Numbers written as «g» are line numbers in the decoded commentary text, before the 6 added verses were inserted.

## Sources
1. **Base text (words and harakat):** «فتح الوهاب شرح تحفة الطلاب في المذهب الحنفي» by حسين بن محمد سعيد المكي (ت 1366هـ), edited by د. عبد الرحمن نمنكاني and published by الخزانة العبدلية. I used the PDF on usul.ai:
   https://usul.ai/ar/t/fath-al-wahhab-sharh-tufat-al-tullab-fi-al-madhhab-al-hanafi (868 pages, saved as `raw/tuhfatullab/fathwahhab.pdf`).
   The commentary prints every verse in red. The verses are numbered 1–1930, and the 16 introduction verses before them are unnumbered.
2. **Check source (a separate edition):** «متن تحفة الطلاب: منظومة شعرية في الفقه», edited by يحيى بن محمد بن أبي بكر الملا and published by مكتبة التعاون الثقافي بالأحساء, 1st edition, 2003. I used the image scan on the Internet Archive:
   https://archive.org/details/20200620_20200620_2118 (267 pages, fully vocalized, saved as `raw/tuhfatullab/matn_scan.pdf`). http://al-hanafi1.blogspot.com/2017/02/blog-post_82.html lists the same book but gives only a download link.
3. **Sources I tried that could not be used:**
   - The Internet Archive's OCR of source 2. Tesseract turns the vocalized verses into noise.
   - Digital copies of the poem: I found none on Shamela, ketabonline, Wikisource or the forums. usul.ai has only the PDF above.
   - The Telegram channel @manthomathanafia, which has no public web preview.

## How the text was obtained
- **Source 1 has no usable text layer.** Its fonts are Type3 fonts whose glyphs are named after the codes of an old 8-bit Arabic font, so pdftotext gives Latin gibberish. pdf.js also drops some glyphs whose code looks like whitespace.
- **The extraction scripts in `tuhfatullab-build/`** (they need pdfjs-dist 4.10.38 and @napi-rs/canvas):
  - `extract3.mjs` reads every glyph from the PDF operator list, with its position, width and font.
  - `clus.js` and `assign.js` group the 407 Type3 fonts back into their original fonts by glyph width.
  - I decoded the three fonts of the red verse text glyph by glyph from rendered contact sheets (`sheet.mjs`; the sheets are `raw/tuhfatullab/sheet_*.png`). The result is in `maps.js`: letters in their positional forms, harakat and tatweel. One glyph is the double vowel: ً when it sits above the letter, ٍ when it sits below.
  - `lines.js` rebuilds the lines. Word gaps come from the glyph positions, and the widest gap in a line is taken as the hemistich bar.
  - `verses.js` keeps the numbered verse lines. The numbering runs 1–1930 with no gap.
  - `assemble.js` adds the introduction and removes the editorial marks.
  - `final.js` applies `corrections.json` and adds the headings.
- I checked the decoding by eye against rendered pages, on samples from the whole book. I found no letter errors in the samples.
- **Five verses had a word pushed down a line.** In verses 110, 397, 637, 1619 and 1835 (commentary numbering), the typesetter put the last word of the first hemistich on the next line. I moved it back after checking the page images, and the scan agrees.
- **Removed:**
  - verse numbers
  - « » quotation marks, parentheses and footnote marks
  - the editor's colons, commas and semicolons
  - Two quoted words were joined back to their particle: «ك: »الأشربه«» became «كالأشربهْ», and «كَ: قِنْ» became «كَقِنْ».

## Collation with source 2 (word by word)
I compared every verse with the scan page by page (scan pp. 23–253), ignoring harakat. Six reading passes split the poem between them, and each wrote a JSON record of differences, missing or extra verses, and headings (`tuhfatullab-build/collation/scan_A…F.json`). I checked the six missing verses and the doubtful readings again on the page images myself.
- **Order:** the same in both editions. The one exception is that the scan puts g1508 before g1507; I kept the commentary's order.
- **Six verses missing from source 1.** I added them from the scan with the scan's harakat, after checking each one on the page images:
  - after g28 (scan p. 27): «وَالْقَيْءُ مِلْءُ الْفَمِ ذَا فِي الْمَطْعَمِ | وَالْمَاءِ وَالْمِرَّةِ لَا فِي الْبَلْغَمِ»
  - after g174 (scan p. 44): «يَفْتَرِشُ الرِّجْلَ الْيَسَارَ الرَّجُلُ | فِي كُلِّ قَعْدَةٍ فَهَذَا أَفْضَلُ»
  - after g174 (scan p. 44): «وَيَنْصِبُ الْيُمْنَى مَعَ اسْتِقْبَالِهِ | بِالْأَنْمُلَاتِ فَهْوَ مِنْ كَمَالِهِ»
  - after g174 (scan p. 44): «وَتَجْلِسُ الْمَرْأَةُ بِالتَّوَرُّكِ | عَلَى جَمِيعِ أَلْيَتَيْهَا تَتَّكِي»
  - after g958 (scan p. 135): «مَنِ اشْتَرَى زَوْجَتَهُ وَكَانَ قَدْ | أَوْلَدَهَا فَهْيَ لَهُ أُمُّ وَلَدْ»
  - after g1488 (scan p. 210): «وَبَدَلُ الصُّلْحِ عَلَى الْمُوَكِّلِ | لَيْسَ عَلَى الْوَكِيلِ مَا لَمْ يَكْفُلِ»
- **Count: 1952 verses** (16 + 1930 + 6).
  - The poet's closing verses say «أبياتها ألفانِ مِزْ خمسينا», that is 2050 verses, finished in 1261هـ. Both editions have about 1950, and neither one explains the difference.
  - The odd word «مِزْ» is printed that way in source 1, and the scan has the same letters.
- **Headings:**
  - The commentary has only 126 headings (كتاب and فصل). The متن edition has 265 (كتاب, باب and فصل), in the order of بداية المبتدي. The file uses the 265 headings of the متن edition.
  - The headings are copied with the scan's harakat. I read them from the page images but did not check them letter by letter.
  - A few headings have odd harakat in print, for example «فَصْلٌ فِي الوقُوفُ بِعَرَفةِ وأَحْوَالُ النِّسَاء». I kept them as printed. I removed the editorial parentheses inside headings.
  - I added «## المقدمة» before verse 1 myself. Neither edition has a heading there; the scan has only the basmala.

### Readings changed from source 1 (30 differences in 31 verses)
These are clear errors of the commentary print, or of my decoding, and each one was confirmed on the scan.
| Verse | Source 1 | Written as (scan) | Note |
|---|---|---|---|
| 35 | ظَفْرِها | ضَفْرِهَا | ض vs ظ (نقض ضفرها) |
| 79 | الخُفِّ | الرِّجْلِ | scan: مِنْ أَصْغَرِ ٱلرِّجْلِ (وَنَاقِضُ ٱلْوُضُو) |
| 163 | والمتقدي | وَالْمُقْتَدِي | letter transposition in ours (تق vs قت) |
| 253 | بالجمعِ | بِالْجَمْعِ فَمَا | word فَمَا missing in ours at end of first hemistich: مَنْ نَالَ بَعْضَ ٱلْفَرْضِ بِٱلْجَمْعِ فَمَا / صَلَاهُ بِٱلْجَمْعِ وَبِٱلْفَضْلِ سَمَ |
| 284 | ساجدِ | سَامِعِ | scan: يَجِبْ عَلَى ٱلتَّالِي وَكُلِّ سَامِعِ |
| 309 | وفرضُها | وَشَرْطُهَا |  |
| 108 | مايُؤكل | مَا يُؤْكَلُ | spacing only (ours joins ما+يؤكل) |
| 147 | لايَفصِلُ | لَا يَفْصِلُ | spacing only |
| 201 | لايؤمُّ | لَا يَؤُمُّ | spacing only |
| 390 | أو لعزلِ | أَوْ عَزْلِ | ours has extra ل |
| 517 | وان يزِدْ | وَإِنْ يَزِدْ | missing hamza in ours |
| 525 | وإذا أتى | وَإِذْ أَتَى |  |
| 528 | مكبِّرًا | مُقَبِّلاً | first word of the verse |
| 533 | ملبّيًا | مُصَلِّياً | first word of second hemistich |
| 575 | لكنْ يلزمُه | لَكِنَّهُ يَلْزَمُهُ |  |
| 588 | أحدِ | إِحْدَى | مُفْسِدُ إِحْدَى النُّسُكَيْنِ أَكْمَلَهْ |
| 595 | وكذ | وَكَذَا |  |
| 603 | فاعلمِ | فَاسْمَعِ |  |
| 610 | سَو | سَوَا | ours missing final alif |
| 673 | إلابدالُ | الإِبْدَالُ | ours has the letters misordered (إلا- instead of الإ-) |
| 757 | ك أو | أَوِ | ours has a stray extra «ك» before أو |
| 813 | إذاما | إِذَا مَا | spacing only (one word vs two) |
| 889 | طلّقها | طُلِّقَتْ | scan: مَنْ طُلِّقَتْ فِي حَيْضَةٍ |
| 932 | للملُوكِ | لِلْمَمْلُوكِ | ours is missing one م |
| 1135 | المالِ | الْحَالِ | first hemistich: ولو لعبد وهو حر الحال |
| 1213 | عينِهِ | عَيْبِهِ | عاد بنقص عيبه الذي اطلع |
| 1380 | في ما | فِيمَا | spacing only |
| 1432 | بمِلكٍ | بِمِثْلٍ |  |
| 1760 | بالَكْثِ | بِالْمُكْثِ | ours is missing the م (typo in ours) |
| 1915 | إن يمُتْ | إِنْ لَمْ يَمُتْ | ours is missing لم (meter/sense need it) |
| 1752 | hemistich bar after «ومارن» | bar after «مفصل» | as in the scan; the meter needs it |
| 127 | decoding of the pushed-down word | والحكمُ في العِشا كما في العصرِ | |

### Differences kept as in source 1 (84)
- The commentary text is the base, and I changed it only where it was clearly wrong.
- Where both readings are possible, I kept the commentary's reading. The same goes for cases where the scan's own footnote names the commentary's wording as another manuscript reading.
- Spelling differences (ا/ى and the seat of the hamza) are kept as in source 1.

| Verse | Source 1 (kept) | Scan | Why kept / note |
|---|---|---|---|
| 86 | تعدّى | تَعَدَّ | تعدّى صحيح والنطق واحد |
| 158 | أُولَييْ | أُوْلَيَىْ | spelling |
| 211 | يُلامُ | تَمَامُ | رواية الشرح؛ للتأكد |
| 219 | مُحتَضِرْ | مُخْتَضِرْ | رواية الشرح «محتضر»؛ المتن «مختضر» وفسّره في حاشيته؛ للتأكد |
| 246 | واقتَدى | وَاقْتَدَا | spelling |
| 257 | كالسِّتِّ | مَعَ السِّتِّ | رواية الشرح؛ للتأكد |
| 309 | القُراءِ | الْقُرَآءِ | spelling |
| 310 | للظهرِ | وَالظُّهْرُ | same meaning |
| 329 | فيها | فِيهِ | same meaning |
| 409 | ومائتان من دراهم وجب | وَمَايَتَا دِرْهَمٍ فِضَّةٍ وَجَبْ | رواية الشرح؛ للتأكد |
| 450 | بكلِّ حالِ | عَلَى الْهِلَالِ | رواية الشرح؛ للتأكد |
| 492 | بأسٍ | بَاسٍ | hamza spelling |
| 500 | وبعدَه الذبحُ فحلقٌ يجري | وَالْحَلْقُ ثُمَّ ذَبْحُهُ لِلْهَدْيِ | رواية الشرح (ترتيب الرمي ثم الذبح ثم الحلق) |
| 514 | يا اللهُ | يَا أَللهُ | hamza spelling |
| 515 | ينوي بها اللهمّ | يَنْوِيهِ أَللَّهُمَّ | رواية الشرح؛ للتأكد |
| 522 | ولُبسِه ذا الورسِ والمزَعْفَرا | وَلُبْسِ ثَوْبِ الْوَرْسِ وَالْمُزَعْفَرِ | رواية الشرح (القافية بالألف في الشطرين)؛ للتأكد |
| 522 | والمعَصْفَرا | وَالْمُعَصْفَرِ | رواية الشرح (القافية بالألف في الشطرين)؛ للتأكد |
| 526 | شاهدَ | عَايَنَ | same meaning |
| 541 | لِيدع | لِيَدْعُو | لِيَدْعُ مجزوم بلام الأمر |
| 609 | ولْيمضِ ولْيقْضِ وبعدَ الأكثرِ | وَلْيَمْضِ وَلْيَقْضِ وُجُوباً وَبَعْدَ الْأَكْثَرِ | «وجوبًا» زيادة تطيل الشطر عن الرجز |
| 626 | فاعلمِ | فَافْهَمِ | same meaning |
| 639 | اللازمِ | الْمُلْزِمِ | رواية الشرح؛ للتأكد |
| 665 | يبتدي | يُبْتَدَىٰ | ى vs ي |
| 665 | باقي | بَاقِ | scan has no final ي |
| 680 | المعنِي | الْمَعْنِى | ى vs ي |
| 690 | زنا | زَنَى | ا vs ى |
| 705 | كفءُ | كُفْؤُ | hamza seat |
| 713 | قبلَه | قَبْلَهُمَا | رواية الشرح؛ للتأكد |
| 729 | كإنفاقٍ | كَاتِّفَاقِ | «كإنفاق» يوافق الهداية (المهر كالنفقة دين في رقبته) |
| 734 | مؤُونةُ | مَؤُنَةُ | scan has a single و |
| 744 | وهْيَ | فَهْيَ | same meaning |
| 768 | غيرِه | غَيْرِهَا | same meaning |
| 775 | طالقٌ | طَلاقُ | طبعة المتن «طلاق» وحاشيتها «أنت طالق» |
| 779 | طالقٌ | طَلاَقٌ | كالذي قبله |
| 787 | الرِّضا | الرِّضَىٰ | ا vs ى |
| 794 | فالحكمُ | فِي الْحُكْمِ | رواية الشرح |
| 801 | خَلاَ | خَلَى | ا vs ى |
| 909 | وحَدَثَا | وَجَدَثَا | حاشية المتن: أكثر النسخ «وحدثا» |
| 922 | عَصَتْ | عَصَـ | حرف ساقط في طبعة المتن |
| 940 | للرّحمانِ | لِلرَّحْمٰنِ | scan has a dagger alif, not a full alif |
| 978 | للعِتقِ | بِالْعِتْقِ | same meaning |
| 1009 | وبيّنوا | وَعَيَّنُوا | same meaning |
| 1029 | بالزِّنا | بِالزِّنَى | ا vs ى |
| 1061 | وتابَ | فَتَابَ | same meaning |
| 1082 | أو ذِمِّيِّ | وَذِمِّيٍّ | same meaning |
| 1131 | لغا | لَغَى | ا vs ى |
| 1144 | مِنْ غيرِ بُرهانٍ | بِغَيْرِ بُرْهَانٍ | same meaning |
| 1183 | لغا | لَغَى | ا vs ى |
| 1185 | لَغَا | لَغَى | ا vs ى |
| 1195 | لَغَا | لَغَى | ا vs ى |
| 1217 | رُدّ ما باعَ بعيبٍ بِقَضا | رُدَّ بِالْعَيْبِ عَلَيْهِ بِالْقَضَا | حاشية المتن تذكر رواية قريبة من رواية الشرح |
| 1217 | بالرِّضا | بِالرِّضَى | حاشية المتن تذكر رواية قريبة من رواية الشرح |
| 1222 | الرِّضا | الرِّضَى | ا vs ى |
| 1246 | الرّاعي | الرَّعْيِ | حاشية المتن: «الراعي» نسخة |
| 1256 | صَحَّ | يَصِحُّ | رواية الشرح؛ للتأكد |
| 1314 | مِن نِصْفِ | عَنْ نِصْفِ | same meaning |
| 1316 | قبلَ مَا | (بَعْدَمَا) | حاشية المتن: «قبل ما» نسخة |
| 1327 | إذ كانَ | (إِنْ) كَانَ | حاشية المتن: «إذ» نسخة |
| 1349 | تَجِدُ | (تُوجَدُ) | حاشية المتن: «تجد» نسخة |
| 1359 | فقالَ | وَقَالَ | same meaning |
| 1364 | يأخُذُ فقطْ بحُجّةٍ ما كانَ لَهْ | يَأْخُذُ بِالْبُرْهَانِ مَا قَدْ كَانَ لَهْ | حاشية المتن: رواية الشرح نسخة |
| 1396 | اشْهَدَا | إِشْهَدَا | hamza spelling |
| 1430 | صَدَّقا | لا يُؤمَرْ | صَدَّقَ لاَ | يُؤْمَرْ | رواية الشرح؛ للتأكد |
| 1474 | يُقبَلُ | يَكُونُ | حاشية المتن: «يقبل» نسخة |
| 1485 | لأجنبِي | لِلأَجْنَبِي | same meaning |
| 1511 | لا إنْ يَبِعْ | لاَ أَنْ يَبِعْ | «إنْ يبعْ» بالجزم صحيح |
| 1519 | وكُلُّ ما | وَكُلَّمَا | «وكلُّ ما» رواية الشرح |
| 1530 | بِقضاءِ القاضِي | بِقَضَاءِ قَاضِي | same meaning |
| 1560 | في الإِهمالِ | فِي الأَعْمَالِ | رواية الشرح؛ للتأكد |
| 1596 | مِنْ أعْجَمِ | مِنْ أَعْجَمِي | القافية (أعجمِ / الأعظمِ) |
| 1602 | صَحَّ | صَحَّا | same meaning |
| 1603 | مِن الموْلَى | مِنَ الْمَوَالِي | same meaning |
| 1693 | للذُّكورِ | لِلرِّجَالِ | حاشية المتن: «للذكور» نسخة |
| 1716 | نقيعُ الزَّبيبِ | نَقِيعُ لِلزَّبِيبِ | «نقيع الزبيب» أفصح |
| 1743 | رامي | رَامِ | same pronunciation |
| 1778 | القضاءِ | الْقَضَا | same pronunciation |
| 1779 | المرْضِيِّ | الْمَقْضِيِّ | رواية الشرح؛ للتأكد |
| 1780 | فَادْرِ | فَادْرِي | same pronunciation |
| 1800 | والمجنونِ | أَوِ الْمَجْنُونِ | same meaning |
| 1843 | والصُّوفِ | وَالطُّوفِ | «الطوف» في طبعة المتن خطأ طباعة (الصوف) |
| 1888 | مِنْ ذَوي العَدِّ | مَعْ ذَا أَوِ الْعَدِّ | رواية الشرح؛ للتأكد |
| 1914 | الزِّنا | الزِّنَى | ا vs ى |
| 1918 | أيْ | أَوْ | رواية الشرح؛ للتأكد |
| 1951 | الكريمِ | الرَّحِيمِ | حاشية المتن: «الكريم» نسخة |

## Harakat
- **Commentary verses (1946):** the harakat are exactly those printed in source 1. They were decoded, not guessed.
- **Source 1 is only partly vocalized.** About 36% of letters carry a mark, and 81% of words have at least one. I did not complete the vocalization.
- **From source 2:** the 6 added verses, the words changed in the table above, and the headings carry the scan's harakat, as read on the page images.
- **Possible next step:** source 2 is fully vocalized, so a later pass could copy its harakat over. That needs a careful reading of about 230 pages and was not done.

## مواضع للتأكد (doubtful)
- **Two possible readings:** the rows marked «للتأكد» in the kept table, verses 211، 219، 257، 409، 450، 515، 522، 522، 639، 713، 1256، 1430، 1560، 1779، 1888، 1918.
- **Verse 1947 (closing), «ألفانِ مِزْ خمسينا»:** «مِزْ» is kept as printed; it is probably «مَعْ».
- **Verse 253:** «فَمَا» completes the first hemistich and comes from the scan; the commentary drops it.
- **219:** «محتضر» (commentary) against «مختضر» (scan, glossed in its footnote).
- **Shadda with a vowel:** the order inside the text is as decoded, with shadda first and then the vowel.
- **Errors not covered by the check:**
  - Typos in source 1 that keep the same letters as the scan were not caught by the word check.
  - Harakat errors in source 1 were not checked systematically.

## The poet's death year
- **1270هـ:** al-hanafi1.blogspot.com (on the book page and in its author list), and 3rabica, which gives birth on 2 ربيع الثاني 1198 and death on 29 صفر 1270 in Mecca. The biography in source 2 also says he died in Mecca on the night of 29 صفر, but the digits of the year cannot be read in the OCR.
- **Dates in the editions:** the poem was finished in 1261هـ (closing verses). The colophon of source 2 says that copy was made in 1273هـ.
- **1305هـ:** this date has also been reported. I found no source for it during this work and record it only as a conflicting report. The meta file uses ت ١٢٧٠هـ.

## «شرح البيت»: the parallel passage of مختصر القدوري
- **Table:** `tuhfatullab-qudouri.json`. Each entry is {from, to, units: [Qudouri unit ids], note}, in the final verse numbering, and the entries run without gaps over all 1952 verses.
- **Build:** `tuhfatullab-build/build-sharh.js` turns the table into `data/sharh/tuhfatullab.json`.
  - The header fields are name «يقابله من مختصر القدوري», author «أبي الحسين القدوري» and death «٤٢٨هـ».
  - There is one entry per verse. The verses of a group repeat the same entry.
  - Each entry starts with «# الأبيات … يقابلها:» (or «# البيت … يقابله:»). The Qudouri paragraph(s) follow, quoted word for word with their harakat from `data/qudouri.js`.
  - ref is the paragraph label from `data/qudouri.js`.
  - After a change, run `node tools/texts/tuhfatullab-build/build-sharh.js` and then `node tools/build-matn.js tuhfatullab`.
- **How the matching was done:**
  - The matching was by meaning, in eight passes by fiqh section. Each pass read the verses and searched the whole Qudouri file, with one rule: the paragraph must state the verse's ruling, otherwise there is no match.
  - I then spot-checked a sample of matches from across the book and found them all sound. I matched the 6 added verses myself.
  - The notes from each pass are in `raw/tuhfatullab/qud_1…8.json`, in the old numbering.
- **Coverage: 1630 verses have a Qudouri parallel and 322 have none.**
  - The verses with no parallel are the introduction (verses 1–16), the closing verses, and the many مسائل that Bidaya and Hidaya add. Examples are العاشر والركاز, مجاوزة الميقات, ألفاظ الطلاق والتفويض, الحج عن الغير, and many branches of البيوع, الدعوى, الوصايا and حساب الفرائض.
  - Many matches are partial: the paragraph states only one of the verse's rulings. The note field in the table says what is missing.
  - Where Qudouri gives a different ruling, the verse has no parallel. Examples: المفقود (120 years in Qudouri, 90 in the poem), the share of the العاقلة, seeing the house (رؤية الدار), and whether the agent for litigation may collect.
- **Order:**
  - The poem follows the order of بداية المبتدي, so whole books come in a different order from Qudouri. For example, الرهن is near the end; القضاء, الشهادات and الدعوى come before الإقرار and الإجارة; الحظر والإباحة comes late; and الصيد is separated from الذبائح.
  - Inside chapters the order mostly follows Qudouri. It differs a lot in these places:
    - **Start of كتاب الحج:** the فرائض of hajj and the عمرة. Their parallels are scattered across Qudouri's باب الجنايات, باب الفوات and باب التمتع.
    - **الأيمان:** the poem jumps around q106.
    - **النكاح:** the مهر and نكاح الرقيق verses are mixed with النفقة, and العنين is moved to the end of الطلاق.
    - **الوصايا:** the poem goes back and forth through q116.
    - **الدعوى** and **الإجارة.**
    - **الحائط المائل:** mixes الديات with القسامة.
