# Texts report — قرة الأبصار في سيرة المشفع المختار (`qurra.txt`)

Poem by عبد العزيز بن عبد الواحد اللمطي المكناسي الميموني (Ibn al-Qadi, جذوة الاقتباس 2/453, says he died in Medina «قرب الثمانين وثمانمئة»).
Meter: الرجز. **398 verses**, in 20 sections.
Verse numbers below are the numbers of the final file (1–398). They match the numbering of the archive.org edition (Q).

Scripts and their outputs are in `qurra-build/`:
- `parse.js` → `K.json`, `D.json`, `O.json`
- `collate.js` → `assembled.json` and `collation.txt`
- `collate2.js` → `collation2.txt`
- `collate3.js` → `collation3.txt`
- `build.js` → `qurra.txt` and `build-log.txt`

How the comparison was done: harakat and tatweel were removed, alef, yaa, taa marbuta and hamza forms were unified, and the comparison was word by word, by script. The raw files are in `raw/qurra/`.

## Sources

**No fully vocalized digital copy was found.** I checked shamela.ws online: book 37402 is a «مستودع» book and returns a 404. I also checked Arabic Wikisource, alukah, elmpedia, mahdara.org, the mandumat blog and archive.org. Every digital text I found is either unvocalized or partly vocalized. The vocalized printings exist only as images or as PDFs with broken fonts.

| Code | Source | Use |
|---|---|---|
| **K** | جامع الكتب الإسلامية 12554 «قرة الأبصار (نظم)», from الشاملة الذهبية, edited by عبد الله ولد إسلم ولد فتى (1418هـ): https://ketabonline.com/ar/books/12554. Raw file: `raw/qurra/ko12554.json`. | **Base text for verses 1–342 and 395–398.** Only about 11 % of letters carry a mark. |
| D | elmpedia «طبعات أخرى» .doc of the same edition: https://elmpedia.com/books/1035. Raw files: `elmpedia-1035.doc` and `elmpedia-1035.txt` (antiword). | Identical to K word for word and mark for mark. The only differences are two tatweels. |
| O | OpenITI `0880IbnCabdWahidMaymuni.QurratAbsar.ShamAY0037402-ara1` (Shamela 37402, the same edition, unvocalized). Raw file: `openiti-37402.txt`. | Identical wording to K, and the same 346 lines. |
| **Q** | archive.org `qura_20210419` «قرة الأبصار في سيرة المشفع المختار», 398 numbered verses, typeset with partial harakat: https://archive.org/details/qura_20210419. The PDF text layer is unusable (broken font), so I used the page images (`raw/qurra/qura_20210419-pages/`). | **Base text for verses 343–394.** I transcribed these verses by hand from the images: `raw/qurra/Q-343-398-transcribed.txt`. For verses 1–342, I spot-checked pp. 2, 4–6, 10 and 18: Q is the same text as K, with the same harakat, so it is **not** an independent witness for 1–342. |
| **N** | «نزهة الأفكار في شرح قرة الأبصار» by عبد القادر بن محمد سالم المجلسي (ت 1337هـ), Shamela-based text on ketabonline: https://ketabonline.com/ar/books/97042 (927 pages). Raw file: `ko97042.json`. | **Independent wording check** for all 398 verses (the commentary's lemmas plus its glosses). Unvocalized. |

Seen but not used: archive.org «ذخائر التراث الأدبي المغربي 45» (`ia-20220925-matn.pdf`; it reprints the K edition and uses a font with a scrambled glyph mapping). Also seen: the OCR texts on archive.org, and the image-only PDFs of منتقى الأخبار and مرتع الأبرار.

## Verse count — 398

- K, D and O have only **346** verses. That is 341 numbered verses, plus the numbers 36–37 and 217 used twice, plus two unnumbered verses (127 and 135 here).
- K stops after the وفاة section with «صلى عليه ربنا وسلما ✱ والآل والأصحاب أنجم السما» and goes straight to the colophon. It **leaves out the whole section «بيانُ ما له من الأسماء وذكرُ بعضِ الوصفِ والثناء» and the closing مناجاة (verses 343–394, 52 verses).** Most likely this is because these verses contain tawassul («بجاهك الأكرم…»). The editor has a footnote on verse 11 objecting to «بجاه المصطفى».
- Q has the full 398. N comments on every one of those verses, including «فامنن على عبد العزيز الجاني», where the poet names himself. elmpedia also gives 398 («منظومة في (398) بيتًا»). So **398 is the count of the complete poem**. The figure of «about 500» in the request does not match any source.
- **N has one extra verse** that is not in Q: «واغفر لعبدك الذليل الجان ✱ ذنوبه يا واسع الغفران». It sits between 357 and 358 (N p. 454). I did not add it, to keep the 398 of Q and elmpedia. See «مواضع للتأكد».

## Method

1. Base text: K for 1–342 and 395–398, and Q for 343–394. Each base keeps its own harakat. I added no harakat except in the corrected words below.
2. Collation against N:
   - `collation3.txt` is a verse-to-lemma diff for the 199 verses that N quotes whole.
   - `collation2.txt` is an in-order word search for the rest.
   - Every difference was judged by meter, by sense, and by N's own commentary.
3. Cleaning:
   - Removed the verse numbers, the footnote marks and the editor's abjad glosses (883، 18، 58 …).
   - Removed the brackets around the abjad words. The words themselves are kept: جفظ، حيّ، حنّ، ند، نو، مد، ح، آم، أيّ، صجّ، يد.
   - Removed tatweel, and wrote «عبدالله» as «عبد الله».
   - UTF-8 without BOM.
4. Headings: the poem's own chapter verses («بيان …», «ذكر دوابه …», «ذكر وفاته …»). Each heading is the verse's first hemistich, and the verse itself stays in the text. «## المقدمة» before verse 1 is my label (the source only has the title).
5. Vocalization of the final text: **10.7 % marks per letter, and 2367 of 3478 words have no mark at all. This is not a vocalized text.**

## Wording corrections (all logged in `qurra-build/build-log.txt`)

| Verse | Base | Written | Reason |
|---|---|---|---|
| 17 | همةْ بمنعه | همّتْ بمنعه | N «(همت بمنعه) … قريش فاعل همت», and Q. |
| 21 | إن استهم | أنِ استهم | N «(أن) بفتح الهمزة تفسيرية», and Q. |
| 28 | وردُ | وَرَدْ | Rhymes with «المُعْتَمَدْ». Q. |
| 32 | وحملةْ آمنة | وحَمَلَتْ آمنة | N, Q. |
| 59, 98, 168 | بنا | بَنَى | The verb (N; Q in 59). |
| 72 | أرْبا | أَرْبَى | The verb أربى (N). |
| **73** | ستاً وأربعين | **تسعاً** وأربعين | N's lemma and its commentary: he was 49 when the siege ended (الاستيعاب، المواهب). K's «ستاً» contradicts verse 72 and the history. K and Q both read ستاً. **Needs a decision.** |
| 116 | وهي **كما** لها من فضل | وهي **كمْ** لها | N «كم تكثيرية». «كما» breaks the rajaz, while «وهْيَ كَمْ» scans. N itself reads «هي كم» without the و, which does not scan. |
| 248 | والسغديه | والسعديه | Name of the armour (N; the sira books). |
| 309 | زكم من الأموات | وكم | Misprint (N). |
| 316 | ضمئوا | ظمئوا | ظمئ = thirsted (N). |
| 355 | مدى الز | مدى الزمانِ | Q's line is cut off. N: «مدى الزمان». |
| 357 | والأصحاب أنجم | … أنجم السما | Q's line is cut off. N p. 453, and verse 342. |
| 358 | سيءٌ قد سما | مسيءٌ قد سما | N: «قد سما صفة لقوله مسيء». |
| 373, 377 | يا ربذ، الممصطفى | يا ربّ، المصطفى | Misprints in Q (N). |
| 396 | اسمى الورى | أسمى | Hamza (Q). |
| 4, 74, 83, 322 | مادار، وبعد ما، يالها، مالم | ما دار، وبعدما، يا لها، ما لم | Spacing (N, Q). |

## Harakat corrected

- 7 أُوِلي → أُولِي (kasra on the wrong letter).
- 57 خيرَُ → خيرَ (two vowels on one letter; N: «خير منصوب»).
- 263 الُمدُّ → المُدُّ (damma on the lam of ال).

## Differences kept as in the base (N's reading for reference)

- 3 تترى / تترا. 52 خوفاً / خاوفا (an N misprint). 55 وإذ / وإذا. 59 خمسٍ / خامس (خامس breaks the meter).
- 72 وصلا / وصولا. 90 صححه من عدده / حققه من عده. 107 «أو في خلافة» and «بطيبةٍ» / «في خلافة»، «في طيبة».
- 118 هاجرا / هاجروا. 129 في خيبرا / من خيبرا. 136 ومهرُ كلٍّ كان / ومهرًا كان كلّ. 147 مع القاسم / وفي القاسم.
- 160 بدون / بغير. 165 فولدت / وولدت. 182 وعنهمُ / وعنه (Q agrees with K). 184 فضالة / وصالح (Q agrees with K).
- 191 الأنصاري / الأنصار. 205 ومات، الصفا / فمات، الصفى. 209 فأسلما / فأسلم. 228 كما / فيما.
- 296 قلبها / قلبه. 310 قد دعوتا / إذ دعوتا. 314 تظنه / تكنه. 315 إذ / إذا.
- 317 استسقيتا… استصحيتا / استسقينا… استصحينا (K keeps the second person, like the verses around it). 319 به / بها.
- In 343–394 (Q against N):
  - 375 بالمصطفى أجر / بالمجتبى جُرْني (N comments on «المجتبى» and on dropping the hamza).
  - 376 يا ربِّ عبدٌ (N's lemma drops عبد, but its gloss «عبد مضاف إليه» shows the word is there).
  - 377 والأهلينا / لأهلينا.
  - 380, 383, 385, 388, 392, 393: with or without the final ي (مجيبي، أودي، المقفّي، رجائي، ارتهاني، الجاني). 388 also has واستجب / فاستجب.
  - 389 استغثت / استعنت (N's own gloss says «واستغاث به»).
- 395 بحول هادٍ / بحول ربٍّ (K and Q / N).

## Needs a decision / places to confirm

- **Vocalization:** only about a tenth of the letters are vocalized. For a memorization text this should be completed from a vocalized printing, for example the حمود التمسماني edition (نظام يعقوبي), which elmpedia recommends, or the shakl of a Mauritanian mahdara copy. I did not complete it from my own knowledge.
- **Verses 343–394 (the names section and the مناجاة, with tawassul by the Prophet's جاه):** they are in Q and in N, and the poet names himself in them. The ولد فتى edition (K) leaves them out. I included them to get the complete 398. If the app prefers K's shortened text, delete these lines and the count becomes 346.
- These 52 verses were **transcribed by hand from page images**, and then checked word by word against N's text by script. It is still worth a visual check against the images in `raw/qurra/qura_20210419-pages/` (n17–n20).
- **The extra verse in N** «واغفر لعبدك الذليل الجان ✱ ذنوبه يا واسع الغفران» (before 358) is not included. N also has «يا ليت حرّ الوجه مني كانا ✱ لوطء نعل المصطفى مكانا» between 391 and 392, but it reads like a quotation inside the commentary.
- Verse 73 «تسعاً» (see the table above). Verse 116 «كمْ» (see the table above).
- Verse 11 «عنه بجاه المصطفى النبي»: kept as in all sources. The K editor suggests «بحبّ المصطفى» in a footnote.
- Verses 127 «وعام سبع أهديت لأحمدا…» and 135 «وعام خمسين وواحد نزل…» are unnumbered in K, but they are in K's text, in Q's numbering and in N. Kept.
- Verse 43 «وكم حوت من شرف هُذيلُ» and verse 46 «وهو ابن عامين وسدس عام» are as in all sources. The K editor notes later poets' corrections of these verses (from بغية الأبرار and سلم الأنوار), but these are corrections, not variant readings.
- Verse 42 «الاظئار» is kept as in K (N: الأظار).

## بعد التشكيل
- شكّل الذكاء الاصطناعي المنظومة كاملة (الطبعة الرقمية ~١١٪) بالرجوع إلى «نزهة الأفكار».
- تصحيحات بشهادة متن «نزهة الأفكار»: «وقبل»←«وقيل»، «فعو»←«فعوا»، «ومات»←«وماتت» (زينب)، «وهو عام ست»←«في عام ست» (والوزن).
