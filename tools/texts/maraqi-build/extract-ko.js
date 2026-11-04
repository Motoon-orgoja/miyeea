// ketabonline 25829 JSON -> numbered lines «n<TAB>text» and headings «## …»
const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const out=[];
for(const p of j){const c=p.content.replace(/<a [\s\S]*?<\/a>/g,'');
 const re=/<div class="g-title[^>]*>([\s\S]*?)<\/div>|<p [^>]*>([\s\S]*?)<\/p>/g;let m;
 while((m=re.exec(c))){const s=(m[1]||m[2]).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();if(!s)continue;
  if(m[1]!==undefined)out.push('## '+s);else{const v=s.match(/^(\d+)\s*-\s*([\s\S]*)$/);out.push(v?v[1]+'\t'+v[2]:'?? '+s)}}}
fs.writeFileSync(process.argv[3],out.join('\n')+'\n');console.log(out.length);
