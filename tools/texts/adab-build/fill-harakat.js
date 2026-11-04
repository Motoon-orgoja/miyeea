// Completes missing harakat in base.txt from the two vocalized witnesses, ONLY in verses whose wording is identical
// (after normalization) to the witness verse, and only on letters that carry no mark in the base. Never changes a base mark.
// Rule: fill from غذاء الألباب (S) when S has the verse; if موارد الظمآن (M) also has it, fill only where S and M agree.
// M alone is not used (its vocalization has evident slips). Bare alif / alif maqsura are never marked.
// usage: node fill-harakat.js  -> writes filled.txt and fill-log.txt
const fs = require('fs'), path = require('path');
const P = f => path.join(__dirname, f);
const MARK = /[ً-ْٰ]/;
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي]/g, '');
const units = w => { const u = []; for (const ch of w) { if (MARK.test(ch)) { if (u.length) u[u.length - 1].m += ch; } else u.push({ c: ch, m: '' }); } return u; };
const join = u => u.map(x => x.c + x.m).join('');
const toks = l => l.split(/\s+/).filter(w => w !== '|' && norm(w));
const lines = fs.readFileSync(P('base.txt'), 'utf8').split('\n');
const S = fs.readFileSync(P('saffarini-verses.txt'), 'utf8').split('\n').filter(Boolean).map(toks);
const M = fs.readFileSync(P('mawarid-verses.txt'), 'utf8').split('\n').filter(Boolean).map(toks);
const key = t => t.map(w => norm(w)).join(' ');
const idx = W => { const m = new Map(); for (const t of W) { const k = key(t); if (!m.has(k)) m.set(k, t); } return m; };
const SI = idx(S), MI = idx(M);
const log = []; let vn = 0, filledVerses = 0, added = 0, skipped = 0, conflictWords = 0;
const out = lines.map(l => {
  if (!l.trim() || l.startsWith('##')) return l;
  vn++;
  // a word split over the hemistichs («الـ | ـوَلِيَّ») is not touched
  if (/ـ/.test(l)) return l;
  const bt = l.split(/\s+/), bw = bt.map((w, i) => ({ w, i })).filter(x => x.w !== '|' && norm(x.w));
  const k = key(bw.map(x => x.w));
  const s = SI.get(k), m = MI.get(k);
  if (!s) return l;
  let changed = false;
  bw.forEach((x, n) => {
    const bu = units(x.w), su = units(s[n]), mu = m ? units(m[n]) : null;
    if (bu.length !== su.length || (mu && mu.length !== bu.length)) return;
    if (bu.some((b, j) => b.c !== su[j].c)) return;
    const before = join(bu);
    // a word whose existing marks disagree anywhere with S (or M) is left untouched (avoids hybrids like حَدِيدُهِمْ)
    const sameM = (a, c) => [...a].sort().join('') === [...c].sort().join('');
    if (bu.some((b, j) => b.m && ((su[j].m && !sameM(b.m, su[j].m)) || (mu && mu[j].m && !sameM(b.m, mu[j].m))))) { conflictWords++; log.push(`conflict ${vn} ${before} / S ${s[n]}${m ? ' / M ' + m[n] : ''}: word left as in base`); return; }
    bu.forEach((b, j) => {
      if (b.m || !su[j].m) return;
      if (/[اى]/.test(b.c)) return;
      if (mu) { const a = [...su[j].m].sort().join(''), c = [...mu[j].m].sort().join(''); if (a !== c) { skipped++; log.push(`skip ${vn} ${before} letter ${j + 1}: S ${s[n]} / M ${m[n]}`); return; } }
      b.m = su[j].m; added++;
    });
    const after = join(bu);
    if (after !== before) { log.push(`add ${vn} ${before} -> ${after}`); bt[x.i] = after; changed = true; }
  });
  if (changed) filledVerses++;
  return bt.join(' ');
});
log.unshift(`verses ${vn}; verses completed ${filledVerses}; marks added ${added}; letters skipped (S≠M) ${skipped}; words left untouched (mark conflict) ${conflictWords}`);
fs.writeFileSync(P('filled.txt'), out.join('\n'));
fs.writeFileSync(P('fill-log.txt'), log.join('\n') + '\n');
console.log(log[0]);
