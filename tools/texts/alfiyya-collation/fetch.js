const https=require('https'),fs=require('fs');
const [,,book,from,to,out]=process.argv;
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok([r.statusCode,Buffer.concat(b).toString('utf8')]))}).on('error',no));
(async()=>{for(let p=+from;p<=+to;p++){const f=out+'/'+String(p).padStart(3,'0')+'.html';if(fs.existsSync(f))continue;
for(let t=0;t<4;t++){try{const [s,d]=await get('https://shamela.ws/book/'+book+'/'+p);if(s===200&&d.includes('nass')){fs.writeFileSync(f,d);break}console.log('retry',p,s)}catch(e){console.log('err',p)}await new Promise(r=>setTimeout(r,1500))}}console.log('done',book)})();
