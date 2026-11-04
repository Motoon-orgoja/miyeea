// usage: node chain-voc.js <key> <corpus spec> [manual-voc.json]
//   corpus spec: comma list of <name>=<path to stream.json relative to raw/> in priority order, e.g.
//   V=lumaa/V.stream.json,H=wasitiyya/H.stream.json
// For a text with no fully vocalized edition: each word of raw/<key>/selected.json (outside Qur'an quotes) takes the harakat
// of the same word in a vocalized published text, but only inside a run of at least 3 consecutive words that are the same
// in both (skeleton compare), so the case ending belongs to the same context. Several hits are voted letter by letter.
// The selected word's own marks (from the base edition) count as one more vote. Writes raw/<key>/vocalized.json and
// raw/<key>/collation/chain-voc.tsv (every word: source of its harakat or «none»).
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const { vote, units, styl, MARK } = require('./harakat');
const [key, spec, manualF] = process.argv.slice(2);
const sel = JSON.parse(fs.readFileSync(path.join(RAW, key, 'selected.json'), 'utf8'));
const C = spec.split(',').map(s => { const [k, p] = s.split('='); const ws = JSON.parse(fs.readFileSync(path.join(RAW, p), 'utf8')).filter(x => x.w); return { k, ws, n: ws.map(x => norm(x.w)) }; });
const prio = C.map(c => c.k);
const idx = new Map();
for (const c of C) for (let j = 0; j + 2 < c.n.length; j++) { const t = c.n[j] + '|' + c.n[j + 1] + '|' + c.n[j + 2]; if (!idx.has(t)) idx.set(t, []); idx.get(t).push([c, j]); }
const sn = sel.map(x => norm(x.w));
const manual = {};
if (manualF) for (const m of JSON.parse(fs.readFileSync(path.join(RAW, key, manualF), 'utf8'))) {
  const hits = sel.map((t, i) => i).filter(i => sel[i].w === m.sel && (!m.prev || (sel[i - 1] || {}).w === m.prev) && (!m.next || (sel[i + 1] || {}).w === m.next));
  if (!hits.length) throw new Error('manual entry not found: ' + JSON.stringify(m));
  for (const h of hits) manual[h] = m; // the same word between the same neighbours: same reading
}
// only fully vocalized forms count (a commentary that marks a letter here and there gives no reliable word);
// a letter needs a mark unless it is a long-vowel letter, alif, the lam of a sun-letter article, or the last letter
const needs = w => { const L = units(styl(w)).filter(x => !x.p); return L.filter((x, j) => j < L.length - 1 && !x.m && !'اىآ'.includes(x.c) && !(x.c === 'ل' && j <= 3 && L[j + 1] && L[j + 1].m.includes('ّ')) && !((x.c === 'و' || x.c === 'ي') && j > 0 && /[ُِ]/.test(L[j - 1].m))).length; };
const hasMark = w => MARK.test(w) && needs(w) === 0;
const out = [], log = [];
let nV = 0, nNone = 0, nOwn = 0;
sel.forEach((t, i) => {
  if (t.q) { out.push({ ...t }); return; }
  const seen = new Set(), forms = [];
  for (let o = 0; o < 3; o++) {
    const a = i - o; if (a < 0 || a + 2 >= sn.length) continue;
    if (sel[a].q || sel[a + 1].q || sel[a + 2].q) continue;
    const hits = idx.get(sn[a] + '|' + sn[a + 1] + '|' + sn[a + 2]) || [];
    for (const [c, j] of hits) { const id = c.k + ':' + (j + o); if (seen.has(id)) continue; seen.add(id); const w = c.ws[j + o].w; if (hasMark(w)) forms.push({ src: c.k, w, o }); }
  }
  if (hasMark(t.w)) forms.push({ src: 'base', w: t.w, o: 9 });
  let w = t.w, how = 'none';
  if (manual[i]) { w = manual[i].w; how = 'manual'; }
  else if (forms.length) {
    // the stem from every hit; the last letter (case ending) only from hits whose 3-word run includes the word before,
    // since that is what governs the ending; without such a hit the last letter stays bare
    const r = vote(t.w, forms, [...prio, 'base']); w = r.w;
    const fc = forms.filter(f => f.o >= 1); const rc = fc.length ? vote(t.w, fc, [...prio, 'base']) : null;
    const u = units(w), L = u.filter(x => !x.p), last = L[L.length - 1];
    const lastOf = x => { const q = units(styl(x)).filter(y => !y.p); return q.length ? q[q.length - 1].m : ''; };
    // all hits agree on the ending: take it; otherwise only the hits that include the word before decide
    const ends = new Set(forms.map(f => lastOf(f.w)).filter(Boolean));
    let lc = ends.size === 1 ? [...ends][0] : (rc ? lastOf(rc.w) : '');
    if (last && !(L.length === 1)) last.m = lc && lc.includes('ّ') ? lc : (last.m.includes('ّ') && !lc ? 'ّ' : lc);
    w = u.map(x => x.c + x.m).join('');
    if (needs(w)) { w = t.w; forms.length = 0; }
    how = [...new Set(forms.map(f => f.src))].join('+') + (r.conflicts.length ? ' CONFLICT ' + r.conflicts.map(c => c.letter + ':' + c.chosen + '/' + c.others.join(',')).join(';') : ''); }
  if (!how) how = 'none';
  if (how === 'none') nNone++; else if (how === 'base') nOwn++; else nV++;
  log.push([i, t.w, w, how, sel.slice(Math.max(0, i - 2), i + 3).map(x => x.w).join(' ')].join('\t'));
  out.push({ ...t, w });
});
fs.writeFileSync(path.join(RAW, key, 'vocalized.json'), JSON.stringify(out));
fs.writeFileSync(path.join(RAW, key, 'collation', 'chain-voc.tsv'), 'pos\tword\tresult\tsource\tcontext\n' + log.join('\n') + '\n');
const nonq = sel.filter(x => !x.q).length;
console.log('words outside the Qur\'an', nonq, 'vocalized from corpus', nV, 'own marks only', nOwn, 'left bare', nNone);
