// Builds data/nawawi-sharh/<chapterId>.json + index.json from Ibn Daqiq al-Id's «شرح الأربعين النووية» (shamela 11244),
// indexed by tools/sharh/nawawi/index-pages.js. Each hadith starts on a new page with "N - عن …" (Nawawi's text, printed by the
// edition above a «ــ» line or as a plain paragraph); the commentary runs from after that text to the heading of the next hadith.
// Verbatim: only footnote markers are removed (editor footnotes below the <hr> are dropped already) and obvious typos fixed.
const fs=require('fs'),path=require('path');const {CACHE,BOOK:BID}=require('./fetch.js');
const ROOT=path.join(__dirname,'..','..','..');const OUT=path.join(ROOT,'data','nawawi-sharh');
const w={};new Function('window',fs.readFileSync(path.join(ROOT,'data','nawawi.js'),'utf8'))(w);const B=w.BOOK;
const P=JSON.parse(fs.readFileSync(path.join(CACHE,'paras.json'),'utf8'));
const toW=s=>+String(s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const SRC='شرح الأربعين النووية، لابن دقيق العيد (ت ٧٠٢هـ)';
// footnote numbers present on each page (from the editor's footnote block)
const FN={};for(const q of P)if(q.foot){FN[q.p]=new Set([...q.foot.matchAll(/(?:^|\s)([١-٩][٠-٩]?)\s/g)].map(m=>m[1]))}
function unmark(t,p){const s=FN[p];if(!s)return t;
  // a footnote marker: a 1–2 digit numeral of that page's footnotes, glued to a word/quote/bracket or standing after a quotation, not a real number (آية/رقم/باب…)
  return t.replace(/(^|[^\s٠-٩])?(\s?)([١-٩][٠-٩]?)(?![٠-٩/])/g,(m,a,sp,d,off,str)=>{
    if(!s.has(d))return m;const before=str.slice(Math.max(0,off-12),off+(a?a.length:0));
    if(/(الآية|الآيات|رقم|باب|حديث|صفحة|ص|ج|سنة)\s*$/.test(before))return m;
    if(!a&&!sp)return m; // at start of string
    if(a&&/[ء-ٰ"»\])}.،:؛!؟']/.test(a))return a; // glued marker
    if(sp&&/["»\])}]\s?$/.test(before))return a||''; // marker after a quotation/verse
    return m;});}
const FIX=[[/حكاه عن لإمام/g,'حكاه عن الإمام'],[/\{َ/g,'{'],[/ +([.،:؛])/g,'$1'],[/محرماًً/g,'محرماً'],[/والياًَ/g,'والياً'],[/[ \t]+/g,' ']];
const clean=t=>FIX.reduce((x,[a,b])=>x.replace(a,b),t).trim();
// hadith starts
const starts={};P.forEach((q,i)=>{if(q.foot)return;const m=q.t.match(/^([٠-٩]+)\s*-\s*عن/);if(m){const n=toW(m[1]);if(n>=1&&n<=42&&!(n in starts))starts[n]=i}});
const nums=Object.keys(starts).map(Number).sort((a,b)=>a-b);
const isHead=(q,next)=>q&&!q.foot&&q.p===next.p&&q.t.length<90&&!/^قوله/.test(q.t);
const JOINS=[];const stats={entries:0,missing:[],chars:0,suspects:[]};const res={};
for(let k=0;k<nums.length;k++){const n=nums[k],s=starts[n];let e=k+1<nums.length?starts[nums[k+1]]:P.length;
  if(k+1<nums.length&&isHead(P[e-1],P[e]))e--; // the edition's heading of the next hadith
  const ps=[];let lp=-1;for(let i=s+1;i<e;i++){const q=P[i];if(q.foot||q.blk||q.sep)continue;ps.push(Object.assign({},q,{first:q.p!==lp}));lp=q.p}
  // a commentary paragraph that continues across a page break: join it to the previous one (page starts mid-sentence)
  const out=[];for(const q of ps){const t=clean(unmark(q.t,q.p));if(!t)continue;
    if(n===37&&/^فانظر يا أخي/.test(t))continue; // Nawawi's own words closing hadith 37 (matn), printed here as a plain paragraph
    const prev=out[out.length-1];if(prev&&q.first&&q.p!==prev.lastP&&!/[.:؟!"»]\s*$/.test(prev.t)){JOINS.push(n+': …'+prev.t.slice(-30)+' ‖ '+t.slice(0,30));prev.t+=' '+t;prev.lastP=q.p;continue}
    out.push({t,p:q.p,pn:q.pn,lastP:q.p})}
  if(!out.length){stats.missing.push(n);continue}
  res[n]={text:out.map(o=>clean(o.t)).join('\n\n'),p0:out[0].p,pn0:out[0].pn,pn1:out[out.length-1].pn,first:out[0].t.slice(0,70)};}
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(f.endsWith('.json'))fs.unlinkSync(path.join(OUT,f));
const index=[];const report=[];
for(const ch of B.chapters){const n=+ch.id.slice(1);const r=res[n];if(!r){stats.missing.push(n);continue}
  const last=ch.units[ch.units.length-1];
  const ref=r.pn0===r.pn1?'ص'+r.pn0:'ص'+r.pn0+' إلى ص'+r.pn1;
  const obj={[last.id]:{title:'شرح الحديث '+ar(n)+(ch.units.length>1?' (المقاطع '+ar(ch.units.length)+')':''),secs:[{src:SRC,ref,url:`https://shamela.ws/book/${BID}/${r.p0}`,text:r.text}]}};
  fs.writeFileSync(path.join(OUT,ch.id+'.json'),JSON.stringify(obj));index.push(ch.id);stats.entries++;stats.chars+=r.text.length;
  for(const m of r.text.matchAll(/.{0,25}[٠-٩]+.{0,15}/g))stats.suspects.push(n+': '+m[0]);
  report.push(`${n}\t${last.id}\t${ref}\t${r.text.length}\t${r.first}`);}
fs.writeFileSync(path.join(OUT,'index.json'),JSON.stringify(index));
console.log(report.join('\n'));console.log('entries',stats.entries,'missing',stats.missing,'chars',stats.chars);
fs.writeFileSync(path.join(CACHE,'digits.txt'),stats.suspects.join('\n'));console.log(JOINS.join('\n'));console.log('digit spots',stats.suspects.length);
