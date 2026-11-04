// Builds tools/texts/tawhid.json from the matn of «التوضيح الرشيد» (Shamela 13277, نغوي; matn fully vocalized).
// usage: node build.js            (needs ../raw/tawhid/matn13277.json from extract.js)
// writes: ../tawhid.json, ../raw/tawhid/tawhid-plain.txt (one para per line, for collation), ../raw/tawhid/build-log.json
const fs = require('fs'), path = require('path');
const { locate, skel } = require('./quran.js');
const R = p => path.join(__dirname, '..', p);
const babs = JSON.parse(fs.readFileSync(R('raw/tawhid/matn13277.json'), 'utf8'));
const MANUAL = JSON.parse(fs.readFileSync(path.join(__dirname, 'manual.json'), 'utf8'));
const SUPP = JSON.parse(fs.readFileSync(path.join(__dirname, 'supplement.json'), 'utf8'));
const log = { quran: [], lin: {}, jalala: 0, qamari: 0, skippedLin: [], manual: [], refsWithAya: [], supplement: [] };
const H = '[ً-ْٰ]';
const words = t => t.split(/\s+/).filter(Boolean).length;

// ---------- 1. paragraphs of each bab, joined across page breaks ----------
function joinPages(b) {
  const out = [];
  b.paras.forEach((x, i) => {
    const prev = b.paras[i - 1];
    if (prev && prev.p !== x.p && out.length) {
      const e = out[out.length - 1].replace(/\s*\([٠-٩]+\)\s*$/, '');
      if (!/[.:!؟?]$|[.!؟]\)+\.?$|»\.?$/.test(e) && !/^فِيهِ مَسَائِلُ/.test(x.x)) { out[out.length - 1] += ' ' + x.x; return }
    }
    out.push(x.x);
  });
  return out;
}

// ---------- 2. text transformations ----------
const HON = { 'ﷺ': 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', '﵁': 'رَضِيَ اللَّهُ عَنْهُ', '﵂': 'رَضِيَ اللَّهُ عَنْهَا',
  '﵃': 'رَضِيَ اللَّهُ عَنْهُمْ', '﵄': 'رَضِيَ اللَّهُ عَنْهُمَا', '﵊': 'عَلَيْهِ الصَّلَاةُ وَالسَّلَامُ', '﵎': 'تَبَارَكَ وَتَعَالَى', '﵀': 'رَحِمَهُ اللَّهُ', '﷿': 'عَزَّ وَجَلَّ',
  'ﷻ': 'جَلَّ جَلَالُهُ', '﵇': 'عَلَيْهِ السَّلَامُ', '﵏': 'رَحِمَهُمُ اللَّهُ', '﷾': 'سُبْحَانَهُ وَتَعَالَى' };
const SURAS = 'الفاتحة البقرة آل_عمران النساء المائدة الأنعام الأعراف الأنفال التوبة يونس هود يوسف الرعد إبراهيم الحجر النحل الإسراء الكهف مريم طه الأنبياء الحج المؤمنون النور الفرقان الشعراء النمل القصص العنكبوت الروم لقمان السجدة الأحزاب سبأ فاطر يس الصافات ص الزمر غافر فصلت الشورى الزخرف الدخان الجاثية الأحقاف محمد الفتح الحجرات ق الذاريات الطور النجم القمر الرحمن الواقعة الحديد المجادلة الحشر الممتحنة الصف الجمعة المنافقون التغابن الطلاق التحريم الملك القلم الحاقة المعارج نوح الجن المزمل المدثر القيامة الإنسان المرسلات النبأ النازعات عبس التكوير الانفطار المطففين الانشقاق البروج الطارق الأعلى الغاشية الفجر البلد الشمس الليل الضحى الشرح التين العلق القدر البينة الزلزلة العاديات القارعة التكاثر العصر الهمزة الفيل قريش الماعون الكوثر الكافرون النصر المسد الإخلاص الفلق الناس'.split(' ').map(s => s.replace('_', ' '));
// quotes with no reference that the lookup would place in the wrong sura
const QHINT = { 'وَمَا هُمْ بِخَارِجِينَ مِنَ النَّارِ': { s: 2, a: 167 } };
const SURA_REF = /\s*\[[^\]\[]*?:\s*[٠-٩][^\]\[]*\]/g;

function quran(t, where) {
  // replace each ﴿…﴾ by the imla'i Mushaf words (api.quran.com text_imlaei) over the same span
  // the editor's reference «[البَقَرَة: ١٦٧]» picks the sura (and aya) for the lookup, then is dropped
  return t.replace(/﴿([^﴾]+)﴾(\s*\[([^\]]+)\])?/g, (m, q, _r, ref) => {
    let hint = null;
    if (ref) {
      const mm = ref.match(/^([^:]+):\s*([٠-٩]+)/);
      if (mm) {
        const name = mm[1].replace(/[ً-ْ]/g, '').replace(/^سورة\s+/, '').trim().replace(/^ال/, '');
        const s = SURAS.findIndex(x => x.replace(/^ال/, '') === name) + 1;
        if (!s) log.quran.push({ where, unknownSura: ref }); else hint = { s, a: +mm[2].replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)) };
      }
    }
    // consecutive verses printed «… * …» become one ﴿﴾ per verse; a quote cut with «…» is located piece by piece
    const verses = q.split(/\s*\*\s*/).map(v => {
      const parts = v.split(/\s*(?:…|\.\.\.)\s*/);
      const res = parts.map(p => p.trim() ? locate(p.trim(), hint || QHINT[p.trim()]) : null);
      const out = res.map((r, i) => r ? r.text.replace(/ \* /g, ' ') : parts[i]).join(' … ');
      const rec = { where, ref: ref || '', src: v, mushaf: out, at: res.map(r => r && r.ref).join(','), cost: res.reduce((a, r) => a + (r ? r.cost : 0), 0) };
      if (res.some(r => r && !r.same) || out !== v) log.quran.push(rec);
      return '﴿' + out + '﴾';
    });
    return verses.join(' ') + (ref && /الآي/.test(ref) ? ' الآيَة' : '');
  });
}

// sukun on a bare و/ي after fatha (حرف لين): «قَولُ» → «قَوْلُ», «عَلَيكُمْ» → «عَلَيْكُمْ».
// Not before ا/ى/ة (the letter must be voweled there) nor before a doubled letter («التَّوكُّلُ» lacks a fatha, not a sukun).
function lin(w) {
  if (/[﴿﴾]/.test(w)) return w;
  return w.replace(/َ(ّ?)([وي])(?![ً-ْٰ])(?=(.)?(.)?)/g, (m, sh, l, n1, n2) => {
    // waw al-jama'a before the final alif («أَدَّوا» → «أَدَّوْا») takes the sukun; inside a word «وا/يا» needs a vowel
    if (n1 === 'ا' && l === 'و' && (!n2 || /[^ء-ي]/.test(n2))) { log.lin[w] = (log.lin[w] || 0) + 1; return 'َ' + sh + l + 'ْ' }
    if (n1 && /[اىة]/.test(n1)) { log.skippedLin.push(w); return m }
    if (n2 === 'ّ') { log.skippedLin.push(w); return m }
    log.lin[w] = (log.lin[w] || 0) + 1;
    return 'َ' + sh + l + 'ْ';
  });
}
// lafz al-jalala outside Qur'an: «اللهِ» → «اللَّهِ», «للهِ» → «لِلَّهِ»
function jalala(w) {
  let r = w.replace(/^((?:[وفبتك][َِ]?){0,3})الله(?=[ُِ َ]|$)/, (m, p) => p + 'اللَّه')
    .replace(/^((?:[وف]َ?){0,2})لِ?له(?=[ِ]|$)/, (m, p) => p + 'لِلَّه');
  if (r !== w) log.jalala++;
  return r;
}
// sukun on the article's lam before a moon letter when the lam is bare: «العِبَادِ» → «الْعِبَادِ», «لِلكُفَّارِ» → «لِلْكُفَّارِ»
const MOON = '[ءأإآبجحخعغفقكمهوي]';
function qamari(w) {
  const r = w.replace(new RegExp('^((?:[وفبكل][َِ]|أَ)*)ال(?=' + MOON + ')'), (m, p) => p + 'الْ')
    .replace(new RegExp('^((?:[وف]َ)?)لِل(?=' + MOON + ')'), (m, p) => p + 'لِلْ');
  if (r !== w) log.qamari++;
  return r;
}
// final mim of the plural pronouns (هُم، كُم، تُم) left bare: sukun, or damma before a wasl alif (عَلَيْكُمُ الْ…)
function mimJam(words) {
  return words.map((w, i) => w.replace(/([هكت][ُِ])م(?=[^ء-ْٰ]*$)/, (m, p) => {
    const next = (words[i + 1] || '').replace(/^[^ء-ي]+/, '');
    log.mim = (log.mim || 0) + 1;
    return p + 'م' + (/^ا/.test(next) && !/[.،؛:؟!»]$/.test(w) ? 'ُ' : 'ْ');
  }));
}
function perWord(t) {
  // Qur'an quotes are left as the Mushaf has them; leading/trailing marks («(-) stay outside the word
  const one = w => { const m = w.match(/^([^ء-ي]*)(.*?)([^ء-ْٰ]*)$/); return m[1] + qamari(jalala(lin(m[2]))) + m[3] };
  return t.split(/(﴿[^﴾]*﴾)/).map(s => s.startsWith('﴿') ? s : mimJam(s.split(' ').map(one)).join(' ')).join('');
}
function quotes(t) {
  // editorial marks → guillemets: ((حديث)) and (أثر) and "…"; footnote numbers already gone
  return t.replace(/\(\(\s*/g, '«').replace(/\s*\)\)/g, '»').replace(/\(\s*/g, '«').replace(/\s*\)/g, '»')
    .replace(/"([^"]*)"/g, '«$1»').replace(/«\s*/g, '«').replace(/\s*»/g, '»');
}
function clean(t, where) {
  t = t.normalize('NFC');
  t = t.replace(/\s*\([٠-٩]+\)/g, '');                          // footnote numbers
  t = quran(t, where);
  t = t.replace(SURA_REF, m => { if (/الآي/.test(m)) log.refsWithAya.push(where + ': ' + m.trim()); return /الآيَة/.test(m) ? ' الآيَة' : '' });
  t = t.replace(/[﵀-﵏ﷺ-﷿]/g, c => ' ' + (HON[c] || c) + ' ');
  t = t.replace(/\s+([،؛:.!؟,])/g, '$1').replace(/\s+/g, ' ').trim();
  t = perWord(t);
  t = quotes(t);
  t = t.replace(/ـ/g, '').replace(/\s+([،؛:.!؟»])/g, '$1').replace(/«\s+/g, '«').replace(/\s+/g, ' ').trim();
  return t.normalize('NFC');
}

// ---------- 3. units of 8–40 words ----------
function chunks(text, size, comma) {
  // cut long paragraphs at sentence ends (. ؟ ! ؛ :) — never inside a Qur'an quote; a piece still too long is cut at «،»
  const parts = [], re = comma ? /(?:﴿[^﴾]*﴾|[^.؟!؛:،﴿])+[.؟!؛:،]*[»]*\s*/g : /(?:﴿[^﴾]*﴾|[^.؟!؛:﴿])+[.؟!؛:]*[»]*\s*/g; let m;
  while ((m = re.exec(text))) parts.push(m[0]);
  const out = []; let cur = '';
  for (const p of parts) { if (cur && words(cur) + words(p) > size && words(cur) >= 8) { out.push(cur.trim()); cur = '' } cur += p }
  if (cur.trim()) out.push(cur.trim());
  if (out.length > 1 && words(out[out.length - 1]) < 8) out[out.length - 2] += ' ' + out.pop();
  return comma ? out : out.flatMap(p => words(p) > 45 ? chunks(p, size, true) : [p]);
}

const chapters = [];
babs.forEach((b, k) => {
  let P = joinPages(b);
  // the sharih's heading line of the bab
  let title = P.shift();
  if (k === 0) { // the book opens «كتاب التوحيد، وقول الله تعالى…» with no bab heading; the heading «باب حق الله على العبيد» is the sharih's
    title = 'كِتَابُ التَّوحِيدِ';
    P[0] = P[0].replace(/^كِتَابُ\s+\S+،\s*/, '');
    if (!/^وَقَولُ/.test(P[0])) throw new Error('book heading left in the first paragraph: ' + P[0].slice(0, 40));
  }
  if (!/^(ب[َا]|كِتَابُ)/.test(title)) throw new Error('bab ' + (k + 1) + ' heading? ' + title);
  title = clean(title, 'title ' + (k + 1)).replace(/[.:]$/, '');
  // «فيه مسائل»: the heading line goes with the first mas'ala
  let mi = P.findIndex(x => /^فِيهِ (مَسَائِلُ|أَكْبَرُ المَسَائِلِ)/.test(x));
  // a bab whose «فيه مسائل» the base edition leaves out: supplied (supplement.json) and listed in the report
  if (mi < 0 && SUPP[k + 1]) { mi = P.length; P.push(...SUPP[k + 1].lines); log.supplement.push(k + 1) }
  if (mi < 0) throw new Error('no masail in bab ' + (k + 1));
  const body = P.slice(0, mi), mas = P.slice(mi);
  if (mas.length > 1 && /^فِيهِ مَسَائِلُ:?$/.test(mas[0].trim())) { mas[1] = mas[0].trim() + ' ' + mas[1]; mas.shift() }
  let paras = [];
  body.forEach((x, i) => { const c = clean(x, (k + 1) + '.' + (i + 1)); paras.push(...(words(c) > 45 ? chunks(c, 35) : [c])) });
  const masParas = [];
  // short masa'il are grouped (each keeps its ordinal) up to ~30 words; a long one is cut at sentence ends
  let cur = '';
  mas.map((x, i) => clean(x, (k + 1) + '.m' + (i + 1))).forEach(m => {
    if (words(m) > 45) { if (cur) { masParas.push(cur); cur = '' } masParas.push(...chunks(m, 35)); return }
    if (cur && words(cur) + words(m) > 30) { masParas.push(cur); cur = '' }
    cur = cur ? cur + ' ' + m : m;
  });
  if (cur) { if (masParas.length && words(cur) < 8 && words(masParas[masParas.length - 1]) + words(cur) <= 45) masParas[masParas.length - 1] += ' ' + cur; else masParas.push(cur) }
  // a very short body paragraph joins the next one when it is not a self-standing verse line
  paras = paras.concat(masParas);
  chapters.push({ title, paras });
});

// ---------- 4. corrections ----------
// manual.json: fixes of the base edition's vocalization/typos; variants.json: readings taken from 11318 + Wikisource where both
// agree against the base. Each entry {bab, find, replace[, title][, count]} must hit exactly (count || 1) times;
// a find may span paragraphs with « ¶ » (paragraphs are joined by « ¶ » while the fixes run).
const fixErrors = [];
const VARIANTS = JSON.parse(fs.readFileSync(path.join(__dirname, 'variants.json'), 'utf8'));
for (const [list, name] of [[MANUAL, 'manual'], [VARIANTS, 'variants']]) for (const c0 of list) {
  const c = Object.assign({}, c0, { find: c0.find.normalize('NFC'), replace: c0.replace.normalize('NFC') });
  const ch = chapters[c.bab - 1];
  if (c.title) {
    const n = ch.title.split(c.find).length - 1;
    if (n !== (c.count || 1)) { fixErrors.push(name + ' title fix hits ' + n + ': ' + JSON.stringify(c)); continue }
    ch.title = ch.title.split(c.find).join(c.replace);
  } else {
    const t = ch.paras.join(' ¶ '), n = t.split(c.find).length - 1;
    if (n !== (c.count || 1)) { fixErrors.push(name + ' fix hits ' + n + ': ' + JSON.stringify(c)); continue }
    ch.paras = t.split(c.find).join(c.replace).split(' ¶ ').map(p => p.trim()).filter(Boolean);
  }
  log.manual.push(Object.assign({ list: name }, c));
}

// tokens.json: single words the base left with a missing or wrong mark, fixed wherever they stand as a whole word
const TOKENS = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf8'));
log.tokens = {};
for (const [f0, r0] of TOKENS) {
  const f = f0.normalize('NFC'), r = r0.normalize('NFC');
  const esc = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(?<=^|[\\s«(\\-])' + esc + '(?=$|[\\s.،؛:؟!»)\\-])', 'g');
  let n = 0;
  for (const ch of chapters) {
    ch.title = ch.title.replace(re, () => { n++; return r });
    ch.paras = ch.paras.map(p => p.replace(re, () => { n++; return r }));
  }
  if (!n) fixErrors.push('token fix never applied: ' + f0); else log.tokens[f0 + ' → ' + r0] = n;
}
// a quotation running over several source paragraphs keeps plain "…" marks: pair them per chapter
for (const ch of chapters) {
  let open = false;
  const t = ch.paras.join(' ¶ ').replace(/"/g, () => (open = !open) ? '«' : '»').replace(/«\s+/g, '«').replace(/\s+»/g, '»');
  if (open) fixErrors.push('unpaired quote mark in ' + ch.title);
  ch.paras = t.split(' ¶ ');
}
if (fixErrors.length) { console.error(fixErrors.join('\n')); process.exit(1) }
const J = {
  source: 'https://shamela.ws/book/13277 (التوضيح الرشيد في شرح كتاب التوحيد، خلدون نغوي، دار اللؤلؤة ط1 1443هـ: «المتن» المشكول في أول كل باب مع «فيه مسائل»)',
  check: 'مقابلة آلية كلمة بكلمة مع https://shamela.ws/book/11318 (كتاب التوحيد، ضمن مؤلفات الشيخ، جامعة الإمام، تحقيق عبد العزيز السعيد وغيره) و ويكي مصدر؛ الآيات من نص المصحف الإملائي (api.quran.com) — انظر tawhid-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  note: 'الأبواب ٦٦ بابًا بعد «كتاب التوحيد» الافتتاحي، وفي آخر كل باب «فِيهِ مَسَائِلُ» للمصنف كاملة.',
  chapters
};
fs.writeFileSync(R('tawhid.json'), JSON.stringify(J, null, 1) + '\n');
fs.writeFileSync(R('raw/tawhid/tawhid-plain.txt'), chapters.map((c, i) => '## ' + (i + 1) + ' ' + c.title + '\n' + c.paras.join('\n')).join('\n') + '\n');
fs.writeFileSync(R('raw/tawhid/build-log.json'), JSON.stringify(log, null, 1));
const all = chapters.flatMap(c => c.paras);
console.log('chapters', chapters.length, 'paras', all.length, 'words', all.reduce((a, p) => a + words(p), 0),
  'short<8', all.filter(p => words(p) < 8).length, 'long>45', all.filter(p => words(p) > 45).length,
  'quran changes', log.quran.length, 'lin', Object.values(log.lin).reduce((a, b) => a + b, 0), 'jalala', log.jalala, 'qamari', log.qamari, 'linSkipped', log.skippedLin.length);
