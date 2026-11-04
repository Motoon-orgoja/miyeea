// Extracts the text of the Risala from the raw Shamela pages in tools/texts/raw/risala/ into risala-build/out/<src>.json
//   F  = shamela 21589 «الفواكه الدواني» (Dar al-Fikr 1415): the vocalized matn printed at the top of each page, above «ــ»
//   T  = shamela 1430  Risala, «نسخة التتائي», ed. al-Sanari (Ma'had al-Makhtutat 1442): critical text, partly vocalized
//   M  = shamela 11373 «متن الرسالة» (Dar al-Fikr): unvocalized matn
//   Th = shamela 7441  «الثمر الداني» (al-Maktaba al-Thaqafiyya): unvocalized matn at the top of each page
// Each output: {paras:[{text, page, head?:true}]}  (head = a chapter heading paragraph as the source prints it)
// usage: node extract.js
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '../raw/risala'), OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const pages = dir => fs.readdirSync(path.join(RAW, dir)).filter(f => /^\d+\.html$/.test(f)).map(f => +f.replace('.html', '')).sort((a, b) => a - b);
const read = (dir, p) => fs.readFileSync(path.join(RAW, dir, p + '.html'), 'utf8');
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const clean = s => ent(s.replace(/<a [\s\S]*?<\/a>/g, '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')).replace(/<div\s*$/, '').replace(/\s+/g, ' ').trim();
// a page whose matn ends inside a paragraph prints the separator inline: «… اللَّهُ. ــ [الفواكه الدواني] …»
const sep = t => /(^|\s)ــ(\s|$)/.test(t) ? [t.split(/(?:^|\s)ــ(?:\s|$)/)[0].trim(), true] : [t, false];
const ps = html => html.split(/<p[ >]/).slice(1).map(b => '<p ' + b);

// ---------- F: matn above the «ــ» paragraph ----------
function F() {
  const out = [];
  for (const p of pages('shamela-21589-fawakih')) {
    const h = read('shamela-21589-fawakih', p);
    for (const raw of ps(h)) {
      if (/class="hamesh"/.test(raw)) break;
      const [t, stop] = sep(clean(raw));
      // drop the printer's verse references «[الملك: ١٤]»
      if (t && !/^[.\s]+$/.test(t) && !/^\[[^\]]*\]$/.test(t)) out.push({ text: t.replace(/\s*\[[^\]0-9٠-٩]*:\s*[0-9٠-٩]+\]/g, ''), page: p });
      if (stop) break;
    }
  }
  return out;
}
// ---------- T: Sanari's critical text, pages 75 (المقدمة) to the end of the matn ----------
function T() {
  const out = [];
  for (const p of pages('shamela-1430-tatai')) {
    if (p < 75) continue;
    const h = read('shamela-1430-tatai', p).split(/<hr>|<p class="hamesh">/)[0];
    for (const raw of ps(h)) {
      let t = raw.replace(/<span class="c2">\s*\([٠-٩0-9]+\)\s*<\/span>/g, ' '); // footnote numbers
      t = clean(t)
        .replace(/\s?\([٠-٩0-9]+\)/g, ' ') // footnote numbers nested in a quotation
        .replace(/\/\s*[أبخحدج]\s*[٠-٩0-9]+\s*[أب]?\s*\//g, ' ') // manuscript folio marks «/ أ ٧٨/» «/ خ ٢١ ب/»
        .replace(/\s=\s/g, ' ').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      const bh = t.match(/^\[(باب[^\]]*)\]$/); // a bab title the editor supplied from the other copies
      if (bh) t = bh[1];
      else if (/^\[[\s\S]*\]$/.test(t)) continue; // the editor's sub-headings «[[الإيمان بالله:]]», «[صفة الرضاع المحرم:]»
      t = t.replace(/\[(?:آية|آيه|سورة)[^\]]*\]/g, ' ').replace(/[\[\]]/g, '').replace(/\s+([،؛:.])/g, '$1').replace(/\s+/g, ' ').trim();
      const head = /^باب[ٌُ]?\s/.test(t) && t.split(' ').length <= 30 && !/[.:]$/.test(t);
      out.push({ text: t, page: p, head: head || undefined });
      if (p >= 329 && /تَسْلِيمًا كَثِيرًا/.test(t)) return out; // end of the matn (the bibliography follows)
    }
  }
  return out;
}
// ---------- M: Dar al-Fikr unvocalized matn ----------
function M() {
  const out = [];
  for (const p of pages('shamela-11373-matn')) {
    for (const raw of ps(read('shamela-11373-matn', p))) {
      const t = clean(raw);
      if (!t || t === 'المجلد الأول' || /^المجلد/.test(t)) continue;
      const m = t.match(/^\[(باب[^\]]*)\]$/);
      if (m) out.push({ text: m[1], page: p, head: true }); else out.push({ text: t, page: p });
    }
  }
  return out;
}
// ---------- Th: al-Thamar al-Dani, matn above «ــ» ----------
function Th() {
  const out = [];
  for (const p of pages('shamela-7441-thamar')) {
    for (const raw of ps(read('shamela-7441-thamar', p))) {
      const [t, stop] = sep(clean(raw));
      if (t && !/^\[[^\]]*\]$/.test(t)) out.push({ text: t.replace(/"/g, ''), page: p });
      if (stop) break;
    }
  }
  return out;
}
// ---------- K: «كفاية الطالب الرباني» (in shamela 21597, Dar al-Fikr, vocalized): the matn words it quotes in «(…)» (class c2),
// above the «ــ» that separates it from al-Adawi's gloss. Used only to check vowels.
function K() {
  const out = [];
  for (const p of pages('shamela-21597-adawi')) {
    let h = read('shamela-21597-adawi', p);
    const cut = h.search(/<p><span[^>]*><\/span>ــ<|\sــ\s/); if (cut > 0) h = h.slice(0, cut);
    for (const m of h.matchAll(/<span class="c2">([\s\S]*?)<\/span>/g)) {
      const t = clean(m[1]).replace(/^\(|\)$/g, '').trim();
      if (t) out.push({ text: t, page: p });
    }
  }
  return out;
}
for (const [k, f] of Object.entries({ F, T, M, Th, K })) {
  const paras = f();
  fs.writeFileSync(path.join(OUT, k + '.json'), JSON.stringify({ paras }, null, 0));
  console.log(k, 'paras', paras.length, 'words', paras.reduce((n, x) => n + x.text.split(' ').length, 0), 'heads', paras.filter(x => x.head).length);
}
