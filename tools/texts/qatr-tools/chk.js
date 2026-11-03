const fs=require('fs');const {norm,lcs}=require('./norm.js');
const pre=s=>s.replace(/\.\.\./g,' ').replace(/([كب]َ?ـ)\s*["«(]?\s*/g,'$1').replace(/ـ/g,'');
const glue=s=>s.replace(/["«»“”{}﴿﴾\[\]*]/g,' ').replace(/(^|\s)(وَ?)\s+/g,'$1$2').replace(/(^|\s)(وَ?)(مَا|ما)\s+(?=(زَالَ|زال|فَتِئَ|فتئ|انْفَكَّ|انفك|بَرِحَ|برح|دَامَ|دام)[\s،,.])/g,(m,a,b,c)=>a+b+c);
const toks=(s,x={})=>glue(pre(s)).split(/\s+/).map(w=>Object.assign({w,n:norm(w)},x)).filter(t=>t.n);
const fin=fs.readFileSync('final.txt','utf8').split('\n').filter(l=>!l.startsWith('##')).join(' ');
const P=toks(fin);const S=toks(fs.readFileSync('sum-clean.txt','utf8'));
const which=process.argv[2]||'S';
let O=S;if(which==='M'){O=[];require('./mh.json').forEach(q=>toks(q).forEach(t=>O.push(t)))}
const m=lcs(P,O);const inv=new Set(m.filter(x=>x>=0));
let run=[],out=[];for(let i=0;i<P.length;i++){if(m[i]<0)run.push(P[i].w);else{if(run.length)out.push('FINAL-only @'+i+': '+run.join(' '));run=[]}}
if(run.length)out.push('FINAL-only: '+run.join(' '));
run=[];for(let j=0;j<O.length;j++){if(!inv.has(j))run.push(O[j].w);else{if(run.length)out.push(which+'-only @'+j+': '+run.join(' '));run=[]}}
console.log('final words',P.length,which,O.length);console.log(out.join('\n'));
