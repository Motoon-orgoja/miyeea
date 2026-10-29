# Text and sharh report — صفوة الزبد (متن الزبد) — ابن رسلان الرملي (ت ٨٤٤هـ)

Key: `zubad`. Files: `tools/texts/zubad.txt` → `data/zubad.js` (tools/build-poem.js); sharh `data/sharh/zubad.json` (tools/sharh/zubad/build.js, log in tools/sharh/zubad/build.log).
Verse numbers below are the order in `zubad.txt` (1–1080), which is also the numbering of the vocalization source.

## 1. Editions used

- **Vocalization (base) source:** جامع الكتب الإسلامية (ketabonline) book 103086 «منظومة الزبد في الفقه الشافعي», taken from «الشاملة الذهبية», numbered verses 1–1080, one page per chapter (105 pages):
  https://ketabonline.com/ar/books/103086 (pages read: https://ketabonline.com/ar/books/103086/read?part=1&page=1 … page=105).
  - It is the most vocalized online text I found, but it is **not fully vocalized**: many verses are fully marked, some only partly, a few (e.g. 8) hardly at all. It also has many typing slips (see §3). No publisher or edition is named on the page.
  - I found **no fully vocalized digital edition** on shamela.ws or ketabonline. Shamela has the matn only lightly vocalized (book 22364) and the two big commentaries (6136, 32197) are mamzuj and only partly vocalized. The fully vocalized printed editions (دار المنهاج; the edition of أحمد المحمَّد) exist only as printed books / PDF scans.
- **Wording check 1:** المكتبة الشاملة book 22364 «الزبد في الفقه الشافعي» — the matn as printed in the margin of غاية البيان (same page numbers as book 6136), lightly vocalized, with its own OCR errors:
  https://shamela.ws/book/22364 (pages 1–344). Compared word by word with a script (both texts normalized: harakat/tatweel removed, alef/yaa/taa-marbuta forms unified, then aligned token by token).
- **Wording check 2:** the verse words as quoted by شمس الدين الرملي inside **غاية البيان** (Shamela book 6136, see §5). The sharh builder writes, with `--words`, every verse word that the commentary quotes differently.
- Chapter headings were checked against the headings of Shamela 22364: all 105 sections start at the same verses.

## 2. Verse count and sections

- **1080 verses** — the count of the base source (ketabonline gives «عدد الأبيات: 1080»), and Shamela 22364 aligns with it with no extra or missing verse. (The poem says of itself «أبياتها ألفٌ بما قد زدتها»; catalogues give 1079, 1080 or 1088 depending on how the khutba/khatima are counted.)
- The base source's own numbering has one slip: verse 779 is labelled «789» (the order is right; numbers were removed anyway).
- **105 sections** (`## ` lines), the book's own headings as given by the base source: المقدمة (verses 1–10), the creed/usul part, كتاب الطهارة … كتاب القضاء and their أبواب, باب العتق … باب أمهات الأولاد, and «خاتمة في علم التصوف». Heading changes:
  - «كتاب علم الأصول (أصول الدين - الإعتقاد)» → «مقدمة في علم الأصول» (the parenthesis is an editor's gloss; غاية البيان calls this part «مقدمة في علم الأصول»).
  - «باب إحياء الأموات» → «باب إحياء الموات» (Shamela 22364 «باب إحياء الموات»; الأموات is a slip).
  - Hamzat al-wasl written as hamza: «الإستنجاء، الإستسقاء، الإعتكاف، الإستبراء» → «الاستنجاء، الاستسقاء، الاعتكاف، الاستبراء».
  - Other headings differ slightly from the print (e.g. base «كتاب المعاملات», print «كتاب البيع»; base «باب الصدقات», print «باب قسم الصدقات»; base «باب دعوى الدم», print «باب دعوى القتل»). I kept the base source's wording.

## 3. Changes made to the base text

**Mechanical (all verses):** verse numbers removed; parentheses (used by the source for quoted speech, e.g. «(أنتَ كَظَهْرِ أُمِّي)», «(زُبَدُ الفِقْهِ)»), dashes used as brackets («-ولَو مَعزولا-»), colons and commas removed; tatweel removed («كَـ (يَا مَوْلايَهْ)» → «كَيَا مَوْلايَهْ»). The text is stored in Unicode NFC (this only fixes the order of shadda and vowel inside a letter; nothing visible changes).

**Shadda typed on the first lam of «الّـل…»** (the source puts the shadda and vowel on the lam of the article instead of the second lam, e.g. «الَّلوحِ» → «اللَّوحِ»), corrected by rule in verses 31, 130, 143, 305, 426, 494, 520, 740, 806, 839, 840, 849, 872, 899, 937, 957, 1051 (and 528, 949 in the table below).

**Missing spaces** (words run together, mostly «لا»/«غير» + word): 
44: غيرَالشِّرْكِ → غيرَ الشِّرْكِ; 91: لاشَعَرُ → لا شَعَرُ; 98: غَيرَدَرِّ → غَيرَ دَرِّ; 116: غَيرَمَنِيٍّ → غَيرَ مَنِيٍّ; 139: البحرِالكبيرِاغتَرَفَا → البحرِ الكبيرِ اغتَرَفَا; 159: لاقَصَبٍ → لا قَصَبٍ; 227: مالاسَبَبٌ → ما لا سَبَبٌ; 568: لاذِمَّةٍ → لا ذِمَّةٍ; 606: لافِي → لا فِي; 609: لافي → لا في; 614: غيرَمُقَدِّرٍ → غيرَ مُقَدِّرٍ; 630: لاشَرْطِ → لا شَرْطِ; 637: غيرِما → غيرِ ما; 648: ولارُجُوعَ → ولا رُجُوعَ; 695: لافَرْضَ → لا فَرْضَ; 695: غيرِأَكْدَرِيَّةٍ → غيرِ أَكْدَرِيَّةٍ; 711: لاعِرْسَا → لا عِرْسَا; 716: يَرَىالذَّكَرْ → يَرَى الذَّكَرْ; 718: لافِي → لا فِي; 797: غيرُالوَطْءِ → غيرُ الوَطْءِ; 827: غيرِالعَمْدِ → غيرِ العَمْدِ; 832: غيرِأَب → غيرِ أَب; 850: أوجائِفَهْ → أو جائِفَهْ; 868: ذُوتَكَلُّفِ → ذُو تَكَلُّفِ; 917: لاهَرَبٍ → لا هَرَبٍ; 925: غيرَمَرَّةٍ → غيرَ مَرَّةٍ; 987: مالَزِمَا → ما لَزِمَا; 1027: لاهِبَةٌ → لا هِبَةٌ; 1054: لابُدَّ → لا بُدَّ.

**Corrections of clear typos** (each word was checked against Shamela 22364 and/or the quotation in غاية البيان; «meter» = رجز):

| Verse | Source | Written as | Reason |
|---|---|---|---|
| 2 | صلاة ُاللهِ | صلاةُ اللهِ | stray space before the damma |
| 5 | لمُبتدِى | لمُبتدِي | alif maqsura typed for yā' |
| 9 | لا تكمل | لا تُقبلُ | rhyme words of verses 9 and 21 are swapped in the source; Shamela 22364 has «لا تقبل» here |
| 21 | لا تُقبلُ | لا تكمل | swapped with verse 9; Ghayat al-Bayan quotes «بغير وفق سنة لا تكمل», Shamela 22364 «تكمل» |
| 37 | ومالِكٌ النُّعمان | ومالِكٌ والنُّعمان | Ghayat quotes «(ومالك) … (والنعمان)»; without the wāw al-Nuʿmān reads as apposition to Mālik and the meter breaks |
| 40 | وَلِىِّ | وَلِيِّ | alif maqsura typed for yā' |
| 42 | إِمَامٌ يَنْصِبُوا | إِمَامٌ يُنْصَبُ | Ghayat «(فرض على الناس إمام ينصب)» and Shamela 22364 «ينصب»; «يَنْصِبُوا» is ungrammatical with إمامٌ |
| 49 | عند إلهِ | عند إلهِهِ | Ghayat «(عند إلهه)», Shamela 22364 «إلهه»; meter needs the pronoun |
| 51 | العُمْر ِأَحَدْ | العُمْرِ أَحَدْ | kasra typed after the space |
| 63 | المَكروه ُثمَّ | المَكروهُ ثمَّ | damma typed after the space |
| 164 | لجِسمٍ ٍظَهَرَا | لجِسمٍ ظَهَرَا | stray tanwin at the start of a word |
| 173 | ُبُالمُزْدَلِفَهْ | بِالمُزْدَلِفَهْ | stray damma and a damma in place of kasra on the bā' |
| 183 | و انمِسَاحِ | وانمِسَاحِ | detached wāw |
| 202 | وإلا َّسَبعةٌ | وإلَّا سَبعةٌ | shadda typed after the space |
| 204 | فمُسْتَحَاضَةٌ ٌحَوَتْ | فمُسْتَحَاضَةٌ حَوَتْ | doubled tanwin |
| 246 | يختَشِي | يختَشِ | jussive after لم; Ghayat quotes «يختش» |
| 272 | مَّ التَّشَهُّدُ | ثُمَّ التَّشَهُّدُ | the letters ثُ of ثُمَّ were displaced to the second hemistich |
| 272 | ثُفيها | فيها | the letters ثُ of ثُمَّ were displaced here |
| 276 | لشَهر ِالصومِ | لشَهرِ الصومِ | kasra typed after the space |
| 376 | كْنُهُمَا | رُكْنُهُمَا | the letters رُ of رُكْنُهُمَا were displaced to the second hemistich (Shamela 22364 «ركنهما») |
| 376 | رُوبَعدَهُ | وبَعدَهُ | displaced رُ (Ghayat «(وبعده») |
| 404 | َوِوتْرَاً | وَوِتْرَاً | marks typed on the wrong letters |
| 444 | الصٌّاعِ وَهْوَ بالأَحْفَانِ | الصَّاعِ بالأَحْفَانِ | «وَهْوَ» is an intrusion that breaks the meter (absent in Shamela 22364); dammatan typed for fatha |
| 453 | في سبيلِ اللهِ | وفي سبيلِ اللهِ | Ghayat «(وفي سبيل الله غاز احتسب)» and Shamela 22364 have the wāw; the meter needs it |
| 453 | ووابنُ | وابنُ | doubled wāw |
| 528 | والَّلْمَس بالشَّهْوِة | واللَّمْس بالشَّهْوَةِ | marks typed on the wrong letters |
| 578 | أجَلا ًوكَسْرا | أجَلاً وكَسْرا | tanwin typed after the space |
| 611 | الفَوْر ِاخْصُص | الفَوْرِ اخْصُص | kasra typed after the space |
| 678 | لأُمِّهِ ِإذا | لأُمِّهِ إِذا | kasra typed after the space |
| 678 | وثُلُثُ ُالباقي | وثُلُثُ الباقي | doubled damma |
| 679 | وأَحَدَ ِالزَّوجَيْنِ | وأَحَدَ الزَّوجَيْنِ | stray kasra |
| 690 | فالنٌّاقِصِ | فالنَّاقِصِ | dammatan typed for fatha |
| 724 | والأَب ُوالجَدُّ | والأَبُ والجَدُّ | damma typed after the space |
| 725 | بِل إذنُها | بَلْ إذنُها | kasra on the bā' of بَلْ |
| 732 | ولَوَ | ولَوْ | fatha typed for sukun |
| 733 | عَقَدْ ٌوانْحَتَمْ | عَقْدٌ وانْحَتَمْ | marks typed on the wrong letters |
| 767 | أوزائِدَاًعَن | أو زائِدَاً عَن | missing spaces (Ghayat «(أو زائدا عن أشهر») |
| 804 | فْرُض | فَرْضُ | «فَرْضُ المُعْسِرِ» parallels «فَرْضُ المُوسِرِ» in the first hemistich; marks were typed on the wrong letters |
| 871 | دُبُرَ ا | دُبُرَا | stray space |
| 874 | بَيِّنَهٌ | بَيِّنَةٌ | hā' typed for tā' marbūṭa |
| 880 | فَتَعْزِيزٌ | فَتَعْزِيرٌ | Ghayat «(فتعزير»; تعزير is the legal term |
| 905 | لرِاجِلٍ | لِراجِلٍ | kasra typed on the wrong letter |
| 905 | لفارِسِ ٍإن | لفارِسٍ إن | tanwin typed after the space |
| 949 | الَّلْغِو | اللَّغْوِ | marks typed on the wrong letters |
| 949 | الِّلَسانِ | اللِّسانِ | marks typed on the wrong letters |
| 964 | ما كَّفارَةٌ | ما كَفَّارَةٌ | shadda typed on the wrong letter |
| 966 | أحكامَ الكتابَ | أحكامَ الكتابِ | genitive after أحكامَ |
| 969 | حاجِزَ ا | حاجِزَا | stray space |
| 975 | الإَكرَامِ | الإِكرَامِ | fatha typed for kasra under the hamza |
| 1001 | بَيِّنَهٌ | بَيِّنَةٌ | hā' typed for tā' marbūṭa |
| 1002 | بَيِّنَهٌ | بَيِّنَةٌ | hā' typed for tā' marbūṭa |
| 1009 | يِصُّح | يَصِحُّ | marks typed on the wrong letters |
| 1012 | قْدْرَ | قَدْرَ | sukun typed for fatha on the first letter |
| 1025 | بِهِا | بِهَا | kasra typed for fatha |
| 1030 | فإْن | فإِنْ | sukun typed for kasra |
| 1039 | جهَلُ | يَجْهَلُ | Shamela 22364 «يجهل»; «جهَلُ» is not a word and breaks the meter |
| 1041 | وُزِنْ | وَزِنْ | imperative of وَزَنَ |
| 1065 | يْنَتَسِبْ | يَنْتَسِبْ | sukun typed on the wrong letter |
| 1066 | أْفْضَلُ | أَفْضَلُ | sukun typed for fatha on the hamza |
| 1076 | وَفَقَّ | وَفَّقَ | shadda typed on the wrong letter |

In all: 89 listed edits (60 in the table, 29 missing spaces) in 82 verses, plus the lam-shadda rule in 17 verses. No other word of the base source was changed, and its vocalization was kept as it is, including its habits: tanwin written on the alif after a fatha («مَيْتَاً»), kasra/fatha on a bare alif for hamza («اِنْ», «الاِسم»), «هذى» (v. 4), and «يَشَا / المَا / الوُضُو» shortened for the meter.

## 4. Readings kept, and doubts

| Verse | Kept (base source) | Other reading | Note |
|---|---|---|---|
| 37 | ومالِكٌ والنُّعمان (after correction) | «نعمان» (Shamela 22364) | Ghayat quotes «(ومالك) … (والنعمان)». |
| 39 | لِوَلَدٍ مِن غيرِ أَبْ | «لوالد» (22364) | Ghayat quotes «لولد من غير أب». |
| 47 | يَرزُقُ من شاءَ ومن شَا أحرَمَا | «من يشاء» (22364); Ghayat paraphrases «ومن شاء أحرمه … وفي نسخة حرما» | Kept. |
| 62 | أقسامُ فِعل العَبد سَبعٌ تُقْسَمُ | «أحكامُ شرعِ الله سبعٌ تُقسم» (22364) | Ghayat does not quote the first half. **Doubt** — both are plausible; check a printed edition. |
| 233 | وعَطَنٍ | «ومعطن» (22364) | Ghayat quotes «(وعطن)». |
| 1018 | تُستَحَبْ | «يُستحب» (22364, Ghayat) | Subject is الكتابة, so تُستحب is also correct. |
| 1045 | مُستَغْفِرَاً فإِنَّهُ يُكَفَّرُ | «مستغفرًا عساه أن يكفّر» (22364) | Ghayat agrees with the base source here (22364's wording is that of v. 1047). |
| 260 | أَوْمَآهْ | «أَوْمَأ» (Ghayat) | Rhyme with «قَفَاهْ»; kept. |
| 444 | (removed «وَهْوَ») | — | The base hemistich «بَغْدَادَ قَدْرُ الصَّاعِ وَهْوَ بالأَحْفَانِ» is one foot too long; 22364 has no «وهو». Fairly sure, but listed here because it removes a word. |

Other doubts:
- The base source is only partly vocalized; I did **not** add vocalization of my own (except the few marks needed by the corrections above). Verses such as 8 («فعالم بعلمه لم يعملن…») stay bare. If a fully vocalized printed edition (دار المنهاج) can be obtained, a vocalization pass is still worth doing.
- Shamela 22364 differs from the base source in ~290 verses, but almost all of these are 22364's own OCR errors (e.g. «واستشن», «المنحدث», «وَالسير») or spelling; only the cases above were real readings.

## 5. Sharh

- **Source:** «غاية البيان شرح زبد ابن رسلان» لشمس الدين محمد بن أحمد الرملي (ت ١٠٠٤هـ), المكتبة الشاملة book 6136 (دار المعرفة، بيروت), Shamela pages 1–344 = printed pages 2–345: https://shamela.ws/book/6136 . Fetched with `tools/sharh/fetch.js` (cache `tools/sharh-cache/zubad/`, and `zubad-matn/` for book 22364; the ketabonline pages are in `zubad-ketab-103086/`).
- **Method** (tools/sharh/zubad/build.js): the sharh is mamzuj, and in its first part the matn words are not even bracketed. Each verse is located by matching its words in order inside the running text (gaps allowed for the commentator's interjections; words inside «(…)» count more), searching forward from the previous verse. The commentary of a verse is the text from where its quotation starts up to where the next verse's quotation starts, copied verbatim (so it contains the verse words in the commentator's own wording). A cut that would fall inside a «(…)» quote moves back to its opening bracket. When a piece holds almost nothing but the verse words (the commentator quotes two verses and explains them together), the pieces are merged and the same full text is given to each verse of the group. Verse 1's text is the whole of printed page 3 (the commentary on الحمد للإله… begins there; the preface on page 2 is not attached to any verse). Page breaks are joined with a space; paragraphs of the source are kept as "\n\n".
- **Cleaning:** HTML removed; the digitiser's stray «٠», the printer's quire signatures «(٤ غاية البيان)» (9 of them) and the one editorial «[» removed; Shamela's Qur'an brackets {…} written ﴿…﴾ as in the other sharh files of the app; the printer's colophon at the end (بحمد الله تعالى قد تمّ طبع كتاب…) dropped. Nothing else touched: the Shamela text's own OCR slips are kept verbatim (e.g. «١ هـ» for «اهـ», «فكذاالإمام», occasional stray digits).
- **Coverage: 1075 of 1080 verses.** ref = «ص» + printed page (or range, e.g. «ص181-183»), url = https://shamela.ws/book/6136/<Shamela page id of the start>.
  - 12 groups of two verses share one text: 62–63, 78–79, 84–85, 197–198, 345–346, 385–386, 458–459, 840–841, 893–894, 972–973, 1036–1037, 1067–1068.
  - 2 verses were found only by the looser second pass (282, 541) — both checked by eye, correct.
  - **5 verses have null:** 9, 981, 1064 are not commented at all in this edition of غاية البيان (the text runs straight from the previous verse to the next one); 865 and 976 are not quoted — their content is paraphrased inside the commentary of 864 and 975 (no own words were added, so they stay null).
  - 33 verses matched with lower confidence are listed as `LOW` in build.log (mostly verses where the commentator quotes only part of the verse or paraphrases a half). I checked a sample: the cut is right, but in the unbracketed first part of the book (pages 2–~20) and in a few later places a verse's text may begin a few words into the verse or end with the first words of the next one.
- The JSON is large (≈2.5 MB on disk, the whole sharh), bigger than shatibiyya.json (1.1 MB).
