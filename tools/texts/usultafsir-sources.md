# Texts report — مقدمة في أصول التفسير لابن تيمية (`usultafsir.json`)

Comparison method: the base and each witness were cut into words, stripped of harakat, tatweel and punctuation, with alef/yaa/taa-marbuta/hamza seats unified. They were then aligned word by word by script (unique 4-gram anchors plus LCS between anchors), with no comparison by eye. Qur'an quotes were left out of the comparison because they are replaced by the Mushaf text.
Scripts: `tools/texts/usultafsir-build/`. `extract.js` reads the Shamela pages into `out/shamela.json`. `text.js` cleans and chapters the text into `out/base.json`. `collate.js` writes `out/collate-ws.txt` and `out/collate-mf.txt`. `build.js` applies `fixes.json`, the Qur'an replacement and the cutting into units, writes `usultafsir.json`, and logs everything in `out/build-log.json`. `fetch-ws.js` downloads the Wikisource pages. Raw downloads: `tools/texts/raw/usultafsir/`.

## ⚠️ Vocalization: no vocalized source found
I found **no fully vocalized digital edition** of the Muqaddima. These were searched or checked:
- Shamela: 12081 (the matn), plus the commentaries 13899 (الطيار), 21521 (ابن عثيمين), 3052 (صالح آل الشيخ) and 7371. All are unvocalized.
- متون طالب العلم (القاسم): the series does not include this work.
- ketabonline: the work could not be found.
- Wikisource (standalone, and in مجموع الفتاوى): unvocalized.
- OpenITI: a copy of Shamela 12081.
- archive.org copies: OCR scans, which are unreliable for harakat.

Following the rule «ناقل لا مفكر», I did **not** add harakat myself. The text is as the source prints it: **1.4% of words (117 of 8,538, outside the Qur'an) carry any mark at all**, about 0.8 marks per 100 letters.
**The Qur'an is fully vocalized**: 74 quotes in ﴿﴾, taken from the Mushaf.
**Decision needed:** publish the text unvocalized, or wait for a vocalized print edition (for example from a teacher or a scanned student edition) to collate against.

## Sources
- **Base: المكتبة الشاملة 12081** «مقدمة في أصول التفسير لابن تيمية», ط. دار مكتبة الحياة، بيروت (١٩٨٠م). Its page numbers match the print. This is the al-Shatti / Muhibb al-Din al-Khatib recension, with editor's section headings. Pages 1–56: https://shamela.ws/book/12081/1 … /56
- **Check 1 (WS): Wikisource «مقدمة في التفسير»**, standalone, with the same contents and order, including the two appended fatwas: https://ar.wikisource.org/wiki/مقدمة_في_التفسير
  It is an independent but careless copy, with many dropped words and typos («ونعود», «تلبس», «تعين»). Result: 365 hunks, almost all of them errors in WS.
- **Check 2 (MF): مجموع الفتاوى ج13 on Wikisource.** I used the 8 pages from «مقدمة في التفسير وعلوم القرأن» to «فصل في ذكر من انحرف عن القرآن الكريم», plus «سئل عن جمع القراءات السبع»: https://ar.wikisource.org/wiki/مجموع_الفتاوى/المجلد_الثالث_عشر
  It agrees with the base almost word for word: 44 hunks, mostly the spacing «و الحمد». It even shares typos with the base («مذهبم», «عبد الجابر»). So it is **the same digital lineage**, not an independent witness. It confirms the wording but cannot catch shared typos.
- **Qur'an: api.quran.com `text_imlaei`** (the file `raw/tawhid/quran_imlaei.json`, through `quran.js` copied from `tawhid-tools`).

## Count and structure
- **11 chapters, 371 units, about 9,090 words.** The work is prose and has no traditional paragraph count. The base has 186 source paragraphs. Every word of the base is kept in order: a final collation shows only the corrections listed below.
- **Chapters** follow the base's «فصل [ … ]» headings. These headings were added by the editor, not written by the author. The brackets were dropped.
  - The khutba before the first فصل is «مقدمة المؤلف».
  - «فصل [في نوعي الاختلاف في التفسير]» has no text of its own. It is the `group` of its two sub-chapters «النوع الأول…» and «النوع الثاني…».
- **Units:** cut at sentence ends (. ؟ !). A sentence over 40 words is cut further at ؛ then at ، or :. A unit is never cut inside ﴿﴾ or «». A source paragraph under 8 words («فالجواب:», «رب يسر وأعن برحمتك») is joined to the next unit. Range: 8–46 words. Only 3 units are over 40, and each is one long verse quotation.
- **Removed:**
  - The compiler lines «وقال شيخ الإسلام:», the repeated title, author and basmala lines on page 3, and «تمت بحمد الله ومنه».
  - Two editor's glosses in square brackets: «[أى الصحابى]» after «قول الصاحب», and «[أي: نائم قد انحنى في نومه]» after «حاقف».
  - Square or round brackets used to mark terms («ولفظ [الشك]», «(تفسير القرطبي)»). The bracket marks go; the words stay.
  - The sura references «[النحل: ٤٤]».
  - Straight quotes "…" are written «…».
- The basmala is in the `basmala` field.

## ⚠️ Decision needed: the last two chapters
«فصل: أقرب التفاسير إلى الكتاب والسنة» (21 units) and «فصل: جمع القراءات السبع» (5 units) are **separate fatwas**. Each starts «سئل شيخ الإسلام…». The base edition and WS append them after the Muqaddima.
- In مجموع الفتاوى the Muqaddima runs on into other chapters instead («فصل في ذكر من انحرف عن القرآن…»). «جمع القراءات» is a separate question there, and «أقرب التفاسير» is not in that sequence at all.
- The common commentaries (ابن عثيمين، الطيار) end with «تفسير القرآن بالرأي».

I kept both fatwas to follow the base «بلا حذف». **Remove chapters 10–11 if the site should end where the commentaries end.**

## Corrections of clear misprints (`usultafsir-build/fixes.json`, applied and logged by `build.js`)
| Base | Written as | Reason |
|---|---|---|
| إذا قرا البقرة وأل عمران | إذا قرأ البقرة وآل عمران | Missing hamza (قرأ، آل عمران) |
| أن يقرآ قوم | أن يقرأ قوم | Typo «يقرآ» |
| هو إتباع القرآن | هو اتباع القرآن | Hamzat al-wasl |
| المشار أليه | المشار إليه | Hamza goes under the alif |
| السلف، ووقد لا يجوز | السلف، وقد لا يجوز | Doubled waw; WS «وقد» |
| أبو يعلي | أبو يعلى | Alif maqsura spelling |
| وأبى العالية / عمر بن أبى زائدة / عن أبى الزِّنَاد | أبي | Yaa of the five nouns |
| لا يخفي عليه منه شىء | لا يخفى عليه منه شيء | Spelling |
| ما لاطريق | ما لا طريق | Word spacing |
| أصول مذهبم | أصول مذهبهم | Typo; WS «مذهبهم» |
| للقاضي عبد الجابر | للقاضي عبد الجبار | Typo; WS «عبد الجبار» |
| الزمخشري، أن القرطبي | الزمخشري، أم القرطبي | Typo; WS «أم» |
| فإنه يذذكر / بالأساانيد | يذكر / بالأسانيد | Doubled letter; WS |
| بين المزلتين | بين المنزلتين | Dropped letter; WS |
| كما لايمى كافرا | كما لا يسمى كافرا | Dropped letter; WS «لا يسمى» |
| لايخرجون منها | لا يخرجون منها | Word spacing; WS |
| حشى بها الزمخشري | حشا بها الزمخشري | Spelling (حشا يحشو); WS «حشا» |
| كان النبي صلا الله | صلى الله | Spelling |
| أو فقرهم على القراءة | أو يقرهم | Typo; WS and MF «يقرهم» |
| القرآن قرأة الصحابة | قرأه | Taa marbuta printed in place of the pronoun ha' |
| و «المقصود هنا» أنها | والمقصود هنا أنها | Quotation marks in the wrong place in the source |
| وحديث على الطويل / وعلى في الخلافة / على وفاطمة | علي | The name علي printed with alif maqsura |
| فى علي بن أبي طالب | في | Spelling |
| والعلم أما نقل … وأما قول … وأما موقوف | إما … وإما … وإما | Distributive «إما» printed as «أما». The same sentence has «فإما مزيف» in the base. |
| أما محسن، وأما عادل، وإما ظالم | إما محسن، وإما عادل | The same, and the third one in the base is «وإما» |
| قالوا: أن الله لا يرى، وأن القرآن مخلوق، وإنه … | إن … وإن | «إنّ» after قال. The rest of the same list in the base has «وإنه … وإنه». |
| يقول القائل: أن ابن شهاب | إن | «إنّ» after قال |
| أحمد بن تيميه | تيمية | Taa marbuta |

## Qur'an
- There are 74 quotes. Each is located by approximate skeleton matching, using the base's sura and aya reference where it gives one. All 74 matched the Mushaf exactly (edit cost 0 on the letter skeleton). Each was replaced by the imla'i Mushaf text in ﴿﴾. Consecutive verses are joined with « * », as in `thalatha.json`.
- One quote without a reference, «رُحَمَاء بَيْنَهُمْ», was first placed in Hud 43. It is now pinned to الفتح 29 in `qhint.json`.
- «{لاريب}» became ﴿لَا رَيْبَ﴾.

## Wording differences kept as in the base
- WS has many omissions and variants: for example «عشرات» for عشر, «قول» for قولي, and «وهو محرم … حلالا» for «وهو حلال … حرامًا» (the Maymuna example). In every such case MF agrees with the base, so the base was kept. The full list is in `usultafsir-build/out/collate-ws.txt`.

## مواضع للتأكد
1. All the corrupt passages below are in «أقرب التفاسير», and WS is corrupt in the same places:
   - «وهؤلاء **منصب** الزمخشري» (WS «هؤلاء كنصب»).
   - «فإن مذهبه مذهب **المغيرة بن علي** وأبي هاشم» (WS «االمغيرة وعلي». The intended name is probably أبو علي الجبائي).
   - «نوعان: **مشايخة وخشبية**» (WS «مشايخية»).
   - «سمى **ابن التومرت** أصحابه».
   - «كمقاتل **بن بكير**».

   They were left as in the base. A printed edition is needed to fix them.
2. The hamza of أن/إن and أما/إما was checked only in the patterns listed above. The normalized collation cannot see hamza differences, so others may remain.
3. The base prints a few words with harakat (for example «بَيَّنَ», «الغَثِّ», «نَقَلَتَه», names such as «المُسَيَّب»). They were kept as printed and were not checked.

## قرار بعد التقرير
- حُذف الفصلان الأخيران (فتوى أقرب التفاسير، وفتوى جمع القراءات السبع): فتويان ألحقتهما الطبعة بالمقدمة، والشروح المشهورة تنتهي عند «تفسير القرآن بالرأي».
- الشكل أكمله الذكاء الاصطناعي (voc/usultafsir)، لعدم وجود نسخة مشكولة منشورة.

## تصحيح الألفاظ بعد التشكيل (2026-11-04)
المصادر المعتمدة للتحقق:
- **مف-ش**: مجموع الفتاوى ج١٣ في الشاملة (كتاب 7289، عبر turath.io)، وهي نشرة مصححة بما استدركه محققا ط. الوفاء على طبعة ابن قاسم، وبكتاب «صيانة مجموع الفتاوى من السقط والتصحيف» للفهد.
- **عث**: متن المقدمة داخل «شرح مقدمة التفسير» لابن عثيمين، ط. دار الوطن ١٤١٥ (الشاملة/turath 21521).
- **وم**: ويكي مصدر «مقدمة في التفسير» (raw/usultafsir/wikisource-muqaddima-fi-tafsir.wiki).
- **ابن كثير**: مقدمة تفسيره (ت. سلامة، الشاملة 8473)، وهو ينقل هذا الفصل عن ابن تيمية.
- لم أجد تحقيق عدنان زرزور منشورًا على الشاملة.

ثم قابلتُ النص كله، بعد حذف الشكل، كلمةً كلمةً مع **مف-ش** (git diff، 106 مواضع). أكثرها ﷺ وواو العطف وبن/ابن، وأدرجتُ الحقيقي منها في الجدول. وبحثتُ بسكربت في النص المشكول عن: ألف مقصورة عليها حركة (ىَ/ىِ)، وياء متطرفة بعد فتحة أو تنوين فتح، وياء مكسور ما قبلها كُتبت «ى»، و«أبو» ملزوقة بما بعدها، و«مافي»، وهاء ساكنة في آخر الكلمة، وكلمات مكررة. كل ما ظهر مذكور في الجدول، والباقي سليم («ماجهْ» علم).

| الموضع | قبل | بعد | الشاهد |
|---|---|---|---|
| 0:6 | هُدِىَ | هُدِيَ | مف-ش «هدي»، عث «هدي». مبني للمجهول |
| 2:12 | بِالْمَعْنَي | بِالْمَعْنَى | مف-ش، وويكي مف |
| 2:26 | فَأُرِىَ | فَأُرِيَ | مف-ش «فأري» |
| 2:48 | عَقِبَة | عَقِبَهُ | مف-ش، عث، وم، وويكي مف كلها «عقبه» |
| 2:69 | مَضْمُونًا | مَضْمُومًا | مف-ش وعث «مضموما» (من الضم، مقابل «مقروءًا مظهرًا») |
| 3:13 | يُرْوَي | يُرْوَى | مف-ش، وويكي مف |
| 3:19 | وَيُرْوَي | وَيُرْوَى | مف-ش «ويروى» |
| 3:33 | وَمَعْنًي | وَمَعْنًى | مف-ش، عث، وويكي مف |
| 3:36 | فَلَا يَحْتَاجُ | بَلْ يَحْتَاجُ | عث ووم «بل يحتاج»، والسياق يقتضي الإثبات. (مف-ش ما زال «فلا») |
| 3:39 | رُوِىَ | رُوِيَ | مف-ش «روي» |
| 3:43 | خِبْرَهْ | خِبْرَةً | مف-ش، عث، وويكي مف «خبرة باطنة» |
| 3:60 | أَبُوحَامِدٍ | أَبُو حَامِدٍ | مف-ش وعث |
| 3:69 | وَغَلْطَةٌ فِيهِ عُرِفَ | وَغَلَطُهُ فِيهِ عُرِفَ | مف-ش، عث، وويكي مف «وغلطه» |
| 3:75 | رَأَي | رَأَى | مف-ش، عث، وويكي مف |
| 4:15 | الْهَمَدَانِيِّ | الْهَمَذَانِيِّ | عث «الهمذاني». القاضي عبد الجبار منسوب إلى هَمَذان (مف-ش «الهمداني») |
| 5:9 | يُرْضِى | يُرْضِي | مف-ش، عث، وابن كثير (ت. سلامة) «يرضي». فعل مضارع من أرضى، و«رسولَ» مفعول به |
| 6:3 | تَنَاوَلُهُ الْمَطَايَا | تَنَالُهُ الْمَطَايَا | عث ووم «تناله المطايا»، وهو اللفظ المعروف للأثر (مف-ش «تناوله») |
| 7:2 | مَافِي | مَا فِي | مف-ش، عث، وم |
| 8:38 | رُوِىَ | رُوِيَ | مف-ش «روي»، عث |
| 8:14 / 8:15 | «… مَا لَا أَعْلَمُ؟» ثم الفقرة التالية تبدأ بـ«مُنْقَطِعٌ وَقَالَ…» | «… مَا لَا أَعْلَمُ؟ مُنْقَطِعٌ.» ثم الفقرة التالية «وَقَالَ…» | هي من كلام المصنف وليست تعليق محقق، فلم تُحذف. شواهدها: في مف-ش «- منقطع -» داخل المتن، وفي عث «إسناده منقطع» في المتن، وابن كثير في مقدمته ينقل الموضع نفسه «ما لا أعلم. منقطع». نُقلت الكلمة إلى آخر الفقرة السابقة لأنها حكم على أثر أبي بكر، ولم تتغير الفقرات عددًا ولا ترتيبًا |

مقترحات لم تُطبق:
- 5:9 و2:48 «المساند» بقيت كما هي. هي في مف-ش وفي ابن كثير بلفظ «المساند»، وهو جمع صحيح لمسند. أما «المسانيد» فلفظ عث.
- 2:45 «عُنِيَ بهذه الآية» بقيت كما هي (في مف-ش «عنى»). الوجهان صحيحان.
- 1:4 «ثماني سنين» (في مف-ش «ثمان»): ما في النص صحيح.
- 3:28 «اختلاقه» (في مف-ش «اختلافه»): ما في النص هو الصواب، أي الكذب.
- 8:2 «حبان بن هلال» (في مف-ش «حسان»): ما في النص هو الصواب، كما نبّه الفهد.
- «إن/أن» بعد القول (2:37، 2:42، 4:42، 5:1): ما في النص صحيح.
- البنود المطبقة سابقًا في التشكيل نفسه سليمة وقد تحققتُ منها: 2:14 وَهُدَاهُ، 2:19 اتِّبَاعُهُ، 2:36 أَوْسِ، 2:74–75 الْإِخْوَة، 3:23 ابْنِ، 3:26 فَإِنَّ، 3:73 وَأَنَّ، 4:2 بَقِيِّ بْنِ مَخْلَدٍ، 4:8 أَسْبَقَ، 6:6 أَنْبَأَنَا، 6:28 مَسْأَلَةٍ، 8:30 الضَّبِّيُّ، 8:35 السَّفَرِ، 8:40 أُلْجِمَ.
