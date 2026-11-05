// Paragraph cutting shared by vulgate.js: sentences end at «. ؟ !» outside quotes; paragraphs of about 8–40 words;
// a sentence over 40 words is cut at «؛» then «،» (inside a long quotation if it must). A row {fasl:true} starts a paragraph «فَصْلٌ:».
const words = s => s.split(' ').filter(Boolean);
function splitLong(u, anyDepth) {
  if (u.length <= 40) return [u];
  const cuts = []; let d = 0;
  u.forEach((w, i) => { d += (w.match(/[«﴿]/g) || []).length - (w.match(/[»﴾]/g) || []).length; if ((d <= 0 || anyDepth) && i < u.length - 1) { if (/؛$/.test(w)) cuts.push([i, 2]); else if (/[،:]$/.test(w)) cuts.push([i, 1]); } });
  let best = null;
  for (const [i, pr] of cuts) { const a = i + 1, b = u.length - a; if (a < 8 || b < 8) continue; const sc = pr * 100 - Math.abs(a - b); if (!best || sc > best[1]) best = [i, sc]; }
  if (!best && anyDepth) { // no punctuation to cut at: cut before a word opening with «وَ/فَ» (a new clause), nearest the middle
    u.forEach((w, i) => { const a = i, b = u.length - i; if (a >= 8 && b >= 8 && /^[«(]?(?:[وف]|ثم$)/.test(w)) { const sc = -Math.abs(a - b); if (!best || sc > best[1]) best = [i - 1, sc]; } });
    if (!best) return [u];
  }
  if (!best) return splitLong(u, true);
  return [...splitLong(u.slice(0, best[0] + 1), anyDepth), ...splitLong(u.slice(best[0] + 1), anyDepth)];
}
function pack(units, P) {
  let cur = [];
  for (const u0 of units) for (const u of splitLong(u0)) {
    if (cur.length && (cur.length + u.length > 40 || (cur.length >= 8 && cur.length + u.length > 30))) { P.push(cur); cur = []; }
    cur = cur.concat(u);
  }
  if (cur.length) {
    if (cur.length < 8 && P.length && P[P.length - 1].length + cur.length <= 48) P[P.length - 1] = P[P.length - 1].concat(cur);
    else P.push(cur);
  }
}
function paras(rowsIn) {
  const P = [];
  let units = [], buf = [], depth = 0;
  const flush = () => { if (buf.length) units.push(buf); buf = []; pack(units, P); units = []; };
  for (const r of rowsIn) {
    if (r.fasl) { flush(); buf = [r.text || 'فَصْلٌ:']; continue; }
    for (const w of words(r.text)) {
      buf.push(w);
      depth += (w.match(/[«﴿]/g) || []).length - (w.match(/[»﴾]/g) || []).length;
      if (depth <= 0 && /[.؟!]["»﴾)]*$/.test(w)) { units.push(buf); buf = []; depth = 0; }
    }
  }
  flush();
  return P.map(p => p.join(' '));
}
module.exports = { paras, words };
