# Texts report: شذور الذهب في معرفة كلام العرب (Ibn Hisham al-Ansari, d. 761 AH), matn only (`shudhur.json`)

How the collation was done: every witness was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, a standalone «و / ك / ب / ف / ل» was joined to the next word, and the texts were aligned word by word with an LCS script (`shudhur-tools/cmp3.js`, `shudhur-tools/cmpBJ.js`, final check `shudhur-tools/verify.js`). This was done by script, not by eye. Raw downloads are in `raw/shudhur/`.

## 1. Sources

- **Base (B), fully vocalized:** «متن شذور الذهب», مطبعة مصطفى البابي الحلبي، الطبعة الأخيرة — Shamela 96770, 34 pp.: https://shamela.ws/book/96770 (`raw/shudhur/shamela96770/`). Ketabonline 6776 is the same digital text (checked by script, identical word for word): https://ketabonline.com/ar/books/6776 (`raw/shudhur/ko6776.json`).
- **Check 1 (D):** «شرح شذور الذهب» by Ibn Hisham himself, تحقيق عبد الغني الدقر، الشركة المتحدة للتوزيع — Shamela 6969, pages 1–572: https://shamela.ws/book/6969 (`raw/shudhur/shamela6969/`). The author quotes his own matn piece by piece as «(ثم) قلت: … » and comments after «وأقول». The segments were extracted by script (`shudhur-tools/dq.js`, 100 segments). Lightly auto-vocalized. One printed page (p. 245) is missing in the digital copy, so D has no text for «السادس: اسم أفعال المقاربة…».
- **Check 2 (J):** «شرح شذور الذهب» by al-Jawjari (d. 889), تحقيق نواف الحارثي، الجامعة الإسلامية 1423هـ — Shamela 9134, pages 1–891: https://shamela.ws/book/9134 (`raw/shudhur/shamela9134-jawjari/`). The matn is printed in «ص: …» paragraphs (180 segments, `shudhur-tools/js.js`). J has its own small variants in many places (e.g. «وهو أربعة»); it was used only to settle places where B and D differ.
- **Qur'an:** tanzil «quran-simple» (imla'i), `raw/quran/`.

**Rule for wording:** where B and D agree, B is kept. Where they differ, the reading shared by two of the three witnesses is adopted. The owner's rule (adopt the circulated wording when editions differ) points the same way, because D is Ibn Hisham's own sharh, the most circulated carrier of the matn.

## 2. Count and divisions
- 190 paragraphs, 4,359 words, 17 chapters («الكلمة والكلام», 14 «باب», 2 «فصل»). The text runs from «الكلمة قول مفرد» to «وثنتا حنظل ضرورة». B and D both end there, with no closing formula.
- There is no standard paragraph count for this prose matn. Each paragraph is one or two complete sentences in the order of the matn (9–40 words), with nothing dropped or added.
- **Titles are applied.** The matn's own headings are «(باب)» ×12, «(فصل)» ×2, «(باب في عمل الفعل)» and «(باب العدد)». The titles name each section from its opening words, for example «بَابُ الْإِعْرَابِ» or «فَصْلٌ فِي تَقْدِيرِ الْحَرَكَاتِ». «بَابٌ فِي عَمَلِ الْفِعْلِ» and «بَابُ الْعَدَدِ» are the matn's own wording. In one place the heading phrase is part of the matn: D and J read «باب الأسماء التي تعمل عمل الفعل، وهي عشرة». There the title carries «الأسماء التي تعمل عمل الفعل» and the paragraph starts «وَهِيَ عَشَرَةٌ».
- Qur'anic words are in ﴿﴾ and follow the Mushaf (103 quotes). Prose examples and the verse fragments (usually a single hemistich, as in the matn) are left inline. The only full verse («اجْمَعْ وَزِنْ … * رَكِّبْ وَزِدْ …») is joined with « * ».

## 3. Wording differences (B = Ḥalabī matn, D = Ibn Hisham's sharh, J = al-Jawjari)
| Place | Adopted | Other reading | Why |
|---|---|---|---|
| المثنى | وَأُلْحِقَ بِهِ **اثْنَانِ** وَاثْنَتَانِ وَثِنْتَانِ | without اثنان (D) | B+J; D's own sharh counts five words including اثنان |
| البناء | (dropped) «الْبَابُ الْأَوَّلُ مَا لَزِمَ الْبِنَاءَ عَلَى السُّكُونِ. الْبَابُ الثَّانِي مَا لَزِمَ الْبِنَاءَ عَلَى السُّكُونِ أَوْ نَائِبِهِ، وَهُوَ نَوْعٌ وَاحِدٌ» | in B only | D+J. These are sentences of Ibn Hisham's sharh (D lines «الباب الأول…» are commentary) that entered B |
| البناء | نَحْوُ ﴿لَيُنْبَذَنَّ﴾، ﴿لَيُسْجَنَنَّ وَلَيَكُونًا﴾ | **و**لَيُسْجَنَنَّ (B) | D+J |
| المنادى | يَا زَيْدُ، وَ**﴿يَا جِبَالُ﴾** | «وَيَجِبَالُ» (B, garbled) | D+J |
| الموصولات | وَ**الْأُلَاءِ** فِيمَنْ مَدَّهُ | «والأولاء» (D) | B+J skeleton; B's madda (الْآلَاءِ) corrected, see §4 |
| المضمر | أَوْ **مُؤَخَّرٍ** مُطْلَقًا | مُؤَخَّرًا (B) | D+J; it is coordinated with «أَوْ مُتَقَدِّمٍ» |
| العلم | وَيُؤَخَّرُ عَنِ الِاسْمِ تَابِعًا | عن الاسم **غالبًا** تابعًا (B) | D+J |
| الإشارة | **كَذَا وَذَانِ فِي التَّذْكِيرِ، وَذِي وَتِي وَتَا وَتَانِ فِي التَّأْنِيثِ، وَأُلَاءِ فِيهِمَا** | B «كَهَذِهِ وَهَذَا وَهَاتَا وَتَثْنِيَتِهِمَا وَهَؤُلَاءِ لِجَمِعِهِمَا» | D (J the same list, without «وتا») — a real edition difference; the sharh's wording adopted |
| المعارف | **السَّادِسُ الْمُضَافُ لِمَعْرِفَةٍ كَغُلَامِي وَغُلَامِ زَيْدٍ** | missing in B | D+J (the matn says «وهي ستة»; B listed only five) |
| أفعال المقاربة | «السَّادِسُ اسْمُ أَفْعَالِ الْمُقَارَبَةِ … لِلشُّرُوعِ فِيهِ، **وَيَكُونُ خَبَرُهَا مُضَارِعًا**» | J without the last clause; D has a lacuna here | B kept (see «مواضع للتأكد») |
| ما الحجازية | أَنْ لَا يَقْتَرِنَ اسْمُ مَا **بِإِنِ** الزَّائِدَةِ | بِأَلِ (B) | D+J; the condition concerns «إنْ» after ما |
| الحال | مَعْرِفَةً أَوْ خَاصًّا **أَوْ عَامًّا** أَوْ مُؤَخَّرًا | without أو عامًّا (B) | D+J |
| المستثنى | وَتُعْرَبُ غَيْرٌ **بِاتِّفَاقٍ** | اتِّفَاقًا (B) | D+J |
| المنصوبات | وَخَبَرُ مَا حُمِلَ عَلَى لَيْسَ، **وَاسْمُ إِنَّ وَأَخَوَاتِهَا** | «واسْمُ وَإنَّ أَخَوَاتِهَا» (B, garbled) | D+J |
| النصب بعد الواو | **وَ**لَا تَنْهَ عَنْ خُلُقٍ | without و (B) | D+J |
| حروف الجر | وَرُبَّ **لِضَمِيرِ** غَيْبَةٍ | بِضَمِيرِ (B) | D+J |
| الأسماء العاملة | **وَهِيَ** عَشَرَةٌ | الأسماءُ التي تعمل عمل الفعل عشرةٌ (B) | D+J (see §2) |
| اسم المصدر | يُعْمِلُهُ **الْكُوفِيُّ وَالْبَغْدَادِيُّ** | الكوفيُّون والبغداديُّون (B) | D+J |
| اسم التفضيل | وَلَا **فِي** مَرْفُوعٍ مَلْفُوظٍ بِهِ | without في (B) | D+J |
| التنازع | فَيُضْمِرُ فِي **غَيْرِهِ مَرْفُوعَهُ** | في غيرِ مرفوعِه (B) | D+J; the Basran puts the subject pronoun in the other verb |
| الاشتغال | خَارِجٌ عَنْ أَصْلِ الْبَابِ | عن أصل **هذا** الباب (B) | D+J |
| التوكيد | نَحْوُ **جَاءَنِي** زَيْدٌ نَفْسُهُ | جَاءَ (B) | D+J |
| عطف النسق | **وَبِثُمَّ** لِلْجَمْعِ | وَثُمَّ (B) | D+J; the same form as «وبالفاء… وبحتى» |
| موانع الصرف | وَالْوَزْنُ كَأَحْمَدَ **وَأَحْمَرَ** | without وأحمر (B) | D (J «وأحمد», a slip for وأحمر) |
| موانع الصرف | كَوْنُ عَلَمِيَّتِهَا فِي **الْعَجَمِيَّةِ** | الْعُجْمَةِ (B) | D+J |
| Qur'an | ﴿السَّمَاوَاتِ﴾، ﴿أَمْوَاتًا﴾، ﴿إِبْرَاهِيمَ﴾، ﴿الْإِنْسَانُ﴾، ﴿مَالِ هَذَا الْكِتَابِ﴾، ﴿وَاحِدَةٌ﴾، ﴿أَلْزَمْنَاهُ﴾، ﴿وَسُقْيَاهَا﴾، ﴿ضَاحِكًا﴾، ﴿وَأَرْسَلْنَاكَ﴾، ﴿بِرُءُوسِكُمْ﴾، ﴿وَالْأَنْعَامَ﴾، ﴿مَسَاكِينَ﴾ | B wrote these in a defective Uthmani spelling without the dagger alif (السَّموَاتِ، الإِنسَنُ، ضَحِكاً…) | Mushaf, imla'i |

Other B-only slips corrected by D+J: «طَلَعَتتِ» → طَلَعَتِ، «الْبَيَاننِ» → الْبَيَانِ، «طَيِّىءٍ» → طَيِّئٍ، «وَفَتِيءَ» → وَفَتِئَ.

Places where D alone differs from B and J were left as in B. Examples: «بالأسماء غير» for «وبقية الأسماء غير», «ومذ ومنذ», «ويلزم الأمر», «أو شرطه» for «أو جواب شرطه», «لام الابتداء أو استفهام» without «أو القسم».

## 4. Vocalization
- **Base:** B is fully vocalized. `shudhur-tools/harakat-vs-base.txt` lists every word whose marks differ from B (670). Most of these are spelling conventions: «لاَ/إِلاَّ» → «لَا/إِلَّا», tanwin moved from the alif to the letter before it, hamzat al-wasl written without a kasra («الاِسْمِ» → «الِاسْمِ»), missing hamza or kasra on «إن/إلى», «أَوْ» → «أَوِ» before a hamzat wasl, and the Qur'anic quotes set to the Mushaf.
- **Corrections of substance** (B's marks are wrong, by grammar or by the sense the matn itself gives):
  - البناء: once B's inserted «الباب الأول/الثاني» headings are dropped, the alternatives are coordinated with «يَطَّرِدَ فِيهِ السُّكُونُ». So: «أَوِ **الْفَتْحُ**… أَوِ **الْفَتْحُ** أَوْ **نَائِبُهُ**… أَوِ **الْكَسْرُ**… أَوِ **الضَّمُّ**… أَوِ **الضَّمُّ** أَوْ **نَائِبُهُ**» (B had the genitive in all of them).
  - «وَلَا **قَائِمَاتِ**» (B tanwin, but the word is mabnī); «**كَسِيبَوَيْهِ**، بِوَيْهِ» (B tanwin); «بِخِلَافِ **نَحْوِ**»، «وَفَتْحُ **نَحْوِ**»، «فِي **نَحْوِ** خَاتَمُ حَدِيدٍ» (B نَحْوُ).
  - «وَ**الْأُلَاءِ** فِيمَنْ مَدَّهُ» (B الْآلَاءِ, which is a different word); «مَا يَقْبَلُ **رُبَّ**» (B رُبُّ); «وَمِنَ **الْعَلَمِ**» (B الْعَلْمِ); «**الْمُثَنَّى**»؛ «فَإِ**نَّ**هَا».
  - «نِعْمَ امْرَأً **هَرِمٌ**» (a proper name, munṣarif); «وَفِي نَعْتَيِ الْإِشَارَةِ… **وَأَيٍّ** فِي النِّدَاءِ» (B وَأَيُّ); «مَا أَوْ **مَنِ** الِاسْتِفْهَامِيَّتَيْنِ».
  - «مَنْ قَامَ؟ أَوْ مَنْ **ضُرِبَ**؟» (B ضَرَبَ). D's sharh says Zayd answers the second question as nā'ib al-fā'il, «وضُرِبَ عمرو».
  - «**وَالْمُبْتَدَأُ** اسْمُ ذَاتٍ»؛ «أَهْلِ **الْعَالِيَةِ**» (B الْعَالِيَّةِ); «لَا **نُورَثُ**» (B نُورَثَ); «**وَالْمَحْذُوفُ** عَامِلُهُ» (B وَالْمَحْذُوفِ).
  - Lightened particles: «فَتُلْغَى **لَكِنْ**… **وَكَأَنْ**… **وَإِنْ** غَالِبًا»، «اسْتِتَارُ اسْمِ **أَنْ**»، «لِ**كَأَنْ** مَا وَجَبَ لِأَنْ». B had the shadda, or «إِنْ», although the passage is about the lightened forms.
  - «**فَإِمَّا** ثَانِيهِمَا… أَوْ أَوَّلُهُمَا» (B فَأَمَّا); «أَوْ لَعَلَّ أَوْ لَوْ أَوْ **إِنَّ**» (B أنْ). D's sharh: «إنّ التي في خبرها اللام نحو علمت إنّ زيدًا لقائم».
  - «وَلَا **يُتْبَعَ** قَبْلَ الْعَمَلِ» (coordinated with «أَلَّا يُصَغَّرَ»); «وَ**فَعُلَ**» as the third form of التعجب (B فَعِلَ); «فِي غَيْرِهِ **مَرْفُوعَهُ**»؛ «عَلَى **فِعْلِيَّةٍ** غَيْرِ مَفْصُولٍ».
  - «وَالْإِمَاءَ **كُلَّهُنَّ**» (B كُلُّهُنَّ); «إِلَّا **التَّابِعَ**»، «كَتَابِعِ **الْمُعْرَبِ**» (B التَّابَعَ، الْمُعْرِبِ); «وَ**يَعْمَلٌ**» (the camel; B يَعْمُلٌ); «لِنَكِرَةٍ»، «بِظَنٍّ»، «عَبَاءَةٍ»، «ضَبٍّ»، «مَعْمُولًا» (tanwin restored); «يَ**أْ**تِينَا»، «**اجْمَعْ**» (B إِجْمَعْ), «مَعْنَاهُمَا» (B مَعِنَاهُمَا).
  - Qur'an per the Mushaf, including «﴿لَا يُؤْخَذْ مِنْهَا﴾» (6:70; B يُؤْخَذُ), «﴿وَيَصْبِرْ﴾» (B وَيِصْبِرْ), «﴿أَتُحَاجُّونِّي﴾».
- **Completed** (no marks in B, or words taken from D/J, which are unvocalized): «يَتَرَقَّبُ» (from the Mushaf); «نَكِرَةٌ»؛ «الْآيَةَ» ×2; and the adopted words in §3: «السَّادِسُ الْمُضَافُ لِمَعْرِفَةٍ كَغُلَامِي وَغُلَامِ زَيْدٍ»، «كَذَا وَذَانِ … وَأُلَاءِ فِيهِمَا»، «أَوْ عَامًّا»، «بِاتِّفَاقٍ»، «لِضَمِيرِ»، «وَهِيَ»، «الْكُوفِيُّ وَالْبَغْدَادِيُّ»، «فِي»، «جَاءَنِي»، «وَبِثُمَّ»، «وَأَحْمَرَ»، «الْعَجَمِيَّةِ»، «بِإِنِ»، «مُؤَخَّرٍ». Each of these can be read only one way here.
- Result: fully vocalized. Every letter that needs a mark carries one; the only unmarked letters are long vowels and the lām of al- before sun letters.
- **Kept as in B although another form exists:** «سُوًى» (also سِوًى), «وَهْوَ» (×2), «هَيْتُ», «وَخَلِقَ», «بَعْدَ ضَمِيرٍ مُتَكَلِّمٍ», «وَفَاءِ السَّبَبِيَّةِ وَوَاوِ الْمَعِيَّةِ» (genitive as in B), «وَالْعَشَرَةُ مُفْرَدَةً وَمَا دُونَهَا», «وَأَيُّ الْمَوْصُولَةُ», «وَقِيلَ ضَرُورَةً».

## 5. مواضع للتأكد (worth checking against a printed vocalized matn, e.g. Muhyi al-Din's edition)
1. **«وَيَكُونُ خَبَرُهَا مُضَارِعًا»** at the end of أفعال المقاربة: in B, not in J, and D has a page missing here. It was kept from the base.
2. **The list of demonstratives** (§3): B's «كَهَذِهِ وَهَذَا وَهَاتَا…» against D+J «كَذَا وَذَانِ فِي التَّذْكِيرِ…». The D+J reading was adopted.
3. **«وَلَا قَائِمَاتِ»**: tanwin removed. Since the matn adds «وفتح نحو قائمات أرجح من كسره», one could also print «قَائِمَاتَ».
4. **«وَفَعُلَ»** (التعجب) and **«وَأَيٍّ فِي النِّدَاءِ»**: vocalization corrected by grammar; no witness is vocalized here.
5. **«وَتُقَدَّرُ بِمَعْنَى فِي نَحْوُ ﴿بَلْ مَكْرُ…﴾»**: all three witnesses have a single «في» here (one would expect «بمعنى في في نحو»). Nothing was added.
