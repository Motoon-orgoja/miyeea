// Word streams for لمعة الاعتقاد: raw/lumaa/<X>.stream.json
// S = shamela 30855 (وزارة الشؤون الإسلامية، ط2 1420هـ), K = ketabonline 38445 (الدار السلفية), W = ar.wikisource,
// V = ketabonline 7131 «تيسير الاعتقاد شرح لمعة الاعتقاد» للهيميد (whole text, used only as a vocalized corpus)
const fs = require('fs'), path = require('path');
const { RAW, words } = require('./lib');
const D = path.join(RAW, 'lumaa');
const out = (k, s) => { fs.writeFileSync(path.join(D, k + '.stream.json'), JSON.stringify(s)); console.log(k, s.filter(x => x.w).length, 'words'); };
// spacing slips of the witnesses: «و سلم», «و إن», «مالم»
const fixSp = t => t.replace(/(^|\s)و (?=[ء-ي])/g, '$1و').replace(/(^|\s)مالم(?=\s)/g, '$1ما لم');
function pushText(S, t) {
  t = fixSp(t);
  let q = 0;
  for (const part of t.split(/([{}﴿﴾])/)) {
    if (part === '{' || part === '﴿') { q = 1; continue; } if (part === '}' || part === '﴾') { q = 0; continue; }
    for (const w of words(part)) S.push(q ? { w, q: 1 } : { w });
  }
}
const endPara = S => { for (let i = S.length - 1; i >= 0; i--) if (S[i].w) { S[i].br = 1; return; } };
// ---------- S ----------
{
  const L = fs.readFileSync(path.join(D, 'shamela30855.txt'), 'utf8').split('\n');
  const S = []; let foot = false, lastHead = '';
  for (let l of L) {
    if (/^=== page/.test(l)) { foot = false; continue; }
    if (!l.trim() || /^لمعة الاعتقاد$/.test(l.trim())) continue;
    if (/^\([٠-٩]+\)/.test(l)) foot = true;
    if (foot) continue;
    const h = l.match(/^\[(.*)\]$/);
    if (h) { lastHead = h[1].trim(); S.push({ head: { title: lastHead } }); continue; }
    // the printed edition repeats the heading (or a short form of it) run-in at the start of the paragraph
    if (lastHead && l.startsWith(lastHead + ' ')) { l = l.slice(lastHead.length + 1); lastHead = ''; }
    else if (/^كلام الله ومن صفات الله/.test(l)) l = l.replace(/^كلام الله /, '');
    lastHead = '';
    l = l.replace(/\s*\([٠-٩]+\)/g, '').replace(/\[[^\]]*:\s*[٠-٩ -]+\]/g, ' ').replace(/«|»/g, '').replace(/\s+([.،؛:])/g, '$1');
    pushText(S, l); endPara(S);
  }
  out('S', S);
}
// ---------- K ----------
{
  const L = fs.readFileSync(path.join(D, 'ko38445.txt'), 'utf8').split('\n');
  const S = [];
  for (let l of L) {
    if (/^=== page/.test(l) || !l.trim()) continue;
    l = l.replace(/^مقدمة المؤلف \( ابن قدامة \)/, '');
    pushText(S, l); endPara(S);
  }
  out('K', S);
}
// ---------- W ----------
{
  let t = fs.readFileSync(path.join(D, 'wikisource.wiki'), 'utf8');
  t = t.replace(/^\[\[تصنيف:.*$/mg, '').replace(/^\{\{رأسية[\s\S]*?\}\}/, '').replace(/\{\{ص\}\}/g, 'صلى الله عليه وسلم').replace(/\{\{[^}]*\}\}/g, ' ')
    .replace(/^=+.*=+\s*$/mg, '').replace(/__\w+__/g, '').replace(/<[^>]+>/g, ' ').replace(/'''?/g, '');
  const S = [];
  for (const l of t.split('\n')) { if (!l.trim()) continue; pushText(S, l.replace(/[(][^)]*:\s*[0-9٠-٩ -]+[)]/g, ' ')); endPara(S); }
  out('W', S);
}
// ---------- V ----------
{
  const a = JSON.parse(fs.readFileSync(path.join(D, 'ko7131.json'), 'utf8'));
  const S = [];
  for (const x of a) pushText(S, (x.content || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[()"]/g, ' '));
  out('V', S);
}
// ---------- U = matn paragraphs [١]–[٩٥] in Ibn Uthaymin's «تعليق مختصر على لمعة الاعتقاد» (shamela 11366, أضواء السلف) ----------
{
  const dir = path.join(D, 'shamela11366');
  const paras = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const body = (d.nass || '').split(/<hr\s*\/?>\s*<p class="hamesh"/)[0];
    for (const p of body.split('</p>')) paras.push(p.replace(/<a [^>]*class="btn_tag[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
  }
  const S = []; let on = false, n = 0;
  const NUM = /^\[([٠-٩]+)\]\s*/;
  for (const p of paras) {
    if (!p) continue;
    if (NUM.test(p)) { on = true; n++; S.push({ head: { n: p.match(NUM)[1] } }); pushText(S, p.replace(NUM, '').replace(/\[[^\]]*:\s*[٠-٩ -]+\]/g, ' ').replace(/[«»"]/g, '').replace(/\s*[٠-٩]+(?=[.،\s]|$)/g, ' ')); endPara(S); continue; }
    if (!on) continue;
    if (/^\.+ ?الشرح ?\.+$/.test(p) || /^\[[^\]]+\]$/.test(p) || /^[٠-٩]+ |^\*|^=|^قلت|^تعقيب|^قال الشيخ|^[أ-ي]- /.test(p) || /:$/.test(p) && p.length < 60) { on = false; continue; }
    pushText(S, p.replace(/\[[^\]]*:\s*[٠-٩ -]+\]/g, ' ').replace(/[«»"]/g, '').replace(/\s*[٠-٩]+(?=[.،\s]|$)/g, ' ')); endPara(S);
  }
  out('U', S); console.log('U numbered paragraphs', n);
}
// ---------- more commentaries, used only as vocalized corpora: ketabonline 42236 (تيسير لمعة الاعتقاد، المحمود),
// 2444 (إرشاد العباد، البراك، دار التدمرية), 4723 (تعليقات الراجحي) ----------
for (const [k, b] of [['P', 42236], ['B', 2444], ['J', 4723]]) {
  const a = JSON.parse(fs.readFileSync(path.join(D, 'ko' + b + '.json'), 'utf8'));
  const S = [];
  for (const x of a) pushText(S, (x.content || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[()"«»]/g, ' '));
  out(k, S);
}
