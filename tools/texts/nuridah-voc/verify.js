// Checks outN.json against inN.json: same ids, same letters once the harakat are removed, and (nearly) every word vocalized.
// usage: node verify.js N
const fs = require('fs'), path = require('path'), n = process.argv[2];
const I = JSON.parse(fs.readFileSync(path.join(__dirname, 'in' + n + '.json'), 'utf8'));
const O = JSON.parse(fs.readFileSync(path.join(__dirname, 'out' + n + '.json'), 'utf8').replace(/^﻿/, ''));
const bare = s => s.normalize('NFC').replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/\s+/g, ' ').trim();
const bad = [];
for (const id of Object.keys(I)) {
  const o = O.units && O.units[id];
  if (o == null) { bad.push(id + ': missing'); continue }
  if (bare(o) !== bare(I[id])) {
    const a = bare(I[id]).split(' '), b = bare(o).split(' '); const k = a.findIndex((w, i) => w !== b[i]);
    bad.push(id + ': letters differ near «' + a.slice(Math.max(0, k - 1), k + 2).join(' ') + '» vs «' + b.slice(Math.max(0, k - 1), k + 2).join(' ') + '»'); continue }
  const naked = o.split(/\s+/).filter(w => /[ء-ي]{3,}/.test(w) && !/[ً-ْ]/.test(w));
  if (naked.length > 1) bad.push(id + ': words without harakat: ' + naked.slice(0, 4).join(' '));
}
for (const id of Object.keys(O.units || {})) if (!(id in I)) bad.push(id + ': not in the input');
console.log(bad.length ? bad.slice(0, 40).join('\n') + '\n' + bad.length + ' problem(s)' : 'OK ' + Object.keys(I).length + ' units');
