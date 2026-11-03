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
const errText=e=>e.st===404?'ما لقينا هالحلقة، تأكد من الكود':e.st===409?'الحلقة مليانة (٥٠ شخص)':e.st===403?'إنت مش بهالحلقة':'ما زبط، تأكد من النت وجرّب كمان مرة';

/* my status: home.js hands over what it worked out; it goes to the server when it changed, or every few hours */
let STAT=null;
function setStatus(s){
  STAT={...s,day:today()};
  const ids=list().map(c=>c.id), m=me(); if(!ids.length||!m.name)return;
  const h=JSON.stringify(STAT), last=get('mutoon_circle_push')||{};
  if(last.h===h&&Date.now()-last.at<3*36e5)return;
  api('stat',{ids,name:m.name,stat:STAT}).then(()=>put('mutoon_circle_push',{h,at:Date.now()})).catch(()=>{});
}

/* how a member is doing today, in a word */
function today_(s){
  if(!s||s.day!==today())return ['off','ما فتح اليوم'];
  if(s.open===0&&s.td)return ['done','خلّص ورده ✓'];
  if(s.open===0)return ['done','ما عليه شي اليوم'];
  return s.td?['mid','بلّش · باقي '+ar(s.open)]:['off','لسا ما بلّش'];
}
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<2?'هلأ':m<60?'قبل '+ar(m)+' دقيقة':m<1440?'قبل '+ar(Math.round(m/60))+' ساعة':'قبل '+ar(Math.round(m/1440))+' يوم'};
const CHEER={dua:['🤲','ادعيله','دعالك'],nudge:['🔔','ذكّره بالورد','ذكّرك بالورد'],mabrook:['🎉','بارك الله فيك','بارك لك']};
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

function render(v,fresh){
  const m=me(), b=UI.sheet('👥 '+v.name), mine=v.owner===m.mid;
  // keep the stored name in step (the owner may have renamed it)
  setList(list().map(c=>c.id===v.id?{id:c.id,name:v.name}:c));
  const head=el('div','cc-head'); const code=el('div','ui-code',v.id.slice(0,4)+'-'+v.id.slice(4)); code.setAttribute('data-noi18n','');
  const inv=el('button','btn primary','📨 ادعُ أصحابك'); inv.onclick=()=>invite(v); head.append(code,inv); b.append(head);
  if(fresh)b.append(el('p','ui-hint','الحلقة جاهزة. ابعت الرابط لأصحابك، أو خلّيهم يكتبوا الكود من «حلقاتي».'));
  const ms=v.members.slice().sort((a,b)=>{const r=x=>({done:0,mid:1,off:2})[today_(x.stat)[0]];return r(a)-r(b)||(b.stat.s||0)-(a.stat.s||0)});
  const done=ms.filter(x=>today_(x.stat)[0]==='done').length;
  b.append(el('div','chapstat',ar(done)+' من '+ar(ms.length)+' خلّصوا وردهم اليوم'));
  const box=el('div','cc-list'); b.append(box);
  ms.forEach(x=>{
    const s=x.stat||{}, [k,t]=today_(s), row=el('div','cc-m'+(x.mid===m.mid?' me':''));
    const top=el('div','cc-top'); top.append(el('b','',x.name+(x.mid===m.mid?' (إنت)':'')+(x.mid===v.owner?' ★':'')),el('span','cc-st '+k,t)); row.append(top);
    const info=[]; if(s.s)info.push('🔥 '+ar(s.s)+' يوم ورا بعض'); if(s.d30!=null)info.push(ar(s.d30)+' يوم من آخر ٣٠'); info.push('آخر تحديث '+ago(x.at));
    row.append(el('small','cc-info',info.join(' · ')));
    (s.bk||[]).forEach(([title,d,tot])=>{const p=el('div','cc-bk');p.append(el('span','',title),el('small','',ar(d)+' من '+ar(tot)));const bar=el('div','bar'),i=el('i');i.style.width=Math.max(d?2:0,Math.min(100,d/Math.max(1,tot)*100))+'%';bar.append(i);p.append(bar);row.append(p)});
    if(x.mid!==m.mid){
      const acts=el('div','cc-acts');
      (k==='done'?['mabrook','dua']:['nudge','dua']).forEach(kind=>{const c=el('button','btn','');c.textContent=CHEER[kind][0]+' '+CHEER[kind][1];
        c.onclick=async()=>{c.disabled=true;try{await api('cheer',{id:v.id,to:x.mid,kind});c.textContent=CHEER[kind][0]+' وصلته ✓'}catch(e){toast(errText(e));c.disabled=false}};acts.append(c)});
      if(mine){const rm=el('button','btn','إخراج');rm.onclick=async()=>{if(!confirm('بدك تطلّع «'+x.name+'» من الحلقة؟'))return;try{await api('leave',{id:v.id,who:x.mid});openCircle(v.id)}catch(e){toast(errText(e))}};acts.append(rm)}
      row.append(acts);
    }
    box.append(row);
  });
  b.append(el('p','ui-hint',SHARE_NOTE));
  const foot=el('div','cc-acts');
  if(mine){const rn=el('button','btn','✏️ غيّر اسم الحلقة');rn.onclick=async()=>{const n=prompt('اسم الحلقة',v.name);if(!n||!n.trim())return;try{await api('rename',{id:v.id,cname:n.trim()});openCircle(v.id)}catch(e){toast(errText(e))}};foot.append(rn)}
  const lv=el('button','btn bad','اطلع من الحلقة'); lv.onclick=async()=>{if(!confirm('بدك تطلع من «'+v.name+'»؟'))return;try{await api('leave',{id:v.id})}catch(e){if(e.st!==403&&e.st!==404){toast(errText(e));return}}setList(list().filter(c=>c.id!==v.id));toast('طلعت من الحلقة');open()};
  const back=el('button','btn','← حلقاتي'); back.onclick=open; foot.append(back,lv); b.append(foot);
}

/* the home card: each circle with how many finished today; cheers waiting for me show as a toast */
async function card(box){
  box.replaceChildren(); const cs=list();
  box.append(el('div','eyebrow','👥 حلقاتي · أصحابك اللي بتتابعوا ورد بعض'));
  if(!cs.length){box.append(el('p','note','اعمل حلقة مع أصحابك أو أهلك، وشوفوا مين خلّص ورده اليوم، وشجّعوا بعض.'))}
  const rows=el('div','ui-col'); box.append(rows);
  for(const c of cs){const r=el('button','ui-book'),info=el('small','','…');r.type='button';r.append(el('b','',c.name),info);r.onclick=()=>openCircle(c.id);rows.append(r);
    api('get',{id:c.id}).then(v=>{showCheers(v.cheers);const d=v.members.filter(x=>today_(x.stat)[0]==='done').length;info.textContent=ar(v.members.length)+' أعضاء · '+ar(d)+' خلّصوا وردهم اليوم';
      if(v.name!==c.name)setList(list().map(x=>x.id===c.id?{id:x.id,name:v.name}:x))}).catch(e=>{info.textContent=e.st===403||e.st===404?'ما عادت موجودة':'ما في نت'})}
  const go=el('button','btn'+(cs.length?'':' primary'),cs.length?'حلقة جديدة أو انضمام':'➕ اعمل حلقة أو انضم لوحدة'); go.type='button'; go.onclick=open; box.append(go);
}

// an invitation link: home.html#join=CODE
function fromHash(){const m=location.hash.match(/#join=([A-Za-z0-9-]+)/);if(!m)return;history.replaceState(null,'',location.pathname+location.search);setTimeout(()=>join(m[1]),400)}

window.CIRCLES={available:!!URL_,open,join,openCircle,setStatus,card,fromHash};
})();
