// Build data/sharh/jazariyya.json from «المنح الفكرية شرح المقدمة الجزرية» لملا علي القاري (ت ١٠١٤هـ),
// ketabonline book 102293 (المكتبة الشاملة الذهبية، «مقابل ومشكول ومراجع»، مكتب الرحاب).
// «الدقائق المحكمة» is not available as text on shamela.ws / ketabonline (see tools/texts/jazariyya-sharh.md).
//
// The sharh is mamzuj: it quotes the verse words in (…) one after another. We align every quote to our verses with a
// monotone Viterbi pass. The commentary of a verse starts where the commentator quotes the OPENING words of that verse
// (cut there, verbatim). When a new verse is reached by quoting its middle (no clean start), the running passage is
// treated as one block explaining several verses and goes to the last verse reached (the others stay null).
const fs=require('fs'),path=require('path');
const {load,BOOK}=require('./paras.js');
const {loadVerses,norm,dice,ROOT}=require('../match.js');
const URL='https://ketabonline.com/ar/books/'+BOOK;
const H='[\\u064B-\\u065F\\u0670]*';
// best similarity of fragment f to any window of the verse string v (exact substring = 1; tolerates reading variants)
function fuzzyIn(f,v){if(v.includes(f))return 1;if(f.length<7)return 0;let best=0;
  for(const L of [f.length-1,f.length,f.length+1])for(let i=0;i+L<=v.length;i++){const s=dice(f,v.slice(i,i+L));if(s>best)best=s}return best}
(async()=>{
  const {book,verses}=loadVerses('jazariyya');const V=verses.length;
  const vn=verses.map(v=>norm(v[0]+v[1])),v1=verses.map(v=>norm(v[0]));
  let P=await load();
  // start of the commentary proper: «إنَّ قولَه: يقولُ راجي…» (the preface before it is skipped)
  const RX=new RegExp('إ'+H+'ن'+H+'\\s*ق'+H+'و'+H+'ل'+H+'ه'+H+':\\s*ي'+H+'ق');
  const s0=P.findIndex(p=>RX.test(p.text));if(s0<0)throw new Error('start not found');
  P=P.slice(s0);P[0]={...P[0],text:P[0].text.slice(P[0].text.search(RX))};
  P=P.filter(p=>!/^\([0-9]+\)\s*تنبيه/.test(p.text));// editor footnote
  // re-join paragraphs cut by a page break (first paragraph of a page, previous one not ending a sentence)
  const isVerseLine=t=>/^\(.*\)$/.test(t)&&!/[()]/.test(t.slice(1,-1));
  {const M=[];for(const p of P){const q=M[M.length-1];
    if(q&&p.first&&!/[.:؟!]$/.test(q.text)&&!isVerseLine(q.text)&&!isVerseLine(p.text)){q.pg.push([q.text.length+1,p.page]);q.text+=' '+p.text}
    else M.push({text:p.text,pg:[[0,p.page]]})}P=M}
  const pageAt=(p,off)=>{let pg=p.pg[0][1];for(const [o,g] of p.pg)if(o<=off)pg=g;return pg};
  // reprinted-verse paragraphs = anchors (dropped from the output)
  for(const p of P){if(isVerseLine(p.text)){const t=norm(p.text);let best=-1,bs=0;vn.forEach((v,i)=>{const s=dice(t,v);if(s>bs){bs=s;best=i}});if(bs>=0.85)p.anchor=best}}
  // fragments
  const frags=[];
  P.forEach((p,pi)=>{if(p.anchor!==undefined){frags.push({pi,off:0,start:true,sc:vn.map((_,i)=>i===p.anchor?200:0)});return}
    if(pi===0)frags.push({pi,off:0,start:true,sc:vn.map((_,i)=>i===0?200:0)});
    for(const m of p.text.matchAll(/\(([^()]{2,200})\)/g)){const f=norm(m[1]);if(f.length<3)continue;
      const sc=vn.map(v=>{const s=fuzzyIn(f,v);return s>=0.8?(f.length-1)*s:0});if(sc.some(x=>x>0))frags.push({pi,off:m.index,f,sc})}});
  // Viterbi: states = verse index, nondecreasing, jump penalty per skipped verse
  const JUMP=6,F=frags.length;let dp=Float64Array.from(vn,(_,i)=>(i===0?0:-1e9)+frags[0].sc[i]);const bp=[];
  for(let f=1;f<F;f++){const nd=new Float64Array(V),b=new Int16Array(V);
    for(let i=0;i<V;i++){let m=dp[i],mj=i;for(let j=0;j<i;j++){const c=dp[j]-JUMP*(i-j);if(c>m){m=c;mj=j}}nd[i]=m+frags[f].sc[i];b[i]=mj}
    bp.push(b);dp=nd}
  let st=0;for(let i=1;i<V;i++)if(dp[i]>dp[st])st=i;
  const state=new Int16Array(F);state[F-1]=st;for(let f=F-1;f>0;f--)state[f-1]=bp[f-1][state[f]];
  // a transition takes effect at the first fragment that actually quotes the new verse
  for(let f=1;f<F;f++)if(state[f]>state[f-1]&&!(frags[f].sc[state[f]]>0)){let g=f;while(g<F&&state[g]===state[f]&&!(frags[g].sc[state[f]]>0))g++;
    if(g<F&&state[g]===state[f])for(let h=f;h<g;h++)state[h]=state[f-1]}
  // cut points: transition fragment that quotes the opening words of the new verse
  const isStart=(f,v)=>{if(f.start)return true;const a=v1[v];if(f.f.length<4)return false;return a.startsWith(f.f)||dice(f.f,a.slice(0,f.f.length))>=0.85};
  const cuts=[];// {pi,off,v}
  const log=[];
  for(let f=1;f<F;f++){if(state[f]>state[f-1]){const fr=frags[f];
    // opening word(s) written just before the quote, outside the parentheses: «وَرَقِّقَنْ (مُسْتَفِلًا مِن أحرفِ)»
    let lead=0;if(!isStart(fr,state[f])&&fr.f){const t=P[fr.pi].text,w=t.slice(Math.max(0,fr.off-40),fr.off).split(/\s+/).filter(Boolean);
      for(const n of [1,2]){if(w.length<n)break;const pre=w.slice(-n).join(' ');if(/[().:،؛]/.test(pre))break;
        if(v1[state[f]].startsWith(norm(pre)+fr.f)){lead=t.slice(0,fr.off).length-t.slice(0,fr.off).trimEnd().length+pre.length;break}}}
    // or an earlier quote (between the previous aligned quote and this one) that gives the opening words in a variant reading
    let alt=-1;if(!lead&&!isStart(fr,state[f])){const t=P[fr.pi].text,from=frags[f-1].pi===fr.pi?frags[f-1].off+1:0;
      for(const m of t.slice(0,fr.off).matchAll(/\(([^()]{2,200})\)/g)){if(m.index<from)continue;const q=norm(m[1]);
        if(q.length>=4&&dice(q,v1[state[f]].slice(0,q.length))>=0.7){alt=m.index;break}}}
    if(lead||alt>=0||isStart(fr,state[f])){let off=alt>=0?alt:fr.off-lead;const t=P[fr.pi].text;
      // back up over a short lead-in («وقولُه:», «و») to the previous sentence/clause boundary
      const before=t.slice(Math.max(0,off-30),off);const k=Math.max(before.lastIndexOf('.'),before.lastIndexOf('،'),before.lastIndexOf('؛'),before.lastIndexOf(':'));
      if(k>=0&&['','و','ثم','قوله','وقوله','وقول','قال','وقال','ثمقال'].includes(norm(before.slice(k+1))))off=off-before.length+k+1;
      cuts.push({pi:fr.pi,off,v:state[f]})}
    else log.push(`no clean start for v${state[f]+1} (quote «${fr.f}») -> grouped`)}}
  // build segments
  const segs=[];// {pi,a,b,v}
  let cur=0;
  P.forEach((p,pi)=>{const cs=cuts.filter(c=>c.pi===pi).sort((x,y)=>x.off-y.off);
    // pieces [a,b) between cut points; the max state reached inside a piece decides its verse (group rule)
    const ps=[];{let starts=[{a:0,cut:null}];for(const c of cs){if(c.off===0)starts[0].cut=c.v;else starts.push({a:c.off,cut:c.v})}
      starts.forEach((s,k)=>ps.push({a:s.a,b:k+1<starts.length?starts[k+1].a:p.text.length,cut:s.cut}))}
    for(const s of ps){if(s.cut!==null)cur=s.cut;
      const inside=frags.map((fr,f)=>[fr,state[f]]).filter(([fr])=>fr.pi===pi&&fr.off>=s.a&&fr.off<s.b).map(x=>x[1]);
      const mx=Math.max(cur,...inside);cur=mx;segs.push({pi,a:s.a,b:s.b,v:mx,anchor:p.anchor!==undefined})}});
  // headings like «بابُ اللّامَاتِ:» go with the following segment
  for(let i=segs.length-2;i>=0;i--){const s=segs[i],t=P[s.pi].text.slice(s.a,s.b).trim();if(s.a===0&&s.b===P[s.pi].text.length&&/^(باب|فصل)/.test(t)&&t.length<70)s.v=segs[i+1].v}
  for(let i=1;i<segs.length;i++)if(segs[i].v<segs[i-1].v)segs[i].v=segs[i-1].v;// monotone safety
  // assemble
  const cleanT=t=>t.replace(/\[[0-9]+\]/g,'').replace(/\{[^{}ء-ي]*\}/g,'').replace(/[{}‍]/g,'')
    // misplaced harakat of the digital text («السلام ِ؛», «رواه ُالبزار», «مكان، ٍ لا»)
    .replace(/ ([ً-ْ]+)(?=[،؛.,:])/g,'$1').replace(/ ([ً-ْ]+)(?=[ء-ي])/g,'$1 ').replace(/ [ً-ْ]+/g,'').replace(/([،؛.,:])[ً-ْ]+/g,'$1').replace(/\s+([،,.:؛])/g,'$1').replace(/\s+/g,' ').trim();
  const out=verses.map(()=>null);let lastPi=-1,lastV=-1;
  for(const s of segs){if(s.anchor)continue;const p=P[s.pi];const t=cleanT(p.text.slice(s.a,s.b));if(!t)continue;
    const pa=pageAt(p,s.a),pb=pageAt(p,s.b-1),v=s.v;
    if(!out[v])out[v]={t,_f:pa,_l:pb,url:`${URL}/read?part=1&page=${pa}`};
    else{out[v].t+=(lastPi===s.pi&&lastV===v?' ':'\n\n')+t;out[v]._l=pb}
    lastPi=s.pi;lastV=v}
  out.forEach((o,i)=>{if(o){const ref=o._f===o._l?'ص'+o._f:`ص${o._f}-${o._l}`;const r={t:o.t,ref,url:o.url};out[i]=r;log.push(`v${i+1} ${ref} ${o.t.length}ch | ${o.t.slice(0,70)}`)}else log.push(`v${i+1} NULL`)});
  const res={name:'المنح الفكرية شرح المقدمة الجزرية',author:'علي بن سلطان محمد، الملا القاري',death:'١٠١٤هـ',url:URL,v:out};
  fs.mkdirSync(path.join(ROOT,'data','sharh'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'data','sharh',book.key+'.json'),JSON.stringify(res));
  fs.writeFileSync(path.join(__dirname,'build.log'),log.join('\n'));
  console.log(log.join('\n'));console.log('frags',F,'cuts',cuts.length,'covered',out.filter(Boolean).length,'/',V);
})();
