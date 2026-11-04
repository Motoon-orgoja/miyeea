// Plain-text dump of a saved web page (decodes numeric entities, drops scripts/styles/tags, tatweel, zero-width chars).
// usage: node web-extract.js <in.html> > out.txt
const fs=require('fs');
let d=fs.readFileSync(process.argv[2],'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
d=d.replace(/<br\s*\/?>|<\/p>|<\/div>|<\/li>|<\/h\d>/g,'\n').replace(/<[^>]+>/g,'').replace(/&#(\d+);/g,(m,n)=>String.fromCodePoint(+n)).replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
d=d.replace(/[ـ​-‏‪-‮]/g,'').split('\n').map(s=>s.replace(/[ \t ]+/g,' ').trim()).filter(Boolean).join('\n');
process.stdout.write(d+'\n');
