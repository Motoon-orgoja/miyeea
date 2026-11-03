// print verse-like lines «a ... b» from dumped shamela pages, with page number
const fs=require('fs');const dir=process.argv[2];
for(const f of fs.readdirSync(dir).sort()){const s=fs.readFileSync(dir+'/'+f,'utf8');
 const txt=s.replace(/<p[ >]/g,'\n<p ').replace(/<br\s*\/?>/g,'\n').replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
 for(const l of txt.split('\n')){const t=l.trim();if(/\S\s*(\.\.\.|…)\s*\S/.test(t)&&t.length<160&&/[ًٌٍَُِّْ]/.test(t)&&!/^\[|قوله/.test(t))console.log(f.match(/p(\d+)/)[1]+'\t'+t)}}
