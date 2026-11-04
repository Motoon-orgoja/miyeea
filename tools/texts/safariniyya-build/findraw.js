const N = require('./norm'), fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '..', 'raw', 'safariniyya');
const files = fs.readdirSync(RAW).filter(f => f.startsWith('8353_'));
const texts = files.map(f => { const d = fs.readFileSync(path.join(RAW, f), 'utf8'); const i = d.indexOf('class="nass'); if (i < 0) return [f, []];
  const t = d.slice(i).split('id="appended_pages"')[0].replace(/<\/p>|<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  return [f, t.split('\n').map(s => s.trim()).filter(Boolean)]; });
for (const q of process.argv.slice(2)) { const nq = N(q); console.log('## ' + q);
  for (const [f, ls] of texts) ls.forEach(l => { if (N(l).includes(nq)) console.log(f, l.slice(0, 220)); }); }
