/* ---------- keeping devices in step ----------
   Every saved key gets a modification time (localStorage.setItem/removeItem are wrapped), so two copies of the
   progress can be merged key by key: the newer one wins, and a deletion is a key with a time but no value.
   Two ways to carry the progress between devices:
   - a transfer code / file (no server): importing it MERGES, so nothing newer on this device is lost;
   - linked devices (when SYNC_URL is set): a sync code made of a random secret. The server only ever sees
     an id derived from the secret and the progress encrypted with a key derived from it (AES-GCM), so it can
     neither read nor tie the data to anyone. Each device pulls on opening and pushes a moment after a change.
   The server is the small Cloudflare Worker in sync-worker/. */
(function(){
// the deployed sync-worker; empty until it is set up (a local test server can be set in localStorage.mutoon_sync_url)
const SERVER='';
const SYNC_URL=(()=>{try{return localStorage.getItem('mutoon_sync_url')||''}catch(e){return ''}})()||SERVER;
const META='mutoon_meta', LINK='mutoon_sync_link', LAST='mutoon_sync_last';
// keys that belong to this device only
const local=k=>k===META||k.startsWith('mutoon_sync')||k.startsWith('ui_')||k.startsWith('transformers');
const LS=window.localStorage, _set=Storage.prototype.setItem, _rm=Storage.prototype.removeItem;
let meta; try{meta=JSON.parse(LS.getItem(META)||'null')}catch(e){meta=null}
if(!meta){ // first run: what is already here counts as old (time 1), so anything edited anywhere later wins over it
  meta={}; for(let i=0;i<LS.length;i++){const k=LS.key(i);if(!local(k))meta[k]=1} _set.call(LS,META,JSON.stringify(meta))}
const saveMeta=()=>{try{_set.call(LS,META,JSON.stringify(meta))}catch(e){}};
let pushT=null;
function touch(k){if(local(k))return; meta[k]=Date.now(); saveMeta(); if(linked()){clearTimeout(pushT);pushT=setTimeout(()=>sync().catch(()=>{}),4000)}}
Storage.prototype.setItem=function(k,v){_set.call(this,k,v); if(this===LS)touch(String(k))};
Storage.prototype.removeItem=function(k){_rm.call(this,k); if(this===LS)touch(String(k))};

function snapshot(){const data={};for(let i=0;i<LS.length;i++){const k=LS.key(i);if(!local(k))data[k]=LS.getItem(k)}return {data,meta:{...meta}}}
// returns how many keys changed here
function merge(snap,force){
  let n=0; const rm=snap.meta||{};
  const keys=new Set([...Object.keys(rm),...Object.keys(snap.data||{})]);
  for(const k of keys){ if(local(k))continue;
    const rt=force&&!rm[k]?Date.now():(rm[k]||0), lt=meta[k]||0; if(rt<=lt)continue;
    const v=snap.data?snap.data[k]:undefined;
    if(v==null){if(LS.getItem(k)!=null){_rm.call(LS,k);n++}} else if(LS.getItem(k)!==v){_set.call(LS,k,v);n++}
    meta[k]=rt;
  }
  saveMeta(); return n;
}

/* ---------- transfer code / file ---------- */
const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s.replace(/\s+/g,'')),c=>c.charCodeAt(0));
async function pack(obj){
  const raw=new TextEncoder().encode(JSON.stringify(obj));
  if(!window.CompressionStream)return raw;
  return new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
}
async function unpack(u8,zipped){
  const raw=zipped?new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()):u8;
  return JSON.parse(new TextDecoder().decode(raw));
}
// «M2:» marks a compressed code; older codes are plain base64 JSON of {app:'mutoon-all',data}
async function exportCode(){const s=snapshot();const z=!!window.CompressionStream;return (z?'M2:':'M2u:')+b64(await pack({app:'mutoon-all',v:2,at:new Date().toISOString(),...s}))}
async function readCode(code){
  code=code.trim();
  if(code.startsWith('M2:')||code.startsWith('M2u:')){const z=code.startsWith('M2:');return unpack(unb64(code.slice(z?3:4)),z)}
  return JSON.parse(decodeURIComponent(escape(atob(code.replace(/\s+/g,'')))));
}
// an old code has no times: its texts replace this device's (as before); a new one merges
async function importCode(code){const o=await readCode(code); if(o.app!=='mutoon-all'||!o.data)throw new Error('bad'); return {n:merge(o,!o.meta),old:!o.meta}}

/* ---------- linked devices ---------- */
const linked=()=>!!(SYNC_URL&&LS.getItem(LINK));
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newSecret(){const r=crypto.getRandomValues(new Uint8Array(20));return [...r].map(b=>ALPH[b&31]).join('').match(/.{5}/g).join('-')}
const norm=c=>c.toUpperCase().replace(/[^A-Z0-9]/g,'');
async function keys(secret){
  const s=norm(secret), h=async t=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)));
  const id=[...(await h('mutoon-id:'+s)).slice(0,16)].map(b=>b.toString(16).padStart(2,'0')).join('');
  const key=await crypto.subtle.importKey('raw',await h('mutoon-key:'+s),'AES-GCM',false,['encrypt','decrypt']);
  return {id,key};
}
async function seal(key,obj){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,await pack(obj)));const out=new Uint8Array(13+ct.length);out[0]=window.CompressionStream?1:0;out.set(iv,1);out.set(ct,13);return out}
async function open(key,u8){const pt=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:u8.slice(1,13)},key,u8.slice(13)));return unpack(pt,u8[0]===1)}
let busy=null;
// pull, merge, push the merged copy; resolves to the number of keys that changed on this device
function sync(){
  if(!linked())return Promise.resolve(0);
  if(busy)return busy;
  busy=(async()=>{
    const {id,key}=await keys(LS.getItem(LINK)), url=SYNC_URL.replace(/\/$/,'')+'/s/'+id;
    let n=0; const r=await fetch(url,{cache:'no-store'});
    if(r.ok){n=merge(await open(key,new Uint8Array(await r.arrayBuffer())))} else if(r.status!==404)throw new Error('server '+r.status);
    const p=await fetch(url,{method:'PUT',body:await seal(key,snapshot()),headers:{'Content-Type':'application/octet-stream'}});
    if(!p.ok)throw new Error('server '+p.status);
    _set.call(LS,LAST,String(Date.now()));
    dispatchEvent(new CustomEvent('synced',{detail:n}));
    return n;
  })().finally(()=>{busy=null});
  return busy;
}
async function link(secret){_set.call(LS,LINK,norm(secret).match(/.{1,5}/g).join('-'));return sync()}
function unlink(){_rm.call(LS,LINK);_rm.call(LS,LAST)}
// on opening and on coming back to the app; reload when another device changed what this page shows
async function pullNow(){try{const n=await sync();if(n>0)location.reload()}catch(e){}}
if(linked()){addEventListener('load',()=>setTimeout(pullNow,300));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pullNow();else if(pushT){clearTimeout(pushT);pushT=null;sync().catch(()=>{})}})}

window.SYNC={available:!!SYNC_URL,linked,code:()=>LS.getItem(LINK)||'',last:()=>+(LS.getItem(LAST)||0),newSecret,link,unlink,sync,exportCode,importCode,readCode,snapshot,merge};
})();
