// Collates the assembled verse list (K 1–342 + Q 343–394 + K 395–398) against
// N = «نزهة الأفكار في شرح قرة الأبصار» (المجلسي، ketabonline 97042, full text of the commentary).
// For every hemistich: is its normalized text a substring of the normalized commentary? If not, print the
// closest window of N so the difference can be judged. Output: collation.txt
// usage: node collate.js
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'qurra');
const norm = s => s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ء/g, '').replace(/ؤ/g, 'و')
  .replace(/ئ/g, 'ي').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي ]/g, ' ').replace(/\s+/g, ' ').trim();

const K = JSON.parse(fs.readFileSync(path.join(__dirname, 'K.json'), 'utf8'));
const Q = fs.readFileSync(path.join(RAW, 'Q-343-398-transcribed.txt'), 'utf8').split('\n').filter(l => /^\d+ /.test(l))
  .map(l => { const [a, b] = l.replace(/^\d+ /, '').split(' | '); return { a, b }; });
const verses = [...K.slice(0, 342), ...Q.slice(0, 52), ...K.slice(342)];
fs.writeFileSync(path.join(__dirname, 'assembled.json'), JSON.stringify(verses.map(v => [v.a, v.b])).replace(/\],\[/g, '],\n['));

const N = JSON.parse(fs.readFileSync(path.join(RAW, 'ko97042.json'), 'utf8'));
const ntext = ' ' + norm(N.pages.map(p => (p.content || '').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')).join(' ')) + ' ';
const nw = ntext.trim().split(' ');
// best window of N with the most words in common (in order-insensitive bag sense) with the hemistich
function best(h) {
  const w = h.split(' '), L = w.length; let bi = -1, bs = -1;
  const set = new Map(); w.forEach(x => set.set(x, (set.get(x) || 0) + 1));
  for (let i = 0; i + L <= nw.length; i++) {
    let s = 0; const c = new Map(set);
    for (let j = 0; j < L; j++) { const x = nw[i + j]; if (c.get(x) > 0) { s++; c.set(x, c.get(x) - 1); } }
    if (s > bs) { bs = s; bi = i; }
  }
  return { score: bs / L, text: nw.slice(bi, bi + L + 1).join(' ') };
}
const out = []; let ok = 0, miss = 0;
verses.forEach((v, i) => {
  for (const [k, h] of [['a', v.a], ['b', v.b]]) {
    const n = norm(h);
    if (ntext.includes(' ' + n + ' ')) { ok++; continue; }
    miss++;
    const b = best(n);
    out.push(`${i + 1}${k}\t${n}\n\tN≈ ${b.text}  (${(b.score * 100) | 0}%)`);
  }
});
out.unshift(`verses ${verses.length}; hemistichs found verbatim in N: ${ok}; not found: ${miss}`);
fs.writeFileSync(path.join(__dirname, 'collation.txt'), out.join('\n'));
console.log(out[0]);
