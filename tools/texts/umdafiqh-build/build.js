// Builds tools/texts/umdafiqh.json from the وبل الغمامة matn (out/wabl-matn.tsv) and the alignments made by collate.js
// (out/align-idda.json, out/align-azzuz.json, out/align-quotes.json).
// usage: node build.js   -> ../umdafiqh.json, out/decisions.tsv (every place where the base was changed or kept against the two copies)
//
// Decision rule, per region where the base (W) differs from BOTH independent unvocalized copies (I = العدة, Z = عزوز):
//   * I and Z read the same, and the commentator's own quotation «قوله …» (Q) inside وبل الغمامة reads like them too
//     -> the top-of-page matn of W has a slip (omission, repeat at a page break, misprint): replaced by Q's vocalized words.
//   * otherwise W is kept (it is a different, older wording — see sources.md), and the region is logged as a variant.
//   Where I and Z differ from each other, W always stands (it agrees with at least one, or the copies disagree).
const fs = require('fs');
const O = __dirname + '/out/';
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/ء/g, '').replace(/[^ء-ي]/g, '')
  .replace(/^(و|ف|ب|ل)?مايه$/, '$1ميه').replace(/^ابن$/, 'بن');
const HONOR = [['رضي', 'الله', /^عن(ه|ها|هما|هم|هن)$/], ['صلي', 'الله', 'عليه', 'وسلم'], ['عليه', 'السلام'], ['عز', 'وجل'], ['سبحانه', 'وتعالي'], ['تبارك', 'وتعالي'], ['رحمه', 'الله'], ['تعالي'], ['سبحانه']];
// ---- raw rows of W, tokenized exactly as collate.js does, keeping every raw token
const rows = [];
let ai = 0;
for (const l of fs.readFileSync(O + 'wabl-matn.tsv', 'utf8').split('\n')) {
  const c = l.split('\t'); if (c[3] !== 'M') continue;
  const raw = c[4].replace(/(\. ?){3,}/g, ' ').split(/\s+/).filter(Boolean);
  const T = raw.map(o => ({ o, w: norm(o), a: -1, honor: false }));
  const words = T.filter(t => t.w);
  for (let i = 0; i < words.length; i++) {
    const h = HONOR.find(p => p.every((q, j) => words[i + j] && (q instanceof RegExp ? q.test(words[i + j].w) : words[i + j].w === q)));
    if (h) { for (let j = 0; j < h.length; j++) words[i + j].honor = true; i += h.length - 1; continue; }
    words[i].a = ai++;
  }
  rows.push({ id: +c[0], page: +c[1], part: +c[2], T });
}
const C = { I: JSON.parse(fs.readFileSync(O + 'align-idda.json', 'utf8')), Z: JSON.parse(fs.readFileSync(O + 'align-azzuz.json', 'utf8')), Q: JSON.parse(fs.readFileSync(O + 'align-quotes.json', 'utf8')), T: JSON.parse(fs.readFileSync(O + 'align-taymiyya.json', 'utf8')) };
const A = C.I.A, N = A.length;
if (N !== ai) throw new Error('token count mismatch ' + N + ' ' + ai);
const ins = (k, c) => (C[c].INS[k] || []).map(x => { const [w, o] = x.split('|'); return { w, o }; });
// ---- regions
const bad = i => !C.I.M[i] && !C.Z.M[i];
const gapBoth = k => ins(k, 'I').length && ins(k, 'Z').length;
const del = new Set(), add = {}, log = [];
for (let k = 0; k <= N; k++) {
  if (!(k < N && bad(k)) && !gapBoth(k)) continue;
  let j = k; // region covers base words k..j-1 and the gaps before each of them and before j
  while (j < N && bad(j)) j++;
  const reading = c => { const r = []; for (let x = k; x <= j; x++) { r.push(...ins(x, c)); if (x < j && C[c].M[x]) r.push({ w: A[x][0], o: A[x][1] }); } return r; };
  const RI = reading('I'), RZ = reading('Z'), RQ = reading('Q'), RT = reading('T');
  const s = r => r.map(t => t.w).join(' ');
  const W = A.slice(k, j);
  const qCovers = (k === 0 || C.Q.M[k - 1]) && (j >= N || C.Q.M[j]);
  const tCovers = k > 0 && C.T.M[k - 1] && j < N && C.T.M[j];
  const sW = s(W.map(t => ({ w: t[0] })));
  let dec;
  if (s(RI) === s(RZ) && s(RI) !== s(W.map(t => ({ w: t[0] })))) {
    if (qCovers && s(RQ) === s(RI)) {
      dec = 'FIX';
      for (let x = k; x < j; x++) del.add(x);
      (add[k] = add[k] || []).push(...RQ.map(t => t.o));
    } else if (tCovers && RT.length && s(RT) === s(RI)) {
      dec = 'FIX-T'; // Ibn Taymiyya's quotation of the matn agrees with the two copies against W
      for (let x = k; x < j; x++) del.add(x);
      (add[k] = add[k] || []).push(...RT.map(t => t.o));
    } else if (tCovers && W.length && s(RT) === sW) dec = 'KEEP-T';
    else if (s(RQ) === sW && qCovers) dec = 'KEEP-Q'; // W and the sharh quotation agree
    else dec = 'KEEP';
  } else dec = 'KEEP-IZ-DIFFER';
  log.push([dec, A[Math.min(k, N - 1)][2], k, A.slice(Math.max(0, k - 4), k).map(t => t[1]).join(' '), W.map(t => t[1]).join(' '),
    RI.map(t => t.o).join(' '), RZ.map(t => t.o).join(' '), qCovers ? RQ.map(t => t.o).join(' ') : '(لا اقتباس)', tCovers ? RT.map(t => t.o).join(' ') : ''].join('\t'));
  k = Math.max(k, j);
}
fs.writeFileSync(O + 'decisions.tsv', 'decision\tpage\tidx\tcontext\tbase\tidda\tazzuz\tquote\n' + log.join('\n') + '\n');
// ---- vocalization of the words taken from Ibn Taymiyya's (partly vocalized) quotation — my vocalization, listed in sources.md
const MANUAL = { 298: ['وَالصَّدِيدِ'], 2008: ['وَمَنْ'], 7390: ['فِيهَا'], 7506: ['إِلاَّ'], 7727: ['وَالْمُفْرِدَ'], 7850: ['إِلَى'] };
for (const k in MANUAL) { if (!add[k]) throw new Error('no insertion at ' + k); add[k] = MANUAL[k]; }
// ---- rebuild the token stream
const fixVoc = s => s
  .replace(/ُوْ/g, 'ُو').replace(/ِيْ/g, 'ِي') // sukun on a long vowel letter (طَهُوْرًا → طَهُورًا, فِيْ → فِي)
  .replace(/ْ(?=[ً-ِ])/g, '');
const M2 = require('./manual.js'), after = {};
for (const [k, txt] of M2.OMIT) { if (A[k + 1] && C.I.M[k + 1] === undefined) throw new Error(k); (after[k] = after[k] || []).push(...txt.split(' ')); }
M2.DROP.forEach(k => del.add(k));
const out = [];
for (const r of rows) {
  let pend = null; // words to insert once the base word and its trailing punctuation are written
  const flush = () => { if (pend) { pend.forEach(o => out.push({ o, r, ins: true })); pend = null; } };
  r.T.forEach((t, n) => {
    if (t.w && pend) flush();
    if (t.a >= 0 && add[t.a]) add[t.a].forEach(o => out.push({ o, r, ins: true }));
    if (t.a >= 0 && del.has(t.a)) { if (after[t.a]) pend = after[t.a]; return; }
    out.push({ o: t.a >= 0 && M2.REPLACE[t.a] ? M2.REPLACE[t.a] : t.o, r, n, t });
    if (t.a >= 0 && after[t.a]) pend = after[t.a];
  });
  flush();
}
if (add[N]) add[N].forEach(o => out.push({ o, r: rows[rows.length - 1], ins: true }));
module.exports = { out, rows, fixVoc, log };
if (require.main === module) require('./assemble.js');
