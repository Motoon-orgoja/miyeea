// Final check: the built text against each witness, word by word (normalized). Prints the number of differing regions and words.
const fs = require('fs'), path = require('path');
const { align, norm } = require('./align'); const { load } = require('./tok');
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'risala.json'), 'utf8'));
const out = [J.basmala, ...J.chapters.flatMap(c => [c.title, ...c.paras])].join(' ').split(/\s+/).map(norm).filter(Boolean);
for (const k of ['T', 'M', 'Th', 'F']) {
  const W = load(k).map(x => x.n), ops = align(out, W);
  let reg = 0, words = 0, inRun = false;
  for (const o of ops) { if (o[0] === '=') { inRun = false; continue; } words++; if (!inRun) { reg++; inRun = true; } }
  console.log(k, 'words', W.length, 'differing regions', reg, 'words involved', words);
}
console.log('output words', out.length);
