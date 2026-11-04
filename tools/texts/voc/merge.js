// Writes the vocalized <key>/out*.json back into tools/texts/<key>.json, keeping the original as <key>.prevoc.json (once).
// Fails if an id is missing or extra, or the counts change. usage: node merge.js <key>
const fs = require('fs'), path = require('path'), key = process.argv[2], d = path.join(__dirname, key), T = path.join(__dirname, '..');
const OUT = path.join(T, key + '.json'), BASE = path.join(T, key + '.prevoc.json');
if (!fs.existsSync(BASE)) fs.copyFileSync(OUT, BASE);
const base = JSON.parse(fs.readFileSync(BASE, 'utf8').replace(/^﻿/, '')), U = {};
for (const f of fs.readdirSync(d).filter(f => /^out\d+\.json$/.test(f))) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(d, f), 'utf8').replace(/^﻿/, '')).units)) U[id] = v.normalize('NFC').trim();
const used = new Set(), take = (id, o) => { if (!(id in U)) throw new Error('missing ' + id); used.add(id); return U[id] };
let g = null;
const json = { ...base, chapters: base.chapters.map((c, k) => { const o = { ...c, title: take('t' + k, c.title), paras: c.paras.map((p, i) => take(k + ':' + i, p)) };
  if (c.group) { if (!k || base.chapters[k - 1].group !== c.group) g = take('g' + k, c.group); o.group = g } return o }) };
const extra = Object.keys(U).filter(id => !used.has(id)); if (extra.length) throw new Error('extra ' + extra.join(' '));
fs.writeFileSync(OUT, JSON.stringify(json, null, 1) + '\n'); console.log(key, 'merged', used.size, 'units');
