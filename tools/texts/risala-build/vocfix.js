// Systematic vocalization repairs for the Dar al-Fikr (al-Fawakih) matn, whose shakl leaves out the vowels of connected speech.
// voc(words) edits the array in place and returns log lines. Rules (each one standard Arabic orthography, no lexical choice):
//  1. إ without its kasra: إلَى → إِلَى (the base writes the hamza-under alone).
//  2. a fatha written on the wasl alif after a prefix: بِاَللَّهِ → بِاللَّهِ، وَاَلَّذِي → وَالَّذِي.
//  3. two sakins across words (word ending in sukun, next word opening with a wasl alif, no pause between):
//     مِنْ + الْـ → مِنَ ; a plural mim (ـهُمْ ـكُمْ ـتُمْ ـهِمْ، هُمْ) → damma ; واو الجماعة «ـوْا» → «ـوُا» ; everything else → kasra
//     (عَنِ، أَوِ، مَنِ، إِنِ، قَدِ، كَانَتِ، لَمْ يَجِدِ، رَكْعَتَيِ …).
//  4. bare «لا» (no mark at all) → «لَا».
//  6. the lam-alif written with the mark after the alif or without the lam's fatha: «اللاَّتِي» → «اللَّاتِي»، «إِلاَّ» → «إِلَّا»،
//     «حَلائِلُ» → «حَلَائِلُ»، «أَصْلابِكُمْ» → «أَصْلَابِكُمْ» (a bare lam between a marked letter and alif takes fatha).
//  7. lam al-amr after «وَ/فَ» before a jussive verb (the verb ends in sukun): «وَلِيُقَصِّرْ» → «وَلْيُقَصِّرْ».
//  5. a vowel the base writes on a word-initial wasl alif: «اُخْتُلِفَ» → «اخْتُلِفَ» (then rule 3: «وَقَدِ اخْتُلِفَ»).
const H = '[ًٌٍَُِّْ]';
module.exports = function voc(W) {
  const log = [], cnt = {};
  const note = (r, a, b) => { cnt[r] = (cnt[r] || 0) + 1; if (cnt[r] <= 400) log.push(`voc ${r}: ${a} → ${b}`); };
  for (let i = 0; i < W.length; i++) {
    let w = W[i], o = w;
    w = w.replace(new RegExp('إ(?!' + H + ')', 'g'), 'إِ'); if (w !== o) { note('1-hamza-kasra', o, w); o = w; }
    w = w.replace(/^([«﴿(]*[وفبكل][َِ])اَ(?=ل)/, '$1ا'); if (w !== o) { note('2-wasl-fatha', o, w); o = w; }
    w = w.replace(/^([«﴿(]*)ا[َُِ]/, '$1ا'); if (w !== o) { note('5-wasl-vowel', o, w); o = w; }
    w = w.replace(/لاَّ|لاَّ/g, 'لَّا').replace(/لاَ/g, 'لَا').replace(/([ًٌٍَُِّْ])ل(?=ا)/g, '$1لَ'); if (w !== o) { note('6-lam-alif', o, w); o = w; }
    w = w.replace(/^([«﴿(]*[وف]َ)لِ(?=[يت][^ ]*ْ[»﴾)]?[،؛:.؟!]*$)/, '$1لْ'); if (w !== o) { note('7-lam-amr', o, w); o = w; }
    if (/^[«﴿(]*لا[»﴾)]?[،؛:.؟!]*$/.test(w)) { w = w.replace('لا', 'لَا'); note('4-la', o, w); o = w; }
    W[i] = w;
  }
  for (let i = 0; i + 1 < W.length; i++) {
    const w = W[i], n = W[i + 1];
    if (!/ْ[»﴾)]?$/.test(w)) continue; // ends in sukun, no pause mark
    if (!new RegExp('^[«﴿(]*ا(?!' + H + ')').test(n)) continue; // next opens with a wasl alif
    let r;
    if (/(^|[وفَ]+)مِنْ$/.test(w.replace(/^[«﴿(]+/, '')) && /^[«﴿(]*ال/.test(n)) r = w.replace(/نْ$/, 'نَ');
    else if (/([هكت][ُِ]مْ|^[«﴿(]*هُمْ)$/.test(w)) r = w.replace(/مْ$/, 'مُ');
    else if (/وْا$/.test(w)) r = w.replace(/وْا$/, 'وُا');
    else r = w.replace(/ْ([»﴾)]?)$/, 'ِ$1');
    if (r !== w) { note('3-sakinayn', w + ' ' + n, r); W[i] = r; }
  }
  log.unshift('vocfix counts: ' + JSON.stringify(cnt));
  return log;
};
