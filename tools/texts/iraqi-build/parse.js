// parse a shamela edition into {n, a, b, raw} verses + headings before verse n
// usage: node parse.js <book> <from> <to> <out.json>
const text=require('./text'),fs=require('fs'),path=require('path');
const [b,f,t,out]=process.argv.slice(2);
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
const V=[],H=[],odd=[];let pend=[];
for(let p=+f;p<=+t;p++){const fn=path.join(__dirname,'..','raw','iraqi',`s${b}_${p}.html`);if(!fs.existsSync(fn))continue;
 const L=text(fn);if(!L)continue;
 for(const l of L){
  if(/^\([٠-٩0-9]+\)/.test(l))continue; // footnote block
  const m=l.match(/^([٠-٩0-9]+)\s*[.\-–]\s*(.+)$/);
  if(m){const n=toInt(m[1]);const parts=m[2].split(/\s*(?:…|\.\.\.)\s*/);
   if(parts.length!==2)odd.push({n,p,l});
   V.push({n,p,a:parts[0],b:parts.slice(1).join(' … '),raw:m[2]});
   if(pend.length){H.push({n,t:pend});pend=[];}continue;}
  pend.push(l);
 }}
// check numbering
let prev=0;for(const v of V){if(v.n!==prev+1)console.log('jump',prev,'->',v.n,'page',v.p);prev=v.n;}
console.log('verses',V.length,'last',prev,'odd',odd.length);odd.slice(0,20).forEach(o=>console.log('ODD',o.n,o.p,o.l));
fs.writeFileSync(out,JSON.stringify({V,H},null,0));
