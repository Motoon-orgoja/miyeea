// Parses the raw downloads in ../raw/hairiyya into verse arrays: out/sources.json = {src: [[n, h1, h2], ...]}
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '../raw/hairiyya');
const ar2int = s => parseInt(String(s).replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), 10);
const clean = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s*\([0-9٠-٩]+\)/g, '').replace(/[()\[\]]/g, '').replace(/\s+/g, ' ').trim();
function shamelaParas(b, pages) {
  const out = [];
  for (const p of pages) {
    const d = fs.readFileSync(path.join(R, `shamela-${b}-p${p}.html`), 'utf8');
    const t = d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/, '').split('id="appended_pages"')[0].split(/<hr/)[0];
    t.split(/<p[ >]/).forEach(x => { x = x.replace(/<a [\s\S]*?<\/a>/g, '').replace(/^[^>]*>/, '').replace(/<div[\s\S]*$/, ''); x = clean(x); if (x) out.push(x); });
  }
  return out;
}
const S = {};
// base: shamela 145171 (نثر الورود), pages 5-6, lines «١ - ... صدر ... عجز»
S.aql = shamelaParas(145171, [5, 6]).map(l => l.match(/^([٠-٩]+) - \.\.\. (.+?) \.\.\. (.+)$/)).filter(Boolean).map(m => [ar2int(m[1]), m[2].trim(), m[3].trim()]);
// Barrak: shamela 30039 pages 5-11 «١. صدر … عجز»
S.barrak = shamelaParas(30039, [5, 6, 7, 8, 9, 10, 11]).map(l => l.match(/^([٠-٩]+)\. (.+?) … (.+)$/)).filter(Boolean).map(m => [ar2int(m[1]), m[2].trim(), m[3].trim()]);
// Badr: shamela 7575 pages 7-8 (unvocalized; first three verses misprinted across lines – rebuilt below)
{
  const L = shamelaParas(7575, [7, 8]).filter(l => !/^نص المنظومة|^قال رحمه/.test(l)).map(l => l.replace(/^[٠-٩]+ /, ''));
  const joined = L.join(' \n ').replace(/ \.\.\. \n /g, ' ... ').split(' \n ');
  // the edition swaps the 2nd hemistichs of verses 2 and 3: «ودن بكتاب الله والسنن التي» / «وقل غير مخلوق… ... أتت عن رسول الله…» / «بذلك دان…»
  const v = [];
  for (const l of joined) { const m = l.split(' ... '); v.push(m.map(x => x.trim())); }
  const fixed = [];
  for (let i = 0; i < v.length; i++) {
    if (v[i].length === 1 && v[i + 1] && v[i + 1].length === 2 && v[i + 2] && v[i + 2].length === 1) {
      fixed.push([v[i][0], v[i + 1][1]], [v[i + 1][0], v[i + 2][0]]); i += 2; continue;
    }
    fixed.push(v[i]);
  }
  S.badr = fixed.filter(x => x.length === 2).map((x, i) => [i + 1, x[0], x[1]]);
}
// Hikma (ketabonline 102826, هانئ بن جبير): pages 8-15, <p> with <span class="g-list">n -</span>
{
  const j = require(path.join(R, 'ko102826.json'));
  const out = [];
  for (const p of j.pages) for (const m of (p.content || '').matchAll(/<span class="g-list">(\d+) -<\/span>([\s\S]*?)<\/p>/g)) {
    const t = clean(m[2].replace(/<a [\s\S]*?<\/a>/g, '')); const h = t.split(' ... ');
    if (h.length === 2) out.push([+m[1], h[0].trim(), h[1].trim()]);
  }
  S.hikma = out;
}
for (const k in S) console.log(k, S[k].length, 'verses; last =', S[k][S[k].length - 1][0]);
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out/sources.json'), JSON.stringify(S, null, 1));
