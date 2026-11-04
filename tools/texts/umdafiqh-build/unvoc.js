// Lists the runs of words that got no marks from W (to be vocalized by hand in manual-voc.json).
// key = the two words before (without marks) + « | » + the run as printed in Z/I.  usage: node unvoc.js > out/unvoc.txt
const { FW } = require('./vulgate.js');
const H = /[\u064B-\u0652]/, bare = s => s.replace(/[\u064B-\u0652\u0670]/g, '');
const runs = [];
for (let i = 0; i < FW.length; i++) {
  if (FW[i].voc || H.test(FW[i].o)) continue;
  let j = i; while (j + 1 < FW.length && !FW[j + 1].voc && !H.test(FW[j + 1].o)) j++;
  runs.push([i, j]); i = j;
}
const key = (a, b) => FW.slice(Math.max(0, a - 2), a).map(x => bare(x.o)).join(' ') + ' | ' + FW.slice(a, b + 1).map(x => x.o).join(' ');
module.exports = { runs, key };
if (require.main === module) runs.forEach(([a, b], k) => console.log(k + '\t' + FW.slice(Math.max(0, a - 4), a).map(x => x.o).join(' ') + ' [[' + FW.slice(a, b + 1).map(x => x.o).join(' ') + ']] ' + FW.slice(b + 1, b + 4).map(x => x.o).join(' ')));
