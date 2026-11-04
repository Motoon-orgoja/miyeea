// Builds umdafiqh.json on the common (unvocalized) wording, as decided by Yusuf 2026-11-04:
//   wording  = Z (عمدة الفقه ت. عزوز, out/azzuz.txt), collated with I (متن العدة, out/idda.txt); where Z and I differ,
//              I is taken when the vocalized W text (../umdafiqh.wabl.json) reads like I there, or nearer to I than to Z
//              (W's wording is the one Ibn Taymiyya's and the commentator's quotations confirm); otherwise Z stays (all logged).
//   marks    = taken word by word from W where the word sits inside a run of at least 3 words that match W
//              (same letters after normalization); every other word is vocalized by hand in manual-voc.json.
// usage: node vulgate.js            -> ../umdafiqh.json, out/vulgate-log.tsv, out/unvoc.txt (words still to vocalize)
const fs = require('fs');
const { align, norm } = require('./align.js');
const O = __dirname + '/out/';
const AR = /[ء-ي]/, MK = /[ً-ْ]/g;
// ---- Z with its titles
// misprints of Z that neither I nor W can mend in place (checked by hand)
const ZFIX = [[/خصى رخص/, 'رخص'], [/بقضار/, 'بقضاء'], [/المسلئل/, 'المسائل'], [/فخذفه/, 'فحذفه'], [/فاقر/, 'فأقر'], [/إإلا/, 'إلا'], [/فلأولياء.$/, 'فلأولياء'], [/^الثاني: استيفاؤه/, 'الثاني استيفاؤه.']];
const Z = []; // {t:'w', o, title?}
let lastTitle = '', titleN = 0;
const ZL = fs.readFileSync(O + 'azzuz.txt', 'utf8').split('\n').filter(l => !/^#PAGE/.test(l) && l.trim());
// Z prints one page twice (صيام التطوع, pp. 41–42): a line repeated within the next 8 lines (or a heading repeated as «## …») is dropped the first time
const ZL2 = ZL.filter((l, i) => /^## /.test(l) || !ZL.slice(i + 1, i + 9).some(m => m === l || m === '## ' + l.trim()));
for (let l of ZL2) {
  if (/^(آخر الكتاب|والحمد لله رب العالمين)$/.test(l.trim())) continue; // the printer's colophon
  for (const [a, b] of ZFIX) l = l.replace(a, b);
  if (/^## /.test(l)) {
    const s = l.slice(3).replace(/\[[^\]]*\]/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    if (s === 'مدخل' || s === lastTitle || s === 'مقدمة المؤلف') continue;
    lastTitle = s; titleN++; for (const o of s.split(' ')) Z.push({ t: 'w', o, title: titleN }); continue; // titles stay in the word stream (I prints them inline)
  }
  if (l.trim() === 'مقدمة المؤلف' || l.trim() === 'بسم الله الرحمن الرحيم') continue;
  l = l.replace(/\[[^\]\d]*:\s*[\d\s\-–،]*\]?/g, ' ') // [البقرة: 275]
    .replace(/\[[^\]]*\]/g, ' ') // the editor's bracketed sub-headings («[في الهدنة]», «[الأول والثاني]») and additions
    .replace(/[\d*]+/g, ' ').replace(/"/g, ' " ');
  for (const o of l.split(/\s+/).filter(Boolean)) Z.push({ t: 'w', o });
}
// quotation marks: Z uses "…"; turn each pair into «…»
{ let open = false; for (const x of Z) if (x.t === 'w' && x.o === '"') { x.o = open ? '»' : '«'; open = !open; } }
// glue «/» to neighbour words
for (let i = 0; i < Z.length; i++) {
  const x = Z[i]; if (x.t !== 'w') continue;
  if (x.o === '«') { const n = Z.slice(i + 1).find(y => y.t === 'w' && y.o !== '«' && y.o !== '»'); if (n) n.o = '«' + n.o; x.dead = true; }
  if (x.o === '»') { for (let j = i - 1; j >= 0; j--) if (Z[j].t === 'w' && !Z[j].dead) { Z[j].o += '»'; break; } x.dead = true; }
}
const ZW = Z.filter(x => x.t === 'w' && !x.dead && norm(x.o));
Z.filter(x => x.t === 'w' && !x.dead && !norm(x.o)).forEach(x => { // punctuation-only token: stick it to the previous word
  const i = Z.indexOf(x); for (let j = i - 1; j >= 0; j--) if (Z[j].t === 'w' && !Z[j].dead && norm(Z[j].o)) { Z[j].o += x.o; break; } x.dead = true; });
// ---- I
const IW = [];
for (let l of fs.readFileSync(O + 'idda.txt', 'utf8').split('\n')) {
  if (/^#PAGE/.test(l)) continue;
  l = l.replace(/\((\d+)\)/g, ' ').replace(/\[مقدمة\]|\(متن العمدة\)/g, ' ').replace(/\[[^\]\d]*:\s*[\d\s\-–،]*\]?/g, ' ').replace(/[\d]+/g, ' ');
  for (const o of l.split(/\s+/).filter(Boolean)) if (norm(o)) IW.push(o);
}
// ---- W (the vocalized text as already corrected)
const WJ = JSON.parse(fs.readFileSync(__dirname + '/../umdafiqh.wabl.json', 'utf8'));
const WW = [];
let lastG = '';
WJ.chapters.forEach(c => { if (c.group !== lastG && c.group !== c.title) { lastG = c.group; c.group.split(' ').forEach(o => WW.push(o)); } lastG = c.group; c.title.split(' ').forEach(o => WW.push(o)); c.paras.forEach(p => p.split(' ').forEach(o => { if (norm(o)) WW.push(o); })); });
// ---- step 1: wording
const zn = ZW.map(x => norm(x.o)), inn = IW.map(norm), wn = WW.map(norm);
const zw = new Map(); for (const [op, i, j] of align(zn, wn)) if (op === '=') zw.set(i, j);
const lev = (a, b) => { const m = a.length, n = b.length; if (Math.abs(m - n) > 60) return Math.abs(m - n); let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; };
const log = [];
const repl = new Map(); // z index of first word of region -> {del:[z...], ins:[I words]}
{
  const ops = align(zn, inn);
  let cur = null, lastZ = -1;
  const close = () => {
    if (!cur) return;
    const zs = cur.z.length ? cur.z[0] : lastZ + 1, ze = cur.z.length ? cur.z[cur.z.length - 1] + 1 : lastZ + 1;
    const L = zw.get(zs - 1), R = zw.get(ze);
    const wseg = L !== undefined && R !== undefined && R > L ? wn.slice(L + 1, R).join(' ') : null;
    const zs_ = cur.z.map(i => zn[i]).join(' '), is_ = cur.i.map(j => inn[j]).join(' ');
    let dec = 'Z';
    const touchesTitle = cur.z.some(i => ZW[i].title);
    if (wseg !== null && wseg === is_ && is_ !== zs_) dec = 'I';
    else if (wseg !== null && wseg === zs_) dec = 'Z=W';
    else if (wseg !== null && is_ !== zs_ && lev(is_, wseg) < lev(zs_, wseg)) dec = 'I~'; // neither equals W: the one nearer to W (Z misprints like «البنيا»)
    if (dec === 'Z' && is_ && zs_.replace(/ /g, '') === is_.replace(/ /g, '')) dec = 'I-space'; // Z ran two words together («وزناولا»)
    if (touchesTitle && dec !== 'Z' && dec !== 'Z=W') dec = 'Z-title'; // never rewrite a heading from the inline text of I
    log.push([dec, zs, cur.z.map(i => ZW[i].o).join(' '), cur.i.map(j => IW[j]).join(' '), wseg === null ? '' : WW.slice(L + 1, R).join(' ')].join('\t'));
    if (dec === 'I' || dec === 'I~' || dec === 'I-space') repl.set(zs, { z: cur.z, ins: cur.i.map(j => IW[j]), at: zs });
    cur = null;
  };
  for (const [op, i, j] of ops) {
    if (op === '=') { close(); lastZ = i; continue; }
    if (!cur) cur = { z: [], i: [] };
    if (op === '-') cur.z.push(i); else cur.i.push(j);
  }
  close();
}
fs.writeFileSync(O + 'vulgate-log.tsv', 'decision\tz_index\tazzuz\tidda\twabl\n' + log.join('\n') + '\n');
// apply: rebuild the word list F, keeping titles in place
const delZ = new Set(), insBefore = new Map();
for (const r of repl.values()) { r.z.forEach(i => delZ.add(i)); insBefore.set(r.at, r.ins); }
const zIndex = new Map(ZW.map((x, i) => [x, i]));
const F = []; // {t:'title', s} | {t:'w', o, src}
for (const x of Z) {
  if (x.dead) continue;
  const i = zIndex.get(x); if (i === undefined) continue;
  if (insBefore.has(i)) insBefore.get(i).forEach(o => F.push({ t: 'w', o, src: 'I' }));
  if (!delZ.has(i)) F.push({ t: 'w', o: x.o, src: 'Z', title: x.title });
}
if (insBefore.has(ZW.length)) insBefore.get(ZW.length).forEach(o => F.push({ t: 'w', o, src: 'I' }));
// ---- step 2: marks from W inside matching runs of 3 or more
const FW = F.filter(x => x.t === 'w');
const fn = FW.map(x => norm(x.o));
const fw = new Array(FW.length).fill(-1);
for (const [op, i, j] of align(fn, wn)) if (op === '=') fw[i] = j;
const core = o => o.replace(/^[^ء-ي]+|[^ء-يً-ْٰ]+$/g, '');
for (let i = 0; i < FW.length; i++) {
  if (fw[i] < 0) continue;
  let a = i, b = i; // run of consecutive matched words, consecutive on both sides
  while (a > 0 && fw[a - 1] >= 0 && fw[a - 1] === fw[a] - 1) a--;
  while (b < FW.length - 1 && fw[b + 1] >= 0 && fw[b + 1] === fw[b] + 1) b++;
  if (b - a + 1 < 3) continue;
  const x = FW[i], c = core(x.o), w = core(WW[fw[i]]);
  if ((c.match(MK) || []).length >= 2 && x.src === 'Z' && /[{}]/.test(x.o + (FW[i - 1] || {}).o)) continue; // Qur'an typed vocalized in Z
  x.o = x.o.replace(c, w); x.voc = 'W';
  // Z prints little punctuation: take W's mark after the word when Z has none
  const wp = (WW[fw[i]].match(/[،.؛:؟!]+$/) || [''])[0];
  if (wp && !/[،.؛:؟!]$/.test(x.o.replace(/[»)]]+$/, ''))) x.o = x.o.replace(/([»)]*)$/, wp + '$1');
}
// fixed formulas left unvocalized: written in full
const HON = [['صلى', 'صَلَّى'], ['الله', 'اللهُ'], ['عليه', 'عَلَيْهِ'], ['وسلم', 'وَسَلَّمَ']];
for (let i = 0; i + 3 < FW.length; i++) {
  if (HON.every(([b], k) => norm(FW[i + k].o) === norm(b))) HON.forEach(([b, v], k) => { const x = FW[i + k]; if (!/[ً-ْ]/.test(x.o)) { x.o = x.o.replace(core(x.o), v); x.voc = 'H'; } });
}
const HON2 = { 'رضي الله عنه': 'رَضِيَ اللهُ عَنْهُ', 'رضي الله عنها': 'رَضِيَ اللهُ عَنْهَا', 'رضي الله عنهما': 'رَضِيَ اللهُ عَنْهُمَا', 'رضي الله عنهم': 'رَضِيَ اللهُ عَنْهُمْ', 'عليه السلام': 'عَلَيْهِ السَّلَامُ', 'عز وجل': 'عَزَّ وَجَلَّ' };
for (const [k, v] of Object.entries(HON2)) {
  const ks = k.split(' ').map(norm), vs = v.split(' ');
  for (let i = 0; i + ks.length <= FW.length; i++) if (ks.every((q, j) => norm(FW[i + j].o) === q) && FW.slice(i, i + ks.length).some(x => !/[ً-ْ]/.test(x.o)))
    vs.forEach((w, j) => { const x = FW[i + j]; x.o = x.o.replace(core(x.o), w); x.voc = 'H'; });
}
module.exports = { F, FW, WW };
if (require.main === module) {
  const left = FW.filter(x => !x.voc && !(x.o.match(MK) || []).length >= 1);
  console.log('Z words', ZW.length, 'I words', IW.length, 'W words', WW.length, 'final words', FW.length);
  console.log('Z/I regions', log.length, 'taken from I', [...repl.keys()].length, 'Z=W', log.filter(l => l.startsWith('Z=W')).length);
  console.log('marks from W', FW.filter(x => x.voc).length, 'already vocalized (Z)', FW.filter(x => !x.voc && /[ً-ْ]/.test(x.o)).length,
    'to vocalize', FW.filter(x => !x.voc && !/[ً-ْ]/.test(x.o)).length);
}
