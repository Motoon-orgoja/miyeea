// Extracts verse lines from the raw sources into JSON lists.
// usage: node extract.js   (reads ../raw/safariniyya, writes ./lawami.json ./jk.json ./wikisource.json ./sh6382.json ./uthaymeen.json)
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'safariniyya');
const out = (f, d) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(d, null, 1));
function nass(f) {
  const d = fs.readFileSync(path.join(RAW, f), 'utf8');
  const i = d.indexOf('class="nass'); if (i < 0) return [];
  const t = d.slice(i).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  return t.replace(/<\/p>|<br\s*\/?>/g, '\n').replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean).filter(s => s !== '<div');
}
const pages = book => fs.readdirSync(RAW).filter(f => f.startsWith(book + '_')).map(f => +f.split('_')[1].split('.')[0]).sort((a, b) => a - b);
// Lawami: the matn is printed as ((sadr ... ajz)) on its own line; headings as [..] or as plain lines before
{
  const items = [];
  for (const p of pages(8353)) for (const l of nass('8353_' + p + '.html')) {
    if (/^\(\(.*\.\.\..*\)\)\.?$/.test(l)) items.push({ p, v: l.replace(/^\(\(|\)\)\.?$/g, '').split(/\s*\.\.\.\s*/).map(s => s.trim()) });
    else if (/^\(\(/.test(l) && /\.\.\./.test(l)) items.push({ p, odd: l });
  }
  out('lawami.json', items); console.log('lawami', items.length, 'odd', items.filter(x => x.odd).length);
}
// JK (OpenITI)
{
  const items = [];
  for (const l of fs.readFileSync(path.join(RAW, 'openiti_JK001229.txt'), 'utf8').split('\n')) {
    let m = l.match(/^# ([0-9]+) \((.*)$/);
    if (m) { items.push({ n: +m[1], v: m[2].replace(/PageV\S+|ms\d+/g, '').replace(/[()]\s*$/, '').trim().split(/\s*%\s*/) }); continue; }
    m = l.match(/^# \| (.*)$/); if (m) items.push({ h: m[1].replace(/ms\d+/g, '').trim() });
  }
  out('jk.json', items); console.log('jk', items.filter(x => x.v).length);
}
// Wikisource
{
  const items = [];
  for (let l of fs.readFileSync(path.join(RAW, 'wikisource.wiki'), 'utf8').split('\n')) {
    const h = l.match(/^=+\s*(.*?)\s*=+$/); if (h) { items.push({ h: h[1] }); continue; }
    l = l.replace(/^\|(شاعر|عنوان)=.*$/, '').replace(/^\{\{أبيات\|?/, '').replace(/^\|/, '').replace(/\}\}$/, '');
    if (l.includes('\\')) items.push({ v: l.split('\\').map(s => s.trim()) });
  }
  out('wikisource.json', items); console.log('wikisource', items.filter(x => x.v).length);
}
// Shamela 6382 (أضواء السلف) and 9725 (Uthaymeen) — numbered lines "٣ - (..." / "٤٣. ..."
for (const [book, f] of [[6382, 'sh6382.json'], [9725, 'uthaymeen.json']]) {
  const items = [];
  for (const p of pages(book)) for (const l of nass(book + '_' + p + '.html')) {
    if (!l.includes('...')) continue;
    const m = l.match(/^([٠-٩0-9]+)\s*[-.]\s*(.*)$/);
    const body = (m ? m[2] : l).replace(/^\(|\(\s*$|\)\s*$/g, '').trim();
    items.push({ p, n: m ? +m[1].replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)) : null, v: body.split(/\s*\.\.\.\s*/) });
  }
  out(f, items); console.log(book, items.length);
}
