// Checks tools/texts/usul/q/<id>.json against key/<id>.json: one question per key point, each a short line ending in «؟».
// usage: node tools/texts/usul/check-q.js [id ...]
const fs = require('fs'), path = require('path');
const K = path.join(__dirname, 'key'), Q = path.join(__dirname, 'q');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(K).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
const bad = []; let n = 0;
for (const id of ids) {
  const key = JSON.parse(fs.readFileSync(path.join(K, id + '.json'), 'utf8'));
  const f = path.join(Q, id + '.json'); if (!fs.existsSync(f)) { if (key.length) bad.push(id + ': no questions'); continue }
  let q; try { q = JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { bad.push(id + ': ' + e.message); continue }
  if (!Array.isArray(q) || q.length !== key.length) { bad.push(`${id}: ${q.length} questions for ${key.length} points`); continue }
  q.forEach((s, i) => {
    n++;
    if (typeof s !== 'string' || !/؟$/.test(s.trim())) bad.push(`${id}#${i + 1}: must end with ؟`);
    const w = String(s).split(/\s+/).length; if (w < 2 || w > 18) bad.push(`${id}#${i + 1}: ${w} words`);
  });
}
console.log(n + ' questions'); console.log(bad.join('\n') || 'OK');
