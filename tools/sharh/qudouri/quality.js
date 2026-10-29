// Spot-check of the mapping: for each entry, are the quotes «(…)» it contains found in the unit it is attached to
// (or in the units it absorbs)? Prints entries whose quotes mostly belong elsewhere.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','..','..');
const w={};new Function('window',fs.readFileSync(path.join(ROOT,'data','qudouri.js'),'utf8'))(w);
const HAR=/[ً-ْٰـ]/g;
const fold=s=>s.replace(HAR,'').replace(/[أإآٱ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^ء-ي\s]/g,' ').replace(/\s+/g,' ').trim();
const cut=x=>x.replace(/^(و|ف)(?=..)/,'').replace(/^ال(?=..)/,'');
const U=[];w.BOOK.chapters.forEach(c=>c.units.forEach(u=>U.push({id:u.id,cid:c.id,set:new Set(fold(u.segs.map(s=>s[1]).join(' ')).split(' ').map(cut))})));
const IX={};U.forEach((u,i)=>IX[u.id]=i);
let tot=0,good=0;const bad=[];
for(const f of fs.readdirSync(path.join(ROOT,'data','qudouri-sharh'))){const j=JSON.parse(fs.readFileSync(path.join(ROOT,'data','qudouri-sharh',f),'utf8'));
  for(const [id,e] of Object.entries(j)){const i=IX[id];const n=/والتي قبلها/.test(e.title)?2:+((e.title.match(/\(([٠-٩]+) فقرات\)/)||[])[1]||'1').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const own=new Set();for(let k=i-n+1;k<=i;k++)for(const x of U[k].set)own.add(x);
    const qs=(e.secs[0].text.match(/\([^()]{3,200}\)/g)||[]).map(q=>fold(q).split(' ').filter(x=>x.length>2).map(cut)).filter(q=>q.length>=2);
    if(!qs.length)continue;tot++;
    const ok=qs.filter(q=>q.filter(x=>own.has(x)).length>=Math.ceil(q.length*0.6)).length/qs.length;
    if(ok>=0.5)good++;else bad.push(id+' '+Math.round(ok*100)+'% '+e.secs[0].text.slice(0,60).replace(/\n/g,' '))}}
console.log('entries with quotes',tot,'mostly own quotes',good,'('+Math.round(good/tot*1000)/10+'%)');console.log(bad.slice(0,+process.argv[2]||25).join('\n'));
