const fs=require('fs'),{norm}=require('./norm.js');const {V,S}=JSON.parse(fs.readFileSync('lam-base.json','utf8'));
const clean=s=>s.replace(/<div/g,'').normalize('NFC').replace(/[«»"،:؛.!?]/g,' ').replace(/\[|\]|\(|\)/g,' ').replace(/\s+/g,' ').trim();
const cl=V.map(([a,b])=>{a=clean(a);b=clean(b);
 // tatweel: keep only when word split across hemistichs (a ends with ـ)
 const split=/ـ$/.test(a);a=a.replace(/ـ(?!$)/g,'').replace(/ـ\s+/g,'').trim();if(split&&!/ـ$/.test(a))a+='ـ';b=b.replace(/^ـ/,'').replace(/ـ\s*/g,'');return [a.replace(/\s+/g,' '),b.replace(/\s+/g,' ').trim()]});
fs.writeFileSync('lam-clean.json',JSON.stringify(cl,null,1));
// base tokens with verse ids
const bt=[];cl.forEach(([a,b],i)=>{for(const w of norm((a.replace(/ـ$/,'')+(/ـ$/.test(a)?'':' ')+b)).split(' '))if(w)bt.push({w,v:i+1})});
let o=fs.readFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/lamiyya/openiti-37033.txt','utf8');o=o.slice(o.indexOf('#META#Header#End#'));
o=o.split('\n').filter(l=>!/^###/.test(l)).join('\n').replace(/PageV\d+P\d+/g,' ').replace(/ms\d+/g,' ').replace(/~~/g,' ').replace(/#/g,' ').replace(/\(\d+\)/g,' ');
// drop prose header lines
const ot=norm(o).split(' ').filter(Boolean);
console.log('base tokens',bt.length,'openiti tokens',ot.length);
const A=bt.map(x=>x.w),B=ot,m=A.length,n=B.length;const L=Array.from({length:m+1},()=>new Uint16Array(n+1));
for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
let i=0,j=0,da=[],db=[],v=0;const out=[];const flush=()=>{if(da.length||db.length)out.push((v)+': '+da.join(' ')+' ≠ '+db.join(' '));da=[];db=[]};
while(i<m&&j<n){if(A[i]===B[j]){flush();i++;j++}else if(L[i+1][j]>=L[i][j+1]){v=bt[i].v;da.push(A[i++])}else{v=bt[Math.min(i,m-1)].v;db.push(B[j++])}}
while(i<m){v=bt[i].v;da.push(A[i++])}while(j<n)db.push(B[j++]);flush();console.log(out.join('\n'));
