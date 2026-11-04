// usage: node vocalize.js <key> <prio e.g. A,H,R> [manual-voc.json]
// For every word of raw/<key>/selected.json (outside Qur'an quotes) collects the vocalized forms of the same word
// in each vocalized witness (aligned by skeleton) and votes letter by letter (tie -> prio order).
// Writes raw/<key>/vocalized.json and raw/<key>/collation/harakat-conflicts.tsv, harakat-missing.tsv
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const { alignTo } = require('./align');
const { vote, styl, units, MARK } = require('./harakat');
const [key, prioS, manualF] = process.argv.slice(2);
const prio = prioS.split(',');
const sel = JSON.parse(fs.readFileSync(path.join(RAW, key, 'selected.json'), 'utf8'));
const S = {}; for (const k of prio) S[k] = JSON.parse(fs.readFileSync(path.join(RAW, key, k + '.stream.json'), 'utf8')).filter(x => x.w);
const al = {}; for (const k of prio) al[k] = alignTo(sel, S[k]);
// manual entries: [{sel, prev, next, w, why}] located by the selected word and its neighbours
const manual = {};
if (manualF) for (const m of JSON.parse(fs.readFileSync(path.join(RAW, key, manualF), 'utf8'))) {
  const hits = sel.map((t, i) => i).filter(i => sel[i].w === m.sel && (!m.prev || (sel[i - 1] || {}).w === m.prev) && (!m.next || (sel[i + 1] || {}).w === m.next));
  if (hits.length !== 1) throw new Error('manual entry matches ' + hits.length + ' places: ' + JSON.stringify(m));
  manual[hits[0]] = m;
}
const conf = [], miss = [], out = [];
const ctx = i => sel.slice(Math.max(0, i - 3), i + 3).map(x => x.w).join(' ');
sel.forEach((t, i) => {
  if (t.q) { out.push({ ...t }); return; }
  const forms = [];
  for (const k of prio) { const j = al[k].sub[i]; if (j >= 0) forms.push({ src: k, w: S[k][j].w }); }
  if (t.src === 'manual') forms.push({ src: 'manual', w: t.w });
  let r = vote(t.w, forms, [...prio, 'manual']);
  let w = r.w;
  const mk = manual[i];
  if (mk) { w = mk.w; }
  else for (const c of r.conflicts) conf.push([i, t.w, w, c.letter + '#' + c.i, c.chosen + ':' + c.by.join('+'), c.others.join(' '), c.tie ? 'TIE' : '', forms.map(f => f.src + '=' + f.w).join(' '), ctx(i)].join('\t'));
  // missing: letters with no mark that normally need one (not: long-vowel letters, sun lam, wasl alif, final alif/ya/waw)
  const L = units(w).filter(x => !x.p);
  const need = L.filter((x, j) => !x.m && !'اىآ'.includes(x.c) && !(x.c === 'ل' && j <= 2 && L[j + 1] && /ّ/.test(L[j + 1].m)) && !((x.c === 'و' || x.c === 'ي') && j > 0 && /[ُِ]/.test(L[j - 1].m)) && !(x.c === 'ة' && false));
  if (need.length && /[ء-ي]/.test(w)) miss.push([i, w, need.map(x => x.c).join(','), forms.map(f => f.src + '=' + f.w).join(' '), ctx(i)].join('\t'));
  out.push({ ...t, w });
});
fs.writeFileSync(path.join(RAW, key, 'vocalized.json'), JSON.stringify(out));
fs.writeFileSync(path.join(RAW, key, 'collation', 'harakat-conflicts.tsv'), 'pos\tword(sel)\tresult\tletter\tchosen\tothers\ttie\tforms\tcontext\n' + conf.join('\n') + '\n');
fs.writeFileSync(path.join(RAW, key, 'collation', 'harakat-missing.tsv'), 'pos\tresult\tunmarked letters\tforms\tcontext\n' + miss.join('\n') + '\n');
console.log('words', out.length, 'conflicts', conf.length, 'ties', conf.filter(c => /\tTIE\t/.test(c)).length, 'words with unmarked letters', miss.length);
