// Builds ../akhsar.json from the Rakaiz rows (extract-rakaiz.js -> fixes.js).  usage: node build.js
// Chapters: كتاب = group; each باب is a chapter; a كتاب's text before its first باب is a chapter titled with the كتاب.
// «فَصْلٌ» starts a paragraph. Mechanical completions (logged): sukun on the article's lam before a moon letter, shadda on the lam of «الله».
const fs = require('fs'), path = require('path');
const { paras } = require('../umdafiqh-build/paras.js');
const rows = require('./rows.js')();
const SUN = 'تثدذرزسشصضطظلن', stat = { qamari: 0, allah: 0 };
function complete(t) {
  return t.split(' ').map(w => {
    let x = w;
    // Allah: «اللهِ», «وَاللهُ», «بِاللهِ», «لِلهِ», «فَلِلَّهِ» stays
    x = x.replace(/^([«(]?(?:[وف]َ)?(?:[بك][َِ]|تَ)?ال)له(?=[َُِ]|$|[^ء-ي])/, '$1لَّه').replace(/^([«(]?(?:[وفك][َِ]?)?لِ)له(?=[َُِ])/, '$1لَّه');
    // article lam with no mark before a moon letter (incl. after وَ فَ بِ كَ لِ, and لِلْ)
    x = x.replace(/^([«(]?(?:[وف]َ)?(?:[بك][َِ])?)ال(?=([ء-ي]))/, (m, p, c) => SUN.includes(c) || c === 'ل' ? m : (stat.qamari++, p + (c === 'ا' ? 'الِ' : 'الْ')))
         .replace(/^([«(]?(?:[وف]َ)?لِ)ل(?=([ء-ي]))/, (m, p, c) => SUN.includes(c) || c === 'ل' ? m : (stat.qamari++, p + (c === 'ا' ? 'لِ' : 'لْ')));
    if (x.includes('لَّه') && !w.includes('لَّه')) stat.allah++;
    return x.replace(/ّ([ًٌٍَُِ])/g, '$1ّ');   // this base writes the vowel before the shadda
  }).join(' ');
}
for (const r of rows) r.text = complete(r.text);
const chapters = []; let ch = { title: 'مُقَدِّمَةُ الْمُصَنِّفِ', group: 'مُقَدِّمَةُ الْمُصَنِّفِ', rows: [] }, group = null;
const close = () => { if (ch && ch.rows.length) chapters.push(ch); };
for (const r of rows) {
  const t = r.text.replace(/[.:،]$/, '');
  if (r.kind === 'kitab') { close(); group = t; ch = { title: t, group, rows: [] }; continue; }
  if (r.kind === 'bab') { close(); ch = { title: t, group, rows: [] }; continue; }
  if (r.kind === 'fasl') { ch.rows.push({ fasl: true, text: t + ':' }); continue; }
  ch.rows.push({ text: r.text });
}
close();
const J = {
  source: 'أخصر المختصرات: اللفظ المتداول لطبعة محمد ناصر العجمي (دار البشائر ١٤١٦هـ) = https://shamela.ws/book/6084، والشكل من طبعة ركائز المشكولة (ت. العيدان واليتامى ١٤٣٨هـ) = https://shamela.ws/book/147656',
  check: 'قوبلت الطبعتان كلمةً كلمةً بسكربت؛ أُخذ لفظ العجمي في ١٣٠ موضعًا وشُكلت كلماته الجديدة (١٠٨ كلمات) — انظر akhsar-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  chapters: chapters.map(c => ({ title: c.title, group: c.group, paras: paras(c.rows) })),
};
fs.writeFileSync(path.join(__dirname, '../akhsar.json'), JSON.stringify(J, null, 1) + '\n');
const P = J.chapters.flatMap(c => c.paras), L = P.map(p => p.split(' ').length), W = P.join(' ').split(' ').filter(w => /[ء-ي]/.test(w));
console.log(JSON.stringify({ chapters: J.chapters.length, groups: new Set(J.chapters.map(c => c.group)).size, babs: J.chapters.filter(c => /^بَابُ/.test(c.title)).length,
  fusul: P.filter(p => /^فَصْلٌ/.test(p)).length, paras: P.length, words: W.length, minLen: Math.min(...L), maxLen: Math.max(...L),
  short: L.filter(n => n < 8).length, long: L.filter(n => n > 40).length, ...stat }));
