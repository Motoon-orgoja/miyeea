# Texts report — معلقة امرئ القيس (`imru.txt`)

Riwaya and verse order of الزوزني, collated with التبريزي and ابن الأنباري. 81 verses, الطويل, rhyme ـلِ.

## Method
- Every witness was parsed into verses by script (`muallaqat4-build/exZ.js`, `wit.js`). Hemistichs were compared word by word after stripping harakat and tatweel and unifying alef/yaa/taa marbuta (`col.js`, `zdiff.js`).
- Vocalization (`merge.js`): the base keeps every mark it has. A bare letter takes the mark of the witnesses that have the same word (majority; ties: T, then A, M, W1, W2). A witness whose vowels contradict the base inside the same word is not used for that word (another reading); if it differs only in the case ending, its marks are used for the other letters. Shadda is added only when two witnesses have it (or T alone, when no other witness marks that letter).
- Meter: every hemistich is scanned (`meter2.js`, built on `qahtaniyya-build/meter.js`). When a hemistich did not scan, the merger tried the other attested marks for its letters and kept the one that scans (list below). The remaining failures were checked one by one and corrected by hand (`hfixes.json`), each from a witness or as a form that admits nothing else.
- Raw pages: `raw/imru/` (one folder per source; the scripts read them as `pages/<shamela book id>/<page>.html`). Logs: `muallaqat4-build/out/imru-*.txt`.

## Sources
- **Base (Z): المكتبة الشاملة 11253**, الزوزني «شرح المعلقات السبع», دار إحياء التراث العربي ١٤٢٣هـ (the circulated school text, printed page numbers). The verses are numbered and partly vocalized (about half the letters). Pages 46–90: https://shamela.ws/book/11253/46
- **T: المكتبة الشاملة 37488**, التبريزي «شرح القصائد العشر», المنيرية ١٣٥٢هـ. Verses in parentheses, almost fully vocalized (with typing slips: marks on the wrong letter, «فيِ», «عَلَىَّ»). Independent of Z. Pages 1–53: https://shamela.ws/book/37488/1
- **A: المكتبة الشاملة 124335**, ابن الأنباري «شرح القصائد السبع الطوال الجاهليات», تحقيق عبد السلام هارون (دار المعارف). Verses in parentheses, partly vocalized. Independent of Z. Pages 14–111: https://shamela.ws/book/124335/14
- **M: المكتبة الشاملة 27112**, «ديوان امرئ القيس» اعتناء المصطاوي (دار المعرفة). It reprints the same Zawzani text with the same typos («لَمِّا»، «بَكَلْكَلِ»، «بناظرّة»، «أثيت»), so it was **not** counted as an independent witness (it is excluded from the vocalization vote).
- **W1 / W2: ar.wikisource** «معلقة امرئ القيس» and «قفا نبك من ذكرى حبيب ومنزل (معلقة)» (raw wikitext in `raw/<key>/wikisource/`). Used only for vocalization where the word is the same; they are not always complete.

## Count and order
- **81 verses** (Z numbers 1–81; the number 54 is missing in the Shamela print but the verse «كُمَيْتٍ يَزِلُّ اللِّبْدُ…» is there and was taken in).
- T and A have the same verses plus one: after Z 46 they have «فيا لك من ليل كأن نجومه | بكل مُغار الفتل شُدّت بيذبل» and then «كأن الثريا عُلّقت في مصامها | بأمراس كتان إلى صم جندل». Z joins the two into one verse (47: «فيا لك من ليل كأن نجومه | بأمراس كتان إلى صم جندل»), and Z itself says «ويروى: … بكل مغار الفتل شدت بيذبل، وهذا أعرف الروايتين». Z was kept.
- Order: T and A put Z 20 and Z 32 elsewhere (two inversions); otherwise the same order.
- Z's editor marks the commentary on verses 3–4 «هذا الشرح ليس للزوزني» (the explanation was supplied by the editor). The verses are kept, as in all the witnesses.

## Corrections of the base wording (`fixes.json`)
| v. | base | adopted | why |
|---|---|---|---|
| 35ب | أثيتٍ | أَثِيثٍ | تصحيف؛ الزوزني يشرح «الأثيث: الكثير»، وكذا ت وأ |
| 57أ | على صَهَواتِهِ | عَنْ صَهَواتِهِ | «على» يكسر الوزن (فَ عَ لَى)، والزوزني يشرح «يزلق الغلام … عن مقعده»، وت وأ: «عن صهواته» |

Kept against T/A because Z's own commentary explains them: 57 «يُزِلُّ الغُلَامَ الْخِفَّ» (T/A: يَزِلُّ الغلامُ الخفُّ), 61 «كَأَنَّ عَلَى الْمَتْنَيْنِ مِنْهُ إِذَا انْتَحَى | مَدَاكَ…» (T/A: كأنَّ سَراتَه لدى البيت قائمًا | مَدَاكُ…), 72 «بَعْدَ مَا» (Z: «أصله بَعُدَ فخففه»; T/A: بُعْدَ).

## Readings of T / A that differ from the adopted text (kept as in the base)
Hemistichs where a witness has other words (harakat ignored). «—» = the verse is not in that witness (or differs too much to be matched).

| v. | adopted text | other readings |
|---|---|---|
| 8ب | نسيم الصبا جاءت بريا القرنفل | T: نسم الصبا جاءت بريا القرنفل |
| 10ب | ولا سيما يوم بدارة جلجل | T: ولاسيما يوم بدارة جلجل |
| 11ب | فيا عجبا من كورها المتحمل | T: فيا عجبا من رحلها المتحمل<br>A: فيا عجبا لرحلها المتحمل |
| 14ب | عقرت بعيري يا امرأ القيس فانزل | T: عقرت بعيري - يا امرأ القيس - فانزل |
| 16ب | فألهيتها عن ذي تمائم محول | A: فألهيتها عن تمائم محول |
| 20ب | وأنك مهما تأمري القلب يفعل | T: وأنك مهما تأمري القلب |
| 27أ | فقالت يمين الله ما لك حيلة | T: فقالت يمين الله مالك حيلة<br>A: فقالت يمين الله مالك حيلة |
| 28أ | خرجت بها أمشي تجر وراءنا | T: فقمت بها أمشى تجر وراءنا<br>A: فقمت بها أمشى تجر وراءنا |
| 28ب | على أثرينا ذيل مرط مرحل | T: على إثرنا أذيال مرط مرحل<br>A: على إثرنا أذيال مرط مرحل |
| 29ب | بنا بطن خبت ذي حقاف عقنقل | T: بنا بطن خبت ذي قفاف عقنقل<br>A: بنا بطن خبت ذي قفاف عقنقل |
| 30أ | هصرت بفودي رأسها فتمايلت | A: مددت بغصني دومة فتمايلت |
| 30ب | علي هضيم الكشح ريا المخلخل | T: على هضم الكشح ريا المخلخل |
| 32ب | غذاها نمير الماء غير المحلل | T: غذاها نمير الماء غير محلل<br>A: غذاها نمير الماء غير محلل |
| 36أ | غدائره مستشزرات إلى العلا | A: غدائره مستشزرات إلى العلى |
| 38أ | وتضحي فتيت المسك فوق فراشها | T: ويضحي فتيت المسك فوق فراشها<br>A: ويضحى فتيت المسك فوق فراشها |
| 39ب | أساريع ظبي أو مساويك إسحل | T: أساريع ظبي أو مسويك إسحل |
| 40أ | تضيء الظلام بالعشاء كأنها | T: تضي الظلام بالعشاء كأنها |
| 42ب | وليس فؤادي عن هواك بمنسل | T: وليس فؤادي عن هواه بمنسل<br>A: وليس فؤادي عن هواك بمنسلي |
| 43ب | نصيح على تعذاله غير مؤتل | A: نصيح على تعذاله غير مؤتلي |
| 44أ | وليل كموج البحر أرخى سدوله | T: وليل كموج البحر مرخ سدوله |
| 46ب | بصبح وما الإصباح منك بأمثل | T: بصبح وما الإصباح فيك بأمثل<br>A: بصبح وما الإصباح فيك بأمثل |
| 47أ | فيا لك من ليل كأن نجومه | T: كأن الثربا علقت في مصامها<br>A: كأن الثريا علقت في مصامها |
| 58أ | درير كخذروف الوليد أمره | T: درير كخذروف لوليد أمره |
| 59أ | له أيطلا ظبي وساقا نعامة | A: له إطلا ظبي وساقا نعامة |
| 59ب | وإرخاء سرحان وتقريب تتفل | A: وإرخاء سرحان وتقريب تنفل |
| 61أ | كأن على المتنين منه إذا انتحى | T: كأن سراته لدى البيت قائما<br>A: كأن سراته لدى البيت قائما |
| 65أ | فألحقنا بالهاديات ودونه | T: فألحقه بالهاديات ودونه<br>A: فألحقه بالهاديات ودونه |
| 68ب | متى ما ترق العين فيه تسفل | T: متى ما ترق العين فيه تسهل<br>A: متى ما ترق العين فيه تسهل |
| 71أ | يضيء سناه أو مصابيح راهب | A: يضيء سنله أو مصابيح راهب |
| 71ب | أمال السليط بالذبال المفتل | T: أهان السليط بالذبال المفتل |
| 72ب | وبين العذيب بعد ما متأملي | A: وبين العذيب بعد ما متأمل |
| 73أ | على قطن بالشيم أيمن صوبه | T: علا قطنا - بالشيم - أيمن صوبه<br>A: علا قطنا بالشيم أيمن صوبه |
| 76ب | ولا أطما إلا مشيدا بجندل | T: ولا أجما إلا مشيدا بجندل<br>A: ولا أجما إلا مشيدا بجندل |
| 78ب | من السيل والأغثاء فلكة مغزل | T: من السيل والغثاءفلكة مغزل<br>A: من السيل والغثاء فلكة مغزل |

## Vocalization
- Coverage: about 99.2% of the letters that need a mark (bare: 21, e.g. كورِهَا، هَضيمَ، فألْحَقَنَا، فَلكة where no witness has the same word vocalized). Of 2913 letters (alef excluded), 1665 carry the base's own marks and 957 were completed from the witnesses; 19 fathas before a madd alef were written in (the alef implies them).
- Fixed particles completed where bare (15): إِلَى، إِذَا، أَوْ، عَلَى، فِي، لَا، حَتَّى، إِلَيْهِ… ; word-initial إ always takes kasra; كَ/فَ/وَ/بِ before the article. A final dotless ي after a fatha was written ى (the base prints alef maqsura as ي).
- Base marks changed or completed by hand (`hfixes.json`):

| v. | adopted | why |
|---|---|---|
| 10ب | وَلَا سِيَّمَا | شكل الواو واللام والسين من ت «وَلاَسِيمَا»، والشدة من الأساس |
| 20أ | أَنَّ | همزة «أنّ» المفتوحة (فاعل «غرّك» مؤوَّل)، وهو ما لا يحتمل غيره |
| 42ب | هَوَاكِ | فتحة الواو من «الهَوَى»، ولا يحتمل غيرها |
| 78ب | وَالأَغْثَاءِ | جمع غُثاء على أفعال، معطوف على المجرور «السيل»؛ لا يحتمل غيره لغة ووزنًا |
| 50أ | إِنَّ | كسر همزة «إنّ» بعد القول؛ لا يحتمل غيره |
| 1ب | اللِّوَى | ضبط الأساس «اللّوى»؛ أُسقطت شدة وكسرة على لام التعريف جاءتا خطأً في نسخة أ |
| 32أ | البَيَاضَ | الضمة في ت تخالف شرح الزوزني («يروى بنصب البياض وخفضه»)؛ النصب من ديوان امرئ القيس (برواية الزوزني) |
| 37ب | كَأُنْبُوبِ | ضم همزة «أُنبوب» كما في أ؛ فتحة ت خطأ |
| 75ب | مَنْزِلِ | فتح الميم كما في أ («المنزل» اسم مكان)؛ ضمة ت خطأ |
| 2ب | لِمَا | كسرة الميم في ت خطأ طباعي؛ «لِمَا» |
| 12ب | الدِّمَقْسِ | ضبط الأساس خطأ؛ المثبت ضبط ت وأ (الدِّمَقْس: الحرير) |
| 23ب | مُعْجَلِ | «مُعَجَّل» في الأساس يكسر الوزن؛ ت وأ: مُعْجَلِ |
| 30ب | رَيَّا | مضاف فلا ينوّن؛ ت وأ |
| 31أ | بَيْضَاءُ | ضبط الأساس خطأ؛ المثبت ضبط ت وأ ونسختي ويكي مصدر |
| 33ب | مُطْفِلِ | لا ينوّن الرويّ؛ ت وأ |
| 36ب | مُثَنًّى | اسم منقوص منوّن (ت) |
| 45أ | لَمَّا | ضبط الأساس خطأ؛ المثبت ضبط ت وأ وويكي مصدر |
| 45ب | بِكَلْكَلِ | باء الجر مكسورة؛ ت |
| 51ب | يُهْزَلِ | ت وأ؛ والأساس ضبط الزاي وحدها بالضم، والزوزني يفسّره «عاش مهزول العيش» |
| 64ب | بِجِيدِ | مضاف فلا ينوّن؛ ت وأ |
| 70أ | وَمِيضَهُ | ضبط الأساس خطأ؛ المثبت ضبط ت وأ |
| 72ب | مُتَأَمَّلِي | الزوزني نفسه: «متأملي وهو المنظور إليه» (اسم مفعول)؛ ت |
| 1ب | بِسِقْطِ | كسرة الباء من نسخة ويكي مصدر (ت: «بِسُقْط» برواية أخرى) |

- Chosen by the meter among attested marks:
  - 53b كجلمود letter 6 «د»: -ٍ -> -ِ (meter)

- Ties between witnesses resolved by majority / T (letter-level):
  - 11a مَطيّتِي letter 2 «ط»: T:ِ A:َ -> ِ
  - 29a الحيّ letter 4 «ي»: T:ِ A:َ W1:ِ W2:ِ -> ِ
  - 32a البَيَاض letter 6 «ض»: T:ُ A:ِ -> ُ
  - 34a ليسَ letter 2 «ي»: T:ْ A:َ W1:ْ -> ْ
  - 37a كالجديلِ letter 4 «ج»: T:ْ A:َ W1:َ -> َ
  - 37b كأنْبوبِ letter 2 «أ»: T:َ A:ُ -> َ
  - 52a وُكنَاتِهَا letter 2 «ك»: T:َ A:ُ W1:ُ W2:ُ -> ُ
  - 53b كجلمود letter 6 «د»: T:ٍ A:ِ -> ٍ
  - 54a اللّبْدُ letter 3 «ل»: A:ِ W1:َ W2:ِ -> ِ
  - 58b كَفَّيهِ letter 3 «ي»: T:ْ A:ِ -> ْ
  - 74b الكَنَهْبلِ letter 6 «ب»: T:َ A:ُ -> َ
  - 75b من letter 1 «م»: T:ِ A:َ -> ِ

## Places to check
- 11ب «مِن كورِهَا»: Z's reading (T/A «من رحلها»); the vowel of the كاف is not given in any witness with this word (كُور = the camel saddle).
- 32أ «البَيَاضَ»: Z says both نصب and جرّ are good; the نصب (from the Mustawi reprint) was used. T has a ضمة, which Z does not allow.
- 36أ «مُسْتَشْزِرَاتٌ» (Z) — T/A «مُسْتَشْزَرَاتٌ». Both are known; Z kept.
- 51ب «يُهْزَلِ» was taken from T/A; Z marks only «يهزُلِ» (with ضمة on the زاي).
- 65ب «لَمْ تُزَيَّلِ» (Z) — T/A «لم تَزَيَّلِ». Kept as in Z.
- 10ب «وَلَا سِيَّمَا يَوْمٍ» (Z) — T/A «يومٌ». Both are correct; Z kept.

## Content note
- The poem is kept exactly as transmitted. Verses **16–17** («فَمِثْلِكِ حُبْلَى قَدْ طَرَقْتُ وَمُرْضِعٍ…» and «إِذَا مَا بَكَى مِنْ خَلْفِهَا انْصَرَفَتْ لَهُ…») are sexually explicit. The love episode of **23–30** (night visit, «نَضَّتْ لِنَوْمٍ ثِيَابَهَا», «هَصَرْتُ بِفَوْدَيْ رَأْسِهَا») is suggestive but less explicit. Nothing was removed; the owner decides.

## حذف بيتين (٢٠٢٦-١١-٠٦)
حُذف البيتان ١٦–١٧ («فمثلكِ حبلى قد طرقتُ ومرضعٍ…» و«إذا ما بكى من خلفها…») لصراحتهما، كما تفعل كثير من الطبعات المدرسية؛ والنص الكامل محفوظ في imru.full.txt.
