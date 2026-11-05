# Texts report: رثاء الأندلس، نونية أبي البقاء الرندي (d. 684 AH) — `rundiyya.txt`

Method and scripts: the same as `lamiyyatarab-sources.md` (`hikma-build/`, with `out/rundiyya.collation.txt` and `out/rundiyya.build-log.txt`). Raw downloads are in `raw/rundiyya/`.

## 1. Sources
- **Base (W1), the circulated text:** Wikisource «لكل شيء إذا ما تم نقصان» (43 verses, 40% vocalized): https://ar.wikisource.org/wiki/لكل_شيء_إذا_ما_تم_نقصان
- **Check 1 (N), the oldest source:** al-Maqqarī, «نفح الطيب من غصن الأندلس الرطيب», in the text of islamicbook.ws (`raw/rundiyya/islamicbook-nafh-014.html`). It has 42 verses and is unvocalized.
- **Check 2 (W2):** Wikisource «لكل شيء اذا ماتم (رثاء الأندلس)», the same text as Arabic Wikipedia's «رثاء الأندلس». It has 42 verses and is lightly vocalized.
- **Check 3 (K):** ketabonline 22185 «رثاء اشبلية للرندي». It is a partial copy of 30 verses with many typos.
- saaid.org/Minute/252 (`raw/rundiyya/saaid-252.htm`) was read but not parsed: the line breaks fall inside hemistichs. Its reading agrees with W1 (e.g. فارتزأت).

**No fully vocalized digital text was found.** The text is **43.6% vocalized**: W1 plus 39 words from W2 and K. Three misplaced marks from W2 and K were rejected (الكفرِّ، سيُوفَ، التُيجانِ).

## 2. Count and the doubted verses
- **43 verses** = N's 42 + v. 28 «يا أيها الملكُ البيضاءُ رايتُهُ | أدركْ بسيفِكَ أهلَ الكُفرِ لا كانوا».
- **Doubted:**
  - **v. 28** is in neither N nor W2. It is in the circulated text (W1, K). It was kept, following the circulated version.
  - Al-Maqqarī's note after the poem (quoted from N): «ويوجد بأيدي الناس زيادات فيها ذكر غرناطة وبسطة وغيرهما مما أخذ من البلاد بعد موت صالح بن شريف … ومن له أدنى ذوق علم أن ما يزيدون فيها من الأبيات ليست تقاربها في البلاغة، وغالب ظني أن تلك الزيادة لما أخذت غرناطة».
  - None of those Granada/Basṭa verses is in this text.
  - The last part, vv. 36–43 («يا من لذلة قوم…» to «لمثل هذا يذوب القلب…»), describes captivity and enslavement. It **is** in N, so al-Maqqarī accepted it.

## 3. Wording (rule: the circulated wording, i.e. W1; N decides with W2 when W1 is alone)
| v. | Adopted | W1 reading | Why |
|---|---|---|---|
| 36 | بعدَ **عزِّهمُ** | عزَّتِهِم | N + W2 |

Kept as in W1: 2 الأمورُ (W2 الأيام), 16 فارتزأتْ (N + W2 فامتحنتْ; K and saaid have فارتزأت), 27 مَعَ طولِ (N من طول), 13 الدهرِ (K الدنيا), 24 تَرثي (K تبكي), 36 كفرٌ (W2 جورُ). Spacing differences (ما ذا / ماذا، يا غافلا) were kept as in W1.

## 4. Harakat corrected (all logged)
- 17 «بَلَنْسِيَةَ» → **بَلَنْسِيَةً** (W2). The meter needs the tanwin.
- 23 «كنائسُ» → **كنائسَ** (W2). It is the predicate of صار.
- 30 «مُرهفةُ» → **مُرهفةً** (K). It is a ḥāl.
- 32 «ركُبانُ» → **رُكْبانُ** (W2).
- 42 «باكيةُ» → **باكيةٌ**. W1 and W2 both have the ḍamma, but the word is an indefinite predicate, and without the tanwin «ـكِيَتُ وَلْـ» does not scan.
- **Meter:** all 86 hemistichs scan as basīṭ (ḍarb فَعْلُن). The tanwin on «شاطبةٌ، قرطبةٌ، قواعدٌ، نواقيسٌ» is metrical (poetic ṣarf) and was kept.

## 5. To verify
- 12 «لَم يَسهُل لهُ **سببُ**»: W1 and W2 both have the ḍamma; grammar expects «سببٌ» (end of the first hemistich, so the meter does not decide). It was kept.
- 56% of letters stay bare. A fully vocalized edition, such as Iḥsān ʿAbbās's «نفح الطيب» as PDF, is needed to finish the vocalization.
