// For words that match after normalization, lists those whose harakat differ (ignoring sukun, shadda order, and the
// unmarked lam of the article). usage: node harakat-diff.js a.txt b.txt
const fs=require('fs');
const norm=w=>w.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^ء-ي]/g,'');
const sig=w=>w.normalize('NFC').replace(/[^ء-يً-ّ]/g,'').replace(/^(و|ف|ب|ك|ل)?ال/,'$1ال').replace(/[ْ]/g,'');
const W=f=>fs.readFileSync(f,'utf8').split('\n').filter(l=>!/^(@|##)/.test(l)).join(' ').split(/\s+/).map(w=>({raw:w,n:norm(w)})).filter(x=>x.n);
const A=W(process.argv[2]),B=W(process.argv[3]);const n=A.length,m=B.length;
const L=Array.from({length:n+1},()=>new Uint16Array(m+1));
for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i].n===B[j].n?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
let i=0,j=0,out=[];
// marks per letter
const marks=w=>{const r=[];for(const ch of w.normalize('NFC')){if(/[ء-ي]/.test(ch))r.push('');else if(/[ً-ّ]/.test(ch)&&r.length)r[r.length-1]+=ch;}return r.map(s=>[...s].sort().join(''));};
while(i<n&&j<m){if(A[i].n===B[j].n){const a=marks(A[i].raw),b=marks(B[j].raw);let d=false;
 if(a.length===b.length)for(let k=0;k<a.length;k++){if(a[k]&&b[k]&&a[k]!==b[k]){d=true;break;}}
 if(d)out.push(A[i].raw+'  ⇐⇒  '+B[j].raw+'   … '+A.slice(Math.max(0,i-3),i).map(x=>x.raw).join(' '));i++;j++;}
 else if(L[i+1][j]>=L[i][j+1])i++;else j++;}
console.log(out.length);console.log(out.join('\n'));
