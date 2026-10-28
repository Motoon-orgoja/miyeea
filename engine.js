// personal plan: verses added per day, repetitions per day, size of the daily window
const GOAL=()=>S.goal||20, WIN=()=>S.win||10, PER=()=>S.per||2;
const WDAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const WDAY=()=>S.wday??5; // weekly recitation day, -1 = none

const ar=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const dayName=d=>{try{return new Intl.DateTimeFormat('ar-JO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}catch(e){return d}};
const $=id=>document.getElementById(id);
const store={get(k,d){try{const v=localStorage.getItem(B.prefix+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(B.prefix+k,JSON.stringify(v))}catch(e){}}};

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
document.querySelectorAll('.books a').forEach(a=>{if(a.dataset.book===B.key)a.setAttribute('aria-current','page')});

/* ---------- word analysis ---------- */
const norm=w=>w.replace(/[ً-ٰٟـ()«»:،.]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
const NUMS=new Set("عشر عشره عشرا عاشر عشرين عشرون عشرينا ثلاث ثلاثه ثلاثين اربع اربعه اربعين خمس خمسه خمسا خمسين خمسينا ست سته ستين ستينا سبع سبعون سبعين ثمان ثماني ثمانون تسع ثاني ثانيه ثالثه رابعه خامس خامسه سادس سادسه سابع سابعه ثامنه تاسعه عامين شهرين اثني اثنا ثنتين نصف ربع ثلث".split(' '));
function variants(w){
  const out=[w]; let x=w;
  if(/^[وف]/.test(x)&&x.length>3){x=x.slice(1);out.push(x)}
  if(/^[بل]/.test(x)&&x.length>3){const y=x.slice(1);out.push(y); if(y.startsWith('ال'))out.push(y.slice(2))}
  if(x.startsWith('ال')&&x.length>3)out.push(x.slice(2));
  if(x.startsWith('لل'))out.push(x.slice(2));
  return out;
}
// number words are tagged so a spoken digit ("٢٥") can match them in voice recitation
const kind=word=>variants(norm(word)).some(v=>NUMS.has(v))?'num':'';

function wordSpan(word,cls){
  const s=document.createElement('span'); s.className='w '+cls;
  // split first letter (with its marks) from the rest for the first-letter mode
  const m=word.match(/^([^ً-ٰٟ]?[ً-ٰٟ]*)([\s\S]*)$/);
  let head=m[1], tail=m[2];
  if(/^[(«]/.test(word)){const mm=word.match(/^([(«][^ً-ٰٟ][ً-ٰٟ]*)([\s\S]*)$/); if(mm){head=mm[1];tail=mm[2]}}
  const h=document.createElement('span'); h.className='head'; h.textContent=head;
  const r=document.createElement('span'); r.className='rest';
  r.textContent=tail; s.append(h,r); return s;
}
function shatr(text,isFirst){
  const el=document.createElement('span'); el.className='sh '+(isFirst?'b1':'b2');
  const ws=text.split(' ');
  ws.forEach((w,k)=>{
    el.append(wordSpan(w,kind(w))); if(k<ws.length-1)el.append(document.createTextNode(' '));
  });
  return el;
}
function verseRow(i,opts={}){
  const d=document.createElement('div'); d.className='v'; d.dataset.i=i;
  const n=document.createElement('div'); n.className='n'; n.textContent=ar(i);
  if(opts.isNew){const t=document.createElement('span');t.className='tag';t.textContent='جديد';n.append(t);d.classList.add('new')}
  const b=document.createElement('div'); b.className='bayt';
  b.append(shatr(V[i-1][0],true),shatr(V[i-1][1],false)); d.append(n,b); return d;
}

/* ---------- study modes ---------- */
const MODES=[['full','كامل'],['step','بيت بيت'],['hint','أول حرف'],['fade','إخفاء تدريجي'],['half','إخفاء الشطر٢'],['voice','تسميع بالصوت']];
const LISTS={today:'todayVerses',fri:'friVerses',all:'allVerses'};
const mode={today:store.get('mode_today','full'),fri:store.get('mode_fri','half'),all:store.get('mode_all','full')};
const step={today:0,fri:0,all:0};
let active='today';
document.querySelectorAll('.modes').forEach(box=>{
  const key=box.dataset.list;
  const fb=UI.fadeBar(()=>Object.keys(LISTS).forEach(k=>mode[k]==='fade'&&applyMode(k))); fb.classList.add('fadebox'); fb.dataset.list=key; fb.hidden=true; box.after(fb);
  MODES.forEach(([m,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.dataset.m=m;b.id='mode-'+key+'-'+m;b.addEventListener('click',()=>{if(mode[key]==='voice'&&m!=='voice')vStop(true);mode[key]=m;store.set('mode_'+key,m);step[key]=0;if(m==='voice')vReset();applyMode(key)});box.append(b)});
});
function applyMode(key){
  const list=$(LISTS[key]), m=mode[key];
  list.classList.remove('m-full','m-step','m-hint','m-fade','m-half','m-voice'); list.classList.add('m-'+m);
  document.querySelectorAll(`.fadebox[data-list="${key}"]`).forEach(b=>b.hidden=m!=="fade");
  if(m==='fade')UI.fade(list,UI.fadeLevel());
  document.querySelectorAll(`.modes[data-list="${key}"] button`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===m)));
  const rows=[...list.querySelectorAll('.v')];
  rows.forEach((r,k)=>{r.classList.remove('open'); r.classList.toggle('veiled',m==='step'&&k>=step[key]); r.classList.toggle('next',m==='step'&&k===step[key])});
  if(key===active)updateBar();
}
function updateBar(){
  if(!LISTS[active]){$('stepbar').hidden=true;$('voicebar').hidden=true;return}
  const m=mode[active], list=$(LISTS[active]); const total=list.querySelectorAll('.v').length;
  $('stepbar').hidden=m!=='step'||!total;
  $('voicebar').hidden=m!=='voice'||!total;
  if(m==='voice')vUpdate();
  $('stepCount').textContent=`${ar(step[active])} / ${ar(total)}`;
  $('stepNext').textContent=step[active]>=total?'خلصت — من جديد':'أظهر البيت التالي';
}
function revealTo(key,k){
  const list=$(LISTS[key]); const total=list.querySelectorAll('.v').length;
  step[key]=Math.max(0,Math.min(total,k)); applyMode(key);
  const nx=list.querySelector('.v.next')||list.querySelectorAll('.v')[step[key]-1];
  if(nx&&nx.getBoundingClientRect().bottom>innerHeight-110)nx.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
$('stepNext').addEventListener('click',()=>{const total=$(LISTS[active]).querySelectorAll('.v').length; revealTo(active,step[active]>=total?0:step[active]+1)});
$('stepBack').addEventListener('click',()=>revealTo(active,step[active]-1));
$('stepReset').addEventListener('click',()=>revealTo(active,0));
Object.entries(LISTS).forEach(([key,id])=>{
  $(id).addEventListener('click',e=>{
    const r=e.target.closest('.v'); if(!r)return;
    const m=mode[key];
    if(m==='step'){const rows=[...$(id).querySelectorAll('.v')]; const k=rows.indexOf(r); if(k>=step[key])revealTo(key,k+1)}
    else if(m==='hint'||m==='half'){r.classList.toggle('open')}
    else if(m==='fade'){const w=e.target.closest('.w.fz'); if(w)w.classList.toggle('peek')}
    else if(m==='voice'){const w=e.target.closest('.w'); if(w&&!w.classList.contains('said')){const ws=vWords(); const k=ws.indexOf(w); if(k>=0){VS.hints.add(k);vUpdate()}}}
  });
});

/* ---------- voice recitation ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const STANDALONE=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
const VS={on:false,rec:null,finals:[],prev:[],lang:'ar-JO',interim:'',hints:new Set(),media:null,stream:null,chunks:[],done:false};
const toAscii=s=>s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
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
function vWords(){return [...$(LISTS[active]).querySelectorAll('.v .w')]}
function align(tokens,exp){
  const st=new Array(exp.length).fill(0); let p=0;
  const skipHints=()=>{while(p<exp.length&&VS.hints.has(p)){st[p]=3;p++}};
  for(const t of tokens){
    skipHints(); if(p>=exp.length)break;
    if(/^\d+$/.test(t)){ if(exp[p].num){st[p]=1;p++;while(p<exp.length&&exp[p].num){st[p]=1;p++}} continue }
    if(sim(t,exp[p].n)){st[p]=1;p++;continue}
    if(p+1<exp.length&&sim(t,exp[p].n+exp[p+1].n)){st[p]=st[p+1]=1;p+=2;continue}
    if(strip(t).length>=3){let k=-1;for(let j=1;j<=3&&p+j<exp.length;j++){if(sim(t,exp[p+j].n)){k=p+j;break}}
      if(k>0){for(let j=p;j<k;j++)st[j]=VS.hints.has(j)?3:2;st[k]=1;p=k+1}}
  }
  skipHints(); return {st,p};
}
let lastRes={st:[],p:0};
function vUpdate(){
  const ws=vWords(); if(!ws.length)return;
  const exp=ws.map(w=>({n:nz(w.textContent),num:w.classList.contains('num')}));
  const raw=(VS.finals.join(' ')+' '+VS.interim).trim();
  const tokens=raw.split(/\s+/).map(nz).filter(Boolean);
  const r=align(tokens,exp); lastRes=r;
  ws.forEach((w,i)=>{w.classList.toggle('said',r.st[i]>0);w.classList.toggle('miss',r.st[i]===2);w.classList.toggle('hinted',r.st[i]===3);w.classList.toggle('cursor',VS.on&&i===r.p)});
  const said=r.st.filter(x=>x>0).length;
  $('vCount').textContent=`${ar(said)} / ${ar(ws.length)} كلمة`+(r.st.includes(2)?` · ${ar(r.st.filter(x=>x===2).length)} غلط`:'');
  $('vHeard').textContent=raw?('سمعت: '+raw.split(/\s+/).slice(-5).join(' ')):(VS.on?'بسمعك… ابدأ القراءة':'');
  const cur=ws[r.p]; if(VS.on&&cur&&cur.getBoundingClientRect().bottom>innerHeight-170)cur.scrollIntoView({block:'center',behavior:'smooth'});
  if(VS.on&&r.p>=ws.length)vStop(false);
}
function vMsg(s){$('vMsg').textContent=s||''}
function vReset(){VS.finals=[];VS.prev=[];VS.interim='';VS.hints.clear();$('vRes').hidden=true;vMsg('');if(mode[active]==='voice')vUpdate()}
async function vStart(){
  if(window.claude){vMsg('صفحات Claude ما بتسمح بالمايك. افتح رابط الصفحة على GitHub وجرّب من هناك.');return}
  if(!SR){vMsg(IOS?'افتح الرابط بسفاري: كروم على الآيفون ما بيدعم التعرّف على الصوت.':'المتصفح هذا ما بيدعم التعرّف على الصوت. جرّب Chrome أو Safari.');return}
  if(lastRes.p>=vWords().length)vReset();
  $('vRes').hidden=true;
  if($('vRec').checked){
    try{VS.stream=await navigator.mediaDevices.getUserMedia({audio:true});VS.chunks=[];VS.media=new MediaRecorder(VS.stream);VS.media.ondataavailable=e=>{if(e.data.size)VS.chunks.push(e.data)};VS.media.start()}
    catch(e){vMsg('ما قدرت أسجّل الصوت، رح أكمل التسميع بدون تسجيل.');VS.media=null}
  }
  VS.prev=[...VS.finals];
  if(!vRecStart()){vMsg('ما قدرت أشغّل المايك.');return}
  VS.on=true;
  $('vMic').textContent='⏹ وقّف';$('vMic').classList.add('live');vMsg(IOS&&$('vRec').checked?'إذا التسميع ما التقط كلامك، طفّي «سجّل صوتي» وجرّب.':'');vUpdate();
}
// One recognizer per session; Safari ends sessions often, so each end starts a fresh one
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
  if(!VS.on&&!VS.media)return;
  VS.on=false; try{VS.rec&&VS.rec.stop()}catch(_){}
  if(VS.interim){VS.finals.push(VS.interim);VS.interim=''}
  $('vMic').textContent='🎤 ابدأ';$('vMic').classList.remove('live');
  const ws=vWords(); vUpdate(); const r=lastRes;
  const bad=new Set(), badW=[], clean=new Map();
  r.st.forEach((s,i)=>{if(!ws[i])return; const row=ws[i].closest('.v'), vi=+row.dataset.i;
    if(s===2||s===3){bad.add(vi);badW.push(vi+':'+[...row.querySelectorAll('.w')].indexOf(ws[i]))}
    clean.set(vi,(clean.get(vi)??true)&&s===1)});
  // a verse recited fully without a slip pays back one mistake, so the weak list drains as you improve
  if(!silent){clean.forEach((ok,vi)=>{if(!ok||!S.mist||!S.mist[vi])return; S.mist[vi]--; if(!S.mist[vi]){delete S.mist[vi]; Object.keys(S.mistW||{}).forEach(k=>{if(k.startsWith(vi+':'))delete S.mistW[k]})}})}
  // words never reached in verses the reader started count as unfinished, not mistakes
  const res=$('vRes'); res.replaceChildren();
  const said=r.st.filter(x=>x===1).length;
  if(!silent&&said){
    if(bad.size){S.mist=S.mist||{};bad.forEach(i=>S.mist[i]=(S.mist[i]||0)+1);S.mistW=S.mistW||{};badW.forEach(k=>S.mistW[k]=(S.mistW[k]||0)+1)}
    save()
    const h=document.createElement('div');
    h.textContent=bad.size?`تحتاج مراجعة: الأبيات ${[...bad].sort((a,b)=>a-b).map(ar).join('، ')}`:(r.p>=ws.length?'ما شاء الله، سمّعت كل الأبيات بدون غلط 🤍':`وقفت عند الكلمة ${ar(r.p+1)} من ${ar(ws.length)}، بدون أغلاط لحد هون.`);
    res.append(h); res.hidden=false;
  }
  if(VS.media){
    const m=VS.media; VS.media=null;
    m.onstop=()=>{try{VS.stream.getTracks().forEach(t=>t.stop())}catch(_){}
      const blob=new Blob(VS.chunks,{type:m.mimeType||'audio/webm'}); const url=URL.createObjectURL(blob);
      const au=document.createElement('audio');au.controls=true;au.src=url;
      const a=document.createElement('a');a.href=url;a.download='تسميع-الميئية.'+((m.mimeType||'').includes('mp4')?'m4a':'webm');a.textContent='احفظ التسجيل على الجهاز';a.className='note';
      res.append(au,a);res.hidden=false};
    try{m.stop()}catch(_){}
  }
}
$('vMic').addEventListener('click',()=>{VS.on?vStop(false):vStart()});
$('vReset').addEventListener('click',()=>{if(VS.on)vStop(true);vReset()});
$('vHint').addEventListener('click',()=>{const ws=vWords();if(lastRes.p<ws.length){VS.hints.add(lastRes.p);vUpdate()}});
const numIn=v=>parseInt(toAscii(String(v)),10);
['allFrom','allTo'].forEach(id=>$(id).addEventListener('change',()=>{
  let a=numIn($('allFrom').value)||1,b=numIn($('allTo').value)||N; a=Math.max(1,Math.min(N,a)); b=Math.max(a,Math.min(N,b));
  allRange=[a,b]; store.set(MULTI?'allRange:'+CUR:'allRange',allRange); $('allFrom').value=a; $('allTo').value=b; if(VS.on)vStop(true); vReset(); render();
}));

/* ---------- progress state ---------- */
let S={start:1,end:2,mem:0,reps:0,day:today(),done:false,log:[],tasmee:[]};
let ref=null, saveT=null, friMode='all', lastSig={};
let allRange=store.get(MULTI?'allRange:'+CUR:'allRange',[1,N]); allRange=[Math.min(allRange[0],N),Math.min(allRange[1],N)];
$('allFrom').value=allRange[0]; $('allTo').value=allRange[1];
// the ward is the last WIN verses up to today's end; with old:false it never reaches back before the starting point
const from=()=>Math.max(S.old===false?S.start:1,S.end-WIN()+1);
// consecutive finished days ending today (or yesterday, while today's ward is still open)
function streak(){
  const days=new Set(S.log.map(x=>x.d)); let n=0; const d=new Date(today()+'T12:00:00Z');
  if(!days.has(today()))d.setUTCDate(d.getUTCDate()-1);
  while(days.has(d.toISOString().slice(0,10))){n++;d.setUTCDate(d.getUTCDate()-1)}
  return n;
}
function rollover(){
  const t=today(); if(S.day===t) return false;
  if(S.done && S.end<N){S.end=Math.min(N,S.end+PER())}
  S.reps=0; S.done=false; S.day=t; return true;
}
function fill(key,a,b,opts={}){
  const idx=opts.only||Array.from({length:Math.max(0,b-a+1)},(_,k)=>a+k);
  const sig=[idx.join(','),S.mem,opts.cur||'',JSON.stringify(S.mist||{}),JSON.stringify(S.mistW||{})].join('|'); const list=$(LISTS[key]);
  if(lastSig[key]===sig)return; lastSig[key]=sig;
  list.replaceChildren();
  idx.forEach((i,k)=>{
    if(SECS[i]||k===0||(opts.only&&idx[k-1]!==i-1)){let t=SECS[i]; if(!t){for(let j=i;j>0;j--)if(SECS[j]){t=SECS[j];break}} const h=document.createElement('div');h.className='sec';h.textContent=t;list.append(h)}
    const r=verseRow(i,{isNew:opts.markNew&&i>S.mem});
    const mc=(S.mist||{})[i]; if(mc){const m=document.createElement('span');m.className='mk';m.textContent='✗'+ar(mc);r.querySelector('.n').append(m)}
    if(opts.status){r.classList.toggle('mem',i<=S.mem); if(opts.cur)r.classList.toggle('cur',i>=opts.cur[0]&&i<=opts.cur[1])}
    const ws=r.querySelectorAll('.w'); Object.keys(S.mistW||{}).forEach(x=>{const [vi,wi]=x.split(':').map(Number); if(vi===i&&ws[wi])ws[wi].classList.add('wk')});
    list.append(r);
    if(key==='all'&&P.sharh&&P.sharh[i]){const d=document.createElement('details');d.className='vsharh';const sm=document.createElement('summary');sm.textContent='شرح البيت';const p=document.createElement('p');p.textContent=P.sharh[i];d.append(sm,p);list.append(d)}
  });
  if(!list.childElementCount){const x=document.createElement('div');x.className='empty';x.textContent='لا يوجد أبيات هنا بعد.';list.append(x)}
  step[key]=Math.min(step[key],idx.length); applyMode(key);
}
function render(){
  const f=from(), e=S.end, memEnd=S.mem;
  $('barM').style.width=(memEnd/N*100)+'%';
  $('barW').style.width=(Math.max(0,e-Math.max(memEnd,f-1))/N*100)+'%';
  const sk=streak();
  $('progTxt').textContent=`ختمت ${ar(memEnd)} بيتًا من ${ar(N)} · ورد اليوم ${ar(f)}–${ar(e)}`+(e<N?` · باقي تقريبًا ${ar(Math.ceil((N-e)/PER()))} يوم`:'')+(sk>1?` · ${ar(sk)} أيام ورا بعض`:'');
  $('goalTxt').textContent='من '+ar(GOAL());
  $('dayLbl').textContent=dayName(S.day);
  $('rangeTxt').textContent=`الأبيات ${ar(f)} – ${ar(e)}`+(e===N&&S.done?(MULTI?' · ختمت القصيدة':' · ختمت المنظومة'):'');
  $('stateTag').textContent=S.done?'تمّ الورد':`${ar(S.reps)} من ${ar(GOAL())}`;
  $('stateTag').className='state'+(S.done?' done':'');
  $('repN').textContent=ar(S.reps);
  const p=Math.min(1,S.reps/GOAL()); $('arc').setAttribute('stroke-dashoffset',String(377*(1-p)));
  $('arc').setAttribute('stroke',S.reps>=GOAL()?'var(--accent)':'var(--gold)');
  $('done').disabled=S.done;
  fill('today',f,e,{markNew:true});
  const oc=friMode==='old'&&S.oldB&&S.oldB[oldK]; if(friMode==='old'&&!oc)friMode='all';
  $('friEyebrow').textContent=oc?'مراجعة المحفوظ القديم'+(c=>c.old?' · أول مراجعة':' · '+SRS.label(c))(oc):WDAY()<0?'التسميع الأسبوعي':'التسميع الأسبوعي · يوم '+WDAYS[WDAY()];
  const weak=weakVerses(); $('friWeak').hidden=!weak.length; if(friMode==='weak'&&!weak.length)friMode='all';
  const fe=S.mem, fs=friMode==='week'?Math.max(1,fe-11):1;
  $('friRange').textContent=oc?`الأبيات ${ar(oc.a)} – ${ar(oc.b)}`:friMode==='weak'?`${ar(weak.length)} أبيات بتغلط فيها`:fe?`من ${ar(fs)} إلى ${ar(fe)}`:'لا يوجد محفوظ بعد';
  [['friFrom1','all'],['friWeek','week'],['friWeak','weak']].forEach(([id,m])=>$(id).classList.toggle('primary',friMode===m));
  if(oc)fill('fri',oc.a,oc.b); else if(friMode==='weak')fill('fri',0,0,{only:weak}); else fill('fri',fs,fe);
  renderOldDue(); renderOldGrade();
  fill('all',allRange[0],allRange[1],{status:true,cur:[f,e]});
  const wk=Object.entries(S.mist||{}).filter(([i])=>+i<=Math.max(S.mem,S.end)).sort((a,b)=>b[1]-a[1]).slice(0,8);
  $('weakList').hidden=!wk.length; $('weakList').innerHTML=wk.length?'أبيات بتغلط فيها بالتسميع الصوتي: '+wk.map(([i,c])=>`<b>${ar(i)}</b> (${ar(c)})`).join('، '):'';
  const fl=$('friLog'); fl.replaceChildren();
  if(!S.tasmee.length){const x=document.createElement('div');x.className='empty';x.textContent='لا يوجد تسميع مسجّل بعد.';fl.append(x)}
  [...S.tasmee].reverse().forEach(t=>{const x=document.createElement('div');const a=document.createElement('span');a.textContent=`${dayName(t.d)} · ${ar(t.from)}–${ar(t.to)}`;const b=document.createElement('span');b.className='muted';b.textContent=t.note||'بدون ملاحظات';x.append(a,b);fl.append(x)});
  const dl=$('dayLog'); dl.replaceChildren();
  if(!S.log.length){const x=document.createElement('div');x.className='empty';x.textContent='سيظهر هنا كل يوم تختمه.';dl.append(x)}
  renderPoems();
  [...S.log].reverse().slice(0,40).forEach(t=>{const x=document.createElement('div');const a=document.createElement('span');a.textContent=dayName(t.d);const b=document.createElement('span');b.className='muted';b.textContent=`${ar(t.from)}–${ar(t.to)} × ${ar(t.reps)}`;x.append(a,b);dl.append(x)});
}
const LSK=lskOf(CUR);
function save(){
  try{localStorage.setItem(LSK,JSON.stringify(S));$('saveTxt').textContent='محفوظ على هذا الجهاز ✓'}
  catch(e){$('saveTxt').textContent='المتصفح ما سمح بالحفظ هنا، افتح الملف بمتصفح ثاني'}
}
function loadLocal(){try{const v=localStorage.getItem(LSK);return v?JSON.parse(v):null}catch(e){return null}}
$('tap').addEventListener('click',()=>{ rollover(); S.reps++; if(mode.today==='step')step.today=0; render(); applyMode('today'); save(false) });
$('undo').addEventListener('click',()=>{ if(S.reps>0){S.reps--; render(); save()} });
$('done').addEventListener('click',()=>{
  rollover(); if(S.done) return;
  S.done=true; S.mem=Math.max(S.mem,S.end);
  S.log=[...S.log.filter(x=>x.d!==S.day),{d:S.day,from:from(),to:S.end,reps:S.reps}];
  render(); save();
});
$('friFrom1').addEventListener('click',()=>{friMode='all';render()});
$('friWeek').addEventListener('click',()=>{friMode='week';render()});
$('friWeak').addEventListener('click',()=>{if(VS.on)vStop(true);friMode='weak';vReset();render()});
function weakVerses(){return Object.keys(S.mist||{}).map(Number).filter(i=>S.mist[i]>0&&i<=Math.max(S.mem,S.end)).sort((a,b)=>a-b)}

/* ---------- old memorisation: verses known before using the site ----------
   S.oldB holds review blocks [{a,b,st,due,lap,old}]: verse ranges cut at the poem's sections, about `size` verses each.
   Each is an FSRS card (srs.js) reviewed on its own schedule; first reviews are spread over the coming days so no day
   gets more than `cap` of them. Strength sets the starting stage. Verses still inside the daily ward are left to the ward. */
const inDays=n=>n<=1?'بكرة':n===2?'بعد يومين':`بعد ${ar(n)} ${n<=10?'أيام':'يوم'}`;
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const dayDiff=(a,b)=>Math.round((new Date(a+'T12:00:00Z')-new Date(b+'T12:00:00Z'))/864e5);
const when=d=>{const n=dayDiff(d,today());return n<=0?'اليوم':n===1?'بكرة':n===2?'بعد بكرة':`بعد ${ar(n)} ${n<=10?'أيام':'يوم'}`};
let oldK=-1, oldNote='';
function spread(dues,n,cap){
  const cnt={}; dues.forEach(d=>{const k=d<today()?today():d;cnt[k]=(cnt[k]||0)+1});
  const out=[]; let d=today();
  for(let i=0;i<n;i++){while((cnt[d]||0)>=cap)d=addDays(d,1);out.push(d);cnt[d]=(cnt[d]||0)+1}
  return out;
}
// cut a..b into pieces of at most `size` verses, preferring to cut where a section starts
function chunks(a,b,secs,size){
  const out=[]; let s=a;
  for(let i=a+1;i<=b+1;i++){const len=i-s; if(i>b||len>=size||(secs[i]&&len>=Math.ceil(size/2))){out.push([s,i-1]);s=i}}
  return out;
}
const oldDue=st=>((st&&st.oldB)||[]).map((c,k)=>[c,k]).filter(([c])=>c.due<=today());
const secOf=i=>{for(let j=i;j>0;j--)if(SECS[j])return SECS[j];return ''};
function gradeOld(k,g){
  const c=S.oldB[k]; if(!c)return; delete c.old;
  SRS.review(c,g,today(),c.a+'-'+c.b);
  S.olog=S.olog||{}; S.olog[today()]=(S.olog[today()]||0)+1; save();
}
function reviewOld(k){oldK=k;friMode='old';if(VS.on)vStop(true);vReset();render();$('t-fri').click();scrollTo(0,0)}
function renderOldDue(){
  const box=$('oldDue'); box.replaceChildren();
  const mine=oldDue(S), others=MULTI?ORDER.filter(id=>id!==CUR).map(id=>[id,oldDue(stateOf(id)).length]).filter(x=>x[1]):[];
  if(oldNote){const n=document.createElement('div');n.className='oldnote';n.textContent=oldNote;box.append(n)}
  if(mine.length||others.length){
    const h=document.createElement('div'); h.className='eyebrow'; h.textContent='مراجعة المحفوظ القديم اليوم'; box.append(h);
    mine.forEach(([c,k])=>{const r=document.createElement('div'); r.className='orow';
      const t=document.createElement('div'); t.innerHTML=`<b>الأبيات ${ar(c.a)}–${ar(c.b)}</b><small>${secOf(c.a)}${c.old?' · أول مراجعة':''}</small>`;
      const b=document.createElement('button'); b.className='btn primary'; b.textContent='سمّعها'; b.addEventListener('click',()=>reviewOld(k));
      r.append(t,b); box.append(r)});
    others.forEach(([id,n])=>{const r=document.createElement('div'); r.className='orow';
      const t=document.createElement('div'); t.innerHTML=`<b>«${poemOf(id).title}»</b><small>${n===1?"مقطع":ar(n)+" مقاطع"} للمراجعة</small>`;
      const b=document.createElement('button'); b.className='btn'; b.textContent='انتقل لها'; b.addEventListener('click',()=>switchPoem(id));
      r.append(t,b); box.append(r)});
  }
  box.hidden=!box.childElementCount;
}
function renderOldGrade(){
  const c=friMode==='old'&&S.oldB&&S.oldB[oldK], box=$('oldGrade');
  box.hidden=!c; $('friNote').parentElement.hidden=!!c; if(!c)return;
  const g=box.querySelector('.grades'); g.replaceChildren();
  const pv=SRS.preview(c,today());
  [['again','نسيت',inDays(pv.again),'bad'],['hard','صعب',inDays(pv.hard),'gold'],['good','تمام',inDays(pv.good),'primary']].forEach(([k,l,sub,cl])=>{
    const b=document.createElement('button'); b.className='btn '+cl; b.innerHTML=`${l}<small>${sub}</small>`;
    b.addEventListener('click',()=>{if(VS.on)vStop(true);gradeOld(oldK,k);oldNote='';const nx=oldDue(S)[0];
      if(nx)reviewOld(nx[1]);else{friMode='all';oldK=-1;render();$('t-today').click();scrollTo(0,0)}});
    g.append(b)});
}
function openOld(first){
  const list=$('oldList'); list.replaceChildren();
  (MULTI?ORDER:[CUR]).forEach(id=>{const p=poemOf(id), st=id===CUR?S:stateOf(id);
    const r=document.createElement('div'); r.className='orow'; r.dataset.id=id;
    const t=document.createElement('div'); t.innerHTML=`<b></b><small>${ar(p.verses.length)} بيت${st&&st.mem?' · حافظ لحد '+ar(st.mem):''}</small>`; t.querySelector('b').textContent=MULTI?p.title:'الأبيات';
    const f=document.createElement('div'); f.className='orange';
    f.innerHTML='<label>من<input class="oa" type="text" inputmode="numeric" value="١"></label><label>لحد<input class="ob" type="text" inputmode="numeric" placeholder="—"></label>';
    r.append(t,f); list.append(r)});
  $('oldSize').value=ar(N<=150?10:20); $('oldSkip').textContent=first?'ما عندي محفوظ قديم، ببلّش من جديد':'رجوع'; $('oldMsg').textContent='';
  showScreen('old');
}
function applyOld(){
  const str=$('oldStr').value, cap=Math.max(1,Math.min(20,numIn($('oldCap').value)||2)), size=Math.max(4,Math.min(60,numIn($('oldSize').value)||20));
  const picks=[...document.querySelectorAll('#oldList .orow')].map(r=>({id:r.dataset.id,a:numIn(r.querySelector('.oa').value)||1,b:numIn(r.querySelector('.ob').value)||0})).filter(x=>x.b>0);
  if(!picks.length){$('oldMsg').textContent='اكتب لحد أي بيت حافظ (بخانة «لحد»).';return}
  const plan=store.get('plan',null)||{per:PER(),goal:GOAL(),win:WIN()};
  const states=Object.fromEntries(B.poems.map(p=>[p.id,p.id===CUR?S:stateOf(p.id)]));
  const dues0=Object.values(states).filter(Boolean).flatMap(s=>(s.oldB||[]).map(c=>c.due));
  const jobs=[]; let inWard=0;
  picks.forEach(({id,a,b})=>{
    const p=poemOf(id), n=p.verses.length; b=Math.min(n,b); a=Math.max(1,Math.min(a,b));
    const s=states[id]||{...plan,start:1,end:Math.min(n,plan.per||2),mem:0,reps:0,day:today(),done:false,log:[],tasmee:[]};
    const per=s.per||2, win=Math.max(per,s.win||10);
    // known from the start (or right after what is memorised): new learning carries on after it
    if(a<=s.mem+1&&b>s.mem){s.mem=b; if(s.end<=b){s.start=Math.min(n,b+1);s.end=Math.min(n,b+per);s.reps=0;s.day=today();s.done=false}}
    const top=Math.min(b,Math.max(s.old===false?s.start:1,s.end-win+1)-1);
    s.oldB=(s.oldB||[]).filter(c=>!(c.a>=a&&c.b<=top));
    if(top>=a)chunks(a,top,p.secs||{1:p.title},size).forEach(r=>jobs.push([s,r])); if(b>top)inWard++;
    states[id]=s;
  });
  const dues=spread(dues0,jobs.length,cap);
  jobs.forEach(([s,[a,b]],i)=>s.oldB.push({a,b,...SRS.known(str,today(),dues[i])}));
  Object.entries(states).forEach(([id,s])=>{if(!s)return; if(s.oldB)s.oldB.sort((x,y)=>x.a-y.a);
    if(id===CUR)S=s; else try{localStorage.setItem(lskOf(id),JSON.stringify(s))}catch(e){}});
  const last=dues[dues.length-1];
  oldNote=(jobs.length?`انضاف ${jobs.length===1?"مقطع واحد":jobs.length===2?"مقطعين":ar(jobs.length)+(jobs.length<=10?" مقاطع":" مقطعًا")} للمراجعة، أولها ${when(dues[0])}`+(last!==dues[0]?` وآخرها ${when(last)}.`:'.'):'')+(inWard?' وآخر الأبيات اللي حافظها صارت بورد اليوم، والحفظ الجديد بيكمل بعدها.':'');
  Object.keys(lastSig).forEach(k=>delete lastSig[k]); save(); render(); showScreen('main');
}
$('setup').insertAdjacentHTML('afterend',`<section id="oldMem" class="card setup" hidden>
    <div class="eyebrow">محفوظك القديم</div>
    <div class="range">شو حافظ من قبل؟</div>
    <p class="note" style="margin:0">اكتب الأبيات اللي حافظها من قبل. بتنقسم مقاطع صغيرة على أبواب ${MULTI?'القصائد':'المنظومة'}، وبتراجعها على مواعيد متباعدة، موزّعة على الأيام الجاية بحيث ما تيجيك كلها مرة وحدة. ولو حافظ من الأول، الحفظ الجديد بيكمل من بعدها.</p>
    <div id="oldList" class="plist"></div>
    <div class="plan">
      <label><span class="eyebrow">كيف حفظك فيها؟</span><select id="oldStr"><option value="strong">قوي</option><option value="mid" selected>متوسط</option><option value="weak">ضعيف</option></select></label>
      <label><span class="eyebrow">أبيات المقطع</span><input id="oldSize" type="text" inputmode="numeric" value="٢٠"></label>
      <label><span class="eyebrow">مقاطع باليوم (أقصى حد)</span><input id="oldCap" type="text" inputmode="numeric" value="٢"></label>
    </div>
    <p class="note" style="margin:0">القوي بتتباعد مراجعته أسرع، والضعيف بيرجعلك أقرب. وبعد كل مراجعة بيتحدد موعد اللي بعدها حسب تقييمك. وأول مراجعة بتكون اختبار: إذا قيّمت «نسيت» بيرجعلك المقطع بكرة.</p>
    <p class="note" id="oldMsg" style="margin:0;color:var(--bad)"></p>
    <button class="btn primary" id="oldApply">أضفه للمراجعة</button>
    <button class="btn" id="oldSkip">رجوع</button>
  </section>`);
$('v-today').insertAdjacentHTML('afterbegin','<div id="oldDue" class="olddue" hidden></div>');
$('friVerses').insertAdjacentHTML('afterend','<div id="oldGrade" class="oldgrade" hidden><p class="note" style="margin:0">سمّع المقطع من حفظك (بالصوت أو بقلبك)، اكشفه، وبعدين قيّم حالك بصدق.</p><div class="grades"></div></div>');
$('resetBtn').insertAdjacentHTML('afterend','<button class="btn" id="oldBtn">📚 محفوظي القديم</button>');
$('oldBtn').addEventListener('click',()=>openOld(false));
$('oldApply').addEventListener('click',applyOld);
$('oldSkip').addEventListener('click',()=>showScreen('main'));
document.querySelector('#welcome ol').insertAdjacentHTML('beforeend','<li><b>محفوظك القديم:</b> إذا حافظ أبيات من قبل، من زر «📚 محفوظي القديم» تحت بتحددها، وبتنضاف لمراجعة متباعدة بتطلعلك أول «ورد اليوم».</li>');

/* ---------- backup ---------- */
// the code is the progress JSON in base64, so it survives copy/paste through Notes or WhatsApp
const toCode=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const fromCode=c=>JSON.parse(decodeURIComponent(escape(atob(c.replace(/\s+/g,'')))));
$('exportBtn').addEventListener('click',()=>{
  $('exportOut').value=toCode(MULTI?{app:B.app,v:2,order:ORDER,cur:CUR,plan:store.get('plan',null),all:Object.fromEntries(B.poems.map(p=>[p.id,p.id===CUR?S:stateOf(p.id)]).filter(x=>x[1]))}:{app:B.app,v:1,S}); $('backup').hidden=false; $('shareBtn').hidden=!navigator.share;
  $('backup').scrollIntoView({block:'center',behavior:'smooth'});
});
$('copyBtn').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('exportOut').value);$('copyBtn').textContent='تم النسخ ✓'}catch(e){$('exportOut').select();document.execCommand('copy');$('copyBtn').textContent='تم النسخ ✓'}
  setTimeout(()=>$('copyBtn').textContent='انسخ الكود',2000);
});
$('shareBtn').addEventListener('click',()=>navigator.share({title:'نسخة احتياطية · '+B.title,text:$('exportOut').value}).catch(()=>{}));
$('closeBackup').addEventListener('click',()=>$('backup').hidden=true);
$('importBtn').addEventListener('click',()=>{
  try{const o=fromCode($('importIn').value); if(o.app!==B.app)throw 0;
    if(MULTI){if(!o.all)throw 0; Object.entries(o.all).forEach(([id,st])=>{if(poemOf(id))localStorage.setItem(lskOf(id),JSON.stringify(st))}); if(o.order)store.set('order',o.order); if(o.cur)store.set('cur',o.cur); if(o.plan)store.set('plan',o.plan); location.reload(); return}
    if(!o.S||typeof o.S.mem!=='number')throw 0;
    S={...S,...o.S,log:o.S.log||[],tasmee:o.S.tasmee||[]}; rollover(); Object.keys(lastSig).forEach(k=>delete lastSig[k]);
    save(); render(); $('importIn').value=''; showSetup(false)}
  catch(e){$('importBtn').textContent='الكود مش صحيح، تأكد إنك نسخته كامل'; setTimeout(()=>$('importBtn').textContent='استرجع التقدم',3000)}
});
$('friSave').addEventListener('click',()=>{
  const weak=friMode==='weak'?weakVerses():null;
  const fe=weak?weak[weak.length-1]:S.mem, fs=weak?weak[0]:friMode==='week'?Math.max(1,fe-11):1;
  S.tasmee=[...S.tasmee.filter(x=>x.d!==today()),{d:today(),from:fs,to:fe,note:$('friNote').value.trim()}];
  $('friNote').value=''; render(); save();
});
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  ['today','fri','all','expl'].forEach(v=>$('v-'+v).hidden=v!==b.dataset.v);
  if(VS.on)vStop(true); active=b.dataset.v; vReset(); updateBar();
}));
render();
// screen: 'main' | 'setup' | 'welcome'; the two full-page cards replace the main view
function showScreen(sc,canCancel){
  const main=sc==='main';
  $('setup').hidden=sc!=='setup'; $('welcome').hidden=sc!=='welcome'; $('oldMem').hidden=sc!=='old';
  ['mainProg','mainTabs','foot'].forEach(id=>$(id).hidden=!main); $('poemBar').hidden=!main||!MULTI; if(!main)$('poemsCard').hidden=true;
  if(main){document.querySelector('.tabs button[aria-selected="true"]').click()}
  else{['v-today','v-fri','v-all','v-expl','backup','stepbar','voicebar'].forEach(id=>$(id).hidden=true);if(VS.on)vStop(true);scrollTo(0,0)}
  $('cancelSetup').hidden=!canCancel;
}
const showSetup=(on,canCancel)=>showScreen(on?'setup':'main',canCancel);
// live preview of the ward the current inputs would give
function setupPreview(){
  const n=numIn($('memIn').value)||0, per=Math.max(1,numIn($('perIn').value)||2), win=Math.max(per,numIn($('winIn').value)||10);
  const e=Math.min(N,n||per), f=$('oldIn').checked?Math.max(1,e-win+1):Math.max(1,e-per+1);
  $('setupPreview').textContent=`ورد اليوم رح يكون من البيت ${ar(f)} لـ ${ar(e)}، والجداد فيه ${ar(Math.min(e,per))} بيت.`;
}
['memIn','perIn','winIn','oldIn'].forEach(id=>$(id).addEventListener('input',setupPreview));
$('resetBtn').addEventListener('click',()=>{
  $('setupEyebrow').textContent='الإعدادات'; $('setupTitle').textContent='عدّل خطة الحفظ';
  $('memIn').value=String(S.end); $('perIn').value=String(PER()); $('goalIn').value=String(GOAL()); $('winIn').value=String(WIN());
  $('oldIn').checked=S.old!==false; $('wdayIn').value=String(WDAY()); setupPreview(); showSetup(true,true);
});
$('helpBtn').addEventListener('click',()=>{$('welcomeGo').textContent='رجوع';showScreen('welcome')});
$('welcomeGo').addEventListener('click',()=>{if(loadLocal())showScreen('main');else{setupPreview();showScreen('setup')}});
$('cancelSetup').addEventListener('click',()=>showSetup(false));
$('startBtn').addEventListener('click',()=>{
  const first=!loadLocal();
  const per=Math.max(1,Math.min(10,numIn($('perIn').value)||2)), goal=Math.max(1,Math.min(100,numIn($('goalIn').value)||20)), win=Math.max(per,Math.min(50,numIn($('winIn').value)||10));
  const n=Math.max(0,Math.min(N,numIn($('memIn').value)||0)), e=n||Math.min(N,per);
  const plan={per,goal,win,old:$('oldIn').checked,wday:+$('wdayIn').value}; store.set('plan',plan);
  // a new position restarts today's count; changing only the plan keeps it. History (log, weekly sessions, mistakes) always stays
  if(!loadLocal()||e!==S.end){const m=Math.max(0,e-per); S={...S,...plan,start:m+1,end:e,mem:m,reps:0,day:today(),done:false,log:S.log||[],tasmee:S.tasmee||[]}}
  else S={...S,...plan};
  Object.keys(lastSig).forEach(k=>delete lastSig[k]); save(); render(); if(first)openOld(true); else showSetup(false);
});
let saved=loadLocal();
if(!saved&&MULTI&&store.get('plan',null)){const pl=store.get('plan',null); saved={...S,...pl,start:1,end:Math.min(N,pl.per||2),mem:0,reps:0,day:today(),done:false,log:[],tasmee:[]}; try{localStorage.setItem(LSK,JSON.stringify(saved))}catch(e){}}
if(saved){ S={...S,...saved,log:saved.log||[],tasmee:saved.tasmee||[]}; if(rollover())save(); render(); if(WDAY()===new Date().getDay())$('t-fri').click() }
else { $('welcomeGo').textContent='يلّا نبلّش'; showScreen('welcome') }
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- poems: order, switching, info ---------- */
function switchPoem(id){store.set('cur',id);location.reload()}
function poemStatus(id){const st=id===CUR?S:stateOf(id),n=poemOf(id).verses.length;if(!st)return 'لسا ما بلّشتها';return st.mem>=n?'ختمتها ✓':`حافظ ${ar(st.mem)} من ${ar(n)}`}
function renderPoems(){
  if(!MULTI)return;
  if($('setup').hidden&&$('welcome').hidden&&$('oldMem').hidden)$('poemBar').hidden=false;
  $('pTitle').textContent=P.title; $('pBy').textContent=P.nazim+(P.death?' ('+P.death+')':'')+' · '+ar(N)+' بيت';
  const finished=S.mem>=N, next=ORDER.find(id=>{if(id===CUR)return false;const st=stateOf(id);return !(st&&st.mem>=poemOf(id).verses.length)});
  $('pDone').hidden=!finished; $('pDone').replaceChildren();
  if(finished){const t=document.createElement('span');t.textContent='ما شاء الله، ختمت هالقصيدة 🤍';$('pDone').append(t);
    if(next){const b=document.createElement('button');b.className='btn primary';b.textContent='انتقل لـ «'+poemOf(next).title+'»';b.addEventListener('click',()=>switchPoem(next));$('pDone').append(b)}}
  const list=$('poemList'); list.replaceChildren();
  ORDER.forEach((id,k)=>{const p=poemOf(id), row=document.createElement('div'); row.className='prow'+(id===CUR?' cur':'');
    const n=document.createElement('span'); n.className='pnum'; n.textContent=ar(k+1);
    const info=document.createElement('div'); info.className='pmeta';
    const t=document.createElement('b'); t.textContent=p.title;
    const by=document.createElement('small'); by.textContent=p.nazim+' · '+ar(p.verses.length)+' بيت · '+poemStatus(id); info.append(t,by);
    const acts=document.createElement('div'); acts.className='pacts';
    const mv=(d,lbl,dis)=>{const b=document.createElement('button');b.className='btn';b.textContent=lbl;b.disabled=dis;b.setAttribute('aria-label',d<0?'انقلها لفوق':'انقلها لتحت');
      b.addEventListener('click',()=>{const j=k+d;[ORDER[k],ORDER[j]]=[ORDER[j],ORDER[k]];store.set('order',ORDER);renderPoems()});return b};
    acts.append(mv(-1,'↑',k===0),mv(1,'↓',k===ORDER.length-1));
    if(id!==CUR){const g=document.createElement('button');g.className='btn primary';g.textContent='احفظها هلأ';g.addEventListener('click',()=>switchPoem(id));acts.append(g)}
    else{const c=document.createElement('span');c.className='state done';c.textContent='الحالية';acts.append(c)}
    row.append(n,info,acts); list.append(row)});
}
function renderPoemInfo(){
  const box=$('poemInfo'); if(!P.nazim&&!P.gharib&&!P.sharh)return; box.hidden=false; box.replaceChildren();
  const sm=document.createElement('summary'); sm.textContent='عن القصيدة وغريب كلماتها'; box.append(sm);
  const add=(tag,txt,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=txt;box.append(e);return e};
  const link=(p,txt,url)=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=txt+' ↗';p.append(a)};
  add('p','الناظم: '+P.nazim+(P.death?' ('+P.death+')':'')+(P.meter?' · البحر: '+P.meter:''));
  if(P.srcUrl)link(add('p','مصدر النص: '),P.source,P.srcUrl); else add('p','مصدر النص: '+P.source);
  if(P.note)add('p',P.note,'note');
  if(P.gharib&&P.gharib.length){add('h4','غريب الكلمات');
    const ul=document.createElement('ul');P.gharib.forEach(g=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=g.w+': ';li.append(b,g.t);ul.append(li)});box.append(ul);
    link(add('p','منقول بلفظه من: ','note'),P.gsrc.name,P.gsrc.url)}
  if(P.sharh)link(add('p','تحت كل بيت بهالتبويب زر «شرح البيت»، منقول بلفظه من: ','note'),P.sharhSrc.name,P.sharhSrc.url);
}
if(MULTI){
  $('t-all').textContent='القصيدة';
  document.querySelector('#v-all .eyebrow').textContent='القصيدة كاملة · ✓ محفوظ · المظلَّل ورد اليوم';
  const li=document.createElement('li'); li.innerHTML='<b>القصائد بترتيبك:</b> بتحفظ قصيدة وحدة لحد ما تختمها، وبعدين بتنتقل للي بعدها. من زر «القصائد والترتيب» فوق بترتّبها زي ما بدك، أو بتختار أي وحدة تبلّش فيها.';
  document.querySelector('#welcome ol').append(li);
  $('poemsBtn').addEventListener('click',()=>{$('poemsCard').hidden=!$('poemsCard').hidden;renderPoems()});
  $('closePoems').addEventListener('click',()=>$('poemsCard').hidden=true);
}
/* ---------- explanation tab: data/*-expl.js may set window.EXPL[poemId] = one entry per verse ---------- */
function renderExpl(){
  const E=window.EXPL&&window.EXPL[CUR]; if(!E)return;
  $('t-expl').hidden=false;
  $('explNote').textContent='شرح اجتهادي من إعداد الموقع لتقريب المعنى، وليس نقلًا عن كتاب معيّن؛ راجعه مع أهل العلم.'+(P.sharh?' وشرح زكريا الأنصاري المنقول بلفظه موجود تحت كل بيت في تبويب «القصيدة».':'');
  const list=$('explList'); list.replaceChildren();
  E.forEach((e,k)=>{if(!V[k])return;
    const c=document.createElement('article'); c.className='ecard';
    const head=document.createElement('div'); head.className='ehead';
    const n=document.createElement('span'); n.className='n'; n.textContent=ar(k+1);
    const b=document.createElement('div'); b.className='bayt'; V[k].forEach((h,j)=>{const sh=document.createElement('span');sh.className='sh '+(j?'b2':'b1');sh.textContent=h;b.append(sh)});
    head.append(n,b); c.append(head);
    const add=(t,txt)=>{const h=document.createElement('h4');h.textContent=t;const p=document.createElement('p');p.textContent=txt;c.append(h,p)};
    if(e.g&&e.g.length){const h=document.createElement('h4');h.textContent='غريب الكلمات';const ul=document.createElement('ul');
      e.g.forEach(([w,m])=>{const li=document.createElement('li');const x=document.createElement('b');x.textContent=w+': ';li.append(x,m);ul.append(li)});c.append(h,ul)}
    add('المعنى العام',e.a); add('وقفات وفوائد',e.d);
    list.append(c)});
}
renderPoemInfo(); renderPoems(); renderExpl();
