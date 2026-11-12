# Texts report: مختارات المدائح النبوية — القسم الأول: مدائح الصحابة والأوائل — `madaih-a.txt`

Nine pieces, 73 verses, each under its own `## الشاعر: المطلع` heading. Scripts: `madaih-a-build/` (`fetch.js`, `fetchsh.js`, `shsearch.js`, `parse.js`, `meter.js`, `build.js`; log in `out/build-log.txt`). Raw downloads: `raw/madaih-a/`.

Method: every piece follows **one** printed witness (the base) for its wording and order; nothing is composed or patched between recensions. The base was collated word by word by script (LCS on normalized words) against the other witnesses; the few places where the base was changed are listed in §3–4 with the reason.

## 1. Sources
| Tag | Source | Vocalization |
|---|---|---|
| H | «سيرة ابن هشام» ت السقا ورفاقه — shamela 23833 (https://shamela.ws/book/23833), pages 295–304, 409–411, 1159–1161, 1403–1406 | full (the shamela file has a few typing slips) |
| K | «البداية والنهاية» لابن كثير ت التركي (هجر) — shamela 4445 (https://shamela.ws/book/4445), pages 1855–1861, 1969–1971, 3467–3469, 3700–3701, 4350–4353, 5247 | full |
| A | aldiwan.net («الموسوعة الشعرية»): poems 21027 (أبو طالب), 21418, 21530, 21233, 21547 (حسان), 77075 (ابن رواحة), 21923 (الأعشى) — https://www.aldiwan.net/poem21027.html etc. | its own convention (completed mechanically, as in `shafiidiwan`) |
| W | ar.wikisource.org, the diwan pages «أغر عليه للنبوة خاتم», «وأحسن منك لم تر قط عيني», «عفت ذات الأصابع فالجواء», «بطيبة رسم للرسول ومعهد», «ألم تغتمض عيناك ليلة أرمدا» | partial |
| B | «صحيح البخاري» ط السلطانية — shamela 1681, hadith 1155 (page 1874) and 1008–1009 (page 1641) | full |
| S | «سير أعلام النبلاء» ط الرسالة — shamela 10906, pages 2082–2083 | full |
| F | «الشفا» للقاضي عياض — shamela 23645, pages 314–315 | full |
| I | «الاستيعاب» ت التركي — shamela 1499, pages 1094–1095 | partial |
| L | «اللؤلؤ المكنون في سيرة النبي المأمون» — shamela 38114, page 79 | full |
| M | «مغني المحتاج» — shamela 11444, page 12 | full |

## 2. Pieces, base, count
| # | Piece | Meter | Verses | Base (verses taken) | Collated with |
|---|---|---|---|---|---|
| 1 | أبو طالب: وأبيض يستسقى الغمام بوجهه (من اللامية) | الطويل | 15 | H 28–29, 35–37, 82–91 | K, A |
| 2 | حسان: أغر عليه للنبوة خاتم | الطويل | 6 | W order 1–6; marks from L (1–4) and A (5–6) | W, K, A |
| 3 | حسان: وأحسن منك لم تر قط عيني | الوافر | 2 | A 1–2 | W, M |
| 4 | حسان: هجوت محمدًا فأجبت عنه (من الهمزية) | الوافر | 10 | A 19–27, 31 | W, H, K |
| 5 | حسان: بطيبة رسم للرسول ومعهد | الطويل | 13 | H 1–6, 18–22, 25, 36 | K, A, W |
| 6 | ابن رواحة: وفينا رسول الله يتلو كتابه | الطويل | 3 | B (whole, as in the hadith) | A |
| 7 | العباس: من قبلها طبت في الظلال | المنسرح | 7 | S (whole) | F, I, K |
| 8 | كعب بن زهير: بانت سعاد (أبيات المديح) | البسيط | 10 | `banatsuad.txt` verses 39–44, 51–54, **verbatim** | see `banatsuad-sources.md` |
| 9 | الأعشى: ألم تغتمض عيناك (أبيات المديح) | الطويل | 7 | H 11–17 | K, A, W |

Verses left out inside a piece are whole verses (war threats and satire in the Lamiyya, the lion passage of Kaʿb, the elegiac middle of «بطيبة رسم»); the order is always that of the base.

## 3. Wording
| Place | Chosen | Other reading | Reason |
|---|---|---|---|
| أبو طالب 5a | الْهُلَّاكُ | H file «الهُلَّافُ» | typing slip of the shamela file; K + A |
| أبو طالب 10a | بِسُبَّةٍ | H «بِسُنَّةٍ» | H follows one manuscript and notes «في سائر الأصول: بسبة»; K + A «بِسُبَّةٍ» |
| أبو طالب 11a | لَكُنَّا | H file «لَكِنَّا» | jawab of لولا; K + A |
| أبو طالب 13b | عَنْهُ | K «عَنْهَا» | base H (+ A) kept |
| أبو طالب 15b | غَيْرُ بَاطِلِ | K «غَيْرُ زَائِلِ», A «غَيْرُ نَاصِلِ» | base H kept (K also places the verse earlier, as «وَأَيَّدَهُ») |
| أبو طالب 7 | فَلَا زَالَ فِي الدُّنْيَا… | not in K | base H (+ A) |
| أغر 1b | وَيَشْهَدُ | W «ويُشْهَدُ» | L + K |
| أغر 3a | لِيُجِلَّهُ | A «كَي يُجِلَّهُ» (and A drops the واو and the first two verses) | W + L + K |
| الهمزية 2 | فَقُومُوا صَدِّقُوهُ … لَا نَقُومُ وَلَا نَشَاءُ | A «وَقَومي صَدَّقوهُ … ما نُجيبُ وَما نَشاءُ» | A stands alone against W + H + K (the only place where the base was overruled) |
| الهمزية 3a | وَجِبْرِيلٌ أَمِينُ اللَّهِ | K «رَسُولُ اللَّهِ» (and placed before «وقال الله») | A + W |
| الهمزية 4b | فَأَنْتَ مُجَوَّفٌ نَخِبٌ هَوَاءُ | H + K «مُغَلْغَلَةً فَقَدْ بَرِحَ الْخَفَاءُ» | A + W (the diwan) |
| الهمزية 5a | فَأَجَبْتُ | H «وَأَجَبْتُ» | A + W + K (and صحيح مسلم) |
| الهمزية 8a | فَمَنْ يَهْجُو | H + K «أَمَنْ يَهْجُو» | A + W (the diwan) |
| بطيبة 2a | تَمْتَحِي | A/W «تنمحي» | base H + K |
| بطيبة 3a | آثَارٍ | K, A/W «آيَاتٍ» | base H kept (see §6) |
| بطيبة 5a | مَعَارِفُ | A/W «معالمُ» | base H + K |
| بطيبة 6b | بِهَا | A/W «بِهِ» | base H + K |
| بطيبة 12a | يَجُورُوا | A/W «يَحِيدُوا» | base H + K |
| ابن رواحة 1b, 3b | الْفَجْرِ … بِالْمُشْرِكِينَ | A «الصُّبحِ … بِالكافِرينَ» (A adds a 4th verse) | the Bukhari text |
| العباس 5a | حَتَّى احْتَوَى | F «ثُمَّ احْتَوَى» | S + I + K |
| الأعشى 1 | وَآلَيْتُ لَا آوِي … تُلَاقِي | A/W «فآليتُ لا أرثي … تَزورَ» | base H + K |
| الأعشى 3a | نَبِيًّا | K + A «نَبِيٌّ» | base H (بدل من «محمدًا») |
| الأعشى 5b, 7b | حَيْثُ … فَتُرْصِدَ لِلْأَمْرِ الَّذِي | A/W «حينَ … وأنّك لم تُرصِد لما» | base H + K |
| الأعشى 6a | بِزَادٍ مِنَ التُّقَى | H file «بِزَادِ مَنْ الْتَقَى» | corrupt in the shamela file; K + A + W |
| كعب 7a | لَسَيْفٌ يُسْتَضَاءُ بِهِ | the circulated «لَنُورٌ» | verbatim from `banatsuad.txt` (its base, Ibn Hisham's sharh; «لنور» is the reading of Ibn Kathir there, `madih-build/out/banatsuad.collation.txt`) |

## 4. Harakat
- **Coverage:** 99.6% of the file; pieces 1–7 and 9 are 100%. The bare letters are all in the Kaʿb piece, copied as it stands in `banatsuad.txt`.
- **Completed mechanically (aldiwan convention):** pieces 3 and 4 wholly, piece 2 verses 5–6 (sukun, the vowel before a madd letter, shadda of sun letters), then checked against W/H/K/M: no contradiction.
- **Filled from a witness (same word, no conflict):** بطيبة 5a «تُطْمَسْ عَلَى الْعَهْدِ آيُهَا», 11b «فَاللَّهُ» (K); العباس 6b «وَضَاءَتْ» (F); ابن رواحة «اللَّهِ» (A).
- **Corrected (base → text), all with a witness:**
  - أبو طالب: 1b «نُطَاعِنُ … وَنُنَاضِلْ» → **نُطَاعِنْ … وَنُنَاضِلِ** (K); 4a «وَأَبْيَضُ» → **وَأَبْيَضَ** (K, A, B); 6a «بِأَحْمَدَ» → **بِأَحْمَدٍ** (K, A; the meter); 7b «وَزِيَنًا» → **وَزَيْنًا** (A; the meter); 10b «تَجُرُّ» → **تُجَرُّ** (K); 13a «أَحَمْدٌ» → **أَحْمَدٌ** (K); 13b «سَوْرَةُ» → **سُورَةُ** (K, A); bare words of 5b, 9, 10a, 14b vocalized as K.
  - أغر: 4a «نَبِيُّ» → **نَبِيٌّ** (W, A); two bare واو.
  - بطيبة: 1b «الرَّسُومُ» → **الرُّسُومُ**; 3a «مَعَالِمَ» → **مَعَالِمٍ** (ضرورة); 3b «مُصَلَّى» → **مُصَلًّى**; 8a «تَقَطَّعُ … عَنْهُمْ» → **تَقَطَّعَ … عَنْهُمُ**; 8b «وَيُنَجَّدُ» → **وَيُنْجِدُ**; 11a «عَفْوٌ» → **عَفُوٌّ**; 11b «وَإِنَّ» → **وَإِنْ** (all K + A/W, and the meter).
  - العباس: 7b «وَسُبُلُ» → **وَسُبْلِ** (I; the meter).
  - A final sukun before hamzat al-wasl given its vowel (H writes «مِنْ اللَّهِ»): بطيبة 4b **مِنَ**, 10a **يَهْدِيهِمُ**, 11a and 12a **عَنِ**; أبو طالب 11b **مِنَ** (K in all).
- **Kept against a witness:** أبو طالب 4b «ثِمَالُ … عِصْمَةٌ» (H, A; K has the نصب; Bukhari prints all three cases); 6a «كُلِّفْتُ» (H, K; A «كَلِفتُ»); أغر 4b «وَالْأَوْثَانُ» (L: واو الحال; W/A «والأوثانِ»); 3a «مِنِ اسْمِهِ» (L, A; K «مِنَ»); بطيبة 6b «مُلْحِدُ», 8a «مَنْزِلُ», 10b «يُسْعَدُوا» (H; K «مَلْحَدُ», «مُنْزَلُ», «يَسْعَدُوا»); ابن رواحة 3b «اسْتَثْقَلَتْ» (B; A «اِستُثقِلَت»); العباس 5a «بَيْتُكَ الْمُهَيْمِنُ» (S, I; K «بَيْتَكَ», F «الْمُهَيْمَنُ»); الأعشى 2b «وَتَلْقَيْ» (H; K «وَتَلْقَى»).
- **Meter:** all 146 hemistichs scan (`meter.js`: الطويل، الوافر، المنسرح، البسيط). Verses with تدوير: العباس 6–7 (written «الْـ | ـأَرْضُ», «النُّـ | ـورِ»), كعب 2 («نَافِلَةَ | الْقُرْآنِ»).

## 5. Attribution and content
- No verse contains استغاثة. «فبوركتَ يا قبر الرسول» (بطيبة) was not taken.
- العباس: the hadith that carries the poem (الطبراني، الحاكم) has a weak isnad, but the poem is quoted by Ibn Qutayba, Ibn ʿAbd al-Barr, al-Qadi ʿIyad, al-Dhahabi and Ibn Kathir.
- الأعشى: the poem is in his diwan and in Ibn Hisham, but the story of his journey is given by Ibn Hisham without isnad and is disputed. The piece is last in the file and can be dropped whole.
- «وأحسن منك لم تر قط عيني»: in the diwan only (no early sira source).
- أبو طالب: Ibn Hisham says at the end «هذا ما صحّ لي من هذه القصيدة».

## 6. To verify
- بطيبة 3a «وَوَاضِحُ **آثَارٍ**»: H alone; K (quoting Ibn Hisham) and the diwan have «آيَاتٍ». Kept as the base prints it.
- أبو طالب 13b «**سُورَةُ**» (K, A) against H «سَوْرَةُ»; 14b «بِ**الذُّرَى**» (H bare, its footnote «جمع ذروة»; K «بِالذَّرَا»).
- أغر 1b «وَيَشْهَدُ» (L, K) or «ويُشْهَدُ» (W).
- The Kaʿb piece keeps the partial marks of `banatsuad.txt` (8 bare letters: «وإنْ», «فمَا», «عُصْبةٍ», «الْعَرانينِ»).
