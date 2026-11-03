# Texts report: منظومة الزمزمي في علوم القرآن («منظومة التفسير») (`zamzami.txt`)

Author: عبد العزيز بن علي الزمزمي المكي (ت ٩٧٦هـ). Meter: الرجز (couplets with paired rhyme). It is a versification of السيوطي's «النقاية».

## Sources
- **Vocalization source (base):** «متن منظومة التفسير», edited by د. عبد الرحمن بن معاضة الشهري and published by شبكة التفسير (tafsir.net) on 27/3/1426هـ. The editor says he collated it against two Meccan commentaries: «نهج التيسير» by محسن المساوي and «التيسير» by محمد يحيى أمان. It is fully vocalized.
  - The Word file: https://quranpedia.net/book/15463 (attachment `BOOK_15463_1.doc`, kept as `raw/zamzami/qp15463-shahri.doc` and `.htm`). Each verse is a two-column table row, so the hemistichs pair up exactly. The script is `raw/zamzami/scripts/doc2.js`, and its output is `z1.tsv`.
  - The same edition as page text: https://quranpedia.net/book/1093 (`raw/zamzami/qp1093-1-*.json`). That copy has the columns jumbled, so it was used for reference only.
  - In this edition the Qur'anic words sit in **images**, written in a mushaf font (`raw/zamzami/qp15463-images/image004–020`). I read each image and typed the words, listed below.
- **Check sources** (the verse lines quoted in full in two transcribed commentaries; a script compared them word by word and mark by mark):
  - شرح منظومة التفسير by أحمد بن عمر الحازمي (15 lessons, transcribed from audio): المكتبة الشاملة book 36126, https://shamela.ws/book/36126 (pages 1–384 in `raw/zamzami/hazimi-36126/`). Its verse lines are vocalized.
  - شرح منظومة الزمزمي by عبد الكريم الخضير (lessons from 1426هـ, transcribed): the Shamela-made Word file on quranpedia, https://quranpedia.net/book-attachment/17447/76080 (`raw/zamzami/khudair-sharh-qp17447.*`).
  - **Independence caveat:** the verse lines in both commentaries were clearly typed from the same tafsir.net text. They share its spelling habits, such as «التَّفْسِيْرُ» and «الَّذْ». So they confirm the wording and catch typos, but they are not a separate vocalization tradition. Their own commentary text does show where the shaykhs read differently, and those cases are listed below. No other complete vocalized copy was found (Shamela has only the Hazimi commentary, and Wikisource and OpenITI have none).
- **How the comparison was done:** `zz1.js` searches every hemistich, after normalization, as a contiguous word sequence in each commentary's full text. **All 316 hemistichs** were found exactly in at least one commentary, except the variants listed below. `zz2.js` compared the full verse lines in both commentaries mark by mark (output in `zz-voc.txt`).

## Count
- **158 verses** in 41 sections. Your brief said about 170. None of the sources I found states a verse count. The Shahri edition has no verse numbers, and the Islamic University journal study counts 128 *issues* (masāʾil), not verses. Checks for missing verses:
  1. Every verse quoted in full in the two commentaries matches a verse in the base. Neither commentary contains a verse from this poem that the base lacks.
  2. The poem runs without gaps from «تَبارَكَ المُنْزِلُ للفُرقانِ» to the closing prayer «…إلى قِيامِ السَّاعَةْ».
  3. الخضير says «تسعة أبيات قبل المقدمة», but the base has 10 (6 opening verses plus 4 under «حد علم التفسير»). All 10 are explained in both commentaries, so he probably miscounted.
  So the number is 158 for this edition. ⚠ If you have a source for «~170», it could point to a longer recension; I found no trace of one.
- **Headings:** they are the editor's headings, taken from the order of النقاية (العقود الستة and their أنواع). Where an ʿaqd heading is followed directly by a nawʿ heading, both are joined with « — ». The first six verses have no heading in the source, so I added «## مُقَدِّمَةُ النَّاظِمِ» (an editorial label, like «[مقدمة الناظم]» in متون طالب العلم).
- **Removed:** the editor's preface, which includes the quoted pair «فهاكها…» (that pair is still in its place at the end), the footnote, and the decorative images 001–003.

## Qur'anic words that are images in the base (typed in, standard imla'i vocalization)
| Verse | Text |
|---|---|
| 25 | وبِمِنَى ﴿اتَّقُوا﴾ وبعدُ ﴿يَوْمًا﴾ \| و﴿تُرْجَعُونَ﴾ أَوْلِ هذا الخَتْمَا. There is no و before اتَّقُوا, as in the image; the meter requires this, although الحازمي writes «وَاتَّقُواْ». |
| 26 | ويومَ فَتْحٍ ﴿آمَنَ الرَّسُولُ﴾ |
| 27 | ﴿هَذَانِ خَصْمَانِ﴾ ومَا بَعْدُ تَبَعْ |
| 28 | إِلى ﴿الْحَمِيدِ﴾ |
| 31 | وآيةُ القِبْلَةِ أَيْ ﴿فَوَلِّ﴾ |
| 32 | وقَولُهُ: ﴿يَا أَيُّهَا النَّبِيُّ قُلْ﴾ \| بَعْدُ ﴿لِأَزْوَاجِكَ﴾ |
| 34 | وآيةُ ﴿الثَّلَاثَةِ الَّذِينَ﴾ \| أَيْ ﴿خُلِّفُوا﴾ بِتَوبَةٍ |
| heading | قِرَاءَاتُ النَّبِيِّ ﷺ, written out in full as «صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ» |

The الحازمي verse lines contain the same words (in Uthmani spelling), which confirms these readings.

## Wording differences between the sources
| Verse | Base (الشهري) | Other reading | Chosen | Why |
|---|---|---|---|---|
| 72 | كَافٍ لَهَا، **وبَعْضُهُمْ** قَدْ حَمَلا | **وغَيْرُهُمْ** (الحازمي's verse line and commentary; الخضير's commentary, which discusses why غيرهم fits better) | **وغَيْرُهُمْ** | Both commentators read it this way. The meaning is that all the other readers stop at the end of ويكأنه. The meter is the same. |
| 112 | كالقُرْءِ إِذْ بَيَانُهُ **بالآيَةِ** | **بالسُّنَّةِ** (الحازمي, الخضير. الخضير adds a footnote that the Shahri text has «بالآية») | **بالسُّنَّةِ** | Both commentators read it this way, and they explain the meaning of القرء from the Sunna (the hadith of Ibn ʿUmar). The rhyme with الدَّلالَةِ is the same. |
| 124 | والنَّسْخُ لِلْحُكْمِ **ولِلتِّلاوَةِ** \| أَوْ بِهِما | **أو لِلتِّلاوَةِ … أَوْ بِهِما** (الخضير). **أَو التِّلاوَةِ … أَوْ لَهُما** (الحازمي) | **أَوْ لِلتِّلاوَةِ … أَوْ بِهِما** | The text lists three alternatives (the ruling, the recitation, or both), so «أو» is needed. Both commentators have أو. For the second hemistich, الخضير agrees with the base. The meter holds. |
| 9 | وقَدْ **حَوَتْهُ** سِتَّةٌ عُقُودُ | حَوَتْهَا (الحازمي) | base | الخضير agrees with the base. The pronoun refers to the science (علم التفسير). |
| 14 | مِنْهُ على القَولِ **لَهُ** … والفاضِلُ الَّذْ **مِنْهُ فيهِ** أَتَتِ | بِهُ … الَّذْ بهِ مِنْهُ (الحازمي) | base | الخضير agrees with the base. |
| 15 | قِراءَةٌ **وأَنْ بِهِ** يُتَرْجَمُ | قِراءَةٌ بِهِ وأَنْ يُتَرْجَمُ (الحازمي) | base | الخضير agrees with the base. ⚠ See places to check. |
| 65 | والحَسَنُ، الأَسْوَدُ، زِرٌّ | الأَسْوَدُ والحَسَنُ (الحازمي) | base | الخضير agrees with the base. |
| 118 | أَمْكَنَ **فَالحُكْمُ** | وَالحُكْمُ (الحازمي) | base | الخضير agrees with the base. |
| 125 | كآيَةِ النَّجْوَى **الذي** لَمْ يَعْمَلِ | التي (الحازمي) | base | الخضير agrees with the base. |
| 129 | مَا بَعْدَها عَنْهَا | وَمَا (الحازمي) | base | An extra و would break the meter. |
| 54 | رُهُنٌ، **ونُنْشِزُ** | without و (a slip in الخضير's text) | base | الحازمي agrees with the base. |

## Vocalization and spelling corrections to the base (script `raw/zamzami/scripts/zz3.js`, each with an exact count check)
| Verse | Base | Written as | Reason |
|---|---|---|---|
| 36 | كآَيِةِ الكَلالَةِ | كآيَةِ | Kasra on the ya of آية is an error (verse 37 has «كآيَةِ»). |
| 39 | الأَئِمَةُ | الأَئِمَّةُ | The shadda is needed by both the language and the meter (وَصَنْ نَفَلْ أَئِمْ مَتُلْ). |
| 49 | كالثَّلاثِةِ | كالثَّلاثَةِ | Wrong kasra before the ta marbuta. |
| 59 | ذُرِّيَتِهِمْ | ذُرِّيَّتِهِمْ | Missing shadda. الحازمي has it. |
| 60 | أُبِيٌّ | أُبَيٌّ | The name of the Companion is أُبَيّ بن كعب. |
| 66 | لا بُدَّ هْ | لا بُدَّهْ | Spacing typo. الحازمي writes it joined. |
| 71 | وَ وَيْكَأَنَّ | وَوَيْكَأَنَّ | Spacing typo. |
| 86 | كِالمِشْكاةِ | كَالمِشْكاةِ | The kaf of comparison takes fatha. |
| 99 | ﴿واللهٌ | ﴿واللهُ | Tanween is impossible here (الحازمي: وَاللَّهُ). |
| 113 | الَّلذْ | الَّذْ | Shadda on the wrong lam. Spelled as in verse 14 «الَّذْ». |
| 118 | الضِدِّ | الضِّدِّ | Missing shadda after the sun-letter ال. |
| 136 | أَيَّوبُ | أَيُّوبُ | The name of the prophet is Ayyūb. |
| 132, 134 / 14 | كـ﴿ / كَـ« | كَ﴿ / كَ« | Tatweel removed, and the fatha on ك added. |
| 1 | المُنْـزِلُ | المُنْزِلُ | Tatweel removed. |
| all | آَ | آ | A redundant fatha written over the madda. |
| all | « ، » « : » | «، » «: » | Spacing only. Stacked marks were put in one order (shadda first), with no visible change. |

## Places to check (kept as in the base)
1. **Meter.** The editor himself flags three verses: 24 «…ثُمَّ الفَتْحُ فيْ \| كُراعِ الغَمِيْمِ» (he suggests كُرَيِّعِ), 36 «والشِّتَائِيْ» (he suggests والشَّتَئِيْ), and 75 «حَمْزَةُ والكِسَائِيْ…». On mtafsir.net a reader showed that verse 75 scans if the hamza of «أو» is carried over (درج). The editor kept the poet's wording, and so did I.
2. Verse 15: «قِراءَةٌ وأَنْ بِهِ يُتَرْجَمُ». الحازمي's «قراءةٌ بِهِ وأن يُترجَم» reads more smoothly, but الخضير has the base wording.
3. Verse 149 «**يِوْحَانِذُ** اسْمُها»: the vowels on this foreign name (the mother of Moses) are uncertain. The usual form is يُوحَانِذ.
4. Verse 126 «بَلْ **عَشْرَةٌ** أَيَّامَا»: الحازمي has عَشْرَةً. Left as in the base.
5. Verse 88 «قالوا: **إِحْذَرا**» uses a qaṭʿ hamza for the meter. الحازمي writes «احْذَرا», but the meter needs the hamza, so it was kept.
6. A few forms kept for the meter, which is normal in verse: «مُعاذٌ بنُ جَبَلٍ», «أَبُو هُرَيْرَةٍ», «ومَرْيَمٌ», «وإِسْمُهُ» ×2, «اوْ تَمَامِ».
