// Build data/sharh/zubad.json from «غاية البيان شرح زبد ابن رسلان» لشمس الدين محمد بن أحمد الرملي (ت ١٠٠٤هـ),
// Shamela book 6136 (دار المعرفة، بيروت), pages 1–344 (printed pages 2–345).
//
// The sharh is mamzuj: the verse words run inside the commentary, often with no brackets at all (the first part of the
// book) and later as (…) quotes. We locate every verse in the running text by matching its words in order (gaps allowed
// for the commentator's interjections), searching forward from the previous verse. The commentary of a verse is the text
// from where its first quoted word starts up to where the next verse starts (cut there, verbatim; the matn words inside
// it are the commentator's own wording). When a verse's piece holds almost nothing besides the verse words (the
// commentator quotes two verses and then explains them together), the pieces are merged and the whole shared text is
// given to every verse of the group. Verses not found in the first pass are searched again between their found
// neighbours with a looser match (second pass). A verse that still cannot be found keeps null (its words are not quoted:
// the commentator skipped it or paraphrased it inside the previous verse's commentary).
//
// usage: node tools/sharh/zubad/build.js            -> data/sharh/zubad.json + build.log
//        node tools/sharh/zubad/build.js --words    -> also writes words.log: verse words that differ from the sharh's quote
//        DBG=850,851 node tools/sharh/zubad/build.js -> prints the matched sharh words of those verses
const fs=require('fs'),path=require('path');
const {shamelaPage}=require('../fetch.js');
const {loadVerses,norm,dice,ROOT}=require('../match.js');
const BOOK=6136,URL='https://shamela.ws/book/'+BOOK,PAGES=344;
const strip=s=>s.replace(/<a href="#[^"]*" class="btn_tag[^]*?<\/a>/g,'').replace(/<span[^>]*anchor[^>]*><\/span>/g,'')
  .replace(/<\/p>\s*<p[^>]*>/g,'\n\n').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ')
  .replace(/\s+٠\s+/g,' ')// stray «٠» left by the digitiser
  .replace(/\s*\([٠-٩]+\s*غَايَة الْبَيَان\)/g,'')// printer's quire signatures «(٤ غاية البيان)»
  .replace(/[\[\]]/g,'')// editorial brackets
  .replace(/\{([^{}]*)\}/g,'﴿$1﴾')// Qur'an quotations: Shamela's {…} written ﴿…﴾ as elsewhere in the app
  .replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').trim();
// a word of a verse matches a word of the sharh: exact after normalising, or close for longer words (spelling variants)
const stem=w=>w.replace(/^[وف]/,'').replace(/^(بال|كال|فال|لل|ال|ب|ل|ك)(?=...)/,'').replace(/(هما|هم|ها|ه)$/,'');
const MEMO=new Map();
const same=(a,b)=>{if(a===b)return true;const k=a+'|'+b;let r=MEMO.get(k);if(r===undefined){r=same0(a,b);MEMO.set(k,r)}return r};
const same0=(a,b)=>a===b||(a.length>=4&&b.length>=4&&dice(a,b)>=0.75)||(a.length>=3&&b.length>=3&&stem(a).length>=3&&stem(a)===stem(b));
const GAP=45,GAP2=8;// max sharh words between two consecutive verse words (short words: GAP2)
// greedy in-order match of the word list W starting at sharh token s (W[k0] must equal tok[s])
const wq=t=>t.q?1:0.8;// a word inside a (…) quote counts more
function run(T,W,k0,s,G=GAP){const hit=new Array(W.length).fill(-1);hit[k0]=s;let last=s,got=W[k0].length*wq(T[s]);
  for(let k=k0+1;k<W.length;k++){const g=W[k].length<=2?GAP2:G;for(let t=last+1;t<=last+g+1&&t<T.length;t++)if(same(W[k],T[t].n)){hit[k]=t;last=t;got+=W[k].length*wq(T[t]);break}}
  // pull every matched word as close as possible to the next matched one (the greedy pass may have taken an earlier,
  // unrelated occurrence of a common word such as «من»)
  let nx=-1;for(let k=W.length-1;k>=0;k--){if(hit[k]<0)continue;if(nx>=0){const g=W[nx].length<=2?GAP2:G;
      for(let t=hit[nx]-1;t>hit[k]&&t>=hit[nx]-g-1;t--)if(same(W[k],T[t].n)&&(T[t].q||!T[hit[k]].q)){hit[k]=t;break}}nx=k}
  const first=hit.find(h=>h>=0);
  const tot=W.reduce((x,w)=>x+w.length,0);return {hit,score:got/tot,start:first,end:last}}
function bestHemi(T,W,from,to,G=GAP){let best=null;
  for(let s=from;s<to&&s<T.length;s++)for(let k0=0;k0<Math.min(3,W.length);k0++){if(!same(W[k0],T[s].n))continue;
    const r=run(T,W,k0,s,G);r.score-=k0*0.02;if(!best||r.score>best.score+1e-9)best=r}
  return best}
(async()=>{
  const words=process.argv.includes('--words');
  const {book,verses}=loadVerses('zubad');
  // sharh text, page by page
  const pages=[];let text='';
  for(let p=1;p<=PAGES;p++){const j=await shamelaPage(BOOK,p,'zubad');const t=strip(j.nass);
    pages.push({p,num:j.pageNum,off:text.length});text+=(text?' ':'')+t;pages[pages.length-1].off=text.length-t.length}// pages joined by a space: a page break is not a paragraph break
  const pageAt=o=>{let r=pages[0];for(const g of pages)if(g.off<=o)r=g;else break;return r};
  // drop the printer's colophon at the end
  const col=text.indexOf('بِحَمْد الله تَعَالَى قد تمّ طبع');if(col>0)text=text.slice(0,col).trimEnd();
  // tokens; q = inside a (…) quote of the matn
  const T=[];{let d=0,last=0;for(const m of text.matchAll(/\S+/g)){for(const c of text.slice(last,m.index+m[0].length)){if(c==='(')d=1;else if(c===')')d=0}
    const q=d>0||m[0].endsWith(')');last=m.index+m[0].length;const n=norm(m[0]);if(n)T.push({n,o:m.index,w:m[0],q})}}
  const VW=verses.map(v=>[v[0],v[1]].map(h=>h.split(/\s+/).map(norm).filter(Boolean)));
  const log=[],found=[];let pos=0;const WIN=5000;
  for(let i=0;i<verses.length;i++){const [A,B]=VW[i];let best=null;
    // candidates for the first hemistich; each scored together with the best second hemistich after it
    const cands=[];for(let s=pos;s<pos+WIN&&s<T.length;s++)for(let k0=0;k0<Math.min(3,A.length);k0++)if(same(A[k0],T[s].n)){const r=run(T,A,k0,s);r.score-=k0*0.02;if(r.score>=0.45)cands.push(r)}
    for(const a of cands){const b=bestHemi(T,B,a.end+1,a.end+400);const sc=a.score+(b?b.score:0)-0.04*(a.start-pos)/1000;
      if(!best||sc>best.sc)best={sc,a,b}}
    // verse whose first hemistich is not quoted: try the second alone
    if(!best||best.sc<0.9){const b=bestHemi(T,B,pos,pos+WIN);if(b&&b.score>=0.7){const sc=b.score+0.2-0.04*(b.start-pos)/1000;if(!best||sc>best.sc)best={sc,a:null,b}}}
    if(!best||best.sc<0.9){found.push(null);log.push(`MISSING v${i+1} (best ${best?best.sc.toFixed(2):'-'}): ${verses[i].join(' ... ')}`);continue}
    let st=best.a?best.a.start:best.b.start;const en=best.b?best.b.end:best.a.end;
    // the match starts on an unbracketed word, but the commentator quoted the verse's opening shortly before: start there
    if(!T[st].q){const prevSt=(()=>{for(let k=found.length-1;k>=0;k--)if(found[k])return found[k].st;return -1})();
      const H=best.a?A:B,h=best.a||best.b,k1=h.hit.findIndex(x=>x>=0);
      for(let t=st-1;t>prevSt&&t>=st-150;t--)if(T[t].q&&(same(H[0],T[t].n)||same(H[k1],T[t].n))){st=t;break}}
    found.push({i,st,en,sc:best.sc,a:best.a,b:best.b});
    if(process.env.DBG&&process.env.DBG.split(',').includes(String(i+1))){const sh=h=>h?h.hit.map(x=>x<0?'∅':T[x].w+'@'+x).join(' '):'-';console.log('DBG v'+(i+1),'score',best.sc.toFixed(2),'A:',sh(best.a),'B:',sh(best.b))}
    if(best.sc<1.3)log.push(`LOW v${i+1} score ${best.sc.toFixed(2)} at ص${pageAt(T[st].o).num}: ${verses[i].join(' ... ')}  ||  ${T.slice(st,Math.min(en+1,st+40)).map(t=>t.w).join(' ')}`);
    pos=best.a?best.a.end:best.b.start+1}// the next verse is searched after this verse's first hemistich
  // keep the found verses strictly in order
  for(let i=1;i<found.length;i++){const f=found[i];if(!f)continue;let k=i-1;while(k>=0&&!found[k])k--;
    if(k>=0&&found[k].st>=f.st){log.push(`ORDER v${i+1} dropped (starts before v${k+1})`);found[i]=null}}
  // second pass for verses still missing: search only between the two found neighbours, allowing long interjections
  // (GAP 90) but requiring at least two quoted words
  for(let i=0;i<found.length;i++){if(found[i])continue;let p=i-1;while(p>=0&&!found[p])p--;let q=i+1;while(q<found.length&&!found[q])q++;
    const from=p>=0?found[p].st+1:0,to=q<found.length?found[q].st:T.length;const [A,B]=VW[i];let best=null;
    for(let s=from;s<to;s++)for(let k0=0;k0<Math.min(3,A.length);k0++)if(same(A[k0],T[s].n)){const a=run(T,A,k0,s,90);if(a.end>=to||a.score<0.4)continue;
      const b=bestHemi(T,B,a.end+1,Math.min(to,a.end+400),90);const sc=a.score+(b&&b.end<to?b.score:0);
      const nq=[...a.hit,...(b&&b.end<to?b.hit:[])].filter(h=>h>=0&&T[h].q).length;if(nq>=2&&sc>=0.8&&(!best||sc>best.sc))best={sc,a,b:b&&b.end<to?b:null}}
    if(best){found[i]={i,st:best.a.start,en:best.b?best.b.end:best.a.end,sc:best.sc,a:best.a,b:best.b};log.push(`SECOND PASS v${i+1} score ${best.sc.toFixed(2)} at ص${pageAt(T[best.a.start].o).num}: ${T.slice(best.a.start,best.a.start+30).map(t=>t.w).join(' ')}`);
      const k=log.findIndex(l=>l.startsWith('MISSING v'+(i+1)+' '));if(k>=0)log.splice(k,1)}}
  // cut points: start of the first quoted word (with an opening bracket right before it)
  // verse 1: its commentary is the whole of printed page 3 (Shamela page 2), which opens «وَالْحَمْد أَي اللَّفْظِيّ لُغَة…»
  const cutAt=f=>{if(f.i===0)return pages[1].off;let o=T[f.st].o;
    // a cut inside a (…) quote moves back to its opening bracket, so a quote is never split between two verses
    const op=text.lastIndexOf('(',o),cl=text.lastIndexOf(')',o-1);if(op>=0&&op>cl&&o-op<160)o=op;return o};
  const F=found.filter(Boolean);
  const segs=F.map((f,k)=>({vs:[f.i],a:cutAt(f),b:k+1<F.length?cutAt(F[k+1]):text.length,f}));
  // group rule: a piece with fewer than 3 words besides the verse words is explained together with the next piece
  const own=s=>{const toks=T.filter(t=>t.o>=s.a&&t.o<s.b).length;const vw=[...(s.f.a?s.f.a.hit:[]),...(s.f.b?s.f.b.hit:[])].filter(h=>h>=0&&T[h].o>=s.a&&T[h].o<s.b).length;return toks-vw};
  const groups=[];for(const s of segs){const g=groups[groups.length-1];if(g&&g.open){g.vs.push(...s.vs);g.b=s.b;g.open=own(s)<3}else groups.push({vs:[...s.vs],a:s.a,b:s.b,open:own(s)<3})}
  const out=verses.map(()=>null);
  for(const g of groups){const t=text.slice(g.a,g.b).trim();const p1=pageAt(g.a),p2=pageAt(Math.max(g.a,g.b-1));
    const ref='ص'+p1.num+(p2.num!==p1.num?'-'+p2.num:'');
    if(g.vs.length>1)log.push(`GROUP v${g.vs.map(x=>x+1).join(',')} share ${ref}`);
    for(const v of g.vs)out[v]={t,ref,url:`${URL}/${p1.p}`}}
  if(words){// verse words that the sharh quotes differently (for checking the matn's wording)
    const W=[];for(const f of F){const L=[];for(const [h,hm] of [[0,f.a],[1,f.b]]){const ws=verses[f.i][h].split(/\s+/);const nw=ws.map(norm);
      if(!hm){L.push(`(${h?'second':'first'} hemistich not quoted)`);continue}
      nw.forEach((w,k)=>{if(!w)return;const t=hm.hit[k];if(t<0)L.push(ws[k]+' ⇢ ∅');else if(T[t].n!==w)L.push(ws[k]+' ⇢ '+T[t].w)})}
      if(L.length)W.push(`${f.i+1}\t${L.join(' | ')}\t«${verses[f.i].join(' ... ')}»`)}
    fs.writeFileSync(path.join(__dirname,'words.log'),W.join('\n'))}
  const res={name:'غاية البيان شرح زبد ابن رسلان',author:'شمس الدين محمد بن أحمد الرملي',death:'١٠٠٤هـ',url:URL,v:out};
  fs.mkdirSync(path.join(ROOT,'data','sharh'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'data','sharh',book.key+'.json'),JSON.stringify(res));
  const cov=out.filter(Boolean).length;log.unshift(`covered ${cov} / ${out.length}; groups ${groups.filter(g=>g.vs.length>1).length}`);
  fs.writeFileSync(path.join(__dirname,'build.log'),log.join('\n'));
  console.log(log.filter(l=>!l.startsWith('LOW')).slice(0,60).join('\n'));console.log('LOW lines',log.filter(l=>l.startsWith('LOW')).length);
})();
