// Vocalizes the 6382 headings by finding the same words, in the longest possible runs, in Lawami' (Shamela 8353).
// → headings.json  [{before, ed, voc, runs}]
const fs = require('fs'), path = require('path'), N = require('./norm');
const RAW = path.join(__dirname, '..', 'raw', 'safariniyya');
const toks = [];
const pages = fs.readdirSync(RAW).filter(f => /^8353_\d+\.html$/.test(f)).map(f => +f.match(/\d+/g)[1]).sort((a, b) => a - b);
for (const p of pages) {
  const d = fs.readFileSync(path.join(RAW, '8353_' + p + '.html'), 'utf8'); const i = d.indexOf('class="nass'); if (i < 0) continue;
  const t = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0].replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
  for (const w of t.split(/\s+/)) { const o = w.replace(/[^\u0621-\u0652\u0670]/g, ''); const n = N(o); if (n) toks.push({ o, n, p }); }
}
const voc = o => (o.match(/[\u064B-\u0652]/g) || []).length;
const sk = require('./skeleton.json'); let vn = 0; const out = [];
for (const x of sk) {
  if (x.v) { vn++; continue; }
  const W = N(x.h || x.other).split(' ');
  const res = []; let k = 0; const runs = [];
  while (k < W.length) {
    let best = null;
    for (let len = W.length - k; len >= 1 && !best; len--) {
      const cands = [];
      for (let i = 0; i + len <= toks.length; i++) {
        let ok = true; for (let j = 0; j < len; j++) if (toks[i + j].n !== W[k + j]) { ok = false; break; }
        if (ok) cands.push(i);
      }
      if (cands.length) { // prefer the most vocalized occurrence
        cands.sort((a, b) => toks.slice(b, b + len).reduce((s, t) => s + voc(t.o), 0) - toks.slice(a, a + len).reduce((s, t) => s + voc(t.o), 0));
        best = { i: cands[0], len };
      }
    }
    if (!best) { res.push(W[k]); runs.push('?' + W[k]); k++; continue; }
    res.push(...toks.slice(best.i, best.i + best.len).map(t => t.o)); runs.push(best.len + '@p' + toks[best.i].p); k += best.len;
  }
  out.push({ before: vn + 1, ed: x.h || x.other, voc: res.join(' '), runs: runs.join(' ') });
}
fs.writeFileSync(path.join(__dirname, 'headings.json'), JSON.stringify(out, null, 1));
out.forEach(h => console.log(h.before, h.voc, ' [' + h.runs + ']'));
