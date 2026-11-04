// takw.in reader page -> verses file («a | b», ## headings)
const fs=require('fs');const t=fs.readFileSync(process.argv[2],'utf8');
const body=t.slice(t.indexOf('class="basmalah"'));
const out=[];const re=/<center>([\s\S]*?)<\/center>|<div class="bayt-sadr">([\s\S]*?)<\/div>[\s\S]*?<div class="bayt-ajiz">([\s\S]*?)<\/div>/g;let m;
const cl=s=>s.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
while((m=re.exec(body))){if(m[1]!==undefined)out.push('## '+cl(m[1]));else out.push(cl(m[2])+' | '+cl(m[3]));}
fs.writeFileSync(process.argv[3],out.join('\n')+'\n');console.log('verses',out.filter(l=>!l.startsWith('##')).length,'heads',out.filter(l=>l.startsWith('##')).length);
