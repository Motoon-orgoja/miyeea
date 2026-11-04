// Checks manual-voc-*.js against the runs of unvoc.js (same letters after normalization, unless marked «!»).
const { FW } = require('./vulgate.js'); const { runs } = require('./unvoc.js'); const { norm } = require('./align.js');
const E = ['a', 'b', 'c', 'd'].flatMap(k => { try { return require('./manual-voc-' + k + '.js'); } catch (e) { return []; } });
const parse = e => { let pre = null, n = 0, next = null, bang = false; let s = e;
  let m = s.match(/^<(\d+)\|([^|]*)\|/); if (m) { pre = [+m[1], m[2]]; s = s.slice(m[0].length); }
  m = s.match(/\|>(\d+)\|(.*)$/); if (m) { next = [+m[1], m[2]]; s = s.slice(0, m.index); }
  if (s.startsWith('!')) { bang = true; s = s.slice(1); } return { s, pre, next, bang }; };
module.exports = { E, parse };
if (require.main === module) {
  const nn = t => t.split(' ').map(norm).filter(Boolean).join(' ');
  let bad = 0;
  E.forEach((e, k) => { const [a, b] = runs[k] || []; if (a === undefined) { console.log('extra entry', k); bad++; return; }
    const p = parse(e), run = FW.slice(a, b + 1).map(x => x.o).join(' ');
    if (!p.bang && nn(p.s) !== nn(run)) { if (bad < 15) console.log('MISMATCH', k, '|', run, '|', p.s); bad++; } });
  console.log('entries', E.length, 'runs', runs.length, 'mismatches', bad);
}
