// Word-by-word collation of bulugh.json (al-Zuhayri ed., Shamela 9111) against a second, unvocalized OpenITI text.
// usage: node collate.js <bulugh.json> <openiti txt> <out tsv>
// Normalization: harakat, tatweel, punctuation removed; أإآٱ→ا, ى→ي, ة→ه, ئ→ي, ؤ→و, ء dropped; honorific formulas skipped.
// The two texts are cut into segments at the chapter headings found in both (in order), and each segment is diffed (Myers).
const fs = require('fs');
const [jf, bf, out] = process.argv.slice(2);
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي]/g, '')
  // spelling-only variants
  .replace(/^ابن$/, 'بن').replace(/^(ب|ل|و)?مايه/, '$1ميه').replace(/^(و)?هاهنا$/, '$1ههنا').replace(/^اذن$/, 'اذا')
  .replace(/^(و)?(ب|ل)?الرحمان$/, '$1$2الرحمن').replace(/^(و|ف)?(ب|ل)?اله$/, '$1$2الاه').replace(/^الاه$/, 'الاه')
  .replace(/^(و|ف)?(ل|ب)?السموات$/, '$1$2السماوات').replace(/^داود$/, 'داود').replace(/^(و)?لاكن/, '$1لكن').replace(/^هاذا$/, 'هذا')
  .replace(/^(و)?(ال)?عاصي$/, '$1$2عاص').replace(/^(و)?جاوا$/, '$1جاءوا');
const HONOR = [['رضي', 'الله', /^عن(ه|ها|هما|هم|هن)$/], ['رضي', 'الله', 'تعالي', /^عن(ه|ها|هما|هم|هن)$/], ['صلي', 'الله', 'عليه', 'وسلم'], ['صلي', 'عليه', 'وسلم'],
  ['عز', 'وجل'], ['تبارك', 'وتعالي'], ['سبحانه', 'وتعالي'], ['تعالي'], [/^عليه(ما|م)?$/, /^السلام$/], ['رحمه', 'الله']];
const toks = (s, tag) => {
  const t = s.replace(/[﴿﴾{}]/g, ' ').replace(/(\S)([«»])/g, '$1 $2').split(/\s+/).map(w => ({ w: norm(w), o: w, tag })).filter(x => x.w), r = [];
  for (let i = 0; i < t.length; i++) {
    const h = HONOR.find(p => p.every((q, j) => t[i + j] && (q instanceof RegExp ? q.test(t[i + j].w) : t[i + j].w === q)));
    if (h) { i += h.length - 1; continue; }
    r.push(t[i]);
  }
  return r;
};
// ---- side A
const J = JSON.parse(fs.readFileSync(jf, 'utf8'));
const A = [], headsA = [];
for (const p of J.intro || []) A.push(...toks(p, 'intro'));
for (const c of J.chapters) {
  headsA.push({ i: A.length, t: toks(c.title.replace(/^أَحَادِيثُ فِي .*/, ''), 'H') });
  if (c.title !== c.group && !headsA.some(h => h.g === c.group)) headsA[headsA.length - 1].g = c.group;
  A.push(...toks(c.title, 'head'));
  if (c.note) A.push(...toks(c.note, 'note'));
  for (const h of c.hadiths) for (const f of ['rawi', 'matn', 'takh', 'after']) if (h[f]) A.push(...toks(h[f], h.n + ':' + f));
}
A.forEach((t, i) => t.i = i);
// ---- side B
// a directory = the sunnah.com pages (books 1–16): the Arabic text of each hadith, footnote marks dropped, one line per hadith «# n - …»
let L;
if (fs.statSync(bf).isDirectory()) {
  L = ['CHECK [مقدمة المؤلف]']; let n = 0;
  for (let b = 1; b <= 16; b++) {
    const d = fs.readFileSync(require('path').join(bf, b + '.html'), 'utf8');
    for (const m of d.matchAll(/<div class="arabicchapter arabic">([^<]*)<\/div>|<span class="arabic_text_details arabic">([\s\S]*?)<\/span><span class="arabic_sanad/g)) {
      if (m[1] !== undefined) { L.push('### || AUTO ' + m[1]); continue; }
      L.push('# ' + (++n) + ' - ' + m[2].replace(/<sup>[\s\S]*?<\/sup>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/[‏‎]/g, '').replace(/[{}]/g, ' '));
    }
  }
  L.push('### |EDITOR|');
} else if (/SubulSalam|Shamela0021590/.test(bf)) {
  // «سبل السلام» (OpenITI Shamela0021590): only the Bulugh text inside <span class="matn">…</span>, plus the bab/kitab headings
  const R = fs.readFileSync(bf, 'utf8').split('\n'); L = ['CHECK [مقدمة المؤلف]']; let inside = false, buf = '';
  for (let l of R) {
    if (!inside && /^### \|+ \[?\(?(باب|كتاب)/.test(l)) { L.push('### || AUTO ' + l.replace(/^### \|+ /, '').replace(/[[\]()]/g, '')); continue; }
    if (l.includes('class="matn"')) { inside = true; l = l.split('class="matn">')[1] || ''; buf = ''; }
    if (!inside) continue;
    const end = l.includes('</span>'); if (end) l = l.split('</span>')[0];
    buf += ' ' + l.replace(/^(~~|#)/, ' ');
    if (end) { inside = false; const m = buf.match(/^\s*\((\d+)\)\s*-\s*/); L.push(m ? '# ' + m[1] + ' - ' + buf.slice(m[0].length) : buf); }
  }
  L.push('### |EDITOR|');
} else L = fs.readFileSync(bf, 'utf8').split('\n');
const fahl = /17757|SubulSalam|Shamela0021590/.test(bf) || fs.statSync(bf).isDirectory();
let s0 = L.findIndex(l => fahl ? /CHECK \[مقدمة المؤلف\]/.test(l) : /<2[23]> كتاب الطهارة|كتاب الطهارة باب المياه/.test(l));
let e0 = fahl ? L.findIndex((l, i) => i > s0 && /^### \|EDITOR\|/.test(l)) : L.length;
const B = []; let hn = 0;
for (let i = s0; i < e0; i++) {
  let l = L[i];
  if (/^#META#/.test(l)) continue;
  l = l.replace(/^### \|+ (AUTO|CHECK) /, ' ').replace(/ms\d+/g, ' ').replace(/PageV\d+P\d+/g, ' ').replace(/\(¬\d+\)/g, ' ').replace(/<\d+>/g, ' ')
    .replace(/§/g, ' ').replace(/~~/g, ' ').replace(/(^|\s)#(?=\s|$)/g, ' ').replace(/\[|\]/g, ' ');
  if (!fahl) { const k = l.indexOf('كتاب الطهارة'); if (i === s0 && k >= 0) l = l.slice(k); }
  // Fahl's numbers «# 12 - »
  l = l.replace(/#?\s*(\d+)\s*-\s/g, (m, n) => { hn = +n; return ' \u0001' + n + ' '; });
  for (const w of l.replace(/(\S)([«»])/g, '$1 $2').split(/\s+/)) {
    if (/^\u0001\d+$/.test(w)) { hn = +w.slice(1); continue; }
    if (/^\d+$/.test(w) || !norm(w)) continue;
    B.push({ w: norm(w), o: w, tag: (fahl ? 'F' : 'Q') + hn });
  }
}
// honorific formulas skipped on the B stream too
const BB = [];
for (let i = 0; i < B.length; i++) {
  const h = HONOR.find(p => p.every((q, j) => B[i + j] && (q instanceof RegExp ? q.test(B[i + j].w) : B[i + j].w === q)));
  if (h) { i += h.length - 1; continue; }
  BB.push(B[i]);
}
// anchors: each chapter heading of A found in B after the previous anchor
const anchors = [[0, 0]];
let pb = 0;
for (const h of headsA) {
  if (h.t.length < 2 || h.i === 0) continue;
  const n = h.t.length;
  for (let j = pb; j < Math.min(BB.length, pb + 15000); j++) {
    let ok = true; for (let q = 0; q < n; q++) if (!BB[j + q] || BB[j + q].w !== h.t[q].w) { ok = false; break; }
    if (ok) { anchors.push([h.i, j]); pb = j + n; break; }
  }
}
anchors.push([A.length, BB.length]);
// ---- Myers diff on a segment
function diff(a, b) {
  const n = a.length, m = b.length, max = n + m, V = new Int32Array(2 * max + 2), trace = [];
  if (!n || !m) return [...a.map(x => ['-', x, null]), ...b.map(y => ['+', null, y])];
  for (let d = 0; d <= max; d++) {
    trace.push(V.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && V[max + k - 1] < V[max + k + 1])) ? V[max + k + 1] : V[max + k - 1] + 1, y = x - k;
      while (x < n && y < m && a[x].w === b[y].w) { x++; y++; }
      V[max + k] = x;
      if (x >= n && y >= m) {
        const ops = []; let X = n, Y = m;
        for (let D = d; D > 0; D--) {
          const v = trace[D], K = X - Y;
          const pk = (K === -D || (K !== D && v[max + K - 1] < v[max + K + 1])) ? K + 1 : K - 1;
          const px = v[max + pk], py = px - pk;
          while (X > px && Y > py) ops.push(['=', a[--X], b[--Y]]);
          if (X === px) ops.push(['+', null, b[--Y]]); else ops.push(['-', a[--X], null]);
        }
        while (X > 0 && Y > 0) ops.push(['=', a[--X], b[--Y]]);
        return ops.reverse();
      }
    }
  }
}
let ops = [];
for (let i = 0; i < anchors.length - 1; i++) ops = ops.concat(diff(A.slice(anchors[i][0], anchors[i + 1][0]), BB.slice(anchors[i][1], anchors[i + 1][1])));
const hunks = []; let cur = null, lastA = null;
for (const [op, a, b] of ops) {
  if (op === '=') { if (cur) { cur.e = a.i; hunks.push(cur); cur = null; } lastA = a; continue; }
  if (!cur) cur = { at: (a || lastA || { tag: '?' }).tag, s: a ? a.i : (lastA ? lastA.i + 1 : 0), z: b ? b.tag : '', A: [], B: [] };
  if (a) cur.A.push(a.o); if (b) cur.B.push(b.o); if (b && !cur.z) cur.z = b.tag;
}
if (cur) { cur.e = A.length; hunks.push(cur); }
fs.writeFileSync(out, 'hadith\tother_no\tstart\tend\tzuhayri\tother_text\n' + hunks.map(h => [h.at, h.z, h.s, h.e, h.A.join(' '), h.B.join(' ')].join('\t')).join('\n') + '\n');
const eq = ops.filter(o => o[0] === '=').length;
console.log('anchors', anchors.length - 2, 'of', headsA.length - 1, '| A words', A.length, 'B words', BB.length, 'equal', eq, (100 * eq / A.length).toFixed(1) + '%', 'hunks', hunks.length);
