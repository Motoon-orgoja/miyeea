# Texts report — بدء الأمالي (`amali.txt`)

«القصيدة اللامية في التوحيد» (يقول العبد في بدء الأمالي) by سراج الدين علي بن عثمان الأوشي الفرغاني الحنفي, الوافر, **67 verses**.
Verse numbers below are the numbering of the final file (1–67), which is also the numbering of the matn printed with
«نخبة اللآلي» (R). Comparison was done by script (`raw/amali/scripts/acoll.js`: each base verse is aligned with the most similar
verse of every other source, then compared on the normalized text — harakat/tatweel removed, alef/yaa/taa forms unified).
The full script output is `raw/amali/scripts/am_coll.txt`.

## Sources

**No fully vocalized digital copy was found.** The poem is not on shamela.ws online, not on Wikisource, and the printed
commentaries (ضوء المعالي لعلي القاري etc.) are only available as PDF scans.

| Code | Source | Use |
|---|---|---|
| **K** | ketabonline 102575 «منظومة بدء الأمالي (569)» (الشاملة الذهبية), 68 numbered verses: https://ketabonline.com/ar/books/102575 — raw `raw/amali/ketab-102575-p1.html` | **Base text.** Only ≈ 35 % of letters vocalized (mostly case endings). |
| **P** | بوابة الشعراء «يقول العبد في بدء الأمالي» (the الموسوعة الشعرية text): https://poetsgate.com/poem.php?pm=110629 — raw `raw/amali/poetsgate-110629.html` | Harakat filler (≈ 38 % vocalized) + wording check. 67 verses: lacks verse 6, has the شفاعة verse twice. |
| **R** | «نخبة اللآلي شرح بدأ الأمالي» لمحمد بن سليمان الحلبي الريحاوي (ت ١٢٢٨هـ), OpenITI `1228IbnSulaymanHalabiRihawi.NukhbatLaali.Shia004047-ara1` (repo OpenITI/1250AH), unvocalized — raw `raw/amali/openiti-NukhbatLaali-Rihawi.txt`. Its appendix «بدء الأمالي لسراج الدين علي بن عثمان الأوشي الفرغاني 569 ه» is a numbered matn of **67 verses**; the commentary lemmas («قال الناظم رحمه الله …») were checked too. | Wording check (the only commentary text available). |
| Q | kunfeyekun.org «Emali Beyitleri ve Tercümesi» (Turkish teaching site, Arabic text + Turkish translation, partly vocalized): https://www.kunfeyekun.org/kf/emali-beyitleri-ve-tercumesi.36722/ — raw `raw/amali/kunfeyekun.html`, `kunfeyekun-arabic-lines.txt` | Wording check (independent Ottoman/Turkish transmission). 67 verses. |

Seen but not usable: muallims.blogspot.com, islamilimleri.com, dinisualler.com (transliteration or the same Turkish text),
usul.ai PDFs (هداية الاعتقاد، شرح قصيدة بدء الأمالي — scans).

## Verse count

- K has 68, P 67 (+1 duplicate −1 missing), R 67, Q 67. A Saudi catalogue entry and R's appendix give **67**.
- The difference is the شفاعة verse «وَمَرْجُوٌّ شَفَاعَةُ أَهْلِ خَيْرٍ ✱ لِأَصْحَابِ الْكَبَائِرِ كَالْجِبَالِ»: K and P have it twice
  (after the معراج verse, K 28, and again after the صراط verse, K 58). R (matn and commentary) and Q have it **once, after the صراط
  verse**. I removed the first occurrence (K 28) and kept it at 57, so the file has 67 verses.
- The title page of K and R write «569»; that is the year the poem was composed. The death date is usually given as c. 575 (Turkish
  catalogues: ö. 1180). meta.json says «ت نحو ٥٧٥هـ».

## Method

1. K is the base for wording and keeps all its own harakat.
2. A letter without a mark in K takes P's mark when the skeleton is the same (`merge.js`): **237 words** completed, all listed in
   `raw/amali/merge-log.txt`. P has many careless marks, so the result was read through and 27 corrections applied
   (`raw/amali/scripts/am_fix.json`, also FIX lines in the log).
3. Final text: ≈ 50 % of letters vocalized; 62 of 586 words still have no mark at all. **This is not a fully vocalized text.**
4. Cleaning: verse numbers, the brackets around «(بَدْءِ الأَمَالِي)», hemistich dots/asterisks removed. No tatweel. UTF-8 without BOM.
   Headings: the poem has none; one «## المنظومة» line.

## Wording differences and the choice

| Verse | Chosen | Other readings | Why |
|---|---|---|---|
| 6 | (kept) صِفَاتُ الذَّاتِ وَالْأَفْعَالِ طُرًّا … | missing in P | K, R, Q have it. |
| 7 | وَ**ذَاتًا** | وذانا (K) | Typo in K; P, Q, R. |
| 7 | لَا كَالاشْيَا | كالأشياء (Q, R) | Spelling; «كالأشياءِ» breaks the wafir foot. |
| 14 | وَأَحْوَالٌ وَأَزْمَانٌ | وأزمانٌ وأحوالٌ (P, Q) | K + R (matn and commentary). Same meter. |
| 17 | يُمِيتُ الْخَلْقَ **قَهْرًا** | طُرًّا (K) | P, Q, R (matn and commentary). |
| 19 | وَلَا أَهْلُوهُمَا | وما (Q) | K, P, R. |
| 22 | ذُو افْتِرَاضٍ | ذا (P) | K, Q, R; «ما» does not work after «إنْ». |
| 23 | كِرَامٍ **بِالتَّوَالِي** | بالنوال (P, Q, R's commentary lemma) | K + R's matn; «النوال» is also the rhyme word of verse 32. **Needs a decision**, see below. |
| 24 | نَبِيٌّ هَاشِمِيٌّ **ذُو** جَمَالِ | ذي جمال (P, Q, R's commentary) | K + R's matn. **Needs a decision**, see below. |
| 31 | ثُمَّ **يُتْوِي** | ينوي (K) | Typo in K; P, Q, R («يتوى» = يُهلِك). |
| 44 | **بِعَهْرٍ** أَوْ بِقَتْلٍ | بقهرٍ (K) | P, Q, R; R: «العهر بفتح العين». Fits the meaning (a major sin does not make one a kafir). |
| 45 | وَمَنْ **يَنْوِ** ارْتِدَادًا | يَنْوِيْ (K) | P, Q, R; jussive after مَنْ الشرطية. |
| 51 | وَفِي الْأَجْدَاثِ … ✱ سَيُبْلَى … | hemistichs swapped (Q) | K, P, R. |
| 53 | يَا أَهْلَ **الْأَمَالِي** | الآمال (P, Q) | K + R (matn and commentary). |
| 55 | **وَيُعْطَى** الْكُتْبُ | وتُعطى (K) | P, Q, R. |
| 59 | فَاسْمَعْ **بِاجْتِذَالِ** | باختزال (K), باجتزال (Q) | P + R (matn and commentary). K's word is also the rhyme of verse 44. |
| 61 | بِسُوءِ الذَّنْبِ | بشؤم (P, R's commentary) | K, Q, R's matn. |
| 62 | أَلْبَسْتُ لِلتَّوْحِيدِ نَظْمًا | وَشْيًا (R's commentary, once) | K, P, Q, R's matn. |
| 67 | وَإِنِّيْ **الحَقَّ أَدْعُو كُلَّ وَقْتٍ** | «وإني الدهرَ أدعو كُنْهَ وُسْعِي» (P, Q, R's commentary) | K + R's matn. **Needs a decision**, see below. |
| rhymes 27, 35, 37, 39, 50 | عَوَالِ، عَالِ، لَا تُبَالِ، غَالِ، قَالِي | with/without the final ي | Spelling only, pronounced the same; K kept. |

## Harakat corrected

| Verse | Was | Written | Reason |
|---|---|---|---|
| 3, 4, 11, 24, 40 | الُمُدَبِّرُ، بِالُمُحَالِ، الَمقالِ، الُمُعَلَّى، الُمُقَلِّدِ (P) | المُدَبِّرُ، بِالمُحَالِ، المَقالِ، المُعَلَّى، المُقَلِّدِ | Mark misplaced on the lam of «ال» in P. |
| 8, 21, 42 | الإسمُ، الإعتزال، الإمتثال (K, P) | الاسْمُ، الاعْتِزَالِ، الامْتِثَالِ | Hamzat al-wasl written as hamzat qat'. |
| 17 | فيَجزيهمْ (K) / فَيجزِيَهُم (P) | فَيَجْزِيهِمْ | Indicative, ي is a madd letter. |
| 28, 29 | الأنِبياءَ، نَبِيًَّا | الأَنْبِيَاءَ، نَبِيًّا | Typos. |
| 31 | وعَيسى (P) | وَعِيسَى | Typo. |
| 35 | وللِفاروُقِ (P) | وَلِلْفَارُوقِ | Typo. |
| 40 | اعِتَبارٍ (P) | اعْتِبَارٍ | Typo. |
| 47 | ويَلغوُ (P) | وَيَلْغُو | Typo. |
| 51 | بالسَّؤالِ (P) | بِالسُّؤَالِ | Typo. |
| 53 | الجنِّاتِ (P) | الجَنَّاتِ | Typo. |
| 54 | حَقٌُّ (P) | حَقٌّ | Typo. |
| 58 | وَلِلِدَّعَوَاتِ (merge of K+P) | وَلِلدَّعَوَاتِ | Typo. |
| 63 | وَيُحْيِيٍ (K) | وَيُحْيِي | Stray tanwin. |

## Needs a decision / places to confirm

- **Vocalization:** only about half the letters are vocalized. To make it a proper memorization text it should be completed
  from a printed vocalized edition (e.g. «ضوء المعالي لبدء الأمالي» لعلي القاري، تحقيق عبد الحميد التركماني، دار الرياحين/دار البشائر,
  or a Turkish «Emâlî» print with harakat). I did not complete it from my own knowledge.
- **Verses 23, 24, 67:** two branches of the text. K and R's appended matn read «بالتوالي / ذو جمال / وإني الحقَّ أدعو كلَّ وقت»;
  P, Q and R's commentary lemmas read «بالنوال / ذي جمال / وإني الدهرَ أدعو كُنْهَ وُسْعي». I kept K. Worth checking against
  ضوء المعالي.
- **Verse 49 «وَغَيْرَانُ المُكَوِّنِ لا كشيءٍ ✱ مَعَ التكوينِ خُذْهُ لاكتِحَالِ»:** the words agree in K, Q, R (P: «وغير ان المكوَّنُ»), but
  K's vocalization «وَغَيْرَانُ المُكَوِّنِ» is doubtful (the Maturidi point is that التكوين is other than المكوَّن). Left as in K.
- Verse 10 «يا ابْنَ خَالي», 22 «فِعْلُ أَصْلَحْ», 30 «وشخصٌ ذُو افتِعالِ» are as in all sources; kept without change.
- The removed duplicate (old K 28) — confirm the position of the شفاعة verse (here 57, as in R and Q).
