// Extracts منظومة الآداب as printed in «موارد الظمآن لدروس الزمان» (السلمان), vol. 6 pp. 679–701 (turath.io book 7480, page ids 3783–3805;
// = Shamela 7480). One hemistich per line in the source; consecutive lines are paired. Output adab-build/mawarid-verses.txt («a | b»).
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..', 'raw', 'adab', 'turath7480-mawarid');
let lines = [];
for (let p = 3783; p <= 3805; p++) {
  let t = JSON.parse(fs.readFileSync(path.join(D, 'pg' + p + '.json'), 'utf8')).text;
  t = t.replace(/<[^>]+>/g, '');
  if (p === 3783) t = t.slice(t.indexOf('لابن عبد القوي')).split('\n').slice(1).join('\n');
  for (let l of t.split('\n')) {
    l = l.replace(/^\.\.\s*/, '').trim();
    if (!l) continue;
    if (/^_{3,}|^\(\d+\)/.test(l)) continue;
    lines.push(l);
  }
}
// stop at the end of the poem (first line that is clearly prose: very long)
const end = lines.findIndex(l => l.length > 80);
if (end >= 0) lines = lines.slice(0, end);
const out = [];
for (let i = 0; i + 1 < lines.length; i += 2) out.push(lines[i] + ' | ' + lines[i + 1]);
if (lines.length % 2) console.log('odd line count; last:', lines[lines.length - 1]);
fs.writeFileSync(path.join(__dirname, 'mawarid-verses.txt'), out.join('\n') + '\n');
console.log('hemistich lines', lines.length, 'verses', out.length); console.log(out.slice(-3).join('\n'));
