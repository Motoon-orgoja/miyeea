const fs=require('fs'),{norm}=require('./norm.js');const {B,BS}=JSON.parse(fs.readFileSync('sullam-B.json','utf8'));
const app=B.slice(157),body=B.slice(0,157);const appS={};for(const k in BS)if(+k>=158)appS[+k-157]=BS[k];
console.log('appendix',app.length,'body',body.length);console.log(appS);
const P=JSON.parse(fs.readFileSync('sullam-pick.json','utf8'));
const n2=s=>norm(s);const wd=s=>n2(s).split(' ').filter(Boolean);
function diff(a,b){const A=wd(a),B=wd(b),m=A.length,n=B.length,L=Array.from({length:m+1},()=>new Array(n+1).fill(0));
 for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const out=[];let i=0,j=0,da=[],db=[];const flush=()=>{if(da.length||db.length)out.push(da.join(' ')+' ≠ '+db.join(' '));da=[];db=[]};
 while(i<m&&j<n){if(A[i]===B[j]){flush();i++;j++}else if(L[i+1][j]>=L[i][j+1])da.push(A[i++]);else db.push(B[j++])}
 while(i<m)da.push(A[i++]);while(j<n)db.push(B[j++]);flush();return out}
const sim=(x,y)=>{const a=wd(x),b=wd(y);let s=0;const bb=[...b];for(const w of a){const i=bb.indexOf(w);if(i>=0){s++;bb.splice(i,1)}}return s/Math.max(a.length,b.length)};
const res=[];
P.forEach((p,i)=>{const base=p.a?p.a+' '+p.b:p.ws.join(' ');const ap=app[i]?app[i].join(' '):'';
 const bq=body.map(b=>({b,s:sim(b.join(' '),base)})).sort((x,y)=>y.s-x.s)[0];
 const d1=diff(base,ap),d2=bq&&bq.s>=0.6?diff(base,bq.b.join(' ')):['(no lemma)'];
 res.push({n:i+1,app:app[i],lemma:bq&&bq.s>=0.6?bq.b:null});
 if(d1.length||d2.length)console.log(i+1,'| app:',d1.join(' ; '),'| lemma:',d2.join(' ; '))});
fs.writeFileSync('sullam-Bmap.json',JSON.stringify(res,null,1));
