// usage: node mk-manual.js <key> <spec.json> > raw/<key>/collation/manual-voc.json
// spec: [["phrase of 2-4 words", targetIndex, "vocalized form", "why"]] — the phrase is located (skeleton compare) in
// raw/<key>/selected.json and turned into {sel, prev, next, w, why} entries for vocalize.js / chain-voc.js
const fs = require('fs'), path = require('path');
const { RAW, norm } = require('./lib');
const [key, specF] = process.argv.slice(2);
const sel = JSON.parse(fs.readFileSync(path.join(RAW, key, 'selected.json'), 'utf8')), sn = sel.map(x => norm(x.w));
const out = [];
for (const [phrase, ti, w, why] of JSON.parse(fs.readFileSync(specF, 'utf8'))) {
  const p = phrase.split(' ').map(norm), hits = [];
  for (let i = 0; i + p.length <= sn.length; i++) if (p.every((x, k) => sn[i + k] === x)) hits.push(i + ti);
  if (!hits.length) throw new Error('not found: ' + phrase);
  for (const i of hits) out.push({ sel: sel[i].w, prev: (sel[i - 1] || {}).w, next: (sel[i + 1] || {}).w, w, why });
}
// entries that share sel/prev/next would be ambiguous: keep one per position (all same form)
const seen = new Set(); const uniq = out.filter(e => { const k = e.sel + '|' + e.prev + '|' + e.next; if (seen.has(k)) return false; seen.add(k); return true; });
process.stdout.write(JSON.stringify(uniq, null, 1) + '\n');
