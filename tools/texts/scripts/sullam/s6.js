const fs=require('fs'),{norm}=require('./norm.js');const P=JSON.parse(fs.readFileSync('sullam-pick.json','utf8'));const {F}=JSON.parse(fs.readFileSync('sullam-parsed.json','utf8'));
// light norm extra: drop ه/ة distinction already; also unify final ي/ى; remove 'ال' spacing issues
const n2=s=>norm(s).replace(/ب ال/g,'بال');
const wd=s=>n2(s).split(' ').filter(Boolean);
function diff(a,b){ // LCS word diff
 const A=wd(a),B=wd(b),m=A.length,n=B.length,L=Array.from({length:m+1},()=>new Array(n+1).fill(0));
 for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const out=[];let i=0,j=0,da=[],db=[];const flush=()=>{if(da.length||db.length)out.push(da.join(' ')+' ≠ '+db.join(' '));da=[];db=[]};
 while(i<m&&j<n){if(A[i]===B[j]){flush();i++;j++}else if(L[i+1][j]>=L[i][j+1])da.push(A[i++]);else db.push(B[j++])}
 while(i<m)da.push(A[i++]);while(j<n)db.push(B[j++]);flush();return out}
const Wf=P.map(p=>p.ws.join(' '));
const sim=(x,y)=>{const a=wd(x),b=wd(y);let s=0;const bb=[...b];for(const w of a){const i=bb.indexOf(w);if(i>=0){s++;bb.splice(i,1)}}return s/Math.max(a.length,b.length)};
const fmap={};for(const f of F){let best=-1,bs=0;Wf.forEach((w,k)=>{const s=sim(f.t,w);if(s>bs){bs=s;best=k}});if(bs>=0.6)fmap[best]=f.t}
for(const p of P){const base=p.a?p.a+' '+p.b:null;if(!base){console.log(p.n,'NO BASE');continue}
 const dw=diff(base,Wf[p.n-1]),df=fmap[p.n-1]?diff(base,fmap[p.n-1]):['(absent in F)'];
 if(dw.length||df.length)console.log(p.n,'| W:',dw.join(' ; '),'| F:',df.join(' ; '))}
