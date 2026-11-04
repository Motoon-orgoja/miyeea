// Three-witness word check. For every verse of the base (a | b lines), marks each word by whether it is matched (LCS, after
// normalization) in witness M and witness C. Prints verses where some word is matched by neither, with the aligned
// readings of M and C.  usage: node vote.js base.txt M.txt C.txt
const fs=require('fs');
const norm=w=>w.replace(/[ً-ٰٟۖ-ۭـ]/g,'').replace(/[أإآٱء]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ا').replace(/[^ء-ي]/g,'');
const words=(f,verse)=>{const out=[];fs.readFileSync(f,'utf8').split('\n').forEach((l,li)=>{if(/^(@|##|#|>|\?)/.test(l)&&verse)return;if(/^(@|##)/.test(l))return;l.replace(/\|/g,' ').split(/\s+/).forEach(w=>{const n=norm(w);if(n)out.push({raw:w,n,li});});});return out;};
const A=words(process.argv[2],true);
function align(B){const n=A.length,m=B.length;const L=Array.from({length:n+1},()=>new Uint16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i].n===B[j].n?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const map=new Array(n).fill(-1);let i=0,j=0;while(i<n&&j<m){if(A[i].n===B[j].n){map[i]=j;i++;j++;}else if(L[i+1][j]>=L[i][j+1])i++;else j++;}return map;}
const M=words(process.argv[3]),C=words(process.argv[4]);const mm=align(M),mc=align(C);
// for unmatched base word i, show the witness words between the previous and next matched anchors
const gap=(map,B,i)=>{let a=i-1;while(a>=0&&map[a]<0)a--;let b=i+1;while(b<A.length&&map[b]<0)b++;const s=a>=0?map[a]+1:0,e=b<A.length?map[b]:B.length;return B.slice(s,Math.min(e,s+8)).map(x=>x.raw).join(' ');};
const lines=fs.readFileSync(process.argv[2],'utf8').split('\n');const byLine={};
A.forEach((w,i)=>{const okM=mm[i]>=0,okC=mc[i]>=0;if(!okM&&!okC){(byLine[w.li]=byLine[w.li]||[]).push(w.raw+'  ‖ M: '+gap(mm,M,i)+'  ‖ C: '+gap(mc,C,i));}});
let vn=0;lines.forEach((l,li)=>{if(l.includes(' | '))vn++;if(byLine[li]){console.log(vn+'\t'+l);byLine[li].forEach(s=>console.log('\t\t'+s));}});
