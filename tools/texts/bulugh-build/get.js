// usage: node get.js <url> [out]  — fetch with UA, print or save
const https=require('https'),fs=require('fs');
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{if(r.statusCode>=300&&r.headers.location){return get(new URL(r.headers.location,u).href).then(ok,no)}const x=[];r.on('data',c=>x.push(c));r.on('end',()=>ok(Buffer.concat(x).toString('utf8')))}).on('error',no));
module.exports=get;
if(require.main===module)get(process.argv[2]).then(d=>{if(process.argv[3])fs.writeFileSync(process.argv[3],d);else process.stdout.write(d)});
