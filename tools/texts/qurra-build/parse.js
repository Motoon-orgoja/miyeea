// Parses the base copies of «قرة الأبصار» into verse lists.
//  D = elmpedia .doc (antiword text, table rows «|A |n |B |») -> D.json
//  K = ketabonline 12554 (الشاملة الذهبية, same edition: ولد فتى 1418) -> K.json
//  O = OpenITI ShamAY0037402 (shamela copy of the same edition, unvocalized) -> O.json
// usage: node parse.js
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'qurra');
const clean = s => s.replace(/\[\d+\]|\(\d+\)/g, '').replace(/\s+/g, ' ').trim();

// D: one table row per verse; rows whose middle cell is a lone number with empty sides are abjad glosses of the editor
function parseD() {
  const out = [];
  for (const l of fs.readFileSync(path.join(RAW, 'elmpedia-1035.txt'), 'utf8').split('\n')) {
    if (!l.startsWith('|')) continue;
    const c = l.split('|').slice(1, -1).map(x => x.trim());
    if (c.length !== 3) { console.error('D bad row', l); continue; }
    const [a, n, b] = c;
    if (!a && !b) continue;                  // gloss row «| 18 |»
    if (!a && /^\d+$/.test(b)) continue;     // gloss in third cell
    if (/^\d+$/.test(a) && (!b || /^\d+$/.test(b))) continue;
    out.push({ n: n || null, a: clean(a), b: clean(b) });
  }
  return out;
}
// K: «A ... n ... B»; a verse split by the converter as «A» newline «abjad . .. n ... B»
function parseK() {
  const j = JSON.parse(fs.readFileSync(path.join(RAW, 'ko12554.json'), 'utf8'));
  const lines = [];
  for (const p of j.pages) lines.push(...p.content.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<\/p>/g, '\n')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').split('\n').map(x => x.trim()).filter(Boolean));
  const out = []; let started = false, pend = null;
  for (const l of lines) {
    if (/^الحمد/.test(l)) started = true;
    if (!started) continue;
    if (/^\(\d+\)/.test(l) || /^[\d٠-٩]+$/.test(l)) continue;     // footnotes, abjad glosses
    let m = l.match(/^(.*?)\s*\.\.\.\s*(\d+)\s*\.\.\.\s*(.*)$/);
    const m2 = l.match(/^\d+\s*\.\s*\.\.\s*(\d+)\s*\.\.\.\s*(.*)$/);
    if (m2 && pend) { out.push({ n: m2[1], a: clean(pend), b: clean(m2[2]) }); pend = null; continue; }
    if (m) { out.push({ n: m[2], a: clean(m[1]), b: clean(m[3]) }); continue; }
    m = l.match(/^(.*?)\s*\.\.\.\s*(.*)$/);
    if (m && !/\*/.test(l)) { out.push({ n: null, a: clean(m[1]), b: clean(m[2]) }); continue; }
    if (/\*|أصلح|صحح|قال في/.test(l)) continue;                 // footnote continuation lines
    if (pend) console.error('K dangling', pend);
    pend = l;
  }
  return out;
}
function parseO() {
  const out = []; let pend = null;
  for (let l of fs.readFileSync(path.join(RAW, 'openiti-37402.txt'), 'utf8').split('\n')) {
    l = l.replace(/^#\s*|^~~/, '').replace(/PageV\d+P\d+/g, '').replace(/ms\d+/g, '').trim();
    if (!l || l.startsWith('#META') || l.startsWith('######')) continue;
    let m = l.match(/^(.*?)\s*\.\.\.\s*(\d+)\s*\.\.\.\s*(.*)$/);
    if (m && /^\d+$/.test(m[1]) && pend) { out.push({ n: m[2], a: clean(pend), b: clean(m[3]) }); pend = null; continue; }
    if (m) { out.push({ n: m[2], a: clean(m[1]), b: clean(m[3]) }); continue; }
    m = l.match(/^(.*?)\s*\.\.\.\s*(.*)$/);
    if (m) { out.push({ n: null, a: clean(m[1]), b: clean(m[2]) }); continue; }
    if (/^\d+$/.test(l)) continue;
    pend = l;
  }
  return out.filter(v => v.a && v.b && !/^قرة الأبصار|^بسم الله|^وصلى الله على سيدنا/.test(v.a));
}
for (const [k, f] of [['D', parseD], ['K', parseK], ['O', parseO]]) {
  const v = f();
  fs.writeFileSync(path.join(__dirname, k + '.json'), JSON.stringify(v, null, 0).replace(/},{/g, '},\n{'));
  console.log(k, v.length, 'verses,', v.filter(x => !x.n).length, 'unnumbered');
}
