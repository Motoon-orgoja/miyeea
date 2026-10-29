// Polite cached fetcher for «اللباب في شرح الكتاب» (Shamela book 21496). Cache: tools/sharh-cache/qudouri/ (git-ignored).
// usage: node tools/sharh/qudouri/fetch.js [lastPage]
const https=require('https'),fs=require('fs'),path=require('path');
const CACHE=path.join(__dirname,'..','..','sharh-cache','qudouri');
const BOOK=21496;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function get(u){return new Promise((ok,no)=>{const q=https.get(u,{headers:{'User-Agent':'Mozilla/5.0 (miyeea builder; polite)'},timeout:30000},r=>{
  if(r.statusCode>=300&&r.statusCode<400&&r.headers.location){r.resume();return get(new URL(r.headers.location,u).href).then(ok,no)}
  const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok({status:r.statusCode,body:Buffer.concat(b).toString('utf8')}))});q.on('error',no);q.on('timeout',()=>q.destroy(new Error('timeout')))})}
async function fetchCached(u,file,{delay=450}={}){
  file=path.join(CACHE,file);if(fs.existsSync(file))return fs.readFileSync(file,'utf8');
  fs.mkdirSync(path.dirname(file),{recursive:true});
  for(let a=1;a<=5;a++){try{const r=await get(u);await sleep(delay);
      if(r.status===404){fs.writeFileSync(file,'');return ''}
      if(r.status===200){fs.writeFileSync(file,r.body);return r.body}
      throw new Error('HTTP '+r.status)}
    catch(e){console.error('retry',a,u,e.message);await sleep(2000*a)}}
  throw new Error('failed '+u);
}
module.exports={fetchCached,CACHE,BOOK};
if(require.main===module)(async()=>{
  const last=+(process.argv[2]||0);
  for(let p=1;;p++){if(last&&p>last)break;
    const b=await fetchCached(`https://shamela.ws/book/${BOOK}/${p}`,`${p}.html`);
    if(!b||!/class="nass/.test(b)){console.log('end at',p);if(!last)break}
    if(p%100===0)console.log('page',p)}
})().catch(e=>{console.error(e);process.exit(1)});
