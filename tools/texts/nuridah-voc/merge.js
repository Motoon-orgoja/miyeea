// Rebuilds tools/texts/nuridah.json from the vocalized units in nuridah-voc/out1..out6.json.
//   base  = nuridah.unvocalized.json (made once from nuridah.json on the first run, never overwritten)
//   units = "tK" chapter title, "K:P" paragraph P of chapter K (see BRIEF.md)
// Keeps every top-level field of the base (source, check, …) and each chapter's other fields (group, …);
// a group name that equals a chapter title takes that title's vocalized form.
// Checks: same chapter count, same paragraph count per chapter, every id used exactly once, and the bare letters
// of each unit equal the base except in the units changed by applied.md (they are listed).
// usage: node tools/texts/nuridah-voc/merge.js
const fs = require('fs'), path = require('path');
const T = path.join(__dirname, '..'), OUT = path.join(T, 'nuridah.json'), BASE = path.join(T, 'nuridah.unvocalized.json');
if (!fs.existsSync(BASE)) { fs.copyFileSync(OUT, BASE); console.log('backup written: nuridah.unvocalized.json'); }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8').replace(/^﻿/, ''));

const U = {};
for (let n = 1; n <= 6; n++) {
  const o = JSON.parse(fs.readFileSync(path.join(__dirname, 'out' + n + '.json'), 'utf8').replace(/^﻿/, ''));
  for (const [id, v] of Object.entries(o.units)) { if (id in U) throw new Error('duplicate id ' + id); U[id] = v.normalize('NFC').trim(); }
}
const bare = s => s.normalize('NFC').replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/\s+/g, ' ').trim();

const used = new Set(), changed = [];
const take = (id, orig) => {
  if (!(id in U)) throw new Error('missing unit ' + id);
  used.add(id);
  if (bare(U[id]) !== bare(orig)) changed.push(id);
  return U[id];
};
const titleV = {};
const json = { ...base, chapters: base.chapters.map((c, k) => {
  const title = take('t' + k, c.title); titleV[bare(c.title)] = title;
  return { ...c, title, paras: c.paras.map((p, i) => take(k + ':' + i, p)) };
}) };
let groupsV = 0;
json.chapters.forEach(c => { if (c.group && titleV[bare(c.group)]) { c.group = titleV[bare(c.group)]; groupsV++; } });

const extra = Object.keys(U).filter(id => !used.has(id));
if (extra.length) throw new Error('units not in the base: ' + extra.join(' '));
const pc = j => j.chapters.reduce((s, c) => s + c.paras.length, 0);
if (json.chapters.length !== base.chapters.length || pc(json) !== pc(base)) throw new Error('chapter/paragraph count changed');

fs.writeFileSync(OUT, JSON.stringify(json, null, 1) + '\n');
console.log('chapters', json.chapters.length, '| paragraphs', pc(json), '| groups vocalized', groupsV + '/' + json.chapters.length);
console.log('units whose letters differ from the base (corrections in applied.md):', changed.length);
console.log(changed.join(' '));
