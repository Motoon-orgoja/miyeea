# Texts report: قطر الندى وبل الصدى (Ibn Hisham al-Ansari, d. 761 AH), matn only (`qatr.json`)

How the collation was done: every witness was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, a standalone «و» / «كـ» was joined to the next word, and the texts were aligned word by word with an LCS script (`qatr-tools/merge.js`, `qatr-tools/chk.js`). This was done by script, not by eye. Raw downloads are in `raw/qatr/`.

## 1. Sources

**No fully vocalized standalone digital matn exists.** I checked these:
- Shamela 11376 «متن قطر الندى وبل الصدى» (دار الصميعي، ط1 1420هـ، 26 pp.): https://shamela.ws/book/11376 — about 27% of consonants carry a mark. Ketabonline 880 is the same text: https://ketabonline.com/ar/books/880
- takw.in reader: partly vocalized only.
- Shamela 6970 «شرح قطر الندى» (تحقيق محيي الدين عبد الحميد): the digital text is lightly auto-vocalized (about 35%) and has many OCR typos.
- Wikisource: has only the Muhyi al-Din sharh, not the matn.
- The fully vocalized prints (دار السلام and others) exist only as PDF scans.

So I used:
- **Vocalization base (F):** «تعجيل الندى بشرح قطر الندى» by عبد الله بن صالح الفوزان, Shamela 2135, all 310 pages: https://shamela.ws/book/2135 . Fawzan quotes the whole matn piece by piece («قوله: (…)»), and his main quotes are fully vocalized. I extracted the quotes by script (`qatr-tools/fz3.js`, cache `raw/qatr/shamela2135-fawzan/`). They cover the whole matn: of 3,762 words in the Sumay'i text, only 68 words of the final text have no counterpart in F. Short sub-quotes inside the commentary are often bare, and a few passages are quoted unvocalized (for example «فإن سقطت الفاء… بخلاف يأكلك»).
- **Wording check 1 (S):** Shamela 11376 (Sumay'i), pages 1–34 (`raw/qatr/shamela11376/`).
- **Wording check 2 (M):** Shamela 6970, Muhyi al-Din's edition, ed. 11, 1383 AH. I used the «ص …» matn segments (`qatr-tools/mh.js`, `raw/qatr/shamela6970-muhyi/`).

**Rule for wording:** where the three witnesses differ, the reading two of them share was adopted. One exception: «ليس اسم فاعله على أفعل», explained in the table below.

## 2. Count and divisions
- 199 paragraphs, 3,751 words, 27 chapters. The text runs from «الكلمة قول مفرد» to the end of the همزة الوصل section. All three witnesses end there; none has a closing formula.
- There is no standard paragraph count for this prose matn. The division into paragraphs is mine: each paragraph is one or two complete sentences in the order of the matn, with nothing dropped or added. Only the opening paragraph is 7 words, kept as the matn's first sentence.
- **Titles are applied** (they are for the app, not the matn's own words). The matn itself has only «باب…» / «فصل» markers, and many sections have none. I took the titles from the Sumay'i table of contents and made them descriptive. The words «باب»/«فصل» are carried by the title and not repeated at the start of the paragraph; the heading-sentences themselves (e.g. «الْمُبْتَدَأُ وَالْخَبَرُ مَرْفُوعَانِ», «يَعْمَلُ عَمَلَ فِعْلِهِ سَبْعَةٌ», «لَهُ صِيغَتَانِ») stay in the paragraph.
- Qur'anic examples are in ﴿﴾, in the spelling Fawzan's quotes give. The two hemistichs of a full verse are joined with « * ».

## 3. Wording differences (F = Fawzan, S = Sumay'i, M = Muhyi al-Din)
| Place | Adopted | Other reading | Why |
|---|---|---|---|
| المعرب | مَا يَتَغَيَّرُ **آخِرُهُ** | أواخرُه (S) | F+M |
| الحرف / الجوازم | **وَإِذْ مَا**؛ «إِنْ وَإِذْ مَا وَأَيٌّ…» | S «إنْ وإذْ وإذْما» (an extra وإذ) | F+M |
| أنواع الإعراب | وَجَزْمٌ **فِي فِعْلٍ** | omitted (S) | F+M |
| ما جمع بألف وتاء | ﴿خَلَقَ **اللَّهُ** السَّمَاوَاتِ﴾ | خلق السموات (S) | F+M, the Qur'anic wording |
| المقدر | وَيُسَمَّى **الثَّانِي** مَقْصُورًا | omitted (S) | F+M |
| ظن | ﴿وَحَسِبُوا **أَلَّا** تَكُونَ﴾ | أن لا (S) | Mushaf spelling (F) |
| واو المعية | وَتَشْرَبَ **اللَّبَنَ** | الحليب (S) | F+M |
| الضمير | أَوْ جَوَازًا **فِي** نَحْوِ | «فشي» (S, typo) | F+M |
| الضمير | كَأَنَا وَأَنْتَ **وَهُوَ** وَإِيَّايَ | without وهو (S) | F+M |
| اللقب | إِنْ **أُفْرِدَا** | أُفْرِدَ (S) | F+M (the name and the laqab both) |
| الموصول | وَ**الْأُلَى** | والأُولَى (F) | S+M |
| خبر الظرف | بِمُسْتَقِرٍّ أَوِ اسْتَقَرَّ **مَحْذُوفَيْنِ** | محذوفتين (S). F does not quote it | M, and grammatically correct (مستقر/استقر) |
| الإخبار بالزمان | وَاللَّيْلَةَ **الْهِلَالُ** | والليلةُ والهلالُ (S) | F+M (the example is «الليلةَ الهلالُ») |
| حذف الخبر | وَبَعْدَ **وَاوِ** الْمُصَاحَبَةِ | الواو (S) | F+M |
| كان وأخواتها | … وَبَاتَ، **وَصَارَ، وَلَيْسَ**، وَمَا زَالَ … | omitted (S) | F+M; the text later refers to «خبرَ… ليس» and «بمرادفة صار» |
| لا العاملة عمل ليس | فَلَا شَيْءٌ **عَلَى** الْأَرْضِ **بَاقِيًا** … **مِمَّا** قَضَى | عضلى / باتياً / بما (S) | F+M; S has typos |
| ليت | فَيَجُوزُ الْأَمْرَانِ | فيجوز **فيها** الأمران (F) | S+M |
| لا النافية للجنس | خَاصٌّ **بِالنَّكِرَاتِ** | بالمنكَّرات (S) | F+M |
| الإلغاء | خِلْتُ اللُّؤْمُ **وَالْخَوَرُ** | اللؤمَ والخَوَرا (S). F has اللُّؤْمُ | F; the verse rhymes in -ُ (raf' by ilghā') |
| الفاعل | إِنْ كَانَ **مُؤَنَّثًا** | مؤثاً (S, typo) | F+M |
| المستغاث | فِي لَامِ الْمَعْطُوفِ الَّذِي **لَمْ** يَتَكَرَّرْ مَعَهُ يَا | يتكرر (S) | F+M; this is the rule as stated in the sharhs |
| المستغاث | وَنَحْوُ يَا **زَيْدَا** لِعَمْرٍو | يا زيدُ لعمرو (S) | F+M (see «مواضع للتأكد») |
| تابع المنادى | **فَتْحُهُمَا** أَوْ ضَمُّ الْأَوَّلِ | فتحُها (S) | F+M |
| الترخيم | **سَلْمَانَ** وَمَنْصُورٍ وَمِسْكِينٍ | سليمان (S) | F+M |
| المفعول المطلق | **الْمُسَلَّطُ** عَلَيْهِ … أَوْ **مِنْ** مَعْنَاهُ | المتسلِّط … أو معناه (S) | F+M |
| | ﴿**وَكُلَا** مِنْهَا رَغَدًا﴾ | فكلا (S) | F+M, the Qur'anic wording |
| الحال | وَالْحَالُ، وَهُوَ وَصْفٌ فَضْلَةٌ **يَقَعُ** فِي جَوَابِ كَيْفَ | S «[باب الحال] وهو وصف فضلة في جواب كيف» | «يقع»: F+M. «والحالُ»: see «مواضع للتأكد» |
| الحال | وَشَرْطُهَا التَّنْكِيرُ، **وَصَاحِبِهَا** التَّعْرِيفُ | وشرطُ صاحبِها (M) | S+F |
| الحال | **وَلِمَيَّةَ** مُوحِشًا طَلَلٌ | لِمَةَ (S) | F+M |
| التمييز | وَالتَّمْيِيزُ، **وَهُوَ** اسْمٌ | هو (S) | F+M |
| التمييز | إِلَى تِسْعٍ وَتِسْعِينَ | إلى (تسع وتسعون نعجة) (M) | S+F |
| المستثنى | إِلَّا آلَ **أَحْمَدَ** شِيعَةٌ | آل محمد (S) | F+M; this is the wording of al-Kumayt's verse |
| المستثنى | وَبِخَلَا وَعَدَا وَحَاشَا نَوَاصِبَ **وَخَوَافِضَ** | S adds «وليس» in this list; M «أو خوافض» | «وليس» is dropped (F+M); «وخوافض» from S+F |
| الإضافة | كَـ﴿مَكْرُ اللَّيْلِ﴾ | كمكرِ الليل (S) | F (marked as Qur'an) |
| الإضافة | وَالضَّارِبُ رَأْسِ **الرَّجُلِ**، **وَبِالرَّجُلِ** الضَّارِبِ غُلَامِهِ | رأس الجاني، والرجل الضارب غلامه (M) | S+F |
| المصدر | فِعْلٌ مَعَ أَنْ أَوْ مَا | مع أن أو **مع** ما (M) | S+F |
| المصدر | وَلَا مُضْمَرًا، **وَلَا مَحْدُودًا**، وَلَا مَنْعُوتًا | omitted (S) | F+M |
| المصدر | ﴿أَوْ إِطْعَامٌ فِي يَوْمٍ ذِي مَسْغَبَةٍ **يَتِيمًا**﴾ | without يتيمًا (S) | F+M; يتيمًا is the word the example is about |
| التوكيد | بِحُبِّ **بَثْنَةَ** | بثينة (S) | F+M |
| العطف | وَثُمَّ لِلتَّرْتِيبِ **وَالتَّرَاخِي** | والتراخين (S, typo) | F+M |
| البدل | وَإِضْرَابٍ، وَغَلَطٍ، **وَنِسْيَانٍ** | وغلطٍ نسيانٍ (S) | F+M |
| موانع الصرف | كُلٌّ **مِنْهُمَا** يَسْتَأْثِرُ | منها (S) | F+M (ألف التأنيث and الجمع: two things) |
| التعجب | **لَيْسَ** اسْمُ فَاعِلِهِ **عَلَى** أَفْعَلَ | S «ليس اسم فاعله أفعل». F has neither ليس nor على | M, and S has ليس. It is the well-known condition |
| الوقف | **وَقَدْ يُعْكَسُ فِيهِنَّ، وَلَيْسَ فِي نَصْبِ قَاضٍ وَالْقَاضِي إِلَّا الْيَاءُ** | omitted (S) | F+M (M prints «إلى الياء», a typo) |
| الوقف | ﴿لَنَسْفَعًا﴾ | لَنَسْفَعَنْ (F) | S+M, the mushaf |
| همزة الوصل | وَاسْتٍ، **وَابْنٍ** | اِبنٍ (S) | F+M |

Other S-only items dropped as typos or noise: «مؤثاً»، «تدعو» → ﴿تَدْعُوا﴾، «وارأسَا» → «وَا رَأْسَا»، «يَالَله» → «يَا لَلَّهِ».

## 4. Vocalization
- **Base:** F's vocalization. The script `qatr-tools/hlog.js` compared every word with F:
  - About 1,150 words differ only in spelling conventions: «و» given a fatha, hamza on the alif, tanwin moved from the alif to the letter before it, «لا/إلا» written without the extra alif, «ال» given its sukun, and similar.
  - **186 words** are bare in F (or in its sub-quotes); I vocalized them myself (completed). These are mainly the unvocalized passage «فإن سقطت الفاء… بخلاف يأكلك», «أو ظرفٌ أو جارٌّ ومجرورٌ تامّانِ…», the verses «عجبتُ من الرزق…» and «وكيف التوقّي…», and particles such as «في/ما/لا».
  - **130 words** have F's vocalization **corrected**. The full list is in `qatr-tools/harakat-changes.txt`. Examples, all plain typos or solecisms: باَلْ→بِأَلْ، ومَبْنِيِّ→وَمَبْنِيٌّ، قَبُوِلِهِ→قَبُولِهِ، آخِرِهَِ→آخِرِهِ، بَحَذْفِ→بِحَذْفِ، الأَفَصَحُ→الْأَفْصَحُ، اثْنَتَانَ→اثْنَتَانِ، جُمَعَ→جُمِعَ، بِأَفْضَلِ مِنْهُ→بِأَفْضَلَ (the sentence is about the fatha!)، كَأُسَأمَةَ→كَأُسَامَةَ، أَمِّ كلثوم→أُمِّ، الْجِمِيعِ→الْجَمِيعِ، والْقِسَمِ→وَالْقَسَمِ، لَعُمْرُكَ→لَعَمْرُكَ، مُعَوِّضاً→مُعَوَّضًا، المُسَّلَطُ→الْمُسَلَّطُ، وَمَوْحِدَ→وَمَوْحَدَ، سَلَّمَانَ→سَلْمَانَ، وَبَعْضَهُمْ→وَبَعْضُهُمْ، وَمَصْدِرِهِ→وَمَصْدَرِهِ، تُعُلَّمَ→تُعُلِّمَ.
- **Corrections of substance:**
  - «وَالْخَبَرُ **جُمْلَةً**… وَظَرْفًا… وَجَارًّا»: F has جملةٌ. The word is coordinated with «نكرةً» (يقع الخبرُ جملةً).
  - «وَأَمَّا **كَأَنْ** فَتَعْمَلُ» and «فَأَمَّا **لَكِنْ** مُخَفَّفَةً»: F has the shadda, but the passage is about the lightened forms.
  - «لَا **مُسْلِمَاتِ**»: F has tanwin, but the matn speaks of بناء.
  - «مَعْنَوِيٌّ»، «مُثَنًّى»، «شَخْصِيٌّ».
  - «وَنَحْوُ ﴿وَالسَّارِقُ…﴾ مُتَأَوَّلٌ» (مبتدأ).
  - «وَنَحْوِ الْقَاضِي فِيهِمَا بِالْإِثْبَاتِ» (coordinated with «على نحو»).
  - «وَا زَيْدَا» / «يَا زَيْدَا»: the alif of نُدبة/استغاثة, not tanwin.
- **Kept as in F although another form exists:** وَجَهُولٌ، عَلَى قَدَرٍ، بَاقِيًا / وَاقِيًا (tanwin at the end of a verse), كَخَاتِمِ حَدِيدٍ (خاتِم and خاتَم are both correct), وَالْمَقَادِيرِ (genitive).
- «حم» is left bare, as the mushaf has it. Apart from sun-letter lāms and long vowels, every letter of the final text carries a mark.

## 5. مواضع للتأكد (worth checking against a printed vocalized matn)
1. **«وَالْحَالُ، وَهُوَ وَصْفٌ…»**: no witness has «والحال» explicitly. S and M put a heading «باب الحال» there, and F's quote starts at «وهو». I added «وَالْحَالُ» because the section continues the list «والمفعول المطلق… والمفعول له…», and the later «والتمييز» / «والمستثنى» have the same form. If you prefer not to add a word, remove it.
2. **«وَنَحْوُ يَا زَيْدَا لِعَمْرٍو»** (F+M «زيدا») against S «يا زيدُ لعمرو». I read it as the alif of استغاثة.
3. **«وَأَمْسِ لِمُعَيَّنٍ»** in the موانع الصرف section is kept in its citation form (with kasra), as in S. One could also read «وَأَمْسُ», coordinated with «بابُ حذامِ».
4. **«وَصَاحِبِهَا التَّعْرِيفُ»** (S+F) against M «وشرطُ صاحبِها التعريف».
