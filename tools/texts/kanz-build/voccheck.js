// Finds words with a letter left without a mark (after vocalize.js, or after build-time manual vocalization).
// A letter needs no mark when it is: a bare alif / alif maqsura / madda alif; و or ي of a long vowel (after ُ / ِ, or after fatha for
// diphthong-less madd like «عَلَيْ» is NOT exempt); the lam of the article before a sun letter (next letter has shadda);
// a final alif-like letter. Non-Arabic (Persian) phrases are reported too and simply skipped by the manual pass.
// usage: node voccheck.js [rows.json] -> prints counts, writes out/manual-input.txt (row \t page \t text with ⟦k:word⟧)
const fs = require('fs'), path = require('path');
const MARK = /[ً-ْٰ]/, LET = /[ء-ي]/;
function units(w) {
  const u = [];
  for (const ch of w) { if (MARK.test(ch)) { if (u.length) u[u.length - 1].m += ch; } else if (LET.test(ch)) u.push({ c: ch, m: '' }); }
  return u;
}
function incomplete(w) {
  const u = units(w); if (u.length < 2) return false;
  return u.some((x, k) => {
    if (/[ً-ِْ]/.test(x.m)) return false; // a shadda alone is not enough
    if (/[اىآ]/.test(x.c)) return false;
    const p = u[k - 1], n = u[k + 1];
    if (x.c === 'و' && p && /ُ/.test(p.m)) return false;
    if (x.c === 'ي' && p && /ِ/.test(p.m)) return false;
    if (x.c === 'ل' && n && /ّ/.test(n.m) && p && (p.c === 'ا' || (p.c === 'ل' && /ِ/.test(p.m)))) return false;
    if (k === u.length - 1 && /[اى]/.test(x.c)) return false;
    // tanween al-fath before a final alif is on this letter; a final و of the plural «-وا» after ُ is covered above
    if (k === u.length - 2 && n.c === 'ا' && /ً/.test(x.m)) return false;
    return true;
  });
}
module.exports = { incomplete };
if (require.main === module) {
  const rows = JSON.parse(fs.readFileSync(process.argv[2] || path.join(__dirname, 'out/voc-rows.json'), 'utf8'));
  let n = 0, words = 0; const L = [];
  rows.forEach((r, ri) => {
    const ws = r.text.split(' '); let hit = false;
    const o = ws.map((w, k) => { if (!/[ء-ي]/.test(w)) return w; words++; if (incomplete(w)) { n++; hit = true; return '⟦' + k + ':' + w + '⟧'; } return w; });
    if (hit) L.push(ri + '\tص' + r.page + '\t' + (r.head ? '[HEADING] ' : '') + o.join(' '));
  });
  fs.writeFileSync(path.join(__dirname, 'out/manual-input.txt'), L.join('\n') + '\n');
  console.log('words', words, 'incomplete', n, (100 * n / words).toFixed(1) + '%', 'rows', L.length);
}
