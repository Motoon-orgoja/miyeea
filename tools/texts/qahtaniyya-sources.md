# Texts report — نونية القحطاني (`qahtaniyya.txt`)

How the comparison was done: every witness was parsed into verses and the verse lists were aligned by script. Each hemistich was then compared word by word with an LCS script, after stripping harakat, tatweel and footnote numbers and unifying the alef, yaa, taa marbuta and hamza-seat forms. No comparison was done by eye. Every verse of the result was also scanned against بحر الكامل by a second script. Its feet are متفاعلن / مستفعلن, the darb is متفاعلْ / متْفاعلْ, verse 1 is مصرّع, and an unwritten إشباع of هُ / هِ / مُ is allowed.
Scripts are in `tools/texts/qahtaniyya-build/`:
- `parse.js` writes `out/sources.json`.
- `collate.js` collates the wording (`out/collate.txt`).
- `meter.js` checks the meter.
- `build.js` writes `qahtaniyya.txt` and logs every change.

Raw downloads are in `tools/texts/raw/qahtaniyya/`.

## Sources
- **Base (wording + vocalization): the circulated vocalized text, 689 verses, as published on الديوان**: https://www.aldiwan.net/poem134646.html. This is the text students memorize and that the well-known recordings (e.g. Fares Abbad) follow. It is fully vocalized. The only bare words were «في» (159 times) and the lam in the لأ ligature (43 times, see below). The same text appears **letter for letter and mark for mark** on alomah.net (https://alomah.net/نونية-القحطاني/) and the islamedotco blog (https://islamedotco.wordpress.com/2014/06/12/نونية-القحطانى/). The script found 0 differences in both wording and harakat, so these three count as **one** witness, not three.
- **Check 1 (independent, unvocalized): المكتبة الشاملة 7533** «القصيدة النونية للقحطاني», edited by عبد العزيز بن محمد الجربوع (دار الذكرى، ط١). It is a critical text from two manuscripts (س، م) with footnotes, pages 1–44: https://shamela.ws/book/7533/1. Its numbering runs to 690, but there are two numbering slips: «610» is printed in place of 601, and 666 is skipped. **It has 689 verses.** ketabonline 5688 is the same edition taken from الشاملة, so it was not used separately.
- **Check 2 (unvocalized): Arabic Wikisource «نونية القحطاني»**: https://ar.wikisource.org/wiki/نونية_القحطاني. It shares the الجربوع edition's peculiar typos («الخضوم»، «ماكنا»، «الشقاسق»، «بجبل»، «الذونوب»), so it is **derived from الشاملة** and is not independent. It has 686 verses: verse 63 is missing, 439 is missing, and 669–670 are merged.
- **Not reachable:** the mktaba.org thread «نونية القحطاني بالتشكيل والضبط الكامل» (HTTP 403). The printed vocalized booklets (e.g. the Sifat us-Safwa listing) have no online text.
- **No second independent fully vocalized source was found online.** The harakat therefore rest on the circulated text alone. They were checked by the meter script and by grammar. The wording was checked against the independent الجربوع edition.

## Count and order
- **689 verses** ✔. The base and the الجربوع edition align 1:1 in the same order, with no extra or missing verses (aside from the numbering slips above). الديوان also states 689. The published descriptions give «686 أو 690 بيتًا حسب الطبعة». The 686 is the Wikisource/derivative count. I could not reach any 690-verse print to check for an extra verse. **No verse present in another available edition was omitted.**
- **Headings:** neither the circulated vocalized text nor الجربوع has section headings. The file therefore has a single «## المنظومة» line, as in `hairiyya.txt`.

## Wording differences against الجربوع (base kept in every case: the circulated text)
Spelling-only differences are not listed. These include the rhyme ـانِ/ـانِي, الحصا/الحصى, الرضا/الرضى, كلما/كل ما, دونما/دون ما, ماؤه/ماءه, داوود/داود, the أنَ/أنا spelling, and يأيها. Obvious typos in الجربوع/Wikisource are not listed either (e.g. كلماه، برأى، الذونوب، الخضوم، ماكنا، الشقاسق، بجبل، المقتلتين، زأبحر، وها، للكفى، والغاران).

| Verse | Base (kept) | الجربوع | Note |
|---|---|---|---|
| 9 | يَا رَبِّي | يا رب | Both scan. |
| 15 | وَعَطَفْتَ مِنْكَ | والعطفُ منك | — |
| 55 | الأُلُوهَةِ | الألوهية | The base scans. |
| 64 | قَصَصٌ **عَلَى** خَيْرِ الْبَرِيَّةِ | (على missing) | Without على the verse breaks the meter. |
| 88 | وَكَذَا الشَّرِيعَةُ وَالْكِتَابُ كِلاَهُمَا | والخير والشر اللذان كلاهما | الجربوع follows MS م. The circulated text has the other reading. |
| 93 | حَقٌّ | حقًّا | — |
| 111 | جَهَنَّمَ (corrected, see below) | جهنما | الجربوع supports the fatha. |
| 187 | زَنَادِقَةَ **الرَّوَافِضِ** | زنادقة **الجهالة** | Notable variant. The base is the circulated reading. |
| 311 | كُنْ مُتَيَمِّمًا | فكن متيمما | فكن does not fit the meter. |
| 317 | فَإِذَا **تَغَيَّرَ** لَوْنُهُ | فإذا صفى في لونه | — |
| 324 | وَاحْذَرْ | أحذر | — |
| 334 | كِلَيْهِمَا | كلاهما | Both are grammatical (توكيد مجرور / مبتدأ). |
| 381–382 | …وَهُنَّ **مَثَانِي** / …فَخُذْ **تِبْيَانِي** | the two rhyme words swapped | — |
| 388 | فِي غَيْرِهِ | في غيرها | — |
| 389 | رَاكِعًا **أَوْ** سَاجِدًا | (أو missing) | The meter needs أو. |
| 418 | لاَ يَبْدُ | لا يبدو | — |
| 419 | فَالْقَطْرُ | والقطر | — |
| 434 | فَسَطَا | قسطا | — |
| 518 | فِيهَا | فيهما | فيهما breaks the meter. |
| 593 | هُوَ مُنْجِنِي | وهو منجني | — |
| 603 | فَبَلَعْتُمُ | فبلغتم | — |
| 615 | بِلاَ عِنَنٍ | بلا عن | — |
| 618 | وَإِيمَانُ | وإيما | — |
| 637 | وَلأُنْزِلَنَّ بِكُمْ أَلِيمَ صَوَاعِقِي | ولأنزلن إليكم بصواعقي | Notable variant. |
| 642 | وَلأَكْتُبَنَّ | ولأكبتن | — |
| 655 | لأُبْغِضُكُمْ | لأبغضنكم | — |
| 669 | وَأَبْحُرُ | زأبحر (typo) | — |
| 670 | بُخَلاَ | بخلاء | بخلاء breaks the meter. |

Line division: الجربوع puts «تنم» (527) and «حيًّا» (568) at the start of the second hemistich. The base keeps them in the first hemistich, and it scans.

## Vocalization corrected (logged by `build.js`; each one is a clear typo or breaks the meter or grammar)
| Verse | Base | Written as | Reason |
|---|---|---|---|
| 22 | بَشُكْرِ | بِشُكْرِ | The preposition باء takes kasra. |
| 98 | كَِفَّةِ | كِفَّةِ | Two vowels were on the kaf. The kasra was kept (كِفّة الميزان; كَفّة is a variant). |
| 111 | جَهَنَّمٍ | جَهَنَّمَ | The name is diptote. The fatha scans, and الجربوع has «جهنما». |
| 119 | وَالوَِتْرُ | وَالوِتْرُ | Two vowels were on the waw. The kasra was kept (صلاة الوِتر). |
| 125 | مْفْتَرَضٌ | مُفْتَرَضٌ | A sukun at the start of a word is impossible. |
| 134 | نَقََصَ | نَقَصَ | The fatha was doubled. |
| 191 | رَبِي | رَبِّي | The shadda was missing, and the meter needs it. |
| 275 | مَرْيَمٍ | مَرْيَمَ | The name is diptote, and the tanwin breaks the meter. |
| 281 | بِرَبِّهْمِ | بِرَبِّهِمْ | The marks were swapped. |
| 416, 418 | فُُؤَادِكَ / فَُؤَادَكَ | فُؤَادِكَ / فُؤَادَكَ | The marks were doubled or conflicting. |
| 465 | الْحَمَامَ | الْحَمَّامَ | The word is «the bath», as in the second hemistich, and the meter needs the shadda. |
| 482 | فَإنِّهَا | فَإِنَّهَا | The particle is إِنَّ. |
| 487 | ثَلاَثَةٍ أَقْرُءٍ | ثَلاَثَةِ أَقْرُءٍ | It is an iḍāfa, and the tanwin breaks the meter. |
| 518 | فِيهِا | فِيهَا | A kasra before the alef is a typo. |
| 540 | وَلَيَسْ | وَلَيْسَ | Obvious typo. |
| 544 | مُخَتَارِيُّهُمْ | مُخْتَارِيُّهُمْ | The meter needs the sukun. |
| 558 | يَعْمُّهُ | يَعُمُّهُ | The verb is عَمَّ يَعُمُّ, and the sukun breaks the meter. |
| 559 | عَبِيدِهْ | عَبِيدِهِ | The meter needs a moving هاء with إشباع. |
| 588 | الْْحِيتَانِ | الْحِيتَانِ | The sukun was doubled. |

**Completed:** «في» → «فِي» 159 times (once as «وَفِي»). It is its only possible vocalization.

## Vocalization kept as in the base (for reference)
- **Vocalization coverage:** about 99.8% of the letters carry marks. The only unmarked consonants are the lam of «لأ» (43 words, e.g. وَلأَذْكُرَنَّكَ، لأَهْلِ، لأَمْرِ). The base leaves the lam bare before the ligature, as many prints do, and the other poem files keep the same convention. They were **not** filled in. Fill them if the site wants full marks: لَ for the oath and jawāb lam, and لِ for the jarr lam in لأَمْرِ، لأَحْمَدَ، لأَهْلِ، فَلأَجْلِهَا، لأَذَاكَ.
- «اللهِ» is written without a shadda throughout, as in the source.
- «أَنَ» is a deliberate short spelling of أنا where the meter needs the short form (596, 597, 608, 629, 663). «أَنَا» keeps its alif where it is long (597).
- 405 «وَلَوَ انَّهُ» is the naql of the hamza for the meter. It was kept.
- 82 «وَلاَ يَقْدِرْ» has a sukun for the meter. الجربوع's footnote notes the same.
- 618 «جِبْرِيلٍ» has tanwin, which the meter needs (صرف للضرورة).
- 325 «وُضُوءِكَ» keeps the source's hamza spelling.

## مواضع للتأكد
- **231** «كَذَبَ أَرِسْطَالِيسُهُمْ فِي قَوْلِهِ». The first foot does not scan as written (four moving letters). الجربوع has the same words. Kept as in all sources.
- **658** «وَأَسًى عَلَيَّ وَعَضُّو كُلَّ بَنَانِ». The second foot scans only if ضُّو is short. الجربوع writes «وعضوا». Kept.
- **98** كِفّة/كَفّة and **119** الوِتر/الوَتر: the base had both vowels. I chose kasra.
- **111** جَهَنَّمَ: corrected from جَهَنَّمٍ. Both scan.
- **Notable wording variants** where you may want to follow a printed edition your teacher uses: 88, 187, 317, 637 (see the table).
- **Authorship:** الجربوع/الشاملة give «لعله أبو عبد الله محمد بن صالح القحطاني المعافري الأندلسي (ت ٣٧٨هـ)». The common attribution is «أبو محمد عبد الله بن محمد الأندلسي القحطاني». Researchers doubt both. The meta file states the doubt and gives no firm death date.

## Checks done
- `qahtaniyya.txt` has 689 verse lines and 1 `## ` heading line. Every verse line has exactly one ` | `. It is UTF-8 with no BOM, LF line endings, and no numbers, brackets or footnote marks.
- `node tools/build-poem.js tools/texts/qahtaniyya.txt __test …` gives `verses 689 sections 1`. `data/__test.js` was deleted afterwards.
- Meter script on the final text: 4 verses flagged. 558 and 622 are scanner false positives (السموات), which I checked by hand. 231 and 658 are listed above.
