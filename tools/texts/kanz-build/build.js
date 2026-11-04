// Builds tools/texts/kanz.json from out/voc-rows.json (vocalize.js) + manual-voc-{a,b,c}.json (manual completion of the
// words no witness vocalized; letters are checked to be unchanged) -> chapters = كتاب / باب / فصل headings, group = the كتاب.
// Paragraphs: the base prints one mas'ala per line; lines are packed into paragraphs of about 8–40 words, a line over 40 words
// is cut at «؛ ، :» nearest the middle. Writes out/doubts.tsv (all manual-pass doubts) too.
// usage: node tools/texts/kanz-build/build.js
const fs = require('fs'), path = require('path');
const here = __dirname, out = path.join(here, 'out');
const rows = JSON.parse(fs.readFileSync(path.join(out, 'voc-rows.json'), 'utf8'));
const strip = s => s.replace(/[ً-ْٰ]/g, '');
let applied = 0; const doubts = [];
for (const x of 'abc') {
  const f = path.join(here, 'manual-voc-' + x + '.json');
  const M = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [ri, ws] of Object.entries(M.words)) {
    const t = rows[+ri].text.split(' ');
    for (const [k, v] of Object.entries(ws)) {
      if (strip(t[+k]) !== strip(v)) throw new Error(`letters differ row ${ri} word ${k}: ${t[+k]} / ${v}`);
      t[+k] = v; applied++;
    }
    rows[+ri].text = t.join(' ');
  }
  for (const d of M.doubts) doubts.push([x, 'ص' + rows[+d[0]].page, ...d].join('\t'));
}
// last corrections after the manual pass: [exact text in a row, replacement, letters may change?, reason]
const OVERRIDE = [
  ['بابٌ صَلَاةِ الشَّهِيدِ', 'بَابٌ صَلَاةُ الشَّهِيدِ', false, 'الأساس «بابٌ» منوّنًا فما بعده مرفوع، كـ«بَابٌ صَدَقَةُ الْبَقَرِ»'],
  ['عَلَى سِهَامِ مَنْ بَقِي.', 'عَلَى سِهَامِ مَنْ بَقِيَ.', false, 'فعل ماضٍ: فتحة الياء'],
  ['وَطَعَامٍ وَيَمِينٍ).', 'وَطَعَامٍ وَيَمِينٍ.', true, 'قوس زائد في الأساس (ص153)'],
];
// endings the manual pass showed to be wrong for the base sentence (marks only): [row, k, word]
const WORDFIX = [
  [411, 4, 'فَرْضُهُ'], [791, 7, 'كُلُّهَا'], [791, 16, 'مُصَلِّيًا'], [1446, 7, 'وَالْحِنَّاءِ،'], [1550, 13, 'يَسْتَسْعِيَ.'],
  [1766, 1, 'ثِيَابُهُ'], [3297, 6, 'صَحَّ'], [4542, 6, 'بِإِخْوَتِهِنَّ'], [4230, 2, 'يَتِمَّ'], [3365, 9, 'النَّجْمِ'], [4370, 3, 'فَقَبِلَ'],
];
for (const [ri, k, v] of WORDFIX) {
  const t = rows[ri].text.split(' ');
  if (strip(t[k]) !== strip(v)) throw new Error(`wordfix letters differ row ${ri} k ${k}: ${t[k]} / ${v}`);
  t[k] = v; rows[ri].text = t.join(' ');
}
// built words left with a bare final shadda (base mark kept at a variant edge): ثُمَّ and the past verbs صَحَّ أَقَرَّ مَرَّ always end in fatha
let builtFix = 0;
rows.forEach(r => { r.text = r.text.split(' ').map(w => w.replace(/^((?:[وف]َ)?(?:صَحّ|ثُمّ|أَقَرّ|مَرّ))(?![ً-ْ])/, (m) => { builtFix++; return m + 'َ'; })).join(' '); });
for (const [a, b, letters] of OVERRIDE) {
  const r = rows.find(x => x.text.includes(a));
  if (!r) throw new Error('override not found: ' + a);
  if (!letters && strip(a) !== strip(b)) throw new Error('override changes letters: ' + a);
  r.text = r.text.replace(a, b);
}
// hamza under alif carries kasra only (a fatha came from a witness reading «كَأَنْ» where the base has «كإن»)
rows.forEach(r => { r.text = r.text.replace(/إ[َُ]/g, 'إِ'); });
// letter typos of the base corrected from تبيين (T) / البحر (B): [row, k, word, reason]
const LETTERFIX = [
  [280, 4, 'يَسْتَمِعُ', 'ص166 «يسمع» ← B: «بَلْ يَسْتَمِعُ وَيُنْصِتُ»'],
  [290, 5, 'الْخَنَاثَى', 'ص167 «الخنائي» ← الخناثى (تصحيف؛ والكلمة ليست في T ولا B، وفي B: «وَلَمْ يَذْكُرْ الْخَنَاثَى»)'],
  [1678, 18, 'أَوْ إِذْنِهِ', 'ص336 «أوإذنه» ملتصقة ← «أَوْ إِذْنِهِ» (فصل الكلمتين فقط)'],
  [2350, 1, 'بِالتَّعْيِيبِ', 'ص429 «بالتّعيب» ← T: «وَبِبَيَانٍ بِالتَّعْيِيبِ»'],
  [3425, 1, 'قَضَى', 'ص566 «قضي» ← T وB: «فَإِنْ قَضَى بِهِ عَلَيْهِ»'],
  [3426, 6, 'وَيُؤَدَّى', 'ص566 «ويؤدّي» ← T: «وَيُؤَدَّى الْمَالُ»'],
  [3503, 0, 'وَيَتَحَجَّرُ', 'ص575 «وينحجّر» ← T: «وَيَتَحَجَّرُ بِحَجْرِهِ»'],
  [3570, 17, 'الْمُشْتَرِي،', 'ص585 «المشترى» ← B: «أَوْ عَلَى الْمُشْتَرِي»'],
  [4235, 6, 'فَعَلَى', 'ص663 «فعل» ← T وB: «فَعَلَى أَقْرَبِهِمَا»'],
];
for (const [ri, k, v] of LETTERFIX) { const t = rows[ri].text.split(' '); if (!t[k]) throw new Error('letterfix ' + ri); t[k] = v; rows[ri].text = t.join(' '); }
// additions of the edition that neither تبيين nor البحر quotes as matn — removed (Yusuf follows the common wording).
// [row, words to remove as plain letters (must match a contiguous run), reason]; null = the whole row
const DELETE = [
  [5, 'والله أعلم بالصواب.', 'آخر المقدمة: ليس في مقدمة الكنز المطبوعة مع البحر (ص١)'],
  [119, null, 'ص150 «ودم الاستحاضة كرعاف دائم…»: ليس متنًا في T ولا B (ألفاظه في شرح T فقط)'],
  [1338, null, 'ص294 «هو الفصل من النكاح»: ليس في T ولا B؛ قال الشلبي: «ليس هذا في خط الشارح»، وابن عابدين: «لعله ساقط من نسخته»'],
  [1423, 'بسبب زوال النكاح المتأكد بالدخول أو الموت.', 'ص304 ذيل تعريف العدة: T «هِيَ تَرَبُّصٌ يَلْزَمُ الْمَرْأَةَ» فقط، وB «…عِنْدَ زَوَالِ النِّكَاحِ أَوْ شُبْهَتِهِ»'],
  [1598, null, 'ص327 «اليمين تقوية أحد طرفي الخبر بالمقسم به»: ليس في T ولا B؛ وB يبدأ بعد العنوان بـ«فَحَلِفُهُ» كما في الأساس'],
  [1914, null, 'ص369 «هي جمع السيرة…»: ليس في T ولا B'],
  [2092, 'بها إن كان غنيا', 'ص393 T وB: «ثُمَّ تَصَدَّقَ» فقط'],
  [2134, 'وتصح مع التفاضل في المال', 'ص399 T وB: «…وَعَكْسِهِ وَبِبَعْضِ الْمَالِ»؛ وهي شرح «وعكسه» (B)'],
  [2925, null, 'ص500 «وفي بدل الكتابة: حلف العبد»: ليس في T ولا B'],
  [4599, null, 'ص708 الخاتمة «والله أعلم بالصواب وإليه المرجع والمآب…»: ليست في T ولا B'],
];
const plain = s => strip(s).replace(/[^ء-ي ]/g, '').replace(/\s+/g, ' ').trim();
for (const [ri, run] of DELETE) {
  const r = rows[ri];
  if (run === null) { r.deleted = true; continue; }
  const t = r.text.split(' '), p = t.map(plain), q = plain(run).split(' ');
  const at = p.findIndex((_, i) => q.every((w, j) => p[i + j] === w));
  if (at < 0) throw new Error('delete run not found in row ' + ri + ': ' + run);
  const endPunct = /[.]$/.test(t[at + q.length - 1]) && at + q.length === t.length;
  t.splice(at, q.length);
  if (endPunct && t.length) t[t.length - 1] = t[t.length - 1].replace(/[،:]?$/, '.');
  r.text = t.join(' ');
}
const kept = rows.filter(r => !r.deleted);
rows.length = 0; kept.forEach(r => rows.push(r));
fs.writeFileSync(path.join(out, 'doubts.tsv'), 'chunk\tpage\trow\tk\tword\tnote\n' + doubts.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'final-rows.json'), JSON.stringify(rows, null, 0).replace(/\},\{/g, '},\n{'));
// paragraphs
const W = s => s.split(' ').filter(Boolean);
function splitLong(u) {
  if (u.length <= 40) return [u];
  let best = null;
  u.forEach((w, i) => { const a = i + 1, b = u.length - a; if (a < 8 || b < 8) return; const pr = /؛$/.test(w) ? 3 : /[،:]$/.test(w) ? 2 : /^[وف]َ/.test(u[i + 1] || '') ? 1 : 0; if (!pr) return; const sc = pr * 100 - Math.abs(a - b); if (!best || sc > best[1]) best = [i, sc]; });
  if (!best) return [u];
  return [...splitLong(u.slice(0, best[0] + 1)), ...splitLong(u.slice(best[0] + 1))];
}
function pack(units) {
  const P = []; let cur = [];
  for (const u0 of units) for (const u of splitLong(u0)) {
    if (cur.length && (cur.length + u.length > 40 || (cur.length >= 8 && cur.length + u.length > 30))) { P.push(cur); cur = []; }
    cur = cur.concat(u);
  }
  if (cur.length) { if (cur.length < 8 && P.length && P[P.length - 1].length + cur.length <= 48) P[P.length - 1] = P[P.length - 1].concat(cur); else P.push(cur); }
  return P.map(p => p.join(' '));
}
const chapters = []; let group = null, cur = null, units = [];
const flush = () => { if (cur && units.length) { cur.paras = pack(units); chapters.push(cur); } units = []; };
for (const r of rows) {
  if (r.head) {
    flush();
    const title = r.text.replace(/:$/, '').trim();
    if (r.head === 'kitab' || strip(title) === 'مقدمة المؤلف') group = title;
    cur = { title, group: group || title };
    continue;
  }
  units.push(W(r.text));
}
flush();
const doc = {
  source: 'كنز الدقائق لأبي البركات النسفي، ت. أ. د. سائد بكداش (دار البشائر الإسلامية ودار السراج ١٤٣٢هـ) = https://shamela.ws/book/14262',
  check: 'قوبل كلمةً كلمةً بسكربت بمتن الكنز كما في «تبيين الحقائق» للزيلعي (بولاق ١٣١٤هـ، مشكول) = https://shamela.ws/book/23023، وبما يورده «البحر الرائق» لابن نجيم = https://shamela.ws/book/12227 — والشكل من التبيين ثم البحر ثم إكمال يدوي؛ انظر kanz-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  chapters
};
fs.writeFileSync(path.join(here, '../kanz.json'), JSON.stringify(doc, null, 1) + '\n');
const P = chapters.flatMap(c => c.paras), lens = P.map(p => W(p).length);
console.log('manual words applied', applied, 'built-word fatha', builtFix, 'doubts', doubts.length, 'chapters', chapters.length, 'groups', new Set(chapters.map(c => c.group)).size,
  'paras', P.length, 'words', lens.reduce((a, b) => a + b, 0), 'min/max', Math.min(...lens), Math.max(...lens), '>40:', lens.filter(n => n > 40).length, '<8:', lens.filter(n => n < 8).length);
