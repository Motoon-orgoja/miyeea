# Texts report — اللامية المنسوبة لشيخ الإسلام ابن تيمية (`lamiyyataymiyya.txt`)

Method: each witness was parsed into 16 verses, stripped of harakat and tatweel, alef/yaa/taa-marbuta unified, and every hemistich aligned word by word against the base with an LCS script; a second pass compared harakat letter by letter with العقل wherever both have the same word. Every change is a line in `build.js` and is logged in `lamiyyataymiyya-build/out/edits.log`.
Scripts: `tools/texts/lamiyyataymiyya-build/` (`collate.js` → `out/witnesses.json`, `out/collation.txt`; `build.js` writes the .txt). Raw downloads: `tools/texts/raw/lamiyyataymiyya/`.

## Sources
- **Base (wording + vocalization): ketabonline 19630** «القصيدة اللامية المنسوبة لشيخ الإسلام ابن تيمية», اعتنى بها عبد الله بن محمد الشمراني (from الشاملة الذهبية), pp. 2–3: https://ketabonline.com/ar/books/19630 . Nearly fully vocalized, 16 verses, footnotes on variant readings. (The site's metadata wrongly names مجد الدين ابن تيمية as author; the edition itself says شيخ الإسلام أبو العباس.) Its digital text has encoding noise (doubled marks, «نُقَّالِهَِِاُ») and splits و/بـ from words it puts in quotes.
- **Check 1 (partly vocalized): ketabonline 62918** «بدر التمام شرح لامية شيخ الإسلام», د. عبد الرحمن العقل (مركز النخب العلمية، ط٢ ١٤٣٧هـ), «نص اللامية» p. 8: https://ketabonline.com/ar/books/62918 — the text taught in a students' منهجية.
- **Check 2 (unvocalized): ketabonline 28233** «التلخيصات الرضية في شرح القصيدة اللامية», عاصم البرقاوي.
- **Check 3 (unvocalized): islamqa.info/ar/answers/140350** (text + attribution discussion).
- Also looked at (verses quoted in lessons, not collated in full): شرح السلمي (ketabonline 4611), شرح عمر العيد (5849).

## Count
- **16 verses** ✔ in all four witnesses. The الطويل verse «فنعمانهم قانٍ وطعقٌ لمالكٍ…» found after verse 15 in one print is not part of the poem (different meter and rhyme; الشمراني's note) and was not added.

## Wording differences (all kept as in the base = العقل)
| Verse | Base (= العقل) | Other reading | Note |
|---|---|---|---|
| 4 | قَدْرٌ عَلَا وَفَضَائِلٌ | قدرٌ وفضلٌ ساطعٌ (البرقاوي، islamqa، العيد) | السلمي also «علا وفضائل»; الشمراني notes ساطع as «إحدى النسخ» |
| 5 | فَهْوَ الْكَرِيمُ الْمُنْزَلُ | فهو **القديم** المنزل (islamqa، السلمي، العيد، ابن سحمان) | البرقاوي = base. Both editors chose الكريم from manuscripts, since «القديم» contradicts Ibn Taymiyya's own teaching; العقل discusses it in the attribution chapter |
| 8 | عَنْ كُلِّ مَا يُتَخَيَّلُ | مِن كل ما (islamqa، العيد) | البرقاوي = base |
| 12 | فَمُسَلَّمٌ نَاجٍ | فموحِّدٌ ناجٍ (البرقاوي، islamqa، العيد) | الشمراني: «وفي نسخة فموحد، والمثبت أقرب» |
| 9 | الْقُرَانَ | القرآن (islamqa) | spelling; the meter needs القُرَان (نقل الحركة) |

## Vocalization completed or corrected (logged by `build.js`)
- **Corrections:** 11 «وأُقِرُ» → «وَأُقِرُّ» (shadda; العقل); 12 «وَآخَرَ» → «وَآخَرُ» (رفع، معطوف على «فمسلّمٌ»; العقل); encoding noise cleaned in 8 «نُقَّالِهَا», 10 «وَالْمُؤْمِنُونَ», 15 «الشَّافِعِيِّ»، «حَنِيفَةَ».
- **Filled from العقل:** 3 كُلِّهِمْ، أَتَوَسَّلُ؛ 5 الْمُنْزَلُ.
- **Filled where only one vowel is possible** (letter before a long alif, لام التعريف القمرية, و/ف العطف, ب الجر, في/إلى/هذا, لفظ الجلالة اللَّه): 31 words in verses 1–15, each listed in `build.js` (FILL).
- Orthography: «لاَ» → «لَا», «حَقّاً» → «حَقًّا» (same vowels, standard placement). Quote marks around key words removed.
- Result: 100% of letters that need a mark carry one (499/499).

## Attribution (brief)
Disputed. Accepted by المرداوي (اللآلئ البهية)، الجبرتي، خير الدين الآلوسي، ابن رشيد، الجبرين وغيرهم; rejected by ابن عثيمين («الظاهر أنها لا تصح أصلًا عن الشيخ»، شرح السفارينية) and بكر أبو زيد (المداخل، في المنحول). Arguments against: no early list of his works mentions it, he quotes verse 9 in مجموع الفتاوى (6/297) as «أنشد المنشد», and the «القديم» reading. سليمان بن سحمان was undecided. Summary from العقل, بدر التمام pp. 9–16, and islamqa 140350. The meta says «المنسوبة».

## مواضع للتأكد (needs the owner's decision)
- 5 **الكريم vs القديم** and 12 **فمسلَّم vs فموحِّد**, 4 **علا وفضائل vs وفضل ساطع**: two streams exist. The edited student texts (الشمراني، العقل; partly البرقاوي) give the base; the older/internet text (islamqa, several recorded lessons) gives the other. I kept the edited text. If you want the «internet» text, it is four word changes.
- 11 «رَيًّا» (base, البرقاوي) vs «رِيًّا» (العقل). Both are attested forms of the masdar; base kept.
- 5 «فَهْوَ» (base) vs «فَهُوَ» (العقل). Both scan in الكامل; base kept.
- 12 «جَهَنَّمٍ» and 4 «وَفَضَائِلٌ» are nunated for the meter (صرف الممنوع للضرورة) in both vocalized witnesses; kept.
