# Texts report: بانت سعاد (Kaʿb ibn Zuhayr) — `banatsuad.txt`

How it was done (scripts in `madih-build/`, shared by the three madih poems):
- `parse.js` parses every witness into verses → `out/banatsuad.json`. Raw downloads: `raw/banatsuad/`.
- `collate.js` aligns base and witnesses word by word (LCS over the whole poem, after stripping harakat/tatweel/punctuation and unifying alef, yaa, taa marbuta) → `out/banatsuad.collation.txt`.
- `build.js` applies the decisions below, fills harakat, runs the meter check (`meter.js`, البسيط with ضرب فَعْلُن) and lists remaining harakat conflicts → `out/banatsuad.build-log.txt`. Ibn Hishām's commentary text is in `out/H-commentary.txt` (used to check lemmas).

## 1. Sources
- **Base (H):** Ibn Hishām al-Anṣārī, «شرح قصيدة كعب بن زهير بانت سعاد», the poem as printed before the commentary (57 verses), ketabonline 102440 (مكتب الرحاب, «مقابل ومشكول ومراجع»): https://ketabonline.com/ar/books/102440. Its commentary lemmas were used to settle typos in that list.
- **T:** al-Tabrīzī, «شرح قصيدة بانت سعاد», ketabonline 102439 (same publisher, 57 verses): https://ketabonline.com/ar/books/102439
- **S:** Wikisource «قصيدة بانت سعاد» (vocalized, 59 verses, many misplaced marks): https://ar.wikisource.org/wiki/قصيدة_بانت_سعاد
- **A:** aldiwan.net poem 21877 (= «الموسوعة الشعرية», 57 verses, a different recension): https://www.aldiwan.net/poem21877.html
- **B:** Ibn Kathīr, البداية والنهاية (Ibn Isḥāq's text, unvocalized, 54 verses), Wikisource: https://ar.wikisource.org/wiki/البداية_والنهاية/الجزء_الرابع/إسلام_كعب_بن_زهير_بن_أبي_سلمى_وذكر_قصيدته_بانت_سعاد

No digital text is fully vocalized. H: 68.9% of letters; after filling from T, A (its convention completed) and S: **95.2%**.

## 2. Count
**58 verses** = H's 57 + «هَيْفَاءُ مُقْبِلَةً عَجْزَاءُ مُدْبِرَةً | لَا يُشْتَكَى قِصَرٌ مِنْهَا وَلَا طُولُ» inserted as v. 3 (in S, A and B; absent from H and T). Not added: «وقد أتيتُ رسولَ الله معتذرًا…» (S only) and «ما زلتُ أقتطعُ البيداءَ مُدّرِعًا…» (A only). The order is H's (= T).

## 3. Wording (rule: the circulated wording = majority of H T S A B; a tie keeps H). Verse numbers = final file.
| v. | Adopted | H | Witnesses |
|---|---|---|---|
| 3 | (verse added) | — | S A B |
| 7 | أَوْ لَوَ انَّ | أَوْلَوْ أنَّ (spacing) | T (naql of the hamza) |
| 17 | الحُزَّانُ | الحَزَّاز (also H's commentary) | T A B |
| 18 | فَعْمٌ مُقَيَّدُها | عَبْلٌ (H's commentary quotes «فَعْمٌ» too) | T S A B |
| 27 | تَخْدِي … وَقْعُهُنَّ الأرْضَ | تَخْذِي … مَسُّهُنَّ الأرضُ | T A B (تخدي also S) |
| 48 | مَفْلُولُ | مَجدولُ (H's commentary: «ويُرْوَى: مَفلولُ») | T A; S B «مغلول» |
| 52 | في عُصْبَةٍ | في فِتيةٍ (H's commentary: «ويُرْوَى: في عُصْبَةٍ») | T A B |
| 55 | كأنَّها | كأنه | T S A B |

Famous variants **kept as in H** (minority or tie): v.1 «لم يُفْدَ» (A «لم يُجزَ»; B «عندها» for «إثرها»); v.7 «أَكْرِمْ بها … مَوْعُودَها» (A «يا ويحها … ما وعدت»); v.10 «ولا تَمَسَّكُ … يُمْسِكُ» (T «فلا»/«تُمسك», A B «وما»); v.40 «نافِلَةَ | القرآنِ» (T «الفرقان»); v.41 «وإنْ كَثُرَتْ» (A B «ولو»); **v.51 «إنَّ الرسولَ لسَيْفٌ يُستضاءُ به»** — H T S A all «لسيف»; only B (Ibn Isḥāq) has the widely recited «لنورٌ». If the owner wants the recited form, change that one word.

## 4. Harakat
- Filled: T 70 words, A 267 (after completing aldiwan's convention), S 19. A mark was added only where H's letter is bare, the witness word has the same letters and contradicts no mark H already has; no vowel/shadda on the article lam. Full list in the build log.
- Corrected (logged): v.36 «كلَّ» → **كلُّ** (subject); v.22 القِرادُ → **القُرادُ**, v.34 ومَدْرَعُها → **ومِدْرَعُها**, v.47 فيَلْحِمُ → **فيُلْحِمُ**, v.50 والدَّرْسَانِ → **والدِّرْسَانِ**, v.54 العَرانينَ → **العَرانينِ** (all = H's own commentary lemmas + T); v.48 وهو → **وَهْوَ** (meter).
- **Meter:** all 116 hemistichs scan as البسيط (v.40 scanned as one line: تدوير «نافِلَةَ | الْقُرْآنِ»).

## 5. To verify
- v.25 «تَمُرُّ» (H text) vs «تُمَرُّ» (H commentary lemma) vs «تُمِرُّ» (T). Kept H's text.
- Readings kept from H against T where H's commentary supports H: مُنْهَلٌ (T مَنْهَل), شَبَمٍ, طِلْحٌ, رَخْوَةُ, يُرْعَدُ.
- No tawassul/istighatha wording in this poem.
