// Aligns the commentary of «اللباب» (parsed.json) to our matn units (data/qudouri.js).
// 1. commentary paragraphs are joined across page breaks (a paragraph cut by the page continues on the next page);
// 2. every quoted matn phrase (<span class="c2">(…)</span>) is folded (no harakat, alif/ya/ta-marbuta normalised) and
//    searched in our matn word stream, moving forward from the previous hit (short quotes only very near it,
//    long jumps must be confirmed by the following quotes);
// 3. a commentary paragraph belongs to the LAST unit it quotes; a paragraph without a located quote goes with the one before.
// Output: tools/sharh-cache/qudouri/align.json
const fs=require('fs'),path=require('path');const {CACHE}=require('./fetch.js');
const HAR=/[ً-ْٰـ]/g;
const fold=s=>s.replace(HAR,'').replace(/[أإآٱ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^ء-ي\s]/g,' ').replace(/\s+/g,' ').trim();
// a word compares equal with or without a leading conjunction / preposition letter و ف ب ل ك
const core=w=>w.replace(/^(و|ف)(?=..)/,'').replace(/^ال(?=..)/,'');
const eq=(a,b)=>a===b||core(a)===core(b)||a.replace(/^(و|ف|ب|ل|ك)(?=...)/,'')===b.replace(/^(و|ف|ب|ل|ك)(?=...)/,'');
function loadBook(){const w={};new Function('window',fs.readFileSync(path.join(__dirname,'..','..','..','data','qudouri.js'),'utf8'))(w);return w.BOOK}
const B=loadBook();
const W=[],WU=[],UNITS=[];
B.chapters.forEach((c,ci)=>c.units.forEach(u=>{const ui=UNITS.length;UNITS.push({id:u.id,ci,cid:c.id});
  for(const x of fold(u.segs.map(s=>s[1]).join(' ')).split(' ').filter(Boolean)){W.push(x);WU.push(ui)}}));
// score of quote q at position i: number of quote words matched in order (allowing one skipped matn word per quote word)
function score(q,i){let j=i,m=0;for(const x of q){if(j<W.length&&eq(x,W[j])){m++;j++}else if(j+1<W.length&&eq(x,W[j+1])){m++;j+=2}else if(m===0)return {m:0,end:j}}return {m,end:j}}
function find(q,from,to){let best=null;for(let i=Math.max(0,from);i<Math.min(W.length,to);i++){if(!eq(q[0],W[i])&&!(q[1]&&eq(q[1],W[i+1]||'')))continue;const s=score(q,i);
    const need=q.length<=2?q.length:Math.ceil(q.length*0.75);if(s.m>=need){if(!best||s.m>best.m+1||(s.m>=best.m&&Math.abs(i-from)<Math.abs(best.i-from)&&s.m>=best.m))best={i,end:s.end,m:s.m};if(s.m===q.length)break}}return best}
const D=JSON.parse(fs.readFileSync(path.join(CACHE,'parsed.json'),'utf8')).paras;
// commentary stream, joined across pages
const S=[];
for(const x of D){if(x.matn||x.p<4)continue;
  const prev=S[S.length-1];
  const cont=prev&&prev.pages[prev.pages.length-1]!==x.p&&x.p===prev.pages[prev.pages.length-1]+1&&!/[.؟!]["»)]?$/.test(prev.t)&&!/^\(/.test(x.t)&&!x.head&&!prev.head;
  if(cont){prev.t+=' '+x.t;prev.anchors.push(...x.anchors.map(a=>({a,joined:true})));prev.pages.push(x.p);prev.refs.push(x.ref)}
  else S.push({t:x.t,head:x.head,anchors:x.anchors.map(a=>({a})),pages:[x.p],refs:[x.ref]})}
// merge a quote cut by the page break: «(أن النبي» + «صلى الله عليه وسلم أتى سباطة)»
for(const s of S){const A=[];for(const o of s.anchors){const p=A[A.length-1];if(o.joined&&p&&!/\)\s*$/.test(p.a)&&!/^\s*\(/.test(o.a))p.a+=' '+o.a;else A.push({a:o.a})}s.anchors=A.map(o=>o.a)}
// chapter headings in the commentary («باب التيمم», «[كتاب الصلاة]»): used to sync, dropped from the text
const CH0=[];UNITS.forEach((u,i)=>{if(!(u.ci in CH0))CH0[u.ci]=i});const CW0=[];WU.forEach((u,i)=>{if(!(u in CW0))CW0[u]=i});
const content=t=>fold(t).split(' ').filter(w=>w&&!/^(باب|كتاب|فصل)$/.test(w));
const ovl=(a,b)=>a.filter(x=>b.some(y=>eq(x,y))).length;
for(const s of S){const t=s.t.replace(/^[s-–]+/,'').replace(/^[|.?]?.?$/g,'');s.heading=s.t.split(' ').length<=10&&/^(باب|كتاب)s/.test(t)&&!/[(]/.test(t)}
let cur=0;const log=[];let u=0;
for(let k=0;k<S.length;k++){const s=S[k];s.hits=[];
  if(s.heading){const ci=UNITS[u].ci;const hw=content(s.t);let best=null;
    for(let c=ci+(u===0&&k<3?0:1);c<=Math.min(B.chapters.length-1,ci+4);c++){const tw=content(B.chapters[c].title);const o=ovl(hw,tw);if(o>0&&o>=Math.ceil(hw.length*0.5)&&(!best||o>best.o))best={c,o}}
    if(best){s.chapter=best.c;if(CH0[best.c]>u){u=CH0[best.c];cur=Math.max(cur,CW0[u])}s.unit=null;continue}
    s.heading=false;log.push({k,heading:s.t})}
  if(s.head){s.unit=null;continue}
  for(let n=0;n<s.anchors.length;n++){const q=fold(s.anchors[n]).split(' ').filter(Boolean);if(!q.length)continue;
    const L=q.length>=4?6000:q.length===3?1500:q.length===2?250:40;
    const h=find(q,cur-40,cur+L);if(!h)continue;
    if(h.i-cur>300||h.i<cur-40){ // long jump: confirm with the next quotes of this or the following paragraphs
      const nxt=[];for(let kk=k;kk<S.length&&nxt.length<4;kk++)for(let nn=(kk===k?n+1:0);nn<S[kk].anchors.length&&nxt.length<4;nn++){const qq=fold(S[kk].anchors[nn]).split(' ').filter(Boolean);if(qq.length>=2)nxt.push(qq)}
      const ok=nxt.filter(qq=>find(qq,h.end-10,h.end+300)).length;if(ok<Math.min(2,nxt.length)){log.push({k,rej:s.anchors[n],at:h.i,cur});continue}}
    s.hits.push({n,i:h.i,u:WU[Math.min(W.length-1,Math.max(h.i,h.end-1))],u0:WU[h.i]});cur=h.end}
  s.cur=cur;if(s.hits.length)u=Math.max(u,...s.hits.map(h=>h.u));s.unit=u;s.span=s.hits.length?[Math.min(...s.hits.map(h=>h.u0)),u]:null}
fs.writeFileSync(path.join(CACHE,'align.json'),JSON.stringify({units:UNITS,paras:S,rejected:log}));
const got=new Set(S.filter(s=>s.unit!=null&&s.hits.length).map(s=>s.unit));
console.log('paras',S.length,'units hit',got.size,'/',UNITS.length,'last unit',UNITS[cur?WU[Math.min(cur,W.length-1)]:0].id,'rejected jumps',log.length);
module.exports={fold};
