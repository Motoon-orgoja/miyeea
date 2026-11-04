// Extracts the verses of منظومة القواعد الفقهية from the raw ketabonline JSON files into raw/qawaid/*.verses.txt
// (one verse per line: «a | b»). usage: node tools/texts/scripts/qawaid/extract.js
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '../../raw/qawaid');
const txt = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')).map(p => String(p.content || '')
  .replace(/<br\s*\/?>/g, '\n').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')).join('\n');
const clean = s => s.replace(/و «ألْ»/g, 'وألْ').replace(/[«»"]/g, '').replace(/\s+-\s+/g, ' ').replace(/\s+/g, ' ').trim();
const out = (name, vs) => { fs.writeFileSync(path.join(R, name), vs.map(v => v.join(' | ')).join('\n') + '\n'); console.log(name, vs.length); };
// S = Sa'di's own sharh, vocalized (ketabonline 102977): «N - a ... b»
{
  const vs = []; const seen = new Set();
  for (const l of txt('ko-102977-sharh-saadi.json').split('\n')) {
    const m = l.match(/(\d+) - (.+?) \.\.\. (.+)$/); if (!m || seen.has(+m[1])) continue;
    seen.add(+m[1]); if (+m[1] !== vs.length + 1) console.error('S jump', m[1]); vs.push([clean(m[2]), clean(m[3])]);
  }
  out('S-102977.verses.txt', vs);
}
// M = Dar al-Maiman matn (ketabonline 24751), the full matn before «الشرح والتعليق»: «N - a» newline «b»
{
  const t = txt('ko-24751-matn-maiman.json'); const body = t.slice(t.indexOf('يقول فضيلة'), t.indexOf('الشرح والتعليق'));
  const parts = body.split(/(?:^|\s)(\d+) - /).slice(1); const vs = [];
  for (let i = 0; i < parts.length; i += 2) {
    const ls = parts[i + 1].split('\n').map(x => x.trim()).filter(Boolean);
    if (+parts[i] !== vs.length + 1) console.error('M jump', parts[i]);
    if (ls.length !== 2) console.error('M lines', parts[i], ls);
    vs.push([clean(ls[0]), clean(ls.slice(1).join(' '))]);
  }
  out('M-24751.verses.txt', vs);
}
// T = matn with Sa'di's notes (ketabonline 29467), unvocalized: «(N) a // b»
{
  const vs = []; const seen = new Set();
  for (const m of txt('ko-29467-matn-taliqat.json').matchAll(/\((\d+)\) ([^()\n]+?)\s*\/\/\s*([^()\n]+?)\s*(?=\(\d+\)|\n|$)/g)) {
    if (seen.has(+m[1])) continue; seen.add(+m[1]); if (+m[1] !== vs.length + 1) console.error('T jump', m[1]); vs.push([clean(m[2]), clean(m[3])]);
  }
  out('T-29467.verses.txt', vs);
}
