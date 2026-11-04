// per-letter haraka comparison of base (354) vs Fahl (5902) on words with identical skeleton; reports letters where both carry a haraka and they differ
const clean=require('./clean'),norm=require('./norm');const A=require('./p354.json').V,B=require('./p5902.json').V;
const c=s=>clean(s).replace(/(^|\s)-(\s|$)/g,' ').trim();
const sk=w=>w.replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي');
function marks(w){const r=[];for(const ch of w.normalize('NFC')){if(/[ً-ْٰ]/.test(ch)){if(r.length)r[r.length-1]+=ch}else if(ch!=='ـ')r.push('')}return r}
const norm1=m=>m.replace('ً','َ').replace('ٌ','ُ').replace('ٍ','ِ').split('').sort().join('');
let tot=0;const out=[];
for(let k=0;k<A.length;k++){const a=c(A[k].a+' … '+A[k].b).replace('…',' ').split(/\s+/),b=clean(B[k].raw.replace(/\.\.\./g,' ')).split(/\s+/);
 const bm={};b.forEach(w=>{(bm[sk(w)]=bm[sk(w)]||[]).push(w)});
 for(const w of a){const cand=(bm[sk(w)]||[]);if(!cand.length)continue;const x=cand[0];const ma=marks(w),mb=marks(x);if(ma.length!==mb.length)continue;
  for(let i=0;i<ma.length;i++){if(!ma[i]||!mb[i])continue;tot++;const p=norm1(ma[i]),q=norm1(mb[i]);if(p!==q&&!(p.replace('ْ','')===q.replace('ْ','')))out.push(A[k].n+'\t'+w+'\t'+x);}}}
console.log('compared marks',tot,'diffs',out.length);require('fs').writeFileSync('harakat-vs-fahl.tsv',[...new Set(out)].join('\n'));
