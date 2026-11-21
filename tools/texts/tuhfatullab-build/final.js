// final text: decoded commentary verses (draft.json, in order) + corrections.json + headings of the متن edition (scan_*.json)
// usage: node final.js <dir with scan_A..F.json> <out.txt>
const fs = require('fs'), path = require('path');
const W = process.argv[2] || '../work', OUT = process.argv[3];
const D = require('./draft.json'); const C = require('./corrections.json');
let H = []; for (const k of 'ABCDEF') H = H.concat(JSON.parse(fs.readFileSync(path.join(W, 'scan_' + k + '.json'), 'utf8')).headings);
H = H.filter(h => !/^بِسْمِ/.test(h.text));
const cleanH = t => t.replace(/ٱ/g, 'ا').replace(/[()]/g, '').replace(/\s*\/\s*/g, ' ').replace(/\s+/g, ' ').trim();
const MARK = /[ً-ْ]/;
const esc = c => /[.*+?^${}()|[\]\\]/.test(c) ? '\\' + c : c;
// harakat stacked on one letter may come in either order (shadda+kasra / kasra+shadda)
function rx(a) {
  let out = '', i = 0; const ch = [...a];
  while (i < ch.length) {
    out += esc(ch[i]); i++;
    let mk = ''; while (i < ch.length && MARK.test(ch[i])) mk += ch[i++];
    if (mk) out += '[' + mk + ']{' + mk.length + '}';
  }
  return new RegExp(out);
}
const lines = ['## المقدمة'], log = [];
D.forEach((v, i) => {
  const g = i + 1;
  for (const h of H.filter(h => h.before_g === g)) lines.push('## ' + cleanH(h.text));
  let t = v.t;
  for (const [a, b] of (C.fix[g] || [])) { const r = rx(a); if (!r.test(t)) throw new Error('fix not found g' + g + ': ' + a); t = t.replace(r, b); log.push(g); }
  if ((t.match(/ \| /g) || []).length !== 1) throw new Error('hemistich bar g' + g + ': ' + t);
  lines.push(t);
  for (const a of C.add.filter(a => a.after === g)) lines.push(a.t);
});
const n = lines.filter(l => !l.startsWith('## ')).length;
fs.writeFileSync(OUT, lines.join('\n') + '\n');
console.log('verses', n, 'headings', lines.length - n, 'fixed verses', new Set(log).size);
