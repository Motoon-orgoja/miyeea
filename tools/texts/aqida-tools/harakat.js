// Harakat helpers: style normalization, letter/mark decomposition, per-letter vote.
const MARK = /[ً-ْ]/;
const LET = /[ء-ي]/;
const QAMARI = 'ءأإآبغحجكوخفعقيمه';
// split a word into [{c: letter, m: marks string}] ; non-letters (punctuation) kept as {c, m:'', p:1}
function units(w) {
  const u = [];
  for (const ch of w.replace(/ـ/g, '')) {
    if (MARK.test(ch) || ch === 'ٰ') { if (u.length && !u[u.length - 1].p) u[u.length - 1].m += ch; continue; }
    u.push(LET.test(ch) ? { c: ch, m: '' } : { c: ch, m: '', p: 1 });
  }
  // canonical (NFC) mark order: the vowel before the shadda; drop duplicates
  for (const x of u) { if (new Set(x.m.match(/[ً-ِْ]/g) || []).size > 1) x.m = x.m.replace(/[ً-ِْ]/g, ''); const s = [...new Set(x.m)]; x.m = s.join('').normalize('NFC'); }
  return u;
}
const join = u => u.map(x => x.c + x.m).join('');
// house style: marks never on bare alif (move a lone fatha/shadda back to an unmarked letter), tanween before alif,
// sukun on the lam of the article before a qamari letter, «اللَّه» forms.
function styl(w) {
  const u = units(w);
  const L = u.filter(x => !x.p);
  for (let i = 0; i < L.length; i++) {
    const x = L[i];
    if (x.c === 'ا' && x.m) {
      const prev = L[i - 1];
      if (prev && !prev.m && /[َّ]/.test(x.m) && !/[ً]/.test(x.m)) prev.m = x.m.replace(/[^َّ]/g, '');
      else if (prev && /ً/.test(x.m) && !prev.m.includes('ً')) prev.m = (prev.m.replace(/[َ-ِْ]/g, '')) + 'ً';
      x.m = '';
    }
    if ((x.c === 'ى') && /ً/.test(x.m)) { const prev = L[i - 1]; if (prev) prev.m = prev.m.replace(/[َ-ِْ]/g, '') + 'ً'; x.m = ''; }
  }
  // no sukun on a madd letter (الأُوْلَى → الأُولَى)
  for (let i = 1; i < L.length; i++) if (L[i].m === 'ْ' && ((L[i].c === 'و' && L[i - 1].m.endsWith('ُ')) || (L[i].c === 'ي' && L[i - 1].m.endsWith('ِ')))) L[i].m = '';
  // article lam: (prefix)ال + qamari, or لِل + qamari
  const s = L.map(x => x.c).join('');
  const m = s.match(/^((?:[وف])?(?:[بك])?)ال(.)/) || s.match(/^((?:[وف])?)لل(.)/);
  if (m && QAMARI.includes(m[2]) && !/^(?:[وف]?[بك]?)?الل?ه/.test(s)) {
    const li = m[1].length + 1; // index of the lam
    if (L[li] && L[li].c === 'ل' && !L[li].m) L[li].m = 'ْ';
  }
  // article lam before a sun letter carries no mark (اَلْنَّبِيُّ → النَّبِيُّ)
  if (m && !QAMARI.includes(m[2]) && m[2] !== 'ا') { const li = m[1].length + 1; if (L[li] && L[li].c === 'ل' && L[li].m === 'ْ') L[li].m = ''; }
  // Allah: the lam before ه in الله / لله / بالله / والله / اللهم gets shadda+fatha
  if (/^(?:[وفتب]?ا|[وف]?ل)?لله(?:م)?$/.test(s) || /^(?:[وفتب]?)?الله(?:م)?$/.test(s)) {
    const hi = L.findIndex(x => x.c === 'ه'); if (hi > 0) { L[hi - 1].m = 'َّ'; }
    if (/^[وف]?لله/.test(s) && L[s.indexOf('لله')] && !L[s.indexOf('لله')].m) L[s.indexOf('لله')].m = 'ِ';
  }
  return join(u);
}
const bare = w => w.replace(/[ً-ْٰـ]/g, '');
// per-letter vote. forms: [{src, w}] all with the same letters as target (after styl). prio: source order for ties.
function vote(target, forms, prio) {
  const T = units(styl(target)); const TL = T.filter(x => !x.p);
  const FL = forms.map(f => ({ src: f.src, L: units(styl(f.w)).filter(x => !x.p) })).filter(f => f.L.length === TL.length && f.L.every((x, i) => x.c === TL[i].c));
  const conflicts = [];
  TL.forEach((x, i) => {
    const c = {}; for (const f of FL) { const m = f.L[i].m; if (m) (c[m] = c[m] || []).push(f.src); }
    const ks = Object.keys(c);
    if (!ks.length) { x.m = ''; return; }
    ks.sort((a, b) => c[b].length - c[a].length || Math.min(...c[a].map(s => prio.indexOf(s))) - Math.min(...c[b].map(s => prio.indexOf(s))));
    x.m = ks[0];
    if (ks.length > 1) conflicts.push({ i, letter: x.c, chosen: ks[0], by: c[ks[0]], others: ks.slice(1).map(k => k + ':' + c[k].join('+')), tie: c[ks[0]].length === c[ks[1]].length });
  });
  return { w: join(T), conflicts, n: FL.length };
}
module.exports = { units, join, styl, bare, vote, MARK };
