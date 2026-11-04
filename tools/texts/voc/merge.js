// Writes the vocalized <key>/out*.json back into tools/texts/<key>.json (or .txt for a poem), keeping the original as
// <key>.prevoc.json|txt (once). Fails if an id is missing or extra. usage: node merge.js <key>
const fs = require('fs'), path = require('path'), key = process.argv[2], d = path.join(__dirname, key), T = path.join(__dirname, '..');
const poem = fs.existsSync(path.join(T, key + '.txt')), ext = poem ? '.txt' : '.json';
const OUT = path.join(T, key + ext), BASE = path.join(T, key + '.prevoc' + ext);
if (!fs.existsSync(BASE)) fs.copyFileSync(OUT, BASE);
const U = {};
for (const f of fs.readdirSync(d).filter(f => /^out\d+\.json$/.test(f))) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(d, f), 'utf8').replace(/^﻿/, '')).units)) U[id] = v.normalize('NFC').trim();
// a poem: each non-empty line of the base is replaced by its unit "L<line number>"
if (poem) {
  const lines = fs.readFileSync(BASE, 'utf8').replace(/^﻿/, '').split(/\r?\n/); let n = 0;
  const out = lines.map((l, i) => { if (!l.trim()) return l; if (!(('L' + i) in U)) throw new Error('missing L' + i); n++; return U['L' + i] });
  fs.writeFileSync(OUT, out.join('\n')); console.log(key, 'merged', n, 'lines'); process.exit(0);
}
const base = JSON.parse(fs.readFileSync(BASE, 'utf8').replace(/^﻿/, ''));
const used = new Set(), take = id => { if (!(id in U)) throw new Error('missing ' + id); used.add(id); return U[id] };
let g = null;
const json = { ...base, chapters: base.chapters.map((c, k) => { const o = { ...c, title: take('t' + k), paras: c.paras.map((p, i) => take(k + ':' + i)) };
  if (c.group) { if (!k || base.chapters[k - 1].group !== c.group) g = take('g' + k); o.group = g } return o }) };
const extra = Object.keys(U).filter(id => !used.has(id)); if (extra.length) throw new Error('extra ' + extra.join(' '));
fs.writeFileSync(OUT, JSON.stringify(json, null, 1) + '\n'); console.log(key, 'merged', used.size, 'units');
