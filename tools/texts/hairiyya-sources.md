# Texts report — المنظومة الحائية لابن أبي داود (`hairiyya.txt`)

Comparison method: each witness was parsed into verses, stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, and every hemistich was aligned word by word against the base with an LCS script (no comparison by eye). A second script compared the vocalization letter by letter wherever a witness has the same word.
Scripts: `tools/texts/hairiyya-build/` (`parse.js` → `out/sources.json`, `collate.js` wording, `harakat.js` vocalization, `build.js` writes `hairiyya.txt` and logs every change). Raw downloads: `tools/texts/raw/hairiyya/`.

## Sources
- **Base (wording + vocalization): المكتبة الشاملة 145171** «نثر الورود شرح حائية ابن أبي داود», د. عبد الرحمن بن عبد العزيز العقل, section «نظم الحائية», pages 5–6: https://shamela.ws/book/145171/5 … /6. Fully vocalized, 33 verses. The only bare words were لفظ الجلالة and a few particles (see below).
- **Check 1 (vocalized): جامع الكتب الإسلامية (ketabonline) 102826** «المنظومة الحائية في السنة», read and annotated by هانئ بن عبد الله بن جبير (مجلة الحكمة). A critical text from ابن شاهين، طبقات الحنابلة، السير، العلو، المنهج الأحمد، مختصر الشطي، لوائح الأنوار. It has 36 verses: verses 19–21 are printed in parentheses as an addition found only in ابن شاهين، لوائح الأنوار and الشطي. https://ketabonline.com/ar/books/102826
- **Check 2 (vocalized): المكتبة الشاملة 30039** «توضيح المقصود من حائية ابن أبي داود», الشيخ عبد الرحمن البراك (ط. ٢، ١٤٤٤هـ), «نص المنظومة الحائية», pages 5–11: https://shamela.ws/book/30039/5. A fuller recension of 40 verses (with the additions of ابن شاهين in brackets and footnotes on the readings of the الشطي and محمد عبد السلام prints).
- **Check 3 (unvocalized): المكتبة الشاملة 7575** «التحفة السنية شرح منظومة ابن أبي داود الحائية», الشيخ عبد الرزاق البدر, «نص المنظومة», pages 7–8: https://shamela.ws/book/7575/7. 33 verses. (This print swaps the second hemistichs of verses 2 and 3; the parser puts them back.)
- **Not used:** ketabonline 18368 «حائية ابن أبي داود في السنة» (الشاملة الذهبية) is unvocalized and has typos («وانهم للرهط»، «لا تك مرجيا»). Shamela 23408 (الخضير) is a lesson transcript.

## Count
- **33 verses** ✔. This is the count of the text as explained in the common commentaries (البدر، العقل، الفوزان، ابن جبرين), and it is what the base, البدر and ابن جبير (without his bracketed additions) have.
- Longer recensions: ابن جبير 36 (adds «وعائشُ أمُّ المؤمنين…»، «وأنصارُه والهاجرون…»، «ومن بعدهم والتابعون…» from ابن شاهين/لوائح الأنوار/الشطي). البراك 40 (adds those three plus «وسبطي رسول الله…» and the three verses «ومالكُ والثوريُّ…»، «ومن بعدهم فالشافعيُّ وأحمدٌ…»، «أولئك قومٌ…» from ابن شاهين). These additions were **not** included, since the brief asks for the well-known text. Tell me if the site wants the 36-verse text.
- The poem has no section headings, so the file has one «## المنظومة» line (as in `bayquniyya.txt` and `gharami.txt`).

## Wording differences (all kept as in the base)
| Verse | Base (= البدر unless noted) | Other reading | Why the base was kept |
|---|---|---|---|
| 2 | تَنْجُو وَتَرْبَحُ | تَنْجُ (ابن جبير، البراك — from العلو) | Both fit the meter. تنجو is in البدر, العقل and «عامة المراجع» (ابن جبير's own note); تنجُ is the grammatical choice of the editors. |
| 5 | خَلْقٌ قَرَأْتُهُ | خلقًا (ابن جبير); قُرَانُه (البراك); قراءته / قراءة / قرائه in other prints (their footnotes) | The base reading is the one in البدر and the common prints. |
| 13 | يَلْقَ غَافِرًا … فَيُمْنَحُ | يلقى (البدر — spelling); فأمْنَحُ (ابن جبير, = الشطي) | البراك and البدر have فيمنح. |
| 15 | عُثْمَانُ الارْجَحُ | أرْجَحُ (ابن جبير, from ابن شاهين) | All other witnesses have الأرجح. |
| 17 | وإِنَّهُمْ لَلرَّهْطُ … بالنُّورِ تَسْرَحُ | والرهطَ … في الخُلْدِ (ابن جبير، البراك) | البدر agrees with the base; ابن جبير notes «للرهط» in السير and المنهج الأحمد, and «بالنور» in السير and العلو. |
| 20 | آيٌ للصَّحَابَةِ | في الصحابة (ابن جبير) | البدر and البراك have للصحابة. |
| 24 | كَحِبِّ حَمِيلِ السَّيْلِ إذْ | كحبّةِ حَمْلِ (البراك); إذا (البدر) | ابن جبير agrees with the base; إذا breaks the meter. |
| 25 | وإِنَّ رَسُولَ اللَّهِ | فإنّ (ابن جبير) | البدر and البراك have وإن. |
| 28 | وَلَا تَكُ مُرْجيًّا | ولا تكن (البدر) | تكن breaks the meter. |
| 32 | تَلَهَّوْا | تلهَّوْ (ابن جبير) | Spelling only (واو الجماعة with its alif). |

## Vocalization completed or corrected (logged by `build.js`)
- **لفظ الجلالة** was printed bare (الله) in verses 1, 2 (twice), 5, 6, 23, 25, 31. Written as اللَّهِ / اللَّهُ, with the case ending that both vocalized witnesses (ابن جبير، البراك) give: اللَّهِ in 1, 2, 2, 5, 25, 31 and اللَّهُ in 6, 23.
- Bare particles given their only possible vowels: فِي (9, 25), لَا (14, 17), وَلَا (19, 22 twice, 28).
- **Correction — verse 27:** «مَقَالٌ **لَمَنْ** يَهْوَاهُ» → **لِمَنْ**. The preposition لام takes kasra here; ابن جبير has لِمَنْ.
- Commas and colons that the base puts inside some verses («وَقُلْ: إنَّ»، «الدِّينِ، والدِّينُ») were removed, as in the other poem files.

## Vocalization kept as in the base (witnesses differ)
- 3: «وَقُلْ **غَيْرُ** مَخْلُوقٍ كَلامُ مَلِيكِنَا». البراك has غيرَ. Both readings are grammatical.
- 5: «قَرَأْتُهُ». ابن جبير has قرأتَهُ.
- 6: «كَمَا الْبَدْرُ». البراك has البدرِ (ما زائدة).
- 26: «ولاَ **تُكْفِرَنْ** أَهلَ الصَّلاةِ». The base and البراك have تُكْفِرَنْ (from أكفر, to call someone a kafir), and only this form fits الطويل: «وَلَا تُكْ | فِرَنْ أَهْلَصْ…». ابن جبير's «تُكْفِّرَنَّ» is a misprint.
- 14: «حَدِيثُهُمْ» (ابن جبير «حديثَهم» is a misprint); 24: «كَحِبِّ» (ابن جبير «كَحَبِّ»; the hadith has الحِبّة).
- Several letters lack a mark in the base (for example «الجهْمِيُّ»، «تنْجَحُ»، «المبِينُ»، «الحدِيثِ»). They were left as they are.

## مواضع للتأكد
- 11: «الْوَاحِدُ **الْمُتَمَدَّحُ**» (base, passive). ابن جبير and البراك both have **المُتَمَدِّحُ** (active). I kept the base. Change it if your teacher reads المتمدِّح.
- 15: «وَزِيرَاهُ **قِدْمًا**» (base). ابن جبير and البراك both have **قُدْمًا**. I kept the base.
- 17: «وإِنَّهُمْ» (base, sukun). ابن جبير and البراك both have «وإنَّهُمُ» (damma on the mim). I could not settle it by the meter, so I kept the base and flag it.
