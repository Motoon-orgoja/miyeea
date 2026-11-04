// prints nass text of a downloaded page: node text.js <id> <page>
const fs=require('fs'),path=require('path');
function pageText(id,p){const d=fs.readFileSync(path.join(__dirname,'../raw/tawhid/shamela'+id,p+'.html'),'utf8');
const title=(d.match(/<title>([^<]*)/)||[])[1]||'';
let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0].split(/<hr[ >/]|<p class="hamesh"/)[0];
const paras=t.split(/<p[ >]/).map(b=>b.replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#160;/g,' ').replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
return {title,paras};}
module.exports=pageText;
if(require.main===module){for(const p of process.argv.slice(3)){const r=pageText(process.argv[2],p);console.log('#### '+p+' '+r.title);console.log(r.paras.join('\n¶ '));}}
