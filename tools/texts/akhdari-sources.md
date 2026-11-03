# Texts report: متن الأخضري في العبادات على مذهب الإمام مالك (`akhdari.json`)

Author: عبد الرحمن بن محمد الصغير الأخضري (ت ٩٨٣هـ). The work is prose, so it has paragraphs and no verses.

## Sources
- **Vocalization source (base):** المكتبة الشاملة, book 9548 «متن الأخضري في العبادات على مذهب الإمام مالك». It is the edition of مكتبة ومطبعة محمد علي صبيح بالأزهر, its pages match the print (24 pp.), and it is fully vocalized.
  The text runs over pages 2–24: https://shamela.ws/book/9548/2 … https://shamela.ws/book/9548/24
  Raw pages: `raw/akhdari/shamela-9548-*.html`.
- **Wording check (independent edition):** OpenITI `JK009285`, «مختصر سيدي عبد الرحمن الأخضري في العبادات», published by الشركة الإفريقية للطباعة والنشر. It is unvocalized.
  https://github.com/OpenITI/1000AH/tree/master/data/0983IbnMuhammadSahgirAkhdari (raw copy: `raw/akhdari/openiti-JK009285-ara1.txt`)
- **Not used as a check:** OpenITI `ShamAY0031995` is the same Shamela 9548 text with the harakat stripped, so it is not independent. It is kept in raw/ for reference only.
- **No second vocalized source found.** shamela.ws, ketabonline (a Shamela mirror), ar.wikisource (no copy) and alukah (PDF only) were searched. Because of this, the vocalization rests on the Shamela text. Every change to it is listed below, and each one is either a clear grammar or orthography rule or is backed by the same word elsewhere in the text.
- **How the comparison was done:** a script (`raw/akhdari/scripts/ak1.js`) removes harakat and tatweel, unifies alif, ya, ta marbuta, waw-hamza and ya-hamza forms, and then runs an LCS word diff of the whole text. Base: 3286 words. JK: 3281 words. Result: 59 difference groups (`raw/akhdari/ak-diff.txt`). A second check confirmed that the final JSON matches the base word for word, except for the one wording choice below.

## Structure and count
- There are 8 chapters, using the matn's own headings: (the opening, which Shamela's index titles «أول ما يجب على المكلف»), فصل في الطهارة، التيمم، الحيض، النفاس، الأوقات، شروط الصلاة، باب في السهو. The inner «فَصْلٌ:» sections stay at the start of their paragraphs, as the print has them. A paragraph never crosses a «فَصْلٌ».
- There are 111 paragraphs of 10–40 words each, cut at the end of a sentence. Where a sentence was very long, it was cut at «، وَمَنْ…/، وَإِنْ…». Nothing was added or removed.
- **Removed:** the title page, the publisher's epigraph «﴿تِلْكَ حُدُودُ اللَّهِ فَلَا تَعْتَدُوهَا﴾ (قرآن كريم)», and the editorial parentheses around catchwords such as «(وَيَجِبُ)» and «(وَسُنَنُهُ):». The basmala is in the `basmala` field. The one Qur'anic quotation is now written as ﴿…﴾.

## Wording differences (base = Shamela/Subayh, JK = African Co. edition)
Most of the 59 groups are typos or OCR slips in JK, and the base was kept in all of them. Examples: الخالد/الخالق، المطر/المطهر، بطلب/بطلت ×3، النوافق، يتنقل، الاجرام، السيري، ويجد/ويسجد، تكر منا/ترك منها، سواه/سواء ×2، سبحانه الله، كان/كانت ×3، فلابد/فلا بد. The real differences are these:

| Place | Base (kept unless noted) | JK | Decision |
|---|---|---|---|
| أول ما يجب | وَالْبُغْضُ **وَرُؤْيَةُ الْفَضْلِ عَلَى الْغَيْرِ، وَالْهَمْزُ وَاللَّمْزُ وَالْعَبَثُ** وَالسُّخْرِيَةُ | phrase missing | base. JK dropped a line. |
| أول ما يجب | لِسُنَّةِ **مُحَمَّدٍ** صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | without مُحَمَّدٍ | base |
| الأوقات | إِلَى آخِرِ الْقَامَةِ | آخره | base |
| شروط الصلاة | مَا بَيْنَ السُّرَّةِ **وَالرُّكْبَةِ** | إلى الركبة | base |
| شروط الصلاة | حَتَّى يَغْسِلَهُ **وَخَافَ** خُرُوجَ الْوَقْتِ | وخاف missing | base. The ruling depends on it. |
| فرائض الصلاة | **وَشَرْطُ** النِّيَّةِ مُقَارَنَتُهَا | وشروط | base. It names one condition. |
| سنن الصلاة | وَسُنَّتُهَا | **وسننها** | **سُنَنُهَا (JK).** It is a list of many sunan, and the text uses «وَسُنَنُهُ» for wudu, ghusl and tayammum. The base's singular looks like a misprint. ⚠ See places to check. |
| سنن الصلاة | عَلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | adds تعالى + garbage | base |
| فضائل الصلاة | وَيَجُوزُ **بَعْدَ** الرُّكُوعِ | بعد missing | base |
| السهو | وَمَنْ سَمِعَ ذِكْرَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | adds وآله | base |
| السهو | إِلَّا **أَنْ** يَتَغَيَّرَ اللَّفْظُ | أن missing | base |
| السهو | إِلَّا أَنْ يَنْطِقَ **بِحُرُوفٍ** | بحرف | base. The text also has «مِنْ غَيْرِ إِخْرَاجِ حُرُوفٍ». |

## Vocalization corrections to the Shamela text (script: `raw/akhdari/scripts/ak2.js`, each applied with an exact count check)
| Shamela | Written as | Reason |
|---|---|---|
| وَانتْهَارِ | وَانْتِهَارِ | The sukun was on the wrong letter. |
| مَعْصِيَّةِ الْخَالِقِ | مَعْصِيَةِ | The word has no shadda (and the hadith wording has none). |
| بِعُودٍ وَنَحَوِهِ | وَنَحْوِهِ | Clear error. The text has «وَنَحْوِهِ» elsewhere. |
| كَالْكَبِيرِ, / مِنْهُ, | ، | A Latin comma in an Arabic text. |
| آخِرِ نَوْمِةٍ | نَوْمَةٍ | Wrong vowel before the ta marbuta. |
| الثُقْبَةُ | الثُّقْبَةُ | Missing shadda after the sun-letter ال. |
| لَلْمُبْتَدِأَةِ | لِلْمُبْتَدَأَةِ | Lam of the jar takes kasra. The same text has «مُبْتَدَأَةٌ». |
| تَمَامِ اَلنِّفَاسُ | تَمَامِ النِّفَاسِ | A mudaf ilayh takes the genitive. |
| إِلَى آخَرَ الْقَامَةِ | آخِرِ | آخِر means "end", and it is genitive after إلى. |
| وَالْمُخْتَارُ لِلْعَشَاءِ | لِلْعِشَاءِ | The prayer is العِشاء (the text later has «صَلَّى الْعِشَاءَ»). |
| مَنْ تَنَجَّسِ ثَوْبُهُ | تَنَجَّسَ | Past-tense verb. |
| وَالْمِرْفَقَيْنَ | وَالْمِرْفَقَيْنِ | Dual noun in the genitive. |
| التَّسْمِيَّةُ (wudu) | التَّسْمِيَةُ | As in the tayammum section of the same text. |
| وَالْتَّسْلِيمِةُ / بَالتَّسْلِيمِةِ / وَالْتَّيَامُنُ | وَالتَّسْلِيمَةُ / بِالتَّسْلِيمَةِ / وَالتَّيَامُنُ | A sukun on the lam before a sun letter, a kasra before the ta marbuta, and a fatha on the bāʾ of the jar. |
| أَوْ كُمِّهُ | كُمِّهِ | Genitive (coordinated with جَيْبِهِ). |
| كُلُّ مَا يَشْغُلْهُ | يَشْغَلُهُ | Indicative. The verb is شَغَلَ يَشْغَلُ (the text has «وَيَشْغَلُكَ»). |
| وَاشْتَغِلَ / فَحَافَظَ / تُصَلِّى | وَاشْتَغِلْ / فَحَافِظْ / تُصَلِّي | Imperatives, and a ya written as alif maqsura. |
| بِطَلَتْ صَلَاتُهُ | بَطَلَتْ | Clear error. |
| وَلَا تُبْطُلُ الصَّلَاةُ | تَبْطُلُ | Intransitive بَطَلَ يَبْطُلُ. |
| سُبْحَانَ اللَّهَ | سُبْحَانَ اللَّهِ | Mudaf ilayh. |
| تَرَكَ تِلْكَ الْآيَةِ | الْآيَةَ | A badal from the object. |
| للِصَّلَاةٍ | لِلصَّلَاةِ | Shifted marks and a wrong tanween. |
| وَمَنْ أُنْصَتَ | أَنْصَتَ | Active verb. |
| كَمَالِ صِلَاتِهِ | صَلَاتِهِ | Clear error. |
| وَتَذَكَّرِ بَعْدَ الرُّكُوعِ | وَتَذَكَّرَ | Past-tense verb. |
| السُّجُودَ الْقَبَلِيَّ / وَقَبَلِيٌّ | الْقَبْلِيَّ / وَقَبْلِيٌّ | Nisba of قَبْل, spelled as the text spells it elsewhere (الْقَبْلِيُّ، قَبْلِيًّا). |
| شَكّ فِيهِ | شَكَّ | Completed a missing fatha. |
| 12× مِنْ/عَنْ/أَوْ + ال (مِنْ الْقَامَةِ، عَنْ الْفَحْشَاءِ، أَوْ السُّجُودِ…) | مِنَ / عَنِ / أَوِ | A sukun cannot stand before the wasl of ال. |
| 14× اَلْ… (اَلْحَمْدُ، وَشُرُوطُ اَلتَّوْبَةِ، بِسَخَطِ اَلْخَالِقِ…) | الْ… | Shamela puts a fatha on the wasl alif, often in the middle of a sentence where it is silent. It was removed everywhere for consistency. |

## Places to check (left as in the base, or chosen with some doubt)
1. **سُنَنُهَا / سُنَّتُهَا** (sunan of the prayer): I chose the plural, following JK and the parallel wording in the text. A printed sharh could settle it.
2. «وَتَثْلِيثُ **غُسْلِ** الرَّأْسِ» and «بَطَلَ **غَسْلُهُ**» (ghusl section): the first may be غَسْل (washing) and the second غُسْل (the ritual bath). Left as in Shamela.
3. «وَلَا **يَقُولُ**: حَتَّى يَهْدِيَنِي اللَّهُ» and «حَتَّى يُحْضِرَ … **وَيَرْتَعِدُ** قَلْبُهُ وَتَرْهَبُ نَفْسُهُ»: indicative or subjunctive? Both are defensible, so left as in Shamela.
4. «وَبَعْدَ **الْجُمْعَةِ**» (with sukun) next to «إِمَامِ الْجُمُعَةِ»: both forms are correct Arabic. Left as is.
5. «وَالْوَذَحِ» (in the list of things that change water): both editions have this word. Some prints have «الوَدَك», which was not checked.
6. «وَالطُّمَانِينَةُ» is written without hamza in the source (a known spelling variant). Left as is.
