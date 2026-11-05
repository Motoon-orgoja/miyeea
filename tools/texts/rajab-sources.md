# Texts report — زوائد ابن رجب على الأربعين النووية (`rajab.json`)

Method: each witness was cut into the eight hadiths (heading «الحديث الثالث والأربعون» … «الخمسون» up to the start of Ibn Rajab's commentary), stripped of harakat and tatweel, alef/yaa/taa-marbuta unified, and aligned word by word against the base with an LCS script. Every change to the base is a line in `build.js` and is logged with its reason in `rajab-build/out/edits.log`.
Scripts: `tools/texts/rajab-build/` (`collate.js` → `out/witnesses.json`, `out/collation.txt`; `build.js` writes `rajab.json`). Raw downloads: `tools/texts/raw/rajab/`.

## Sources
- **Base (vocalized): ketabonline 97115** «الأربعون النووية (مع زيادات ابن رجب رحمهما الله)», تحقيق الشربيني بن فايق الشربيني، راجعها مصطفى العدوي (source given as المكتبة الشاملة), pages 60–67: https://ketabonline.com/ar/books/97115 . Fully vocalized. A few misprints (see below), and in 43, 45, 48 it gives the Bukhari/Muslim wording rather than the wording Ibn Rajab quotes.
- **Check 1: جامع العلوم والحكم, ط. دار السلام, ضبط ماهر الفحل** (OpenITI `0795IbnRajabHanbali.JamicCulumWaHikam.Shamela0010443`), unvocalized.
- **Check 2: جامع العلوم والحكم, ط. الرسالة, تحقيق شعيب الأرناؤوط وإبراهيم باجس** (OpenITI `…Shamela0004268`), unvocalized.
- **Check 3: جامع العلوم والحكم, ط. دار المعرفة** (OpenITI `…ShamAY0033527`; `JK000071` is the same text). Old print with typos («ابن آدم … لقيمات»، «عبد الله بن عمر»، «بشر»), used only as a tie-breaker.
- **Check 4: فتح القوي المتين في شرح الأربعين وتتمة الخمسين**, عبد المحسن العباد (ketabonline 836, pp. 140–179), partly vocalized — the most used student commentary on the 50.
- **Vocalization of changed words:** sunnah.com (الترمذي 1297، ابن ماجه 2167، مسلم 1581 و58، البخاري 34 و2459 و4633) and tohed.com (سنن سعيد بن منصور 1465), saved in `raw/rajab/`.
- No fully vocalized edition of the 8 hadiths in exactly Ibn Rajab's wording was found online; the students' «الأربعون النووية وتتمتها» prints could not be reached, so «circulated wording» was taken as the wording of جامع العلوم والحكم, which the العباد commentary also follows.

## Count
- **8 hadiths, numbered 43–50** ✔ (Ibn Rajab: «فصارت خمسين حديثًا»). Same order in all witnesses.

## Wording differences (base changed to the Jami' wording)
| # | Base (الشربيني) | Adopted | Witnesses |
|---|---|---|---|
| 43 | فَمَا بَقِيَ | فَمَا أَبْقَتِ الْفَرَائِضُ | all 3 Jami' eds + العباد. Harakat: سعيد بن منصور 1465 |
| 45 | فقَالَ: لَا | قَالَ: «لَا…» | all Jami' + العباد (= الترمذي 1297) |
| 45 | إِنَّ اللَّهَ لمَّا حَرَّمَ شُّحُومَهَا، جْمَلُوهُ | إِنَّ اللَّهَ حَرَّمَ عَلَيْهِمُ الشُّحُومَ، فَأَجْمَلُوهُ | all Jami' + العباد; harakat copied from الترمذي 1297 (same wording) |
| 46 | فَقِيلَ لِأَبِي بُرْدَةَ: مَا الْبِتْعُ | … وَمَا الْبِتْعُ | الفحل، الأرناؤوط، العباد (base = ط. المعرفة «ما») |
| 48 | وَمَنْ كَانَتْ خَصْلَةٌ مِنْهُنَّ كَانَتْ فِيهِ | وَمَنْ كَانَتْ خَصْلَةٌ مِنْهُنَّ **فِيهِ** كَانَتْ فِيهِ | «فيه» is in every Jami' witness; placed after منهن as الأرناؤوط (الفحل/العباد: «وإنْ كانت…فيه»; ط. المعرفة: «ومن كانت فيه خصلة») |
| 43–46, 48, 50 (takh) | رَوَاهُ / أخَرَّجَهُ | خَرَّجَهُ | Ibn Rajab's own formula in all Jami' eds; shadda as العباد «خرَّجه». 47 and 49 keep «رَوَاهُ» (= Jami') |
| 50 (takh) | حديث صحيح: أخَرَّجَهُ الْإِمَامُ أَحْمَدُ … | خَرَّجَهُ الْإِمَامُ أَحْمَدُ بِهَذَا اللَّفْظِ | «حديث صحيح» is the editor's grading, not in Jami' |

Differences left as in the base (base agrees with at least one Jami' edition):
- 45 «سَمِعَ النَّبِيَّ» (الأرناؤوط، المعرفة) — الفحل and العباد «سمع رسولَ الله».
- 46 «عَنْ أَبِيهِ، عَنْ أَبِي مُوسَى» (الأرناؤوط، المعرفة) — الفحل and العباد «عن أبيه أبي موسى».
- 47 «مَعْدِي كَرِبَ» (الأرناؤوط، المعرفة) — الفحل and العباد «معد يكرب» (spelling).
- 48 «مَنْ إِذَا حَدَّثَ» (الفحل، الأرناؤوط) — العباد and المعرفة without «مَنْ».
- 50: the Jami' sentence that follows («وخرّجه الترمذي وابن ماجه وابن حبان … بمعناه، وقال الترمذي: حسن غريب») is outside the hadith in الفحل and الأرناؤوط, so it is not included (العباد prints it with the hadith).

## Vocalization corrected (logged by `build.js`)
- 43, 50: «أخَرَّجَهُ» (stray alif) → «خَرَّجَهُ».
- 45: «وَالْمَيْتَةَ» → «وَالْمَيْتَةِ» (معطوف على المجرور; sunnah.com, all); «قَاتِلَ اللَّهُ» → «قَاتَلَ اللَّهُ» (sunnah.com).
- 48: «أَرْبَعٌ مِنْ كُنْ فِيهِ» → «أَرْبَعٌ مَنْ كُنَّ فِيهِ» (البخاري 34، مسلم 58؛ العباد «مَن كنَّ»).
- The «- صلى الله عليه وسلم -» dashes, the footnote numbers and the stray quote/brackets («((…))», an opening « before the narrator's words in 50) were removed; quotation marks in 45 and 46 follow the الفحل edition.
- Result: every word is vocalized (349/349 words carry harakat).

## Format notes
- `rawi` = up to the first « (in 46 up to the Companion's name, since the Prophet's words come only at the end of the story; in 50 up to «قَالَ:»). `takh` = the takhrij sentence. The base's bracketed hadith titles are the editor's, so they were not included; the chapter title «زيادات ابن رجب الحنبلي» is the base's heading (unvocalized).

## مواضع للتأكد
- 48: the three Jami' editions differ on «وَمَنْ / وَإِنْ» and on where «فِيهِ» goes. I followed الأرناؤوط (closest to the base). If your printed «الأربعون وتتمتها» reads «وَإِنْ كَانَتْ خَصْلَةٌ مِنْهُنَّ فِيهِ», change one word.
- 45: «سَمِعَ النَّبِيَّ» vs «سَمِعَ رَسُولَ اللَّهِ» — editions split evenly; base kept.
