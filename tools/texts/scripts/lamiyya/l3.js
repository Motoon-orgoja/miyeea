// map apparatus footnotes to verse numbers (al-Qasim edition, Shamela 344 pp.46-115)
const fs=require('fs');const D='C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/lamiyya/';
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);const res={};
for(let p=46;p<=115;p++){const s=fs.readFileSync(D+'shamela-344-p'+String(p).padStart(3,'0')+'.html','utf8');
 const t=s.replace(/<p[ >]/g,'\n').replace(/<br[^>]*>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
 const lines=t.split('\n').map(x=>x.trim()).filter(Boolean);const marks={};let cur=null;const fns={};let curfn=null;
 for(const l of lines){let m=l.match(/^([٠-٩]+) - (.*)$/);if(m){cur=toInt(m[1]);for(const x of m[2].matchAll(/\(([٠-٩]+)\)/g))marks[toInt(x[1])]=cur;continue}
  m=l.match(/^\(([٠-٩]+)\)\s*(.*)$/);if(m){curfn=toInt(m[1]);fns[curfn]=m[2];continue}
  if(curfn!=null)fns[curfn]+=' '+l; else if(cur==null){for(const x of l.matchAll(/\(([٠-٩]+)\)/g))marks[toInt(x[1])]=0}}
 for(const k in fns){const v=marks[k];(res[v]=res[v]||[]).push(fns[k].replace(/<div.*$/,'').trim())}}
fs.writeFileSync('lam-app.json',JSON.stringify(res,null,1));
const want=process.argv.slice(2).map(Number);for(const n of want)console.log('##',n,'\n  '+(res[n]||[]).map(x=>x.slice(0,230)).join('\n  '));
