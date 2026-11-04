# Texts report — نخبة الفكر في مصطلح أهل الأثر (`nukhba.json`)

Comparison method: each witness was stripped of harakat and tatweel, alef/yaa/taa-marbuta forms were unified, and the texts were aligned word by word with an LCS script (no comparison by eye). A second script compared the harakat of every word that matched in letters.
Scripts: `tools/texts/nukhba-build/` (`nukhba-extract.js` extracts the matn of the three editions, `nukhba-build.js` cleans and builds the JSON, `compare.js` collates wording, `harakat-diff.js` collates vocalization, `vocheck.js` lists unvocalized words). Raw downloads: `tools/texts/raw/nukhba/` (`s616_*`, `s1565_*`, `s5940_*`; extracted text in `_base616.txt`, `_notes616.txt`, `_itr1565.txt`, `_dar5940.txt`; final text in `_clean.txt`).

## Sources
- **Base (wording + vocalization): المكتبة الشاملة 616** «نخبة الفكر في مصطلح أهل الأثر», edited by د. عبد المحسن بن محمد القاسم (2nd ed. 1441H). This is a critical edition built on eight manuscripts (أ–ح). Manuscript أ is dated 821H, in the author's lifetime, and some of the others were read to the author. It is fully vocalized, and the editor's apparatus lists every variant. Pages 46–73: https://shamela.ws/book/616/46 … /616/73
- **Check 1 (I): المكتبة الشاملة 1565** «نزهة النظر في توضيح نخبة الفكر», edited by نور الدين عتر. Its appendix prints the matn on its own, vocalized («متن نخبة الفكر بفهرس صفحات شرحه»). Pages 146–151: https://shamela.ws/book/1565/146 … /1565/151
- **Check 2 (D): المكتبة الشاملة 5940** «نخبة الفكر», دار الحديث edition. It is partly vocalized. The bracketed commentary insertions were removed before collation. Pages 2–18: https://shamela.ws/book/5940/2 … /5940/18
- I and D are separate editions from the base. Both of them often follow the wording of نزهة النظر (the author's own commentary).

## Count
- 1213 words in 43 paragraphs and 21 chapters (5 groups: الخبر وأقسامه، المقبول، المردود، الإسناد، الخاتمة). The basmala is in its own field.
- Paragraphs are 9–42 words long and end at a sentence break. They follow the edition's sentence lines, in the matn's order, with nothing dropped or added.
- **Chapter titles are the app's own (descriptive), not the author's.** The matn runs on without headings. Its only heading is «خَاتِمَةٌ», which was moved out of the text into the title of chapter 19.
- Final collation: base vs I gives 1182 common words and 30 hunks. Base vs D gives 1167 common words and 56 hunks. Every hunk is accounted for below. They are editorial headings/additions, recension variants, or spelling differences.

## Changes to the base text
- Removed: footnote numbers, the editor's paragraph stars «*», his parenthetical dashes, and the page split inside «وَعَلَى آلِهِ | وَصَحْبِهِ».
- «صلى الله عليه وسلم» is printed unvocalized in the source → vocalized صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ (no other reading is possible).
- Tatweel removed: «كَـ«» → «كَ«».
- Vocalization fixes (iltiqāʾ al-sākinayn, and a missing kasra). Each one follows the same edition's practice elsewhere, e.g. «أَوِ احْتِمَالاً», «أَوِ اثْنَانِ»:
  | Source | Written as |
  |---|---|
  | أَوْ الِاشْتِبَاهُ | أَوِ الِاشْتِبَاهُ |
  | مُتَّفِقَيْ الِاسْمِ | مُتَّفِقَيِ الِاسْمِ |
  | وَإلَّا فَلَا عِبْرَةَ (no kasra under the hamza) | وَإِلَّا |
- The vocalization check (`vocheck.js`) finds **0 unvocalized words**.

## Wording differences (base = Q; I = عتر; D = دار الحديث) — the Q reading was kept in every case
The rule: Q is a manuscript-based critical edition, and its editor states which manuscripts support each reading. Most I/D readings are, by his notes, words the author added when he wrote نزهة النظر, so they belong to the commentary and not to the matn.

| Place | Q (kept) | I / D | Editor's evidence |
|---|---|---|---|
| opening | لَمْ يَزَلْ عَالِماً | D «عليماً» | Q and I agree |
| opening | إِلَى النَّاسِ بَشِيراً | D adds «كافةً» | Q and I agree |
| opening | وَعَلَى آلِهِ وَصَحْبِهِ | I, D «وعلى آل محمد» | the 4 mss ب ج د ح have «آل محمد» (note 47/5). Q's choice is kept → **to confirm** |
| الخبر | فَوْقَ الِاثْنَيْنِ | D «الاثنتين» | Q, I |
| الغريب | إِطْلَاقُ الفَرْدِيَّةِ | D «الفرد» | Q, I |
| المعروف | وَمَعَ الضَّعْفِ: الرَّاجِحُ | I, D «فالراجح» | the fāʾ is in ms ز only, and it is «مما زاده المصنف في النزهة» (51/3) |
| مختلف الحديث | فَهُوَ مُخْتَلِفُ الحَدِيثِ | I, D «فمختلف» | Q's mss |
| الناسخ | أَوْ ثَبَتَ المُتَأَخِّرُ | I, D «أو لا، وثبت» | no ms of Q has «لا» (53/2 lists only «يثبت», «وإن ثبت») → **to confirm** |
| السقط | مِنْ مُصَنِّفٍ | D drops it | Q, I |
| المرسل | وَالثَّانِي: المُرْسَلُ | D «هو المرسل» | Q, I |
| المرسل الخفي | مِنْ مُعَاصِرٍ لَمْ يَلْقَ | D adds «من حدث عنه» | Q, I |
| المقلوب | بِتَقْدِيمٍ وَتَأْخِيرٍ | I, D «أو تأخير» | only mss و د have «أو» (56/6) |
| المصحف | بِتَغْيِيرِ حُرُوفٍ | D drops «حروف» | Q, I |
| المبهم، صيغ الأداء، العدد | أَوْ لَا يُسَمَّى / أَوْ غَيْرِهَا / فَإِمَّا | D «َوْ», «َإِمَّا» | a letter lost in D's typing only |
| البدعة | لَمْ يَكُنْ دَاعِيَةً فِي الأَصَحِّ | D adds «إلى بدعته» | Q, I |
| البدعة | إِلَّا إِنْ رَوَى | I «يرويَ» | ب و «يروي» (58/7). Q's past tense is kept, and it goes with «فَيُرَدُّ» |
| البدعة | الجُوزَجَانِيُّ | D «الجوزقاني» | D is a misprint (Q's note quotes ابن رسلان on the vocalization) |
| الشاذ (سوء الحفظ) | فَالشَّاذُّ عَلَى رَأْيٍ | I, D «فهو الشاذ» | Q's mss |
| المرفوع | صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | D «تعالى» / «وعلى آله» | additions in D only |
| العلو | وَالثَّانِي: العُلُوُّ النِّسْبِيُّ | I, D drop «العلو» | it is dropped only in ب ز (61/2) |
| البدل، المساواة، المصافحة | وَالبَدَلُ؛ … وَالمُسَاوَاةُ؛ … وَالمُصَافَحَةُ؛ | I, D «وفيه البدل/المساواة/المصافحة» | «وهي من ضمن نزهة النظر» (61/4) |
| الأقران | وَإِنْ رَوَى كُلٌّ مِنْهُمَا | D drops «وإن روى» | Q, I |
| من حدث ونسي | وَإِنْ جَحَدَ الشَّيْخُ مَرْوِيَّهُ | I, D drop «الشيخ» | Q's mss |
| صيغ الأداء | فَإِنْ جُمِعَ: فَهُوَ كَالخَامِسِ | I, D «فكالخامس» | Q's mss |
| صيغ الأداء | إِلَّا مِنَ المُدَلِّسِ | D «مدلس» | و «مدلِّس» (64/10). Q kept |
| الإجازة | وَالإِعْلَامِ | I, D «وفي الإعلام» | only ح has «وفي» (65/5) |
| الإجازة | وَلِلْمَجْهُولِ وَالمَعْدُومِ | I, D «وللمجهول وللمعدوم» | the 4 mss د هـ و ز have «والمجهول», and «لِـ» before المعدوم is from the Nuzha (65/6–7). Q kept |
| المتفق والمفترق | وَكَذَا إِنْ وَقَعَ ذَلِكَ الِاتِّفَاقُ | I drops «ذلك» | dropped only in ح (66/5) |
| المتشابه | وَالتَّأْخِيرِ، وَنَحْوِ ذَلِكَ | I, D «أو نحو» | only و ز have «أو» (66/11) |
| الخاتمة | (heading) خَاتِمَةٌ | I prints it inline | Q has it as a heading (used as the chapter title) |
| مراتب الجرح | وَأَسْوَأُهَا | D «وأسوؤها» | a spelling variant of the hamza only |
| مراتب الجرح | أَوْ «فِيهِ أَدْنَى مَقَالٍ» | I, D drop «أدنى» | dropped only in ح (67/7) |
| الجرح المجمل | فَإِنْ خَلَا عَنْ تَعْدِيلٍ | I, D «التعديل» | Q's mss |
| الكنى | وَمَعْرِفَةُ كُنَى المُسَمَّيْنَ | I «فصل. ومن المهم معرفة», D «ومن المهم معرفة» | an editorial heading/addition in I and D |
| الكنى | وَمَنْ كَثُرَتْ كُنَاهُ | I, D add «من اختلف في كنيته، و» | not in any of Q's mss (no note) → kept |
| النسب | أَوْ إِلَى غَيْرِ مَا يَسْبِقُ | D adds «أمه، أو إلى» | Q, I |
| المتفق اسمه | أَوْ وَاسْمُ شَيْخِهِ | I, D «أو اسم» | ب و «اسم» (69/12) |
| الأسماء المفردة | وَكَذَا الكُنَى، وَالأَلْقَابُ | I, D «والكنى والألقابِ» | Q's mss (the nominative goes with «وكذا») |
| الأنساب | أَوْ ضِيَاعاً وَسِكَكاً، وَمُجَاوَرَةً | I, D «أو سككاً، أو مجاورة» | «أو» is in ز ح only, «من ضمن نزهة النظر» (70/6–7) |
| التصنيف | وَتَصْنِيفِهِ عَلَى المَسَانِيدِ | D adds «إما» | Q, I |
| التصنيف | أَبِي يَعْلَى ابْنِ الفَرَّاءِ | I, D «بن» | spelling only |
| end | مُسْتَغْنِيَةٌ عَنِ التَّمْثِيلِ؛ فَلْتُرَاجَعْ لَهَا | D adds «وحصرها متعسر»; I drops «لها» | «وحصرها متعسر» is in أ ج د and is also in the Nuzha mss (73/6). Q left it out → **to confirm** |

## Vocalization differences with I (`harakat-diff.js`: 16 words; Q kept in all)
- Tanween/shadda placement only: خَفِيّاً/خَفِيًّا، مُقِلّاً، خَطّاً، النَّاقِلِ، التَّابِعِيِّ، وَاللُّقِيِّ.
- Real variants, each covered by Q's apparatus: اشْتُهِرَ (I اشْتَهَرَ; ب د هـ have it with fatha, 57/1); وَالمُدَلَّسُ (I المُدَلِّسُ); فَإِنْ جُمِعَ (I جَمَعَ); «فِيهِ أَدْنَى مَقَالٍ» (I مَقَالٌ; Q follows أ ج د و, 67/8); فَيُرَدُّ after the past tense رَوَى (I فَيُرَدَّ after يَرْوِيَ); وَالأَلْقَابُ/وَالأَنْسَابُ (I genitive, because it has no «وكذا»).
- الأَوَّلِ (I الأَوَّلُ): Q's genitive after «سِوَى» is correct.

## مواضع للتأكد (Q's reading was kept; Yusuf to decide if he prefers the common printed reading)
1. «وَعَلَى آلِهِ وَصَحْبِهِ» — 4 mss and I/D: «وَعَلَى آلِ مُحَمَّدٍ وَصَحْبِهِ».
2. «أَوْ ثَبَتَ المُتَأَخِّرُ: فَهُوَ النَّاسِخُ» — I/D: «أَوْ لَا، وَثَبَتَ المُتَأَخِّرُ». This is the reading in many student copies, but none of Q's 8 mss has it.
3. End: «وَحَصْرُهَا مُتَعَسِّرٌ» — in mss أ ج د and D, not in Q.
