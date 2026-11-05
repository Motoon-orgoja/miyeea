// M = al-Maktab al-Islami edition 1389 (ketabonline 10785, unvocalized, no punctuation). Writes out/m.txt: one line per paragraph,
// «# كتاب …» for «= … =» and «## …» for «& … &» headings.
const fs = require('fs'), path = require('path');
const J = require('../raw/dalil/ko10785.json'), L = [];
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
for (const p of J) for (const m of (p.content || '').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
  let t = ent(m[1].replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  if (!t) continue;
  // inline headings «& باب … &» and «= … =» may sit inside a paragraph
  for (const part of t.split(/(=\s*[^=&]{2,60}?\s*=|&\s*[^=&]{2,80}?\s*&)/)) {
    const x = part.trim(); if (!x || /^\*[\s*]*$/.test(x)) continue;
    if (/^=.*=$/.test(x)) L.push('# ' + x.replace(/=/g, '').trim());
    else if (/^&.*&$/.test(x)) L.push('## ' + x.replace(/&/g, '').trim());
    else L.push(x.replace(/\*\s*\*\s*\*/g, '').trim());
  }
}
fs.writeFileSync(path.join(__dirname, 'out/m.txt'), L.filter(Boolean).join('\n') + '\n');
console.log('lines', L.length, 'kitab', L.filter(l => /^# /.test(l)).length, 'bab', L.filter(l => /^## /.test(l)).length);
