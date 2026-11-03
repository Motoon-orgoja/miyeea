const fs=require('fs');const D='C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/sullam/ketabonline-23096/';
const pages=[];for(let p=1;p<=48;p++){const j=JSON.parse(fs.readFileSync(D+'p'+String(p).padStart(2,'0')+'.json','utf8'));pages.push(j.content.replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' '))}
const all=pages.map((t,i)=>t.split('\n').map(l=>({p:i+1,l:l.trim()}))).flat().filter(x=>x.l);
// appendix starts at page 41 after «بِسْمِ اللَّهِ الرَّحْمنِ الرَّحيمِ»
const start=all.findIndex(x=>x.p===41&&/^بِسْمِ اللَّهِ/.test(x.l));
const B=[],BS={};const body=[];
all.forEach((x,i)=>{const m=x.l.split(/\s*\.\.\.\s*-\s*\.\.\.\s*/);
 if(i>start){if(m.length===2)B.push([m[0].trim(),m[1].trim()]);else if(x.l.length<90&&x.l!=='-')BS[B.length+1]=x.l.replace(/^\)\s*|\s*\($/g,'').trim();}
 else if(m.length===2)body.push({p:x.p,a:m[0].trim(),b:m[1].trim()});});
console.log('B',B.length,'body quotes',body.length);console.log(BS);
fs.writeFileSync('sullam-B.json',JSON.stringify({B,BS,body},null,1));
