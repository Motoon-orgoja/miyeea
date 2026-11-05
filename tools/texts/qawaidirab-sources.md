# Texts report: الإعراب عن قواعد الإعراب (Ibn Hisham al-Ansari, d. 761 AH), matn only (`qawaidirab.json`)

Collation was done by script, not by eye. Every witness was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, and a standalone «و/ك/ب/ف/ل» was joined to the next word. The texts were then aligned word by word with an LCS script (`qawaidirab-tools/cmp.js`, `cmp3.js`, `cand.js`, `actx.js`). Raw downloads are in `raw/qawaidirab/`.

## 1. Sources

- **No digital, fully vocalized copy of this matn exists on Shamela, Ketabonline, Wikisource or the matn sites.** Shamela 5352 is a different, shorter work: «قواعد الإعراب ونزهة الطلاب» (= «نكت الإعراب»).
- **Base (P), fully vocalized:** «متن الإعراب عن قواعد الإعراب لابن هشام», a typeset student edition of 21 pp., scanned on archive.org: https://archive.org/details/20200229_20200229_1911.
  - Its archive.org OCR is unusable. The text and every haraka were therefore **transcribed from the page images** (`raw/qawaidirab/archive1/pages/`, read in zoomed thirds in `crops/`). The transcription is `qawaidirab-tools/P.txt`.
  - The decisions in §3 turn it into `Q.txt`. `build.js` then writes `qawaidirab.json`.
- **W:** Wikisource «قواعد الإعراب», an Ottoman print («طبع في القسطنطينية … منتصف صفر»), Page namespace, quality level 1: https://ar.wikisource.org/wiki/قواعد_الإعراب (`raw/qawaidirab/wikisource/`). It is unvocalized and is the short recension.
- **T:** takw.in «الإعراب عن قواعد الإعراب», typed from the Riyadh edition (ed. علي فودة نيل): https://takw.in/reader.php?matn=قواعد-الإعراب (`raw/qawaidirab/takwin/`). It is lightly vocalized and is the long recension.
- **A:** «موصل الطلاب إلى قواعد الإعراب» by Khalid al-Azhari, the most famous sharh (ed. الرسالة 1996): https://shamela.ws/book/6973 (`raw/qawaidirab/shamela6973/`). The sharh is mamzuj, so A was used through phrase and trigram look-ups.
- **K:** «شرح قواعد الإعراب» by al-Qujawi (Shaykh Zadeh, d. 950), ed. دار الفكر: https://shamela.ws/book/19236 (`raw/qawaidirab/shamela19236/`). Also mamzuj, and used the same way.
- **Qur'an:** tanzil quran-simple (imla'i), `raw/quran/`.

## 2. Recension, count, divisions

- **Two recensions exist.** The short one is found in P, W and al-Qujawi's sharh. The long one is found in T (the Riyadh critical edition) and in al-Azhari's sharh; it has about 750 more words.
  - The extra material is passages such as «تنبيه: إذا قلت إن قام زيد أقوم…», «وإذا قلت قال زيد: عبد الله منطلق…», «وتقول ما لقيته مذ يومان…», the verses of al-Farazdaq, «لو كانت الشمس طالعة…» and «ولكن اجتناب هذه العبارة في التنزيل واجب».
  - **The short recension was kept.** It is the one in the vocalized student edition and in the Ottoman madrasa print, and al-Qujawi comments on it. The long one is not merged, because we have no vocalized source for it. **This needs the owner's decision (see §5).**
- **Size:** 198 paragraphs and 4,645 words, in 5 chapters: «مقدمة المصنف» plus the matn's own four أبواب, with their titles as in W and T.
  - The sub-headings «المسألة …» (4 + 4) and «النوع …» (8) open their paragraph.
  - The bracketed or editorial sub-titles of the print are dropped: «أحوال الجمل الخبرية», «في بيان حكم الجار والمجرور…», «في بيان متعلق…» and «[في جواز أن يرفع…]». W and T number those مسائل without a title.
- There is no standard paragraph count. Paragraphs are 8–42 words, cut at sentence ends.
- 161 Qur'anic quotes are in ﴿﴾ and checked by script against the Mushaf (`qcheck.js`, 0 issues). Verse lines are joined with « * ».

## 3. Wording changes to the print (P), each where W/T/A/K agree against it (`qawaidirab-tools/edits-log.txt`)

| Place | Adopted | Print | Evidence |
|---|---|---|---|
| الكلام والجملة | أَلَا **تَرَى** أَنَّ نَحْوَ | يُرَى | W T A |
| زيد أبوه غلامه | فَزَيْدٌ: مُبْتَدَأٌ **أَوَّلُ** | — | W T A |
| المفعولية | تَقَعُ فِي **أَرْبَعَةِ** مَوَاضِعَ | ثلاثة (also W) | T A; four places are listed |
| أعلم | عَمْرًا أَبُوهُ **قَائِمٌ** | عالم | W T A K |
| جواب الشرط | الْجَزْمُ **إِذَا** كَانَتْ | إن | W T A |
| التابعة لمفرد | رَفْعٍ **فِي نَحْوِ** | نَحْوُ | W T K |
| حتى الابتدائية | أَنَّ **الْجُمْلَةَ بَعْدَ** حَتَّى | جُمْلَةَ حتى | W T K |
| التفسيرية | إِذِ الدَّلَالَةُ **سَبَبُ** الِامْتِثَالِ | تُسَبِّبُ | W T K |
| إنا كل شيء | خَبَرٌ **لِإِنَّ** | خَبَرُ إِنَّا | W T A |
| التابعة لما لا موضع له | قَامَ **زَيْدٌ** وَقَعَدَ عَمْرٌو | أبوه | W T A K |
| الحال | الضَّمِيرِ **الْمُسْتَتِرِ** فِي ﴿تَمْنُنْ﴾ | — | W T A K |
| لولاي | كَمَا قَالَ **اللَّهُ** تَعَالَى | — | W T A K |
| رفع الفاعل | بَعْدَ نَفْيٍ **أَوِ** اسْتِفْهَامٍ | واستفهام | W T A K |
| ″ | مُبْتَدَأً **مُؤَخَّرًا** | متأخرًا | W T A |
| أبدًا | وَكَذَلِكَ أَبَدًا تَقُولُ فِيهَا: ظَرْفٌ **لِاسْتِغْرَاقِ** | adds «نحو: لا أفعله أبدًا»؛ لاستغراقها | W T A |
| لمّا | وَيُقَالُ فِيهَا **فِي نَحْوِ** | نَحْوُ | W T A |
| إذا / إنْ | وَقَدِ **اجْتَمَعَا** (×2) | اجتمعتا | T A K |
| إن الشرطية | ﴿إِنْ تُخْفُوا…﴾ | ﴿قُلْ إِنْ…﴾ | W T A K |
| أنِ المفسرة | جَوَّزَهُ الزَّمَخْشَرِيُّ **إِنْ** أَوَّلَ | بأن | W T A K |
| ″ | ﴿أَنِ اتَّخِذِي﴾ | + من الجبال بيوتًا | W T A K |
| أيّ | وَوُصْلَةً **إِلَى** نِدَاءِ | على | W T K |
| لو | فَيُقَالُ **فِيهَا** | فيه | W T A K |
| ″ | انْتِفَاءُ لَمْ **يَعْصِ** | يعصه | W T A |
| ″ | خُلُوُّهُ **عَنِ** الْخَوْفِ | من | W T A |
| ″ | امْتِنَاعِ الْجَوَابِ **وَلَا** إِلَى ثُبُوتِهِ | وإلى | W T A K |
| قد | قَدِي **بِغَيْرِ نُونٍ** | — | W T A K |
| ″ | مَعَ الْمَاضِي **الْوَاقِعِ** حَالًا | — | W T A |
| ″ | ﴿لَقَدْ أَرْسَلْنَا نُوحًا﴾ **فِي سُورَةِ الْأَعْرَافِ** | — | W T K |
| الواو | عَلَى حَسَبِ مَا قَبْلَهَا، وَهِيَ | + غالبًا | W T A |
| ما الموصولة | ﴿مَا عِنْدَ اللَّهِ…﴾ **أَيِ: الَّذِي عِنْدَ اللَّهِ خَيْرٌ** | ﴿قل ما…﴾ without the gloss | W T (A K: without قل) |
| ما الموصوفة | **أَيْ: بِشَيْءٍ مُعْجِبٍ لَكَ** | — | W T |
| ما الظرفية | مُدَّةَ دَوَامِي **حَيًّا** | — | W T K |
| الباب الرابع | فِي **نَحْوِ** ضُرِبَ | — | W T A K |
| ″ | وَلَا **تَقُلْ**: مَفْعُولٌ | تقولُ | W T A K |
| ″ | **حَرْفُ تَوْكِيدٍ يَنْصِبُ الِاسْمَ وَيَرْفَعُ الْخَبَرَ، وَتَزِيدُ فِي أَنَّ الْمَفْتُوحَةِ فَتَقُولُ:** حَرْفُ تَوْكِيدٍ مَصْدَرِيٌّ… | line skipped by the print (same ending), which made إنّ المكسورة «مصدري» | W T A |
| ″ | أَنَّهُ **يُعَابُ عَلَى النَّاشِئِ** فِي صِنَاعَةِ الْإِعْرَابِ أَنْ يَذْكُرَ فِعْلًا | يغلب على الناس … أن يذكر المعرب | T A (W: على المعرب); K «ما يُعابُ» |
| ″ | حَرْفُ الْخِطَابِ **لَا اسْمٌ** | لا أنها اسم | W T A K |
| ″ | سُبْحَانَهُ مُنَزَّهٌ | + وتعالى | W T A |
| ″ | كَيْفَ أَنْتَ **أَصَحِيحٌ** | صحيح (no hamza, though the rule requires it) | T A K |
| النوع الأول | وَهُوَ **أَرْبَعَةٌ** | أربع كلمات | W T A |

Everything else in P was kept where W and T differ only from each other, or where A gives no support for the change. Examples: «وعلى آله», «وينحصر», «بدأت» (A K), «انتهى» ×2 (also in W T), «فإذا دخل الجار» (K), «وهو طريق», «له آخر».

## 4. Vocalization

- **The print's vocalization is kept.** Only the following spelling conventions were applied:
  - tanwin of the accusative is written before the alif;
  - no sukun on madd letters;
  - hamzat al-wasl is written as a bare alif (اعْلَمْ, الِاسْمِيَّةِ);
  - لفظ الجلالة is written «اللَّهِ»;
  - marks are put in canonical order;
  - the tatweel of cited prefixes is removed (كَـ: زَيْدٌ → كَزَيْدٌ).
- **Qur'an is per the Mushaf.** The print gives the quotes in Uthmani script. Its «حَتَّى يَقُولُ الرَّسُولُ» («في قراءة من رفع») was set to the Mushaf (Hafs) «يَقُولَ». Likewise «وَإِنَّ كُلًّا لَمَّا» and «لَمَّا عَلَيْهَا حَافِظٌ» follow the Mushaf even where the matn speaks of another reading.
- **Corrected or completed** (the print has no mark, or a wrong one):
  - «فَكُلُّ كَلَامٍ» (print كَلَام with no vowel) and «غُلَامُهُ»;
  - «وَتُسَمَّى الْمُسْتَأْنَفَةَ» (print ـةُ; al-Qujawi: «المستأنفةَ بالنّصب مفعول ثان»);
  - «وَمِنْ **مُثُلِهَا**» (print مِثْلِهَا; A and K: «بضم الميم والثاء جمع مثال»);
  - «أُبَيٍّ» (print أُبَيِّ) and «الْكِسَائِيُّ/ـيِّ» (print الكَسائي);
  - «مَعْنًى آخَرَ»;
  - «الْقِرْنَ مُصْفَرًّا» (print القَرْن);
  - «قَهَرْنَاكُمُ حَتَّى الْكُمَاةَ» (print كُمْ; the metre needs كُمُ);
  - «لَا يَلْزَمُ مِنِ انْتِفَاءِ» (print مِنَ);
  - «وَالْجَارَّ وَالْمَجْرُورَ خَبَرًا مُقَدَّمًا» (print ـُّ ـُ, ungrammatical after «أَنْ تُقَدِّرَهُ»).
- The vocalization of the words adopted in §3 is copied from the same words elsewhere in P, and each can be read only one way: أَوَّلُ، قَائِمٌ، الْمُسْتَتِرِ، بِغَيْرِ نُونٍ، النَّاشِئِ، etc.
- **Result: 100% vocalized.** No word lacks harakat; the only unmarked letters are madd letters and the lām of al- before sun letters.

## 5. Things to check / decisions

1. **Recension (decision).** The short text (P/W/Qujawi) was used. If the owner prefers the long text of the Riyadh edition and al-Azhari, about 750 words must be added; T has them only lightly vocalized.
2. **Transcription.** The vocalization was read from page images. It was not machine-checked: the OCR of the same print was too noisy to compare. A second human proof-reading against the scan (`raw/qawaidirab/archive1/pages/`) is advisable.
3. Places kept as in the print, which may need checking:
   - «وَهُوَ آمِنٌ» (metrically وَهْوَ);
   - «وَلَا صِفَةٍ … وَلَا بَيَانًا» (two different cases);
   - «تُسَمَّى الْمُبْتَدَأَةُ»;
   - «قَالَ سِيبَوَيْهِ وَمَنْ تَابَعَهُ: أَيْ هَهُنَا اسْتِفْهَامِيَّةٌ» (T: «قاله سيبويه … وقال من رأى…», long recension).
