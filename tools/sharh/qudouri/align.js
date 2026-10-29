// Aligns the commentary of «اللباب» (parsed.json) to our matn units (data/qudouri.js).
// 1. commentary paragraphs are joined across page breaks (a paragraph cut by the page continues on the next page);
// 2. every quoted matn phrase (<span class="c2">(…)</span>) is folded (no harakat, alif/ya/ta-marbuta normalised) and
//    searched in our matn word stream, moving forward from the previous hit (short quotes only very near it,
//    long jumps must be confirmed by the following quotes);
// 3. the commentary is first split into our chapters by its headings, quotes are searched only inside that chapter;
//    a paragraph belongs to the LAST unit it quotes (build.js cuts it where it starts quoting a new unit).
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
// score of quote q at position i: quote words found in order, each within the next 4 matn words (the commentary drops «رحمه الله» etc.)
function score(q,i){let j=i,m=0;for(const x of q){let f=-1;for(let d=0;d<=(m?3:1)&&j+d<W.length;d++)if(eq(x,W[j+d])){f=d;break}if(f>=0){m++;j+=f+1}else if(m===0&&x!==q[0])return {m:0,end:j}}return {m,end:j}}
function find(q,from,to){let best=null;for(let i=Math.max(0,from);i<Math.min(W.length,to);i++){if(!eq(q[0],W[i])&&!(q[1]&&eq(q[1],W[i+1]||'')))continue;const s=score(q,i);
    const need=q.length<=2?q.length:Math.ceil(q.length*0.75);if(s.m>=need){if(!best||s.m>best.m+1||(s.m>=best.m&&Math.abs(i-from)<Math.abs(best.i-from)&&s.m>=best.m))best={i,end:s.end,m:s.m};if(s.m===q.length)break}}return best}
const D=JSON.parse(fs.readFileSync(path.join(CACHE,'parsed.json'),'utf8')).paras;
const isHead=t=>{const v=t.replace(/^[\s\-–]+/,'').replace(/^\[(ش\s*)?/,'').replace(/[\s.\]]+$/,'').replace(/^\((.*)\)$/,'$1');return t.split(' ').length<=10&&/^(باب|كتاب)\s/.test(v)&&!/[()]/.test(v)};
// commentary stream, joined across pages
const S=[];
for(const x of D){if(x.matn||x.p<4)continue;
  const prev=S[S.length-1];
  const cont=prev&&prev.pages[prev.pages.length-1]!==x.p&&x.p===prev.pages[prev.pages.length-1]+1&&!/[.؟!]["»)]?$/.test(prev.t)&&!/^\(/.test(x.t)&&!x.head&&!prev.head&&!isHead(x.t)&&!isHead(prev.t);
  if(cont){prev.at.push(prev.t.length+1);prev.t+=' '+x.t;prev.anchors.push(...x.anchors.map(a=>({a,joined:true})));prev.pages.push(x.p);prev.refs.push(x.ref)}
  else S.push({t:x.t,head:x.head,anchors:x.anchors.map(a=>({a})),pages:[x.p],refs:[x.ref],at:[0]})}
// merge a quote cut by the page break: «(أن النبي» + «صلى الله عليه وسلم أتى سباطة)»
for(const s of S){const A=[];for(const o of s.anchors){const p=A[A.length-1];if(o.joined&&p&&!/\)\s*$/.test(p.a)&&!/^\s*\(/.test(o.a))p.a+=' '+o.a;else A.push({a:o.a})}s.anchors=A.map(o=>o.a)}
// chapter headings in the commentary («باب التيمم», «[كتاب الصلاة]», «[ش (باب الجنايات)»): pass 1 splits the commentary
// into our chapters; the headings themselves are dropped from the text
const CH0=[];UNITS.forEach((u,i)=>{if(!(u.ci in CH0))CH0[u.ci]=i});const CW0=[];WU.forEach((u,i)=>{if(!(u in CW0))CW0[u]=i});
const content=t=>fold(t).split(' ').filter(w=>w&&!/^(باب|كتاب|فصل)$/.test(w));
const ovl=(a,b)=>a.filter(x=>b.some(y=>eq(x,y)||x.replace(/ا/g,'')===y.replace(/ا/g,''))).length; // «العتق» = «العتاق»
const log=[];let ci=0;
for(let k=0;k<S.length;k++){const s=S[k];s.heading=isHead(s.t);
  if(s.heading){const hw=content(s.t);let best=null;
    for(let c=ci+(k<3?0:1);c<=Math.min(B.chapters.length-1,ci+6);c++){const tw=content(B.chapters[c].title);const o=ovl(hw,tw);
      if(o>0&&o>=Math.ceil(hw.length*0.5)&&o>=Math.ceil(tw.length*0.5)&&(!best||o>best.o))best={c,o}}
    if(best){s.chapter=ci=best.c}else{s.heading=false;log.push({k,heading:s.t,inChapter:B.chapters[ci].title})}}
  s.ci=ci}
// the matn range searched for a commentary chapter: from its first unit up to the next chapter that has a heading
const headed=[...new Set(S.filter(s=>s.heading).map(s=>s.chapter))].sort((a,b)=>a-b);
const range=c=>{const nx=headed.find(x=>x>c);return [CW0[CH0[c]],nx==null?W.length:CW0[CH0[nx]]]};
// pass 2: locate the quotes inside that range, moving forward
let cur=0,u=0,lastCi=-1,lo=0,hi=W.length;
for(let k=0;k<S.length;k++){const s=S[k];s.hits=[];
  if(s.ci!==lastCi){lastCi=s.ci;[lo,hi]=range(s.ci);cur=lo;u=CH0[s.ci]}
  if(s.heading||s.head){s.unit=null;continue}
  for(let n=0;n<s.anchors.length;n++){const q=fold(s.anchors[n]).split(' ').filter(Boolean);if(!q.length)continue;
    const L=q.length>=4?6000:q.length===3?1500:q.length===2?250:40;
    const h=find(q,Math.max(lo,cur-40),Math.min(hi,cur+L));if(!h)continue;
    // a one- or two-word quote («(في الصلاة)») may move on to a later unit only if it is that unit's opening
    const uNow=Math.max(u,...s.hits.map(x=>x.u));if(q.length<=2&&WU[h.i]>uNow&&h.i-CW0[WU[h.i]]>3){log.push({k,short:s.anchors[n],at:h.i});continue}
    if(h.i-cur>120||h.i<cur-40){ // long jump: confirm with the next quotes of this or the following paragraphs
      const nxt=[];for(let kk=k;kk<S.length&&nxt.length<4&&S[kk].ci===s.ci;kk++)for(let nn=(kk===k?n+1:0);nn<S[kk].anchors.length&&nxt.length<4;nn++){const qq=fold(S[kk].anchors[nn]).split(' ').filter(Boolean);if(qq.length>=2)nxt.push(qq)}
      const ok=nxt.filter(qq=>find(qq,h.end-10,Math.min(hi,h.end+300))).length;if(ok<Math.min(2,nxt.length)){log.push({k,rej:s.anchors[n],at:h.i,cur});continue}}
    s.hits.push({n,i:h.i,u:WU[Math.min(W.length-1,Math.max(h.i,h.end-1))],u0:WU[h.i],off:h.i-CW0[WU[h.i]]});cur=h.end}
  s.cur=cur;if(s.hits.length)u=Math.max(u,...s.hits.map(h=>h.u));s.unit=u;s.span=s.hits.length?[Math.min(...s.hits.map(h=>h.u0)),u]:null}
fs.writeFileSync(path.join(CACHE,'align.json'),JSON.stringify({units:UNITS,paras:S,rejected:log,headed}));
const got=new Set(S.filter(s=>s.unit!=null&&s.hits.length).map(s=>s.unit));
console.log('paras',S.length,'units hit',got.size,'/',UNITS.length,'chapters with heading',headed.length,'rejected',log.length);
module.exports={fold};
