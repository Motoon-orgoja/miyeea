# Texts report — متن الورقات (`waraqat.json`)

Comparison method: every source was stripped of harakat and tatweel, alef/yaa/taa-marbuta/hamza-seat forms were unified, and the texts were aligned word by word with an LCS script (no comparison by eye). Scripts and intermediate files: scratchpad `waraqat_imriti/` (`mx.js` matn extraction, `c4.js` vote, `bw.js`/`fw.js`/`asm.js` build, `cmpw.js` final check). Raw downloads: `tools/texts/raw/waraqat/`.

## Sources
- **Base (vocalization + wording): جامع الكتب الإسلامية (ketabonline) 102359** «حاشية المحلي على متن الورقات». This is al-Mahalli's commentary on the Waraqat, from الشاملة الذهبية, described as «مقابل ومشكول ومراجع» (copied and vocalized by مكتب الرحاب). Pages 1–13: https://ketabonline.com/ar/books/102359/read?part=1&page=1 … page=13. The matn is the text this edition prints in parentheses, and it is fully vocalized.
- **Check 1: Ajurry forum** «كتاب الورقات لإمام الحرمين أبي المعالي الجويني {مشكول}» (2008, thread 4859). This is a standalone copy of the matn, mostly vocalized but with many typos. It is the same text that is widely copied online (A).
- **Check 2: المكتبة الشاملة 6297** «الورقات», edited by د. عبد اللطيف محمد العبد. Standalone, partly vocalized (only some letters carry harakat). This is a manuscript-based edition with a noticeably different recension, and it adds numbered editorial headings (S). https://shamela.ws/book/6297/1 … /25
- **Check 3: Google Sites «متون شرعية»**, متن الورقات, unvocalized. Its wording is close to S (G). https://sites.google.com/site/mutonshraayah/home/mtn-alwrqat
- **Not usable:** Wikisource has no page for this text. shamela 21547 and ketabonline 2650 (المحلي، تحقيق عفانة) and 100684 (حاشية النفحات) are unvocalized. The hdat.sa docx is a lesson transcript, not the matn.
- **No fully vocalized standalone edition was found online.** The vocalized base is therefore the matn as embedded in a famous commentary.

## Why al-Mahalli's recension
The online copies fall into two families:
1. **al-Mahalli's matn**, which is also what the Ajurry copy and most printed student editions follow.
2. **The recension of the al-Abd edition (S) and G.** It has extra phrases, for example «لأنه علامة عليه», «أو التواتر», «ولا يصار إليه مع إمكان ما قبله», «أي في الوجود والعدم…», «الذي يحتج به», «يعمل بالنطق», «كامل الأدلة».

The brief asks for «الرواية المشهورة», so the text follows al-Mahalli. The final text was checked against all three witnesses (final vs G: 77 hunks; most of them are recension differences of family 2, listed below).

## Count
- 21 chapters, 112 paragraphs, 1560 words. The basmala is in its own field.
- Paragraphs are 7–32 words, cut at sentence ends. The short 7-word ones are complete definitions.
- **Chapter titles are editorial.** The matn runs on with «وأما…», so the titles were taken from the matn's own list of abwab and from the al-Abd edition's headings. They were vocalized by me and need only standard vocalization.
- Two titles are the matn's own words, which al-Mahalli's edition prints as matn: «الَّذِي يَدْخُلُ فِي الْأَمْرِ وَالنَّهْيِ وَمَا لَا يَدْخُلُ» and «فَصْلٌ فِي التَّعَارُضِ». They were taken out of the paragraphs.

## How the matn was extracted, and the decision rule
- The matn is the text inside the parentheses of 102359. Commentary hadiths in «(( ))» outside a matn parenthesis were skipped.
- Where the editor's parentheses are faulty, the words were taken from the surrounding Mahalli text, vocalized:
  - a missing opening paren: «فالمجاز بالزيادة…», «وأما العام فهو…»;
  - unmarked matn: «وإنما يصح الاستثناء…», «ونعني بالنطق…», «يَنْقَسِمُ إِلَى», «أَوْ لَا يَكُونَ», the التعارض passage, «فالمتواتر…».
- **Rule used:** keep al-Mahalli's words. Text that appears **only** inside Mahalli's parentheses, with no standalone copy having it, was treated as commentary the editor put in the parentheses, and dropped.
  - Exception: a standalone reading was taken where all three standalone copies (or A and S together) agree against M on a single word.

### Wording decisions (M = Mahalli 102359, A = Ajurry, S = al-Abd/Shamela, G = Google Sites)
| Place | Text adopted | Other readings | Why |
|---|---|---|---|
| opening | هَذِهِ وَرَقَاتٌ تَشْتَمِلُ عَلَى مَعْرِفَةِ فُصُولٍ | A «أما بعد فهذه»; S has no «معرفة» | M (+S/G, +A) |
| الأحكام | …وَالصَّحِيحُ، وَالْبَاطِلُ | A «والفاسد» | M, S, G |
| order | المباح before المحظور | A has المحظور first | M, S |
| العلم الضروري | مَا لَمْ يَقَعْ | A, G «لا يقع» | M, S |
| العلم الضروري | كَالْعِلْمِ الْوَاقِعِ بِإِحْدَى الْحَوَاسِّ الْخَمْسِ وَهِيَ: السَّمْعُ، وَالْبَصَرُ، وَاللَّمْسُ، وَالشَّمُّ، وَالذَّوْقُ | S, G «التي هي السمع والبصر والشم والذوق واللمس أو التواتر»; A has none of it | M (base recension); see «مواضع للتأكد» |
| العلم / الجهل | عَلَى مَا هُوَ بِهِ / عَلَى خِلَافِ مَا هُوَ بِهِ | A adds «في الواقع» | M, S (in M «في الواقع» is commentary) |
| الدليل | (no «لأنه علامة عليه») | S, G have it | In M it is commentary, and A lacks it |
| أصول الفقه | وَأُصُولُ الْفِقْهِ طُرُقُهُ | S, G «وعلم أصول الفقه» | M, A |
| list of abwab | …وَالْمُجْمَلُ وَالْمُبَيَّنُ، وَالظَّاهِرُ… | S, G add «والمؤول»; A has «والنص والظاهر» | M. Mahalli notes «وفي بعض النسخ: والمؤول» |
| الأمر | وَصِيغَتُهُ افْعَلْ | A «والصفة الدالة عليه افعل» | M, S, G |
| الأمر | …أَوِ الْإِبَاحَةُ فَيُحْمَلُ عَلَيْهِ | S, G lack «فيحمل عليه» | M, A |
| الأمر | إِلَّا إِذَا دَلَّ الدَّلِيلُ | S, G «إلا ما دل» | M, A |
| الأمر | كَالْأَمْرِ بِالصَّلَاةِ أَمْرٌ بِالطَّهَارَةِ | S, G «فإنه أمر»; A «بالصلوات» | M |
| من يدخل | الَّذِي يَدْخُلُ فِي الْأَمْرِ وَالنَّهْيِ وَمَا لَا يَدْخُلُ (title) | S, G «تنبيه: من يدخل… ومن لا يدخل» | M, A |
| من يدخل | وَالسَّاهِي وَالصَّبِيُّ وَالْمَجْنُونُ غَيْرُ دَاخِلِينَ | S, G «وأما الساهي… فهم غير داخلين» | M, A |
| الكفار | بِفُرُوعِ الشَّرَائِعِ | S, G «الشريعة» | M, A |
| الكفار | لِقَوْلِهِ تَعَالَى: ﴿…﴾ | M's paren adds «حكاية عن الكفار» | dropped: no standalone copy has it |
| النهي | وَيَدُلُّ عَلَى فَسَادِ الْمَنْهِيِّ عَنْهُ | M's paren adds «في العبادات»; A lacks the whole clause | M + S, G; «في العبادات» dropped (it is in M only) |
| العام | مِنْ قَوْلِهِ: عَمَمْتُ زَيْدًا وَعَمْرًا بِالْعَطَاءِ… | A «من غير حصر» | M, S, G |
| العام | الِاسْمُ الْوَاحِدُ الْمُعَرَّفُ | A lacks «الواحد» | M, S |
| العام | وَالْجَزَاءِ وَغَيْرِهِ، وَلَا فِي النَّكِرَاتِ | M's paren lacks «وغيره», but Mahalli explains it as a matn word | A, S, G |
| الاستثناء | وَإِنَّمَا يَصِحُّ الِاسْتِثْنَاءُ بِشَرْطِ… | S, G «يصح بشرط» | M text, A |
| الشرط | وَالشَّرْطُ يَجُوزُ أَنْ يَتَقَدَّمَ عَلَى الْمَشْرُوطِ | S, G «يجوز أن يتأخر عن المشروط ويجوز أن يتقدم» | M, A |
| المقيد | …وَأُطْلِقَتْ فِي بَعْضِ الْمَوَاضِعِ | A lacks it | M, S, G |
| المجمل | مَا يَفْتَقِرُ | S, G «افتقر» | M, A |
| الأفعال | …عَلَى وَجْهِ الْقُرْبَةِ وَالطَّاعَةِ أَوْ لَا يَكُونَ | S, G «أو غير ذلك» | M text + A |
| الأفعال | فَإِنْ دَلَّ دَلِيلٌ… يُحْمَلُ / وَإِنْ لَمْ يَدُلَّ لَا يَخْتَصُّ بِهِ | S, G «لا يخصص به»; A «لم يدل دليل لا يخص به» | M |
| الأفعال | وَمِنْ أَصْحَابِنَا مَنْ قَالَ: يُحْمَلُ عَلَى النَّدْبِ | A lacks it | M, S, G |
| الأفعال | يُتَوَقَّفُ فِيهِ | S, G «عنه» | M, A |
| الأفعال | فَإِنْ كَانَ عَلَى وَجْهٍ غَيْرِ وَجْهِ الْقُرْبَةِ | M «وإن»; S, G «على وجه غير القربة»; S, G add «في حقه وحقنا» | «فإن» from A, S, G; the rest from M |
| الإقرار | عَلَى الْقَوْلِ مِنْ أَحَدٍ | S, G «الصادر من أحد»; M repeats «من أحد» after «على الفعل» | the second «من أحد» is in M only, so dropped |
| النسخ | (no «يقال نسخت الشمس الظل…», no «بأشكال كتابته») | A has both | M commentary |
| النسخ | وَنَسْخُ الْأَمْرَيْنِ مَعًا | S, G lack it | M, A |
| النسخ | وَنَسْخُ السُّنَّةِ بِالْكِتَابِ وَبِالسُّنَّةِ | S «ونسخ السنة بالسنة»; G also adds «ولا يجوز نسخ الكتاب بالسنة» | M |
| التعارض | جُمِعَ / فَيُنْسَخُ / وَكَذَا إِنْ | A «يجمع / نسخ / وكذلك إن»; S «جمع / ينسخ / وكذا إذا» | M |
| التعارض | (no «وإن لم يمكن الجمع… إلى ظهور مرجح لأحدهما…» after «وكذا إن كانا خاصين») | in M's parens only | Mahalli's explanation, so dropped |
| الإجماع | عُلَمَاءِ الْعَصْرِ عَلَى حُكْمِ الْحَادِثَةِ | A «علماء أهل العصر على الحادثة» | M, S |
| الإجماع | وَلَهُمْ أَنْ يَرْجِعُوا عَنْ ذَلِكَ الْحُكْمِ | S, G «فلهم»; M has «الحكم» outside the paren | M + «الحكم» from A, S |
| الإجماع | وَبِفِعْلِ الْبَعْضِ… وَسُكُوتِ الْبَاقِينَ عَنْهُ | M «وفعل»; A «عليه» | «وبفعل» from A, S; «عنه» from M, G |
| الإجماع | لَيْسَ بِحُجَّةٍ | A «حجة» | M, S |
| الأخبار | أَنْ يَرْوِيَ جَمَاعَةٌ… عَنْ مِثْلِهِمْ، وَهَكَذَا | A «يرويه»; S «يروى… من مثلهم» without «وهكذا» | M |
| الأخبار | (no «لاحتمال الخطأ فيه») | A has it | M commentary |
| القياس | الْمُتَرَدِّدُ… فَيُلْحَقُ بِأَكْثَرِهِمَا شَبَهًا | A «المردد»; S, G «ولا يصار إليه مع إمكان ما قبله» | M, A |
| القياس | فَلَا تُنْتَقَضَ | M «ولا» | «فلا» from A, S, G |
| القياس | (no «أي في الوجود والعدم فإن وجدت العلة وجد الحكم») | S, G | not in M or A |
| القياس | وَالْحُكْمُ: هُوَ الْمَجْلُوبُ لِلْعِلَّةِ | S, G lack it | M, A |
| الحظر | يُتَمَسَّكُ بِالْأَصْلِ | A «فيستمسك» | M, S |
| الاستصحاب | (no «الذي يحتج به») | S, G | not in M or A |
| ترتيب الأدلة | مَا يُغَيِّرُ الْأَصْلَ وَإِلَّا… | S, G «ما يفسر الأصل يعمل بالنطق» | M, A |
| المفتي | كَامِلَ الْآلَةِ… مِنَ النَّحْوِ وَاللُّغَةِ وَمَعْرِفَةِ الرِّجَالِ | S, G «الأدلة» and lack «من النحو…»; A adds «الراوين» | M (A agrees except «الراوين») |
| المستفتي | مِنْ أَهْلِ التَّقْلِيدِ؛ فَيُقَلِّدَ الْمُفْتِيَ فِي الْفُتْيَا | S, G lack «فيقلد…» | M, A |
| التقليد | قَبُولُ قَوْلِ النَّبِيِّ ﷺ يُسَمَّى تَقْلِيدًا | A «لا يسمى» | M, S, G |
| الاجتهاد | فَالْمُجْتَهِدُ… فَإِنِ اجْتَهَدَ فِي الْفُرُوعِ فَأَصَابَ | M «والمجتهد / وأصاب» | A, S |
| ending | (no «والله سبحانه وتعالى أعلى وأعلم») | A | the copier's closing |

## Vocalization changes (all certain; base vocalization otherwise unchanged)
- «صلى الله عليه وسلم» is unvocalized in the source. It is written everywhere (7 times) as «صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ».
- **Connecting vowel before hamzat al-wasl.** The source drops it. Restored as follows:
  - «مِن الْ» → «مِنَ الْ» (13 places, including فَمِنَ / وَمِنَ)
  - «عَن الْ» → «عَنِ الْ» (5)
  - «أَو اسْمٌ / أَو الْ» → «أَوِ» (7)
  - «يُمْكِنِ الْجَمْعُ», «يُعْلَمِ التَّارِيخُ», «كَانَتِ الْعِلَّةُ», «فَإِنِ اجْتَهَدَ», «وَإِنِ اجْتَهَدَ»
- **Sukun on lam al-qamariyya** where it was missing: الْمَنْدُوبُ، الْبَصَرُ، الْقُرْبَةِ، الْوُجُوبِ، الْكِتَابِ، الْبَعْضِ.
- **Missing or partial harakat completed:**
  - وَالْمَحْظُورُ، وَالْبَاطِلُ، طَلَبُ الدَّلِيلِ، وَالدَّلِيلُ، الْمُرْشِدُ إِلَى الْمَطْلُوبِ، عَلَى، تَعَالَى، وَإِلَى، اجْتَهَدَ، فَأَصَابَ، وَاسْتِدْلَالٍ، الِاسْتِدْلَالِ، الْأَخْبَارُ، خِلَافًا
  - From the Ajurry copy, completed: وَلَا، فَلَا، وَبِفِعْلِ، وَالْقِيَاسُ
- **Corrections:**
  - «مِن الْمُخَاطِبَةِ» → «مِنَ الْمُخَاطَبَةِ»: the verbal noun is meant, not the active participle.
  - ﴿…مِنَ الْمُصَلِّيِنَ﴾ → ﴿الْمُصَلِّينَ﴾, as in the mushaf.
  - The two verses of al-Muddaththir are written as ﴿مَا سَلَكَكُمْ فِي سَقَرَ﴾ ﴿قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ﴾.
- The two hadiths are put in «».

## مواضع للتأكد
1. **العلم الضروري.** The adopted text is al-Mahalli's «وَهِيَ: السَّمْعُ، وَالْبَصَرُ، وَاللَّمْسُ، وَالشَّمُّ، وَالذَّوْقُ». The standalone edition reads «التي هي السمع والبصر والشم والذوق واللمس أو التواتر». If you prefer the standalone wording, this clause and «لأنه علامة عليه» are the two main places to change.
2. **«أَنْ يُسْتَصْحَبَ الْأَصْلُ»** (M, passive) versus «أَنْ يَسْتَصْحِبَ الْأَصْلَ» (A, active). Both are sound. M was kept.
3. **«وَلَا تَكُونُ مُوجِبَةً»** (M, istinaf) versus «وَلَا تَكُونَ» (A, ʿatf). M was kept.
4. **«فَلَا تُنْتَقَضَ»** combines the wording of A/S/G with M's vocalization (passive, nasb by ʿatf on «تطرد»). A has «فَلَا تَنْتَقِضُ».
5. The recension choice itself (Mahalli versus the al-Abd edition) is a policy decision. The table above lets the other recension be rebuilt.
