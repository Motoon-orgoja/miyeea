# Texts report — الخريدة البهية (`kharida.txt`)

Ahmad al-Dardir al-Maliki (d. 1201 AH), rajaz. Verse numbers below follow the base edition (1–71).
How the comparison was done: every source was parsed into verses by script, stripped of harakat and tatweel, alef/yaa/ta-marbuta forms unified, and compared word by word against the base (LCS diff, script output, not by eye). Harakat were then compared letter by letter.
Raw files as downloaded: `tools/texts/raw/kharida/`.

## Sources
- **Base (vocalized):** جامع الكتب الإسلامية (ketabonline), book 102218 «الخريدة البهية في علم التوحيد», marked as taken from «الشاملة الذهبية», numbered 1–71:
  https://ketabonline.com/ar/books/102218/read?page=1&part=1 (raw: `ketabonline-102218-p1.html`).
  The poem is not on shamela.ws / turath.io as a standalone matn (searched), so this Shamela-derived copy is the first choice.
- **Check 1 — independent fully vocalized copy:** fkdtdukuhturi.web.id «Nadhom Khoridatul Bahiyah» (an Indonesian pesantren copy):
  https://www.fkdtdukuhturi.web.id/2020/12/nadhom-khoridatul-bahiyah-terjemah.html (raw: `fkdtdukuhturi-nadhom-khoridah.html`). It has some copying errors, e.g. verse 43 first hemistich repeats verse 52.
- **Check 2 — al-Dardir's own commentary, fully vocalized verses:** «شرح الخريدة البهية للإمام الدردير | مكتبة تراث الأمة» (Google Sites):
  https://sites.google.com/view/sarhalkhrida1/600 … /900 (raw: `sarhalkhrida1-*.html`). Only the first site is public. It covers verses 1–22, and 41 of their 44 hemistichs matched exactly. The continuation site (`sarhalkhrida2`) needs a Google sign-in, so it was not used.
- **Check 3 — printed edition of al-Dardir's commentary:** «شرح الخريدة البهية للدردير», with تحقيق وتعليق (archive.org/details/sharh_kharida). Only its OCR text exists, so it was used for **wording only**: the commentary's lemmas and the printed verses. It was the tie-breaker for verses 23, 24, 25, 37, 57, 63, 65 and 70.
- **Check 4 — wording:** islam.ms «الخريدة البهية للإمام أحمد الدردير المالكي» (partly vocalized) https://www.islam.ms/ar/خريدة-بهية-أحمد-دردير, and the geeska.yoo7.com forum copy (unvocalized) https://geeska.yoo7.com/t296-topic.
- Scattered quotations on Shamela (البقوري «ترتيب الفروق» pages 888, 1020 and 1042–1043; Safar al-Hawali) agree with the base where they overlap.

## Verse count
**71** ✔. The base numbering gives 71. The fkdt, islam.ms and geeska copies each give 71. Sarkis, «معجم المطبوعات» (Shamela 1242, page 876), says «فيها ٧١ بيتا». One web source gives 64, but no copy I found has 64 verses.
**Headings:** the matn has no section headings (the topic headings on the commentary site belong to the commentary). The file has a single «## المنظومة» line at the top, as in `bayquniyya.txt`.

## Wording differences (base vs checks)
Spacing differences, such as a detached «و» in geeska, are ignored.

| Verse | Chosen | Other reading | Why |
|---|---|---|---|
| 23 | قِيَامُهُ **بِنَفْسِهِ** | بالنفس (fkdt, islam.ms) | Base and geeska have بنفسه, and so does the printed commentary (verse and lemma «(قيامُه) تعالى (بنفسه)»). |
| 24 | **تَخَالُفٌ** لِلْغَيْرِ | مخالفٌ (fkdt, islam.ms, geeska) | The printed commentary's verse reads تخالف, and its explanation treats the item as a noun alongside وحدانية. Kept from the base. ⚠ see below |
| 25 | **وَالْفِعْلِ فَالتَّأْثِيرُ** لَيْسَ إِلَّا | فالفعل في التأثير (islam.ms), والفعل في التأثير (geeska, al-Hawali) | Base, fkdt and the printed commentary agree. The commentary explains «(و)وحدانية … في (الفعل)», so الفعلِ is genitive, continuing verse 24. |
| 37 | حَتْمًا **دَوَامًا** | ودوما (fkdt, islam.ms) | Base and geeska have دواما, and the commentary lemma is «(حتماً) … (دواماً)». |
| 57 | جَاءَ **عَنِ** الْبَشِيرِ | من (fkdt, islam.ms, geeska) | The commentary lemma is «(بكلّ ما جاء) … (عن) … (البشير)». Kept from the base. |
| 63 | **فَكُلُّ** أَمْرٍ | وكل (fkdt, islam.ms, geeska) | The commentary has «ثم علّل طلب الصبر بقوله (فكلُّ أمر)». Kept from the base. |
| 65 | وَالْقِيَامِ **فِي** الْأَسْحَارِ | بالأسحار (base only) | **Changed.** fkdt, islam.ms, geeska and the commentary lemma «(والقيام في الأسحار)» all have في. |
| 70 | عَلَى **الْإِتْمَامِ** | التمام (fkdt, islam.ms) | Base and geeska have الإتمام, and the commentary has «(والحمد لله على الإتمام)». |
| 21 | **إِذْ** ظَاهِرٌ | إذا (islam.ms) | The other three sources and the commentary site have إذ. |
| 31 | وَالِاتِّصَالِ **الِانْفِصَالِ** | والانفصال (fkdt, geeska) | Base and islam.ms have it without و, and so does the meter (والاتصالِ الانْفِصالِ). The commentary lemma is «(و)منزّه عن (الاتصال) … وعن (الانفصال)». |
| 43 | ضِدُّ مَا تَقَدَّمَا | ضدها عليهم (fkdt) | A copying error in fkdt: it repeats verse 52. |

## Harakat corrected in the base (clear errors, each backed by another source)
| Verse | Base | Written as | Reason |
|---|---|---|---|
| 1 | رَحْمَةَ | رَحْمَةِ | Genitive by idafa. Al-Dardir's commentary and fkdt both have it. (رحمةَ is also grammatical. ⚠) |
| 4 | و صَحْبِهِ | وَصَحْبِهِ | Stray space. |
| 7 | بِزُبْدِةِ | بِزُبْدَةِ | Misprint. The commentary and fkdt have زُبْدَة. |
| 8 | والنْفعَ | وَالنَّفْعَ | Sukun misplaced on the nun. The commentary and fkdt have النَّفْع. |
| 13 | عَليهِمُ | عَلَيْهِمِ | The author's commentary says «(عليهم) بكسر الميم». |
| 16 | وكُلَّ أَمْرٍ | وَكُلُّ | Subject of جائزٌ. The commentary and fkdt both have كُلُّ. |
| 21 | إَذْ | إِذْ | Fatha printed on the hamza below. |
| 30 | فَهْوُ | فَهْوَ | Misprint. |
| 39 | التُقَّى | التُّقَى | Shadda printed on the wrong letter. |
| 47 | التَّرْْكُ | التَّرْكُ | Doubled sukun. |
| 69 | وَاخْتُمْ | وَاخْتِمْ | خَتَمَ يَخْتِمُ (باب ضرب), so the imperative is اخْتِمْ. fkdt agrees. ⚠ |

Base harakat kept against a check source (both readings possible, or the meter decides):
- 4 رَفِيقُهُ (the commentary site has رفيقِه; both are allowed after لا سيما).
- 15 ضِدَّ الْأَوَّلِ (the commentary site has ضِدُّ).
- 21 أَثَرِ (no tanween at the rhyme; the commentary site has أَثَرٍ).
- 28, 29, 36, 45 وَهْوَ / فَهْوَ (fkdt has وَهُوَ; the base's taskin is kept).
- 33 كَائِنٌ (fkdt has كَائِنٍ).
- 46 الْغَنِيْ (fkdt has الغنيُّ, which breaks the meter; islam.ms has الغَنِيْ).
- 58 كِلْمَةِ (fkdt has كَلِمَة, which breaks the meter).
- 64 وَاتْبَعْ (fkdt has وَاتَّبِعْ, which breaks the meter).
- 71 الْخَاتِمِ (fkdt has الخاتَم; both are attested names).

## Completed harakat
- The base is vocalized throughout, but often leaves out the sukun on the article lam, the shadda on sun letters, and some final vowels. By strict count, about 62% of the consonants carried a mark.
- **406 marks were added from the check sources** by script, only where the base letter had no vowel, the skeleton was identical, and nothing conflicted. The added marks came from fkdt first, then al-Dardir's commentary site (verses 1–22). Each addition is listed in `raw/kharida/_collation-log.txt` (lines starting with «fill»; «fix» lines are the corrections above). The script never adds a vowel against the base, never marks a bare alif, and never adds kasra to a madd yaa or damma to a madd waw.
- **10 words were completed by hand** where the check sources differ in wording or are silent, but the vocalization cannot be otherwise:
  - 29: وَهْوَ, الْمُنْجَلِي
  - 31: الِانْفِصَالِ
  - 36: فَهْوَ
  - 37: دَوَامًا
  - 43: مَا
  - 46: الْغَنِيْ
  - 57: عَنِ (before the article)
  - 70: الْإِتْمَامِ
  - 71: الْخَاتِمِ
- Tanween fath written on the alif (عِلْماً) was normalized to the letter before it (عِلْمًا), as in `tuhfa.txt`. Mark order was normalized (shadda first).
- Result (script count): practically every consonant carries a mark (99.8%; the 4 remaining hits are the لام of لله/لِلْ written without a mark by convention).

## Places to confirm (مواضع للتأكد)
1. **Verse 24, تَخَالُفٌ vs مُخَالِفٌ.** All three web copies have مخالفٌ. The base and the printed commentary have تخالفٌ. I kept the base. If the version taught to the students is مخالفٌ, it is a one-word change.
2. **Verse 23, بِنَفْسِهِ vs بِالنَّفْسِ.** Kept بنفسه, with the base, geeska and the printed commentary.
3. **Verse 1, رَحْمَةِ vs رَحْمَةَ.** Written with kasra, following the commentary. Both readings are grammatical.
4. **Verse 13, عَلَيْهِمِ** (kasra, as the commentary states) vs the common recitation عَلَيْهِمُ.
5. **Verse 69, وَاخْتِمْ.** Corrected from the base's وَاخْتُمْ.
6. **Verse 71, الْخَاتِمِ / الْخَاتَمِ.** Both are correct. The base is kept.
