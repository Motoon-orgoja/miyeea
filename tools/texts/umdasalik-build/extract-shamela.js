// A = «عمدة السالك» ط. قطر (الأنصاري ١٩٨٢) as on shamela.ws/book/37344 (raw pages in raw/umdasalik/shamela37344/<page>.html)
// -> out/A.json: [{t:'h', kind:'kitab'|'bab'|'fasl', title}, {t:'p', text}] in book order.
// Editorial matter of the Qatar edition is dropped: «قسم العبادات/المعاملات», the bracketed sub-headings «[أقسام المياه]:»,
// the enumeration «١ -», the brackets around «[باب الوضوء]», and bracketed insertions inside sentences.
// usage: node extract-shamela.js
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '../raw/umdasalik/shamela37344'), O = path.join(__dirname, 'out');
fs.mkdirSync(O, { recursive: true });
const HAR = /[ً-ْٰ]/g;
const bare = s => s.replace(HAR, '');
// Quran passages printed (…) in class c2 -> ﴿…﴾; the others (talbiya, tathwib, surah names) -> «…»
const QURAN = /^(قُلْ|سَبِّحِ|يَا يَحْيَى|وَلا الضَّالِّيِنَ|هَلْ أَتَى|فَإِذَا أَفَضْتُم|رَبَّنَا|الم\. تَنْزِيلُ|اقْتَرَبَتِ|استغفروا ربكمْ)/;
const paras = [];
for (let p = 2; p <= 243; p++) {
  const d = fs.readFileSync(path.join(RAW, p + '.html'), 'utf8');
  const ps = d.replace(/<a [\s\S]*?<\/a>/g, '').split(/<\/p>/).slice(0, -1);
  ps.forEach((x, k) => {
    let t = x.replace(/<span class="c4">([\s\S]*?)<\/span>/g, '⟦$1⟧')
      .replace(/<span class="c2">\(([\s\S]*?)\)<\/span>/g, (m, q) => QURAN.test(q) ? '﴿' + q + '﴾' : '«' + q + '»')
      .replace(/<span class="c1">"([\s\S]*?)"<\/span>/g, '«$1»')
      .replace(/<[^>]+>/g, '').replace(/^[^>]*>/, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (t) paras.push({ page: p, first: k === 0, last: k === ps.length - 1, t });
  });
}
// a heading printed at the end of the preceding paragraph: «… ولا يجوز الصياح. باب ما يحرم لبسه»
for (let i = 0; i < paras.length; i++) {
  const m = paras[i].t.match(/^(.*[.:])\s+((?:بابُ?|باب) [^.،:]{2,40})$/);
  if (m && /^باب/.test(bare(m[2]))) { paras.splice(i + 1, 0, { page: paras[i].page, first: false, last: paras[i].last, t: m[2] }); paras[i].t = m[1]; paras[i].last = false; }
}
// join a paragraph broken by the page end (no closing punctuation) with the first one of the next page
const joined = [];
for (const q of paras) {
  const prev = joined[joined.length - 1];
  if (prev && q.first && prev.last && !/[.:؛!؟»﴾"\]⟧)]$/.test(prev.t) && !/^⟦|^(فصل|باب|كتاب)/.test(bare(q.t))) {
    prev.t += ' ' + q.t; prev.last = q.last; continue;
  }
  joined.push(Object.assign({}, q));
}
const out = [];
const cleanText = s => s
  .replace(/⟦[^⟧]*⟧\s*:?\s*/g, m => /^⟦\[(الثاني|والثاني)\]/.test(m) ? m : '') // sub-headings anywhere (except inline insertions handled below)
  .replace(/⟦\[(الثاني|والثاني)\]⟧\s*/g, '') // «وأما [الثاني] المستطيع» -> editor's insertion
  .replace(/(?<=^|\s)[٠-٩]+\s*-\s*/g, '') // enumeration «١ -», «٤ - ٥ - ٦ -»
  .replace(/(?<=^|\s)[أب]-\s*/g, '')
  .replace(/^-\s+/, '').replace(/([.:])\s+-\s+/g, '$1 ') // bullets «- فإن لم يكونوا…»
  .replace(/\.\/\s*[٠-٩]+$/, '.') // «ومستدبرَه./ ٩»
  .replace(/\s-([^-]{1,120}?)-(?=[\s.،:؛]|$)/g, '، $1،') // editorial dashes around an aside
  .replace(/([^\s،])-(?=\s)/g, '$1،').replace(/\s-(?=[^\s-])/g, '، ').replace(/([^\s-])-([^\s-])/g, '$1، $2') // dashes of an aside split by a paragraph
  .replace(/"([^"]*)"/g, '«$1»')
  .replace(/\[|\]/g, '')
  .replace(/\s*،\s*([.،:؛])/g, '$1').replace(/([.:؛])\s*،/g, '$1').replace(/،\s*،/g, '،')
  .replace(/\s+([.،:؛])/g, '$1').replace(/\s+/g, ' ').trim()
  .replace(/^[:،]\s*/, ''); // left over from a removed sub-heading «[والثاني]: فإذا فعل…»
let lastSub = ''; // a stand-alone editorial sub-heading right before a bare «فصل»
for (const q of joined) {
  let t = q.t;
  const sm = t.match(/^⟦\[([^\]]+)\]⟧\s*:?$/);
  if (sm && !/^(باب|كتاب|فصل|مقدمة)/.test(bare(sm[1]))) { lastSub = sm[1].replace(/^[٠-٩]+\s*-\s*/, ''); continue; }
  if (!/^(⟦\[)?فصل/.test(bare(t))) lastSub = '';
  const b = bare(t);
  if (/^مقدمة المؤلف/.test(bare(t.replace(/[⟦⟧\[\]:]/g, '')))) { out.push({ t: 'h', kind: 'intro', title: 'مقدمة المؤلف' }); continue; }
  if (/^بسم الله الرحمن الرحيم$/.test(b)) { out.push({ t: 'basmala', text: t }); continue; }
  if (/^قسم (العبادات|المعاملات)$/.test(b)) continue;
  // headings
  let m;
  const hb = t.replace(/^[٠-٩]+\s*-\s*/, '').replace(/[⟦⟧]/g, '').replace(/^\[+|\]+$/g, '').replace(/\s*:$/, '').trim();
  if (/^(كتاب|باب)/.test(bare(hb)) && hb.length < 70 && !/[.،]/.test(hb.replace(/\[.*\]/, ''))) {
    let title = hb.replace(/\s*\[.*$/, '').replace(/^\[+|\]+$/g, '').replace(/^(بابُ?):\s*/, '$1 ').trim();
    const kind = /^كتاب/.test(bare(title)) ? 'kitab' : 'bab';
    out.push({ t: 'h', kind, title, page: q.page });
    continue;
  }
  // «فصل [في الأواني]:», «فصلٌ: [الأيامُ…]:», «فصل الجُعالةِ:», «فصلٌ في الربا:», «[فصل]:», «فصلٌ:»; text may follow
  if ((m = t.match(/^(⟦\[)?(فصلٌ?)(\]⟧)?\s*:?\s*(⟦\[([^\]]*)\]\]?⟧\s*:?\s*)?/)) && /^فصل/.test(bare(m[2]))) {
    let rest = t.slice(m[0].length), sub = m[5] || '';
    if (!sub) { const mm = rest.match(/^([^:.،]{2,40}):\s*/); if (mm && mm[1].split(' ').length <= 5 && !/^(من|إذا|إن|يجب|يصح|الاعتكاف)/.test(bare(mm[1]))) { sub = mm[1]; rest = rest.slice(mm[0].length); } }
    let fromSub = false;
    if (!sub && lastSub) { sub = lastSub; fromSub = true; }
    sub = sub.replace(/:$/, '').trim();
    out.push({ t: 'h', kind: 'fasl', title: sub ? 'فصلٌ: ' + sub : 'فصلٌ', editorial: !!m[5] || fromSub, page: q.page });
    lastSub = '';
    rest = cleanText(rest);
    if (rest) out.push({ t: 'p', text: rest, page: q.page });
    continue;
  }
  let text = cleanText(t);
  // the Qatar edition's lettered lists (أ ب ج د هـ و ز ح) in the hajj (p. 119–120) and the inheritance examples (p. 187–188)
  if (q.page >= 119 && q.page <= 120 || q.page >= 187 && q.page <= 188) {
    text = text.replace(/أفالإفرادُ/, 'فالإفرادُ').replace(/^أجدُّ،/, 'جدٌّ،')
      .replace(/^أ(?=(بنتٌ|زوجٌ))/, '').replace(/^(هـ|[بجدزح])(-\s*|\s+)/, '').replace(/^و(?=جدٌّ، وأخوانِ)/, '');
  }
  if (text) out.push({ t: 'p', text, page: q.page });
}
fs.writeFileSync(path.join(O, 'A.json'), JSON.stringify(out, null, 1));
const H = out.filter(x => x.t === 'h');
console.log('items', out.length, 'headings', H.length, 'kitab', H.filter(x => x.kind === 'kitab').length, 'bab', H.filter(x => x.kind === 'bab').length, 'fasl', H.filter(x => x.kind === 'fasl').length,
  'words', out.filter(x => x.t === 'p').reduce((s, x) => s + x.text.split(' ').length, 0));
console.log(H.map(h => h.page + ' ' + h.kind + ' ' + h.title).join('\n'));
