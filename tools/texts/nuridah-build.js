// Stage 2 for «نور الإيضاح»: builds tools/texts/nuridah.json from raw/nuridah/A.json (made by nuridah-extract.js).
// Applies the collation decisions (FIX, every one listed in nuridah-sources.md), cleans the text, and cuts it into
// paragraphs at the sentence / list-item boundaries of the Mahrat edition (Shamela 12117) mapped onto our text.
// usage: node tools/texts/nuridah-build.js
const fs = require('fs'), path = require('path');
const { norm, diff } = require('./nuridah-extract.js');
const R = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'raw/nuridah', f), 'utf8'));
const A = R('A.json');

// [page, old, new] — exact substrings of the item text on that page (old must occur exactly once there)
const FIX = [
  [2, 'وماء الثلج وماء البرد', 'وما ذاب من الثلج وماء البرد'],
  [2, 'وهوالماء', 'وهو الماء'],
  [3, 'لقربه كالوضوء', 'لقربة كالوضوء'],
  [9, 'تحري للتوضؤ', 'تحرى للتوضؤ'],
  [12, 'أربيعن', 'أربعين'],
  [37, 'اثنا عشرة شيئا', 'اثنا عشر شيئا'],
  [47, 'ويبدتدىء', 'ويبتدئ'],
  [55, 'لا الطبخ مرق', 'لا لطبخ مرق'],
  [56, 'من ال العذر', 'من العذر'],
  [56, 'والذهب الربع', 'والذهب الرابع'],
  [58, 'على الوقت ما يصنع الجريح ولو', 'على الوقت ولو'],
  [59, 'الجريج', 'الجريح'],
  [62, 'وسسنه', 'وسننه'],
  [66, 'واستحاضة الحيض فالحيض', 'واستحاضة فالحيض'],
  [67, 'الفناس', 'النفاس'],
  [68, 'الانقاطع', 'الانقطاع'],
  [69, 'الاستحافة', 'الاستحاضة'],
  [70, 'صابحه', 'صاحبه'],
  [73, 'لا ينعصر الركب', 'لا ينعصر الرطب'],
  [75, 'بخفافه', 'بجفافه'],
  [84, 'لا يصح فهيا', 'لا يصح فيها'],
  [85, 'تليت كما ح عصر', 'تليت فيها كما صح عصر'],
  [98, 'سجد فهيا', 'سجد فيها'],
  [98, 'القدميين', 'القدمين'],
  [103, 'السرى', 'السرة'],
  [103, 'الانشكشاف', 'الانكشاف'],
  [107, 'متعينيتن', 'متعينتين'],
  [111, 'الرسع', 'الرسغ'],
  [120, 'من كيمه', 'من كميه'],
  [131, 'اختراه', 'اختاره'],
  [133, 'فإن فلعن', 'فإن فعلن'],
  [134, 'المتقدي', 'المقتدي'],
  [136, 'أني يتحول', 'أن يتحول'],
  [151, 'وعلى صور والاقتصار', 'وعلى صورة والاقتصار'],
  [153, 'أولغير', 'أو لغير'],
  [158, 'أوشمع', 'أو شمع'],
  [159, 'منالصلاة', 'من الصلاة'],
  [159, 'أوشغله', 'أو شغله'],
  [199, 'واختراه', 'واختاره'],
  [200, 'الولو الجي', 'الولوالجي'],
  [205, 'وترافسد', 'وترا فسد'],
  [221, 'والمقتدى به بالسماع من مقتد ولو', 'والمقتدى به ولو'],
  [233, 'عليه سلم', 'عليه وسلم'],
  [234, 'فلا صلاة ولا كلام', 'فلا صلاة ولا كلام ولا يرد سلاما ولا يشمت عاطسا'],
  [235, 'والالتفات ولا يرد سلاما، ولا يشمت عاطسا ولا يسلم', 'والالتفات ولا يسلم'],
  [254, 'ووضىء في الصحيح "*" "إلا أن يكون صغيرا لا يعقل الصلاة" بلا', 'ووضئ في الصحيح بلا'],
  [255, 'ومسح بطنه رفيقا وما خرج منه غسله ولم يعد ينشف', 'ومسح بطنه وما خرج منه غسله ولم يعد غسله ثم ينشف'],
  [270, 'بالشفغة', 'بالشفعة'],
  [272, 'يارتها', 'زيارتها'],
  [284, 'فيما لا يشترط تبييت النية وتعيينها فيه وما يشترط، أما', 'أما'],
  [294, 'أواحتجم', 'أو احتجم'],
  [300, 'والكافرة:', 'والكفارة:'],
  [302, 'وهو سبعة وخمسون شيئا"*": ', ''],
  [309, 'أو الهلال أو المرض', 'أو الهلاك أو المرض'],
  [310, ' "بمرض وسفر ونحوه كما تقدم" "*"', ''],
  [311, ' "عنه لاشتغاله بالمعيشة يفطر ويفدي"*""', ''],
  [311, ' "حتى صار فانيا""*"', ''],
  [311, ' "لأن الصوم هنا بدل عن غيره""*"', ''],
  [339, 'وزلحفاة', 'وسلحفاة'],
];
// text that opens a section but was printed inside its heading (restored from the commentary's quotes)
const PREPEND = { 'سجدة الشكر': 'سجدة الشكر' };
// heading text as printed (brackets/quotes removed) → title we use, and optional words that belong to the text
const HEAD = {
  'فصل: في بيان أحكام السؤر': ['فصل في بيان أحكام السؤر'],
  'فصل في تمام أحكام الوضوء': ['فصل في تمام أحكام الوضوء'],
  'فصل هو طائفة من المسائل تغيرت أحكامها بالنسبة لما قبلها': ['فصل: ينقض الوضوء'],
  'فصل عشرة أشياء لا تنقض الوضوء': ['فصل: عشرة أشياء لا تنقض الوضوء'],
  'فصل ما يجب فيه الاغتسال': ['فصل: ما يجب فيه الاغتسال'],
  'فصل عشرة أشياء لا يغتسل منها': ['فصل: عشرة أشياء لا يغتسل منها', 'عشرة أشياء لا يغتسل منها:'],
  'فصل يفترض في الاغتسال أحد عشر شيئا': ['فصل: يفترض في الاغتسال أحد عشر شيئا', 'يفترض في الاغتسال أحد عشر شيئا:'],
  'فصل يسن في الاغتسال اثنا عشرة شيئا': ['فصل: يسن في الاغتسال اثنا عشر شيئا', 'يسن في الاغتسال اثنا عشر شيئا:'],
  'فصل وآداب الاغتسال': ['فصل: آداب الاغتسال'],
  'فصل يسن الاغتسال لأربعة أشياء': ['فصل: يسن الاغتسال لأربعة أشياء', 'يسن الاغتسال لأربعة أشياء:'],
  'باب الانجاس والطهارة عنها': ['باب الأنجاس والطهارة عنها'],
  'فصل يطهر جلد الميتة ولو فيلا': ['فصل: يطهر جلد الميتة'],
  'باب الامامة': ['باب الإمامة'],
  'فصل: في صلاة الفرض والواجب على الدابة': ['فصل في صلاة الفرض والواجب على الدابة'],
  'باب ادراك الفريضة': ['باب إدراك الفريضة'],
  'فصل سجدة الشكر': ['فصل: سجدة الشكر'],
  'باب صلاة الكسوف والخسوف والافزاع': ['باب صلاة الكسوف والخسوف والأفزاع'],
  'فصل الصلاة عليه': ['فصل: الصلاة عليه'],
  'باب احكام الشهيد': ['باب أحكام الشهيد'],
  'باب مالا يفسد الصوم': ['باب ما لا يفسد الصوم'],
};
// bare «فصل»: named after its own opening words (index in A.json → title)
const BARE = { 178: 'فصل: يسقط حضور الجماعة', 354: 'فصل: السلطان أحق بصلاته', 413: 'فصل: يجب الإمساك بقية اليوم',
  494: 'فصل: القران', 496: 'فصل: التمتع', 498: 'فصل: العمرة', 514: 'فصل: ما لا شيء بقتله', 516: 'فصل: الهدي' };
const DROP_ITEMS = new Set([438]); // the closing «وهذا ما تيسر…», which the editor marks as taken from the commentary
const GROUP = { 'كتاب الطهارة': 1, 'كتاب الصلاة': 1, 'كتاب الصوم': 1, 'كتاب الزكاة': 1, 'كتاب الحج': 1 };

// ---- apply FIX ----
const used = new Set();
FIX.forEach(([pg, a, b], k) => {
  const hits = A.filter(x => x.page === pg && x.type === 't' && x.text.includes(a));
  if (hits.length !== 1 || hits[0].text.split(a).length !== 2) throw new Error('fix ' + k + ' p' + pg + ' «' + a + '» found ' + hits.length);
  hits[0].text = hits[0].text.replace(a, b); used.add(k);
});
const clean = t => t
  .replace(/ىء/g, 'ئ')
  .replace(/\s*\[[^\]]*:[^\]]*\]/g, '')            // verse references «[البقرة: ٢٠١]»
  .replace(/"\*"|\*/g, '')
  .replace(/([ء-ي])[٠-٩]+/g, '$1')                 // footnote numbers stuck to a word
  .replace(/\{([^}]*)\}/g, '﴿$1﴾')
  .replace(/"/g, '')
  .replace(/\.{2,}|…/g, ' ')
  .replace(/,/g, '،')
  .replace(/\s+([،.:؛])/g, '$1').replace(/([،:؛])(?=\S)/g, '$1 ')
  .replace(/(^|\s)(الى|اذا|احدى)(?=\s)/g, (m, s, w) => s + ({ 'الى': 'إلى', 'اذا': 'إذا', 'احدى': 'إحدى' })[w])
  .replace(/\s+/g, ' ').trim();
// spelling only (hamza, ة/ه, ى/ي) — checked against B and the commentary; applied as whole words everywhere
const SPELL = [['والى', 'وإلى'], ['واذا', 'وإذا'], ['فاذا', 'فإذا'], ['او', 'أو'], ['فان', 'فإن'], ['احب', 'أحب'], ['الراس', 'الرأس'], ['الامام', 'الإمام'], ['اليه', 'إليه'], ['باس', 'بأس'], ['اعلم', 'أعلم'],
  ['إلى ان', 'إلى أن'], ['بتسليمه', 'بتسليمة'], ['أهدنا', 'اهدنا'], ['اوليي', 'أوليي'], ['وصلاتة', 'وصلاته'], ['الأثنين', 'الاثنين'], ['والأطمئنان', 'والاطمئنان'],
  ['للإحكام', 'للأحكام'], ['ولفافه', 'ولفافة'], ['نافله', 'نافلة'], ['مروحه', 'مروحة'], ['وأن ركع', 'وإن ركع'], ['وأن كان لكافر', 'وإن كان لكافر'], ['أو لقربه', 'أو لقربة']];
const spell = t => SPELL.reduce((s, [a, b]) => s.replace(new RegExp('(^|[\\s،.:؛])' + a + '(?=[\\s،.:؛]|$)', 'g'), '$1' + b), t);
const headClean = t => t.replace(/[\[\]"]/g, '').replace(/\s+/g, ' ').trim();

// ---- chapters (word tokens with their source item) ----
const chapters = []; let group = null, cur = null, pend = null, pendPre = '';
A.forEach((x, i) => {
  if (x.page === 87 || DROP_ITEMS.has(i)) return; // p.87: the commentary was printed in the matn area
  if (x.type === 'h') {
    let h = headClean(x.text);
    if (GROUP[h]) { group = h; pend = h; pendPre = ''; return; }
    let pre = '';
    if (h === 'فصل') h = BARE[i] || (() => { throw new Error('bare فصل at ' + i); })();
    else if (HEAD[h]) { pre = HEAD[h][1] || ''; if (PREPEND[h.replace(/^فصل:? ?/, '')]) pre = PREPEND[h.replace(/^فصل:? ?/, '')]; h = HEAD[h][0]; }
    else if (/^فصل /.test(h) && PREPEND[h.slice(4)]) pre = PREPEND[h.slice(4)];
    pend = h; pendPre = pre; return;
  }
  let t = spell(clean(x.text));
  if (t === 'تنبيه') t = 'تنبيه:';
  if (pend) { cur = { title: pend, group, items: [] }; chapters.push(cur); if (pendPre) cur.items.push({ text: pendPre, page: x.page, i: -1 }); pend = null; }
  cur.items.push({ text: t, page: x.page, i });
});
const sPre = chapters.find(c => c.title === 'فصل: سجدة الشكر'); if (sPre && !sPre.items[0].text.startsWith('سجدة الشكر')) sPre.items.unshift({ text: 'سجدة الشكر', page: 227, i: -1 });

// ---- boundaries from B (Mahrat): new line / list number / full stop ----
const bRaw = R('12117.json').map(pg => pg.html.split(/<p(?=[ >])/).slice(1).filter(b => !/^[^>]*class="hamesh"/.test(b))
  .map(b => b.replace(/^[^>]*>/, '').split('</p>')[0].replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')).join('\n')).join('\n');
let bt = bRaw.split('\n').filter(l => !/^\s*\[[^\n]*\]\s*[؟:]?\s*$/.test(l) && !/^\s*\[?(كتاب|باب|فصل)\b[^.،]{0,80}$/.test(l)).join(' ⁞1 ');
for (let k = 0; k < 3; k++) bt = bt.replace(/\[[^\[\]]*\]/g, ' ');
bt = bt.replace(/[٠-٩0-9]+\s*و\s*[٠-٩0-9]+\s*-/g, ' ⁞1 ').replace(/[٠-٩0-9]+\s*-/g, ' ⁞1 ').replace(/(^|[\s.])[أابجدهوزحطيك]\s*-\s/g, '$1 ⁞1 ')
  .replace(/[.؟!]/g, ' ⁞2 ').replace(/:/g, ' ⁞1 ');
const bw = [], bb = [], braw = []; let flag = 0;
for (const tok of bt.split(/\s+/)) { if (tok === '⁞1' || tok === '⁞2') { flag = Math.max(flag, +tok[1]); continue; } for (const w of norm(tok)) { bw.push(w); bb.push(flag); braw.push(tok); flag = 0; } }

// first text item of each page continues the previous page's sentence
const firstOfPage = new Set(); { const seen = new Set(); A.forEach((x, i) => { if (x.type === 't' && !seen.has(x.page)) { seen.add(x.page); firstOfPage.add(i); } }); }
// words that open a new ruling (used only to cut paragraphs that run past ~25 words with no punctuation)
const START = /^(?:(?:و|ف)(?:يستحب|يكره|يجوز|يجب|يسن|يصح|لا|إن|إذا|لو|كره|ندب|شرط|كذا|أما|يشترط|تجب|تسقط|يجزئ|لزمه|يلزم|يقول|تقول|يدعو|يأتي|يرجع|يقف|يصلي|يدخل|يخرج|ينزل|يطوف|يرمي|يبدأ|ليس)|ثم|السلام|اللهم)$/;
// our tokens (raw words), each with its normalised words
const toks = [];
chapters.forEach((c, ci) => c.items.forEach((it, ii) => it.text.split(' ').forEach((w, wi) => {
  const n = norm(w);
  if (!n.length && toks.length && toks[toks.length - 1].ci === ci) { toks[toks.length - 1].raw += ' ' + w; return; }
  toks.push({ raw: w, n, ci, b: 0, item: wi === 0 && ii > 0 && !firstOfPage.has(it.i) ? 1 : 0, zak: it.page >= 324 });
})));
const aw = [], aOwner = [];
toks.forEach((t, k) => t.n.forEach(w => { aw.push(w); aOwner.push(k); }));
const zakStart = aOwner.findIndex(k => toks[k].zak);
const hunks = diff(aw.slice(0, zakStart), bw);
let ia = 0, ib = 0;
const tahMis = [];
const mark = (a, b) => { { const r = toks[aOwner[a]].raw.replace(/[^ء-ي]/g, ''), q = (braw[b] || '').replace(/[^ء-ي]/g, ''); if (r !== q && r.replace(/ة/g, 'ه').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي') === q.replace(/ة/g, 'ه').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي')) tahMis.push(r + '/' + q); }
   if (bb[b]) { const k = aOwner[a]; if (aOwner[a - 1] !== k) toks[k].b = Math.max(toks[k].b, bb[b]); } };
for (const [, as, ae, bs, be] of hunks.concat([[null, zakStart, zakStart, bw.length, bw.length]])) {
  while (ia < as && ib < bs) { mark(ia, ib); ia++; ib++; }
  // a boundary right after words only we have belongs before those words
  if (ae > as && bb[be] && ia === as) { const k = aOwner[as]; if (aOwner[as - 1] !== k) toks[k].b = Math.max(toks[k].b, bb[be]); bb[be] = 0; }
  ia = ae; ib = be;
}
// own punctuation, and (for الزكاة والحج, which has no B) the source paragraphs
toks.forEach((t, k) => {
  const p = toks[k - 1];
  if (p && p.ci === t.ci) { if (/[.؟!]$/.test(p.raw)) t.b = 2; else if (/[:؛]$/.test(p.raw)) t.b = Math.max(t.b, 1); else if (/،$/.test(p.raw)) t.b = Math.max(t.b, 1); }
  if (t.zak && t.item) t.b = 2;
});

// ---- paragraphs ----
const out = chapters.map((c, ci) => {
  const ts = toks.filter(t => t.ci === ci), paras = []; let cur = [];
  const words = a => a.reduce((s, t) => s + Math.max(1, t.n.length), 0);
  for (let k = 0; k < ts.length; k++) {
    const t = ts[k], n = words(cur);
    if (cur.length && ((t.b === 2 && n >= 8) || (t.b === 1 && n >= 22) || (n >= 40 && t.b) || (n >= 55 && /^(و|ف|جزاك|أشهد)/.test(t.raw) && !/^(في|من|على|إلى|عن|أو|ما|لا|إن|بين|يا)$/.test(cur[cur.length - 1].raw)) || (n >= 25 && START.test(t.raw) && !/^(في|من|على|إلى|عن|أو|ما|لا|إن)$/.test(cur[cur.length - 1].raw)))) { paras.push(cur); cur = []; }
    cur.push(t);
  }
  if (cur.length) { if (paras.length && words(cur) < 5) paras[paras.length - 1].push(...cur); else paras.push(cur); }
  return { title: c.title, group: c.group, paras: paras.map(p => { let s = p.map(t => t.raw).join(' ').trim().replace(/[،:؛]$/, m => m === '،' ? '.' : m); if (!/[.:؟!﴾]$/.test(s)) s += '.'; return s; }) };
});
const json = {
  source: 'https://shamela.ws/book/412 (مراقي الفلاح شرح متن نور الإيضاح، اعتنى به نعيم زرزور، المكتبة العصرية ١٤٢٥هـ: المتن المطبوع أعلى الصفحات؛ والزكاة والحج من نص الشرح نفسه) — نص غير مشكول',
  check: 'https://shamela.ws/book/12117 (نور الإيضاح، ت. محمد أنيس مهرات، المكتبة العصرية) + ألفاظ المتن المقتبسة داخل شرح مراقي الفلاح (shamela 412) + حاشية الطحطاوي (ketabonline 1088) للزكاة والحج؛ كل الفروق في nuridah-sources.md',
  chapters: out,
};
fs.writeFileSync(path.join(__dirname, 'nuridah.json'), JSON.stringify(json, null, 1) + '\n');
const nP = out.reduce((s, c) => s + c.paras.length, 0), lens = out.flatMap(c => c.paras.map(p => p.split(' ').length));
console.log('chapters', out.length, 'paras', nP, 'words', lens.reduce((a, b) => a + b, 0), 'min', Math.min(...lens), 'max', Math.max(...lens),
  '<8:', lens.filter(l => l < 8).length, '>40:', lens.filter(l => l > 40).length, 'fixes', used.size + '/' + FIX.length);
fs.writeFileSync(path.join(__dirname, 'raw/nuridah/spelling.txt'), tahMis.join('\n') + '\n'); console.log('spelling-only differences with B (ة/ه، همزة، ى/ي):', tahMis.length);
const g = {}; out.forEach(c => g[c.group] = (g[c.group] || 0) + 1); console.log(g);
