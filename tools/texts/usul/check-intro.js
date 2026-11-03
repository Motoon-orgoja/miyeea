// Checks the «🌱 الباب ببساطة» intro of explain/<id>.json (INTRO-BRIEF.md). usage: node check-intro.js [ids…] (default: all)
const fs = require('fs'), path = require('path'), D = path.join(__dirname, 'explain');
let ids = process.argv.slice(2); if (!ids.length) ids = fs.readdirSync(D).filter(f => /^u\d+\.json$/.test(f)).map(f => f.slice(0, -5));
const bad = [], s = x => typeof x === 'string' && x.trim().length > 10;
for (const id of ids) {
  let J; try { J = JSON.parse(fs.readFileSync(path.join(D, id + '.json'), 'utf8')) } catch (e) { bad.push(id + ': ' + e.message); continue }
  const I = J.intro; if (!I) { bad.push(id + ': no intro'); continue }
  if (!s(I.what)) bad.push(id + ': what'); if (!s(I.why)) bad.push(id + ': why'); if (!s(I.example)) bad.push(id + ': example');
  if (!Array.isArray(I.steps) || I.steps.length < 2 || I.steps.length > 5 || !I.steps.every(s)) bad.push(id + ': steps (2–5 strings)');
  if (I.tip != null && !s(I.tip)) bad.push(id + ': tip');
  if (!J.pts || !J.quiz) bad.push(id + ': the rest of the file is missing');
  const DP = J.deep;
  if (!Array.isArray(DP) || DP.length !== (J.pts || []).length) bad.push(id + ': deep must have one entry per point (' + (J.pts || []).length + ')');
  else DP.forEach((d, i) => {
    if (!s(d.x)) bad.push(id + ': deep[' + i + '].x');
    if (!Array.isArray(d.ex) || d.ex.length < 2 || d.ex.length > 3 || !d.ex.every(s)) bad.push(id + ': deep[' + i + '].ex (2–3)');
    if (d.trap != null && !s(d.trap)) bad.push(id + ': deep[' + i + '].trap');
    if (!Array.isArray(d.check) || !d.check.length || d.check.length > 3 || !d.check.every(c => s(c.q) && typeof c.a === 'string' && c.a.trim())) bad.push(id + ': deep[' + i + '].check (1–3 {q,a})');
  });
  const T = J.tree, depth = (n, k) => { if (!n || typeof n.t !== 'string' || !n.t.trim()) { bad.push(id + ': tree node without t'); return k } if (n.t.split(/\s+/).length > 14) bad.push(id + ': tree node too long: ' + n.t.slice(0, 30)); return Math.max(k, ...(n.c || []).map(c => depth(c, k + 1))) };
  if (!T || !Array.isArray(T.c) || !T.c.length) bad.push(id + ': no tree'); else if (depth(T, 1) > 5) bad.push(id + ': tree deeper than 4 levels under the title');
  if (/[a-zA-Z]{3,}/.test(JSON.stringify([I, J.deep || 0, J.tree || 0]).replace(/"(what|why|steps|example|tip|x|ex|trap|check|q|a|t|c)"/g, ''))) bad.push(id + ': latin letters in the intro');
}
console.log(bad.length ? bad.join('\n') + '\n' + bad.length + ' problem(s)' : 'OK ' + ids.length);
