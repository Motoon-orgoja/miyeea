// Word-by-word collation of the built json against another edition (extracted shamela pages).
// Letters only: harakat, tatweel, punctuation, digits and footnotes are dropped; alif/hamza forms, ى/ي and ة/ه unified.
// usage: node collate.js <key> <extracted.txt> <fromPage> <toPage> [startText] [endText] > report.txt
const fs = require('fs');
const [key, file, a, b, startT, endT] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ٰٟۖ-ۭـ‌‍‏]/g, '').replace(/[أإآٱ]/g, 'ا')
  .replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^ء-ي]/g, '');
const toks = t => t.split(/\s+/).map(norm).filter(Boolean);
const J = JSON.parse(fs.readFileSync(__dirname + '/../' + key + '.json', 'utf8'));
const A = toks(J.chapters.flatMap(c => c.paras).join(' '));
// other edition: page text minus footnote lines, verse references and inline note numbers
let page = 0, other = [];
for (const l of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^=== page (\d+)$/); if (m) { page = +m[1]; continue }
  if (page < +a || page > +b) continue;
  if (/^\s*[(]?[٠-٩0-9]+[)]?\s/.test(l) && /سورة|آية|انظر|في نسخة|رواه|أخرجه|_{3,}/.test(l)) continue; // footnotes
  if (/^_{3,}/.test(l)) continue;
  other.push(l.split(/_{5,}/)[0].replace(/\[[^\]]*:[^\]]*\]/g, ' ').replace(/سورة [^\s]+ آية [٠-٩0-9،, -]+/g, ' ').replace(/\[\[[^\]]*\]\]/g, ' '));
}
let O = other.join(' ');
if (startT) { const i = O.indexOf(startT); if (i < 0) throw new Error('start not found'); O = O.slice(i) }
if (endT) { const i = O.indexOf(endT); if (i < 0) throw new Error('end not found'); O = O.slice(0, i + endT.length) }
const B = toks(O);
// LCS (word level)
const n = A.length, m = B.length, D = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) D[i][j] = A[i] === B[j] ? D[i + 1][j + 1] + 1 : Math.max(D[i + 1][j], D[i][j + 1]);
const hunks = []; let i = 0, j = 0, cur = null;
while (i < n || j < m) {
  if (i < n && j < m && A[i] === B[j]) { if (cur) { hunks.push(cur); cur = null } i++; j++; continue }
  if (!cur) cur = { at: i, a: [], b: [] };
  if (j < m && (i >= n || D[i][j + 1] >= D[i + 1][j])) cur.b.push(B[j++]); else cur.a.push(A[i++]);
}
if (cur) hunks.push(cur);
console.log('base words', n, 'other words', m, 'common', D[0][0], 'hunks', hunks.length);
for (const h of hunks) console.log('@' + h.at + ' [' + A.slice(Math.max(0, h.at - 3), h.at).join(' ') + ']  BASE: ' + (h.a.join(' ') || '—') + '  ||  OTHER: ' + (h.b.join(' ') || '—'));
