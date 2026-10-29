// Validates data/riyad.js and data/riyad-sharh/: unique ids, non-empty chapters, chapter 91 ids unchanged,
// hadith numbering 1..N without gaps, every sharh key present in the book. Prints totals.
const vm=require('vm'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data','riyad.js'),'utf8'),ctx);const B=ctx.window.BOOK;
let ok=true;const err=m=>{ok=false;console.log('ERROR',m)};
if(B.key!=='riyad'||B.app!=='mutoon'||B.lsk!=='mutoon_riyad91_v1')err('key/app/lsk changed');
const ids=new Set(),chIds=new Set();let units=0,ayat=0,had=0,text=0;
for(const c of B.chapters){if(chIds.has(c.id))err('duplicate chapter '+c.id);chIds.add(c.id);if(!c.units.length)err('empty chapter '+c.id);
  for(const u of c.units){units++;if(ids.has(u.id))err('duplicate unit '+u.id);ids.add(u.id);if(!u.segs.length||u.segs.some(s=>!s[1]))err('empty seg in '+u.id);
    if(u.kind==='aya')ayat++;else if(u.kind==='hadith')had++;else text++;}}
const c91=B.chapters.find(c=>c.id==='riyad91');const want=['a1','699','700','701a','701b','701c','702'];
if(!c91||c91.units.map(u=>u.id).join()!==want.join())err('chapter 91 ids changed: '+(c91&&c91.units.map(u=>u.id).join()));
const nums=new Set();for(const c of B.chapters)for(const u of c.units)if(u.kind==='hadith')nums.add(+u.id.replace(/[a-z]+$/,''));
const max=Math.max(...nums),gaps=[];for(let i=1;i<=max;i++)if(!nums.has(i))gaps.push(i);if(gaps.length)err('hadith numbering gaps: '+gaps.join(','));
let prev=0,order=[];for(const c of B.chapters)for(const u of c.units)if(u.kind==='hadith'){const n=+u.id.replace(/[a-z]+$/,'');if(n<prev)order.push(u.id);prev=n}if(order.length)err('out of order: '+order.slice(0,10).join(','));
const SD=path.join(root,'data','riyad-sharh');let sk=0,sz=0,files=0;
const index=JSON.parse(fs.readFileSync(path.join(SD,'index.json'),'utf8'));
for(const f of fs.readdirSync(SD)){sz+=fs.statSync(path.join(SD,f)).size;if(f==='index.json')continue;files++;const cid=f.replace('.json','');if(!chIds.has(cid))err('sharh file for unknown chapter '+f);if(!index.includes(cid))err('not in index: '+cid);
  const S=JSON.parse(fs.readFileSync(path.join(SD,f),'utf8'));const mine=new Set(B.chapters.find(c=>c.id===cid).units.map(u=>u.id));
  for(const [k,v] of Object.entries(S)){sk++;if(!mine.has(k))err('sharh key '+k+' not in '+cid);if(!v.secs||!v.secs.length||v.secs.some(s=>!s.src||!s.url||!s.text))err('bad sharh entry '+cid+'/'+k)}}
for(const cid of index)if(!fs.existsSync(path.join(SD,cid+'.json')))err('index lists missing '+cid);
console.log({chapters:B.chapters.length,bab:B.chapters.filter(c=>c.id!=='riyad0').length,units,ayat,hadithUnits:had,textUnits:text,hadiths:nums.size,maxHadith:max,
  riyadJsBytes:fs.statSync(path.join(root,'data','riyad.js')).size,sharhFiles:files,sharhEntries:sk,sharhBytes:sz,sub:B.sub});
console.log(ok?'OK':'FAILED');process.exit(ok?0:1);
