// extract matn (ص ... ش) segments from Shamela 6970 cache
const fs=require('fs');const dir=process.argv[2];const out=[];
const files=fs.readdirSync(dir).map(f=>parseInt(f)).filter(n=>n).sort((a,b)=>a-b);
let all='';
for(const p of files){const j=JSON.parse(fs.readFileSync(dir+'/'+p+'.json','utf8'));
 let t=j.nass.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<\/p>/g,' ¶ ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');all+=' '+t;}
all=all.replace(/\s+/g,' ');
const re=/(?:^|\s)ص\s+([\s\S]*?)(?=\s+ش\s|$)/g;let m;
while(m=re.exec(all)){out.push(m[1].replace(/¶/g,' ').replace(/\s+/g,' ').trim());}
fs.writeFileSync(process.argv[3],JSON.stringify(out));console.log(out.length);
