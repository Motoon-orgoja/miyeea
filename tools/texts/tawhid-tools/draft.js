// drafts find/replace entries (variants.json) for the hunks where 11318 and Wikisource agree against the built text.
// deletions and honorific insertions are drafted fully; other entries get "replace": "TODO" + the witness reading for hand vocalizing.
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const C = JSON.parse(fs.readFileSync(R('raw/tawhid/both-classified.json')));
const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^ء-ي]/g, '');
// token stream with para marks, same indexing as collate.js (index counts only tokens with letters)
const toks = []; let bab = 0;
for (const l of fs.readFileSync(R('raw/tawhid/tawhid-plain.txt'), 'utf8').split('\n')) {
  if (/^## /.test(l)) { bab = +l.split(' ')[1]; toks.push({ w: '§', bab, title: true }); for (const w of l.replace(/^## \d+ /, '').split(/\s+/)) if (norm(w)) toks.push({ w, bab, title: true }); continue }
  if (!l.trim()) continue;
  toks.push({ w: '¶', bab });
  for (const w of l.split(/\s+/)) if (w) toks.push({ w, bab, letters: !!norm(w) });
}
const idx = []; toks.forEach((t, i) => { if (t.letters || (t.title && t.w !== '§')) idx.push(i) });
const HON = { 'رضي الله عنه': 'رَضِيَ اللَّهُ عَنْهُ', 'رضي الله عنهما': 'رَضِيَ اللَّهُ عَنْهُمَا', 'صلى الله عليه وسلم': 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', 'تعالى': 'تَعَالَى', 'تبارك وتعالى': 'تَبَارَكَ وَتَعَالَى' };
const out = [];
for (const k of ['del', 'hon', 'other']) for (const h of C[k]) {
  const a = idx[h.s] ?? toks.length, b = h.e > h.s ? idx[h.e - 1] + 1 : a; // token range [a,b)
  let lo = a - 1, n = 0; while (lo > 0 && n < 3) { if (toks[lo].letters) n++; lo-- } lo++;
  let hi = b, m = 0; while (hi < toks.length && m < 1) { if (toks[hi].letters) m++; hi++ }
  const seg = toks.slice(lo, hi);
  if (seg.some(t => t.title)) { out.push({ id: h.id, bab: h.bab, note: 'touches a title', old: h.old, wit: h.new }); continue }
  const find = seg.map(t => t.w).join(' ').replace(/^¶ | ¶$/g, '');
  const pre = toks.slice(lo, a).map(t => t.w), mid = toks.slice(a, b).map(t => t.w), post = toks.slice(b, hi).map(t => t.w);
  let rep = 'TODO';
  if (k === 'del') {
    // keep structural marks of the removed words: an opening ﴿/« goes to the next word, a closing ﴾/» and final punctuation to the previous
    const txt = mid.join(' '), open = (txt.match(/[﴿«]/g) || []).length - (txt.match(/[﴾»]/g) || []).length;
    const tail = (mid[mid.length - 1].match(/[.،؛:؟!]+$/) || [''])[0];
    let p = pre.slice();
    if (open < 0) p[p.length - 1] = p[p.length - 1].replace(/([.،؛:؟!]*)$/, '﴾$1'.replace('﴾', txt.includes('»') && !txt.includes('﴾') ? '»' : '﴾'));
    if (tail && !/[.،؛:؟!»﴾]$/.test(p[p.length - 1])) p[p.length - 1] += tail;
    let q = post.slice(); if (open > 0) q[0] = (txt.includes('﴿') ? '﴿' : '«') + q[0];
    rep = p.concat(q).join(' ');
  } else if (k === 'hon' && !h.old) {
    const w = HON[h.newN.replace(/ه$/, 'ه')] || HON[h.new.replace(/[:"،.]/g, '').trim()];
    if (w) { const p = pre.slice(); const punct = (p[p.length - 1].match(/[؛:،]$/) || [''])[0]; p[p.length - 1] = p[p.length - 1].replace(/[؛:،]$/, ''); rep = p.join(' ') + ' ' + w + punct + ' ' + post.join(' ') }
  }
  out.push({ id: h.id, bab: h.bab, find: find.replace(/ ¶ /g, ' ¶ '), replace: rep.replace(/^¶ | ¶$/g, ''), wit: h.new, kind: k });
}
fs.writeFileSync(path.join(__dirname, 'variants-draft.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'todo', out.filter(x => x.replace === 'TODO').length, 'title', out.filter(x => x.note).length);
