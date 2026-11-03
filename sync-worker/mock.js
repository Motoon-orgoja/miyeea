// Local stand-in for the worker, for testing: node sync-worker/mock.js  (port 8787, data kept in memory)
// /s/<id> is the sync blob store; /c/<action> runs the real circles.js on an in-memory store
const http=require('http'),store=new Map();
let C=null, DB=null; import('./circles.js').then(m=>{C=m;DB=m.memory()});
http.createServer((req,res)=>{
  const cors={'Access-Control-Allow-Origin':req.headers.origin||'*','Access-Control-Allow-Methods':'GET,PUT,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if(req.method==='OPTIONS'){res.writeHead(204,cors);return res.end()}
  const b=[];req.on('data',c=>b.push(c));req.on('end',async()=>{
    if(req.url.startsWith('/c/')){const r=await C.handle(new Request('http://x'+req.url,{method:req.method,body:req.method==='POST'?Buffer.concat(b):undefined}),DB,cors);
      res.writeHead(r.status,Object.fromEntries(r.headers));return res.end(await r.text())}
    const m=req.url.match(/^\/s\/([0-9a-f]{32})$/); if(!m){res.writeHead(404,cors);return res.end()}
    if(req.method==='GET'){const v=store.get(m[1]);res.writeHead(v?200:404,cors);return res.end(v||'none')}
    store.set(m[1],Buffer.concat(b));res.writeHead(200,cors);res.end('ok');
  });
}).listen(8787,()=>console.log('mock sync on 8787'));
