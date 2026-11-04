// Word-level two-witness correction. For each base verse, takes the most similar verse line in N (نثر الورود) and B (نشر البنود),
// aligns words (LCS after normalization), and for every interior hunk where N and B read the same non-empty words against
// the base, writes N's (vocalized) words into the base. Everything else that differs is listed for manual review.
// usage: node agree.js base.txt nathr.w.txt bunud.w.txt out.txt log.txt review.txt
const fs=require('fs');const [bf,nf,Bf,of,lf,rf]=process.argv.slice(2);
const norm=w=>w.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱء]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ا').replace(/[^ء-ي]/g,'');
const tok=l=>l.split(/\s+/).filter(w=>w==='|'||norm(w)).map(w=>({raw:w,n:w==='|'?'|':norm(w)}));
const rdW=f=>fs.readFileSync(f,'utf8').split('\n').filter(l=>l.includes('|')).map(l=>{const t=tok(l.replace(/[()]/g,''));return{l,t,w:t.filter(x=>x.n!=='|').map(x=>x.n)}});
const N=rdW(nf),B=rdW(Bf);
const idx=W=>{const m={};W.forEach((x,i)=>new Set(x.w).forEach(w=>(m[w]=m[w]||[]).push(i)));return m;};const IN=idx(N),IB=idx(B);
const best=(w,W,I)=>{const c={};new Set(w).forEach(x=>(I[x]||[]).forEach(i=>c[i]=(c[i]||0)+1));let bi=-1,bs=0;for(const i in c){const s=c[i]/Math.max(w.length,W[i].w.length);if(s>bs){bs=s;bi=+i;}}return bs>=0.5?W[bi]:null;};
const lcs=(A,Bq)=>{const n=A.length,m=Bq.length,L=Array.from({length:n+1},()=>new Uint16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i]===Bq[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const map=new Array(n).fill(-1);let i=0,j=0;while(i<n&&j<m){if(A[i]===Bq[j]){map[i]=j;i++;j++;}else if(L[i+1][j]>=L[i][j+1])i++;else j++;}return map;};
// hunks of base positions [a0,a1) with witness range [b0,b1)
const hunks=(A,W)=>{const map=lcs(A,W);const h=[];let pj=-1,i=0;while(i<=A.length){if(i<A.length&&map[i]>=0){pj=map[i];i++;continue;}
 let a0=i;while(i<A.length&&map[i]<0)i++;const nj=i<A.length?map[i]:W.length;if(a0<i||pj+1<nj)h.push({a0,a1:i,b0:pj+1,b1:nj,interior:a0>0||pj+1>0?(i<A.length||nj<W.length)&&(a0>0&&pj>=0):false});if(i>=A.length)break;}return h;};
const log=[],rev=[];let vn=0,fixed=0;
const out=fs.readFileSync(bf,'utf8').split('\n').map(l=>{if(!l.includes(' | '))return l;vn++;
 const bt=tok(l);const A=bt.filter(x=>x.n!=='|');const aw=A.map(x=>x.n);
 const n=best(aw,N,IN),b=best(aw,B,IB);if(!n||!b){if(n||b){const w=n||b;if(w.w.join(' ')!==aw.join(' '))rev.push(vn+'\t[one witness]\n  base '+l+'\n  '+(n?'N':'B')+'    '+w.l);}else rev.push(vn+'\t[no witness]\t'+l);return l;}
 const nw=n.t.filter(x=>x.n!=='|'),bw=b.t.filter(x=>x.n!=='|');
 const hn=hunks(aw,nw.map(x=>x.n)),hb=hunks(aw,bw.map(x=>x.n));
 const repl={};const notes=[];
 for(const h of hb){const bs=bw.slice(h.b0,h.b1).map(x=>x.n).join(' ');
  const g=hn.find(x=>x.a0===h.a0&&x.a1===h.a1);const ns=g?nw.slice(g.b0,g.b1).map(x=>x.n).join(' '):null;
  const inside=h.a0>0&&h.a1<aw.length||h.a0<h.a1&&(h.a0>0||h.a1<aw.length);
  if(g&&ns===bs&&bs&&h.b0>0&&h.b1<bw.length+1&&g.b0>0||g&&ns===bs&&bs&&h.a0<h.a1&&(h.a0>0||h.b0===0&&g.b0===0)){repl[h.a0]={a1:h.a1,w:nw.slice(g.b0,g.b1).map(x=>x.raw)};}
  else notes.push('B['+bw.slice(h.b0,h.b1).map(x=>x.raw).join(' ')+'] N['+(g?nw.slice(g.b0,g.b1).map(x=>x.raw).join(' '):'?')+'] base['+A.slice(h.a0,h.a1).map(x=>x.raw).join(' ')+']');}
 for(const h of hn){if(!hb.find(x=>x.a0===h.a0&&x.a1===h.a1))notes.push('N['+nw.slice(h.b0,h.b1).map(x=>x.raw).join(' ')+'] (B=base) base['+A.slice(h.a0,h.a1).map(x=>x.raw).join(' ')+']');}
 // rebuild: walk base tokens incl. '|'
 let k=0;const res=[];for(let t=0;t<bt.length;t++){const x=bt[t];if(x.n==='|'){res.push('|');continue;}
  if(repl[k]){const r=repl[k];if(r.a1===k){res.push(...r.w);res.push(x.raw);}else{res.push(...r.w);const skip=r.a1-k-1;let s=0;while(s<skip){t++;if(bt[t].n!=='|')s++;else res.push('|');}k=r.a1;continue;}}
  else res.push(x.raw);k++;}
 if(repl[aw.length])res.push(...repl[aw.length].w);
 const nl=res.join(' ');if(nl!==l){fixed++;log.push(vn+'\t'+l+'\n\t-> '+nl);}
 const real=notes.filter(s=>!/^B\[\] N\[\?\]|^N\[\] \(B=base\)/.test(s));
 if(real.length)rev.push(vn+'\n  base '+nl+'\n  N    '+n.l+'\n  B    '+b.l+'\n  '+real.join('\n  '));
 return nl;});
fs.writeFileSync(of,out.join('\n'));fs.writeFileSync(lf,log.join('\n')+'\n');fs.writeFileSync(rf,rev.join('\n')+'\n');console.log('fixed verses',fixed,'review',rev.length);
