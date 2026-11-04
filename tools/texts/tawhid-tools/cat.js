// classifies the both-agree hunks: del (witnesses lack the words), hon (honorific/«تعالى» insertion or swap), other
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const A = JSON.parse(fs.readFileSync(R('raw/tawhid/hunks-11318.json'))), B = JSON.parse(fs.readFileSync(R('raw/tawhid/hunks-ws.json')));
const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^ء-ي]/g, '');
const ours = []; let bab = 0;
for (const l of fs.readFileSync(R('raw/tawhid/tawhid-plain.txt'), 'utf8').split('\n')) { let t = l; if (/^## /.test(l)) { bab = +l.split(' ')[1]; t = l.replace(/^## \d+ /, '') } for (const w of t.split(/\s+/)) { if (norm(w)) ours.push({ w, n: norm(w), bab }) } }
const key = h => h.s + ':' + h.e + ':' + h.rep.join(' ');
const bk = new Set(B.map(key));
const HONS = /^(رضي الله عنه|رضي الله عنهما|رضي الله عنهم|رضي الله عنها|صلى الله عليه وسلم|تعالى|عليه الصلاة والسلام|تبارك وتعالى|عز وجل|عليه السلام|رحمه الله)$/;
const out = { del: [], hon: [], other: [] };
A.filter(h => bk.has(key(h))).forEach((h, i) => {
  const old = ours.slice(h.s, h.e), rec = { id: 'h' + h.s, bab: (ours[h.s] || ours[h.s - 1]).bab, s: h.s, e: h.e, ctx: ours.slice(Math.max(0, h.s - 3), h.s).map(x => x.n).join(' '), oldN: old.map(x => x.n).join(' '), old: old.map(x => x.w).join(' '), new: h.raw, newN: h.rep.join(' ') };
  if (!h.rep.length) out.del.push(rec);
  else if (HONS.test(h.rep.join(' ')) || (old.length && HONS.test(old.map(x => x.n).join(' ')))) out.hon.push(rec);
  else out.other.push(rec);
});
fs.writeFileSync(R('raw/tawhid/both-classified.json'), JSON.stringify(out, null, 1));
for (const k in out) { console.log('==', k, out[k].length); for (const r of out[k]) console.log(r.id, '[' + r.bab + ']', r.ctx, '‖', r.old || '∅', '→', r.new || '∅') }
