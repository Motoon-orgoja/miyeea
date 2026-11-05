# Texts report: معلقة الحارث بن حلزة — `harith.txt` (الخفيف)

How it was done (scripts in `muallaqat-build/`, raw pages in `raw/muallaqat/`):
- `parse.js` parses the three witnesses into verses. `collate.js` matches each witness verse to the base verse by word overlap (independent of order) and diffs the matched verses word by word (LCS) after stripping harakat and tatweel and unifying alef, yaa and taa marbuta. The output is `out/harith.review.txt`.
- `build.js` keeps الزوزني's wording and harakat. It adds a mark to a letter only where a witness has the same word: from T and A if they agree, or from the one that has it. A witness may add a mark to a bare letter or a shadda to a marked one, but it never replaces a vowel. Every fill is logged in `out/harith.log.txt`. `fixes.js` holds the manual corrections, each with its reason.
- `meter.js` scans every verse (الخفيف) using the scanner of `qahtaniyya-build/meter.js`. `harakat.js` lists base vowels that differ from the witnesses (`out/harith.harakat.txt`), and `variants.js` lists the wording differences (`out/harith.variants.tsv`).

## 1. Sources
- **Base (Z) — the riwaya, count and order:** الزوزني, «شرح المعلقات السبع», Dar Ihya' al-Turath al-'Arabi, 1st ed. 1423/2002. Shamela 11253: https://shamela.ws/book/11253/290. Its vocalization is partial and uneven, with many typing errors.
- **Check 1 (T), vocalized:** التبريزي, «شرح القصائد العشر». Shamela 37488: https://shamela.ws/book/37488/248
- **Check 2 (A), vocalized:** ابن الأنباري, «شرح القصائد السبع الطوال الجاهليات». Shamela 124335: https://shamela.ws/book/124335/426
- No fully vocalized digital copy of الزوزني's text was found. The base vocalization was completed from T and A.

## 2. Count and order
- **82 verses**, in الزوزني's order. T and A have 84 each.
- **In T/A only** (not added): «فملكنا بذلك الناس حتى ملك المنذرُ بن ماء السماء» (T/A 37), «أم علينا جرّى إيادٍ كما قيل لطسمٍ أخوكم الأبّاء»; T only: «إنّ عمرًا لنا لديه خِلالٌ». Base verse 64 «مثلُها تُخرج النصيحة» is also in T (the parser missed it there).
- Order: الزوزني's order differs from T/A in the middle of the poem: base 27–28 = T 67–68; base 40–47 = T 58–65; base 65–82 = T 40–57 in another order (map in `out/harith.review.txt`).
- Words split between the hemistichs (تدوير) are split where the base splits them (for example «بِبُرْقَةِ شَمَّا | ءَ»).

## 3. Wording
الزوزني's wording is kept everywhere, including where both T and A read otherwise (it is the riwaya requested). Only clear misprints were changed:
| v. | base | adopted | why |
|---|---|---|---|
| 77a | جَرحى | جَرَّى | typo; T+A, Z v.76 «جَرَّى», Zc «أم علينا جناية قضاعة» |

Wording differences between the final text and T/A (words normalized; «—» means the verse is missing in that witness; an empty cell means the witness agrees):

| v. | T | A |
|---|---|---|
| 3 | فاعنا→فاعلي; ق→ذي | فالمحياه→فمحياه; فاعنا→فاعلي; ق→ذي |
| 5 | يحير→يرد | يحير→يرد |
| 6 | اخيرا→اصيلا |  |
| 7 | بخزازي→بخزار | بخزازي→بخزاز |
| 9 |  | الهم→اله; →م |
| 10 | ا→ام; م→ |  |
| 11 | الق→القن; ناص→اص | وقد دنا→وقددنا |
| 13 | وطراقا→وطرافا; الوت→تلوي | الوت→تلوي |
| 14 |  | كل→ك; →ل |
| 15 | من الحوادث والانبا→عن الاراقم انبا; خطب→وخطب | من الحوادث والانبا→عن الاراقم انبا; خطب→وخطب |
| 16 |  | قيلهم→قولهم |
| 18 | العي→الع; ر→ير; وانا→وان | من→ءمن |
| 19 | عشاء→بليل | عشاء→بليل |
| 22 |  | غراتك→غراءك |
| 23 | حصون→جدود |  |
| 24 | الن→ال; اس→ناس; تغيظ→تعيط | الن→ال; اس→ناس; تغيظ→تعيط |
| 25 |  | تردي→ |
| 26 | لا→ما | توه→تو |
| 27 | الخي→الج; ل وتابي→ن فابت | الخي→الج; ل وتابي→ن فابت |
| 28 | وافضل→واكمل | وافضل→واكمل |
| 29 | فادو→فادوا; تشفي→تمشي | تشفي→تمشي |
| 31 | الاسقام→الصحاح | يجشمه→تجشمه; الاسقام→الصلاح |
| 32 | الاقذاء→اقذاء | الاقذاء→اقذاء |
| 33 |  | حد→ح; ثتموه→دثتموه |
| 36 | علي→الي; قوم→مر | قوم→مر |
| 37 |  | بالبلد→في البلد |
| 38 | الذي يواءل منا→مواءلا من حذار | الذي يواءل منا→مواءلا من حذار |
| 39 | اضرع→اضلع; لا يو→مايو | اضرع→اضلع |
| 40 |  | نحن→ |
| 41 | اصيب→تولي | اصيب→تولي |
| 42 | العلياء→العلاه | العلياء→العلاه |
| 43 | له→لهم | له→لهم |
| 44 | الله→الل; →ه; تشقي→يشقي | الله→الل; →ه; تشقي→يشقي |
| 46 | رفع→يرفع; شخصهم→جمعهم | رفع→يرفع; شخصهم→جمعهم |
| 47 | الناطق→الشانء; لذاك→بذاك | الناطق→الشانء |
| 49 | ءت معد→ءوا جميعا | ءت معد→ءوا جميعا |
| 51 | لا→ما | لا تن→ماتن |
| 52 | فرددناهم بطعن→فجبهناهم بضرب | فرددناهم بطعن→فجبهناهم بضرب |
| 53 | حزم→حزن |  |
| 54 | وجبهناهم→فرددناهم; في→عن | وجبهناهم→فرددناهم; في→عن |
| 55 | الله→الل; →ه | الله→الل; →ه |
| 57 | شمرت→شنعت | شمرت→شنعت |
| 58 | بعدما→بعد ما | بعدما→بعد ما |
| 60 | وا شلالا واذ تلظي→ت باقفاءها وحر | ول→و; وا شلالا واذ تلظي→لت باقفاءها وحر |
| 61 | لا تكال→لاتكال |  |
| 62 | واتيناهم→وفديناهم | واتيناهم→وفديناهم; كرام→ندامي |
| 63 | لما→لم |  |
| 65 | والتعاشي→والتعدي | الطيخ والتعاشي→البغي والتعدي |
| 66 |  | وما قد→وماق; م→دم |
| 67 | وهل→ولن | الجور→الخون |
| 68 | اختلفنا→احتلفنا |  |
| 71 | اياد→العباد | اياد→العباد |
| 73 | فانا→فمن يغ; منكم ان غدرتم→در فان من حربهم | فانا→فمن يغ; منكم ان غدرتم→در فانا من حربهم |
| 75 | منها→منه | وابوا→فابوا; منها→فيه |
| 76 | ام→او | ام→او |
| 77 |  | فيما→مما |
| 78 |  | ثم جاءوا→واتوهم |
| 79 | يحلوا→يخلوا | يحلوا→يخلوا |
| 80 |  | الظه→ال; ر→ظهر |
| 81 |  | الغلا→الغ; ق→لاق |

## 4. Vocalization
- **Coverage:** 99.5% (2357/2370 letters that need a mark). A letter is counted as needing a mark unless it is a long-vowel letter, the article lam before a sun letter, and the like. The remaining bare letters are listed at the end of `out/harith.log.txt`. Most are a missing kasra before a madd yaa, a sukun on a diphthong, or a case ending the witnesses also lack.
- **From the witnesses:** 242 marks (log: «fills»). T and A disagreed on 0 letters. Those were left bare or decided below.
- **Conventions (log):** fatha on a letter before a madd alif (10); sukun on the article lam before a moon letter (48); the vowel of و/ف/ك/ب before the article, kasra under إ, and the fixed particles لَا أَوْ قَدْ لَمْ إِلَى (9). Also: «لاَ» → «لَا», tanwin written before the alif («خَيْرًا»), and the mark typed on the alif moved to the hamza («الْمَاُء» → «الْمَاءُ»).
- **Meter:** after the corrections, every verse scans.

Manual corrections of harakat and misprints (T = التبريزي, A = ابن الأنباري, Zc = الزوزني's commentary; «meter» = the base reading does not scan):

| v. | base | corrected | reason |
|---|---|---|---|
| 2b | دِيَارَهَا | دِيَارِهَا | T+A; Zc «التي هي أقرب ديارها» (أَدْنَى = nearest, so the next word is genitive) |
| 3a | فَأَعنَا | فَأَعْنَا | lang (أَفْعَال) |
| 3b | ق فِتَاقٍ | قُ فِتَاقٍ | lang: «فأعناقُ» is coordinated with الْمُحَيَّاةُ and الصِّفَاحُ |
| 6a | وَبَعَيْنَيْكَ | وَبِعَيْنَيْكَ | typo; T (preposition) |
| 11a | القُ | الْقُ | lang: article lam |
| 12b | إِهبَاءُ | إِهْبَاءُ | lang (إِفْعَال); Z+A إهباء (T أَهْبَاء) |
| 15a | والْأَنْبَا | وَالْأَنْبَا | lang: conjunction |
| 17a | الْبَرِيَءَ | الْبَرِيءَ | typo; A |
| 18b | وأَنّا | وَأَنَّا | lang: conjunction; A |
| 21b | عَمْرٍوٍ | عَمْرٍو | typo (double tanwin) |
| 26b | مُؤَيِدٌ | مُؤْيِدٌ | T+A; meter |
| 27a | جَالَتْ | جَالَتِ | T+A (kasra before the article) |
| 27b | لِخَصْمِهِا | لِخَصْمِهَا | typo; T+A |
| 29b | إِلَيَنَا | إِلَيْنَا | typo; A |
| 40a | إِذَ | إِذْ | typo; T+A |
| 44a | الله | اللَّهِ | lang: لفظ الجلالة, genitive after أَمْرُ |
| 45b | أًمْنِيَّةٌ أَشْرَاءٌ | أُمْنِيَّةٌ أَشْرَاءُ | typo; T+A (أشراءُ diptote, rhyme) |
| 47b | عَمْرٍوٍ | عَمْرٍو | typo (double tanwin) |
| 51b | إِلَا | إِلَّا | T+A; meter |
| 53b | الْأَنْسَاءِ | الْأَنْسَاءُ | T+A (subject of دُمِّيَ; rhyme in ـاءُ) |
| 54a | وَجَبَهْنَاهُمْ | وَجَبَهْنَاهُمُ | meter (T+A «فرددناهُمُ» in this place) |
| 54b | جُمَّةِ | جَمَّةِ | T+A; Zc «الجمة: الماء الكثير المجتمع» = الجَمّة |
| 55a | اللهُ | اللَّهُ | lang: لفظ الجلالة |
| 60a | وَلّ | وَلَّ | lang (وَلَّوْا) |
| 60b | وا شِلَالًا وإِذ | وْا شِلَالًا وَإِذْ | lang (وَلَّوْا), conjunction, إِذْ |
| 61a | وَأَقْدْنَاهُ | وَأَقَدْنَاهُ | typo; T |
| 62a | وَأَتْيْنَاهُمُ | وَأَتَيْنَاهُمُ | typo; meter |
| 64a | للقَوْ | لِلْقَوْ | lang |
| 64b | فَلاةٌ | فَلَاةٌ | lang (fatha before the alif) |
| 65a | وَالتّعَاشِي | وَالتَّعَاشِي | lang (تَفَاعُل), as in the ajuz |
| 69a | تَعْ | تُعْ | T+A (passive); Zc «كما يُذبح» |
| 69b | حُجْرَةِ الرَّبِيِضِ | حَجْرَةِ الرَّبِيضِ | T+A; Zc «الحجرة: الناحية» = الحَجْرة; typo in الربيض |
| 73b | غَدَرْتُمْ | غَدَرْتُمُ | meter (فاعلاتن متفعلن: مِنْكُمُو إِنْ | غَدَرْتُمُو) |
| 76b | مِنَ مُحَارِبٍ | مِنْ مُحَارِبٍ | typo; T |
| 79a | رَزَاحٍ | رِزَاحٍ | T+A (بنو رِزاح) |
| 80b | يَبْرَدُ | يَبْرُدُ | T+A (بَرَدَ يَبْرُدُ) |

## 5. مواضع للتأكد
- 10 «دَوِّيَّةٍ» (base, an adjective of رِئَالٍ) / T+A «دَوِّيَّةٌ» (an adjective of هِقْلَةٌ).
- 18 «مُوَالٍ لَنَا» (base) / T+A «مَوَالٍ».
- 29 «أَيُّمَا خُطَّةٍ» (base) / T+A «أَيَّمَا».
- 75 «يُصِمُّ مِنْهُ الْحُدَاءُ» (base) / T+A «يَصَمُّ».
- 12 «إِهْبَاءُ» (base unvocalized, A) / T «أَهْبَاءُ». 56 «قَطَامِ» (base) / T+A «قَطَامٍ».
- الزوزني's wording is kept where it differs from T/A, for example 15 «من الحوادث والأنباء خطبٌ», 26 «لا ترتوه», 29 «تُشفى بها», 54 «وجبهناهمُ … في جَمّة», 60 «إذ ولّوا شلالًا وإذ تلظّى الصلاء», 62 «وأتيناهمُ», 73 «فإنّا منكمُ إن غدرتمُ برآء».

## 6. Obscene verses
None.
