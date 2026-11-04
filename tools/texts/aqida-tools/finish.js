// Final pass shared by wasitiyya / lumaa: connecting vowels, formula, spelling, punctuation, paragraphs, chapters.
const { norm } = require('./lib');
const { units, join, bare } = require('./harakat');
const SUK = 'ْ', FAT = 'َ', DAM = 'ُ', KAS = 'ِ';
const startsWasl = w => /^ا/.test(bare(w).replace(/^[«(\[]+/, ''));
const MARKED = w => /[ً-ْ]/.test(w);
const PUN = /[.،؛:!؟?…]+$/;
function splitPunct(w) { const m = w.match(/^(.*?)([.،؛:!؟?…»)\]\-–]*)$/); return [m[1], m[2]]; }
function setLast(w, mark) { const u = units(w), L = u.filter(x => !x.p); L[L.length - 1].m = L[L.length - 1].m.replace(/[ً-ِْ]/g, '') + mark; return join(u); }
function lastMark(w) { const L = units(w).filter(x => !x.p); return L.length ? L[L.length - 1].m : ''; }
function finish(T, opt = {}) {
  const log = [];
  // 0. clean tokens (NFC: vowel before shadda, as in the witnesses)
  T = T.map(x => ({ ...x, w: x.w.normalize('NFC').replace(/[«»()\[\]]/g, '').replace(/^-+|-+(?=[.،؛:]*$)/g, '').replace(/\.\.+(?!\.)/g, '.').replace(/(\S)\.\.\.$/, '$1…').replace(/؟\.$/, '؟') }))
    .filter(x => x.w && (/[ء-ي]/.test(x.w) || (x.head)));
  // punctuation-only tokens are glued to the previous word
  for (let i = T.length - 1; i > 0; i--) if (!/[ء-ي]/.test(T[i].w)) { T[i - 1].w += T[i].w; if (T[i].head && T[i + 1]) T[i + 1].head = T[i].head; T.splice(i, 1); }
  // 1. formulas left unvocalized in the witnesses
  const SAW = ['صَلَّى', 'اللَّهُ', 'عَلَيْهِ', 'وَسَلَّمَ'].map(s => s.normalize('NFC'));
  for (let i = 0; i + 3 < T.length; i++) {
    if (['صلي', 'الله', 'عليه', 'وسلم'].every((b, k) => norm(splitPunct(T[i + k].w)[0]) === b) && SAW.some((v, k) => splitPunct(T[i + k].w)[0] !== v)) {
      for (let k = 0; k < 4; k++) { const [w, p] = splitPunct(T[i + k].w); if (w !== SAW[k]) { log.push(`formula\t${i + k}\t${w} → ${SAW[k]}`); T[i + k].w = SAW[k] + p; } }
    }
  }
  // 1b. a madd letter carrying the vowel of the letter before it (سَبِيِلِهِ → سَبِيلِهِ)
  for (const x of T) { if (x.q) continue; const u = units(x.w), L = u.filter(z => !z.p); let ch = 0;
    for (let k = 1; k + 1 < L.length; k++) if (((L[k].c === 'ي' && L[k].m === KAS && L[k - 1].m.includes(KAS)) || (L[k].c === 'و' && L[k].m === DAM && L[k - 1].m.includes(DAM)))) { L[k].m = ''; ch = 1; }
    if (ch) { const nw = join(u); log.push(`madd	${x.i}	${x.w} → ${nw}`); x.w = nw; } }
  // 2. spelling السموات → السماوات outside the Qur'an
  for (const x of T) if (!x.q && /سَّمَوَات/.test(x.w)) { log.push(`spelling\t${x.i}\t${x.w}`); x.w = x.w.replace(/سَّمَوَات/g, 'سَّمَاوَات'); }
  // 3. connecting vowels before hamzat al-wasl, and their removal before other words (outside the Qur'an)
  for (let i = 0; i + 1 < T.length; i++) {
    const x = T[i], nx = T[i + 1]; if (x.q) continue;
    const [w, p] = splitPunct(x.w); if (p) continue; // a pause: the word is not joined to the next
    const b = bare(w), lm = lastMark(w), wasl = startsWasl(nx.w);
    let nw = w;
    // any word ending in sukun takes a connecting vowel before hamzat al-wasl; bare particles too
    if (wasl && (lm === SUK || (lm === '' && MARKED(w) && /^(?:[وف]?عن|[وف]?بل|[وفل]?قد|لقد|إن|أن|لم|[وف]?من|.*[هك]م|.*تم)$/.test(b))) && !/[اويى]$/.test(b)) {
      if (/^[وف]?من$/.test(b)) { const mm = (units(w).find(u => u.c === 'م') || { m: '' }).m; nw = setLast(w, mm.includes(KAS) && /^ال/.test(bare(nx.w)) ? FAT : KAS); } // مِنَ الْ… / مِنِ اسْ… / مَنِ
      else if (/م$/.test(b) && /(?:[هك]م|تم)$/.test(b)) nw = setLast(w, DAM);
      else nw = setLast(w, KAS);
    } else if (!wasl && /^(?:[وف]?من|[وف]?عن|[وف]?بل|[وفل]?قد|لقد|.*هم|.*كم|.*تم)$/.test(b) && (lm === KAS || lm === FAT || lm === DAM)) {
      // only the particles / pronoun endings: a vowel here is a connecting vowel copied from another context
      if (/^(?:[وف]?من|[وف]?عن|[وف]?بل|[وفل]?قد|لقد)$/.test(b) || (/(?:هم|كم|تم)$/.test(b) && lm === DAM && /[ُِ]$/.test((units(w).filter(x => !x.p).slice(-2)[0] || {}).m || ''))) nw = setLast(w, SUK);
    }
    if (nw !== w) { log.push(`wasl\t${x.i}\t${w} → ${nw}\tnext: ${nx.w}`); x.w = nw + p; }
  }
  // 3b. «وَقَوْلُهُ: صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ:» → no colon after وقوله
  for (let i = 0; i + 1 < T.length; i++) if (/^(?:وقوله|قوله|وقولِه)$/.test(norm(splitPunct(T[i].w)[0])) && /:$/.test(T[i].w) && norm(T[i + 1].w) === 'صلي') { log.push(`colon	${T[i].i}	${T[i].w}`); T[i].w = T[i].w.replace(/:$/, ''); }
  // 4. drop the author's «فَصْلٌ» markers (the chapters come from the edition's headings)
  if (opt.dropFasl) for (let i = T.length - 1; i >= 0; i--) if (!T[i].q && norm(splitPunct(T[i].w)[0]) === 'فصل') { if (T[i].head && T[i + 1]) T[i + 1].head = T[i].head; log.push(`fasl\t${T[i].i}\tdropped`); T.splice(i, 1); }
  // 5. render: Qur'an pieces in ﴿﴾ (inner punctuation dropped), paragraphs cut at sentence ends
  const chapters = []; let ch = null, para = [], n = 0;
  const flush = () => { if (para.length) { if (para.pstart) (ch.pstarts = ch.pstarts || []).push(ch.paras.length); ch.paras.push(para.join(' ').replace(/\s+([.،؛:!؟])/g, '$1')); para = []; n = 0; } };
  for (let i = 0; i < T.length; i++) {
    const x = T[i];
    if (x.head || !ch) { flush(); ch = { title: x.head ? x.head.title : '', group: x.head ? x.head.group : null, paras: [] }; chapters.push(ch); }
    if (x.pstart) flush(); // a numbered paragraph of the reference edition starts here
    let w = x.w;
    // a new «وَقَوْلُهُ: ﴿…﴾» unit starts a new paragraph
    if (n >= 8 && i > 0 && !x.q && (T[i - 1].qclose || /[.،؛:!؟]$/.test(T[i - 1].w) || /^(?:صحيح|حسن)$/.test(norm(T[i - 1].w))) && /^(?:وقوله|وقال)$/.test(norm(splitPunct(x.w)[0]))) flush();
    if (x.q) { w = (x.qopen ? '﴿' : '') + x.w + (x.qclose ? '﴾' + (x.punct || '') : ''); }
    if (x.pstart && !para.length) para.pstart = 1;
    para.push(w.normalize('NFC')); n++;
    const end = x.q ? (x.qclose ? x.punct || '' : '') : (w.match(PUN) || [''])[0];
    const next = T[i + 1];
    if (!next || next.head) continue;
    const takh = /^(?:متفق|رواه|حديث|الحديث|اخرجه|اخرجاه)$/.test(norm(splitPunct(next.w)[0])); // the takhrij stays with its hadith
    if (takh) continue;
    if ((x.qclose && next.qopen && n >= 30) || (/[.]/.test(end) && n >= 8) || (/[؛]/.test(end) && n >= 45) || (x.qclose && !x.punct && n >= 30 && /^و/.test(next.w)) || (/،/.test(end) && n >= 60)) flush();
  }
  flush();
  // a short tail (< 8 words) is joined to the paragraph before it
  for (const c of chapters) for (let k = c.paras.length - 1; k > 0; k--) if (c.paras[k].split(' ').length < 8 && !(c.pstarts || []).includes(k)) { c.paras[k - 1] += ' ' + c.paras[k]; c.paras.splice(k, 1); }
  return { chapters, log };
}
module.exports = { finish };
