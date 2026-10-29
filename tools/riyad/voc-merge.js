// Stage D2: merges the vocalization pass (tools/riyad/voc/out/*.json) into the text, under strict rules:
//  - the letters, spaces and punctuation of the edition never change: any word whose bare letters differ is kept as it was;
//  - a haraka present in the edition (al-Fahl, completed from islamenc) is kept, unless the pass listed that word in its
//    "fixes" with a reason (those corrections are logged), or the word was a recorded al-Fahl/islamenc conflict;
//  - letters the edition left bare get the pass's harakat.
// Output: tools/riyad-cache/units-d.json and tools/riyad-cache/voc-report.json
const fs=require('fs'),path=require('path');const {strip,words,ortho}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache'),V=path.join(__dirname,'voc');
const U=JSON.parse(fs.readFileSync(path.join(C,'units-c.json'),'utf8'));
const HAR=/[ً-ْٰ]/;
const FORMULA=/صلى الله عليه وسلم|رضي الله عنه(?:ما|م|ا)?|عليه السلام/g;
const IN={};for(const f of fs.readdirSync(path.join(V,'in')))for(const it of JSON.parse(fs.readFileSync(path.join(V,'in',f),'utf8')))IN[it.id]=it;
const OUT={},FIX={};let files=0;
for(const f of fs.readdirSync(path.join(V,'out')).filter(f=>f.endsWith('.json'))){files++;let j;try{j=JSON.parse(fs.readFileSync(path.join(V,'out',f),'utf8'))}catch(e){console.error('bad json',f,e.message);continue}
  Object.assign(OUT,j.v||{});for(const x of j.fixes||[])(FIX[x.id]=FIX[x.id]||[]).push(x)}
const letters=w=>{const o=[];for(const ch of w){if(HAR.test(ch)){if(o.length)o[o.length-1].h+=ch}else o.push({c:ch,h:''})}return o};
const R={files,items:Object.keys(IN).length,vocalized:0,missing:[],wordsKept:[],harakatKept:0,harakatAdded:0,fixesApplied:[],fixesRejected:[],bareAfter:0};
function mergeItem(id,orig){
  const v=OUT[id];if(v==null){R.missing.push(id);return orig}
  const ow=orig.split(' '),vw=v.trim().split(/\s+/);
  // align by bare word; the pass must not add or drop words
  const ob=ow.map(strip),vb=vw.map(strip);
  if(ob.join(' ')!==vb.join(' ')){
    // try a word-level LCS so one bad word does not discard the rest
    const n=ob.length,m=vb.length,L=Array.from({length:n+1},()=>new Int32Array(m+1));
    for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=ob[i]===vb[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
    const map=new Array(n).fill(null);let i=0,j=0;while(i<n&&j<m){if(ob[i]===vb[j]){map[i]=j;i++;j++}else if(L[i+1][j]>=L[i][j+1])i++;else j++}
    for(let k=0;k<n;k++)if(map[k]==null&&/[ء-ي]/.test(ob[k]))R.wordsKept.push({id,word:ow[k]});
    return ow.map((w,k)=>map[k]==null?w:mergeWord(id,w,vw[map[k]])).join(' ');
  }
  R.vocalized++;
  return ow.map((w,k)=>mergeWord(id,w,vw[k])).join(' ');
}
const fixesFor=id=>FIX[id]||[];
const core=w=>strip(w||'').replace(/[^ء-ي]/g,'');
function mergeWord(id,o,v){
  if(o===v)return o;
  const fx=fixesFor(id).find(x=>core(x.from)===core(o)&&core(x.to)===core(o));
  const conflict=(IN[id].c||[]).some(([a,b])=>core(a)===core(o));
  if(fx||conflict){if(fx)R.fixesApplied.push({id,from:o,to:v,why:fx.why});else R.fixesApplied.push({id,from:o,to:v,why:'al-Fahl/islamenc conflict resolved by the vocalization pass'});return v}
  const A=letters(o),B=letters(v);if(A.length!==B.length)return o;
  let changedExisting=false;
  for(let k=0;k<A.length;k++){if(!/[ء-ي]/.test(A[k].c))continue;
    if(!A[k].h){if(B[k].h){A[k].h=B[k].h;R.harakatAdded++}}
    else if(B[k].h&&[...A[k].h].sort().join('')!==[...B[k].h].sort().join('')){
      // the edition has only part of it (e.g. shadda without vowel): complete; otherwise keep the edition
      if([...A[k].h].every(x=>B[k].h.includes(x))){A[k].h=B[k].h;R.harakatAdded++}else{R.harakatKept++;changedExisting=true}}}
  if(changedExisting)R.fixesRejected.push({id,edition:o,pass:v});
  return A.map(x=>x.c+x.h).join('');
}
const tidyF=t=>ortho(t).replace(FORMULA,m=>strip(m));
const get=(id,orig)=>IN[id]?tidyF(mergeItem(id,orig)):orig;
U.muq=U.muq.map((t,k)=>get('muq|'+k,t));
for(const c of U.chapters){if(c.n===91)continue;for(const u of c.units){
  u.segs=u.segs.map(([k,t],i)=>[k,k==='aya'?t:get(u.id+'|'+i,t)]);
  if(u.gloss)u.gloss=u.gloss.map(([a,b],k)=>[get(u.id+'|g'+k+'w',a),get(u.id+'|g'+k+'m',b)]);
  for(const [k,t] of u.segs)if(k!=='aya')for(const w of words(t.replace(FORMULA,'')))if(/[ء-ي]{2}/.test(w)&&!HAR.test(w))R.bareAfter++;
}}
fs.writeFileSync(path.join(C,'units-d.json'),JSON.stringify(U,null,1));
fs.writeFileSync(path.join(C,'voc-report.json'),JSON.stringify(R,null,1));
console.log({files:R.files,items:R.items,vocalizedClean:R.vocalized,missing:R.missing.length,wordsKept:R.wordsKept.length,harakatAdded:R.harakatAdded,harakatKeptAgainstPass:R.harakatKept,fixesApplied:R.fixesApplied.length,bareWordsLeft:R.bareAfter});
