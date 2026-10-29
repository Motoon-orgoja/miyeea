// Stage D1: orthographic normalisation (to the style of the hand-checked chapter 91) and the work files for the
// vocalization pass. Writes tools/riyad-cache/units-c.json and tools/riyad/voc/in/NN.json (items {id,t,c?}).
//   id = unitId|segIndex  or unitId|g<k>w / g<k>m (gloss word / meaning)  or muq|k (the author's preface)
//   c  = harakat conflicts between al-Fahl and islamenc found in this text: [[fahlForm, islamencForm], ...]
const fs=require('fs'),path=require('path');const {strip,words,ortho}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache'),V=path.join(__dirname,'voc');
const U=JSON.parse(fs.readFileSync(path.join(C,'units-b.json'),'utf8'));
const COL=JSON.parse(fs.readFileSync(path.join(C,'collation.json'),'utf8'));
// formulae are shown unvocalized, as in chapter 91
const FORMULA=/صلى الله عليه وسلم|رضي الله عنه(?:ما|م|ا)?|عليه السلام/g;
const clean=t=>ortho(t).replace(FORMULA,m=>strip(m));
for(const c of U.chapters)for(const u of c.units){u.segs=u.segs.map(([k,t])=>[k,k==='aya'?t:clean(t)]);if(u.gloss)u.gloss=u.gloss.map(([a,b])=>[clean(a),clean(b)])}
U.muq=U.muq.map(clean);
fs.writeFileSync(path.join(C,'units-c.json'),JSON.stringify(U,null,1));
// conflicts per hadith number
const CF={};for(const x of COL.conflictList)(CF[x.n]=CF[x.n]||[]).push([ortho(x.base),ortho(x.other)]);
const items=[];
U.muq.forEach((t,k)=>items.push({id:'muq|'+k,t}));
for(const c of U.chapters){if(c.n===91)continue;for(const u of c.units){
  u.segs.forEach(([k,t],i)=>{if(k==='aya')return;const it={id:u.id+'|'+i,t};
    if(u.n&&CF[u.n]){const here=CF[u.n].filter(([a])=>t.includes(a));if(here.length)it.c=here}
    items.push(it)});
  (u.gloss||[]).forEach(([a,b],k)=>{items.push({id:u.id+'|g'+k+'w',t:a});items.push({id:u.id+'|g'+k+'m',t:b})});
}}
// chunks of about 4000 words, never splitting a unit
fs.mkdirSync(path.join(V,'in'),{recursive:true});fs.mkdirSync(path.join(V,'out'),{recursive:true});
const chunks=[];let cur=[],n=0,lastUnit=null;
for(const it of items){const unit=it.id.split('|')[0];if(n>=4000&&unit!==lastUnit){chunks.push(cur);cur=[];n=0}cur.push(it);n+=words(it.t).length;lastUnit=unit}
if(cur.length)chunks.push(cur);
chunks.forEach((ch,k)=>fs.writeFileSync(path.join(V,'in',String(k+1).padStart(2,'0')+'.json'),JSON.stringify(ch,null,0).replace(/\},\{/g,'},\n{')));
const bare=items.reduce((a,it)=>a+words(it.t).filter(w=>/[ء-ي]/.test(w)&&!/[ً-ْ]/.test(w)).length,0);
console.log('items',items.length,'chunks',chunks.length,'words',items.reduce((a,it)=>a+words(it.t).length,0),'bare words',bare,'items with conflicts',items.filter(i=>i.c).length);
