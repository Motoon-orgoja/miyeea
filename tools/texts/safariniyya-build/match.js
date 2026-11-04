// For each verse of the skeleton (6382), finds the vocalized wording in Lawami' (Shamela 8353) by word-sequence search,
// moving forward through the commentary (each hemistich is searched after the previous one). → matched.json
const fs = require('fs'), path = require('path'), N = require('./norm');
const RAW = path.join(__dirname, '..', 'raw', 'safariniyya');
const sk = require('./skeleton.json').filter(x => x.v);
// token stream of Lawami'
const toks = [];
const pages = fs.readdirSync(RAW).filter(f => /^8353_\d+\.html$/.test(f)).map(f => +f.match(/\d+/g)[1]).sort((a, b) => a - b);
for (const p of pages) {
  const d = fs.readFileSync(path.join(RAW, '8353_' + p + '.html'), 'utf8'); const i = d.indexOf('class="nass'); if (i < 0) continue;
  const t = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0].replace(/<\/p>|<br\s*\/?>/g, '\n').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/غَيْرِمَا/g, 'غَيْرِ مَا');
  t.split('\n').forEach((line, li) => {
    const quote = /^\s*\(/.test(line);
    for (const w of line.split(/\s+/)) {
      if (w.includes('...')) { if (toks.length) toks[toks.length - 1].sep = true; }
      const o = w.replace(/[^\u0621-\u0652\u0670]/g, ''); const n = N(o);
      if (!n) continue;
      // a detached proclitic (ب، ك) is glued to the next word by N(); keep tokens as words
      toks.push({ o, n, p, li, quote });
    }
  });
}
const words = s => N(s).split(' ');
const eq = (a, b) => a === b;
function findExact(W, from, to) {
  outer: for (let i = from; i < Math.min(to, toks.length - W.length); i++) {
    for (let k = 0; k < W.length; k++) if (!eq(toks[i + k].n, W[k])) continue outer;
    return i;
  }
  return -1;
}
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
function findFuzzy(W, from, to) {
  let best = null;
  for (let i = from; i < Math.min(to, toks.length); i++) for (const len of [W.length - 1, W.length, W.length + 1]) {
    if (len < 1 || i + len > toks.length) continue;
    const seg = toks.slice(i, i + len).map(t => t.n); const c = lev(seg, W);
    if (c <= Math.max(1, Math.floor(W.length / 3)) && (!best || c < best.c || (c === best.c && best.i === i && len === W.length))) best = { i, len, c };
  }
  return best;
}
let ptr = 0; const res = [];
sk.forEach((x, idx) => {
  let halves = x.v;
  if (halves.length === 1) halves = [halves[0], null];
  const r = { n: idx + 1, ed: x.v, law: [], how: [], pages: [] };
  if (!halves[1]) { // no split in 6382: search whole line, then split at Lawami's "..." or by tokens count
    const W = words(halves[0]); let i = findExact(W, ptr, ptr + 60000), len = W.length, how = 'exact';
    if (i < 0) { const f = findFuzzy(W, ptr, ptr + 60000); if (f) { i = f.i; len = f.len; how = 'fuzzy' + f.c; } }
    if (i < 0) { r.how.push('MISSING'); res.push(r); return; }
    const seg = toks.slice(i, i + len); let cut = seg.findIndex(t => t.sep);
    r.law = cut >= 0 ? [seg.slice(0, cut + 1), seg.slice(cut + 1)].map(s => s.map(t => t.o).join(' ')) : [seg.map(t => t.o).join(' ')];
    r.how.push(how + (cut >= 0 ? '' : '-nosplit')); r.pages.push(seg[0].p); ptr = i + len; res.push(r); return;
  }
  for (const h of halves) {
    const W = words(h); let i = findExact(W, ptr, ptr + 60000), len = W.length, how = 'exact';
    if (i < 0) { const f = findFuzzy(W, ptr, ptr + 60000); if (f) { i = f.i; len = f.len; how = 'fuzzy' + f.c; } }
    if (i < 0) { r.law.push(null); r.how.push('MISSING'); continue; }
    r.law.push(toks.slice(i, i + len).map(t => t.o).join(' ')); r.how.push(how); r.pages.push(toks[i].p); ptr = i + len;
  }
  res.push(r);
});
fs.writeFileSync(path.join(__dirname, 'matched.json'), JSON.stringify(res, null, 1));
const bad = res.filter(r => r.how.some(h => h !== 'exact'));
console.log('verses', res.length, 'non-exact', bad.length);
bad.forEach(r => console.log(r.n, r.how.join(','), r.pages.join(','), '\n   ED :', r.ed.join(' | '), '\n   LAW:', r.law.join(' | ')));
