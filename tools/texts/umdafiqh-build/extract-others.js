// Extracts the plain matn of the three check copies (ketabonline API pages in raw/umdafiqh/):
//   ko599   العدة شرح العمدة (دار الحديث ١٤٢٤ = shamela 10908): matn = blocks above «[العُدَّة شرح العُمْدة]»; (n) = مسألة numbers
//   ko827   عمدة الفقه ت عزوز (المكتبة العصرية = shamela 11315): footnotes (from the first «1 أخرجه…» paragraph to the end of the page) and inline note digits removed
//   ko38387 عمدة الفقه ت العبدلي والعتيبي (مكتبة الطرفين، الطائف): «& باب … &» titles
// usage: node extract-others.js   -> out/idda.txt, out/azzuz.txt, out/abdali.txt (one block per line, «## » before titles)
const fs = require('fs');
const strip = h => h.replace(/<a [^>]*class="g-copy[\s\S]*?<\/a>/g, '').replace(/<a [^>]*class="g-footnote-link[\s\S]*?<\/a>/g, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const blocks = h => (h.match(/<(p|div)[^>]*class="g-(paragraph|title)[\s\S]*?<\/\1>/g) || []).map(b => ({ t: /^<div/.test(b) ? 'T' : 'P', h: b, s: strip(b) }));
const load = k => JSON.parse(fs.readFileSync(__dirname + '/../raw/umdafiqh/ko' + k + '.json', 'utf8')).filter(x => x.content);
// العدة
{
  const out = [];
  for (const x of load(599)) {
    const B = blocks(x.content); const e = B.findIndex(b => b.h.includes('class="g-symbol"'));
    if (e < 0) { out.push('#PAGE ' + x.page + ' NOSEP'); continue; }
    out.push('#PAGE ' + x.page);
    for (const b of B.slice(0, e)) out.push(b.s);
  }
  fs.writeFileSync(__dirname + '/out/idda.txt', out.join('\n') + '\n');
}
// عزوز
{
  const out = [];
  for (const x of load(827)) {
    out.push('#PAGE ' + x.page);
    for (const b of blocks(x.content)) {
      if (/^([0-9]+ |\* )/.test(b.s)) break;           // the footnotes start: the rest of the page is notes
      if (b.t === 'T') { out.push('## ' + b.s); continue; }
      out.push(b.s.replace(/(["»)\]،.:]?) ?\b[0-9]{1,2}\b(?= |$|[.،])/g, '$1'));
    }
  }
  fs.writeFileSync(__dirname + '/out/azzuz.txt', out.join('\n') + '\n');
}
// العبدلي
{
  const out = [];
  for (const x of load(38387)) {
    out.push('#PAGE ' + x.page);
    for (const b of blocks(x.content)) out.push(b.s.replace(/&\s*([^&]+?)\s*&/g, '\n## $1\n'));
  }
  fs.writeFileSync(__dirname + '/out/abdali.txt', out.join('\n') + '\n');
}
