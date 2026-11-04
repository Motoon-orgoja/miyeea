// downloads shamela book pages into raw/tawhid/shamela<id>/<page>.html
const get=require('./get'),fs=require('fs'),path=require('path');
const [id,from,to]=process.argv.slice(2);const dir=path.join(__dirname,'../raw/tawhid/shamela'+id);fs.mkdirSync(dir,{recursive:true});
(async()=>{const q=[];for(let p=+from;p<=+to;p++)q.push(p);
await Promise.all([0,1,2,3].map(async()=>{while(q.length){const p=q.shift();const f=path.join(dir,p+'.html');if(fs.existsSync(f)&&fs.statSync(f).size>5000)continue;
for(let i=0;i<3;i++){try{const d=await get('https://shamela.ws/book/'+id+'/'+p);fs.writeFileSync(f,d);break}catch(e){}}}}));console.log('done')})();
