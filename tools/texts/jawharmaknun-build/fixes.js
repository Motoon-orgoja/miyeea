// Corrections to the takw.in base, keyed «verse+hemistich»: [from, to, reason]. Applied by build.js after bracket cleanup.
// W = wording taken from the common recension (K = Shamela-golden matn ketabonline 25502, M = المقتدي «اللب المصون» ketabonline 19479,
//     Hz = الحازمي «شرح الجوهر المكنون» ketabonline 90602, commentary text). Rule: changed only when K and M agree against the base
//     AND Hazimi's commentary uses the same reading, or when the base is plainly wrong (typo / rhyme / meter / the Talkhis term).
// H = harakat only.
module.exports = {
  // ---- Qur'anic quotations in ﴿﴾
  '43a': [['إِنَّا إِلَيْكُمْ مُرْسَلُونْ', '﴿إِنَّا إِلَيْكُمْ مُرْسَلُونْ﴾', 'Q (Yasin 14)']],
  '244b': [['كَتَخْشَ النَّاسَ وَاللهُ أَحَقّْ', 'كَ﴿تَخْشَى النَّاسَ وَاللهُ أَحَقّْ﴾', 'Q (al-Ahzab 37): Mushaf spelling تَخْشَى (K, Hz); pronounced the same before ال, so the meter is unchanged']],
  '275a': [['كَالتَّائِبُونَ', 'كَ﴿التَّائِبُونَ', 'Q (al-Tawba 112)']],
  '275b': [['السَّاجِدُونْ', 'السَّاجِدُونْ﴾', 'Q (al-Tawba 112)']],

  // ---- W: common recension (K + M + Hazimi's commentary agree against the base)
  '45a': [['وَاسْتُحْسِنَ التَّأْكِيدُ', 'وَاسْتَحْسِنِ التَّوْكِيدَ', 'W K M Hz']],
  '52a': [['أَقْسَامُهَا', 'أَقْسَامُهُ', 'W K M Hz (the isnad), also the Indonesian copy']],
  '68b': [['وِلِاسْتِجْهَالِ', 'أَوِ اسْتِجْهَالِ', 'W K M Hz; the base\'s kasra on و is itself an error']],
  '70b': [['فِيهَا مُنْقَسِمْ', 'فِيهِ يَنْقَسِمْ', 'W K M Hz']],
  '72a': [['وَبِالْإِضَافَةِ', 'وَبِإِضَافَةٍ', 'W K M Hz']],
  '80a': [['أَوْ رَدًّا إِلَى', 'أَوْ رَدٍّ إِلَى', 'W K M Hz']],
  '83a': [['لِوَضْعٍ اوْ', 'لِلْأَصْلِ أَوْ', 'W K M Hz']],
  '85a': [['صَحِبَ', 'صَاحَبَ', 'W K M Hz']],
  '91b': [['وَالْقَبَعْثَرَا', 'وَالْقَبَعْثَرَى', 'W K M Hz (the name القَبَعْثَرَى)']],
  '109b': [['لِلْقَصْرِ مَا', 'لِقَصْرِ مَا', 'W K M Hz']],
  '117a': [['لِمَعْمُولَاتِهِ', 'لِمَعْلُولَاتِهِ', 'W K M Hz']],
  '124b': [['أُوتِيتَ', 'أُعْطِيتَ', 'W K M Hz']],
  '130a': [['اسْتِعْبَادٍ', 'اسْتِبْعَادٍ', 'typo: the term is الاستبعاد (Hz: «الاستبعاد: عدّ الشيء بعيدًا»), K']],
  '132b': [['وَتَصْدِيقٍ أَدَبْ', 'وَحَمْلٍ وَأَدَبْ', 'W K M Hz']],
  '152a': [['فَهْيَ الْحَقِيقَيَّةُ لَيْسَ فِي فَنِّ الْبَيَانِ', 'فَهْيَ الْحَقِيقَهْ لَيْسَ فِي الْبَيَانِ', 'base is unmetrical (and misspelled الحقيقَيّة); K reading, Hz explains «فهي الحقيقة» = الجديرة']],
  '154b': [['الهُدَاهْ', 'النَّجَاهْ', 'W K M Hz']],
  '173a': [['مَا بِهِ حُذِفْ', 'مَا مِنْهُ حُذِفْ', 'W K M Hz']],
  '176a': [['عَابَرَتِ', 'غَابَرَتِ', 'dot error; K and Hz «غابرت أي جاوزت» (M and the Indonesian copy: غايرت)']],
  '192a': [['بِالْأَصْلِ', 'بِالْفَصْلِ', 'base has the two words swapped; K M Hz: the تجريد goes with the المستعار له (Hz: «والمراد بالفصل هنا المستعار له»), as in the Talkhis']],
  '192b': [['بِالْفَصْلِ', 'بِالْأَصْلِ', 'see 192a']],
  '206b': [['تُرَدّْ', 'يَرِدْ', 'W K M; the base breaks the rhyme with قُصِدْ']],
  '214a': [['وَالثَّانِ مِنْ أَلقَابِهِ', 'وَعُدَّ مِنْ أَلْقَابِهِ', 'W K M Hz (Hz repeats «وعُدَّ من ألقابه» for every item); the معنوي is the first ضرب, not the second']],
  '232a': [['لَنْ تَعْرِفَ', 'لَنْ يَعْرِفَ', 'W K M Hz']],
  '243a': [['الُاولَى', 'الَاوَّلْ', 'W K M Hz («الاوّلْ بتسهيل الهمزة من أجل الوزن»); case of النَّظْمِ kept (Hz: «يعني: وفي النظم»)']],
  '251b': [['الْكُرَمَا', 'الْعُلَمَا', 'W K M Hz']],
  '258b': [['أَرْدَاهُ الِانْتِحَالُ', 'أَرْدَؤُهُ انْتِحَالُ', 'W K M Hz (vocalized as in M)']],
  '263a': [['كَنَقْلٍ', 'لِنَقْلٍ', 'W K M Hz']],
  '263b': [['أَوَقَلْبٍ', 'وَقَلْبٍ', 'W K M Hz; the base\'s أَوَ is itself broken']],
  '284a': [['سَهْلٍ', 'حَسَنٍ', 'W K M Hz']],
  '286a': [['صِفَاتِ', 'سِمَاتِ', 'W K M Hz']],

  // ---- W2: coordinator decision 2026-11-04 (Yusuf's rule: the text as commonly taught in the commentaries) — K and M agree
  '32b': [['لَفْظًا مُطَابِقًا', 'لَفْظٌ مُطَابِقًا', 'W2 K M (نائب فاعل يُرى)']],
  '108b': [['لِلنُّكْتَةِ الْجَلِيَّهْ', 'لِنُكْتَةٍ جَلِيَّهْ', 'W2 K M']],
  '115a': [['وَالِاخْتِصَارِ', 'وَلِاخْتِصَارِ', 'W2 K M']],
  '121b': [['وَمَا تَقَدَّمَا', 'كَمَا تَقَدَّمَا', 'W2 K M']],
  '170a': [['بُعْدِ النِّسْبَةِ', 'أَوْ لِنُدْرَةِ', 'W2 K M (Hz summary: «لكثرة التفصيل أو لندرة حضور المشبه به في الذهن»)']],
  '170b': [['وَالذِّكْرِ وَالتَّرْتِيبِ فِي', 'فِي الذِّهْنِ كَالتَّرْكِيبِ فِي', 'W2 K M (M: كالترتيب; K and Hz: كالتركيب, as in the Talkhis «مركبًا خياليًا أو عقليًا»)']],
  '185a': [['تُنْتَمَى', 'تَنْتَمِي', 'W2 K M (rhyme follows 185b)']],
  '185b': [['وَالْوِفَاقِ فَاعْلَمَا', 'لَا الْوِفَاقِ فَاعْلَمِ', 'W2 K M']],

  // ---- H: harakat
  '57a': [['وَضَيقِ', 'وَضِيقِ', 'H: the base has no mark on the ي; K and M have ضِيق']],
  '62b': [['بَحَسَبِ', 'بِحَسَبِ', 'H: misprint (preposition بِ)']],
  '114a': [['لِلْتَعْمِيمِ', 'لِلتَّعْمِيمِ', 'H: sun letter: shadda on ت, no sukun on the lam']],
  '119a': [['وَالأَوْصَافِ', 'وَالْأَوْصَافِ', 'H: sukun of the article']],
  '137a': [['الْإعْرَابِ', 'الْإِعْرَابِ', 'H: kasra on the hamza']],
  '137b': [['في ', 'فِي ', 'H: unmarked']],
  '157a': [['حَقِيقيٌّ', 'حَقِيقِيٌّ', 'H: unmarked qaf']],
  '224b': [['الْعِلمِ', 'الْعِلْمِ', 'H: sukun']],
  '232b': [['الكَوْنِ', 'الْكَوْنِ', 'H: sukun of the article']],
  '254a': [['وَالْقَلبُ', 'وَالْقَلْبُ', 'H: sukun']],
  '277a': [['تَلوِيحٌ', 'تَلْوِيحٌ', 'H: sukun']],
  '279a': [['إِلغَازٌ', 'إِلْغَازٌ', 'H: sukun']],
};
