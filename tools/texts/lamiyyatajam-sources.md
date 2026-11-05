# Texts report: لامية العجم (al-Ṭughrāʾī, d. 513 AH) — `lamiyyatajam.txt`

Method and scripts: the same as `lamiyyatarab-sources.md` (`hikma-build/`: `parse.js`, `collate.js` → `out/lamiyyatajam.collation.txt`, `build.js` → `out/lamiyyatajam.build-log.txt`, `meter.js`). Raw downloads are in `raw/lamiyyatajam/`.

## 1. Sources
- **Base (D):** the matn printed at the head of «شرح لامية العجم» by al-Damīrī (an abridgement of al-Ṣafadī's «الغيث المسجم»), edited by Jamīl ʿUwayḍa (2008). Ketabonline 6545, pp. 5–7: https://ketabonline.com/ar/books/6545
- **Check 1 (Dc):** the verse lemmas inside al-Damīrī's commentary itself (same book, pp. 8 ff.). They differ from the matn printed at the head in about ten places. These lemmas are the text the commentary explains.
- **Check 2 (B):** «شرح البدراني على لامية العجم», ed. ʿUwayḍa. Ketabonline 57202. The verse lemmas cover all of the poem except v. 35.
- **Also read:** al-Sunaykī's commentary (ketabonline 57208, ed. ʿUwayḍa) gives word glosses only. It was used for v. 4 (see §5).
- Wikisource «لامية العجم» is a copy of D with vv. 20–21 run together (58 lines), so it was **not** used as an independent witness.

**No fully vocalized digital text was found.** D, Dc and B are lightly vocalized (about 40% of letters). The text is **43.4% vocalized** (D 41.7% + 34 marks from Dc and B). No harakat were added that are not in these sources, except the corrections in §4.

## 2. Count
- **59 verses**, the well-known count (D = 59; Dc complete except v. 6, which the commentary quotes in another form).

## 3. Wording (rule: the circulated wording. Where Dc and B agree against D's matn, their reading is taken. It is also the reading known from the commentaries)
| v. | Adopted | D reading |
|---|---|---|
| 17 | وقد **حَماهُ رُماةُ الحيِّ** من ثُعَلِ | وقد رَماهُ رُماةٌ من بني ثُعَلِ |
| 17 | **إني** أُريدُ | اني (spelling, = Dc) |
| 19 | في ذِمامِ الليلِ **مُعْتَسِفًا** | مُهتديًا |
| 25 | يُشفَى لديغُ **العوالِي** … من **غَدِيرِ** الخمرِ | الغوانِي … لذيذِ |
| 28 | باللمحِ من **خلَلِ الأَستارِ والكِلَلِ** | من صفحاتِ البِيضِ في الكِلَلِ |
| 32 | **للمقدمين** | للمقديمن (typo) |
| 33 | رضَى الذليلِ بخفضِ العيشِ **مَسْكَنَةٌ** | يخفضُه |
| 55 | فيمَ **اقْتِحامُكَ** لُجَّ البحرِ | اعتراضُكَ |

Kept as in D where only one witness differs: 4 الخَللِ (B الحُلَل), 7 يلقَى (B ألقى), 10 لمثلهِ (Dc بمثله), 11 بقسوةِ (B بشدة), 15 عيني (Dc عنّي), 18 بهمْ (Dc به; B هُمُو), 19 بنفحةِ (Dc فنفحةُ), 24 بها (B بهم), 26 فيها … عللِ (Dc منها … عللي; B العِلَلِ), 28 صِفاح (Dc الصِّفاح), 44 إذ (B لو), 49 وإنّما (B فإنّما), 54 عُمرَكَ (B صفوكَ).

## 4. Harakat corrected (each one breaks the meter or the grammar; all logged)
- 3 «الإقامُة» → **الإقامةُ** (typo).
- 8 «كَفٍ» → **كَفٍّ**. The meter needs the shadda.
- 11 «الفُكاهِةِ» → **الفُكاهَةِ** (typo).
- 16 «تُعِيُن» → **تُعِينُ** (typo).
- 17 «رُماةٌ الحيِّ» → **رُماةُ الحيِّ**. It is the first term of an idafa; Dc and B both print the tanwin.
- 35 «حدَّثتِني» → **حدَّثتْني**. With the kasra the hemistich does not scan.
- 53 «فسبَقُ» → **فسَبْقُ**. The masdar «سبق السيفُ العذلَ»; «سَبَقُ» does not scan.
- **Meter:** all 118 hemistichs scan as basīṭ (ḍarb فَعِلُن). Because the text is only partly vocalized, the check is mostly a syllable count.

## 5. To verify
- 4 «كالسيفِ عُرِّيَ متناهُ من **الخَلَلِ**»: al-Sunaykī glosses «الخِلَل» as «بمعجمة، جمع خِلّة» (the scabbard linings), which points to **الخِلَل**. D's fatha was kept because no source prints the kasra.
- 10 لمثلهِ/بمثلهِ, 18 بهمْ/به, 19 بنفحةِ/فنفحةُ, 54 عُمرَكَ/صفوكَ: the commentary readings (Dc or B) are the well-known ones. D was kept because the two witnesses do not agree. Tell me if the site should follow Dc throughout.
- A fully vocalized print, such as the ʿUkbarī or Ṣafadī editions as PDF, would be needed to vocalize this text fully.
