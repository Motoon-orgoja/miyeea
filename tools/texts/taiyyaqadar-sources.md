# Texts report: تائية شيخ الإسلام ابن تيمية في القدر، مع أبيات سؤال الذمي (ت ٧٢٨هـ) — `taiyyaqadar.txt`

Scripts: `batch5-build/` (`parse.js` + `parse-taiyyaqadar.js`, `collate.js` → `out/taiyyaqadar.collation.txt` and `out/taiyyaqadar.diffs.txt`, `build.js` + `cfg/taiyyaqadar.js` + `voc/taiyyaqadar.txt` → `taiyyaqadar.txt`, log `out/taiyyaqadar.build-log.txt`). Raw downloads: `raw/taiyyaqadar/`.

## 1. Sources
- **Base (H):** «شرح التائية في القدر», محمد بن إبراهيم الحمد, Shamela (الشاملة الذهبية), ketabonline 7162: https://ketabonline.com/ar/books/7162 — the editor's critical text (on six copies: أ، ب، ج، هـ، و، ط + العقود الدرية), printed in full and again verse by verse in the sharh; question 1–8, answer 1–125; **13.7% of letters marked**.
- **Check 1 (A):** the same edition as the separate Shamela book «القصيدة التائية في القدر» (ketabonline 211): https://ketabonline.com/ar/books/211 — with the apparatus of variants; 8 + 124 (the file lacks the last verse); 15.9% marked.
- **Check 2 (R), independent:** «الدرة البهية شرح القصيدة التائية» للسعدي، تحقيق أشرف عبد المقصود (ketabonline 5752): https://ketabonline.com/ar/books/5752 — unvocalized.
- **Check 3 (W), independent:** مجموع الفتاوى ٨/٢٤٥ on Wikisource: https://ar.wikisource.org/wiki/مجموع_الفتاوى/المجلد_الثامن/سئل_عن_القصيدة_التائية_في_القدر — unvocalized.

**No fully vocalized digital text was found.** The vocalization is **completed by AI** (`voc/taiyyaqadar.txt`): typed in full on H's wording, keeping the marks H / A print (three exceptions in §4); the script proves the letters equal the base in 262 of 266 hemistichs, the other 4 being the items of §3, and every hemistich scans.

## 2. Count
**133 verses** in two sections: «سؤال الذمي» (8) and «جواب شيخ الإسلام ابن تيمية» (125). 125 is the editor's count and the number usually given: مجموع الفتاوى has 124 + the closing ṣalāh verse, الدرة البهية has one more verse (111) and not the ṣalāh verse; the edition has both. R's copy on Shamela lacks two of the question verses and inverts three pairs (88–89, 95–96 and the last two); these are noted, not followed.

## 3. Wording (base H)
| v. | Adopted | H | Why |
|---|---|---|---|
| 20a | وَلَسْنَا **إِذَا** قُلْنَا | وإن قلنا | A (the same edition) + R + W |
Spelling only: 5a «يَا قَوْمُ» (H «ياقومُ»), 15a «فَإِنَّهُمُ» and 50a «بِخَوْضِهِمُ» (H writes the long pronoun with a waw: فإنهموا، بخوضهموا).
Variants of R / W not adopted (the editor's choice is kept; all are in `out/taiyyaqadar.diffs.txt` and in the edition's notes): 4b فَمَا أَنَا رَاضٍ (R فهل), 8b غُلَّتِي (W علّتي), 27a مِنْ نِعَمٍ سَرَتْ (R + W رحمته سرت), 34a تَبْيِينَ عِلْمٍ مُحَقَّقٍ (R + W إلى بيانٍ محقّقٍ), 37b الْمَرِيضَةِ (R + W السقيمة), 43b عَنْ حُكْمِ (R + W عن الحكم), 46a عِلَّةِ السِّرِّ (R الشرّ), 47b بِعِلَّةِ (R + W لعلّة), 48a فِي الْكَوْنِ (R + W للكون), 55b مَحَجَّةِ (R + W محبّة), 59b مِنْ كُلِّ وِجْهَةِ (R + W في), 65b بِغَضْبَةِ (R بغصّة), 72b فَمَا أَنْتَ (R + W كما), 82b الْبَرِيَّةِ (R المشيئة), 90a نِقْمَةً (R نعمة), 99b بِتَبْشِيرِ … بِالْحَنَفِيَّةِ (W تبشّر; R + W بالحنيفية, which does not scan), 104b الرُّبُوبَةِ (R + W الربوبية, does not scan), 105b يَجْرِي (R يجزى), 109–111 (W runs 109 and 111 into one verse), 114b كَسْبٌ (R + W ليست), 117b عِبَادِي (R + W العباد), 124 لَمْ يُبَلْ … بِتَيْسِيرِ (W لم ينل … بتقدير), 126a عَدِيمٍ إِرَادَةً (W عديم الإرادة), 127b وَالضَّلَالَةِ (R + W بالضلالة), 129a لَا أَخْتَارُ (R + W أن لا أختار, does not scan), 131a قَدْ أُجِبْتَ مِنْ (R به).

## 4. Harakat
- 86% of the letters had no mark in H; all completed (AI) on grammar and meter.
- Marks changed against H / A: 1b تَحَيَّرَ (H «تحيرَّ», the shadda misplaced), 53a وَالَاكَ (H «والْاك»), 94a **فَاقْصِدْهُ** (H + A «فاقْصُدْهُ»; قَصَدَ يَقْصِدُ).
- **Meter:** all 266 hemistichs scan as ṭawīl (ʿarūḍ and ḍarb مفاعلن). Licenses the text requires: the pronouns هُمُ / كُمُ long where the foot needs it (15a, 46a, 50a, 54a, 72a); «أَنَا» short (4b, 7b); 67b «أَصْحَابِ الْأَيْكَةِ» scans only as «لَيْكَةِ» (the hamza dropped, as in the reading ﴿أَصْحَابُ لَيْكَةَ﴾; H prints «الآيكة»); 67a «نُمْرُوذٍ» with tanwin; 94b «يَهْدِيكَ» with a quiescent ya (H «يهديْك»); 119 runs over the hemistich («مِنَ الْـ | ـفُرُوقِ»).

## 5. To verify / decide
- **The whole vocalization**, since no vocalized source exists online (the printed edition, دار ابن خزيمة, should settle it).
- 129b «وَلَوْ نِلْتَ هَذَا التَّرْكَ فُزْتَ» is marked as an address to the questioner; «نِلْتُ … فُزْتُ» (the questioner speaking) is the other possible reading.
- 46a «عِلَّةِ السِّرِّ» (H + A + W) against R «الشرّ», which suits the sense (the dualists' question about evil).
- 6a «رِضَا مَا لَيْسَ يَرْضَاهُ» is read as an iḍāfa (no tanwin); 110a «لَا رِضًا» with tanwin as H prints it.
- Section titles are descriptive («سؤال الذمي» / «جواب شيخ الإسلام ابن تيمية»); the edition's own headings are «نص السؤال الذي أُورد على شيخ الإسلام ابن تيمية» and «أجاب رحمه الله».
