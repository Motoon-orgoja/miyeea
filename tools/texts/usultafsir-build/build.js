// Builds ../usultafsir.json from out/base.json (shamela 12081): logged corrections, Qur'an quotes replaced by the imla'i Mushaf
// text in ﴿﴾ (sura refs dropped), paragraphs cut at sentence ends into units of about 8–40 words.
// usage: node text.js && node build.js
const fs = require('fs'), path = require('path');
const { locate } = require('./quran.js');
const base = require('./out/base.json');
const log = { fixes: [], quran: [], units: 0 };
// ---- 1. corrections of clear misprints in the base (each checked against Wikisource WS and/or مجموع الفتاوى MF; see usultafsir-sources.md)
const FIX = require('./fixes.json'); // [[from, to, why], ...]
const used = new Set();
for (const c of base) c.paras = c.paras.map(t => { for (const [a, b, why] of FIX) if (t.includes(a)) { t = t.split(a).join(b); used.add(a); log.fixes.push({ from: a, to: b, why }); } return t; });
for (const [a] of FIX) if (!used.has(a)) throw new Error('fix not applied: ' + a);
// ---- 2. Qur'an: {…} [سورة: n] → ﴿Mushaf words﴾
const SURAS = 'الفاتحة البقرة آل_عمران النساء المائدة الأنعام الأعراف الأنفال التوبة يونس هود يوسف الرعد إبراهيم الحجر النحل الإسراء الكهف مريم طه الأنبياء الحج المؤمنون النور الفرقان الشعراء النمل القصص العنكبوت الروم لقمان السجدة الأحزاب سبأ فاطر يس الصافات ص الزمر غافر فصلت الشورى الزخرف الدخان الجاثية الأحقاف محمد الفتح الحجرات ق الذاريات الطور النجم القمر الرحمن الواقعة الحديد المجادلة الحشر الممتحنة الصف الجمعة المنافقون التغابن الطلاق التحريم الملك القلم الحاقة المعارج نوح الجن المزمل المدثر القيامة الإنسان المرسلات النبأ النازعات عبس التكوير الانفطار المطففين الانشقاق البروج الطارق الأعلى الغاشية الفجر البلد الشمس الليل الضحى الشرح التين العلق القدر البينة الزلزلة العاديات القارعة التكاثر العصر الهمزة الفيل قريش الماعون الكوثر الكافرون النصر المسد الإخلاص الفلق الناس'.split(' ').map(s => s.replace('_', ' '));
const QHINT = require('./qhint.json'); // quotes without a usable reference: {quote: {s, a}}
const ar2 = s => +String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
function quran(t, where) {
  return t.replace(/\{([^}]+)\}(\s*\[([^\]]+)\])?/g, (m, q, _r, ref) => {
    let hint = null;
    if (ref) {
      const mm = ref.match(/^([^:]+):\s*([٠-٩0-9]+)/);
      if (mm) { const s = SURAS.indexOf(mm[1].trim()) + 1; if (s) hint = { s, a: ar2(mm[2]) }; else log.quran.push({ where, unknownSura: ref }); }
    }
    if (QHINT[q.trim()]) hint = QHINT[q.trim()];
    const parts = q.split(/\s*(?:…|\.\.\.)\s*/);
    const res = parts.map(p => p.trim() ? locate(p.trim(), hint) : null);
    const out = res.map((r, i) => r ? r.text : parts[i]).join(' … ');
    log.quran.push({ where, src: q, ref: ref || '', mushaf: out, at: res.map(r => r && r.ref).join(','), cost: res.reduce((a, r) => a + (r ? r.cost : 0), 0), len: res.reduce((a, r) => a + (r ? r.len : 0), 0) });
    return '﴿' + out + '﴾';
  });
}
// ---- 3. cut into units at sentence ends (. ؟ !), long sentences further at ؛ then ، or : — never inside ﴿﴾ or «»
const words = s => s.split(/\s+/).filter(Boolean).length;
function cut(text, enders) {
  const out = []; let cur = '', depth = 0;
  for (const tk of text.split(/(\s+)/)) {
    cur += tk;
    for (const ch of tk) { if (ch === '﴿' || ch === '«') depth++; if (ch === '﴾' || ch === '»') depth--; }
    if (depth <= 0 && enders.test(tk)) { out.push(cur.trim()); cur = ''; depth = 0; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function pack(pieces, max) { // join consecutive pieces while ≤ max words
  const out = [];
  for (const p of pieces) { if (out.length && words(out[out.length - 1]) + words(p) <= max) out[out.length - 1] += ' ' + p; else out.push(p); }
  return out;
}
function units(para) {
  const res = [];
  for (const s of pack(cut(para, /[.؟!][»"]?$/), 30)) {
    if (words(s) <= 40) { res.push(s); continue; }
    let sub = pack(cut(s, /؛$/), 32);
    sub = sub.flatMap(x => words(x) <= 40 ? [x] : pack(cut(x, /[،:]$/), 30));
    res.push(...sub);
  }
  // a tiny piece joins its neighbour
  for (let i = 0; i < res.length && res.length > 1; i++) if (words(res[i]) < 8) {
    if (i + 1 < res.length) { res[i + 1] = res[i] + ' ' + res[i + 1]; } else { res[i - 1] += ' ' + res[i]; }
    res.splice(i, 1); i--;
  }
  return res;
}
const chapters = base.map((c, ci) => {
  const paras = c.paras.flatMap((p, pi) => units(quran(p, ci + '.' + pi)));
  // a source paragraph shorter than 8 words («فالجواب:», «رب يسر وأعن برحمتك») joins the next unit
  for (let i = 0; i < paras.length && paras.length > 1; i++) if (words(paras[i]) < 8) {
    if (i + 1 < paras.length) paras[i + 1] = paras[i] + ' ' + paras[i + 1]; else paras[i - 1] += ' ' + paras[i];
    paras.splice(i, 1); i--;
  }
  log.units += paras.length;
  const o = { title: c.title }; if (c.group) o.group = c.group; o.paras = paras; return o;
});
const J = {
  source: 'https://shamela.ws/book/12081 (مقدمة في أصول التفسير لابن تيمية، ط. دار مكتبة الحياة، بيروت ١٩٨٠م، ترقيم موافق للمطبوع) — the source is NOT vocalized (only scattered words carry harakat); Qur\'an quotes are the imla\'i Mushaf text (api.quran.com text_imlaei)',
  check: 'word-by-word script collation with Wikisource «مقدمة في التفسير» (https://ar.wikisource.org/wiki/مقدمة_في_التفسير) and مجموع الفتاوى ج13 on Wikisource (https://ar.wikisource.org/wiki/مجموع_الفتاوى/المجلد_الثالث_عشر) — see usultafsir-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  chapters
};
fs.writeFileSync(path.join(__dirname, '../usultafsir.json'), JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(path.join(__dirname, 'out/build-log.json'), JSON.stringify(log, null, 1));
const all = chapters.flatMap(c => c.paras), wc = all.map(words);
console.log('chapters', chapters.length, 'units', all.length, 'words', wc.reduce((a, b) => a + b, 0), 'min', Math.min(...wc), 'max', Math.max(...wc), '<8:', wc.filter(x => x < 8).length, '>40:', wc.filter(x => x > 40).length);
console.log('quran quotes', log.quran.length, 'not exact:', log.quran.filter(q => q.cost > 0).length);
