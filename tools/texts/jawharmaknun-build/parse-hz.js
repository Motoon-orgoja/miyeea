// الحازمي، شرح الجوهر المكنون (ketabonline 90602): the verse headers «a ... b» at the start of each passage
const t=require('fs').readFileSync(__dirname+'/ko90602.txt','utf8');
const pairs=[];for(const l of t.split('\n')){const m=l.trim().match(/^([^.]{8,80}?)\s*\.\.\.\s*([^.]{8,80})$/);if(m)pairs.push([m[1].trim(),m[2].trim()])}
const {out,unmatched}=require('./align')(pairs);
module.exports=out.map(v=>v||{a:'',b:''});
if(require.main===module){console.log('pairs',pairs.length,'matched',out.filter(Boolean).length);console.log('missing',out.map((v,i)=>v?null:i+1).filter(Boolean).join(','))}
