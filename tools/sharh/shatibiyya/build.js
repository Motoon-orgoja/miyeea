// Builds data/sharh/shatibiyya.json: «سراج القارئ المبتدي» (shamela 95577) matched to data/shatibiyya.js by verse text.
// usage: node tools/sharh/shatibiyya/build.js  (after fetch.js)
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','..','..');
const {paras}=require('./parse.js');const {BOOK}=require('./fetch.js');
const w={};new Function('window',fs.readFileSync(path.join(ROOT,'data/shatibiyya.js'),'utf8'))(w);
const ours=w.BOOK.poems[0].verses.map(v=>v.join(' ').replace(/<div/g,''));
const norm=s=>s.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^ء-ي]/g,'');
const grams=s=>{const m=new Map();for(let i=0;i<s.length-1;i++){const g=s.substr(i,2);m.set(g,(m.get(g)||0)+1)}return m};
function dice(a,b){let n=0,ta=0,tb=0;for(const v of a.values())ta+=v;for(const v of b.values())tb+=v;for(const [g,v] of a)if(b.has(g))n+=Math.min(v,b.get(g));return 2*n/(ta+tb||1)}
const P=paras();
const isVerse=x=>/\.\.\./.test(x.t)&&x.t.length<160&&x.t.split(/\s*\.\.\.\s*/).filter(Boolean).length===2;
const V=[];P.forEach((x,i)=>{if(isVerse(x))V.push(i)});
const og=ours.map(s=>grams(norm(s))),vg=V.map(i=>grams(norm(P[i].t)));
// monotonic alignment maximising total similarity (only pairs with sim ≥ TH count)
const TH=0.55,n=ours.length,m=V.length;
const S=[];for(let i=0;i<n;i++){S.push(new Float32Array(m));for(let j=Math.max(0,i-60);j<Math.min(m,i+60);j++)S[i][j]=dice(og[i],vg[j])}
const D=Array.from({length:n+1},()=>new Float32Array(m+1)),B=Array.from({length:n+1},()=>new Uint8Array(m+1));
for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){let best=D[i-1][j],b=1;if(D[i][j-1]>best){best=D[i][j-1];b=2}
  const s=S[i-1][j-1];if(s>=TH&&D[i-1][j-1]+s>best){best=D[i-1][j-1]+s;b=3}D[i][j]=best;B[i][j]=b}
const match=new Array(n).fill(-1);for(let i=n,j=m;i>0&&j>0;){const b=B[i][j];if(b===3){match[i-1]=j-1;i--;j--}else if(b===1)i--;else j--}
// Verses printed without the «...» marker (word split over the hemistichs) are not caught above:
// look for them at the head of a paragraph between the neighbouring matched verses, and split verse from commentary.
const nmap=t=>{let n='',idx=[];for(let k=0;k<t.length;k++){const c=norm(t[k]);if(c){n+=c;idx.push(k)}}return {n,idx}};
const anchor=new Array(n).fill(null); // {pi, cut}: verse occupies P[pi].t.slice(0,cut)
match.forEach((j,i)=>{if(j>=0)anchor[i]={pi:V[j],cut:P[V[j]].t.length}});
const recovered=[];
for(let i=0;i<n;i++){if(anchor[i])continue;
  let lo=0,hi=P.length;for(let k=i-1;k>=0;k--)if(anchor[k]){lo=anchor[k].pi+1;break}for(let k=i+1;k<n;k++)if(anchor[k]){hi=anchor[k].pi;break}
  const vn=norm(ours[i]),L=vn.length;let best=null;
  for(let pi=lo;pi<hi;pi++){const {n:pn,idx}=nmap(P[pi].t);
    for(let e=Math.max(10,L-10);e<=Math.min(pn.length,L+10);e++){const sc=dice(grams(vn),grams(pn.slice(0,e)));
      if(!best||sc>best.sc)best={sc,pi,e,idx}}}
  if(best&&best.sc>=0.8){let cut=best.idx[best.e-1]+1;const t=P[best.pi].t;while(cut<t.length&&t[cut]!==' ')cut++;
    anchor[i]={pi:best.pi,cut};recovered.push([i+1,best.sc.toFixed(2),t.slice(0,cut),t.slice(cut,cut+40)])}}
// boundaries: every anchored verse, plus sharh verses after our last verse (the 7 closing verses this edition lacks)
const lastPi=Math.max(...anchor.filter(Boolean).map(x=>x.pi));
// The commentator explains our last verse (1166) together with the following «عسى الله يدني سعيه…» (absent here) in one passage,
// so a closing verse printed directly after our last verse is not a boundary: that passage goes to 1166 (last verse of the group we have).
const trailing=V.filter(pi=>pi>lastPi);if(trailing[0]===lastPi+1)trailing.shift();
const bounds=new Set([...anchor.filter(Boolean).map(x=>x.pi),...trailing]);
const endsSentence=s=>/[.:؟!»")\]]$/.test(s);
function passage(a){const ps=[];const rest=P[a.pi].t.slice(a.cut).trim();if(rest)ps.push({...P[a.pi],t:rest});
  for(let k=a.pi+1;k<P.length&&!bounds.has(k);k++)ps.push(P[k]);if(!ps.length)return null;
  // re-join paragraphs the print broke mid-sentence; a quoted verse line stays a paragraph of its own
  const out=[];let prevVerse=false;for(const x of ps){const iv=isVerse(x);
    if(out.length&&!iv&&!prevVerse&&!endsSentence(out[out.length-1]))out[out.length-1]+=' '+x.t;else out.push(x.t);prevVerse=iv}
  return {t:out.join('\n\n'),ref:'ص'+ps[0].num,url:`https://shamela.ws/book/${BOOK}/${ps[0].page}`}}
const v=anchor.map(a=>a?passage(a):null);
const usedPi=new Set(anchor.filter(Boolean).map(x=>x.pi));
const orphan=V.filter(pi=>!usedPi.has(pi));
const out={name:'سراج القارئ المبتدي',author:'ابن القاصح العذري',death:'٨٠١هـ',url:`https://shamela.ws/book/${BOOK}`,v};
fs.mkdirSync(path.join(ROOT,'data/sharh'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'data/sharh/shatibiyya.json'),JSON.stringify(out));
const unmatched=anchor.map((a,i)=>a?0:i+1).filter(Boolean);
const weak=match.map((j,i)=>j>=0&&S[i][j]<0.75?[i+1,S[i][j].toFixed(2),ours[i],P[V[j]].t]:0).filter(Boolean);
console.log(JSON.stringify({sharhVerses:m,anchored:n-unmatched.length,withText:v.filter(Boolean).length,unmatched,recovered,
  orphans:orphan.map(pi=>[P[pi].page,P[pi].t]),weak},null,1));
console.error('skipped intro paragraphs before first verse:',V[0]);
// diagnostic: anchored verse that has an earlier, equally similar sharh verse line in the window (possible quote/real swap)
if(process.env.DUPS)match.forEach((j,i)=>{if(j<0)return;for(let k=Math.max(0,j-40);k<j;k++)if(S[i][k]>=0.85&&!usedPi.has(V[k]))console.error('dup?',i+1,P[V[k]].page,P[V[j]].page,P[V[k]].t)});
