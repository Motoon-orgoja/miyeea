// usage: node get.js <url> [outfile]  -> fetches with UA, follows redirects
const https=require('https'),fs=require('fs');
const get=(u,n=0)=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0','Accept-Language':'ar'}},r=>{if(r.statusCode>=300&&r.statusCode<400&&r.headers.location&&n<5)return ok(get(new URL(r.headers.location,u).href,n+1));const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok([r.statusCode,Buffer.concat(b).toString('utf8')]));}).on('error',no));
get(process.argv[2]).then(([s,d])=>{if(process.argv[3])fs.writeFileSync(process.argv[3],d);else process.stdout.write(d);console.error('status',s,d.length);});
