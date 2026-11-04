// usage: node fetch.js <book> <from> <to>  — saves raw/iraqi/s<book>_<p>.html
const get=require('./get'),fs=require('fs'),path=require('path');
const [b,f,t]=process.argv.slice(2).map(Number);const dir=path.join(__dirname,'..','raw','iraqi');
(async()=>{const ps=[];for(let p=f;p<=t;p++)ps.push(p);
 const work=async()=>{while(ps.length){const p=ps.shift();const out=path.join(dir,`s${b}_${p}.html`);if(fs.existsSync(out)&&fs.statSync(out).size>5000)continue;
  for(let i=0;i<4;i++){try{const d=await get(`https://shamela.ws/book/${b}/${p}`);fs.writeFileSync(out,d);break}catch(e){await new Promise(r=>setTimeout(r,1500))}}}};
 await Promise.all([1,2,3,4,5,6].map(work));console.log('done',b)})();
