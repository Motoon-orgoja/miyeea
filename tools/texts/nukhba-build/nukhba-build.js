// Builds tools/texts/nukhba.json from raw/nukhba/_base616.txt (Shamela 616, ed. القاسم) — run nukhba-extract.js first.
// Chapter titles are the app's (the matn has only «خاتمة» as the author's own heading).
const fs = require('fs'), path = require('path');
const T = path.join(__dirname, '..');
let lines = fs.readFileSync(path.join(T, 'raw/nukhba/_base616.txt'), 'utf8').split('\n').filter(l => l && !l.startsWith('@'));
const bare = s => s.replace(/[ً-ْٰ]/g, '');
const i0 = lines.findIndex(l => bare(l).startsWith('الحمد لله'));
const basmala = lines[i0 - 1].replace(/\{[٠-٩]+\}/g, '').trim();
lines = lines.slice(i0, lines.findIndex(l => l === '* * *'));
// a sentence broken across a page: «… وَعَلَى آلِهِ» + «وَصَحْبِهِ …»
const txt = lines.join('\n').replace(/وَعَلَى آلِهِ \{٥\}\nوَصَحْبِهِ/, 'وَعَلَى آلِهِ وَصَحْبِهِ');
const FIX = [
  [/\{[٠-٩]+\}/g, ''],                                   // footnote markers
  [/^\* /gm, ''],                                        // the editor's paragraph stars
  [/صلى الله عليه وسلم/g, 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'], // left unvocalized in the source
  [/كَـ «([^»]+)»/g, 'كَـ«$1»'], [/وَ «([^»]+)»/g, 'وَ«$1»'],
  [/كَـ«/g, 'كَ«'],                                       // no tatweel
  [/أَوْ الِاشْتِبَاهُ/g, 'أَوِ الِاشْتِبَاهُ'],              // iltiqa' al-sakinayn (cf. «أَوِ احْتِمَالاً», «أَوِ اثْنَانِ» in the same edition)
  [/وَإل([َّ]{2})ا/g, 'وَإِل$1ا'],                  // «وَإلَّا فَلَا عِبْرَةَ»: kasra missing under the hamza
  [/مُتَّفِقَيْ الِاسْمِ/g, 'مُتَّفِقَيِ الِاسْمِ'],           // iltiqa' al-sakinayn
  [/ »/g, '»'],
  [/\s+-\s*|\s*-\s+|-(?=[.،؛])/g, ' '],                   // the editor's parenthetical dashes
  [/ +([.،؛:])/g, '$1'], [/([.،؛:])(?=[^\s.،؛:»])/g, '$1 '], [/[.،؛:]([.،؛])/g, '$1'], [/ {2,}/g, ' '], [/^ | $/gm, '']
];
// canonical (NFC) order of the marks, so that the patterns above match whatever order the source typed them in
let clean = txt.normalize('NFC');
for (const [a, b] of FIX) clean = clean.replace(typeof a === 'string' ? new RegExp(a.normalize('NFC'), 'g') : new RegExp(a.source.normalize('NFC'), a.flags), b.normalize('NFC'));
const L = clean.split('\n').filter(Boolean);
if (L[L.length - 1] === '') L.pop();
// chapters: [title, group, first words of the first line]
const CH = [
  ['مُقَدِّمَةُ الْمُصَنِّفِ', null, 'الحَمْدُ لِلَّهِ'],
  ['أَقْسَامُ الْخَبَرِ: الْمُتَوَاتِرُ وَالْآحَادُ', 'الْخَبَرُ وَأَقْسَامُهُ', 'فَأَقُولُ'],
  ['الْغَرِيبُ: الْفَرْدُ الْمُطْلَقُ وَالْفَرْدُ النِّسْبِيُّ', 'الْخَبَرُ وَأَقْسَامُهُ', 'ثُمَّ الغَرَابَةُ'],
  ['الصَّحِيحُ وَالْحَسَنُ', 'الْمَقْبُولُ', 'وَخَبَرُ الآحَادِ'],
  ['زِيَادَةُ الثِّقَةِ، وَالْمَحْفُوظُ وَالشَّاذُّ، وَالْمَعْرُوفُ وَالْمُنْكَرُ', 'الْمَقْبُولُ', 'وَزِيَادَةُ رَاوِيهِمَا'],
  ['الْمُتَابِعُ وَالشَّاهِدُ وَالِاعْتِبَارُ', 'الْمَقْبُولُ', 'وَالفَرْدُ النِّسْبِيُّ'],
  ['الْمُحْكَمُ وَمُخْتَلِفُ الْحَدِيثِ وَالنَّاسِخُ وَالْمَنْسُوخُ', 'الْمَقْبُولُ', 'ثُمَّ المَقْبُولُ'],
  ['الْمَرْدُودُ بِسَبَبِ السَّقْطِ', 'الْمَرْدُودُ', 'ثُمَّ المَرْدُودُ'],
  ['الْمَرْدُودُ بِسَبَبِ الطَّعْنِ', 'الْمَرْدُودُ', 'ثُمَّ الطَّعْنُ'],
  ['الْمُخَالَفَةُ', 'الْمَرْدُودُ', 'ثُمَّ المُخَالَفَةُ'],
  ['الْجَهَالَةُ', 'الْمَرْدُودُ', 'ثُمَّ الجَهَالَةُ'],
  ['الْبِدْعَةُ', 'الْمَرْدُودُ', 'ثُمَّ البِدْعَةُ'],
  ['سُوءُ الْحِفْظِ', 'الْمَرْدُودُ', 'ثُمَّ سُوءُ الحِفْظِ'],
  ['الْمَرْفُوعُ وَالْمَوْقُوفُ وَالْمَقْطُوعُ', 'الْإِسْنَادُ', 'ثُمَّ الإِسْنَادُ'],
  ['الْمُسْنَدُ، وَالْعُلُوُّ وَالنُّزُولُ', 'الْإِسْنَادُ', 'وَالمُسْنَدُ'],
  ['رِوَايَةُ الْأَقْرَانِ وَالْأَكَابِرِ، وَالْمُهْمَلُ، وَالْمُسَلْسَلُ', 'الْإِسْنَادُ', 'فَإِنْ تَشَارَكَ'],
  ['صِيَغُ الْأَدَاءِ', 'الْإِسْنَادُ', 'وَصِيَغُ الأَدَاءِ'],
  ['الْمُتَّفِقُ وَالْمُفْتَرِقُ، وَالْمُؤْتَلِفُ وَالْمُخْتَلِفُ، وَالْمُتَشَابِهُ', 'الْإِسْنَادُ', 'ثُمَّ الرُّوَاةُ'],
  ['خَاتِمَةٌ: طَبَقَاتُ الرُّوَاةِ، وَمَرَاتِبُ الْجَرْحِ وَالتَّعْدِيلِ', 'الْخَاتِمَةُ', 'خَاتِمَةٌ'],
  ['الْكُنَى وَالْأَسْمَاءُ وَالْأَلْقَابُ وَالْأَنْسَابُ', 'الْخَاتِمَةُ', 'وَمَعْرِفَةُ كُنَى'],
  ['الْمَوَالِي، وَآدَابُ الشَّيْخِ وَالطَّالِبِ، وَسَبَبُ الْحَدِيثِ', 'الْخَاتِمَةُ', 'وَمَعْرِفَةُ المَوَالِي'],
];
const words = s => s.split(/\s+/).filter(Boolean).length;
const chapters = []; let k = -1;
for (const l of L) {
  if (k + 1 < CH.length && bare(l).startsWith(bare(CH[k + 1][2]))) { k++; chapters.push({ title: CH[k][0], ...(CH[k][1] ? { group: CH[k][1] } : {}), lines: [] }); }
  if (k < 0) throw new Error('text before first chapter: ' + l);
  if (l === 'خَاتِمَةٌ') continue;               // the author's heading → used as chapter title
  chapters[k].lines.push(l);
}
if (k !== CH.length - 1) throw new Error('only ' + (k + 1) + ' chapters matched');
// paragraphs: join the edition's sentence lines up to ~40 words; never leave a paragraph under 8 words if it can join
for (const c of chapters) {
  const P = []; let cur = '';
  for (const l of c.lines) {
    if (cur && words(cur) + words(l) > 40) { P.push(cur); cur = ''; }
    cur = cur ? cur + ' ' + l : l;
  }
  if (cur) P.push(cur);
  for (let i = P.length - 1; i > 0; i--) if (words(P[i]) < 8 && words(P[i - 1]) + words(P[i]) <= 48) { P[i - 1] += ' ' + P[i]; P.splice(i, 1); }
  if (P.length > 1 && words(P[0]) < 8) { P[1] = P[0] + ' ' + P[1]; P.shift(); }
  c.paras = P; delete c.lines;
}
const J = {
  source: 'https://shamela.ws/book/616 (نخبة الفكر في مصطلح أهل الأثر، تحقيق د. عبد المحسن بن محمد القاسم، ط٢ ١٤٤١هـ، محقق على نسخ مقروءة على المصنف، مشكول بالكامل، الصفحات ٤٦–٧٣)',
  check: 'https://shamela.ws/book/1565 (نزهة النظر ت نور الدين عتر: متن النخبة مفردًا في آخره، مشكول، ص ١٤٦–١٥١) + https://shamela.ws/book/5940 (نخبة الفكر ط دار الحديث، مشكول جزئيًا) — see nukhba-sources.md',
  basmala, chapters
};
fs.writeFileSync(path.join(T, 'nukhba.json'), JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(path.join(T, 'raw/nukhba/_clean.txt'), chapters.map(c => '## ' + c.title + '\n' + c.paras.join('\n')).join('\n') + '\n');
console.log('chapters', chapters.length, 'paras', chapters.reduce((n, c) => n + c.paras.length, 0), 'words', chapters.reduce((n, c) => n + c.paras.reduce((m, p) => m + words(p), 0), 0));
for (const c of chapters) console.log(c.title, c.paras.map(words).join(','));
