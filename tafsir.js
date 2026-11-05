/* ورد التفسير: a few ayat a day, each with the tafsir books the reader chose (data/quran/index.js, tools/build-tafsir.js).
   State in localStorage 'mutoon_tafsir_v1' (synced like the texts' progress):
   {per, books:[keys in display order], s, a: the next ayah to read, day, from:{s,a} today's ward start, done, log:{day:ayat}} */
(function(){
const Q=window.QURAN, LS='mutoon_tafsir_v1', $=id=>document.getElementById(id);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ayat=n=>n===1?'آية وحدة':n===2?'آيتين':ar(n)+(n<=10?' آيات':' آية');
const today=()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const TF=Object.fromEntries(Q.tafasir.map(t=>[t.k,t]));
let S={per:3,books:['muyassar','saadi'].filter(k=>TF[k]),s:1,a:1,day:'',from:null,done:false,log:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
S.books=S.books.filter(k=>TF[k]);
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};
// a new day starts a new ward where the last one ended
if(S.day!==today()){S.day=today();S.from={s:S.s,a:S.a};S.done=false;save()}
if(!S.from)S.from={s:S.s,a:S.a};

// the ayat of a ward: per ayat from a start, running into the next sura (after an-Nas, back to al-Fatiha)
function ward(from,n){const out=[];let s=from.s,a=from.a;for(let i=0;i<n;i++){out.push({s,a});a++;if(a>Q.suras[s-1][1]){s=s%114+1;a=1}}return out}
const after=list=>{const l=list[list.length-1];return l.a<Q.suras[l.s-1][1]?{s:l.s,a:l.a+1}:{s:l.s%114+1,a:1}};

const cache={};
const load=url=>cache[url]||(cache[url]=fetch(url).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).catch(e=>{delete cache[url];throw e}));
// the tafsir of an ayah; quran.com explains some ayat together with an earlier one (an empty entry): show that one's text once
function tafsirOf(arr,a,shownFrom){if(arr[a-1])return{text:arr[a-1]};let j=a-1;while(j>0&&!arr[j-1])j--;
  if(!j)return{text:''}; return j>=shownFrom?{with:j}:{text:arr[j-1],range:[j,a]}}

// Quran quotes ﴿…﴾ in a tafsir stand out
function para(p,t){t.split(/(﴿[^﴾]{1,600}﴾)/).forEach(x=>{if(/^﴿/.test(x)){const b=el('span','tq',x);p.append(b)}else p.append(x)})}

async function render(){
  const list=ward(S.from,S.per), box=$('ward'); box.replaceChildren();
  const first=list[0], last=list[list.length-1];
  $('wardTitle').textContent=first.s===last.s?'سورة '+Q.suras[first.s-1][0]+' · '+(first.a===last.a?'الآية '+ar(first.a):'الآيات '+ar(first.a)+'–'+ar(last.a))
    :'من سورة '+Q.suras[first.s-1][0]+' ('+ar(first.a)+') إلى سورة '+Q.suras[last.s-1][0]+' ('+ar(last.a)+')';
  $('wardState').textContent=S.done?'قرأت ورد اليوم ✓ · بتقدر تقرأ ورد زيادة':'ورد اليوم: '+ayat(S.per)+' مع '+(S.books.length?S.books.map(k=>TF[k].t).join('، '):'بدون تفسير');
  for(const [i,v] of list.entries()){
    if(i===0||v.s!==list[i-1].s){
      const h=el('div','sura',' سورة '+Q.suras[v.s-1][0]+' '); box.append(h);
      if(v.a===1&&v.s!==1&&v.s!==9)box.append(el('div','basm','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'));
    }
    const card=el('div','ayah'); box.append(card);
    const t=el('p','atext'); card.append(t);
    load('data/quran/'+v.s+'.json').then(A=>{t.textContent=A[v.a-1]+' ';t.append(el('span','anum','﴿'+ar(v.a)+'﴾'))}).catch(()=>{t.textContent='ما قدرت أحمّل الآية، تأكد من الإنترنت.'});
    // the ward's first ayah of each sura in it: an ayah explained with an earlier one in the ward needs no repeat
    const shownFrom=i===0||v.s!==list[i-1].s?v.a:list.find(x=>x.s===v.s).a;
    S.books.forEach((k,bi)=>{
      const d=el('details','tf'); if(bi===0&&S.open!==false)d.open=true;
      const sm=el('summary','',TF[k].t); d.append(sm); card.append(d);
      const body=el('div','tfb',' '); d.append(body);
      const fill=()=>load('data/tafsir/'+k+'/'+v.s+'.json').then(arr=>{body.replaceChildren();const r=tafsirOf(arr,v.a,shownFrom);
        if(r.with){body.append(el('p','note','تفسير هذه الآية مع الآية '+ar(r.with)+' فوق.'));return}
        if(r.range)body.append(el('p','note','تفسير الآيات '+ar(r.range[0])+'–'+ar(r.range[1])+' معًا:'));
        if(!r.text){body.append(el('p','note','ما في تفسير لهالآية بهالكتاب.'));return}
        r.text.split(/\n\n+/).forEach(x=>{const p=el('p');para(p,x);body.append(p)})})
        .catch(()=>{body.replaceChildren(el('p','note','ما قدرت أحمّل التفسير، تأكد من الإنترنت.'))});
      // a closed book loads when opened, so a long tafsir costs nothing until it is read
      if(d.open)fill(); else d.addEventListener('toggle',()=>{if(d.open&&!d.dataset.l){d.dataset.l=1;fill()}});
      if(d.open)d.dataset.l=1;
    });
  }
  const row=$('wardBtns'); row.replaceChildren();
  if(!S.done){const ok=el('button','btn primary grow','قرأت ورد اليوم ✓');ok.onclick=()=>{const nx=after(list);S.s=nx.s;S.a=nx.a;S.done=true;S.log[today()]=(S.log[today()]||0)+list.length;save();render();renderLog();scrollTo({top:0,behavior:'smooth'})};row.append(ok)}
  else{const more=el('button','btn grow','📖 اقرأ ورد زيادة');more.onclick=()=>{S.from={s:S.s,a:S.a};S.done=false;save();render();scrollTo({top:0,behavior:'smooth'})};row.append(more)}
}

function renderSettings(){
  const per=$('per'); per.replaceChildren();
  [1,2,3,4,5,7,10,15,20,30].forEach(n=>{const o=el('option','',ayat(n));o.value=n;if(n===S.per)o.selected=true;per.append(o)});
  per.onchange=()=>{S.per=+per.value;save();render()};
  const open=$('openFirst'); open.checked=S.open!==false; open.onchange=()=>{S.open=open.checked;save();render()};
  const bl=$('books'); bl.replaceChildren();
  // chosen books first, in their order (▲ moves one up), then the others by group: short, contemporary, long
  const order=[...S.books,...Q.tafasir.map(t=>t.k).filter(k=>!S.books.includes(k))];
  order.forEach((k,i)=>{const t=TF[k],on=S.books.includes(k);
    const lbl=on?(i===0?'اللي اخترتها':''):(t.g&&(i===0||S.books.includes(order[i-1])||TF[order[i-1]].g!==t.g)?'تفاسير '+t.g:'');
    if(lbl)bl.append(el('div','eyebrow',lbl));
    const r=el('label','bk'+(on?' on':'')); const c=el('input');c.type='checkbox';c.checked=on;
    c.onchange=()=>{S.books=c.checked?[...S.books,k]:S.books.filter(x=>x!==k);save();renderSettings();render()};
    const tx=el('span','bkt'); tx.append(el('b','',t.t),el('small','',t.by+(t.size>8?' · مطوّل':''))); r.append(c,tx);
    if(on&&S.books.indexOf(k)>0){const up=el('button','btn up','▲');up.type='button';up.title='قدّمه';up.onclick=e=>{e.preventDefault();const i=S.books.indexOf(k);S.books.splice(i,1);S.books.splice(i-1,0,k);save();renderSettings();render()};r.append(up)}
    bl.append(r)});
  const su=$('sura'); su.replaceChildren(); Q.suras.forEach(([n,c],i)=>{const o=el('option','',ar(i+1)+'. '+n);o.value=i+1;if(i+1===S.from.s)o.selected=true;su.append(o)});
  const ay=$('ayah'); const lim=()=>{ay.max=Q.suras[su.value-1][1];ay.placeholder='١–'+ar(ay.max)}; su.onchange=()=>{ay.value=1;lim()}; ay.value=S.from.a; lim();
  $('go').onclick=()=>{const s=+su.value,a=Math.min(Math.max(1,+ay.value||1),Q.suras[s-1][1]);S.s=s;S.a=a;S.from={s,a};S.done=false;save();render();scrollTo({top:0,behavior:'smooth'})};
}

function renderLog(){
  const days=Object.keys(S.log).sort().reverse(), tot=Object.values(S.log).reduce((x,y)=>x+y,0);
  let streak=0;for(let d=new Date(today()+'T12:00:00');S.log[d.toISOString().slice(0,10)];d.setDate(d.getDate()-1))streak++;
  $('logSum').textContent=tot?'قرأت '+ayat(tot)+' مع تفسيرها'+(streak>1?' · '+ar(streak)+' أيام ورا بعض 🔥':''):'هون بيطلع سجلّ قراءتك.';
  const l=$('logList'); l.replaceChildren(); days.slice(0,14).forEach(d=>{const x=el('div');x.append(el('span','',d),el('span','note',ayat(S.log[d])));l.append(x)});
}
renderSettings(); render(); renderLog();
})();
