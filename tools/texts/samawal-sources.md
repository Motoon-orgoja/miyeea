# Texts report: لامية السموأل «إذا المرء لم يدنس من اللؤم عرضه» — `samawal.txt`

Scripts: `poems6-build/` (`parse.js` → `out/samawal.json`, `collate.js` → `out/samawal.collation.txt`, `build.js` + `cfg.js` → the text and `out/samawal.build-log.txt`, `meter.js`). Raw files: `raw/samawal/`.

## 1. Sources
- **Base (W), vocalized:** Wikisource, the text of «الموسوعة الشعرية» (23 verses): https://ar.wikisource.org/wiki/إذا_المرء_لم_يدنس_من_اللؤم_عرضه
- **A, vocalized, same origin:** aldiwan.net (21 verses; it drops verses 14 and 23): https://www.aldiwan.net/poem1201.html. A and W are two copies of one digitization, so A is not an independent witness; it served to check the marks.
- **Check (M), printed, unvocalized, independent:** «شرح ديوان الحماسة» للمرزوقي, الحماسية 15 (ketabonline 3292, pp. 65–76): https://ketabonline.com/ar/books/3292. The verses are the lemmas of the commentary, extracted by script.

## 2. Count
**23 verses.** M (the Hamasa) has 22: all of them except verse 8 «هو الأبلق الفرد», which belongs to the diwan tradition of السموأل (الأبلق is his castle). The usual count «22» is the Hamasa's; the diwan text adds the Ablaq verse. A (aldiwan) lacks verses 14 «علونا إلى خير الظهور» and 23 «فإن بني الديان»; both are in W and in M. Order of W = order of M.

## 3. Wording (W against M)
| v. | Adopted | Other | Why |
|---|---|---|---|
| 23a | بَنِي **الدَّيَّانِ** (M) | W «الريّان» | The Hamasa reading and the circulated one (بنو الديّان of بني الحارث بن كعب). **Changed from the base.** |
| 2a | وَإِنْ هُوَ لَمْ يَحْمِلْ (W) | M «إذا المرء لم يحمل» | circulated text |
| 4a | مَنْ كَانَتْ (W) | M «كان» | circulated text |
| 9a | لَا نَرَى (W) | M «ما نرى» | circulated text; both are transmitted |
| 12b | غَيْرِ الظُّبَاتِ (W) | M «غير السيوف» (and M notes «حد السيوف» for 12a) | circulated text |
| 16a | وَنُنْكِرُ (W) | M «ننكر» (خَرْم) | circulated text |
| 20a | شَرْقٍ وَمَغْرِبٍ (W) | M «غربٍ ومشرقٍ» | circulated text |
| 21a | مُعَوَّدَةٌ (W) | M «معوّدةً» (حال; المرزوقي allows the رفع too) | base kept |
| 22 | وَعَنْهُمُ فَلَيْسَ (W) | M «وعنكم وليس» | circulated text |

Not variants: 4b للعلا / للعلى (spelling), 13a M «نكد» and 20b M «الدار عين» (typos of the digital copy), 16a M «شينا».

## 4. Harakat
- The base marks every vowel except the one implied by a madd letter, writes no sukun, and no shadda on a sun letter after the article. These were restored mechanically (`build.js`, `complete()`): fatha/kasra/damma before a madd letter 161, sukun 96 (12 on the article), shadda of sun letters 14. **Coverage: 66.5% → 100%.**
- **Corrected:**
  - 1a يُدنَس → **يَدْنَسْ** (دَنِسَ يَدْنَسُ, «عرضُه» is the subject; = A).
  - 6b وَهُوَ → **وَهْوَ** (the hemistich does not scan with وَهُوَ).
- **Meter (الطويل، الضرب محذوف):** 46 of 46 hemistichs pass the scanner.

## 5. To verify
- 23a قَطْبٌ: the base has fatha on the ق. قُطْب is the commoner form (the word is مثلّث القاف). Base kept.
- Attribution: the Hamasa gives the poem to عبد الملك بن عبد الرحيم الحارثي and adds «ويقال إنه للسموأل». It is kept under السموأل, as asked.
