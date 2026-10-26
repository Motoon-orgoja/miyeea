// Builds data/munajat.js from cached sources:
//   adwa.txt    — Zakariya al-Ansari, al-Adwa' al-Bahija (OpenITI, Shamela 34493): al-Munfarija text + per-verse commentary
//   mukhtar.txt — al-Razi, Mukhtar al-Sihah (OpenITI, Shamela 23193): word glosses for the other poems
//   hadi.txt    — Ibn al-Qayyim, Hadi al-Arwah (OpenITI, Shamela 11147): the Mimiyya excerpt
// usage: node build-munajat.js <cache dir> <out file>
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const strip = s => s.replace(/[ً-ْـ]/g, '');
const clean = s => s.replace(/PageV\d+P\d+/g, '').replace(/\bms\d+\b/g, '').replace(/\(¬\d+\)/g, '').replace(/النبيصلى/g, 'النبي صلى').replace(/\s+/g, ' ').trim();
const split = l => clean(l.replace(/^#\s*/, '')).split(/\s*\.\.\.\s*/).map(x => x.trim());

/* ---- al-Munfarija ---- */
const A = read('adwa.txt').split('\n');
const a0 = A.findIndex((l, i) => i > 400 && l.startsWith('# اشتدي أزمة'));
let mv = [];
for (let i = a0; mv.length < 40; i++) {
  const l = A[i];
  if (/^(#|~~)\s*\S/.test(l) && !/^~~\s*ms\d+\s*$/.test(l)) mv.push(split(l.replace(/^~~/, '#')));
}
// the first four verses have no hemistich marker in the source
const firstSplit = [['اشتدي أزمة تنفرجي', 'قد آذن ليلك بالبلج'], ['وظلام الليل له سرج', 'حتى يغشاه أبو السرج'], ['وسحاب الخير لها مطر', 'فإذا جاء الإبان تجي'], ['وفوائد مولانا جمل', 'بسروح الأنفس والمهج']];
mv = mv.map((v, i) => i < 4 ? firstSplit[i] : v);
// obvious typos in the electronic copy
const mfix = [['يضفر', 'يظفر'], ['إلي النهج', 'إلى النهج'], ['وأبي عمر وذي', 'وأبي عمرو ذي'], ['الستحيي', 'المستحيي']];
mv = mv.map(v => v.map(h => mfix.reduce((t, [a, b]) => t.replace(a, b), h)));
// per-verse commentary: blocks that start at each verse's heading inside the commentary (before the appendix)
const heads = [];
for (let i = 80; i < 369 && heads.length < 40; i++) {
  const l = A[i];
  if (!/^# /.test(l)) continue;
  const w = strip(mv[heads.length][0]).split(' ').slice(0, 2).join(' ').replace('عمرو', 'عمر');
  if (strip(l).replace(/^#\s*/, '').startsWith(w)) heads.push(i);
}
if (heads.length !== 40) { console.log(heads.map((h,k)=>k+1+':'+h).join(' ')); throw 'found ' + heads.length + ' commentary blocks'; }
const msh = {};
heads.forEach((h, k) => {
  const end = k < 39 ? heads[k + 1] : 369;
  msh[k + 1] = clean(A.slice(h, end).map(l => l.replace(/^(#|~~)\s*/, '').replace(/^\/\s*/, '')).join(' ').replace(/ \/ /g, ' '));
});

/* ---- Mimiyya excerpt ---- */
const H = read('hadi.txt').split('\n');
const h0 = H.findIndex(l => l.startsWith('# وما ذاك إلا غيرة'));
const hv = [];
for (let i = h0; i < h0 + 80; i++) if (/^# .*\.\.\./.test(H[i])) hv.push(split(H[i]));
const q1 = hv.findIndex(v => v[0].startsWith('فحي على جنات')), q2 = hv.findIndex(v => v[0].startsWith('فإن كنت لا تدري'));
const mim = [...hv.slice(0, 9), ...hv.slice(q1, q2 + 1)].map(v => v.map(h => h
  .replace('هو موعد المز', 'هو موعد الـ').replace(/^يد لوفد الحب/, 'ـمزيد لوفد الحب').replace('ذاهم بنور', 'إذا هم بنور')));

/* ---- Mukhtar al-Sihah glosses ---- */
const roots = {};
// root headings are spaced inconsistently ("و ج د", "وج د", "ز ه ر:"), so key them without spaces
const rkey = r => r.replace(/[\s:]/g, '');
read('mukhtar.txt').split(/### \| /).slice(1).forEach(b => {
  const nl = b.search(/\s#|\n/);
  roots[rkey(b.slice(0, nl))] = b.slice(nl).replace(/~~|#|PageV\d+P\d+|\bms\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
});
// the sentence of the root entry that mentions the word (bracketed headword first);
// some roots sit under page markers in this copy, so fall back to the whole dictionary's bracketed headwords
const allSents = Object.values(roots).join(' ').split(/(?<=\.)\s+/);
// needle: a phrase from the dictionary sentence that carries the sense used in the verse
function gloss(root, word) {
  const w = strip(word), e = roots[rkey(root)];
  const sents = e ? e.split(/(?<=\.)\s+/) : [];
  const s = sents.find(x => strip(x).includes(w)) || allSents.find(x => strip(x).includes(w));
  if (!s) throw 'no ' + word + ' in ' + root;
  return s.trim();
}
const G = list => list.map(([w, r, q]) => ({ w, t: gloss(r, q || w) }));
const MS = { name: 'مختار الصحاح، لزين الدين الرازي (ت ٦٦٦هـ)', url: 'https://shamela.ws/book/23193' };

const poems = [
  { id: 'suhayli', title: 'يا من يرى ما في الضمير ويسمع', nazim: 'أبو القاسم عبد الرحمن السهيلي', death: 'ت ٥٨١هـ', meter: 'الكامل',
    source: 'الشعر العربي (arabic-poetry.net)، وذكرها ابن كثير في البداية والنهاية', srcUrl: 'https://arabic-poetry.net/poem/259700',
    note: 'ذكر ابن كثير أن السهيلي كان يقول: ما سأل الله بها أحد حاجة إلا أعطاه إياها. ولا يصح في فضلها حديث مرفوع (إسلام ويب، الفتوى ٤٦٠٠٢).',
    verses: [['يا من يرى ما في الضمير ويسمع', 'أنت المعد لكل ما يتوقع'], ['يا من يرجى للشدائد كلها', 'يا من إليه المشتكى والمفزع'], ['يا من خزائن رزقه في قول كن', 'امنن فإن الخير عندك أجمع'], ['ما لي سوى فقري إليك وسيلة', 'فبالافتقار إليك فقري أدفع'], ['ما لي سوى قرعي لبابك حيلة', 'فلئن رددت فأي باب أقرع'], ['ومن الذي أدعو وأهتف باسمه', 'إن كان فضلك عن فقيرك يمنع'], ['حاشا لمجدك أن يقنط عاصيا', 'الفضل أجزل والمواهب أوسع']],
    gharib: G([['المفزع', 'ف ز ع', '(المفزع)'], ['وسيلة', 'و س ل', '(الوسيلة)'], ['أقرع', 'ق ر ع', '(قرع) الباب'], ['أهتف', 'ه ت ف', '(هتف) به'], ['يقنط', 'ق ن ط', '(القنوط)'], ['أجزل', 'ج ز ل', '(أجزل) له'], ['المواهب', 'و ه ب', '(الموهبة)']]), gsrc: MS },
  { id: 'shafii', title: 'ولمّا قسا قلبي وضاقت مذاهبي', nazim: 'الإمام محمد بن إدريس الشافعي', death: 'ت ٢٠٤هـ', meter: 'الطويل',
    source: 'الديوان (aldiwan.net)، من شعره قبل موته', srcUrl: 'https://www.aldiwan.net/poem24634.html',
    note: 'تنتشر للقصيدة نسخ أطول فيها أبيات بلا مصدر؛ المعتمد هنا نسخة الديوان (١٢ بيتًا). صُحّح في البيت ٦ «مَن» إلى «مِن»، وفي البيت ٩ «الشُّهد» إلى «السُّهد».',
    verses: [['وَلَمّا قَسا قَلبي وَضاقَت مَذاهِبي', 'جَعَلتُ الرَجا مِنّي لِعَفوِكَ سُلَّما'], ['تَعاظَمَني ذَنبي فَلَمّا قَرَنتُهُ', 'بِعَفوِكَ رَبّي كانَ عَفوُكَ أَعظَما'], ['فَما زِلتَ ذا عَفوٍ عَنِ الذَنبِ لَم تَزَل', 'تَجودُ وَتَعفو مِنَّةً وَتَكَرُّما'], ['فَلَولاكَ لَم يَصمُد لِإِبليسَ عابِدٌ', 'فَكَيفَ وَقَد أَغوى صَفِيَّكَ آدَما'], ['فَلِلَّهِ دَرُّ العارِفِ النَدبِ إِنَّهُ', 'تَفيضُ لِفَرطِ الوَجدِ أَجفانُهُ دَما'], ['يُقيمُ إِذا ما اللَيلُ مَدَّ ظَلامَهُ', 'عَلى نَفسِهِ مِن شِدَّةِ الخَوفِ مَأتَما'], ['فَصيحاً إِذا ما كانَ في ذِكرِ رَبِّهِ', 'وَفي ما سِواهُ في الوَرى كانَ أَعجَما'], ['وَيَذكُرُ أَيّاماً مَضَت مِن شَبابِهِ', 'وَما كانَ فيها بِالجَهالَةِ أَجرَما'], ['فَصارَ قَرينَ الهَمِّ طولَ نَهارِهِ', 'أَخا السُهدِ وَالنَجوى إِذا اللَيلُ أَظلَما'], ['يَقولُ حَبيبي أَنتَ سُؤلي وَبُغيَتي', 'كَفى بِكَ لِلراجينَ سُؤلاً وَمَغنَما'], ['أَلَستَ الَّذي غَذَّيتَني وَهَدَيتَني', 'وَلا زِلتَ مَنّاناً عَلَيَّ وَمُنعِما'], ['عَسى مَن لَهُ الإِحسانُ يَغفِرُ زَلَّتي', 'وَيَستُرُ أَوزاري وَما قَد تَقَدَّما']],
    gharib: G([['مذاهبي', 'ذ ه ب', '(مذهبا)'], ['يصمد', 'ص م د', 'يصمد إليه'], ['الندب', 'ن د ب', 'ورجل (ندب)'], ['الوجد', 'و ج د', 'في الحزن (وجدا)'], ['مأتما', 'أ ت م', '(المأتم)'], ['النجوى', 'ن ج ا', '(النجوى)'], ['السهد', 'س ه د', '(السهاد)'], ['أوزاري', 'و ز ر', 'والوزر الإثم']]), gsrc: MS },
  { id: 'munfarija', title: 'المنفرجة: اشتدّي أزمةُ تنفرجي', nazim: 'أبو الفضل يوسف بن محمد التوزري، المعروف بابن النحوي', death: 'ت ٥١٣هـ', meter: 'المتدارك (الخبب)',
    source: 'الأضواء البهجة في إبراز دقائق المنفرجة، لزكريا الأنصاري (ت ٩٢٦هـ)', srcUrl: 'https://shamela.ws/book/34493',
    note: 'الأشهر نسبتها لابن النحوي، وقيل لغيره. قال تاج الدين السبكي: «وهي مجرّبة لكشف الكروب» (نقله زكريا الأنصاري). صُحّحت أخطاء طباعية ظاهرة: «يضفر» ← «يظفر»، «إلي» ← «إلى»، «أبي عمر» ← «أبي عمرو»، «الستحيي» ← «المستحيي».',
    verses: mv, sharh: msh, sharhSrc: { name: 'الأضواء البهجة في إبراز دقائق المنفرجة، لزكريا الأنصاري (ت ٩٢٦هـ)', url: 'https://shamela.ws/book/34493' } },
  { id: 'atahiya', title: 'إلهي لا تعذّبني فإنّي', nazim: 'أبو العتاهية إسماعيل بن القاسم', death: 'ت ٢١١هـ', meter: 'الوافر',
    source: 'الديوان (aldiwan.net)', srcUrl: 'https://www.aldiwan.net/poem63136.html',
    verses: [['إِلَهي لا تُعَذِّبني فَإِنّي', 'مُقِرٌّ بِالَّذي قَد كانَ مِنّي'], ['وَما لي حيلَةٌ إِلّا رَجائي', 'وَعَفوُكَ إِن عَفَوتَ وَحُسنُ ظَنّي'], ['فَكَم مِن زِلَّةٍ لي في البَرايا', 'وَأَنتَ عَلَيَّ ذو فَضلٍ وَمَنِّ'], ['إِذا فَكَّرتُ في نَدَمي عَلَيها', 'عَضَضتُ أَنامِلي وَقَرَعتُ سِنّي'], ['يَظُنُّ الناسُ بي خَيراً وَإِنّي', 'لَشَرُّ الناسِ إِن لَم تَعفُ عَنّي'], ['أُجَنُّ بِزَهرَةِ الدُنيا جُنوناً', 'وَأُفني العُمرَ فيها بِالتَمَنّي'], ['وَبَينَ يَدَيَّ مُحتَبَسٌ طَويلٌ', 'كَأَنّي قَد دُعيتُ لَهُ كَأَنّي'], ['وَلَو أَنّي صَدَقتُ الزُهدَ فيها', 'قَلَبتُ لِأَهلِها ظَهرَ المِجَنِّ']],
    gharib: G([['البرايا', 'ب ر ا', '(البرية) الخلق'], ['أناملي', 'ن م ل', '(الأنملة)'], ['زهرة الدنيا', 'ز ه ر', '(زهرة) الدنيا'], ['المجن', 'ج ن ن', '(المجن)']]), gsrc: MS },
  { id: 'abunuwas', title: 'يا ربِّ إن عظُمت ذنوبي كثرةً', nazim: 'أبو نواس الحسن بن هانئ', death: 'ت ١٩٨هـ', meter: 'الكامل',
    source: 'الديوان (aldiwan.net)', srcUrl: 'https://www.aldiwan.net/poem27209.html', note: 'يُروى أنه قالها في آخر حياته.',
    verses: [['يا رَبِّ إِن عَظُمَت ذُنوبي كَثرَةً', 'فَلَقَد عَلِمتُ بِأَنَّ عَفوَكَ أَعظَمُ'], ['إِن كانَ لا يَرجوكَ إِلّا مُحسِنٌ', 'فَبِمَن يَلوذُ وَيَستَجيرُ المُجرِمُ'], ['أَدعوكَ رَبِّ كَما أَمَرتَ تَضَرُّعاً', 'فَإِذا رَدَدتَ يَدي فَمَن ذا يَرحَمُ'], ['ما لي إِلَيكَ وَسيلَةٌ إِلّا الرَجا', 'وَجَميلُ عَفوِكَ ثُمَّ أَنّي مُسلِمُ']],
    gharib: G([['يلوذ', 'ل و ذ', '(لاذ) به'], ['يستجير', 'ج و ر', '(استجاره)'], ['تضرعا', 'ض ر ع', '(تضرع) إلى الله']]), gsrc: MS },
  { id: 'mubarak', title: 'إذا ما الليلُ أظلم كابدوه', nazim: 'عبد الله بن المبارك', death: 'ت ١٨١هـ', meter: 'الوافر',
    source: 'الديوان (aldiwan.net)، وذكر البيتين الأولين ابن رجب في «التخويف من النار»', srcUrl: 'https://shamela.ws/book/4033/26',
    verses: [['إذا ما الليل أظلم كابدوه', 'فيسفر عنهم وهم ركوع'], ['أطار الخوف نومهم فقاموا', 'وأهل الأمن في الدنيا هجوع'], ['لهم تحت الظلام وهم سجود', 'أنين منه تنفرج الضلوع'], ['وخرس بالنهار لطول صمت', 'عليهم من سكينتهم خشوع']],
    gharib: G([['كابدوه', 'ك ب د', '(كابد) الأمر'], ['هجوع', 'ه ج ع', '(الهجوع)'], ['أنين', 'أ ن ن', '(أنينا)']]), gsrc: MS },
  { id: 'sajjad', title: 'يا من يجيب دعا المضطرّ في الظُّلَم', nazim: 'منسوبة إلى علي بن الحسين زين العابدين', death: 'ت ٩٤هـ', meter: 'البسيط',
    source: 'الديوان (aldiwan.net)', srcUrl: 'https://www.aldiwan.net/poem76293.html', note: 'نسبتها إليه غير ثابتة. وفي بعض النسخ بيت فيه «بحقّ البيت والحرم» لم يُثبت هنا.',
    verses: [['يا من يجيب دعا المضطرّ في الظلم', 'يا كاشف الضرّ والبلوى مع السقم'], ['قد نام وفدُك حول البيت وانتبهوا', 'وأنتَ يا حيّ يا قيّومُ لم تنَمِ'], ['إن كان جودكَ لا يرجوهُ ذو سفهٍ', 'فمن يجود على العاصين بالكرمِ']],
    gharib: G([['البلوى', 'ب ل ا', '(البلوى)'], ['السقم', 'س ق م', '(السقام)'], ['وفدك', 'و ف د', '(وفد) فلان'], ['القيوم', 'ق و م', '(القيوم)'], ['سفه', 'س ف ه', '(السفه)']]), gsrc: MS },
  { id: 'mimiyya', title: 'من ميمية ابن القيم: الشوق إلى الجنة ورؤية الله', nazim: 'شمس الدين ابن قيم الجوزية', death: 'ت ٧٥١هـ', meter: 'الطويل',
    source: 'مقدمة «حادي الأرواح إلى بلاد الأفراح»', srcUrl: 'https://shamela.ws/book/11147',
    note: 'مقطعان مختاران: الأبيات التسعة الأولى، ثم من «فحيّ على جنات عدن» إلى «فإن كنت لا تدري فتلك مصيبة». تُرك ما بينهما من وصف الحور. صُحّح «ذاهم» إلى «إذا هم».',
    verses: mim,
    gharib: G([['كفئها', 'ك ف أ', '(الكفء)'], ['حفت', 'ح ف ف', '(حفوا) حوله'], ['صبابة', 'ص ب ب', '(الصبابة) بالفتح'], ['الضيم', 'ض ي م', '(الضيم)'], ['يسلو', 'س ل ا', '(سلا) عنه'], ['المخيم', 'خ ي م', '(خيم) أيضا بالمكان'], ['شطت', 'ش ط ط', '(شطت) الدار'], ['إذفر', 'ذ ف ر', 'مسك (أذفر)'], ['العقيان', 'ع ق ا', '(العقيان)']]), gsrc: MS }
];
for (const p of poems) {
  const bad = p.verses.find(v => v.length !== 2 || !v[0] || !v[1]);
  if (bad) throw 'bad verse split in ' + p.id + ': ' + JSON.stringify(bad);
}
const BOOK = { key: 'munajat', app: 'mutoon-munajat', lsk: 'mutoon_munajat_v1', prefix: 'mu_', title: 'منظومات المناجاة', sub: 'في الأنس بالله ومناجاته · ٨ قصائد', poems };
fs.writeFileSync(out, '// Generated by tools/build-munajat.js — edit that script, not this file\nwindow.BOOK=' + JSON.stringify(BOOK) + ';\n');
poems.forEach(p => console.log(p.id, p.verses.length, 'gharib', (p.gharib || []).length, 'sharh', Object.keys(p.sharh || {}).length));
