// Adds tools/texts/explain/<key>/<chapter id>.json (written by BRIEF.md there) to a prose text's commentary files, in the
// shape prose-engine.js shows for the usul book: 'intro:<cid>', 'words:<cid>', 'tree:<cid>', 'quiz:<cid>' and 'ex:<unit id>'.
const fs = require('fs'), path = require('path');
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const FOOT = 'شرح مساعد كُتب بالذكاء الاصطناعي ليقرّب كلام المتن، والمرجع هو المتن وشروح أهل العلم. وإن أشكل عليك شيء فاسأل شيخك.';
const sec = (src, text) => ({ src, ref: '', url: '', text });
const num = xs => xs.length > 1 ? xs.map((x, j) => ar(j + 1) + '- ' + x).join('\n\n') : xs[0];
module.exports = (key, chapters, SH) => {
  const dir = path.join(__dirname, 'texts/explain', key); if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const c of chapters) {
    const f = path.join(dir, c.id + '.json'); if (!fs.existsSync(f)) continue;
    const J = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')), S = SH[c.id] = SH[c.id] || {};
    if (J.deep.length !== c.units.length) throw new Error(key + ' ' + c.id + ': ' + J.deep.length + ' explanations for ' + c.units.length + ' units (re-export?)');
    const I = J.intro;
    S['intro:' + c.id] = { title: '🌱 الباب ببساطة', foot: FOOT, secs: [sec('عن ماذا يتكلم؟', I.what), sec('ليش مهم؟', I.why),
      sec('الفكرة خطوة خطوة', num(I.steps)), sec('مثال يجمع الباب', I.example), ...(I.tip ? [sec('⚠️ انتبه', I.tip)] : [])] };
    if (J.words && J.words.length) S['words:' + c.id] = { title: '📘 كلمات تحتاجها لتفهم الباب', foot: FOOT, secs: J.words.map(w => sec(w.w, w.m)) };
    if (J.tree) S['tree:' + c.id] = J.tree;
    c.units.forEach((u, i) => { const d = J.deep[i];
      S['ex:' + u.id] = { title: '💡 اشرحلي', foot: FOOT, check: d.check, secs: [sec('الفكرة ببساطة', d.s), sec('الشرح', d.x),
        sec(d.ex.length > 1 ? 'أمثلة' : 'مثال', num(d.ex)), ...(d.trap ? [sec('⚠️ انتبه', d.trap)] : [])] } });
    const text = u => u.segs.map(s => s[1]).join(' ');
    if (J.quiz && J.quiz.length) S['quiz:' + c.id] = { items: J.quiz.map(q => ({ k: q.k, q: q.q, ...(q.c ? { c: q.c } : {}), a: q.a, w: q.w,
      src: [...new Set(q.p)].sort((a, b) => a - b).map(k => text(c.units[k - 1])).join('\n\n') })) };
    n++;
  }
  console.log(key, 'explained chapters', n);
  return n;
};
