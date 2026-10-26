// One-off migration: turns the script extracted from the old single-file index.html into engine.js,
// reading the content from window.BOOK instead of hard-coded verses. Kept for reference.
const fs = require('fs');
let s = fs.readFileSync(process.argv[2], 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('nf: ' + a.slice(0, 80)); s = s.replace(a, b); };

rep("const store={get(k,d){try{const v=localStorage.getItem('mi_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('mi_'+k,JSON.stringify(v))}catch(e){}}};",
`const store={get(k,d){try{const v=localStorage.getItem(B.prefix+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(B.prefix+k,JSON.stringify(v))}catch(e){}}};

/* ---------- book: what this page memorises (a data/*.js file sets window.BOOK before this script) ----------
   A book holds one or more poems. With several, the reader orders them and memorises one at a time;
   each poem keeps its own progress under its own storage key. */
const B=window.BOOK, MULTI=B.poems.length>1;
const lskOf=id=>MULTI?B.lsk+':'+id:B.lsk;
const ORDER=(()=>{const ids=B.poems.map(p=>p.id);const o=store.get('order',ids).filter(id=>ids.includes(id));ids.forEach(id=>{if(!o.includes(id))o.push(id)});return o})();
let CUR=store.get('cur',ORDER[0]); if(!B.poems.some(p=>p.id===CUR))CUR=ORDER[0];
const P=B.poems.find(p=>p.id===CUR), V=P.verses, N=V.length, SECS=P.secs||{1:P.title};
const poemOf=id=>B.poems.find(p=>p.id===id);
function stateOf(id){try{const v=localStorage.getItem(lskOf(id));return v?JSON.parse(v):null}catch(e){return null}}
document.title='حفظ '+B.title;
document.querySelector('header h1').textContent=B.title; document.querySelector('header p').textContent=B.sub;
document.querySelectorAll('.books a').forEach(a=>{if(a.dataset.book===B.key)a.setAttribute('aria-current','page')});`);
rep("b=numIn($('allTo').value)||100; a=Math.max(1,Math.min(100,a)); b=Math.max(a,Math.min(100,b));", "b=numIn($('allTo').value)||N; a=Math.max(1,Math.min(N,a)); b=Math.max(a,Math.min(N,b));");
rep("let allRange=store.get('allRange',[1,100]);", "let allRange=store.get(MULTI?'allRange:'+CUR:'allRange',[1,N]); allRange=[Math.min(allRange[0],N),Math.min(allRange[1],N)];");
rep("store.set('allRange',allRange);", "store.set(MULTI?'allRange:'+CUR:'allRange',allRange);");
rep("if(S.done && S.end<100){S.end=Math.min(100,S.end+PER())}", "if(S.done && S.end<N){S.end=Math.min(N,S.end+PER())}");
rep("$('barM').style.width=memEnd+'%';", "$('barM').style.width=(memEnd/N*100)+'%';");
rep("$('barW').style.width=Math.max(0,e-Math.max(memEnd,f-1))+'%';", "$('barW').style.width=(Math.max(0,e-Math.max(memEnd,f-1))/N*100)+'%';");
rep("بيتًا من ١٠٠ · ورد اليوم ${ar(f)}–${ar(e)}`+(e<100?` · باقي تقريبًا ${ar(Math.ceil((100-e)/PER()))}", "بيتًا من ${ar(N)} · ورد اليوم ${ar(f)}–${ar(e)}`+(e<N?` · باقي تقريبًا ${ar(Math.ceil((N-e)/PER()))}");
rep("(e===100&&S.done?' · ختمت المنظومة':'')", "(e===N&&S.done?(MULTI?' · ختمت القصيدة':' · ختمت المنظومة'):'')");
rep("const LSK='miyeea_progress_v1';", "const LSK=lskOf(CUR);");
rep("$('exportOut').value=toCode({app:'miyeea',v:1,S});", "$('exportOut').value=toCode(MULTI?{app:B.app,v:2,order:ORDER,cur:CUR,plan:store.get('plan',null),all:Object.fromEntries(B.poems.map(p=>[p.id,p.id===CUR?S:stateOf(p.id)]).filter(x=>x[1]))}:{app:B.app,v:1,S});");
rep("title:'نسخة احتياطية · الميئية'", "title:'نسخة احتياطية · '+B.title");
rep("try{const o=fromCode($('importIn').value); if(o.app!=='miyeea'||!o.S||typeof o.S.mem!=='number')throw 0;",
  "try{const o=fromCode($('importIn').value); if(o.app!==B.app)throw 0;\n    if(MULTI){if(!o.all)throw 0; Object.entries(o.all).forEach(([id,st])=>{if(poemOf(id))localStorage.setItem(lskOf(id),JSON.stringify(st))}); if(o.order)store.set('order',o.order); if(o.cur)store.set('cur',o.cur); if(o.plan)store.set('plan',o.plan); location.reload(); return}\n    if(!o.S||typeof o.S.mem!=='number')throw 0;");
rep("const e=Math.min(100,n||per), f=$('oldIn').checked", "const e=Math.min(N,n||per), f=$('oldIn').checked");
rep("const n=Math.max(0,Math.min(100,numIn($('memIn').value)||0)), e=n||Math.min(100,per);", "const n=Math.max(0,Math.min(N,numIn($('memIn').value)||0)), e=n||Math.min(N,per);");
rep("const plan={per,goal,win,old:$('oldIn').checked,wday:+$('wdayIn').value};", "const plan={per,goal,win,old:$('oldIn').checked,wday:+$('wdayIn').value}; store.set('plan',plan);");
// the poem bar belongs to the main view
rep("['mainProg','mainTabs','foot'].forEach(id=>$(id).hidden=!main);", "['mainProg','mainTabs','foot'].forEach(id=>$(id).hidden=!main); $('poemBar').hidden=!main||!MULTI; if(!main)$('poemsCard').hidden=true;");
// per-verse commentary under each verse in the full-text tab
rep("    list.append(r);\n  });", "    list.append(r);\n    if(key==='all'&&P.sharh&&P.sharh[i]){const d=document.createElement('details');d.className='vsharh';const sm=document.createElement('summary');sm.textContent='شرح البيت';const p=document.createElement('p');p.textContent=P.sharh[i];d.append(sm,p);list.append(d)}\n  });");
rep("  [...S.log].reverse().slice(0,40)", "  renderPoems();\n  [...S.log].reverse().slice(0,40)");
// first load of a poem the reader has not started: it inherits the plan they already chose
rep("const saved=loadLocal();\nif(saved){", "let saved=loadLocal();\nif(!saved&&MULTI&&store.get('plan',null)){const pl=store.get('plan',null); saved={...S,...pl,start:1,end:Math.min(N,pl.per||2),mem:0,reps:0,day:today(),done:false,log:[],tasmee:[]}; try{localStorage.setItem(LSK,JSON.stringify(saved))}catch(e){}}\nif(saved){");

s += fs.readFileSync(__dirname + '/engine-poems.js', 'utf8');
fs.writeFileSync(process.argv[3], s);
