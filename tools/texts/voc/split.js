// Splits a prose text tools/texts/<key>.json into N parts for vocalization (BRIEF.md): <key>/inK.json = {id: text},
// "tC" chapter C's title, "gC" its group (when it differs from the previous chapter's), "C:P" paragraph P.
// usage: node split.js <key> N
const fs = require('fs'), path = require('path'), [key, N] = [process.argv[2], +process.argv[3]];
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '..', key + '.json'), 'utf8').replace(/^﻿/, ''));
const units = []; J.chapters.forEach((c, k) => {
  if (c.group && (!k || J.chapters[k - 1].group !== c.group)) units.push(['g' + k, c.group]);
  units.push(['t' + k, c.title]); c.paras.forEach((p, i) => units.push([k + ':' + i, p])) });
const words = units.reduce((s, u) => s + u[1].split(/\s+/).length, 0), per = words / N, d = path.join(__dirname, key); fs.mkdirSync(d, { recursive: true });
let part = 1, acc = 0, cur = {};
for (const [id, t] of units) { cur[id] = t; acc += t.split(/\s+/).length; if (acc >= per * part && part < N && /^\d/.test(id)) { fs.writeFileSync(path.join(d, 'in' + part + '.json'), JSON.stringify(cur, null, 1)); part++; cur = {} } }
fs.writeFileSync(path.join(d, 'in' + part + '.json'), JSON.stringify(cur, null, 1));
console.log(key, units.length, 'units,', words, 'words in', part, 'parts');
