# Texts report — جوهرة التوحيد (`jawhara.txt`)

Poem by برهان الدين إبراهيم بن إبراهيم اللقاني المالكي (ت ١٠٤١هـ), رجز, **144 verses**.
Verse numbers below are the standard numbering 1–144 (all sources agree on it).
How the comparison was done: every verse was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, and the
sources were compared verse by verse and word by word by script (`raw/jawhara/scripts/collate.js`, `hdiff.js`), not by eye.

## Sources

The Jawhara is **not on shamela.ws online** (searched the site's book/author lookups and the full العقيدة category: no matn, no
تحفة المريد, no شرح الصاوي). The texts below come from ketabonline (جامع الكتب الإسلامية), which hosts the الشاملة الذهبية files.

| Code | Source | Use |
|---|---|---|
| **K** | ketabonline 102535 «متن الجوهرة في علم التوحيد» (الشاملة الذهبية), 1 page, 144 numbered verses: https://ketabonline.com/ar/books/102535 — raw `raw/jawhara/ketab-102535-p1.html` | **Base text** (wording + its own harakat). Vocalized ≈ 66 % of letters (139 of 1267 words have no mark at all). |
| **T** | The vocalized matn printed before «تحفة المريد على جوهرة التوحيد» للباجوري, ط. دار السلام، تحقيق د. علي جمعة (1422/2002), ketabonline 102863, pages 1–6: https://ketabonline.com/ar/books/102863 — raw `raw/jawhara/tuhfa-102863/` | Harakat filler (≈ 80 % vocalized) + wording check. |
| W | Arabic Wikisource «الجوهرة في التوحيد» («ضبط جلال علي الجهاني»): https://ar.wikisource.org/wiki/الجوهرة_في_التوحيد — raw `raw/jawhara/wikisource-raw.txt` | Turned out to be **letter-for-letter the same text as T** (same typos: أَوْحِتْ، بَغْضَهُ، نَقَاهَا، فَبِمَحْص). Also the matn pasted before شرح الصاوي (ketabonline 102963) is this same text. So T/W/Sawi-matn count as one source: the Jahani vocalization. |
| **B** | Bajuri's own lemmas and verse headers inside تحفة المريد (pages 7–338 of ketabonline 102863), unvocalized — raw `raw/jawhara/tuhfa-102863/body-pages-7-338.txt` | **Tie-breaker for wording and harakat** («قوله: (…) بفتح…», etc.). |
| S | Sawi's lemmas in «شرح العلامة الصاوي على جوهرة التوحيد», تحقيق عبد الفتاح البزم، دار ابن كثير, ketabonline 102963 (410 pages): https://ketabonline.com/ar/books/102963 — raw `raw/jawhara/sawi-102963/` | Second commentary, for the disputed places. |

Also seen but not used: ketabonline 102668 (إتحاف المريد، حاشية الأمير), 102896 (تقريب البعيد للصفاقسي).

**Verse count:** 144 ✔ in K, T, W, B, S (ketabonline's card also says «عدد الأبيات 144»).

**Headings:** none of the sources has section headings inside the poem, so the file has a single «## المنظومة» line (as in bayquniyya).

## Method

1. K is the base for the wording and keeps all its own harakat.
2. A letter that has no mark in K takes T's mark when the word skeleton is identical (script `merge.js`). Marks are never put on
   a bare alif/alif maqsura or as a vowel on a madd letter. **616 words** were completed this way; every one is listed in
   `raw/jawhara/merge-log.txt` (verse+hemistich, K word, completed word).
3. Where K and T disagree in wording or in a haraka, the decision follows Bajuri (B) and is listed below. 35 manual
   corrections were applied after the merge (`raw/jawhara/scripts/jw_fix.json`, also in the log as FIX lines).
4. Cleaning: removed verse numbers, «تمت الجوهرة المباركة», the brackets of «[جوهرة التوحيد]»/«[محمد]», colons and the
   hemistich dots. No tatweel. UTF-8 without BOM. Final text ≈ 83 % of letters vocalized.

## Wording differences (K vs T) and the choice

| Verse | Chosen | Other reading | Why |
|---|---|---|---|
| 2 | وَقَدْ **خَلَا** الدِّيْنُ | عَرَى (T/W; Sawi's lemma «وقد عرى» and he explains it as عَرِيَ = خلا) | K + Bajuri's header and explanation («وقد خلا الدين عن التوحيد»). Sawi's عَرِيَ is a real variant (see «to confirm»). |
| 8 | مُرِيدًا **فِي الثَّوَابِ** طَامِعَا | للثواب (K) | T + Bajuri («قوله: (في الثواب طامعا)») + Sawi lemma. |
| 11 | مَنْ قَلَّدَ **فِي** التَّوْحِيْدِ | بالتوحيد (K) | T + Bajuri's header. |
| 34 | أَوْجِبْ | أَوْحِتْ (T) | Typo in T; Bajuri «ووحدة أوجب لها». |
| 42 | **فَكُلُّ** نَصٍّ لِلْحُدُوثِ | وكل (T) | K + Bajuri: «فالفاء فاء الفصيحة». |
| 44 | الْغِنَى | الْغِنَا (T) | Spelling only; K + Bajuri «كرزقه الغنى». |
| 50 | فَبِمَحْضِ الْعَدْلِ | فبمحص (T) | Typo in T. |
| 67 | بَعْضَهُ | بَغْضَهُ (T) | Typo in T; Bajuri «(وبعضه)». |
| 82 | حَكَى | حكا (T) | Spelling only; K + Bajuri. |
| 83 | نَفَاهَا | نَقَاهَا (T) | Typo in T; Bajuri. |
| 87 | وَقَلِّلْ الامَلَا | وَقِلَّ اْلأَمَلَا (T) | K + Bajuri: «بفتح القاف وتشديد اللام الأولى وتسكين الثانية، ودرج همزة الأمل». |
| 93 | وَلَا **نَخُضْ** … نَصٌّ **عَنِ** الشَّارِعِ | تَخُضْ … مِنَ (T); Sawi: «ولا تخض» | K + Bajuri («أي ولا نخض نحن معاشر جمهور المحققين»; header «نص عن الشارع»). |
| 110 | **دَارَا** خُلُوْدٍ | دار (T) | K + Bajuri («قوله: (دارا خلود)»). |
| 111 | حَتْمٌ كَمَا **قَدْ** جَاءَنَا | without قد (T) | T breaks the meter. |
| 131 | **وَلَا** تَزِغْ | فلا (T; Sawi lemma «فلا تزغ») | K + Bajuri («وقوله: (ولا تزغ عن أمره المبين)»). |
| 133 | إِنْ **أُزِيلَ** وَصْفُهُ | إن يزولَ (K) | T + Bajuri («وليس يعزل إن أزيل وصفه») + Sawi. K's form is also ungrammatical after إنْ. |
| 141 | **فَمَنْ** يَمِلْ **لِهَؤُلَاءِ** | ومن … لهؤلا (T) | K + Bajuri; «لهؤلاءِ» completes the rajaz foot (mutafʿilun), «لهؤلا» leaves it short. |

## Harakat corrected (conflicts between K and T, or errors in both)

Decided by Bajuri where he states it, otherwise by grammar/meter. K was right in most conflicts (e.g. 9 كُلِّفَ، 18 وَفُسِّرَ،
22 وَنَقْصُهُ، 26 وَوَالِدٍ، 28 سَبِيلَ، 49, 53 الشَّرِّ، 76 مَنْ وُلِّيَ، 94 هِيْ (Bajuri: «بسكون الياء»)، 101 ضُوعِفَتْ، 123 حَادِثْ
(Bajuri: «بسكون المثلثة لضرورة الوزن»)، 126 يُجَدِّدْ (Bajuri: «بسكون الدال»)، 137 مَنْ خَلَفْ، 144 مِنْ أُمَّتِهْ) and was kept.
These were changed:

| Verse | Was | Written | Reason |
|---|---|---|---|
| 3 | فَأْرْشَدَ (K) | فَأَرْشَدَ | Sukun on the hamza is a typo; T. |
| 5 | بأَصْلِ | بِأَصْلِ | Only possible vowel of the preposition. |
| 6 | مُلَتَزَمْ (K) | مُلْتَزَمْ | Form VIII participle; T. |
| 7 | هَذَّبْتُهُا (K) | هَذَّبْتُهَا | Typo. |
| 13 | الضيَّرِ (K) | الضَّيْرِ | T. |
| 14 | بَأَنَّ (K) | بِأَنَّ | Preposition. |
| 18 | بالتصدَّيقِ (K) | بِالتَّصْدِيقِ | Typo; T. |
| 19 | والاسلامُ (K) / وَالاسْلاَمِ (T) | وَالاسْلَامَ | Bajuri: «بنقل حركة همزته إلى اللام ثم طرحها للوزن، وهو بالنصب». |
| 29 | الْسَمْعُ (K) | السَّمْعُ | Sun letter. |
| 41 | انِتْقَامَهْ (T) | انْتِقَامَهْ | Typo. |
| 42, 80 | الذَّي / الذَّيِ (T) | الَّذِي | Typo. |
| 49 | كُلاً (K) / كَلاًّ (T) | كُلًّا | Bajuri: «فـ(كلّا) مفعول لـ(يفعل) … ليس العبد يخلق كل فعل». |
| 56 | هذِا (T) | هذَا | Typo. |
| 57 | الفَضْلَ (K) | الْفَضْلِ | Genitive after بمحض. |
| 58 | لَعِبِا (T) | لَعِبَا | Typo. |
| 61 | للِنِّسَا (K) / لِلنَّسَا (T) | لِلنِّسَا | النِّسَاء. |
| 64 | الِمِنَنْ (T) | المِنَنْ | Typo. |
| 66 | ملاَئِكَة | مَلَائِكَةْ | Obvious. |
| 68 | حَتَّمَا (K), الْبَارِيِ | حَتِّمَا، الْبَارِي | Bajuri: «و(حتّما) بفتح الحاء على أنه فعل أمر». |
| 72 | بِالْبَعَضِ (T) | بِالْبَعْضِ | Meter and word. |
| 92 | لَخَّصُّوا (K) | لَخَّصُوا | Stray shadda. |
| 99 | الأَعيْانِ (T) | الأَعْيَانِ | Typo. |
| 111 | بَحوْضِ (T) | بِحَوْضِ | Preposition. |
| 114 | مِنٍ (K) | مِنْ | Typo. |
| 118 | وَرِزْقُهُ (K) / وَرِزْقَهُ (T) | وَرَزْقُهُ | Bajuri: «وقوله: (ورزقه) بفتح الراء: مصدر». Case kept as K (nominative). |
| 131 | تَزغْ | تَزِغْ | Jussive of زاغ يزيغ. |
| 133 | بَغِيْرِ (T) | بِغَيْرِ | Typo. |
| 138 | لِلنَّبِّي (T) | لِلنَّبِيِّ | Stray shadda. |

## Places to confirm (مواضع للتأكد)

- **Verse 2 «خَلَا / عَرِيَ»**: chosen خلا with K and Bajuri. Sawi (and the Jahani vocalized matn) read «وَقَدْ عَرِيَ الدِّينُ»; Sawi
  says the meter needs عَرِ (kasra, ya dropped). If the app should follow the Maliki/Sawi line, this one word changes.
- 93 «نَخُضْ» and 131 «وَلَا تَزِغْ» follow Bajuri; Sawi has «تَخُضْ» and «فَلَا».
- 118 «وَرَزْقُهُ»: the fatha of the ra is Bajuri's explicit ruling; the damma at the end is K's (T has fatha). Not decisive.
- A few words keep the partial vocalization of K where T was also bare or untrustworthy (e.g. 25 «بِالنَّفسِ»، 44 «حقِّهِ»،
  135 «فاعْتَمدِ»، 4 «لِرُسْلِ»). They are not wrong, only incomplete.
- Metrical licences kept as in the sources (hamza dropped: 26 «اوْ»، 39 «اسْمَاهُ»، 44 «اعْدَامًا»، 103 «وَاسْعِفِ»؛ sukun:
  31 «سَمِعْ» (Bajuri: «بحذف الياء مع سكون العين للضرورة»)، 123 «حَادِثْ»، 126 «يُجَدِّدْ»؛ 102 «صَغَائِرٌ» with tanwin).
