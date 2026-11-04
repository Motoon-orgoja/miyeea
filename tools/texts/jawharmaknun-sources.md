# Texts report — الجوهر المكنون في صدف الثلاثة الفنون (`jawharmaknun.txt`)

عبد الرحمن بن محمد الصغير الأخضري (ت ٩٨٣هـ), rajaz, on المعاني والبيان والبديع (a versification of the Talkhis).
Verse numbers below follow the base (1–291).
How the comparison was done: every source was parsed into verses by script, stripped of harakat and tatweel, alef/yaa/taa-marbuta forms unified, detached و/ك glued, and compared word by word with the base (LCS diff). Harakat were compared letter by letter where the skeleton was identical. Scripts are in `tools/texts/jawharmaknun-build/` (`parse-*.js`, `compare.js`, `table.js`, `hz.js`, `harak.js`, `build.js`, `fixes.js`). Raw files as downloaded are in `tools/texts/raw/jawharmaknun/`. Every change made by the build is listed in `raw/jawharmaknun/_collation-log.txt`.

## Sources

The matn is **not on shamela.ws online**. The site's book and author lookups (`/ajax/book`, `/ajax/author`), the author page (الأخضري, 427: only his فقه matn) and the البلاغة category were all checked. The Shamela-golden copies are on ketabonline (جامع الكتب الإسلامية). None of them is fully vocalized.

| Code | Source | Use |
|---|---|---|
| **T** | تكوين الراسخين (nuqayah), «الجوهر المكنون لعبد الرحمن الأخضري، ضبط أبي أمير الشافعي»: https://takw.in/reader.php?matn=الجوهر-المكنون (card: https://takw.in/lughah/balaghah/aljawhar-almaknoon). Raw: `takwin-reader.html`, `takwin-page.html` | **Base text.** Fully vocalized: 291 verses with 39 headings. |
| **K** | ketabonline 25502 «مَتنُ الجوهر المكنون في الثلاثة فنون» (الشاملة الذهبية), typed 1425هـ with «ضبط أهمّ مواضعه»: https://ketabonline.com/ar/books/25502. Raw: `ko25502.json` | Wording check. Partly vocalized, 291 numbered verses. |
| **M** | ketabonline 19479 «اللب المصون شرح الجوهر المكنون» لأبي الوليد المقتدي (الشاملة الذهبية), verses quoted as «a = b»: https://ketabonline.com/ar/books/19479. Raw: `ko19479.json` | Wording check. 289 of 291 verses found; 100 and 277 are not quoted. |
| **Hz** | ketabonline 90602 «شرح الجوهر المكنون» لأحمد بن عمر الحازمي (49 lessons): https://ketabonline.com/ar/books/90602. Raw: `ko90602.json` | Tie-breaker. Its verse headers turned out to be the K text (288 of 300 hemistichs identical), so only Hazimi's **own commentary wording** (lemmas and explanations, `ko90602-body.txt`) was counted. |
| I | terjemahkitab.com (Indonesian translation with vocalized Arabic): https://terjemahkitab.com/terjemah-jauharul-maknun/. Raw: `terjemahkitab.html` | **Not independent.** It shares T's own typos (الْحَقِيقَيَّةُ, وِلِاسْتِجْهَالِ), and verses 50–55 are pasted from K. alkhoirot.org and tedisobandi have the same Indonesian text. |
| D | ketabonline 102433 «شرح حلية اللب المصون» (ط الحلبي). The file is only المنياوي's glosses on الدمنهوري, without the verses. | Consulted for the variant notes («وفي نسخة…»), for example 249 and 125. |

Tried and unusable: archive.org OCR of the الدمنهوري print (`charh_jawhar_maknun`), of نوريم «جديد الثلاثة الفنون» and of «يواقيت المشتري»: the OCR is garbage. The «طبعة مركز البصائر» PDF item on archive.org is gone. ar.wikisource and alukah have no copy.

## Verse count
**291** ✔. T, K and M all have 291 (M has 289 of them, the two missing verses being simply not quoted). Takwin's card says «أرجوزة تقع في ٢٩١ بيتاً», and the theses cited in the web results give the same number. The headings in T and K fall on exactly the same verses (39 headings, from «خطبة الكتاب» to «خاتمة»). The headings are taken from T.

## Wording: the two recensions
T (takwin) and K/M/Hazimi represent two text traditions. They differ in about 60 hemistichs, and the Indonesian copies follow T. The rule applied was this: **T is kept unless K and M agree against it AND Hazimi's commentary reads the same, or T is plainly wrong** (typo, rhyme, meter, the Talkhis term). Under that rule 31 hemistichs were changed (8 more were changed later; see «Decision 2026-11-04»):

| Verse | Base (T) | Written as | Why |
|---|---|---|---|
| 45a | وَاسْتُحْسِنَ التَّأْكِيدُ | وَاسْتَحْسِنِ التَّوْكِيدَ | K M Hz |
| 52a | أَقْسَامُهَا | أَقْسَامُهُ | K M Hz, I |
| 68b | وِلِاسْتِجْهَالِ | أَوِ اسْتِجْهَالِ | K M Hz. The kasra on و in T is itself wrong. |
| 70b | فِيهَا مُنْقَسِمْ | فِيهِ يَنْقَسِمْ | K M Hz |
| 72a | وَبِالْإِضَافَةِ | وَبِإِضَافَةٍ | K M Hz |
| 80a | رَدًّا | رَدٍّ | K M Hz |
| 83a | لِوَضْعٍ اوْ | لِلْأَصْلِ أَوْ | K M Hz |
| 85a | صَحِبَ | صَاحَبَ | K M Hz |
| 91b | وَالْقَبَعْثَرَا | وَالْقَبَعْثَرَى | K M Hz (the name is القَبَعْثَرَى) |
| 109b | لِلْقَصْرِ | لِقَصْرِ | K M Hz |
| 117a | لِمَعْمُولَاتِهِ | لِمَعْلُولَاتِهِ | K M Hz |
| 124b | أُوتِيتَ | أُعْطِيتَ | K M Hz |
| 130a | اسْتِعْبَادٍ | اسْتِبْعَادٍ | Typo. The term is الاستبعاد; Hz has «الاستبعاد: عدّ الشيء بعيدًا». |
| 132b | وَتَصْدِيقٍ أَدَبْ | وَحَمْلٍ وَأَدَبْ | K M Hz |
| 152a | فَهْيَ الْحَقِيقَيَّةُ لَيْسَ فِي فَنِّ الْبَيَانِ | فَهْيَ الْحَقِيقَهْ لَيْسَ فِي الْبَيَانِ | T's version is too long for the rajaz and misspells حقيقية. K's version scans, and Hz glosses «فهي الحقيقة» as الجديرة. |
| 154b | الهُدَاهْ | النَّجَاهْ | K M Hz |
| 173a | مَا بِهِ حُذِفْ | مَا مِنْهُ حُذِفْ | K M Hz |
| 176a | عَابَرَتِ | غَابَرَتِ | A dot error. K and Hz have «غابرت أي جاوزت»; M and I have غايرت. |
| 192a/b | جُرِّدَتْ…بِالْأَصْلِ / رُشِّحَتْ…بِالْفَصْلِ | جُرِّدَتْ…بِالْفَصْلِ / رُشِّحَتْ…بِالْأَصْلِ | T swaps the two words. K, M and Hz all have this order («والمراد بالفصل هنا المستعار له»), which matches the Talkhis: المجردة goes with ما يلائم المستعار له. |
| 206b | تُرَدّْ | يَرِدْ | K M. T's word breaks the rhyme with قُصِدْ. |
| 214a | وَالثَّانِ مِنْ أَلقَابِهِ | وَعُدَّ مِنْ أَلْقَابِهِ | K M Hz (Hazimi repeats «وعُدّ من ألقابه» for each item). In T's own headings المعنوي is the first ضرب, not the second. |
| 232a | لَنْ تَعْرِفَ | لَنْ يَعْرِفَ | K M Hz |
| 243a | الُاولَى | الَاوَّلْ | K M Hz («الاوّلْ بتسهيل الهمزة من أجل الوزن»). T's case of النَّظْمِ is kept, since Hz explains it as «وفي النظم». |
| 244b | تَخْشَ | تَخْشَى | Mushaf spelling, as in K and Hz. The alif is not pronounced before ال, so the meter is the same. |
| 251b | الْكُرَمَا | الْعُلَمَا | K M Hz |
| 258b | أَرْدَاهُ الِانْتِحَالُ | أَرْدَؤُهُ انْتِحَالُ | K M Hz (vocalized as in M) |
| 263a/b | كَنَقْلٍ … أَوَقَلْبٍ | لِنَقْلٍ … وَقَلْبٍ | K M Hz. T's «أَوَ» is itself broken. |
| 284a | سَهْلٍ | حَسَنٍ | K M Hz |
| 286a | صِفَاتِ | سِمَاتِ | K M Hz |

**T kept** where only K (or only M) differs, or where Hazimi's commentary supports T or says nothing. Notable cases:
- 15b نُبَذٍ
- 86b مَكَانَ الظَّاهِرِ
- 106b
- 114a لِلتَّعْمِيمِ (Hz: «اللام للتعليل»)
- 125b حَضٍّ وَلِلِاسْتِفْهَامِ (D cites it)
- 160b
- 165a
- 170a بُعْدِ النِّسْبَةِ (Hz: «بُعْد معطوف بحذف العاطف على كثرة التفصيل»)
- 172
- 188b
- 193a
- 200b
- 209a
- 212b
- 221b
- 226b
- 236b
- 248a
- 249 (D: «وفي نسخة فما ترى أخرى القرينتين فيه أكثرا وهي أقرب»)
- 252
- 261b
- 265a
- 269a
- 270b
- 277b
- 278a
- 280a

## Harakat corrected or completed
- 57a وَضَيقِ → وَضِيقِ (K, M)
- 62b بَحَسَبِ → بِحَسَبِ (misprint)
- 114a لِلْتَعْمِيمِ → لِلتَّعْمِيمِ (sun letter)
- 119a وَالأَوْصَافِ → وَالْأَوْصَافِ
- 137a الْإعْرَابِ → الْإِعْرَابِ
- 137b في → فِي
- 157a حَقِيقيٌّ → حَقِيقِيٌّ
- 214a أَلقَابِهِ → أَلْقَابِهِ
- 224b الْعِلمِ → الْعِلْمِ
- 232b الكَوْنِ → الْكَوْنِ
- 254a وَالْقَلبُ → وَالْقَلْبُ
- 277a تَلوِيحٌ → تَلْوِيحٌ
- 279a إِلغَازٌ → إِلْغَازٌ
- A lam before a madd alif that had no mark got its fatha (لا → لَا, 14 places).
- Mark order was normalized to shadda first.
- Result: every consonant carries a mark. The only exceptions are the article lam before a sun letter and the لام of لِلهِ, by convention.

## Cleanup
- The example brackets «كَـ(…)» and «نَحْوُ (…)» were removed (كَـ(فَازَ…) → كَفَازَ…), as in `alfiyya.txt`.
- The tatweel was removed.
- The Qur'anic quotations are now in ﴿﴾: 43a ﴿إِنَّا إِلَيْكُمْ مُرْسَلُونْ﴾, 244b ﴿تَخْشَى النَّاسَ وَاللهُ أَحَقّْ﴾, 275 ﴿التَّائِبُونَ … السَّاجِدُونْ﴾ (opened in the first hemistich, closed in the second). 248b كَسُرُرٍ مَرْفُوعَةٍ is left without ﴿﴾ because it is declined (genitive), not in its Mushaf form.
- Headings: a space was added after «:», and missing shadda/sukun were added (الضَّرْبُ، الثَّانِي، الْفَنُّ).

## Decision 2026-11-04: the text as taught in the commentaries
The coordinator applied Yusuf's rule: use the reading of the commentaries. So the 6 places where K and M agree against T were **also changed**, even where Hazimi's commentary says nothing or is mixed. They make 8 hemistichs, all scanned as rajaz and fully vocalized (script: `fixes.js`, group W2):

| Verse | Base (T) | Written as | Note |
|---|---|---|---|
| 32b | لَفْظًا مُطَابِقًا | لَفْظٌ مُطَابِقًا | لفظٌ is the subject of the passive يُرى. |
| 108b | لِلنُّكْتَةِ الْجَلِيَّهْ | لِنُكْتَةٍ جَلِيَّهْ | |
| 115a | وَالِاخْتِصَارِ | وَلِاخْتِصَارِ | |
| 121b | وَمَا تَقَدَّمَا | كَمَا تَقَدَّمَا | |
| 170a | بُعْدِ النِّسْبَةِ | أَوْ لِنُدْرَةِ | Hz sums it up as «لكثرة التفصيل أو لندرة حضور المشبه به في الذهن». |
| 170b | وَالذِّكْرِ وَالتَّرْتِيبِ فِي | فِي الذِّهْنِ كَالتَّرْكِيبِ فِي | K and Hz have كالتركيب, M has كالترتيب. التركيب is the Talkhis's «مركبًا خياليًا أو عقليًا». |
| 185a | تُنْتَمَى | تَنْتَمِي | The rhyme follows 185b. |
| 185b | وَالْوِفَاقِ فَاعْلَمَا | لَا الْوِفَاقِ فَاعْلَمِ | |

In total, 39 hemistichs of T were changed in wording.

## Places to check (مواضع للتأكد)
1. Some readings were kept against a single witness: K alone or M alone differs, or Hazimi's commentary supports T. They are listed above under «T kept» (170a is no longer one of them: it was changed by the decision below).
2. **115b كَبَلَغَ الْمُولَعُ بِالْأَذْكَارِ** is T's text, and Hz explains «بلغ فعل ماض». K and M have «كَبَلِّغِ الْمُولَعَ», which scans more smoothly (T's first foot is مخبول).
3. **269a** is three-way: T بِنُكْتَةٍ أَجَلُّهُ, K لِنُكْتَةٍ أَجْمَلُهُ (Hz: «أجمله وأحسنه»), M لِنُكْتَةٍ جَلِيلَةٍ. T is kept.
4. **176a** غَابَرَتِ (K, Hz) against غَايَرَتِ (M, I).
5. Case endings where K/M differ from T and both are possible were kept as in T. Examples: 42b حَتْمٌ/حَتِّمْ, 65 (the list in genitive), 71b أَعَمُّ, 94a وَصِيغَةَ, 163 (the list in nominative). The full list is in `jawharmaknun-build/harak.txt`.
