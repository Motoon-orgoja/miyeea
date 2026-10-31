// Checks tools/texts/usul/key/<id>.json against source/<id>.md: every piece of every unit must be an exact substring of
// one of its paragraphs (bold marks removed), and the lead term must occur in the chapter. Prints problems and counts.
// usage: node tools/texts/usul/check-key.js [id ...]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, 'source'), K = path.join(__dirname, 'key');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(K).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
const plain = s => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
let units = 0, words = 0; const bad = [];
for (const id of ids.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))) {
  const src = fs.readFileSync(path.join(S, id + '.md'), 'utf8');
  const paras = {}; for (const m of src.matchAll(/^\[(\d+)\] (.*)$/gm)) paras[m[1]] = plain(m[2]);
  let list; try { list = JSON.parse(fs.readFileSync(path.join(K, id + '.json'), 'utf8')) } catch (e) { bad.push(id + ': ' + e.message); continue }
  list.forEach((u, i) => {
    units++; words += (u.h ? u.h.split(/\s+/).length : 0) + u.x.join(' ').split(/\s+/).length;
    if (!u.t || !Array.isArray(u.x) || !u.x.length) bad.push(`${id}#${i + 1}: missing t or x`);
    u.x.forEach(piece => {
      const p = plain(piece).replace(/[:،]$/, '');
      if (!(u.p || []).some(n => paras[n] && paras[n].includes(p)) && !Object.values(paras).some(t => t.includes(p)))
        bad.push(`${id}#${i + 1} «${u.t}»: not verbatim: ${piece.slice(0, 70)}`);
    });
    if (u.h && !plain(src).includes(u.h.replace(/[:،]$/, ''))) bad.push(`${id}#${i + 1}: lead «${u.h}» not in the chapter`);
    const n = u.x.join(' ').split(/\s+/).length; if (n > 70) bad.push(`${id}#${i + 1} «${u.t}»: long (${n} words)`);
  });
}
console.log(`${ids.length} chapters, ${units} units, ${words} words`);
console.log(bad.join('\n') || 'all verbatim');
