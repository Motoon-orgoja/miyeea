// Review aid: for hunks of out/diff-wording.tsv, prints F's line(s) with footnote markers, the page's notes that mention the
// readings, and N's text around. usage: node ctx.js <pick regex> [from] [to]   (or: node ctx.js @<at> for one hunk)
const fs = require('fs'), L = require('./out/f-lines.json');
const rows = fs.readFileSync(__dirname + '/out/diff-wording.tsv', 'utf8').trim().split('\n').slice(1).map(r => r.split('\t'));
const [sel, from = 0, to = 1e9] = process.argv.slice(2);
const pick = sel.startsWith('@') ? rows.filter(r => r[0] === sel.slice(1)) : rows.filter(r => new RegExp(sel).test(r[2])).slice(+from, +to);
const ntxt = fs.readFileSync(__dirname + '/out/n.txt', 'utf8');
for (const r of pick) {
  const [at, page, pk, F, M, N, ctx] = r;
  console.log(`\n### @${at} p${page} ${pk}\n F: ${F}\n M: ${M}\n N: ${N}\n ctx: ${ctx}`);
  const pl = L.filter(l => l.page === +page);
  const key = (F || ctx.split(' ').slice(-2).join(' ')).replace(/[.,:،]/g, '').split(' ')[0];
  const line = pl.find(l => l.text.includes(ctx.split(' ').slice(-2).join(' ').replace(/[.:،,]$/, ''))) || pl.find(l => l.text.includes(key));
  if (line) console.log(' Fraw: ' + line.raw.slice(0, 400));
  const notes = pl.flatMap(l => l.notes || []);
  const words = [F, M].join(' ').split(' ').map(w => w.replace(/[.,:،]/g, '')).filter(w => w.length > 1);
  for (const n of notes) if (words.some(w => n.includes(w))) console.log(' note: ' + n.slice(0, 300));
}
