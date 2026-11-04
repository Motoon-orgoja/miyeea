// Tokens of an extracted source (out/<k>.json) for collation: one per word; a letter written apart from its word
// («و {سبح}», «ب الشمس») is joined to the next word; punctuation-only tokens are dropped.
// Each token: {w (as printed), n (normalized, see align.js), page}
const fs = require('fs'), path = require('path');
const { norm } = require('./align');
const LIG = s => s.replace(/ﷺ/g, ' صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ').replace(/﷿/g, ' عَزَّ وَجَلَّ ').replace(/﷾/g, ' سُبْحَانَهُ وَتَعَالَى ').replace(/﷽/g, ' بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ');
function load(k) {
  const P = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', k + '.json'), 'utf8')).paras, t = [];
  let carry = null;
  P.forEach(p => LIG(p.text).split(/\s+/).filter(Boolean).forEach(w => {
    if (carry) { w = carry + w; carry = null; }
    const n = norm(w);
    if (!n) { if (t.length) t[t.length - 1].w += w; return; } // punctuation-only token: stick to the previous word
    if (/^[وبفلك]$/.test(n)) { carry = w; return; }
    t.push({ w, n, page: p.page, para: p });
  }));
  return t;
}
module.exports = { load, LIG };
