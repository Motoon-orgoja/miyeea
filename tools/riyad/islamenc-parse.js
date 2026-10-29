// Parses a cached riyadh.islamenc.com page into {title, ayat:[{text,ref}], hadiths:[{n,k,text}]} (IslamHouse's fawaid are ignored)
const fs=require('fs');
const clean=h=>h.replace(/<br[^>]*>/g,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
module.exports=function(file){
  const d=fs.readFileSync(file,'utf8');
  const title=clean((d.match(/<h1 class="title"[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'');
  const out={title,ayat:[],hadiths:[]};
  for(const m of d.matchAll(/<p( class='special')?[^>]*>([\s\S]*?)<\/p>/g)){
    const t=clean(m[2]);
    if(m[1]){const n=t.match(/^(\d+)\s*\/\s*(\d+)\s*ـ*\s*/);out.hadiths.push({k:n?+n[1]:null,n:n?+n[2]:null,text:n?t.slice(n[0].length):t})}
    else if(/class="c4"/.test(m[2])){for(const a of m[2].matchAll(/<span class="c4">([\s\S]*?)<\/span>\s*(?:<span class="c5">([\s\S]*?)<\/span>)?/g))out.ayat.push({text:clean(a[1]),ref:clean(a[2]||''),para:t})}
  }
  return out;
};
if(require.main===module){const r=module.exports(process.argv[2]);console.log(JSON.stringify(r,null,1).slice(0,3000))}
