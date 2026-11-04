// Builds tools/texts/lumaa.json from raw/lumaa/vocalized.json (pipeline in lumaa-sources.md):
//  extract-lumaa.js -> select-wording.js lumaa S "U?,K" W -> chain-voc.js lumaa <corpus> collation/manual-voc.json -> this
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const { alignTo } = require('./align');
const { fill } = require('./quran-fill');
const { finish } = require('./finish');
const { units } = require('./harakat');
const D = path.join(RAW, 'lumaa');
let T = JSON.parse(fs.readFileSync(path.join(D, 'vocalized.json'), 'utf8'));
T.forEach((x, i) => { x.i = i; });
// chapters: the bracketed headings of the base edition (S)
const Sraw = JSON.parse(fs.readFileSync(path.join(D, 'S.stream.json'), 'utf8'));
let wi = 0; const sh = [];
for (const x of Sraw) { if (x.head) sh.push({ at: wi, title: x.head.title }); else wi++; }
const sAt = {}; T.forEach((x, i) => { if (x.src === 'S' && sAt[x.si] === undefined) sAt[x.si] = i; });
for (const h of sh) { let j = h.at; while (sAt[j] === undefined && j < wi) j++; h.t = h.at === 0 ? 0 : sAt[j]; if (T[h.t]) T[h.t].head = { title: h.title, group: null }; }
// paragraph starts: Ibn Uthaymin's numbered paragraphs [١]–[٩٥]
const Uraw = JSON.parse(fs.readFileSync(path.join(D, 'U.stream.json'), 'utf8'));
const Uw = Uraw.filter(x => x.w); const us = []; wi = 0;
for (const x of Uraw) { if (x.head) us.push({ at: wi, n: x.head.n }); else wi++; }
const al = alignTo(T, Uw); const u2t = {}; al.sub.forEach((j, i) => { if (j >= 0 && u2t[j] === undefined) u2t[j] = i; });
const pmap = [];
for (const u of us) { let j = u.at; while (u2t[j] === undefined && j < Uw.length) j++; const t = u2t[j]; pmap.push(u.n + '→' + t); if (t !== undefined && T[t]) T[t].pstart = u.n; }
fs.writeFileSync(path.join(D, 'collation', 'uthaymin-paragraphs.txt'), pmap.join('\n') + '\n');
const q = fill(T); T = q.tokens;
fs.writeFileSync(path.join(D, 'collation', 'quran-map.tsv'), q.report.join('\n') + '\n');
const res = finish(T, {});
fs.writeFileSync(path.join(D, 'collation', 'final-fixes.tsv'), res.log.join('\n') + '\n');
const chapters = res.chapters.map(c => ({ title: c.title, paras: c.paras }));
const J = {
  source: 'https://shamela.ws/book/30855 (لمعة الاعتقاد، وزارة الشؤون الإسلامية بالسعودية ط2 1420هـ) + https://shamela.ws/book/11366 (المتن في «تعليق مختصر على لمعة الاعتقاد» لابن عثيمين، أضواء السلف: فقراته المرقمة 1-95) + https://ketabonline.com/ar/books/38445 (الدار السلفية) ; الشكل منقول من https://ketabonline.com/ar/books/7131 (تيسير الاعتقاد للهيميد: المتن المشكول بين قوسين) ومن الأحاديث المشكولة في نشرات الواسطية، والآيات من المصحف',
  check: 'word-by-word script collation of S, U (Ibn Uthaymin) and K (= ar.wikisource); harakat only where a 3-word run matches a vocalized published text; the rest is left bare - see lumaa-sources.md',
  chapters
};
fs.writeFileSync(path.join(RAW, '..', 'lumaa.json'), JSON.stringify(J, null, 1) + '\n');
// vocalization ratio outside the Qur'an
let tot = 0, voc = 0, full = 0;
for (const c of chapters) for (const p of c.paras) for (const w of p.replace(/﴿[^﴾]*﴾/g, ' ').split(/\s+/)) {
  if (!/[ء-ي]/.test(w)) continue; tot++;
  const L = units(w).filter(x => !x.p); if (L.some(x => x.m)) voc++;
  const need = L.filter((x, j) => !x.m && !'اىآ'.includes(x.c) && !(x.c === 'ل' && j <= 2 && L[j + 1] && /ّ/.test(L[j + 1].m)) && !((x.c === 'و' || x.c === 'ي') && j > 0 && /[ُِ]/.test(L[j - 1].m)));
  if (L.some(x => x.m) && !need.length) full++;
}
const pc = chapters.reduce((n, c) => n + c.paras.length, 0), wc = chapters.reduce((n, c) => n + c.paras.reduce((m, p) => m + p.split(/\s+/).length, 0), 0);
console.log('chapters', chapters.length, 'paras', pc, 'words', wc, 'Uthaymin paragraphs mapped', pmap.filter(x => !/undefined/.test(x)).length, '/', pmap.length);
console.log('outside the Qur\'an:', tot, 'words;', voc, 'with harakat (' + (100 * voc / tot).toFixed(1) + '%),', full, 'fully vocalized (' + (100 * full / tot).toFixed(1) + '%)');
