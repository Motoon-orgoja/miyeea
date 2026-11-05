# Texts report — الدرر اللوامع في أصل مقرإ الإمام نافع (`durarlawami.txt`)

Poem by أبو الحسن علي بن محمد الرباطي التازي، ابن بري (ت ٧٣٠هـ، وقيل ٧٣١), on the usul of Nafi' (Warsh and Qalun, by al-Dani's way).
Meter: الرجز. **273 verses** (243 of the poem + 30 of its ذيل on the makharij and sifat), 19 headings. Verse numbers below are those of the final file.

Scripts and outputs (`durarlawami-build/`): `parse-ko.js` → `K.json`, `K-list.txt`; `S-transcribed.txt` (hand transcription of S, see below);
`collate.js` → `collation-SK.txt` (word-by-word S↔K); `markcheck.js` → `markcheck.txt` (S↔K vowel conflicts); `meter.js` (rajaz scanner);
`build.js` → `../durarlawami.txt` + `build-log.txt`; `zoom.py`, `hz.py` (render page regions of S and H for reading).
Raw files: `raw/durarlawami/ko102750.json`, `raw/durarlawami/ia/` (PDFs and OCR text layers).

## Sources

**No fully vocalized *text* copy exists online** (searched: shamela.ws, the ketabonline API, Arabic Wikisource, archive.org, the web for vocalized
phrases). The two vocalized editions found are image PDFs, so the base text was **transcribed by hand from the page images**.

| Code | Source | Use |
|---|---|---|
| **S** | «متن نظم البرية المسمى الدرر اللوامع» — النسخة الجديدة، كتابة وضبط سليم بن محمد بن يوسف ربيع (ضبطه على الشيخ طاهر آيت علجت بسنده، مع الاعتماد على شروح ابن المجراد والمجاصي وابن القاضي والخراز والمنتوري…): https://archive.org/details/20260815_20260815_1035 (`ia/new.pdf`; text layer is broken font) | **Base text** — wording and all harakat, transcribed verse by verse from the images into `S-transcribed.txt`. Fully vocalized, 276 numbered verses. |
| **K** | جامع الكتب الإسلامية 102750 «الدرر اللوامع في أصل مقرأ الإمام نافع» (الشاملة الذهبية، «عدد الأبيات: 262»): https://ketabonline.com/ar/books/102750 | **Independent second witness** (wording, collated by script) and source of the chapter headings. Lightly vocalized, with typos (243 «ثم صلاة الله كل» without «حين»; 247 «الحلذق»; 244 «قول … الحمد الله») and only 16 of the 30 ذيل verses. |
| **H** | «الدرر اللوامع في أصل مقرإ الإمام نافع» للأستاذ المقرئ ابن بري التازي، اعتناء توفيق العبقري (مراكش ١٤٣٥هـ/٢٠١٤م)، with the variants of the three riwayat (الحضرمي، المكناسي، البلفيقي) through المنتوري: https://archive.org/details/20200323_20200323_1852 (`ia/d2020.pdf`, `ia/d2020_djvu.txt`) | Tie-breaker, read from the images at every S↔K difference and spot-checked page by page (pp. 19–40). Fully vocalized. |
| **N** | «النجوم الطوالع على الدرر اللوامع» لإبراهيم المارغني (OCR): https://archive.org/details/Douraru_Laouami3 (`ia/NLD_djvu.txt`) | The circulated Maghribi wording: its lemmas «وقوله: (…)» and its remarks on the count and on variants. |
| — | «الفجر الساطع» لابن القاضي (archive.org `fjr_st-1`), «القصد النافع» للخراز (`ElkasdElnafi3Ouarch`), النجوم الطوالع ط. أخرى (`ahmed_0410`) | Located; OCR not usable or not needed. Note: «القصد النافع لبغية الناشئ والبارع» of al-Kharraz **is** a commentary on this poem (title on archive.org: «…على الدرر اللوامع في مقرإ الإمام نافع»). |

## Verse count — 273

- N: «وعدد أبيات النظم وذيله على ما في أكثر النسخ مائتان وثلاثة وسبعون بيتًا، ويوجد في بعض النسخ زيادة ثلاثة أبيات بعد قوله: ثم صلاة الله كل حين…»; H gives the same 273.
- The three extra verses («تمّ كتاب الدرر اللوامع | في أصل مقرإ الإمام نافع»، «نظمه مبتغيًا للأجر | علي المعروف بابن بري»، «سنة سبع بعد تسعين مضت | من بعد ستمائة قد انقضت») are a pupil's addition (H: «زاد بعض تلامذة الناظم»; S, after Ibn al-Qadi: added by al-Matmati). S numbers them 274–276, K 260–262. **Not included.**
- S's ذيل is preceded by a copyist's prose line («وقال أيضًا سمح الله له وزاده رشدًا وزكى فعله») — not a verse, not included. H notes that some copies put «أقول بعد الحمد لله …» (244) at the end of the poem proper; it is the first verse of the ذيل here, as in S, H and N.
- K's 262 = 243 + 16 ذيل verses + the 3 additions: K lacks ذيل verses 248–251 and 262–271 (S/H numbering: the guttural/velar makharij and nearly all the sifat), all present in S, H and commented in N.

## Headings (19)

The verses themselves carry the poem's own section openings («القول في …»); the chapter titles are editorial in every edition (S prints none, H and K bracket theirs).
Used: K's chapter titles, brackets removed — المقدمة (K «نص المنظومة»; H «[المقدمة]»)، باب الاستعاذة، باب البسملة، باب ميم الجمع، باب هاء الكناية، باب المدود، باب أحكام الهمز،
باب الهمز المفرد (K «الهمز المفرد»، H «باب الهمز المفرد»)، باب نقل الحركة (K «نقل حركة الهمز»، H «باب نقل الحركة إلى الساكن قبلها»)، باب الإظهار والإدغام، باب أحكام النون الساكنة،
باب الفتح والإمالة، باب أحكام الراء، باب أحكام اللام، باب كيفيات الوقف، باب ياءات الإضافة، باب ياءات الزوائد، باب فرش الحروف، الذيل: باب مخارج الحروف وصفاتها (K «الذيل [باب مخارج الحروف وصفاتها]»).
K's outline sub-heads inside the hamz chapter («الهمز المزدوج»، «أولا: في كلمة»، «أ- متفقتا الحركة» …) were not used; the فصول stay inside their باب, opened by the verse word «فصلٌ».

## Method

1. S transcribed by hand from the page images (zoomed 380 dpi where needed). Not copied: S's small silah waw/ya after «ـهُ/ـهِ», the dagger alif on final ى, tatweel. S's small zawa'id ya in 213–224 (Qur'anic words whose ya is read in wasl: «وَيَاتِۦ»، «يَهْدِيَنِۦ»، «الدَّاعِۦ» …) is kept as U+06E6 «ۦ», as in S and H.
2. Collation S↔K word by word by script (harakat, tatweel, alif/ya/ta-marbuta/hamza forms neutralised): 60 verses differ (`collation-SK.txt`), most in spelling only (alif of itlaq «بينا/بين», «كافرينا», Qur'anic rasm, spacing) or in K's typos.
3. Every lexical difference was decided with H (images), N's lemmas and the meter; per the owner rule, **the circulated wording of the shuruh (N) was preferred** where the riwayat differ.
4. S↔K vowel conflicts in identical words were listed by script (`markcheck.txt`, 32); S was re-read in the image at each, and S kept except where noted below.
5. Vowel completion (logged in `build-log.txt`): S prints the conjunction «و» and the lam of «ال» before qamari letters without marks; H marks them throughout and they admit no other reading → **fatha on 441 «و», sukun on 176 lams.** Nothing else was added.
6. **Meter:** every hemistich scanned by `meter.js` (feet مستفعلن/متفعلن/مفتعلن/فعلتن, final foot also مفعولن/فعولن; a pronoun «ـهُ/ـهِ» may take silah). 540/546 pass automatically; the 6 others were scanned by hand and are correct — 35/2 and 107/1 (naql in «وَالِاخْفَاءَ»، «وَالِاسْتِفْهَامُ»: wa-lik-fā-ʾa, wa-lis-tif-hā-mu), 120/2 («وَعَادًا الُاولَى» = ʿādal-lūlā, Nafi's reading), 121/2 (silah of «نَقْلِهِمُ»), 210/2 («فِي هَذِهِ الْفَتْحَ» = hādhihil-fatḥa), 233/1 («وَأَنَا إِلَّا» = wa-ʾa-na-ʾil, alif of أنا not pronounced in wasl).
7. Orthography as in S (alif of itlaq «جَاءَا»، «حَيْرَانَا»; «الُاولَى»، «الُاخْرَى» with the vowel on the alif; «مُسَكَّنَاتِ» …). UTF-8 without BOM.
8. **Vocalization of the final text: every one of the 2386 words carries harakat; 6926/7129 = 97.2 % of consonants (ا و ي ى excluded) carry a mark** — the rest are the unmarked lam of «ال» before sun letters and the assimilated letters «إِذ ظَّلَمُوا»، «مَن مَّعِي»، «أَوْرَدتُّ» as printed.

## Wording / vowel decisions against S (7, all in `build-log.txt`)

| Verse | S | Written | Witnesses / reason |
|---|---|---|---|
| 21/2 | عُثْمَانُ وَرْشٌ | عُثْمَانُ وَرْشٍ | K, H («ورشٍ»: رواية الحضرمي والبلفيقي); N: إضافة الاسم إلى اللقب واجبة عند الجمهور (رفعه رواية المكناسي) |
| 65/2 | عَنْ ضَمَّةٍ وكَسْرَةٍ | عَنْ ضَمَّةٍ أَوْ كَسْرَةٍ | K, H, N («عن ضمة أو كسرة نشأتا»); both scan |
| 88/2 | فِي كِلْمَةٍ | بِكِلْمَةٍ | N lemma «(بكلمة)» + K = رواية البلفيقي; S, H «في كلمة» = رواية الحضرمي (خط الناظم). Circulated wording taken; same scansion |
| 145/2 | فِي الْتِزَامِهِ | لِالْتِزَامِهِ | N lemma «(لالتزامه)» + K; S, H «في التزامه». Circulated wording; same scansion |
| 223/2 | بِالقَمَرِ | فِي الْقَمَرِ | K, H, N («قد أشرقت في القمر») |
| 231/2 | وفِي النِّسَا ولَا تَعَدُّوا | وفِي النِّسَاءِ لَا تَعَدُّوا | K, H; N: «لا تعدوا» معطوف على «نعما» بواو محذوفة |
| 250/2 | والكَافُ مِنْ أَسْفَلَ شَيْئًا تُدَّرَكْ | والكَافُ أَسْفَلُ قَلِيلًا تُدَّرَكْ | H + N («والكاف أسفل قليلا تدرك»، «وفي بعض النسخ: من أسفل شيئا»); harakat from H («الروايات الثلاث على ضم أسفلُ») |

Harakat added in these places only where certain: «بِ» of «بِكِلْمَةٍ», «لِ» of «لِالْتِزَامِهِ»; the rest copied from H.

Other variants seen and **not** adopted (S kept): 3 «أكرمِ/وخيرِ» (H «أكرمُ/وخيرُ»; N: الخفض والرفع مرويّان)؛ 101 «ياءً وواوًا» (S, K; H «واوًا وياءً»)؛ 125 «أُظْهِرَا» (H, K «أَظْهَرَا»; N: يروى بالوجهين)؛
225 «لَفْظًا ووَقْفًا» (S, K, N; H «وَصْلًا ووقفًا»)؛ 241 «انْتَهَى كَلَامِي» (S, K, N; H «انقضى نظامي» = رواية الحضرمي)؛ 252 «أَضْرَاسِهِ» (S, H; K «أضراسها» = رواية المكناسي والبلفيقي).

## مواضع للتأكد (S kept; a second vocalized witness differs)

- 125/2 «جُدْتَ» (S) — K and H «جُدتَّ» (with the dal assimilated). The four letters of the mnemonic are the same.
- 191/2 «تُتْبِعْ وَتَتَّبِعْ» (S) — H «تَتْبَعْ», K «تتبَعْ». N only says «(تتبع) مجزوم في جواب الأمر».
- 263/2 «هِجَاءُ حُثَّ شَخْصُهُ فَسَكَتَا» (S) — H «حَثَّ شَخْصَهُ».
- 264/2 «أَجَدْتَ قُطْبَكَ» (S) — H «أَجَدتُّ قُطْبَكَ».
- 215/2 «ذَاتُ الفَتْحِ» (S, H) — K «ذاتِ».
- 88 and 145: the riwayat really differ; if the owner prefers the text of S/H (رواية الحضرمي، خط الناظم), restore «فِي كِلْمَةٍ» and «فِي الْتِزَامِهِ» (`build.js`, FIXES).
