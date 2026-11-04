// Pull verse lines («a ... b») out of downloaded shamela commentary pages (footnote lines kept, page tagged «h»).
// usage: node extract-shamela.js <dir> <from> <to> <out>   -> lines «[n]\tpage\ta | b»  (n = verse number printed in the book, if any)
// Hemistichs printed separately («N - a ... . . . .» then «. . . . ... b») are joined.
const fs=require('fs'),path=require('path');
const [dir,from,to,outF]=process.argv.slice(2);
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
const DOTS=/^[\s.…]*$/;
const out=[];let pend=null;
for(let p=+from;p<=+to;p++){
  const f=path.join(dir,'p'+p+'.html');if(!fs.existsSync(f))continue;
  const d=fs.readFileSync(f,'utf8');
  let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
  t=t.replace(/<div class=['"]?hamesh/,'<p>_________<p>');
  const lines=t.split(/<p[ >]|<br\s*\/?>/).map(b=>b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'')
    .replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/[ \t]+/g,' ').trim()).filter(Boolean);
  let foot="";
  for(let l of lines){
    l=l.replace(/\s*<div$/,'');
    if(/^_+$/.test(l)){foot="h";continue;} // footnote area: kept, tagged h
    const parts=l.split(/\s*(?:\.\.\.|…)\s*/);
    if(parts.length<2||l.length>220)continue;
    let a=parts[0],b=parts.slice(1).join(' ').trim();
    let n='';const m=a.match(/^([٠-٩0-9]+)\s*[-–]\s*(.*)$/);if(m){n=toInt(m[1]);a=m[2];}
    a=a.trim();
    if(DOTS.test(b)&&!DOTS.test(a)){pend={n,p,a};continue;}           // first hemistich alone
    if(DOTS.test(a)&&!DOTS.test(b)){ if(pend){out.push([pend.n,pend.p+foot,pend.a+' | '+b.replace(/[\s.]+$/,'')]);pend=null;} else out.push([n,p+foot,'… | '+b]); continue;}
    if(DOTS.test(a)&&DOTS.test(b))continue;
    if(pend){out.push([pend.n,pend.p+foot,pend.a+' | …']);pend=null;}
    out.push([n,p+foot,a+' | '+b]);
  }
}
fs.writeFileSync(outF,out.map(x=>x.join('\t')).join('\n')+'\n');console.log('lines',out.length,'numbered',out.filter(x=>x[0]!=='').length);
