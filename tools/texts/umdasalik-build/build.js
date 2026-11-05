// Builds tools/texts/umdasalik.json from out/A.json (extract-shamela.js) + manual.js (wording, by collation) + the fixes below.
// usage: node build.js
const fs = require('fs'), path = require('path');
const O = path.join(__dirname, 'out');
const A = JSON.parse(fs.readFileSync(path.join(O, 'A.json'), 'utf8'));
const MANUAL = require('./manual.js');
const log = [];

// ---------- 1. fixes that are not a matter of wording (each with its reason)
const FIXES = [
  // the Qatar print opens a quotation with " and closes it with nothing (and the extractor paired the wrong marks)
  ['قائلاً: "سمع الله لمن حمده«، سواء الإمام والمأموم والمنفرد. فإذا انتصب قائماً قال: »ربنا لك الحمد، مِلْءَ السماوات ومِلْءَ الأرض ومِلْءَ ما شئت من شيء بعد.',
    'قائلاً: «سمع الله لمن حمده»، سواء الإمام والمأموم والمنفرد. فإذا انتصب قائماً قال: «ربنا لك الحمد، مِلْءَ السماوات ومِلْءَ الأرض ومِلْءَ ما شئت من شيء بعد».', 'علامات تنصيص مختلّة في المصدر'],
  // Quran as in the Mushaf
  ['﴿وَلا الضَّالِّيِنَ﴾', '﴿وَلَا الضَّالِّينَ﴾', 'الآية كما في المصحف (كسرة زائدة على الياء)'],
  ['﴿الم. تَنْزِيلُ﴾', '﴿الم تَنْزِيلُ﴾', 'نقطة تحريرية داخل الآية'],
  ['﴿قُلْ يا أَيُّهَا الْكَافِرُونَ﴾', '﴿قُلْ يَا أَيُّهَا الْكَافِرُونَ﴾', 'توحيد شكل الآية'],
  ['﴿استغفروا ربكمْ إنهُ كانَ غفاراً﴾', '﴿اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا﴾', 'الآية مشكولة كما في المصحف'],
  ['﴿رَبَّنَا آتِنَا في الدُّنْيَا حَسَنَةَ﴾', '﴿رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً﴾', 'الآية كما في المصحف (حَسَنَةً)'],
  ['لَمِنَ الْضَالِّينَ', 'لَمِنَ الضَّالِّينَ', 'الآية كما في المصحف'],
  // conflicting marks on one letter in the source (a doubled mark is collapsed generically below)
  ['ثبتَِ في ذمتهِ', 'ثبتَ في ذمتهِ', 'فتحة وكسرة معًا؛ الفعل ماضٍ'],
  ['قِنطار لم يُعيَِّن ما هو', 'قِنطار لم يُعيّن ما هو', 'فتحة وكسرة معًا؛ حُذفتا وتُركت الشدة'],
  ['وعشرينَ ابنَِ لبونٍ', 'وعشرينَ ابنَ لبونٍ', 'فتحة وكسرة معًا؛ تمييز منصوب'],
  ['وهي مكَّةَُ والمدينةُ', 'وهي مكَّةُ والمدينةُ', 'فتحة وضمة معًا؛ خبر مرفوع'],
  ['واللهُ سُبحانَهُ وتعالى أعلمَ بالصَّوابِ.', 'واللهُ سُبحانَهُ وتعالى أعلمُ بالصَّوابِ.', 'خبر مرفوع (فتحة خطأ مطبعي)'],
  ['منْ وَسَطِ الذَِراعِ', 'منْ وَسَطِ الذِّراعِ', 'فتحة وكسرة معًا والشدة ساقطة: «الذِّراع» لغةً'],
];
const items = A.map(x => Object.assign({}, x));
// titles: case endings printed wrong in the Qatar edition; «باب:» as printed
const TITLES = { 'بابُ زكاةُ الذهبِ والفضةِ': 'بابُ زكاةِ الذهبِ والفضةِ', 'باب قَسْمُ الصدقاتِ': 'باب قَسْمِ الصدقاتِ', 'باب الأوقاتُ التي نُهي عن الصلاة فيها': 'باب: الأوقاتُ التي نُهي عن الصلاة فيها' };
for (const it of items) if (it.t === 'h' && TITLES[it.title]) { log.push(['title', it.title, TITLES[it.title]].join('	')); it.title = TITLES[it.title]; }
const allText = () => items.filter(x => x.t === 'p').map(x => x.text).join('\n');
for (const [from, to, why] of FIXES) {
  const hits = items.filter(x => x.t === 'p' && x.text.includes(from));
  if (hits.length !== 1) throw new Error('fix not unique (' + hits.length + '): ' + from);
  hits[0].text = hits[0].text.replace(from, to);
  log.push(['fix', from, to, why].join('\t'));
}

// ---------- 2. wording decisions (manual.js), matched word by word without harakat/punctuation
const HAR = /[ً-ْٰـ]/g;
const nw = w => w.replace(HAR, '').replace(/[^ء-ي]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const words = s => s.split(/\s+/).filter(Boolean);
let bad = 0;
for (const [before, from, to, after, wit, note] of MANUAL) {
  const B = words(before).map(nw).filter(Boolean), F = words(from).map(nw).filter(Boolean), Z = words(after || '').map(nw).filter(Boolean);
  const pat = [...B, ...F, ...Z];
  // the context may run over a paragraph end: search the whole text as one stream of (paragraph, word) positions
  const G = [];
  items.forEach((it, k) => { if (it.t !== 'p') return; words(it.text).forEach((w, i) => { const x = nw(w); if (x) G.push({ k, i, x }); }); });
  const found = [];
  for (let s = 0; s + pat.length <= G.length; s++) {
    let ok = true; for (let q = 0; q < pat.length; q++) if (G[s + q].x !== pat[q]) { ok = false; break; }
    if (!ok) continue;
    if (F.length) { const a = G[s + B.length], b = G[s + B.length + F.length - 1]; if (a.k !== b.k) continue; found.push({ k: a.k, i0: a.i, i1: b.i + 1 }); }
    else { const a = G[s + B.length]; found.push({ k: a.k, i0: a.i, i1: a.i }); } // insertion before the first «after» word
  }
  if (found.length !== 1) { console.log('MANUAL ' + found.length + ' matches: ' + [before, from, after].join(' | ')); bad++; continue; }
  const { k, i0, i1 } = found[0];
  const ws = words(items[k].text);
  const old = ws.slice(i0, i1).join(' ');
  let rep = to;
  // keep the punctuation that followed the replaced words
  const tail = F.length ? (ws[i1 - 1].match(/[^ء-ْٰ]+$/) || [''])[0] : '';
  if (tail && !/[^ء-ْٰ]$/.test(rep)) rep += tail;
  if (F.length && !to) { // deletion: move the punctuation of the deleted words onto the word before
    if (tail && i0 > 0 && !/[^ء-ْٰ]$/.test(ws[i0 - 1])) ws[i0 - 1] += tail;
    rep = '';
  }
  // an inserted complement goes before the comma that followed the word before it («لا مُتْعةَ، » -> «لا مُتْعةَ لها،»)
  if (!F.length && i0 > 0 && /،$/.test(ws[i0 - 1]) && !/^(و|أو )/.test(rep)) { ws[i0 - 1] = ws[i0 - 1].slice(0, -1); rep += '،'; }
  const out = [...ws.slice(0, i0), ...(rep ? [rep] : []), ...ws.slice(i1)];
  items[k].text = out.join(' ');
  log.push(['wording', wit, old || '(—)', to || '(حذف)', before + ' … ' + (after || ''), note || ''].join('\t'));
}

if (bad) throw new Error(bad + ' manual entries did not match');
// ---------- 3. orthographic normalization
const norm = s => s
  .replace(/([ً-ْ])\1+/g, '$1') // a doubled mark («الأرضِِِ», «عُدْواناًً»)
  .replace(/ًَ|ًَ/g, 'ً').replace(/ٌُ|ٌُ/g, 'ٌ').replace(/ٍِ|ٍِ/g, 'ٍ') // tanween + its own vowel
  .replace(/(ّ)\1+/g, '$1')
  .replace(/([ء-ي])([َّ]*)اً/g, (m, l, mk) => l + (mk.includes('ّ') ? 'ّ' : '') + 'ًا').replace(/اً/g, 'ًا') // accusative tanween on the letter before the alif (its fatha dropped)
  .replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
  .normalize('NFC');
for (const it of items) { if (it.text) it.text = norm(it.text); if (it.title) it.title = norm(it.title); }
// any two different vowels left on one letter is an error to look at
for (const it of items) for (const w of words(it.text || it.title || '')) if (/[ً-ِْ]{2}/.test(w.replace(/ّ/g, ''))) log.push(['WARN double vowel', w].join('\t'));

// ---------- 4. chapters and paragraphs (8–40 words, cut at the end of a sentence)
const wc = s => words(s).filter(w => /[ء-ي]/.test(w)).length;
// split a long text at «.»; then a too long sentence at «؛» / «:» / «،» — never inside «…» or ﴿…﴾
function sentences(text) {
  const out = []; let cur = '', depth = 0;
  for (const tok of words(text)) {
    cur += (cur ? ' ' : '') + tok;
    depth += (tok.match(/[«﴿]/g) || []).length - (tok.match(/[»﴾]/g) || []).length;
    if (depth <= 0 && /[.؟!]["»﴾)]*$/.test(tok)) { out.push(cur); cur = ''; depth = 0; }
  }
  if (cur) out.push(cur);
  return out.flatMap(s => wc(s) <= 40 ? [s] : cut(s));
}
function cut(s) { // break a long sentence into pieces of at most ~40 words at the best punctuation
  const toks = words(s); const out = []; let start = 0;
  while (wc(toks.slice(start).join(' ')) > 40) {
    let best = -1, bestScore = -1, depth = 0, n = 0;
    for (let i = start; i < toks.length; i++) {
      depth += (toks[i].match(/[«﴿]/g) || []).length - (toks[i].match(/[»﴾]/g) || []).length;
      if (/[ء-ي]/.test(toks[i])) n++;
      if (n > 40) break;
      if (depth > 0 || n < 12) continue;
      const sc = /[؛:]["»]?$/.test(toks[i]) ? 3 : /،["»]?$/.test(toks[i]) ? 2 : 0;
      if (sc && sc * 100 + n >= bestScore) { best = i; bestScore = sc * 100 + n; }
    }
    if (best < 0) break; // no safe place: keep it long
    out.push(toks.slice(start, best + 1).join(' ')); start = best + 1;
  }
  out.push(toks.slice(start).join(' '));
  return out;
}
const chapters = [];
let group = '', cur = null, basmala = '';
for (const it of items) {
  if (it.t === 'basmala') { basmala = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'; continue; }
  if (it.t === 'h') {
    if (it.kind === 'intro') { group = 'مُقَدِّمَةُ الْمُؤَلِّفِ'; cur = { title: group, group, src: [] }; chapters.push(cur); continue; }
    if (it.kind === 'kitab') group = it.title;
    cur = { title: it.title, group, src: [] }; chapters.push(cur); continue;
  }
  cur.src.push(it.text);
}
for (const c of chapters) {
  const sents = c.src.flatMap(sentences);
  const paras = []; let p = '';
  for (const s of sents) {
    if (p && wc(p) >= 8 && wc(p) + wc(s) > 40) { paras.push(p); p = ''; }
    p += (p ? ' ' : '') + s;
  }
  if (p) { if (paras.length && wc(p) < 8 && wc(paras[paras.length - 1]) + wc(p) <= 50) paras[paras.length - 1] += ' ' + p; else paras.push(p); }
  c.paras = paras;
}
const kept = chapters.filter(c => c.paras.length).map(c => ({ title: c.title, group: c.group, paras: c.paras }));
const json = {
  source: 'عمدة السالك وعدة الناسك، عُني بطبعه ومراجعته عبد الله بن إبراهيم الأنصاري، الشؤون الدينية، قطر، ط١ ١٩٨٢م (مشكولة جزئيًّا) = https://shamela.ws/book/37344 = https://ketabonline.com/ar/books/4391',
  check: 'قوبل كلمةً كلمةً بسكربت على ثلاث نشرات مستقلة (نصوص OCR من أرشيف الإنترنت): ت. ماجد الحموي، دار ابن حزم https://archive.org/details/umdahsalik، والمتن في «أنوار المسالك» للغمراوي ت. محمد صلاح نويدر https://archive.org/details/a2345n، والمتن في «فيض الإله المالك» للبقاعي، دار الكتب العلمية https://archive.org/details/Pdf4189؛ وغُيّر لفظ الأساس حيث اتفق شاهدان منها على خلافه — انظر umdasalik-sources.md',
  basmala,
  chapters: kept,
};
fs.writeFileSync(path.join(__dirname, '..', 'umdasalik.json'), JSON.stringify(json, null, 1) + '\n');
fs.writeFileSync(path.join(O, 'changes.tsv'), log.join('\n') + '\n');
const P = kept.flatMap(c => c.paras), W = P.map(wc);
console.log('chapters', kept.length, '(kitab', kept.filter(c => c.title === c.group).length + ')', 'paras', P.length, 'words', W.reduce((a, b) => a + b, 0),
  'paras <8:', W.filter(x => x < 8).length, '>40:', W.filter(x => x > 40).length, 'max', Math.max(...W));
console.log('log lines', log.length, 'warnings', log.filter(l => /^WARN/.test(l)).length);
