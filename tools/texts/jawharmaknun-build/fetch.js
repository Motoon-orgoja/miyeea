// usage: node fetch.js <url> <outfile>  (30s timeout)
const https=require('https'),fs=require('fs');
const get=(u,n=0)=>new Promise((ok,no)=>{const r=https.get(u,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36','Accept':'text/html,*/*'},timeout:30000},res=>{if(res.statusCode>=300&&res.statusCode<400&&res.headers.location&&n<5)return ok(get(new URL(res.headers.location,u).href,n+1));const b=[];res.on('data',c=>b.push(c));res.on('end',()=>{console.error(res.statusCode,u);ok(Buffer.concat(b))})});r.on('timeout',()=>{r.destroy(new Error('timeout'))});r.on('error',no)});
get(process.argv[2]).then(b=>fs.writeFileSync(process.argv[3],b)).catch(e=>{console.error(e.message);process.exit(1)});
