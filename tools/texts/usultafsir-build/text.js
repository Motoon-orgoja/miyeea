// Builds the clean base text (chapters of source paragraphs) from out/shamela.json (shamela 12081, ط. دار مكتبة الحياة).
// Output out/base.json: [{title, paras:[...]}] — before Qur'an replacement and before cutting into memorization units.
const fs = require('fs'), path = require('path');
const O = require('./out/shamela.json');
const log = { dropped: [], glosses: [], brackets: [], merged: 0 };
// 1. flat paragraph list, page breaks inside a paragraph joined
let P = [];
for (const pg of O) pg.paras.forEach((t, i) => {
  const prev = P[P.length - 1];
  if (i === 0 && prev && !/[.؟!:]\s*$/.test(prev.t) && !/^فصل \[|^\[/.test(t)) { prev.t += ' ' + t; log.merged++; }
  else P.push({ t, page: pg.page });
});
// 2. compiler/title lines that are not the author's text
const DROP = [/^وقال شيخ الإسلام:$/, /^بسم الله الرحمن الرحيم$/, /^مقدمة في أصول التفسير$/, /^التأليف: /, /^تمت بحمد الله ومنه$/];
P = P.filter(p => { if (DROP.some(r => r.test(p.t))) { log.dropped.push(p.page + ': ' + p.t); return false } return true; });
// 3. chapters: «فصل [في …]» and the two «[النوع …]» headings (the bracketed headings are the editor's)
const chapters = [{ title: 'مقدمة المؤلف', paras: [] }];
for (const p of P) {
  let m;
  if ((m = p.t.match(/^فصل \[(.+)\]$/))) { chapters.push({ title: 'فصل' + (/^في /.test(m[1]) ? ' ' : ': ') + m[1], paras: [] }); continue; }
  // «فصل [في نوعي الاختلاف]» has no text of its own: it becomes the group of the two «النوع» chapters
  if ((m = p.t.match(/^\[(النوع .+)\]$/))) {
    const last = chapters[chapters.length - 1], group = last.paras.length ? last.group : chapters.pop().title;
    chapters.push({ title: m[1], group, paras: [] }); continue;
  }
  chapters[chapters.length - 1].paras.push(p.t);
}
// 4. inline cleanup
const GLOSS = [/\s*\[أى الصحابى\]/, /\s*\[أي: نائم قد انحنى في نومه\]/];
for (const c of chapters) c.paras = c.paras.map(t => {
  for (const g of GLOSS) if (g.test(t)) { log.glosses.push(t.match(g)[0].trim()); t = t.replace(g, ''); }
  // remaining square brackets that are not sura references mark a term («ولفظ [الشك]») — the word stays, the bracket goes
  t = t.replace(/\[([^\]:]+)\]/g, (m, x) => { log.brackets.push(x); return x; });
  // round brackets around titles/terms («(تفسير القرطبي)») are typography
  t = t.replace(/\(([^()]+)\)/g, '$1');
  // straight quotes → «»
  t = t.replace(/"\s*([^"]+?)\s*"/g, '«$1»');
  return t.replace(/\s+([،؛:.؟!])/g, '$1').replace(/([،؛])(?=\S)/g, '$1 ').replace(/\s+/g, ' ').trim();
});
fs.writeFileSync(path.join(__dirname, 'out/base.json'), JSON.stringify(chapters, null, 1));
fs.writeFileSync(path.join(__dirname, 'out/text-log.json'), JSON.stringify(log, null, 1));
console.log(chapters.map(c => c.title + ' (' + c.paras.length + ')').join('\n')); console.log(JSON.stringify(log).slice(0, 1500));
