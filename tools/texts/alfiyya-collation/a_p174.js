const fs=require('fs');const dir=process.argv[2];const out=[];
const ent=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
for(const f of fs.readdirSync(dir).sort()){const d=fs.readFileSync(dir+'/'+f,'utf8');
 let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0].split('تحميل الصفحة التالية')[0];
 const body=t.split(/<p class="hamesh">/)[0];
 const ps=body.split(/<p[ >]/).map(b=>ent(b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'')).replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
 for(const l of ps){if(/\.\.\./.test(l)&&l.length<260)out.push({t:l.replace(/^[٠-٩0-9]+\s*-\s*/,'').replace(/\([٠-٩]+\)/g,'').replace(/\s*\.\.\.\s*/g,' ... '),page:f.slice(0,-5)});}}
fs.writeFileSync(process.argv[3],JSON.stringify(out));console.log(out.length);
