// Checks the site before it is pushed: run `node tools/check.js` (add --quick to skip the browser part).
// 1. every script parses; every data file sets a usable BOOK; every file the pages and sw.js name exists;
//    sw.js VERSION was bumped when a cached file changed since the last commit; interface strings all have translations.
// 2. every page is opened in headless Chrome/Edge, in Arabic and in English, with the settings, search and (prose
//    books) chapter list opened too; any script error, console error or missing same-origin file fails the check.
const fs=require('fs'),path=require('path'),http=require('http'),{spawn,execSync}=require('child_process'),os=require('os');
const root=path.join(__dirname,'..'), R=p=>path.join(root,p), problems=[], warn=[];
const bad=(m)=>problems.push(m);

/* ---------- static ---------- */
const js=fs.readdirSync(root).filter(f=>f.endsWith('.js')).concat(fs.readdirSync(R('data')).filter(f=>f.endsWith('.js')).map(f=>'data/'+f));
for(const f of js){const src=fs.readFileSync(R(f),'utf8');
  if(f==='whisper-worker.js')continue; // an ES module (import from a CDN)
  try{new Function(src)}catch(e){bad(f+': '+e.message)}}
for(const f of fs.readdirSync(R('data')).filter(f=>f.endsWith('.js')&&f!=='media.js'&&!f.endsWith('-expl.js'))){
  const w={}; try{new Function('window',fs.readFileSync(R('data/'+f),'utf8'))(w)}catch(e){bad('data/'+f+': '+e.message);continue}
  const B=w.BOOK; if(!B){bad('data/'+f+': no BOOK');continue}
  if(!B.key||!B.lsk||!B.title)bad('data/'+f+': BOOK without key/lsk/title');
  const ids=new Set();
  if(B.chapters)B.chapters.forEach(c=>{if(!c.units||!c.units.length)warn.push('data/'+f+': empty chapter '+c.id);(c.units||[]).forEach(u=>{if(ids.has(u.id))bad('data/'+f+': duplicate unit id '+u.id);ids.add(u.id);if(!u.segs||!u.segs.length)bad('data/'+f+': unit without text '+u.id)})});
  else if(!B.poems&&!B.verses)bad('data/'+f+': BOOK has neither chapters nor poems');
}
const sw=fs.readFileSync(R('sw.js'),'utf8'), FILES=eval(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
FILES.filter(f=>f!=='./'&&!fs.existsSync(R(f))).forEach(f=>bad('sw.js caches a missing file: '+f));
for(const h of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
  const src=fs.readFileSync(R(h),'utf8');
  for(const m of src.matchAll(/(?:src|href)="([^"#:?]+)"/g)){const p=m[1]; if(p==='./'||/^https?:/.test(p))continue; if(!fs.existsSync(R(p)))bad(h+' links a missing file: '+p)}
  if(!FILES.includes(h))bad('sw.js does not cache '+h);
}
try{
  const changed=execSync('git diff --name-only HEAD',{cwd:root,stdio:['ignore','pipe','ignore']}).toString().split('\n').filter(Boolean);
  const head=execSync('git show HEAD:sw.js',{cwd:root,stdio:['ignore','pipe','ignore']}).toString().match(/VERSION = '([^']+)'/)[1], now=sw.match(/VERSION = '([^']+)'/)[1];
  const cached=changed.filter(f=>FILES.includes(f)&&f!=='sw.js');
  if(cached.length&&head===now)bad('cached files changed ('+cached.slice(0,4).join(', ')+') but sw.js VERSION is still '+now);
}catch(e){warn.push('git check skipped: '+e.message.split('\n')[0])}
try{
  const strings=JSON.parse(execSync('node tools/extract-ui-strings.js',{cwd:root,maxBuffer:1<<26}).toString());
  const tr=JSON.parse(fs.readFileSync(R('tools/i18n/tr.json'),'utf8')), ex=JSON.parse(fs.readFileSync(R('tools/i18n/extra.json'),'utf8'));
  const miss=strings.filter(o=>!tr[o.s]&&!ex[o.s]);
  if(miss.length)warn.push(miss.length+' interface strings without translation, e.g. '+miss.slice(0,3).map(o=>'«'+o.s.slice(0,40)+'» ('+o.c+')').join(', '));
}catch(e){warn.push('string check skipped: '+e.message.split('\n')[0])}

/* ---------- in the browser ---------- */
async function browser(){
  const exe=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
  if(!exe){warn.push('no Chrome/Edge found: browser check skipped');return}
  const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.webmanifest':'application/manifest+json'};
  const srv=http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);
    if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);s.end();return}
    s.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s)}).listen(0);
  const port=srv.address().port, base='http://127.0.0.1:'+port+'/';
  const prof=fs.mkdtempSync(path.join(os.tmpdir(),'mutoon-check-'));
  const ch=spawn(exe,['--headless=new','--remote-debugging-port=0','--user-data-dir='+prof,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:['ignore','ignore','pipe']});
  const wsUrl=await new Promise((res,rej)=>{let b='';const t=setTimeout(()=>rej(new Error('browser did not start')),20000);ch.stderr.on('data',d=>{b+=d;const m=b.match(/ws:\/\/[^\s]+/);if(m){clearTimeout(t);res(m[0])}})});
  const ws=new WebSocket(wsUrl); await new Promise(r=>ws.onopen=r);
  let id=0; const wait={}, handlers=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&wait[m.id]){wait[m.id](m);delete wait[m.id]}else handlers.forEach(h=>h(m))};
  const send=(method,params={},sessionId)=>new Promise(r=>{const i=++id;wait[i]=r;ws.send(JSON.stringify({id:i,method,params,sessionId}))});
  const {result:{targetId}}=await send('Target.createTarget',{url:'about:blank'});
  const {result:{sessionId}}=await send('Target.attachToTarget',{targetId,flatten:true});
  const S=(m,p)=>send(m,p,sessionId); let errs=[];
  handlers.push(m=>{if(m.sessionId!==sessionId)return;
    if(m.method==='Runtime.exceptionThrown')errs.push('error: '+(m.params.exceptionDetails.exception&&m.params.exceptionDetails.exception.description||m.params.exceptionDetails.text).split('\n')[0]);
    if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errs.push('console.error: '+m.params.args.map(a=>a.value||a.description||'').join(' ').slice(0,200));
    if(m.method==='Network.responseReceived'){const u=m.params.response.url;
      // a chapter or poem without commentary has no file: that 404 is expected
      if(u.startsWith(base)&&m.params.response.status>=400&&!/(-sharh|\/data\/sharh)\/[^/]+\.json$/.test(u))errs.push('missing: '+u.slice(base.length))}});
  await S('Runtime.enable'); await S('Network.enable'); await S('Page.enable');
  const go=async url=>{const done=new Promise(r=>{const h=m=>{if(m.sessionId===sessionId&&m.method==='Page.loadEventFired'){handlers.splice(handlers.indexOf(h),1);r()}};handlers.push(h)});await S('Page.navigate',{url});await done;await new Promise(r=>setTimeout(r,700))};
  const run=async expr=>{const r=await S('Runtime.evaluate',{expression:expr,awaitPromise:true});if(r.result&&r.result.exceptionDetails)errs.push('while testing: '+(r.result.exceptionDetails.exception||{}).description)};
  const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
  for(const lang of ['ar','en']){
    await go(base+'home.html'); await run(`localStorage.clear();localStorage.setItem('mutoon_prefs',JSON.stringify({lang:'${lang}'}))`);
    for(const p of pages){errs=[];await go(base+p);
      await run(`(async()=>{const w=t=>new Promise(r=>setTimeout(r,t));
        if(window.UI&&UI.openSettings){UI.openSettings();await w(150);UI.closeSheet()}
        if(window.UI&&UI.openSearch){UI.openSearch();await w(150);UI.closeSheet()}
        const c=document.getElementById('chapBtn');if(c){c.click();await w(150);c.click()}
        const go=document.getElementById('welcomeGo');if(go&&!go.closest('[hidden]')){go.click();await w(150)}})()`);
      await new Promise(r=>setTimeout(r,300));
      [...new Set(errs)].forEach(e=>bad(p+' ['+lang+'] '+e));
    }
  }
  console.log('browser: '+pages.length+' pages × 2 languages opened');
  ws.close(); ch.kill(); srv.close(); try{fs.rmSync(prof,{recursive:true,force:true})}catch(e){}
}

(async()=>{
  if(!process.argv.includes('--quick'))try{await browser()}catch(e){bad('browser check failed to run: '+e.message)}
  warn.forEach(w=>console.log('note: '+w));
  if(problems.length){problems.forEach(p=>console.log('FAIL: '+p));console.log(problems.length+' problem(s)');process.exit(1)}
  console.log('OK');
})();
