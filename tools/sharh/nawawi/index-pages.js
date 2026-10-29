// Indexes the cached shamela pages of book 11244 into paragraphs: tools/sharh-cache/nawawi/paras.json [{p,pn,t,blk,sep}]
// p = shamela page id, pn = printed page; the edition prints the matn (Nawawi's text) at the top of a page, then a «ــ» line, then the commentary.
const fs=require('fs'),path=require('path');const {CACHE}=require('./fetch.js');
const dec=s=>s.replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(a,n)=>String.fromCharCode(+n));
const paras=[];
for(let p=1;;p++){const f=path.join(CACHE,p+'.html');if(!fs.existsSync(f))break;const d=fs.readFileSync(f,'utf8');if(!d)break;
  const pn=+(d.match(/data-page-num="(\d+)"/)||[])[1];const sec=((d.match(/<title>[^<]*? - [^<]*? - ([^<]*) - المكتبة الشاملة/)||[])[1]||'');
  let t=d.slice(d.indexOf('class="nass'));t=t.slice(t.indexOf('>')+1);t=t.slice(0,t.indexOf('<div id="appended_pages"'));
  const hr=t.indexOf('<hr');const foot=hr>=0?t.slice(hr):'';if(hr>=0)t=t.slice(0,hr);
  const pp=[];
  for(const m of t.matchAll(/<p(?![^>]*hamesh)[^>]*>([\s\S]*?)<\/p>/g)){
    let x=m[1].replace(/<a [^>]*btn_tag[\s\S]*?<\/a>/g,'').replace(/<span class="c2">\s*\([٠-٩0-9]+\)\s*<\/span>/g,'').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'');
    x=dec(x).replace(/[ \t]+/g,' ').trim();if(!x)continue;pp.push({p,pn,sec,t:x});
  }
  const sep=pp.findIndex(q=>/^ـ+$/.test(q.t));
  pp.forEach((q,k)=>{if(sep>=0&&k<sep)q.blk=1;if(sep===k)q.sep=1;paras.push(q)});
  if(foot)paras.push({p,pn,sec,foot:foot.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()});
}
fs.writeFileSync(path.join(CACHE,'paras.json'),JSON.stringify(paras));
fs.writeFileSync(path.join(CACHE,'dump.txt'),paras.map(q=>`[${q.p}/${q.pn}${q.blk?' M':''}${q.sep?' S':''}${q.foot?' F':''}] ${q.foot||q.t}`).join('\n'));
console.log(paras.length,'paras',paras.filter(q=>q.foot).length,'footnote blocks');
