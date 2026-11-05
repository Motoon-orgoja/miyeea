# Texts report — معلقة لبيد بن ربيعة (`labid.txt`)

Riwaya and verse order of الزوزني, collated with التبريزي, ابن الأنباري and ديوان لبيد. 88 verses, الكامل, rhyme ـامُها.

## Method
- Every witness was parsed into verses by script (`muallaqat4-build/exZ.js`, `wit.js`). Hemistichs were compared word by word after stripping harakat and tatweel and unifying alef/yaa/taa marbuta (`col.js`, `zdiff.js`).
- Vocalization (`merge.js`): the base keeps every mark it has. A bare letter takes the mark of the witnesses that have the same word (majority; ties: T, then A, M, W1, W2). A witness whose vowels contradict the base inside the same word is not used for that word (another reading); if it differs only in the case ending, its marks are used for the other letters. Shadda is added only when two witnesses have it (or T alone, when no other witness marks that letter).
- Meter: every hemistich is scanned (`meter2.js`, built on `qahtaniyya-build/meter.js`). When a hemistich did not scan, the merger tried the other attested marks for its letters and kept the one that scans (list below). The remaining failures were checked one by one and corrected by hand (`hfixes.json`), each from a witness or as a form that admits nothing else.
- Raw pages: `raw/labid/` (one folder per source; the scripts read them as `pages/<shamela book id>/<page>.html`). Logs: `muallaqat4-build/out/labid-*.txt`.

## Sources
- **Base (Z): المكتبة الشاملة 11253**, الزوزني «شرح المعلقات السبع», دار إحياء التراث العربي ١٤٢٣هـ (the circulated school text, printed page numbers). The verses are numbered and partly vocalized (about half the letters). Pages 183–214: https://shamela.ws/book/11253/183
- **T: المكتبة الشاملة 37488**, التبريزي «شرح القصائد العشر», المنيرية ١٣٥٢هـ. Verses in parentheses, almost fully vocalized (with typing slips: marks on the wrong letter, «فيِ», «عَلَىَّ»). Independent of Z. Pages 128–174: https://shamela.ws/book/37488/128
- **A: المكتبة الشاملة 124335**, ابن الأنباري «شرح القصائد السبع الطوال الجاهليات», تحقيق عبد السلام هارون (دار المعارف). Verses in parentheses, partly vocalized. Independent of Z. Pages 495–588: https://shamela.ws/book/124335/495
- **M: المكتبة الشاملة 35077**, «ديوان لبيد بن ربيعة» اعتناء حمدو طمّاس (دار المعرفة ١٤٢٥هـ), pages 102–112: https://shamela.ws/book/35077/102. Vocalized; follows the Zawzani riwaya but is a separate text.
- **W1 / W2: ar.wikisource** «معلقة لبيد بن ربيعة» and «عفت الديار محلها فمقامها (معلقة)» (raw wikitext in `raw/<key>/wikisource/`). Used only for vocalization where the word is the same; they are not always complete.

## Count and order
- **88 verses** in Z, T, A and M alike (T has one extra verse «أن يفزعوا تُلقَ المغافر عندهم…» and lacks Z 67 in this wording; order: two small inversions at Z 41 and 83 in T/A).

## Corrections of the base wording (`fixes.json`)
| v. | base | adopted | why |
|---|---|---|---|
| 9أ | نَئُورُها | نَؤُورُها | رسم الهمزة: نَؤُور على فَعُول، وكذا ت وأ وديوان لبيد |
| 28ب | جَزْءً | جَزْءًا | رسم تنوين النصب |

## Readings of T / A / M that differ from the adopted text (kept as in the base)
Hemistichs where a witness has other words (harakat ignored). «—» = the verse is not in that witness (or differs too much to be matched).

| v. | adopted text | other readings |
|---|---|---|
| 1ب | بمنى تأبد غولها فرجامها | T: بمنى تأبد غولها فرجمها |
| 4ب | ودق الرواعد جودها فرهامها | A: ودق الرواعد جودها ورهامها |
| 5أ | من كل سارية وغاد مدجن | A: مم كل سارية وغاد مدجن |
| 7أ | والعين ساكنة على أطلائها | A: والوحش ساكنة على أطلائها |
| 7ب | عوذا تأجل بالفضاء بهامها | A: عوذا تأجل بالفضاء بهلمها |
| 10ب | صما خوالد ما يبين كلامها | A: صما خوالد ما يبشين كلامها |
| 12أ | شاقتك ظعن الحي حين تحملوا | T: شاقتك ظعن الحي يوم تحملوا |
| 14ب | وظباء وجرة عطفا أرآمها | T: وظباء وجرة عطفا أرءامها |
| 17ب | أهل الحجاز فأين منك مرامها | T: أضهل الحجاز فأين منك مرامها |
| 19ب | فيها وحاف القهر أو طلخامها | T: منها وحاف القهر أو طلخامها<br>A: منها وحاف القهر أو طلخامها |
| 20أ | فاقطع لبانة من تعرض وصله | T: فقطع لبانة من تعرض وصله |
| 20ب | ولشر واصل خلة صرامها | T: ولخير واصل خلة صرامها |
| 21أ | واحب المجامل بالجزيل وصرمه | A: واحب المحامل بالجزيل وصرمه |
| 21ب | باق إذا ظلعت وزاغ قوامها | T: باق إذا ضلعت وزاغ قوامها<br>A: باق إذا ضلعت وزاغ قوامها<br>M: باق إذا ضلعت وزاغ قوامها |
| 23أ | وإذا تغالى لحمها وتحسرت | T: فإذا تغالى لحمها وتحسرت<br>A: فإذا تغالى لحمها فتحسرت |
| 24ب | صهباء خف مع الجنوب جهامها | T: صهباء راح مع الجنوب جهامها<br>A: صهباء راح مع الجنوب جهامها |
| 26أ | يعلو بها حدب الإكام مسحج | T: يعلو بها حدب الإكام مججا<br>A: يعلو بها حدب الإكام مسحجا |
| 28ب | جزءا فطال صيامه وصيامها | T: جزآ فطال صيامه وصيامها |
| 30أ | ورمى دوابرها السفا وتهيجت | A: ورمت دوابرها السفا وتهيجت |
| 33ب | منه إذا هي عردت إقدامها | T: منه - إذا هي عردت - إقدامها |
| 35أ | محفوفة وسط اليراع يظلها | T: ومحففا وسط اليراع يظله |
| 35ب | منه مصرع غابة وقيامها | T: منها مصرع غابة وقيامها |
| 38ب | غبس كواسب لا يمن طعامها | T: غبس كواسب ما يمن طعامها<br>A: غبس كواسب لايمن طعامها |
| 39أ | صادفن منها غرة فأصبنها | T: صادفن منهل غرة فأصبنها<br>A: صادفن منه غرة فأصبنها |
| 41أ | يعلو طريقة متنها متواتر | T: يعلو طريقة متنها متواترا |
| 44أ | حتى إذا انحسر الظلام وأسفرت | A: حتى إذا حسر الظلام وأسفرت |
| 45أ | علهت تردد في نهاء صعائد | T: علهت تبلد في نهاء صعائد |
| 47أ | فتوجست رز الأنيس فراعها | T: وتسمعت رز الأنيس فراعها<br>A: وتسمعت رز الأنيس فراعها<br>M: وتوجست رز الأنيس فراعها |
| 48أ | فغدت كلا الفرجين تحسب أنه | A: فغدت كلا الفرجين تحسن أنه |
| 52ب | بدم وغودر في المكر سخامها | A: بدم وغودر في المكر سحامها |
| 53ب | واجتاب أردية السراب إكامها | A: واجتاب أؤدية السراب إكامها |
| 54ب | أو أن يلوم بحاجة لوامها | A: أو أن تلوم بحاجة لوامها |
| 55أ | أولم تكن تدري نوار بأنني | T: أو لم تكن تدرى نوار بأنني<br>A: أو لم تكن تدري نوار بأنني |
| 56ب | أو يعتلق بعض النفوس حمامها | T: أو يرتبط يعض النفوس حمامها |
| 59أ | أغلي السباء بكل أدكن عاتق | T: أغلى السباء بكل أد كن عاتق |
| 60أ | وصبوح صافية وجذب كرينة | T: بصبوح صافية وجذب كرينة<br>A: بصبوح صافية وجذب كرينة |
| 61أ | باكرت حاجتها الدجاج بسحرة | M: بادرت حاجتها الدجاج بسحرة |
| 61ب | لأعل منها حين هب نيامها | T: لأعل منها هب نيامها |
| 62أ | وغداة ريح قد وزعت وقرة | A: وغداة ريح قج كشفت وقرة |
| 63أ | ولقد حميت الحي تحمل شكتي | T: ولقد حميت الخيل تحمل شكتي |
| 63ب | فرط وشاحي إذ غدوت لجامها | T: فرط وشاحي - إذ غدوت - لجامها |
| 64أ | فعلوت مرتقبا على ذي هبوة | T: فعلوت مرتقبا على مرهوبة |
| 67أ | رفعتها طرد النعام وشله | T: —<br>A: رفعتها طرد النعام وفوقه |
| 67ب | حتى إذا سخنت وخف عظامها | T: — |
| 72ب | عندي ولم يفخر علي كرامها | T: يوما ولم يفخر علىكرامها<br>A: يوما ولم يفخر على كرامها |
| 73ب | بمغالق متشابه أجسامها | T: بمغالق متشابه أعلامها<br>A: بمغالق متشابه أعلامها |
| 75أ | فالضيف والجار الجنيب كأنما | T: فالضيف والجار الغريب كأنما<br>A: فالضيف والجار الغريب كأنما |
| 77أ | ويكللون إذا الرياح تناوحت | A: ويكللون إذا الرياح تنواحت |
| 82ب | إذ لا يميل مع الهوى أحلامها | T: إذ لا تميل مع الهوى أحلامها<br>A: إذ لا تميل مع الهوى أحلامها |
| 84ب | أوفى بأوفر حظنا قسامها | T: أوفى بأعظم حظنا قسامها<br>A: أوفى بأعظم حقنا قسامها |
| 85أ | فبنى لنا بيتا رفيعا سمكه | T: فبنوا لنا بيتا رفيعا سمكه |
| 86أ | وهم السعاة إذا العشيرة أفظعت | T: فهم السعاة إذا العشيرة أفظعت |
| 88ب | أو أن يميل مع العدو لئامها | T: أو أن يلوم مع العدى لوامها<br>A: أو أن يلوم مع العدو ليامها |

## Vocalization
- Coverage: about 99.1% of the letters that need a mark (bare: 24, e.g. عِندي، شِكَّتي، الجَنيبُ، يَميلُ). Of 2953 letters (alef excluded), 2081 carry the base's own marks and 624 were completed from the witnesses; 39 fathas before a madd alef were written in (the alef implies them).
- Fixed particles completed where bare (11): إِلَى، إِذَا، أَوْ، عَلَى، فِي، لَا، حَتَّى، إِلَيْهِ… ; word-initial إ always takes kasra; كَ/فَ/وَ/بِ before the article. A final dotless ي after a fatha was written ى (the base prints alef maqsura as ي).
- Base marks changed or completed by hand (`hfixes.json`):

| v. | adopted | why |
|---|---|---|
| 2أ | عُرِّيَ | رسم الأساس «عُرِّى» بالألف المقصورة وبلا حركة؛ ت وأ وديوان لبيد: عُرِّيَ |
| 2ب | الْوُحِيَّ | ضمة زائدة على لام التعريف في الأساس |
| 6أ | الأَيْهُقَانِ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 8أ | الطُّلُولِ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 16أ | تَذَكَّرُ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 19أ | فَمَظِنَّةٌ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 25أ | مُلْمِعٌ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 43أ | الظَّلَامِ | مضاف إليه؛ ت |
| 56ب | يَعْتَلِقْ | فتحة الأساس على العين خطأ طباعي؛ الوزن |
| 56ب | النُّفُوسِ | كسرة الأساس على الواو؛ موضعها السين |
| 63أ | تَحْمِلُ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 63ب | وِشَاحِيَ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 69أ | وَتَطْعَنُ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 87أ | فِيهِمُ | خلاف الأساس (خطأ ضبط فيه) إلى ما اتفقت عليه المصادر الأخرى |
| 34أ | فَتَوَسَّطَا | فعل مثنى، كما في أ؛ تنوين ت خطأ |
| 51أ | لِتَذُودَهُنَّ | من ذاد يذود، كما في ت وأ؛ فتحة الذال في د والنسختين الأخريين خطأ |
| 60ب | تَأْتَالُهُ | سكون الهمزة كما في أ وديوان لبيد؛ فتحة ت خطأ |
| 73أ | وَجَزُورِ | «جَزُور» على فَعُول كما في ت وأ |
| 53أ | اللَّوَامِعُ | شدة اللام الشمسية؛ لا يحتمل غيره |
| 51أ | إِنْ | لا يحتمل غيره |
| 54ب | أَنْ | ناصبة للفعل بعدها؛ لا يحتمل غيره |
| 88ب | أَنْ | ناصبة للفعل بعدها؛ لا يحتمل غيره |
| 70أ | غُرَبَاؤُهَا | فاعل مرفوع؛ رسم الأساس بالياء خطأ، وت وأ وديوان لبيد: غُرَبَاؤُهَا |

- Chosen by the meter among attested marks:
  - 45a تَرَدَّدُ letter 2 «ر»: sَ -> -َ (meter)
  - 57b لَهوُها letter 2 «ه»: -ُ -> -ْ (meter)
  - 71b أَقدامُها letter 3 «د»: -ْ -> -َ (meter)
  - 75b تَبالَةَ letter 2 «ب»: -ْ -> -َ (meter)

- Ties between witnesses resolved by majority / T (letter-level):
  - 13a كُلّ letter 2 «ل»: T:ِ A:ٍ M:ِ W1:ِ W2:ِ -> ِ
  - 29a بِأَمرِهِما letter 3 «م»: T:ْ A:ِ -> ْ
  - 34a فَتَوَسَّطا letter 5 «ط»: T:ً A:َ -> ً
  - 46b وَفِطامُها letter 3 «ط»: T:َ A:ِ M:َ -> َ
  - 51a لِتَذودَهُنَّ letter 3 «ذ»: T:ُ A:ُ M:َ W1:َ W2:َ -> َ
  - 57b لَهوُها letter 2 «ه»: T:ُ A:ُ M:ْ -> ُ
  - 60b تَأتالُهُ letter 2 «أ»: T:َ A:ْ -> َ
  - 71b أَقدامُها letter 3 «د»: T:ْ M:َ -> ْ
  - 73a وَجَزورِ letter 3 «ز»: T:ُ A:ُ M:َ W1:َ W2:َ -> َ
  - 75b تَبالَةَ letter 2 «ب»: T:ْ A:َ -> ْ

## Places to check
- 21ب «ظَلَعَتْ» (Z, explained «الظلع: غمز في الدواب») — T/A/M «ضَلَعَتْ». Z kept.
- 47أ «فَتَوَجَّسَت» (Z) — M «وتوجّست», T/A «وتسمّعت». Z kept.
- 67أ «طَرْدَ النَّعَامِ» (Z) — A/M «طَرَدَ». Both are masdars; Z kept.
- 69أ «وَتَطْعَنُ» with فتحة on the عين (Z) — T/A «تطعُن». Both are known; Z kept.
- 88ب «أَنْ يَميلَ مَعَ العَدُوِّ لِئَامُهَا» (Z, M) — T/A «أن يلوم مع العدى لُوّامها / لِيامها».

## Content note
- Wine verses (57–61) kept as transmitted; nothing obscene.
