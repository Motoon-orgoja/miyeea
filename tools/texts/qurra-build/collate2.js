// Second pass: N splits verses into short lemmas with commentary in between, so a hemistich is accepted when its
// words occur in N in order with gaps of at most GAP words. Otherwise the longest in-order chain is reported with the
// words of the hemistich that N lacks. Output: collation2.txt  (usage: node collate2.js)
const fs = require('fs'), path = require('path');
const norm = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ء/g, '').replace(/ؤ/g, 'و')
  .replace(/ئ/g, 'ي').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\u0621-\u064A ]/g, ' ').replace(/\s+/g, ' ').trim();
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'assembled.json'), 'utf8'));
const N = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'raw', 'qurra', 'ko97042.json'), 'utf8'));
const nw = norm(N.pages.map(p => (p.content || '').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')).join(' ')).split(' ');
const pos = new Map(); nw.forEach((w, i) => { if (!pos.has(w)) pos.set(w, []); pos.get(w).push(i); });
const GAP = +(process.argv[2] || 30);
function chain(words) { // best in-order chain starting from each occurrence of any word
  let best = { n: 0, at: -1, got: [] };
  for (let s = 0; s < words.length; s++) for (const st of (pos.get(words[s]) || [])) {
    let cur = st, got = [s];
    for (let k = s + 1; k < words.length; k++) {
      const c = (pos.get(words[k]) || []).find(p => p > cur && p - cur <= GAP);
      if (c !== undefined) { got.push(k); cur = c; }
    }
    if (got.length > best.n) best = { n: got.length, at: st, got };
    if (got.length === words.length - s && s === 0) return best;
  }
  return best;
}
const out = []; let full = 0, part = 0;
V.forEach(([a, b], i) => [['a', a], ['b', b]].forEach(([k, h]) => {
  const w = norm(h).split(' '); const c = chain(w);
  if (c.n === w.length) { full++; return; }
  part++;
  const miss = w.filter((_, j) => !c.got.includes(j));
  out.push(`${i + 1}${k}\t${h}\n\tmissing: ${miss.join(' ')}\n\tN: ${nw.slice(Math.max(0, c.at - 3), c.at + 22).join(' ')}`);
}));
out.unshift(`hemistichs fully found in order: ${full}; not: ${part}`);
fs.writeFileSync(path.join(__dirname, 'collation2.txt'), out.join('\n'));
console.log(out[0]);
