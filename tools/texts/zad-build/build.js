// Builds ../zad.json from out/tokens.json (collate.js): chapters at the titles of R (كتاب/باب/فصل), paragraphs of about 8–40 words
// cut at sentence ends («.»), a long sentence cut further at «؛» or «،». Then the hand fixes of fixes.js are applied (each must match).
// usage: node build.js
const fs = require('fs');
const { basmala, tokens } = require('./out/tokens.json');
const FIXES = require('./fixes.js');
const nw = s => s.split(' ').filter(Boolean).length;

// ---- particles that no witness vocalized at their place: their marks do not admit another reading (contexts checked by hand)
const FILL = { 'لا': 'لَا', 'أو': 'أَوْ', 'في': 'فِي', 'أن': 'أَنْ', 'ولا': 'وَلَا', 'لي': 'لِي', 'اثنتان': 'اثْنَتَانِ', 'ما': 'مَا', 'ثم': 'ثُمَّ',
  'وهو': 'وَهُوَ', 'على': 'عَلَى', 'عليه': 'عَلَيْهِ', 'وأن': 'وَأَنْ', 'مع': 'مَعَ', 'الذين': 'الَّذِينَ', 'وإن': 'وَإِنْ', 'إلا': 'إِلَّا', 'فيه': 'فِيهِ',
  'هذا': 'هَذَا', 'لم': 'لَمْ', 'وفي': 'وَفِي', 'وهي': 'وَهِيَ', 'كما': 'كَمَا', 'به': 'بِهِ', 'وإذا': 'وَإِذَا', 'له': 'لَهُ', 'بإن': 'بِإِنْ', 'بما': 'بِمَا',
  'ومن': 'وَمِنْ', 'وعلى': 'وَعَلَى', 'زاني': 'زَانِي', 'يا': 'يَا', 'ولو': 'وَلَوْ' };
const filled = [];
for (const t of tokens) {
  if (!/[ء-ي]/.test(t.o) || /[ً-ْ]/.test(t.o)) continue;
  const core = t.o.replace(/^[^ء-ي]+|[^ء-ي]+$/g, '');
  if (FILL[core]) { const o = t.o.replace(core, FILL[core]); filled.push(t.o + '\t' + o); t.o = o; }
}
fs.writeFileSync(__dirname + '/out/filled.tsv', filled.join('\n'));
// ---- R's quotation marks where one of a pair is missing (before they are paired into «»)
const PRE = [
  ['وَيَقُولُ بِسْمِ اللهِ وَاللهُ أَكْبَرُ،', 'وَيَقُولُ "بِسْمِ اللهِ وَاللهُ أَكْبَرُ،'], // the closing mark after «منك ولك» is in R
  ['"لَا وَاللهِ" وَبَلَى وَاللهِ"', '"لَا وَاللهِ" "وَبَلَى وَاللهِ"'],
]; PRE.used = new Set();
// ---- chapters
const chapters = []; let group = null, cur = null;
const open = (title, kind) => { cur = { title, kind, words: [] }; if (kind === 'kitab') group = title; cur.group = group; chapters.push(cur); };
open('مُقَدِّمَةُ الْمُؤَلِّفِ', 'muq'); chapters[0].group = 'مُقَدِّمَةُ الْمُؤَلِّفِ';
for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  if (t.title && t.line) {
    const ws = [t.o]; while (tokens[i + 1] && tokens[i + 1].title === t.title && !tokens[i + 1].line) ws.push(tokens[++i].o);
    // every «فصل» is printed «فَصْلٌ»; «بابُ» gets its fatha where R left it out
    let title = ws.join(' ').replace(/[.،:]$/, '');
    if (t.title === 'fasl') title = ['فَصْلٌ', ...ws.slice(1)].join(' ').replace(/[.،:]$/, ''); else title = title.replace(/^بابُ/, 'بَابُ').replace(/^بابٌ$/, 'بَابٌ').replace(/^كتابُ/, 'كِتَابُ');
    open(title, t.title); continue;
  }
  cur.words.push(t.o);
}
// a كتاب heading followed at once by its first باب carries no text of its own
const out = chapters.filter(c => c.words.length).map(c => {
  // R's "…" pairs become «…» (paired over the whole chapter, a mark sticks to its word), {…} around an ayah becomes ﴿…﴾,
  // the Latin comma becomes «،», and R's editorial dashes («بِسُوءٍ -انْتَقَضَ») go
  let q = false, raw = c.words.join(' ');
  for (const [a, b] of PRE) if (raw.includes(a)) { raw = raw.replace(a, b); PRE.used.add(a); }
  const text = raw.replace(/"/g, () => (q = !q) ? '«' : '»').replace(/«\s+/g, '«').replace(/\s+»/g, '»')
    .replace(/\{/g, '﴿').replace(/\}/g, '﴾').replace(/,/g, '،').replace(/(^|\s)-+(?=\S)|(?<=\S)-+(?=\s|$)|\s-+\s/g, '$1')
    .replace(/\s+([.،؛:])/g, '$1').replace(/([.،؛:])(?=[^\s»])/g, '$1 ').replace(/\s+/g, ' ');
  if (q) console.error('unpaired quote in', c.title);
  // sentences, then long ones cut at «؛» / «،» into pieces of at most ~35 words
  const sents = text.match(/[^.]+\.?/g).map(s => s.trim()).filter(Boolean), pieces = [];
  for (const s of sents) {
    if (nw(s) <= 40) { pieces.push(s); continue; }
    const cl = s.match(/[^،؛]+[،؛]?/g).map(x => x.trim()); let acc = '';
    for (const x of cl) { if (acc && nw(acc) + nw(x) > 35) { pieces.push(acc); acc = ''; } acc = acc ? acc + ' ' + x : x; }
    if (acc) pieces.push(acc);
  }
  // a piece still over 40 words (a list without commas) is cut before «ثُمَّ / وَإِنْ / فَإِنْ / وَإِذَا / فَإِذَا» or a quoted formula
  for (let k = 0; k < pieces.length; k++) {
    if (nw(pieces[k]) <= 40) continue;
    const w = pieces[k].split(' '), cuts = [];
    w.forEach((x, i) => { if (i >= 8 && i <= w.length - 8 && /^(ثُمَّ|وَإِنْ|فَإِنْ|وَإِذَا|فَإِذَا|ثُمَّ)$|^«/.test(x)) cuts.push(i); });
    if (!cuts.length) continue;
    const mid = w.length / 2, c = cuts.reduce((a, b) => Math.abs(b - mid) < Math.abs(a - mid) ? b : a);
    pieces.splice(k, 1, w.slice(0, c).join(' '), w.slice(c).join(' ')); k--;
  }
  // a short piece joins its neighbour (the next one, or the previous at the chapter end) while the result stays ≤ 45 words
  const paras = [];
  for (let k = 0; k < pieces.length; k++) {
    let p = pieces[k];
    while (nw(p) < 8 && k + 1 < pieces.length && nw(p) + nw(pieces[k + 1]) <= 45) p += ' ' + pieces[++k];
    if (nw(p) < 8 && paras.length && nw(paras[paras.length - 1]) + nw(p) <= 45) paras[paras.length - 1] += ' ' + p; else paras.push(p);
  }
  // a quotation cut by a paragraph end is closed there and reopened in the next paragraph
  for (let k = 0; k + 1 < paras.length; k++) {
    const o = (paras[k].match(/«/g) || []).length - (paras[k].match(/»/g) || []).length;
    if (o > 0) { paras[k] += '»'; paras[k + 1] = '«' + paras[k + 1]; }
  }
  const ch = { title: c.title }; if (c.group) ch.group = c.group; ch.paras = paras; return ch;
});
for (const [a] of PRE) if (!PRE.used.has(a)) { console.error('pre-fix unused: ' + a); process.exitCode = 1; }
let J = { source: '', check: '', basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', chapters: out };
// ---- hand fixes on the text
// the witnesses write shadda and vowel in either order: everything (text and fixes) is put in canonical order (NFC) first
let s = JSON.stringify(J).normalize('NFC');
for (let [from, to, why] of FIXES) {
  to = to.normalize('NFC');
  if (from instanceof RegExp) {
    from = new RegExp(from.source.normalize('NFC'), from.flags);
    if (!from.test(s)) { console.error('fix matches nothing: ' + from.source + ' (' + why + ')'); process.exitCode = 1; }
    from.lastIndex = 0; s = s.replace(from, to); continue;
  }
  from = from.normalize('NFC');
  const n = s.split(from).length - 1;
  if (n !== 1) { console.error('fix matches ' + n + ' times: ' + from + ' (' + why + ')'); process.exitCode = 1; continue; }
  s = s.replace(from, to);
}
J = JSON.parse(s);
J.source = 'المتن المفرد «زاد المستقنع في اختصار المقنع» (نسخ وتشكيل ومراجعة مكتب الرحاب، الشاملة الذهبية) = https://ketabonline.com/ar/books/102403';
J.check = 'قوبل كلمةً كلمةً بسكربت على تحقيق عبد الرحمن العسكر (دار الوطن) https://shamela.ws/book/11230 = https://ketabonline.com/ar/books/753، وعلى المتن المشكول داخل «الروض المربع» ط ركائز (ت. المشيقح والعيدان واليتامى) https://shamela.ws/book/147658؛ حيث اختلف الرحاب عن الاثنين أُخذ ما اتفق عليه اثنان، والشكل من متن الروض حيث اتفق اللفظ، وعند اختلاف الشكل يُحتكم إلى متن «الشرح الممتع» (https://shamela.ws/book/10649) — انظر zad-sources.md';
fs.writeFileSync(__dirname + '/../zad.json', JSON.stringify(J, null, 1));
const P = J.chapters.flatMap(c => c.paras), L = P.map(nw);
console.log('chapters', J.chapters.length, 'paras', P.length, 'words', L.reduce((a, b) => a + b, 0), 'min', Math.min(...L), 'max', Math.max(...L),
  '<8:', L.filter(x => x < 8).length, '>40:', L.filter(x => x > 40).length);
