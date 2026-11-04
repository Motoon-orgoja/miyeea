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
4. «أو سويقه أو صاع» (زكاة الفطر): the inserted words have no comma after them. That is cosmetic.
