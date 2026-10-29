// Builds data/sharh/miyeea.json from the verbatim transcription of
// د. محمد سعيد بكر، «القيم النبوية في الأرجوزة الميئية» (part1–4.txt, made from the PDF page images).
// Format of the parts: "@@SEC title", "@@V n" or "@@V a,b,c", "@@CONT", then "# heading", "• bullet",
// paragraphs separated by blank lines, "حاشية (n): …" footnotes.
// Usage: node tools/sharh/miyeea/build.js <dir with part*.txt>
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, 'parts');
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const parts = fs.readdirSync(dir).filter(f => /^part\d+\.txt$/.test(f)).sort();
const groups = []; let cur = null, lastWasV = false;
for (const f of parts) {
  for (let line of fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r/g, '').split('\n')) {
    // honorific ligatures → words, as the other parts write them
    line = line.trim().replace(/\s*﵁/g, ' رضي الله عنه').replace(/\s*﵇/g, ' عليه السلام');
    if (line.startsWith('@@SEC')) { lastWasV = false; continue }
    // keep appending to the previous group; a page break mid-sentence must not become a paragraph break
    if (line === '@@CONT') { lastWasV = false; if (cur) while (cur.lines.length && !cur.lines[cur.lines.length - 1]) cur.lines.pop(); continue }
    const m = line.match(/^@@V\s+([\d,\s]+)$/);
    if (m) {
      const ns = m[1].split(',').map(x => +x.trim()).filter(Boolean);
      if (lastWasV && cur) cur.vs.push(...ns); else { cur = { vs: ns, lines: [], fns: [] }; groups.push(cur) }
      lastWasV = true; continue;
    }
    if (!cur) { if (line) console.warn('text before first verse in', f, ':', line.slice(0, 60)); continue }
    if (line) lastWasV = false;
    // footnotes go after the whole block, so a block running across pages/parts stays continuous
    if (/^حاشية \(/.test(line)) cur.fns.push(line); else cur.lines.push(line);
  }
}
const v = Array(100).fill(null);
for (const g of groups) {
  // paragraphs: blank-line separated; every heading / bullet / footnote is its own paragraph
  const paras = []; let buf = [];
  const flush = () => { if (buf.length) { paras.push(buf.join(' ')); buf = [] } };
  for (const l of g.lines.concat([''], g.fns)) {
    if (!l) { flush(); continue }
    // each heading / bullet / numbered item / footnote starts its own paragraph (a following line continues it)
    if (/^(# |• |حاشية \(|[٠-٩0-9]+\s*[.-] )/.test(l)) flush();
    buf.push(l); if (l.startsWith('# ')) flush();
  }
  flush();
  if (!paras.length) continue;
  const vs = [...new Set(g.vs)].sort((a, b) => a - b);
  const head = vs.length > 1 ? ['# شرح الأبيات ' + vs.map(ar).join('، ') + ' معًا'] : [];
  const t = head.concat(paras).join('\n\n');
  for (const n of vs) {
    if (n < 1 || n > 100) { console.warn('bad verse', n); continue }
    if (v[n - 1]) console.warn('verse', n, 'appears twice; appending');
    v[n - 1] = { t: v[n - 1] ? v[n - 1].t + '\n\n' + t : t, ref: 'البيت ' + ar(n) };
  }
}
const missing = v.map((x, i) => x ? 0 : i + 1).filter(Boolean);
console.log('verses with sharh:', 100 - missing.length, 'missing:', missing.join(',') || 'none');
fs.writeFileSync(path.join(__dirname, '../../../data/sharh/miyeea.json'), JSON.stringify({
  name: 'القيم النبوية في الأرجوزة الميئية', author: 'د. محمد سعيد بكر', death: '', url: '', v
}));
