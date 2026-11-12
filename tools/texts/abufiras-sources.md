# Texts report: رائية أبي فراس الحمداني «أراك عصيّ الدمع شيمتك الصبر» — `abufiras.txt`

Scripts: `poems6-build/` (see `samawal-sources.md`). Raw files: `raw/abufiras/`. Collation: `poems6-build/out/abufiras.collation.txt`; build log: `out/abufiras.build-log.txt`.

## 1. Sources
- **Base (A), vocalized:** aldiwan.net, the text of «الموسوعة الشعرية» (54 verses): https://www.aldiwan.net/poem25258.html
- **W, vocalized (54 verses):** Wikisource: https://ar.wikisource.org/wiki/أراك_عصي_الدمع_شيمتك_الصبر
- **W2, partly vocalized (30 verses):** Wikisource, a second page: https://ar.wikisource.org/wiki/أراك_عصي_الدمع
- **H, printed, vocalized, two selections (18 verses):** «الحماسة المغربية» للجراوي (shamela 6902, pp. 959–960 and 672): https://shamela.ws/book/6902/959
- **N, printed, unvocalized, a selection (8 verses):** «نفح الأزهار في منتخبات الأشعار» (shamela 28175, p. 14).
- No digital copy of the diwan (ed. سامي الدهان, or the رواية of ابن خالويه) was found on shamela or ketabonline, so no complete printed witness was collated.

## 2. Count
**54 verses** in A and W, same order: the known count of the long version of the diwan.

## 3. Wording
| v. | Adopted | A reading | Why |
|---|---|---|---|
| 25b | أَعْجَزَهُ **الْحُضْرُ** | الخُضرُ | W + W2. الحُضْر = العَدْو; A is a dotting typo |

Spacing of A corrected from W (16 places, listed as SPLIT in the build log): لايُذاع → لا يُذاع, ماقال → ما قال, ويارُبّ → ويا رُبّ, etc.

A kept (see §5 for the ones worth a look): 12a فإن **يَكُ** ما قال (A + H; W + W2 «كان») · 14b كما **أَرِنَ** (W + W2 «يأرن») · 25a **ترنو كأنّها** (W + W2 «تدنو كأنّما») · 34b **جافي** اللقاء (W «جهمُ») · 35b لأبياتها (W «لأثوابها») · 47a سيفٍ (W «سيفي») · 5a بالوصل (N «بالوعد») · 16a وشاء لها الهوى (N «وشاء الهوى لها») · 20b الهجر (W2 «الفكر») · 22b البين أنساني (W2 «الهمّ أسلاني») · 23b وليَ العذر (W2 «ولا»).

## 4. Harakat
- A's convention was completed mechanically (as in `ammuriyya-sources.md` §4) and every mark was compared by script with W, W2 and H. **Coverage: 66.6% → 100%.**
- **Corrected:**
  - 5b مِتَّ → **مِتُّ** (first person; = W2, H).
  - 11b حُبَّكِ → **حُبُّكِ** (mubtada after لولا; = H).
  - 13b لآنسةٍ (unvocalized in A) → **لِآنِسَةٍ**.
  - 16b أَيَّهُم → **أَيُّهُمْ** (= H).
  - 20a وَالجَدِّ → **وَالْجِدِّ** (opposite of الهزل; = W).
  - 26b لِيَعرِفُ → **لَيَعْرِفُ** (lam of emphasis after إنّ).
  - 41a يُعيبُني → **يَعِيبُنِي** (= W).
  - 41b خَيرَهُما → **خَيْرُهُمَا** (= W).
  - 45b عَمروُ → **عَمْرُو**.
  - 47b حُطَّمُ → **حُطِّمَ** (= W).
- **Meter (الطويل، الضرب صحيح):** 108 of 108 hemistichs pass the scanner.

## 5. To verify
- 12a يَكُ / كان, 14b أَرِنَ / يأرنُ, 25a ترنو كأنّها / تدنو كأنّما, 34b جافي / جهم: A against the two Wikisource pages. All scan. A kept; a printed diwan should decide.
- 6b وَأَحْسَنَ (A + W) against W2 «وَأَحْسَنُ». As اسم تفضيل it would be marfuʿ (خبر مقدّم). A kept.
- 8a غَادَةً (A) against W2 «غادةٌ». A kept.
- 43b وَالضَّرُّ (A + W): الضُّرّ is also possible. A kept.
- 27b and 28b both end in «النَّصْرُ» in A and W (إيطاء in the transmitted text).
