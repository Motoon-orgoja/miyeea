// Extracts the matn from a ketabonline dump (raw/zad/ko<id>.json) as text: «## title» lines for g-title divs, one line per <p>,
// «#PAGE id/page» markers; footnote lines (Askar: «1 في "م" …», Rihab: g-footnote-target lists) are dropped, footnote marks removed.
// usage: node extract-ko.js <ko json> <out txt>
const fs = require('fs');
const pages = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), out = [];
const clean = s => s.replace(/<a [^>]*class="g-footnote-link[\s\S]*?<\/a>/g, '').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
for (const p of pages) {
  out.push('#PAGE ' + p.id + '/' + p.page);
  if (!p.content) continue;
  const c = p.content.replace(/<div class="g-page-footer[\s\S]*$/, '').replace(/<(ol|ul) class="g-list g-footnote-target[\s\S]*?<\/\1>/g, '');
  for (const m of c.matchAll(/<div class="g-title[^"]*"[^>]*>([\s\S]*?)<\/div>|<p[ >]([\s\S]*?)<\/p>/g)) {
    if (m[1] != null) { out.push('## ' + clean(m[1])); continue; }
    let t = clean(m[2].replace(/^[^>]*>/, ''));
    if (!t) continue;
    if (/^[0-9٠-٩]+/.test(t)) continue; // footnote line (Askar prints its apparatus as «1 في "م" …»)
    if (/^==/.test(t)) continue; // footnote continuation
    out.push(t);
  }
}
fs.writeFileSync(process.argv[3], out.join('\n'));
