// Builds tools/texts/wasitiyya.json from raw/wasitiyya/vocalized.json (see wasitiyya-sources.md for the pipeline):
//  extract-wasitiyya.js -> select-wording.js wasitiyya H R,M A -> vocalize.js wasitiyya A,H,R collation/manual-voc.json -> this
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const { alignTo } = require('./align');
const { fill } = require('./quran-fill');
const { finish } = require('./finish');
const D = path.join(RAW, 'wasitiyya');
let T = JSON.parse(fs.readFileSync(path.join(D, 'vocalized.json'), 'utf8'));
// chapter heads: Ashraf's editorial chapters (A stream), mapped onto the text through the alignment of A
const Araw = JSON.parse(fs.readFileSync(path.join(D, 'A.stream.json'), 'utf8'));
const Aw = Araw.filter(x => x.w), heads = []; let wi = 0;
for (const x of Araw) { if (x.head) heads.push({ at: wi, ...x.head }); else wi++; }
const al = alignTo(T, Aw);
const a2t = {}; al.sub.forEach((j, i) => { if (j >= 0 && a2t[j] === undefined) a2t[j] = i; });
for (const h of heads) { let j = h.at; while (a2t[j] === undefined && j < Aw.length) j++; h.t = a2t[j]; }
heads[0].t = 0; // «مقدمة المصنف» starts with the basmala
// the author's own «فَصْلٌ» markers
const fasl = T.map((x, i) => (norm(x.w) === 'فصل' && !x.q ? i : -1)).filter(i => i >= 0);
console.log('heads', heads.map(h => h.t + ':' + h.title.slice(0, 25)).join(' | '));
console.log('fasl at', fasl.join(' '));
T.forEach((x, i) => { x.i = i; });
for (const h of heads) if (T[h.t]) T[h.t].head = { group: h.group, title: h.title };
// Qur'an
const q = fill(T); T = q.tokens;
fs.writeFileSync(path.join(D, 'collation', 'quran-map.tsv'), q.report.join('\n') + '\n');
const res = finish(T, { dropFasl: true });
fs.writeFileSync(path.join(D, 'collation', 'final-fixes.tsv'), res.log.join('\n') + '\n');
const chapters = res.chapters.map(c => ({ title: c.title, ...(c.group ? { group: c.group } : {}), paras: c.paras }));
const J = {
  source: 'https://shamela.ws/book/22934 (متن العقيدة الواسطية في أول «شرح العقيدة الواسطية» للهراس، ضبط نصه علوي السقاف، دار الهجرة ط3 1415هـ، ص23-56 من نسخة الشاملة) + https://ketabonline.com/ar/books/102254 (العقيدة الواسطية، مكتب الرحاب، مقابل ومشكول) + https://shamela.ws/book/22665 (العقيدة الواسطية، ت أشرف عبد المقصود، أضواء السلف ط2 1420هـ، مشكول)',
  check: 'word-by-word script collation of al-Saqqaf (H), al-Rahab (R), Ibn Mani\' (M, shamela 18098) and Ashraf (A); harakat voted letter by letter between A, H, R; Qur\'an from the Mushaf (tanzil quran-simple) - see wasitiyya-sources.md',
  chapters
};
fs.writeFileSync(path.join(RAW, '..', 'wasitiyya.json'), JSON.stringify(J, null, 1) + '\n');
const words = chapters.reduce((n, c) => n + c.paras.reduce((m, p) => m + p.split(/\s+/).length, 0), 0);
const pc = chapters.reduce((n, c) => n + c.paras.length, 0);
console.log('chapters', chapters.length, 'paras', pc, 'words', words, 'qur\'an pieces', q.report.filter(l => !/^NOT/.test(l)).length, 'not found', q.report.filter(l => /^NOT/.test(l)).length);
