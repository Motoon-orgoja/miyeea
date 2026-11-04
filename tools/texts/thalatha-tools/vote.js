// For each hunk of base-vs-<critical>, shows what the other editions read at the same base position.
// usage: node vote.js <critical report> <other report>...
const fs = require('fs');
const parse = f => { const H = {}; for (const l of fs.readFileSync(f, 'utf8').split(/\r?\n/)) { const m = l.match(/^@(\d+) \[([^\]]*)\]  BASE: (.*)  \|\|  OTHER: (.*)$/); if (m) (H[m[1]] = H[m[1]] || []).push({ ctx: m[2], a: m[3], b: m[4] }) } return H };
const [crit, ...others] = process.argv.slice(2).map(parse);
for (const at of Object.keys(crit).sort((x, y) => x - y)) for (const h of crit[at]) {
  const votes = others.map(o => { for (const d of [0, -1, 1, -2, 2, -3, 3]) { const k = +at + d; if (o[k]) return (d ? '(' + d + ') ' : '') + o[k].map(x => x.a + ' => ' + x.b).join(' / ') } return '= BASE' });
  console.log('@' + at, '[' + h.ctx + ']', 'BASE:', h.a, '| CRIT:', h.b, '||', votes.join(' || '));
}
