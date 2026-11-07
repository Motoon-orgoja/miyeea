/* ---------- «حلقاتي»: friends following each other's daily ward ----------
   A circle is a small group (up to 50) joined by its code or link. Each member shares a nickname and a short status
   that home.js works out (streak, today's ward, progress per text); members can send each other preset cheers
   (🤲 دعاء، 🔔 تذكير، 🎉 مبارك) and nothing else. No account: this device keeps a random id and token in mutoon_me
   (synced with linked devices like any progress). The server is circles.js in sync-worker/, at the sync server's address. */
(function(){
const URL_=window.SYNC&&SYNC.url||'';
const $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const rnd=n=>[...crypto.getRandomValues(new Uint8Array(n))].map(b=>b.toString(16).padStart(2,'0')).join('');
function me(){let m=get('mutoon_me');if(!m||!m.mid){m={mid:rnd(8),tok:rnd(16),name:''};put('mutoon_me',m)}return m}
const list=()=>get('mutoon_circles')||[];
const setList=l=>put('mutoon_circles',l);
const toast=(m,a)=>window.UI&&UI.toast(m,a);

async function api(action,body){
  const m=me(), r=await fetch(URL_.replace(/\/$/,'')+'/c/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mid:m.mid,tok:m.tok,...body})});
  const j=await r.json().catch(()=>({error:'net'})); if(!r.ok)throw Object.assign(new Error(j.error||'server'),{st:r.status}); return j;
}
const errText=e=>e.st===404?'ما لقينا هالحلقة، تأكد من الكود':e.st===409?'الحلقة مليانة (٥٠ شخص)':e.st===423?'الحلقة مسكّرة للانضمام هلأ، احكي مع المشرف':e.st===403?'إنت مش بهالحلقة':'ما زبط، تأكد من النت وجرّب كمان مرة';

/* my status: home.js hands over what it worked out; it goes to the server when it changed, or every few hours */
let STAT=null;
// the hour of the daily reminder: the reminder time in the settings (ui.js), 8 in the evening by default
const remHour=()=>{const p=window.UI&&UI.prefs().remind;const h=parseInt(p||'20',10);return h>=0&&h<=23?h:20};
function setStatus(s){
  STAT={...s,day:today()};
  // the daily reminder: the server reminds this device at its hour, unless today's ward is done
  if(pushState()==='on'){const r={day:STAT.day,left:s.open,rem:remHour()},h=JSON.stringify(r),l=get('mutoon_remind_push')||{};
    if(l.h!==h||Date.now()-l.at>6*36e5)api('me',r).then(()=>put('mutoon_remind_push',{h,at:Date.now()})).catch(()=>{})}
  // read, not me(): making an empty id here would outrank the one a linked device brings (the newer key wins)
  const ids=list().map(c=>c.id), m=get('mutoon_me'); if(!ids.length||!m||!m.name)return;
  const h=JSON.stringify(STAT), last=get('mutoon_circle_push')||{};
  if(last.h===h&&Date.now()-last.at<3*36e5)return;
  api('stat',{ids,name:m.name,stat:STAT}).then(()=>put('mutoon_circle_push',{h,at:Date.now()})).catch(()=>{});
}

/* what a circle follows (cfg.track, sync-worker/circles.js): every text (null), one text for all, or one per member */
const keyOf=(v,mid)=>{const t=v&&v.cfg&&v.cfg.track;return !t||t.m==='all'?null:t.m==='one'?t.k||'':(t.a||{})[mid]||''};
const titleOf=k=>{const b=window.UI&&UI.BOOKS.find(x=>x.key===k);return b?b.t:k};
// a select of every text, for an admin choosing one, or a member choosing theirs
function textPick(cur,onPick,none){const sel=el('select','cc-pick');const o0=el('option','',none||'اختار متن…');o0.value='';sel.append(o0);
  (window.UI?UI.BOOKS:[]).forEach(b=>{const o=el('option','',b.t);o.value=b.key;if(b.key===cur)o.selected=true;sel.append(o)});sel.onchange=()=>onPick(sel.value);return sel}
/* how a member is doing today, in a word; in a circle that follows one text, how that text is going */
function today_(s,key){
  if(!s||s.day!==today())return ['off','ما فتح اليوم'];
  if(key!=null&&key!==undefined){if(!key)return ['off','ما اختار متن'];const b=s.bks&&s.bks[key];if(!b)return ['off','ما بلّش «'+titleOf(key)+'»'];
    return +b[2]===0?(s.td?['done','خلّص ورده ✓']:['done','ما عليه شي اليوم']):s.td?['mid','باقي '+ar(+b[2])]:['off','لسا ما بلّش']}
  if(s.open===0&&s.td)return ['done','خلّص ورده ✓'];
  if(s.open===0)return ['done','ما عليه شي اليوم'];
  return s.td?['mid','بلّش · باقي '+ar(s.open)]:['off','لسا ما بلّش'];
}
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<2?'هلأ':m<60?'قبل '+ar(m)+' دقيقة':m<1440?'قبل '+ar(Math.round(m/60))+' ساعة':'قبل '+ar(Math.round(m/1440))+' يوم'};
// [icon, button, what the friend reads, the button once sent today]: each kind goes once a day to each member
const CHEER={dua:['🤲','ادعيله','دعالك','دعيتله اليوم ✓'],nudge:['🔔','ذكّره بالورد','ذكّرك بالورد','ذكّرته اليوم ✓'],mabrook:['🎉','بارك الله فيك','بارك لك','باركتله اليوم ✓']};

/* push notifications: a cheer reaches the friend's device even when the site is closed (push.js in sync-worker/).
   The iPhone allows it only to the site added to the home screen (iOS 16.4 and later). */
const VAPID='BM_jWerlxMRyCtFOz93Buf8UL4DxmRGEvwKqRyy94UG7tvCxCWwhzd6ARntDhlXHyHx0xYIafCI273qgsJZs6qA';
const PUSHK='mutoon_webpush';
const canPush=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const STANDALONE=!!navigator.standalone||matchMedia('(display-mode: standalone)').matches;
const iosTab=()=>IOS&&!STANDALONE;
function pushState(){
  if(!canPush())return iosTab()?'ios':IOS?'old':'none';
  return Notification.permission==='denied'?'denied':Notification.permission==='granted'&&get(PUSHK)?'on':'off';
}
async function subscribe(){
  const reg=await navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready);
  const key=Uint8Array.from(atob(VAPID.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  if(get(PUSHK)!==sub.endpoint){await api('sub',{sub:sub.toJSON()});put(PUSHK,sub.endpoint);put('mutoon_remind_push',{});if(STAT)setStatus(STAT)}
}
async function enablePush(btn){
  btn.disabled=true;
  try{if(await Notification.requestPermission()!=='granted')throw 0;await subscribe();toast('تمام 🔔 بيوصلك تذكير الساعة '+ar(remHour()>12?remHour()-12:remHour())+(remHour()>=12?' المسا':' الصبح')+' إذا ما خلّصت وردك');btn.remove()}
  catch(e){toast(Notification.permission==='denied'?'الإشعارات مقفلة من إعدادات المتصفح':'ما زبط تفعيل الإشعارات، جرّب كمان مرة');btn.disabled=false}
}
/* the banner at the top of the home page, for members of a circle whose notifications are not on yet.
   On the iPhone the site must be added to the home screen first, and the icon opens with storage of its own:
   so this device is linked for sync (sync.js) and the icon's start page carries the sync code (#link=…),
   which brings the progress, the circles and the member id over by themselves. The code is also shown, as a fallback. */
const LATER='ui_pushbar_later';
async function carry(){
  if(!window.SYNC||!SYNC.available)return '';
  if(!SYNC.linked())await SYNC.link(SYNC.newSecret());
  const code=SYNC.code(), start=new URL('home.html#link='+code,location.href).href;
  history.replaceState(null,'','home.html#link='+code);
  // the icon starts at the manifest's start_url: give this page a copy that carries the code
  try{const m=await (await fetch('manifest.webmanifest')).json(), abs=u=>new URL(u,location.href).href;
    m.start_url=start;m.scope=abs('./');m.icons.forEach(i=>i.src=abs(i.src));
    document.querySelector('link[rel=manifest]').href=URL.createObjectURL(new Blob([JSON.stringify(m)],{type:'application/manifest+json'}))}catch(e){}
  return code;
}
function banner(box){
  box.replaceChildren(); box.hidden=true;
  const st=pushState(), cs=list().length;
  // the home-screen icon opened empty on an iPhone: offer to bring things over with the code
  if(IOS&&STANDALONE&&!cs&&window.SYNC&&!SYNC.linked()&&!localStorage.getItem('ui_carry_no')){
    box.append(el('b','','📲 جاي من سفاري؟'),el('p','','إذا كنت بحلقة أو بتحفظ على سفاري، اكتب رمز النقل اللي طلعلك هناك، وبينتقل كل اشي لهون.'));
    const i=el('input');i.placeholder='XXXXX-XXXXX-XXXXX-XXXXX';i.setAttribute('autocapitalize','characters');i.setAttribute('data-noi18n','');
    const ok=el('button','btn primary','انقل');ok.onclick=async()=>{ok.disabled=true;try{await SYNC.link(i.value);location.reload()}catch(e){toast('الرمز مش صحيح أو ما في نت');ok.disabled=false}};
    const no=el('button','btn','لا، أنا جديد');no.onclick=()=>{try{localStorage.setItem('ui_carry_no','1')}catch(e){}box.hidden=true};
    const row=el('div','cc-acts');row.append(ok,no);box.append(i,row); box.hidden=false; return;
  }
  if(st==='on'||st==='none')return;
  if(Date.now()-(+localStorage.getItem(LATER)||0)<3*864e5)return;
  const later=el('button','btn','لاحقًا'); later.onclick=()=>{try{localStorage.setItem(LATER,Date.now())}catch(e){}box.hidden=true};
  const why='بيوصلك تذكير بوردك إذا ما خلّصته، وتشجيع أصحابك بالحلقات.';
  box.append(el('b','','🔔 فعّل الإشعارات'),el('p','',why));
  const row=el('div','cc-acts');
  if(st==='off'){const on=el('button','btn primary','فعّل');on.onclick=async()=>{await enablePush(on);if(pushState()==='on')box.hidden=true};row.append(on,later);box.append(row)}
  else if(st==='ios'){
    // on the iPhone the site must be on the home screen first: the steps wait behind «كيف؟»
    const how=el('details','pb-how');how.append(el('summary','','على الآيفون: أضف الموقع للشاشة الرئيسية أول · كيف؟'));
    const ol=el('ol','pb-steps');
    [['زر المشاركة ',el('span','pb-ico','⬆︎'),' تحت الشاشة'],['اختار «إضافة إلى الشاشة الرئيسية» (إذا ما شفته انزل بالقائمة)'],['افتح «المتون» من الأيقونة الجديدة، وفعّل الإشعارات من هون']]
      .forEach(p=>{const li=el('li');li.append(...p.map(x=>typeof x==='string'?document.createTextNode(x):x));ol.append(li)});
    ol.firstChild.prepend(document.createTextNode('اكبس '));
    const note=el('p','pb-note','تقدمك وحلقاتك بينتقلوا معك للأيقونة لحالهم.');
    how.append(ol,note); box.append(how); row.append(later); box.append(row);
    how.addEventListener('toggle',()=>{if(how.open&&!how.dataset.c){how.dataset.c=1;carry().then(code=>{if(code){const c=el('span','',code);c.setAttribute('data-noi18n','');note.append(document.createTextNode(' وإذا ما انتقلوا، اكتب هناك هالرمز: '),c)}}).catch(()=>{})}});
  }else if(st==='old'){box.append(el('p','pb-note','بدها iOS 16.4 أو أحدث.'));row.append(later);box.append(row)}
  else if(st==='denied'){box.append(el('p','pb-note','الإشعارات مقفلة من إعدادات المتصفح لهالموقع (القفل جنب العنوان).'));row.append(later);box.append(row)}
  box.hidden=false;
}
// the offer to turn them on, where it fits: in a circle and on the home card
function pushOffer(){
  const st=pushState();
  if(st==='off'){const b=el('button','btn','🔔 فعّل الإشعارات');b.title='يوصلك تذكير أصحابك ودعاؤهم حتى والموقع مسكّر';b.type='button';b.onclick=()=>enablePush(b);return b}
  if(st==='ios')return el('p','ui-hint','📲 عشان توصلك إشعارات أصحابك على الآيفون: من زر المشاركة اختار «إضافة إلى الشاشة الرئيسية»، وافتح الموقع من الأيقونة، وبعدين فعّل الإشعارات من هون.');
  if(st==='denied')return el('p','ui-hint','🔕 الإشعارات مقفلة لهالموقع من إعدادات المتصفح، فتذكير أصحابك بيوصلك بس لما تفتح الموقع.');
  return null;
}
function showCheers(cs){if(cs&&cs.length)toast(cs.slice(-3).map(c=>c.from+' '+CHEER[c.kind][2]+' '+CHEER[c.kind][0]).join(' · '))}

/* asking for a nickname the first time */
function askName(then){
  const b=UI.sheet('اسمك بالحلقات');
  b.append(el('p','ui-hint','هاد الاسم اللي بيشوفه أصحابك. اختار اسم أو كنية، مش لازم اسمك الحقيقي.'));
  const i=el('input'); i.maxLength=30; i.value=me().name||''; i.placeholder='مثلًا: أبو عبدالله'; b.append(i);
  const ok=el('button','btn primary','تمام'); b.append(ok); setTimeout(()=>i.focus(),200);
  ok.onclick=()=>{const v=i.value.trim();if(!v){i.focus();return}const m=me();m.name=v.slice(0,30);put('mutoon_me',m);put('mutoon_circle_push',{});UI.closeSheet();then()};
}
const SHARE_NOTE='بيشوف أعضاء الحلقة: اسمك، وكم يوم ورا بعض بتحفظ، وإذا خلّصت ورد اليوم، وتقدمك بالمتون اللي شغّال فيها. ما بيشوفوا ملاحظاتك ولا تسجيلاتك ولا أخطاءك.';

/* the list of my circles, and making or joining one */
function open(){
  if(!me().name)return askName(open);
  const b=UI.sheet('👥 حلقاتي');
  const cs=list();
  if(!cs.length)b.append(el('p','ui-hint','الحلقة مجموعة أصحاب بيتابعوا ورد بعض: مين خلّص ورده اليوم، ومين بحاجة تذكير، وبتقدر تدعيله أو تباركله بضغطة.'));
  cs.forEach(c=>{const r=el('button','btn','👥 '+c.name);r.onclick=()=>openCircle(c.id);b.append(r)});
  b.append(el('h3','ui-sec','حلقة جديدة'));
  const n=el('input'); n.maxLength=40; n.placeholder='اسم الحلقة، مثلًا: شباب المسجد'; b.append(n);
  const mk=el('button','btn primary','➕ اعمل الحلقة'); b.append(mk);
  mk.onclick=async()=>{const v=n.value.trim();if(!v){n.focus();return}mk.disabled=true;
    try{const r=await api('new',{name:me().name,cname:v,stat:STAT||{}});setList([...list(),{id:r.id,name:v}]);put('mutoon_circle_push',{});openCircle(r.id,true)}catch(e){toast(errText(e));mk.disabled=false}};
  b.append(el('h3','ui-sec','انضم لحلقة'));
  const j=el('input'); j.placeholder='كود الحلقة (٨ حروف)'; j.setAttribute('autocapitalize','characters'); b.append(j);
  const jb=el('button','btn','🔗 انضم'); b.append(jb); jb.onclick=()=>{const v=j.value.trim();if(v)join(v)};
  b.append(el('p','ui-hint',SHARE_NOTE));
  const nm=el('button','btn','✏️ غيّر اسمي ('+me().name+')'); nm.onclick=()=>askName(open); b.append(nm);
}

async function join(code){
  code=String(code).toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(list().some(c=>c.id===code))return openCircle(code);
  if(!me().name)return askName(()=>join(code));
  try{const v=await api('join',{id:code,name:me().name,stat:STAT||{}});setList([...list(),{id:v.id,name:v.name}]);put('mutoon_circle_push',{});toast('انضميت لـ«'+v.name+'» 🤍');render(v)}
  catch(e){toast(errText(e))}
}

async function openCircle(id,fresh){
  const b=UI.sheet('👥 …'); b.append(el('p','ui-hint','عم يتحمّل…'));
  try{const v=await api('get',{id});showCheers(v.cheers);render(v,fresh)}
  catch(e){b.replaceChildren(el('p','ui-hint',errText(e)));if(e.st===403||e.st===404){setList(list().filter(c=>c.id!==id))}}
}

function invite(v){
  const link=location.origin+location.pathname.replace(/[^/]*$/,'')+'home.html#join='+v.id;
  const text='انضم لحلقتي «'+v.name+'» على حفظ المتون، عشان نتابع ورد بعض 🤍\n'+link;
  if(navigator.share)navigator.share({text}).catch(()=>{}); else navigator.clipboard.writeText(text).then(()=>toast('انتسخ رابط الدعوة ✓')).catch(()=>{});
}

/* a circle: today (who finished), the leaderboard, and, for its admins, its settings. Details wait behind a tap. */
const MEDAL=['🥇','🥈','🥉'];
const KLBL={all:'الالتزام والحفظ',days:'الالتزام بالورد',mem:'الحفظ الجديد'};
const isAdmin=(v,mid)=>v.owner===mid||(v.cfg&&v.cfg.admins||[]).includes(mid);
const daysLeft=(v,b)=>{const n=Math.round((new Date(b+'T12:00:00Z')-new Date(v.today+'T12:00:00Z'))/864e5)+1;return n};
// the members ranked by points of a board
const ranked=(v,pts)=>v.members.map(x=>({x,p:(pts[x.mid]||{p:0}).p,d:pts[x.mid]||{}})).sort((a,b)=>b.p-a.p||a.x.name.localeCompare(b.x.name));
function board(v,pts,me_){
  const box=el('div','lb');
  ranked(v,pts).forEach((r,i)=>{const row=el('div','lb-r'+(r.x.mid===me_?' me':''));
    row.append(el('span','lb-n',r.p>0&&i<3?MEDAL[i]:ar(i+1)),el('b','',r.x.name),el('span','lb-p',ar(r.p)));
    const why=[r.d.days?ar(r.d.days)+' يوم ورد':'',r.d.tf?ar(r.d.tf)+' يوم تفسير':'',r.d.mem?ar(r.d.mem)+' محفوظ جديد':''].filter(Boolean).join(' · ');
    if(why)row.title=why; box.append(row)});
  return box;
}
/* a circle, made to pull gently: this round's podium and how close the next place is, first; who finished today,
   the full ranking and the record of past rounds wait behind a tap. The admins' settings open in a sheet of their own. */
const PRESETS=[['bal','متوازن',{day:10,tf:5,mem:2,tsm:15}],['days','الالتزام أهم',{day:15,tf:5,mem:0,tsm:15}],['mem','الحفظ أهم',{day:5,tf:0,mem:4,tsm:15}]];
const wOf=cfg=>Object.assign({day:10,tf:5,mem:2,tsm:15},cfg&&cfg.pts||{});
const roundOf_=v=>v.round||{a:v.week.a,b:v.week.b,mode:'week',pts:v.week.pts};
const GRADES=[['a','ممتاز'],['b','جيد'],['c','بحاجة إعادة']];
function render(v,fresh){
  const m=me(), b=UI.sheet('👥 '+v.name), adm=isAdmin(v,m.mid), cfg=v.cfg||{}, V2=!!v.week;
  setList(list().map(c=>c.id===v.id?{id:c.id,name:v.name}:c));
  // the invitation: at the top only for a fresh circle, otherwise a small line at the bottom
  const inv=el('div','cc-inv'), code=el('span','cc-code',v.id.slice(0,4)+'-'+v.id.slice(4)); code.setAttribute('data-noi18n','');
  const ib=el('button','btn'+(fresh?' primary':''),'📨 ادعُ أصحابك'); ib.onclick=()=>invite(v); inv.append(el('small','','كود الحلقة'),code,ib);
  if(fresh){b.append(el('p','ui-hint','الحلقة جاهزة. ابعت الرابط لأصحابك، أو خلّيهم يكتبوا الكود من «حلقاتي».'),inv)}
  if(cfg.note){const n=el('div','cc-note');n.append(el('small','','📌 من المشرف'),el('p','',cfg.note));b.append(n)}
  // this round
  if(V2){
    const R=roundOf_(v), rk=ranked(v,R.pts), left=daysLeft(v,R.b), rc=el('div','rc');
    rc.append(el('small','rc-h',(R.mode==='month'?'جولة الشهر':'جولة الأسبوع')+' · '+(left<=1?'آخر يوم':'باقي '+ar(left)+' أيام')));
    const top=rk.filter(r=>r.p>0).slice(0,3);
    if(top.length){const pod=el('div','pod');[1,0,2].forEach(i=>{const r=top[i];if(!r)return;const c=el('div','pod-c pod-'+(i+1)+(r.x.mid===m.mid?' me':''));
        c.append(el('span','pod-m',MEDAL[i]),el('b','',r.x.name),el('small','',ar(r.p)+' نقطة'));pod.append(c)});rc.append(pod)}
    else rc.append(el('p','rc-empty','الجولة بلّشت. أول نقطة بتحطّك بالصدارة 🌱'));
    // where I stand, said kindly: how close the next place is
    const i=rk.findIndex(r=>r.x.mid===m.mid), mine=rk[i];
    if(mine)rc.append(el('p','rc-me',!mine.p?'خلّص وردك اليوم وبتدخل الترتيب':i===0?(rk[1]&&rk[1].p===mine.p?'متعادل بالصدارة مع '+rk[1].x.name+'، نقطة وحدة بتحسمها':'إنت بالصدارة 🏆 كمّل هيك'):'مركزك '+ar(i+1)+' · باقي '+ar(rk[i-1].p-mine.p+1)+' نقطة وبتسبق '+rk[i-1].x.name));
    const all=el('details','cc-fold');all.append(el('summary','','الترتيب كامل'),board(v,R.pts,m.mid));
    const W=wOf(cfg),tr=cfg.track;
    all.append(el('p','ui-hint','النقاط: كل يوم بتخلّص فيه وردك '+ar(W.day)+(W.tf&&(!tr||tr.m==='all')?'، وكل يوم بتقرأ فيه ورد التفسير '+ar(W.tf):'')+(W.mem?'، وكل بيت أو فقرة بتحفظها جديد '+ar(W.mem):'')+(W.tsm?'، وكل تسميع بيسجّله المشرف لحد '+ar(W.tsm):'')+'.'+(tr&&tr.m!=='all'?' وبتنحسب من '+(tr.m==='one'?'«'+titleOf(tr.k)+'»':'متن كل واحد بالحلقة')+' بس.':'')+' بتتحدّث لما تفتح «وردي اليوم».'));
    rc.append(all); b.append(rc);
    // the record: last round's champion and the most improved
    const h=(cfg.hist||[])[0];
    if(h&&(h.w||h.im)){const row=el('div','cc-hist');if(h.w)row.append(el('span','','🏆 بطل الجولة الماضية: '+h.w[1]));if(h.im)row.append(el('span','','📈 الأكثر تحسّنًا: '+h.im[1]));
      if((cfg.hist||[]).length>1){const d=el('details','cc-fold');d.append(el('summary','','سجلّ الأبطال'));const l=el('div','sched');
        cfg.hist.forEach(x=>{const r=el('div');r.append(el('span','',x.a.slice(5).replace('-','/')),el('b','',(x.w?'🏆 '+x.w[1]:'—')+(x.im?' · 📈 '+x.im[1]:'')));l.append(r)});d.append(l);row.append(d)}
      b.append(row)}
  }
  // a special challenge, when the admins set one
  const ch=v.challenge;
  if(ch){const c=el('details','cc-ch');const left=daysLeft(v,ch.b);const s=el('summary');s.append(el('small','',left<1?'🏁 خلصت المسابقة':'🏆 مسابقة · باقي '+(left===1?'آخر يوم':ar(left)+' أيام')),el('b','',ch.t));
    const top=ranked(v,ch.pts).slice(0,3).filter(r=>r.p>0);s.append(el('span','',top.length?top.map((r,i)=>MEDAL[i]+' '+r.x.name).join('   '):'لسا ما حدا جمع نقاط'));c.append(s,board(v,ch.pts,m.mid));b.append(c)}
  const po=pushOffer(); if(po)b.append(po);
  // today: who finished, folded; each member opens to cheers (and, for admins, a heard recitation or points)
  {const ms=v.members.slice().sort((a,b)=>{const r=x=>({done:0,mid:1,off:2})[today_(x.stat,keyOf(v,x.mid))[0]];return r(a)-r(b)||(b.stat.s||0)-(a.stat.s||0)});
    const done=ms.filter(x=>today_(x.stat,keyOf(v,x.mid))[0]==='done').length, tr=cfg.track;
    const d=el('details','cc-fold cc-today');d.append(el('summary','','اليوم: '+ar(done)+' من '+ar(ms.length)+' خلّصوا وردهم'));
    if(tr&&tr.m==='each'){const mine=keyOf(v,m.mid),row=el('div','cc-mine');row.append(el('small','',mine?'متنك بالحلقة:':'اختار المتن اللي بتتسابق فيه:'),
      textPick(mine,async k=>{try{await api('pick',{id:v.id,key:k});openCircle(v.id)}catch(e){toast(errText(e))}}));d.append(row);if(!mine)d.open=true}
    const box=el('div','cc-list'), sent=new Set((v.sent||[]).map(([to,k])=>to+'|'+k)); d.append(box);
    const heard=new Set((v.recent||[]).filter(x=>x.kind==='tsm'&&x.day===v.today).map(x=>x.mid));
    ms.forEach(x=>{
      const s=x.stat||{}, xk=keyOf(v,x.mid), [k,t]=today_(s,xk), row=el('details','cc-m'+(x.mid===m.mid?' me':''));
      const top=el('summary','cc-top'); top.append(el('b','',x.name+(x.mid===m.mid?' (إنت)':'')+(x.mid===v.owner?' ★':isAdmin(v,x.mid)?' ◆':'')),el('span','cc-st '+k,(heard.has(x.mid)?'🎙 ':'')+t)); row.append(top);
      const info=[]; if(xk)info.push('متنه: «'+titleOf(xk)+'»'); if(s.s)info.push('🔥 '+ar(s.s)+' يوم ورا بعض'); info.push('آخر تحديث '+ago(x.at));
      row.append(el('small','cc-info',info.join(' · ')));
      const bks=xk===null?(s.bk||[]):xk&&s.bks&&s.bks[xk]?[[titleOf(xk),+s.bks[xk][0],+s.bks[xk][1]]]:[];
      bks.forEach(([title,dd,tot])=>{const p=el('div','cc-bk');p.append(el('span','',title),el('small','',ar(dd)+' من '+ar(tot)));const bar=el('div','bar'),i=el('i');i.style.width=Math.max(dd?2:0,Math.min(100,dd/Math.max(1,tot)*100))+'%';bar.append(i);p.append(bar);row.append(p)});
      if(x.mid!==m.mid){const acts=el('div','cc-acts');
        (k==='done'?['mabrook','dua']:['nudge','dua']).forEach(kind=>{const c=el('button','btn',''),was=()=>{c.textContent=CHEER[kind][0]+' '+CHEER[kind][3];c.disabled=true};
          c.textContent=CHEER[kind][0]+' '+CHEER[kind][1]; if(sent.has(x.mid+'|'+kind))was();
          c.onclick=async()=>{c.disabled=true;try{const r=await api('cheer',{id:v.id,to:x.mid,kind});was();if(r.sent===false)toast('بعتله هاد اليوم قبل، وبيوصل مرة وحدة باليوم')}catch(e){toast(errText(e));c.disabled=false}};acts.append(c)});
        row.append(acts)}
      // the admins: a recitation heard (graded), or points by hand
      if(adm&&V2&&v.round&&x.mid!==m.mid){const t2=el('div','cc-acts cc-adm');t2.append(el('small','','🎙 سمّع عندي:'));
        GRADES.forEach(([g,l])=>{const c=el('button','btn',l);c.onclick=async()=>{c.disabled=true;try{const r=await api('bonus',{id:v.id,to:x.mid,kind:'tsm',grade:g});toast('انسجّل تسميع '+x.name+' (+'+ar(r.pts)+') ✓');openCircle(v.id)}catch(e){toast(errText(e));c.disabled=false}};t2.append(c)});
        const pb=el('button','btn','＋ نقاط');pb.onclick=async()=>{const n=prompt('كم نقطة لـ«'+x.name+'»؟ (من -٥٠ لـ ٥٠)','10');if(!n)return;const why=prompt('السبب (اختياري)','')||'';
          try{await api('bonus',{id:v.id,to:x.mid,kind:'man',pts:Math.round(+String(n).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))),why});toast('تمام ✓');openCircle(v.id)}catch(e){toast(errText(e))}};t2.append(pb);row.append(t2)}
      box.append(row)});
    b.append(d)}
  if(adm){const sb=el('button','btn cc-setbtn','⚙︎ إعدادات الحلقة');sb.onclick=()=>settings(v);b.append(sb)}
  const foot=el('div','cc-acts cc-foot');
  const back=el('button','btn','← حلقاتي'); back.onclick=open;
  const lv=el('button','btn','اطلع من الحلقة'); lv.onclick=async()=>{if(!confirm('بدك تطلع من «'+v.name+'»؟'))return;try{await api('leave',{id:v.id})}catch(e){if(e.st!==403&&e.st!==404){toast(errText(e));return}}setList(list().filter(c=>c.id!==v.id));toast('طلعت من الحلقة');open()};
  foot.append(back,lv); if(!fresh)b.append(inv); b.append(foot);
  const pv=el('details','cc-fold');pv.append(el('summary','','شو بيشوف أصحابي عني؟'),el('p','ui-hint',SHARE_NOTE+' وكل تشجيع بيوصل مرة وحدة باليوم، عشان ما يصير إزعاج.'));b.append(pv);
}

/* the admins' settings: each section saves on its own and the sheet reopens with the circle as it now is */
async function settings(v0){
  let v=v0; const reopen=async()=>{try{v=await api('get',{id:v.id});paint()}catch(e){toast(errText(e))}};
  const save=async(cfg,msg)=>{try{await api('cfg',{id:v.id,cfg});toast(msg||'انحفظ ✓');reopen()}catch(e){toast(errText(e))}};
  const b=UI.sheet('⚙︎ إعدادات «'+v0.name+'»');
  const sec=(t,...k)=>{const s=el('div','set-s');s.append(el('h3','ui-sec',t),...k);b.append(s);return s};
  const chips=(opts,cur,fn)=>{const r=el('div','cc-chips');opts.forEach(([val,l])=>{const c=el('button','chip'+(val===cur?' on':''),l);c.type='button';c.onclick=()=>fn(val,c,r);r.append(c)});return r};
  function paint(){
    b.replaceChildren(); const m=me(), cfg=v.cfg||{}, tr=cfg.track||{m:'all'}, owner=v.owner===m.mid;
    // a server from before these settings saves only some of them: say so, rather than seem not to respond
    if(!v.round)b.append(el('p','cc-note','⏳ المتون والنقاط والجولة بيشتغلوا بعد تحديث السيرفر القادم. الكلمة والقفل والاسم والمشرفين شغّالين هلأ.'));
    // 1. what each member competes in
    const s1=sec('المتون اللي بتتسابقوا فيها',chips([['all','كل متون الأعضاء'],['one','متن واحد للكل'],['each','لكل واحد متن']],tr.m||'all',val=>{if(val==='one'){tr.m='one';paint();return}save({track:{m:val}})}));
    if((tr.m||'all')==='one')s1.append(textPick(tr.k,k=>k&&save({track:{m:'one',k}},'الحلقة صارت تتابع «'+titleOf(k)+'» ✓')));
    if(tr.m==='each'){s1.append(el('small','ui-hint','اختار لكل عضو المتن اللي بيتسابق فيه (أو خلّيه يختار هو من «اليوم»):'));
      v.members.forEach(x=>{const r=el('div','set-m');r.append(el('b','',x.name),textPick((tr.a||{})[x.mid]||'',key=>save({assign:{mid:x.mid,key}},'تمام ✓'),'بيختار هو…'));s1.append(r)})}
    s1.append(el('small','ui-hint','الحالة والنقاط بتنحسب على اللي بتختاره هون، وبتقدر تغيّره بأي وقت.'));
    // 2. the points
    const W=wOf(cfg), pre=(PRESETS.find(([, ,p])=>Object.keys(p).every(k=>p[k]===W[k]))||[])[0]||'custom';
    const s2=sec('النقاط',chips([...PRESETS.map(([k,l])=>[k,l]),['custom','مخصّص']],pre,val=>{if(val==='custom'){cw.hidden=false;return}save({pts:PRESETS.find(p=>p[0]===val)[2]})}));
    const cw=el('div','set-w');cw.hidden=pre!=='custom';const ins={};
    [['day','يوم بيخلّص فيه وردّه'],['mem','كل بيت أو فقرة جديدة'],['tsm','تسميع عند المشرف (ممتاز)'],['tf','يوم ورد التفسير']].forEach(([k,l])=>{const r=el('label','set-r');const i=el('input');i.type='number';i.min=0;i.max=50;i.value=W[k];ins[k]=i;r.append(el('span','',l),i);cw.append(r)});
    const ok=el('button','btn primary','احفظ النقاط');ok.onclick=()=>{const p={};for(const k in ins)p[k]=Math.round(+ins[k].value)||0;save({pts:p})};cw.append(ok);s2.append(cw,el('small','ui-hint','التسميع «جيد» بياخد ثلثين النقاط، و«بحاجة إعادة» الخمس.'));
    // 3. the round
    sec('الجولة',chips([['week','كل أسبوع (من السبت)'],['month','كل شهر']],cfg.round==='month'?'month':'week',val=>save({round:val})),el('small','ui-hint','بآخر كل جولة بينحفظ بطلها والأكثر تحسّنًا، وبتبلّش جولة جديدة من الصفر.'));
    // 4. a special challenge
    const ch=cfg.challenge, s4=sec('مسابقة خاصة');
    if(ch){const end=el('button','btn','أنهِ المسابقة «'+ch.t+'»');end.onclick=()=>{if(confirm('بدك تنهي المسابقة؟'))save({challenge:null})};s4.append(end)}
    else{const f={days:7,k:'all'},t=el('input');t.maxLength=50;t.placeholder='اسمها، مثلًا: سباق رمضان';
      const pick=(opts,key)=>chips(opts,f[key],(val,c,r)=>{f[key]=val;r.querySelectorAll('.chip').forEach(z=>z.classList.toggle('on',z===c))});
      const go=el('button','btn primary','🏆 ابدأ المسابقة');go.onclick=()=>{const n=t.value.trim();if(!n){t.focus();return}save({challenge:{t:n,days:f.days,k:f.k}},'بلّشت المسابقة 🏆')};
      s4.append(t,pick([[3,'٣ أيام'],[7,'أسبوع'],[14,'أسبوعين'],[30,'شهر']],'days'),pick([['all','الكل'],['days','الالتزام'],['mem','الحفظ']],'k'),go)}
    // 5. the pinned word
    const nt=el('textarea');nt.rows=2;nt.maxLength=200;nt.placeholder='كلمة بتطلع لكل الأعضاء فوق، مثلًا: الهدف هالأسبوع ختم باب الطهارة';nt.value=cfg.note||'';
    const ns=el('button','btn','📌 ثبّت الكلمة');ns.onclick=()=>save({note:nt.value});sec('كلمة المشرف',nt,ns);
    // 6. the circle: joining, its name, the admins
    const lk=el('button','btn',cfg.locked?'🔓 افتح الانضمام':'🔒 سكّر الانضمام');lk.onclick=()=>save({locked:!cfg.locked});
    const rn=el('button','btn','✏️ غيّر الاسم');rn.onclick=async()=>{const n=prompt('اسم الحلقة',v.name);if(!n||!n.trim())return;try{await api('rename',{id:v.id,cname:n.trim()});reopen()}catch(e){toast(errText(e))}};
    const r6=el('div','cc-acts');r6.append(lk,rn);const s6=sec('الحلقة والأعضاء',r6);
    v.members.filter(x=>x.mid!==m.mid&&x.mid!==v.owner).forEach(x=>{const r=el('div','set-m');r.append(el('b','',x.name+(isAdmin(v,x.mid)?' ◆':'')));
      if(owner){const on=isAdmin(v,x.mid),a=el('button','btn',on?'شيل الإشراف':'◆ مشرف');a.onclick=()=>{const l=(cfg.admins||[]).filter(y=>y!==x.mid);if(!on)l.push(x.mid);save({admins:l})};r.append(a)}
      if(owner||!isAdmin(v,x.mid)){const rm=el('button','btn','إخراج');rm.onclick=async()=>{if(!confirm('بدك تطلّع «'+x.name+'» من الحلقة؟'))return;try{await api('leave',{id:v.id,who:x.mid});reopen()}catch(e){toast(errText(e))}};r.append(rm)}
      s6.append(r)});
    const back=el('button','btn','← رجوع للحلقة');back.onclick=()=>render(v);b.append(back);
  }
  paint();
}

/* the home card: each circle with how many finished today; cheers waiting for me show as a toast */
async function card(box){
  box.replaceChildren(); const cs=list();
  box.append(el('div','eyebrow','👥 حلقاتي · أصحابك اللي بتتابعوا ورد بعض'));
  if(!cs.length){box.append(el('p','note','اعمل حلقة مع أصحابك أو أهلك، وشوفوا مين خلّص ورده اليوم، وشجّعوا بعض.'))}
  const rows=el('div','ui-col'); box.append(rows);
  for(const c of cs){const r=el('button','ui-book'),info=el('small','','…');r.type='button';r.append(el('b','',c.name),info);r.onclick=()=>openCircle(c.id);rows.append(r);
    api('get',{id:c.id}).then(v=>{showCheers(v.cheers);const d=v.members.filter(x=>today_(x.stat,keyOf(v,x.mid))[0]==='done').length;const me_=me().mid,ch=v.challenge;let x=ar(d)+' من '+ar(v.members.length)+' خلّصوا اليوم';
      if(ch&&daysLeft(v,ch.b)>0){const r=ranked(v,ch.pts),i=r.findIndex(y=>y.x.mid===me_);x+=' · 🏆 ترتيبك '+ar(i+1)}info.textContent=x;
      if(v.name!==c.name)setList(list().map(x=>x.id===c.id?{id:x.id,name:v.name}:x))}).catch(e=>{info.textContent=e.st===403||e.st===404?'ما عادت موجودة':'ما في نت'})}
  // notifications already on: keep the server's copy of this device's subscription current (it can change)
  if(cs.length){if(pushState()==='on')subscribe().catch(()=>{});else{const po=pushOffer();if(po)box.append(po)}}
  const go=el('button','btn'+(cs.length?'':' primary'),cs.length?'حلقة جديدة أو انضمام':'➕ اعمل حلقة أو انضم لوحدة'); go.type='button'; go.onclick=open; box.append(go);
}

// an invitation link: home.html#join=CODE; the iPhone icon's first start: home.html#link=SYNCCODE (see carry)
function fromHash(){
  const l=location.hash.match(/#link=([A-Za-z0-9-]+)/);
  if(l){history.replaceState(null,'',location.pathname+location.search);// only the icon itself takes it: a shared copy of the link must not link someone else
    if(STANDALONE&&window.SYNC&&!SYNC.linked())SYNC.link(l[1]).then(()=>location.reload()).catch(()=>{});return}
  const m=location.hash.match(/#join=([A-Za-z0-9-]+)/);if(!m)return;history.replaceState(null,'',location.pathname+location.search);setTimeout(()=>join(m[1]),400)}

window.CIRCLES={available:!!URL_,open,join,openCircle,setStatus,card,banner,fromHash};
})();
