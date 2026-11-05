# Texts report: لامية العرب (al-Shanfara) — `lamiyyatarab.txt`

How the collation was done (scripts in `hikma-build/`, shared by the four poems of this batch):
- `parse.js` parses every witness into verses → `out/lamiyyatarab.json`. Raw downloads are in `raw/lamiyyatarab/`.
- `collate.js` aligns base and witnesses word by word with an LCS over the whole poem, after stripping harakat, tatweel and punctuation and unifying alef/yaa/taa marbuta → `out/lamiyyatarab.collation.txt` (wording differences and harakat conflicts per verse). Base verses printed without the «...» marker are split at the witness's hemistich boundary.
- `build.js` applies the decisions below, fills harakat and runs the meter check → `out/lamiyyatarab.build-log.txt` (every change and every filled word).
- `meter.js` is a ṭawīl/basīṭ scanner that works on partly vocalized text: a bare letter may take any reading, so bare hemistichs are checked for their syllable count and for the fixed parts their marks impose. Tested on `hairiyya.txt` (ṭawīl) and `lamiyya.txt` (basīṭ), it leaves 2 of 33 and 9 of 114 verses unparsed, all naql, split words or source issues.

## 1. Sources
- **Base (Z):** «أعجب العجب في شرح لامية العرب», attributed to al-Zamakhshari. Ketabonline 102125 (the Golden Shamela text, «مقابل ومشكول ومراجع»): https://ketabonline.com/ar/books/102125. The full poem is printed, numbered 1–68, at the end of the book (`raw/lamiyyatarab/ko102125.json`). Its commentary lemmas were used to settle typos in that list.
- **Check 1 (Y), vocalized:** Wikisource «لامية العرب», which names its source as the diwan edited by Émile Badīʿ Yaʿqūb (Dār al-Kitāb al-ʿArabī, 1996): https://ar.wikisource.org/wiki/لامية_العرب. This is an independent riwāya with 69 verses.
- **Check 2 (K), lightly vocalized:** al-ʿUkbarī, «إعراب لامية الشنفرى». Ketabonline 5490 (68 verses).
- **Not used:** Ibn Zākūr's «تفريج الكرب» (Shamela 5410) is unvocalized. «نهاية الأرب» (ketabonline 27250) prints the verses split into lemmas.

**No fully vocalized digital text exists.** Z is vocalized wherever it matters (69.6% of letters by script). After filling from Y and K, the text is **94.2%** vocalized (`voc.js` counts letters that can carry a mark, leaving out madd letters and the article lam).

## 2. Count
- **68 verses**, the well-known count. Z and K have 68 in the same order.
- Y has 69. It adds, after v. 13, «وأغدو خميصَ البطن لا يستفزّني إلى الزاد حرصٌ أو فؤادٌ موكَّلُ». This verse is in neither Z nor K and was **not** included.

## 3. Wording (rule: the circulated wording; ties go to the majority of Z, Y and K, and the meter overrides)
| v. | Adopted | Z reading | Why |
|---|---|---|---|
| 4 | لَعَمْرُكَ ما **بِالأَرْضِ** ضِيقٌ | ما في الأرضِ | Y + K, and it is the circulated reading |
| 15 | ولا **جُبَّأٍ** أَكْهَى | جُبَّاءٍ | Y. Z's long alef breaks the meter |
| 18 | ألَفَّ إذا **مَا** رُعْتَه | without ما | Y + K. Without ما the hemistich does not scan |
| 29 | **مُهَلَّلَةٌ** شِيبُ الوجوه | مُهَلْهَلَةٌ | Y + K (circulated; both scan the same) |
| 50 | والحَزْمَ **أفْعَلُ** | أنْعَلُ | Y + K (circulated) |
| 60 | **ما كَها** الإنسُ تفعلُ | مَاكَهَا | Y. Spacing only (= ما هكذا) |

Kept as in Z against one witness: يَزِينُها (12; Y تزينها), بكفَّيْ (29; Y بأيدي), فعَبَّتْ (41; Y فغبّ), إِلْدَةً (56; Y وِلْدَة), تَكُ (59; Y يَكُ), لُوَابُهُ (61; Y لُعابه), هَبَّتْ (63; Y طارت), وأَلْحَقْتُ (66; Y + K فألحقت. This differs only in the conjunction, and Z's commentary has the same reading).

## 4. Harakat
- **Filled** from Y (281 words) and K (98 words). A mark was added only where Z's letter is bare, the witness has the same letters, and the witness does not contradict any mark Z already has. Marks on madd letters were not copied. The full list is in the build log.
- **Corrected** (all logged):
  - 2 «لِطِيَّاتُ» → **لِطِيَّاتٍ**. It is genitive after لـ, and the meter needs the tanwin (= Y).
  - 12 «الْمَتونِ» → **الْمُتونِ**. This is the plural of مَتْن (Z's gloss: «من الملس متونُها»; = Y, K).
  - 34 «ولَلصبْرُ» → **ولَلصَّبْرُ**. Shadda on the sun letter. Y's sukun on the lam was not copied.
  - 45 «لأَيِّهِا» → **لأَيِّهَا**. This is what Z's commentary prints.
  - 68 «الكِيحُ» → **الكِيحَ**. It is the object of ينتحي (Z's commentary lemma and Y).
- **Meter:** all 136 hemistichs scan as ṭawīl.

## 5. To verify
- 48 «مِنْ **تُحَيْتٍ** ومِنْ عَلُ»: Z (list and commentary) has tanwin. Y has «تُحَيْتُ», built on ḍamm like «من تحتُ». Z's reading was kept.
- 53 «أَنْمُلُ», 22 «يَرَى», 13 «تَرِنُّ», 21 «فأَذْهَلُ»: Y vocalizes these differently (أُنْمِلُ، يُرَى، تُرِنُّ، فأُذْهَلُ). Z's readings were kept; all of them are possible.
- The attribution of the poem to al-Shanfara is old and disputed: Ibn Durayd ascribed it to Khalaf al-Aḥmar, as Wikisource's «المزهر» and «مجلة الرسالة» quote.
