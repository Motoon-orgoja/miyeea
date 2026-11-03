// parse Qasim edition (shamela 356) into verses + headings + footnotes
const fs=require('fs');const dir=process.argv[2];
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
const ent=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const out=[];let started=false;
for(const f of fs.readdirSync(dir).sort()){const pg=parseInt(f);if(pg<97)continue;
 const d=fs.readFileSync(dir+'/'+f,'utf8');
 let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0].split('تحميل الصفحة التالية')[0];
 const [body,ham='']=t.split(/<p class="hamesh">/);
 const ps=body.split(/<p[ >]/).map(b=>ent(b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'')).replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
 const notes=ent(ham.replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'')).split('\n').map(s=>s.trim()).filter(Boolean);
 const rec={page:pg,lines:ps,notes};out.push(rec);
}
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
