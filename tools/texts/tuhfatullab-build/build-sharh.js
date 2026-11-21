// Builds data/sharh/tuhfatullab.json («شرح البيت» = the parallel passage of مختصر القدوري) from
// tools/texts/tuhfatullab-qudouri.json (verse range -> Qudouri unit ids, matched by meaning) and data/qudouri.js (quoted verbatim).
// usage (repo root): node tools/texts/tuhfatullab-build/build-sharh.js   — then rebuild the poem: node tools/build-matn.js tuhfatullab
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..', '..');
global.window = {}; require(path.join(root, 'data', 'qudouri.js')); const Q = window.BOOK;
const unit = {}; for (const c of Q.chapters) for (const u of c.units) unit[u.id] = u;
const T = JSON.parse(fs.readFileSync(path.join(root, 'tools/texts/tuhfatullab-qudouri.json'), 'utf8'));
const N = fs.readFileSync(path.join(root, 'tools/texts/tuhfatullab.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('## ')).length;
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const v = new Array(N).fill(null); let next = 1, withP = 0;
for (const t of T) {
  if (t.from !== next) throw new Error('table not contiguous at ' + next); next = t.to + 1;
  if (!t.units.length) continue;
  const head = t.from === t.to ? '# البيت ' + ar(t.from) + ' يقابله:' : '# الأبيات ' + ar(t.from) + '–' + ar(t.to) + ' يقابلها:';
  const paras = t.units.map(id => { const u = unit[id]; if (!u) throw new Error('no Qudouri unit ' + id); return u.segs.filter(s => s[0] === 'matn').map(s => s[1]).join(' '); });
  const e = { t: [head].concat(paras).join('\n\n'), ref: t.units.map(id => unit[id].label).join('؛ '), url: '' };
  for (let i = t.from; i <= t.to; i++) { v[i - 1] = e; withP++; }
}
if (next !== N + 1) throw new Error('table covers ' + (next - 1) + ' verses, poem has ' + N);
fs.mkdirSync(path.join(root, 'data', 'sharh'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'sharh', 'tuhfatullab.json'),
  JSON.stringify({ name: 'يقابله من مختصر القدوري', author: 'أبي الحسين القدوري', death: '٤٢٨هـ', url: '', v }));
console.log('tuhfatullab sharh: verses', N, 'with a Qudouri parallel', withP, 'without', N - withP);
