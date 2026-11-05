# Texts report: متن إيساغوجي في المنطق (Athir al-Din al-Abhari, d. 663 AH) — `isaghuji.json`

How the collation was done: every witness was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, a detached «و/ك» was joined to the next word (`jawharmaknun-build/norm.js`), and the witnesses were aligned word by word by script: Smith-Waterman local alignment of each quoted segment against the base (`isaghuji-build/locate.js`), harakat comparison of aligned words (`isaghuji-build/harak.js`), and a final LCS check of base → final text (`isaghuji-build/wdiff.js`, `isaghuji-build/hdiff.js`, list in `isaghuji-build/harakat-changes.txt`). Raw downloads are in `raw/isaghuji/`. The final text is `isaghuji-build/final.txt`; `isaghuji-build/build.js` writes the JSON.

## 1. Sources

- **Base (B), fully vocalized:** «متن إيساغوجي» on Arabic Wikisource: https://ar.wikisource.org/wiki/متن_إيساغوجي (`raw/isaghuji/wikisource-matn.wiki`). It is the same digital vocalized text as the Golden Shamela «متن إيساغوجي في المنطق», ketabonline 102532 (`raw/isaghuji/ko102532.json`, checked by script: same words, same vocalization errors). B is fuller than ko102532: it has the three extra kinds of القياس الاقتراني (حملية ومتصلة، حملية ومنفصلة، متصلة ومنفصلة) and «ستة أقسام». **This is the circulated students' text**: al-Hazimi reads exactly this vocalized text, with its typing errors, in his lessons on the matn.
- **Check 1 (H):** al-Hazimi, «شرح المطلع على متن إيساغوجي» (lesson transcripts), ketabonline 4128 (`raw/isaghuji/ko4128.json`). The matn is read in heavily vocalized parentheses; these were extracted by script (`isaghuji-build/parse-hazimi.js`, 985 segments). It is the same family as B, so it settles places where B and ko102532 differ and places where Hazimi corrected the text.
- **Check 2 (M):** Mahmud al-Maghnisi, «مغني الطلاب شرح متن إيساغوجي», a well-known mamzuj commentary. Arabic Wikisource, Page namespace of «مغني الطلاب على إيساغوجي.pdf», pp. 2–121 (`raw/isaghuji/mughni/`). The matn is printed in bold inside the commentary (`isaghuji-build/mughni-segs.txt`, 360 segments). This is an independent print of the matn. Its harakat are often the same as B, because the volunteers copied B's vocalization, so it was used mainly for wording.
- **Check 3 (A):** Muhammad Subhi al-Aydi, «تهذيب فن المنطق في شرح إيساغوجي», ketabonline 42172 (`raw/isaghuji/ko42172.json`). It quotes the whole matn in 40 blocks («قال: (…) أقول») (`isaghuji-build/parse-aidi.js`). It is a separate recension with many small differences, partly vocalized. It was used only to break ties.
- **Not usable:** Wikisource «الإيضاح لمتن إيساغوجي» (Muhammad Shakir). Its transcribers pasted B's matn, errors included, so it is not independent. No independent, fully vocalized digital copy of the matn was found. The vocalization below is B's, corrected (see §4).

**Rule for wording:** B is the circulated text and is kept. Two kinds of exception were made. (a) Where the B family itself splits (B / ko102532 / H), the reading that M or A supports was adopted. (b) An evident lacuna or error in B was mended from M, which A confirms. Places where M and A agree against the whole B family on mere wording were left as in B, following the owner rule to keep the circulated wording.

## 2. Count and divisions
- 8 chapters, 78 paragraphs, 1,397 words.
- Chapter titles are the matn's own headings: إيساغوجي، القول الشارح، القضايا، التناقض، العكس، القياس، البرهان. «مقدمة المتن» is a descriptive title for the opening. The copyist's preamble «قال الشيخ الإمام أفضل المتأخرين… طيب الله ثراه…» is kept as in B; drop it if the app should start at «نحمد الله».
- The final «انتهى» heading and the editorial brackets of B were removed.
- The matn has no standard paragraph count. Paragraphs are cut at sentence ends (8–37 words); nothing was dropped or added.

## 3. Wording differences
| Place | Adopted | Other reading | Why |
|---|---|---|---|
| القياس الاستثنائي | **added** «وَأَمَّا الْقِيَاسُ الِاسْتِثْنَائِيُّ فَالشَّرْطِيَّةُ الْمَوْضُوعَةُ فِيهِ إِذَا كَانَتْ مُتَّصِلَةً فَاسْتِثْنَاءُ عَيْنِ الْمُقَدَّمِ يُنْتِجُ عَيْنَ التَّالِي، كَقَوْلِنَا: إِنْ كَانَ هَذَا إِنْسَانًا فَهُوَ حَيَوَانٌ، لَكِنَّهُ إِنْسَانٌ، فَهُوَ حَيَوَانٌ.» | missing in B, ko102532 and H | Evident lacuna: B goes straight to «واستثناء نقيض التالي…» and «وإن كانت منفصلة…», which presuppose this sentence. The text and vocalization are M's. A has the same sentence («إن كانت متصلة موجبة لزومية…») |
| الاقتراني | the three extra kinds (حملية ومتصلة، حملية ومنفصلة، متصلة ومنفصلة) kept | missing in ko102532 and H | B + M + A |
| المفرد والدلالة | قَابِلِ **الْعِلْمِ** | التَّعَلُّمِ (ko102532, H) | B + M + A |
| الخاصة | بِالْقُوَّةِ **وَبِالْفِعْلِ** | والفعل (ko102532, H); أو الفعل (A) | B + M |
| العرض | أَوْ **لَا** يَمْتَنِعَ | without لا (ko102532, a slip) | B + A, and the sense |
| المنفصلة | إِمَّا **حَقِيقِيَّةٌ** | «حَقِيقَّةٌ» (B, garbled) | A, and «منفصلة حقيقية» later in B |
| الشكل الأول | الَّذِي **جُعِلَ** مِعْيَارًا لِلْعُلُومِ | يُجْعَلُ (ko102532) | B + H + A |
| الجدل | مَشْهُورَةٍ **أَوْ** مُسَلَّمَةٍ | «لا مسلمة» (B, ko102532) | H; «لا» makes no sense here |
| الشعر | مِنْ مُقَدِّمَاتٍ مُتَخَيَّلَةٍ | «مقبولة متخيلة» (B); none of the two words in H and M | «مقبولة» is in no witness outside B (it belongs to the definition of الخطابة); «متخيلة» is in B + A |
| البرهان | **سِتَّةُ** أَقْسَامٍ | «أقسام» (ko102532, H); «فأقسام» (A) | B + M |
| العكس | لِأَنَّا إِذَا قُلْنَا | «لأننا إذا اقلنا» (ko102532, H, a slip) | B + A |

Kept as in B although M and A agree on another reading (left for the owner's rule; see «مواضع للتأكد»):
- «بالنسبة إلى أفراده نحو زيد وعمرو» (M, A: «إلى زيد وعمرو»).
- «لأنه إذا صدق» / «فإنه يصدق» (M, A have them the other way round).
- «قول ملفوظ أو معقول مؤلف» (M, A: «قول مؤلف»).
- «لإنتاج اليقينيات» (M, A: «اليقين»).
- «وظهرت المعجزة» (M, A: «وأظهر المعجزة/المعجزات»).
- «والذي له طبع مستقيم وعقل سليم» (M, A have the two in the opposite order).
- «نقيض الجزء الثاني … عين الثاني» (M: «الآخر»; H: «التالي»).
- «هذا الشيء إنسانًا» (M: «هذا إنسانًا»).

## 4. Vocalization
- **Coverage:** the final text is fully vocalized (100%), checked by script for bare consonants (`isaghuji-build` bare scan).
- B's vocalization was kept wherever it is possible. 257 occurrences (206 word forms) were corrected or completed; the full list is in `isaghuji-build/harakat-changes.txt`. Most of them are:
  - the missing sukun of the article lam (المَنْطِقِ → الْمَنْطِقِ);
  - «لاَ/إِلاَّ» → «لَا/إِلَّا», and tanwin moved off the alif (مُسْتَعِيناً → مُسْتَعِينًا);
  - the hamzat al-wasl kasra written on the lam (بِالاِلْتِزَامِ → بِالِالْتِزَامِ);
  - the fatha restored in «هذا/هذه/ذلك/لكن» (هَذَا، ذَلِكَ، لَكِنَّهُ).
- **Corrections of substance.** B is wrong in these by grammar or by spelling. Where H gives the correct form it is marked (H).
  - الشَّيْخُ، الْمُتَأَخِّرِينَ (B المُتَأخَّرِينَ)، أَثِيرُ، اللهُ ثَرَاهُ
  - وَنُصَلِّي (B وَنُصَلَّي)
  - مُفِيضُ الْخَيْرِ (B الْخَيْرَ)
  - اللَّفْظُ (B اللَّفْظْ)
  - يُرَادُ (B يُرُادُ)
  - دِلَالَةٌ (B دِلاَلَهٌ)
  - لَا يَمْنَعُ (B يَمْنَعْ; H)
  - وُقُوعِ (B وَقَوعِ)
  - الشَّرِكَةِ (H)
  - الْجِنْسُ (B الجْنْسُ)
  - مُخْتَلِفِينَ (H)
  - أَيُّ شَيْءٍ ×2 (B أَيُ / أَيَّ; H)
  - الْعَرَضِيُّ (B الْعَرَضِيَّ; H)
  - اللَّازِمُ (B الَّلاَزِمُ)
  - الْمُفَارِقُ (B المَفَارِقُ)
  - كُلِّيَّةٌ، تُقَالُ، عَرَضِيًّا
  - لِلْإِنْسَانِ (B لْلإِنْسَانَ)
  - الْقَرِيبَيْنِ (B الْقَرِيبَيْنَ)
  - وَهْوَ (B وَهَوَ; H)
  - عَرِيضُ (B عِرِيضُ)
  - حَمْلِيَّةٌ (B حَمْلِيَّهٌ)
  - وَالْإِنْسَانُ لَيْسَ (B وَالْإِنْسَانِ لَيْس)
  - طَالِعَةً (B طَالِعًة)
  - اتِّفَاقِيَّةٌ (H)
  - وَالْخُلُوِّ (B وَالْخَلَوِّ، الْخُلُوَّ)
  - وَالْأُخْرَى (H)
  - وَالْقُوَّةِ
  - إِنَّمَا (B إِنَمَا)
  - بِكَاتِبٍ (B بِكَاتِبٌ)
  - الْمَوْضُوعُ مَحْمُولًا (B الْمَوْضُوعَ; H)
  - كُلُّ حَيَوَانٍ إِنْسَانٌ (B حَيَوانٌ)
  - يُسَمَّى (B يَسَمَّى)
  - حَدًّا (B حًدًّا)
  - مَحْمُولًا (B مْحمُولاً)
  - بِعَكْسِ (B بَعَكِسِ)
  - مِعْيَارًا (B مِعَيَارًا; H)
  - فَنُورِدُهُ (B فَنَورِدُهُ; H)
  - كُلُّ جِسْمٍ (B كَلُّ جِسْمِ)
  - وَكُلُّ مُؤَلَّفٍ (B وَكُلٌ، مُؤّلِفٍ)
  - زَوْجُ الزَّوْجِ (B زَوْجِ الزَّوْجِ … زَوْجُ الزَّوْجُ)
  - يُنْتِجُ (B يُنْتِجَ، يُنْتْجُ)
  - مِنْ مُنْفَصِلَتَيْنِ (B مِنَ)
  - مُتَّصِلَةٍ وَمُنْفَصِلَةٍ
  - أَبْيَضُ (B أًبْيَضُ)
  - يَقِينِيَّةٍ
  - سِتَّةُ أَقْسَامٍ (B أَقْسَامٌ)
  - الذِّهْنِ (B الذَّهْنِ once)
  - وَالظُّلْمُ (B وَالظُّلُمُ)
  - مُقَدِّمَاتٍ (B مَقَدِّمَاتٍ; H)
- The sentence added in §3 has M's vocalization; only «إِنْسَاناً» was changed to «إِنْسَانًا».
- «ﷺ» renders B's {{ص}} template. B's own text reads «محمد ﷺ».

## 5. مواضع للتأكد
1. The sentence added in القياس الاستثنائي uses M's wording «إِذَا كَانَتْ مُتَّصِلَةً». A reads «إن كانت متصلة موجبة لزومية». The circulated digital copies lack the sentence altogether.
2. The places in §3 where M and A agree against B were kept as in B, the circulated text. The owner may prefer the commentaries' wording, for example «قول مؤلف» without «ملفوظ أو معقول».
3. Should the copyist's preamble «قال الشيخ الإمام…» stay?
4. «دِلَالَة» (B) and «دَلَالَة» (H) are both correct; B was kept.
