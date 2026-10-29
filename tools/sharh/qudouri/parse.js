// Parses the cached Shamela pages of «اللباب في شرح الكتاب» (book 21496) into a paragraph stream.
// Each printed page = matn block (top) + «ــ» separator + commentary (+ <hr> editor footnotes, dropped).
// Output: tools/sharh-cache/qudouri/parsed.json  {paras:[{p,ref,matn:bool,html,t}]}
const fs=require('fs'),path=require('path');const {CACHE}=require('./fetch.js');
const ent=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));
function page(p){
  const f=path.join(CACHE,p+'.html');if(!fs.existsSync(f))return null;const s=fs.readFileSync(f,'utf8');if(!s)return null;
  const i=s.indexOf('<div class="nass');if(i<0)return null;const j=s.indexOf('<div id="appended_pages"',i);
  let h=s.slice(i,j);const title=(s.match(/<title>([^<]*)/)||[])[1]||'';
  const vol=(title.match(/^ج(\d+)/)||[])[1],pn=(h.match(/data-page-num="(\d+)"/)||[])[1];
  h=h.replace(/<hr>[\s\S]*$/,'');                       // editor footnotes (p.hamesh) follow the <hr>
  h=h.replace(/<a href="#p\d+"[^>]*>[\s\S]*?<\/a>/g,'').replace(/<span[^>]*class="anchor"[^>]*><\/span>/g,'');
  const ps=[...h.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m=>m[1]);
  const sep=ps.findIndex(x=>/^\s*ـ+\s*$/.test(ent(x.replace(/<[^>]+>/g,''))));
  return {p,vol,pn,title,sep,ps};
}
const toText=h=>ent(h.replace(/<span class="c2">\s*\(([٠-٩0-9]+)\)\s*<\/span>/g,'')   // footnote call «(١)»
  .replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();
if(require.main===module){
  const out=[];let missing=[];
  for(let p=1;p<=904;p++){const g=page(p);if(!g){missing.push(p);continue}
    g.ps.forEach((h,k)=>{const matn=g.sep>=0?k<g.sep:false;if(k===g.sep)return;
      // anchors: matn quoted in the commentary, <span class="c2">(…)</span>
      const anchors=[...h.matchAll(/<span class="c2">([\s\S]*?)<\/span>/g)].map(m=>ent(m[1].replace(/<[^>]+>/g,'')).trim()).filter(a=>!/^\(?[٠-٩0-9]+\)?$/.test(a));
      out.push({p,ref:'ج'+g.vol+' ص'+g.pn,vol:g.vol,pn:+g.pn,matn,sep:g.sep>=0,head:/^\s*<span class="c4">\[[^\]]*\]<\/span>\s*$/.test(h),anchors,html:h,t:toText(h)})})}
  fs.writeFileSync(path.join(CACHE,'parsed.json'),JSON.stringify({missing,paras:out}));
  console.log('paras',out.length,'missing pages',missing.length,missing.slice(0,20).join(','),'pages without separator',[...new Set(out.filter(x=>!x.sep).map(x=>x.p))].length);
}
module.exports={page,toText};
