// Lists words in a vocalized poem file where a consonant carries no mark at all (ignoring long-vowel letters after
// their vowel, the article's alif/lam, a hamzat-wasl alif, final alif/alif maqsura, and the letter before a shadda-less sun-letter).
// usage: node markcheck.js <file>
const fs=require('fs');const M=/[ً-ْٰ]/;
const out={};let words=0;
for(const l of fs.readFileSync(process.argv[2],'utf8').split('\n')){if(!l.includes(' | '))continue;
 for(const w of l.replace(' | ',' ').split(/\s+/)){if(!/[ء-ي]/.test(w))continue;words++;
  const L=[];for(const ch of w.normalize('NFC')){if(/[ء-ي]/.test(ch))L.push({c:ch,m:''});else if(M.test(ch)&&L.length)L[L.length-1].m+=ch;}
  for(let i=0;i<L.length;i++){const {c,m}=L[i];if(m)continue;const p=L[i-1];
   if('اىآ'.includes(c))continue; // alif / maqsura / madda
   if((c==='و'&&p&&/ُ/.test(p.m))||(c==='ي'&&p&&/ِ/.test(p.m)))continue; // long u / i
   if(c==='ل'&&p&&p.c==='ا'&&i<=2)continue; // article lam (sun letter)
   if(c==='ء'&&i===L.length-1)continue;
   (out[w]=(out[w]||0)+1);break;}}}
console.log('words',words,'with an unmarked consonant',Object.keys(out).length);console.log(Object.keys(out).join('  '));
