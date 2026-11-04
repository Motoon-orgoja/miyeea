# Texts report — الدرة البهية نظم الآجرومية للعمريطي (`durrabahiyya.txt`)

Verse numbers below are the running numbers 1–254 of `durrabahiyya.txt` (headings not counted).

Comparison method: both digital texts were stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, and the two were compared word by word with `scripts/compare.js`. A second pass compared harakat letter by letter on the words that match. This was done with a script, not by eye. Raw downloads are in `tools/texts/raw/durrabahiyya/`. The build scripts are in `tools/texts/durrabahiyya-build/`:
- `extract.js` takes the raw files to `ko.json` and `sh.json`.
- `build.js` takes `ko.json` to `durrabahiyya.txt`. Every change is listed in the script, and the word-level ones are logged in `word-fixes.log`.

## Sources
- **Base (KO): ketabonline 27181 «نظم الآجرومية للعمريطي», «ضبطها وراجعها: أبو مالك العوضي»** (source: الشاملة الذهبية). It is fully vocalized, with 6 editor footnotes on variants.
  - Link: https://ketabonline.com/ar/books/27181
  - Download: `ko27181.json`, through `tools/texts/ko-fetch.js`.
  - Each verse is served as two paragraphs, second hemistich first. `extract.js` swaps them back.
  - Stray one-letter paragraphs («ج», «ش», «ئ») were dropped.
  - The hamzat-wasl alif comes through the API as «?» and was restored as «ا».
- **Check (SH): المكتبة الشاملة, book 2084 «الدرة البهية نظم الآجرومية»**, pages 1–33. It is vocalized but has many typos.
  - Link: https://shamela.ws/book/2084
  - Download: `shamela-2084-p*.html`.
  - usul.ai «durra-bahiyya» and OpenITI `0989SharafDinCimriti.DurraBahiyya.Shamela0002084-ara1` are the same file, so they were not counted as extra sources.
- **Tie-breaker for the disputed places (M): «لواقح الأفكار في النحو شرح نظم العمريطي», سمير مراد**, archive.org `a2010n`.
  - Link: https://archive.org/details/a2010n
  - Download: `archive-a2010n-lawaqih-sharh-djvu.txt`.
  - This is archive.org's OCR. It is poor, so it was only searched for the verses in question, never compared as a whole.
- **Independence caveat:** KO and SH share some identical typos, for example «الأَخَيرِ», «عَظَيمُ الشَّانِ», «الْمَذْكَورِ», «مُحرَّكٍ», «قائِمَانِ». So العوضي's text is a revision of the same Shamela digitization, not a separate digitization.
  - The wording check is therefore against one digital lineage, plus M at the disputed places.
  - No other clean digital copy was found. Two archive.org scans were checked and rejected as unusable:
    - `nono_263`, an edition by إسماعيل آل عصامي, whose OCR is unreadable.
    - `20220908_20220908_2145`, which is a printout of the Shamela text.
- **Vocalization:** after the fixes, 97.9% of the countable letters are marked (`scripts/vcount.js`). The unmarked ones are only the article alif and lam after a prefix (وَال، بِال، لِل) and the واو of عَمْرٍو, which conventionally carry no marks.

## Count
- **254 verses.** KO and SH agree verse for verse. The poem itself says «فِي رُبْعِ أَلْفٍ», a round figure.
- The date verse «وَفِي جُمَادَى سَادِسَ السَّبْعِينَا | بَعْدَ انْتِهَا تِسْعٍ مِنَ الْمِئِينَا» gives completion in Jumada **976 AH**.
- The meta gives «ت بعد ٩٨٩هـ», following Shamela's author card and `imriti.meta.json`: نظم الورقات was finished in 989 AH, so he was alive then. The task said «ت ٩٨٩هـ».

## Headings (34)
- These are KO's headings. SH has the same set minus «مُقَدِّمَةٌ» and «خَاتِمَةٌ».
- Typos fixed in headings:
  - «مُقَدَِّمَةٌ» → «مُقَدِّمَةٌ»
  - «الإعْرَابِ» → «الإِعْرَابِ»
  - «وَالنَّكِرةِ» → «وَالنَّكِرَةِ»
  - «مَرْفَوعَاتِ» → «مَرْفُوعَاتِ» (in both sources)
  - «التَّوكِيدِ» → «التَّوْكِيدِ»
  - «بَاب الظَّرْفِ» → «بَابُ الظَّرْفِ»
  - «لأَِجْلِهِ» → «لِأَجْلِهِ»
- The parentheses were dropped in «بَابُ (لاَ) الْعَامِلَةِ عَمَلَ (إِنَّ)».
- KO's «فَصْلٌ (الْمُعْرَبَاتُ)» was written as plain «فَصْلٌ», as in SH. The bracketed word is the editor's label.

## Wording differences (KO vs SH) and the choice
| Verse | Chosen | Other | Why |
|---|---|---|---|
| 3 | فَأَعْرَبَتْ فِي **الْحَانِ** بِالأَلْحَانِ | فِي الْحَالِ (KO) | SH has «ألحَانِ» (= الْحَانِ), and M has it too, explaining «الحان: حانوت الخمار، والألحان: مقام المحبة». KO's footnote also records «في نسخة» with الحان. **Base changed.** |
| 21 | وَهَذِهِ **ثَلاَثَةٌ** هِيَ الْكَلِمْ | ثَلاَثُهَا (KO) | SH and M agree. Both forms scan. **Base changed.** |
| 2 | فَمِنْ عَظِيمِ شَأْنِهِ | لَكِنْ لِعُظْمِ شَأْنِهِ (KO footnote «في نسخة») | KO and SH agree. Kept. |
| 37 | ذُو **حَرَى** | جَرَى (SH) | KO's footnote: «والأصوب بالحاء». Kept. |
| 45 | وَخَمْسَةُ الأَفْعَالِ | وَالْخَمْسَةُ الأَفْعَالُ (SH) | Both scan. The base was kept. |
| 78 | فَالأَوَّلُ **اسْمٌ** مُضْمَرُ | omitted (SH) | Without «اسم» the hemistich is one syllable short. |
| 113 | كَلَمْ يَقُمْ إِلاَّ أَنَا أَوْ أَنْتُمُ \| وَغَيْرُ ذَيْنِ بِالْقِيَاسِ يُعْلَمُ | hemistichs reversed (SH) | KO and M agree. The example comes first, then «وغير ذين». |
| 142 | فِي اسْتِدْرَاكِ | اسْتِدْرَاكِي (SH) | The base. Same pronunciation at the rhyme. |
| 159 | وَثُمَّا (rhymes with أَمَّا) | وَثُمَّ (SH) | The base. Same pronunciation at the rhyme. |
| 160 | ثُمَّ عَمْرٌو أَكْرِمِ | وَأَكْرِمِ (SH) | The و breaks the meter. |
| 170 | مُلَقِّبًا | مُنَقِّباً (SH) | SH typo. M has ملقبا. |
| 171 | كَذَاكَ إِضْرَابٌ | كَذَلِكَ (SH) | «كذلك» adds a syllable. M has كذاك. |
| 192 | سِنِينَا … حِينَا | سِنِينَ … حِبنَا (SH) | Rhyme. SH has a typo. |
| 209 | أَخْرِجْ بِهِ **مِنَ** الْكَلاَمِ | «من» dropped (SH) | Meter. |
| 210 | الَّذِي **لَهُ** حَوَى إِلاَّ وَغَيْرٌ | قَدْ حَوَى … وَغَيْراً (SH) | Both scan and both make sense. The base was kept (see «مواضع للتأكد»). |
| 245 | عَلَى تَقْدِيرِ **فِي** أَوْ لاَمِ | «في» dropped (SH) | Meter. |
| various | قُسِّمَا، وَالزَّيْدُونَا، بِالْفَتْحِ، وَهَكَذَا، اسْتَثْنَيْتَهُ، وَالنَّصْبُ، إِذْمَا | فُسِّمَا، وَازَّيْدُونَا، بِلْفَتْحِ، وَهَكَذَ، اسْتَثْنَيْهُ، وَانَّصْبُ، إِذَ مَا (SH) | SH typos. |

Spacing-only differences (SH «أَوْحَذْفِ، مَالَهُ، يَافَتَى» and so on) are not listed.

## Harakat
- **Double marks.** Where the editor put two marks on one letter to mean "either reading", one reading was kept, the one SH has or the one that is standard. The rest are typing doubles. All are in `build.js` (`DOUBLE`). The notable ones:
  - 33 «كَأَحْمَدُ / الأَعْبُدُ»: damma. KO's footnote says the letter may take sukun or damma, «ولا يصح الكسر». SH has kasra.
  - 11 «الْحَبْرُ», 20 «وَالْكِلْمَةُ», 168 «كَلْمَةً»: SH's vowel at each spot, so 20 and 168 differ as in SH.
  - 194 «لَيْلَةَ الِاثْنَيْنِ»: hamzat wasl, as the meter needs.
  - 195 «أَمَامَهْ / قُدَّامَهْ» and 196 «تِلْقَاءَهُ / إِزَاءَهُ»: as SH.
  - 165 «وَأَبْتَعٍ», to match «أَكْتَعٍ».
  - 144 «اِنْصِبْ».
  - Typing doubles such as الطَّلَبِ، وَجَرّْ، مَحَلٍّ، كُلٍّ، هَمْزٌ، وَنُونٌ، غَيْرُ، نَحْوُ.
- **Typos shared by both sources, corrected:**
  - 90, 116 «الأَخَيرِ» → «الأَخِيرِ»
  - 123 «عَظَيمُ» → «عَظِيمُ»
  - 154 «الْمَذْكَورِ» → «الْمَذْكُورِ»
  - «لأَِرْبَعِ، لأَِجْمَعَا» → «لِأَرْبَعِ، لِأَجْمَعَا» (Shamela's old encoding of lam with kasra)
  - 27 «إَعْرَابُهُمْ» → «إِعْرَابُهُمْ»
- **Missing marks completed.** Each is the only possible vocalization:
  - أَفَادَ، وَالْخَفْضِ، وَحَرْفِ، وَافْعَلِي، كَيَاتِي، الْمُضَارِعِ (3×)
  - الأَسْمَا، الأَفْعَالِ، وَلَكِنْ، لَكِنْ، قَاضٍ، الَّذِي، وَتُحْصَرُ، مُحَرَّكٍ، فَإِنْ
  - وَتَا، فَانْصِبْ، وَتَتْرُكَ، ضَمَائِرٌ، قَائِمَانِ، بِالْمَعْطُوفِ، إِلَى، كَقَامَ، نَاقِصٍ، وَمَا
  - بِالْعِبَادِ، أَوْ (2×)، verse 1 «الْحَمْدُ»
  - A kasra on a bare «إ» (verses 5 and 26).
- **Cleaning:** the editor's parentheses around examples, footnote numbers, tatweel, commas, colons, semicolons and the dashes in verse 114 «أَقِمْ - مَقَامَ … -» were removed.
- **SH-only harakat readings not adopted** (the base is grammatical in each case):
  - 62 مُقَدَّرَ / يَظْهَرَ
  - 99 وتَتْرُكِ
  - 149 فَأَوَّلُ
  - 162 «فَيَتْبَعُ المُؤَكَّدُ المُؤَكَّدَا»: the base has الْمُؤَكِّدُ, the تأكيد following the مؤكَّد.
  - 182 قَبْلَ كُلٍّ
  - 222 الأَعْمَالِ: the base has الإِعْمَالِ.

## مواضع للتأكد
- **3 «فِي الْحَانِ» against «فِي الْحَالِ», and 21 «ثَلاَثَةٌ» against «ثَلاَثُهَا»:** these are the only two places where the base (العوضي) was overruled, each time by SH plus the commentary. Worth checking against a printed edition such as الباجوري's «فتح رب البرية».
- **210 «الَّذِي لَهُ حَوَى إِلاَّ وَغَيْرٌ» (KO) against «الَّذِي قَدْ حَوَى … وَغَيْرًا» (SH):** both are sound. The base was kept.
- **105 «مَعْلُومَةُ الأَسْمَاءِ»** (KO) against «مَعْلُومَةَ» (SH), and **163 «لاَ مُنَكَّرٍ فَمِنْ مُؤَكِّدٍ خَلاَ»** (KO) against «مُنَكِّرٍ فَمَنْ مُؤَكَّدٍ» (SH): the base was kept. These need a vocalized commentary to settle.
- **The heading «فَصْلٌ»:** whether to show KO's label «الْمُعْرَبَاتُ» with it.
