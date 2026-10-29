// Builds data/qudouri-sharh/<chapterId>.json from tools/sharh-cache/qudouri/align.json (see align.js).
// Text is the commentary of «اللباب» as Shamela gives it; only page breaks are joined, editor headings in [..]
// and footnote calls «(١)» dropped (footnotes themselves are never parsed). Stats → tools/sharh-cache/qudouri/stats.json
const fs=require('fs'),path=require('path');const {CACHE,BOOK}=require('./fetch.js');
const OUT=path.join(__dirname,'..','..','..','data','qudouri-sharh');
const {units:U,paras:P}=JSON.parse(fs.readFileSync(path.join(CACHE,'align.json'),'utf8'));
const SRC='اللباب في شرح الكتاب، لعبد الغني الميداني (ت ١٢٩٨هـ)';
const AR='٠١٢٣٤٥٦٧٨٩',ar=n=>String(n).replace(/\d/g,d=>AR[d]);
const clean=t=>t.replace(/\s*\(([٠-٩]+)\)(?=[\s.،؛:)]|$)/g,'')        // stray footnote calls, also inside a quote «(نجس (١))»
  .replace(/\s+([،؛:.!؟)\]])/g,'$1').replace(/([(\[])\s+/g,'$1').replace(/\s+/g,' ').trim();
// cut the commentary where it starts quoting the opening words of the next matn unit; a piece belongs to the last unit it quotes
const FIRST={};U.forEach((u,i)=>{if(!(u.ci in FIRST))FIRST[u.ci]=i});
// where to cut before the quote at pos: a short lead-in after a stop («وهي (واجبة)», «فذكره بقوله: (…)») goes with the quote,
// but the source tag that closes the previous sentence («… آكدة. اهـ (والسواك)», «جوهرة (…)») stays with what it closes
const TAGS=new Set('اهـ هداية جوهرة در فتح نهر بحر اختيار تصحيح مصباح صحاح مغرب زيلعي كافي ينابيع قهستاني منح مستصفى عيني إمداد سراج بدائع خانية خلاصة ذخيرة محيط معراج شرنبلالية شلبي تبيين مجتبى درر غاية إيضاح كمال الكمال مختار تتارخانية حلبي بزازية فيض ط ح'.split(' '));
function cutAt(t,pos,start){const back=t.slice(Math.max(start,pos-160),pos);
  const stop=k=>pos-back.length+k+1;
  if(/:\s*$/.test(back)){const k=back.slice(0,-2).search(/[.؛][^.؛]*$/);if(k>=0&&back.length-k<=120)return stop(k);return pos-start<=120?start:pos}
  const k=back.search(/[.،؛:][^.،؛:]*$/);if(k<0)return pos;
  const ws=back.slice(k+1).trim().split(/\s+/).filter(Boolean);
  if(ws.length===0||ws.length>3||ws.some(w=>TAGS.has(w.replace(/[.،]/g,''))))return pos;
  return stop(k)}
const by={},carry=[];let run=0;
for(const s of P){if(s.heading){if(s.chapter!=null)run=Math.max(run,FIRST[s.chapter]);continue}
  if(s.unit==null||s.head)continue;
  const pieces=[];let start=0,pu=run,pmin=null,from=0;const pos=[];
  for(let n=0;n<s.anchors.length;n++){const i=s.t.indexOf(s.anchors[n],from);pos[n]=i;if(i>=0)from=i+s.anchors[n].length}
  for(const h of s.hits){
    const nu=h.u0>run&&h.off<=25?h.u0:(h.u>run&&h.u0<h.u?h.u:-1); // a quote that runs over a unit boundary opens the later unit
    if(nu>=0&&pos[h.n]>0){const c=cutAt(s.t,pos[h.n],start);if(c>start&&s.t.slice(start,c).trim()){pieces.push({a:start,b:c,u:pu,min:pmin});start=c;pmin=null}run=nu;pu=run}
    run=Math.max(run,h.u);pu=run;pmin=pmin==null?h.u0:Math.min(pmin,h.u0)}
  pieces.push({a:start,b:s.t.length,u:pu,min:pmin});
  for(const p of pieces){let t=clean(s.t.slice(p.a,p.b));if(!t||/^ـ+$/.test(t)||/^\[[^\]]*\]\.?$/.test(t))continue;
    // pages of the piece: the paragraph may run over several pages (s.at = offset where each page's text begins)
    const ks=s.pages.map((_,k)=>k).filter(k=>s.at[k]<p.b&&(k+1>=s.at.length||s.at[k+1]>p.a));
    // a paragraph that only announces what follows («وأما حكم الحيوان فذكره بقوله:») goes with the next quote
    if(!s.hits.length&&pieces.length===1&&/:$/.test(t)){carry.push({t,refs:ks.map(k=>s.refs[k]),pages:ks.map(k=>s.pages[k])});continue}
    const pr=carry.splice(0);if(pr.length)t=pr.map(c=>c.t).concat(t).join('\n\n');
    const refs=[...pr.flatMap(c=>c.refs),...ks.map(k=>s.refs[k])],pages=[...pr.flatMap(c=>c.pages),...ks.map(k=>s.pages[k])];
    (by[p.u]=by[p.u]||[]).push({t,refs:[...new Set(refs)],pages:[...new Set(pages)],span:p.min==null?null:[p.min,p.u]})}}
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(/\.json$/.test(f))fs.unlinkSync(path.join(OUT,f));
const files={};let prevUnit=-1;const stats={entries:0,absorbed:[],unanchored:[],perChapter:{},bytes:0};
const keys=Object.keys(by).map(Number).sort((a,b)=>a-b);
for(const ui of keys){const u=U[ui],ps=by[ui];
  // the first unit of this entry: units between the previous entry and this one, quoted inside these paragraphs
  let first=ui;for(const p of ps)if(p.span&&p.span[0]<first&&p.span[0]>prevUnit&&U[p.span[0]].ci===u.ci)first=p.span[0];
  for(let k=first;k<ui;k++)stats.absorbed.push(U[k].id);
  const n=ui-first+1;
  const r0=ps[0].refs[0],r1=ps[ps.length-1].refs.slice(-1)[0];
  const ref=r0===r1?r0:r0+' إلى '+(r0.split(' ')[0]===r1.split(' ')[0]?r1.split(' ')[1]:r1);
  const e={title:n>2?'شرح الفقرة وما قبلها ('+ar(n)+' فقرات)':n===2?'شرح الفقرة والتي قبلها':'شرح الفقرة',
    secs:[{src:SRC,ref,url:`https://shamela.ws/book/${BOOK}/${ps[0].pages[0]}`,text:ps.map(p=>p.t).join('\n\n')}]};
  (files[u.cid]=files[u.cid]||{})[u.id]=e;stats.entries++;prevUnit=ui;if(!ps.some(p=>p.span))stats.unanchored.push(u.id)}
for(const [cid,o] of Object.entries(files)){const j=JSON.stringify(o);fs.writeFileSync(path.join(OUT,cid+'.json'),j);stats.bytes+=Buffer.byteLength(j)}
const chs=[...new Set(U.map(u=>u.cid))];
for(const cid of chs){const us=U.filter(u=>u.cid===cid);const got=files[cid]?Object.keys(files[cid]).length:0;stats.perChapter[cid]={units:us.length,entries:got,without:us.filter(u=>!(files[cid]||{})[u.id]).map(u=>u.id)}}
fs.writeFileSync(path.join(CACHE,'stats.json'),JSON.stringify(stats,null,1));
console.log('entries',stats.entries,'/',U.length,'chapters',Object.keys(files).length,'/',chs.length,'absorbed',stats.absorbed.length,'bytes',stats.bytes);
