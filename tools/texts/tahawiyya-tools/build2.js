// Builds tools/texts/tahawiyya.json on the common text: wording and 105-paragraph numbering of al-Albani's edition
// (Shamela 9568), vocalization transferred word by word from the vocalized witnesses:
//   1) the matn as it appears (quoted) in Ibn Abi al-Izz's commentary, Risala ed. (Shamela 8352) - the whole commentary text is searched
//   2) al-Qasim's vocalized edition (Shamela 574) where the word matches in wording and context
//   3) al-Albani's own vocalization where the word is already fully vocalized
//   4) otherwise completed by hand (MANUAL below), every word logged
// A word is taken from a witness only inside a run of >= 3 consecutive matching words (so the case ending fits the context).
// usage: node build2.js <rawdir> <out.json> <log.tsv>
const fs = require('fs'), path = require('path');
const [raw, out, logf] = process.argv.slice(2);
const NFC = s => s.normalize('NFC');
const MARKS = /[ً-ْٰ]/;
const letters = w => w.replace(/[ً-ْٰـ‌‍]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء$/, '').replace(/[^ء-ي]/g, '');
const PUN = /[،.:؛؟!]+$/;
const bare = w => w.replace(/[()«»"\[\]﴿﴾{}*]/g, '');

// ---------- 1. al-Albani: paragraphs 0 (intro) .. 105 ----------
const alb = fs.readFileSync(path.join(raw, 'albani.txt'), 'utf8').normalize('NFC').split('\n').filter(Boolean);
const paras = [[]];
for (const l of alb) {
  const m = l.match(/^([٠-٩]+) - (.*)$/);
  if (m) paras.push([m[2]]); else paras[paras.length - 1].push(l);
}
if (paras.length !== 106) throw new Error('expected 105 numbered paragraphs, got ' + (paras.length - 1));
// digitization slips in the Shamela copy of al-Albani (each checked against Ibn Abi al-Izz and al-Qasim; listed in the report)
const AFIX = [
  [/^\[بسم الله الرحمن الرحيم وبه نستعين\]\s*/, ''],       // basmala goes to its own field
  [/ولا شي مثله/, 'ولا شيء مثله'],
  [/خلق الخلق بعمله/, 'خلق الخلق بعلمه'],
  [/وَأَبُو عبيدة الْجَرَّاحِ/, 'وَأَبُو عبيدة بن الْجَرَّاحِ'],
  [/ولا ندعوا عَلَيْهِمْ/, 'ولا ندعو عَلَيْهِمْ'],
  [/فقد كفر \[ف\] \(١\) مَنْ/, 'فقد كفر فمَنْ'],
  [/انزجر \[و\] \(٢\) علم/, 'انزجر وعلم'],
  [/وَسَلَّم َ/g, 'وَسَلَّمَ'],
  [/عَارِفِينَ \[مؤمنين\] \(١\) /, 'عَارِفِينَ '],                  // al-Albani's addition from one MS (not in Ibn Abi al-Izz): dropped
  [/ \(٢\) \[تقدس عن كل سوء وحين \(١\) وتنزه عن كل عيب وشين\]/, ''],  // same
  [/عَنْهم/g, 'عَنْهُمْ'],
];
let A = paras.map(p => p.join(' '));
const ahits = AFIX.map(() => 0);
A = A.map(t => AFIX.reduce((s, [a, b], k) => { a = new RegExp(NFC(a.source), a.flags); if (a.test(s)) ahits[k]++; return s.replace(a, NFC(b)); }, t));
AFIX.forEach(([a], k) => { if (!ahits[k]) throw new Error('albani fix not applied: ' + a); });
// tokens; Qur'an = «( … ) [سورة: n]»
const P = A.map((t, pi) => {
  t = t.replace(/\s*\([٠-٩ا]\)/g, ' ');                                     // footnote marks (and one «(ا)» slip)
  t = t.replace(/\(([^()]+)\)\s*\[[^\]]*:\s*[٠-٩][^\]]*\]/g, ' ⟪$1⟫ ');      // Qur'an quotation + reference
  t = t.replace(/[()]/g, ' ').replace(/[\[\]]/g, ' ');                        // other parentheses / al-Albani's brackets (text kept)
  t = t.replace(/⟪\s*/g, ' ⟪').replace(/\s*⟫/g, '⟫ ');
  const toks = []; let q = false;
  for (let w of t.split(/\s+/).filter(Boolean)) {
    let open = false, close = false;
    if (w.startsWith('⟪')) { q = true; open = true; w = w.slice(1); }
    if (w.endsWith('⟫')) { close = true; w = w.slice(0, -1); }
    if (!w) { if (close && toks.length) toks[toks.length - 1].close = true; continue; }
    if (!letters(w)) { continue; }
    toks.push({ a: w, l: letters(w), quran: q, open, close, pi });
    if (close) q = false;
  }
  return toks;
});

// ---------- 2. donors ----------
const tokenize = text => text.split(/\s+/).map(w => ({ w, l: letters(w) })).filter(x => x.l);
const strip = h => h.replace(/<a [\s\S]*?<\/a>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const pages = d => fs.readdirSync(d).sort().map(f => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')));
const I = tokenize(NFC(pages(path.join(raw, 'shamela8352')).map(d => strip(d.nass)).join(' ')));
const Q = tokenize(NFC(fs.readFileSync(path.join(raw, 'qasim.txt'), 'utf8').replace(/\([٠-٩]+\)/g, ' ')));
const gramIndex = D => { const m = new Map(); for (let i = 0; i + 2 < D.length; i++) { const k = D[i].l + ' ' + D[i + 1].l + ' ' + D[i + 2].l; if (!m.has(k)) m.set(k, []); m.get(k).push(i); } return m; };
const IX = { I: gramIndex(I), Q: gramIndex(Q) };
const DON = { I, Q };
// LCS of a[0..] vs D[lo..hi), returns pairs [ai, dj]
function lcs(a, D, lo, hi) {
  const n = a.length, m = hi - lo, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i].l === D[lo + j].l ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const pr = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i].l === D[lo + j].l) { pr.push([i, lo + j]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return pr;
}
// keep only pairs in runs of >= 3 consecutive (in both sequences)
function runs(pr) {
  const keep = [];
  for (let s = 0; s < pr.length;) {
    let e = s; while (e + 1 < pr.length && pr[e + 1][0] === pr[e][0] + 1 && pr[e + 1][1] === pr[e][1] + 1) e++;
    if (e - s + 1 >= 3) for (let k = s; k <= e; k++) keep.push(pr[k]);
    s = e + 1;
  }
  return keep;
}
// fill toks[i].v from donor for still-empty stretches, trying the best 3-gram-voted regions of the donor
function transfer(toks, name) {
  const D = DON[name], ix = IX[name];
  for (let progress = true; progress;) {
    progress = false;
    const free = toks.map(t => !t.v), spans = [];
    for (let s = 0; s < toks.length;) { if (!free[s]) { s++; continue; } let e = s; while (e + 1 < toks.length && free[e + 1]) e++; spans.push([s, e]); s = e + 1; }
    for (const [fs_, fe] of spans) {
      const s = Math.max(0, fs_ - 2), e = Math.min(toks.length - 1, fe + 2), a = toks.slice(s, e + 1);
      if (a.length < 3) continue;
      const votes = new Map();
      for (let k = 0; k + 2 < a.length; k++) for (const p of ix.get(a[k].l + ' ' + a[k + 1].l + ' ' + a[k + 2].l) || []) { const st = p - k; votes.set(st, (votes.get(st) || 0) + 1); }
      const cl = [...votes.keys()].map(st => { let v = 0; for (let d = -15; d <= 15; d++) v += votes.get(st + d) || 0; return [st, v]; }).sort((x, y) => y[1] - x[1]);
      const tried = [];
      for (const [bs] of cl) {
        if (tried.some(t => Math.abs(t - bs) < 30)) continue; tried.push(bs); if (tried.length > 4) break;
        const lo = Math.max(0, bs - 20), hi = Math.min(D.length, bs + a.length + 40);
        let got = 0;
        for (const [ai, dj] of runs(lcs(a, D, lo, hi))) { const t = toks[s + ai]; if (!t.v) { t.v = D[dj].w; t.src = name; got++; } }
        if (got) { progress = true; break; }
      }
    }
  }
}
const fullyVoc = w => { const c = [...bare(w).replace(PUN, '')]; for (let i = 0; i < c.length; i++) { const ch = c[i]; if (!/[ء-ي]/.test(ch) || 'اويىآٱءة'.includes(ch)) continue; if (ch === 'ل' && (c[i - 1] === 'ا')) continue; if (!MARKS.test(c[i + 1] || '')) return false; } return MARKS.test(w); };
// hand completion: key = paragraph number + ':' + albani word (letters) -> vocalized word (each logged)
const MANUAL = JSON.parse(fs.readFileSync(path.join(__dirname, 'manual-voc.json'), 'utf8'));
const log = [];
P.forEach((toks, pi) => {
  transfer(toks, 'I');
  transfer(toks, 'Q');
  toks.forEach(t => {
    if (t.v && letters(t.v) !== t.l) throw new Error('letters mismatch ' + t.v + ' / ' + t.a);
    if (!t.v && fullyVoc(t.a)) { t.v = t.a; t.src = 'A'; }
    if (!t.v) { const k = pi + ':' + t.l; if (MANUAL[k]) { t.v = MANUAL[k]; t.src = 'M'; } }
  });
});
const missing = [];
P.forEach((toks, pi) => toks.forEach((t, k) => { if (!t.v) missing.push(pi + ':' + t.l + '\t' + toks.slice(Math.max(0, k - 3), k + 3).map(x => x.a).join(' ')); }));
if (missing.length) { fs.writeFileSync(logf + '.missing', missing.join('\n') + '\n'); console.log('MISSING', missing.length, '-> ' + logf + '.missing'); }

// ---------- 3. write ----------
const fixCase = { 'وَنَدْعُوا': 'وَنَدْعُو' };
const render = toks => {
  const o = [];
  toks.forEach((t, k) => {
    let w = bare(t.v || t.a);
    let p = (w.match(PUN) || [''])[0]; w = w.replace(PUN, '');
    if (t.quran) p = ''; // punctuation inside a quotation is not carried over
    w = fixCase[w] || w;
    if (t.open) w = '﴿' + w;
    if (t.close) w = w + '﴾';
    o.push(w + p);
  });
  let s = o.join(' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/[،:؛]$/, '');
  if (!/[.؟!]$/.test(s)) s += '.';
  return s;
};
const texts = P.map(render);
P.forEach((toks, pi) => toks.forEach(t => log.push([pi, t.a, t.v || '', t.src || '-'].join('\t'))));
fs.writeFileSync(logf, 'para\talbani\tout\tsrc\n' + log.join('\n') + '\n');
const CH = [
  ['مقدمة المتن', 0, 0], ['التوحيد وصفات الله', 1, 17], ['الخلق والمشيئة', 18, 28], ['النبي صلى الله عليه وسلم', 29, 32],
  ['القرآن كلام الله', 33, 34], ['الرؤية والتسليم والتنزيه', 35, 38], ['المعراج والحوض والشفاعة والميثاق', 39, 42], ['القدر', 43, 48],
  ['العرش والكرسي والإيمان بالملائكة والكتب', 49, 53], ['أهل القبلة', 54, 60], ['الإيمان', 61, 67], ['أهل الكبائر', 68, 68],
  ['الصلاة والجماعة وولاة الأمر', 69, 77], ['الملائكة والقبر واليوم الآخر', 78, 84], ['الاستطاعة وأفعال العباد', 85, 88],
  ['الدعاء وانتفاع الأموات', 89, 92], ['الصحابة والخلافة', 93, 96], ['العلماء والأولياء', 97, 99], ['أشراط الساعة', 100, 102],
  ['دين الإسلام والخاتمة', 103, 105],
];
let next = 0;
const chapters = CH.map(([title, a, b]) => { if (a !== next) throw new Error('gap at ' + a); next = b + 1; return { title, paras: texts.slice(a, b + 1) }; });
if (next !== 106) throw new Error('chapters do not cover 105');
const J = {
  source: 'https://shamela.ws/book/9568 (العقيدة الطحاوية، شرح وتعليق الألباني، المكتب الإسلامي ط2 1414هـ: اللفظ وترقيم الفقرات 1-105) + الشكل من https://shamela.ws/book/8352 (المتن في شرح ابن أبي العز، ط الرسالة، تحقيق التركي والأرنؤوط) ثم https://shamela.ws/book/574/121 (نشرة د. عبد المحسن القاسم المشكولة)',
  check: 'word-by-word script collation of al-Albani, Ibn Abi al-Izz (Risala) and al-Qasim; Arabic Wikisource seen - see tahawiyya-sources.md',
  basmala: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  note: 'اللفظ المتداول (نشرة الألباني الموافقة لمتن ابن أبي العز). الفقرة الأولى مقدمة المتن، والفقرات بعدها على ترقيم الألباني ١-١٠٥ بالترتيب. عناوين الأبواب تقسيم وصفي للتطبيق وليست من المتن.',
  chapters,
};
fs.writeFileSync(out, JSON.stringify(J, null, 1) + '\n');
const src = {}; P.flat().forEach(t => src[t.src || '-'] = (src[t.src || '-'] || 0) + 1);
console.log('paras', texts.length, 'words', P.flat().length, 'sources', JSON.stringify(src));
