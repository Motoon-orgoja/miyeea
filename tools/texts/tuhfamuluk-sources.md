# Texts report: تحفة الملوك في فقه مذهب الإمام أبي حنيفة النعمان (`tuhfamuluk.json`)

Author: زين الدين أبو عبد الله محمد بن أبي بكر بن عبد القادر الرازي الحنفي, author of «مختار الصحاح» (d. 666 AH or after). The work is prose, so it has paragraphs and no verses. Madhhab: Hanafi (`"m":"حنفي"`).

## Sources
- **Wording base: the Qasim edition.** المكتبة الشاملة, book 46: «المسبوك على منحة السلوك في شرح تحفة الملوك», د. عبد المحسن بن محمد القاسم, 1st ed. 1428 AH, 4 vols. Each page prints the matn of the Tuhfa at the top, above the text of al-ʿAynī's commentary. The editor says he based the matn on **four manuscripts of the matn**. This matn is unvocalized but punctuated. It is the only edition here that has the author's opening (الحمد لله، وسلام على عباده الذين اصطفى …).
  https://shamela.ws/book/46 (matn on pages 16–1459). Raw pages: `raw/tuhfamuluk/qasim/q46-*.html`. Extracted matn: `raw/tuhfamuluk/qasim-matn.txt` and `qasim.txt`.
- **Collation witness and source of harakat: the Dar al-Bashair edition.** المكتبة الشاملة, book 6173: «تحفة الملوك», اعتنى به د. عبد الله نذير أحمد, دار البشائر الإسلامية, Beirut, 1417 AH. It is **partly vocalized** (about 41% of letters carry a mark). The editor splits the text into 490 numbered items, each with his own topic title, for example «١ - أقسام المياه» or «٧ - فروض الوضوء». These titles are not part of the matn. This edition has no author's opening.
  https://shamela.ws/book/6173. Raw pages: `raw/tuhfamuluk/shamela-6173-*.html`. Cleaned text: `bashair.txt`.
- **Arbiter: al-ʿAynī's commentary.** «منحة السلوك في شرح تحفة الملوك» by بدر الدين العيني, edited by د. أحمد عبد الرزاق الكبيسي (Qatar Awqaf 1428 AH), in OpenITI `0855BadrDinCayni.MinhatSuluk.Sham19Y0013784` (raw: `raw/tuhfamuluk/openiti-minha-Sham19Y0013784.txt`). It quotes the whole matn piece by piece as «قوله: (…)».
- **Not used as an independent witness:** OpenITI `JK000114` (`raw/tuhfamuluk/openiti-JK000114-ara1.txt`). It is the Dar al-Bashair edition again, with the same page numbers and the same numbered titles. It is kept for reference only.
- **No fully vocalized copy was found.** shamela.ws, ketabonline (no copy of the Tuhfa), ar.wikisource (no copy) and OpenITI were searched.

## Method (scripts in `raw/tuhfamuluk/scripts/`)
1. `qasim-matn.js` takes every paragraph above the running head «منحة السلوك» on each page. `prep.js` removes the footnote numbers, the volume title pages and the copyist's colophon (تمت النسخة …), and turns the bracketed headings into chapter breaks. It produces both line files.
2. `collate.js` runs an LCS word diff for each كتاب. Before comparing, it removes harakat and tatweel, unifies alif, ya, ta marbuta and hamza seats, and ignores punctuation. Qasim has 12,722 words and Bashair 14,268, and 1,010 places differ (`tm-diff.txt`). `candidates.js` sorts these hunks into three kinds: 563 Bashair-only (most of them the editor's 490 topic titles), 88 Qasim-only and 359 substitutions (many are spelling or punctuation only). For each hunk it checks whether the reading occurs, with its neighbouring words, in the Minha (`tm-candidates.txt`).
3. **Rule for wording:** the Qasim text stands, except where Bashair and the Minha's quotation of the matn agree against it. That makes two witnesses against one. Every such place was checked by eye in the Minha. Places where the Minha match fell in al-ʿAynī's own explanation rather than inside «قوله: (…)» were rejected; those were كان، أي شاة، أو ترك، وأعوذ بمعافاتك، الإمام/الإتمام، صلى الله ×2، فما دونها in طواف الصدر، and يحجبان. In all, **35 places** were taken from Bashair:

| Kitab | Qasim | Taken (Bashair = Minha) |
|---|---|---|
| الطهارة | ومن الأذن إلى الأذن | ومن **شحمة** الأذن إلى **شحمة** الأذن |
| الطهارة | من جنس الأرض. | من جنس الأرض **كالتراب والرمل والحجر والنورة والكحل والزرنيخ**. |
| الطهارة | وكل شيء صقيل … تطهر | **يطهر** |
| الصلاة | وفي يوم الغيم تعجيل العصر | **يعجل** (parallel to «ويؤخر الباقي») |
| الصلاة | غُسِّل وصُلِّي عليه / على شقه موجهًا | غُسِّل **وكفن** وصلي عليه / على شقه **الأيمن** |
| الزكاة | وما غالبه منهما غش / أن تبلغ قيمتها / أو دقيقه، أو صاع | **غلبه** / **يبلغ** / أو دقيقه، أو **سويقه أو** صاع |
| الصوم | المريض أو المسافر / ولو أفسدها | المريض **والمسافر** / ولو **أفسد** |
| الجهاد | في الطريق / ولا يبتدأ بالسلام / وقتل رجل | في **الطرق** / ولا **يبدأ** / **فقتل** |
| الصيد والذبائح | حتى ماتت / صيد فقتله / ثم رماه فأنزله / في التسمية / ولو قال: بسم -بغير هاء- | حتى **مات** / صيد **آخر** / رماه **ثانيا** / في **تسميته** / **بسمل** بغير هاء |
| الكراهية | من آنية الذهب / على سطح / من المرأة ما ينظر / كل ما يحرم نكاحه | **في** آنية / **سطحه** / **إلى** ما ينظر / كل **من** |
| الفرائض | البنت أو بنت الابن / أو الاثنين / أم الأم أو أم الأب / وللبنتين / وابن الابن والجد / وتساويا / جعلوا كأنهم | **وبنت** / **والاثنين** / **وأم** الأب / **وللثنتين** / وابن الابن **والأب** والجد / **وتساووا** / **جعل** |
| الكسب والأدب | وهو الكسب الزائد / وترك المعالجة / للخدعة / هذا هو المختار | **كسب** / **فترك** / **للخديعة** / **وهذا** |

All other differences keep Qasim's reading. Some examples: إما للوضوء وإما للغسل (Bashair has the gloss «يعني في الاغتسال والوضوء»)، على ثلاثة أقسام، طاهر وطهور، اسم آخر، أفضل … The Bashair-only explanatory words that the Minha check did not confirm were not added, for example «على نفسه أو ماله», «لا يرثان مع الأب ولكن يحجبان الأم …», «أي شاة». The full list is `raw/tuhfamuluk/tm-diff.txt`, and the build log is `tuhfa-build-log.txt`.
4. **Editorial signs:** the editor's numbers are gone. Qasim's own square-bracket insertions are kept as text with the brackets removed: «من الحدث خاصة», «ولم يجرحه معه، حلَّ وكُره», «في جبل فتردى من موضع إلى موضع حتى وصل إلى الأرض», «ولا الخيل». The dashes around «صلى الله عليه وسلم» and «رحمه الله» are removed. The two Qur'anic quotations are written as ﴿…﴾, and the reference «[النساء: ١٣١]» is dropped. «القاريء» is written as «القارئ», and «الانثيين» as «الأنثيين».
5. **Harakat:** `build-tuhfa.js` aligns the final text with Bashair for each kitab. Where a word has the same letters, it copies Bashair's marks letter by letter and never overwrites a mark the base already has. It copies nothing across different hamza seats; four words (إلا/ألا، أنها/إنها، أن/إن، واتبعه/وأتبعه) were therefore left without marks. Words taken from Bashair keep its marks. It then cleans tanween that appears twice («مضفورًاً») and marks that are doubled. Chapter titles were vowelled by hand; they are unambiguous.

## Structure and count
- There are 10 كتب, as the author says in his opening («واقتصرت فيه على عشرة كتب»): الطهارة، الصلاة، الزكاة، الصوم، الحج، الجهاد، الصيد والذبائح، الكراهية، الفرائض، الكسب والأدب. They are preceded by the author's opening (مقدمة المصنف). Bashair numbers the same text as 490 items.
- The text has 65 chapters. Each chapter is either the opening of a kitab or one of its فصل/باب headings, as Qasim prints them; the kitab is given in `group`. There are 538 paragraphs of 11–40 words, 12,733 words in all, cut at the end of a sentence. Untitled «[فصل]» headings appear as «فَصْلٌ».
- The text ends at «فعليك أيها الأخ بالتقوى … ونعيم الآخرة». Qasim notes that each manuscript closes differently after this. Bashair adds «والسلام وصلى الله على محمد وآله وصحبه وسلم وحسبنا الله ونعم الوكيل» and a colophon dated 761 AH. These copyists' closings were not included.

## Vocalization
- **About 42% of letters carry a mark, and 16% of words are fully vowelled.** The marks are Bashair's partial ones. No fully vocalized source exists, so the rest is left bare.

## Places to check
1. **Vocalization is partial.** A decision is needed: either publish it as is, or run a vocalization pass to be reviewed (as was done for القدوري and نور الإيضاح).
2. «إما للوضوء وإما للغسل» (Qasim) and «يعني في الاغتسال والوضوء» (Bashair): Qasim was kept.
3. The four bracketed insertions in Qasim (item 4 above) are kept. They come from some manuscripts only.
4. «أو سويقه أو صاع» (زكاة الفطر): the inserted words have no comma after them. That is cosmetic. (Fixed in the post-vocalization corrections below.)

## Post-vocalization wording corrections (2026-11-04)
The vocalizers listed wording errors they were not allowed to fix (`voc/tuhfamuluk/changes.txt`). Each one was checked in Qasim (Q), Bashair (B) and the Minha (M), and then the whole text was scanned by script: a word diff of the vocalized text (marks removed) against `qasim.txt`, a list of the words that occur nowhere in B or M, every single-word Q/B substitution, and an orthography scan (single letters, «يء» after kasra, «اءًا», final «ى» after kasra). Positions are `chapter:paragraph`, counted from 0. No paragraph was added or removed. There are still 538 paragraphs, all 11–40 words long, and 12,731 words in all.

**Root cause of the broken words.** In `build-tuhfa.js`, a reading that is a pure insertion from Bashair was meant to take over a full stop from the word before it. The test used `/.$/`, which matches any letter, instead of `/\.$/`. So every one of the 10 insertions cut the last letter off the word before it and added a full stop after the inserted word. The paragraph splitter then broke the text at some of those false full stops. That gave «وم شحمة. الأذن إل شحمة.», «أ سويقه أو.», «صي آخر.», «رما ثانيا.», «المرأ إلى.» and «وابن الأب والأب.». The regex is now fixed in the script. Only «كالتراب … والزرنيخ» came out right, because the word before it really did end in a full stop.

| Pos. | Before | After | Evidence |
|---|---|---|---|
| 2:0 | وَمِ شَحْمَةِ. الْأُذُنِ إِلَ شَحْمَةِ. الْأُذُنِ | وَمِنْ شَحْمَةِ الْأُذُنِ إِلَى شَحْمَةِ الْأُذُنِ | Build bug. B and M: «ومن شحمة الأذن إلى شحمة الأذن عرضا» |
| 24:1–2 | غُسِّلَ وَكُفِّنَ. ‖ وَصُلِّيَ عَلَيْهِ، وَإِنْ… | غُسِّلَ، وَكُفِّنَ، وَصُلِّيَ عَلَيْهِ. ‖ وَإِنْ… | Build bug: «غسل،» lost its comma and a false full stop split the clause. B: «ومن استهل غسل وكفن وصلي عليه» |
| 24:3–4 | عَلَى شِقِّ الْأَيْمَنِ. ‖ مُوَجَّهًا إِلَيْهَا. وَيُكْرَهُ… | عَلَى شِقِّهِ الْأَيْمَنِ مُوَجَّهًا إِلَيْهَا. ‖ وَيُكْرَهُ… | Build bug. Q: «شقه»; B and M: «ويضجع على شقه الأيمن موجها إليها» |
| 29:1–2 | أَوْ دَقِيقِهِ، أَ سَوِيقِهِ أَوْ. ‖ صَاعٌ مِنْ تَمْرٍ … أَوْ سَوِيقِهِ، وَفِي الزَّبِيبِ… | أَوْ دَقِيقِهِ، أَوْ سَوِيقِهِ، أَوْ صَاعٌ مِنْ تَمْرٍ، أَوْ شَعِيرٍ، أَوْ دَقِيقِهِ، أَوْ سَوِيقِهِ. ‖ وَفِي الزَّبِيبِ… | Build bug. B: «أو دقيقه أو سويقه أو صاع من تمر»; M: «(أو سويقه …)». The paragraph break now falls after the list. |
| 44:10–11 | فَمَرَّ بِهِ صَيْ آخَرُ. ‖ فَقَتَلَهُ، لَمْ يَحِلَّ الثَّانِي. وَلَوْ… | فَمَرَّ بِهِ صَيْدٌ آخَرُ فَقَتَلَهُ، لَمْ يَحِلَّ الثَّانِي. ‖ وَلَوْ… | Build bug. Q: «صيد»; B: «فمر به صيد آخر فقتله لم يحل الثاني»; M the same |
| 45:19 | ثُمَّ رَمَا ثَانِيًا. فَأَنْزَلَهُ | ثُمَّ رَمَاهُ ثَانِيًا فَأَنْزَلَهُ | Build bug. Q: «رماه»; B and M: «ثم رماه ثانيا فأنزله: لا يحل» |
| 49:10–11 | مِنَ الْمَرْأَ إِلَى. ‖ مَا يَنْظُرُ الرَّجُلُ إِلَيْهِ مِنَ الرَّجُلِ، وَيَنْظُرُ… | مِنَ الْمَرْأَةِ إِلَى مَا يَنْظُرُ الرَّجُلُ إِلَيْهِ مِنَ الرَّجُلِ. ‖ وَيَنْظُرُ… | Build bug. Q: «المرأة»; B and M: «وتنظر المرأة من المرأة إلى ما ينظر الرجل إليه من الرجل» |
| 53:1 | بِالِابْنِ وَابْنِ الْأَبِ وَالْأَبِ. وَالْجَدِّ، | بِالِابْنِ وَابْنِ الِابْنِ وَالْأَبِ وَالْجَدِّ، | Build bug: «الابن» lost its last letter and became «الأب». Q: «وابن الابن»; B: «بالابن وابن الابن والأب والجد» |
| 17:4 | عَلَى كُلِّ مُسْلِمٍ، مُقِيمٍ، مُصَلِّي، وَصَلَّى فِي جَمَاعَةٍ | عَلَى كُلِّ مُقِيمٍ مُصَلٍّ فِي جَمَاعَةٍ | Q only. B: «على كل مقيم مصل في جماعة»; M: «(على كل مقيم) احترز به عن المسافر (مصلي في جماعة)». B and M agree, which is the edition rule. |
| 18:0 | الْمُسَافِرُ السَّفَرُ الْمُرَخِّصُ | السَّفَرُ الْمُرَخِّصُ | Q only: the heading word leaked into the text. B: «السفر المرخص»; M glosses «(المرخص …) أي السفر المرخص» |
| 23:3 | صَلَّى فِي مَسْجِدِهِ وَسَجَدَ | صَلَّى فِي مَجْلِسِهِ، وَأَعَادَهَا، وَسَجَدَ | Not proposed by the vocalizers. B: «في مجلسه وأعادها»; M: «(حتى صلى في مجلسه) … (وأعادها) أي أعاد تلك السجدة» |
| 26:14 | أَوْ زَكَاةُ الْغَنِيمَةِ | أَوْ زَكَاةُ الْقِيمَةِ | B: «أو زكاة القيمة». M explains: «يعطي عن كل فرس دينارا، أو يقومها، ويعطي عن كل مائتي درهم خمسة» |
| 41:2 | وَيُوؤْمَرُ | وَيُؤْمَرُ | Misprint in Q. B and M: «ويؤمر الذمي» |
| 41:4 | بَقَاكَ | بَقَاءَكَ | Not proposed. B: «بقاءك»; M: «بقائك» (the hamza in both) |
| 45:7 | رُمْحٍ مَنْضُوبٍ | رُمْحٍ مَنْصُوبٍ | Misprint in Q: «منضوب» has no sense here. B: «منصوب» |
| 45:25 | وَكَلْذَا | وَكَذَا | B: «وكذا»; M: «(وكذا لو رمى بالسمكة)» |
| 50:12 | قِيمَةَ الْأَجْرِ | قِيمَةَ الْآخَرِ | B: «قيمة الآخر». M: «يضمن صاحب النعامة قيمة اللؤلؤة لصاحبها» |
| 52:1 | وَأَبْنَائِهِمْ | وَأَبْنَائِهِمَا | Not proposed. B and M: «والعم لأب وأم أو لأب وأبنائهما» |
| 10:18, 19:2 ×2 | يُومِيءُ | يُومِئُ | Spelling only (hamza after kasra), like «القارئ» |
| 31:0 | وَالْمُخْطِيءِ | وَالْمُخْطِئِ | Spelling. B: «والمخطئ» |
| 32:5 | بَرِيءَ مِنْ مَرَضٍ | بَرِئَ مِنْ مَرَضٍ | Spelling of the verb |
| 34:0 | وَرِدَاءًا | وَرِدَاءً | Spelling. B: «ورداءً» |
| 51:4 | هَوُلَاءِ | هَؤُلَاءِ | Spelling |
| 63:3 | وَيَعْنِى | وَيَعْنِي | Spelling. B: «ويعني» |

**Proposed but not changed** (the sources do not prove the other reading):
- 21:0 «فذهب إلى جماعته»: Q, and M quotes «(إلا أن يكون إماما أو مؤذنا فذهب إلى جماعته)». Only B has «فيذهب».
- 26:13 «إلى أربعمائة، أربع شياه»: no witness has «ففيها». B has «ثم أربع شياه».
- 47:5 «بسمل بغير هاء»: B and M agree. The proposed «بسم الل» is not attested.
- 2:12 «يقظانًا»: Q and B both write it this way. It is a known variant, so it was left.
- The harakat-only items in `changes.txt` (15:2، 34:2، 34:13، 36:2، 36:6، 36:8، 40:15، 41:2 الزنار، 41:4، 44:0، 45:2، 45:10، 46:1، 48:8، 49:0، 49:8، 63:4) were already applied in the vocalized text. The check confirmed this.

**Found by the scan and kept as Q** (Q's reading makes sense, or Q and M agree against B): 40:13 «وتؤخذ من القسيسين» (M: «ويؤخذ»; B «ولا تؤخذ» is wrong); 31:5 «ترابا مشوبا» (M agrees); 26:22 «ولنصب» (B «ولغصب» is a misprint); 51:5 «فلها»; 10:28 «الأولتين» (B «الأوليين»); 45:6 «أو جرة» (B «آجرة», and M does not quote it); 50:7 «والغزو» (B «والغزاة», M «والغزوات»).
