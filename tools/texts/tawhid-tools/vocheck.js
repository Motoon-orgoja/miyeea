// lists words (outside Qur'an quotes) with a letter that carries no mark where one is expected
const fs = require('fs'), path = require('path');
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '../tawhid.json'), 'utf8'));
const D = /[ً-ْٰ]/;
const bad = {};
const texts = J.chapters.flatMap(c => [c.title, ...c.paras]);
for (const t of texts) for (const seg of t.split(/﴿[^﴾]*﴾/)) for (const w0 of seg.split(/\s+/)) {
  const w = w0.replace(/[^ء-ْٰ]/g, '');
  if (!w) continue;
  // letters with their marks
  const G = []; for (const ch of w) { if (D.test(ch)) { if (G.length) G[G.length - 1].m += ch } else G.push({ c: ch, m: '' }) }
  const skel = G.map(g => g.c).join('');
  let flag = false;
  G.forEach((g, i) => {
    if (g.m) return;
    const prev = G[i - 1], next = G[i + 1];
    if (/[اىآ]/.test(g.c)) return;
    if (g.c === 'و' && prev && /ُ/.test(prev.m)) return;
    if (g.c === 'ي' && prev && /ِ/.test(prev.m)) return;
    if (g.c === 'و' && next && next.c === 'ا' && i + 2 === G.length) return;            // waw al-jama'a
    if (g.c === 'ل' && /^[وفبك]?ا$/.test(skel.slice(0, i)) && next && /ّ/.test(next.m)) return; // shamsi lam
    if (g.c === 'ل' && /^[وفبكت]?ا$|^ل$/.test(skel.slice(0, i)) && next && next.c === 'ل') return; // اللَّه / لِلَّه
    flag = true;
  });
  if (flag) bad[w0] = (bad[w0] || 0) + 1;
}
const list = Object.entries(bad).sort((a, b) => b[1] - a[1]);
fs.writeFileSync(path.join(__dirname, '../raw/tawhid/vocheck.txt'), list.map(([w, n]) => n + '\t' + w).join('\n') + '\n');
console.log('flagged forms', list.length, 'tokens', list.reduce((a, b) => a + b[1], 0));
