# Texts report — لامية ابن الوردي (`wardiyya.txt`)

Zayn al-Din Umar ibn al-Muzaffar Ibn al-Wardi (d. 749 AH), ramal, rhymed in lām. It is also known as «نصيحة الإخوان ومرشدة الخلان» and «وصية ابن الوردي».
How it was done: every source was parsed into verses by script (`scripts/wardiyya/ex-sources.js`, `ex-aldiwan.js`). Each was compared word by word after removing harakat and tatweel and unifying alef/yaa/ta-marbuta forms (`scripts/compare.js`, LCS). The final harakat were checked letter by letter against every vocalized source (`scripts/merge-harakat.js`).
Raw files as downloaded: `tools/texts/raw/wardiyya/`. All script output: `raw/wardiyya/_collation-log.txt`.

## No fully vocalized copy exists online
shamela.ws has no copy of the poem, and its search returned HTTP 521 during this work. ar.wikisource has no copy. ketabonline has only commentaries. The copies below are vocalized only in part. By script count (`scripts/vcount.js`), U marks 33 % of the letters, H 35 % and D 31 %. So **the vocalization is built from these partial marks, and the rest was completed by hand** where only one reading is possible by grammar and meter. The doubtful places are listed at the end.

## Sources
| Siglum | Source | Role |
|---|---|---|
| **U** | «العرف الندي في تخميس لامية ابن الوردي» by al-Mallah (d. 1044), ed. د. جميل عبد الله عويضة (1431/2009). It is edited from two manuscripts (King Saud Univ. = س, the base; Tokyo = ط) plus the diwan, with variants in footnotes. ketabonline 57150: https://ketabonline.com/ar/books/57150 | **Base** for verse order and wording; partly vocalized. Only the poem's own hemistichs were used, not the tahmis lines. |
| **D** | الديوان (aldiwan.net) poem 28334, which is the «الموسوعة الشعرية» diwan text. It has 76 verses and is partly vocalized: https://www.aldiwan.net/poem28334.html | Wording + harakat. |
| **H** | «شرح لامية ابن الوردي» by يحيى الحجوري (1426), whose «نص اللامية» was collated by حسين الحجوري on several copies. It reports the readings of two manuscripts م and ش in footnotes. ketabonline 23160: https://ketabonline.com/ar/books/23160 | Wording + harakat. 77 verses = 74 + 3 closing salawat verses. |
| F | «شرح لامية ابن الوردي» by عبد العزيز الطريفي (lesson transcripts), ketabonline 91514: https://ketabonline.com/ar/books/91514 | Wording of the lemmas only; unvocalized. |
| K | «فتح الرحيم الرحمن شرح لامية ابن الوردي» (print of 1298 AH), the classical commentary, as an OCR text (OpenITI Kraken, very noisy): https://raw.githubusercontent.com/OpenITI/0750AH/master/data/0749ZaynDinIbnWardi/0749ZaynDinIbnWardi.FathRahim/0749ZaynDinIbnWardi.FathRahim.Kraken22020817055002-ara1 | Searched with grep in the disputed places only; used as the tie-breaker. |

## Two text traditions
H's main text is the modern vulgate. Examples:
- رفيعٍ وتُجَل
- في حكمةِ من
- إصلاح العمل
- عيشة الراغب … الجاهل فيها أو أقل
- بات فيها مكثرًا
- وازجره
- دار جار السوء بالصبر
- لا تعاند
- أقصاه

U, D, F, K and **H's own two manuscripts (م، ش)** agree against it in most of these places. Hajuri himself notes one (40: «ينفي، وهو الصواب»). So the wording follows the manuscript tradition. At each disputed word, the reading of the majority of U, D, H, F, K (and H's م/ش) was taken.

## Verse count and order
**77** ✔. This matches the manuscript catalogues («77 verses»); D's page says 76.
- D's 76 verses + «لَا يَضُرُّ الْفَضْلَ إِقْلَالٌ …». That verse is in U (misprinted «لا يَميز»), in H and in K; it is missing in D and F.
- U lacks «أَعْذَبُ الْأَلْفَاظِ …» in the main text (it appears in its appendix). That verse is in D, H, F and K.
- **Not included:** the three closing salawat verses. H has «وصلاةُ اللهِ ربي كلما …»; H's ش, K and U's tahmis have a different set («وصلاةٌ وسلامٌ أبدًا …»). H's م ends at «تفاصيل الجمل», and the verses differ from copy to copy. If they are wanted, H's three can be appended (count 80).
- **The three ghazal verses 5–7** («وَالْهَ عَنْ آلَةِ لَهْوٍ»، «إِنْ تَبَدَّى»، «زَادَ إِنْ قِسْنَاهُ») are in U, D, F and K, and in H's م/ش. They are missing only in H's main text.
- **Order:**
  - 6 «إن تبدّى» before 7 «زاد» (D, F, K; U reverses them).
  - 9 «واهجر الخمرة» before 10 «واتّق الله» (U, H, F, K; D after 11).
  - 66 «خذ بنصل السيف» before 67 «لا يضر الفضل» (U, K, H's م/ش; H's main text reverses them).

## Wording: chosen reading and witnesses
| Verse | Chosen | Witnesses for it | Other reading |
|---|---|---|---|
| 2 | الذِّكْرَى | U D K | الذِّكر (H F) |
| 3 | أَهْنَى | U(س) H K | أحلى (D F, U's ط) |
| 4 | وَتُرْفَعْ وَتُجَلّ | U D F K(?), H's م ش | رفيعٍ وتُجلّ (H) |
| 7 | أَوْ عَدَلْنَاهُ | F K, H's footnote | وعدلناه (U D) |
| 10 | جَاوَرَتْ | U H F K | جاوزت (D) |
| 11 | يَتَّقِي اللَّهَ الْبَطَلْ | H F (من is a relative) | يتّقِ (U D); بطل without ال (D) |
| 12 | بِاللَّيْلِ | D K, U's ط and diwan, H's ش | في الليل (U H F) ⚠ |
| 13 | قُدْرَةِ | U D F K | حكمة (H) |
| 13 | سُبُلًا | F K, U's ط and diwan | سبلنا (U D H) ⚠ |
| 14 | كَتَبَ الْمَوْتَ … جَيْشٍ | U F H | كُتِبَ (H); جمع (D K) |
| 15 | الْأَرْضَ | U F H K | الأمر (D) |
| 22 | وَاحْتَفِلْ … أَوْ خَوَلْ | D H; U D | فاحتفل (U); وخول (H) |
| 25 | إِصْلَاحُ الْعَمَلْ | H K | يا صاحِ العمل (U D) |
| 26 | بِالنُّطْقِ | H F K | في النطق (U D) |
| 27 | انْظُمِ … فَاطِّرَاحُ الرِّفْدِ فِي الدُّنْيَا أَقَلّ | F H K; U D F K | وانظم (U D); «في اطّراح الرفد لا تبغِ النّحل» (H) |
| 29 | الْفَضْلِ … مُقْرِفٍ | U H K | الجود (D F); مقرفًا (U) |
| 31 | إِنْ جَزَتْنِي … أَوْ لَا | H F K; D H K | إن تُجِزْني (U D); أَوْلى (U F) |
| 32 | وَأَمَرُّ اللَّفْظِ نُطْقِي | H K (F: القول نطقي) | وأمرّ القول قولي (D) |
| 33 | عَنْهُ تُغْنِي … اجْتِزَاءٌ | U D H; U H F K | تغني عنه (F K); ارتشاف (D) |
| 35 | مِنْ عَزْمِهِ … يَوْمًا | H F K; D H F K | عن عزمه (U D); عنه (U) |
| 36 | اطْرَحِ | U H F | واترك (D) |
| 37 | الزَّاهِدِ … الْجَاهِدِ بَلْ هَذَا أَذَلّ | D F K, H's ش; D K, H's م ش; U D, H's ش | الراغب / الجاهل / فيها أو أقل (H) |
| 38 | وَهْوَ مُثْرٍ مُكْثِرٌ وَعَلِيمٍ مَاتَ … بِالْعِلَلْ | U D F, H's م ش | «بات فيها مكثرًا … بات منها في علل» (H); وحكيم (D); وعليل (F) |
| 39 | مِنْهَا الْمُنَى | U, H's ش | فيها (H); غنى (D) |
| 40 | وَاتَّئِدْ | U D F, H's م ش | واتّكل (H) |
| 41 | لَمْ تُفِدْ مِمَّا تُفَدْ | F K, H's م ش | «لم تنل منها المنى» (U D H; repeats verse 39) ⚠ |
| 41 | فَرَمَاهَا … مِنْهُ | U H F K; U D H K | فبلاها (D); منها (F) |
| 43 | غَيْرِ أَبٍ … يُنْفَى الزَّغَلْ | U D F K, H's م ش | دونِ / يُنقى الدغل (H) |
| 44 | وَكَذَا … يَطْلُعُ | U D F K; U K, H's م ش | إنما (H); ينبت (D F H) |
| 45 | مَعَ أَنِّي | U D F, H's م ش | غيرَ أني (H) |
| 46 | أَوْ أَقَلّ | U D F, H's م ش | أم (H) |
| 47 | اكْتُمِ | H F K | واكتم (U D) |
| 48 | الْبَخَلْ | U D K(?) | الخلل (H F) ⚠ |
| 49 | وَكِلَا … زَادَ | U H K; U D F H | فكلا (D F); دام (K, H's ش) |
| 50 | سَبِّ | U D F, H's م ش | حق (H) |
| 51 | وَتَغَافَلْ … بِالْحَمْدِ | U D F K, H's م ش; U H F K | وتغاضى (H); بالرفد (D) |
| 52 | مِنْ ضِدٍّ وَإِنْ … رَأْسِ جَبَلْ | U H F; U D, H's م ش; U D F, H's م ش | عن (D); ولو (H F); الجبل (H) |
| 53 | مِلْ … وَاهْجُرْهُ | U H K; U D F K, H's ش | غِبْ (D F); وازجره (H) |
| 54 | جَارَ الدَّارِ إِنْ جَارَ | U D K, H's ش (part) | السوء بالصبر (H F) |
| 55 | لَا تُخَاصِمْ | U D F K, H's ش | لا تعاند (H) |
| 56 | الْحُكْمَ وَإِنْ | U D F, H's م ش | الأحكامَ إنْ (H) |
| 59 | إِنَّ لِلنَّقْصِ … لَوَعْظًا وَمَثَلْ | U H; U D | إنما النقص (D); أو مثل (H) |
| 60 | الشَّخْصُ | H F K | المرء (U D) |
| 61 | فَالْوِلَايَاتُ | U H K | والولايات (D) |
| 62 | جَلَدِي | U D H | جسدي (F, H's ش) |
| 65 | أَضْنَاهُ | D F, H's ش | أصماه (U); أقصاه (H) |
| 66 | بِنَصْلِ | D F H | بحدّ (U K) |
| 70 | عَبَثًا … بِالْجُعَلْ | D F H; U D F | عاتبًا (U); عابثًا (H's م ش); للجعل (H) |
| 71 | لَفْظِي | U D F, H's م ش | قولي (H) |
| 72 | لِينًا | U H K | لينٌ (D) |
| 73 | سُخِّنَ | U D F, H's م ش | أُسخِنَ (H) |
| 74 | كَيْفَمَا | U D F K | كيف ما (H) |
| 76 | يُسْتَقَلّ | D H F K | مستقلّ (U) |

## Harakat
- Where U, D and H mark the same word, the final file agrees with them. The only exceptions, found by script, are listed below; every other difference is a shadda written without its vowel in the source, the sukun on a rhyme letter that has a shadda (حَلّ، وَجَلّ، أَقَلّ، أَذَلّ، الْأَجَلّ، يُسْتَقَلّ، تُغَلّ، تُجَلّ, which the sources write as حلْ etc.), or tanween written on the alif instead of the letter before it.
- **Source marks changed:**
  - 3 إِنَّ (U, H إنْ): إنْ cannot govern this sentence; D has إنَّ.
  - 3 قَضَّيْتُهَا: the shadda is added because the meter needs it.
  - 14 كَتَبَ (H كُتِبَ): this follows U and D.
  - 21 اطْلُبِ (H أطلبُ, a typo).
  - 22 خَوَلْ (U خِوَل): this follows D and H.
  - 33 وَعَنِ الْبَحْرِ (U, D وعنْ): two sukuns cannot meet.
  - 47 وَاكْسِبِ (H واكسَب): كَسَبَ يَكْسِبُ.
  - 49 رُتْبَةٌ (U, D رتبةً): it is the mubtada' delayed after the zarf.
  - 50 بِأَهْلٍ (H بأهلِ).
  - 59 وَالِاسْتِثْقَالِ (U, D ـُ): coordinated with النقص; H has ـِ.
  - 69 وَسُرَى (H وسَرى): this follows U and D.
  - 74 كَسْرُهُ (H كسُّره).
- **Completed by rule or meter:**
  - 11 طُرْقًا
  - 12 يَرْصُدُ
  - 13 سُبُلًا (u u – – needed)
  - 36 الْعَالِي (no vowel on the ya, for the meter)
  - 45 بَكْرِ اتَّصَلْ (no tanween, for the meter)
  - 48 الْبَخَلْ (the rhyme foot needs ba-khal)
  - 41 تُفِدْ … تُفَدْ (K: «بضم المثناة وكسر الفاء» and «بضم أوله وفتح ثانيه»)
  - the sukun on the qamari article lam, and the case endings throughout
- Result (script `scripts/vcount.js`): ≈ 99.5 % of letters carry a mark. Two letters are left unmarked on purpose: 62 السَّفلْ and 77 غمْرٌ (see below).

## Places to confirm (مواضع للتأكد)
1. **The text tradition.** If the students should memorize the modern vulgate (H's main text: رفيعٍ، حكمة، الراغب … الجاهل فيها أو أقل، بات فيها مكثرًا، وازجره، جار السوء بالصبر، لا تعاند، أقصاه …), about 30 one-word swaps are needed. The table above gives them.
2. **77 غمْرٌ**: the ghayn is unmarked. U has غَمْر («abundant»); غُمْر («inexperienced») fits the self-deprecation better. Not settled.
3. **62 السَّفلْ**: the fa is unmarked. The meter needs a short vowel (سَفَل / سَفِل), but no source marks it.
4. **12 بِاللَّيْلِ / فِي اللَّيْلِ**, **13 سُبُلًا / سُبْلَنَا**, **41 لَمْ تُفِدْ مِمَّا تُفَدْ / لَمْ تَنَلْ مِنْهَا الْمُنَى**, **48 الْبَخَلْ / الْخَلَلْ**: the witnesses are close to evenly split.
5. **59** does not scan in any source («وَالِاسْتِثْقَالِ» is a syllable too long). The words are kept as transmitted.
6. **The closing salawat verses** are not included. See Verse count.
