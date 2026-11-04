// Extracts paragraphs (with footnotes split off) from shamela 12081 raw pages -> out/shamela.json [{page, printed, paras:[], foot:[]}]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '../raw/usultafsir');
const out = [];
for (let p = 1; p <= 56; p++) {
  const d = fs.readFileSync(path.join(R, `shamela-12081-p${p}.html`), 'utf8');
  const printed = (d.match(/data-page-num="(\d+)"/) || [])[1];
  let t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0];
  const [body, foot = ''] = t.split(/<hr[^>]*>/);
  const paras = s => s.split(/<p[ >]/).map(b => b.replace(/<a [\s\S]*?<\/a>/g, '').replace(/^[^>]*>/, '').replace(/<\/?span[^>]*>/g, '').replace(/<[^>]+>[\s\S]*$/,'').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
  out.push({ page: p, printed, paras: paras(body), foot: paras(foot.replace(/<\/div>[\s\S]*$/, '')) });
}
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out/shamela.json'), JSON.stringify(out, null, 1));
const all = out.flatMap(o => o.paras).join(' ');
const letters = (all.match(/[ء-ي]/g) || []).length, marks = (all.match(/[ً-ْ]/g) || []).length;
console.log('pages', out.length, 'paras', out.reduce((a, o) => a + o.paras.length, 0), 'words', all.split(' ').length, 'marks/letters', (marks / letters).toFixed(3));
