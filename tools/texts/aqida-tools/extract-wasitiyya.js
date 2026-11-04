// Turns the raw Wasitiyya sources into word streams: raw/wasitiyya/<X>.stream.json
//   [{w:'word', q:1 if inside a Qur'an quote, br:1 if a source paragraph ends after it}, {head:{group,title}}]
// A = shamela 22665 (Ashraf), R = ketabonline 102254 (Rahab), M = shamela 18098 (Ibn Mani'), W = ar.wikisource
const fs = require('fs'), path = require('path');
const { RAW, words } = require('./lib');
const D = path.join(RAW, 'wasitiyya');
const out = (k, s) => { fs.writeFileSync(path.join(D, k + '.stream.json'), JSON.stringify(s)); console.log(k, s.filter(x => x.w).length, 'words'); };
// push text with {…} or ﴿…﴾ Qur'an spans
function pushText(S, t, open = '{', close = '}') {
  let q = 0;
  for (const part of t.split(new RegExp('([' + open + close + '])'))) {
    if (part === open) { q = 1; continue; } if (part === close) { q = 0; continue; }
    for (const w of words(part)) S.push(q ? { w, q: 1 } : { w });
  }
}
const endPara = S => { for (let i = S.length - 1; i >= 0; i--) if (S[i].w) { S[i].br = 1; return; } };

// ---------- A ----------
{
  const L = fs.readFileSync(path.join(D, 'shamela22665.txt'), 'utf8').split('\n');
  const S = []; let inPage1 = false, br = '', group = null, pend = null;
  for (let l of L) {
    if (/^=== page 0001/.test(l)) { inPage1 = true; continue; }
    if (/^=== page/.test(l)) { inPage1 = false; continue; }
    if (inPage1 || !l.trim()) continue;
    if (/^\*[\s*]*$/.test(l)) continue;
    if (/^تمت، والحمد لله في عشي/.test(l)) continue; // copyist colophon
    if (br || /^\[/.test(l)) { // editorial heading, possibly multi-line
      br += (br ? ' ' : '') + l;
      if (!/\]/.test(l)) continue;
      const h = br.replace(/^\[|\]\s*:?\s*$/g, '').trim(); br = '';
      let m;
      if ((m = h.match(/^الباب ([^:]+):\s*(.*?)\s*ويشتمل/))) group = 'الباب ' + m[1] + ': ' + m[2];
      else if ((m = h.match(/^الفصل ([^:]+):\s*(.*)$/))) S.push({ head: { group, title: 'الفصل ' + m[1] + ': ' + m[2] } });
      else if (h === 'مقدمة المصنف') S.push({ head: { group: null, title: 'مقدمة المصنف' } });
      else if (h === 'خاتمة') S.push({ head: { group: null, title: 'الخاتمة' } });
      continue;
    }
    l = l.replace(/^[٠-٩]+-\s*:?\s*/, '').replace(/^[-•]\s*/, '')
      .replace(/\[[^\]]*:\s*[٠-٩ -]+\]/g, ' ') // [سورة: آية]
      .replace(/\s+([.،؛:])/g, '$1');
    pushText(S, l);
    if (/[.؛:]\s*$/.test(l)) endPara(S);
  }
  out('A', S);
}
// ---------- R ----------
{
  const L = fs.readFileSync(path.join(D, 'ko102254.txt'), 'utf8').split('\n');
  const S = []; let page = 0;
  for (let l of L) {
    const m = l.match(/^=== page (\d+)/); if (m) { page = +m[1]; continue; }
    if (page < 2 || !l.trim()) continue;
    l = l.replace(/\[سُورَةُ[^\]]*\]/g, ' ').replace(/\[[^\]]*:\s*[0-9٠-٩ -]+\]/g, ' ');
    pushText(S, l); endPara(S);
  }
  out('R', S);
}
// ---------- H (matn at the head of Harras's sharh, text established by Alawi al-Saqqaf: shamela 22934 pages 23-56) ----------
{
  const L = fs.readFileSync(path.join(D, 'harras-matn-only.txt'), 'utf8').split('\n');
  const S = [];
  for (let l of L) {
    if (/^=== page/.test(l) || !l.trim() || /^متن العقيدة الواسطية/.test(l)) continue;
    if (/^\(([٠-٩]+|\*)\)/.test(l)) continue; // footnote / Shamela preparer's note
    l = l.replace(/\s*\([٠-٩]+\)/g, '').replace(/[\[\]]/g, '').replace(/\(\(|\)\)/g, '').replace(/\s+([.،؛:])/g, '$1').replace(/\.\.+$/, '.');
    pushText(S, l); endPara(S);
  }
  out('H', S);
}
// ---------- M ----------
{
  const L = fs.readFileSync(path.join(D, 'shamela18098.txt'), 'utf8').split('\n');
  const S = []; let page = 0, foot = false;
  for (let l of L) {
    const m = l.match(/^=== page (\d+)/); if (m) { page = +m[1]; foot = false; continue; }
    if (page < 2 || !l.trim()) continue;
    if (/^\([٠-٩]+\)/.test(l) || /^=/.test(l)) foot = true;
    if (foot) continue;
    if (/^\[خاتمة الطبع/.test(l)) break;
    if (/^\[[^\]]*\]$/.test(l.trim()) || /^بسم الله الرحمن الرحيم/.test(l)) continue;
    l = l.replace(/\([٠-٩]+\)/g, ' ').replace(/=\s*$/, '');
    pushText(S, l, '{(', '})'); // M puts some verses in ( )
    endPara(S);
  }
  out('M', S);
}
// ---------- W ----------
{
  let t = fs.readFileSync(path.join(D, 'wikisource.wiki'), 'utf8');
  t = t.replace(/^\[\[تصنيف:.*$/mg, '').replace(/^\{\{رأسية[\s\S]*?\n\}\}/, '').replace(/\{\{ص\}\}/g, 'صلى الله عليه وسلم').replace(/\{\{[^}]*\}\}/g, ' ')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1').replace(/\[\[([^\]]*)\]\]/g, '$1').replace(/<[^>]+>/g, ' ').replace(/'''?/g, '').replace(/^=+.*=+$/mg, '');
  const S = [];
  for (const l of t.split('\n')) { if (!l.trim()) continue; pushText(S, l.replace(/[(][^)]*:\s*[0-9٠-٩ -]+[)]/g, ' ')); endPara(S); }
  out('W', S);
}
