// Polite cached fetcher for Ibn Daqiq al-Id's «شرح الأربعين النووية» (shamela book 11244). Cache: tools/sharh-cache/nawawi/ (git-ignored like riyad-cache).
// usage: node tools/sharh/nawawi/fetch.js
const https=require('https'),fs=require('fs'),path=require('path');
const CACHE=path.join(__dirname,'..','..','sharh-cache','nawawi');const BOOK=11244;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function get(u){return new Promise((ok,no)=>{const q=https.get(u,{headers:{'User-Agent':'Mozilla/5.0 (miyeea builder; polite)'},timeout:30000},r=>{
  if(r.statusCode>=300&&r.statusCode<400&&r.headers.location){r.resume();return get(new URL(r.headers.location,u).href).then(ok,no)}
  const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok({status:r.statusCode,body:Buffer.concat(b).toString('utf8')}))});q.on('error',no);q.on('timeout',()=>q.destroy(new Error('timeout')))})}
async function fetchCached(u,file,{delay=450,okStatus=[200]}={}){
  file=path.join(CACHE,file);if(fs.existsSync(file))return fs.readFileSync(file,'utf8');
  fs.mkdirSync(path.dirname(file),{recursive:true});
  for(let a=1;a<=5;a++){try{const r=await get(u);await sleep(delay);
      if(r.status===404){fs.writeFileSync(file,'');return ''}
      if(okStatus.includes(r.status)){fs.writeFileSync(file,r.body);return r.body}
      throw new Error('HTTP '+r.status)}
    catch(e){console.error('retry',a,u,e.message);await sleep(2000*a)}}
  throw new Error('failed '+u);
}
module.exports={fetchCached,CACHE,BOOK};
if(require.main===module)(async()=>{
  await fetchCached(`https://shamela.ws/book/${BOOK}`,`book.html`);
  for(let p=1;p<=400;p++){const b=await fetchCached(`https://shamela.ws/book/${BOOK}/${p}`,`${p}.html`);if(!b||/404 Page Not Found/.test(b.slice(0,3000))){console.log('end at',p);break}if(p%20===0)console.log('page',p)}
})().catch(e=>{console.error(e);process.exit(1)});
