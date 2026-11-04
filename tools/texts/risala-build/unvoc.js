// isUnvoc(word): true when a letter of the word lacks its mark. Letters that need none: ا ى آ ٱ ء-after-alif-at-end,
// the lam of the article before a sun letter (the next letter carries shadda), madd و/ي after their vowel, the alif of «ال» / wasl,
// the و of «عَمْرٌو»-type spellings and alif al-fariqa after «وْ/وا».
const MARK = /[ًٌٍَُِّْٰ]/;
function isUnvoc(word) {
  const w = word.replace(/[^ء-يًٌٍَُِّْٰٱ]/g, '');
  const L = [...w];
  for (let i = 0; i < L.length; i++) {
    const c = L[i];
    if (MARK.test(c)) continue;
    const next = L[i + 1] || ''; let prev = ''; for (let j = i - 1; j >= 0 && MARK.test(L[j]); j--) prev += L[j];
    if (MARK.test(next)) continue;
    if ('اىآٱ'.includes(c)) continue;
    if (c === 'ء' && i === L.length - 1) continue;
    if (c === 'ل' && L[i - 1] === 'ا' && /[تثدذرزسشصضطظلن]/.test(L[i + 1] || '')) continue; // sun-letter article
    if (c === 'و' && (prev.includes('ُ') || L[i + 1] === 'ا' && i === L.length - 2)) continue;
    if (c === 'ي' && prev.includes('ِ')) continue;
    if (c === 'ل' && L[i - 1] === 'ِ' && L[i - 2] === 'ل' && /[تثدذرزسشصضطظلن]/.test(L[i + 1] || '')) continue; // لِلذَّكَرِ
    return true;
  }
  return false;
}
module.exports = isUnvoc;
