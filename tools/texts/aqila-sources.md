# Texts report — عقيلة أتراب القصائد في أسنى المقاصد (`aqila.txt`)

Poem by الإمام القاسم بن فيرّه الشاطبي (ت ٥٩٠هـ) on the rasm of the mushaf (a versification of al-Dani's «المقنع» with additions).
Meter: البسيط. **298 verses**, 31 headings. Verse numbers below are those of the final file (1–298).

Scripts and outputs (`aqila-build/`): `parse-ko.js` → `K.json`; `parse-qari.js` → `Q.json`; `collate*.js` → `collation-KQ*.txt`, `map.json`;
`wgrep.js` (search in the OCR of al-Sakhawi's الوسيلة); `qnote.js` (al-Qari's verse line, commentary and footnotes); `build.js` → `../aqila.txt` + `build-log.txt`.
Raw files: `raw/aqila/ko102987.json`, `raw/aqila/sh1121.json`, `raw/aqila/ia/wasila_djvu.txt`, `raw/aqila/ia/talkhis_djvu.txt`.

## Sources

**No fully vocalized digital copy was found.** Searched: shamela.ws (author page of الشاطبي and the category «التجويد والقراءات»), the ketabonline API,
Arabic Wikisource, OpenITI (only حرز الأماني for this author), archive.org, and the web for vocalized phrases of the poem. The vocalized students'
editions (أيمن سويد، دار الغوثاني …) exist only in print or as image PDFs.

| Code | Source | Use |
|---|---|---|
| **K** | جامع الكتب الإسلامية 102987 «عقيلة أتراب القصائد في علوم الرسم», from الشاملة الذهبية (299 numbered verses): https://ketabonline.com/ar/books/102987 | **Base text** (wording, harakat, headings). Partly vocalized, with many typing slips. |
| **Q** | المكتبة الشاملة 1121 «الهبات السنية العلية على أبيات الشاطبية الرائية», ملا علي القاري (ت ١٠١٤هـ), تحقيق د. عبد الرحمن السديس (أم القرى؛ دار طيبة الخضراء ١٤٣٩هـ): https://shamela.ws/book/1121 | **Independent second witness**: its own matn (298 numbered verses, edited from 6 manuscripts), al-Qari's remarks on the meter, the editor's manuscript footnotes. Partly vocalized. |
| **W** | «الوسيلة إلى كشف العقيلة» للسخاوي (ت ٦٤٣هـ), archive.org `0840Pdf` (OCR text layer): https://archive.org/details/0840Pdf | Tie-breaker: its lemmas («وقوله: …») and editor's footnotes are readable in the OCR (the verse lines mostly are not); its table of contents = the headings. |
| — | «تلخيص الفوائد» لابن القاصح, archive.org `tal5es_fwaed_20191229` | OCR unusable. Not used. |

K follows the السخاوي tradition: same headings, and W's lemmas agree with K in most places where K and Q differ
(36 وسار، 44 مع، 81 حاشا، 113 خاشعًا، 123 طيّبوا، 147 مغتفرا، 170 تسلن …). So, per the owner rule, **K's wording was kept unless it was
clearly wrong** (meter, grammar, a Qur'anic word miswritten, a typo) or W and Q agree against it.

## Verse count — 298

- The poem says «تسعون مع مائتين مع ثمانية أبياتها» = **298**; Q has 298.
- K numbers 299: its verse 242 «من قبلِ ما ملكتْ فاقطع ونُزعَ فل | مُنافقين لدي مما ولا ضَررا» is a manuscript variant of the verse before it
  (W's editor: «في (ص): من قبل ما ملكت فاقطع ولا نزاع في المنافقين لدى من ما ولا ضررا»); not in Q. **Dropped.** From 242 on, final number = K number − 1.

## Headings (31)

K's headings = the headings of W's table of contents, without K's editorial square brackets: مقدمة الناظم؛ باب الإثبات والحذف وغيرهما مرتبا على السور
من البقرة إلى الأعراف؛ ومن سورة الأعراف إلى سورة مريم عليها السلام؛ ومن سورة مريم عليها السلام إلى سورة ص؛ ومن سورة ص إلى آخر القرآن؛ باب الحذف
في كلمات تحمل عليها أشباهها؛ باب من الزيادة؛ باب حذف الياء وثبوتها؛ باب ما زيدت فيه الياء؛ باب حذف الواو وزيادتها؛ باب حروف من الهمز وقعت في
الرسم على غير قياس؛ باب رسم الألف واواً؛ باب رسم بنات الياء والواو؛ باب حذف إحدى اللامين؛ باب المقطوع والموصول؛ the 13 أبواب of القطع والوصل (أن لا
وإن ما … ولات)؛ باب هاء التأنيث التي كتبت تاء؛ باب المضافات إلى الأسماء الظاهرة والمفردات؛ باب المفردات والمضافات المختلف في جمعها.
Only the spelling was normalised, as in W's table (فى→في، التى→التي، الاثبات→الإثبات، الاعراف→الأعراف، التانيث→التأنيث، ام من→أم من، الن→ألن،
فان لم واما→فإن لم وأما، ان ما→أن ما، اينما→أينما). «مقدمة الناظم» is an editorial label (W: «[مقدمة المصنف]»). The closing verses
(تمّت عقيلة …) have no heading in K/W and stay under the last باب. Q (al-Qari) calls the first chapter just «باب الحذف».

## Method

1. Base K. Q parsed from its verse lines (verses 77, 78, 149, 180 are quoted one hemistich at a time in Q: only their first hemistich is in Q).
2. Collation K↔Q word by word by script (harakat, tatweel, alif/ya/ta-marbuta/hamza forms neutralised): 112 verses differ in something
   (`collation-KQ-mid.txt`), most only in how the Qur'anic words are spelled (rasm vs. standard spelling) or in spacing.
3. Every lexical difference was judged by the meter (البسيط, each disputed hemistich scanned), W's lemmas and footnotes, al-Qari's remarks
   («يتزن البيت …»), and the Qur'an for quoted words.
4. **Qur'anic words in the ya/waw-deletion chapters** (166–182, 194): K writes many with the ya/waw restored (تُخْزُونِي، يَدْعُو …), against the rule
   the verse itself states; Q writes them as in the mushaf (تُخْزُونِ، يَدْعُ). Q's form was taken (meter unaffected). Elsewhere K's rasm-style
   spellings (الصلوة، الزكوة، جاؤ وباؤ، يا ويلتى، الربوا، أنبؤا …) were kept, since they show the rasm the verse describes.
5. **Harakat:** K's marks kept. Where a K word has the same letters as the aligned Q word, each letter with no vowel in K received Q's vowel/shadda
   (1526 marks). Where the two vowels differ, K was kept (112 cases, listed at the end of `build-log.txt`) except the clear
   errors in the table below. No harakah was added from memory. The only marks moved are K's own marks typed one letter early (K types «غيُر، بيَن،
   المحسنيَن، حيَن، الضميِر» for غيرُ، بينَ …) or typed after a bare alif («ماَ، اللاَّ، عُتُواًّ» → «مَا، اللَّا، عُتُوًّا»).
6. Orthography: dotless final ى → ي (في/الذي/التي/اللائي/اللاتي, a ى carrying a mark or after kasra, and where Q has ي). Verse numbers, footnote marks,
   editorial brackets and 15 stray marks on a bare alif removed. Tatweel only marks a word split between the two hemistichs (64 verses, e.g.
   «مُسَيْلِمَةُ الْـ | ـكذَّابُ»، «وكِيـ | ـدُونِ»), as in `durra.txt`. UTF-8 without BOM.
7. **Vocalization of the final text: 6430/13110 = 49.0%; words with no mark at all: 405/3165. Not a fully vocalized text.**

## Wording / spelling / vocalization corrections to K (96, all logged in `build-log.txt`)

Q = al-Qari's matn; W = al-Sakhawi's الوسيلة. Verse = final number.

| Verse | Hemistich | K | Written | Reason |
|---|---|---|---|---|
| 5 | 2nd | نَداً | نَدًى | spelling: نَدًى (Q) |
| 7 | 1st | عَلائِقُهُ | عِلاقَتُهُ | Q (its mss: عِلاقته) and W lemma «علاقته أولى العلائق» |
| 8 | 1st | مافيهِ | ما فيهِ | spacing |
| 23 | 1st | مُسَيْلِمَةُ | مُسَيْلِمَةُ الْـ | meter + Q + W («مسيلمة الـ / ـكذاب») |
| 23 | 2nd | كذَّابُ | ـكذَّابُ | meter + Q + W |
| 40 | 1st | أبوعُبَيْدٍ | أبو عُبَيْدٍ | spacing |
| 47 | 2nd | يُخدِعُونَ | يُخَادِعُونَ | meter (يُخْدِعُونَ breaks البسيط) + Q |
| 49 | 1st | مُصْيطِر | مُصَيْطِرٍ | vocalization: meter needs مُصَيْطِرٍ (Q) |
| 52 | 1st | دفاعُ رهنٌ معْ مُضعفةً | دِفَاعٌ رِهَانٌ معْ مُضَاعَفَةً | meter (K's «رهنٌ مضعفة» breaks the foot) + Q |
| 72 | 2nd | طَئِفٌ | طَائِفٌ | meter + Q |
| 80 | 1st | غَيبَتٌ | غَيَابَتِ | meter (غَيْبَتٌ نافعٌ breaks the first foot) + Q |
| 89 | 2nd | بالثُّبوتِ | في الثُّبوتِ | W lemma «وكلهم فخراج في الثبوت» + Q |
| 94 | 2nd | وفى | وَفَى | the verb وَفَى (Q), not the preposition |
| 96 | 2nd | بَصْرىِّ | بَصْرِيِّ | ى with kasra → ي (Q: البَصْرِيّ) |
| 100 | 2nd | وادَّراكَ | وادَّارَكَ | meter + Q |
| 105 | 1st | فَكهِيِـ | فَكِهِيـ | misplaced kasra; vocalization from Q |
| 111 | 1st | عبادىَ | عباديَ | ى with fatha → ي (يَا عِبَادِيَ لَا خَوْفٌ، الزخرف ٦٨) |
| 114 | 2nd | ا لمُنيف | المُنيف | spacing |
| 124 | 2nd | بِصْرِىِّ | بَصْرِيِّ | vocalization: البَصْرِيّ (Q) |
| 128 | 2nd | عُرَا | عُرَى | spelling of عُرَى (plural of عُرْوة), Q |
| 128 | 2nd | وثيقُ | وَثيقُ | only the fatha taken from Q (Q misplaces a kasra on the ya) |
| 130 | 2nd | فَرُدْ | فَرِدْ | Q: «رِدْ» from وَرَدَ (come to the pools غُدُرا); cf. 156 |
| 134 | 1st | وفى | وفي | ى → ي |
| 142 | 1st | أيُّهَ الثَّقلانِ أيُّ | أيُّهَ الثَّقلا | meter: the hemistich ends at «الثَّقلا/نِ» as in Q |
| 142 | 2nd | هُ الساحرُ | نِ أيُّهَ الساحرُ | meter + Q (and أيُّهَ like the two before it) |
| 144 | 1st | الأُولَى | الأُولَى | kept as in K (Q marks the naql on the lam: الُاولى) |
| 149 | 1st | داودَ | دَاوُودُ | grammar: مبتدأ (Q) |
| 152 | 1st | أَلْفانِ | أَلِفانِ | meter needs أَلِفانِ (Q has the kasra on the lam) |
| 156 | 2nd | ورُدْ | ورِدْ | Q: «رِدْ أمر من راد الماء» |
| 164 | 1st | لَنسْعفاً | لَنَسْفَعًا | typo; Q and the Qur'an (العلق ١٥) |
| 168 | 1st | والدَّاعِى | والدَّاعِ | ya-deleted Qur'anic word written as in the mushaf (Q) |
| 168 | 2nd | دُونى | دُونِ | idem (Q) |
| 168 | 2nd | تُخْزُونِي | تُخْزُونِ | idem (Q) |
| 169 | 2nd | دُعائي | دُعَاءِ | idem (Q) |
| 170 | 1st | نذيري معَ نُذُرِى | نَذِيرِ معَ نُذُرِ | idem (Q) |
| 170 | 2nd | يأْتِى | يأْتِ | idem (Q) |
| 172 | 1st | تُؤْتُونِي تُعلِّمَنىِ | تُؤْتُونِ تُعَلِّمَنِ | idem (Q) |
| 172 | 2nd | تَرَنىِ | تَرَنِ | idem (Q) |
| 173 | 1st | يهديَنى نبغى | يهديَنِ نبغِ | idem (Q) |
| 173 | 2nd | المهْتَدِى | المهْتَدِ | idem (Q) |
| 174 | 1st | ويُؤْتِيَنىِ | ويُؤْتِيَنِ | idem (Q) |
| 174 | 2nd | يستعجلُونى | يستعجلُونِ | idem (Q has تستعجلون; K's ي kept) |
| 174 | 1st | يشفيِن | يشفينِ | misplaced mark: K types it one letter early |
| 174 | 2nd | يُحييِن | يُحيينِ | idem |
| 175 | 1st | ونُنَجِّ | نُنَجِّ | meter (the و adds a syllable) + Q |
| 175 | 1st | المؤمنيَنَ | المؤمنينَ | misplaced mark: K types it one letter early |
| 176 | 1st | أشركتُمونى الجوارى | أشركتُمونِ الجوارِ | ya-deleted words (Q) |
| 176 | 2nd | تُغْنى | تُغْنِ | idem (Q) |
| 177 | 1st | أهاننى | أهانَنِ | idem (Q) |
| 177 | 1st | أكْرمنى | أكْرمَنِ | idem (Q) |
| 178 | 1st | يسرى ينادى المنادى | يسرِ ينادِ المنادِ | idem (Q) |
| 180 | 2nd | اتبعونى | اتبعوني | ى → ي |
| 181 | 2nd | تُنظرُونى | تُنظرُونِ | idem (Q) |
| 182 | 1st | آتانِى | آتانِ | idem (Q) |
| 184 | 1st | كوَرَءْ | كوَرِءْ | vocalization: وَرِئْيًا (مريم ٧٤), Q |
| 185 | 2nd | وعَلِّيِّيَن | وَعِلِّيِّينَ | vocalization error (عِلِّيِّينَ), Q |
| 185 | 1st | ويَستحْىِ | ويَستحْيِ | ى with kasra → ي |
| 188 | 2nd | مَشْتَهِرَا | مُشْتَهِرَا | vocalization error (اسم فاعل) |
| 190 | 1st | أَوْمِنْ | أَوْ مِنْ | spacing |
| 194 | 1st | يَدْعُو | يَدْعُ | waw-deleted words written as in the mushaf, as the verse states (Q) |
| 194 | 2nd | يمْحُوا | يمْحُ | idem (Q) |
| 194 | 2nd | ندعُو | ندعُ | idem (Q) |
| 195 | 1st | وَهُم | وَهْمٌ | Q and W («وهم نسوا الله: أي المذكور فيه من الحذف وَهْمٌ») |
| 198 | 2nd | لِيَسُوؤا | يَسُوؤا | meter (لِـ adds a syllable) + Q |
| 198 | 1st | ووُرِىَ | ووُرِيَ | ى → ي; kept as K (conjunction + وُرِيَ) |
| 199 | 1st | ألفِ | ألفٍ | meter (hemistich must end -فِنْ) + Q |
| 201 | 2nd | فَصْلِهُ | فَصِلْهُ | imperative of وَصَلَ «فَصِلْهُ كلَّه» (Q); K has the misprint فَصْلِهُ |
| 206 | 2nd | سَرَي | سَرَى | rhyme word misprinted with ي (Q: سَرَى) |
| 209 | 1st | تبوَّآ | تَبُوءَ | meter + Q; the word is «أَن تَبُوءَ» (المائدة ٢٩) |
| 213 | 1st | نبَؤٌا | نبَؤُا | stray tanwin (Q) |
| 215 | 1st | وتَفْتَأُ | تَفْتَأُ | meter (the و breaks the first foot) + Q |
| 216 | 2nd | ءُ وقل | وقل | meter: «الضُّعَفَا» is shortened (قصر), the extra ءُ breaks the hemistich; Q |
| 219 | 1st | وبعدُ را بُرآؤُا مع ألفٍ | وبعدَ را بُرَآءُ الواوُ معْ ألفٍ | Q (al-Qari: «الواو مع ألف كتب بعد راء برآء … قدّم وقصر للوزن»); K lacks «الواو» and a syllable |
| 220 | 1st | ضميِر | ضميرِ | idem (kasra) |
| 226 | 2nd | الضميِر | الضميرِ | idem (kasra) |
| 228 | 2nd | يَحيي | يَحْيَى | the name يَحْيَى (K يَحيي, Q يَحْيَي are misprints; marks from Q) |
| 234 | 1st | وطِابَ | وطَابَ | stray kasra (Q) |
| 236 | 2nd | الَّليلِ | اللَّيلِ | shadda on the wrong lam |
| 244 | 2nd | عنْ ذكاً | مَنْ ذكاً | W lemma «من ذكا حزرا» + Q |
| 247 | 2nd | ثمَّ | ثمَّ | kept as K (Q misplaces the shadda on ث) |
| 251 | 1st | وأنَّ ما | وإنَّ ما | the Qur'anic word is «إِنَّمَا عِندَ اللَّهِ» (النحل ٩٥), Q |
| 252 | 2nd | خَلَفْتُونِى | خَلَفْتُمُونِي | meter + Q + the Qur'an (الأعراف ١٥٠) |
| 253 | 1st | أتاكُمُ | وَآتَاكُمْ | Q; W's editor notes that «أتاكم» (in some copies and in the matn printed with Ibn al-Qasih) «خلاف الوزن» |
| 254 | 2nd | يَلىِ | يَلِي | misplaced kasra (Q: يَلِيْ) |
| 267 | 1st | التحريِمِ | التحريمِ | misplaced mark: K types it one letter early |
| 274 | 2nd | تُرَى | يُرَى | W lemma «بالعراق يرى» + Q |
| 275 | 2nd | نصيُرُهم | نُصَيْرُهم | misplaced damma; vocalization from Q |
| 276 | 1st | ثَّم | ثمَّ | shadda typed on ث instead of م; vowel of ث left blank (ثَمَّ or ثُمَّ) |
| 277 | 2nd | جُبِرَا | حُبِرَا | W («قد حبرا: يقال حبرت الخط إذا حسنته») + Q |
| 278 | 1st | حيَن | حينَ | misplaced mark: K types it one letter early |
| 279 | 2nd | الذَّى | الذي | stray fatha on ذ; ى → ي |
| 281 | 1st | غيُر | غيرُ | misplaced mark: K types it one letter early |
| 281 | 1st | اللِه | اللهِ | misplaced mark: K types it one letter early |
| 286 | 1st | بيَن | بينَ | misplaced mark: K types it one letter early |
| 286 | 1st | المحسنيَن | المحسنينَ | idem |
| 287 | 1st | وَزَرَا | وَزَرٌ | Q («فلا وَزَرٌ: جواب الشرط، أي فلا ملجأ»); K repeats the rhyme by error |

## Differences where K was kept (selection)

| Verse | K (kept) | Q | Why kept |
|---|---|---|---|
| 31 | فرأى **في** خُلْفِهِم | من | base; no witness against K |
| 36 | **وسار** في نُسَخٍ | وصار | W «وسار في نسخ منها» |
| 44 | ولا تعارُضَ **مع** حسنِ الظنون | في | W; Q itself notes «في نسخة: مع» |
| 50 | ومِيكالَ **فيها** | فيه | base (البقرة) |
| 53 | ونافعُ **في** التحريم | بالتحريم | base; meter equal |
| 54 | إبراهيمَ … **انتشرا** | إبرٰهِمَ … انتثرا | W «ونعم العرق ما انتشرا» |
| 58 | رسالتِهْ | رسالاتِهْ | W lemma «رسالته» |
| 59 | والأَوْلَيْنِ | والأَوْلَيانِ | W «قيمًا والأولين» |
| 81 | حاشا | حاشَ | W verse line «حاشا بحذف صح مشتهرا» |
| 113 | خاشعًا | خُشَّعًا | W «وقوله خاشعا بخلافهم» |
| 122 | الظنونَ الرسولَ والسبيلَ | الظنونا الرسولا والسبيلا | meter (with the alifs the hemistich would end −u− instead of uu−) |
| 124 | سلاسلًا وقواريرًا | سلاسلَ وقواريرا | meter |
| 147 | مُغْتَفِرا | مُفْتَقِرا | W «وإنما قال مغتفرا»; W's editor: so in the matn printed alone and with Ibn al-Qasih |
| 170 | تَسَلْنِ | تَسْأَلْنِ | W «وتسلن» |
| 177 | إذ سَبَرَا | سُبِرا | W «إذ سبرا» |
| 206 | حينئذ (no و) | وحينئذ | meter |
| 207 | أُنَبِّئُكُمْ | أَؤُنَبِّئُكُمْ | meter |
| 218 | الخلافُ يُنَشَّـ / ـؤُا | الخلافُ ومَن / ينشؤا | meter; W «بالواو مستطرا» |
| 255 | فاقطعوا … فصِلوا | قطعوا … وصلوا | base; meter equal |

## مواضع للتأكد (check against a vocalized printed edition, e.g. أيمن سويد)

- **219** «وبعدَ را بُرَآءُ الواوُ معْ ألفٍ»: taken from Q because K («وبعدُ را بُرآؤُا مع ألفٍ») lacks «الواو» and a syllable; al-Qari explains this wording («قدّم وقصر للوزن»), but I could not make the scansion fully certain.
- **253** «وقلْ وَآتَاكُمْ مِنْ كُلِّ مَا قَطَعُوا»: from Q; W's editor says «أتاكم» (K's reading) is «خلاف الوزن». The scansion of Q's wording is also not clean to me.
- **156** word order «الآنَ أتى ءامنتُمْ ءأنْتَ» (K) vs «آلآنَ آتَى أَأَنْتَ آمَنْتُمْ» (Q). K kept.
- **263** «سُبَرَا» (K) vs «سُوَرا» (Q); W's OCR is ambiguous («وزخرف برا»). K kept.
- **276** «ثمَّ كلُّهم»: K has the shadda on ث; moved to م, vowel of ث left blank (ثَمَّ or ثُمَّ).
- Vowel conflicts where K was kept although Q's reading is at least as likely: 57 وقَاتِلُوا/وقَاتَلُوا، 88 «بحذفِ نافعٍ»/«بحذفٍ نافعٌ»، 123 كلِّهِمِ/كلُّهُمُ (al-Qari: «بالرفع وإشباع الميم»)، 130 والسلامَ/والسلامُ، 209 بَرَى/بُرَا، 212 «جزآؤُا حَشْرٌ … والعقودُ» (Q: حشرٍ … والعقودِ)، 260 «واصِلُهُ الْـ | ـإمامِ» (Q: وأَصْلُهُ … الإمامُ)، 283 «ما شان شانٌ … مسدَّدةٌ فِقْدانَ» (Q: شأنَ … مسدَّدةً فِقدانُ)، 286 سَرَا (W explains «السُّرى»). Full list at the end of `build-log.txt`.
- 174: Q's footnote shows the manuscripts differ (يشفيني/ويؤتيني/يستعجلوني with or without ya); K's words kept with the ya-less ending; «يستعجلون» (K) vs «تستعجلون» (Q) kept as K.

## إكمال التشكيل (٢٠٢٦-١١-٠٥)
النص الأساس مشكول نحو النصف؛ أكمل الذكاء الاصطناعي الشكل على وزن البسيط مع إبقاء كل حركة من المصدر، وفُحص بسكربت أن الحروف لم تتغير، وصُحّحت ١٢ حركة يقتضيها الوزن أو الإعراب (منها: وَهْوَ، وَمَعْ، مَنَوٰةِ، رُسْلُهُمْ، الْمُنَافِقِينَ، بِجُودِكَ)، وحُذفت مسافة زائدة في «وَالْعَمِيمِ».
مواضع للتأكد (وزن أو قراءة): الأبيات في الأسطر L37، L82، L113، L161 (أَتَى/آتَى)، L235، ومواضع النقل L149، L159، L199، L206، L210، L307، وL140 «الفاعلين»، وL154 «مختبِرا/مختبَرا»، وL219.
