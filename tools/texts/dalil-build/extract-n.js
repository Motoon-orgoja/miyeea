// N = the matn quoted inside «نيل المآرب بشرح دليل الطالب» (Ibn Abi Taghlib, ed. al-Ashqar, Maktabat al-Falah 1403; shamela 96876).
// The matn is printed in <span class="c2">(…)</span>; the headings of the matn are short paragraphs of their own («باب …», «فصل», «كتاب …»).
// Writes out/n-words.json: [{w, page, title?}] and out/n.txt (one line per page). Footnote markers «(١)» are dropped.
const fs = require('fs'), path = require('path'), dir = path.join(__dirname, '../raw/dalil/shamela96876');
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const ids = fs.readdirSync(dir).map(f => +f.replace('.html', '')).sort((a, b) => a - b), W = [], T = [];
for (const id of ids) {
  if (id < 28) continue; // editor's introduction
  let h = fs.readFileSync(path.join(dir, id + '.html'), 'utf8');
  const page = (h.match(/<!-- (ج\d+ - ص\d+)/) || [])[1] || id;
  h = h.replace(/<a href="#p\d+"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<span[^>]*class="anchor"[^>]*><\/span>/g, '');
  const body = h.split(/<hr\s*\/?>/)[0], seg = [];
  for (const pm of body.matchAll(/<p(?: [^>]*)?>([\s\S]*?)<\/p>/g)) {
    const html = pm[1], plain = ent(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const bare = plain.replace(/[ً-ْ]/g, '').replace(/[\[\]]/g, '');
    if (!/class="c2"/.test(html) && /^(كتاب|باب|فصل)/.test(bare) && plain.split(' ').length <= 9) {
      const t = plain.replace(/[\[\]]/g, '').replace(/\([٠-٩0-9]+\)/g, '').trim(); seg.push('#' + t);
      t.split(/\s+/).forEach(w => W.push({ w, page, title: /^كتاب/.test(bare) ? 'kitab' : /^باب/.test(bare) ? 'bab' : 'fasl' })); continue;
    }
    for (const m of html.matchAll(/<span class="c2">([\s\S]*?)<\/span>/g)) {
      let t = ent(m[1].replace(/<[^>]+>/g, '')).trim();
      if (/^\(?[٠-٩0-9]+\)?$/.test(t)) continue;
      t = t.replace(/^\(/, '').replace(/\)$/, '').replace(/\([٠-٩0-9]+\)/g, '').replace(/\//g, ' ').trim();
      if (!t) continue; seg.push(t);
      for (const w of t.split(/\s+/)) if (w) W.push({ w, page });
    }
  }
  if (seg.length) T.push('@' + page + ' ' + seg.join(' | '));
}
fs.writeFileSync(path.join(__dirname, 'out/n-words.json'), JSON.stringify(W));
fs.writeFileSync(path.join(__dirname, 'out/n.txt'), T.join('\n') + '\n');
console.log('pages', T.length, 'words', W.length, 'headings', T.join('\n').split('|').filter(s => /^ ?#/.test(s) || /^@\S+ \S+ #/.test(s)).length);
