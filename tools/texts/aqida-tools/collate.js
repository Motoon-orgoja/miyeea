// usage: node collate.js <key> <X> <Y> [out.txt] [--noq]  — word-by-word skeleton diff of two streams (raw/<key>/<X>.stream.json)
// --noq: compare outside Qur'an quotes only (Qur'an words dropped from both)
const fs = require('fs'), path = require('path');
const { RAW, norm, diff, hunks } = require('./lib');
const [key, X, Y, outFile] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const noq = process.argv.includes('--noq');
const load = k => {
  let s = JSON.parse(fs.readFileSync(path.join(RAW, key, k + '.stream.json'), 'utf8')).filter(x => x.w);
  if (noq) s = s.filter(x => !x.q);
  return s;
};
const a = load(X), b = load(Y);
const ops = diff(a.map(x => norm(x.w)), b.map(x => norm(x.w)));
const H = hunks(ops, a.map(x => x.w), b.map(x => x.w), 4);
const lines = H.map((h, i) => `${i + 1}\t@${h.at}\t${h.before} [ ${X}: ${h.del.join(' ') || '—'} | ${Y}: ${h.ins.join(' ') || '—'} ] ${h.after}`);
const txt = `${X} ${a.length} words, ${Y} ${b.length} words, ${H.length} hunks\n` + lines.join('\n') + '\n';
if (outFile) fs.writeFileSync(outFile, txt); else process.stdout.write(txt);
console.error(`${X}/${Y}: ${H.length} hunks`);
