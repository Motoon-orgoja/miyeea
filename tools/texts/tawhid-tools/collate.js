// Word-by-word collation of the built text with a second witness (letters only, no harakat; alif/ya/ta-marbuta unified).
// usage: node collate.js <11318|ws>   → ../raw/tawhid/collate-<witness>.txt
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const R = p => path.join(__dirname, '..', p);
const wit = process.argv[2];
const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^ء-ي]/g, '');
// ours: one entry per word with its bab
const ours = [];
let bab = 0;
for (const l of fs.readFileSync(R('raw/tawhid/tawhid-plain.txt'), 'utf8').split('\n')) {
  let t = l;
  if (/^## /.test(l)) { bab = +l.split(' ')[1]; t = l.replace(/^## \d+ /, '') }
  for (const w of t.split(/\s+/)) { const n = norm(w); if (n) ours.push({ n, w, bab }) }
}
let theirs = [];
if (wit === '11318') {
  let t = fs.readFileSync(R('raw/tawhid/s11318.txt'), 'utf8').split('\n').filter(l => !/^@@/.test(l)).join('\n');
  t = t.slice(t.indexOf('[كتاب التوحيد]'));
  t = t.replace(/^\[[^\]]*\]$/gm, '').replace(/^\.\.\.$/gm, '').replace(/باب \([٠-٩]+\)/g, 'باب').replace(/[٠-٩]+/g, ' ');
  theirs = t.split(/\s+/).map(w => ({ n: norm(w), w })).filter(x => x.n);
} else {
  let t = fs.readFileSync(R('raw/tawhid/wikisource.txt'), 'utf8');
  t = t.slice(t.indexOf('{{عنوان|كتاب التوحيد'));
  t = t.replace(/\{\{صل\}\}/g, 'صلى الله عليه وسلم').replace(/\{\{[^}]*\}\}/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
    .replace(/[=]+[^=\n]*[=]+/g, m => m.replace(/=/g, ' ')).replace(/[0-9٠-٩]+/g, ' ');
  theirs = t.split(/\s+/).map(w => ({ n: norm(w), w })).filter(x => x.n);
}
const tmp = R('raw/tawhid');
fs.writeFileSync(path.join(tmp, 'A.tmp'), ours.map(x => x.n).join('\n') + '\n');
fs.writeFileSync(path.join(tmp, 'B.tmp'), theirs.map(x => x.n).join('\n') + '\n');
let d = '';
try { d = execFileSync('diff', [path.join(tmp, 'A.tmp'), path.join(tmp, 'B.tmp')], { encoding: 'utf8', maxBuffer: 1 << 28 }) } catch (e) { d = e.stdout }
fs.unlinkSync(path.join(tmp, 'A.tmp')); fs.unlinkSync(path.join(tmp, 'B.tmp'));
const out = []; let hunks = 0;
for (const h of d.split('\n').filter(l => /^\d/.test(l))) {
  const m = h.match(/^(\d+)(?:,(\d+))?([acd])(\d+)(?:,(\d+))?$/);
  const a1 = +m[1], a2 = +(m[2] || m[1]), b1 = +m[4], b2 = +(m[5] || m[4]);
  const A = m[3] === 'a' ? [] : ours.slice(a1 - 1, a2), B = m[3] === 'd' ? [] : theirs.slice(b1 - 1, b2);
  const at = m[3] === 'a' ? a1 : a1 - 1, ctx = ours.slice(Math.max(0, at - 4), at).map(x => x.w).join(' ');
  hunks++;
  out.push(`[${(ours[Math.min(at, ours.length - 1)] || {}).bab}] …${ctx} ‖ ours: ${A.map(x => x.w).join(' ') || '∅'} ‖ ${wit}: ${B.map(x => x.w).join(' ') || '∅'}`);
}
fs.writeFileSync(R('raw/tawhid/collate-' + wit + '.txt'), out.join('\n') + '\n');
console.log(wit, 'ours words', ours.length, 'theirs', theirs.length, 'hunks', hunks);
// machine-readable hunks for the 3-way comparison
fs.writeFileSync(R('raw/tawhid/hunks-' + wit + '.json'), JSON.stringify(d.split('\n').filter(l => /^\d/.test(l)).map(h => {
  const m = h.match(/^(\d+)(?:,(\d+))?([acd])(\d+)(?:,(\d+))?$/);
  const a1 = +m[1], a2 = +(m[2] || m[1]), b1 = +m[4], b2 = +(m[5] || m[4]);
  const s = m[3] === 'a' ? a1 : a1 - 1, e = m[3] === 'a' ? a1 : a2; // ours[s..e) replaced
  return { s, e, rep: m[3] === 'd' ? [] : theirs.slice(b1 - 1, b2).map(x => x.n), raw: m[3] === 'd' ? '' : theirs.slice(b1 - 1, b2).map(x => x.w).join(' ') };
})));
