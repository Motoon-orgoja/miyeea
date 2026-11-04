// usage: node report-tables.js <key> <base> — prints markdown tables of the wording decisions (changes from the base,
// three-way places) and the manual harakat entries, for <key>-sources.md
const fs = require('fs'), path = require('path');
const { RAW } = require('./lib');
const [key, B] = process.argv.slice(2);
const rows = fs.readFileSync(path.join(RAW, key, 'collation', 'wording-decisions.tsv'), 'utf8').trim().split('\n').slice(1).map(l => l.split('\t'));
const cut = s => s.length > 160 ? s.slice(0, 157) + '…' : s;
const esc = s => cut(s).replace(/\|/g, '/');
console.log('| # | السياق | القراءات | القرار |\n|---|---|---|---|');
let n = 0;
for (const [pos, dec, ctx, rd, info] of rows) {
  if (!/take|keep3|→|gap|=/.test(dec)) continue;
  n++; console.log(`| ${n} | …${esc(ctx)} | ${esc(rd.replace(/ ‖ /g, ' ؛ '))}${info ? ' ؛ ' + esc(info.replace(/ ‖ /g, ' ؛ ')) : ''} | ${dec} |`);
}
