# Texts report — الدرة المضية في عقد الفرقة المرضية / المنظومة السفارينية (`safariniyya.txt`)

Poem by شمس الدين أبو العون محمد بن أحمد بن سالم السفاريني الحنبلي (ت ١١٨٨هـ), رجز, **210 verses**.
Verse numbers below are the numbering of the stand-alone edition (ED) and of Ibn Uthaymeen's list (UTH), 1–210 (they agree).
How the comparison was done: every verse was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, detached
proclitics («ب قدرة», «فب القضاء», «ف الرسل» in ED) were glued, and the sources were compared word by word by script
(`safariniyya-build/match.js`, `compare.js` → `safariniyya-build/collation.txt`), not by eye.

## Sources

No fully vocalized stand-alone copy of the matn exists online that I could find: Shamela 6382 (the stand-alone matn) is only
partly vocalized (the usual Shamela automatic marks: about one word in three), Ibn Uthaymeen's and al-Khudayr's commentaries on
Shamela, Arabic Wikisource, islamicbook.ws and OpenITI give it without harakat. takw.in and mimham.net have no text of it.
The **fully vocalized** text is the one quoted verse by verse inside the author's own commentary «لوامع الأنوار البهية» on Shamela.

| Code | Source | Use |
|---|---|---|
| **LAW** | Shamela 8353 «لوامع الأنوار البهية وسواطع الأسرار الأثرية لشرح الدرة المضية» (the author's own sharh, مؤسسة الخافقين، دمشق، ط٢ ١٤٠٢هـ), pages 1–921, fully vocalized: https://shamela.ws/book/8353 — raw `raw/safariniyya/8353_*.html` | **Base text** (wording + harakat). Each verse is quoted as «((صدر ... عجز))» before its commentary; the commentary then repeats the words one by one in ((…)), which was used as the author's own tie-breaker. |
| **ED** | Shamela 6382 «العقيدة السفارينية (الدرة المضية في عقد أهل الفرقة المرضية)», تحقيق أبي محمد أشرف بن عبد المقصود، مكتبة أضواء السلف، الرياض ١٩٩٨, pages 1–54: https://shamela.ws/book/6382 — raw `raw/safariniyya/6382_*.html` | Second, independent text (the stand-alone printed matn). **Verse order, count (210) and section headings** are taken from it. |
| **UTH** | Shamela 9725 «شرح العقيدة السفارينية» لابن عثيمين (دار الوطن), the full numbered matn printed at its start (pages 3–12): https://shamela.ws/book/9725 — raw `raw/safariniyya/9725_*.html` | Third text, for the disputed places. It has many plain typos (زيف، اقتدروا، بالتتريه، بأه، رقما، يزداد…), so it never decides alone. |
| — | OpenITI `1188ShamsDinSaffarini.DurraMudiyya.JK001229` (raw `raw/safariniyya/openiti_JK001229.txt`) and Arabic Wikisource «الدرة المضية في عقد الفرقة المرضية» (`raw/safariniyya/wikisource.wiki`) | Checked: both are copies of ED (same headings, same numbering slips), so not counted as independent. |
| — | Shamela 27254 (شرح الخضير) pages 2–10 | Seen only (unvocalized). It notes that al-Shatti's printing has «مقدر الآجال» in v.1. |

**Verse count:** 210 ✔. ED numbers 1–210 (with a few misprinted numbers such as «١٦» for 18, «٥٧» for 52 — the order is
right), UTH numbers 1–210, and LAW quotes all 210 in the same order. The usual description («نحو ٢١٠ أبيات») agrees.

**Headings (30):** the 29 headings of ED (مقدمة، الأبواب الستة، فصولها، الخاتمة), vocalized from LAW by script (`headings.js`,
longest runs of the same words found vocalized in LAW). Plus one opening line «## الدُّرَّةُ الْمُضِيَّةُ» before v.1, because the
first 18 verses (the خطبة) have no heading in any source and the file format needs one. Two ED heading lines were dropped:
- «فصل في الكلام على الرزق» printed **twice** in ED (before v.58 and before v.70). The first one is misplaced (v.58–69 are about
  created acts, not rizq; LAW has the فصل only before v.70), so only the one before v.70 is kept.
- «في الأمر بالمعروف والنهي عن المنكر» printed as a sub-line under «الباب السادس…»: it repeats the «فصل في الأمر بالمعروف…» that
  stands before v.179, so it was dropped.
Heading harakat fixed by hand after the script (plain grammar, no wording change): v.19 «مُقَدِّمَةٌ … مَذْهَبِ الْخَلَفِ»
(script gave مَقْدَمِهِ / مَذْهَبَ), v.43 «أَئِمَّةُ السَّلَفِ» (فاعل), v.105 «الرُّوحِ», v.115 «فَصْلٌ», v.184 «فِي ذِكْرِ الْأَدِلَّةِ».

## Wording differences and choices

LAW = base; «comm.» = the author's own word-by-word commentary in LAW.

| Verse | Chosen | Other reading | Why |
|---|---|---|---|
| 1 | مُسَبِّبِ الْأَسْبَابِ وَالْأَرْزَاقِ | مقدر الآجال والأرزاق (UTH; al-Shatti per al-Khudayr) | LAW + ED. |
| 8 | فَيَعْلَمُ | ويعلم (ED) | LAW + UTH. |
| 9 | وَصَارَ | صار (ED) | LAW + UTH; ED drops the و and breaks the meter. |
| 11 | فَمِنْ هُنَا | ومن (ED) | LAW + UTH. |
| 15 | فَرْدِ الْعُلَا | العلي (ED) | LAW + UTH. |
| 32 | بِالتَّسْدِيدِ | بالتشديد (ED) | LAW + UTH. |
| 37 | فَعِ | فعي (ED) | LAW + UTH. |
| 46 | فَثَابِتٌ مِنْ غَيْرِ **مَا** تَمْثِيلِ | (LAW's first quote, p213, drops «ما») | ED + UTH + LAW's own second quote (p903); without «ما» the meter breaks. Vocalization from p903. |
| 48 | وَصِفَةُ النُّزُولِ | وصفته (UTH) | LAW + ED. (ED prints the verse without a hemistich mark; the split is LAW's.) |
| 51 | فَمُرَّهَا … وَغَيْرِ فِكْرٍ | فمرها (ED, unvocalized); نمرها … ومن غير فكر (UTH) | LAW + ED; UTH's «ومن غير» breaks the meter. |
| 56 | عِنْدَ بَعْضِ الْعُلَمَا | (UTH drops عند) | LAW + ED. |
| 58 | غَيْرُ الذَّاتِ | وغير الذات (ED) | LAW + UTH. |
| 61 | لَا يَخْلُقُ | لم يخلق (UTH) | LAW + ED. |
| 69 | يَعْتَدِ | يعتدي (ED, UTH) | Same word; LAW writes the جزم form (جواب الشرط), read with إشباع in the rhyme. Kept as LAW. |
| 73 | أَهْلَ الضَّلَالِ | أصل (UTH) | LAW + ED. |
| 75 | الْفِعْلَ الَّذِي | (UTH drops الفعل) | LAW + ED; meter. |
| 77 | وَلَيْسَ **وَاجِبًا** | واجبٌ (LAW) | ED + UTH (the alif is in their rasm), and grammar: خبر ليس مقدَّم، والرضا اسمها. **Changed from LAW.** |
| 85 | فَإِنْ يَشَأْ يَعْفُ وَإِنْ يَشَا انْتَقَمْ | يعفو وإن شاء انتقم (ED, UTH) | Kept LAW (author's sharh; جزم جواب الشرط; both fit the meter). |
| 89 | كَمُلْحِدٍ وَسَاحِرٍ وَسَاحِرَةْ | كملحد وساحره (ED) | LAW (p390) + UTH; ED drops a word and breaks the meter. |
| 93 | مُنَافِقِ | ومنافق (UTH) | LAW + ED. |
| 96 | وَنَحْنُ فِي إِيمَانِنَا نَسْتَثْنِي | ونحن **أيضا** في… (LAW quote) | ED + UTH + comm. ((وَنَحْنُ)) ((فِي إِيمَانِنَا)); «أيضا» breaks the meter. **Changed from LAW.** |
| 98 | وَلَا **تَقُلْ** | ولا نقل (LAW quote) | ED + UTH + comm. «((وَلَا تَقُلْ)) أَيُّهَا الْأَثَرِيُّ». **Changed from LAW.** |
| 100 | نَحْوُ **الرُّكُوعِ** | الرجوع (LAW quote) | ED + UTH + comm. («أفعالنا من الركوع والسجود والقيام»). **Changed from LAW.** |
| 109 | يَقْتُلُ الدَّجَّالْ | يقتل للدجال (ED) | LAW + UTH. |
| 110 | فَإِنَّهُ حَقٌّ | وأنه (UTH) | LAW + ED. |
| 116 | لِلثَّوَابِ | والثواب (UTH) | LAW + ED. |
| 120 | مِنْ كُلِّ **أَرْبَابِ** الْوَفَا | أسباب (LAW quote) | ED + UTH + comm. «مَا أُجْمِلَ مِنْ أَرْبَابِ الْوَفَا». **Changed from LAW.** (ED prints this verse without a hemistich mark; split from LAW.) |
| 123 | مَصِيرُ الْخَلْقِ **مِنْ** كُلِّ الْوَرَى | في (LAW quote) | ED + UTH + comm. ((مِنْ كُلِّ الْوَرَى)). **Changed from LAW.** |
| 134 | لَكِنَّهَا | ولكنها (UTH) | LAW + ED; meter. |
| 137 | كَالْمَقَامِ | المقام (UTH) | LAW + ED + comm. ((كَـ)) ((الْمَقَامِ)). |
| 138 | وَمُعْجِزِ الْقُرْآنِ **كَالْمِعْرَاجِ** | والمعراج (LAW quote) | ED + UTH. The comm. lists them as separate خصائص without deciding. **Changed from LAW** — see «to confirm». |
| 140 | خَاتَمِ **الْأَنْبَاءِ** | الأنبياء (ED, UTH) | Kept LAW: the author's comm. explains «((خَاتَمِ الْأَنْبَاءِ)) … وَالْأَنْبَاءُ جَمْعُ نَبِيٍّ». (ED prints v.140–141 unbracketed with no hemistich mark; split from LAW.) |
| 141 | انْشِقَاقُ الْبَدْرِ **مِنْ** غَيْرِ امْتِرَا | في غير (LAW quote) | ED + UTH + comm. ((مِنْ غَيْرِ امْتِرَا)). **Changed from LAW.** |
| 149 | وَبَعْدُ … حَقِيقًا | وبعده … حقيقيا (UTH) | LAW + ED. |
| 157, 168 | فَإِنَّهُمْ قَدْ / فَإِنَّهَا | لأنهم / لأنها (UTH) | LAW + ED. |
| 161 | مَا قَدْ رَبَا | ربًّا (ED's vocalization) | LAW + UTH. |
| 165, 166 | وَنَاصِحٍ / فَاقْفُ | ومن ناصح / واقف (UTH) | LAW + ED; meter. |
| 171, 173, 178, 181 | فِي كُلِّ / نُكْرِ / وَكُنْ / فَاصْبِرْ | وفي / منكر / فكن / اصبر (UTH) | LAW + ED. |
| 182 | مِمَّا بِهِ | بما (UTH) | LAW + ED. |
| 183 | **فَذَادَهَا** عَنْ غَيِّهَا | فزادها (ED, UTH) | Kept LAW: comm. ((فَذَادَهَا)) ((عَنْ غَيِّهَا)); ذاد عن = دفع/منع fits «عن غيها». Dotting difference only. |
| 186 | فَالْحَدُّ | الحد (UTH) | LAW + ED. |
| 188 | الْمُحَاصَّهْ | المخاصه (UTH) | LAW + ED. |
| 194 | بِهِ | فيه (UTH) | LAW + ED. |
| 197 | بِغَيْرِ قَوْلِ السَّلَفِ | بقول غير السلف (UTH) | LAW + ED. |
| 206 | وَمَالِكٍ **مُحَمَّدِ** الصِّنْوَانِ | ومالكٍ ومحمدٍ (LAW quote) | ED + UTH + comm. ((وَ)) ((مَالِكٍ)) ((مُحَمَّدٍ)) — no second و. Without tanween as the meter requires (…دِصْ صِنْوَانِي). **Changed from LAW.** |
| 207 | تَقْلِيدُ **حَبْرٍ** | خبر (ED) | LAW + UTH. |
| 208 | لِسُبْلِهِمْ | سبلهم (UTH) | LAW + ED. |
| 210 | وَاقْتَفِي | واقتف (UTH) | LAW + ED. |
| 13 | فِي عِقْدِ | عقدة (UTH) | LAW + ED. |

Other one-letter UTH typos (زيف، اقتدروا، بالتتريه، بأه، اقتدر، رقما، وثيل، إضلال، يزداد، وأنا، تشاء، الصدا ويا، الأديان، واجترا، وعى، مقلد، وتاباع، وعاينوا … والأنوار، المختار) were ignored: LAW + ED agree in each.

## Harakat completed / corrected

LAW is fully vocalized (no word of the 1880 in the verses lacks marks). Changes to its marks:
- 13: بِالدُّرَةِ → **بِالدُّرَّةِ** (missing shadda; «الدُّرَّة» is the poem's title).
- 18: مَنَازِل → **مَنَازِلَ** (no mark on the last letter; comm. p70 «(مَنَازِلَ الرِّضْوَانِ)»).
- 43: الْعُلَى → **الْعُلَا** (spelling only: ED, UTH and LAW itself in v.15 write it with alif; it rhymes with «وَلَا»).
- 65 (and wherever it occurs): LAW's joined «غَيْرِمَا» was written «غَيْرِ مَا».
- 164: ثُمَّ تَابَعُوهُمْ → **ثُمَّ تَابِعُوهُمْ** (a noun: أتباع التابعين, after «فالتابعون»; comm. p840 «ثُمَّ تَابِعِيهِمْ»).
- 77, 98, 100, 120, 123, 138, 141, 206: vocalization of the changed words follows LAW's own vocalization of them elsewhere (comm.).
Verse numbers, «((…))» brackets, «...» hemistich marks and the dashes around «تعالى» were removed. Nothing else was touched.

## To confirm (left as decided above, but worth a look by a teacher)
- **138** «وَمُعْجِزِ الْقُرْآنِ كَالْمِعْرَاجِ» (ED + UTH) vs «وَالْمِعْرَاجِ» (LAW's quote). Both fit the meter.
- **140** «خَاتَمِ الْأَنْبَاءِ» kept from the author's sharh; the printed matn (ED) and Ibn Uthaymeen have «الأنبياء».
- **206** «مُحَمَّدِ» without tanween (meter); LAW's commentary writes «مُحَمَّدٍ».
- **109** LAW vocalizes «وَإِنَّهُ يَقْتُلُ الدَّجَّالْ» (kasra); as part of the list of things to believe it may be «وَأَنَّهُ». Kept as LAW.
- **210** «وَالسَّلَامِ» (LAW, kasra to match the rhyme -ī) — kept as LAW.
- **69** «يَعْتَدِ» and **85** «يَعْفُ» are LAW's جزم forms where ED/UTH write يعتدي / يعفو.

## Files
- `safariniyya.txt`, `safariniyya.meta.json`
- Scripts: `safariniyya-build/` — `fetch.js` (download), `skeleton.js` (ED order + headings), `match.js` (find each hemistich in LAW),
  `compare.js` (→ `collation.txt`, every verse where any source differs), `headings.js`, `build-txt.js` (writes the .txt with the
  corrections above), `norm.js`, `findraw.js`, `extract.js`.
- Raw: `raw/safariniyya/` (Shamela 8353 pages 1–921, 6382 pages 1–56, 9725 pages 1–60, 27254 pages 2–10, OpenITI, Wikisource, etc.).
