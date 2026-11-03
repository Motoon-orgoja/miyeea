// Word-by-word collation of umda.json (al-Qasim ed., Shamela 538) against a second unvocalized text.
// usage: node collate.js <umda.json> <zuhayri openiti txt> <out tsv>
// Normalization: harakat, tatweel, punctuation removed; أإآٱ→ا, ى→ي, ة→ه, ئ→ي, ؤ→و, ء dropped.
const fs = require('fs');
const [jf, zf, out] = process.argv.slice(2);
const norm = w => w.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^\u0621-\u064A]/g, '')
  // spelling-only variants: ابن/بن, مئة/مائة, هاهنا/ههنا, إذن/إذا, العاصي/العاص
  .replace(/^ابن$/, 'بن').replace(/^(ب|ل)?مايه/, '$1ميه').replace(/^(و)?هاهنا$/, '$1ههنا').replace(/^اذن$/, 'اذا').replace(/^العاصي$/, 'العاص');
// honorific formulas are skipped on both sides (they vary freely between copies and are not part of the wording)
const HONOR = [['رضي', 'الله', /^عن(ه|ها|هما|هم|هن)$/], ['صلي', 'الله', 'عليه', 'وسلم'], ['عز', 'وجل'], ['تبارك', 'وتعالي'], ['تعالي'], [/^عليه(ما|م)?$/, /^السلام$/]];
const toks = (s, tag) => {
  const t = s.replace(/[﴿﴾{}]/g, ' ').split(/\s+/).map(w => ({ w: norm(w), o: w, tag })).filter(x => x.w), r = [];
  for (let i = 0; i < t.length; i++) {
    const h = HONOR.find(p => p.every((q, j) => t[i + j] && (q instanceof RegExp ? q.test(t[i + j].w) : t[i + j].w === q)));
    if (h) { i += h.length - 1; continue; }
    r.push(t[i]);
  }
  return r;
};
// ---- side A
const J = JSON.parse(fs.readFileSync(jf, 'utf8'));
const A = [], kitabsA = [];
let g = null;
J.intro.slice(J.intro.findIndex(p => norm(p.split(' ')[0]) === 'الحمد')).forEach(p => A.push(...toks(p, 'intro')));
for (const c of J.chapters) {
  if (c.group !== g) { g = c.group; kitabsA.push(A.length); }
  for (const h of c.hadiths) for (const f of ['rawi', 'matn', 'gharib', 'takh']) if (h[f]) A.push(...toks(h[f], h.n + ':' + f));
}
A.forEach((t, i) => t.i = i);
// ---- side B
const L = fs.readFileSync(zf, 'utf8').split('\n');
const B = [], kitabsB = [];
let buf = '', btag = '';
const flush = () => { if (buf) B.push(...toks(buf, btag)); buf = ''; };
const pushB = (l, tag) => { if (tag !== btag) { flush(); btag = tag; } buf += ' ' + l; };
let hn = 0;
if (/IhkamAhkam/.test(zf) || L.some(l => l.includes('class="matn"'))) {
  // the matn of the Umda inside Ibn Daqiq al-'Id's «إحكام الأحكام» (OpenITI, Shamela 1665): <span class="matn"> … </span><span class="matn-hr">
  let inside = false;
  for (let l of L) {
    if (/^### \| \[كتاب/.test(l)) { flush(); kitabsB.push(B.length); continue; }
    if (l.includes('class="matn"')) { inside = true; l = l.split('class="matn">')[1] || ''; }
    if (!inside) continue;
    const endHere = l.includes('matn-hr'); if (endHere) { l = l.split('</span>')[0]; inside = false; }
    if (/^###/.test(l)) continue;
    l = l.replace(/PageV\d+P\d+/g, ' ').replace(/^~~|^#/g, ' ').replace(/<[^>]*>/g, ' ');
    const m = l.match(/^\s*(\d+)\s*-\s*/); if (m) { hn = +m[1]; l = l.slice(m[0].length); }
    l = l.replace(/^\s*(الحديث|حديث)\s+[^:]{2,40}:/, ' ');
    if (/^\s*(باب|كتاب)\s/.test(l) && l.trim().split(/\s+/).length < 9) continue;
    pushB(l, 'I' + hn);
  }
  kitabsB[0] = 0;
} else {
const start = L.findIndex(l => l.includes('الحمد لله الملك الجبار')), end = L.findIndex((l, i) => i > start && /^\(¬1\)/.test(l));
for (let i = start; i < end; i++) {
  let l = L[i];
  if (/^### \| (AUTO|CHECK)/.test(l)) { flush(); kitabsB.push(B.length); continue; }
  if (/^###/.test(l) || /^#\s*\d+\s*-\s*كتاب/.test(l)) continue;
  l = l.replace(/PageV\d+P\d+/g, ' ').replace(/ms\d+/g, ' ').replace(/\(¬\d+\)/g, ' ').replace(/^~~|^#/g, ' ');
  const m = l.match(/^\s*(\d+)\s*-\s/); if (m) { hn = +m[1]; l = l.replace(/^\s*\d+\s*-\s/, ' '); }
  pushB(l, 'Z' + hn);
}
}
flush();
// ---- Myers diff on a segment
function diff(a, b) {
  const n = a.length, m = b.length, max = n + m, V = new Int32Array(2 * max + 2), trace = [];
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
          while (X > px && Y > py) { ops.push(['=', a[--X], b[--Y]]); }
          if (X === px) ops.push(['+', null, b[--Y]]); else ops.push(['-', a[--X], null]);
        }
        while (X > 0 && Y > 0) ops.push(['=', a[--X], b[--Y]]);
        return ops.reverse();
      }
    }
  }
}
if (kitabsA.length !== kitabsB.length) console.log('kitab count differs', kitabsA.length, kitabsB.length);
const segs = []; const ka = [0, ...kitabsA.slice(1), A.length], kb = [0, ...kitabsB.slice(1), B.length];
let ops = [];
for (let i = 0; i < ka.length - 1; i++) ops = ops.concat(diff(A.slice(ka[i], ka[i + 1]), B.slice(kb[i], kb[i + 1])));
// group runs of non-equal ops into hunks
const hunks = []; let cur = null, lastA = null;
for (const [op, a, b] of ops) {
  if (op === '=') { if (cur) { cur.e = a.i; hunks.push(cur); cur = null; } lastA = a; continue; }
  if (!cur) cur = { at: (a || lastA || { tag: '?' }).tag, s: a ? a.i : (lastA ? lastA.i + 1 : 0), z: b ? b.tag : '', A: [], B: [] };
  if (a) cur.A.push(a.o); if (b) cur.B.push(b.o); if (b && !cur.z) cur.z = b.tag;
}
if (cur) { cur.e = A.length; hunks.push(cur); }
fs.writeFileSync(out, 'hadith\tother_no\tstart\tend\tqasim\tother_text\n' + hunks.map(h => [h.at, h.z, h.s, h.e, h.A.join(' '), h.B.join(' ')].join('\t')).join('\n') + '\n');
const eq = ops.filter(o => o[0] === '=').length;
console.log('A words', A.length, 'B words', B.length, 'equal', eq, 'hunks', hunks.length);
