// Checks tools/texts/explain/<key>/<chapter id>.json (BRIEF.md). usage: node check.js <key> [chapter ids…]
const fs = require('fs'), path = require('path'), key = process.argv[2], D = path.join(__dirname, key);
let ids = process.argv.slice(3); if (!ids.length) ids = fs.readdirSync(path.join(D, 'src')).map(f => f.slice(0, -3));
const KINDS = ['case', 'spot', 'why', 'diff', 'tf', 'recall'], bad = [], s = x => typeof x === 'string' && x.trim().length > 3 && !/[*#`]|\]\(/.test(x);
// a term or a choice may be one short word
const sh = x => typeof x === 'string' && x.trim().length > 1 && !/[*#`]|\]\(/.test(x);
for (const id of ids) {
  const n = (fs.readFileSync(path.join(D, 'src', id + '.md'), 'utf8').match(/^\[\d+\]/gm) || []).length;
  let J; try { J = JSON.parse(fs.readFileSync(path.join(D, id + '.json'), 'utf8')) } catch (e) { bad.push(id + ': ' + e.message); continue }
  const I = J.intro || {}; ['what', 'why', 'example'].forEach(k => { if (!s(I[k])) bad.push(id + ': intro.' + k) });
  if (!Array.isArray(I.steps) || I.steps.length < 2 || I.steps.length > 5 || !I.steps.every(s)) bad.push(id + ': intro.steps (2–5)');
  if (I.tip != null && !s(I.tip)) bad.push(id + ': intro.tip');
  if (!Array.isArray(J.words) || J.words.length > 12 || !J.words.every(w => sh(w.w) && s(w.m))) bad.push(id + ': words (0–12 {w,m})');
  if (!Array.isArray(J.deep) || J.deep.length !== n) bad.push(id + ': deep must have ' + n + ' entries, one per unit');
  else J.deep.forEach((d, i) => { const w = id + ': deep[' + (i + 1) + ']';
    if (!s(d.s)) bad.push(w + '.s'); if (!s(d.x)) bad.push(w + '.x');
    if (!Array.isArray(d.ex) || d.ex.length < 1 || d.ex.length > 3 || !d.ex.every(s)) bad.push(w + '.ex (1–3)');
    if (d.trap != null && !s(d.trap)) bad.push(w + '.trap');
    if (!Array.isArray(d.check) || d.check.length < 1 || d.check.length > 3 || !d.check.every(c => s(c.q) && s(c.a))) bad.push(w + '.check (1–3 {q,a})') });
  const depth = (t, k) => { if (!t || !s(t.t)) { bad.push(id + ': tree node without t'); return k } if (t.t.split(/\s+/).length > 14) bad.push(id + ': tree node too long: ' + t.t.slice(0, 30)); return Math.max(k, ...(t.c || []).map(c => depth(c, k + 1))) };
  if (!J.tree || !Array.isArray(J.tree.c) || !J.tree.c.length) bad.push(id + ': no tree'); else if (depth(J.tree, 1) > 5) bad.push(id + ': tree too deep');
  const Q = J.quiz || []; if (!Array.isArray(Q) || Q.length > 10 || (n > 2 && Q.length < 3)) bad.push(id + ': quiz has ' + Q.length + ' (3–10)');
  let recall = 0; Q.forEach((q, i) => { const w = id + ': quiz[' + (i + 1) + ']';
    if (!KINDS.includes(q.k)) bad.push(w + ' kind'); if (q.k === 'recall') recall++;
    if (!s(q.q) || !s(q.w)) bad.push(w + ' q/w');
    if (q.c != null) { if (!Array.isArray(q.c) || q.c.length < 2 || q.c.length > 4 || !q.c.every(sh) || !Number.isInteger(q.a) || q.a < 0 || q.a >= q.c.length) bad.push(w + ' choices') }
    else if (!s(q.a)) bad.push(w + ' a');
    if (!Array.isArray(q.p) || !q.p.length || q.p.some(x => !Number.isInteger(x) || x < 1 || x > n)) bad.push(w + ' p must be unit numbers 1–' + n) });
  if (recall > 1) bad.push(id + ': more than one recall');
  if (/[a-zA-Z]{3,}/.test(JSON.stringify(J).replace(/"(intro|what|why|steps|example|tip|words|w|m|deep|s|x|ex|trap|check|q|a|tree|t|c|quiz|k|p|case|spot|diff|tf|recall)"/g, ''))) bad.push(id + ': latin letters');
}
console.log(bad.length ? bad.join('\n') + '\n' + bad.length + ' problem(s)' : 'OK ' + ids.length);
