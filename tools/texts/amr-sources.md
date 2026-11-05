# Texts report: معلقة عمرو بن كلثوم — `amr.txt` (الوافر)

How it was done (scripts in `muallaqat-build/`, raw pages in `raw/muallaqat/`):
- `parse.js` parses the three witnesses into verses. `collate.js` matches each witness verse to the base verse by word overlap (independent of order) and diffs the matched verses word by word (LCS) after stripping harakat and tatweel and unifying alef, yaa and taa marbuta. The output is `out/amr.review.txt`.
- `build.js` keeps الزوزني's wording and harakat. It adds a mark to a letter only where a witness has the same word: from T and A if they agree, or from the one that has it. A witness may add a mark to a bare letter or a shadda to a marked one, but it never replaces a vowel. Every fill is logged in `out/amr.log.txt`. `fixes.js` holds the manual corrections, each with its reason.
- `meter.js` scans every verse (الوافر) using the scanner of `qahtaniyya-build/meter.js`. `harakat.js` lists base vowels that differ from the witnesses (`out/amr.harakat.txt`), and `variants.js` lists the wording differences (`out/amr.variants.tsv`).

## 1. Sources
- **Base (Z) — the riwaya, count and order:** الزوزني, «شرح المعلقات السبع», Dar Ihya' al-Turath al-'Arabi, 1st ed. 1423/2002. Shamela 11253: https://shamela.ws/book/11253/232. Its vocalization is partial and uneven, with many typing errors.
- **Check 1 (T), vocalized:** التبريزي, «شرح القصائد العشر». Shamela 37488: https://shamela.ws/book/37488/214
- **Check 2 (A), vocalized:** ابن الأنباري, «شرح القصائد السبع الطوال الجاهليات». Shamela 124335: https://shamela.ws/book/124335/365
- No fully vocalized digital copy of الزوزني's text was found. The base vocalization was completed from T and A.

## 2. Count and order
- **103 verses**, in الزوزني's order (the base numbers them 1–103).
- التبريزي has 96 verses and ابن الأنباري 94 (verses printed in parentheses in the commentary). The recensions differ a lot in this poem.
- **In الزوزني only** (in neither T nor A): 7 «وكأسٍ قد شربت ببعلبك», 17 «ومأكمةً يضيق الباب عنها», 18 «وساريتي بَلَنطٍ أو رخام», 28 «وأنزلنا البيوت بذي طُلوح», 52 «ألا لا يعلم الأقوام أنّا», 82 «وردن دوارعًا وخرجن شعثًا», 87 «ترانا بارزين وكلُّ حيٍّ», 92 «كأنّا والسيوف مسلّلات», 93 «يُدَهْدون الرؤوس», 96–98 «وأنّا المانعون لما أردنا / التاركون إذا سخطنا / العاصمون إذا أُطعنا». A also lacks 5, 6 and 103.
- **In T/A only** (not added): «إذا لم نحمهنّ فلا بقينا», «لنا الدنيا ومن أمسى عليها», «نُسمّى ظالمين وما ظَلمنا» (A «بُغاةً ظالمين»), «بأنّا العاصمون بكلّ كحلٍ», «وأنّا المانعون لما يلينا»; A also «يكون ثِفالُها شرقيَّ سلمى» as a second form of verse 31.
- Order: T/A order differs from Z in verses 11–22, 32–41 and 84–103 (full map in `out/amr.review.txt`).

## 3. Wording
الزوزني's wording is kept everywhere, including where both T and A read otherwise (it is the riwaya requested). Only clear misprints were changed:
| v. | base | adopted | why |
|---|---|---|---|
| 9b | الْيَقينَا | الْيَقِينَ | T+A; «اليقينا» breaks the meter (مفاعلتن) |
| 50b | مُتَلَبِّينَا | مُتَلَبِّبِينَا | typo, the word is «متلبِّبين» (T+A v.49); «متلبِّينا» breaks the meter |

Wording differences between the final text and T/A (words normalized; «—» means the verse is missing in that witness; an empty cell means the witness agrees):

| v. | T | A |
|---|---|---|
| 2 | مشعشعه→مشعشه |  |
| 5 | صبنت→صددت | — |
| 10 |  | صرما→وصلا; لوشك→لو شك |
| 12 | وبعد→بعد |  |
| 14 | هجان اللون لم تقرا جنينا→تربعت الاجارع والمتونا | هجان اللون لم تقرا جنينا→تربعت الاجارع والمتونا |
| 16 | سمقت وطالت→طالت ولانت; ولينا→يلينا | سمقت وطالت→طالت ولانت; ولينا→يلينا |
| 22 | فاعرضت→واعرضت | فاعرضت→واعرضت |
| 27 |  | اعنتها→اعتتها |
| 32 | فاعجلنا→فعجلنا | فاعجلنا→فعجلنا |
| 34 | نعم اناسنا ونعف→ندافع; →الاعداء قدما | نعم اناسنا ونعف→ندافع; →الاعداء قدما |
| 36 | يختلينا→يعتلينا | يختلينا→يعتلينا |
| 37 | كان→تخال; وسوق→وسوقا | كان→تخال; وسوق→وسوقا |
| 38 | ونختلب→ونخليها; فتختلينا→فيختلينا | ونختلب→ونخليها; فتختلينا→فيختلينا |
| 39 | يبدو→يفشو |  |
| 41 | عن→علي | عن→علي; من→ما |
| 42 | نجذ→نحز | نجذ→نحز |
| 43 | منا ومنهم→فينا وفيهم | منا ومنهم→فينا وفيهم |
| 47 | بشبان→بفتيان; وشيب→شيب | بشبان→بفتيان |
| 49 | فتصبح خيلنا عصبا ثبينا→فصبح غاره متلببينا | فتصبح خيلنا عصبا ثبينا→فنصبح غاره متلببينا |
| 50 | فنمعن غاره متلببينا→فنصبح في مجالسنا ثبينا | فنمعن غاره متلببينا→فنصبح في مجالسنا ثبينا |
| 58 | وولته→وولتهم | وولته→وولتهم |
| 59 | تشج→تدق | تشج→تدق |
| 60 | في جشم→فجشم |  |
| 62 |  | منه→منهم; نعم→ |
| 64 | المحجرينا→الملجءيءا | المحجرينا→الملجءينا |
| 66 | تجذ الحبل→نجذ الوصل; تقص→نقص | تجذ→نجذ; تقص→نقص |
| 68 | خزازي→خزاز | خزازي→خزاز |
| 69 |  | الحابسون→الحبسون |
| 71 | الاخذون→لاخذون |  |
| 74 |  | وابنا بالملوك مصفدينا→وابنابالملوك مصفدنيا |
| 76 |  | تعلموا→تعرفوا |
| 78 | النطاق→النجاد | النطاق→النجاد |
| 80 | غضونهن→متونهن | غضونهن→متونهن |
| 84 | حسان→كرام; تقسم→تفارق |  |
| 85 | كتاءب→فوارس | لاقوا→رقوا |
| 86 | افراسا→ابدانا | افراسا→ابدانا |
| 88 | الهويني→الهوينا |  |
| 94 |  | بنينا→ينينا |
| 95 | بانا المطمعون→وانا المنعمون; ابتلينا→اتينا | بانا المطمعون→وانا المانعون; ابتلينا→اتينا |
| 96 | اردنا→يلينا; وانا النازلون بحيث شينا→اذا ما البيض زايلت الجفونا | اردنا→يلينا; وانا النازلون بحيث شينا→اذا ما البيض فارقت الجفونا |
| 98 | وانا→بانا; اذا اطعنا→بكل كحل; العازمون اذا عصينا→الباذلون لمجتدينا | وانا→بانا; اذا اطعنا→بكل كحل; العازمون اذا عصينا→الباذلون لمجتدينا |
| 99 | ونشرب ان وردنا→وانا الشاربون | ونشرب ان وردنا→وانا الشاربون |
| 100 |  | ابلغ→ساءل |
| 101 | الذل→الخسف | نقر الذل→يقر الخسف |
| 102 | وماء→وظهر | ملانا→ملا; وماء→ونحن |

## 4. Vocalization
- **Coverage:** 98.0% (2903/2963 letters that need a mark). A letter is counted as needing a mark unless it is a long-vowel letter, the article lam before a sun letter, and the like. The remaining bare letters are listed at the end of `out/amr.log.txt`. Most are a missing kasra before a madd yaa, a sukun on a diphthong, or a case ending the witnesses also lack.
- **From the witnesses:** 300 marks (log: «fills»). T and A disagreed on 3 letters. Those were left bare or decided below.
- **Conventions (log):** fatha on a letter before a madd alif (28); sukun on the article lam before a moon letter (45); the vowel of و/ف/ك/ب before the article, kasra under إ, and the fixed particles لَا أَوْ قَدْ لَمْ إِلَى (10). Also: «لاَ» → «لَا», tanwin written before the alif («خَيْرًا»), and the mark typed on the alif moved to the hamza («الْمَاُء» → «الْمَاءُ»).
- **Meter:** after the corrections, every verse scans.

Manual corrections of harakat and misprints (T = التبريزي, A = ابن الأنباري, Zc = الزوزني's commentary; «meter» = the base reading does not scan):

| v. | base | corrected | reason |
|---|---|---|---|
| 1a | بصَحْنِكِ | بِصَحْنِكِ | lang: preposition |
| 1a | فَاصبَحِينَا | فَاصْبَحِينَا | T (A فاصَبحينا); meter needs the sukun |
| 15b | أَكُفِ | أَكُفِّ | T+A; meter |
| 20b | تِسعَةٍ | تِسْعَةٍ | T (A تِسِعة) |
| 27b | صُفُوَنَا | صُفُونَا | typo; A |
| 30b | فيِ | فِي | typo |
| 43a | ومِنْهُمْ | وَمِنْهُمْ | lang: conjunction |
| 49b | فَتُصْبِحَ | فَتُصْبِحُ | lang: indicative in the answer of أَمَّا (no particle of nasb) |
| 51a | جُشَمِ | جُشَمَ | T+A (diptote) |
| 54a | مَشِيّئَةٍ | مَشِيئَةٍ | typo; T |
| 55a | مَشِيّئَةٍ | مَشِيئَةٍ | typo; T |
| 56b | مُقْتَوِينَا | مَقْتَوِينَا | T+A (المَقْتَوُون: servants) |
| 60a | جُشَمِ | جُشَمَ | lang (diptote), as T+A in 51 and 90 |
| 62b | ذُخْرِ | ذُخْرُ | T+A (subject of نِعْمَ) |
| 65b | فَأَيَُّ | فَأَيُّ | typo; T |
| 66a | قَرِينَتِنَا | قَرِينَتَنَا | T+A (object of نَعْقِدْ) |
| 69a | أَرَاطَى | أُرَاطَى | T+A (ذو أُراطى, place name) |
| 69b | الْجِلَّةُّ | الْجِلَّةُ | T (A adds a stray shadda on the taa) |
| 72b | بَنُوُ | بَنُو | typo |
| 72b | الْأَيْسَرَيْنِ | الْأَيْسَرِينَ | T+A (plural, as الأيمنين in the sadr; Zc «حماة الميسرة») |
| 73a | يَلِيِهِمْ | يَلِيهِمْ | typo |
| 76b | كَتَائِبُ | كَتَائِبَ | T+A (object) |
| 77b | وَأَسْيَافٍ | وَأَسْيَافٌ | T+A (coordinated with البَيْضُ) |
| 86a | وَبِيْضًا | وَبِيضًا | typo (sukun on a madd yaa); A |
| 90a | جُشَمِ بَنِ | جُشَمَ بْنِ | T+A جُشَمَ (diptote); «بَنِ» breaks the meter (wasl: جُشَمَبْنِ) |
| 91a | مِثْلَ | مِثْلُ | T+A (subject of مَنَعَ) |
| 91b | كالْقُلِينَا | كَالْقُلِينَا | lang: prefix ka |
| 92a | وَالسُّيوفُ | وَالسُّيُوفُ | lang: conjunction; سُيُوف |
| 101a | النَّاسُ | النَّاسَ | T+A (object of سَامَ; الْمَلْكُ is the subject) |
| 102a | مَلَأنَا | مَلَأْنَا | lang (فَعَلْنَا); T has fatha+sukun |
| 103a | صَبِيٌ | صَبِيٌّ | T; meter |

## 5. مواضع للتأكد
- 34 «نَعِفُّ عَنْهُمْ»: T+A «عَنْهُمُ». Both scan here. I kept the base.
- 77 «وَأَسْيَافٌ **يَقُمْنَ** وَيَنْحَنِينَا» (stand up and bend): T+A read **يُقَمْنَ** (are straightened). I kept the base.
- 79 «رَأَيْتُ» (base) / T+A «رَأَيْتَ». 83 «مُتْنَا» (base) / T+A «مِتْنَا». Both forms are correct.
- 8 «وَإِنَّا سَوْفَ تُدْرِكُنَا» (base, A) / T «وأَنَّا».
- 99 «وَنَشْرَبُ إِنْ وَرَدْنَا الْمَاءَ صَفْوًا» is الزوزني's wording. T/A have «وأنّا الشاربون الماءَ صفوًا».

## 6. Obscene verses
None. Verses 13–18 are a sensual description of the beloved (arms, breast, waist, hips). The wine verses are 1–8.
