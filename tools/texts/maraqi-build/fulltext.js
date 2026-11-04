// Dumps the full page text (main + footnotes) of the shamela commentaries as one file per book, for searching.
// usage: node fulltext.js <dir> <from> <to> <out>
const fs=require('fs'),path=require('path');const [dir,a,b,o]=process.argv.slice(2);const out=[];
for(let p=+a;p<=+b;p++){const f=path.join(dir,'p'+p+'.html');if(!fs.existsSync(f))continue;const d=fs.readFileSync(f,'utf8');
 let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
 out.push('@@ '+p+'\n'+t.split(/<p[ >]|<br\s*\/?>/).map(x=>x.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/[ \t]+/g,' ').trim()).filter(Boolean).join('\n'));}
fs.writeFileSync(o,out.join('\n')+'\n');
