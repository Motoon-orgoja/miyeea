// Build data/sharh/tuhfa.json from Shamela book 9632 (تحفة الأطفال مذيلة بشرح وجيز للضباع).
// The sharh is the editor-author's footnotes (hamesh); each footnote is keyed to the verse/heading carrying its marker.
const fs=require('fs'),path=require('path');
const {shamelaPage}=require('../fetch.js');
const {loadVerses,bestVerse,ROOT}=require('../match.js');
const BOOK=9632,URL='https://shamela.ws/book/'+BOOK;
const AR='٠١٢٣٤٥٦٧٨٩';const ar2n=s=>+String(s).replace(/[٠-٩]/g,d=>AR.indexOf(d));
const clean=s=>s.replace(/<a href="#[^"]*" class="btn_tag[^]*?<\/a>/g,'').replace(/<span[^>]*anchor[^>]*><\/span>/g,'');
const strip=s=>s.replace(/\r/g,'').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/[ \t]+/g,' ').trim();(async()=>{
  const {book,verses}=loadVerses('tuhfa');
  const out=verses.map(()=>null),log=[];
  let pending=[];// heading notes waiting for the next verse
  for(let p=1;p<=8;p++){
    const j=await shamelaPage(BOOK,p,'tuhfa');const nass=clean(j.nass);
    const [body,ham='']=nass.split(/<hr\s*\/?>/);
    // footnotes of this page
    const notes={};let cur=null;
    for(const ln of strip(ham).split('\n')){const m=ln.match(/^\(([٠-٩0-9]+)\)\s*(.*)$/);
      if(m){cur=ar2n(m[1]);notes[cur]=m[2].trim()}else if(cur&&ln.trim())notes[cur]+='\n\n'+ln.trim()}
    const paras=[...body.matchAll(/<p[^>]*>([^]*?)<\/p>/g)].map(m=>strip(m[1]));
    let lastIdx=-1;
    for(const para of paras){
      const marks=[...para.matchAll(/\(([٠-٩]+)\)/g)].map(m=>ar2n(m[1])).filter(n=>notes[n]);
      const isVerse=para.includes('...');
      if(isVerse){const b=bestVerse(verses,para.replace(/\([٠-٩]+\)/g,''),{});
        if(b.score<0.6)log.push(`LOW match ${b.score.toFixed(2)} p${p}: ${para}`);
        lastIdx=b.i;
        const texts=[...pending.map(x=>x.t)];const refs=pending.map(x=>x.p);pending=[];
        for(const n of marks)texts.push(notes[n]);
        if(texts.length){
          if(out[b.i])log.push('DUP verse '+(b.i+1));
          out[b.i]={t:texts.join('\n\n'),ref:'ص'+j.pageNum,url:`${URL}/${p}`};
          log.push(`v${b.i+1} <- p${p} notes ${marks.join(',')}${refs.length?' (+heading note)':''}`)}
      }else if(marks.length){for(const n of marks)pending.push({t:notes[n],p});log.push(`heading note p${p}: ${para}`)}
    }
  }
  if(pending.length)log.push('UNUSED heading notes: '+pending.length);
  const res={name:'تحفة الأطفال والغلمان، مذيلة بشرح وجيز يحل المشكل من معانيها',author:'علي محمد الضباع',death:'١٣٨٠هـ',url:URL,v:out};
  fs.mkdirSync(path.join(ROOT,'data','sharh'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'data','sharh',book.key+'.json'),JSON.stringify(res));
  fs.writeFileSync(path.join(__dirname,'build.log'),log.join('\n'));
  console.log(log.join('\n'));console.log('covered',out.filter(Boolean).length,'/',out.length);
})();
