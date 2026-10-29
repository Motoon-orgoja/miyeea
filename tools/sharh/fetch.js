// Polite cached fetcher for sharh building (adapted from tools/riyad-fetch.js).
// Raw downloads go to tools/sharh-cache/<book>/ (git-ignored). >=400 ms between network requests.
//   shamelaPage(bookId, pageId, cacheDir) -> {nass, pageNum, title, nextId, prevId, pageId} (shamela.ws/ajax/pageContent)
//   ketabPage(bookId, page, part, cacheDir) -> HTML string of the rendered page (inner content of pageInView)
const https=require('https'),fs=require('fs'),path=require('path');
const CACHE=path.join(__dirname,'..','sharh-cache');
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
async function shamelaPage(book,page,dir){
  const b=await fetchCached(`https://shamela.ws/ajax/pageContent/${book}/${page}`,`${dir}/${page}.json`);
  return b?JSON.parse(b):null;
}
function ketabContent(html){
  const i=html.indexOf('pageInView:{');const j=html.indexOf('content:"',i);if(i<0||j<0)return null;
  let k=j+9,out='';while(k<html.length){const c=html[k];if(c==='\\'){out+=c+html[k+1];k+=2;continue}if(c==='"')break;out+=c;k++}
  return JSON.parse('"'+out+'"');
}
async function ketabPage(book,page,part,dir){
  const h=await fetchCached(`https://ketabonline.com/ar/books/${book}/read?part=${part}&page=${page}`,`${dir}/${part}_${page}.html`);
  return ketabContent(h);
}
module.exports={fetchCached,shamelaPage,ketabPage,ketabContent,CACHE};
