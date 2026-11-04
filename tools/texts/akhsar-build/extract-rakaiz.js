// Rakaiz edition (shamela 147656, pages 44–336) -> out/rakaiz-rows.json: [{kind:'kitab'|'bab'|'fasl'|'text', text, page}]
// Cleaning: editor's bullets «- », enumerations «[١]» «٨)» «(أ)» «[أ]», Qur'an references «[البقرة: …]», footnote markers,
// the stray «ظظ» of the digital copy, the tatweel prefixes «لِـ:» joined to the next word, spaces before punctuation.
const fs = require('fs'), path = require('path'), { pages } = require('./shamela-pages.js');
const P = pages(path.join(__dirname, '../raw/akhsar/shamela147656'), 44, 336), rows = [], log = [];
for (const p of P) for (const { text } of p.paras) {
  let t = text;
  if (/^بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ$/.test(t)) continue;           // basmala kept separately
  if (/^وَبِهِ تَوْفِيقِي$/.test(t)) { log.push('dropped scribal «وَبِهِ تَوْفِيقِي» (ص' + p.page + ')'); continue; }
  if (/ظظ/.test(t)) log.push('removed «ظظ» ص' + p.page + ': ' + t);
  t = t.replace(/ظظ/g, '').replace(/^-\s*/, '').replace(/^(?:(?:\[[٠-٩]+\]|[٠-٩]+\)|\([أبجد]\)|\[[أبجد]\])\s*)+/, '')
    .replace(/\s*\[[^\]]*:\s*[٠-٩\s\-–]+\]/g, '')                       // [البَقَرَة: ٢٨٦]
    .replace(/\(ت\)\s*/g, '').replace(/^وَ (?=شُرِطَ)/, 'وَ')
    .split(/\s*-\s*/).reduce((s, x, k) => k === 0 ? x : s + (k % 2 ? ' -' : '- ') + x, '')  // parenthetical dashes: «X -a b- Y»
    .replace(/\s+([.،:؛؟!»)])/g, '$1').replace(/([«(])\s+/g, '$1').replace(/\s+/g, ' ').trim();
  if (!t) continue;
  const kind = /^كِتَابُ /.test(t) ? 'kitab' : /^بَابُ? /.test(t) ? 'bab' : /^فَصْلٌ( |$)/.test(t) && t.split(' ').length <= 6 ? 'fasl' : 'text';
  if (kind === 'bab') t = t.replace(/^بَاب /, 'بَابُ ');
  rows.push({ kind, text: t, page: +p.page });
}
// tatweel prefixes «لِـ:» / «كَـ: X» / «بِـ «كافي…»»: join to the next word
const out = [];
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  r.text = r.text.replace(/([ء-ي][ً-ْ]*)ـ:?\s+«?([^\s«»]+)»?/g, (m, a, b) => (log.push('joined «' + m + '» ص' + r.page), a + b));
  r.text = r.text.replace(/«(أَخْصَرَ المُخْتَصَرَاتِ|كَافِي المُبْتَدِي)»/g, '$1').replace(/بِكَافِي المُبْتَدِي»/, 'بِكَافِي المُبْتَدِي');
  if (/^وَ:?$/.test(r.text) && rows[i + 1]) { log.push('joined lone «وَ:» + «' + rows[i + 1].text.slice(0, 15) + '» ص' + r.page); rows[i + 1].text = 'وَ' + rows[i + 1].text; continue; }
  r.text = r.text.replace(/وَ «يس»/, 'وَ«يس»');
  if (/ـ:?$/.test(r.text) && rows[i + 1]) { log.push('joined line end «' + r.text.slice(-12) + '» + «' + rows[i + 1].text.slice(0, 15) + '» ص' + r.page); rows[i + 1].text = r.text.replace(/ـ:?$/, '') + rows[i + 1].text; continue; }
  out.push(r);
}
const bad = out.filter(r => /[ـ\[\]0-9٠-٩]/.test(r.text));
fs.writeFileSync(path.join(__dirname, 'out/rakaiz-rows.json'), JSON.stringify(out, null, 0).replace(/},{/g, '},\n{'));
fs.writeFileSync(path.join(__dirname, 'out/extract-log.txt'), log.join('\n') + '\n');
console.log('rows', out.length, 'kitab', out.filter(r => r.kind == 'kitab').length, 'bab', out.filter(r => r.kind == 'bab').length, 'fasl', out.filter(r => r.kind == 'fasl').length, 'log', log.length);
bad.forEach(r => console.log('CHECK', r.page, r.text));
