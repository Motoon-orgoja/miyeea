// usage: node ko.js <book> <from> <to> <out.json>  -> downloads ketabonline pages [{id,page,content}]
const https=require('https'),fs=require('fs');
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0',Accept:'application/json'}},r=>{const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok(Buffer.concat(b).toString('utf8')))}).on('error',no));
(async()=>{const [b,f,t,o]=process.argv.slice(2);const out=[];for(let p=+f;p<=+t;p++){const s=await get(`https://backend.ketabonline.com/api/v2/books/${b}/pages/${p}`);try{const j=JSON.parse(s);out.push({id:j.id,page:j.page,part:j.part,content:j.content})}catch(e){console.error('page',p,s.slice(0,100))}}fs.writeFileSync(o,JSON.stringify(out,null,1));console.log('pages',out.length)})();
