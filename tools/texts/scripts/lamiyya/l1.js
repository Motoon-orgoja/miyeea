const fs=require('fs');const D='C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/lamiyya/';
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
const V=[],S={},raw=[];
for(let p=30;p<=44;p++){const s=fs.readFileSync(D+'shamela-344-p'+String(p).padStart(3,'0')+'.html','utf8');
 for(const b of s.split(/<p[ >]/).slice(1)){const t=b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();if(!t)continue;
  for(const line of t.split(/s(?=[٠-٩]+ - )/)){const m=line.match(/^([٠-٩]+) - (.+)$/);
   if(m){const n=toInt(m[1]);if(n!==V.length+1)throw 'jump '+n;const h=m[2].split(/\s*…\s*/);if(h.length!==2)throw 'split '+n+m[2];V.push(h.map(x=>x.trim()))}
   else if(V.length||/باب/.test(line)){raw.push([V.length+1,line]);if(line.length<100&&!/^_+/.test(line))S[V.length+1]=line.trim()}}}}
console.log(V.length);console.log(S);fs.writeFileSync('lam-base.json',JSON.stringify({V,S},null,1));
