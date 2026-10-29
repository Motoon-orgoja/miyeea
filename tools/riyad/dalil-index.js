// Indexes the cached shamela pages of Dalil al-Falihin (book 140): paragraphs with page refs, chapter and hadith markers.
// Output tools/riyad-cache/dalil.json {paras:[{p,ref,t,mk}]}; mk = {kind:'h'|'m'|'b'|'k', num}
//  'h' = start of Ibn Allan's commentary on a hadith ("١٢٦٩- (وعن …)"), 'm' = the edition's copy of the Riyad text
//  printed above the commentary in the later volumes (no parentheses), 'b'/'k' = باب / كتاب headings.
const fs=require('fs'),path=require('path');
const C=path.join(__dirname,'..','riyad-cache');
const dec=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(a,n)=>String.fromCharCode(+n));
const toW=s=>s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const paras=[];
for(let p=1;;p++){const f=path.join(C,'shamela140',p+'.html');if(!fs.existsSync(f))break;const d=fs.readFileSync(f,'utf8');if(!d||/404 Page Not Found/.test(d.slice(0,3000)))break;
  const title=(d.match(/<title>([^<]*)/)||[])[1]||'';const ref=((title.match(/^(ج\d+\s*-\s*ص\s*\d+)/)||[])[1]||'').replace(/\s+/g,' ');
  let t=d.slice(d.indexOf('class="nass'));t=t.slice(t.indexOf('>')+1);t=t.slice(0,t.indexOf('<div id="appended_pages"'));
  t=t.replace(/<hr>[\s\S]*$/,''); // the edition's footnotes (hamesh) follow an <hr>
  const pp=[];
  for(const m of t.matchAll(/<p(?![^>]*hamesh)[^>]*>([\s\S]*?)<\/p>/g)){
    let x=m[1].replace(/<a [^>]*btn_tag[\s\S]*?<\/a>/g,'').replace(/<span class="c2">\s*\([٠-٩]+\)\s*<\/span>/g,'').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'');
    x=dec(x).replace(/[ \t]+/g,' ').replace(/ +([.،])/g,'$1').trim();if(!x)continue;
    pp.push({p,ref,t:x});
  }
  // later volumes print the Riyad text at the top of each page, then a «ــ» line, then the commentary
  const sep=pp.findIndex(q=>/^ـ+$/.test(q.t));
  pp.forEach((q,k)=>{if(sep>=0&&k<sep)q.blk=1;if(sep===k)q.sep=1;let mm;
    if((mm=q.t.match(/^\[?\s*([٠-٩]+)\s*[-ـ–]\s*(باب|كتاب)/)))q.mk={kind:mm[2]==='باب'?'b':'k',num:+toW(mm[1])};
    else if((mm=q.t.match(/^([٠-٩]+)\s*[-ـ–]\s*/)))q.mk={kind:q.blk?'m':'h',num:toW(mm[1])};
    paras.push(q)});
}
fs.writeFileSync(path.join(C,'dalil.json'),JSON.stringify({paras}));
const k={};paras.forEach(q=>{if(q.mk)k[q.mk.kind]=(k[q.mk.kind]||0)+1});console.log('paras',paras.length,k);
