/* ---------- the day across every book ----------
   home.html loads each data/*.js and pushes its window.BOOK into BOOKS. Nothing here writes progress: it reads each page's
   saved state, works out what that page will ask for today (the same rules the engines apply), and links to it. */
const PAGE={miatmaani:'miatmaani.html',isaghuji:'isaghuji.html',sullamwusul:'sullamwusul.html',lamiyyataymiyya:'lamiyyataymiyya.html',rajab:'rajab.html',aqila:'aqila.html',sharhsunna:'sharhsunna.html',usulsunna:'usulsunna.html',kashf:'kashf.html',usulsitta:'usulsitta.html',shurut:'shurut.html',nawaqid:'nawaqid.html',shudhur:'shudhur.html',qahtaniyya:'qahtaniyya.html',dalil:'dalil.html',umdasalik:'umdasalik.html',bina:'bina.html',jawharmaknun:'jawharmaknun.html',qurra:'qurra.html',durrabahiyya:'durrabahiyya.html',adab:'adab.html',usultafsir:'usultafsir.html',lumaa:'lumaa.html',hairiyya:'hairiyya.html',wasitiyya:'wasitiyya.html',tawhid:'tawhid.html',iraqi:'iraqi.html',safariniyya:'safariniyya.html',qawaidarba:'qawaidarba.html',thalatha:'thalatha.html',maraqi:'maraqi.html',hadramiyya:'hadramiyya.html',kanz:'kanz.html',tuhfamuluk:'tuhfamuluk.html',safina:'safina.html',zad:'zad.html',risala:'risala.html',siraji:'siraji.html',akhsar:'akhsar.html',qawaidusul:'qawaidusul.html',ashmawiyya:'ashmawiyya.html',umdafiqh:'umdafiqh.html',ibnashir:'ibnashir.html',nukhba:'nukhba.html',tayyiba:'tayyiba.html',wardiyya:'wardiyya.html',qawaid:'qawaid.html',bulugh:'bulugh.html',nuridah:'nuridah.html',abushuja:'abushuja.html',imriti:'imriti.html',waraqat:'waraqat.html',mulha:'mulha.html',amali:'amali.html',jawhara:'jawhara.html',tahawiyya:'tahawiyya.html',gharami:'gharami.html',kharida:'kharida.html',zamzami:'zamzami.html',akhdari:'akhdari.html',qatr:'qatr.html',lamiyya:'lamiyya.html',sullam:'sullam.html',alfiyya:'alfiyya.html',durra:'durra.html',rahabiyya:'rahabiyya.html',umda:'umda.html',usul:'usul.html',zubad:'zubad.html',ajurrumiyya:'ajurrumiyya.html',nawawi:'nawawi.html',bayquniyya:'bayquniyya.html',tuhfa:'tuhfa.html',miyeea:'./',munajat:'munajat.html',shatibiyya:'shatibiyya.html',jazariyya:'jazariyya.html',riyad:'riyad.html',qudouri:'qudouri.html'};
const $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const dayName=d=>{try{return new Intl.DateTimeFormat(window.LANG==='en'?'en-GB':'ar-JO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
const get=k=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}};
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
const T=today();

// verse books: the current poem's ward, old-memorisation reviews due in any poem, and the weekly recitation day
function poemBook(b){
  const multi=b.poems.length>1, cur=multi?(get(b.prefix+'cur')||b.poems[0].id):b.poems[0].id;
  const all=b.poems.map(p=>({p,s:get(multi?b.lsk+':'+p.id:b.lsk)})).filter(x=>x.s);
  const r={b,started:all.length>0,tasks:[],days:new Set(),done:0,total:0,unit:'بيت'};
  b.poems.forEach(p=>r.total+=p.verses.length);
  all.forEach(({p,s})=>{
    // memorised = the verses up to s.mem plus any old-memorisation ranges
    const known=new Set(); for(let i=1;i<=Math.min(s.mem||0,p.verses.length);i++)known.add(i);
    (s.oldB||[]).forEach(c=>{for(let i=c.a;i<=c.b;i++)known.add(i)}); r.done+=known.size;
    (s.log||[]).forEach(x=>r.days.add(x.d)); (s.tasmee||[]).forEach(x=>r.days.add(x.d)); Object.keys(s.olog||{}).forEach(d=>r.days.add(d));
  });
  const c=all.find(x=>x.p.id===cur);
  if(c){const {p,s}=c, N=p.verses.length, per=s.per||2, win=Math.max(per,s.win||10), goal=s.goal||20;
    let end=s.end; if(s.day!==T&&s.done&&end<N)end=Math.min(N,end+per);
    const grow=s.grow&&s.grow.d===T&&s.day===T?s.grow.n:0, from=Math.max(s.old===false?s.start:1,end-win-grow+1), done=s.day===T&&s.done, reps=s.day===T?s.reps:0;
    r.tasks.push({k:'new',t:`ورد اليوم: الأبيات ${ar(from)}–${ar(end)}`+(multi?` من «${p.title}»`:''),sub:done?'تمّ ✓':`${ar(reps)} من ${ar(goal)} تكرار`,done,min:(end-from+1)*Math.max(0,goal-reps)*.1});
    const wd=s.wday??5;
    if(wd===new Date().getDay()&&s.mem>0){const ok=(s.tasmee||[]).some(x=>x.d===T);r.tasks.push({k:'test',t:'التسميع الأسبوعي',sub:ok?'سجّلته ✓':'اليوم موعده',done:ok,min:Math.min(30,s.mem*.15)})}
  }
  const due=all.reduce((n,{s})=>n+(s.oldB||[]).filter(x=>x.due<=T).length,0);
  if(due)r.tasks.push({k:'old',t:'مراجعة المحفوظ القديم',sub:due===1?'مقطع واحد':`${ar(due)} مقاطع`,done:false,min:all.reduce((n,{s})=>n+(s.oldB||[]).filter(x=>x.due<=T).reduce((m,x)=>m+(x.b-x.a+1)*.15,0),0)});
  else if(all.some(({s})=>s.olog&&s.olog[T]))r.tasks.push({k:'old',t:'مراجعة المحفوظ القديم',sub:'خلصتها ✓',done:true});
  return r;
}

// prose books: chapter reviews due, today's new units in the current chapter, and the daily linking recitation
// the units memorised in the chosen track (see prose-engine.js: full / matn / first)
function trackUnits(b,s,c){const t=b.tracks&&(s&&s.track||b.track)||'full';if(t==='full')return c.units;const td=Array.isArray(b.tracks)&&b.tracks.find(x=>x.k===t);if(td&&td.kinds)return c.units.filter(u=>td.kinds.includes(u.kind));const h=c.units.filter(u=>u.kind==='hadith');return t==='first'?h.filter(u=>parseInt(u.id,10)===parseInt(h[0].id,10)):h}
function proseBook(b){
  const s=get(b.lsk), W=b.unitWord||'حديث', r={b,started:!!s,tasks:[],days:new Set(),done:0,total:0,unit:W,chapters:b.chapters.length,finished:0};
  b.chapters.forEach(c=>r.total+=trackUnits(b,s,c).length);
  if(!s)return r;
  const cards=s.cards||{}, blocks=s.block?{[b.chapters[0].id]:s.block}:(s.blocks||{});
  const link=typeof s.link==='string'?{[b.chapters[0].id]:s.link}:(s.link||{}), ahead=typeof s.blockAhead==='string'?{[b.chapters[0].id]:s.blockAhead}:(s.blockAhead||{});
  b.chapters.forEach(c=>{const us=trackUnits(b,s,c),n=us.filter(u=>cards[u.id]).length; r.done+=n; if(us.length&&n===us.length)r.finished++});
  Object.entries(s.log||{}).forEach(([d,x])=>{if(x.n||x.r)r.days.add(d)});
  const cur=b.chapters.find(c=>c.id===s.cur)||b.chapters[0];
  const due=b.chapters.filter(c=>blocks[c.id]&&(blocks[c.id].due<=T||ahead[c.id]===T));
  if(due.length)r.tasks.push({k:'old',t:due.length===1?`مراجعة «${due[0].title}» كامل`:`مراجعة ${ar(due.length)} أبواب`,sub:due.length>1?due.slice(0,3).map(c=>c.title).join('، ')+(due.length>3?'…':''):'',done:false,min:due.reduce((n,c)=>n+trackUnits(b,s,c).length,0)});
  const cu=trackUnits(b,s,cur), learned=cu.filter(u=>cards[u.id]).length, left=cu.length-learned;
  const used=s.newDay===T?s.newCount:0, extra=s.extra&&s.extra.d===T?s.extra.n:0, fresh=Math.min(left,Math.max(0,(s.per||1)+extra-used));
  if(fresh)r.tasks.push({k:'new',t:`جديد: ${ar(fresh)} ${fresh===1?W:W==='فقرة'?'فقرات':'أحاديث'}`,sub:b.chapters.length>1?'من «'+cur.title+'»':'',done:false,min:fresh*5});
  else if(used&&left>=0)r.tasks.push({k:'new',t:'الجديد',sub:'حفظته ✓',done:true});
  if(left&&learned>=2){const ok=link[cur.id]===T;r.tasks.push({k:'recent',t:'الربط',sub:ok?'سمّعته ✓':`سمّع ${ar(learned)} ${W==='فقرة'?'فقرة':'وحدة'} متصلة`,done:ok,min:learned*.75})}
  return r;
}

const R=BOOKS.map(b=>b.poems?poemBook(b):proseBook(b));
const started=R.filter(r=>r.started), rest=R.filter(r=>!r.started);
// the daily ward shows only the texts the reader is working on now; paused ones wait below
const paused=k=>window.UI&&UI.isPaused(k), active=started.filter(r=>!paused(r.b.key)), held=started.filter(r=>paused(r.b.key));

/* one plan for the day across every text: each open task has a rough time; within the reader's daily minutes the
   reviews come first (old, then recent and the weekly recitation), new memorisation last — so when time is short,
   what is already memorised is kept and only the new waits. Tasks past the budget show «إذا ضل وقت». */
const BUDGET=(window.UI&&UI.prefs().dayMin)||0, ORDER_K={old:0,recent:1,test:2,new:3};
const mins=m=>ar(Math.max(1,Math.round(m)));
const pending=active.flatMap(r=>r.tasks.filter(x=>!x.done).map(x=>({r,x}))).sort((a,b)=>ORDER_K[a.x.k]-ORDER_K[b.x.k]);
const totalMin=pending.reduce((n,{x})=>n+(x.min||0),0);
if(BUDGET){let used=0; pending.forEach(({x})=>{used+=x.min||0; x.over=used>BUDGET+2})}

/* today: one quiet row per text (and the tafsir ward); a row opens to its tasks */
$('dayLbl').textContent=dayName(T);
const list=$('todayList'); let open=0;
const KIND={new:'جديد',recent:'قريب',old:'قديم',test:'تسميع'};
const row=(title,state,done)=>{const s=el('summary');s.append(el('i','tdot'+(done?' ok':''),done?'✓':''),el('b','',title),el('small','',state));return s};
// the tafsir ward, when the reader has a plan
const TFS=get('mutoon_tafsir_v1');
if(TFS&&TFS.set!==false){const done=TFS.day===T&&TFS.done, a=el('a','trow');a.href='tafsir.html';
  a.append(row('ورد التفسير',done?'قرأته':TFS.day===T&&TFS.lbl?TFS.lbl:'بانتظارك',done));list.append(a);if(!done)open++}
// a text with nothing asked of it today stays out of the list (it is still counted in the statistics)
active.filter(r=>r.tasks.length).forEach(r=>{
  const pend=r.tasks.filter(x=>!x.done), m=pend.reduce((n,x)=>n+(x.min||0),0); open+=pend.length;
  const d=el('details','trow'+(pend.length?'':' done'));
  d.append(row(r.b.title,pend.length?(pend.length===1?pend[0].t.replace(/^ورد اليوم: /,''):'باقي '+ar(pend.length))+(m?' · '+mins(m)+' د':''):r.tasks.length?'خلصت':'ما في شي اليوم',!pend.length));
  const ul=el('ul','tasks');
  r.tasks.forEach(x=>{const li=el('li',x.done?'done':x.over?'over':'');if(x.k)li.append(el('em','k-'+x.k,KIND[x.k]));li.append(el('span','',x.t));
    const sub=[x.sub,!x.done&&x.min?(x.over?'إذا ضل وقت · ':'')+'⏱ '+mins(x.min)+' د':''].filter(Boolean).join(' · ');if(sub)li.append(el('small','',sub));ul.append(li)});
  const go=el('a','btn'+(pend.length?' primary':''),pend.length?'افتح وكمّل':'افتحه'); go.href=PAGE[r.b.key];
  d.append(ul,go); list.append(d);
});
const sum=$('todaySum');
sum.textContent=!started.length&&!list.children.length?'لسا ما بلّشت بأي متن. اختر متن من «المتون» فوق وابدأ فيه.':!active.length&&!list.children.length?'كل متونك موقوفة.':open?`باقي عليك ${ar(open)} ${open===1?'مهمة':'مهام'}`+(totalMin?` · تقريبًا ${mins(totalMin)} دقيقة`:''):'ما شاء الله، خلصت ورد اليوم 🤍';
sum.classList.toggle('ok',!open&&list.children.length>0);
// the daily time: a small button, its choices in a sheet; a word only when today asks for more than that
if(active.length){
  const tb=el('button','tbtn',BUDGET?'⏱ '+ar(BUDGET)+' د':'⏱ وقتي');tb.type='button';
  tb.onclick=()=>{const b=UI.sheet('وقتي اليومي للحفظ');b.append(el('p','note','إذا حددت وقت، بنقدّم المراجعة على الجديد، وبنعلّم اللي ما بيلحق بـ«إذا ضل وقت».'));
    const r=el('div','dayopts');[[0,'مفتوح'],[15,'١٥ د'],[30,'٣٠ د'],[45,'٤٥ د'],[60,'ساعة'],[90,'ساعة ونص']].forEach(([v,t])=>{const c=el('button','chip'+(BUDGET===v?' on':''),t);c.type='button';
      c.onclick=()=>{UI.setPref('dayMin',v);location.reload()};r.append(c)});b.append(r)};
  $('todayHead').append(tb);
  if(BUDGET&&totalMin>BUDGET+2)sum.after(el('div','note tover',`ورد اليوم أطول من وقتك، فابدأ بالمراجعة وأجّل الجديد إذا ما ضل وقت.`));
}

/* paused texts: folded; one tap brings each back to the ward */
if(held.length){const box=el('details','held');box.append(el('summary','','متون موقوفة · '+ar(held.length)));
  held.forEach(r=>{const row=el('div','ui-book paused');const a=el('a','ui-book-link');a.href=PAGE[r.b.key];a.append(el('b','',r.b.title),el('small','',ar(r.done)+' من '+ar(r.total)));
    const t=el('button','ui-switch','فعّله');t.type='button';t.onclick=()=>{UI.setPaused(r.b.key,false);location.reload()};row.append(a,t);box.append(row)});
  list.after(box)}

/* statistics: three numbers; the rest (per-book progress, twelve weeks) folded */
const days=new Set(); started.forEach(r=>r.days.forEach(d=>days.add(d)));
let streak=0, d=days.has(T)?T:addDays(T,-1); while(days.has(d)){streak++;d=addDays(d,-1)}
let last30=0; for(let i=0;i<30;i++)if(days.has(addDays(T,-i)))last30++;
const verses=R.filter(r=>r.b.poems).reduce((n,r)=>n+r.done,0), units=R.filter(r=>!r.b.poems).reduce((n,r)=>n+r.done,0);
$('statCard').hidden=!started.length;
[[streak,'🔥 أيام ورا بعض'],[verses,'بيت محفوظ'],[units,'حديث وفقرة']].forEach(([n,l])=>{
  const t=el('div'); t.append(el('b','',ar(n)),el('small','',l)); $('tiles').append(t)});
$('d30').textContent=ar(last30)+' يوم نشاط من آخر ٣٠ يوم';
started.forEach(r=>{
  const row=el('div','pg'), top=el('div','pgh');
  top.append(el('span','',r.b.title),el('small','',`${ar(r.done)} من ${ar(r.total)} ${r.b.poems?'بيت':r.unit}`+(r.chapters>1?` · ختمت ${ar(r.finished)} باب من ${ar(r.chapters)}`:'')));
  const bar=el('div','bar'), i=el('i'); i.style.width=Math.max(r.done?1.5:0,r.done/r.total*100)+'%'; bar.append(i);
  row.append(top,bar); $('progList').append(row);
  // a finished text gets its certificate; the first time it is noticed, a toast offers it too
  if(r.total&&r.done>=r.total&&window.UI&&UI.certificate){
    const s=get(r.b.lsk), tk=r.b.tracks&&(s&&s.track||r.b.track),track=tk&&tk!=='full'?' · '+(Array.isArray(r.b.tracks)?(r.b.tracks.find(x=>x.k===tk)||{}).l:({matn:'متن الأحاديث',first:'حديث من كل باب'})[tk]||''):'';
    const what=r.b.poems?'عدد الأبيات: '+ar(r.total):(/^الحديث/.test(r.b.chapters[0].title)?'عدد الأحاديث: ':'عدد الأبواب: ')+ar(r.chapters)+track;
    const open=()=>UI.certificate({title:r.b.title,what,key:r.b.key});
    const c=el('button','btn gold','🎓 شهادة الختم'); c.type='button'; c.onclick=open; row.append(c);
    const k='ui_cert_'+r.b.key; if(!localStorage.getItem(k)){try{localStorage.setItem(k,'1')}catch(e){} setTimeout(()=>UI.toast('ما شاء الله، ختمت «'+r.b.title+'» 🤍',{label:'شهادة الختم',fn:open}),900)}
  }
});
if(!started.length)$('progList').append(el('div','empty','بيظهر هون تقدمك بكل متن.'));
// the grid runs oldest to newest, a column per week; RTL puts the newest week on the left
/* circles: my status for friends to see, and the card listing my circles */
if(window.CIRCLES&&CIRCLES.available){
  CIRCLES.setStatus({bks:Object.fromEntries(started.slice(0,40).map(r=>[r.b.key,[r.done,r.total,r.tasks.filter(x=>!x.done).length]])),s:streak,d30:last30,td:days.has(T),tf:!!(TFS&&TFS.day===T&&TFS.done),open:active.length?open:-1,v:verses,u:units,
    bk:active.slice(0,4).map(r=>[r.b.title,r.done,r.total])});
  CIRCLES.banner($('pushBar'));
  const cc=$('circleCard'); cc.hidden=false; CIRCLES.card(cc); CIRCLES.fromHash(); addEventListener('hashchange',CIRCLES.fromHash);
}
const grid=$('heat'), start=addDays(T,-7*11-((new Date(T+'T12:00:00Z').getUTCDay()+1)%7));
for(let day=start;day<=T;day=addDays(day,1)){const c=el('i',(days.has(day)?'on':'')+(day===T?' now':''));c.title=dayName(day);grid.append(c)}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
