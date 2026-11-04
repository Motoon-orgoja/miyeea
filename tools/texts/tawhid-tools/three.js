// hunks where both witnesses (11318 and Wikisource) read the same against the built text
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const A = JSON.parse(fs.readFileSync(R('raw/tawhid/hunks-11318.json'))), B = JSON.parse(fs.readFileSync(R('raw/tawhid/hunks-ws.json')));
const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^ء-ي]/g, '');
const ours = []; let bab = 0;
for (const l of fs.readFileSync(R('raw/tawhid/tawhid-plain.txt'), 'utf8').split('\n')) { let t = l; if (/^## /.test(l)) { bab = +l.split(' ')[1]; t = l.replace(/^## \d+ /, '') } for (const w of t.split(/\s+/)) { if (norm(w)) ours.push({ w, bab }) } }
const key = h => h.s + ':' + h.e + ':' + h.rep.join(' ');
const bk = new Map(B.map(h => [key(h), h]));
const out = [];
for (const h of A) { if (bk.has(key(h))) out.push(`[${ours[Math.min(h.s, ours.length - 1)].bab}] @${h.s} …${ours.slice(Math.max(0, h.s - 4), h.s).map(x => x.w).join(' ')} ‖ ours: ${ours.slice(h.s, h.e).map(x => x.w).join(' ') || '∅'} ‖ both: ${h.raw || '∅'} ‖ next: ${ours.slice(h.e, h.e + 2).map(x => x.w).join(' ')}`) }
// overlapping but not identical: listed for review
const ov = [];
for (const h of A) { if (bk.has(key(h))) continue; const g = B.find(x => x.s < Math.max(h.e, h.s + 1) && Math.max(x.e, x.s + 1) > h.s); if (g) ov.push(`[${ours[Math.min(h.s, ours.length - 1)].bab}] @${h.s} …${ours.slice(Math.max(0, h.s - 3), h.s).map(x => x.w).join(' ')} ‖ ours: ${ours.slice(h.s, h.e).map(x => x.w).join(' ') || '∅'} ‖ 11318: ${h.raw || '∅'} ‖ ws(@${g.s}-${g.e}): ${ours.slice(g.s, g.e).map(x => x.w).join(' ') || '∅'} → ${g.raw || '∅'}`) }
fs.writeFileSync(R('raw/tawhid/collate-both.txt'), out.join('\n') + '\n\n#### overlapping, not identical\n' + ov.join('\n') + '\n');
console.log('both-agree hunks', out.length, 'overlapping', ov.length);
