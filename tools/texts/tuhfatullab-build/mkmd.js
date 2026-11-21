const fs = require('fs'); const B = 'C:/Users/Mahmoud/Downloads/miyeea/tools/texts/tuhfatullab-build';
const C = require(B + '/corrections.json'); const adds = C.add.map(a => a.after); const nn = g => g + adds.filter(a => a < g).length;
let fixed = [], kept = [];
for (const k of 'ABCDEF') { const j = JSON.parse(fs.readFileSync(B + '/collation/scan_' + k + '.json', 'utf8'));
  for (const d of j.diffs) { if (d.g === 126) continue; const r = { g: d.g, n: nn(d.g), ours: d.ours, scan: d.scan.replace(/\u0671/g, 'ا'), note: (d.note || '').replace(/\|/g, '/').replace(/\s+/g, ' ').slice(0, 140) }; const st=x=>x.replace(/[ً-ْ]/g,"");const hit=(C.fix[d.g]||[]).some(([a])=>st(a).includes(st(d.ours).trim())||st(d.ours).includes(st(a).replace(" |","").trim()));(hit ? fixed : kept).push(r); } }
const why = JSON.parse(fs.readFileSync(__dirname + '/why.json', 'utf8'));
const T = JSON.parse(fs.readFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/tuhfatullab-qudouri.json', 'utf8'));
const withP = T.filter(t => t.units.length).reduce((s, t) => s + t.to - t.from + 1, 0);
const doubt = kept.filter(r => /للتأكد/.test(why[r.g] || '')).map(r => r.n);
let md = fs.readFileSync(__dirname + '/sources.tpl.md', 'utf8')
  .replace('{{ADDED}}', C.add.map(a => '  - after g' + a.after + ' (scan p. ' + a.page + '): «' + a.t + '»').join('\n'))
  .replace('{{FIXED}}', fixed.map(r => '| ' + r.n + ' | ' + r.ours + ' | ' + r.scan + ' | ' + (r.note || '') + ' |').join('\n'))
  .replace('{{N1746}}', nn(1746)).replace('{{N126}}', nn(126))
  .replace('{{NFIX}}', fixed.length).replace('{{KEPTN}}', kept.length)
  .replace('{{KEPT}}', kept.map(r => '| ' + r.n + ' | ' + r.ours + ' | ' + r.scan + ' | ' + (why[r.g] || r.note || 'spelling') + ' |').join('\n'))
  .replace('{{DOUBT}}', doubt.join('، '))
  .replace('{{WITH}}', withP).replace('{{WITHOUT}}', 1952 - withP).replace('{{N249}}', nn(249)).replace('{{N1941}}', nn(1941));
fs.writeFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/tuhfatullab-sources.md', md);
console.log(md.length, fixed.length, kept.length, withP);
