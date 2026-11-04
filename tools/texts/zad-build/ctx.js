// usage: node ctx.js <R index>... — prints R/A/B context around a diff region (for the hand decisions in manual.js)
const fs = require('fs');
const lines = fs.readFileSync(__dirname + '/out/diff-wording.tsv', 'utf8').split('\n');
const { tokens } = require('./out/tokens.json');
for (const k of process.argv.slice(2)) {
  const d = lines.find(l => l.startsWith(k + '\t')); console.log('==', d && d.slice(0, 400));
  const i = tokens.findIndex(t => t.r >= +k); console.log('   out:', tokens.slice(Math.max(0, i - 12), i + 10).map(t => t.o).join(' '));
}
