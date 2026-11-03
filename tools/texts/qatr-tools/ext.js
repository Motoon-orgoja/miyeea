const fs=require('fs');const dir=process.argv[2];const from=+process.argv[3],to=+process.argv[4];
for(let p=from;p<=to;p++){const d=fs.readFileSync(dir+'/'+p+'.html','utf8');
const t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
const ps=t.split(/<p[ >]/).map(b=>b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<span class="c5">([\s\S]*?)<\/span>/g,'@@$1@@').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
console.log('=== page '+p);ps.forEach(x=>console.log(x));}
