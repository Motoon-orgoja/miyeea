// Lists suspicious vocalization in ../zad.json (for the hand fixes in fixes.js): two short vowels on one letter, a vowel on a
// long alif, «إ» with fatha/damma, «أ» with kasra, a doubled tanween, a word with no mark at all.
const J = require('../zad.json');
const words = []; J.chapters.forEach((c, ci) => [c.title, ...c.paras].forEach(p => p.split(' ').forEach(w => words.push([ci, w]))));
const tests = {
  'two vowels': /[َ-ًِ-ٍ]ّ?[َ-ًِ-ٍ]/,
  'vowel on alif': /ا[َ-ِْ]/,
  'إ with fatha/damma': /إ[َُ]/,
  'أ with kasra': /أِ/,
  'tanween + alif + tanween': /ًاً/,
  'no mark': /^[^ً-ْ]*$/,
};
for (const [k, re] of Object.entries(tests)) {
  const hit = words.filter(([, w]) => /[ء-ي]/.test(w) && re.test(w));
  console.log('== ' + k + ': ' + hit.length); console.log([...new Set(hit.map(x => x[1]))].slice(0, 80).join(' '));
}
