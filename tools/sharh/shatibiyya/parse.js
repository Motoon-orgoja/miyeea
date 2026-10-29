// Parses cached pages of shamela 95577 into an ordered list of paragraphs {page (id), num (printed page), t}
const fs=require('fs'),path=require('path');
const {CACHE}=require('./fetch.js');
const clean=b=>b.replace(/^[^>]*>/,'')
  .replace(/<a [\s\S]*?<\/a>/g,'')
  .replace(/<span class="c4">[^<]*(<\/span>)?/g,'')            // editor brackets: [سورة …], [البقرة: ١٨]
  .replace(/<span class="c2">\(قرآن كريم\)<\/span>/g,'')
  .replace(/<[^>]+>/g,'').replace(/<div\s*$/,'')
  .replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
  .replace(/^\s*[٠-٩0-9][٠-٩0-9 ،:\-]*\]/,'')                  // tail of a bracket ref split over two paragraphs
  .replace(/\s*\([٠-٩0-9]+\)/g,'')                             // footnote markers
  .replace(/\s+([،.:؛])/g,'$1').replace(/،\s*،/g,'،')
  .replace(/\s+/g,' ').trim();
function paras(){const out=[];for(let p=1;;p++){const f=path.join(CACHE,p+'.html');if(!fs.existsSync(f))break;const d=fs.readFileSync(f,'utf8');
  const i=d.indexOf('class="nass');if(i<0)break;const num=+(d.slice(i,i+200).match(/data-page-num="(\d+)"/)||[])[1];
  let t=d.slice(i).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
  t=t.split(/<hr\s*\/?>/)[0]; // footnotes (hamesh) follow the rule
  for(const b of t.split(/<p[ >]/).slice(1)){const x=clean(b);if(x&&!/^[\s،.:؛]*$/.test(x))out.push({page:p,num,t:x})}}
  return out;}
module.exports={paras};
if(require.main===module)for(const x of paras())console.log(x.page+'\t'+x.t);
