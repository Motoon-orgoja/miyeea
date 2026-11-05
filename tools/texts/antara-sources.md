# Texts report: معلقة عنترة بن شداد — `antara.txt` (الكامل)

How it was done (scripts in `muallaqat-build/`, raw pages in `raw/muallaqat/`):
- `parse.js` parses the three witnesses into verses. `collate.js` matches each witness verse to the base verse by word overlap (independent of order) and diffs the matched verses word by word (LCS) after stripping harakat and tatweel and unifying alef, yaa and taa marbuta. The output is `out/antara.review.txt`.
- `build.js` keeps الزوزني's wording and harakat. It adds a mark to a letter only where a witness has the same word: from T and A if they agree, or from the one that has it. A witness may add a mark to a bare letter or a shadda to a marked one, but it never replaces a vowel. Every fill is logged in `out/antara.log.txt`. `fixes.js` holds the manual corrections, each with its reason.
- `meter.js` scans every verse (الكامل) using the scanner of `qahtaniyya-build/meter.js`. `harakat.js` lists base vowels that differ from the witnesses (`out/antara.harakat.txt`), and `variants.js` lists the wording differences (`out/antara.variants.tsv`).

## 1. Sources
- **Base (Z) — the riwaya, count and order:** الزوزني, «شرح المعلقات السبع», Dar Ihya' al-Turath al-'Arabi, 1st ed. 1423/2002. Shamela 11253: https://shamela.ws/book/11253/268. Its vocalization is partial and uneven, with many typing errors.
- **Check 1 (T), vocalized:** التبريزي, «شرح القصائد العشر». Shamela 37488: https://shamela.ws/book/37488/176
- **Check 2 (A), vocalized:** ابن الأنباري, «شرح القصائد السبع الطوال الجاهليات». Shamela 124335: https://shamela.ws/book/124335/287
- No fully vocalized digital copy of الزوزني's text was found. The base vocalization was completed from T and A.

## 2. Count and order
- **75 verses**, in الزوزني's order (numbered 1–75 in the base; verse 20 is misprinted «٣٠»).
- T has 79 and A has 79. Every base verse is in A. T has every base verse too: verse 40 «وإذا صحوت» is printed in T without the « ... » separator, so the parser missed it.
- **In T/A only** (not added): «أبقى لها طولُ السِّفار مُقَرمَدًا» (after 30), «برحيبة الفرغين يهدي جرسها» (after 47). T only: «لمّا سمعتُ نداءَ مرّة قد علا», «ومُحلّمٍ يسعون تحت لوائهم», «أيقنت أن سيكون عند لقائهم» (after 63). A only: «إني عداني أن أزورك فاعلمي», «حالت رماح ابنَي بغيضٍ دونكم» (at the end).
- Order: the same as T/A, except 54/55 and 70/71, which are swapped.

## 3. Wording
الزوزني's wording is kept everywhere, including where both T and A read otherwise (it is the riwaya requested). Only clear misprints were changed:
(none)

Wording differences between the final text and T/A (words normalized; «—» means the verse is missing in that witness; an empty cell means the witness agrees):

| v. | T | A |
|---|---|---|
| 2 | بالجواء→بالجوار |  |
| 4 | فالمتثلم→المتثلم |  |
| 16 |  | حره→ثره; قراره→حديقه |
| 19 |  | بذراعه→ |
| 23 | بوخذ→ | بوخذ→بذات |
| 24 | تطس→اقص | تطس→اقص |
| 26 | حدج→حرج | حدج→حرج |
| 31 | جنب→ماء | جنب→ماء |
| 35 | سمح→سهل | مخالقتي→مخالطتي |
| 36 | واذا→فاذا | واذا→فاذا |
| 37 |  | بعدما→بعد ما |
| 41 |  | غانيه→غلنيه |
| 42 | طعنه→ضربه |  |
| 43 | يابنه→يا ابنه | يابنه→يا ابنه |
| 46 | اغشي→اغي |  |
| 48 | →يداي; كفي→; مقوم→مقو | →يداي; كفي→ |
| 50 | يقضمن حسن بنانه→ما بين قله راسه | يقضمن حسن بنانه→ما بين قله راسه |
| 51 | ومشك→ومسك | ومشك→ومسك |
| 55 | علوته→علونه |  |
| 58 | لي→بي | فتجسسي→فتحسسي |
| 60 | التفتت→الفتت | وكانما→وكانها |
| 63 | الحرب→الموت | الحرب→الموت; تشتكي→يتقي |
| 67 | بثغره نحره→بغره وجهه | بثغره نحره→بغره وجهه |
| 68 |  | فازور→وازور |
| 69 |  | ولكان→او كان |
| 70 | واذهب→وابرا | واذهب→وابرا |
| 72 | لبي→قلبي |  |
| 73 | تدر→تكن | تدر→تكن |
| 74 |  | لم القهما→لقيتهما |

## 4. Vocalization
- **Coverage:** 99.4% (2466/2482 letters that need a mark). A letter is counted as needing a mark unless it is a long-vowel letter, the article lam before a sun letter, and the like. The remaining bare letters are listed at the end of `out/antara.log.txt`. Most are a missing kasra before a madd yaa, a sukun on a diphthong, or a case ending the witnesses also lack.
- **From the witnesses:** 223 marks (log: «fills»). T and A disagreed on 5 letters. Those were left bare or decided below.
- **Conventions (log):** fatha on a letter before a madd alif (4); sukun on the article lam before a moon letter (43); the vowel of و/ف/ك/ب before the article, kasra under إ, and the fixed particles لَا أَوْ قَدْ لَمْ إِلَى (4). Also: «لاَ» → «لَا», tanwin written before the alif («خَيْرًا»), and the mark typed on the alif moved to the hamza («الْمَاُء» → «الْمَاءُ»).
- **Meter:** after the corrections, all verses scan except 30 and 43. Both are explained under «مواضع للتأكد».

Manual corrections of harakat and misprints (T = التبريزي, A = ابن الأنباري, Zc = الزوزني's commentary; «meter» = the base reading does not scan):

| v. | base | corrected | reason |
|---|---|---|---|
| 4b | فَالصَّمَانِ | فَالصَّمَّانِ | T+A; meter |
| 6b | عَلَّيَّ طِلَابُكَ | عَلَيَّ طِلَابُكِ | typo; T (عَلَيَّ), T+A (طِلَابُكِ: Abla is addressed) |
| 8b | بِمَنْزِلَةَ الْمُحِبِّ | بِمَنْزِلَةِ الْمُحَبِّ | T+A (genitive after بِ; المُحَبّ passive) |
| 10b | رِكَابُكُمْ | رِكَابُكُمُ | T+A; meter |
| 11a | رَاعَنِيِ | رَاعَنِي | typo; T |
| 12a | حَلُوَبَةً | حَلُوبَةً | typo; A |
| 20a | حشِيَّةٍ | حَشِيَّةٍ | T (A حِشيّة); lexicon: الحَشِيَّة |
| 20b | مُلْجِمِ | مُلْجَمِ | T+A (passive: a bridled horse) |
| 23b | بوَخذِ خُفّ | بِوَخْذِ خُفٍّ | lang: preposition; meter: وَخْ = /o; خُفٍّ T |
| 24b | الْمَنْسَمَيْنِ | الْمَنْسِمَيْنِ | T+A (المَنْسِم) |
| 27b | الطَّويلِ | الطَّوِيلِ | lang + meter (فَعِيل) |
| 29a | دَفِّهَا ال | دَفِّهَا الْ | lang: article lam (the word الْوَحْشِيِّ is split between the hemistichs) |
| 29b | من | مِنْ | lang (مِنْ هَزِجِ) |
| 30b | وبالْفَمِ | وَبِالْفَمِ | lang: conjunction + preposition |
| 30b | بِالْيَدَيَنِ | بِالْيَدَيْنِ | typo (dual); T+A |
| 32a | وكأَنَّ | وَكَأَنَّ | lang: conjunction |
| 33b | مِثْلَ | مِثْلِ | T+A (adjective of زَيَّافَةٍ) |
| 38b | الشّمَالِ مَفَدَّمِ | الشِّمَالِ مُفَدَّمِ | A الشِّمال (the left hand; T الشَّمال); T+A مُفَدَّم (passive participle) |
| 39b | وَعْرِضِي | وَعِرْضِي | typo; T+A |
| 40b | وَتَكرُّمِي | وَتَكَرُّمِي | lang (تَفَعُّل) + meter |
| 45a | للِطِّعَانِ | لِلطِّعَانِ | typo; A |
| 56b | السَّبْتِ | السِّبْتِ | T+A (السِّبْت: tanned leather) |
| 58a | جَارِيَتِيِ | جَارِيَتِي | typo; T |
| 61b | والْكُفْرُ | وَالْكُفْرُ | lang: conjunction |
| 62b | عَنِ وَضَحِ | عَنْ وَضَحِ | T+A; meter |
| 65a | جَمْعَهُمْ | جَمْعُهُمْ | T (subject of أقبل) |
| 65b | مُذَّمَّمِ | مُذَمَّمِ | typo; T; meter |
| 72b | لُبْتِي | لُبِّي | typo; A (T قلبي) |
| 73a | بَأَنْ | بِأَنْ | typo; T (preposition) |
| 73a | تَدُر | تَدُرْ | lang: jussive after لم |

## 5. مواضع للتأكد
- 30 «هِرّ جَنِيب»: the base has no case ending. T has «هِرٌّ جَنِيبٌ» and A has «هِرٍّ جَنِيبٍ». I left it unvocalized (the scanner flags this verse only because of that).
- 4 «فَالْمُتَثَلَّمِ» (base) / A «المتثلِّم». 74 «أَشْتِمْهُمَا» (base) / T+A «أشتُمهما». Both forms are attested in the dictionaries.
- 74 «إِذَا **لَمَ الْقَهُمَا** دَمِي» was kept as printed. This is the naql spelling (the fatha of the hamza moved to the mim), which the meter needs. «لم أَلْقَهما» does not scan.
- 43 «يَابْنَةَ مَالِكٍ» is written joined, as in the base (= يا ابنةَ). The scanner flags it only because of the spelling.
- الزوزني's own readings are kept against T+A: 48 «جادت له كفّي», 50 «يقضمن حسن بنانه والمعصم», 63 «في حومة الحرب», 67 «بثُغرة نحره», 70 «وأذهب سقمها», 73 «ولم تدُرْ».

## 6. Obscene verses
None. The wine verses are 37–40.
