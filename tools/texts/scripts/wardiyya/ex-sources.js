// Extracts the verses of لامية ابن الوردي from the raw ketabonline files into raw/wardiyya/*.verses.txt («a | b» per line)
//  H = Hajuri ed. (ko 23160) «نص اللامية», pages 2–6 (footnote lines and the footnote verses dropped; [..] editorial brackets removed)
//  U = the poem's own hemistichs inside the tahmis of al-Mallah, ed. Uwayda (ko 57150): lines «a ... b»
//  F = Turayfi sharh (ko 91514): the lemma verses in [..] (one or two verses per lemma, hemistichs not separated -> word stream only)
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '../../raw/wardiyya');
const pages = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')).map(p => String(p.content || '')
  .replace(/<br\s*\/?>/g, '\n').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '));
const clean = s => s.replace(/\[\d+\]/g, ' ').replace(/[\[\]«»"،,]/g, ' ').replace(/\s+/g, ' ').trim();
const save = (n, vs) => { fs.writeFileSync(path.join(R, n), vs.join('\n') + '\n'); console.log(n, vs.length); };
{ // H
  const P = pages('ko-23160-hajuri.json'); let t = P.slice(1, 6).join('\n');
  t = t.slice(t.indexOf('قال رحمه الله:') + 14, t.indexOf('الحمد لله، نحمده'));
  const lines = t.split('\n').map(x => x.trim()).filter(x => x && !/^\(\d+\)/.test(x) && !/^0@/.test(x));
  // drop the footnote verses of note (2) on page 2 (they follow the note line, which was removed): keep only lines before the first footnote block on each page
  const P2 = []; let foot = false;
  for (const p of P.slice(1, 6)) { const ls = p.split('\n').map(x => x.trim()).filter(Boolean); foot = false;
    for (const l of ls) { if (/^\(\d+\)/.test(l)) { foot = true; continue; } if (foot) continue; P2.push(l); } }
  let body = P2.join('\n'); body = body.slice(body.indexOf('قال رحمه الله:') + 14); body = body.slice(0, body.indexOf('الحمد لله، نحمده'));
  const L = body.split('\n').map(x => x.trim()).filter(Boolean); const vs = [];
  for (let i = 0; i < L.length; i++) {
    if (/\.\.\./.test(L[i])) { const [a, b] = L[i].split('...'); vs.push(clean(a) + ' | ' + clean(b)); continue; }
    vs.push(clean(L[i]) + ' | ' + clean(L[++i]));
  }
  save('H-hajuri.verses.txt', vs);
}
{ // U
  const P = pages('ko-57150-tahmis.json').slice(4).join('\n'); const vs = [];
  for (const l of P.split('\n')) { if (/^\s*\(\d+\)/.test(l)) continue; const m = l.match(/^(.+?)\s*\.\.\.\s*(.+)$/); if (m) vs.push(clean(m[1]) + ' | ' + clean(m[2])); }
  save('U-tahmis.verses.txt', vs);
}
{ // F
  const P = pages('ko-91514-turayfi.json').join('\n'); const vs = [];
  for (const m of P.matchAll(/قال المصنف رحمه الله:\s*\[([^\]]+)\]/g)) vs.push(clean(m[1]).replace(/\n/g, ' '));
  save('F-turayfi.words.txt', vs);
}
