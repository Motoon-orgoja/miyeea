// Three-witness collation of «دليل الطالب», word by word (script, not by eye):
//   F = ت. الفاريابي، دار طيبة ١٤٢٥ (shamela 11196, critical edition on manuscripts, unvocalized, punctuated)  -> base (order, punctuation)
//   M = ط. المكتب الإسلامي ١٣٨٩ (ketabonline 10785, unvocalized, no punctuation)
//   N = the matn in parentheses in «نيل المآرب» ت. الأشقر (shamela 96876, partly vocalized)
// Wording: between two words the three share, the reading two witnesses agree on wins (F+M, F+N, or M+N); all three differ -> F
//   (N's stretch may also hold the commentator's own words in parentheses: a reading found inside it counts as N's, see «within»).
// Marks: a word takes N's marks where N has the same letters (N's word aligned to it).
// usage: node collate.js  -> out/tokens.json, out/diff-wording.tsv, out/stats.json
const fs = require('fs'), path = require('path'), O = path.join(__dirname, 'out') + '/';
const { align, norm } = require('../umdafiqh-build/align.js');
const MANUAL = require('./manual.js'), usedManual = new Set();
// a hand decision applies to the hunk whose F words (and M words, when given) read exactly so
const manualFor = (p, fg, mg) => { const F = fg.map(t => t.o).join(' '), M = mg.map(t => t.o).join(' ');
  const k = MANUAL.findIndex(e => (e.at === undefined || e.at === p + 1) && (e.F instanceof RegExp ? e.F.test(F) : e.F === F) && (e.M === undefined || e.M === M)); if (k >= 0) usedManual.add(k); return k >= 0 ? MANUAL[k].v : undefined; };
const tan = w => w.replace(/َ?اً/g, 'ًا');
const words = (line, extra) => line.split(/\s+/).filter(Boolean).map(o => Object.assign({ o: tan(o) }, extra || {}));
const prefixJoin = toks => {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i], bare = t.o.replace(/[ً-ْـ]/g, '');
    if (toks[i + 1] && /^([وف])?([بلك])?$/.test(bare) && bare && !t.title) { toks[i + 1].o = t.o.replace(/ـ$/, '') + toks[i + 1].o; toks[i + 1].line = toks[i + 1].line || t.line; continue; }
    t.o = t.o.replace(/ـ+$/, ''); out.push(t);
  }
  return out;
};
const prep = X => prefixJoin(X).filter(t => { t.n = norm(t.o); return t.n; });
const kindOf = s => /^كتاب/.test(norm(s)) ? 'kitab' : /^باب/.test(norm(s)) ? 'bab' : /^فصل/.test(norm(s)) ? 'fasl' : 'h';

// a «فصل في …» title is the book's when M (a print of the matn alone) has it too; otherwise it is the library's index entry or
// an editor's subtitle, and only the bare «فصل» stays
const Mnorm = ' ' + fs.readFileSync(O + 'm.txt', 'utf8').split(/\s+/).map(norm).filter(Boolean).join(' ') + ' ';
const faslTitle = t => kindOf(t) !== 'fasl' || norm(t) === 'فصل' || Mnorm.includes(' ' + t.split(/\s+/).map(norm).filter(Boolean).join(' ') + ' ') ? t : (stat0.faslReduced.push(t), 'فصل');
const stat0 = { faslReduced: [] };
// F
const F = [];
{
  const L = require(O + 'f-lines.json'); let lastH = '';
  L.forEach((l, k) => {
    if (l.kind === 'h') {
      const t = l.text.replace(/[\[\]]/g, '').trim(), nx = L[k + 1];
      if (!/^(كتاب|باب|فصل)/.test(t) || t === lastH) return; // «مدخل», «مقدمة», «وجوب الصوم»…: the library's index, not the book
      let z = k + 1; while (L[z] && L[z].kind === 'h' && !/^\[?(كتاب|باب|فصل)/.test(L[z].text)) z++; // skip «[مدخل]»
      const nx2 = L[z];
      if (nx2 && nx2.kind === 't' && norm(nx2.text.split(' ')[0]) === norm(t.split(' ')[0]) && nx2.text.split(' ').length <= 8) return; // printed again as text
      if (nx2 && nx2.kind === 'h' && nx2.text.replace(/[\[\]]/g, '').trim() === t) return; // the same index entry twice
      lastH = t;
      // an index entry «[فصل في …]» keeps its title only when M prints it (faslTitle)
      const ws = words(faslTitle(t), { title: kindOf(t), sh: 1, page: l.page }); ws[0].line = true; F.push(...ws); return;
    }
    const t = l.text.replace(/["“”]/g, ' ').replace(/[()]/g, ' ');
    const isT = /^(كتاب|باب|فصل)/.test(t) && t.split(' ').length <= 8 && !/[.:]/.test(t.replace(/[.:]$/, ''));
    const ws = words(isT ? faslTitle(t) : t, { page: l.page }); if (!ws.length) return;
    if (isT) { ws.forEach(w => w.title = kindOf(t)); lastH = l.text.replace(/[.:]$/, ''); } else lastH = '';
    ws[0].line = true; if (L[k + 1] && L[k + 1].page !== l.page) ws[ws.length - 1].pe = true; F.push(...ws);
  });
}
// M
const M = [];
for (const l of fs.readFileSync(O + 'm.txt', 'utf8').split('\n')) {
  if (!l.trim()) continue;
  const h = l.match(/^#+ (.*)$/);
  if (h) { M.push(...words(h[1], { title: kindOf(h[1]) })); continue; }
  M.push(...words(l.replace(/فصل\s*\([^)]*\)/g, 'فصل').replace(/["()]/g, ' '))); // «فصل ( متابعة الإمام )»: the editor's subtitles (3)
}
// N
const N = require(O + 'n-words.json').map(x => ({ o: tan(x.w.replace(/["«»]/g, '')), title: x.title, page: x.page })).filter(x => x.o);
const FF = prep(F), MM = prep(M), NN = prep(N);
console.log('words F', FF.length, 'M', MM.length, 'N', NN.length);
const map = X => { const m = new Int32Array(FF.length).fill(-1); for (const [op, i, j] of align(FF.map(t => t.n), X.map(t => t.n))) if (op === '=') m[i] = j; return m; };
const mm = map(MM), nm = map(NN);
const anchors = [-1]; for (let i = 0; i < FF.length; i++) if (mm[i] >= 0 && nm[i] >= 0) anchors.push(i); anchors.push(FF.length);
const at = (m, X, i) => i < 0 ? -1 : i >= FF.length ? X.length : m[i];
const MK = /[ً-ْٰ]/, skel = w => w.replace(/[^ء-ي]/g, '');
const core = w => w.replace(/^[^ء-ي]*/, '').replace(/[^ء-يً-ْٰ]*$/, '');
const stat = { voc: 0, vocSpell: 0 };
// F's word with N's marks (same letters): N's core inside F's punctuation
function vocal(fw, nw) {
  if (!nw || !MK.test(nw)) return fw;
  const pre = fw.match(/^[^ء-ي]*/)[0], post = fw.match(/[^ء-يً-ْٰ]*$/)[0], c = fw.slice(pre.length, fw.length - post.length), nc = core(nw);
  if (skel(c) === skel(nc)) { stat.voc++; return pre + nc + post; }
  if (norm(c) === norm(nc)) { stat.vocSpell++; return pre + nc + post; } // spelling differs only in hamza seat/alif: N's spelling with its marks
  return fw;
}
function within(X, bg) {
  if (!X.length) return [];
  const bn = bg.map(t => t.n);
  for (let x = 0; x + X.length <= bn.length; x++) if (X.every((t, y) => bn[x + y] === t.n)) return bg.slice(x, x + X.length);
  return null;
}
const out = [], diffs = [], picks = {};
const titleOf = X => { const t = X.find(t => t.title); return t ? t.title : undefined; };
for (let k = 0; k + 1 < anchors.length; k++) {
  const p = anchors[k], q = anchors[k + 1];
  if (p >= 0) out.push(Object.assign({}, FF[p], { o: vocal(FF[p].o, NN[nm[p]].o), src: 'FMN', title: FF[p].title || MM[mm[p]].title || NN[nm[p]].title, f: p }));
  const fg = FF.slice(p + 1, q), mg = MM.slice(at(mm, MM, p) + 1, at(mm, MM, q)), ng = NN.slice(at(nm, NN, p) + 1, at(nm, NN, q));
  if (!fg.length && !mg.length && !ng.length) continue;
  const s = X => X.map(t => t.n).join(''), fs_ = s(fg), ms = s(mg), ns = s(ng);
  let pick;
  const mv = manualFor(p, fg, mg);
  if (mv !== undefined) pick = 'manual';
  else if (fs_ === ms && fs_ === ns) pick = 'F=M=N';
  else if (fs_ === ms) pick = 'F=M';
  else if (fs_ === ns) pick = 'F=N';
  else if (ms === ns) pick = 'M=N';
  else {
    const inF = fg.length && !!within(fg, ng), inM = mg.length && !!within(mg, ng);
    if (inF && !inM) pick = 'F=N(in N)'; else if (inM && !inF) pick = 'M=N(in N)'; else pick = 'F(all differ)';
  }
  // headings: a كتاب/باب heading of F is never voted away; the commentary editor's own «فصل في …» titles (N) are not taken in
  if (/^M=N/.test(pick) && fg.some(t => t.title === 'kitab' || t.title === 'bab') && !(pick.includes('in N') ? mg : ng).length) pick = 'F(heading)';
  if (/^M=N/.test(pick) && !titleOf(fg) && !titleOf(mg) && (pick.includes('in N') ? within(mg, ng) : ng).some(t => t.title)) pick = 'F(N-subtitle)';
  // more than 3 words inserted/deleted against F: listed for review as «big» (all were read: F's digital copy repeats or drops lines)
  if (/^M=N/.test(pick) && Math.abs(fg.length - (pick.includes('in N') ? mg.length : ng.length)) > 3) pick += '(big)';
  picks[pick] = (picks[pick] || 0) + 1;
  if (pick === 'manual') {
    const m = mv;
    if (m === 'F' || m.drop !== undefined) { // F's words, with N's marks where N has the same word
      const f2 = fg.slice(m.drop || 0), nw = new Array(f2.length).fill(null);
      for (const [op, i, j] of align(f2.map(t => t.n), ng.map(t => t.n))) if (op === '=') nw[i] = ng[j];
      f2.forEach((t, x) => out.push(Object.assign({}, t, { o: vocal(t.o, nw[x] && nw[x].o), src: 'manual', line: t.line || x === 0 })));
      diffs.push([p + 1, (fg[0] || {}).page, 'manual', fg.map(t => t.o).join(' '), mg.map(t => t.o).join(' '), ng.map(t => t.o).join(' '), ''].join('	'));
      continue;
    }
    if (m === 'MN') { // M's words, with N's marks where N has the same word (a passage F's digital copy lacks; N quotes it only in part)
      const nw = new Array(mg.length).fill(null);
      for (const [op, i, j] of align(mg.map(t => t.n), ng.map(t => t.n))) if (op === '=') nw[i] = ng[j];
      mg.forEach((t, x) => out.push({ o: vocal(t.o, nw[x] && nw[x].o), n: t.n, src: 'manual', title: t.title, line: (x === 0 && fg[0] && fg[0].line) || (!!t.title && !(mg[x - 1] && mg[x - 1].title)), f: -1 }));
      diffs.push([p + 1, (fg[0] || {}).page, 'manual:MN', fg.map(t => t.o).join(' '), mg.map(t => t.o).join(' '), ng.map(t => t.o).join(' '), ''].join('	'));
      continue;
    }
    let src = m === 'M' ? mg : m === 'N' ? ng : m.split(' ').filter(Boolean).map(o => ({ o, n: norm(o) }));
    if (typeof m === 'string' && m.length > 1) { const nw = new Array(src.length).fill(null); for (const [op, i, j] of align(src.map(t => t.n), ng.map(t => t.n))) if (op === '=') nw[i] = ng[j];
      src = src.map((t, x) => Object.assign({}, t, { o: MK.test(t.o) ? t.o : vocal(t.o, nw[x] && nw[x].o) })); }
    src.forEach((t, x) => out.push({ o: t.o, n: t.n, src: 'manual', line: x === 0 && fg[0] && fg[0].line, title: t.title || (fg[0] && fg[0].title), f: -1 }));
  } else if (pick.startsWith('M=N')) {
    const src = pick.includes('in N') ? within(mg, ng) : ng, post = fg.length ? fg[fg.length - 1].o.match(/[^ء-يً-ْٰ]*$/)[0] : '';
    const mt = titleOf(mg);
    // a pure insertion right after F's «…:» continues F's clause: the colon moves to the end of the inserted words
    let post2 = post; const prev = out[out.length - 1];
    if (!fg.length && src.length && !mt && prev && /:$/.test(prev.o) && !src.some(t => t.title)) { prev.o = prev.o.replace(/:$/, ''); post2 = ':'; stat.colonMoved = (stat.colonMoved || 0) + 1; }
    src.forEach((t, x) => out.push({ o: t.o.replace(/[^ء-يً-ْٰ]+$/, '') + (x === src.length - 1 ? post2 : ''), n: t.n, src: 'MN', title: mt || t.title, line: (x === 0 && fg[0] && fg[0].line) || (!!mt && x === 0), f: -1 }));
  } else if (pick === 'F(all differ)' && mg.length && ng.length) {
    // the three readings differ as wholes: vote word by word inside the stretch. Local pairwise alignments F-M, F-N, M-N;
    // an F word stays if M or N has it; an M word that N also has (and F lacks) is put in, in M's order, with N's spelling and marks.
    const pair = (X, Y) => { const r = new Int32Array(X.length).fill(-1); for (const [op, i, j] of align(X.map(t => t.n), Y.map(t => t.n))) if (op === '=') r[i] = j; return r; };
    const fm = pair(fg, mg), fn = pair(fg, ng), mn = pair(mg, ng);
    const mUsed = new Set(fm), nUsed = new Set(fn);
    const ins = mg.map((t, j) => !mUsed.has(j) && mn[j] >= 0 && !nUsed.has(mn[j]));
    // an F word that neither M nor N has is dropped only when M and N replace it with their common words (in the same gap of
    // F's M-matched words), or when both lack anything there; otherwise F stays (two different readings against F = no majority)
    const sup = i => fm[i] >= 0 || fn[i] >= 0 || fg[i].title;
    const keep = fg.map((t, i) => {
      if (sup(i)) return true;
      let pi = i - 1; while (pi >= 0 && fm[pi] < 0) pi--; let ni = i + 1; while (ni < fg.length && fm[ni] < 0) ni++;
      const mlo = pi >= 0 ? fm[pi] + 1 : 0, mhi = ni < fg.length ? fm[ni] : mg.length;
      if (ins.slice(mlo, mhi).some(Boolean)) return false;
      let pn = i - 1; while (pn >= 0 && fn[pn] < 0) pn--; let nn = i + 1; while (nn < fg.length && fn[nn] < 0) nn++;
      const nlo = pn >= 0 ? fn[pn] + 1 : 0, nhi = nn < fg.length ? fn[nn] : ng.length;
      return !(mhi <= mlo && nhi <= nlo && pn >= 0 && nn < fg.length);
    });
    const res = [], todo = mg.map((t, j) => j).filter(j => ins[j]); let q0 = 0;
    const flushWhile = ok => { while (q0 < todo.length && ok(todo[q0])) { const j = todo[q0++]; res.push({ o: ng[mn[j]].o.replace(/[^ء-يً-ْٰ]+$/, ''), n: ng[mn[j]].n, src: 'MN', f: -1 }); } };
    fg.forEach((t, i) => {
      if (fm[i] >= 0) flushWhile(j => j < fm[i]); else if (fn[i] >= 0) flushWhile(j => mn[j] < fn[i]);
      if (keep[i]) res.push(Object.assign({}, t, { o: vocal(t.o, fn[i] >= 0 ? ng[fn[i]].o : null), src: fm[i] >= 0 && fn[i] >= 0 ? 'FMN' : fm[i] >= 0 ? 'F=M' : fn[i] >= 0 ? 'F=N' : 'F', f: p + 1 + i }));
    });
    flushWhile(() => true);
    // keep F's line start / heading flag and its closing punctuation
    if (res.length && fg[0]) { res[0].line = res[0].line || fg[0].line; }
    const post = fg.length ? fg[fg.length - 1].o.match(/[^ء-يً-ْٰ]*$/)[0] : '';
    if (res.length && post && !/[^ء-يً-ْٰ]$/.test(res[res.length - 1].o)) res[res.length - 1].o += post;
    const changed = res.map(t => t.n).join(' ') !== fg.map(t => t.n).join(' ');
    out.push(...res);
    const nch = Math.abs(res.length - fg.length) + res.filter(t => t.src === 'MN').length;
    pick = !changed ? 'F(all differ)' : nch > 3 ? 'F(all differ)→words(big)' : 'F(all differ)→words';
    diffs.push([p + 1, (fg[0] || FF[Math.max(p, 0)]).page, pick, fg.map(t => t.o).join(' '), mg.map(t => t.o).join(' '), ng.map(t => t.o).join(' '), '⇒ ' + res.map(t => t.o).join(' ')].join('	'));
    continue;
  } else {
    let nw = pick === 'F=N' || pick === 'F=M=N' ? ng : pick === 'F=N(in N)' ? within(fg, ng) : null;
    if (!nw && ng.length) { nw = new Array(fg.length).fill(null); for (const [op, i, j] of align(fg.map(t => t.n), ng.map(t => t.n))) if (op === '=') nw[i] = ng[j]; }
    const mt = pick.startsWith('F=M') ? titleOf(mg) : undefined;
    fg.forEach((t, x) => out.push(Object.assign({}, t, { o: vocal(t.o, nw && nw[x] && nw[x].n === t.n ? nw[x].o : null), src: pick.replace(/\(.*/, ''), title: t.title || mt, f: p + 1 + x })));
  }
  if (pick !== 'F=M=N') diffs.push([p + 1, (fg[0] || FF[Math.max(p, 0)]).page, pick, fg.map(t => t.o).join(' '), mg.map(t => t.o).join(' '), ng.map(t => t.o).join(' '),
    FF.slice(Math.max(0, p - 4), p + 1).map(t => t.o).join(' ')].join('\t'));
}
// N's marks on a word's last letter (its case ending) are kept only where N's next word is ours too: where the commentator's
// sentence goes on otherwise, his ending may follow his own syntax («فرضٌ لزوجٍ» against the matn's «فرض الزوج»)
{
  const on = out.map(t => norm(t.o)), nn = NN.map(t => t.n);
  const om = new Int32Array(out.length).fill(-1); for (const [op, i, j] of align(on, nn)) if (op === '=') om[i] = j;
  // F's digital copy closes the last line of a page with «.» even mid-sentence («بتسع. ⟂ تكبيرات»): the stop goes when N runs on
  // without a stop and the next page does not open a new sentence (a heading, an ordinal «الثاني:», or a word in و/ف)
  out.forEach((t, i) => {
    if (!t.pe || !/\.$/.test(t.o) || om[i] < 0 || i + 1 >= out.length || om[i + 1] !== om[i] + 1) return;
    const nx = out[i + 1];
    if (/[.:،؛]$/.test(NN[om[i]].o) || nx.title || /^[وف]/.test(nx.o) || /:$/.test(nx.o) || /^(فصل|باب|كتاب|ثم|خاتمه)$/.test(norm(nx.o))) return;
    t.o = t.o.replace(/\.$/, ''); stat.pageStop = (stat.pageStop || 0) + 1; (stat.pageStopAt = stat.pageStopAt || []).push(t.o + ' ⟂ ' + out[i + 1].o);
  });
  out.forEach((t, i) => {
    if (om[i] < 0 || !MK.test(t.o)) return;
    const nextOk = i + 1 >= out.length || (om[i + 1] === om[i] + 1);
    if (nextOk) return;
    const m = t.o.match(/^(.*[ء-ي])([ً-ْ]*)([^ء-يً-ْ]*)$/); if (!m || !m[2]) return;
    const kept = m[2].replace(/[ًٌٍَُِْ]/g, ''); // a shadda stays, the vowel/tanween/sukun goes
    if (kept !== m[2]) { stat.endStripped = (stat.endStripped || 0) + 1; t.o = m[1] + kept + m[3]; }
  });
}
const unused = MANUAL.filter((e, k) => !usedManual.has(k)); if (unused.length) { console.error('manual entries not applied:', unused.map(e => e.F)); process.exitCode = 1; }
fs.writeFileSync(O + 'tokens.json', JSON.stringify(out));
fs.writeFileSync(O + 'diff-wording.tsv', 'at\tpage\tpick\tF\tM\tN\tcontext(F)\n' + diffs.join('\n') + '\n');
const W = out.filter(t => /[ء-ي]/.test(t.o)), L = W.reduce((s, t) => s + skel(t.o).length, 0), H = W.reduce((s, t) => s + (t.o.match(/[ً-ْ]/g) || []).length, 0);
const st = { faslReduced: stat0.faslReduced, out: out.length, anchors: anchors.length, picks, ...stat, wordsWithMarks: W.filter(t => MK.test(t.o)).length, marksPerLetter: +(H / L).toFixed(3) };
fs.writeFileSync(O + 'stats.json', JSON.stringify(st, null, 1)); console.log(st);
