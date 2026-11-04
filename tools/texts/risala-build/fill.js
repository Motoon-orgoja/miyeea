// fill(base, other): gives a letter of `base` the marks `other` has on the same letter when `base` has none there.
// Only when both words have exactly the same letters (marks, tatweel and punctuation aside). Never changes an existing mark.
const MARK = /[ًٌٍَُِّْٰ]/;
const split = w => { const L = []; for (const ch of w) { if (MARK.test(ch)) { if (L.length) L[L.length - 1].m += ch; } else if (/[ء-ي]/.test(ch)) L.push({ c: ch, m: '' }); } return L; };
module.exports = function fill(base, other) {
  const A = split(base), B = split(other);
  if (A.length !== B.length || A.some((x, i) => x.c !== B[i].c)) return base;
  let k = 0, out = '', changed = false;
  for (const ch of base) {
    out += ch;
    if (/[ء-ي]/.test(ch)) {
      const a = A[k], b = B[k]; k++;
      if (!a.m && b.m) { out += b.m.replace(/ّ(.)/, '$1ّ').replace(/(.)ّ/, '$1ّ'); changed = true; }
    }
  }
  return changed ? out : base;
};
