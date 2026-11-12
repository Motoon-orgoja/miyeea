# Texts report: عينية ابن زريق البغدادي «لا تعذليه فإن العذل يولعه» — `ibnzurayq.txt`

Scripts: `poems7-build/` (see `farazdaq-sources.md`); `parse-ibnzurayq.js`. Raw files: `raw/ibnzurayq/`. Collation: `poems7-build/out/ibnzurayq.collation.txt`; build log: `out/ibnzurayq.build-log.txt`.

## 1. Sources
- **Base (A), vocalized (40 verses):** aldiwan.net: https://www.aldiwan.net/poem13279.html
- **W, badly vocalized (39 verses):** Wikisource, the text of «الموسوعة الشعرية»: https://ar.wikisource.org/wiki/لا_تعذليه_فإن_العذل_يولعه
- **S, printed, unvocalized (38 verses):** «طبقات الشافعية الكبرى» للسبكي (shamela 6739, pp. 302–305), the poem with its isnad through الحميدي: https://shamela.ws/book/6739/302
- Only the first verse is quoted in «معاهد التنصيص» (shamela 6951, p. 634).

## 2. Count
**40 verses**, the count of the circulated text. W lacks v. 17 «وكم تشفّع بي»; S lacks v. 25 «ألا أقمتُ» and v. 31 «قد كنتُ من ريب دهري». Same order in the three.

## 3. Wording
The wording of A is kept everywhere: it is the circulated text, and W agrees with it except in three places. S is an older transmission that differs in some thirty words; it is recorded here and not adopted.

| v. | A (adopted) | Other |
|---|---|---|
| 2 | في **نُصحه** حدًّا **أضرَّ** به … أنّ **النصح** | S «لومه … يضرّ … اللوم» |
| 3b | من **عذله** | S «عنفه» |
| 4 | **بالخطب** يحمله / **فضُيِّقت** بخطوب **الدهر** | S «بالبين … فضُلِّعت بخطوب البين» |
| 5a | **لوعة التشتيت** | S «روعة التفنيد» |
| 6b | بالعزم **يُزمعه** | S «يجمعه» |
| 7 | **في** حلٍّ … بفضاء **الله** | S «من حلّ … بفضاء الأرض» |
| 8a | إذا **الزمانُ** | S «الزَّماع» |
| 10a | **تُوصله** | S «واصلةٌ» |
| 11 | **قد وزّع اللهُ** … **من خلقٍ** | S «واللهُ قسّم … مخلوقًا» |
| 12 | **كُلِّفوا** حرصًا … وسوى **الغايات** | S «مُلئوا … الفاقات» |
| 14 | **من حيث يمنعه / إرثًا ويمنعه من حيث يُطمعه** | S «ما ليس يطلبه / يومًا ويُطمعه من حيث يمنعه» |
| 16a | **لو** يودّعني | S «أن» |
| 19a | ثوب **الصبر** | S «العذر» |
| 20b | **عنه وجُرمي** | S «عنّي وقلبي» |
| 21a | **رُزقتُ** ملكًا | S «أُعطيت» |
| 22b | **فإنّ** الله ينزعه | S «فعنه» |
| 23b | **يُجرَّع** منها | W «أُجرَّع», S «تجرّع» |
| 24b | لست **أدفعه** | S «أرقعه» |
| 26a | **وأُنفقها** | S «وأُنفذها» |
| 27a | **بتُّ** له | S «أبتْ» |
| 28a | **لجنبي** | S «بجنبي» |
| 29a | أحسب **أنّ** الدهر | S «ريبَ الدهر» |
| 32a | منزلَ **العيش** | S «القصر» |
| 33b | **أمضته** | S «أمضت» |
| 37 | **لدهرٍ** … **ولا بيَ في حالٍ** يمتّعه | W «على دهر»; S «كما أنه بي لا يمتّعه» |
| 39b | **ستجمعني** | S «تجمعني» (short of a syllable) |
| 40 | وإن **تَنَلْ أحدًا** … **بقضاء** الله | W «تُغِلُّ» (for «تَغُلْ»); S «ينل أحدٌ … في قضاء» |

## 4. Harakat
- A marks every vowel except the fatha/kasra implied by a following madd letter, the sukun of the article and the shadda of a sun letter after it, and writes «الله» without marks. These were restored mechanically (`build.js`, `complete()`): **178 marks** (vowel before a madd letter 129, sukun of the article 23, shadda of a sun letter 11, «اللَّه» 10, sukun 5). The sukun A prints on madd letters («يُوْلِعُهُ») was dropped. **Coverage: 90% → 100%.**
- **Corrected (10):**
  - 1b قَلْتِ → **قُلْتِ**.
  - 4a مُضْطَلَعًا → **مُضْطَلِعًا** (اسم فاعل).
  - 13b بَغِيٌ → **بَغْيٌ** (meter).
  - 19a أَكَذِبُ → **أَكْذِبُ** (meter).
  - 20b عِنْهُ → **عَنْهُ**.
  - 22b شَكْرٍ → **شُكْرٍ**.
  - 24a لي → **لِيَ** (meter: كم قائلٍ لِيَ ذقتَ).
  - 26a لَأَقَطَعُ → **لَأَقْطَعُ** (meter).
  - 29b بِيَ → **بِي** (meter: أنَّ بي الأيامَ).
  - 35a لي → **لِيَ** (meter: من عنده لِيَ عهدٌ).
- W's marks are unreliable (43 conflicts, nearly all plain errors such as «الزَمانَ», «مُوَكَّلٍ», «يُسُوسُ»); none was adopted.
- **Meter (البسيط، الضرب مخبون):** 80 of 80 hemistichs pass the scanner.

## 5. To verify
- 21b يُخْلَعُهُ (A, passive: «he is stripped of it»); W «يَخلعُه» (الملكُ يخلعه). Both scan. A kept.
- 25a أَلَا أَقَمْتُ (A, first person, self-reproach continuing «لو أنني»); W «أقمتَ», and some editions read «أَلَّا أقمتَ» as the words of the «قائل» of v. 24. A kept.
- 24a ذُقْتَ البين (A, said by the «قائل» to the poet); W «ذقتُ».
- 6b / 8b يُزْمِعُهُ ends both verses in A and W (S has «يجمعه» in 6b).
