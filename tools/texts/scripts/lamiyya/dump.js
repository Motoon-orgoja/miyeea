// usage: node dump.js <book> <from> <to> <outdir>  -> saves raw page html nass parts
const https=require('https'),fs=require('fs');
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok(Buffer.concat(b).toString('utf8')))}).on('error',no));
(async()=>{const [b,f,t,o]=process.argv.slice(2);fs.mkdirSync(o,{recursive:true});
for(let p=+f;p<=+t;p++){const d=await get(`https://shamela.ws/book/${b}/${p}`);
const s=d.slice(d.indexOf('class="nass')).split('id="appended_pages"')[0];
fs.writeFileSync(`${o}/shamela-${b}-p${String(p).padStart(3,'0')}.html`,s);}})();
