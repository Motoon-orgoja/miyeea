// Verse-level check: for each base verse, finds the most similar verse line in each witness (word overlap after normalization)
// and prints the verse when a witness line differs from the base in its words. Flags «N=B» when both witnesses agree against the base.
// usage: node verse-vote.js base.txt nathr.w.txt bunud.w.txt [--all]
const fs=require('fs');
const norm=w=>w.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱء]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ا').replace(/[^ء-ي]/g,'');
const ws=l=>l.replace(/\|/g,' ').split(/\s+/).map(norm).filter(Boolean);
const rd=f=>fs.readFileSync(f,'utf8').split('\n').filter(l=>l.includes('|')).map(l=>({l,w:ws(l)}));
const B=rd(process.argv[2]),W1=rd(process.argv[3]),W2=rd(process.argv[4]);const all=process.argv.includes('--all');
// index witness lines by word
const idx=W=>{const m={};W.forEach((x,i)=>new Set(x.w).forEach(w=>(m[w]=m[w]||[]).push(i)));return m;};
const I1=idx(W1),I2=idx(W2);
const best=(v,W,I,lo)=>{const c={};new Set(v.w).forEach(w=>(I[w]||[]).forEach(i=>c[i]=(c[i]||0)+1));let bi=-1,bs=0;
 for(const i in c){const s=c[i]/Math.max(v.w.length,W[i].w.length);if(s>bs||(s===bs&&Math.abs(i-lo)<Math.abs(bi-lo))){bs=s;bi=+i;}}return bs>=0.5?W[bi]:null;};
let n=0;const out=[];
B.forEach((v,k)=>{const a=best(v,W1,I1,0),b=best(v,W2,I2,0);const s=v.w.join(' ');
 const da=a&&a.w.join(' ')!==s&&!a.l.includes('…'),db=b&&b.w.join(' ')!==s;
 if(da||db||all){const agree=a&&b&&a.w.join(' ')===b.w.join(' ')&&a.w.join(' ')!==s;
  out.push((k+1)+(agree?'  N=B':'')+'\n  base '+v.l+'\n  N    '+(a?a.l:'-')+'\n  B    '+(b?b.l:'-'));n++;}});
console.log(out.join('\n'));console.error('flagged',n);
