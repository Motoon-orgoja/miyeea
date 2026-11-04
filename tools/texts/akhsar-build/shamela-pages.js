// Reads saved shamela pages (<dir>/<id>.html from umdafiqh-build/fetch-shamela.js) and returns
// [{id, page, paras:[{html, text}], hamesh}] — text = paragraph with tags stripped and footnote markers «(١)» removed.
const fs = require('fs'), path = require('path');
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function pages(dir, from, to) {
  const out = [];
  for (let id = from; id <= to; id++) {
    const f = path.join(dir, id + '.html'); if (!fs.existsSync(f)) continue;
    let h = fs.readFileSync(f, 'utf8');
    const page = (h.match(/data-page-num="(\d+)"/) || [])[1];
    h = h.replace(/<a href="#p\d+"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<span[^>]*class="anchor"[^>]*><\/span>/g, '');
    const [body, ham = ''] = h.split(/<hr\s*\/?>/);
    const paras = [];
    for (const m of body.matchAll(/<p(?: [^>]*)?>([\s\S]*?)<\/p>/g)) {
      if (/class="hamesh"/.test(m[0].slice(0, 30))) continue;
      const html = m[1];
      const text = ent(html.replace(/<span class="c2">\s*\([٠-٩0-9]+\)\s*<\/span>/g, '').replace(/<[^>]+>/g, ''))
        .replace(/\s*\([٠-٩0-9]+\)/g, '').replace(/\s+/g, ' ').trim();
      if (text) paras.push({ html, text });
    }
    // pages without <p> (plain text separated by <br>)
    if (!paras.length) {
      const t = ent(body.replace(/^[^>]*>/, '').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ''));
      for (const l of t.split('\n')) { const x = l.replace(/\s*\([٠-٩0-9]+\)/g, '').replace(/\s+/g, ' ').trim(); if (x && x !== '<div') paras.push({ html: l, text: x }); }
    }
    out.push({ id, page, paras, hamesh: ent(ham.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')).trim() });
  }
  return out;
}
module.exports = { pages };
if (require.main === module) {
  const [dir, from, to] = process.argv.slice(2);
  for (const p of pages(dir, +from, +to)) { console.log('@@ ' + p.id + ' ص' + p.page); for (const x of p.paras) console.log(x.text); if (p.hamesh) console.log('%% ' + p.hamesh.replace(/\n/g, '\n%% ')); }
}
