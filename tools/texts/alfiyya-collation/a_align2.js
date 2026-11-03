// align Qasim verses with candidate verse lines of another source; print word diffs
const norm=require('./a_norm.js');const {V}=require('./a_qv.js');const fs=require('fs');
const cand=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); // [{t,page}]
const W=s=>norm(s).split(' ').filter(Boolean);
const qa=V.map(v=>W(v.a+' '+v.b)), ca=cand.map(c=>W(c.t));
function lcs(x,y){const m=x.length,n=y.length;const d=Array.from({length:m+1},()=>new Int16Array(n+1));for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)d[i][j]=x[i]===y[j]?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);return d}
const sim=(x,y)=>{const d=lcs(x,y);return 2*d[0][0]/(x.length+y.length)};
// greedy monotone alignment with lookahead window
let j=0;const res=[];
for(let i=0;i<V.length;i++){let best=-1,bs=0;for(let k=j;k<Math.min(ca.length,j+60);k++){const s=sim(qa[i],ca[k]);if(s>bs+1e-9){bs=s;best=k}if(s===1)break}
 if(bs>=0.5){res.push({i,k:best,s:bs});j=best+1}else res.push({i,k:-1,s:bs})}
for(const r of res)if(r.k<0){let bs=0,best=-1;for(let k=0;k<ca.length;k++){const x=sim(qa[r.i],ca[k]);if(x>bs){bs=x;best=k}}if(bs>=0.6){r.k=best;r.s=bs}}
const miss=res.filter(r=>r.k<0).map(r=>V[r.i].n);
console.error('matched',res.length-miss.length,'missing',miss.length,miss.join(','));
// diffs
const out=[];
for(const r of res){if(r.k<0||r.s===1)continue;const x=qa[r.i],y=ca[r.k];const d=lcs(x,y);let a=0,b=0;const segs=[];let cx=[],cy=[];
 const flush=()=>{if(cx.length||cy.length)segs.push([cx.join(' '),cy.join(' ')]);cx=[];cy=[]};
 while(a<x.length||b<y.length){if(a<x.length&&b<y.length&&x[a]===y[b]){flush();a++;b++}else if(b>=y.length||(a<x.length&&d[a+1][b]>=d[a][b+1]))cx.push(x[a++]);else cy.push(y[b++])}flush();
 out.push({n:V[r.i].n,page:cand[r.k].page,segs,q:V[r.i].a+' | '+V[r.i].b,o:cand[r.k].t});}
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));fs.writeFileSync(process.argv[3]+".map.json",JSON.stringify(res.map(r=>({n:V[r.i].n,k:r.k,t:r.k>=0?cand[r.k].t:null,page:r.k>=0?cand[r.k].page:null}))));console.error('diff verses',out.length);
