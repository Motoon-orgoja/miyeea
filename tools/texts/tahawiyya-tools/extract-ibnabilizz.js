// Extracts the matn quotations from Shamela 8352 (شرح ابن أبي العز، ط الرسالة): the c2 span that follows «قَوْلُهُ».
// usage: node extract-ibnabilizz.js <dir of page JSON> <out.txt>
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const res = [];
for (const f of fs.readdirSync(dir).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const h = d.nass.replace(/<a [\s\S]*?<\/a>/g, '');
  const re = /قَوْلُهُ\s*:?\s*(?:<\/span>)?\s*(?:وَ\s*)?(?:<span class="c5">[^<]*<\/span>\s*)?<span class="c2">([\s\S]*?)<\/span>/g;
  let m;
  while ((m = re.exec(h))) {
    const t = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (/^\([^)]*:\s*[٠-٩]+\)$/.test(t)) continue; // sura reference
    res.push(d.pageNum + '\t' + t);
  }
}
fs.writeFileSync(out, res.join('\n') + '\n');
console.log(res.length);
