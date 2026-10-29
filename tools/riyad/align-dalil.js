// Locates Ibn Allan's commentary on each hadith in Dalil al-Falihin (shamela 140).
// Dalil's own printed numbers drift from the standard numbering (and are often glued to the index within the chapter,
// e.g. «١٦٩٩» = 1|699), so each hadith is matched by content: the words of the hadith vs. the words Ibn Allan quotes
// in parentheses, with the printed number only as a tie-breaker. Output tools/riyad-cache/dalil-align.json
//   {hadiths:{N:{start,end,score,printed}}, chapters:{n:{start,end}}}  (paragraph indices into dalil.json, end exclusive)
const fs=require('fs'),path=require('path');const {fold}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache');
const D=JSON.parse(fs.readFileSync(path.join(C,'dalil.json'),'utf8')).paras;
const U=JSON.parse(fs.readFileSync(path.join(C,process.argv[2]||'units-b.json'),'utf8'));
const STOP=new Set('عن وعن قال قالت رسول الله صلي عليه وسلم رضي عنه عنها عنهما النبي في من ما ان لا علي الي او ثم يا قد كان هو هي ذلك هذا الذي'.split(' '));
const toks=s=>fold(s).split(' ').filter(w=>w.length>1).map(w=>w.replace(/^و(?=..)/,''));
// hadith word sets
const H={};for(const c of U.chapters)for(const u of c.units)if(u.kind==='hadith'){(H[u.n]=H[u.n]||{ch:c.n,w:[]}).w.push(...u.segs.filter(s=>s[0]!=='takh').flatMap(s=>toks(s[1])))}
const Ns=Object.keys(H).map(Number).sort((a,b)=>a-b);
// marker paragraphs
const M=[];D.forEach((q,i)=>{if(q.mk&&q.mk.kind==='h')M.push(i)});
const B=[];D.forEach((q,i)=>{if(q.mk&&(q.mk.kind==='b'||q.mk.kind==='k'))B.push(i)});
const quoted=(i0,i1)=>{let t='';for(let i=i0;i<i1&&t.length<6000;i++){if(D[i].blk)continue;const x=D[i].t;for(const m of x.matchAll(/\(([^()]{1,400})\)/g))t+=' '+m[1]}return new Set(toks(t))};
const nextMarker=k=>k+1<M.length?M[k+1]:D.length;
const cands=num=>{const c=new Set([+num]);for(let k=1;k<num.length;k++){c.add(+num.slice(k));c.add(+num.slice(0,k))}return c};
const out={hadiths:{},chapters:{}};let p=0,miss=[],off=0;
for(const N of Ns){
  const hw=H[N].w.filter(w=>!STOP.has(w));const probe=[...new Set(hw.slice(0,40))];
  let best=null;
  for(let k=p;k<Math.min(M.length,p+12);k++){const i=M[k];const Q=quoted(i,nextMarker(k));
    let hit=0;for(const w of probe)if(Q.has(w))hit++;const sc=hit/Math.max(1,probe.length);
    const cs=cands(D[i].mk.num);const nm=cs.has(N+off)||cs.has(N);const total=sc+(cs.has(N+off)?0.25:cs.has(N)?0.1:0)-(k-p)*0.02;
    if(!best||total>best.total)best={k,total,sc,nm};}
  if(best&&(best.sc>=0.45||(best.nm&&best.sc>=0.25))){out.hadiths[N]={start:M[best.k],score:+best.sc.toFixed(2),printed:D[M[best.k]].mk.num,k:best.k};p=best.k+1;
    const cs=[...cands(D[M[best.k]].mk.num)].filter(x=>Math.abs(x-N)<=6);if(cs.length)off=cs.sort((a,b)=>Math.abs(a-N-off)-Math.abs(b-N-off))[0]-N}
  else miss.push(N);
}
// end of each passage: the next marker or the next chapter heading, whichever comes first
for(const [N,v] of Object.entries(out.hadiths)){let e=v.k+1<M.length?M[v.k+1]:D.length;const b=B.find(x=>x>v.start);if(b!=null&&b<e)e=b;v.end=e;delete v.k}
// chapter headings: the «N - باب …» paragraph closest before the chapter's first hadith passage, up to the next marker
const bs=[];D.forEach((q,i)=>{if(q.mk&&q.mk.kind==='b')bs.push([q.mk.num,i])});
const allStarts=new Set(M);
for(const c of U.chapters){const cand=bs.filter(([n])=>n===c.n).map(([,i])=>i);if(!cand.length)continue;
  const firstH=c.units.find(u=>u.kind==='hadith');const hs=firstH&&out.hadiths[firstH.n]?out.hadiths[firstH.n].start:null;
  let s=hs!=null?cand.filter(i=>i<hs).pop():cand[0];if(s==null)s=cand[0];
  let e=s+1;while(e<D.length&&!allStarts.has(e)&&!B.includes(e))e++;
  out.chapters[c.n]={start:s,end:e};}
fs.writeFileSync(path.join(C,'dalil-align.json'),JSON.stringify(out));
const weak=Object.entries(out.hadiths).filter(([,v])=>v.score<0.5).length;
console.log('hadiths matched',Object.keys(out.hadiths).length,'of',Ns.length,'weak(<0.5)',weak,'missed',miss.length,miss.slice(0,80).join(','),'| chapter headings',Object.keys(out.chapters).length);
