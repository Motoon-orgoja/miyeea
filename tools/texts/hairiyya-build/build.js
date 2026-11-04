// Builds ../../texts/hairiyya.txt from the base (shamela 145171, نثر الورود — out/sources.json .aql) with the logged fixes.
const fs = require('fs'), path = require('path');
const S = require('./out/sources.json');
const V = S.aql.map(v => [v[1], v[2]]);
const log = [];
function rep(n, k, from, to, why) {
  const s = V[n - 1][k]; if (!s.includes(from)) throw new Error(`${n}${k ? 'b' : 'a'}: «${from}» not found in «${s}»`);
  V[n - 1][k] = s.replace(from, to); log.push(`${n}${k ? 'b' : 'a'}: ${from} → ${to} (${why})`);
}
// لفظ الجلالة printed bare in the base; case ending as in both vocalized witnesses (البراك 30039، هانئ بن جبير 102826)
for (const [n, k, c] of [[1, 0, 'ِ'], [2, 0, 'ِ'], [2, 1, 'ِ'], [5, 1, 'ِ'], [6, 0, 'ُ'], [23, 0, 'ُ'], [25, 0, 'ِ'], [31, 1, 'ِ']])
  rep(n, k, 'الله ', 'اللَّه' + c + ' ', 'لفظ الجلالة بلا شكل في الأساس؛ الحركة من البراك وابن جبير');
// other bare particles
rep(9, 1, ' في ', ' فِي ', 'بلا شكل في الأساس'); rep(25, 1, ' في ', ' فِي ', 'بلا شكل في الأساس');
rep(14, 0, ' لا ', ' لَا ', 'بلا شكل في الأساس'); rep(17, 0, ' لا ', ' لَا ', 'بلا شكل في الأساس');
rep(19, 1, 'ولا ', 'وَلَا ', 'بلا شكل في الأساس'); rep(22, 0, 'ولا ', 'وَلَا ', 'بلا شكل في الأساس');
rep(22, 1, 'ولا ', 'وَلَا ', 'بلا شكل في الأساس'); rep(28, 0, 'ولا ', 'وَلَا ', 'بلا شكل في الأساس');
// clear error
rep(27, 1, 'لَمَنْ', 'لِمَنْ', 'لام الجر مكسورة؛ ابن جبير «لِمَنْ»');
// punctuation the base adds inside the verse (colons, commas) — removed like in the other poem files
for (let i = 0; i < V.length; i++) for (const k of [0, 1]) V[i][k] = V[i][k].replace(/\s*[:،]\s*/g, ' ').replace(/\s+/g, ' ').trim();
const out = '## المنظومة\n' + V.map(v => v[0] + ' | ' + v[1]).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, '../hairiyya.txt'), out);
fs.writeFileSync(path.join(__dirname, 'out/final.json'), JSON.stringify(V.map((v, i) => [i + 1, v[0], v[1]]), null, 1));
console.log(log.join('\n')); console.log('verses', V.length);
