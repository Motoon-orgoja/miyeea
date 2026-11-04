// Extracts the matn from «الشرح الممتع على زاد المستقنع» (raw/zad/shamela10649/<page>.html): each matn passage is printed as its own
// paragraph ending with a row of dots «..........» before Ibn Uthaymin comments on it phrase by phrase. Output: out/mumti.txt
// (one passage per line, «#PAGE n» markers). Used only as a third vocalized witness to settle mark conflicts between R and B.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '../raw/zad/shamela10649');
const ids = fs.readdirSync(dir).map(f => parseInt(f)).filter(n => n).sort((a, b) => a - b);
const out = [];
for (const id of ids) {
  let h = fs.readFileSync(path.join(dir, id + '.html'), 'utf8').replace(/<hr>[\s\S]*$/, '').replace(/<p class="hamesh">[\s\S]*?<\/p>/g, '');
  out.push('#PAGE ' + id);
  for (const m of h.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const t = m[1].replace(/<a [\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const d = t.match(/^(.*?)\s*\.{5,}\s*$/);
    if (d && d[1]) out.push(d[1].replace(/\(\s*[٠-٩0-9]+\s*\)/g, ' ').replace(/\s+/g, ' ').trim());
  }
}
fs.writeFileSync(path.join(__dirname, 'out/mumti.txt'), out.join('\n'));
console.log('passages', out.filter(l => !/^#/.test(l)).length);
