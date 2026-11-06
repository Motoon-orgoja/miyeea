# Texts report — نظم الآجرومية لمحمد بن أبّ المزمري التواتي (`ibnabb.txt`)

Verse numbers below are the running numbers 1–154 of `ibnabb.txt` (headings not counted); they equal KO's printed numbers.

Method: the texts were stripped of harakat/tatweel, alef/yaa/taa-marbuta unified, and compared word by word **by script**
(hemistich by hemistich, plus a substring check of every hemistich against the whole of each commentary). The harakat of
matching words were then compared letter by letter. Raw downloads: `tools/texts/raw/ibnabb/`. Scripts: `tools/texts/ibnabb-build/`:
- `fetch.js` (Shamela pages), `../ko-fetch.js ibnabb 103130` (ketabonline);
- `extract.js` → `ko.json`, `hz.json`; `collate.js` → `collation.txt`, `pairs.json`; `substr.js [book]` (substring check);
- `build.js` → `ibnabb.txt` (every change listed in the script and logged in `word-fixes.log`);
- `meter.js` → rajaz check of every hemistich (uses `../ibnashir-build/rajaz.js`).

## Sources
- **Base (KO): ketabonline 103130 «نظم المقدمة الآجرومية للتواتي القلاوي [1160]»**, source «الشاملة الذهبية», 154 numbered verses, fully vocalized.
  https://ketabonline.com/ar/books/103130 — `raw/ibnabb/ko103130.json`.
- **Check (HZ): «فتح رب البرية في شرح نظم الآجرومية» لأحمد بن عمر الحازمي**, مكتبة الأسدي، مكة ١٤٣١هـ (print-matched), Shamela 36087,
  all 649 pages — https://shamela.ws/book/36087 — `raw/ibnabb/shamela-36087-p*.html`. The verses are printed vocalized before the commentary.
  This is the edition the owner named as the circulated one.
- **Third witness (HL): «الشرح المختصر على نظم الآجرومية» للحازمي** (lesson transcripts by alhazme.net), Shamela 36106, 187 pages —
  https://shamela.ws/book/36106 — `raw/ibnabb/shamela-36106-p*.html`. Used for the disputed places.
- **Independence caveat:** KO and HZ share the same headings (even the typo «بَابَ إِنَّ», «الفاعِلِ») and almost all harakat
  (31 mark differences in 154 verses), so KO is most likely a digitization of the same Hazimi matn. HL is a separate typing
  (from audio lessons) and agrees with KO, not HZ, in verses 1, 97, 111.
- Attribution: HZ (p. 12) and HL (p. 8) name the author محمد بن آبَّ القلاوي التواتي (ت ١١٦٠هـ) and reject the attribution to «عبيد ربه»
  (KO's card still says «"عبيد ربه" محمد بن أبّ القلاوي التواتي الشنقيطي»). The poem's date verse: «فِي عَامِ عِشْرِينَ وَأَلْفٍ وَمِائَهْ» = 1120 AH.
- **Vocalization:** 98.1% of countable letters marked (`scripts/vcount.js`, after moving the fatha typed on the alif of «لاَ» to the lam).
  The unmarked ones are only the article alif/lam after a prefix (وَال، بِال، فَال، لِل) and لفظ الجلالة's lam, which conventionally carry no marks.

## Count
- **154 verses** (KO numbering 1–154; HZ has all 154). Matches the usual count of this nazm (≈ ١٥٠–١٥٤).
- 37 headings in KO = HZ's set; four group titles directly followed by a chapter title are joined on one line with « · »
  (المرفوعات/التوابع/المنصوبات/المخفوضات), because `build-poem.js` keeps only the last of two consecutive headings → 33 sections.
- Heading fixes: «مقدمة» → «مُقَدِّمَةٌ»; «المرفوعات مِنَ الأَسْمَاءِ» → «المَرْفُوعَاتُ مِنَ الأَسْمَاءِ» (as HZ); «بَابُ الفاعِلِ» → «بَابُ الفَاعِلِ»;
  «بَابَ إِنَّ» → «بَابُ إِنَّ»; «خَاتِـ ـمَةٌ» → «خَاتِمَةٌ»; «التَّوكِيدِ» → «التَّوْكِيدِ»; «لأَجْلِهِ» → «لِأَجْلِهِ».

## Wording differences and the choice (owner rule: the circulated wording of the Hazimi edition)
| Verse | Chosen | Other | Why |
|---|---|---|---|
| 1 | قَالَ **ابْنُ آبَّ وَاسْمُهُ** مُحَمَّدُ | قَالَ **عُبَيْدُ رَبِّهِ** مُحَمَّدُ (KO, HL) | HZ prints «ابن آبّ» and says it is «الصواب … ولا نقول: قال عبيد ربه محمد»; HL: «اختلفت النسخ … والخلاف سهل». **Base changed — owner may prefer عبيد ربه (also widely memorized).** |
| 97 | مَهْمَا **تَرَ** اسْمًا | تَرَى (KO, HL) | HZ: «وترَ … مجزوم وجزمه حذف حرف العلة». Same pronunciation. Base changed. |
| 111 | مِنْهَا **مُفَسِّرٌ** | مُفَسِّرًا (KO, HL) | HZ prints مُفَسِّرٌ; HL: «مفسر … هذا أحسن بالرفع، يجوز النصب لكن الرفع أحسن». Base changed. |
| 22 | **حَمُوكِ** | حَمُوكَ (KO) | HZ and HL: «حموكِ بالكسر … والمشهور هو الكسر». |
| 88 | وَ**كُلٌّ** أَجْمَعُ | وَكُلُّ (KO) | HZ. |
| 147 | وَبِالتَّ**بْ**عِيَّةِ | التَّبَعِيَّةِ (KO, HL print) | HZ; HL: «تبْ بإسكان الباء للوزن». Meter. |
| 151 | **بِ**حَمْدِ | حَمْدِ (HZ verse line) | HZ's own commentary has «بحمد جار ومجرور» — dropped ب is a typo in the verse line. KO kept. |

## Marks completed / corrected (all in `word-fixes.log`)
- From HZ where KO lacked or misplaced them: المُنْتَقَى، المَنْظُومِ، حَتَّى، رَفْعٌ، كَجَاءَ، شَيْءٌ، مُحْصِيَا، وَالحَذْفَ، فِعْلٌ، فَتًى، مَكَانِيًا، حِينًا، وَوَقْتًا، انْبَهَمْ، وَفَضْلَةً، مُتَّصِلَهْ، وَمُذْ.
- Typos shared by both (only one reading possible): والَّلاَمُ/بِالَّلامِ → وَاللاَّمُ/بِاللاَّمِ، وَلَعَلّ → وَلَعَلَّ، أقْسَامُهُ → أَقْسَامُهُ، أيٍّ → أَيٍّ، ِلأَلِفٍ → لِأَلِفٍ، مُوَاِفقٌ → مُوَافِقٌ،
  وِالتَّنْكِيرِ → وَالتَّنْكِيرِ، السُّكَونَ → السُّكُونَ، اغْتَنِم → اغْتَنِمْ، إذَا → إِذَا، لإِنَّ → لِإِنَّ، واللهَ → وَاللهَ، وَاللَيْلَةَ → وَاللَّيْلَةَ، تَغْييرُ/تَمْييزٍ → تَغْيِيرُ/تَمْيِيزٍ، مِثُالُهُ → مِثَالُهُ.
- Sukun added on a bare letter between a vowelled letter and the next (32 words: زَيْدٌ ×12، غَيْرُ، القَوْمُ، الشَّيْءِ، لِلْمَفْعُولِ، الأَلْبَابِ …).
- Kept as in both sources on purpose: «الإِسْمُ» (v.57, hamza read qatʿ for the meter), «عَمْرِو» at the hemistich end (v.134, rhymes with اسْتُقْرِي), «وَالثَّانِي / فَالمَاضِي / وَالبَاقِي» (final ي read short), «الاِعْرَابُ / الآخِرِ / الأَمْرِ» (naql).

## Meter
`meter.js` scans all 308 hemistichs as rajaz (respelling a copy only for the readings the rough scanner cannot know: naql, the
unwritten long a of هذا/ذلك/لكنّ, final ي read short, ishbaʿ). 307 scan; one is flagged:

## مواضع للتأكد
1. **v.1** — «ابْنُ آبَّ وَاسْمُهُ» (HZ) vs «عُبَيْدُ رَبِّهِ» (KO, HL, and many prints). Chosen per owner rule; easy to switch in `build.js` (FIX v.1).
2. **v.95** «وَبَدَلُ اشْتِمَالٍ نَحْوُ رَاقَنِي» — scans only without the tanween («اشْتِمَالِ نَحْوُ»); all three witnesses print «اشْتِمَالٍ». Left as printed.
3. **v.111** مُفَسِّرٌ / مُفَسِّرًا and **v.97** تَرَ / تَرَى — HL (Hazimi's lessons) has the KO forms; the print (HZ) changed them.
