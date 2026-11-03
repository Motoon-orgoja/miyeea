// usage: node fetch.js <book> <from> <to> <outdir>
const https=require('https'),fs=require('fs'),path=require('path');
const [b,from,to,out]=process.argv.slice(2);
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{const x=[];r.on('data',c=>x.push(c));r.on('end',()=>ok(Buffer.concat(x).toString('utf8')))}).on('error',no));
(async()=>{for(let p=+from;p<=+to;p++){const f=path.join(out,p+'.html');if(fs.existsSync(f))continue;let d;for(let t=0;t<4;t++){try{d=await get(`https://shamela.ws/book/${b}/${p}`);if(d.includes('class="nass'))break}catch(e){}await new Promise(r=>setTimeout(r,1500))}
const i=d.indexOf('class="nass');const s=d.slice(i).split('id="appended_pages"')[0];fs.writeFileSync(f,s);}console.log('done')})();
