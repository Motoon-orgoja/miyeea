// Witness texts for the collation, from the OCR text layers archive.org made of three independent printed editions
// (raw files in raw/umdasalik/archive/):
//   H = «عمدة السالك» ت. ماجد الحموي، دار ابن حزم (archive.org/details/umdahsalik) — the whole book (matn + footnotes, OCR of a vocalized print)
//   N = «أنوار المسالك شرح عمدة السالك» للغمراوي ت. محمد صلاح نويدر (archive.org/details/a2345n) — the matn words in parentheses
//   F = «فيض الإله المالك في حل ألفاظ عمدة السالك» للبقاعي، دار الكتب العلمية (archive.org/details/Pdf4189) — the matn words in parentheses
// -> out/H.txt, out/N.txt, out/F.txt (plain text, one segment per line)
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, '../raw/umdasalik/archive'), O = path.join(__dirname, 'out');
const rd = f => fs.readFileSync(path.join(RAW, f), 'utf8').replace(/\r/g, '');
// the OCR prints ')١(' for '(١)' in RTL lines and uses Persian digits; footnote markers are dropped
const fixParens = s => s.replace(/\)([0-9٠-٩۰-۹]{1,2})\(/g, '($1)').replace(/[(\[]\s*[0-9٠-٩۰-۹؟]{1,2}\s*[)\]]/g, ' ')
  .replace(/[“”"'`'^*]+/g, ' ');
{ // H: drop footnote lines (start with a marker) — the rest is matn; noise is left for the aligner
  const L = rd('hazm_umdahsalik_djvu.txt').split('\n');
  const end = L.findIndex((l, i) => i > 20000 && /بالصواب/.test(l));
  const out = [];
  let inNote = false;
  for (let i = 280; i <= end; i++) {
    let l = L[i];
    if (/^\s*$/.test(l)) { inNote = false; continue; }
    if (/^\s*[(\[)]\s*[0-9٠-٩۰-۹؟]{1,2}\s*[)\]()]/.test(l) || /^\s*\)[0-9٠-٩۰-۹]{1,2}\(/.test(l)) { inNote = true; continue; }
    if (inNote) continue;
    out.push(fixParens(l).replace(/[()\[\]]/g, ' '));
  }
  fs.writeFileSync(path.join(O, 'H.txt'), out.join('\n'));
  console.log('H lines', out.length);
}
// N, F: everything inside parentheses (may span lines), in order
function parens(txt, from, to) {
  const s = fixParens(txt.split('\n').slice(from, to).join('\n'));
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    // no nesting: an unbalanced «(» (OCR) would otherwise swallow the rest; a segment longer than 300 chars is OCR debris
    if (ch === '(') { if (depth && cur.length < 300) out.push(cur.replace(/\s+/g, ' ').trim()); depth = 1; cur = ''; continue; }
    if (ch === ')') { if (depth && cur.length < 300) out.push(cur.replace(/\s+/g, ' ').trim()); depth = 0; cur = ''; continue; }
    if (depth) cur += ch;
  }
  return out.filter(Boolean);
}
{
  const t = rd('anwar_nuwaidar_djvu.txt');
  const L = t.split('\n'); const st = L.findIndex(l => /الحمد لله رب العالمين/.test(l));
  const out = parens(t, Math.max(0, st - 2), L.length);
  fs.writeFileSync(path.join(O, 'N.txt'), out.join('\n'));
  console.log('N segments', out.length, 'from line', st);
}
{
  const t = rd('fayd_dki_djvu.txt');
  const L = t.split('\n'); const st = L.findIndex(l => /\(الحمد لله/.test(l));
  const out = parens(t, Math.max(0, st - 2), L.length);
  fs.writeFileSync(path.join(O, 'F.txt'), out.join('\n'));
  console.log('F segments', out.length, 'from line', st);
}
