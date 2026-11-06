# Texts report — «رسالة المسترشدين» للحارث المحاسبي (`mustarshidin.json`)

Method: the base was compared word by word, by script, with three OCR scans of the printed Abu Ghudda edition (after removing harakat/tatweel and unifying alef/yaa/taa-marbuta). Because the scans interleave the text with Abu Ghudda's very long notes, alignment is anchored on word trigrams unique to both texts (chained by a longest increasing subsequence) with LCS between anchors (`tazkiya-build/support-chunk.js` → `out/m-support.txt`); OCR noise was filtered by edit distance (`fuzzy-filter.js` → `out/m-candidates.txt`, 140 stretches reviewed) and base words where two scans agree on another form were listed (`agree-filter.js`). The base was also read through in full for slips the OCR cannot show.
Scripts: `tools/texts/tazkiya-build/` — `shamela-text.js`, `support-chunk.js`, `fuzzy-filter.js`, `agree-filter.js`, `quran-cite.js`, `paras-q.js`, `mustarshidin-build.js`. Full log: `out/mustarshidin-build.log`. Raw downloads: `tools/texts/raw/mustarshidin/`.

## Sources
- **Base (wording + partial vocalization): المكتبة الشاملة 6871** «رسالة المسترشدين», تحقيق عبد الفتاح أبو غدة، مكتب المطبوعات الإسلامية بحلب، ط٢ ١٣٩١هـ (printed pp. 35–183): https://shamela.ws/book/6871. This is the circulated edition (owner's rule). ketabonline 5411 (https://ketabonline.com/ar/books/5411) and OpenITI `0243HarithMuhasibi.RisalatMustarshidin.JK001219` are the **same digital text** (same slips, e.g. «أن لا إلا الله») — not independent, not counted.
- **Checks (independent: the printed book):** archive.org OCR of Abu Ghudda's edition — `20230430_20230430_1751` (a later revised printing: adds «قال أبو عبد الله الحارث بن أسد المحاسبي…» and «أما بعد», and «شرح الله صدره للإيمان»), `BBib-Alex-17385` and `50205` (ط٢ «مزيدة من التحقيق والتعليق»). OCR quality is poor (35–60% of base words recovered exactly), so they confirm wording, not harakat.
- Quran: api.quran.com `text_imlaei` (cached in `raw/mustarshidin/quran/`).

## Count and structure
- 4997 words, **225 paragraphs**, 12 chapters. The risala has no headings; **all chapter titles are editorial and unvocalized**: «فاتحة الرسالة: منهاج ذوي الألباب»، «العمل بكتاب الله والنية والمحاسبة والصبر»، «الصحبة والنصيحة والصدق والاستعداد للآخرة»، «الأدب ومجاهدة النفس»، «العقل والعلم وصفة الصادق»، «فساد القلب وأصول الفضول»، «التوبة وفرائض الجوارح»، «الاستقامة»، «جوامع الوصايا»، «الذنوب والزهد والرضا بالقضاء»، «شعب الصدق والإخلاص»، «المحبة والحياء والمراقبة».
- Paragraphs = the edition's own paragraphs (Shamela `<p>`), after re-joining 43 sentences split by the print's page breaks; under 8 words joined to the next; over 45 cut before a clause-opening word. Four paragraphs stay longer (46–55 words): two end in an uncuttable verse/hadith, two are single unpunctuated sayings (Ṭāwūs's counsel; «واعلم أن العاقل…»).
- The digital copy has **no punctuation**; none was invented. The edition's round brackets around hadith/athar → «…».

## Wording — corrections of the base
| Base (Shamela) | Adopted | Why |
|---|---|---|
| وأشهد أن لا إلا الله | أن لا **إله** إلا الله | dropped word; print (OCR) has it |
| لم بشف غيظه | لم يشف | typo |
| فهو عند الهل | عند الله | typo; all three scans |
| أمر دنياه كما كما ذكر | كما ذكر | doubled word; print: «كما ذكر» |
| العمل العلم والتحرز | العمل **بالعلم** | print (50205) |
| وأحب واحب لهم | وأحب لهم | doubled word |
| إيمان الغني لا يصلحه الفقر إيمان الفقير | … **وإيمان** الفقير | print (50205) |
| تحذثن | تحدثن | typo |
| امر، اكبر، اصابك، الائمة، لأخوانك، بالإفكار، أستقاموا، امروء، دواءه، فتره، ها هنا | أمر، أكبر، أصابك، الأئمة، لإخوانك، بالأفكار، استقاموا، امرؤ، دواؤه، فترة، هاهنا | spelling (hamza/ة) |
| (hadith «عليكم بسنتي…بالنواجذ» left open) | closing » added | |
| «٢» after آل عمران ٣١ | removed | footnote number |

Formulas kept as in the base («صلى الله عليه وسلم»; the print often has «عليه الصلاة والسلام» — the Shamela copy normalized them; not restored).

## Vocalization
Base marks kept (Shamela's partial vocalization of this edition): **5789 of 17241 letters outside the Quran (33.6%)** carry a mark. Not completed (owner: the later step vocalizes). Changes: doubled marks removed (بِمَعْرِِفَة); rule fix «وَاحْذَرْ الـ…» → «وَاحْذَرِ الـ…» 4× (sukun before hamzat al-wasl); words corrected above lose their partial marks.

## Quran
16 citations in ﴿﴾ with the Mushaf text (الأنفال ٤٢، الرعد ١٩–٢١، الأنعام ١٥٣، البقرة ٢٥٧، الصف ٣، الفرقان ٦٣، فاطر ٢٨، الأنعام ٧٥، التوبة ١١١، المجادلة ٢٢، التحريم ٨، الأحقاف ١٣، النساء ١، القصص ٦٨، الأنفال ٦٤، آل عمران ٣١). Two were unmarked in the digital copy and are marked as Quran in the print: الرعد ١٩–٢١ («إنما يتذكر أولو الألباب…»; base «أولوا») and الفرقان ٦٣ (in round brackets).

## مواضع للتأكد
- The partial harakat (33.6%) come from the digital edition and were not verified letter by letter against the print (the OCR cannot carry harakat reliably). The vocalization step should treat them as a draft.
- The later printing (archive `20230430_…`) has an extra opening line «قال أبو عبد الله الحارث بن أسد المحاسبي رحمة الله عليه» and «أما بعد فاعلم أن الله…»; not adopted (base = ed. 2 as in Shamela).

## التشكيل (٢٠٢٦-١١-٠٦)
أكمل الذكاء الاصطناعي شكل النص (حركات فقط، وفُحصت الحروف بسكربت)، وصُحّحت حركات ظاهرة الخطأ في المسودة (وَعَلَيْهِ، الْغِيبَةِ، مَعْصِيَةِ). مواضع للتأكد: 1:7 «الذي يعلم» (لعلها: لا يعلم)، 3:14 «مطلب»، 10:23 «خوف السلف» (لعلها: السَّلْب).
