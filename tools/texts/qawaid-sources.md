# Texts report — منظومة القواعد الفقهية للسعدي (`qawaid.txt`)

Abd al-Rahman ibn Nasir al-Sa'di (d. 1376 AH), rajaz, on legal maxims.
How it was done: every source was parsed into verses by script (`scripts/qawaid/extract.js`), and compared word by word after removing harakat and tatweel and unifying alef/yaa/ta-marbuta forms (`scripts/compare.js`, LCS diff, not by eye). Harakat were merged and then checked letter by letter by script (`scripts/merge-harakat.js`).
Raw files as downloaded: `tools/texts/raw/qawaid/` (ketabonline API JSON). All script output: `raw/qawaid/_collation-log.txt`.

## Sources
| Siglum | Source | Role |
|---|---|---|
| **M** | ketabonline 24751 «منظومة القواعد الفقهية»: a student booklet issued by the Shaykh al-Sa'di website (binsaadi.com), Dar al-Maiman 1431. Its introduction says the text was «مقابلةً على النسخة الخطية» and is given whole at the start «لمن أراد الحفظ على متن صحيح»: https://ketabonline.com/ar/books/24751 (pages 5–9) | **Base for wording**, 49 numbered verses. Vocalized only in part («ضبط ما يشكل»). Its marks were never overridden. |
| **S** | ketabonline 102977 «شرح منظومة القواعد الفقهية» by al-Sa'di himself (الشاملة الذهبية). Its card says «الكتاب مقابل ومشكول ومراجع»: https://ketabonline.com/ar/books/102977 | **Vocalization source**. 47 verses. By script count it marks 79 % of the letters; nearly all of the gaps are the article lam and madd letters. M marks 30 %. |
| T | ketabonline 29467 «منظومة القواعد الفقهية كاملة – مع تعليقات الشيخ السعدي عليها» (same commentary, another copy, unvocalized): https://ketabonline.com/ar/books/29467 | Wording check. 47 verses. |

S and T are the author's own commentary, so they are independent of M's manuscript edition. Shamela (shamela.ws) has no copy of the poem itself; its search was down (HTTP 521) during this work. Ar.wikisource has no copy.

## Verse count
**49** ✔ (the commonly cited count). M has 49. S and T have 47 because both lack M 38–39:
- «وَيُفْعَلُ الْبَعْضُ مِنَ الْمَأْمُورِ | إِنْ شَقَّ فِعْلُ سَائِرِ الْمَأْمُورِ»
- «وَكُلُّ مَا نَشَا عَنِ الْمَأْذُونِ | فَذَاكَ أَمْرٌ لَيْسَ بِالْمَضْمُونِ»

The commentary under S/T «37» begins «أشياء توجب الضمان … ومفهوم هذا البيت أن ما نشأ عن غير المأذون فيه فإنه مضمون». That is the commentary on «وكل ما نشا عن المأذون». So the two lines were dropped from the commentary copies; they are not missing from the poem. They were taken from M.
**Headings:** S/T put «فصلٌ» before verse 11 → `## فَصْلٌ`. The first heading `## مُقَدِّمَةٌ` (verses 1–10) is editorial; the sources have none (S has «الرسالة الأولى»).

## Wording differences
| Verse | Chosen | Other reading | Reason |
|---|---|---|---|
| 8 | **فَتَرْتَقِي** (S, T) | لِتَرتقي (M) | Both commentary copies agree, and it is grammatically clean; لِتَرتقي needs a poetic sukun on the subjunctive. ⚠ |
| 9 | **وَهَذِهِ** قَوَاعِدٌ (M, T) | هذِهِ (S) | Meter: without و the first foot is a syllable short. |
| 11 | **وَالنِّيَّةُ** (M, T) | النِّيَّةُ (S) | M + T. |
| 26 | مَعَ **الْإِتْلَافِ** (M, T) | الائتلاف (S) | S is a typo; the commentary discusses إتلاف. |
| 26 | **التَّأْثِيمُ** (S, T) | التاثيم (M) | M dropped the hamza. |
| 34 | **كَذَاكَ** مَنْ وَمَا (M, T) | كَذلِكَ (S) | Meter: كذلك breaks the first foot. |
| 34 | يَا أُخَيَّ (M, S) | أخي (T, no يا) | Meter needs يا. |
| 38–39 | present (M) | absent (S, T) | See Verse count. |
| 40 | **لِشِرْعَتِهْ** (M; T لشرعته) | لِشَرْعيَّتِه (S) | Meter: لشرعيته breaks the last foot. |
| 44 | وَفِعْلُ **أَحْدِهِمَا** (M) | إِحْدَاهُمَا (S); «وصحّ فعلُ واحدٍ» (T) | العملان is masculine, so أحدهما is the grammatical form; M is the manuscript edition. ⚠ T's line is the only metrically perfect one. |
| 37 | مَا لَهُ (all write مَالَهُ) | — | Orthography only: written as two words so it is not read as «his wealth». |
| — | T only: 2 الواسع، 13 العلى، 15 «والشرع من أصوله التيسير»، 23 «وكل فعل طاعة محظور سوى الذي»، 30 الفعل | M + S agree against T | T seems to be a reworked recension. M + S were kept. |

## Harakat
- **680 marks were added by script** from S into M (`merge-harakat.js`), only where the M letter had no mark and the words had the same letters; M's own marks were never changed. Then the whole text was completed by hand, and the final file was checked again against M and S by the same script. Against M there are **no conflicts** (only completions such as a vowel added under M's bare shadda). Against S, every difference is one of the decisions listed below.
- **M's mark kept against S** (meter or grammar):
  - 3, 10, 49 مَعْ (S مَعَ): the meter needs the sukun.
  - 4 مَرَاتِبَ (S مَرَاتِبِ). ⚠ Both are possible after الحائزي.
  - 8 سُبْلَ (S سُبُلَ): the meter needs the sukun.
  - 10 وَالْعَفْوَ (S وَالعَفْوِ).
  - 13 تَزَاحَمْ (S تَزَاحَمَ): jussive after إنْ, and the meter needs it.
  - 19 وَالْأَرْضِ وَالثِّيَابِ (S nominative): genitive, coordinated with مياهِنا.
  - 21 يُمَلُّ
  - 23 غَيْرُ الَّذِي (S غَيْرَ): it is the ism of ليس.
  - 36 وَالْمَوَانِعْ (S وَالمَوَانِعُ): the meter needs the sukun.
  - 40 وَهْيَ (S وَهِيَ): the meter needs the sukun.
- **Corrected in S, where M had no mark:**
  - 1 الْمُفَرِّقِ (damma added on the mim).
  - 16 اضْطِرَارِ (S has a stray shadda in اضْطِّرَار).
  - 47 عَنِ الْعِصْيَانِ (S عَنْ): two sukuns cannot meet.
  - 42 مُحَرَّمَا and 46 وَاجِبَا: written without tanween at the rhyme, as M has it.
- **Completed by hand** (not marked in S or M):
  - the whole of verses 38–39
  - the sukun on the qamari article lam throughout
  - rhyme-final هْ in الْغَزِيرَهْ، الْكَثِيرَهْ، الضَّرُورَهْ، الطَّهَارَهْ، الْحِجَارَهْ
  - 2 الْبَاهِرَةِ
  - 45 الْمُسَبَّلُ (S has the shadda only).
- Result (script `scripts/vcount.js`): ≈ 99 % of letters carry a mark. The one place deliberately left unmarked is 3 الْخَاتمِ (see below).

## Places to confirm (مواضع للتأكد)
1. **3 الْخَاتمِ**: the ta is unmarked. Both خاتِم and خاتَم are possible, and no source marks it.
2. **8 فَتَرْتَقِي** (S, T) or **لِتَرْتَقِي** (M, the manuscript edition).
3. **44 وَفِعْلُ أَحْدِهِمَا**: this follows M. T's «وَصَحَّ فِعْلُ وَاحِدٍ» is the only metrically sound reading.
4. **4 مَرَاتِبَ** (M) or **مَرَاتِبِ** (S); and **10 وَالْعَفْوَ** (M) or **وَالْعَفْوِ** (S).
5. **11** «وَالنِّيَّةُ شَرْطٌ لِسَائِرِ الْعَمَلْ» does not scan cleanly with نِيَّة doubled. All sources agree on the words.
