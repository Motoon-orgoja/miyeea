// takw.in reader -> [{sec, a, b}]  (centered lines after the title block = headings)
const fs=require('fs');
const s=fs.readFileSync(__dirname+'/../raw/jawharmaknun/takwin-reader.html','utf8');
const body=s.slice(s.indexOf('class="basmalah"'));
const re=/<center>([\s\S]*?)<\/center>|<div class="bayt-sadr">([\s\S]*?)<\/div>[\s\S]*?<div class="bayt-ajiz">([\s\S]*?)<\/div>/g;
const out=[];let sec=null,m;
const clean=x=>x.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
while(m=re.exec(body)){if(m[1]!==undefined){sec=clean(m[1]);continue}out.push({sec,a:clean(m[2]),b:clean(m[3])});sec=null}
module.exports=out;
if(require.main===module){console.log(out.length);out.forEach((v,i)=>{if(v.sec)console.log('##',i+1,v.sec)})}
