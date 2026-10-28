# Texts report 2: the Forty Nawawi and the Ajurrumiyya

## 1. Forty Nawawi (`nawawi.json`)

**Vocalization source:** https://sunnah.com/nawawi40 (the Arabic text, vocalized; it is the Shamela/Mawsu'a-style vocalized text, e.g. `إلَى`, `سَمِعْت`, `بِاَللَّهِ`, `كَأَنَّك`. That spelling is kept exactly as the source has it.)
**Wording check:** https://ar.wikisource.org/wiki/الأربعون_النووية (printed text, unvocalized). I compared all 42 hadiths word by word with a script.
**Not usable:** Wikisource has no harakat. midad.com and the takw.in reader are copies of the same two texts.

**Count:** 42 items, n = 1–42 in order. Each item has `rawi` (the lead-in), `matn`, `takh` and a common short `title`. The optional `extra` field holds text printed together with the hadith:
- #5 and #19: the second riwaya (`intro` + `matn`).
- #27: the second hadith, from Wabisa (`rawi` / `matn` / `takh`).

For narrative hadiths (2, 16, 19, 21, 22, 25, 28, 29, 31, 40), `rawi` stops at the narrator's chain (…رَضِيَ اللهُ عَنْهُ قَالَ:) and the story goes in `matn`.

### Normalizations (formatting only, no wording change)
- The source leaves «صلى الله عليه وسلم» (or «و سلم») unvocalized. I wrote it everywhere as «صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ».
- Removed reference numbers (`[رقم:…]`, volume/page numbers), the editorial bracket in #14 «[ يشهد أن لا إله إلا الله، وأني رسول الله]» (it is not in Nawawi's text, and Wikisource does not have it), and the sura reference in #29.
- Takhrij: the source splits it into link fragments (e.g. «[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]»). I joined these into one line. In #13 the takhrij appeared twice, so I kept one copy.
- Quotation marks are now «», and Qur'anic quotations (#10, #29) are now ﴿﴾. I removed the outer quote marks around the whole matn.
- Filled in harakat on the few words the source left unvocalized:
  - أمامك → أَمَامَك (#19)
  - استفت قلبك → اسْتَفْتِ قَلْبَك (#27)
  - حديث حسن → حَدِيثٌ حَسَنٌ (#31)
  - بهذا اللفظ → بِهَذَا اللَّفْظِ (#36)
  - في «صحيحيهما» بهذه الحروف → vocalized (#37)
  - هُرَيْرَة → هُرَيْرَةَ and رَسُول → رَسُولُ (#38)
  - قَال → قَالَ (#30)
  - مُسْلِما → مُسْلِمًا (#36)
  - وَ حَفَّتهُمُ المَلاَئِكَة → وَحَفَّتْهُمُ الْمَلَائِكَةُ (#36)
- #5: «قَالَتْ: قَالَ: رَسُولُ اللَّهِ» → «قَالَتْ: قَالَ رَسُولُ اللَّهِ» (stray colon removed).

### Wording differences (sunnah.com, abbreviated SC, vs Wikisource, abbreviated WS), and the reading chosen

| # | SC | WS | Chosen | Why |
|---|---|---|---|---|
| 1 | …النَّيْسَابُورِيُّ **رَضِيَ اللهُ عَنْهُمَا** فِي صَحِيحَيْهِمَا | no رضي الله عنهما | SC | Present in many printed copies; an honorific, not part of the hadith |
| 4 | وَشَقِيٍّ **أَمْ** سَعِيدٍ | وشقي **أو** سعيد | **أَوْ** (case endings kept from SC) | «أو» is the wording of the Sahihayn and of the usual Arba'in prints |
| 10, 12, 14, 26, 29 | without تعالى | adds «تعالى» / «رضي الله تعالى عنه» | SC | Honorific additions only |
| 12 (takh) | حَدِيثٌ حَسَنٌ، رَوَاهُ التِّرْمِذِيُّ، ابن ماجه | حديث حسن رواه الترمذي وغيره هكذا | WS wording, vocalized: «حَدِيثٌ حَسَنٌ، رَوَاهُ التِّرْمِذِيُّ وَغَيْرُهُ هَكَذَا» | SC's line is a site edit (reference list); WS is Nawawi's own takhrij wording |
| 16 (takh) | رَوَاهُ الْبُخَارِيُّ | رواه البخاري ومسلم | SC | The hadith is in Bukhari only, and Nawawi's takhrij is «رواه البخاري» |
| 19 | عَنْ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ | عن **أبي العباس** عبد الله بن عباس | WS (added «أَبِي الْعَبَّاسِ») | Nawawi gives the kunya, as he does elsewhere. WS's «خلف النبي» and «فقال لي» are not adopted (SC «خَلْفَ رَسُولِ اللَّهِ… فَقَالَ» kept) |
| 19 (takh) | حَدِيثٌ حَسَنٌ صَحِيحٌ | حسن صحيح | SC | Same meaning |
| 22 | أَأَدْخُلُ الْجَنَّةَ | أدخل الجنة | SC | Muslim's wording |
| 23 | تَمْلَأُ **مَا** بَيْنَ | تملأ بين | SC | Muslim's wording |
| 24 | تَبَارَكَ وَتَعَالَى | عزّ وجلّ | SC | Common Arba'in wording; honorific |
| 25 | وَأَمْرٌ **بِمَعْرُوفٍ** | وأمر **بالمعروف** | **بِالْمَعْرُوفِ** | Muslim's wording |
| 27 | رَضِيَ اللهُ **عَنْهُ** (al-Nawwas) | عنهما | SC | His father is not a known Companion, so the dual is an error |
| 27 | مَا حَاكَ فِي **صَدْرِك** | في **نفسك** | SC | Muslim's wording is «في صدرك». Many Arba'in prints have «نفسك» |
| 27 | **فَقَالَ**: اسْتَفْتِ | قال: استفت | SC | Minor |
| 28 | without «عز وجل» and without «وكل ضلالة في النار» | has both | SC | Both are additions not found in the common Arba'in text (the second comes from al-Nasa'i's riwaya) |
| 29 | وَيُبَاعِدْنِي **مِنْ** النَّارِ | عن النار | SC | Tirmidhi's wording |
| 29 | ثَكِلَتْك أُمُّك وَهَلْ يَكُبُّ النَّاسَ عَلَى | ثكلتك أمك **يا معاذ** وهل يكب الناس **في النار** على | WS (added «يَا مُعَاذُ» and «فِي النَّارِ») | Present in Tirmidhi and in the standard Arba'in text |
| 29 | فقُلْت | قلت | SC | Minor |
| 32 | order «مُسْنَدًا… مُرْسَلًا» | different position of «مرسلا» | SC | Same meaning |
| 35 | هَاهُنَا | ههنا | SC | Spelling only |
| 36 | وَمَنْ **أَبَطْأَ** بِهِ | بطّأ | **بَطَّأَ** | SC's form is a typo; Muslim has «بطّأ» |
| 36 | يَتَدَارَسُونَهُ **فِيمَا** بَيْنَهُمْ | بينهم | SC | Muslim's wording |
| 37 | …سَبْعِمِائَةِ ضِعْفٍ **إلَى أَضْعَافٍ كَثِيرَةٍ** | without | SC | Present in Bukhari and in the usual Arba'in text |
| 40 | بِمَنْكِبِي، **وَقَالَ** | فقال | **فَقَالَ** | Bukhari's wording |
| 42 | عَنْ أَنَسِ **بْنِ مَالِكٍ** | عن أنس | SC | Adds the full name only |

Spelling-only variants not listed above: المسئول/المسؤول, اتدري/أ تدري, أوليس/أو ليس, ما لا/مالا, فلا تضيعوها/فلاتضيعوها.

## 2. Matn al-Ajurrumiyya (`ajurrumiyya.json`)

**Vocalization source:** https://biebook.com/1211 («الآجرومية في النحو»), the only fully and consistently vocalized online text I found. ⚠ Caveat: biebook.com is a small e-book platform with no named edition. I did not take its wording on trust: every sentence was checked against the two prints below, and I corrected it where it departs from both.

**Wording check 1:** https://shamela.ws/book/11371 (متن الآجرومية, دار الصميعي 1419هـ/1998م; printed page numbers; partly vocalized; includes its own footnotes on variant prints).
**Wording check 2:** https://ar.wikisource.org/wiki/الآجرومية_في_قواعد_علم_العربية (a transcribed print; partly vocalized and with some errors, used for wording only).

**Rejected as the base:**
- The fully vocalized Wikisource Algiers print, «المقدمة الآجرومية (1283 هـ)»: it uses Maghribi letter forms (ڢ، ڧ، ۡ) and hamza-less alifs, so it is not usable as web text.
- ashabakah.com / takw.in «مشكول»: the same text, but unvocalized in several places, with typos (e.g. «يُخْفَصُ»).

**Count:** 26 chapters (the 25 أبواب plus «فَصْلٌ: الْمُعْرَبَاتُ», as in the Shamela table of contents), 102 paragraphs. The basmala is stored separately in `basmala`. The editor's line «قَالَ الْمُصَنِّفُ رَحِمَهُ اللهُ» and the closing «تَمَّ بِحَمْدِ اللهِ» are omitted.

Chapters, in order:
1. بَابُ الْكَلَامِ
2. بَابُ الْإِعْرَابِ
3. بَابُ مَعْرِفَةِ عَلَامَاتِ الْإِعْرَابِ
4. فَصْلٌ: الْمُعْرَبَاتُ
5. بَابُ الْأَفْعَالِ
6. بَابُ مَرْفُوعَاتِ الْأَسْمَاءِ
7. بَابُ الْفَاعِلِ
8. بَابُ الْمَفْعُولِ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ
9. بَابُ الْمُبْتَدَأِ وَالْخَبَرِ
10. بَابُ الْعَوَامِلِ الدَّاخِلَةِ عَلَى الْمُبْتَدَأِ وَالْخَبَرِ
11. بَابُ النَّعْتِ
12. بَابُ الْعَطْفِ
13. بَابُ التَّوْكِيدِ
14. بَابُ الْبَدَلِ
15. بَابُ مَنْصُوبَاتِ الْأَسْمَاءِ
16. بَابُ الْمَفْعُولِ بِهِ
17. بَابُ الْمَصْدَرِ
18. بَابُ ظَرْفِ الزَّمَانِ وَظَرْفِ الْمَكَانِ
19. بَابُ الْحَالِ
20. بَابُ التَّمْيِيزِ
21. بَابُ الِاسْتِثْنَاءِ
22. بَابُ لَا
23. بَابُ الْمُنَادَى
24. بَابُ الْمَفْعُولِ مِنْ أَجْلِهِ
25. بَابُ الْمَفْعُولِ مَعَهُ
26. بَابُ الْمَخْفُوضَاتِ مِنَ الْأَسْمَاءِ

Titles:
- Chapter 1 is titled «بَابُ الْكَلَامِ», as requested and as in the 1283هـ print. biebook and Shamela have «أنواع الكلام».
- The last chapter keeps the printed title «بَابُ الْمَخْفُوضَاتِ مِنَ الْأَسْمَاءِ» (= «باب مخفوضات الأسماء»).

### Corrections made to the vocalized source (biebook, abbreviated BB)

| Chapter | BB | Shamela / Wikisource | Chosen | Why |
|---|---|---|---|---|
| الكلام | وَحُرُوفُ الْقَسَمِ (nominative) | وحروفِ القَسَم (genitive) in both | **وَحُرُوفِ** | Both prints; it is coordinated with «بالخفض…» |
| الفاعل | «وَقَامَتْ هِنْدٌ، وَقَامَتِ الْهِنْدَانِ» | «وقامت هند، **وتقوم هند**، وقامت الهندان» in both | added «وَتَقُومُ هِنْدٌ» | BB dropped an item from the list of examples |
| الفاعل | وَقَامَ الْهُنُودُ | وقامَت الهُنُود in both | **وَقَامَتِ الْهُنُودُ** | Both prints |
| العوامل | وَأَصْبَحَ وَيُصْبِحُ، تَقُولُ | وأصبح ويصبح **وأصبحْ** in both | added «وَأَصْبِحْ» | BB dropped the imperative |
| الأفعال | وَأَيْنَ، وَأَيَّانَ | وأَيَّانَ، وأينَ (Shamela) | **وَأَيَّانَ، وَأَيْنَ** | Shamela print order (the takw.in text has the same) |
| الاستثناء | تَامًّا مَنْفِيًّا | منفيا تاما in both | **مَنْفِيًّا تَامًّا** | Both prints |
| البدل | وَهُوَ عَلَى أَرْبَعَةِ أَقْسَامٍ | وهو أربعة أقسام in both | **وَهُوَ أَرْبَعَةُ أَقْسَامٍ** | Both prints |
| البدل | أَرَدْتَ أَنْ تَقُولَ: رَأَيْتُ الْفَرَسَ | أردت أن تقول: الفرسَ in both | **…تَقُولَ: الْفَرَسَ** | Both prints |
| المخفوضات | مَا يُخْفَضُ بِمِنْ… وَالْبَاءُ، وَالْكَافُ، وَاللَّامُ | والباءِ، والكافِ، واللامِ (Shamela) | **وَالْبَاءِ، وَالْكَافِ، وَاللَّامِ** | Genitive after «بِمِنْ…», as in Shamela |

### Remaining wording differences, where the BB reading was kept

| Place | BB (kept) | Shamela / Wikisource | Why kept |
|---|---|---|---|
| الأفعال | وَلَمَّا، وَأَلَمْ، وَأَلَمَّا | Shamela: لَمَّا، ألَمْ، ألَمَّا (no waw) | Punctuation-level only; Wikisource has the waw |
| المبتدأ | فَالْمُفْرَدُ نَحْوَ: «زَيْدٌ قَائِمٌ» | Shamela: نحو **قولك** | Wikisource has no «قولك» either |
| النعت | نَحْوَ: زَيْدٌ وَمَكَّةُ | Shamela: ومَكَّةَ | Vocalization only (حكاية); both are acceptable |
| العطف | فَإِنْ عَطَفْتَ عَلَى مَرْفُوعٍ | Wikisource and some prints (per a Shamela footnote): عطفت **بها** | Same as the Shamela main text |
| الظرف | وَغُدْوَةً | غَدْوَة (Shamela, Wikisource) | Vocalization only; غُدْوَة is the lexical form |
| الظرف | وَثَمَّ، وَهُنَا | Shamela: وهنا، وثَمَّ | Wikisource has BB's order |
| الاستثناء | «مَا قَامَ الْقَوْمُ إِلَّا زَيْدٌ» وَ«إِلَّا زَيْدًا» | Shamela: «ما قام إلا زيداً» و«إلا زيدٌ» (omits القوم) | Shamela's line looks like a typo; Wikisource matches BB |
| العوامل | مَا فَتِئَ | فَتِيءَ | Spelling only |

Notes:
- Vocalization is BB's throughout, apart from the corrections above. Some BB choices you might want to review: «نَحْوَ» (accusative) is used throughout, including «فَنَحْوَ قَوْلِكَ» in the مخفوضات chapter, where «فَنَحْوُ» would also be correct.
- Paragraphs follow BB's line breaks (1–3 sentences each). Two long lines were split at a sentence boundary: «وَمَعْنَى إِنَّ…» and the parts of the الاستثناء chapter.
