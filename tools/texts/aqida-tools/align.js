// Alignment helpers on word streams.
const { norm, diff } = require('./lib');
// align witness stream W to base stream B: returns {sub, ins} where sub[i] = index in W aligned to B[i] (or -1),
// ins[i] = indices of W words inserted before B[i] (i in 0..B.length)
function alignTo(B, W) {
  const ops = diff(B.map(x => norm(x.w)), W.map(x => norm(x.w)));
  const sub = Array(B.length).fill(-1), ins = Array.from({ length: B.length + 1 }, () => []);
  let i = 0;
  for (const o of ops) { if (o.op === '=') { sub[o.a] = o.b; i = o.a + 1; } else if (o.op === '-') i = o.a + 1; else ins[i].push(o.b); }
  return { sub, ins };
}
module.exports = { alignTo };
