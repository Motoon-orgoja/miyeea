// اللب المصون شرح الجوهر المكنون (أبو الوليد المقتدي), ketabonline 19479: verses quoted as «a = b»
const fs=require('fs');const j=require('../raw/jawharmaknun/ko19479.json');
const t=j.pages.filter(p=>p.content).map(p=>p.content.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"')).join('\n');
const pairs=[];for(const l of t.split('\n')){const m=l.replace(/^\s*(قال|قوله)\s*:\s*/,'').match(/^(.*?)\s*=\s*(.*)$/);if(m&&m[1].trim()&&m[2].trim())pairs.push([m[1].trim(),m[2].trim().replace(/\s*\.$/,'')])}
const {out,unmatched}=require('./align')(pairs);
module.exports=out.map(v=>v||{a:'',b:''});
if(require.main===module){console.log('pairs',pairs.length,'matched',out.filter(Boolean).length);console.log('missing',out.map((v,i)=>v?null:i+1).filter(Boolean).join(','));unmatched.forEach(x=>console.log('UNM',x.slice(0,150)))}
