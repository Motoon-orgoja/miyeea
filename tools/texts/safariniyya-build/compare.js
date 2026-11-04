// Word-by-word collation of the three sources after normalization (N): Lawami' (vocalized base), the 6382 edition, Ibn Uthaymeen's list.
// → collation.txt (every verse where any source differs)
const fs = require('fs'), N = require('./norm');
const M = require('./matched.json');
const U = require('./uthaymeen.json').filter(x => x.p <= 12 && x.n);
const out = [];
let diffs = 0;
for (const r of M) {
  const law = N((r.law || []).filter(Boolean).join(' '));
  const ed = N(r.ed.join(' '));
  const u = U.find(x => x.n === r.n); const ut = u ? N(u.v.join(' ')) : '(none)';
  if (law === ed && ed === ut && r.how.every(h => h === 'exact')) continue;
  diffs++;
  out.push(r.n + '  [' + r.how.join(',') + '] p' + r.pages.join(','));
  out.push('  LAW: ' + (r.law || []).join(' | '));
  out.push('  ED : ' + r.ed.join(' | '));
  out.push('  UTH: ' + (u ? u.v.join(' | ') : '(none)'));
  const lw = law.split(' '), ew = ed.split(' '), uw = ut.split(' ');
  out.push('  diff LAW≠ED: ' + lw.filter(w => !ew.includes(w)).join(' ') + '  /  ' + ew.filter(w => !lw.includes(w)).join(' '));
  out.push('  diff LAW≠UTH: ' + lw.filter(w => !uw.includes(w)).join(' ') + '  /  ' + uw.filter(w => !lw.includes(w)).join(' '));
}
fs.writeFileSync(__dirname + '/collation.txt', out.join('\n') + '\n');
console.log('verses with any difference', diffs, 'uth verses', U.length);
