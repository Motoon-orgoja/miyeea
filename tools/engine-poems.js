
/* ---------- poems: order, switching, info ---------- */
function switchPoem(id){store.set('cur',id);location.reload()}
function poemStatus(id){const st=id===CUR?S:stateOf(id),n=poemOf(id).verses.length;if(!st)return 'لسا ما بلّشتها';return st.mem>=n?'ختمتها ✓':`حافظ ${ar(st.mem)} من ${ar(n)}`}
function renderPoems(){
  if(!MULTI)return;
  if($('setup').hidden&&$('welcome').hidden)$('poemBar').hidden=false;
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
  link(add('p','مصدر النص: '),P.source,P.srcUrl);
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
renderPoemInfo(); renderPoems();
