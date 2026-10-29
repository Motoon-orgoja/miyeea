// Parses the cached shamela pages of حاشية الآجرومية (book 7368) into tools/sharh-cache/ajurrumiyya/pages.json:
// per page: matn paragraphs (above the «ــ» rule, with footnote markers ⟦n⟧), hashiya paragraphs (below it), editor hamesh dropped.
const fs=require('fs'),path=require('path');const {CACHE,BOOK}=require('./fetch.js');
const D=path.join(CACHE,'book'+BOOK);const AR='٠١٢٣٤٥٦٧٨٩';const toN=s=>+[...s].map(c=>AR.indexOf(c)>=0?AR.indexOf(c):c).join('');
const ent=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(+n));
function para(h){h=h.replace(/<a href="#p\d+"[^>]*>[\s\S]*?<\/a>/g,'').replace(/<span[^>]*class="anchor"[^>]*><\/span>/g,'');
  h=h.replace(/<span class="c2">\s*\(([٠-٩0-9]+)\)\s*<\/span>/g,(m,n)=>'⟦'+toN(n)+'⟧');
  return ent(h.replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'')).replace(/[ \t ]+/g,' ').trim();}
const pages=[];
for(let p=1;;p++){const f=path.join(D,p+'.html');if(!fs.existsSync(f))break;const s=fs.readFileSync(f,'utf8');
  const m=s.match(/<div class="nass[^"]*" data-page-id="(\d+)" data-page-num="(\d+)">([\s\S]*?)<div id="appended_pages/);if(!m)continue;
  let body=m[3].replace(/<hr>[\s\S]*$/,'');// editor's hamesh
  let ps=[...body.matchAll(/<p(?: [^>]*)?>([\s\S]*?)<\/p>/g)].filter(x=>!/class="hamesh"/.test(x[0])).map(x=>para(x[1])).filter(Boolean);
  // fixes of the digital text: the «ــ» rule glued to a paragraph (page 30), a mistyped note number «(٢٩» for «(٣)» (page 110)
  ps=ps.flatMap(t=>/\S\s*ـ+$/.test(t)?[t.replace(/\s*ـ+$/,''),'ــ']:[t]).map(t=>t.replace(/^\(٢٩ /,'⟦3⟧ '));
  const k=ps.findIndex(t=>/^ـ+$/.test(t));
  const pg={id:+m[1],num:+m[2],matn:k<0?[]:ps.slice(0,k).filter(t=>!/^\.{5,}$/.test(t)),hashiya:k<0?ps:ps.slice(k+1),rule:k>=0};
  pages.push(pg);}
fs.writeFileSync(path.join(CACHE,'pages.json'),JSON.stringify(pages,null,1));
let bad=0;for(const pg of pages){const mm=pg.matn.join(' ').match(/⟦\d+⟧/g)||[];const hm=pg.hashiya.filter(t=>/^⟦\d+⟧/.test(t)).map(t=>t.match(/^⟦(\d+)⟧/)[0]);
  if(mm.join()!==hm.join()){bad++;console.log('page',pg.id,pg.num,'matn',mm.join(''),'hash',hm.join(''),pg.rule?'':'NO RULE')}}
console.log(pages.length,'pages; mismatched',bad);
