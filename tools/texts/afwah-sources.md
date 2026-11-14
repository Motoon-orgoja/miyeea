# Texts report — دالية الأفوه الأودي «فينا معاشر لم يبنوا لقومهم» (`afwah.txt`)

The poem of «لا يصلح الناس فوضى لا سراة لهم» (v. 8). Scripts: `jahili-build/` (`cfg-afwah.js`, `dec-afwah.js`, `build.js`, `meter.js`, `bare.js`). Log: `jahili-build/out/afwah-build-log.txt`; order of the witnesses: `out/afwah-order.json`. Raw pages: `raw/afwah/`.

## 1. Sources
- **Base (A), vocalized:** aldiwan.net = الموسوعة الشعرية, https://www.aldiwan.net/poem651.html (the same text is «ديوان الأفوه الأودي» on shamela 14278, pp. 12–13). 17 verses. Its convention (no sukun, no vowel before a madd letter, no shadda on a sun letter after the article) was completed mechanically (`complete()`): fatha/kasra/damma before a madd letter 108, sukun 115 (17 on the article, 15 diphthongs), sun-letter shadda 8.
- **Q, partly vocalized:** «أمالي القالي» (shamela 9160, pp. 508–509): https://shamela.ws/book/9160/508 — the poem as القالي read it to ابن دريد (15 verses), with the readings of ابن الأنباري and the two verses he added («وإن تجمّع أقوام ذوو حسب»، «فالخير تزداد منه»). A follows ابن الأنباري's riwaya.
- **I, unvocalized:** الأخفش الأصغر «الاختياريْن» (المفضليات والأصمعيات), تحقيق فخر الدين قباوة (shamela 136, pp. 67–71): https://shamela.ws/book/136/67 — 10 verses.
- **B, partly vocalized:** «الحماسة البصرية» (shamela 6901, pp. 351–353): https://shamela.ws/book/6901/352 — 9 verses (5–6, 8–10, 12–15).

## 2. Count
**17 verses** = Q's 15 + ابن الأنباري's two. Verses 12–13 («كيف الرشاد إذا ما كنت في نفر»، «أعطوا غواتهم جهلًا مقادتهم») are not in Q or I but are in B, لباب الآداب للثعالبي and المعمرون والوصايا (and quoted by the grammarians), so they were kept. Nothing was excluded.

## 3. Wording
Changed in A (the classical witnesses agree against it):
| v. | A | adopted | witnesses |
|---|---|---|---|
| 1b | وَإِنَّ بَني قَومِهِم | **وَإِنْ بَنَى قَوْمُهُمْ** | Q + I; I's gloss: «عادوا على الشرف الذي بناه آباؤهم فهدموه» |
| 2b | فَالغَيُّ … وَالجَهلُ | **فَالْجَهْلُ … وَالْغَيُّ** | Q + I |
| 9a | بِأَهلِ الرُشدِ | **بِأَهْلِ الرَّأْيِ** | Q + I + B |
| 9b | فَإِن تَوَلَّوا | **فَإِنْ تَوَلَّتْ** | Q + I + B (the subject is «الأمور») |

Readings of A kept: 1a «لَمْ يَبْنُوا» (= Q; I «لن»); 3 «كَانُوا كَمِثْلِ لُقَيْمٍ … بِالَّذِي قَدْ قَدَّمَتْ عَادُ» (ابن الأنباري's reading in Q; Q's main text and I: «أضحوا كقيل بن عتر/عمرو … بالذي سدّى لها عاد»); 8a «النَّاسُ» (= Q, B; I «القوم»); 9a «تُلْفَى» (= B; Q «تبقى», I «تلقى»); 11a «تَلْقَى» (= I; Q «يلقى»); 12a «فِي نَفَرٍ» (B «من نفر»); 16a «النَّجَاةَ … ذَا بَصَرٍ» (Q «النجاء … ذا نفر»); 17a «وَالْخَيْرُ» (Q «فالخير»); 17b «قَلَّ مَا» (Q «قلّما»).

## 4. Harakat
- A **62.7%** as printed → **100%** (553/553) after completing its convention; `bare.js`: no letter left bare. No mark was taken from a witness (Q, I, B are partly vocalized at best).
- **Corrected in A:** 1a لِقَوْمِهِمُ (kasra on the ق), 2a يَرْشُدُونَ، لِمُرْشِدِهِمْ (A leaves the last letters bare), 4a بَعْدَهُ كَقُدَارٍ (bare ه; kasra on كاف التشبيه), 10b ذَاكَ, 13a غُوَاتَهُمُ (fatha on the ه; الدر الفريد «غُوَاتَهُمُ», read with إشباع for the meter).
- Split word (تدوير), «ـ | ـ» as in the other texts: 11 «لَدَى الْـ | ـإِبْرَامِ» (A prints «لدى ال | إبرام»).
- Marks against Q: 6 (Q drops the tanwin of «عمدٌ، أوتادٌ، وأعمدةٌ، وساكنٌ، أقوامٌ», which the meter needs).
- **Meter (البسيط، الضرب مقطوع فَعْلُن):** 34 of 34 hemistichs pass.

## 5. To verify
- 16a «النَّجَاةَ … ذَا بَصَرٍ» (A) against Q «النَّجاءَ … ذا نَفَر»: only Q has the verse besides A.
