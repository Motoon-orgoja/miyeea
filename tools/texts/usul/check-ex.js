// Checks tools/texts/usul/explain/<id>.json (EX-BRIEF.md): words, one explanation per key point, and the exercises.
// usage: node tools/texts/usul/check-ex.js [id ...]
const fs = require('fs'), path = require('path');
const K = path.join(__dirname, 'key'), X = path.join(__dirname, 'explain'), S = path.join(__dirname, 'source');
const KINDS = ['case', 'spot', 'why', 'diff', 'tf', 'recall'];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(X).filter(f => /^u\d+\.json$/.test(f)).map(f => f.slice(0, -5));
const bad = []; let nq = 0;
for (const id of ids) {
  const key = JSON.parse(fs.readFileSync(path.join(K, id + '.json'), 'utf8'));
  const paras = (fs.readFileSync(path.join(S, id + '.md'), 'utf8').match(/^\[\d+\]/gm) || []).length;
  const f = path.join(X, id + '.json'); if (!fs.existsSync(f)) { bad.push(id + ': missing'); continue }
  let o; try { o = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { bad.push(id + ': ' + e.message); continue }
  const str = (v, where) => { if (typeof v !== 'string' || !v.trim()) bad.push(`${id} ${where}: empty`); else if (/[*#`]|\]\(/.test(v)) bad.push(`${id} ${where}: markdown`) };
  if (!Array.isArray(o.words) || o.words.length > 12) bad.push(id + ': words must be a list of up to 12');
  (o.words || []).forEach((w, i) => { str(w.w, 'words#' + (i + 1)); str(w.m, 'words#' + (i + 1) + '.m') });
  if (!Array.isArray(o.pts) || o.pts.length !== key.length) bad.push(`${id}: ${(o.pts || []).length} explanations for ${key.length} points`);
  (o.pts || []).forEach((p, i) => { str(p.s, 'pts#' + (i + 1)); if (p.e != null) str(p.e, 'pts#' + (i + 1) + '.e') });
  if (!Array.isArray(o.quiz) || o.quiz.length > 12 || (paras > 6 && o.quiz.length < 4)) bad.push(`${id}: ${(o.quiz || []).length} exercises`);
  let recall = 0, cases = 0;
  (o.quiz || []).forEach((q, i) => {
    nq++; const w = 'quiz#' + (i + 1);
    if (!KINDS.includes(q.k)) bad.push(`${id} ${w}: kind ${q.k}`);
    if (q.k === 'recall') recall++; if (q.k === 'case') cases++;
    str(q.q, w); str(q.w, w + '.w');
    if (q.c != null) {
      if (!Array.isArray(q.c) || q.c.length < 2 || q.c.length > 4) bad.push(`${id} ${w}: 2–4 choices`);
      else { q.c.forEach((c, j) => str(c, w + '.c' + j)); if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.c.length) bad.push(`${id} ${w}: a must index c`) }
    } else str(q.a, w + '.a');
    if (!Array.isArray(q.p) || !q.p.length || q.p.some(n => !Number.isInteger(n) || n < 1 || n > paras)) bad.push(`${id} ${w}: p must be paragraph numbers 1–${paras}`);
  });
  if (recall > 1) bad.push(`${id}: ${recall} recall exercises (max 1)`);
  if ((o.quiz || []).length >= 6 && cases * 3 < o.quiz.length) bad.push(`${id}: only ${cases} case exercises`);
}
console.log(nq + ' exercises'); console.log(bad.join('\n') || 'OK');
