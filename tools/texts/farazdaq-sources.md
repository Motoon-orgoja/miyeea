# Texts report: ميمية الفرزدق في زين العابدين «هذا الذي تعرف البطحاء وطأته» — `farazdaq.txt`

Scripts: `poems7-build/` (`fetch.js`, `fetchsh.js` → `raw/farazdaq/`; `parse.js` + `parse-farazdaq.js` → `out/farazdaq.json`; `collate.js` → `out/farazdaq.collation.txt`; `build.js` + `cfg.js` → the text and `out/farazdaq.build-log.txt`; `meter.js`).

## 1. Sources
- **Base (B), printed, fully vocalized (28 verses):** «البداية والنهاية» لابن كثير، ت التركي, ترجمة علي بن الحسين (shamela 4445, pp. 7431–7433): https://shamela.ws/book/4445/7431
- **K, printed, unvocalized (27 verses):** «وفيات الأعيان» لابن خلكان، ت إحسان عباس, ترجمة الفرزدق (shamela 1000, pp. 2515–2516): https://shamela.ws/book/1000/2515
- **A, partly vocalized (40 verses):** aldiwan.net, the diwan text (27 verses) followed by a later 13-verse extension: https://www.aldiwan.net/poem5493.html (Wikisource «قصيدة الفرزدق في علي بن الحسين» is a copy of A, verse for verse, so it was not counted as a witness.)
- **H, printed, vocalized selection (12 verses):** «الحماسة المغربية» للجراوي (shamela 6902, pp. 128–129).

## 2. Count
**29 verses** = the 28 of ابن كثير in his order + the verse «ما قال لا قطّ إلا في تشهّده» (v. 11), which K and A print right after «حمّال أثقال أقوام» and which is too well known to leave out. The diwan and ابن خلكان have 27. Not included: A vv. 28–40 (a repetition of earlier verses with variants, then «بيوتهم من قريش … لم أكتم كما كتموا», a later addition absent from B, K and H), A v. 17 variant «ذروة الدين … وعن إدراكها القدم», and H's opening «هذا سليل حسين وابن فاطمة».

## 3. Wording
Changed from B where the other witnesses agree against it (the circulated wording):

| v. | Adopted | B | Witnesses |
|---|---|---|---|
| 7a | رِيحُهُ عَبِقٌ | ريحها | K + A + H |
| 8b | عَنَاصِرُهُ | عناصرها | K + H (A «مغارسه») |
| 9a | يَنْشَقُّ نُورُ الْهُدَى عَنْ نُورِ غُرَّتِهِ | ينجاب … من | K (A «ينشقّ ثوب الدجى عن») |
| 9b | الظُّلَمُ | القتم | K + A |
| 13a | شَرَّفَهُ قِدْمًا وَعَظَّمَهُ | فضّله قدمًا وشرّفه | K + A |
| 15b | وَالْإِمْلَاقُ وَالْعَدَمُ | والظلم | K + A |
| 16b | وَلَا يَعْرُوهُمَا عَدَمُ | العدم | K + A |
| 17b | حُسْنُ الْخُلْقِ وَالشِّيَمُ | والكرم | K + A |
| 21b | فِي كُلِّ بَدْءٍ | حكمٍ | K + A (H «أمرٍ») |

B kept: 4 «ذروة العزّ … عرب الإسلام والعجم» (= K, H) · 7a **بِكَفِّهِ** (= A; K + H «في كفّه») · 10a فُدِحُوا (= K; A «افتُدحوا») · 14b دانت **لها** (A «له») · 15b **الْغَيَابَةُ** (K «الغياية», A «الغياهب») · 16 نَفْعُهُمَا يَسْتَوْكِفَانِ (A «يُستوكفان», K «تستوكفان») · 18a **مَيْمُونٌ** نقيبته (K «مأمون») · 20a يُسْتَدْفَعُ **السُّوءُ** (A «الشرّ») · 23a بُعْدَ غايتهم (A «بعد جودهم») · 25a يأبى **لهم** (K drops it, against the meter) · 26a لا **يَنْقُصُ** (A second copy «يقبض») · 27a أيّ **الخلائق** (= K, A; H «القبائل») · 28a **فليس** (= K; A «وليس») · 29 مَنْ **يَعْرِفِ** اللهَ (= K; A «يشكر») **فالدين** (K «والدين»).

## 4. Harakat
- B is fully vocalized (99.6% with the inserted verse, **100%** in the result). **Marks supplied: 11**, all in v. 11 (from A, which leaves «ما قال لا … إلّا», the two shaddas of «التَّشَهُّدُ» and three madd vowels unmarked).
- **Corrected (5):**
  - 10a فُدِحُوَا → **فُدِحُوا** (stray fatha).
  - 15a الْبَرِّيَّةَ → **الْبَرِيَّةَ** (does not scan otherwise; = A).
  - 19b كَفْرٌ → **كُفْرٌ** (= A).
  - 19b وَقُرْبُهُمْ → **وَقُرْبُهُمُ** (meter; = A).
  - 26b سِيَّانَ → **سِيَّانِ** (dual, nominative; = A).
- **Meter (البسيط، الضرب مخبون):** 58 of 58 hemistichs pass the scanner.

## 5. To verify / needs a decision
- 17b حُسْنُ **الْخُلْقِ** (B, with sukun, required by the meter); A has «الخَلق».
- 19b مَنْجَى: B without tanwin; A «مَنجًى» (the grammatical form). Left as in B; the scansion is the same.
- Attribution: أبو الفرج and الآمدي give vv. 6–7 («يغضي حياءً», «بكفّه خيزران») to الحزين الكناني in praise of an Umayyad; the poem as a whole is transmitted for الفرزدق.
- Content: the praise of آل البيت in vv. 19–21 («حبّهم دين وبغضهم كفر», «مقدَّم بعد ذكر الله ذكرهم») is the text ابن كثير himself transmits; nothing was removed.
