// Rakaiz edition (shamela 19, pages 44–189) -> out/rakaiz-rows.json: [{kind:'bab'|'fasl'|'text', text, page}]
// Cleaning: bullets «• - …», enumerations «١ -» «[١]» «[أ]» «(أ)» «٢.» «٣)», footnote markers, dot runs «.......»,
// Qur'an braces {…} -> ﴿…﴾, quoted words «(صحيحًا)» -> «صحيحًا», tatweel prefixes «كَـ» joined, spaces before punctuation.
const fs = require('fs'), path = require('path'), { pages } = require('../akhsar-build/shamela-pages.js');
const P = pages(path.join(__dirname, '../raw/qawaidusul/shamela19'), 44, 189), rows = [], log = [];
for (const p of P) for (const { text } of p.paras) {
  let t = text;
  if (t.replace(/[^ء-ي ]/g, '').trim() === 'بسم الله الرحمن الرحيم') continue;
  t = t.replace(/^(?:(?:[•…\-]|[٠-٩]+\s*[-.)]|\[[٠-٩أبجد]+\]|\([أبجد]\))\s*)+/, '')
    .replace(/\.{3,}/g, '').replace(/\[([^\]]+)\]/g, '$1').replace(/\{\s*/g, '﴿').replace(/\s*\}/g, '﴾')
    .replace(/\(([^()]{1,30})\)/g, '«$1»')
    .replace(/\s+([.،:؛؟!»﴾)])/g, '$1').replace(/([«﴿(])\s+/g, '$1').replace(/\s+/g, ' ').trim();
  if (!t) continue;
  const kind = /^الْبَابُ /.test(t) ? 'bab' : /^فَصْلٌ$/.test(t) ? 'fasl' : 'text';
  rows.push({ kind, text: t, page: +p.page });
}
const out = [];
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  if (r.kind === 'bab' && r.text.split(' ').length === 2 && rows[i + 1]) { r.text += ' ' + rows[i + 1].text; i++; }   // «الباب الأول» + «في الحكم ولوازمه»
  // tatweel prefixes: «كَـ ﴿…» «كَـ: «…» «بِـ: «…» «كـ: «…» -> joined to what follows
  r.text = r.text.replace(/([ء-ي][ً-ْ]*)ـ:?\s*([«﴿]?)/g, (m, a, q) => (log.push('joined «' + m.trim() + '» ص' + r.page), a + q));
  // editor's letter enumerations left inside a line («كَ [أ] الْعَيْنِ. [ب] وَالْقَرْءِ.»), then a lone prefix joins the next word; «وَ «x»» -> «وَ«x»»
  r.text = r.text.replace(/(^| )[أبتثجحخد](?= |$)/g, (m) => (log.push('dropped enumeration letter «' + m.trim() + '» ص' + r.page), '')).replace(/\s+/g, ' ').trim()
    .replace(/(^| )([كبل][َِ]) (?=[ء-ي«﴿])/g, '$1$2').replace(/(^| )وَ ([«﴿])/g, '$1وَ$2');
  out.push(r);
}
const bad = out.filter(r => /[ـ\[\]0-9٠-٩{}•…]/.test(r.text));
fs.writeFileSync(path.join(__dirname, 'out/rakaiz-rows.json'), JSON.stringify(out, null, 0).replace(/},{/g, '},\n{'));
fs.writeFileSync(path.join(__dirname, 'out/extract-log.txt'), log.join('\n') + '\n');
console.log('rows', out.length, 'bab', out.filter(r => r.kind == 'bab').map(r => r.text), 'fasl', out.filter(r => r.kind == 'fasl').length, 'log', log.length);
bad.forEach(r => console.log('CHECK', r.page, r.text));
