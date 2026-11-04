// terjemahkitab.com «Terjemah Jauharul Maknun» (vocalized Arabic lines «a * b» + Indonesian translation)
const s=require('fs').readFileSync(__dirname+'/../raw/jawharmaknun/terjemahkitab.html','utf8');
const t=s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<\/(p|h\d|div|li)>|<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,' ').replace(/&#8221;|&#8220;/g,'').replace(/&#[0-9]+;/g,'').replace(/&nbsp;/g,' ');
const pairs=[];for(const l of t.split('\n')){const m=l.trim().match(/^([\u0600-\u06FF][^*]*?)\s*\*\s*([\u0600-\u06FF][^*]*)$/);if(m)pairs.push([m[1].trim(),m[2].trim()])}
const {out,unmatched}=require('./align')(pairs);
module.exports=out.map(v=>v||{a:'',b:''});
if(require.main===module){console.log('pairs',pairs.length,'matched',out.filter(Boolean).length);console.log('missing',out.map((v,i)=>v?null:i+1).filter(Boolean).join(','));unmatched.forEach(x=>console.log('UNM',x.slice(0,150)))}
