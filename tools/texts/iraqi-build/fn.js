// show base verse raw + its footnotes (by marker numbers in the verse) from its page
const text=require('./text'),path=require('path');const {V}=require('./p354.json');
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
for(const n of process.argv.slice(2).map(Number)){const v=V.find(x=>x.n===n);
 const L=text(path.join(__dirname,'..','raw','iraqi',`s354_${v.p}.html`));const fl=L.filter(l=>/^\([٠-٩]+\)/.test(l)).join(' ');
 const notes={};fl.split(/(?=\([٠-٩]+\) )/).forEach(s=>{const m=s.match(/^\(([٠-٩]+)\)\s*(.*)/);if(m)notes[toInt(m[1])]=m[2]});
 const mk=[...v.raw.matchAll(/\(([٠-٩]+)\)/g)].map(m=>toInt(m[1]));
 console.log('#'+n+' '+v.raw);mk.forEach(k=>console.log('   ('+k+') '+(notes[k]||'').slice(0,400)));}
