// prints the markdown tables of tawhid-sources.md from variants.json, variants-rejected.json, manual.json, tokens.json, supplement.json
const fs = require('fs'), path = require('path');
const rd = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const V = rd('variants.json'), X = rd('variants-rejected.json'), M = rd('manual.json'), T = rd('tokens.json');
const L = rd('../raw/tawhid/build-log.json');
const esc = s => String(s || '').replace(/\|/g, '/').replace(/ ¶ /g, ' ');
let o = '';
o += '### أ. ما رُدّ إلى لفظ الشاهدين (١١٣١٨ وويكي مصدر متفقين خلافًا لنغوي) — ' + V.length + ' موضعًا\n\n| الباب | عند نغوي (السياق) | المختار | الشاهدان | ملاحظة |\n|---|---|---|---|---|\n';
for (const v of V) o += `| ${v.bab}${v.title ? ' (الترجمة)' : ''} | ${esc(v.find)} | ${esc(v.replace)} | ${esc(v.wit) || 'بدون'} | ${esc(v.why)} |\n`;
o += '\n### ب. خلاف بين الشاهدين ونغوي تُرك على نغوي (رسم أو اختصار فقط) — ' + X.length + '\n\n| الباب | عند نغوي | الشاهدان |\n|---|---|---|\n';
for (const x of X) o += `| ${x.bab} | ${esc(x.old)} | ${esc(x.wit)} |\n`;
o += '\n### ج. تصحيح الشكل والطباعة في الأساس (manual.json) — ' + M.length + '\n\n| الباب | في الأساس | الصواب | السبب |\n|---|---|---|---|\n';
for (const m of M) o += `| ${m.bab}${m.title ? ' (الترجمة)' : ''} | ${esc(m.find)} | ${esc(m.replace)} | ${esc(m.why)}${m.count ? ' (×' + m.count + ')' : ''} |\n`;
o += '\n### د. كلمات ناقصة الشكل أو خاطئته في الأساس، صُحّحت حيث وقعت (tokens.json) — ' + T.length + ' صيغة\n\n';
o += Object.entries(L.tokens).map(([k, n]) => `«${k.replace(' → ', '» ← «')}» ×${n}`).join('، ') + '\n';
fs.writeFileSync(path.join(__dirname, '../raw/tawhid/report-tables.md'), o);
console.log(o.length);
