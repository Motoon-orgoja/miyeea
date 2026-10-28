// Adds a text to the site once its data file exists (data/<key>.js): its page, its place in every page's list of texts,
// the dashboard, the texts sheet, and the offline cache.
// usage: node tools/register-book.js <key> <poem|prose> '<title>' '<one-line description>' [after-key]
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), P = f => path.join(root, f);
const [key, kind, title, desc, after] = process.argv.slice(2);
if (!fs.existsSync(P('data/' + key + '.js'))) throw new Error('data/' + key + '.js missing');
const page = key + '.html';
const edit = (f, fn) => { const s = fs.readFileSync(P(f), 'utf8'), t = fn(s); if (t === s) throw new Error('no change in ' + f); fs.writeFileSync(P(f), t) };

// the page: a copy of an existing page of the same kind with its data file swapped
const model = kind === 'poem' ? 'jazariyya.html' : 'qudouri.html';
if (!fs.existsSync(P(page))) {
  let s = fs.readFileSync(P(model), 'utf8');
  s = kind === 'poem' ? s.replace('<script src="data/jazariyya.js"></script>', `<script src="data/${key}.js"></script>`)
    : s.replace('<script src="data/qudouri.js"></script>', `<script src="data/${key}.js"></script>`);
  s = s.replace(/<title>[^<]*<\/title>/, `<title>حفظ ${title}</title>`);
  fs.writeFileSync(P(page), s);
}
// the list of texts on every page (the app bar reads it to know the current text)
const link = `<a href="${page}" data-book="${key}">${title}</a>`;
const anchor = after ? new RegExp(`(<a href="[^"]*" data-book="${after}">[^<]*</a>)`) : /(<\/nav>)/;
for (const f of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
  const s = fs.readFileSync(P(f), 'utf8'); if (!s.includes('<nav class="books"') || s.includes(`data-book="${key}"`)) continue;
  fs.writeFileSync(P(f), after ? s.replace(anchor, `$1${link}`) : s.replace(anchor, `${link}$1`));
}
// dashboard: load the data and know the page
edit('home.html', s => s.replace('<script src="home.js"></script>', `<script src="data/${key}.js"></script><script>BOOKS.push(BOOK)</script>\n<script src="home.js"></script>`));
edit('home.js', s => s.replace("const PAGE={", `const PAGE={${key}:'${page}',`));
// texts sheet
edit('ui.js', s => { const i = s.indexOf('const BOOKS=['), j = s.indexOf('\n];', i);
  return s.slice(0, j) + `\n  {key:'${key}',c:'${process.argv[7]||''}',lsk:'mutoon_${key}_v1',url:'${page}',t:'${title}',d:'${desc}'},` + s.slice(j) });
// offline cache
edit('sw.js', s => s.replace("const FILES = ['./', ", `const FILES = ['./', '${page}', 'data/${key}.js', `));
console.log('registered', key);
