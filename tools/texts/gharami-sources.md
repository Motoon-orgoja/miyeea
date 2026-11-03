# Texts report — منظومة غرامي صحيح (`gharami.txt`)

Ibn Farh al-Ishbili (Shihab al-Din Abu al-Abbas Ahmad ibn Farh al-Lakhmi, d. 699 AH), tawil, on the titles of hadith terms.
How the comparison was done: every source was parsed into verses by script, stripped of harakat and tatweel, alef/yaa/ta-marbuta forms unified, and compared word by word against the base (LCS diff, script output, not by eye). Harakat were then compared letter by letter.
Raw files as downloaded: `tools/texts/raw/gharami/`. Every added or changed mark is listed in `raw/gharami/_collation-log.txt`.

## Sources
- **Base:** المكتبة الشاملة, book 1055 «شرح قصيدة ابن فرح الإشبيلي (غرامي صحيح)» by Ibn Abd al-Hadi (d. 744), ed. عمر بن سليمان الحفيان (دار الفلاح، الفيوم، ١٤٢٣هـ), pages 27–42:
  https://shamela.ws/book/1055/27 … /1055/42
  This is a critical edition from nine manuscripts. Its base manuscript is the copy in Ibn Urwa's «الكواكب الدراري», whose verses are «ضُبطت بالشكل في الغالب». It also collates the poem against al-Subki and other sources, and its footnotes record the variants (used below).
- **Check 1 — independent edition, partly vocalized:** Shamela 20647 «مجموع رسائل الحافظ ابن عبد الهادي», ed. حسين بن عكاشة (الفاروق الحديثة، ١٤٢٧هـ). The poem is given as one block on pages 256–257: https://shamela.ws/book/20647/256
- **Check 2:** Shamela 6739 «طبقات الشافعية الكبرى» of al-Subki (ed. al-Tanahi and al-Hilw), pages 2706–2708, which quotes the whole poem: https://shamela.ws/book/6739/2706
- **Check 3:** Shamela 36127 «الغرامية في مصطلح الحديث», with شرح وتوثيق by مرزوق الزهراني (دار المآثر، ١٤٢٤هـ), page 24, unvocalized: https://shamela.ws/book/36127/24
- **Check 4:** the Shamela text from «الجامع للمتون العلمية» («قصيدة غزلية في ألقاب الحديث», Shamela 37302), via OpenITI, unvocalized: https://raw.githubusercontent.com/OpenITI/0700AH/master/data/0699ShihabDinIshbiliLakhmi/0699ShihabDinIshbiliLakhmi.QasidaGhazaliyya/0699ShihabDinIshbiliLakhmi.QasidaGhazaliyya.ShamAY0037302-ara1
- Verse 1 only, fully vocalized: al-Dhahabi's quotation as printed in Shamela 32181 «نظم علوم الحديث» (page 38).
- **No fully vocalized copy of the whole poem was found online.** By strict count, the base vocalizes about 54% of the consonants.

## Verse count
**20** ✔. All five sources give 20. Al-Dhahabi, who heard it from the poet, says «وهي عشرون بيتًا» (quoted in Shamela 32181, page 37, and al-Safadi's «الوافي»). The figure «ثلاثين بيتًا» in كشف الظنون and Sarkis is a known overstatement: none of the copies has more than 20.
**Order:** al-Subki swaps verses 14 and 15. The other four sources agree with the base.
**Heading:** none in the poem. The file has a single «## المنظومة» line, as in `bayquniyya.txt`.

## Wording differences (base vs checks)
The base reading is kept throughout, except in verse 11. The base edition's apparatus is cited as «Hafyan fn.».

| Verse | Chosen (base) | Other reading | Notes |
|---|---|---|---|
| 3 | إِلَّا **سَمَاعُ** حَدِيثِكُمْ | استماع (عكاشة، الزهراني) | Base and al-Subki agree. Both fit the meter. |
| 3 | **تُمْلِي** عَلَيَّ | يُملي / تُملى / يُملى (the other MSS per Hafyan fn.; يملى in al-Subki and al-Zahrani) | Base manuscript reading. ⚠ |
| 4 | **الْمُعَوَّلُ** | معوّل (عكاشة) | |
| 5 | تَرِقُّ **وَتَعْدِلُ** | وتعذل (الزهراني) | |
| 7 | **أُقَضِّي** | أقصي (الجامع), أَقْضِي (al-Subki) | |
| 9 | **وَأَجْرَيْتُ** دَمْعِي **بِالدِّمَاءِ** | فأجريت (الزهراني); فوق خدي (الزهراني، الجامع، and some MSS per Hafyan fn.) | Base, عكاشة and al-Subki agree. |
| 10 | **جَفْنِي** | جسمي (الجامع) | |
| 11 | وَجْدِي وَشَجْوِي | شجوي ووجدي (al-Subki) | |
| 11 | وَمَا **مِنْكَ آمُلُ** | فيك (al-Subki and some MSS) | **Vocalization changed:** the base manuscript alone has أمَّلُ (Hafyan fn.). Its sister copy ك has أمِّل. All the other manuscripts and all four check sources have آمل, so it is written آمُلُ. |
| 12 | خُذِ الْوَجْدَ **عَنِّي** | مني (الجامع) | |
| 12 | الْهَوَى **يَتَحَيَّلُ** | يتحلل (الزهراني، الجامع), يتجمل (al-Subki) | Hafyan notes that the sources «اضطربت في عجز البيت». |
| 13 | **وَذِي نُبَذٍ** | وذا نبذة (الزهراني) | |
| 13 | شَرْحًا **أُحَوِّلُ** | أُطَوِّلُ (عكاشة، al-Subki، الزهراني، الجامع, and six MSS per Hafyan fn.) | Base manuscript and ك have أحول. ⚠ |
| 15 | عَنْ دَارِ **الْهَوَى** | القلى (al-Subki، الجامع), البلى (الزهراني) | |
| 16 | بِمَقْطُوعِ **الْوَسَائِلِ** | الرسائل (الزهراني) | |
| 17 | **فَلَا** زِلْتَ … **وَمَا** زِلْتَ … **فَأَنْزِلُ** | ولا … ولا … (al-Subki, al-Zahrani, and several MSS); وأنزل (al-Subki) | The base and عكاشة have وما زلت. ⚠ |
| 18 | الَّذِي **تُعْنَى** | نَعني (عكاشة) | |
| 19 | مِنْ **آخِرٍ** … **مِنْهُ** | اسمه … فيه (عكاشة); منها (الزهراني) | |
| 20 | بِالصَّبَابَةِ **يُشْعَلُ** | مُشْعَلُ (al-Subki، الزهراني، الجامع), يُشْغَلُ (عكاشة) | |

## Harakat changed in the base
| Verse | Base | Written as | Reason |
|---|---|---|---|
| 11 | أمَّلُ | آمُلُ | See the table above. |
| 19 | مِنْ النِّصفِ | مِنَ النِّصْفِ | Two sukuns cannot meet before hamzat al-wasl, so the nun takes fatha before the article. |
| 16 | «… سبيلٌ، لا؛ ولا …» | punctuation removed | Editorial marks. The «» quotation marks around the hadith terms and the footnote numbers were also removed. |

## Completed harakat
- **120 marks were added by script** from عكاشة, from al-Dhahabi's verse 1, and from al-Subki. This happened only where the base letter had no vowel, the skeleton was identical, and nothing conflicted. The script never adds a vowel against the base, never marks a bare alif, and never adds a mark to a madd letter.
  - Conflicts found and resolved in favour of the base:
    - 7 أُقَضِّي (al-Subki has أَقْضِي)
    - 8 فَأَحْمِلُ (عكاشة has فَأَحْمَلُ)
    - 10 جَفْنِي (عكاشة has جِفني; جَفْن is the eyelid)
    - 12 مُسْنَدًا
    - 16 مَعْدِلُ (عكاشة has مَعْدَل; the place noun of عَدَلَ يَعْدِلُ is مَفْعِل)
- **63 words were completed by hand** where the vocalization cannot be otherwise. Most are:
  - the conjunction وَ / فَ and the prepositions بِ (before a noun or the article)
  - عَلَى, عَنْ, عَنْكَ, لِي, وَمَا, فَلَا, إِذَا, وَلَوْ, مِنْكَ, وَأَنْتَ
  - the sukun on the article lam
  - a fatha before alif, as in سَمَاعُ and أَكْفَانِ
  - root sukuns, as in أَجْمَلُ, جَفْنِي and شَرْحًا

  Every one is listed in `raw/gharami/_collation-log.txt` (lines starting with «complete»). Four of them are worth checking:
  - 3 تُمْلِي: active voice, because the base spells it with ي.
  - 13 مُبْهَمِ: genitive, after مِنْ.
  - 13 وَغَامِضُهُ
  - 19 آخِرٍ: the tanween in the base shows it is آخِر «the last», not the diptote آخَر.
- Result (script count): 100% of the consonants carry a mark.

## Places to confirm (مواضع للتأكد)
1. **Verse 13, أُحَوِّلُ vs أُطَوِّلُ.** The base edition keeps أحوّل. Most other witnesses, and the common printed matn, have أطوّل.
2. **Verse 3, تُمْلِي** («you dictate») vs **يُمْلَى** («it is dictated», as in al-Subki and most copies).
3. **Verse 17, وَمَا زِلْتَ** vs **وَلَا زِلْتَ.**
4. **Verse 20, يُشْعَلُ** vs **مُشْعَلُ.**
5. **Verse 9, بِالدِّمَاءِ** vs **فَوْقَ خَدِّي**, and **verse 15, الْهَوَى** vs **الْقِلَى.**
6. The vocalization of verses 2–20 rests on the base's partial vocalization plus عكاشة's. 63 words were completed by rule, as listed above.

In each case the chosen reading follows the critical edition. If the students are meant to memorize the wording of the popular matn copies instead (الجامع للمتون and al-Zahrani: استماع، يملى، فوق خدي، أطول، القلى، ولا زلت، مشعل), these are one-word swaps.
