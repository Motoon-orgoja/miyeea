// Completes the vocalization of the base (بكداش, which marks mostly shadda and tanween) from the matn as quoted in
// تبيين الحقائق (Bulaq, vocalized), and — only for base words تبيين does not quote — from البحر الرائق.
// Rules (logged):
//   * harakat are taken only for a base word aligned (=) with the witness word, and only when both have the same letters
//     (hamza seats, alif/alif maqsura and taa marbuta may differ: the base spelling is kept, the witness marks are used);
//   * per letter, a mark the base already has always wins; a different witness mark on that letter is logged as a conflict;
//   * witness-style fixes: no sukun before hamzat al-wasl («مِنْ الْ» -> «مِنَ الْ», «عَنْ الْ» -> «عَنِ الْ», «-هُمْ ال» -> «-هُمُ ال»,
//     otherwise kasra), no mark on an initial hamzat al-wasl («اُحْتُرِزَ» -> «احْتُرِزَ»).
// usage: node tools/texts/kanz-build/vocalize.js -> out/voc-rows.json, out/voc-conflicts.tsv, out/voc-missing.tsv
const fs = require('fs'), path = require('path'), { align, norm } = require('../umdafiqh-build/align.js');
const out = path.join(__dirname, 'out');
const rows = require('./rows.js')();
const MARK = /[ً-ْٰ]/, LET = /[ء-ي]/;
const A = [], Ai = [], Awi = [];
const toks = rows.map(r => r.text.split(' '));
toks.forEach((ws, ri) => ws.forEach((w, wi) => { if (norm(w)) { A.push(w); Ai.push(ri); Awi.push(wi); } }));
const isolated = { tabyin: 0, bahr: 0 };
const matchOf = name => {
  const W = JSON.parse(fs.readFileSync(path.join(out, name + '-words.json'), 'utf8')).filter(x => norm(x.w));
  const m = {}, J = {};
  for (const [o, i, j] of align(A.map(norm), W.map(x => norm(x.w)))) if (o === '=') { m[i] = W[j]; J[i] = j; }
  // an isolated one-word match inside a gap (e.g. base «بعد التماس» × the commentator's «أَمَّا بَعْدُ») is not trusted:
  // a match counts only when the base word before or after is matched to the neighbouring witness word too
  for (const i of Object.keys(m).map(Number)) if (J[i - 1] !== J[i] - 1 && J[i + 1] !== J[i] + 1) { delete m[i]; isolated[name]++; }
  // edge: a matched word next to a variant (its neighbour in the base is not the neighbour in the witness). Its case ending
  // may depend on the variant («كَالتَّسْمِيَةِ وَالسِّوَاكِ» × base «والتّسمية والسّواك»), so its last letter is left for the manual pass.
  const edge = {};
  for (const i of Object.keys(m).map(Number)) if (J[i - 1] !== J[i] - 1 || J[i + 1] !== J[i] + 1) edge[i] = 1;
  m.edge = edge;
  return m;
};
const T = matchOf('tabyin'), B = matchOf('bahr');
// word -> {pre, units:[{c, m}], post}
function parse(w) {
  const mm = w.match(/^([^ء-ي]*)([\s\S]*?)([^ء-يً-ْٰ]*)$/);
  const units = [];
  for (const ch of mm[2]) {
    if (MARK.test(ch)) { if (units.length) units[units.length - 1].m += ch; }
    else if (LET.test(ch)) units.push({ c: ch, m: '' });
    else if (ch === 'ـ') continue;
    else units.push({ c: ch, m: '', x: 1 });
  }
  // tanween al-fath written on the final alif/alif maqsura -> on the letter before it
  const n = units.length;
  if (n > 1 && /[اى]/.test(units[n - 1].c) && /ً/.test(units[n - 1].m)) { units[n - 1].m = units[n - 1].m.replace('ً', ''); units[n - 2].m += 'ً'; }
  units.forEach(u => u.m = [...u.m].sort((a, b) => (a === 'ّ' ? -1 : b === 'ّ' ? 1 : 0)).join(''));
  return { pre: mm[1], units, post: mm[3] };
}
const CLASS = c => /[اأإآءئؤ]/.test(c) ? 'A' : /[يى]/.test(c) ? 'Y' : /[ةه]/.test(c) ? 'H' : c;
const sub = (a, b) => [...a].every(ch => b.includes(ch));
const conflicts = [], missing = [], stat = { tabyin: 0, bahr: 0, none: 0, letters: 0, conflictWords: 0, edgeStripped: 0 };
// at an edge the last mark is kept when it is not a case ending: built particles, and a pronoun «ـهُ/ـهِ» after a vowel
const PART = /^(?:[وف]َ)?(?:إِ?نْ|لَوْ|مَنْ|مِنْ|لَمْ|عَنْ|أَوْ|بَلْ|قَدْ|إذْ|إذَا|لَا|مَا|ثُمَّ|حَتَّى|فِي|عَلَى|إلَى|إلَّا|أَنْ|إِ?نَّ|أَنَّ|كَيْ|لَنْ|هُوَ|هِيَ|هَلْ)$/;
function keepEnd(units) {
  const w = units.map(u => u.c + u.m).join(''), n = units.length;
  if (PART.test(w)) return true;
  if (n > 2 && units[n - 1].c === 'ه' && /[ُِ]/.test(units[n - 1].m) && (/[َُِ]/.test(units[n - 2].m) || /[اوي]/.test(units[n - 2].c)) && !/^(?:[وفب]َ?ِ?)?(?:ا?للَّ|لِلَّ)/.test(w)) return true;
  return false;
}
function merge(bw, ww, src, i, edge) {
  const b = parse(bw), w = parse(ww);
  if (b.units.length !== w.units.length || b.units.some((u, k) => u.x || CLASS(u.c) !== CLASS(w.units[k].c))) { stat.letters++; return null; }
  let conf = false;
  const units = b.units.map((u, k) => {
    const wm = w.units[k].m;
    if (!u.m) return { c: u.c, m: wm };
    if (!wm || sub(wm, u.m)) return u;
    if (sub(u.m, wm)) return { c: u.c, m: wm };
    conf = true; return u;
  });
  // a conflicting mark means the witness reads the word differently: keep the base word as it is (for the manual pass)
  if (conf) { stat.conflictWords++; conflicts.push([src, 'ص' + rows[Ai[i]].page, bw, ww, 'base kept'].join('\t')); return null; }
  if (edge && !keepEnd(units)) { const k = units.length - 1, bm = b.units[k].m; if (units[k].m !== bm) { units[k] = { c: units[k].c, m: bm || units[k].m.replace(/[^ّ]/g, '') }; stat.edgeStripped++; } }
  return b.pre + units.map(u => u.c + u.m).join('') + b.post;
}
const res = toks.map(ws => ws.slice());
A.forEach((w, i) => {
  let v = null, src = 'none';
  if (T[i]) { v = merge(w, T[i].w, 'tabyin', i, T.edge[i]); if (v) src = 'tabyin'; }
  if (!v && B[i]) { v = merge(w, B[i].w, 'bahr', i, B.edge[i]); if (v) src = 'bahr'; }
  stat[src]++;
  if (v) res[Ai[i]][Awi[i]] = v;
  else missing.push(['ص' + rows[Ai[i]].page, w, T[i] ? T[i].w : '', B[i] ? B[i].w : ''].join('\t'));
});
// witness-style fixes across words
let waslFix = 0, waslMark = 0, hamzaKasra = 0;
const flat = []; res.forEach((ws, ri) => ws.forEach((w, wi) => flat.push([ri, wi])));
flat.forEach(([ri, wi], k) => {
  let w = res[ri][wi];
  let w2 = w.replace(/^((?:[وف]َ)?)ا[ًٌٍَُِْ]/, "$1ا"); if (w2 !== w) waslMark++;
  // hamza under alif always carries kasra: «إنْ» -> «إِنْ» (the witnesses leave it implicit)
  if (/[ً-ْ]/.test(w2)) w2 = w2.replace(/إ(?![ًٌٍَُِّْ])/g, () => { hamzaKasra++; return 'إِ'; });
  w = w2;
  const nx = flat[k + 1] && res[flat[k + 1][0]][flat[k + 1][1]];
  if (nx && /^[«(]?ا/.test(nx) && /ْ[^ء-ْ]*$/.test(w) && !/[.،:؛]$/.test(w)) {
    const core = w.replace(/[^ء-ْ]+$/, ''), tail = w.slice(core.length);
    let v;
    if (/^(?:[وف]َ)?مِنْ$/.test(core)) v = 'َ';
    else if (/(?:هُ|هِ|كُ|تُ)مْ$/.test(core)) v = 'ُ';
    else v = 'ِ';
    w = core.slice(0, -1) + v + tail; waslFix++;
  }
  res[ri][wi] = w;
});
const outRows = rows.map((r, ri) => Object.assign({}, r, { text: res[ri].join(' ') }));
fs.writeFileSync(path.join(out, 'voc-rows.json'), JSON.stringify(outRows, null, 0).replace(/\},\{/g, '},\n{'));
fs.writeFileSync(path.join(out, 'voc-conflicts.tsv'), 'source\tpage\tbase\twitness\tresult (base marks kept)\n' + conflicts.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'voc-missing.tsv'), 'page\tbase word\ttabyin word\tbahr word\n' + missing.join('\n') + '\n');
console.log(Object.assign(stat, { words: A.length, waslFix, waslMark, hamzaKasra, isolatedDropped: isolated }));
