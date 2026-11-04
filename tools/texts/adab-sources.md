# Texts report: منظومة الآداب = الألفية في الآداب الشرعية — ابن عبد القوي (ت ٦٩٩هـ) (`adab.txt`)

Poem in الطويل, rhyme ـدِي/ـدِ. **947 verses, 32 section headings.**
How the comparison was done: each verse was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, a word split
across the hemistichs was joined, and every base verse was matched by script to the best witness verse anywhere in the witness
(the witnesses order many verses differently), then compared word by word (`adab-build/collate.js`). Not by eye.
Raw downloads are in `raw/adab/`; scripts and intermediate files in `adab-build/`.

## 1. Sources

| Siglum | Source | Use |
|---|---|---|
| **A** (base) | Shamela 54 «الألفية في الآداب الشرعية [المشهورة بـ«منظومة الآداب»]», اعتنى بها وضبطها محمد بن ناصر العجمي، دار البشائر الإسلامية، ط٢ ١٤٢١هـ/٢٠٠٠م, pages 22–99: https://shamela.ws/book/54 — raw `raw/adab/shamela54/` | Wording, verse order, harakat, headings. Edited from the Princeton MS 4566 (ب), Zahiriyya MS 186 (ظ), the old print (المطبوعة) and Ibn Dahyan's copy (ع). The verses are numbered 1–947 in this edition, and the editor's variant notes were kept in `adab-build/base-notes.txt`. |
| **S** | Shamela 25791 «غذاء الألباب في شرح منظومة الآداب» للسفاريني، pages 1–1059 (fully vocalized): https://shamela.ws/book/25791 — raw `raw/adab/shamela25791-saffarini/` | Wording check + filler for missing harakat. |
| **M** | «موارد الظمآن لدروس الزمان» لعبد العزيز السلمان، vol. 6 pp. 679–701 (turath.io book 7480 = Shamela 7480, page ids 3783–3805), fully vocalized: https://app.turath.io/book/7480 — raw `raw/adab/turath7480-mawarid/` | Wording check; harakat only where S agrees. Its 5 bracketed verses are السلمان's own additions (cinema, radio…) and were dropped. |

**Coverage limit (important).** S and M are not independent of each other. M prints the shorter recension that السفاريني commented on.
As العجمي says in his introduction (Shamela 54, pp. 3–21), السفاريني «حذف جملة من أبيات المنظومة». That recension also opens with a different
first verse («بِحَمْدِكَ ذِي الْإِكْرَامِ مَا رُمْتُ أَبْتَدِي») and has 6 verses after A 70 that are «لا وجود لها في المخطوطات» (A's note).
So only **241 of the 947 verses (25%)** have a second witness: S pairs with 222 verses (129 identical, 93 differing) and M with 216 (104 identical, 112 differing).
**The other 706 verses rest on A alone.** I found no other digital full text of the 947-verse poem. turath.io full-text searches for verses missing from S, such as «فغايته علم الكسوف» and «ولا غرم في كسر الصليب», return only Shamela 54.

## 2. Count
947 = A's count («عدد الأبيات: ٩٤٧» in the book card; the last verse is numbered ٩٤٧). The numbering is continuous, and the script stops on any jump.
The brief's figure «نحو ٤٠٠ بيت» fits the shorter السفاريني recension, not this complete «ألفية». A notes these verses as missing from some witnesses, but the editor kept them:
v. 321, 581 (missing in ظ), 703 (missing in ظ), 855 (in neither ظ nor ب; taken from the print and ع), 937 (missing in ب and ظ). They are kept here as in A.
Verse 370 repeats verse 292 almost word for word (وأَخذٌ وإعطاءٌ… ومُتَّكِئًا زِدِ). Both are in A, and both were kept.

## 3. Wording differences (A vs S/M) — all resolved in favour of A
A is the critical edition, and S/M carry the recension that A collated as «المطبوعة» and «غذاء الألباب». Wherever they differ, A's reading was kept. In several places A's footnote names the variant and says why it was rejected. Full list (137 verses): `adab-build/collation-summary.txt`; per-verse detail in `adab-build/collation-saffarini.txt` and `collation-mawarid.txt`.

| v. | A (kept) | S / M | note |
|---|---|---|---|
| 13 | أهلِ **الفضلِ** | الْعِلْمِ (M) | recension |
| 16, 49, 67, 751, 834 | الرَّدِ | الرَّدَى / الرَّدِي | A shortens the vowel for the rhyme; same word |
| 17 | فَعِنْدِيَ **ممَّا في** الحديثِ | مِنْ عِلْمِ (S, M) | recension |
| 20, 841 | عمَّا | عَنْ مَا | spelling only |
| 27 | **يَصُنْ** أهلَهُ | يَعِفَّ / يُعَفْ | recension |
| 37–38 | وقَيِّدِ / بنارٍ يُوَقَّدِ | عَلَى عَمْدٍ / يَفُوقُ عَلَى الْهِنْدِ (S) | S breaks the rhyme |
| 61 | لمْ **تَخَفْ** | يَخَفْ | recension |
| 72 | مَنْ **ذَمَّ** ذلكَ | رَدَّ | recension |
| 79 | **إذْ** لمْ يُجَدِّدِ | إنْ | recension |
| 88 | **عن** | عَلَى | recension; A's footnote gives (ظ) «بَاعِدِ» for the rhyme word |
| 94 | يُكرَهُ… لِمَيِّتٍ… كَمُرْدِدِ | نَكِّرْهُ… كَلِلْمَيِّتِ… | recension |
| 106 | ويُكْرَهُ منكَ | وَلَيْسَ لِغَيْرِ اللهِ (M) | recension |
| 178 | بما لمْ تَيَقَّنْ | وَلَمْ تَتَيَقَّنْ | recension |
| 216 | مَنْ عادَ **مَرْضَى** | مُمْسِي (M) / يَمْشِي (S) | recension |
| 277 | دَبُّورٍ | زُنْبُورٍ | synonyms |
| 755 | قَمْلٍ أوْ جَرْبِ | قَتْلٍ أوْ حَرْبِ | A fits the meaning (silk allowed for lice or scabies) |
| 820 | فصَرَّارُهَا | بِصَرَّارِهَا | recension |
| 845 | الْبَرِيِّ المُسَدَّدِ | الْبَرِيءِ الْمُشَدِّدِ | recension |
| 907 | اكتسابِ | اقْتِبَاسِ | recension |
| 908 | في النِّعمَتَيْنِ | بِالنَّعْمَتَيْنِ / الْغُمَّتَيْنِ | recension |
| 916 | والتَّسَدُّدِ | وَالتَّعَبُّدِ | recension |
| 921 | وحِلْيَةٍ | وَخِصْلَةٍ | recension |
| 928 | السيْرِ | اللَّيْلِ | A's note: (ظ) and the print have «تَحْمَد» for the rhyme word |
| 936 | بالشَّقَاوَةِ | بِالسَّعَادَةِ | A's note: (ظ) and the print have «السعادة» |

## 4. Harakat
- A is the editor's careful but **partial** vocalization: 61.9% of consonants marked, 28.7% of words fully marked (`scripts/vocratio.js`).
  Many obvious vowels are left bare (e.g. قالَ, على, في).
- **Completed from S** (`adab-build/fill-harakat.js`, log `adab-build/fill-log.txt`). This was done only in verses whose wording is identical to S, only on letters bare in A, and never on a bare alif or alif maqsura. Where M also has the verse, a mark was added only when S and M agree (70 letters were skipped for disagreement). A word whose existing marks in A disagree anywhere with S or M was left wholly as in A (175 words), so no hybrid vocalizations were produced. No mark of A was changed by this step.
  Result: **122 verses completed, 1,259 marks added**. The final file has 65.3% of consonants marked and 33.9% of words fully marked.
  **The text is therefore not fully vocalized**: about two thirds of the verses keep A's partial shakl, because no second vocalized witness exists for them.
- **Corrected** (`adab-build/finalize.js`, log `adab-build/finalize-log.txt`):
  - v. 13 «مِنْ كلُ أَمْجَدِ» → «مِنْ كُلِّ أَمْجَدِ». The damma after «مِنْ» is a solecism and the shadda was missing; S and M both have «كُلِّ».
  - v. 647 «أو الـ | الحريمَ» → «أو الـ | ـحريمَ». The «ال» was doubled where the word is split across the hemistichs.
- 236 mark conflicts between A and S/M in matched words were listed by script (`adab-build/conflicts.txt`). Almost all of them are S/M slips (e.g. «لِيَصْغَ», «تَسْدَدِ») or rhyme sukun vs. kasra. A was kept in all of them except v. 13.

## 5. Cleaning
Removed: verse numbers, footnote marks «(١)», the opening line «قالَ الإمامُ…», the basmala line, and «***» separators. The Qur'anic word in v. 184 is now ﴿وَتَزَوَّدُوا﴾.
In v. 221 «و (يس)» became «و«يس»». A word split across the hemistichs is written «…الـ | ـوَلِيَّ…» (26 verses were given the missing second «ـ»). No other tatweel was used.
The 32 `##` headings (صَوْنُ الجوارِحِ … فَرْضُ العينِ…) are the **editor's** section titles printed in A, not the poet's. They were copied with A's vocalization.

## 6. Places to check (مواضع للتأكد)
- **706 verses have no second witness** (see §1). Any slip in the Shamela transcription of A in those verses could not be caught by script.
- v. 801 «مِنْ صُفْرٍ رَصاصٍ **حَدِيدُهم**»: S has «حَدِيدِهِمْ» (genitive in the list), which looks more natural. A was kept.
- v. 743 «لَدَى أحمدٍ» and v. 798 «أحمدٌ»: the tanwin on a diptote is needed for the metre in 743. A was kept in both.
- v. 826 «أَبْلِي وأَخْلِقْ» (S «أَبْلِ»): A was kept.
- Content flag: A's own footnotes (from the old print) criticise v. 605 («وأَلْثِمُ آثارَ النَّبِيِّينَ») and v. 626–628 (travelling to visit the grave, «مُستشْفِعًا بمحمَّدِ»).
  The verses are kept as the author wrote them. You may want an in-app note there.
- `c` = «الآداب والرقائق», as requested. It is not one of the category names listed in the brief.

## 7. Letter corrections after vocalization (2026-11-04)
The vocalizers proposed letter changes in `voc/adab/changes.txt` but were not allowed to make them. Each one was checked against
A's raw pages (`raw/adab/shamela54/`), S and M. Then every hemistich of `adab.txt` was matched by script against the full text of S
and M (two-word anchors, word-by-word compare), so that verses the first collation did not pair were also caught. A second script listed
every word not found in S, M or the other texts of the project, and the list was read by eye: run-together words, «ـة» where the
pronoun «ـه» belongs, and ض/ظ. **11 letter corrections** were made. Each fix keeps the metre (الطويل) and the rhyme, and is vocalized.
`L` = 0-based line in `adab.txt`; `v.` = A's verse number.

| L | v. | before | after | evidence |
|---|---|---|---|---|
| 114 | 109 | وَقِيلَ **احْضُرْ** | وَقِيلَ **احْظُرْ** | S (p. 337) prints «وقيل احظر» and explains it as a second view that this sitting is forbidden. «احضر» does not fit the context, which lists things that are disliked. A's Shamela text and M have the ض slip. |
| 197 | 186 | نَحْوَ **الدَّارِسَتَيْنِ** حِجَّةً | نَحْوَ **الدَّارِ سِتِّينَ** حِجَّةً | Two words run together in A's transcription. «الدارستين» is not a word. The sense is "who has walked 60 years toward the Abode", and the metre needs «سِتِّينَ» (فعولن مفاعيلن فعولن مفاعلن). Not in S/M. |
| 353 | 337 | دُونَهُ **احْضِرْهُ** وَاطْرُدِ | دُونَهُ **احْظُرْهُ** وَاطْرُدِ | "Without permission, forbid it and drive him away". The same verb is used in v. 347–348 («احْظُرْ مِنْهُ»). «احضره» gives no sense here. Not in S/M. |
| 364 | 347 | وَلَوْ عَنْ **غُصُونَةٍ** | وَلَوْ عَنْ **غُصُونِهِ** | «غصونة» is not a word: «ـة» was written for the pronoun «ـه» (the branches of the tree in v. 346). The scansion stays the same (فَعُولُنْ مَفَاعِلُنْ). Not in S/M. |
| 434 | 416 | **وَلَقَدْ** لَعَنَ الْمُخْتَارُ | **وَقَدْ** لَعَنَ الْمُخْتَارُ | «ولقد» breaks the first foot (وَلَقَدْ لَعَ = ∪∪–∪∪). «وَقَدْ لَعَنَ الْمُخْ…» gives فعولُ مفاعيلن. Not in S/M. |
| 649 | 625 | دَعَوْتَ يَكُنْ **أُخْرَى** | دَعَوْتَ يَكُنْ **أَحْرَى** | «أحرى» = more fitting (for getting what you ask). «أخرى» gives no sense here (the dot was misplaced). Same scansion. Not in S/M. |
| 790 | 762 | مِنَ **الْمَغْدُورِ** عَنْهَا | مِنَ **الْمَعْذُورِ** عَنْهَا | The subject is the sale of a person *excused* from Friday prayer: the verse rules that his sale is valid. «المغدور» (one who was betrayed) gives no sense. Not in S/M. |
| 796 | 768 | تُوَصِّلُ **ذِي** فَقْرٍ | تُوَصِّلُ **ذَا** فَقْرٍ | Direct object of «تُوَصِّلُ», so it must be accusative («ذا»). Compare v. 837 «إذا كنتَ ذا فقرٍ» (A, S, M). |
| 818 | 789 | فِي **خَمَائِلِ** صَارِمٍ | فِي **حَمَائِلِ** صَارِمٍ | Sword-belt («حمائل السيف»). S (p. 668), in its list of silver allowed for men, has «وخفّ ورانٌ… وحمائلُ سيفٍ». These are the very items of this verse. «خمائل» (thickets) is a slip of the dot. |
| 834 | 805 | وَطَوْقٍ **لِلدَّاوبِ** | وَطَوْقٍ **لِلدَّوَابِّ** | Letters swapped. «لِلدَّوَابِّ» scans (فعولُ مفاعلن). |
| 863 | 833 | وَكُنْ حَازِمًا **وَاحْظُرْ** بِقَلْبٍ | وَكُنْ حَازِمًا **وَاحْضُرْ** بِقَلْبٍ | The opposite slip (ظ for ض). S (p. 851) and M both read «واحضر», and S explains it as «واحضر لاستماع وصيتي… بقلب». «احظر» (forbid) gives no sense. |

**Not changed, left to check:**
- v. 536 (L558) «بَلْ لِذَاتِ **التَّرَادِ**»: the metre is short by one syllable, and the rhyme is broken. The verse is in A only; S, M and a web search do not have it. The changes file suggests «التَّرَدُّدِ», which would fit the metre and rhyme (∪–∪–). «التَّوَدُّدِ» would fit as well, and the fiqh sense is unclear. So it was kept as in A until a manuscript or print can be checked.
- v. 419 (L437) «فَكَفِّرَ **مُبِيحَنْهَا**»: an odd form, in A only. «مُبِيحِيهَا» would fit both sense and metre, but nothing supports it. Kept.
- Checked and **left** as valid words: «عُنْدَد» (v. 182, "escape"), «تاوٍ» (v. 665, A's note: «تالف»), «مُصَخَّد» (v. 344, "heated"), «فُوهَد» (v. 659), «دَمَلْتُمُوهَا» (v. 351, "manured"), «الْوَاعِ» (v. 483). Also kept: «مُتَوَدِّد» (v. 218; S/M «مُتَوَرِّد»), a recension reading that makes sense.
