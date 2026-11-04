// Downloads the nass part of every page of a Shamela book. usage: node fetch-shamela.js <book> <from> <to> <outdir> [concurrency]
const fs=require('fs'),path=require('path'),get=require('./get.js');
const [b,from,to,out,cc='6']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
let next=+from,bad=[];
async function worker(){while(next<=+to){const p=next++;const f=path.join(out,p+'.html');if(fs.existsSync(f))continue;let d='';
for(let t=0;t<5;t++){try{d=await get(`https://shamela.ws/book/${b}/${p}`);if(d.includes('class="nass'))break}catch(e){}await new Promise(r=>setTimeout(r,2000))}
const i=d.indexOf('class="nass');if(i<0){bad.push(p);continue}fs.writeFileSync(f,d.slice(i).split('id="appended_pages"')[0]);}}
Promise.all(Array.from({length:+cc},worker)).then(()=>console.log('done; missing',bad.join(',')||'none'));
