// Second witness: the matn as quoted in تبيين الحقائق للزيلعي (Bulaq 1314, vocalized) = shamela.ws/book/23023.
// Each page: the Zayla'i part is cut off before «[حاشية الشِّلْبِيِّ]»; matn lemmata are <span class="c2">(…)</span>.
// Writes out/tabyin-matn.txt (one lemma per line, prefixed by the page id) and out/tabyin-words.json [{w, page}].
// usage: node tools/texts/kanz-build/extract-tabyin.js [rawdir] [outname]   (also used for البحر الرائق, see extract-bahr.js)
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '../raw/kanz/tabyin23023'), name = process.argv[3] || 'tabyin';
const out = path.join(__dirname, 'out');
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const ids = fs.readdirSync(dir).map(f => parseInt(f)).filter(n => n > 0).sort((a, b) => a - b);
const lines = [], words = [];
let open = false, cont = 0;
for (const id of ids) {
  let h = fs.readFileSync(path.join(dir, id + '.html'), 'utf8');
  const vol = ((h.match(/<!-- (ج\d+) - (ص\d+)/) || [])[1] || '') + '/' + ((h.match(/<!-- (?:ج\d+ - )?(ص\d+)/) || [])[1] || '');
  // البحر الرائق page 1: the block after «[منحة الخالق]» is the author's preface of the Kanz, printed in full (vocalized)
  if (name === 'bahr' && id === 1) {
    const pre = ent(h.split('[منحة الخالق]')[1].replace(/<a href="#p\d+"[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, ' ')).replace(/[()]/g, '').replace(/\s+/g, ' ').replace(/^\s*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ/, '').replace(/<div\s*$/, '').trim();
    lines.push(id + '\tpreface\t' + pre);
    for (const w of pre.split(' ')) words.push({ w, page: id, vol: 'ج1/ص2 (مقدمة الكنز)' });
    continue;
  }
  h = h.split(/<span class="c4">\[(?:حاشية|منحة الخالق)/)[0].replace(/<a href="#p\d+"[\s\S]*?<\/a>/g, '');
  // a lemma left open at the end of the previous page («(… » without «)») continues as plain text up to the first «)»
  if (open) {
    const lead = ent(h.replace(/^[\s\S]*?data-page-num="\d+">/, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    const k = lead.indexOf(')');
    if (k > 0 && k < 600) {
      const t = lead.slice(0, k).trim();
      lines.push(id + '\t' + vol + '\t(cont.) ' + t); cont++;
      for (const w of t.split(' ')) words.push({ w, page: id, vol });
    }
    open = false;
  }
  for (const m of h.matchAll(/<span class="c2">([\s\S]*?)<\/span>/g)) {
    let t = ent(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    if (!/^\(/.test(t)) continue;
    const isOpen = !/\)\s*$/.test(t);
    // تبيين: «قَالَ - رَحِمَهُ اللَّهُ - (…)»; البحر الرائق: «(قَوْلُهُ: …)», often cut short with «إلَخْ»
    // (تكملة الطوري in البحر quotes like تبيين: «قَالَ - رَحِمَهُ اللَّهُ - (…)»)
    const qala = /رَحِمَهُ اللَّهُ\s*-?\s*:?\s*$/.test(h.slice(Math.max(0, m.index - 40), m.index));
    if (name === 'bahr' ? !(/^\(قَوْلُهُ/.test(t) || qala) : /^\(قَوْلُهُ/.test(t)) continue;
    t = t.replace(/^\((قَوْلُهُ:?\s*)?/, '').replace(/\)$/, '').replace(/\s*(إلَخْ|إلَى آخِرِهِ)\.?$/, '').trim();
    if (!t) continue;
    open = isOpen;
    lines.push(id + '\t' + vol + '\t' + t);
    for (const w of t.split(' ')) words.push({ w, page: id, vol });
  }
}
fs.writeFileSync(path.join(out, name + '-matn.txt'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(out, name + '-words.json'), JSON.stringify(words));
console.log(name, 'continued lemmata', cont, 'pages', ids.length, 'lemmata', lines.length, 'words', words.length);
