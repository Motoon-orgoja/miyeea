# Texts report — نور الإيضاح ونجاة الأرواح (الشرنبلالي، ت ١٠٦٩هـ) — `nuridah.json`

## 0. Vocalization: none available

I could not find a fully vocalized digital copy of this matn. I checked these places:
- Shamela, the author's page https://shamela.ws/author/1265 (five books, none vocalized).
- The ketabonline API (`backend.ketabonline.com/api/v2/books?q=…`). Its copies of نور الإيضاح (1186), مراقي الفلاح (70) and حاشية الطحطاوي (1088, 10777) are all the same unvocalized Shamela texts.
- Web searches for vocalized phrases of the opening («سَبْعَةُ مِيَاهٍ», «وَمَاءُ الْبِئْرِ»…).
- islam.wiki and a Teachable course page. Both were partial and not usable.

The vocalized prints that exist (Dar al-Hikma, Dar al-Salam, al-Fayha'…) are not available as text.

**How much is vocalized:** about 0.4%. Only the 8 Quranic verses quoted in the text carry harakat, as Shamela prints them. Everything else (≈18,800 words) has none.

I did **not** add harakat from memory, per the brief's «ناقل لا مفكر». The text needs a vocalization pass before students memorize it. See the end of this report.

## 1. Sources (raw files in `raw/nuridah/`)

| Siglum | Text | Link | Use |
|---|---|---|---|
| **A** (base) | مراقي الفلاح شرح متن نور الإيضاح، اعتنى به نعيم زرزور، المكتبة العصرية ١٤٢٥هـ. The matn is printed at the top of each page, above the line «ــ». | https://shamela.ws/book/412 (pages 1–323) | Base text for الطهارة / الصلاة / الصوم |
| **A′** | The same book, pages 324–343. Here there is no matn: the editor notes «توقف كتاب نور الإيضاح عند نهاية كتاب الصوم ولكن الشارح … تابع الحديث عن كتاب الزكاة/الحج». | https://shamela.ws/book/412/324 | Base text for الزكاة / الحج (the author's own text in Maraqi) |
| **B** | نور الإيضاح ونجاة الأرواح، ت. محمد أنيس مهرات، المكتبة العصرية. It is cut into numbered lists with many editorial [headings] and [inserted words], and it ends at الاعتكاف plus a خاتمة. | https://shamela.ws/book/12117 | Check for the matn |
| **C** | The matn words quoted «"…"» inside the commentary of A (pages 1–323) | shamela 412 | Tie-breaker between A and B |
| **T** | حاشية الطحطاوي على مراقي الفلاح، ت. الخالدي، دار الكتب العلمية ١٤١٨هـ. The top text is the Maraqi text, pages 773–818. | https://ketabonline.com/ar/books/1088 (API pages 773–818) | Check for الزكاة / الحج |

**Caution:** B is probably not fully independent of A. Both come from the same publisher, and they share typos such as «فهيا» and «المتقدي» (in place of «المقتدي»), «كيمه» and «اثنا عشرة شيئا». C, the quotes inside the sharh, is the more independent witness.

Scripts:
- `tools/texts/nuridah-fetch.js`: downloads the Shamela pages.
- `tools/texts/nuridah-fetch-ko.js`: downloads the ketabonline pages.
- `tools/texts/nuridah-extract.js`: extracts A, B, C and T and collates them word by word (Myers diff after removing harakat and tatweel and unifying ا/أ/إ/آ, ى/ي, ة/ه and يء/ئ). It writes `raw/nuridah/collation.txt`, where every hunk is voted A / B / ? by C.
- `tools/texts/nuridah-build.js`: applies the decisions below and writes the json.

## 2. Structure and count

- **99 chapters** in 5 groups:

  | Group | Chapters |
  |---|---|
  | كتاب الطهارة | 26 |
  | كتاب الصلاة | 48 |
  | كتاب الصوم | 13 |
  | كتاب الزكاة | 3 |
  | كتاب الحج | 9 |

- **1,214 paragraphs, ≈18,800 words.** The matn proper is ≈13,300 words. الزكاة and الحج add ≈5,500.
- The paragraph cuts follow B's sentence and list-item boundaries, mapped onto A through the alignment. Most paragraphs are 8–40 words; 11 are 5–7 words.
- There is no standard paragraph count for this prose matn. The chapter headings are A's (Zarzour's), with brackets removed. They match B's sections, except that B splits some sections further with its own [headings], which I did not use.
- **A's headings that held the first sentence of the section.** The commentary's quotes (C) show that «عشرة أشياء لا يغتسل منها»، «يفترض في الاغتسال أحد عشر شيئا»، «يسن في الاغتسال اثنا عشر شيئا»، «يسن الاغتسال لأربعة أشياء» and «سجدة الشكر» belong to the text. I put them back at the head of their section and also kept them in the title, for example «فصل: يفترض في الاغتسال أحد عشر شيئا».
- **Bare «فصل».** Eight sections have a heading of «فصل» alone. I titled them with their own first words, for example «فصل: يسقط حضور الجماعة» and «فصل: القران».
- Other heading spelling: «فصل هو طائفة من المسائل…» (Zarzour's gloss) → «فصل: ينقض الوضوء». Hamza was added to «الامامة، الانجاس، ادراك، احكام، الافزاع», and «مالا» → «ما لا».

## 3. Removed (and why)

- **Page 87.** The page's matn area holds commentary text («لما ذكرت الأوقات التي هي أسباب … وسببه دخول الوقت وهو»), a Shamela layout error that B and C both lack. Removed; the matn of the chapter (باب الأذان) begins on p. 88.
- **Passages the editor of A marks with «*» as commentary or as missing from most copies.** B also brackets them. All removed:
  - p. 254 «إلا أن يكون صغيرا لا يعقل الصلاة» (note: محذوف في أغلب النسخ وهي من الشرح).
  - p. 302 «وهو سبعة وخمسون شيئا» (B: «[وهو سبعة وخمسون شيئا تقريبا]»).
  - p. 310 «بمرض وسفر ونحوه كما تقدم».
  - p. 311 «عنه لاشتغاله بالمعيشة يفطر ويفدي», «حتى صار فانيا» and «لأن الصوم هنا بدل عن غيره».
- **The closing «وهذا ما تيسر للعاجز الحقير … الثواب الجسيم»** at the end of الاعتكاف. A says «هذا ليس موجوداً في الأصل، وقد استخرجته من الشرح». It also would sit in the middle of the book, since الزكاة and الحج follow it. Removed. **Decision needed** if you want it as a final paragraph.
- **Editorial material:** verse references «[البقرة: ٢٠١]», footnote digits, «*» marks, the dot fillers, and the Shamela table-of-contents lines.

## 4. Wording corrections to A (each against B and/or C)

| Page (412) | A | Written | Basis |
|---|---|---|---|
| 2 | وماء الثلج وماء البرد | وما ذاب من الثلج وماء البرد | B. C quotes «ما ذاب من الثلج والبرد». |
| 2 | وهوالماء | وهو الماء | spacing |
| 3 | لقربه | لقربة | C, and the sense |
| 9 | تحري | تحرى | spelling |
| 12 | أربيعن | أربعين | B |
| 37, 47 | اثنا عشرة شيئا | اثنا عشر شيئا | C |
| 47 | ويبدتدىء | ويبتدئ | B |
| 55 | لا الطبخ مرق | لا لطبخ مرق | B, C |
| 56 | من ال العذر | من العذر | C |
| 56 | والذهب الربع | … الرابع | B (the fourth condition) |
| 58 | على الوقت ما يصنع الجريح ولو | على الوقت ولو | A heading had leaked into the text; B and C lack it |
| 59 | الجريج | الجريح | B |
| 62 | وسسنه | وسننه | B |
| 66 | واستحاضة الحيض فالحيض | واستحاضة فالحيض | heading leak; B, C |
| 67 / 68 / 69 / 70 | الفناس / الانقاطع / الاستحافة / صابحه | النفاس / الانقطاع / الاستحاضة / صاحبه | B |
| 73 | لا ينعصر الركب | … الرطب | B |
| 75 | بخفافه | بجفافه | B |
| 84, 98 | فهيا | فيها | sense (B has the same typo) |
| 85 | تليت كما ح عصر | تليت فيها كما صح عصر | B |
| 98 | القدميين | القدمين | B |
| 103 | السرى / الانشكشاف | السرة / الانكشاف | B |
| 107 | متعينيتن | متعينتين | B |
| 111 | الرسع | الرسغ | B |
| 120 | من كيمه | من كميه | sense (B has the same typo) |
| 131, 199 | اختراه | اختاره | B |
| 133 | فإن فلعن | فإن فعلن | B, C |
| 134 | المتقدي | المقتدي | sense (B has the same typo) |
| 136 | أني يتحول | أن يتحول | B, C |
| 151 | وعلى صور | وعلى صورة | B |
| 153 / 158 / 159 | أولغير / أوشمع / منالصلاة / أوشغله | split into two words | spacing |
| 200 | الولو الجي | الولوالجي | B |
| 205 | وترافسد | وترا فسد | spacing |
| 221 | والمقتدى به بالسماع من مقتد ولو | والمقتدى به ولو | B, C |
| 233 | عليه سلم | عليه وسلم | |
| 234–235 | «فلا صلاة ولا كلام حتى يفرغ … والالتفات ولا يرد سلاما ولا يشمت عاطسا ولا يسلم» | «فلا صلاة ولا كلام ولا يرد سلاما ولا يشمت عاطسا حتى يفرغ … والالتفات ولا يسلم» | Order of B and of C («وإذا خرج الإمام فلا صلاة ولا كلام» «ولا يرد سلاما ولا يشمت عاطسا» «حتى يفرغ من صلاته») |
| 255 | ومسح بطنه رفيقا … ولم يعد ينشف | ومسح بطنه … ولم يعد غسله ثم ينشف | B, C |
| 270 / 272 | بالشفغة / يارتها | بالشفعة / زيارتها | B |
| 284 | (the heading repeated as the first line of the text) | removed | B |
| 294 | أواحتجم | أو احتجم | spacing |
| 300 | والكافرة | والكفارة | B |
| 309 | أو الهلال | أو الهلاك | B |
| 339 | وزلحفاة | وسلحفاة | T (زُلَحْفاة is a rare lexical variant) |

**Spelling only (whole words, everywhere).** Hamza was added in الى، اذا، والى، واذا، فاذا، او، فان، احب، الراس، الامام، اليه، باس، (والله) اعلم، إلى ان، أوليي. The final ىء was written as ئ (يبتدئ، المتوضئ، يجزئ…). Other corrections:
- بتسليمه → بتسليمة
- أهدنا → اهدنا
- وصلاتة → وصلاته
- الأثنين → الاثنين
- والأطمئنان → والاطمئنان
- للإحكام → للأحكام
- ولفافه → ولفافة
- نافله → نافلة
- مروحه → مروحة
- «وأن ركع» and «وأن كان لكافر» → وإن

Latin commas became «،». A full stop was added at the end of each paragraph. «القِران» (in الحج) was left as written; it is not «القرآن».

## 5. Readings kept as in A, where B differs

- **«سيدنا» before النبي/رسول الله (about 10 places), «رحمه الله» after الشافعي, and «والله أعلم» at four chapter ends:** B lacks them. I kept them as in the base, per the brief's rule on honorifics.
- **«الأول … والثاني … والثالث»** in the water categories (p. 2): B replaces them with list numbers.
- **«وشرائطها ستة», «سنة على الرجال والنساء» (C agrees), «خوف فوت الجمعة», «أتم جمعته» (B: «جمعة»), «وأولى الحج» (B: «والأولى من الحج»):** kept as in A.
- **«ويسجى قبرها لا قبره» (p. 269):** B and C read «وأن يسجى». It means the same; I kept A.
- **«بوطء ميتة أو بهيمة أو بتفخيذ» (fasting, p. 305):** B and C lack «أو بهيمة». I kept A, but see the next section.
- **B's [inserted words]** (e.g. «[الرجل]», «[بالجانب]», «[فلا كفارة عليه]», «[والعيدين]») were not added.

## 6. الزكاة والحج (A′ against T)

T matches A′ except for 17 hunks, all of them T's own headings or verse references, plus three single words:
- «يعرفه»: I kept A′'s «يعرف».
- «يصيم»: a typo in T; kept «يصم».
- «سلحفاة»: adopted.

## 7. Places to check (مواضع للتأكد)

1. **Vocalization.** The whole text needs it. The best route is a vocalized print, such as دار الحكمة or the Damascus editions, to collate against, or a vocalization pass done the way القدوري was done (`vocalize-qudouri.js`, with a change log per unit).
2. **الزكاة and الحج are not part of the matn proper.** They are Maraqi's own text, which is longer and more discursive (supplications, زيارة النبي ﷺ). Some printed «نور الإيضاح» editions append them. **Decision needed:** keep them or drop them.
3. **Paragraph length.** 36 paragraphs (almost all in الزكاة / الحج) exceed 40 words, up to 70, because the source has no punctuation there.
4. **«أو بهيمة» (fasting) and «وأن يسجى».** Both are listed in §5. A printed vocalized copy would settle them.
5. **The removed «*» passages and the closing (§3).** These follow the editor's notes, not a manuscript.
