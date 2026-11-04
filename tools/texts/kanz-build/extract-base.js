// Base text: كنز الدقائق, ed. سائد بكداش (دار البشائر/دار السراج ١٤٣٢هـ) = shamela.ws/book/14262, pages 2–573.
// Reads raw/kanz/shamela14262/<id>.html, writes out/base-rows.json = [{page, text, head?}]
//   head: 'kitab' | 'bab' | 'fasl' | 'other' for heading lines (editorial [ ] removed, logged).
// usage: node tools/texts/kanz-build/extract-base.js
const fs = require('fs'), path = require('path');
const { pages } = require('../akhsar-build/shamela-pages.js');
const dir = path.join(__dirname, '../raw/kanz/shamela14262'), out = path.join(__dirname, 'out');
fs.mkdirSync(out, { recursive: true });
const rows = [], log = [];
const HEAD = /^\[?(كتاب|بابٌ?|فصلٌ?|مسائل|مقدمة|أربع عشرة مسألة)(\s|:|\]|$)/;
for (const p of pages(dir, 2, 573)) {
  for (let { text } of p.paras) {
    if (/^بسم الله الرّحمن الرّحيم$/.test(text)) { log.push(`ص${p.page}\tdrop basmala`); continue; }
    if (/^(تم بحمد الله مختصر|للإمام أبي البركات|رحمه الله تعالى$)/.test(text)) { log.push(`ص${p.page}\tdrop colophon: ${text}`); continue; }
    if (HEAD.test(text) && text.split(' ').length <= 12 && !/[،.]/.test(text.replace(/[:\]]$/, ''))) {
      const br = /^\[.*\]$/.test(text.replace(/:\]$/, ']'));
      const t = text.replace(/^\[/, '').replace(/:?\]$/, '').trim();
      const head = /^كتاب/.test(t) ? 'kitab' : /^باب/.test(t) ? 'bab' : /^فصل/.test(t) ? 'fasl' : 'other';
      if (br) log.push(`ص${p.page}\tbracketed heading: [${t}]`);
      rows.push({ page: +p.page, text: t, head, br });
      continue;
    }
    // editorial parentheses around book titles «(الوافي)» «(كنز الدّقائق)»
    // and the joining tatweel «بـ: أنت» «كـ إن» -> «بأنت» «كإن»; editor's list numbers «١ - » (كتاب الأشربة)
    const t2 = text.replace(/\(([^()]{1,30})\)/g, '$1').replace(/([بك])ـ:? ([^ ]+)/g, '$1$2').replace(/^[١-٩] - /, '');
    if (t2 !== text) log.push(`ص${p.page}\tparens/tatweel/number: ${text.match(/\([^()]*\)|[بك]ـ:? [^ ]+|^[١-٩] - /g).join(' | ')}`);
    rows.push({ page: +p.page, text: t2 });
  }
}
fs.writeFileSync(path.join(out, 'base-rows.json'), JSON.stringify(rows, null, 0).replace(/\},\{/g, '},\n{'));
fs.writeFileSync(path.join(out, 'extract-log.txt'), log.join('\n') + '\n');
const H = rows.filter(r => r.head);
console.log('rows', rows.length, 'headings', H.length, Object.entries(H.reduce((m, r) => (m[r.head] = (m[r.head] || 0) + 1, m), {})).join(' '),
  'words', rows.filter(r => !r.head).reduce((s, r) => s + r.text.split(' ').length, 0));
