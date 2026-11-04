const https=require('https');
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return ok(get(new URL(r.headers.location,u).href));const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok(Buffer.concat(b).toString('utf8')))}).on('error',no));
module.exports=get;
if(require.main===module)get(process.argv[2]).then(t=>process.stdout.write(t));
