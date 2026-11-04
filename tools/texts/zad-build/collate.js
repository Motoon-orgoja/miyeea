// Three-witness collation of زاد المستقنع, word by word (script, not by eye):
//   R = متن الزاد المفرد، نسخ وتشكيل مكتب الرحاب (ketabonline 102403, «الشاملة الذهبية», partly vocalized)  -> base (order, titles, punctuation)
//   A = زاد المستقنع ت. عبد الرحمن العسكر، دار الوطن (shamela 11230 = ketabonline 753, critical edition, unvocalized)
//   B = the matn inside «الروض المربع» ط ركائز (shamela 147658, critical edition, fully vocalized matn in parentheses)
// Wording: where R differs from A, the reading two witnesses share wins (R+B, A+B, or R+A); a region where all three differ keeps R.
// Marks: each word takes B's marks where B has the same word (same letters), merged letter by letter with R's
//        (B wins on a letter where both carry different marks); otherwise R's marks.
// Normalization for comparing: harakat, tatweel, alif/hamza forms, ى/ي, ة/ه removed or unified (align.js).
// usage: node collate.js   -> out/tokens.json, out/diff-wording.tsv, out/voc-conflict.tsv
const fs = require('fs');
const { align, norm } = require('./align.js');
const O = __dirname + '/out/';
const MK = /[ً-ْٰ]/;
const PUN = /^[^ء-ي]*|[^ء-يً-ْٰ]*$/g;

// ---------- tokenizers
const prefixJoin = toks => { // a lone «و/ف/ب/ل» (R prints «و (يَجِبُ)», B prints «(وَ)») belongs to the next word
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    const bare = t.o.replace(/[ً-ْـ]/g, '');
    if (toks[i + 1] && !toks[i + 1].title && /^([وف])?([بلك])?$/.test(bare) && bare) { toks[i + 1].o = t.o.replace(/ـ$/, '') + toks[i + 1].o; continue; }
    t.o = t.o.replace(/ـ+$/, ''); // «(يَهَبَـ)ـهُ»: the commentary completes the word outside the parentheses
    out.push(t);
  }
  return out;
};
// one spelling of the accusative tanween: on the letter before the alif («فَرْضًا», not «فَرْضاً»)
const tan = w => w.replace(/َ?اً/g, 'ًا');
const words = (line, extra) => line.split(/\s+/).filter(Boolean).map(o => Object.assign({ o: tan(o) }, extra || {}));

// R
const R = []; let basmala = '';
{
  const L = fs.readFileSync(O + 'rihab.txt', 'utf8').split('\n');
  let started = false;
  for (let l of L) {
    if (/^#PAGE 2\//.test(l)) started = true;
    if (!started || /^#PAGE/.test(l) || !l.trim()) continue;
    if (norm(l.trim()) === 'تم') break; // the copyist's «تَمَّ والحمد لله…» and the index follow
    // «(فصلٌ)», «(فصل)», «(فصلُ)», «(فصلٌ):», «(فصلٌ في الْحَجْبِ)»: the parenthesized words are the title
    const fm = l.match(/^\((فصل[^)]*)\)\s*:?\s*/);
    if (fm) {
      const ws = words(fm[1], { title: 'fasl' }); ws[0].line = true; R.push(...ws);
      l = l.slice(fm[0].length);
    }
    l = l.replace(/[()]/g, ' ').replace(/\s+ـ\s+/g, ' ').replace(/\s+[,]\s+/g, '، ').replace(/\s+/g, ' ').trim();
    if (/^بسمِ اللهِ الرحمنِ الرحيمِ$/.test(l)) { basmala = l; continue; }
    const fasl = l.match(/^فصلٌ\s+/);
    if (fasl) { R.push({ o: 'فصلٌ', title: 'fasl', line: true }); l = l.slice(fasl[0].length); }
    const isTitle = /^(كتابُ|بابُ|بابٌ)/.test(l) && l.split(' ').length <= 9 && !/[.،:]/.test(l);
    const ws = words(l, isTitle ? { title: /^كتاب/.test(l) ? 'kitab' : 'bab' } : {});
    if (ws.length) ws[0].line = true;
    R.push(...ws);
  }
}
// A
const A = [];
{
  let last = '';
  for (let l of fs.readFileSync(O + 'askar.txt', 'utf8').split('\n')) {
    if (/^#PAGE/.test(l) || !l.trim()) continue;
    if (/^## /.test(l)) { const t = l.slice(3).trim(); if (t === 'مدخل' || t === last) continue; last = t; A.push(...words(t, { title: 'h' })); continue; }
    A.push(...words(l.replace(/[0-9]+/g, ' ').replace(/["=]/g, ' ')));
  }
}
// B
const B = [];
for (const l of fs.readFileSync(O + 'rawd.txt', 'utf8').split('\n')) if (!/^#/.test(l)) B.push(...words(l.replace(/[«»"]/g, ' ')));

const prep = X => prefixJoin(X).filter(t => { t.n = norm(t.o); return t.n; });
// C = the matn passages of «الشرح الممتع» (partly vocalized): only consulted where R and B carry different marks on a letter
const C = [];
for (const l of fs.readFileSync(O + 'mumti.txt', 'utf8').split('\n')) if (!/^#/.test(l)) C.push(...words(l.replace(/[«»"]/g, ' ')));
const RR = prep(R), AA = prep(A), BB = prep(B), CC = prep(C);
console.log('words R', RR.length, 'A', AA.length, 'B', BB.length);

// ---------- alignment of A and B onto R
const map = (X) => { const m = new Int32Array(RR.length).fill(-1); for (const [op, i, j] of align(RR.map(t => t.n), X.map(t => t.n))) if (op === '=') m[i] = j; return m; };
const am = map(AA), bm = map(BB), cmap = map(CC);
// anchors where all three agree; between two consecutive anchors compare the three readings
const anchors = [-1]; for (let i = 0; i < RR.length; i++) if (am[i] >= 0 && bm[i] >= 0) anchors.push(i);
anchors.push(RR.length);
const at = (m, X, i) => i < 0 ? -1 : i >= RR.length ? X.length : m[i];

const MANUAL = require('./manual.js');
const outTok = []; // {o, n, src, title, line, r (index in R or -1)}
const diffs = [], vconf = [];
const marks = w => { const L = []; for (const ch of w) { if (MK.test(ch)) { if (L.length) L[L.length - 1].m += ch; } else if (/[ء-ي]/.test(ch)) L.push({ c: ch, m: '' }); } return L; };
const skel = w => w.replace(/[^ء-ي]/g, '');
function vocal(rw, bw, where) {
  // rw = R's (or A's) word with punctuation, bw = B's word or null. Returns the vocalized word with rw's punctuation.
  const pre = rw.match(/^[^ء-ي]*/)[0], post = rw.match(/[^ء-يً-ْٰ]*$/)[0];
  const core = rw.slice(pre.length, rw.length - post.length);
  if (!bw) return rw;
  const bcore = bw.replace(/^[^ء-ي]*/, '').replace(/[^ء-يً-ْٰ]*$/, '');
  if (skel(core) !== skel(bcore)) { // spelling differs (hamza seat, ة/ه, alif): B's spelling with its marks
    if (MK.test(bcore)) return pre + bcore + post;
    return rw;
  }
  const lr = marks(core), lb = marks(bcore); let res = '', conflict = '';
  // C's word at this place, if it has the same letters
  const cw = where >= 0 && where < RR.length && cmap[where] >= 0 ? CC[cmap[where]].o.replace(/^[^ء-ي]*/, '').replace(/[^ء-يً-ْٰ]*$/, '') : null;
  const lc = cw && skel(cw) === skel(core) ? marks(cw) : null;
  const srt = x => [...x].sort().join(''), sh = x => srt([...x].filter(c => c !== 'ّ').join(''));
  for (let k = 0; k < lr.length; k++) {
    const a = lr[k].m, b = lb[k].m; let m = b || a;
    if (a && b && srt(a) !== srt(b)) {
      if (sh(a) === sh(b) || !sh(a) || !sh(b)) m = a.length > b.length ? a : b; // one only adds a shadda
      else {
        // a third witness decides. Without one: inside the word B (where C could judge, it sided with B 234 times against 39),
        // on the case ending (last letter, or the letter before a pronoun suffix) R, the matn alone — B's ending can follow the
        // commentary's sentence (C sided with B only 179 times against 98 there). Listed as «B?» / «R?» in out/voc-conflict.tsv;
        // the clear slips left by this rule are corrected in fixes.js.
        const c = lc && lc[k].m;
        const suf = (skel(core).match(/(هما|هم|هن|ها|ه|كم|ك|نا|ي)$/) || [''])[0].length;
        const ending = k === lr.length - 1 || (suf && k === lr.length - 1 - suf);
        if (c && sh(c) === sh(a)) { m = a; conflict += 'C=R '; }
        else if (c && sh(c) === sh(b)) { m = b; conflict += 'C=B '; }
        else if (ending) { m = a; conflict += 'R? '; if (k < lr.length - 1) lr.rEnd = k; }
        else { m = b; conflict += 'B? '; }
      }
    }
    // case ending that only B gives (R left it bare): where C, a matn printed alone, ends the word otherwise, C's ending is kept
    if (k === lr.length - 1 && !sh(a) && sh(b) && lc && sh(lc[k].m) && sh(lc[k].m) !== sh(b)) {
      m = lc[k].m + (b.includes('ّ') && !lc[k].m.includes('ّ') ? 'ّ' : ''); conflict += 'last:C ';
    }
    lr[k].out = m; lr[k].b = b;
  }
  // R's ending on B's word may be no word at all («قَتْلُه» + «قَتَلَهُ» → «قَتَلُهُ»): when B decided inside the word and R on its
  // ending, the whole word follows B
  const allB = lr.map(x => x.c + (x.b || x.out)).join('');
  if (/B\?/.test(conflict) && /R\?/.test(conflict)) { lr.forEach(x => { if (x.b) x.out = x.b; }); conflict += 'whole-word:B '; }
  // R decided the vowel before a pronoun suffix: the suffix follows R too, and a bare «ه» takes the vowel that goes with it
  // («بَدَنِه» + B «بَدَنُهُ» → «بَدَنِهِ», not «بَدَنِهُ»)
  else if (lr.rEnd !== undefined) for (let j = lr.rEnd + 1; j < lr.length; j++) {
    const x = lr[j]; x.out = x.m;
    if (!x.out && x.c === 'ه' && j === lr.rEnd + 1) { const p = lr[j - 1]; x.out = /ِ/.test(p.out) || (p.c === 'ي' && /ْ/.test(p.out)) ? 'ِ' : 'ُ'; }
  }
  for (const x of lr) res += x.c + x.out;
  if (conflict) vconf.push([where, core, bcore, cw || '', res, conflict.trim()].join('\t'));
  if (/[RB]\?/.test(conflict)) vinfo.set(where, { tags: conflict, allB: pre + allB + post, res: pre + res + post });
  return pre + res + post;
}
const vinfo = new Map(); // R index -> undecided marks (R?/B?) with B's whole word
// X's words inside B's stretch: as one contiguous run if possible, else as an ordered subsequence (B interleaves commentary)
function within(X, bg) {
  if (!X.length) return [];
  const bn = bg.map(t => t.n);
  for (let x = 0; x + X.length <= bn.length; x++) if (X.every((t, y) => bn[x + y] === t.n)) return bg.slice(x, x + X.length);
  const res = []; let y = 0;
  for (const t of X) { while (y < bn.length && bn[y] !== t.n) y++; if (y >= bn.length) return null; res.push(bg[y++]); }
  return res;
}
for (let k = 0; k + 1 < anchors.length; k++) {
  const p = anchors[k], q = anchors[k + 1];
  // the anchor itself
  if (p >= 0) outTok.push(Object.assign({}, RR[p], { o: vocal(RR[p].o, BB[bm[p]].o, p), src: 'RAB', r: p }));
  if (q - p <= 1 && at(am, AA, q) - at(am, AA, p) <= 1 && at(bm, BB, q) - at(bm, BB, p) <= 1) continue;
  const rg = RR.slice(p + 1, q), ag = AA.slice(at(am, AA, p) + 1, at(am, AA, q)), bg = BB.slice(at(bm, BB, p) + 1, at(bm, BB, q));
  const s = X => X.map(t => t.n).join(''), rs = s(rg), as = s(ag), bs = s(bg);
  let pick;
  if (MANUAL[p + 1] !== undefined) pick = 'manual';
  if (pick) ;
  else if (rs === as && rs === bs) pick = 'R=A=B';
  else if (rs === as) pick = 'R=A';
  else if (rs === bs) pick = 'R=B';
  else if (as === bs) pick = 'A=B';
  else {
    // B's stretch may carry commentary words quoted in parentheses: look for each reading inside it
    const inR = rg.length && !!within(rg, bg), inA = ag.length && !!within(ag, bg);
    if (inR && !inA) pick = 'R=B'; else if (inA && !inR) pick = 'A=B';
    else if (!rg.length && !inA) pick = 'R=B'; else if (!ag.length && !inR && rg.length <= 6) pick = 'A=B';
    else pick = 'R(all differ)';
    if (pick !== 'R(all differ)') pick += '(in B)';
    // B's support found inside commentary may be an ayah or hadith the commentator quotes: no automatic insertion/deletion of more than 3 words
    if (/in B/.test(pick) && Math.abs(rg.length - ag.length) > 3) pick = 'R(check)';
  }
  let bsub = bg;
  if (/in B/.test(pick)) bsub = within(pick.startsWith('A') ? ag : rg, bg) || [];
  if (pick === 'manual') {
    // decided by hand (manual.js): 'R' keeps R's words, 'A' A's, 'B' B's stretch; or the vocalized replacement text itself
    const m = MANUAL[p + 1];
    const src = m === 'R' ? rg : m === 'A' ? ag : m === 'B' ? bsub : m.split(' ').filter(Boolean).map(o => ({ o, n: norm(o) }));
    src.forEach((t, x) => outTok.push(Object.assign({}, x === 0 && rg[0] ? { line: rg[0].line, title: rg[0].title } : {}, { o: t.o, n: t.n, src: 'manual', r: -1 })));
  } else if (pick.startsWith('A=B')) { const bg = bsub;
    // take B's words (vocalized), keep R's punctuation at the region end
    const post = rg.length ? rg[rg.length - 1].o.match(/[^ء-يً-ْٰ]*$/)[0] : '';
    bg.forEach((t, x) => outTok.push({ o: t.o.replace(/[^ء-يً-ْٰ]+$/, '') + (x === bg.length - 1 ? post : ''), n: t.n, src: 'AB', r: -1, line: x === 0 && rg[0] && rg[0].line, title: rg[0] && rg[0].title }));
  } else {
    // R's words; marks from B (if B reads the same there) word by word, else from A's alignment (no marks) — R only
    let bw = pick.startsWith('R=B') ? bsub : pick === 'R=A=B' ? bg : null;
    if (!bw && bg.length) { // B reads otherwise here: still take B's marks for the words it shares with R (word alignment inside the stretch)
      bw = new Array(rg.length).fill(null);
      for (const [op, i, j] of align(rg.map(t => t.n), bg.map(t => t.n))) if (op === '=') bw[i] = bg[j];
    }
    rg.forEach((t, x) => outTok.push(Object.assign({}, t, { o: bw ? vocal(t.o, bw[x] && bw[x].n === t.n ? bw[x].o : null, p + 1 + x) : t.o, src: bw ? 'RB' : pick === 'R=A' ? 'RA' : 'R', r: p + 1 + x })));
  }
  if (pick !== 'R=A=B') diffs.push([p + 1, pick, rg.map(t => t.o).join(' '), ag.map(t => t.o).join(' '), bg.map(t => t.o).join(' ')].join('\t'));
}
// a verb and its subject/object must agree: where an undecided «B?» (inside a word, e.g. the voice of a verb) and an undecided
// «R?» (a case ending) fall within two words of each other, both words follow B («اشْتُرِطَ نِيَّةُ», not «اشْتُرِطَ نِيَّةَ»)
let clustered = 0;
for (let i = 0; i < outTok.length; i++) {
  const t = outTok[i], v = t.r >= 0 && vinfo.get(t.r); if (!v || !/B\?/.test(v.tags)) continue;
  for (let j = Math.max(0, i - 2); j <= Math.min(outTok.length - 1, i + 2); j++) {
    const u = outTok[j], w = u.r >= 0 && vinfo.get(u.r);
    if (j !== i && w && /R\?/.test(w.tags) && u.o === w.res && w.allB !== w.res) {
      u.o = w.allB; t.o = v.allB; clustered++; vconf.push([u.r, 'next to ' + t.r, '', '', u.o, 'cluster:B'].join('\t'));
    }
  }
}
console.log('cluster fixes', clustered);
fs.writeFileSync(O + 'tokens.json', JSON.stringify({ basmala, tokens: outTok }));
fs.writeFileSync(O + 'diff-wording.tsv', 'R index\tdecision\tR (الرحاب)\tA (العسكر)\tB (الروض ط ركائز)\n' + diffs.join('\n'));
fs.writeFileSync(O + 'voc-conflict.tsv', 'R index\tR\tB\tC (الممتع)\tresult\thow\n' + vconf.join('\n'));
const cnt = {}; diffs.forEach(d => { const k = d.split('\t')[1]; cnt[k] = (cnt[k] || 0) + 1; });
console.log('anchors', anchors.length - 2, 'diff regions', diffs.length, cnt, 'voc conflicts', vconf.length);
const nov = outTok.filter(t => !MK.test(t.o)).length; console.log('output words', outTok.length, 'without any mark', nov);
