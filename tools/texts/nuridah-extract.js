// Stage 1 for «نور الإيضاح»: extracts three witnesses from the raw Shamela/ketabonline pages and collates them word by word.
//   A = the matn printed at the top of each page of «مراقي الفلاح» (Shamela 412, ed. نعيم زرزور) — pages 1–323;
//       for الزكاة والحج (pages 324–343, which the matn does not contain) the whole text of the commentary.
//   B = Shamela 12117 «نور الإيضاح» ed. محمد أنيس مهرات (المكتبة العصرية) — ends with الاعتكاف.
//   C = the matn words quoted «"…"» inside the commentary of 412 (pages 1–323).
//   T = حاشية الطحطاوي (ketabonline 1088) top text, pages 773–818 — the Maraqi text of الزكاة والحج, a check for A there.
// Writes raw/nuridah/A.json (items) and raw/nuridah/collation.txt (every A/B and A/T difference, plus A/C where B differs).
// usage: node tools/texts/nuridah-extract.js
const fs = require('fs'), path = require('path');
const R = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'raw/nuridah', f), 'utf8'));
const strip = h => h.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const paras = html => html.split(/<p(?=[ >])/).slice(1).map(b => {
  const cls = (b.match(/^[^>]*class="([^"]*)"/) || [])[1] || '';
  const inner = b.replace(/^[^>]*>/, '').split('</p>')[0];
  return { cls, inner, text: strip(inner) };
}).filter(p => p.text);
const isSep = t => /^ـ+$/.test(t);
const isDots = t => /^[.…\s]+$/.test(t);
const HEAD = /^\[?"?(كتاب|باب|فصل)/;

// ---------- A ----------
const k412 = R('412.json'), A = [];
for (const pg of k412) {
  let ps = paras(pg.html).filter(p => p.cls !== 'hamesh');
  const sep = ps.findIndex(p => isSep(p.text));
  if (pg.id <= 323) { if (sep < 0) throw new Error('no separator on 412/' + pg.id); ps = ps.slice(0, sep); }
  else if (sep >= 0) ps = ps.slice(sep + 1);
  // Shamela's own TOC lines at the head of a page end with a «...» line
  const dots = ps.findIndex(p => p.text === '...');
  if (dots >= 0 && dots < 6) ps = ps.slice(dots + 1);
  for (const p of ps) {
    let t = p.text;
    if (isDots(t) || /^بسم الله الرحمن الرحيم$/.test(t)) continue;
    if (/^"\*"/.test(t)) continue; // editor's note printed in the text area
    const head = t.length < 110 && HEAD.test(t) && !/[.:]\s*\S{3,}.*\S{3,}\s+\S{3,}\s+\S{3,}/.test(t.replace(/^[^:]*:\s*(في|من)?/, ''));
    A.push({ page: pg.id, type: head ? 'h' : 't', text: t, html: p.inner });
  }
}
fs.writeFileSync(path.join(__dirname, 'raw/nuridah/A.json'), JSON.stringify(A, null, 1));

// ---------- B ----------
const k12117 = R('12117.json');
let B = k12117.map(pg => paras(pg.html).filter(p => p.cls !== 'hamesh').map(p => p.text).join('\n')).join('\n');

// ---------- C ----------
let C = k412.filter(pg => pg.id <= 323).map(pg => {
  const ps = paras(pg.html).filter(p => p.cls !== 'hamesh'), sep = ps.findIndex(p => isSep(p.text));
  return ps.slice(sep + 1).map(p => (p.inner.match(/<span class="c1">[\s\S]*?<\/span>/g) || []).map(strip).join(' ')).join(' ');
}).join(' ');

// ---------- T ----------
const ko = R('ko1088.json');
let T = ko.map(pg => {
  const h = pg.content.split(/<p class="g-paragraph[^"]*"[^>]*>\s*ـ{5,}/)[0];
  return strip(h.replace(/<div class="g-title[^>]*>[\s\S]*?<\/div>/g, ' '));
}).join(' ');

// ---------- normalise + diff ----------
const norm = s => s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/يء/g, 'ئ')
  .replace(/\[[^\]]*\]/g, m => /^\[(كتاب|باب|فصل)/.test(m) ? ' ' : m) // keep B's inserted words visible, drop its headings later
  .replace(/[^ء-ي\s]/g, ' ').split(/\s+/).filter(Boolean);
const words = (s) => norm(s);
function diff(a, b) { // Myers O(ND), returns list of [op, aStart, aEnd, bStart, bEnd]
  const n = a.length, m = b.length, max = n + m, off = max, trace = [];
  let v = new Int32Array(2 * max + 2); v[off + 1] = 0;
  for (let d = 0; d <= max; d++) {
    trace.push(v.slice(off - d - 1, off + d + 2));
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && v[off + k - 1] < v[off + k + 1])) ? v[off + k + 1] : v[off + k - 1] + 1, y = x - k;
      while (x < n && y < m && a[x] === b[y]) { x++; y++; }
      v[off + k] = x;
      if (x >= n && y >= m) return backtrack(trace, d, n, m, a, b);
    }
  }
}
function backtrack(trace, D, n, m) {
  const edits = []; let x = n, y = m;
  for (let d = D; d > 0; d--) {
    const v = trace[d], o = d + 1, g = (k) => v[o + k];
    const k = x - y, pk = (k === -d || (k !== d && g(k - 1) < g(k + 1))) ? k + 1 : k - 1;
    const px = g(pk), py = px - pk;
    while (x > px && y > py) { x--; y--; }
    if (x === px) edits.push(['ins', x, x, py, y]); else edits.push(['del', px, x, y, y]);
    x = px; y = py;
  }
  // merge adjacent edits into hunks
  edits.reverse(); const h = [];
  for (const e of edits) { const l = h[h.length - 1]; if (l && e[1] === l[2] && e[3] === l[4]) { l[2] = Math.max(l[2], e[2]); l[4] = Math.max(l[4], e[4]); } else h.push(e.slice()); }
  return h;
}
module.exports = { norm, diff };
if (require.main === module) {
  const aText = A.filter(x => x.type === 't');
  const aw = [], ai = [];
  aText.forEach(x => norm(x.text.replace(/\*/g, ' ')).forEach(w => { aw.push(w); ai.push(x.page); }));
  const zak = ai.findIndex(p => p >= 324);
  // B: drop all of the editor's [..] (headings and inserted words), his heading lines and list numbering («١ -», «٥ و ٦ -», «أ -»)
  const bClean = B.split('\n').filter(l => !/^\s*\[[^\n]*\]\s*[؟:]?\s*$/.test(l) && !/^\s*\[?(كتاب|باب|فصل)\b[^.،]{0,80}$/.test(l)).join('\n')
    .replace(/[٠-٩0-9]+\s*و\s*[٠-٩0-9]+\s*-/g, ' ').replace(/[٠-٩0-9]+\s*-/g, ' ').replace(/(^|[\s.])[أابجدهوزحطيك]\s*-\s/g, '$1 ');
  let bb = bClean; for (let k = 0; k < 3; k++) bb = bb.replace(/\[[^\[\]]*\]/g, ' ');
  const bw = norm(bb), cw = norm(C), tw = norm(T);
  const cs = ' ' + cw.join(' ') + ' ';
  const found = (hay, arr) => hay.includes(' ' + arr.join(' ') + ' ');
  const out = [], stats = {};
  const rep = (name, a0, other, hunks, judge) => {
    out.push(`\n##### A vs ${name}: ${hunks.length} hunks   (vote: A = A confirmed by the third text, ${name} = ${name} confirmed, ? = undecided)`);
    for (const [, as, ae, bs, be] of hunks) {
      const L = aw.slice(a0 + Math.max(0, as - 2), a0 + as), Rt = aw.slice(a0 + ae, a0 + ae + 2);
      const va = [...L, ...aw.slice(a0 + as, a0 + ae), ...Rt], vb = [...L, ...other.slice(bs, be), ...Rt];
      let v = '';
      if (judge) { const fa = found(judge, va), fb = found(judge, vb); v = fa && !fb ? 'A' : fb && !fa ? name : '?'; }
      stats[name + v] = (stats[name + v] || 0) + 1;
      out.push(`${v}\tp${ai[a0 + as] || ai[a0 + as - 1]}\tA: ${aw.slice(a0 + as, a0 + ae).join(' ') || '∅'}\t${name}: ${other.slice(bs, be).join(' ') || '∅'}\t| ${aw.slice(a0 + Math.max(0, as - 4), a0 + as).join(' ')} … ${aw.slice(a0 + ae, a0 + ae + 3).join(' ')}`);
    }
  };
  rep('B', 0, bw, diff(aw.slice(0, zak), bw), cs);
  rep('T', zak, tw, diff(aw.slice(zak), tw), null);
  fs.writeFileSync(path.join(__dirname, 'raw/nuridah/collation.txt'), out.join('\n') + '\n');
  console.log('A items', A.length, 'headings', A.filter(x => x.type === 'h').length, 'A words', aw.length, '(matn', zak, ') B words', bw.length, 'C words', cw.length, 'T words', tw.length);
  console.log(stats);
}
