// usage: node find.js "<phrase>" [files...]  -> lines whose normalized letters contain the normalized phrase (default: both commentaries)
const fs=require('fs');const N=s=>s.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^ء-ي]/g,'');
const q=N(process.argv[2]);const files=process.argv.slice(3).length?process.argv.slice(3):['nathr.full.txt','bunud.full.txt'];
for(const f of files){let pg='';fs.readFileSync(f,'utf8').split('\n').forEach(l=>{if(l.startsWith('@@'))pg=l;else if(N(l).includes(q))console.log(f.slice(0,5),pg,'|',l.length>300?l.slice(Math.max(0,l.indexOf(process.argv[2].slice(0,4))-80),300):l)})}
