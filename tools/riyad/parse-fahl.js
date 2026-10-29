// Step 1: structure of the al-Fahl edition (IslamHouse .doc → Word filtered HTML → paragraphs).
// Output tools/riyad-cache/fahl-struct.json: {muq:[text], chapters:[{n,title,group,items:[{t:'h',fn,paras:[...]}|{t:'p',text}]}]}
const fs=require('fs'),path=require('path');
const C=path.join(__dirname,'..','riyad-cache');
const paras=require('./fahl-paras.js')(path.join(C,'ihdoc','fahl.htm'));
const strip=s=>s.replace(/[ً-ْٰ⟦⟧]/g,'');
const L=paras.map(p=>({c:p.c||/^\s*⟦\s*\d+\s*[-–]\s*باب/.test(p.t),t:p.t.replace(/–/g,'-')}));
// Nawawi's own preface: from «الحمد لله الواحد القهار» to the basmala before chapter 1
const i0=L.findIndex(p=>strip(p.t).startsWith('الحمد لله الواحد القهار'));
let i1=L.findIndex((p,i)=>i>i0&&p.c&&/^\d+\s*-\s*باب/.test(strip(p.t)));
const muq=L.slice(i0,i1).filter(p=>!(p.c&&/بسم الله/.test(strip(p.t)))).map(p=>p.t);
const chapters=[];let ch=null,group='',lastHead=null,pendingNum=null,kitabCount=0;
for(let i=i1;i<L.length;i++){
  const p=L[i],s=strip(p.t).trim();
  if(/فهرس/.test(s)&&p.c&&!/باب/.test(s))break;
  if(s.startsWith('مقدمة التحقيق'))break; // the table of contents at the end of the document
  if(p.c){
    if(/^\d+$/.test(s)){pendingNum=s;continue}
    let t=(pendingNum?pendingNum+' ':'')+s;pendingNum=null;
    let m;
    if((m=t.match(/^(\d+)\s*-\s*(كتاب.*)$/))){group=m[2].trim();kitabCount++;lastHead='k';continue}
    if((m=t.match(/^(\d+)\s*-\s*(باب.*)$/))||(m=t.match(/^(\d+)\s*-\s*(.*)$/))){let n=+m[1];if(chapters.length&&n!==chapters[chapters.length-1].n+1){console.log('renumber',n,'->',chapters[chapters.length-1].n+1);n=chapters[chapters.length-1].n+1}ch={n,title:m[2].trim(),titleV:p.t.replace(/^[⟦\s\d-]*/,'').replace(/⟧/g,'').trim(),group,items:[]};chapters.push(ch);lastHead='b';continue}
    if(lastHead==='k'&&ch&&ch.items.length===0&&ch.group!==group){group+=' '+s;continue}
    if(lastHead==='k'){group+=' '+s;continue}
    if(lastHead==='b'&&ch&&ch.items.length===0){ch.title+=' '+s;continue}
    // a centered line inside a chapter's body (rare): keep as text
  }
  lastHead=null;
  const m=p.t.match(/^(\d[\d ]{0,5}?)\s*[-–]\s*/);
  if(m&&!p.c){ch.items.push({t:'h',fn:+m[1].replace(/ /g,''),paras:[p.t.slice(m[0].length)]});continue}
  const last=ch.items[ch.items.length-1];
  if(last&&last.t==='h')last.paras.push(p.t);else ch.items.push({t:'p',text:p.t});
}
fs.writeFileSync(path.join(C,'fahl-struct.json'),JSON.stringify({muq,chapters},null,1));
console.log('preface paras',muq.length,'chapters',chapters.length,'kitabs',kitabCount,'hadiths',chapters.reduce((a,c)=>a+c.items.filter(x=>x.t==='h').length,0));
let prev=0;for(const c of chapters){if(c.n!==prev+1)console.log('chapter jump',prev,'->',c.n,c.title);prev=c.n}
const groups=[...new Set(chapters.map(c=>c.group))];console.log(groups);
