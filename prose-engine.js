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
const when=d=>{const n=dayDiff(d,today());return n<=0?'اليوم':n===1?'بكرة':n===2?'بعد بكرة':`بعد ${ar(n)} ${n<=10?'أيام':'يوم'}`};

/* ---------- learning, linking, block review ----------
   Units of the current chapter are learned in order (or as picked). Each day after the new unit, everything learned so far
   in that chapter is recited once together ("ربط"). A finished chapter becomes one block, reviewed on spaced steps:
   blocks[chapter] is one FSRS card (srs.js): {s, d, last, due, lap, reps}. */
const inDays=n=>n<=1?'بكرة':n===2?'بعد يومين':`بعد ${ar(n)} ${n<=10?'أيام':'يوم'}`;
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
function ensureBlock(ch){if(allLearned(ch)&&!S.blocks[ch])S.blocks[ch]=SRS.fresh(today())}
function setCur(id){if(!CHI[id])id=CH[0].id;CUR=id;U=unitsOf(id);S.cur=id}
// the next chapter after the current one that is not finished yet
const nextChapter=()=>{const i=CH.findIndex(c=>c.id===CUR);return [...CH.slice(i+1),...CH.slice(0,i)].find(c=>!allLearned(c.id))};
function gradeBlock(ch,g){
  const c=S.blocks[ch]; if(!c)return; delete S.blockAhead[ch]; delete c.old;
  SRS.review(c,g,today(),ch);
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
const stageTxt=c=>SRS.label(c);
// a chapter that turned out forgotten goes back to learning, unit by unit
function relearn(ch){unitsOf(ch).forEach(u=>{delete S.cards[u.id];delete S.reps[u.id]});delete S.blocks[ch];delete S.blockAhead[ch];delete S.link[ch];setCur(ch);save()}

/* ---------- old memorisation: chapters known before using the site ----------
   Fully known chapters become blocks right away. Their first reviews are spread over the coming days, at most `cap` reviews a day
   counting the ones already due, so a long list never lands on one day. Strength sets the starting stage. Partly known chapters
   get their first units marked as learned and continue from there. */

function spread(dues,n,cap){
  const cnt={}; dues.forEach(d=>{const k=d<today()?today():d;cnt[k]=(cnt[k]||0)+1});
  const out=[]; let d=today();
  for(let i=0;i<n;i++){while((cnt[d]||0)>=cap)d=addDays(d,1);out.push(d);cnt[d]=(cnt[d]||0)+1}
  return out;
}
function oldRow(ch){
  const row=document.createElement('div'); row.className='prow';
  const info=document.createElement('div'); info.className='pmeta'; const t=document.createElement('b'); t.textContent=ch.title;
  const by=document.createElement('small'); by.textContent=ar(ch.units.length)+' · '+chapterStatus(ch); info.append(t,by); row.append(info);
  if(allLearned(ch.id)){const x=document.createElement('span');x.className='pill new';x.textContent='محفوظ ✓';row.append(x);return row}
  const sel=document.createElement('select'); sel.className='oldsel'; sel.dataset.ch=ch.id; const n=learnedIds(ch.id).length;
  const opt=(v,l)=>{const o=document.createElement('option');o.value=v;o.textContent=l;sel.append(o)};
  opt('',n?'زي ما هو':'مش حافظه'); opt('all','حافظه كامل');
  ch.units.slice(n,-1).forEach((u,k)=>opt(String(n+k+1),'لحد: '+u.label));
  row.append(sel); return row;
}
function openOld(first){
  const list=$('oldList'); list.replaceChildren(); let box=list, gname=null;
  CH.forEach(ch=>{
    if(ch.group&&ch.group!==gname){gname=ch.group;const d=document.createElement('details');d.className='cgroup';const sm=document.createElement('summary');sm.textContent=gname;d.append(sm);list.append(d);box=d}
    box.append(oldRow(ch))});
  $('oldSkip').textContent=first?'ما عندي محفوظ قديم، ببلّش من جديد':'رجوع'; $('oldMsg').textContent='';
  showScreen('old');
}
function applyOld(){
  const str=$('oldStr').value, cap=Math.max(1,Math.min(20,numIn($('oldCap').value)||2));
  const full=[], part=[];
  document.querySelectorAll('#oldList select').forEach(s=>{const v=s.value,ch=s.dataset.ch; if(v==='all')full.push(ch); else if(v)part.push([ch,+v])});
  if(!full.length&&!part.length){$('oldMsg').textContent='ما علّمت ولا باب. اختر «حافظه كامل» أو «لحد…» جنب الأبواب اللي حافظها.';return}
  const dues=spread(Object.values(S.blocks).map(b=>b.due),full.length,cap);
  full.forEach((ch,i)=>{unitsOf(ch).forEach(u=>{if(!S.cards[u.id])S.cards[u.id]={d:today(),old:1}}); S.blocks[ch]=SRS.known(str,today(),dues[i])});
  part.forEach(([ch,k])=>unitsOf(ch).slice(0,k).forEach(u=>{if(!S.cards[u.id])S.cards[u.id]={d:today(),old:1}}));
  // carry on learning in a partly known chapter, unless the current one is already under way
  if(part.length&&(allLearned()||!learnedIds().length||full.includes(CUR)))setCur(part[0][0]);
  else if(allLearned()){const nx=nextChapter();if(nx)setCur(nx.id)}
  save(); renderAll(); showScreen('main');
  const last=dues[dues.length-1];
  $('cardBox').prepend(Object.assign(document.createElement('div'),{className:'chapstat',textContent:
    (full.length?`انضاف ${full.length===1?"باب واحد":full.length===2?"بابين":ar(full.length)+(full.length<=10?" أبواب":" بابًا")} للمراجعة، أولها ${when(dues[0])}`+(last!==dues[0]?` وآخرها ${when(last)}.`:'.'):'')+(part.length?` وعلّمت المحفوظ من ${part.length===1?"باب":ar(part.length)+" أبواب"}، وبتكمل حفظه من وين وقفت.`:'')}));
}
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
  d.append(h,t);
  if(u.gloss&&opts.gloss!==false){const g=document.createElement('div');g.className='gloss';g.innerHTML='معاني: '+u.gloss.map(([a,b])=>`<b>${a}</b>: ${b}`).join(' · ');d.append(g)}
  return d;
}

/* ---------- study modes ---------- */
const MODES=[['full','كامل'],['fade','إخفاء تدريجي'],['reveal','كلمة كلمة'],['hide','مخفي'],['voice','تسميع بالصوت']];
let mode={today:'full',all:'full'};
function modeBar(key,box,onChange){
  box.replaceChildren();
  MODES.forEach(([m,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',String(mode[key]===m));
    b.addEventListener('click',()=>{if(VS.on)vStop(true);window.UI.reveal.stop();mode[key]=m;onChange()});box.append(b)});
  // the fading mode adds its level control under the buttons
  if(mode[key]==='fade'){const fb=window.UI.fadeBar(onChange);fb.style.gridColumn='1/-1';box.append(fb)}
}
function applyMode(el,m){el.classList.remove('m-full','m-hint','m-fade','m-reveal','m-hide','m-voice','open');el.classList.add('m-'+m);if(m==='fade')window.UI.fade(el,window.UI.fadeLevel())}
document.addEventListener('click',e=>{
  // in voice mode, tapping a passage's heading starts the recitation there
  const hd=e.target.closest('.uhead'); if(hd&&hd.closest('.m-voice')){const first=hd.closest('.unit').querySelector('.w'),k=vWords().indexOf(first);
    if(k>=0){if(VS.on)vStop(true);VS.start=k;vReset();window.UI.toast('التسميع بيبلّش من «'+hd.firstChild.textContent+'»')}return}
  const w=e.target.closest('.w'); if(!w)return;
  if(w.classList.contains('fz')&&w.closest('.m-fade')){w.classList.toggle('peek');return}
  const host=w.closest('.m-hide,.m-voice'); if(!host)return;
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
    if(MULTI&&allLearned()){const pick=document.createElement('button');pick.className='btn';pick.textContent='اختر باب ثاني';pick.addEventListener('click',()=>{renderChapters();$('chapCard').hidden=false;$('chapCard').scrollIntoView({block:'start',behavior:'smooth'})});box.append(pick)}
    box.append(wardActions(null)); updateVoicebar(); return;
  }
  const u=kind==='new'?fresh[0]:null, ids=kind==='block'?unitsOf(bd.id).map(x=>x.id):learnedIds();
  const tag=document.createElement('div'); tag.className='row';
  const p=document.createElement('span'); p.className='pill'+(kind==='new'?' new':'');
  p.textContent=kind==='new'?'جديد · احفظه':kind==='block'?`مراجعة «${bd.title}» كاملًا · ${S.blocks[bd.id].old?'محفوظ قديم، أول مراجعة':stageTxt(S.blocks[bd.id])}`:`ربط · سمّع كل اللي حفظته من الباب (${ar(ids.length)})`; tag.append(p);
  const modes=document.createElement('div'); modes.className='modes';
  // a new unit opens in full text, recitations open hidden; the user can switch after that
  const key=kind+(u?u.id:bd?bd.id:CUR);
  if(mode._seen!==key){mode.today=kind==='new'?'full':'hide';mode._seen=key}
  const el=kind==='new'?unitEl(u,{gloss:true}):blockEl(ids); applyMode(el,mode.today); voiceHost=el;
  modeBar('today',modes,renderToday);
  box.append(tag,modes,el);
  // word-by-word self-recitation runs on the card shown, while the today tab is open
  if(mode.today==='reveal'&&active==='today')window.UI.reveal.start(el);
  if(kind==='new'){
    const n=S.reps[u.id]||0;
    const c=document.createElement('div'); c.className='counter';
    const t=document.createElement('button'); t.className='tap'+(n>=S.goal?' full':''); t.dataset.fab=''; t.innerHTML=`${ar(n)}<small>من ${ar(S.goal)}</small>`;
    t.addEventListener('click',()=>{S.reps[u.id]=(S.reps[u.id]||0)+1;save();renderToday()});
    const side=document.createElement('div'); side.style.flex='1';
    side.innerHTML='<p class="note" style="margin:0 0 8px">اقرأه كامل، واضغط الدائرة بعد كل قراءة. جرّب «إخفاء تدريجي» و«كلمة كلمة» لما تحس إنه بلّش يثبت.</p>';
    const done=document.createElement('button'); done.className='btn primary'; done.textContent='حفظته ✓'; done.disabled=n<Math.min(3,S.goal);
    done.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';snap('حفظت '+u.label);learn(u.id);renderAll();undoToast('حفظته ✓')});
    side.append(done); c.append(t,side); box.append(c);
  }else{
    const show=document.createElement('button'); show.className='btn'; show.textContent='اكشف النص';
    show.addEventListener('click',()=>{if(VS.on)vStop(true);el.classList.add('open');applyMode(el,'full')});
    const hint=document.createElement('p'); hint.className='note'; hint.style.margin='0';
    if(kind==='link'){
      hint.textContent='سمّع كل اللي حفظته من أول الباب لآخر '+W+' حفظته، مرة وحدة متصلة، بصوتك أو بقلبك. هاد بيربط المحفوظ ببعضه.';
      const ok=document.createElement('button'); ok.className='btn primary'; ok.textContent='سمّعته ✓';
      ok.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';snap('سمّعت الربط');doneLink();renderAll();undoToast('سمّعته ✓')});
      box.append(show,hint,ok);
    }else{
      hint.textContent='سمّع الباب كامل من حفظك بالترتيب، اكشفه، وبعدين قيّم حالك بصدق.';
      const g=document.createElement('div'); g.className='grades';
      const pv=SRS.preview(S.blocks[bd.id],today());
      [['again','نسيت',inDays(pv.again),'bad'],['hard','صعب',inDays(pv.hard),'gold'],['good','تمام',inDays(pv.good),'primary']].forEach(([k,l,sub,c])=>{
        const b=document.createElement('button'); b.className='btn '+c; b.innerHTML=`${l}<small>${sub}</small>`;
        b.addEventListener('click',()=>{if(VS.on)vStop(true);mode._seen='';snap('قيّمت مراجعة «'+bd.title+'»');gradeBlock(bd.id,k);renderAll();undoToast('انسجّل التقييم: '+l)}); g.append(b)});
      box.append(show,hint,g);
    }
  }
  box.append(wardActions(kind,bd&&bd.id));
  updateVoicebar();
}
/* ---------- undo: each step that changes progress is snapshotted first, and can be taken back ---------- */
const UNDO=[];
function snap(label){UNDO.push({label,s:JSON.stringify(S)});if(UNDO.length>30)UNDO.shift()}
function undo(){const u=UNDO.pop();if(!u)return;S=JSON.parse(u.s);setCur(S.cur);mode._seen='';save();renderAll();window.UI.toast('رجعت عن: '+u.label)}
const undoToast=label=>window.UI.toast(label,{label:'تراجع',fn:undo});
function doneLink(){S.link[CUR]=today();logToday('r');save()}
const goToday=()=>document.querySelector('.tabs button[data-v="today"]').click();
function actBtn(txt,fn){const b=document.createElement('button');b.className='btn';b.textContent=txt;b.addEventListener('click',()=>{snap(txt.replace(/^\S+\s/,''));if(VS.on)vStop(true);mode._seen='';fn();renderAll()});return b}
function wardActions(kind,ch){
  const box=document.createElement('div'); box.className='ward';
  const h=document.createElement('div'); h.className='eyebrow'; h.textContent='تحكّم بورد اليوم'; box.append(h);
  const row=document.createElement('div'); row.className='row';
  if(unstarted().length>newList().length)row.append(actBtn('➕ زيد محفوظ جديد',()=>addNew()));
  const due=dueBlocks().map(c=>c.id);
  if(S.blocks[CUR]&&!due.includes(CUR))row.append(actBtn('🔁 راجع الباب كامل اليوم',()=>{S.blockAhead[CUR]=today();save()}));
  if(kind)row.append(actBtn('⏭ أجّل هاد لبكرة',()=>postpone(kind,ch)));
  if(kind==='block')row.append(actBtn('↩︎ نسيته، رجّعه للحفظ',()=>{if(confirm('بدك ترجع تحفظ «'+CHI[ch].title+'» فقرة فقرة من جديد؟'))relearn(ch)}));
  if(UNDO.length){const u=document.createElement('button');u.className='btn';u.textContent='↶ تراجع عن «'+UNDO[UNDO.length-1].label+'»';u.addEventListener('click',undo);row.append(u)}
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
    else acts.append(actBtn('↩︎ رجّعه للحفظ',()=>{delete S.cards[u.id];const ch=CH.find(x=>x.units.includes(u));if(ch){delete S.blocks[ch.id];delete S.blockAhead[ch.id]}save()}));
    if(acts.childElementCount)el.append(acts);
    const sh=sharhEl(u.id); if(sh)el.append(sh);
    list.append(el)});
  if(active==='all')voiceHost=list;
  if(mode.all==='reveal'&&active==='all')window.UI.reveal.start(list);
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
  if($('setup').hidden&&$('welcome').hidden&&$('oldMem').hidden)$('chapBar').hidden=false;
  const c=CHI[CUR]; $('cTitle').textContent=c.title; $('cBy').textContent=(c.group?c.group+' · ':'')+ar(c.units.length)+' '+(BOOK.unitWord==='فقرة'?'فقرة':'وحدة')+' · '+chapterStatus(c);
  // chapters grouped under their book («كتاب»), each group folds; the current one starts open
  const list=$('chapList'); list.replaceChildren(); let box=list, gname=null;
  CH.forEach(ch=>{
    if(ch.group&&ch.group!==gname){gname=ch.group; const d=document.createElement('details'); d.className='cgroup';
      const mine=CH.filter(x=>x.group===gname), done=mine.filter(x=>allLearned(x.id)).length;
      d.open=mine.some(x=>x.id===CUR); const sm=document.createElement('summary'); sm.textContent=gname+' ('+ar(mine.length)+(done?' · ختمت '+ar(done):'')+')';
      d.append(sm); list.append(d); box=d}
    const row=document.createElement('div'); row.className='prow'+(ch.id===CUR?' cur':'');
    const info=document.createElement('div'); info.className='pmeta'; const t=document.createElement('b'); t.textContent=ch.title; const by=document.createElement('small'); by.textContent=ar(ch.units.length)+' · '+chapterStatus(ch); info.append(t,by);
    const acts=document.createElement('div'); acts.className='pacts';
    if(ch.id!==CUR){const go=document.createElement('button');go.className='btn';go.textContent='احفظه هلأ';go.addEventListener('click',()=>{setCur(ch.id);save();$('chapCard').hidden=true;renderAll();scrollTo(0,0)});acts.append(go)}
    else{const x=document.createElement('span');x.className='pill new';x.textContent='الحالي';acts.append(x)}
    row.append(info,acts); box.append(row)});
}
// the setup screen's chapter picker, grouped like the list
function fillChapPick(){
  if(!MULTI)return; $('chapPick').hidden=false; const sel=$('chapIn'); sel.replaceChildren(); let og=null, gname=null;
  CH.forEach(ch=>{if(ch.group!==gname){gname=ch.group;og=document.createElement('optgroup');og.label=gname||'';sel.append(og)}
    const o=document.createElement('option');o.value=ch.id;o.textContent=ch.title+(allLearned(ch.id)?' ✓':'');og.append(o)});
  sel.value=CUR;
}
if(MULTI){
  $('chapBtn').addEventListener('click',()=>{$('chapCard').hidden=!$('chapCard').hidden;renderChapters()});
  $('closeChap').addEventListener('click',()=>$('chapCard').hidden=true);
}

/* ---------- voice recitation (same matching as the Miyeea page) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const STANDALONE=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
const VS={on:false,rec:null,finals:[],prev:[],lang:localStorage.getItem('ui_asrLang')||VOICE.LANGS[0],interim:'',hints:new Set(),start:0};
const vWords=()=>voiceHost?[...voiceHost.querySelectorAll('.w')].filter(w=>VOICE.norm(w.textContent)):[];
const vExp=()=>vWords().map(w=>({n:w.textContent}));
let lastRes={st:[],p:0};
function vUpdate(){
  const ws=vWords(); if(!ws.length)return;
  const raw=(VS.finals.join(' ')+' '+VS.interim).trim();
  const r=VOICE.align(raw.split(/\s+/).filter(Boolean),vExp(),VS.hints,VS.start); lastRes=r;
  ws.forEach((w,i)=>{w.classList.toggle('said',r.st[i]>0);w.classList.toggle('pre',r.st[i]===4);w.classList.toggle('miss',r.st[i]===2);w.classList.toggle('hinted',r.st[i]===3);w.classList.toggle('cursor',VS.on&&i===r.p)});
  const said=r.st.filter(x=>x>0).length, bad=r.st.filter(x=>x===2).length;
  $('vCount').textContent=`${ar(r.st.filter(x=>x>0&&x<4).length)} / ${ar(ws.length-VS.start)} كلمة`+(bad?` · فاتك ${ar(bad)}`:'');
  $('vHeard').textContent=raw?('سمعت: '+raw.split(/\s+/).slice(-5).join(' ')):(VS.on?'بسمعك… ابدأ القراءة':'');
  const cur=ws[r.p]; if(VS.on&&cur&&cur.getBoundingClientRect().bottom>innerHeight-170)cur.scrollIntoView({block:'center',behavior:'smooth'});
  if(VS.on&&r.p>=ws.length)vStop(false);
}
const vMsg=s=>$('vMsg').textContent=s||'';
function vReset(){VS.finals=[];VS.prev=[];VS.interim='';VS.hints.clear();vMsg('');lastRes={st:[],p:0};vUpdate()}
function updateVoicebar(){
  const on=(active==='today'&&mode.today==='voice'&&voiceHost)||(active==='all'&&mode.all==='voice');
  $('voicebar').hidden=!on||!$('setup').hidden||!$('welcome').hidden||!$('oldMem').hidden; if(on){vReset()}
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
  const r=new SR(); VS.rec=r; try{VS.lang=localStorage.getItem('ui_asrLang')||VS.lang}catch(_){} r.lang=VS.lang; r.continuous=true; r.interimResults=true; r.maxAlternatives=3;
  let txt='';
  r.onresult=e=>{if(VS.rec!==r)return;
    // rebuild the whole session from e.results: iOS repeats or grows earlier results instead of using resultIndex.
    // When the recognizer offers alternatives, keep the one that carries the recitation furthest
    const exp=vExp(), base=VS.prev.join(' ').split(/\s+/).filter(Boolean), parts=[];let fin='',it='';
    for(let i=0;i<e.results.length;i++){const x=e.results[i],alts=[];for(let k=0;k<x.length;k++){const a=x[k].transcript.trim();if(a)alts.push(a)}if(!alts.length)continue;
      const t=alts.length>1?VOICE.best(base.concat(parts.map(p=>p.t).join(' ').split(/\s+/).filter(Boolean)),alts,exp,VS.hints):alts[0];
      const last=parts[parts.length-1];
      if(last&&(t.startsWith(last.t)||last.t.startsWith(t)))parts[parts.length-1]={t:t.length>=last.t.length?t:last.t,f:x.isFinal||last.f};
      else parts.push({t,f:x.isFinal})}
    parts.forEach(p=>{if(p.f)fin+=p.t+' ';else it+=p.t+' '});
    txt=(fin+it).trim(); VS.finals=[...VS.prev,fin.trim()].filter(Boolean); VS.interim=it; vUpdate()};
  // the mic button pulses while the recognizer hears speech
  r.onspeechstart=()=>$('vMic').classList.add('hear'); r.onspeechend=()=>$('vMic').classList.remove('hear');
  r.onerror=e=>{if(VS.rec!==r)return;
    if(e.error==='language-not-supported'){const i=VOICE.LANGS.indexOf(VS.lang);if(i<VOICE.LANGS.length-1){VS.lang=VOICE.LANGS[i+1];try{localStorage.setItem('ui_asrLang',VS.lang)}catch(_){}}return}
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
  if(silent&&VOICE.W.recording())VOICE.W.cancel();
  if(!VS.on)return;
  VS.on=false; try{VS.rec&&VS.rec.stop()}catch(_){}
  if(VS.interim){VS.finals.push(VS.interim);VS.interim=''}
  $('vMic').textContent='🎤 ابدأ';$('vMic').classList.remove('live');
  const ws=vWords(); vUpdate(); const r=lastRes; if(silent)return;
  const said=r.st.filter(x=>x===1).length; if(!said)return;
  const badW=[]; r.st.forEach((s,i)=>{if((s===2||s===3)&&ws[i]){const u=ws[i].closest('.unit');badW.push(u.dataset.id+':'+[...u.querySelectorAll('.w')].indexOf(ws[i]))}});

  vMsg(badW.length?`فاتك ${ar(badW.length)} ${badW.length<=10?'كلمات':'كلمة'}، طلعت بلون مختلف. سمّع مرة ثانية من «من جديد».`:r.p>=ws.length?'ما شاء الله، سمّعته كامل بدون غلط 🤍':`وقفت عند الكلمة ${ar(r.p+1)} من ${ar(ws.length)}، بدون أغلاط لحد هون.`);
}
// the precise engine (Whisper on the device) records first and corrects after; the default listens live
const PREC=VOICE.precise({VS,msg:vMsg,update:vUpdate,stop:vStop,btn:$('vMic')});
$('vMic').addEventListener('click',()=>{const w=VOICE.engine()==='whisper';VS.on?(w&&VOICE.W.recording()?PREC.finish():vStop(false)):(w?(lastRes.p>=vWords().length&&vReset(),PREC.start()):vStart())});
$('vReset').addEventListener('click',()=>{if(VS.on)vStop(true);vReset()});
$('vHint').addEventListener('click',()=>{const ws=vWords();if(lastRes.p<ws.length){VS.hints.add(lastRes.p);vUpdate()}});

/* ---------- screens, tabs, settings, backup ---------- */
// the old-memorisation screen and its button are the same on every prose page, so they are built here
$('setup').insertAdjacentHTML('afterend',`<section id="oldMem" class="card" hidden>
    <div class="eyebrow">محفوظك القديم</div>
    <div class="range">شو حافظ من قبل؟</div>
    <p class="note" style="margin:0">علّم الأبواب اللي حافظها: «حافظه كامل» بينضاف للمراجعة على طول، موزّع على الأيام الجاية بحيث ما يجيك كله مرة وحدة. و«لحد…» إذا حافظ جزء من الباب، وبتكمل حفظه من وين وقفت.</p>
    <div id="oldList" class="plist"></div>
    <div class="plan">
      <label><span class="eyebrow">كيف حفظك فيه؟</span><select id="oldStr"><option value="strong">قوي</option><option value="mid" selected>متوسط</option><option value="weak">ضعيف</option></select></label>
      <label><span class="eyebrow">مراجعات الأبواب باليوم (أقصى حد)</span><input id="oldCap" type="text" inputmode="numeric" value="2"></label>
    </div>
    <p class="note" style="margin:0">القوي بتتباعد مراجعته أسرع، والضعيف بيرجعلك أقرب. وبعد كل مراجعة بيتحدد موعد اللي بعدها حسب تقييمك. وأول مراجعة إلك بتكون اختبار: إذا قيّمت «نسيت» بيرجع قريب، وفي زر يرجّع الباب للحفظ من جديد.</p>
    <p class="note" id="oldMsg" style="margin:0;color:var(--bad)"></p>
    <button class="btn primary" id="oldApply">أضفه للمراجعة</button>
    <button class="btn" id="oldSkip">رجوع</button>
  </section>`);
$('setupBtn').insertAdjacentHTML('afterend','<button class="btn" id="oldBtn">📚 محفوظي القديم</button>');
$('oldBtn').addEventListener('click',()=>openOld(false));
document.querySelector('#welcome ol').insertAdjacentHTML('beforeend','<li><b>محفوظك القديم:</b> إذا حافظ أبواب من قبل، من زر «📚 محفوظي القديم» تحت بتعلّمها، وبتنضاف لمراجعة الأبواب على طول.</li>');
$('oldApply').addEventListener('click',applyOld);
$('oldSkip').addEventListener('click',()=>showScreen('main'));
let active='today';
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  active=b.dataset.v; ['today','all','log'].forEach(v=>$('v-'+v).hidden=v!==active);
  window.UI.reveal.stop(); if(active!=='log'&&mode[active]==='reveal')window.UI.reveal.start(active==='all'?$('allList'):$('cardBox').querySelector('.unit,.block'));
  if(VS.on)vStop(true); voiceHost=active==='all'?$('allList'):$('cardBox').querySelector('.unit'); updateVoicebar();
}));
function showScreen(sc,canCancel){
  const main=sc==='main'; if(!main)window.UI.reveal.stop();
  $('setup').hidden=sc!=='setup'; $('welcome').hidden=sc!=='welcome'; $('oldMem').hidden=sc!=='old';
  ['mainTabs','foot'].forEach(id=>$(id).hidden=!main); if(MULTI){$('chapBar').hidden=!main;if(!main)$('chapCard').hidden=true}
  ['today','all','log'].forEach(v=>$('v-'+v).hidden=!main||v!==active);
  $('backup').hidden=true; $('cancelSetup').hidden=!canCancel;
  if(VS.on)vStop(true); updateVoicebar(); if(!main)scrollTo(0,0);
}
$('setupBtn').addEventListener('click',()=>{$('perIn').value=S.per;$('goalIn').value=S.goal;fillChapPick();showScreen('setup',true)});
$('cancelSetup').addEventListener('click',()=>showScreen('main'));
$('saveSetup').addEventListener('click',()=>{
  if(MULTI&&$('chapIn').value&&$('chapIn').value!==CUR)setCur($('chapIn').value);
  S.per=Math.max(1,Math.min(10,numIn($('perIn').value)||1)); S.goal=Math.max(1,Math.min(100,numIn($('goalIn').value)||10));
  // the first time through, ask about old memorisation before the first ward
  const first=!load(); save(); renderAll(); if(first)openOld(true); else showScreen('main');
});
$('helpBtn').addEventListener('click',()=>{$('welcomeGo').textContent='رجوع';showScreen('welcome')});
$('welcomeGo').addEventListener('click',()=>{if(load())showScreen('main');else{$('perIn').value=S.per;$('goalIn').value=S.goal;fillChapPick();showScreen('setup')}});
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
