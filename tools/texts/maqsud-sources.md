# Texts report: المقصود في علم التصريف (author unknown; attributed to Abu Hanifa, d. 150 AH), matn only (`maqsud.json`)

## 0. Authorship

The work is printed and taught as «المقصود» of «الإمام أبي حنيفة». It appears that way, for example, on the title of «المطلوب شرح المقصود في فن الصرف للإمام أبي حنيفة» and in Izala's introduction («نعمان بن ثابت الكوفي»).

The bibliographers doubt this. The author of «مفتاح السعادة» says: «لم نقف على مصنفه وإن نُسب لأبي حنيفة». The manuscript catalogues say «مجهول المؤلف، وقد ينسب خطأ لأبي حنيفة». Elmpedia says «أحد علماء الأتراك الأحناف».

The meta therefore says «مجهول المؤلف (يُنسب لأبي حنيفة)». There is no reliable death date: «death» is «—», and the 150 AH in the subtitle belongs to the attribution only.

## 1. Sources

- **No digital, fully vocalized matn exists on Shamela, Ketabonline or Wikisource.** Shamela and Ketabonline have only «نظم المقصود» and its shuruh. Elmpedia's text sits behind a login.
- **Base (M), fully vocalized:** the matn of «المقصود» as printed on its own, typeset and fully vocalized, in «مجموعة الصرف وشروحها وحواشيها» (before البركوي's «إمعان الأنظار»), pp. 385–404 = scan leaves n387–n406: https://archive.org/details/majmou3_sarf.
  - It was **transcribed from the page images** (`raw/maqsud/archive-majmou3/pages/`, `crops/`) into `maqsud-tools/M.txt`. `maqsud-tools/build.js` writes `maqsud.json`.
- **T:** takw.in «المقصود في علم الصرف» (typed, lightly vocalized, editorial headings in [ ]): https://takw.in/reader.php?matn=المقصود (`raw/maqsud/takwin/`, plain text `maqsud-tools/T.txt`).
- **I:** «إزالة القيود عن ألفاظ المقصود» by عبد الملك السعدي, the edition elmpedia recommends. It prints the matn at the top of each page. Source: https://archive.org/details/20231010_20231010_1415_mktbhazzaen, used through its OCR (`raw/maqsud/archive-izala/djvu.txt`) and spot-checked page images (`archive-izala/pages/`).
- **Also looked at, not usable:** a manuscript (archive.org aal743, OCR is noise) and the Ottoman lithograph «مجموعة الصرف» (mecmuatussarf, unvocalized lithograph).

## 2. Count and divisions

- **Size:** 184 paragraphs and 3,691 words, in 11 chapters.
- **Chapter titles.** The matn's own headings are «فصل في الوجوه التي اشتدت الحاجة إلى إخراجها من المصدر», «فصل في تصريف الأفعال الصحيحة», «فصل في الفوائد» and «باب المعتلات والمضاعف والمهموز». The other titles («المقدمة», «الفعل المجرد والمزيد فيه», «المصدر», «الأول: الفعل الماضي» … «السادس: اسم المفعول») are the edition's descriptive heads.
  - The six heads «المصدر» … «اسم المفعول» are grouped under the فصل they belong to (`group`).
  - The duplicate first sentence «فصلٌ في الوجوه…» is carried by the group title.
- **Dropped:** the edition's numbering ((1) (2) … (أ) (ب)) and its bracketed sub-heads («[ملحقات الرباعي]», «[المصدر الميمي]», «[أوزان المبالغة]», «[حروف العلة]», …). Also dropped is the closing «تم الكتاب بعون الله الملك الوهاب»: it is a printer's colophon and not in T.
- **Kept without brackets:** the edition's own bracketed passage «[واحرنجم … في الثلاث]» (an addition from another copy; T has it too).
- **«إلخ».** The matn's «إِلَخْ» after the abbreviated paradigms is kept: it stands in M and in T alike.
- **Qur'an.** One Qur'anic quote, ﴿وَاسْأَلِ الْقَرْيَةَ﴾, is in ﴿﴾ and checked against the Mushaf. The cited form «وَسَلِ الْقَرْيَةَ» is a reading the matn discusses, so it is left outside ﴿﴾.

## 3. Wording: M against T and I

`maqsud-tools/cand.js` aligned M (3,691 tokens) with T (3,388 tokens): 3,097 matched, in 289 hunks (`maqsud-tools/cand.txt`).

**Most hunks are a recension difference, not slips.** M, the «مجموعة الصرف» edition, has a fuller text than T. Where I's page images were checked (Izala p. 26), I sides with T. Examples:
- «بفتح العين في الماضي والغابر» (M) for «بفتحها فيهما» (T, I);
- «ما كان ماضيه **مشتملًا** على ثلاثة أحرف» (M only);
- added examples «نحو: أكرم / فرّح / قاتل / انقطع / اجتمع …» and «مثل: دحرج»;
- «وذاك مُصفرٌّ به / متكسَّرٌ به / مدَّثَّرٌ عليه / مغدودَنٌ عليه …» in the paradigms;
- «لتعذّر الابتداء بالساكن نحو: اضرب فيبدأ بها» and «فتقول من تحاسب: حاسب…».

T has its own extras, which M lacks:
- «لأن الهمزة إذا كانت ساكنة وما قبلها مضمومًا يجعل من جنس حركة ما قبلها، لكن يخالف في هذه الأمثلة لكثرة الاستعمال» (after «خذ وكل ومر»);
- «لأن الساكن إذا حرّك حرّك بالكسر» (in المضاعف);
- «تبعًا للعين»;
- «وقلبت ياء يخشيون ألفًا…» in a different place.

T is also full of typing slips («ضرين، الملقح، كملة، يخزمها، فيهمل، سيبوبه، بتشديد الياء» for الباء). **No word of M was changed:** none of the hunks showed a misprint in M that T and I both correct. The base is given as one coherent, fully vocalized edition; **the choice of recension is left to the owner (§5).**

## 4. Vocalization

- **M is fully vocalized and its marks are kept.** Only these spelling conventions were applied:
  - tanwin of the accusative before the alif;
  - no sukun on madd letters;
  - hamzat al-wasl as a bare alif (انْفَعَلَ، اسْتَخْرَجَ، اقْوُلْ);
  - «لِلَّهِ / اللَّهُ» with shadda;
  - canonical mark order.
- **Completed** (no mark in the print; each can be read only one way):
  - «وَالْمَسْقِطِ» in the list «بكسر العين في الجميع»;
  - «مُسْلَنْقًى عَلَيْهِ» (print مُسْلَنْقَى);
  - «إِلَخْ» (sukun added).
- **Hikaya kept as printed:** «عَلَى وَزْنِ مَفْعَلٌ / مَفْعِلٌ».
- **Result: 100% vocalized.** The only unmarked letters are madd letters and the lām of al- before sun letters.

## 5. Things to check / decisions

1. **Recension (decision).** The fuller wording of the vocalized «مجموعة الصرف» edition (M) is used. The terser wording of takw.in and Izala (T, I) differs in about 150 places, mostly added examples and spelled-out vowel descriptions.
   - If the owner wants the T/I wording, the base must change. There is no fully vocalized digital copy of it. Izala's scans are vocalized only in part, so they would have to be transcribed page by page.
2. **Transcription.** The vocalization was read from page images. It should get one human proof-reading against `raw/maqsud/archive-majmou3/pages/n387–n406`.
3. **Kept as printed, worth a check:**
   - «يَكُونُ عَيْنُهُ وَلَامُهُ **حَرْفَانِ**»;
   - «وَإِنْ كَانَ **فَاءَهُ وَلَامَهُ**»;
   - «لِتَنْصُرِنَّ» (T: لِتَنْصُرَنَّ) among the forms with نون التوكيد;
   - «وَتَقُولُ فِي … لِتُنْصَرْ» (T: «ومن المجهول»);
   - «وَلِلتَّمَكُّنِ نَحْوُ أَقْرَبْتُهُ» (some shuruh: للتمكين).
