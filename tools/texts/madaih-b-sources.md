# Texts report: مختارات المدائح النبوية — القسم الثاني (البوصيري ومن بعده) — `madaih-b.txt`

An anthology: only the best-known verses of each poem, in the poem's order, nothing composed or reworded. 18 pieces (`## الشاعر: القصيدة — المقطع`), **142 verses**. No meta file was written.

Scripts: `madaihb-build/` — `get.js` (fetch), `parse.js` + `parse-k.js` / `parse-m.js` / `parse-s.js` (witnesses → `out/<poem>.json`), `sel.js` (the selection and every editorial decision), `build.js` (collation, completion, meter, coverage → `out/madaih-b.collation.txt`, `out/madaih-b.build-log.txt`), `meter.js` (البسيط, الكامل, الوافر, الخفيف). Raw downloads: `raw/madaih-b/`.

## 1. Pieces, sources and count
Verse numbers are those of the base text.

| # | Piece | Verses taken | n | Base | Collated with |
|---|---|---|---|---|---|
| 1 | البوصيري: البردة — المطلع | 1–5 | 5 | A | K, W |
| 2 | — في التحذير من هوى النفس | 16–19, 24, 25 | 6 | A | K, W |
| 3 | — في مدحه ﷺ | 34–38, 41–43, 51, 54–56 | 12 | A | K, W |
| 4 | — في القرآن | 91–93, 97–99, 103, 104 | 8 | A | K, W |
| 5 | — في الإسراء والمعراج | 107–110, 114, 116, 117 | 7 | A | K, W |
| 6 | البوصيري: الهمزية — المطلع | 1–3, 6–9 | 7 | A | S, H |
| 7 | — في شمائله ﷺ | 126–133 | 8 | A | H (S for 132–133) |
| 8 | البارودي: كشف الغمة — المطلع والمديح | 1, 2, 6, 23–27 | 8 | A | M |
| 9 | — الخاتمة | 426–429, 445–447 | 7 | A | M |
| 10–13 | شوقي: نهج البردة (المطلع / النفس والأخلاق / مدحه ﷺ ورسالته / الدعاء) | 1–4 · 25, 36–39 · 47, 62, 63, 66–74, 78, 79, 83–85, 113, 116 · 186–188, 190 | 32 | our `nahjburda.txt` | (already collated: see `nahjburda-sources.md`) |
| 14–15 | شوقي: الهمزية النبوية (المولد / الأخلاق والشمائل) | 1–3, 5, 6, 8, 13–15, 17, 18, 22, 24 · 25–27, 30–36, 41, 42, 44, 45 | 27 | our `walidalhuda.txt` | (see `walidalhuda-sources.md`) |
| 16–18 | شوقي: سلوا قلبي (المطلع / نبي البر / أبا الزهراء) | 1–3 · 46–48, 52–55 · 60–62, 66, 67 | 15 | A | D |

Sources:
- **البردة** (160 verses). **A** = aldiwan.net poem 18097, fully vocalized: https://www.aldiwan.net/poem18097.html · **K** = «العمدة في إعراب البردة» (دار اليمامة 1423, Shamela via ketabonline 3076): the 158 lemma verses, lightly vocalized, with a commentary that spells out many vowels — an independent witness: https://ketabonline.com/ar/books/3076 · **W** = Wikisource «أمن تذكر جيران بذي سلم» (159 verses, the adab.com text, many typos): https://ar.wikisource.org/wiki/أمن_تذكر_جيران_بذي_سلم
- **الهمزية** (457 verses in A). **A** = aldiwan.net poem 18028, *partly* vocalized: https://www.aldiwan.net/poem18028.html · **H** = «المنح المكية في شرح الهمزية» لابن حجر الهيتمي, OpenITI `0974IbnHajarHaytami.MinahMakkiyya` (OCR of the Dār al-Minhāj print, unvocalized, noisy) · **S** = verses quoted in «السيرة الحلبية», «الوحي المحمدي» and «مجلة الرسالة» on Wikisource (unvocalized).
- **البارودي** (447 verses). **A** = aldiwan.net poem 8190: https://www.aldiwan.net/poem8190.html · **M** = the poem as posted on mtafsir.net (thread 91379, 430 verses): https://mtafsir.net/posts/505500/ — the same digital text as A with the poster's corrections, so only a weak second witness. The Hindawi «ديوان البارودي» does not contain this poem, and Wikisource and the Shamela diwan do not have it either.
- **سلوا قلبي** (71 verses). **A** = aldiwan.net poem 63783: https://www.aldiwan.net/poem63783.html · **D** = الشوقيات, Hindawi, «ذكرى المولد»: https://www.hindawi.org/books/70706142/6/
- **نهج البردة / الهمزية النبوية**: copied from our own collated files; only the corrections of §4 were made.

Item 3 of the brief (الصرصري / ابن نباتة / ابن الخطيب / ابن جابر) was **left out**: I found no vocalized text with a second source that I could collate in the time available.

## 2. Wording
The 40 Burda verses agree word for word in A, K and W (only spacing/typos in W; K «غواتيها» for «غوايتها» is a typo). Barudi: A = M in all 15 verses.

| Verse | Adopted | Base | Why |
|---|---|---|---|
| الهمزية 6b | وَالْآبَاءُ | A «الأَباءُ» | S + H; A drops the و and the madda and does not scan |
| الهمزية 129a | عُرَى | A «عُرَا» | spelling of H; same pronunciation |
| سلوا قلبي 1a | سَلُوا | A «سَلو» | spelling of D |
| سلوا قلبي 1a | وَتَابَا | A «وَثابا» | D. «ثابا» is the rhyme word of v. 5. **To verify** (§6) |

Not adopted: الهمزية 132 S «فجهلت» (A + H «جهلت»); الهمزية 2 S «سَنًى» (A + H «سنا»). Every other H difference is OCR noise (س/ش, ت/ث, غ/ف).

## 3. Harakat
- **Coverage 99.9%** (4452 of 4456 letters). **Meter: all 284 hemistichs scan** (`node madaihb-build/meter.js madaih-b.txt`).
- **البردة:** A is fully vocalized; only its convention was normalized (لفظ الجلالة «اللَّه», shadda before the vowel). Corrected: 34a «سَيِّدُّ» → **سَيِّدُ** (typo).
- **البارودي / سلوا قلبي:** A follows the «الموسوعة الشعرية» convention (no sukun, no vowel before a madd letter, no shadda on a sun letter); completed mechanically by `complete()` (same rules as `madih-build`). Corrected:
  - البارودي 1a «يَمّمِ» → **يَمِّمْ** (imperative; M; A does not scan) · 6b «بِالريِّ» → **بِالرِّيِّ** (M)
  - البارودي 427a «يُروجُ» → **يَرُوجُ** (راج يروج) · 427a, 429b «مَعرَض» → **مَعْرِض** (§6)
  - سلوا قلبي 66a «حَفَظوا» → **حَفِظُوا** (D) · 66a «كان» → **كَانَ**
- **الهمزية (البوصيري):** A is only partly vocalized and I found **no fully vocalized digital text** (H and S are bare). The 15 verses were completed **by hand** on top of A's marks (`MANUAL` in `sel.js`; 100 words touched, each listed as `VOC` in the build log). The script checks that the letters are A's and reports any mark of A that was changed — one: 126b «الهَوَيْنَا» → **الْهُوَيْنَا** (diminutive of الهُونَى; H's commentary «تصغير الهُون»). These 15 verses should be read once against a printed vocalized edition.

## 4. Corrections to verses taken from our own files (the files themselves were not touched)
- `nahjburda.txt` v. 25a «تُخْفَى كُلَّ مُبْكِيَةٍ» → **تُخْفِي** (D «تُخفي»; a passive cannot take the accusative «كلَّ») · v. 69a «النّبِيُّونَ» → **النَّبِيُّونَ**. **Both should also be fixed in `nahjburda.txt`.**
- `walidalhuda.txt`: bare letters completed from aldiwan 20977 — 8b جَاءُوا · 13a بَشَّرَ · 14a الَّذِي · 22 بَدَتْ, بَعْضُهُ · 30a بَلَغْتَ بِالْجُودِ · 33b بَغْضَاءُ · 34b وَرِضَا · 44b بِعِرْضِكَ (kasra on ع from D). The same letters are still bare in `walidalhuda.txt`.
- The Hamziyya of Shawqi is only vocalized in vv. 1–45 of our file, so nothing was taken after v. 45 (e.g. «يا أيها الأمي حسبك رتبة», «والدين يسر والخلافة بيعة»).

## 5. Verses excluded for istighātha / tawassul / ghuluww
- **البردة:** 33 «لولاه لم تُخرج الدنيا من العدم» · 39–40 «وكلهم من رسول الله ملتمس…» · 44–45 «وانسب إلى ذاته ما شئت… ليس له حدّ» · 46 «أحيا اسمه حين يدعى دارس الرمم» · 52–53 «وكل آي أتى الرسل… من نوره» · 80–81 «واستجرت به… غنى الدارين من يده» · 105–106 «يا خير من يمّم العافون ساحته» · 145–148 «فإن لي ذمة منه بتسميتي… آخذًا بيدي» · 152–154 «يا أكرم الرسل ما لي من ألوذ به… جاهك بي… فإن من جودك الدنيا وضرتها».
- **همزية البوصيري:** 4–5 «أنت مصباح كل فضل…», «لك ذات العلوم من عالم الغيب».
- **البارودي:** 28–29 «نور تنقّل في الأكوان» · 374 «لولاه ما قُبلت رجاة آدم» · 418–420 «فهاكها يا رسول الله… بنظرة منك» · 441–444 (with 443 «إني لمستشفع بالمصطفى»).
- **نهج البردة:** 40–41, 43–45 «لزمت باب أمير الأنبياء…» · 90–92 «هذا العرش فاستلم», «يا قارئ اللوح» · 100 · 114 «وأنت خُيّرت في الأرزاق» · 177 «نزيل عرشك» (and 178–180 with it) · 189 «فالطف لأجل رسول العالمين بنا».
- **الهمزية النبوية:** 7 «واسم طه الباء» · 23 «في المهد يُستسقى الحيا برجائه» · 38 «فأنت بيت الله» · 114–123, 131.
- **سلوا قلبي:** 63 «فإن تكن الوسيلة لي أجابا» · 64 «وما للمسلمين سواك حصن».

**Kept, for the owner to decide:** البردة 36 «هو الحبيب الذي تُرجى شفاعته» (affirms the Shafāʿa only) · البردة 43 «دع ما ادعته النصارى… واحكم بما شئت مدحًا فيه» (asked for by name; some object to its second half) · الهمزية النبوية 3, 6 «والعرش يزهو…», «اسم محمد طغراء» (poetic, no textual basis).

## 6. To verify
- **سلوا قلبي 1a «وَتَابَا»** (D) against A «وَثابا».
- **همزية البوصيري 8b «عَلْيَاءٌ»:** A's tanwin was kept; the word is a diptote, so «عَلْيَاءُ» is expected, and both scan.
- **همزية البوصيري 126a «ضِحْكُهُ»** (A's kasra; the meter needs the sukun on ح).
- **البارودي 427, 429 «مَعْرِض»:** corrected from A + M «مَعْرَض»; no independent vocalized edition was available.
- **البردة 114 «غَيْرِ مُشْتَرَكٍ… غَيْرِ مُزْدَحَمِ»** (A; W has «غيرَ» twice).
- **Split words (تدوير):** the hemistich division of the sources is kept, so a word is split across « | » in البردة 34 and in همزية البوصيري 2, 3, 6, 126, 127, 129, 130.
