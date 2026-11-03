# Texts report — متن الرحبية (بغية الباحث عن جمل الموارث) — `rahabiyya.txt`

Author: محمد بن علي بن محمد الرحبي الشافعي، ابن المتقنة (ت ٥٧٧هـ). Meter: الرجز. Field: الفرائض.
Verse numbers below are the base edition's numbering (1–176).
How the comparison was done: `raw/rahabiyya/build.js` builds the txt from the saved base pages and compares every verse word by word with both check sources, after removing harakat and tatweel and unifying the alef/yaa/taa-marbuta forms. The comparison is done by script, not by eye. Its full output is in `raw/rahabiyya/collation.json`, and the vocalization conflicts it found are in `raw/rahabiyya/vocalization-diffs.txt`.

## Sources
- **Base (fully vocalized):** المكتبة الشاملة, book 574 «متون طالب العلم – المستوى الرابع», collected and edited by عبد المحسن بن محمد القاسم. The section is titled «بغية الباحث عن جمل الموارث (الرحبية)», pages 70–114: https://shamela.ws/book/574/70 … /574/114
  It is a critical edition based on 11 manuscripts (Chester Beatty 8th c., Sana'a 8th c., King Saud University 851H, Süleymaniye 879H, Berlin 934H, Escorial 993H, …). The heading says «عدد الأبيات: ١٧٦». Raw pages are in `raw/rahabiyya/shamela574/`.
- **Wording check 1:** المكتبة الشاملة, book 11372 «متن الرحبية = بغية الباحث عن جمل الموارث», pages 1–30. It is unvocalized and has many typos and run-together words. OpenITI's copy (0577IbnMutafannina.BughyatBahith) is the same text. https://shamela.ws/book/11372 — raw pages are in `raw/rahabiyya/shamela11372/`.
- **Wording + vocalization check 2:** ketabonline 102305 «الهدية في شرح الرحبية» by رشيد بن محمد القيسي (ت ١٤٢٥هـ), described as «مقابل ومشكول ومراجع» by مكتب الرحاب. The verses are quoted in full and vocalized: https://ketabonline.com/ar/books/102305 — raw pages are in `raw/rahabiyya/ketab102305/`.
- I did not find a digital copy of the شنشوري or سبط المارديني commentaries (vocalized or not) on Shamela or Ketabonline. The «الهدية» commentary was used in their place.

## Verse count
**176**, which matches the edition's own count, and «عَرِيق» also gives 176. Shamela 11372 has 175 because it omits verse 55 «وَهْوَ لَهَا أَيْضاً مَعَ الإِثْنَيْنِ … مِنْ إِخْوَةِ المَيْتِ فَقِسْ هَذَيْنِ». «الهدية» quotes all 176. The commonly cited figure of «١٧٥» probably comes from copies that lack this verse.
Not included: the 11 verses by الخليفي (ت ١٣٨١هـ) on الرد and ذوو الأرحام. The base prints them after the text as a separate addition (Shamela 574/115–117). They could be added as an appendix if wanted.

## Headings (24)
I used the base's headings: مقدمة، أسباب الميراث، موانع الإرث، الوارثين من الرجال، الوارثات من النساء، الفروض المقدرة، النصف، الربع، الثمن، الثلثين، الثلث، السدس، ميراث الجدات، التعصيب، الحجب، المشرّكة، الجد والإخوة، الأكدرية، الحساب، تصحيح المسائل، المناسخة، الخنثى المشكل والمفقود والحمل، الهدمى والغرقى ونحوهم، خاتمة.
- «مُقَدِّمَةٌ» was added before verse 1, because the base has only a prose introduction there. The word is the editorial heading «[مقدمة]» from Shamela 11372.
- «[خَاتِمَةٌ]» is bracketed in the base as an editorial heading. I kept it without the brackets.
- Shamela 11372 has no «ميراث الجدات» heading, and it calls the section «باب السهام» and starts it at verse 138 (the base's «تصحيح المسائل» starts at verse 136).

## Wording differences (base kept in every case)
In the table, S = Shamela 11372 and H = «الهدية» (ketabonline 102305).

| Verse | Base (kept) | Other reading | Note |
|---|---|---|---|
| 18 | وَالوَارِثُونَ **فِي** الرِّجَالِ | مِنَ (S, H) | With «في», the meter scans مستفعلن متفعلن متَعِلن. «مِنَ الرِّجَالِ» gives a «u u – u» foot, which is not a valid رجز foot. The well-known recitation is «من». |
| 24 | وَالوَارِثَاتُ **فِي** النِّسَاءِ | مِنَ (S, H) | Same as 18. |
| 48 | وَهُوَ لِاثْنَيْنِ **أَوِ اثْنَتَيْنِ** | أو ثِنْتَيْنِ (S, H) | «أو ثنتين» breaks the meter (نِ أوْ ثِنْ تَيْ = u – – –). The base scans correctly. |
| 63 | لِأُمٍّ **أَوْ أَبِ** | أو لِأَبِ (H), وأب (S) | «أو لأب» adds a syllable and breaks the meter. |
| 82 | إِنْ **يَكُنْ** بَنَاتُ | تكن (S, H) | Both are grammatical, and the meter is the same. |
| 98 | وَاسْتُغْرِقَ المَالُ | واستغرقوا المالَ (S, H) | The meter is the same. The well-known recitation is «واستغرقوا». |
| 120 | لِتَنْتَهِي فِيهِ إِلَى الصَّوَابِ | لِتَهْتَدِي بِهِ (H), لتهدي به (S) | The meter is the same. The well-known recitation is «لتهتدي به». |
| 130 | تَلِيهَا فِي الأَثَرْ … بِالعَوْلِ إِفْرَاداً | تليها بالأثر … في العول (S, H) | The two prepositions are swapped. The meter is the same. |
| 141 | فَاحْفَظْ وَدَعْ عَنْكَ الجِدَالَ وَالمِرَا | فاتبع سبيل الحق واطرح المرا (S) | H agrees with the base. |
| 149 | أَنْ **تَضِلَّ** عَنْهُ | تزيغ (S, H) | The meter is the same. |
| 158 | إِنْ لَمْ **يَكُنْ** بَيْنَهُمَا | تكن (S, H) | Both are grammatical. |
| 163 | القِسْمَةِ المُبِينِ | القسمة والتبيين (S) | H agrees with the base. |
| 164 | يَكُونُ هُوْ أَوْ أُنْثَى | يكون أو هو أنثى (H, S) | The words are reordered. The base scans cleanly. |
| 165 | **يُبْنَى** عَلَى اليَقِينِ | فابْنِ على اليقين (S, H) | The meter is the same. |
| 171 | **فَنَحْمَدُ اللَّهَ** عَلَى التَّمَامِ | والحمدُ للهِ (H), فالحمد لله (S) | |
| 172 | **وَنَسْأَلُ** العَفْوَ … مَا **نَأْمُلُ** | أسألُه العفو (S, H); ما تأمل (S) | |
| 173 | وَسَتْرَ مَا **شَانَ** | ما كان (H) | S agrees with the base. |
| 13, 31, 27 | عَنْ إِيجَازِ / فَالنِّصْفُ / وَاعْلَمْ | S drops «عن»; S and H have «والنصف»; H has «اعلم» | These are small differences. |

**Verse order.** S and H both order the حجب verses 84, 86, 85 (الجدات before ابن الابن). S also orders verses 148, 150, 151, 149 (in السهام) and 157, 159, 160, 158 (in المناسخة). I followed the base order. H agrees with the base on the last two groups.

The remaining S differences are clear typos or run-together words, for example حياه/حباه، القلوب/القرب، عوالها/عولها، فروعها/فروضها، والعبد/والبعد، قاصدا/قاعدا.

## Vocalization
- The base is fully vocalized. The only unmarked letters are tanwin-alif, the lām of «ال» before sun letters, and long vowels.
- The script compared each letter's short vowel with H. It found 20 conflicts. In every one the base is correct by grammar or meter, or H has a typo. Examples: فَثُلُثُ البَاقِي (meter needs ثُلُث), أَرْبَعَةٍ أَقْسَامِ, حُكْمِهِمْ إِثْنَانِ, الوَفْق, القَوْلَ (object of هاك), وَأَفْضَلَ (object of نسأل). Shadda differences were not compared by script, for example 27 قُسِمَا (base) against قُسِّما (H). Both scan.
- **Completed:** 159 «وَكُلُّ سَهْم» became «سَهْمٍ». The tanwin was missing, and H has «سَهْمٍ».
- **Cleaned:** 117 «بِـ «الَاكْدَرِيَّهْ»» became «بِالَاكْدَرِيَّهْ». I removed the editor's tatweel and quotation marks.
- **Kept as in the base:** the hamza-less transfer spellings in 41 «لِلُاخْتَيْنِ» and 117 «بِالَاكْدَرِيَّهْ». The meter requires the vowel to be moved onto the lām. I also kept the hamzat qaṭʿ the meter needs in «ابْنُ إِبْنٍ» (45), «الإِبْنِ» (54، 85، 90), «إِبْنُ الأَخِ» (96), «الإِثْنَيْنِ» (55) and «إِثْنَانِ» (132), and the sukūn in «هُوْ» (164).

## Points to confirm
1. **Which text to follow.** The base follows the manuscript critical edition. The popular recitation (S, H) differs in about 12 verses (18، 24، 48، 82، 98، 120، 130، 149، 158، 165، 171–172) and in the order of 85/86. Three of those popular readings break the meter (18، 24، 48). If the app should match the popular recitation used with the شنشوري commentary, the H reading and vocalization are listed above verse by verse and can replace the base.
2. The spellings «لِلُاخْتَيْنِ» and «بِالَاكْدَرِيَّهْ» may look like typos to a reader. The usual way to write them is «لِلْأُخْتَيْنِ» and «بِالأَكْدَرِيَّهْ», and the pronunciation is the same.
3. Whether to add الخليفي's 11-verse addition as a section at the end.
