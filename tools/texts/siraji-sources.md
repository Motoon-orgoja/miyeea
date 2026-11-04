# Texts report: السراجية في الميراث / فرائض السجاوندي (`siraji.json`)

Author: سراج الدين أبو طاهر محمد بن محمد بن عبد الرشيد السجاوندي الحنفي (d. c. 600 AH; 596 AH is also given). The work is prose, so it has paragraphs and no verses. Madhhab: Hanafi (`"m":"حنفي"`).

## Sources
- **No copy on the usual sites.** shamela.ws (its الفرائض والوصايا and الفقه الحنفي sections), ketabonline (API search: «السراجية», «السجاوندي», «فرائض السجاوندي»), ar.wikisource (none) and OpenITI (no السجاوندي/Sirajiyya entry) were searched.
- **Wording base: the Dawat-e-Islami print.** «السراجية (في الميراث) مع شرحه الجديد المسمّى القمرية», مجلس المدينة العلمية, مكتبة المدينة, Karachi, 1st ed. 1438 AH / 2017, on the Dawat-e-Islami Arabic library: https://www.arabicdawateislami.net/bookslibrary/3465 (112 pages, as HTML text). The editors say they «قابلنا المتن مع نسخ متعدّدة». The matn appears twice on each page:
  1. a block at the top of the page, which is sometimes cut short with dots and leaves out headings, and
  2. the red matn words inside the mixed commentary.
  `dawat-merge.js` joins the two by LCS. It keeps the top block wherever both have the words and fills from the red spans where the top block is cut, so every word of the matn is used (`dawat-matn.txt`, log `dawat-merge-log.txt`). The print is **partly vocalized** (about 25% of letters).
  Raw pages: `raw/siraji/dawat/dawat-3465-*.html`.
- **Second source and filler of harakat: freeislamicwill.com.** «AL-SIRĀJĪYYAH ARABIC TEXT WITH TRANSLATION» https://freeislamicwill.com/al-sirajiyyah-arabic-text-translation-alsrajyt. It gives the whole matn as numbered **fully vocalized** phrases, about 89% of letters. It is independent of Dawat: it differs from it in wording and has its own misprints. It is **not a scholarly edition**. Its vocalization has clear errors, for example «إِفْرَاقًا» for «وافرًا», «يَصِيرْنَ», «يُقَسَمُ», «يَدُلُّونَ» for «يُدْلُونَ», «الكِسْبَانِ» and «الذُّيُونِ».
  Raw: `raw/siraji/fiw.html`. `fiw-extract.js` produces `fiw-voc.txt` (the vocalized phrases, without the glossary words) and `fiw-plain.txt`.

## Method (scripts in `raw/siraji/scripts/`, build: `build-siraji.js`, log: `siraji-build-log.txt`)
1. **Wording:** the merged Dawat matn was compared word by word with FIW using an LCS diff on normalized words. The result is 43 hunks (`siraji-vs-fiw.txt`), and most of them are FIW misprints. Dawat's wording was kept everywhere except at these points:

| Place | Dawat | Written as | Reason |
|---|---|---|---|
| فصل في الصنف الأول | وثُلُثه للابن رحمه الله تعالى يُقسَم… | وثلثه للابن **وعند محمد** رحمه الله تعالى… | The words fell between Dawat's top block and the red spans. They were supplied from FIW, and the sentence needs them. |
| فصل في النساء | وثلثَ بنات ابن ابن آخر | **وثلاثَ** | A misprint in both sources. The example is three sets of three granddaughters (ثلاث … وثلاث … وثلاث). |
| last heading | (only «والحرقى والهدمى» printed) | فصل في الغرقى والحرقى والهدمى | Taken from Dawat's own table of contents. |
| throughout | مسئلة / المسئلة… (41×) | مسألة | Modern spelling only. |
| | رحهما / رحهم | رحمهما / رحمهم | An abbreviation in the print. |
| | مِأة / وذَوُوا / الانثيين | مِئَة / وذَوُو / الأنثيين | Spelling. |

   Kept as Dawat although FIW differs: أبُ الأب (FIW أبو)، وثلثُ الكلّ (FIW ثلث للكل)، المخارج (FIW المخرجات)، فهي (فإنها)، فيُقسَمان (فيقتسمان)، بلِحاقه (FIW بالحكم باللحوق)، بين ولدَي الأخت (لولدي)، يُدلي/يُدلون (FIW يدل/يدلون)، الفتوى (الفتيا)، الموقوف (FIW الموقَّف). Also kept as Dawat: «أو أحدهما لأب وأم والآخر لأب» (in الصنف الثالث) and the paragraph «وأما المرتد فلا يرث من أحد … فحينئذ يتوارثون», which FIW lacks. FIW's extra «إلى غير النهاية» (end of باب المناسخة) was not added.
2. **Basmala:** it is in the `basmala` field. The hadith quotations keep Dawat's double brackets ((…)).
3. **Harakat:** Dawat's own marks always stand. FIW's marks were added only where a Dawat letter has none and the two words have the same letters. FIW may also add to a Dawat mark: Dawat often leaves out the shadda of a sun letter («النِصْف» becomes «النِّصْف»). 13,600 marks were added. In **124 letters the two sources conflict, and Dawat was kept** each time (the log lists them all). Among them: يُدْلُون, يَحْجِب, التِرْكة, مُعْتَق, الكَسْبان, سَمِيُّه. The following were then fixed: FIW's «يُقَسَمُ» became «يُقْسَمُ» (4×); tanween written twice («ناقصًاً») was cleaned; the shadda or fatha on a bare alif («إلاّ», «ثلاَث») was removed; and «وَِتْراً», which Dawat prints with both vowels, became «وَتْرًا» (FIW). Three phrases where FIW is garbled were vowelled by hand; they are unambiguous: «الرِّقُّ وَافِرًا كَانَ», «فِيمَا بَيْنَهُمْ», «أَبُ الْأَبِ». Chapter titles were also vowelled by hand.
4. **Result:** about 89% of letters carry a mark and 66% of words are fully vowelled. 27 words are still bare.

## Structure and count
- The text has 29 chapters: the opening (خطبة and الحقوق المتعلقة بالتركة, titled «مقدمة»), then the 28 headings of the Dawat table of contents, which are **10 أبواب and 18 فصلًا**. The matn has no fixed paragraph or verse count. These are the usual headings of the Sirajiyya, from فصل في الموانع to فصل في الغرقى والحرقى والهدمى, as also in FIW.
- There are 193 paragraphs of 12–40 words, 5,493 words in all. They are cut at the end of a sentence or clause by dynamic programming over «.» «:» «،» and openers such as وإن، فإن، ثم.
- The matn refers to diagrams with «بِهَذِهِ الصُّورَةِ:». The words are kept, but the diagrams themselves (tables of heirs) cannot be shown as text.

## Places to check
1. **The vocalization rests mainly on FIW, which is not a scholarly edition.** Dawat's marks win every conflict, and the FIW errors that were found are fixed. Even so, the FIW marks that were added to letters Dawat leaves bare should be reviewed by a teacher or against a printed vocalized edition (for example the Deoband/Bushra editions). Example: «ثُمَّ يُقْسَمُ البَاقِي» was checked, but final vowels such as «ذُكُورِهِمْ وَإِنَاثِهِمْ» come from FIW only.
2. «التِرْكة» (Dawat, 9×) and «التَّرِكات» appear side by side. Both spellings are correct, and they are left as Dawat prints them.
3. «والملك» in «باختلاف المنعة والمَلِك»: Dawat has المَلِك (the king or ruler), FIW المُلْك. Dawat's reading was kept, which is how the commentaries explain it.
4. «ثُمَّ بِالعَصَبَةِ … ثُمَّ ذَوِي الأَرْحَامِ»: «ذوي» after «ثم» follows Dawat. FIW reads the same.
