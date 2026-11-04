// extracts the matn section of each bab from Shamela 13277 (التوضيح الرشيد, نغوي): pages from the bab heading to «الشرح»
const T=require('./text.js'),fs=require('fs'),path=require('path');
const secs=fs.readFileSync(path.join(__dirname,'../raw/tawhid/sections13277.txt'),'utf8').trim().split('\n').map(l=>{const m=l.match(/^(\d+) (.*)$/);return{p:+m[1],s:m[2]}});
const babs=[];
for(let i=0;i<secs.length;i++){if(/^باب /.test(secs[i].s)){const end=secs.slice(i+1).find(x=>x.s==='الشرح');babs.push({title:secs[i].s,from:secs[i].p,to:end.p-1,sharh:end.p})}}
const out=babs.map((b,k)=>{const paras=[];for(let p=b.from;p<=b.to;p++){const r=T(13277,p);paras.push(...r.paras.map(x=>({p,x})))}
const sh=T(13277,b.sharh).paras;return{n:k+1,...b,paras,sharhHead:sh.slice(0,2)}});
fs.writeFileSync(path.join(__dirname,'../raw/tawhid/matn13277.json'),JSON.stringify(out,null,1));
console.log(out.length);
