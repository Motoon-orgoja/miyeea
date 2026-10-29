// Local stand-in for the worker, for testing: node sync-worker/mock.js  (port 8787, data kept in memory)
const http=require('http'),store=new Map();
http.createServer((req,res)=>{
  const cors={'Access-Control-Allow-Origin':req.headers.origin||'*','Access-Control-Allow-Methods':'GET,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if(req.method==='OPTIONS'){res.writeHead(204,cors);return res.end()}
  const m=req.url.match(/^\/s\/([0-9a-f]{32})$/); if(!m){res.writeHead(404,cors);return res.end()}
  if(req.method==='GET'){const v=store.get(m[1]);res.writeHead(v?200:404,cors);return res.end(v||'none')}
  const b=[];req.on('data',c=>b.push(c));req.on('end',()=>{store.set(m[1],Buffer.concat(b));res.writeHead(200,cors);res.end('ok')});
}).listen(8787,()=>console.log('mock sync on 8787'));
