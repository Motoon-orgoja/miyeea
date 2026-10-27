/* ---------- content: a data/*.js file sets window.BOOK before this script ----------
   BOOK.chapters: [{id, title, units:[{id, label, segs:[[kind, text]], gloss?}]}]. Each chapter is learned unit by unit,
   then reviewed as one block. Unit ids are unique across the book. */
const BOOK=window.BOOK, CH=BOOK.chapters, CHI=Object.fromEntries(CH.map(c=>[c.id,c])), MULTI=CH.length>1;
const UI=Object.fromEntries(CH.flatMap(c=>c.units.map(u=>[u.id,u])));
let CUR=CH[0].id, U=CH[0].units; // the chapter being learned and its units
document.title='حفظ '+BOOK.title;
document.querySelector('header h1').textContent=BOOK.title; document.querySelector('header p').textContent=BOOK.sub;
document.querySelectorAll('.books a').forEach(a=>{if(a.dataset.book===BOOK.key)a.setAttribute('aria-current','page')});

/* ---------- explanations ----------
   Verbatim passages from classical commentaries (Dalil al-Falihin, Sharh Muslim, Fath al-Bari, tafsir), loaded from riyad91-sharh.js
   which tools/assemble-sharh.js builds. Shown under each hadith in the chapter tab; 701's three parts share one entry on the last part */
const SHARH=window.SHARH||{};
// the commentaries put the text being explained in (…); show it bold so it stands out from the explanation
function richText(p,txt){
  txt.split(/(\([^()]{1,400}\))/).forEach(part=>{
    if(/^\(.*\)$/.test(part)){const b=document.createElement('b');b.textContent=part;p.append(b)}else p.append(part)});
}
function sharhEl(id){
  const s=SHARH[id]; if(!s)return null;
  const d=document.createElement('details'); d.className='sharh';
  const sm=document.createElement('summary'); sm.textContent=s.title; d.append(sm);
  s.secs.forEach(sec=>{
    const h=document.createElement('h4'); h.textContent=sec.src; d.append(h);
    const r=document.createElement('a'); r.className='ref'; r.href=sec.url; r.target='_blank'; r.rel='noopener'; r.textContent=sec.ref+' ↗'; d.append(r);
    sec.text.split(/\n\n+/).forEach(par=>{const p=document.createElement('p');richText(p,par);d.append(p)});
  });
  if(s.note){const n=document.createElement('p');n.className='src';n.textContent=s.note;d.append(n)}
  const f=document.createElement('p'); f.className='src'; f.textContent='النصوص منقولة بلفظها من المكتبة الشاملة وموقع quran.com، مع تصحيح أخطاء طباعية ظاهرة، وإعادة «ﷺ» حيث سقطت.'; d.append(f);
  return d;
}

/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const toAscii=s=>String(s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
const numIn=v=>parseInt(toAscii(v),10);
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const dayDiff=(a,b)=>Math.round((new Date(a+'T12:00:00Z')-new Date(b+'T12:00:00Z'))/864e5);
const dayName=d=>{try{return new Intl.DateTimeFormat('ar-JO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
const when=d=>{const n=dayDiff(d,today());return n<=0?'اليوم':n===1?'بكرة':n===2?'بعد بكرة':`بعد ${ar(n)} أيام`};

/* ---------- learning, linking, block review ----------
   Units of the current chapter are learned in order (or as picked). Each day after the new unit, everything learned so far
   in that chapter is recited once together ("ربط"). A finished chapter becomes one block, reviewed on spaced steps:
   blocks[chapter]: {st: stage 1..7, due: date, lap: lapses}. Stage n waits STEPS[n-1] days. */
const STEPS=[1,2,4,7,15,30,60];
const LSK=BOOK.lsk;
// extra: today's added allowance of new units; pick: units chosen to learn next; blockAhead/link: per chapter, the day a review was pulled forward / the linking was done
let S={per:1,goal:10,cards:{},newDay:'',newCount:0,reps:{},log:{},mistW:{},extra:{d:'',n:0},pick:[],blocks:{},blockAhead:{},link:{},cur:''};
function save(){try{localStorage.setItem(LSK,JSON.stringify(S))}catch(e){}}
function load(){try{const v=localStorage.getItem(LSK);return v?JSON.parse(v):null}catch(e){return null}}
// progress saved before chapters existed had a single block and plain-string dates for the first chapter
function migrate(o){const c0=CH[0].id;
  if(o.block){o.blocks={[c0]:o.block};delete o.block}
  if(typeof o.link==='string')o.link=o.link?{[c0]:o.link}:{};
  if(typeof o.blockAhead==='string')o.blockAhead=o.blockAhead?{[c0]:o.blockAhead}:{};
  delete o.ahead; return o}
function rollNew(){if(S.newDay!==today()){S.newDay=today();S.newCount=0}}
function logToday(k){const t=today();S.log[t]=S.log[t]||{n:0,r:0};S.log[t][k]++}
const unitsOf=ch=>CHI[ch].units;
const learnedIds=(ch=CUR)=>unitsOf(ch).filter(u=>S.cards[u.id]).map(u=>u.id);
const allLearned=(ch=CUR)=>unitsOf(ch).every(u=>S.cards[u.id]);
function ensureBlock(ch){if(allLearned(ch)&&!S.blocks[ch])S.blocks[ch]={st:1,due:addDays(today(),1),lap:0}}
function setCur(id){if(!CHI[id])id=CH[0].id;CUR=id;U=unitsOf(id);S.cur=id}
// the next chapter after the current one that is not finished yet
const nextChapter=()=>{const i=CH.findIndex(c=>c.id===CUR);return [...CH.slice(i+1),...CH.slice(0,i)].find(c=>!allLearned(c.id))};
function gradeBlock(ch,g){
  const c=S.blocks[ch]; if(!c)return; delete S.blockAhead[ch];
  if(g==='again'){c.st=1;c.lap=(c.lap||0)+1;c.due=addDays(today(),1)}
  else if(g==='hard'){c.due=addDays(today(),Math.max(1,Math.ceil(STEPS[c.st-1]/2)))}
  else{c.st=Math.min(STEPS.length,c.st+1);c.due=addDays(today(),STEPS[c.st-1])}
  logToday('r'); save();
}
function learn(id){S.cards[id]={d:today()};delete S.reps[id];rollNew();S.newCount++;logToday('n');ensureBlock(CUR);save()}
const extraToday=()=>S.extra.d===today()?S.extra.n:0;
const dueBlocks=()=>CH.filter(c=>{const b=S.blocks[c.id];return b&&(b.due<=today()||S.blockAhead[c.id]===today())});
const linkDue=()=>!allLearned()&&learnedIds().length>=2&&S.link[CUR]!==today();
const unstarted=()=>{const rest=U.filter(u=>!S.cards[u.id]);return [...S.pick.map(id=>UI[id]).filter(u=>u&&U.includes(u)&&!S.cards[u.id]),...rest.filter(u=>!S.pick.includes(u.id))]};
function newList(){rollNew();const left=Math.max(0,S.per+extraToday()-S.newCount);return unstarted().slice(0,left)}
// flexible ward: learn one more today, review a chapter early, or put the current card off until tomorrow
function addNew(id){if(S.extra.d!==today())S.extra={d:today(),n:0};S.extra.n++;if(id){S.pick=[id,...S.pick.filter(x=>x!==id)]}save()}
function postpone(kind,ch){if(kind==='block'){S.blocks[ch].due=addDays(today(),1);delete S.blockAhead[ch]}else if(kind==='link'){S.link[CUR]=today()}else{rollNew();S.newCount++}save()}
const stageTxt=c=>c.st>=STEPS.length?'ثابت':`مرحلة ${ar(c.st)} من ${ar(STEPS.length)}`;
const W=BOOK.unitWord||'حديث';

/* ---------- rendering a unit ---------- */
function words(text,cls){
  const box=document.createElement('span'); box.className='seg '+cls;
  text.split(' ').forEach((w,k,a)=>{
    const s=document.createElement('span'); s.className='w';
    const m=w.match(/^([^ً-ْٰ]?[ً-ْٰ]*)([\s\S]*)$/);
    const h=document.createElement('span'); h.textContent=m[1];
    const r=document.createElement('span'); r.className='rest'; r.textContent=m[2];
    s.append(h,r); box.append(s); if(k<a.length-1)box.append(document.createTextNode(' '));
  });
  return box;
}
function unitEl(u,opts={}){
  const d=document.createElement('div'); d.className='unit'; d.dataset.id=u.id;
  const h=document.createElement('div'); h.className='uhead';
  const l=document.createElement('span'); l.textContent=u.label; h.append(l);
  if(opts.status){const c=S.cards[u.id]; const p=document.createElement('span'); p.className='pill'+(c?'':' new'); p.textContent=c?'محفوظ ✓':'لسا ما بلّشته'; h.append(p)}
  const t=document.createElement('div'); t.className='utext';
  u.segs.forEach(([k,txt],i)=>{t.append(words(txt,'seg-'+k)); if(i<u.segs.length-1)t.append(document.createTextNode(' '))});
  const ws=t.querySelectorAll('.w'); Object.keys(S.mistW).forEach(x=>{const [id,wi]=x.split(':'); if(id===u.id&&ws[+wi])ws[+wi].classList.add('wk')});
  d.append(h,t);
  if(u.gloss&&opts.gloss!==false){const g=document.createElement('div');g.className='gloss';g.innerHTML='معاني: '+u.gloss.map(([a,b])=>`<b>${a}</b>: ${b}`).join(' · ');d.append(g)}
  return d;
}

/* ---------- study modes ---------- */
const MODES=[['full','كامل'],['hint','أول حرف'],['hide','مخفي'],['voice','تسميع بالصوت']];
let mode={today:'full',all:'full'};
function modeBar(key,box,onChange){
  box.replaceChildren();
  MODES.forEach(([m,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',String(mode[key]===m));
    b.addEventListener('click',()=>{if(VS.on)vStop(true);mode[key]=m;onChange()});box.append(b)});
}
function applyMode(el,m){el.classList.remove('m-full','m-hint','m-hide','m-voice','open');el.classList.add('m-'+m)}
document.addEventListener('click',e=>{
  const w=e.target.closest('.w'); if(!w)return; const host=w.closest('.m-hide,.m-voice'); if(!host)return;
  if(host.classList.contains('m-hide'))w.classList.toggle('peek');
  else if(!w.classList.contains('said')){const k=vWords().indexOf(w);if(k>=0){VS.hints.add(k);vUpdate()}}
});

/* ---------- today: one card at a time ---------- */
let voiceHost=null;
// several units shown together, for the linking recitation and the block review
function blockEl(ids){const w=document.createElement('div');w.className='block';ids.forEach(id=>w.append(unitEl(UI[id],{gloss:false})));return w}
function renderToday(){
  const fresh=newList(), due=dueBlocks(), bd=due[0], ld=linkDue();
  $('stNew').textContent=ar(fresh.length); $('stDue').textContent=ar(due.length+(ld?1:0));
  $('stMem').textContent=ar(learnedIds().length); $('stTotal').textContent=ar(U.length);
  const box=$('cardBox'); box.replaceChildren(); voiceHost=null;
  // the chapter review comes first, then today's new unit, then linking what is learned so far
  const kind=bd?'block':fresh.length?'new':ld?'link':null;
  if(!kind){
    const e=document.createElement('div'); e.className='empty';
    const b=S.blocks[CUR], nx=allLearned()&&MULTI?nextChapter():null;
    e.textContent=b?`ما شاء الله، «${CHI[CUR].title}» محفوظ 🤍 · مراجعته الجاية ${when(b.due)} (${stageTxt(b)})`:'خلصت ورد اليوم 🤍 · والجديد الجاي بكرة';
    box.append(e);
    if(nx){const go=document.createElement('button');go.className='btn primary';go.textContent='ابدأ الباب الجاي: «'+nx.title+'»';go.addEventListener('click',()=>{setCur(nx.id);save();renderAll()});box.append(go)}
    box.append(wardActions(null)); updateVoicebar(); return;
  }
  const u=kind==='new'?fresh[0]:null, ids=kind==='block'?unitsOf(bd.id).map(x=>x.id):learnedIds();
  const tag=document.createElement('div'); tag.className='row';
  const p=document.createElement('span'); p.className='pill'+(kind==='new'?' new':'');
  p.textContent=kind==='new'?'جديد · احفظه':kind==='block'?`مراجعة «${bd.title}» كاملًا · ${stageTxt(S.blocks[bd.id])}`:`ربط · سمّع كل اللي حفظته من الباب (${ar(ids.length)})`; tag.append(p);
  const modes=document.createElement('div'); modes.className='modes';
  // a new unit opens in full text, recitations open hidden; the user can switch after that
  const key=kind+(u?u.id:bd?bd.id:CUR);
  if(mode._seen!==key){mode.today=kind==='new'?'full':'hide';mode._seen=key}
  const el=kind==='new'?unitEl(u,{gloss:true}):blockEl(ids); applyMode(el,mode.today); voiceHost=el;
  modeBar('today',modes,renderToday);
  box.append(tag,modes,el);
  if(kind==='new'){
    const n=S.reps[u.id]||0;
    const c=document.createElement('div'); c.className='counter';
    const t=document.createElement('button'); t.className='tap'+(n>=S.goal?' full':''); t.innerHTML=`${ar(n)}<small>من ${ar(S.goal)}</small>`;
    t.addEventListener('click',()=>{S.reps[u.id]=(S.reps[u.id]||0)+1;save();renderToday()});
    const side=document.createElement('div'); side.style.flex='1';
    side.innerHTML='<p class="note" style="margin:0 0 8px">اقرأه كامل، واضغط الدائرة بعد كل قراءة. جرّب «أول حرف» و«مخفي» لما تحس إنه بلّش يثبت.</p>';
    const done=document.createElement('button'); done.className='btn primary'; done.textContent='حفظته ✓'; done.disabled=n<Math.min(3,S.goal);
    done.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';learn(u.id);renderAll()});
    side.append(done); c.append(t,side); box.append(c);
  }else{
    const show=document.createElement('button'); show.className='btn'; show.textContent='اكشف النص';
    show.addEventListener('click',()=>{if(VS.on)vStop(true);el.classList.add('open');applyMode(el,'full')});
    const hint=document.createElement('p'); hint.className='note'; hint.style.margin='0';
    if(kind==='link'){
      hint.textContent='سمّع كل اللي حفظته من أول الباب لآخر '+W+' حفظته، مرة وحدة متصلة، بصوتك أو بقلبك. هاد بيربط المحفوظ ببعضه.';
      const ok=document.createElement('button'); ok.className='btn primary'; ok.textContent='سمّعته ✓';
      ok.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';doneLink();renderAll()});
      box.append(show,hint,ok);
    }else{
      hint.textContent='سمّع الباب كامل من حفظك بالترتيب، اكشفه، وبعدين قيّم حالك بصدق.';
      const g=document.createElement('div'); g.className='grades';
      [['again','نسيت','بكرة','bad'],['hard','صعب',`بعد ${ar(Math.max(1,Math.ceil(STEPS[S.blocks[bd.id].st-1]/2)))} يوم`,'gold'],['good','تمام',`بعد ${ar(STEPS[Math.min(STEPS.length,S.blocks[bd.id].st+1)-1])} يوم`,'primary']].forEach(([k,l,sub,c])=>{
        const b=document.createElement('button'); b.className='btn '+c; b.innerHTML=`${l}<small>${sub}</small>`;
        b.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';gradeBlock(bd.id,k);renderAll()}); g.append(b)});
      box.append(show,hint,g);
    }
  }
  box.append(wardActions(kind,bd&&bd.id));
  updateVoicebar();
}
function doneLink(){S.link[CUR]=today();logToday('r');save()}
const goToday=()=>document.querySelector('.tabs button[data-v="today"]').click();
function actBtn(txt,fn){const b=document.createElement('button');b.className='btn';b.textContent=txt;b.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';fn();renderAll()});return b}
function wardActions(kind,ch){
  const box=document.createElement('div'); box.className='ward';
  const h=document.createElement('div'); h.className='eyebrow'; h.textContent='تحكّم بورد اليوم'; box.append(h);
  const row=document.createElement('div'); row.className='row';
  if(unstarted().length>newList().length)row.append(actBtn('➕ زيد محفوظ جديد',()=>addNew()));
  const due=dueBlocks().map(c=>c.id);
  if(S.blocks[CUR]&&!due.includes(CUR))row.append(actBtn('🔁 راجع الباب كامل اليوم',()=>{S.blockAhead[CUR]=today();save()}));
  if(kind)row.append(actBtn('⏭ أجّل هاد لبكرة',()=>postpone(kind,ch)));
  if(!row.childElementCount)return document.createTextNode('');
  box.append(row); return box;
}
function renderAll(){
  renderToday();
  const list=$('allList'); list.replaceChildren();
  const st=document.createElement('div'); st.className='chapstat';
  const b=S.blocks[CUR];
  st.textContent=b?`الباب محفوظ كامل ✓ · مراجعته: ${stageTxt(b)} · موعدها ${when(b.due)}`:`محفوظ ${ar(learnedIds().length)} من ${ar(U.length)} · لما تختم الباب بيصير مراجعة كاملة له ككتلة وحدة`;
  list.append(st);
  U.forEach(u=>{const el=unitEl(u,{status:true});applyMode(el,mode.all);
    const c=S.cards[u.id], acts=document.createElement('div'); acts.className='row';
    if(!c)acts.append(actBtn('➕ احفظه اليوم',()=>{addNew(u.id);goToday()}));
    if(acts.childElementCount)el.append(acts);
    const sh=sharhEl(u.id); if(sh)el.append(sh);
    list.append(el)});
  if(active==='all')voiceHost=list;
  modeBar('all',document.querySelector('.modes[data-list="all"]'),renderAll);
  const lg=$('dayLog'); lg.replaceChildren();
  const days=Object.keys(S.log).sort().reverse();
  if(!days.length){const e=document.createElement('div');e.className='empty';e.textContent='سيظهر هنا كل يوم بتحفظ أو بتراجع فيه.';lg.append(e)}
  days.slice(0,60).forEach(d=>{const x=document.createElement('div');const a=document.createElement('span');a.textContent=dayName(d);const b=document.createElement('span');b.className='note';b.textContent=`جديد ${ar(S.log[d].n)} · مراجعة ${ar(S.log[d].r)}`;x.append(a,b);lg.append(x)});
  renderChapters();
  updateVoicebar();
}

/* ---------- chapters: the current one, and a list to switch between them ---------- */
function chapterStatus(c){const n=learnedIds(c.id).length,b=S.blocks[c.id];return b?'محفوظ ✓ · مراجعته '+when(b.due):n?`حافظ ${ar(n)} من ${ar(c.units.length)}`:'لسا ما بلّشته'}
function renderChapters(){
  if(!MULTI)return;
  if($('setup').hidden&&$('welcome').hidden)$('chapBar').hidden=false;
  const c=CHI[CUR]; $('cTitle').textContent=c.title; $('cBy').textContent=(c.group?c.group+' · ':'')+ar(c.units.length)+' '+(BOOK.unitWord==='فقرة'?'فقرة':'وحدة')+' · '+chapterStatus(c);
  const list=$('chapList'); list.replaceChildren(); let group=null;
  CH.forEach(ch=>{
    if(ch.group&&ch.group!==group){group=ch.group;const g=document.createElement('div');g.className='sec';g.textContent=group;list.append(g)}
    const row=document.createElement('div'); row.className='prow'+(ch.id===CUR?' cur':'');
    const info=document.createElement('div'); info.className='pmeta'; const t=document.createElement('b'); t.textContent=ch.title; const by=document.createElement('small'); by.textContent=ar(ch.units.length)+' · '+chapterStatus(ch); info.append(t,by);
    const acts=document.createElement('div'); acts.className='pacts';
    if(ch.id!==CUR){const go=document.createElement('button');go.className='btn';go.textContent='احفظه هلأ';go.addEventListener('click',()=>{setCur(ch.id);save();$('chapCard').hidden=true;renderAll();scrollTo(0,0)});acts.append(go)}
    else{const x=document.createElement('span');x.className='pill new';x.textContent='الحالي';acts.append(x)}
    row.append(info,acts); list.append(row)});
}
if(MULTI){
  $('chapBtn').addEventListener('click',()=>{$('chapCard').hidden=!$('chapCard').hidden;renderChapters()});
  $('closeChap').addEventListener('click',()=>$('chapCard').hidden=true);
}

/* ---------- voice recitation (same matching as the Miyeea page) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const STANDALONE=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
const VS={on:false,rec:null,finals:[],prev:[],lang:'ar-JO',interim:'',hints:new Set()};
const norm=w=>w.replace(/[ً-ٰٟۖ-ۭـ(){}«»﴿﴾\[\]:؛،.؟!"]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي');
const nz=w=>norm(toAscii(w)).replace(/[^ء-ي0-9]/g,'');
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=[...Array(n+1).keys()];for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
const strip=x=>x.replace(/^[وف](?=..)/,'').replace(/^(ال|لل|بال)(?=..)/,'');
function sim(t,e){
  if(!t||!e)return false; if(t===e)return true;
  const a=strip(t),b=strip(e); if(a===b)return true;
  const L=Math.max(a.length,b.length), d=lev(a,b);
  if(L<=3)return d<=1&&Math.min(a.length,b.length)>=2;
  return d/L<=0.34;
}
const vWords=()=>voiceHost?[...voiceHost.querySelectorAll('.w')].filter(w=>nz(w.textContent)):[];
function align(tokens,exp){
  const st=new Array(exp.length).fill(0); let p=0;
  const skipHints=()=>{while(p<exp.length&&VS.hints.has(p)){st[p]=3;p++}};
  for(const t of tokens){
    skipHints(); if(p>=exp.length)break;
    if(sim(t,exp[p])){st[p]=1;p++;continue}
    if(p+1<exp.length&&sim(t,exp[p]+exp[p+1])){st[p]=st[p+1]=1;p+=2;continue}
    if(strip(t).length>=3){let k=-1;for(let j=1;j<=3&&p+j<exp.length;j++){if(sim(t,exp[p+j])){k=p+j;break}}
      if(k>0){for(let j=p;j<k;j++)st[j]=VS.hints.has(j)?3:2;st[k]=1;p=k+1}}
  }
  skipHints(); return {st,p};
}
let lastRes={st:[],p:0};
function vUpdate(){
  const ws=vWords(); if(!ws.length)return;
  const raw=(VS.finals.join(' ')+' '+VS.interim).trim();
  const r=align(raw.split(/\s+/).map(nz).filter(Boolean),ws.map(w=>nz(w.textContent))); lastRes=r;
  ws.forEach((w,i)=>{w.classList.toggle('said',r.st[i]>0);w.classList.toggle('miss',r.st[i]===2);w.classList.toggle('hinted',r.st[i]===3);w.classList.toggle('cursor',VS.on&&i===r.p)});
  const said=r.st.filter(x=>x>0).length, bad=r.st.filter(x=>x===2).length;
  $('vCount').textContent=`${ar(said)} / ${ar(ws.length)} كلمة`+(bad?` · ${ar(bad)} غلط`:'');
  $('vHeard').textContent=raw?('سمعت: '+raw.split(/\s+/).slice(-5).join(' ')):(VS.on?'بسمعك… ابدأ القراءة':'');
  const cur=ws[r.p]; if(VS.on&&cur&&cur.getBoundingClientRect().bottom>innerHeight-170)cur.scrollIntoView({block:'center',behavior:'smooth'});
  if(VS.on&&r.p>=ws.length)vStop(false);
}
const vMsg=s=>$('vMsg').textContent=s||'';
function vReset(){VS.finals=[];VS.prev=[];VS.interim='';VS.hints.clear();vMsg('');lastRes={st:[],p:0};vUpdate()}
function updateVoicebar(){
  const on=(active==='today'&&mode.today==='voice'&&voiceHost)||(active==='all'&&mode.all==='voice');
  $('voicebar').hidden=!on||!$('setup').hidden||!$('welcome').hidden; if(on){vReset()}
}
function vStart(){
  if(!SR){vMsg(IOS?'افتح الرابط بسفاري: كروم على الآيفون ما بيدعم التعرّف على الصوت.':'المتصفح هذا ما بيدعم التعرّف على الصوت. جرّب Chrome أو Safari.');return}
  if(lastRes.p>=vWords().length)vReset();
  VS.prev=[...VS.finals];
  if(!vRecStart()){vMsg('ما قدرت أشغّل المايك.');return}
  VS.on=true; $('vMic').textContent='⏹ وقّف';$('vMic').classList.add('live');vMsg('');vUpdate();
}
// one recognizer per session; Safari ends sessions often, so each end starts a fresh one
function vRecStart(){
  const r=new SR(); VS.rec=r; r.lang=VS.lang; r.continuous=true; r.interimResults=true; r.maxAlternatives=1;
  let txt='';
  r.onresult=e=>{if(VS.rec!==r)return;
    // rebuild the whole session from e.results: iOS repeats or grows earlier results instead of using resultIndex
    const parts=[];let fin='',it='';
    for(let i=0;i<e.results.length;i++){const x=e.results[i],t=x[0].transcript.trim();if(!t)continue;
      const last=parts[parts.length-1];
      if(last&&(t.startsWith(last.t)||last.t.startsWith(t)))parts[parts.length-1]={t:t.length>=last.t.length?t:last.t,f:x.isFinal||last.f};
      else parts.push({t,f:x.isFinal})}
    parts.forEach(p=>{if(p.f)fin+=p.t+' ';else it+=p.t+' '});
    txt=(fin+it).trim(); VS.finals=[...VS.prev,fin.trim()].filter(Boolean); VS.interim=it; vUpdate()};
  r.onerror=e=>{if(VS.rec!==r)return;
    if(e.error==='language-not-supported'&&VS.lang!=='ar-SA'){VS.lang='ar-SA';return}
    if(e.error==='not-allowed'||e.error==='service-not-allowed'){
      vMsg(IOS?(STANDALONE?'التعرّف على الصوت ما بيشتغل من أيقونة الشاشة الرئيسية بهالإصدار. افتح الرابط بسفاري.':'اسمح لسفاري بالمايك، وتأكد إن «الإملاء» شغّال: الإعدادات ← عام ← لوحة المفاتيح ← تفعيل الإملاء.'):'لازم تسمح للمتصفح يستخدم المايك.');
      vStop(true)}
    else if(e.error==='network'){vMsg('التعرّف على الصوت بده نت.')}};
  r.onend=()=>{if(VS.rec!==r)return;
    if(txt)VS.prev.push(txt); VS.finals=[...VS.prev]; VS.interim='';
    if(VS.on)setTimeout(()=>{if(VS.on&&VS.rec===r&&!vRecStart()){vMsg('وقف المايك، اضغط ابدأ مرة ثانية.');vStop(false)}},60)};
  try{r.start();return true}catch(e){return false}
}
function vStop(silent){
  if(!VS.on)return;
  VS.on=false; try{VS.rec&&VS.rec.stop()}catch(_){}
  if(VS.interim){VS.finals.push(VS.interim);VS.interim=''}
  $('vMic').textContent='🎤 ابدأ';$('vMic').classList.remove('live');
  const ws=vWords(); vUpdate(); const r=lastRes; if(silent)return;
  const said=r.st.filter(x=>x===1).length; if(!said)return;
  const badW=[]; r.st.forEach((s,i)=>{if((s===2||s===3)&&ws[i]){const u=ws[i].closest('.unit');badW.push(u.dataset.id+':'+[...u.querySelectorAll('.w')].indexOf(ws[i]))}});
  badW.forEach(k=>S.mistW[k]=(S.mistW[k]||0)+1); if(badW.length)save();
  vMsg(badW.length?`غلطت بـ ${ar(badW.length)} كلمة، تعلّمت بخط أحمر.`:r.p>=ws.length?'ما شاء الله، سمّعته كامل بدون غلط 🤍':`وقفت عند الكلمة ${ar(r.p+1)} من ${ar(ws.length)}، بدون أغلاط لحد هون.`);
}
$('vMic').addEventListener('click',()=>{VS.on?vStop(false):vStart()});
$('vReset').addEventListener('click',()=>{if(VS.on)vStop(true);vReset()});
$('vHint').addEventListener('click',()=>{const ws=vWords();if(lastRes.p<ws.length){VS.hints.add(lastRes.p);vUpdate()}});

/* ---------- screens, tabs, settings, backup ---------- */
let active='today';
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  active=b.dataset.v; ['today','all','log'].forEach(v=>$('v-'+v).hidden=v!==active);
  if(VS.on)vStop(true); voiceHost=active==='all'?$('allList'):$('cardBox').querySelector('.unit'); updateVoicebar();
}));
function showScreen(sc,canCancel){
  const main=sc==='main';
  $('setup').hidden=sc!=='setup'; $('welcome').hidden=sc!=='welcome';
  ['mainTabs','foot'].forEach(id=>$(id).hidden=!main); if(MULTI){$('chapBar').hidden=!main;if(!main)$('chapCard').hidden=true}
  ['today','all','log'].forEach(v=>$('v-'+v).hidden=!main||v!==active);
  $('backup').hidden=true; $('cancelSetup').hidden=!canCancel;
  if(VS.on)vStop(true); updateVoicebar(); if(!main)scrollTo(0,0);
}
$('setupBtn').addEventListener('click',()=>{$('perIn').value=S.per;$('goalIn').value=S.goal;showScreen('setup',true)});
$('cancelSetup').addEventListener('click',()=>showScreen('main'));
$('saveSetup').addEventListener('click',()=>{
  S.per=Math.max(1,Math.min(10,numIn($('perIn').value)||1)); S.goal=Math.max(1,Math.min(100,numIn($('goalIn').value)||10));
  save(); renderAll(); showScreen('main');
});
$('helpBtn').addEventListener('click',()=>{$('welcomeGo').textContent='رجوع';showScreen('welcome')});
$('welcomeGo').addEventListener('click',()=>{if(load())showScreen('main');else{$('perIn').value=S.per;$('goalIn').value=S.goal;showScreen('setup')}});
const toCode=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const fromCode=c=>JSON.parse(decodeURIComponent(escape(atob(c.replace(/\s+/g,'')))));
$('exportBtn').addEventListener('click',()=>{$('exportOut').value=toCode({app:'mutoon',book:BOOK.key,v:2,S});$('backup').hidden=false;$('backup').scrollIntoView({block:'center',behavior:'smooth'})});
$('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('exportOut').value)}catch(e){$('exportOut').select();document.execCommand('copy')}$('copyBtn').textContent='تم النسخ ✓';setTimeout(()=>$('copyBtn').textContent='انسخ الكود',2000)});
$('closeBackup').addEventListener('click',()=>$('backup').hidden=true);
$('importBtn').addEventListener('click',()=>{
  try{const o=fromCode($('importIn').value); if(o.app!=='mutoon'||o.book!==BOOK.key||!o.S||!o.S.cards)throw 0;
    S={...S,...migrate(o.S)}; setCur(S.cur); save(); renderAll(); $('importIn').value=''; showScreen('main')}
  catch(e){$('importBtn').textContent='الكود مش صحيح، أو لكتاب ثاني';setTimeout(()=>$('importBtn').textContent='استرجع التقدم',3000)}
});

const saved=load();
if(saved){S={...S,...migrate(saved)};setCur(S.cur);CH.forEach(c=>ensureBlock(c.id));renderAll();showScreen('main')}
else{setCur(CH[0].id);renderAll();$('welcomeGo').textContent='يلّا نبلّش';showScreen('welcome')}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
