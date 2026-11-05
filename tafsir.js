/* ورد التفسير: a few ayat a day, each with the tafsir books the reader chose (data/quran/index.js, tools/build-tafsir.js).
   The page shows only today's ward; the plan (finish by a date, or so many ayat a day), the books, the start, the schedule
   and the log live in the «خطتي» sheet.
   State in localStorage 'mutoon_tafsir_v1' (synced like the texts' progress):
   {set: the plan was chosen, mode:'days'|'per', end: the finish date (mode days), per: today's ayat, books:[keys in order],
    s, a: the next ayah to read, day, from:{s,a} today's ward start, done, log:{day:ayat}, open, khatmas, khatmaDay,
    lbl: today's ward in words (home.html shows it)} */
(function(){
const Q=window.QURAN, LS='mutoon_tafsir_v1', $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ayat=n=>n===1?'آية وحدة':n===2?'آيتين':ar(n)+(n<=10?' آيات':' آية');
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const btn=(c,x,fn)=>{const b=el('button','btn '+c,x);b.type='button';b.onclick=fn;return b};
const TF=Object.fromEntries(Q.tafasir.map(t=>[t.k,t]));
const T=today(), addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const diff=(a,b)=>Math.round((new Date(b+'T12:00:00Z')-new Date(a+'T12:00:00Z'))/864e5);
const fmt=(d,o)=>{try{return new Intl.DateTimeFormat('ar-JO',Object.assign({timeZone:'UTC'},o)).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
const dateLbl=d=>fmt(d,{day:'numeric',month:'long',year:'numeric'});
const dayLbl=d=>d===T?'اليوم':d===addDays(T,1)?'بكرة':fmt(d,{weekday:'long',day:'numeric',month:'long'});
// the Quran as one line of ayat: g = 0…TOTAL-1
const CUM=[0]; Q.suras.forEach((x,i)=>CUM.push(CUM[i]+x[1])); const TOTAL=CUM[114];
const gi=p=>CUM[p.s-1]+p.a-1, at=g=>{let s=1;while(CUM[s]<=g)s++;return{s,a:g-CUM[s-1]+1}};
const sn=s=>Q.suras[s-1][0];
const range=(f,l)=>f.s===l.s?sn(f.s)+' '+(f.a===l.a?ar(f.a):ar(f.a)+'–'+ar(l.a)):sn(f.s)+' '+ar(f.a)+' – '+sn(l.s)+' '+ar(l.a);

let S={per:3,books:['muyassar','saadi'].filter(k=>TF[k]),s:1,a:1,day:'',from:null,done:false,log:{},mode:'per'};
let saved=null; try{saved=JSON.parse(localStorage.getItem(LS)||'null')}catch(e){}
if(saved){Object.assign(S,saved); if(S.set===undefined)S.set=true}   // a reader from before the plan keeps reading
S.books=S.books.filter(k=>TF[k]);
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};

// a plan by date: the ayat left, shared over the days left (so a missed day spreads over the rest, not piled on one)
const perFor=(g,d)=>Math.max(1,Math.ceil((TOTAL-g)/Math.max(1,diff(d,S.end)+1)));
// a new day starts a new ward where the last one ended
if(S.day!==T){S.day=T;S.from={s:S.s,a:S.a};S.done=false;if(S.mode==='days'&&S.end)S.per=perFor(gi(S.from),T);if(S.set)save()}
if(!S.from)S.from={s:S.s,a:S.a};

// the ayat of a ward: per ayat from a start, running into the next sura; a plan by date stops at an-Nas
function ward(from,n){const g=gi(from);if(S.mode==='days')n=Math.min(n,TOTAL-g);const out=[];for(let i=0;i<n;i++)out.push(at((g+i)%TOTAL));return out}
const after=list=>at((gi(list[list.length-1])+1)%TOTAL);

const cache={};
const load=url=>cache[url]||(cache[url]=fetch(url).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).catch(e=>{delete cache[url];throw e}));
// a specialized book (sp: asbab, i'rab, ahkam…) has null where it says nothing about the ayah
// the tafsir of an ayah; some books explain it with an earlier one (an empty entry): show that one's text once
function tafsirOf(arr,a,shownFrom){if(arr[a-1])return{text:arr[a-1]};if(arr[a-1]===null)return{none:true};let j=a-1;while(j>0&&!arr[j-1])j--;
  if(!j)return{text:''}; return j>=shownFrom?{with:j}:{text:arr[j-1],range:[j,a]}}

// Quran quotes ﴿…﴾ in a tafsir stand out
function para(p,t){t.split(/(﴿[^﴾]{1,600}﴾)/).forEach(x=>{if(/^﴿/.test(x)){const b=el('span','tq',x);p.append(b)}else p.append(x)})}

/* ---------- the page: today's ward and nothing else ---------- */
function render(){
  const box=$('ward'), row=$('wardBtns'); box.replaceChildren(); row.replaceChildren();
  if(!S.set){$('wardTitle').textContent='خلّينا نرتّب خطتك';$('planLine').textContent='';$('pbar').hidden=true;
    box.append(el('p','intro','كل يوم بتقرأ كم آية، وتحت كل آية التفاسير اللي بتختارها. حدد متى بدك تختم، وإحنا بنحسبلك ورد كل يوم.'));
    row.append(btn('primary grow','رتّب خطتي ←',()=>planSheet(true)));return}
  const list=ward(S.from,S.per), first=list[0], last=list[list.length-1];
  S.lbl=range(first,last); save();
  $('wardTitle').textContent=S.lbl;
  const khatma=S.khatmaDay===T&&S.done, g=gi(S.done?{s:S.s,a:S.a}:S.from), pct=khatma?100:Math.floor(g/TOTAL*100);
  $('pbar').hidden=false; $('pbar').firstElementChild.style.width=Math.max(1,pct)+'%';
  $('planLine').textContent=(S.mode==='days'&&S.end?'ختمة لـ '+dateLbl(S.end):ayat(S.per)+' باليوم')+' · '+ar(pct)+'٪';
  if(S.done){
    box.append(el('div','doneMsg',khatma?'ما شاء الله، ختمت القرآن مع التفسير 🤍':'✓ قرأت ورد اليوم'));
    const nx=schedule()[0]; if(nx&&!khatma)box.append(el('p','tfquiet center','ورد بكرة: '+range(nx.f,nx.l)));
    if(khatma&&S.mode==='days')row.append(btn('primary grow','ابدأ ختمة جديدة',()=>planSheet()));
    row.append(btn('grow','اقرأ ورد زيادة',()=>{S.from={s:S.s,a:S.a};S.done=false;save();render();scrollTo({top:0,behavior:'smooth'})}));
    return}
  for(const [i,v] of list.entries()){
    if(i===0||v.s!==list[i-1].s){
      if(i>0||v.a===1)box.append(el('div','sura','سورة '+sn(v.s)));
      if(v.a===1&&v.s!==1&&v.s!==9)box.append(el('div','basm','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'));
    }
    const card=el('div','ayah'); box.append(card);
    const t=el('p','atext'); card.append(t);
    load('data/quran/'+v.s+'.json').then(A=>{t.textContent=A[v.a-1]+' ';t.append(el('span','anum','﴿'+ar(v.a)+'﴾'))}).catch(()=>{t.textContent='ما قدرت أحمّل الآية، تأكد من الإنترنت.'});
    // the ward's first ayah of each sura in it: an ayah explained with an earlier one in the ward needs no repeat
    const shownFrom=i===0||v.s!==list[i-1].s?v.a:list.find(x=>x.s===v.s).a;
    // a specialized book with nothing on this ayah, or that explained it above, is named once in a quiet line at the end
    const quiet=el('p','tfquiet'), why={}; quiet.hidden=true;
    const hush=(k,w)=>{(why[w]=why[w]||[]).push(TF[k].t);quiet.hidden=false;quiet.textContent=Object.entries(why).map(([w,n])=>w+': '+n.join('، ')).join(' · ')};
    S.books.forEach((k,bi)=>{
      const d=el('details','tf'); if(bi===0&&S.open!==false)d.open=true;
      d.append(el('summary','',TF[k].t)); card.append(d);
      const body=el('div','tfb',' '); d.append(body);
      const fill=()=>load('data/tafsir/'+k+'/'+v.s+'.json').then(arr=>{body.replaceChildren();const r=tafsirOf(arr,v.a,shownFrom);
        if(r.none){d.remove();hush(k,'ما فيه شي عن هالآية');return}
        if(r.with){if(TF[k].sp){d.remove();hush(k,'مشروحة مع الآية '+ar(r.with))}else body.append(el('p','note','تفسيرها مع الآية '+ar(r.with)+' فوق.'));return}
        if(r.range)body.append(el('p','note','تفسير الآيات '+ar(r.range[0])+'–'+ar(r.range[1])+' معًا:'));
        if(!r.text){body.append(el('p','note','ما في تفسير لهالآية بهالكتاب.'));return}
        r.text.split(/\n\n+/).forEach(x=>{const p=el('p');para(p,x);body.append(p)})})
        .catch(()=>{body.replaceChildren(el('p','note','ما قدرت أحمّل التفسير، تأكد من الإنترنت.'))});
      // a closed book loads when opened, so a long tafsir costs nothing until it is read; a specialized one loads at once,
      // to say so when it has nothing on this ayah
      if(d.open||TF[k].sp){d.dataset.l=1;fill()} else d.addEventListener('toggle',()=>{if(d.open&&!d.dataset.l){d.dataset.l=1;fill()}});
    });
    card.append(quiet);
    if(!S.books.length){quiet.hidden=false;quiet.textContent='ما اخترت تفسير. من «خطتي» بتختار.'}
  }
  row.append(btn('primary grow','قرأت ورد اليوم ✓',()=>{const nx=after(list);
    if(gi(last)===TOTAL-1){S.khatmas=(S.khatmas||0)+1;S.khatmaDay=T}
    S.s=nx.s;S.a=nx.a;S.done=true;S.log[T]=(S.log[T]||0)+list.length;save();render();scrollTo({top:0,behavior:'smooth'})}));
}

/* ---------- the plan sheet ---------- */
const DAYS=[[30,'شهر'],[60,'شهرين'],[90,'٣ شهور'],[182,'٦ شهور'],[365,'سنة'],[730,'سنتين']], PERS=[1,3,5,10,15,20,30];
function chips(opts,cur,fn){const r=el('div','chips');opts.forEach(([v,t])=>{const b=el('button','chip'+(v===cur?' on':''),t);b.type='button';b.onclick=()=>fn(v);r.append(b)});return r}
// a span of days in words: «٤٠ يوم»، «٣ شهور»، «سنتين و٩ شهور»
const dur=n=>{if(n<60)return ar(n)+' يوم';let y=Math.floor(n/365),mo=Math.round((n-y*365)/30.4);if(mo>=12){y++;mo=0}const Y=y===1?'سنة':y===2?'سنتين':ar(y)+(y<=10?' سنين':' سنة'),M=mo===1?'شهر':mo===2?'شهرين':ar(mo)+(mo<=10?' شهور':' شهر');
  return y?(mo?Y+' و'+M:Y):M};
const sec=(title,...kids)=>{const s=el('div','psec');s.append(el('div','eyebrow',title),...kids);return s};
const fold=(title,fill)=>{const d=el('details','pfold');d.append(el('summary','',title));d.addEventListener('toggle',()=>{if(d.open&&!d.dataset.l){d.dataset.l=1;fill(d)}});return d};
// the next unread ayah and the day it is read on
const nextStart=()=>S.done?{g:gi({s:S.s,a:S.a}),d:addDays(T,1)}:{g:gi(S.from),d:T};
// the days of the plan from here to an-Nas: [{d, f, l}]
function schedule(){const out=[];let {g,d}=nextStart();
  while(g<TOTAL&&out.length<TOTAL){const n=S.mode==='days'&&S.end?perFor(g,d):S.per, e=Math.min(TOTAL-1,g+n-1);out.push({d,f:at(g),l:at(e)});g=e+1;d=addDays(d,1)}
  return out}

function planSheet(first){
  const b=UI.sheet(first?'خطتك لورد التفسير':'خطتي');
  const setDays=n=>{S.mode='days';const {g,d}=nextStart();S.end=addDays(d,n-1);S.per=perFor(g,d);paint()};
  const paint=()=>{save();b.replaceChildren();
    // 1. how: finish by a date, or so many ayat a day
    const how=chips([['days','بدي أختم بمدة'],['per','عدد آيات باليوم']],S.mode,v=>{if(v==='days')setDays(S.end&&diff(nextStart().d,S.end)>=0?diff(nextStart().d,S.end)+1:365);else{S.mode='per';paint()}});
    const opts=S.mode==='days'?chips(DAYS,S.end?(DAYS.find(([n])=>addDays(nextStart().d,n-1)===S.end)||[])[0]:null,setDays)
      :chips(PERS.map(n=>[n,ayat(n)]),S.per,v=>{S.per=v;paint()});
    const sch=schedule(), endD=sch.length?sch[sch.length-1].d:T, left=TOTAL-nextStart().g;
    const sum=el('p','psum',!sch.length?'':S.mode==='days'?'يعني تقريبًا '+ayat(Math.ceil(left/sch.length))+' باليوم، وبتختم '+dateLbl(endD)+'.'
      :'بتختم بعد '+dur(sch.length)+'، '+dateLbl(endD)+'.');
    b.append(sec('كيف بدك تقرأ؟',how,opts,sum));
    // 2. the books, in order
    const mine=el('div','mine');
    S.books.forEach((k,i)=>{const r=el('div','mbk');r.append(el('b','',TF[k].t));
      if(i>0)r.append(btn('sm','▲',()=>{S.books.splice(i,1);S.books.splice(i-1,0,k);paint()}));
      r.append(btn('sm','✕',()=>{S.books.splice(i,1);paint()}));mine.append(r)});
    if(!S.books.length)mine.append(el('p','note','ما اخترت ولا تفسير.'));
    const add=fold('＋ زيد تفسير',d=>{let g=null,box=null;Q.tafasir.forEach(t=>{
      if(t.g!==g){g=t.g;box=el('details','pgrp');box.append(el('summary','',t.g));d.append(box)}
      const on=S.books.includes(t.k), r=el('button','pbk'+(on?' on':''));r.type='button';
      r.append(el('b','',(on?'✓ ':'')+t.t),el('small','',t.by));r.onclick=()=>{S.books=on?S.books.filter(x=>x!==t.k):[...S.books,t.k];paint()};box.append(r)})});
    b.append(sec('التفاسير تحت كل آية',mine,add));
    // 3. the rest, folded
    b.append(fold('📅 جدول الختمة',d=>{const l=el('div','sched');sch.slice(0,400).forEach(x=>{const r=el('div');r.append(el('span','',dayLbl(x.d)),el('b','',range(x.f,x.l)));l.append(r)});d.append(l)}));
    b.append(fold('ابدأ من مكان تاني',d=>{const p=el('div','pick'),su=el('select'),ay=el('input');ay.type='number';ay.min=1;ay.inputMode='numeric';
      Q.suras.forEach(([n],i)=>{const o=el('option','',ar(i+1)+'. '+n);o.value=i+1;if(i+1===S.from.s)o.selected=true;su.append(o)});
      const lim=()=>{ay.max=Q.suras[su.value-1][1];ay.placeholder='١–'+ar(ay.max)}; su.onchange=()=>{ay.value=1;lim()}; ay.value=S.from.a; lim();
      p.append(su,ay,btn('','انتقل',()=>{const s=+su.value,a=Math.min(Math.max(1,+ay.value||1),Q.suras[s-1][1]);S.s=s;S.a=a;S.from={s,a};S.done=false;
        if(S.mode==='days'&&S.end)S.per=perFor(gi(S.from),T);paint()}));d.append(p)}));
    b.append(fold('سجلّك',d=>{const days=Object.keys(S.log).sort().reverse(), tot=Object.values(S.log).reduce((x,y)=>x+y,0);
      let st=0;for(let x=T;S.log[x];x=addDays(x,-1))st++;
      d.append(el('p','note',tot?'قرأت '+ayat(tot)+' مع تفسيرها'+(st>1?' · '+ar(st)+' أيام ورا بعض 🔥':'')+(S.khatmas?' · ختمت '+ar(S.khatmas)+' مرة':''):'لسا ما في سجل.'));
      const l=el('div','sched');days.slice(0,30).forEach(x=>{const r=el('div');r.append(el('span','',dayLbl(x)),el('b','',ayat(S.log[x])));l.append(r)});d.append(l)}));
    b.append(fold('خيارات تانية',d=>{const l=el('label','row note'),c=el('input');c.type='checkbox';c.checked=S.open!==false;c.onchange=()=>{S.open=c.checked;save()};
      l.append(c,' افتح أول تفسير تلقائيًا');d.append(l,el('p','note','نص القرآن بالرسم العثماني من quran.com. التفاسير من quran.com وapi.quran-tafseer.com وtafsir.app والموسوعة القرآنية (quranpedia.net)، منقولة بلفظها.'))}));
    if(first)b.append(btn('primary','ابدأ ←',()=>{S.set=true;save();UI.closeSheet()}));
  };
  paint();
  // closing the sheet shows the ward as the plan now says
  new MutationObserver((m,o)=>{if(!document.getElementById('uiSheet')){o.disconnect();render()}}).observe(document.body,{childList:true});
}
$('planBtn').onclick=()=>planSheet(!S.set);
render();
})();
