// Turns Word's filtered-HTML export of the IslamHouse/al-Fahl edition of Riyad as-Salihin into a paragraph list.
// Each paragraph: {c: centered?, t: text with ⟦ ⟧ around bold runs}. Symbol-font glyphs (AGA Arabesque) are expanded.
const fs=require('fs');
const AGA={r:'ﷺ',t:'رضي الله عنه',y:'رضي الله عنهم',u:'عليه السلام',U:'عز وجل','(':'﴾',')':'﴿','[':'﴾',']':'﴿'};
module.exports=function(file){
  let d=fs.readFileSync(file,'utf8');
  const f=d.search(/<div[^>]*id=ftn\d/);const body=f>0?d.slice(0,f):d;
  let p;do{p=d;}while(0);
  let b=body;do{p=b;b=b.replace(/<span[^>]*><\/span>/g,'')}while(p!==b);
  const out=[],unk={};
  for(const m of b.matchAll(/<p([^>]*)>([\s\S]*?)<\/p>/g)){
    let h=m[2].replace(/\r?\n/g,' ');
    // hadith-number footnote anchors: keep the number text; other footnote refs: drop together with their parens
    h=h.replace(/\(?\s*<a [^>]*href="#_ftn\d+"[^>]*>([\s\S]*?)<\/a>\s*\)?/g,(all,inner)=>{const t=inner.replace(/<[^>]+>/g,'').trim();return /^\[\d+\]$/.test(t)?'':(all.startsWith('(')?'(':'')+t+(/\)$/.test(all)?')':'')+' '});
    h=h.replace(/<span[^>]*font-family:\s*"AGA Arabesque"[^>]*>([^<]*)<\/span>/g,(a,ch)=>{ch=ch.replace(/&nbsp;/g,' ');return ch.replace(/\S/g,c=>{if(AGA[c]!=null)return AGA[c];unk[c]=(unk[c]||0)+1;return '⟨?'+c+'⟩'})});
    h=h.replace(/<b>/g,'⟦').replace(/<\/b>/g,'⟧').replace(/<br[^>]*>/g,' ').replace(/<[^>]+>/g,'')
       .replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').replace(/⟧\s*⟦/g,' ').replace(/⟦\s*⟧/g,'').trim();
    if(!h.replace(/[⟦⟧\s]/g,''))continue;
    out.push({c:/align=center/.test(m[1]),t:h});
  }
  if(Object.keys(unk).length)console.error('unknown AGA glyphs',unk);
  return out;
};
if(require.main===module){const ps=module.exports(process.argv[2]);fs.writeFileSync(process.argv[3],ps.map(p=>(p.c?'@C ':'')+p.t).join('\n'));console.log(ps.length)}
