const fs=require('fs');const norm=require('./a_norm.js');const {V}=require('./a_qv.js');
const map=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const M=/[ً-ْ]/;
// split a word into [letter, marks] units
const units=w=>{const u=[];for(const c of w){if(M.test(c)||c==='ٰ'){if(u.length)u[u.length-1][1]+=c}else if(c!=='ـ')u.push([c,''])}return u};
const vow=m=>m.replace(/[ّْٰ]/g,'').replace(/ٌ/g,'ُ').replace(/ً/g,'َ').replace(/ٍ/g,'ِ');
const out=[];let pairs=0,cmp=0;
for(const r of map){if(r.k<0||!r.t)continue;const v=V[r.n-1];
 const qw=(v.a+' '+v.b).split(' '), ow=r.t.replace(/\.\.\./,' ').replace(/[«»"،:؛.]/g,' ').split(/\s+/).filter(Boolean);
 const qn=qw.map(norm),on=ow.map(norm);
 // greedy match by normalized equality, in order
 let j=0;for(let i=0;i<qw.length;i++){let k=on.indexOf(qn[i],j);if(k<0||k>j+2)continue;j=k+1;pairs++;
  const a=units(qw[i]),b=units(ow[k]);if(a.length!==b.length)continue;
  for(let x=0;x<a.length;x++){const va=vow(a[x][1]),vb=vow(b[x][1]);if(va&&vb){cmp++;if(va!==vb){out.push({n:r.n,q:qw[i],o:ow[k],pos:x});break}}
   const sa=a[x][1].includes('ّ'),sb=b[x][1].includes('ّ');}}}
console.error('word pairs',pairs,'letter vowels compared',cmp,'conflicts',out.length);
fs.writeFileSync(process.argv[3],out.map(o=>o.n+'\t'+o.q+'\t'+o.o).join('\n'));
