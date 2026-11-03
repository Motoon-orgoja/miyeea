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
  if (/[a-zA-Z]{3,}/.test(JSON.stringify(I))) bad.push(id + ': latin letters in the intro');
}
console.log(bad.length ? bad.join('\n') + '\n' + bad.length + ' problem(s)' : 'OK ' + ids.length);
