# Texts report: متن العشماوية في الفقه المالكي (`ashmawiyya.json`)

Author: أبو النجا عبد الباري بن أحمد العشماوي الرفاعي المالكي (10th century AH; his death date is not recorded). The work is prose, so it has paragraphs and no verses.

## Sources
- **Vocalization source (base):** المكتبة الشاملة, book 37326 «متن العشماوية في مذهب الإمام مالك». It is the edition of شركة الشمرلي، مصر, its pages match the print (19 pp.), and it is fully vocalized.
  The text runs over pages 1–18: https://shamela.ws/book/37326/1 … https://shamela.ws/book/37326/18
  Raw pages: `raw/ashmawiyya/shamela-37326-*.html`.
- **Wording check 1 (N):** «متن العشماوية», edited by نايف بن عبد الرحمن آل الشيخ مبارك from two Azhar manuscripts. It is vocalized, and footnotes give the reliable school position. Only the archive.org OCR text exists (the harakat in it are garbled): https://archive.org/details/46006b8613_mailboxy_201902 (raw: `raw/ashmawiyya/archive-46006b8613-djvu.txt`).
- **Wording check 2 (S):** «المحاسن البهية شرح متن العشماوية» by عبد المجيد الشرنوبي. The matn is printed in full and vocalized inside the sharh. Only the archive.org OCR text exists: https://archive.org/details/asasu-attulab-ashmawiyyah (raw: `raw/ashmawiyya/archive-asasu-djvu.txt`).
- **Not used:**
  - OpenITI `1000CabdBariAshmawi.MatnCashmawiyya.Shamela0037326` is the same Shamela text, so it is not independent.
  - ketabonline 4383 is a mirror of Shamela.
  - ketabonline 4370 «خلاصة الجواهر الزكية» (raw `ketabonline-4370.json`) turned out to be a question-and-answer rewrite, not the matn.
  - archive.org `morsli_djamel_gawab_20160827` has an unusable OCR.
- **No clean second digital text exists.** shamela.ws, ketabonline, OpenITI, wikisource and a web search were all checked. The two checks above are noisy OCR, so the collation is a filter and not a full proof. Every OCR hit was looked up in the OCR text before any decision.
- **How the comparison was done:**
  - `raw/ashmawiyya/scripts/as1.js` extracts the base blocks into `as-blocks.json` (3249 words).
  - `as2.js` normalizes both sides (removes harakat and tatweel; unifies alif, ya, ta marbuta, Persian ک/ی) and runs an LCS word diff. Output: `as-diff-nayef.txt` (527 groups) and `as-diff-sharnubi.txt` (605 groups). Most groups are OCR noise.
  - `as3.js` keeps only the groups where the OCR has a real word that is not a misspelling of the base word.
  - `as4.js` applies every change listed below. Each change asserts its exact count and is logged in `as-log.json`.
  - A final script diff of the JSON against the base shows only these differences: the inserted words, the split «عَبْدُ البَارِي», the ﴿﴾ marks and the chapter label.
- **Vocalization:** 3174 of the 3251 words carry harakat. The bare words are «في» (76×) and one «إلى», left as in the source.

## Structure and count
- **14 abwab**, the matn's own headings. This matches the Shamela index: نواقض الوضوء، أقسام المياه، فرائض الوضوء، الغسل، التيمم، شروط الصلاة، فرائض الصلاة وسننها وفضائلها ومكروهاتها، مندوبات الصلاة، مفسدات الصلاة، سجود السهو، الإمامة، الجمعة، الجنازة، الصيام.
- The author's short opening («قَالَ الشَّيْخُ … رَاجِيًا لِلثَّوَابِ») comes before the first heading. It is kept as chapter 0 under the label «مُقَدِّمَةُ الْمَتْنِ», the same label used for abushuja.
- **97 paragraphs** of 8–40 words, cut at «.»; very long sentences (the tashahhud additions and the funeral du'a) are cut at «،».
- **Removed:** the title page; the editorial parentheses around quoted du'as, the hadith and «رَبَّنَا وَلَكَ الْحَمْدُ» (one of them was never closed); the «.. )» marks, which became «…». The three surah openings in the witr paragraph are now in ﴿﴾, with the Mushaf spelling (الْكَافِرُونَ, not الكَافِرُوْنَ).

## Wording differences
| Place | Base (Shamela) | Other | Decision |
|---|---|---|---|
| فرائض الوضوء | النِّيَّةُ عِنْدَ غَسْلِ الوَجْهِ، وَغَسْلُ اليَدَيْنِ … فَهَذِهِ سَبْعَةٌ | N: …غسل الوجه **وغسل الوجه** وغسل اليدين… | **Added «وَغَسْلُ الوَجْهِ»** (vowelled like the next item). The base names six while saying «seven», and washing the face is an obvious fard. |
| فضائل الوضوء | وَالثَّالِثَةُ إِذَا **أَوْعَبَ بِالأُوْلَى** | N: «إذا أحكمت الأولى» (OCR), S: «إذا أوعب بالأولى» | base (= S) |
| أول الصيام | **وَصَوْمُ رَمَضَانَ** فَرِيْضَةٌ | N: «وصوم شهر رمضان» | base |
| المستحب من الصوم | **وَثَلاثَةِ** أَيَّامٍ | N: «وصيام ثلاثة أيام» | base |
| سجود السهو | **وَمَتى** سَجَدَ لِشَيْءٍ مِنْ ذَلِكَ | N: «فإن» (OCR, uncertain) | base |
| (others) | — | — | All the other OCR groups are garbled letters or the editors' footnotes and commentary, not variants. |

## Vocalization corrections (all in `scripts/as4.js`, each with an exact count)
- **Clear errors (≈70 places):**
  - سَأَلَني→سَأَلَنِي; عبدُالبَارِي العَشْمَاويُّ الرفاعيُّ→عَبْدُ البَارِي العَشْمَاوِيُّ الرِّفَاعِيُّ; الْمتَّصِلِ→الْمُتَّصِلِ
  - بِمَسِّ اِمْرَأةٍ→امْرَأَةٍ; يَقْصِدْ اللَّذَّةَ→يَقْصِدِ; أَوْصَافِهِ الثَّلاَثَةُ→الثَّلاَثَةِ (an adjective)
  - السَّلاَمُ الْمُعَرَّفِ بِالأَلِفِ وَالَّلاَمِ→الْمُعَرَّفُ … وَاللاَّمِ; الصَّبْحِ→الصُّبْحِ; وَتَوَسُّطِ العِشَاءِ→وَتَوَسُّطُ (in a nominative list); كُلَّهْ،→كُلَّهُ،
  - وَأّنَّ→وَأَنَّ; وِفي→وَفي; وَعَبَثٍ→وَعَبَثٌ (in a nominative list); البّسْمَلَةِ→البَسْمَلَةِ; زِيَادِةِ→زِيَادَةِ; لمَ ْيَذْكُرْ→لَمْ يَذْكُرْ
  - فَضَائِلٍ صَلاَتِهِ→فَضَائِلِ (a mudaf); أَوْ التَّشَهُّدَيْنِ أَو الجُلُوْسُ→أَوِ … أَوِ الجُلُوْسِ (genitive after كَـ)
  - َوصَاحِبِ→وَصَاحِبِ; ذُوْ النَّسَبِ→ذُو; وَرجَّحَ→وَرَجَّحَ; الصِّحِيْحِ→الصَّحِيْحِ; أَيْضُا→أَيْضًا; الرَّابَعُ→الرَّابِعُ
  - إِحْتِرَازًا→احْتِرَازًا (the masdar of افتعل starts with a wasl alif); الْمَصَلِّيْ→الْمُصَلِّيْ; الأَظَافِرْ.→الأَظَافِرِ.
  - وَصَلاَةُ الجَنَازَةُ→الجَنَازَةِ (a mudaf ilayh); أَمَات→أَمَاتَ; يُحْيِى→يُحْيِي; وَفَاٍء→وَفَاءٍ; الأَحْيَاِء→الأَحْيَاءِ; اللَّهُمَ→اللَّهُمَّ
  - وَلِمْن→وَلِمَنْ; واَلمُسْلِمَاتِ→وَالمُسْلِمَاتِ; الدُّعُاءِ→الدُّعَاءِ; وَالأُنْثىَ→وَالأُنْثَى; أذَكَرٌ→أَذَكَرٌ; صِحَّة→صِحَّةِ; شُرُوِط→شُرُوْطِ
  - المِمْكِنُ→المُمْكِنُ; وَكُلِّ مَا وَصَلَ→وَكُلُّ (a mubtada'); تُطْعمُ→تُطْعِمُ; رَمَضَانٌ آخَرَ→آخَرُ (a na't of the fa'il)
  - كَانَت الصَّلاَةُ ×2 / عُلِمَت السَّلاَمَةُ / تُعَطَّل المَسَاجِدُ→the joining kasra; يَومِ→يَوْمِ; النَبِيِّ→النَّبِيِّ
- **Missing kasra on a letter that is otherwise vowelled:** ذَلكَ ×4, تِلكَ, ممَّا ×2, إنْ/إنَّ ×5, أنَسٍ, أخَّرَ, إخْوَانِهِ ×2.
- **Bare و of conjunction given a fatha:** والوَدْيُ، والبَوْلُ، والرِّيْحُ، واللهُ، وسَمِعَ، ويَضُرَّ.
- **Shadda added in the relative pronoun:** الذِي ×6, الذِيْ, التي ×2 → الَّذِي / الَّتِي.
- **Final damma added:** «وَاللهُ أَعْلَم.» ×2. The one unvowelled «والله أعلم.» was vowelled.
- **Kasra removed from a mid-sentence wasl alif:** «اِسْتَعَاذَكَ، اِغْفِرْ، عَنِ ابْنِ ×2، أَوِ اثْنَتَيْنِ، فَإِنِ اقْتَدَيْتَ، أَوِ امْرَأَةٌ، اسْمَ». The alif is silent there, so a learner should not read a hamza. «اِعْلَمْ» at the start of a bab is kept.
- **Completed marks on particles (126 places).** The base leaves the last letter of these particles bare. It now has a sukun, or the joining vowel before a wasl:

  | Particle | Changes |
  |---|---|
  | مِن→مِنْ / مِنَ | 54 / 20 |
  | مَن→مَنْ / مَنِ | 20 / 2 |
  | عَن→عَنْ / عَنِ | 9 / 1 |
  | لَم→لَمْ | 7 |
  | أَو→أَوِ / أَوْ | 4 / 1 |
  | لَو→لَوْ | 3 |
  | إِن→إِنْ / إِنِ | 1 / 2 |
  | أَن→أَنْ | 1 |
  | بَل→بَلْ | 1 |

- **Kept as in the source:** these are print conventions, not errors.
  - The sukun on long vowels: الوُضُوْءُ, اليَمِيْنِ, يَسْهُوْ. This is the printer's consistent style; only the Qur'an words follow the Mushaf.
  - The kasra on the wasl alif after ال: الاِسْتِنْشَاقُ, الاِحْتِرَازُ, الاِعْتِدَالُ.
  - The interchange of «الوُضُوءُ» and «الوُضُوْءُ».

## Places to check (left as in the base, or chosen with some doubt)
1. «فَهَذِهِ سَبْعَةٌ»: I added «وَغَسْلُ الوَجْهِ» on the evidence of N and the count. A clean printed copy could confirm its exact position.
2. «سُنَنُ الصَّلاَةِ فَاثْنَا عَشَرَ»: the base lists 11. The OCR texts cannot show whether a print has a twelfth item (for example «وَالتَّشَهُّدَانِ»). Left as is.
3. «فَضَائِلُ الصَّلاَةِ فَعَشَرَةٌ» and the counts in the jumu'a section: these were not re-counted against a print.
4. «وَالاِسْتِنْثَارُ، وَهُوَ **جَذْبُ** المَاءِ مِنَ الأَنْفِ». In the fiqh books, istinthar means expelling the water. The OCR is too garbled here to show whether a print reads «دفع» or «نثر». Left as is.
5. Grammar choices that should be confirmed by a teacher: «رَمَضَانٌ آخَرُ», «وَتَوَسُّطُ العِشَاءِ», «وَكُلُّ مَا وَصَلَ».
6. Variants noted from N but not adopted: «إذا أحكمت الأولى», «وصوم شهر رمضان», «وصيام ثلاثة أيام».
