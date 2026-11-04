// Rough rajaz scanner for fully vocalized hemistichs. Turns each hemistich into long/short syllables (with the usual
// optional readings: ishbaʿ of the pronoun هُ/هِ and of the plural مُ), then checks it against 3 rajaz feet
// (مستفعلن --u- / متفعلن u-u- / مستعلن -uu- / متعلن uuu-; last foot also --- and u--; last syllable free).
// usage: node rajaz.js <file with "a | b" lines> [--all]   -> prints verses with a hemistich that does not scan
const fs = require('fs');
const SH = 'ّ', SK = 'ْ', FA = 'َ', DA = 'ُ', KA = 'ِ', TF = 'ً', TD = 'ٌ', TK = 'ٍ', DAG = 'ٰ';
const V = { [FA]: 'a', [DA]: 'u', [KA]: 'i', [TF]: 'a', [TD]: 'u', [TK]: 'i' };
const SUN = 'تثدذرزسشصضطظلن';
// a few words whose long vowel is not written
const FIX = [[/^(وَ|فَ|بِ|لِ)?(ال)?لّ?َ?ه/, null]];
function letters(w) { // -> [{c, m:[marks]}]
  const r = [];
  for (const ch of w.normalize('NFC')) {
    if (/[ء-يٱ]/.test(ch)) r.push({ c: ch, m: '' });
    else if (/[ً-ْٰ]/.test(ch) && r.length) r[r.length - 1].m += ch;
  }
  // «لاَ», «عَالِماً»: a fatha / fath tanween typed on the alif belongs to the letter before it
  for (let i = 1; i < r.length; i++) if (r[i].c === 'ا' && /^[ًَ]+$/.test(r[i].m) && !/[ً-ِ]/.test(r[i - 1].m)) { r[i - 1].m += r[i].m; r[i].m = ''; }
  return r;
}
// words spelled without the marks that carry their weight
const SPECIAL = { 'الله': 'CvCCVC', 'لله': 'CvCCVC', 'والله': 'CvCCVC', 'بالله': 'CvCCVC', 'فالله': 'CvCCVC', 'الذي': 'CvCCvCV', 'التي': 'CvCCvCV', 'الذين': 'CvCCvCVC' };
// phonemes of one word: array of tokens 'C' (consonant) and vowels 'v' (short) / 'V' (long); plus flags
function word(w, first) {
  const L = letters(w); const out = []; let wasl = false;
  // special spellings with an unwritten long a
  const bare = L.map(x => x.c).join('');
  if (SPECIAL[bare]) {
    const lastV = /[َ-ِ]/.test(L[L.length - 1].m) ? ['v'] : [];
    const isWasl = bare[0] === 'ا';
    let ph;
    if (bare === 'الله') ph = ['C', 'C', 'V', 'C'].concat(lastV);
    else if (bare === 'الذي' || bare === 'التي') ph = ['C', 'C', 'v', 'C', 'V'];
    else if (bare === 'الذين') ph = ['C', 'C', 'v', 'C', 'V', 'C'].concat(lastV);
    else ph = ['C', 'v', 'C', 'C', 'V', 'C'].concat(lastV); // لله، والله، بالله، فالله
    if (isWasl && first) ph = ['C', 'v'].concat(ph);
    return { ph, wasl: isWasl, ishba: false };
  }
  for (let i = 0; i < L.length; i++) {
    const { c, m } = L[i];
    const prev = out[out.length - 1];
    const isFirst = i === 0;
    // hamzat al-wasl: bare alif (or ٱ) at word start
    if (isFirst && (c === 'ا' || c === 'ٱ') && !/[ً-ْ]/.test(m)) {
      wasl = true;
      if (first) out.push('C', 'v'); // pronounced with a helping vowel at the start of the hemistich
      continue;
    }
    // lam of the article before a sun letter (next letter has shadda): silent
    if (c === 'ل' && i > 0 && i <= 2 && (L[i - 1].c === 'ا' || L[i - 1].c === 'ٱ') && L[i + 1] && L[i + 1].m.includes(SH) && !/[ً-ِ]/.test(m)) continue;
    // alif of the article after a prefix (وَال، فَال، بِال، كَال، لِل): silent
    if ((c === 'ا' || c === 'ٱ') && i === 1 && L[i + 1] && L[i + 1].c === 'ل' && /[وفبك]/.test(L[0].c) && !/[ً-ْ]/.test(m)) continue;
    // long vowels written with alif/waw/yaa without their own vowel
    if (!/[ً-ْ]/.test(m)) {
      if ((c === 'ا' || c === 'ى') && prev === 'v') { out[out.length - 1] = 'V'; continue; }
      if (c === 'و' && i > 0 && prev === 'v' && L[i - 1].m.includes(DA)) { out[out.length - 1] = 'V'; continue; }
      if (c === 'ي' && i > 0 && prev === 'v' && L[i - 1].m.includes(KA)) { out[out.length - 1] = 'V'; continue; }
      if ((c === 'ا') && i === L.length - 1 && prev === 'C') continue; // alif after tanween fath (ـًا) or silent alif (الواو الجماعة)
      if (c === 'ة' || c === 'ه' && i === L.length - 1 && !m) { out.push('C'); continue; }
    }
    if (c === 'آ') { out.push('C', 'V'); continue; }
    out.push('C');
    if (m.includes(SH)) out.push('C');
    const v = [...m].find(x => V[x]);
    if (m.includes(DAG)) { out.push('V'); continue; }
    if (v) { out.push('v'); if (/[ً-ٍ]/.test(v)) out.push('C'); }
  }
  // dagger-less long a in common words
  if (/^(وَ|فَ|بِ|لِ|تَ)?(ا|ٱ)?لل?ّ?َ?هِ?ُ?َ?$/.test(w.replace(/[ْ]/g, '')) || /^(بِ|وَ|فَ)?اللَّ?ه/.test(w)) {
    // الله: make the vowel after the double lam long
    const k = out.lastIndexOf('v', out.length - 2); if (k > 0 && out[k + 1] === 'C') out[k] = 'V';
  }
  if (/^(وَ)?(هَذَا|هَذِهِ|هَذَيْنِ|ذَلِكَ|لَكِنْ|لَكِنَّ|لَكِنْ|ذَلِكُمْ|أُولَئِكَ)/.test(w)) { const k = out.indexOf('v'); if (k >= 0) out[k] = 'V'; }
  if (/الإِلَه|إِلَه|الرَّحْمَن/.test(w)) { const k = out.lastIndexOf('v', out.length - 2); if (k >= 0) out[k] = 'V'; }
  return { ph: out, wasl, ishba: /[هم][ُِ]$/.test(w.normalize('NFC').replace(/[ّ]/g, '')) };
}
function hemistich(h) {
  const ws = h.trim().split(/\s+/).filter(x => /[ء-ي]/.test(x));
  let ph = []; const opt = [];
  ws.forEach((w, i) => {
    const r = word(w, i === 0);
    if (r.wasl && i > 0) {
      // previous word: a final long vowel is shortened; a final consonant gets a helping vowel
      const last = ph[ph.length - 1];
      if (last === 'V') ph[ph.length - 1] = 'v';
      else if (last === 'C') ph.push('v');
    }
    ph = ph.concat(r.ph);
    if (r.ishba && i < ws.length - 1) opt.push(ph.length - 1);
  });
  return { ph, opt };
}
function syl(ph) { // -> string of '-' and 'u'
  let s = '';
  for (let i = 0; i < ph.length; i++) {
    if (ph[i] === 'C') continue;
    if (ph[i] === 'V') { s += '-'; if (ph[i + 1] === 'C' && ph[i + 2] !== 'v' && ph[i + 2] !== 'V') i++; continue; }
    // short vowel: closed by a following consonant that is not itself followed by a vowel
    if (ph[i + 1] === 'C' && ph[i + 2] !== 'v' && ph[i + 2] !== 'V') { s += '-'; i++; } else s += 'u';
  }
  return s;
}
const F = ['--u-', 'u-u-', '-uu-', 'uuu-'], FL = F.concat(['---', 'u--']);
function scans(s) {
  s = s.slice(0, -1) + '-'; // last syllable is free
  for (const a of F) for (const b of F) for (const c of FL) if (a + b + c === s) return true;
  return false;
}
function ok(h) {
  const { ph, opt } = hemistich(h);
  // try every combination of the optional ishbaʿ (at most 2^n, n small)
  const n = Math.min(opt.length, 6);
  for (let k = 0; k < (1 << n); k++) {
    const p = ph.slice(); for (let b = 0; b < n; b++) if (k & (1 << b)) { const idx = opt[b]; if (p[idx] === 'v') p[idx] = 'V'; }
    if (scans(syl(p))) return true;
  }
  return false;
}
module.exports = { ok, syl, hemistich };
if (require.main === module) {
  const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n'); let n = 0, bad = 0;
  for (const l of lines) {
    if (!l.includes(' | ')) continue; n++;
    const hs = l.replace(/^\S+\t/, '').split(' | ');
    const r = hs.map(ok);
    if (!r[0] || !r[1] || process.argv.includes('--all')) { bad++; console.log(n + '\t' + r.map(x => x ? '+' : '-').join('') + '\t' + l + '\t' + hs.map(h => syl(hemistich(h).ph)).join(' | ')); }
  }
  console.error('verses', n, 'flagged', bad);
}
