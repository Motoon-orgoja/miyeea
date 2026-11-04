// Dumps the text paragraphs of the raw pages (before the hamesh) one per line: <page>\t<text>. usage: node dump.js <raw dir> <from> <to>
const fs=require('fs'),path=require('path');const [dir,from,to]=process.argv.slice(2);
for(let p=+from;p<=+to;p++){const d=fs.readFileSync(path.join(dir,p+'.html'),'utf8').split('<hr')[0].split('class="hamesh"')[0];
d.split(/<p[ >]/).slice(1).forEach(h=>{h=h.split('</p>')[0].replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();if(h)console.log(p+'\t'+h)})}
