// Vowel comparison of two words with the same letters: returns the list of letters where both carry a vowel/sukun/tanwin and they differ.
// (shadda is compared separately; a mark present on one side only is not a conflict)
const MARK = /[ًٌٍَُِّْٰ]/;
const split = w => { const L = []; for (const ch of w) { if (MARK.test(ch)) { if (L.length) L[L.length - 1].m += ch; } else if (/[ء-ي]/.test(ch)) L.push({ c: ch, m: '' }); } return L; };
const vow = m => m.replace(/[ّٰ]/g, '');
module.exports = function vcmp(a, b) {
  const A = split(a), B = split(b);
  if (A.length !== B.length || A.some((x, i) => x.c !== B[i].c)) return null;
  const d = [];
  A.forEach((x, i) => {
    const va = vow(x.m), vb = vow(B[i].m);
    if (va && vb && va !== vb) d.push({ i, c: x.c, a: va, b: vb, last: i === A.length - 1 });
    else if (x.m.includes('ّ') !== B[i].m.includes('ّ') && x.m && B[i].m && !(x.c === 'ل' )) d.push({ i, c: x.c, a: x.m, b: B[i].m, shadda: true, last: i === A.length - 1 });
  });
  return d;
};
// vote(f, t, k): word-level. When T's marks agree with K's on every letter both mark, and on at least one letter T and K
// together contradict the base f, the whole word is taken from K (al-Kifaya is fully vocalized, so the word stays coherent).
// Returns {w, changes:[letters where f differed]} ; letters must be identical in all three words.
module.exports.vote = function vote(f, t, k) {
  const A = split(f), B = split(t || ''), C = split(k || '');
  const same = X => X.length === A.length && X.every((x, i) => x.c === A[i].c);
  if (!same(B) || !same(C)) return { w: f, changes: [] };
  const nm = m => [...m].sort().join('');
  if (B.some((x, i) => x.m && C[i].m && nm(x.m) !== nm(C[i].m))) return { w: f, changes: [] }; // T and K disagree
  const changes = [];
  A.forEach((x, i) => { if (x.m && B[i].m && nm(B[i].m) === nm(C[i].m) && nm(x.m) !== nm(B[i].m)) changes.push({ i, c: x.c, from: x.m, to: B[i].m }); });
  if (!changes.length) return { w: f, changes };
  let j = 0, out = ''; // K's marks on f's characters (f's punctuation and brackets kept)
  for (const ch of f) { if (MARK.test(ch)) continue; out += ch; if (/[ء-ي]/.test(ch)) { out += C[j].m; j++; } }
  return { w: out, changes };
};
