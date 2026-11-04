// Applies the reading rule to every collation region and writes out/decisions.tsv (and out/decisions.json for build.js).
// Rule: F (al-Fawakih) is the base. A reading R ≠ F is adopted when more witnesses support R than support F (F counting as one):
//   T+M+Th = R ............................ adopt (3 against 1)
//   two of them = R, the third ≠ F ......... adopt (2 against 1)
//   two = R, the third = F (2 against 2) ... adopt only if T (the critical edition, collated on manuscripts and five commentaries) is with R
//   M lacks the preface: there the two others decide the same way (2 against 1 adopt; 1 against 2 keep).
// Everything else keeps F. Manual overrides (MANUAL below, by F word index) are applied after the rule and logged.
// usage: node decide.js
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'out');
const { regions } = JSON.parse(fs.readFileSync(path.join(OUT, 'collation.json'), 'utf8'));
const MANUAL = require('./manual-readings');
const rows = [], dec = [];
for (const r of regions) {
  const wit = { T: r.T, M: r.M, Th: r.Th }, have = Object.entries(wit).filter(([, v]) => v !== null);
  const tally = {};
  for (const [k, v] of have) (tally[v] = tally[v] || []).push(k);
  const forF = (tally[r.F] || []).length + 1;
  let take = null, why = 'F';
  for (const [v, ks] of Object.entries(tally)) {
    if (v === r.F || ks.length < 2) continue;
    if (ks.length > forF) { take = v; why = ks.join('+'); }
    else if (ks.length === forF && ks.includes('T')) { take = v; why = ks.join('+') + ' (tie, T)'; }
  }
  const key = r.a + ':' + r.b;
  if (MANUAL[key] !== undefined) { take = MANUAL[key].keep ? null : MANUAL[key].text; why = 'manual: ' + MANUAL[key].why; }
  rows.push([r.a, r.b, take === null ? 'keep' : 'take', why, r.F, r.T, r.M, r.Th, take === null ? '' : take].map(x => x === null ? '—' : x).join('\t'));
  if (take !== null) {
    // keep the change as small as possible: words shared at both ends stay F's (vocalized) words
    let fw = r.F ? r.F.split(' ') : [], tw = take ? take.split(' ') : [], a = r.a, b = r.b;
    while (fw.length && tw.length && fw[0] === tw[0]) { fw.shift(); tw.shift(); a++; }
    while (fw.length && tw.length && fw[fw.length - 1] === tw[tw.length - 1]) { fw.pop(); tw.pop(); b--; }
    dec.push({ a, b, F: fw.join(' '), take: tw.join(' '), why, T: r.T, region: [r.a, r.b] });
  }
}
fs.writeFileSync(path.join(OUT, 'decisions.tsv'), 'a\tb\tdecision\twhy\tF\tT\tM\tTh\tadopted\n' + rows.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'decisions.json'), JSON.stringify(dec, null, 1));
console.log('regions', regions.length, 'adopted', dec.length, 'kept F', regions.length - dec.length);
