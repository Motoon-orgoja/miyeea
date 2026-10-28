/* ---------- shared shell for every page ----------
   Loaded in <head> before anything else so the reader's display preferences apply before the first paint.
   Then it replaces each page's row of book links with one app bar (today · texts · settings), and provides the
   settings sheet (theme, text size, screen awake, daily reminder, one backup for every text) and small helpers
   (toast, sheet) that the engines may use through window.UI. */
(function(){
const PK='mutoon_prefs';
const DEF={theme:'auto',vs:1,us:1,wake:true,remind:'20:00',fade:2,ret:0.9,paused:[]};
let P; try{P={...DEF,...JSON.parse(localStorage.getItem(PK)||'{}')}}catch(e){P={...DEF}}
const root=document.documentElement;
function apply(){
  if(P.theme==='auto')root.removeAttribute('data-theme'); else root.setAttribute('data-theme',P.theme);
  root.style.setProperty('--vs',P.vs); root.style.setProperty('--us',P.us);
  const m=document.querySelector('meta[name="theme-color"]'); if(m)m.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#0B7A55';
}
function save(){try{localStorage.setItem(PK,JSON.stringify(P))}catch(e){} apply(); dispatchEvent(new CustomEvent('prefs',{detail:P}))}
apply();

// every text the site teaches, in the order of the switcher
const BOOKS=[
  {key:'miyeea',lsk:'miyeea_progress_v1',url:'./',t:'الأرجوزة الميئية',d:'السيرة النبوية نظمًا · ١٠٠ بيت'},
  {key:'munajat',lsk:'mutoon_munajat_v1:',url:'munajat.html',t:'منظومات المناجاة',d:'٨ قصائد في الأنس بالله'},
  {key:'shatibiyya',lsk:'mutoon_shatibiyya_v1',url:'shatibiyya.html',t:'الشاطبية',d:'حرز الأماني في القراءات السبع'},
  {key:'jazariyya',lsk:'mutoon_jazariyya_v1',url:'jazariyya.html',t:'المقدمة الجزرية',d:'أحكام التجويد · ١٠٩ أبيات'},
  {key:'riyad',lsk:'mutoon_riyad91_v1',url:'riyad.html',t:'رياض الصالحين',d:'مختارات: باب الوعظ والاقتصاد فيه'},
  {key:'qudouri',lsk:'mutoon_qudouri_v1',url:'qudouri.html',t:'مختصر القدوري',d:'الفقه الحنفي · ١١٨ بابًا'},
];

/* ---------- small helpers ---------- */
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
let toastT=null;
// a short message at the bottom; with an action (e.g. «تراجع») it stays longer and takes taps
function toast(msg,action){
  let t=document.getElementById('uiToast'); if(!t){t=el('div','ui-toast');t.id='uiToast';t.setAttribute('role','status');document.body.append(t)}
  t.replaceChildren(el('span','',msg));
  if(action){const b=el('button','ui-toast-act',action.label);b.type='button';b.onclick=()=>{t.classList.remove('on');action.fn()};t.append(b)}
  t.classList.toggle('act',!!action); t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),action?6000:2600);
}
// a bottom sheet; returns its body to fill. Closing: the ✕, the backdrop, or Escape
function sheet(title){
  closeSheet();
  const bd=el('div','ui-backdrop'); bd.id='uiSheet';
  const s=el('div','ui-sheet'); s.setAttribute('role','dialog'); s.setAttribute('aria-modal','true'); s.setAttribute('aria-label',title);
  const h=el('div','ui-sheet-h'); h.append(el('b','',title)); const x=el('button','ui-x','✕'); x.setAttribute('aria-label','سكّر'); x.onclick=closeSheet; h.append(x);
  const body=el('div','ui-sheet-b'); s.append(h,body); bd.append(s); document.body.append(bd);
  bd.addEventListener('click',e=>{if(e.target===bd)closeSheet()});
  requestAnimationFrame(()=>bd.classList.add('on')); document.body.classList.add('ui-locked');
  return body;
}
function closeSheet(){const s=document.getElementById('uiSheet');if(s){s.remove();document.body.classList.remove('ui-locked')}}
addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

/* ---------- keep the screen on while the page is open (iOS 16.4+, Chrome) ---------- */
let lock=null;
async function wake(){
  if(!P.wake||!('wakeLock' in navigator)||document.visibilityState!=='visible')return;
  try{if(!lock){lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',()=>lock=null)}}catch(e){}
}
function sleep(){try{lock&&lock.release()}catch(e){} lock=null}
document.addEventListener('visibilitychange',wake);
// browsers grant the lock only after a user gesture on some platforms
addEventListener('pointerdown',wake,{passive:true});

/* ---------- backup of every text at once ---------- */
const toCode=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const fromCode=c=>JSON.parse(decodeURIComponent(escape(atob(c.replace(/\s+/g,'')))));
function exportAll(){const data={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);data[k]=localStorage.getItem(k)}return toCode({app:'mutoon-all',v:1,at:new Date().toISOString(),data})}
function importAll(code){const o=fromCode(code);if(o.app!=='mutoon-all'||!o.data)throw new Error('bad');Object.entries(o.data).forEach(([k,v])=>localStorage.setItem(k,v));return Object.keys(o.data).length}

/* ---------- daily reminder as a calendar event (works on iPhone without a server) ---------- */
function reminderICS(time){
  const [h,m]=time.split(':').map(Number), d=new Date(); d.setHours(h,m,0,0); if(d<new Date())d.setDate(d.getDate()+1);
  const p=n=>String(n).padStart(2,'0'), dt=`${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(h)}${p(m)}00`;
  const url=new URL('home.html',location.href).href;
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Motoon//Hifz//AR','BEGIN:VEVENT','UID:hifz-daily-'+Date.now()+'@motoon',
    'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART:'+dt,'DURATION:PT20M','RRULE:FREQ=DAILY',
    'SUMMARY:ورد الحفظ اليومي','DESCRIPTION:افتح وردك: '+url,'URL:'+url,
    'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:ورد الحفظ','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
}

/* ---------- settings sheet ---------- */
function seg(name,opts,val,on){
  const w=el('div','ui-seg'); w.setAttribute('role','radiogroup'); w.setAttribute('aria-label',name);
  opts.forEach(([v,l])=>{const b=el('button','',l);b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',String(v===val));
    b.onclick=()=>{w.querySelectorAll('button').forEach(x=>x.setAttribute('aria-checked',String(x===b)));on(v)};w.append(b)});
  return w;
}
function field(label,ctrl,hint){const f=el('div','ui-field');f.append(el('div','ui-lbl',label),ctrl);if(hint)f.append(el('div','ui-hint',hint));return f}
function openSettings(){
  const b=sheet('الإعدادات');
  b.append(field('المظهر',seg('المظهر',[['auto','حسب الجهاز'],['light','فاتح'],['dark','غامق']],P.theme,v=>{P.theme=v;save()})));
  const prev=el('div','ui-preview','وَالْأَخْذُ بِالتَّجْوِيدِ حَتْمٌ لَازِمُ');
  const rng=(min,max,step,key,fmt)=>{const r=el('input');r.type='range';r.min=min;r.max=max;r.step=step;r.value=P[key];const o=el('span','ui-val',fmt(P[key]));
    r.oninput=()=>{P[key]=+r.value;o.textContent=fmt(P[key]);save()};const w=el('div','ui-range');w.append(r,o);return w};
  const pct=v=>ar(Math.round(v*100))+'٪';
  b.append(field('حجم خط المتن',rng(.8,1.6,.05,'vs',pct)),prev,field('حجم خط الأزرار والشرح',rng(.9,1.3,.05,'us',pct)));
  b.append(field('كثرة المراجعة',seg('كثرة المراجعة',[[0.85,'أقل'],[0.9,'متوازنة'],[0.95,'أكثر']],P.ret,v=>{P.ret=v;save()}),
    'مواعيد مراجعة الأبواب والمقاطع بتنحسب بخوارزمية FSRS حسب تقييمك لحالك. «أكثر» بتقرّب المواعيد وبتثبّت أكثر، و«أقل» بتبعّدها وبتوفّر وقت. التغيير بيأثر على المراجعات الجاية.'));
  const wk=el('label','ui-check'); const cb=el('input'); cb.type='checkbox'; cb.checked=P.wake; cb.onchange=()=>{P.wake=cb.checked;save();P.wake?wake():sleep()};
  wk.append(cb,document.createTextNode(' خلّي الشاشة شغّالة وأنا بحفظ'));
  b.append(field('الشاشة',wk,'wakeLock' in navigator?'بتمنع الجوال يطفّي الشاشة وإنت بتقرأ أو بتسمّع.':'متصفحك ما بيدعم هالخاصية.'));
  // reminder
  const rw=el('div','ui-row'); const ti=el('input'); ti.type='time'; ti.value=P.remind; ti.onchange=()=>{P.remind=ti.value;save()};
  const rb=el('button','btn','📅 أضف تذكير يومي للتقويم');
  rb.onclick=()=>{const blob=new Blob([reminderICS(ti.value||'20:00')],{type:'text/calendar'});const a=el('a');a.href=URL.createObjectURL(blob);a.download='تذكير-الحفظ.ics';document.body.append(a);a.click();a.remove();toast('افتح الملف واضغط «إضافة للتقويم»')};
  rw.append(ti,rb); b.append(field('تذكير يومي',rw,'بينزل ملف تقويم بموعد يومي بالوقت اللي بتختاره، وبيذكّرك بإشعار من تقويم الجوال.'));
  // backup
  const bk=el('div','ui-col');
  const out=el('textarea'); out.rows=3; out.readOnly=true; out.placeholder='كود النسخة الاحتياطية بيطلع هون';
  const eb=el('button','btn primary','انسخ نسخة احتياطية لكل المتون');
  eb.onclick=async()=>{out.value=exportAll();try{localStorage.setItem('ui_lastBackup',String(Date.now()))}catch(e){}try{await navigator.clipboard.writeText(out.value);toast('انتسخ الكود ✓ خزّنه بالملاحظات')}catch(e){out.select();toast('حدّد الكود وانسخه')}};
  const inp=el('textarea'); inp.rows=3; inp.placeholder='الصق كود نسخة احتياطية هون لترجّع كل تقدمك';
  const ib=el('button','btn','استرجع');
  ib.onclick=()=>{try{const n=importAll(inp.value);if(!confirm('رح يرجّع التقدم من الكود ويستبدل تقدمك الحالي بالمتون اللي فيه. متأكد؟'))return;toast('رجع التقدم ✓');setTimeout(()=>location.reload(),600)}catch(e){toast('الكود مش صحيح')}};
  bk.append(eb,out,inp,ib);
  b.append(field('النسخة الاحتياطية',bk,'كود واحد فيه تقدمك بكل المتون، بتنقله لجهاز ثاني أو بتخزنه احتياط.'));
  b.append(el('p','ui-hint','تقدمك محفوظ على هالجهاز بس. الموقع بيشتغل بدون نت بعد أول فتحة.'));
}
/* ---------- the texts the reader is working on now ----------
   A text counts once it has progress; the reader can pause any of them, and paused texts leave the daily ward
   (their progress stays, and they come back with one tap). */
function started(key){const b=BOOKS.find(x=>x.key===key);if(!b)return false;
  if(b.lsk.endsWith(':')){for(let i=0;i<localStorage.length;i++)if(localStorage.key(i).startsWith(b.lsk))return true;return false}
  return localStorage.getItem(b.lsk)!=null}
const isPaused=key=>(P.paused||[]).includes(key);
function setPaused(key,on){P.paused=(P.paused||[]).filter(k=>k!==key);if(on)P.paused.push(key);save()}
function openBooks(){
  const b=sheet('المتون');
  b.append(el('p','ui-hint','المتون اللي بتحفظها هلأ بتطلع بـ«وردي اليوم». أوقف اللي مش شغّال عليه، وتقدمك فيه بيضل محفوظ.'));
  BOOKS.forEach(x=>{
    const row=el('div','ui-book'+(x.key===CUR?' cur':'')+(isPaused(x.key)?' paused':''));
    const a=el('a','ui-book-link');a.href=x.url;a.append(el('b','',x.t),el('small','',x.d));row.append(a);
    if(started(x.key)){const t=el('button','ui-switch'+(isPaused(x.key)?'':' on'));t.type='button';t.setAttribute('role','switch');
      const paint=()=>{const p=isPaused(x.key);t.classList.toggle('on',!p);t.setAttribute('aria-checked',String(!p));t.textContent=p?'موقوف':'فعّال';row.classList.toggle('paused',p)};
      t.onclick=()=>{setPaused(x.key,!isPaused(x.key));paint();toast(isPaused(x.key)?'وقّفته، ما رح يطلع بوردك':'رجع لوردك اليومي ✓')};paint();row.append(t)}
    else row.append(el('span','ui-new','ابدأ'));
    b.append(row)});
}
// on a paused text's own page, say so and offer to bring it back
function pausedBanner(){
  if(!CUR||CUR==='home'||!isPaused(CUR))return; const bar=document.querySelector('.ui-bar'); if(!bar)return;
  const n=el('div','ui-nudge'); n.append(el('span','','هالمتن موقوف، وما بيطلع بـ«وردي اليوم».'));
  const go=el('button','btn primary','رجّعه لوردي'); go.onclick=()=>{setPaused(CUR,false);n.remove();toast('رجع لوردك اليومي ✓')};
  const row=el('div','ui-row'); row.append(go); n.append(row); bar.after(n);
}

/* ---------- the app bar replaces each page's list of book links ---------- */
let CUR='';
function mountBar(){
  const nav=document.querySelector('nav.books'); if(!nav)return;
  const c=nav.querySelector('[aria-current="page"]')||[...nav.querySelectorAll('a')].find(a=>a.dataset.book&&document.body.dataset.book===a.dataset.book);
  CUR=c?c.dataset.book:'';
  const bar=el('div','ui-bar');
  const home=el('a','ui-tab'+(CUR==='home'?' on':''));home.href='home.html';home.innerHTML='<span aria-hidden="true">☀︎</span> وردي اليوم';
  const books=el('button','ui-tab'+(CUR&&CUR!=='home'?' on':''));books.type='button';
  const cb=BOOKS.find(b=>b.key===CUR); books.innerHTML='<span aria-hidden="true">📚</span> '+(cb?cb.t:'المتون')+' <span class="ui-caret" aria-hidden="true">▾</span>';
  books.onclick=openBooks;
  const set=el('button','ui-ico');set.type='button';set.setAttribute('aria-label','الإعدادات');set.textContent='⚙︎';set.onclick=openSettings;
  bar.append(home,books,set); nav.replaceWith(bar);
}
/* ---------- floating counter ----------
   The page marks its repetition counter with data-fab. When that counter scrolls out of view (while reading the verses
   further down), a round copy floats at the bottom corner, above any bottom bar, and taps the real one. */
function mountFab(){
  const fab=el('button','ui-fab'); fab.type='button'; fab.hidden=true; fab.setAttribute('aria-label','أضف تكرار'); document.body.append(fab);
  let raf=0;
  const update=()=>{raf=0;
    const t=document.querySelector('[data-fab]');
    const shown=t&&t.offsetParent!==null&&!document.getElementById('uiSheet');
    let off=false; if(shown){const r=t.getBoundingClientRect();off=r.bottom<60||r.top>innerHeight-40}
    fab.hidden=!(shown&&off); if(fab.hidden)return;
    fab.innerHTML=t.innerHTML; fab.classList.toggle('full',t.classList.contains('full')||Number(t.dataset.fabFull)>0);
    let h=0; document.querySelectorAll('.stepbar,.voicebar').forEach(b=>{if(!b.hidden&&getComputedStyle(b).display!=='none')h=Math.max(h,b.getBoundingClientRect().height)});
    fab.style.bottom=`calc(${Math.round(h)+16}px + env(safe-area-inset-bottom,0px))`;
  };
  const later=()=>{if(!raf)raf=setTimeout(update,60)};
  addEventListener('scroll',later,{passive:true}); addEventListener('resize',later);
  new MutationObserver(later).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
  fab.addEventListener('click',()=>{const t=document.querySelector('[data-fab]');if(t){t.click();later()}});
  later();
}

/* ---------- protect progress: ask the browser not to evict storage, nudge a weekly backup, explain installing ---------- */
const hasProgress=()=>{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!==PK&&!/^ui_/.test(k))return true}return false};
function nudges(){
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  const wrap=document.querySelector('.wrap'), bar=document.querySelector('.ui-bar'); if(!wrap||!bar||!hasProgress())return;
  if(!localStorage.getItem('ui_firstSeen'))localStorage.setItem('ui_firstSeen',String(Date.now()));
  // a week counts from the last backup, or from the first visit for someone who never took one
  const last=Math.max(+(localStorage.getItem('ui_lastBackup')||0),+localStorage.getItem('ui_firstSeen')), shown=+(localStorage.getItem('ui_backupNudge')||0), now=Date.now(), WEEK=7*864e5;
  const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
  let msg=null,act=null;
  if(ios&&!standalone&&!localStorage.getItem('ui_installTip')){msg='ثبّت الموقع على الشاشة الرئيسية ليضل تقدمك محفوظ: زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية».';act=()=>localStorage.setItem('ui_installTip','1')}
  else if(now-last>WEEK&&now-shown>2*864e5){msg='صارلك أسبوع بدون نسخة احتياطية. خذ نسخة لكل المتون بضغطة.';act=()=>localStorage.setItem('ui_backupNudge',String(now))}
  if(!msg)return;
  const n=el('div','ui-nudge'); n.append(el('span','',msg));
  const row=el('div','ui-row');
  if(msg.includes('نسخة')){const go=el('button','btn primary','خذ نسخة');go.onclick=()=>{act();n.remove();openSettings();setTimeout(()=>{const b=document.querySelector('.ui-sheet .btn.primary');b&&b.scrollIntoView({block:'center'})},50)};row.append(go)}
  const ok=el('button','btn',msg.includes('نسخة')?'بعدين':'تمام');ok.onclick=()=>{act();n.remove()};row.append(ok);
  n.append(row); bar.after(n);
}
const ready=f=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f):f();
ready(()=>{mountBar();mountFab();wake();apply();pausedBanner();nudges()});

/* ---------- graded fading: hide a growing share of the words (level 1–4 = a quarter … all) ----------
   The words hidden at a level stay hidden at every higher level, and words the reader slipped on before (.wk) hide first,
   so each step up only adds new gaps. Tapping a hidden word peeks at it. */
const FADE_N=4;
function fade(root,level){
  if(!root)return; const ws=root.querySelectorAll('.w');
  ws.forEach((w,i)=>{const h=Math.imul(i+1,2654435761)>>>0, cut=level>=FADE_N?1:level/FADE_N;
    w.classList.toggle('fz',w.classList.contains('wk')?level>0:(h%1000)/1000<cut); w.classList.remove('peek')});
}
function fadeBar(onChange){
  const w=el('div','ui-fade'); const lv=()=>P.fade;
  const lbl=el('span','ui-fade-l'); const set=v=>{P.fade=Math.max(1,Math.min(FADE_N,v));save();paint();onChange(P.fade)};
  const minus=el('button','btn','أسهل'), plus=el('button','btn primary','أصعب'); minus.type=plus.type='button';
  minus.onclick=()=>set(lv()-1); plus.onclick=()=>set(lv()+1);
  function paint(){lbl.textContent=['','ربع الكلمات مخفي','نص الكلمات مخفي','ثلاث أرباعها مخفي','كلها مخفية'][lv()];minus.disabled=lv()<=1;plus.disabled=lv()>=FADE_N}
  // bars are rebuilt on each render, so a detached one stops listening
  const h=()=>{if(!w.isConnected){removeEventListener('prefs',h);return}paint()};
  paint(); addEventListener('prefs',h); w.append(minus,lbl,plus); return w;
}

window.UI={toast,fade,fadeBar,fadeLevel:()=>P.fade,isPaused,setPaused,started,sheet,closeSheet,prefs:()=>P,setPref:(k,v)=>{P[k]=v;save()},openSettings,openBooks,BOOKS};
})();
