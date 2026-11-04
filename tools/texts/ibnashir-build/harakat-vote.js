// Vocalization vote: for each base word aligned (LCS on letters) to a word in M and in C, flags letters where M and C
// carry the same mark and the base carries a different one; also lists base words with letters lacking any mark.
// usage: node harakat-vote.js base.txt M.txt C.txt
const fs=require('fs');
const norm=w=>w.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱء]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ا').replace(/[^ء-ي]/g,'');
const W=f=>{const o=[];fs.readFileSync(f,'utf8').split('\n').forEach((l,li)=>{if(/^(@|##|#|>|\?)/.test(l))return;l.replace(/\|/g,' ').split(/\s+/).forEach(w=>{const n=norm(w);if(n)o.push({raw:w,n,li})})});return o;};
const A=W(process.argv[2]),M=W(process.argv[3]),C=W(process.argv[4]);
function align(B){const n=A.length,m=B.length;const L=Array.from({length:n+1},()=>new Uint16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i].n===B[j].n?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const map=new Array(n).fill(-1);let i=0,j=0;while(i<n&&j<m){if(A[i].n===B[j].n){map[i]=j;i++;j++;}else if(L[i+1][j]>=L[i][j+1])i++;else j++;}return map;}
const marks=w=>{const r=[];for(const ch of w.normalize('NFC')){if(/[ء-ي]/.test(ch))r.push('');else if(/[ً-ّ]/.test(ch)&&r.length)r[r.length-1]+=ch;}return r.map(s=>[...s].sort().join(''));};
const mm=align(M),mc=align(C);const lines=fs.readFileSync(process.argv[2],'utf8').split('\n');const vno={};let v=0;lines.forEach((l,i)=>{if(l.includes(' | '))v++;vno[i]=v;});
for(let i=0;i<A.length;i++){if(mm[i]<0||mc[i]<0)continue;const a=marks(A[i].raw),b=marks(M[mm[i]].raw),c=marks(C[mc[i]].raw);
 if(a.length!==b.length||a.length!==c.length)continue;
 for(let k=0;k<a.length;k++)if(b[k]&&b[k]===c[k]&&a[k]!==b[k]&&!(a[k]===''&&b[k]==='')){console.log(vno[A[i].li]+'\t'+A[i].raw+'\tM '+M[mm[i]].raw+'\tC '+C[mc[i]].raw);break;}}
