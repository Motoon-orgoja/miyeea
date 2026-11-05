// F = Fariyabi edition (shamela 11196): writes out/f-lines.json [{page, kind:'h'|'t', text, notes:[..]}] and out/f.txt (one line per paragraph, «# » for headings)
// Footnote markers are bare Arabic-Indic digits; the editor's item numbers «١ - » are dropped too. Notes (after <hr>) are kept per page.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '../raw/dalil/shamela11196'), out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const L = [];
for (let id = 1; id <= 437; id++) {
  let h = fs.readFileSync(path.join(dir, id + '.html'), 'utf8');
  const page = +(h.match(/data-page-num="(\d+)"/) || [])[1];
  h = h.replace(/<a href="#p\d+"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<span[^>]*class="anchor"[^>]*><\/span>/g, '');
  const [body, ham = ''] = h.split(/<hr\s*\/?>/);
  const notes = ent(ham.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')).split('\n').map(s => s.trim()).filter(Boolean);
  const first = L.length;
  for (const m of body.matchAll(/<p(?: [^>]*)?>([\s\S]*?)<\/p>/g)) {
    if (/class="hamesh"/.test(m[0].slice(0, 30))) continue;
    const html = m[1];
    const isH = /^\s*<span class="c4">[^<]*<\/span>\s*$/.test(html);
    let t = ent(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const raw = t; // with the footnote markers, for review
    t = t.replace(/^[٠-٩]+\s*-\s*/, '').replace(/[٠-٩]+/g, '').replace(/\s+/g, ' ').replace(/\s+([.,:،؛])/g, '$1').trim();
    if (!t || t === '...') continue;
    L.push({ id, page, kind: isH ? 'h' : 't', text: t, raw });
  }
  if (L.length > first) L[first].notes = notes; else if (notes.length) L[L.length - 1].notes = (L[L.length - 1].notes || []).concat(notes);
}
fs.writeFileSync(path.join(out, 'f-lines.json'), JSON.stringify(L, null, 1));
fs.writeFileSync(path.join(out, 'f.txt'), L.map(l => (l.kind === 'h' ? '# ' : '') + l.text).join('\n') + '\n');
console.log('lines', L.length, 'headings', L.filter(l => l.kind === 'h').length);
