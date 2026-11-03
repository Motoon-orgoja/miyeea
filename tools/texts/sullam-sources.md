# Texts report — السلم المنورق (`sullam.txt`)

Key `sullam` · عبد الرحمن بن محمد الصغير الأخضري (ت ٩٨٣هـ) · المنطق · الرجز · **144 verses**, 17 headings.

How the comparison was done: every verse was stripped of harakat and tatweel, alef/yaa/taa-marbuta/hamza seats were unified,
and the result was compared word by word (LCS diff, script output) against each check source. Harakat were then compared letter by
letter where the skeleton agreed. Scripts: `tools/texts/scripts/sullam/` (they were run from a scratch folder; inputs are in `raw/sullam/`).

## Sources
- **Base (vocalization + wording):** المكتبة الشاملة, book 36107 «شرح القويسني على السلم المنورق» — transcript of أحمد بن عمر الحازمي's lessons
  on القويسني's commentary; every verse is quoted fully vocalized («… ... …») before it is explained. Pages 1–270: https://shamela.ws/book/36107
  143 of 144 verses taken from here (each verse appears 1–4 times; the copy with the most marks was used, all copies agree on wording).
  Raw: `raw/sullam/shamela-36107/`.
- **Check 1 (independent family):** «شرح العلامة الأخضري على سلمه» (the author's own commentary, «نقلت بالاعتماد على طبعة البابي الحلبي»,
  source الشاملة الذهبية) on ketabonline, book 23096. It has the full poem vocalized as an appendix (pp. 41–48) and the verse lemmas in the
  commentary body: https://ketabonline.com/ar/books/23096 (API pages saved in `raw/sullam/ketabonline-23096/`).
- **Check 2:** المكتبة الشاملة 36056 «الشرح المختصر للسلم المنورق» (also الحازمي — same family as the base, used only to resolve the base's own typos):
  https://shamela.ws/book/36056 (`raw/sullam/shamela-36056/`).
- **Check 3:** Arabic Wikisource «السلم المنورق» (144 verses, no sukun marks): https://ar.wikisource.org/wiki/السلم_المنورق — its wording and even its
  typos (القَضِِيَّه، جُزئِيِّه) match the base exactly, so it is a copy of the same text, not an independent witness. `raw/sullam/wikisource.wiki`.
- **Check 4:** fatihsyuhud.org «متن السلم المنورق» (142 numbered lines; partly vocalized; close to Check 1 but with its own readings):
  https://www.fatihsyuhud.org/2013/04/ilmu-mantiq-sullam-munawroq.html (`raw/sullam/fatihsyuhud.html/.txt`).

No standalone fully-vocalized matn of the Sullam exists on shamela.ws (category المنطق has only the two Hazimi books); this is why the
vocalized verse lemmas of the Hazimi lessons are the base.

## Count
144 ✔ — base, Wikisource and the ketabonline appendix all give 144 with the same headings at the same verses
(1, 15, 19, 24, 26, 33, 37, 40, 50, 63, 68, 73, 82, 100, 107, 115, 122). fatihsyuhud has 142 lines: it lacks verses 56, 69, 71, 72 of the
standard order and splits/merges two others.
Verse 139 («لا سيما في عاشر القرون») is the only verse the Hazimi lessons never quote; it was taken from Check 1 + Wikisource (see below).

## Headings
Hazimi's own vocalized headings (identical wording to Wikisource): «فَصْلٌ فِي جَوَازِ الاِشْتِغَالِ بِهِ», «بَابُ القَضَايَا وَأَحْكَامِهَا»,
«فَصْلٌ فِي القِيَاسِ الِاسْتِثْنَائِيِّ», «فَصْلٌ فِي لَوَاحِقِ القِيَاسِ», «فَصْلٌ فِي أَقْسَامِ الحُجَّةِ» … The Halabi print (Check 1) has shorter forms
(«بَابٌ في القَضايا وَأَحْكامِها», «فَصْلٌ في الاستثنائي», «لَوَاحِقُ القِيَاس», «أَقْسامُ الحُجَّة»). Completed marks: «أنْوَاعِ»→«أَنْوَاعِ»,
«المُعَرِّفاتِ»→«المُعَرِّفَاتِ», «وَالجُزْئِيّةِ»→«وَالجُزْئِيَّةِ». «مُقَدِّمَةٌ» (v.1) is from Check 1 (Wikisource «مقدمة»).

## Wording differences (base kept unless stated)
| Verse | Chosen (base) | Other reading | Why |
|---|---|---|---|
| 17 | جَوَازُهُ **لِكَامِلِ** القَرِيحَهْ | لسالم (fatihsyuhud) | Base, Wikisource and the author's commentary (Check 1) all have لكامل. |
| 22 | وَمَا **بِهِ إِلَى** تَصَوُّرٍ وُصِلْ | وما إلى تصور به وصل (fatihsyuhud) | Base and Check 1 agree. |
| 40 | مُعَرِّفٌ **عَلَى** ثَلاَثَةٍ قُسِمْ | إلى (fatihsyuhud) | Base and Check 1 agree. |
| 55 | مُوجَبَةٌ **وَسَالِبَهْ** | أَوْ سالبه (Check 1, appendix and lemma) | Base, Wikisource and fatihsyuhud have و. Both fit the meter. **Noted for review.** |
| 95 | وَغَيْرُ مَا ذَكَرْتُهُ **لَنْ** يُنْتِجَا | لَمْ (Check 1, fatihsyuhud) | القويسني's commentary text (quoted by الحازمي) reads «(لَنْ يُنْتِجَا) بل هو عقيم»; Wikisource agrees. **Noted for review.** |
| 100 | يُدْعَى **بِالِاسْتِثْنَائِي** يُعْرَفُ **بِالشَّرْطِي** | بالاستثناءِ … بالشرطِ (appendix, fatihsyuhud, Shamela 36056); the commentary lemma has بالاستثنائي … بالشرط | Base (36107) and Wikisource; same meaning, both rhyme with امتراءِ. **Noted for review.** |
| 124 | **لِالتِبَاسِ** الكَاذِبَهْ | كالتباس (fatihsyuhud) | Base and Check 1 agree. |
| 125 | أَوْ **نَاتِجٍ** إِحْدَى المُقَدِّمَاتِ | لازم (fatihsyuhud) | Base and Check 1 agree. |
| 5, 133 | العُلاَ | العُلَى | Spelling only. |
| 7 | مَادَامَ | ما دام | Spelling only (kept joined as in base and Check 1). |

## Corrections to the base (each backed by another source or by plain grammar/spelling)
| Verse | Base | Written as | Reason |
|---|---|---|---|
| 8 | في | فِي | The only unmarked word in the base. |
| 29 | الجُزْئِِيُّ | الجُزْئِيُّ | Doubled kasra (typo). |
| 31 | وَالكُلِّيَاتُ | وَالكُلِّيَّاتُ | Missing shadda; Check 1 has it. |
| 41 | بِالْجِِنْسِ | بِالْجِنْسِ | Doubled kasra. |
| 51 | ثُّمَ | ثُمَّ | Shadda on the wrong letter. |
| 66 | فََإِنْ | فَإِنْ | Doubled fatha. |
| 68 | القَضِِيَّهْ | القَضِيَّهْ | Doubled kasra. |
| 82 | قَضِيَّتَىْ | قَضِيَّتَيْ | ى printed for ي. |
| 93 | جُزْئِيِّهْ | جُزْئِيَّهْ | Kasra for fatha on the yaa; Check 1 and Shamela 36056 have جُزْئِيَّة. |
| 97 | بِالحَمْلِىِّ | بِالحَمْلِيِّ | ى printed for ي. |
| 122 | مَادَةٍ | مَادَّةٍ | Missing shadda; Check 1 has مَادَّةٍ. |
| 126 | وَالحُكْمُ … وَجَعْلُ | وَالحُكْمِ … وَجَعْلِ | Both are further examples coordinated with «كَمِثْلِ جَعْلِ العَرَضِي» (v.125), so genitive. Check 1 (appendix and lemma) and Hazimi's other book (36056) have the kasra. |
| 133 | أَكْرَمُ **مِنْ** تَفَضَّلاَ | أَكْرَمُ **مَنْ** تَفَضَّلاَ | «أكرمُ مَن تفضَّل» (the most generous of those who give). Check 1 and fatihsyuhud have مَنْ. Wikisource copies the base's مِنْ. |
| 136 | قَبيِحَا | قَبِيحَا | Kasra placed on the yaa instead of the baa. |
| 139 | (missing in base) | لَا سِيَّمَا فِي عَاشِرِ القُرُونِ \| ذِي الجَهْلِ وَالفَسَادِ وَالفُتُونِ | Wording from Check 1 and Wikisource (identical). Marks: Check 1 gives the sukuns, Wikisource the final kasras; nothing was added that neither has. Written «لَا سِيَّمَا» as two words (Check 1). |

Mechanical: the «...» hemistich marker became « | »; no numbers, punctuation or tatweel remain; text is NFC, UTF-8 without BOM.
About 92% of consonants carry a mark; the unmarked ones are the lam of «ال» and a few letters the base leaves bare
(e.g. «التِزَامٌ» without sukun on the lam). Those were left as they are.

## Vocalization variants kept as in the base (for reference)
- 20 «وَقَدِّمِ الأَوَّلَ» (imperative; base, Wikisource, 36056) — Check 1: «وَقُدِّمَ الأَوَّلُ» (passive).
- 25 «إِنْ بِعَقْلٍ التُزِمْ» — Check 1: «التَزَمْ».
- 30 «فَانْسُبْهُ» — Check 1: «فَانْسِبْهُ» (both are correct Arabic).
- 37 «كَكُلُّ ذَاكَ» — the quoted example «كلُّ ذاك ليس ذا وقوع» keeps its nominative (حكاية). Check 1: «كَكُلِّ».
- 46 «وَلاَ تَجَوُّزَا» (noun) — Check 1: «تُجُوِّزَا» (passive verb).
- 54 «بِلاَ شَيءٍ وَلَيْسَ بَعْضُ» — Check 1: «شَيْءَ … بَعْضٌ».
- 58 «وَمِثْلِهَا شَرْطِيَّةٍ» (genitive) — Check 1: «وَمِثْلُها شَرْطِيَّةٌ».
- 93 / 69 «مُوجَبَة / المُوجَبَ» — Check 1 sometimes «مُوجِبَة». Both are used by logicians; the base is consistent.
- 94 «أَرْبَعَةُ … فَسِتَّةُ» without tanween at the hemistich ends — Check 1 has tanween.
- 127 «شَرْطِ النَّتْجِ» — Check 1: «النُّتْجِ».
- 141 «مِنْ سَنَةٍ إِحْدَى» (tanween; the meter needs a long syllable here) — Check 1: «سَنَةِ». «المِئِينَ» kept (Check 1: «المَئِيْن»).

## Places to verify
- 41 «وَخَاصَةٍ» has no shadda in **any** source (probably lightened for the meter). Left as is.
- 55 «وَسَالِبَهْ / أَوْ سَالِبَهْ», 95 «لَنْ / لَمْ», 100 «بِالِاسْتِثْنَائِي … بِالشَّرْطِي» vs «بِالاسْتِثْنَاءِ … بِالشَّرْطِ»: the two families differ. The
  base family was kept. A teacher's preferred printing may decide.
- 126 the genitive was adopted over the base's nominative (see above).
