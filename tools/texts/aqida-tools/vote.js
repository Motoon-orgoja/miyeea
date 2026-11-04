// usage: node vote.js <key> <base> <W1,W2,...> [out.txt] [--noq]
// Aligns every witness to the base stream and prints each place where at least one witness differs,
// with each witness's reading (skeleton compare). Flags "AGREE" when all other witnesses agree against the base.
const fs = require('fs'), path = require('path');
const { RAW, norm, diff } = require('./lib');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const [key, B, wl, outFile] = args; const noq = process.argv.includes('--noq');
const load = k => { let s = JSON.parse(fs.readFileSync(path.join(RAW, key, k + '.stream.json'), 'utf8')).filter(x => x.w); if (noq) s = s.filter(x => !x.q); return s; };
const base = load(B), bn = base.map(x => norm(x.w));
const wits = wl.split(',');
// for each witness: sub[i] = witness word at base i (or null), ins[i] = witness words inserted before base i (i up to n)
const al = wits.map(k => {
  const s = load(k), ops = diff(bn, s.map(x => norm(x.w)));
  const sub = Array(bn.length).fill(null), ins = Array.from({ length: bn.length + 1 }, () => []);
  let i = 0;
  for (const o of ops) { if (o.op === '=') { sub[o.a] = s[o.b].w; i = o.a + 1; } else if (o.op === '-') { i = o.a + 1; } else ins[i].push(s[o.b].w); }
  return { k, sub, ins };
});
// a position i is "clean" if every witness has same word at i and no insertions before i
const lines = []; let i = 0;
const dirty = j => al.some(a => a.sub[j] === null && j < bn.length) || al.some(a => a.ins[j].length);
while (i <= bn.length) {
  if (!dirty(i)) { i++; continue; }
  let e = i; // hunk covers base [i, e) plus insertions at i..e
  while (e < bn.length && (al.some(a => a.sub[e] === null) || al.some(a => a.ins[e].length))) e++;
  // collect readings
  const rd = a => { const r = []; for (let j = i; j <= e; j++) { r.push(...a.ins[j]); if (j < e && a.sub[j] !== null) r.push(a.sub[j]); } return r.join(' '); };
  const baseR = base.slice(i, e).map(x => x.w).join(' ');
  const rs = al.map(a => ({ k: a.k, r: rd(a) }));
  const agree = rs.every(x => norm(x.r.replace(/ /g, '|')) === norm(rs[0].r.replace(/ /g, '|'))) ? 'AGREE' : '';
  const ctxB = base.slice(Math.max(0, i - 4), i).map(x => x.w).join(' '), ctxA = base.slice(e, e + 3).map(x => x.w).join(' ');
  lines.push(`@${i}${agree ? ' ' + agree : ''}${base[i] && base[i].q ? ' Q' : ''}\t${ctxB} ⟦ ${B}: ${baseR || '—'} ‖ ` + rs.map(x => `${x.k}: ${x.r || '—'}`).join(' ‖ ') + ` ⟧ ${ctxA}`);
  i = e + 1;
}
const txt = lines.join('\n') + '\n';
if (outFile) fs.writeFileSync(outFile, txt); else process.stdout.write(txt);
console.error(lines.length, 'places,', lines.filter(l => / AGREE/.test(l)).length, 'where all witnesses agree against', B);
