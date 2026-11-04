// Replaces the words of Qur'an quotes (tokens with q:1) by the Mushaf text (tanzil quran-simple, imla'i, pause marks dropped).
// Each run of q tokens is cut greedily into the longest pieces found contiguously in the Mushaf; among several places
// the one whose case endings agree best with the source's own vocalization is taken. Returns {tokens, report}.
const { norm, quran, words } = require('./lib');
const { styl } = require('./harakat');
const qn = w => norm(w.replace(/ة/g, 'ت').replace(/[ءأإآؤئ]/g, '')).replace(/[اء]/g, '').replace(/ى/g, 'ي');
let F = null;
function flat() { if (!F) { F = quran().flat.map(x => ({ ...x, k: qn(x.w) })); } return F; }
const PUNCT = /([.،؛:!؟?…\-]+|\.\.\.)$/;
function fill(tokens) {
  const Fl = flat(), out = [], rep = [];
  let i = 0;
  while (i < tokens.length) {
    if (!tokens[i].q) { out.push(tokens[i]); i++; continue; }
    let e = i; while (e < tokens.length && tokens[e].q) e++;
    const run = tokens.slice(i, e);
    let p = 0, lastEnd = -1;
    while (p < run.length) {
      // longest match starting at p
      let best = null; const k0 = qn(run[p].w);
      for (let k = 0; k < Fl.length; k++) {
        if (Fl[k].k !== k0) continue;
        let L = 0; while (p + L < run.length && k + L < Fl.length && Fl[k + L].k === qn(run[p + L].w)) L++;
        let score = 0; for (let t = 0; t < L; t++) if (styl(run[p + t].w.replace(PUNCT, '')) === Fl[k + t].w) score++;
        const cont = k === lastEnd ? 1 : 0;
        if (!best || L > best.L || (L === best.L && (cont > best.cont || (cont === best.cont && score > best.score)))) best = { k, L, score, cont };
      }
      if (!best) { rep.push('NOT FOUND: ' + run[p].w + ' | ' + run.map(x => x.w).join(' ')); out.push({ ...run[p], q: 0, qmiss: 1 }); p++; lastEnd = -1; continue; }
      const piece = [];
      for (let t = 0; t < best.L; t++) {
        const src = run[p + t], m = src.w.match(PUNCT);
        let mw = Fl[best.k + t].w;
        // imla'i: the Mushaf's open taa (كَلِمَتُ، رَحْمَتَ) is written as taa marbuta where the source has it
        if (/ة/.test(src.w) && !/ة/.test(mw)) { const pos = [...src.w.replace(/[ً-ْ]/g, '')].lastIndexOf('ة'); mw = mw.replace(/ت(?=[ً-ْ]*$)/, 'ة'); }
        piece.push({ ...src, w: mw, punct: m ? m[0] : '', qref: Fl[best.k + t].s + ':' + Fl[best.k + t].a });
      }
      piece[0].qopen = 1; piece[piece.length - 1].qclose = 1;
      const a = Fl[best.k], b = Fl[best.k + best.L - 1];
      rep.push(`${a.s}:${a.a}${b.a !== a.a || b.s !== a.s ? '-' + b.a : ''}\t${best.L} words\t${run.slice(p, p + best.L).map(x => x.w).join(' ')}`);
      out.push(...piece); lastEnd = best.k + best.L; p += best.L;
    }
    i = e;
  }
  return { tokens: out, report: rep };
}
module.exports = { fill, qn };
