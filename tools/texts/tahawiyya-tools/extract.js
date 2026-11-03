// Plain-text extraction of the three witnesses.
// usage: node extract.js <rawdir>   -> writes <rawdir>/qasim.txt, albani.txt (one source paragraph per line)
const fs = require('fs'), path = require('path');
const raw = process.argv[2];
const pages = d => fs.readdirSync(d).sort().map(f => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')));
const strip = h => h.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// al-Qasim: pages 121..155 (pageId), drop footnote paragraphs «(١) …» and the closing lines
const q = [];
for (const d of pages(path.join(raw, 'shamela574'))) {
  if (d.pageId < 121) continue;
  for (const p of d.nass.split('</p>').map(strip).filter(Boolean)) {
    if (/^\([٠-٩]+\)/.test(p) || /^\* \* \*$/.test(p) || /^تَمَّ بِحَمْدِ/.test(p)) continue;
    q.push(p);
  }
}
fs.writeFileSync(path.join(raw, 'qasim.txt'), q.join('\n') + '\n');
// al-Albani: numbered paragraphs; footnotes follow <hr>
const a = [];
for (const d of pages(path.join(raw, 'shamela9568'))) {
  const body = d.nass.split(/<hr[^>]*>/)[0];
  for (const p of body.split('</p>').map(strip).filter(Boolean)) a.push(p);
}
fs.writeFileSync(path.join(raw, 'albani.txt'), a.join('\n') + '\n');
console.log('qasim lines', q.length, 'albani lines', a.length);
