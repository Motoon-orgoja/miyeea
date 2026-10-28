/* ---------- the day across every book ----------
   home.html loads each data/*.js and pushes its window.BOOK into BOOKS. Nothing here writes progress: it reads each page's
   saved state, works out what that page will ask for today (the same rules the engines apply), and links to it. */
const PAGE={ajurrumiyya:'ajurrumiyya.html',nawawi:'nawawi.html',bayquniyya:'bayquniyya.html',tuhfa:'tuhfa.html',miyeea:'./',munajat:'munajat.html',shatibiyya:'shatibiyya.html',jazariyya:'jazariyya.html',riyad:'riyad.html',qudouri:'qudouri.html'};
const $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const dayName=d=>{try{return new Intl.DateTimeFormat('ar-JO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
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
    r.tasks.push({k:'new',t:`ورد اليوم: الأبيات ${ar(from)}–${ar(end)}`+(multi?` من «${p.title}»`:''),sub:done?'تمّ ✓':`${ar(reps)} من ${ar(goal)} تكرار`,done});
    const wd=s.wday??5;
    if(wd===new Date().getDay()&&s.mem>0){const ok=(s.tasmee||[]).some(x=>x.d===T);r.tasks.push({k:'test',t:'التسميع الأسبوعي',sub:ok?'سجّلته ✓':'اليوم موعده',done:ok})}
  }
  const due=all.reduce((n,{s})=>n+(s.oldB||[]).filter(x=>x.due<=T).length,0);
  if(due)r.tasks.push({k:'old',t:'مراجعة المحفوظ القديم',sub:due===1?'مقطع واحد':`${ar(due)} مقاطع`,done:false});
  else if(all.some(({s})=>s.olog&&s.olog[T]))r.tasks.push({k:'old',t:'مراجعة المحفوظ القديم',sub:'خلصتها ✓',done:true});
  return r;
}

// prose books: chapter reviews due, today's new units in the current chapter, and the daily linking recitation
function proseBook(b){
  const s=get(b.lsk), W=b.unitWord||'حديث', r={b,started:!!s,tasks:[],days:new Set(),done:0,total:0,unit:W,chapters:b.chapters.length,finished:0};
  b.chapters.forEach(c=>r.total+=c.units.length);
  if(!s)return r;
  const cards=s.cards||{}, blocks=s.block?{[b.chapters[0].id]:s.block}:(s.blocks||{});
  const link=typeof s.link==='string'?{[b.chapters[0].id]:s.link}:(s.link||{}), ahead=typeof s.blockAhead==='string'?{[b.chapters[0].id]:s.blockAhead}:(s.blockAhead||{});
  b.chapters.forEach(c=>{const n=c.units.filter(u=>cards[u.id]).length; r.done+=n; if(n===c.units.length)r.finished++});
  Object.entries(s.log||{}).forEach(([d,x])=>{if(x.n||x.r)r.days.add(d)});
  const cur=b.chapters.find(c=>c.id===s.cur)||b.chapters[0];
  const due=b.chapters.filter(c=>blocks[c.id]&&(blocks[c.id].due<=T||ahead[c.id]===T));
  if(due.length)r.tasks.push({k:'old',t:due.length===1?`مراجعة «${due[0].title}» كامل`:`مراجعة ${ar(due.length)} أبواب`,sub:due.length>1?due.slice(0,3).map(c=>c.title).join('، ')+(due.length>3?'…':''):'',done:false});
  const learned=cur.units.filter(u=>cards[u.id]).length, left=cur.units.length-learned;
  const used=s.newDay===T?s.newCount:0, extra=s.extra&&s.extra.d===T?s.extra.n:0, fresh=Math.min(left,Math.max(0,(s.per||1)+extra-used));
  if(fresh)r.tasks.push({k:'new',t:`جديد: ${ar(fresh)} ${fresh===1?W:W==='فقرة'?'فقرات':'أحاديث'}`,sub:b.chapters.length>1?'من «'+cur.title+'»':'',done:false});
  else if(used&&left>=0)r.tasks.push({k:'new',t:'الجديد',sub:'حفظته ✓',done:true});
  if(left&&learned>=2){const ok=link[cur.id]===T;r.tasks.push({k:'recent',t:'الربط',sub:ok?'سمّعته ✓':`سمّع ${ar(learned)} ${W==='فقرة'?'فقرة':'وحدة'} متصلة`,done:ok})}
  return r;
}

const R=BOOKS.map(b=>b.poems?poemBook(b):proseBook(b));
const started=R.filter(r=>r.started), rest=R.filter(r=>!r.started);
// the daily ward shows only the texts the reader is working on now; paused ones wait below
const paused=k=>window.UI&&UI.isPaused(k), active=started.filter(r=>!paused(r.b.key)), held=started.filter(r=>paused(r.b.key));

/* today */
$('dayLbl').textContent=dayName(T);
const list=$('todayList'); let open=0;
active.forEach(r=>{
  const c=el('div','bk'), h=el('div','bkh');
  const a=el('a','bkt',r.b.title); a.href=PAGE[r.b.key]; h.append(a);
  const pend=r.tasks.filter(x=>!x.done).length; open+=pend;
  h.append(el('span','pill'+(pend?'':' new'),pend?`باقي ${ar(pend)}`:'خلصت ✓')); c.append(h);
  const ul=el('ul','tasks');
  if(!r.tasks.length)ul.append(el('li','done','ما في شي اليوم بهالكتاب'));
  // each task wears its kind, as huffaz split the day: new (sabaq), recent (sabqi), old (manzil)
const KIND={new:'جديد',recent:'قريب',old:'قديم',test:'تسميع'};
  r.tasks.forEach(x=>{const li=el('li',x.done?'done':'');if(x.k)li.append(el('em','k-'+x.k,KIND[x.k]));li.append(el('span','',x.t));if(x.sub)li.append(el('small','',x.sub));ul.append(li)});
  c.append(ul);
  const go=el('a','btn'+(pend?' primary':''),pend?'افتح وكمّل':'افتحه'); go.href=PAGE[r.b.key]; c.append(go);
  list.append(c);
});
$('todaySum').textContent=!started.length?'لسا ما بلّشت بأي متن. اختر متن من تحت وابدأ فيه.':!active.length?'كل متونك موقوفة. فعّل اللي بدك تحفظه من تحت.':open?`باقي عليك ${ar(open)} ${open===1?'مهمة':'مهام'} اليوم.`:'ما شاء الله، خلصت ورد اليوم بكل المتون 🤍';

/* the next step: the first unfinished task, one tap away */
const nextUp=active.map(r=>({r,t:r.tasks.find(x=>!x.done)})).find(x=>x.t);
if(nextUp){const h=$('hero');h.hidden=false;h.href=PAGE[nextUp.r.b.key];
  h.append(el('small','','الخطوة الجاية'),el('b','',nextUp.t.t),el('span','',nextUp.r.b.title+(nextUp.t.sub?' · '+nextUp.t.sub:'')),el('i','','ابدأ ←'))}

/* paused texts: one tap brings each back to the ward */
if(held.length){const box=el('div','held');box.append(el('div','eyebrow','متون موقوفة · ما بتطلع بالورد'));
  held.forEach(r=>{const row=el('div','ui-book paused');const a=el('a','ui-book-link');a.href=PAGE[r.b.key];a.append(el('b','',r.b.title),el('small','',ar(r.done)+' من '+ar(r.total)));
    const t=el('button','ui-switch','فعّله');t.type='button';t.onclick=()=>{UI.setPaused(r.b.key,false);location.reload()};row.append(a,t);box.append(row)});
  list.after(box)}

/* not started yet */
$('restCard').hidden=!rest.length;
// each text not started yet, with what it is about, as a tappable card
rest.forEach(r=>{const a=el('a','ui-book');a.href=PAGE[r.b.key];const info=(window.UI&&UI.BOOKS.find(x=>x.key===r.b.key))||{};a.append(el('b','',r.b.title),el('small','',info.d||r.b.sub||''));$('restList').append(a)});

/* statistics: one streak across every book, totals, per-book progress, and twelve weeks of activity */
const days=new Set(); started.forEach(r=>r.days.forEach(d=>days.add(d)));
let streak=0, d=days.has(T)?T:addDays(T,-1); while(days.has(d)){streak++;d=addDays(d,-1)}
let last30=0; for(let i=0;i<30;i++)if(days.has(addDays(T,-i)))last30++;
const verses=R.filter(r=>r.b.poems).reduce((n,r)=>n+r.done,0), units=R.filter(r=>!r.b.poems).reduce((n,r)=>n+r.done,0);
[[streak,'أيام ورا بعض'],[last30,'يوم نشاط من آخر ٣٠'],[verses,'بيت محفوظ'],[units,'حديث وفقرة محفوظة']].forEach(([n,l])=>{
  const t=el('div'); t.append(el('b','',ar(n)),el('small','',l)); $('tiles').append(t)});
started.forEach(r=>{
  const row=el('div','pg'), top=el('div','pgh');
  top.append(el('span','',r.b.title),el('small','',`${ar(r.done)} من ${ar(r.total)} ${r.b.poems?'بيت':r.unit}`+(r.chapters>1?` · ختمت ${ar(r.finished)} باب من ${ar(r.chapters)}`:'')));
  const bar=el('div','bar'), i=el('i'); i.style.width=Math.max(r.done?1.5:0,r.done/r.total*100)+'%'; bar.append(i);
  row.append(top,bar); $('progList').append(row);
});
if(!started.length)$('progList').append(el('div','empty','بيظهر هون تقدمك بكل متن.'));
// the grid runs oldest to newest, a column per week; RTL puts the newest week on the left
const grid=$('heat'), start=addDays(T,-7*11-((new Date(T+'T12:00:00Z').getUTCDay()+1)%7));
for(let day=start;day<=T;day=addDays(day,1)){const c=el('i',(days.has(day)?'on':'')+(day===T?' now':''));c.title=dayName(day);grid.append(c)}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
