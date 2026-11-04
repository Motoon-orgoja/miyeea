// Extracts the verses of «الدرة البهية» from the two raw downloads into JSON (no edits to wording or harakat).
//   KO = ketabonline 27181 (ضبط أبي مالك العوضي) — raw/durrabahiyya/ko27181.json
//        each verse is served as two <p>: second hemistich first, then the first one.
//   SH = shamela 2084 — raw/durrabahiyya/shamela-2084-p1..33.html, one «… ... …» line per verse.
// usage: node tools/texts/durrabahiyya-build/extract.js   -> writes ko.json, sh.json next to this script
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'durrabahiyya'), OUT = __dirname;
const norm = w => w.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ?]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^ء-ي ]/g, '').replace(/\s+/g, ' ').trim();

// ---- KO
const j = JSON.parse(fs.readFileSync(path.join(RAW, 'ko27181.json'), 'utf8'));
let L = [];
for (const p of j.pages) for (const x of p.content.split(/<p [^>]*>/).slice(1))
  L.push(x.replace(/<a href[\s\S]*?<\/a>/g, '').replace(/<span class="g-parentheses">\((\d+)\)<\/span>/g, '{$1}')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
const st = L.findIndex(l => norm(l) === 'مقدمه'), en = L.findIndex(l => /^بعون الله/.test(l));
const notes = L.slice(en).filter(l => /^\(\d+\)/.test(l));
L = L.slice(st, en).filter(l => l.length > 2); // drops stray one-letter paragraphs («ج», «ش», «ئ», «?»)
const HN = /^(مقدمه|باب |فصل|خاتمه|كان واخواتها|ان واخواتها|ظن واخواتها)/;
const isH = l => HN.test(norm(l)) && norm(l).split(' ').length <= 6;
const ko = []; let buf = [];
for (const l of L) {
  if (isH(l)) { if (buf.length) throw new Error('heading inside a verse: ' + l); ko.push({ h: l }); continue; }
  buf.push(l); if (buf.length === 2) { ko.push({ v: [buf[1], buf[0]] }); buf = []; }
}
if (buf.length) throw new Error('odd hemistich left: ' + buf);

// ---- SH
const sh = [];
for (let p = 1; p <= 33; p++) {
  const d = fs.readFileSync(path.join(RAW, 'shamela-2084-p' + p + '.html'), 'utf8');
  const t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  for (let l of t.split(/<p[ >]|<br\s*\/?>/)) {
    l = l.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().replace(/\s*<div$/, '');
    if (/^\*+[^*]+\*+$/.test(l)) sh.push({ h: l.replace(/\*/g, '').trim() });
    else if (l.includes('...')) sh.push({ v: l.split(/\s*\.\.\.\s*/).map(s => s.trim()) });
  }
}
const kv = ko.filter(x => x.v).length, sv = sh.filter(x => x.v).length;
console.log('KO verses', kv, 'headings', ko.length - kv, '| SH verses', sv, 'headings', sh.length - sv);
fs.writeFileSync(path.join(OUT, 'ko.json'), JSON.stringify({ items: ko, notes }, null, 1));
fs.writeFileSync(path.join(OUT, 'sh.json'), JSON.stringify({ items: sh }, null, 1));
