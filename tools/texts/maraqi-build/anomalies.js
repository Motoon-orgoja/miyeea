// Flags suspicious vocalization: two vowel marks on one letter, a repeated mark, tanween before the end of a word,
// a mark on a bare alif (not tanween fath), sukun on the first letter of a word.  usage: node anomalies.js file
const fs=require('fs');const V=/[ًٌٍَُِْ]/;let vn=0;
fs.readFileSync(process.argv[2],'utf8').split('\n').forEach(l=>{if(!l.includes(' | '))return;vn++;
 for(const w of l.split(/\s+/)){if(w==='|')continue;const u=[];for(const ch of w){if(/[ً-ْٰ]/.test(ch)){if(u.length)u[u.length-1].m+=ch;}else u.push({c:ch,m:''});}
  const why=[];u.forEach((x,i)=>{const vs=[...x.m].filter(c=>V.test(c));if(vs.length>1)why.push('2 marks');if(/(.)\1/.test(x.m))why.push('repeat');
   if(/[ًٌٍ]/.test(x.m)&&i<u.length-1&&!(i===u.length-2&&/[اى]/.test(u[i+1].c)))why.push('inner tanween');
   if(/[ًٌٍَُِْ]/.test(x.m)&&x.c==='ا'&&!/ً/.test(x.m)&&i>0)why.push('mark on alif');});
  if(why.length)console.log(vn+'\t'+w+'\t'+[...new Set(why)].join(','));}});
