// Polite cached fetcher for building Riyad as-Salihin data. Raw downloads go to tools/riyad-cache/ (git-ignored).
// usage: node tools/riyad-fetch.js shamela140 | sunnah | quran <keysfile> | tafsir <keysfile>
const https=require('https'),fs=require('fs'),path=require('path');
const CACHE=path.join(__dirname,'riyad-cache');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function get(u){return new Promise((ok,no)=>{const q=https.get(u,{headers:{'User-Agent':'Mozilla/5.0 (miyeea builder; polite)'},timeout:30000},r=>{
  if(r.statusCode>=300&&r.statusCode<400&&r.headers.location){r.resume();return get(new URL(r.headers.location,u).href).then(ok,no)}
  const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok({status:r.statusCode,body:Buffer.concat(b).toString('utf8')}))});q.on('error',no);q.on('timeout',()=>q.destroy(new Error('timeout')))})}
async function fetchCached(u,file,{delay=500,okStatus=[200]}={}){
  file=path.join(CACHE,file);if(fs.existsSync(file))return fs.readFileSync(file,'utf8');
  fs.mkdirSync(path.dirname(file),{recursive:true});
  for(let a=1;a<=5;a++){try{const r=await get(u);await sleep(delay);
      if(r.status===404){fs.writeFileSync(file,'');return ''}
      if(okStatus.includes(r.status)){fs.writeFileSync(file,r.body);return r.body}
      throw new Error('HTTP '+r.status)}
    catch(e){console.error('retry',a,u,e.message);await sleep(2000*a)}}
  throw new Error('failed '+u);
}
module.exports={fetchCached,CACHE};
if(require.main===module)(async()=>{
  const [what,arg]=process.argv.slice(2);
  if(what==='shamela140'){for(let p=1;;p++){const b=await fetchCached(`https://shamela.ws/book/140/${p}`,`shamela140/${p}.html`,{delay:400});if(!b||/404 Page Not Found/.test(b.slice(0,3000))){console.log('end at',p);break}if(p%100===0)console.log('page',p)}}
  else if(what==='sunnah'){for(let b=1;b<=20;b++){await fetchCached(`https://sunnah.com/riyadussalihin/${b}`,`sunnah/book${b}.html`,{delay:800});console.log('book',b)}
    await fetchCached('https://sunnah.com/riyadussalihin/introduction','sunnah/introduction.html',{delay:800})}
  else if(what==='quran'){const keys=JSON.parse(fs.readFileSync(arg,'utf8'));for(const k of keys){const [s,a]=k.split(':');
      await fetchCached(`https://api.quran.com/api/v4/verses/by_key/${k}?fields=text_uthmani,text_imlaei`,`quran/${s}_${a}.json`,{delay:250})}}
  else if(what==='tafsir'){const keys=JSON.parse(fs.readFileSync(arg,'utf8'));for(const k of keys){const [s,a]=k.split(':');
      await fetchCached(`https://api.quran.com/api/v4/tafsirs/14/by_ayah/${k}`,`tafsir14/${s}_${a}.json`,{delay:300})}}
})().catch(e=>{console.error(e);process.exit(1)});
