# Texts report: ميمية المتنبي «وا حرّ قلباه ممن قلبه شبم» — `waharraqalbah.txt`

Scripts: `poems6-build/` (`parse.js`, `collate.js`, `build-manual.js`, `cfg.js`, `meter.js`). The vocalized text is typed in `poems6-build/waharraqalbah.voc.txt` and checked by `build-manual.js`. Raw files: `raw/waharraqalbah/`. Collation (base A): `out/waharraqalbah.collation.txt`; log: `out/waharraqalbah.build-log.txt`.

## 1. Sources
- **Base (W), vocalized (69.6%), 38 verses:** Wikisource: https://ar.wikisource.org/wiki/وا_حر_قلباه_ممن_قلبه_شبم
- **A, partly vocalized (47.7%), 38 verses:** aldiwan.net: https://www.aldiwan.net/poem10521.html (here not the fully vocalized text of «الموسوعة الشعرية» but an edited copy; this is why W, the better vocalized one, is the base).
- **Z, critical edition, almost unvocalized, 37 verses:** «ديوان أبي الطيب المتنبي», ed. عبد الوهاب عزام (ketabonline 66865, pp. 324–328): https://ketabonline.com/ar/books/66865

## 2. Count
**38 verses** in W and A, same order. **Z (عزام) has 37: it lacks v. 15 «سيعلم الجمع ممّن ضمّ مجلسنا».** The verse is in the circulated text and in both vocalized witnesses, so it was kept; see §5. The order of the other 37 is the same in all three.

## 3. Wording
Rule: the majority of W, A and Z.

| v. | Adopted | Other | Why |
|---|---|---|---|
| 5a | **فَكَانَ** أَحْسَنَ | W «وكان» | A + Z |
| 17a | جُفُونِي | W «جفوفي» (typo) | A + Z |
| 30a | **مِنْ** شَرَفِي | A «عن» | W + Z |
| 34b | أَنْ لَا | A «ألّا» | spelling; W + Z |
| 1a, 2a, 5b | وَا حَرَّ، مَا لِي، مَا فِي | A «واحرّ، مالي، مافي» | spacing; W + Z |

Kept with W + A against Z: 8b يُوَارِيَهُمْ (Z تواريهم) · 19b يَبْتَسِمُ (Z مبتسمُ) · 23 الْخَيْلُ … وَالسَّيْفُ وَالرُّمْحُ (Z فالخيل … والحرب والضرب) · 32a يَقْتَضِينِي (Z تقتضيني). Typos of Z not counted (12b الخاصم, 20b والقدمث, 21a صرت, 23a والوحش, 26b لجر, 33a قومس).

## 4. Harakat
- No witness is fully vocalized, so the full vocalization is typed in `waharraqalbah.voc.txt` and checked by script against the marks of W, A and Z on the same word. **Coverage: 69.6% (W) → 100%.**
- Of the 1290 vowel marks, **915 are printed identically by W, A or Z**; 375 were supplied (sukun, the fatha before alef, the shadda of sun letters, and a few case endings that W leaves out).
- **Marks changed against a witness** (8, all in the log): typos of W (6a «الِّذي», 24b «منَّي», 37a «بأَيَّ», 37b «وِلا»); 25b **وِجْدَانُنَا** (A; W «وَجداننا»); 5a **كُلِّهِمِ** (W + Z; A «كلِّهِمُ»); 6a **يَمَّمْتَهُ** (W, addressed to سيف الدولة; A «يمَّمْتُه»). 36a **قَنَصَتْهُ** follows W (A «قنَّصَتْه»).
- **Meter (البسيط، الضرب مخبون):** 76 of 76 hemistichs pass the scanner.

## 5. Needs a decision
- **v. 15 «سَيَعْلَمُ الْجَمْعُ مِمَّنْ ضَمَّ مَجْلِسُنَا | بِأَنَّنِي خَيْرُ مَنْ تَسْعَى بِهِ قَدَمُ»**: in W and A, not in the edition of عزام (37 verses, the count asked for). It was kept because it is in the circulated text. To have the 37-verse text of the diwan, delete line 15 of `waharraqalbah.txt`.
- 19b يَبْتَسِمُ (circulated) against عزام «مبتسمُ»; 23 والسيف والرمح against عزام «والحرب والضرب».
