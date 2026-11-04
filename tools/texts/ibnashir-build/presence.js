// For each verse of <verses.txt> ("a | b" lines), checks whether each hemistich occurs (letters only, normalized) anywhere in
// the full text of Mayyara's commentary (raw/ibnashir/s14249_*.html). Prints the verses with a missing hemistich.
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..','raw','ibnashir');
const N=s=>s.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ء').replace(/[^ء-ي]/g,'');
let all='';
for(let p=1;p<=619;p++){const f=path.join(R,'s14249_'+p+'.html');if(!fs.existsSync(f))continue;const d=fs.readFileSync(f,'utf8');all+=N(d.slice(d.indexOf('class="nass')).split('id="appended_pages"')[0].replace(/<[^>]+>/g,' '));}
const V=fs.readFileSync(process.argv[2],'utf8').split('\n').filter(l=>l.includes(' | '));
let miss=0;V.forEach((v,i)=>{const h=v.split(' | ');const r=h.map(x=>all.includes(N(x)));if(!r[0]||!r[1]){miss++;console.log((i+1)+'\t'+r.map(b=>b?'+':'-').join('')+'\t'+v);}});
console.log('verses',V.length,'with a hemistich not found verbatim',miss);
