# Texts report — «أيها الولد» لأبي حامد الغزالي (`ayyuhalwalad.json`)

Method: every witness was turned into a word list and compared word by word with an LCS script after removing harakat/tatweel and unifying alef/yaa/taa-marbuta (no comparison by eye). For each base stretch the script shows what every witness reads there (`tazkiya-build/support.js` → `out/a-support.txt`); every stretch the base has alone was reviewed.
Scripts: `tools/texts/tazkiya-build/` — `openiti-clean.js` (OpenITI → plain lines), `ko-text.js`, `collate-prose.js`, `support.js`, `quran-cite.js`, `paras-q.js` (paragraphs; never cuts inside «» or ﴿﴾), `ayyuha-build.js` (fixes, Quran, chapters, paragraphs). Full log: `out/ayyuhalwalad-build.log`. Raw downloads: `tools/texts/raw/ayyuhalwalad/`.

## Sources
- **Base (wording): «مجموعة رسائل الإمام الغزالي», دار الفكر، بيروت ١٤١٦هـ** — the Shamela text (OpenITI `0505Ghazali.MajmucatRasail.ShamAY0034797`, section «أيها الولد»): https://github.com/OpenITI/0525AH/blob/master/data/0505Ghazali/0505Ghazali.MajmucatRasail/0505Ghazali.MajmucatRasail.ShamAY0034797-ara1. This is the complete Arabic text with the student's preface («خطبة الرسالة»). Unvocalized. (OpenITI `Rafed0003457` is the same digital text: 3 hunks in 4455 words — not counted as a witness.)
- **Check 1: دار المقطم، تحقيق نجاح عوض صيام** — archive.org `ayyuhalwalad_20190829` (OCR `djvu.txt`). Same textual family as the base; it agrees with the base on 95%+ of the hunks against the other witnesses.
- **Check 2: ketabonline 12593** «أيها الولد» (دار ابن حزم، from الشاملة الذهبية): https://ketabonline.com/ar/books/12593 — the other textual family (as Dar al-Minhaj); careless digital copy with typos and inline notes, used only to arbitrate.
- **Check 3: دار المنهاج** (vocalized print) — archive.org `20261101_20261101_0535` and `62441` (OCR). OCR too noisy to transmit harakat; used to arbitrate wording.
- Wikisource «أيها الولد» (`raw/ayyuhalwalad/wikisource.wiki`) is an abridged, partly vocalized transcription — not used.
- Quran: api.quran.com `text_imlaei` (cached in `raw/ayyuhalwalad/quran/`).
- **No fully vocalized digital text exists** (Dar al-Minhaj's vocalized edition is only available as a scan). The text is therefore delivered **unvocalized: 0% outside the Quran** (0/15406 letters), for the later vocalization step.

## Count and structure
- 4449 words, **170 paragraphs**, 9 chapters (8–45 words per paragraph). The risala has no headings of its own besides «خطبة الرسالة» (Dar al-Fikr's heading for the preface). The other eight titles are **editorial, unvocalized**, grouping the «أيها الولد» sections in order: «العلم والعمل»، «إحياء الليل والاستعداد للموت»، «الطاعة وما يجب على السالك»، «حديث الشبلي وفوائد حاتم الأصم الثماني»، «الشيخ المرشد والتصوف والعبودية»، «الأربعة التي تدعها»، «الأربعة التي تعملها»، «الدعاء».
- Each verse of poetry is its own paragraph, hemistichs separated by « … » (4 Arabic verses + 1 Persian verse).
- The text has no punctuation problems beyond quotation marks: «"…"» and «(…)» around sayings → «…».

## Wording — corrections of the base (each attested by the witnesses)
| Base (Dar al-Fikr digital) | Adopted | Witnesses |
|---|---|---|
| اعلم أيها الولد المحب أطال | المحب **العزيز** أطال | Muqattam, ko, Minhaj |
| فصل النفس | فضل النفس | all |
| باستعمالها (شعر): | باستعمالهما. | ko, Minhaj (dual: two remedies); label «(شعر)» removed |
| أكثر من أن يحصى إن كان | … **وإن** كان | all |
| خائنا مفلسا | خائبا | ko, Minhaj |
| أربعين سؤالا، لله أوله | أربعين سؤالا، أوله | all lack «لله» |
| وقال عليه السلام لرجل | عليه الصلاة والسلام | all |
| وتترك ويكون باقتداء | وتترك يكون | Muqattam |
| وتذكر هاهنا نبدأ منه | ونذكر ههنا نبذا منه | Muqattam, ko |
| وزعم آخر … فافتخروا | آخرون | all |
| عداوة آخر غير الشيطان | عداوة أحد | all |
| شيخ يؤديه | يؤدبه | Muqattam (ko/Minhaj: يربيه) |
| عليه وأن يكون عالما | أن يكون | all |
| بمتابعته الشيخ | بمتابعة الشيخ | all |
| بما تعمل ليكشف | بما تعلم | all |
| تبلغ أو أنه | أوانه | ko, Minhaj |
| فيها آيات كثيرة | آفات | ko, Minhaj (base and Muqattam share the slip) |
| أما الذي لا يقبل" أحدها" | … لا يقبل: أحدها | stray quotes |
| **والرابع**: مما تدع وهو أن تحذر من أن تكون واعظا | **والثاني** | numbering slip (the base has «والرابع مما تدع» twice); ko: والثاني |
| في القيامة وموابقها | ومواقفها | ko, Minhaj («موابقها», also in Muqattam, has no sense) |
| وإعلامهم الخلق | وإعلام الخلق | all |
| التمس حرارة | لتمس | Muqattam, ko |
| والاستعثار بالأخلاق | والاشتغال | all |
| وينظروا الحرص | ويظهروا | ko, Minhaj |
| عن طريق ويهلكهم | عن الطريق | all |
| ما يفيد هذا القائل | ما يفسد | ko, Minhaj |
| لا يستطيع يمله | بمثله | all |
| ومجالسهم، أحببته، الظالم (على عباد الله)، أعناق كثيرة | ومجالستهم، أحببتهم، الظلم، كثير | all |
| أضر من هذا الدين | أضر من هذا **على** الدين | ko (Minhaj: للدين) |
| بعلم الفقه **والأخلاق** والأصول | **والخلاف** | ko, Minhaj — the base reading (also Muqattam) contradicts the next sentence, which sends him to the knowledge of the heart |
| ما ذا | ماذا | spelling |

Kept from the base (the family of Dar al-Fikr / Dar al-Muqattam) where the other family differs (examples; full list `out/a-support.txt`, hunks flagged `-+`): «قدس الله روحه»، «ويؤانسني في قبري»، «النصيحة سهلة … مرة»، «طالب العلم الرسمي مشتغل»، «ركيعات»، «من موت سعد»، «سبعين سنة»، «رضيت بطاعة الله سبحانه وتعالى»، «يختارك وزيرا» (ko/Minhaj: يجيئك زائرا)، «منابر المواعظ» (ko/Minhaj: المسلمين)، «الأمر الأول»، «إلى الدينار…»، «يا عليم» (ko/Minhaj: يا حليم).

## Quran
26 citations put in ﴿﴾ with the Mushaf text, editorial references «[سورة: n]» removed. Notable: الفرقان ٧٠ — the base drops «عملا» (Mushaf «وَعَمِلَ عَمَلًا صَالِحًا»); آل عمران ١٧ «والمستغفرون بالأسحار» → ﴿وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ﴾; الأعراف ٥٦ «رحمة الله قريب» → ﴿رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ﴾; also bracketed the unmarked ﴿فَارْجِعْنَا نَعْمَلْ صَالِحًا﴾، ﴿ارْجِعِي إِلَىٰ رَبِّكِ﴾، ﴿أَفِيضُوا عَلَيْنَا…﴾، ﴿وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ﴾، ﴿وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ﴾ and ﴿لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ﴾ (الأنبياء ٨٧, in the closing du'a). الروم ٩ / غافر ٢١ (same words) given once.

## مواضع للتأكد
- **Persian verse** «گر مى دو هزار رطل همى پيمائى … تا مى نخورى نباشدت شيدائي» is in every edition and is kept (its own paragraph, with گ/پ). The owner may prefer to drop it from a memorization text.
- «والأخلاق» → «والخلاف» and «وموابقها» → «ومواقفها» override the base family (Dar al-Fikr + Muqattam) for sense; reversible in `ayyuha-build.js`.
- Other family differences kept from the base that a teacher may prefer from Dar al-Minhaj: «النصيحة سهلة» (Minhaj: سهلٌ)، «يختارك وزيرا» (Minhaj: يجيئك زائرا)، «ينزله عن منابر المواعظ» (Minhaj: المسلمين).
- «أو قال بعض الناس لك» (base and Muqattam) is awkward; ko/Minhaj: «أو قولُ بعض الناس». Kept.
- حُذفت الفقرة الفارسية (بيت فارسي) لأن النص للحفظ بالعربية (قرار ٢٠٢٦-١١-٠٦).

## التشكيل (٢٠٢٦-١١-٠٦)
شكّل الذكاء الاصطناعي النص كاملًا (حركات فقط، وفُحصت الحروف بسكربت)، وصُحّح «إطلاعهم» إلى «اطِّلَاعُهُمْ» (من اطّلع). ويحسن مراجعته على طبعة دار المنهاج المشكولة.
