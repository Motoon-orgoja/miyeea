// Compares the vocalization of bulugh.json with sunnah.com/bulugh (a separate vocalized digitization).
// Words are aligned on their consonant skeleton (Myers diff per kitab); for each aligned pair the harakat are compared letter by letter.
// usage: node vocal.js <bulugh.json> <sunnah dir> <out tsv>
const fs = require('fs'), path = require('path');
const [jf, sd, out] = process.argv.slice(2);
const H = /[ً-ْٰ]/;
const skel = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي]/g, '').replace(/^ابن$/, 'بن');
// letters with their marks, in a canonical form: sukun dropped, marks sorted, marks on a wasl alif dropped, tanween-fath moved before the alif
const vocal = w => {
  w = w.replace(/[^ء-يً-ْٰ]/g, '').replace(/ٰ/g, '');
  w = w.replace(/اً/g, 'ًا');
  const L = []; for (const c of w) { if (H.test(c)) { if (L.length) L[L.length - 1].m += c; } else L.push({ c, m: '' }); }
  L.forEach((x, i) => {
    x.m = [...x.m.replace(/ْ/g, '')].sort().join('');
    // alif: no vowel counted (wasl alif «اَلْ», «اِبْنُ», and the alif after «وَ/فَ/بِ»)
    if (x.c === 'ا') x.m = '';
    // the lam of the article is unmarked or sukun in different copies
    if (x.c === 'ل' && L[i - 1] && L[i - 1].c === 'ا') x.m = x.m.replace(/ّ/, 'ّ');
  });
  return L;
};
const toks = s => s.replace(/<sup>[\s\S]*?<\/sup>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/‏/g, '')
  .split(/\s+/).map(o => ({ o, w: skel(o) })).filter(x => x.w);
// ---- base, grouped by kitab (الطلاق goes with النكاح as on sunnah.com)
const J = JSON.parse(fs.readFileSync(jf, 'utf8'));
const groups = []; let g = null;
for (const c of J.chapters) {
  const key = /الطَّلَاقِ/.test(c.group) ? 'النكاح' : c.group;
  if (!g || g.key !== key) { g = { key, A: [] }; groups.push(g); }
  for (const h of c.hadiths) for (const f of ['rawi', 'matn', 'takh']) if (h[f]) g.A.push(...toks(h[f]).map(t => (t.n = h.n, t)));
}
groups.forEach(x => { if (/النِّكَاحِ/.test(x.key)) x.key = 'النكاح'; });
const merged = []; for (const x of groups) { const p = merged[merged.length - 1]; if (p && p.key === x.key) p.A.push(...x.A); else merged.push(x); }
if (merged.length !== 16) console.log('kitab groups', merged.length);
// ---- sunnah.com books 1–16
const S = [];
for (let b = 1; b <= 16; b++) {
  const d = fs.readFileSync(path.join(sd, b + '.html'), 'utf8'), T = [];
  for (const m of d.matchAll(/<span class="arabic_text_details arabic">([\s\S]*?)<\/span><span class="arabic_sanad/g)) T.push(...toks(m[1]));
  S.push(T);
}
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
          while (X > px && Y > py) ops.push(['=', a[--X], b[--Y]]);
          if (X === px) ops.push(['+', null, b[--Y]]); else ops.push(['-', a[--X], null]);
        }
        while (X > 0 && Y > 0) ops.push(['=', a[--X], b[--Y]]);
        return ops.reverse();
      }
    }
  }
}
const rows = []; let aligned = 0, same = 0, total = 0;
merged.forEach((x, i) => {
  total += x.A.length;
  for (const [op, a, b] of diff(x.A, S[i])) {
    if (op !== '=') continue;
    aligned++;
    const va = vocal(a.o), vb = vocal(b.o);
    if (va.length !== vb.length) { same++; continue; }
    const diffs = [];
    va.forEach((l, k) => {
      const mb = vb[k].m, last = k === va.length - 1;
      if (l.m === mb) return;
      if (!l.m || !mb) { if (!l.m && mb && !last) diffs.push('base-missing'); return; }  // one side unmarked: not a conflict
      diffs.push(last ? 'ending' : 'internal');
    });
    if (!diffs.length) { same++; continue; }
    rows.push([a.n, diffs.includes('internal') ? 'internal' : diffs[0], a.o, b.o].join('\t'));
  }
});
fs.writeFileSync(out, 'hadith\tkind\tbase\tsunnah.com\n' + rows.join('\n') + '\n');
const c = k => rows.filter(r => r.split('\t')[1] === k).length;
console.log('base words', total, 'aligned', aligned, 'same vocalization', same, 'differ', rows.length, '(internal', c('internal'), 'ending', c('ending'), 'base-missing', c('base-missing') + ')');
