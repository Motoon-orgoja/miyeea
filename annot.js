/* ---------- highlights and notes on the text ----------
   «🖍» in the app bar turns on marking: tap a word (and another to make a range), then a colour, «📝 ملاحظة» or
   «🧽 امسح». A note can be typed or written by hand. Marks are saved per word (localStorage mutoon_ann, synced and
   backed up like progress) and drawn on every view of the text — today, the chapter, the whole text, hidden modes —
   because they are reapplied whenever words appear on the page.
   A word's address: in a passage (.unit[data-id]) its segment and place in it ("2.5"), so it survives the tracks
   that show the narrator as plain text; in a verse (.v[data-i]) its place in the verse. */
(function(){
const B=window.BOOK; if(!B)return;
const AK='mutoon_ann', COLORS=[['y','أصفر'],['g','أخضر'],['b','أزرق'],['p','بنفسجي']];
const UI=()=>window.UI;
const load=()=>{try{return JSON.parse(localStorage.getItem(AK))||{}}catch(e){return {}}};
let A=load(); const book=()=>A[B.key]||(A[B.key]={});
function save(){Object.keys(book()).forEach(k=>{const c=book()[k];if(!Object.keys(c.h||{}).length&&!(c.n||[]).length)delete book()[k]});
  if(!Object.keys(book()).length)delete A[B.key];
  try{localStorage.setItem(AK,JSON.stringify(A))}catch(e){UI()&&UI().toast('ما في مكان كافي على الجهاز للملاحظات')}}
addEventListener('storage',e=>{if(e.key===AK){A=load();paint()}});

const box=w=>w.closest('.unit[data-id],.v[data-i]');
const ckey=c=>c.classList.contains('unit')?'u:'+c.dataset.id:'v:'+(document.body.dataset.poem||'')+':'+c.dataset.i;
const ws=c=>[...c.querySelectorAll('.w')];
function addr(w,c){
  if(c.classList.contains('unit')){const s=w.closest('.seg'), segs=[...c.querySelectorAll('.seg')]; return segs.indexOf(s)+'.'+[...s.querySelectorAll('.w')].indexOf(w)}
  return String(ws(c).indexOf(w));
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- drawing the marks on whatever is on the page ---------- */
function paintBox(c){
  const k=ckey(c), d=book()[k], h=(d&&d.h)||{}, noted=new Set(), notes=(d&&d.n)||[];
  notes.forEach(n=>n.w.forEach(a=>noted.add(a)));
  ws(c).forEach(w=>{const a=addr(w,c), col=h[a];
    COLORS.forEach(([x])=>w.classList.toggle('hl-'+x,col===x)); w.classList.toggle('hl-nt',noted.has(a))});
  let chip=c.querySelector(':scope > .ann-chip');
  if(notes.length){if(!chip){chip=document.createElement('button');chip.type='button';chip.className='ann-chip';c.append(chip)}
    chip.textContent='📝 '+(notes.length>1?arN(notes.length)+' ملاحظات':'ملاحظة'); chip.onclick=e=>{e.stopPropagation();openNotes(c)}}
  else if(chip)chip.remove();
}
function paint(){document.querySelectorAll('.unit[data-id],.v[data-i]').forEach(c=>{if(c.querySelector('.w'))paintBox(c)})}
let raf=0; new MutationObserver(()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;paint();if(SEL)showSel()})}).observe(document.body,{childList:true,subtree:true});
const arN=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);

/* ---------- marking mode ---------- */
let ON=false, SEL=null; // SEL = {k, a: first address, b: last address}
const bar=document.createElement('div'); bar.className='ann-bar'; bar.hidden=true;
bar.innerHTML='<div class="ann-hint" data-k="hint"></div><div class="ann-row">'+
  COLORS.map(([x,t])=>`<button type="button" class="ann-c hl-${x}" data-c="${x}" aria-label="${t}"></button>`).join('')+
  '<button type="button" class="btn" data-a="note">📝 ملاحظة</button><button type="button" class="btn" data-a="clear">🧽 امسح</button>'+
  '<button type="button" class="btn" data-a="all">📒 ملاحظاتي</button><button type="button" class="btn primary" data-a="off">خلصت</button></div>';
document.body.append(bar);
const hint=s=>bar.querySelector('[data-k=hint]').textContent=s;
function setOn(v){ON=v; SEL=null; document.body.classList.toggle('ann-on',v); bar.hidden=!v; showSel(); btn&&btn.classList.toggle('on',v);
  hint('اضغط على كلمة، ولتحدد أكثر من كلمة اضغط على آخر كلمة كمان.')}
function boxByKey(k){return [...document.querySelectorAll('.unit[data-id],.v[data-i]')].find(c=>ckey(c)===k&&c.querySelector('.w'))}
function selWords(){
  if(!SEL)return []; const c=boxByKey(SEL.k); if(!c)return [];
  const all=ws(c), i=all.findIndex(w=>addr(w,c)===SEL.a), j=all.findIndex(w=>addr(w,c)===SEL.b);
  if(i<0||j<0)return []; return all.slice(Math.min(i,j),Math.max(i,j)+1);
}
function showSel(){document.querySelectorAll('.w.ann-sel').forEach(w=>w.classList.remove('ann-sel')); selWords().forEach(w=>w.classList.add('ann-sel'))}
// while marking, a tap on a word selects it instead of what the page does with it (peek, hint, reveal)
document.addEventListener('click',e=>{
  if(!ON)return; const w=e.target.closest('.w'); if(!w||bar.contains(w))return; const c=box(w); if(!c)return;
  e.preventDefault(); e.stopPropagation();
  const k=ckey(c), a=addr(w,c);
  if(SEL&&SEL.k===k&&SEL.a===SEL.b&&SEL.a!==a)SEL.b=a; else SEL={k,a,b:a};
  showSel(); const n=selWords().length;
  hint(n>1?`محدّد ${arN(n)} كلمات. اختار لون أو اكتب ملاحظة.`:'محدّدة كلمة. اضغط على كلمة ثانية لتوسّع التحديد، أو اختار لون.');
},true);
bar.addEventListener('click',e=>{
  const t=e.target.closest('button'); if(!t)return;
  if(t.dataset.a==='off')return setOn(false);
  if(t.dataset.a==='all')return openAll();
  const sel=selWords(); if(!sel.length){hint('اختار كلمة من النص أول.');return}
  const c=box(sel[0]), d=book()[SEL.k]||(book()[SEL.k]={h:{},n:[]}); d.h=d.h||{}; d.n=d.n||[];
  const addrs=sel.map(w=>addr(w,c));
  if(t.dataset.c){const same=addrs.every(a=>d.h[a]===t.dataset.c); addrs.forEach(a=>same?delete d.h[a]:d.h[a]=t.dataset.c)}
  else if(t.dataset.a==='clear'){addrs.forEach(a=>delete d.h[a]); d.n=d.n.filter(n=>!n.w.some(a=>addrs.includes(a)))}
  else if(t.dataset.a==='note'){editNote(c,SEL.k,{w:addrs,q:sel.map(w=>w.textContent).join(' ')});return}
  save(); SEL=null; paint(); showSel(); hint('انحفظ ✓ اختار كلمة ثانية، أو اضغط «خلصت».');
});

/* ---------- notes: typed or handwritten ---------- */
// handwriting is kept as strokes (points on a 300-wide canvas) and drawn back as SVG, small enough to sync
const svgOf=(st,h)=>`<svg viewBox="0 0 300 ${h}" class="ann-ink" aria-hidden="true">`+st.map(s=>`<polyline points="${s.join(' ')}"/>`).join('')+'</svg>';
function pad(strokes){
  const H=170, wrap=document.createElement('div'); wrap.className='ann-pad';
  const cv=document.createElement('canvas'); const r=Math.max(1,devicePixelRatio||1); cv.width=300*r; cv.height=H*r;
  const g=cv.getContext('2d'); g.scale(r,r); g.lineCap=g.lineJoin='round'; g.lineWidth=2.4;
  const col=()=>getComputedStyle(document.body).color;
  const draw=()=>{g.clearRect(0,0,300,H); g.strokeStyle=col(); strokes.forEach(s=>{g.beginPath(); for(let i=0;i<s.length;i+=2)i?g.lineTo(s[i],s[i+1]):g.moveTo(s[i],s[i+1]); if(s.length===2)g.lineTo(s[0]+.1,s[1]); g.stroke()})};
  let cur=null; const pt=e=>{const b=cv.getBoundingClientRect(); return [Math.round((e.clientX-b.left)/b.width*300),Math.round((e.clientY-b.top)/b.height*H)]};
  cv.addEventListener('pointerdown',e=>{e.preventDefault(); cv.setPointerCapture(e.pointerId); cur=pt(e); strokes.push(cur); draw()});
  cv.addEventListener('pointermove',e=>{if(!cur)return; e.preventDefault(); const p=pt(e), l=cur.length; if(Math.abs(p[0]-cur[l-2])+Math.abs(p[1]-cur[l-1])>1){cur.push(p[0],p[1]); draw()}});
  const end=()=>cur=null; cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end);
  const undo=document.createElement('button'); undo.type='button'; undo.className='btn'; undo.textContent='↶ تراجع'; undo.onclick=()=>{strokes.pop();draw()};
  const clr=document.createElement('button'); clr.type='button'; clr.className='btn'; clr.textContent='امسح الرسم'; clr.onclick=()=>{strokes.length=0;draw()};
  const tools=document.createElement('div'); tools.className='ann-row'; tools.append(undo,clr);
  wrap.append(cv,tools); requestAnimationFrame(draw); return {el:wrap,H};
}
function editNote(c,k,n,onDone){
  const isNew=!n.id, b=UI().sheet(isNew?'ملاحظة جديدة':'الملاحظة');
  const q=document.createElement('div'); q.className='ann-q'; q.dataset.noi18n=''; q.textContent='«'+n.q+'»'; b.append(q);
  const t=document.createElement('textarea'); t.rows=4; t.dir='auto'; t.placeholder='اكتب ملاحظتك…'; t.value=n.t||''; t.className='ann-t';
  const strokes=(n.d||[]).map(s=>s.slice()); let p=null;
  const hand=document.createElement('button'); hand.type='button'; hand.className='btn'; hand.textContent='✍️ اكتب بإيدك';
  hand.onclick=()=>{if(p)return; p=pad(strokes); hand.replaceWith(p.el)};
  b.append(t, hand); if(strokes.length)hand.click();
  const row=document.createElement('div'); row.className='ann-row';
  const ok=document.createElement('button'); ok.type='button'; ok.className='btn primary'; ok.textContent='احفظ';
  ok.onclick=()=>{
    const txt=t.value.trim(); if(!txt&&!strokes.length){t.focus();return}
    const d=book()[k]||(book()[k]={h:{},n:[]}); d.n=d.n||[];
    const o={id:n.id||Date.now().toString(36),w:n.w,q:n.q,t:txt,at:new Date().toISOString().slice(0,10)}; if(strokes.length){o.d=strokes;o.H=p?p.H:(n.H||170)}
    const i=d.n.findIndex(x=>x.id===o.id); i<0?d.n.push(o):d.n[i]=o;
    save(); UI().closeSheet(); SEL=null; paint(); showSel(); UI().toast('انحفظت الملاحظة ✓'); onDone&&onDone()};
  row.append(ok);
  if(!isNew){const del=document.createElement('button'); del.type='button'; del.className='btn'; del.textContent='🗑 احذفها';
    del.onclick=()=>{const d=book()[k]; d.n=d.n.filter(x=>x.id!==n.id); save(); UI().closeSheet(); paint(); UI().toast('انحذفت الملاحظة')}; row.append(del)}
  b.append(row); if(isNew&&!strokes.length)setTimeout(()=>t.focus(),250);
}
function noteCard(n,open){
  const d=document.createElement('div'); d.className='ann-note';
  d.innerHTML=`<div class="ann-q">«${esc(n.q)}»</div>`+(n.t?`<div class="ann-tx">${esc(n.t).replace(/\n/g,'<br>')}</div>`:'')+(n.d?svgOf(n.d,n.H||170):'')+`<small>${esc(n.at||'')}</small>`;
  d.querySelector('.ann-q').dataset.noi18n=''; const tx=d.querySelector('.ann-tx'); if(tx)tx.dataset.noi18n='';
  if(open){d.classList.add('click'); d.onclick=open}
  return d;
}
function openNotes(c){
  const k=ckey(c), d=book()[k]; if(!d||!d.n||!d.n.length)return;
  const b=UI().sheet('الملاحظات');
  d.n.forEach(n=>b.append(noteCard(n,()=>editNote(c,k,n))));
  const h=document.createElement('div'); h.className='ui-hint'; h.textContent='اضغط على ملاحظة لتعدّلها أو تحذفها.'; b.append(h);
}
// where a mark lives: the link that opens it, and a short «البيت ٣» / passage label
const books=()=>UI().BOOKS||[];
function placeOf(bk,k){
  const b=books().find(x=>x.key===bk), m=k.match(/^u:(.+)$/)||k.match(/^v:([^:]*):(\d+)$/); if(!m)return {href:'',where:b?b.t:bk};
  const href=b?b.url+(k[0]==='u'?'#u='+encodeURIComponent(m[1]):'#v='+m[2]+(m[1]&&m[1]!==b.key?'&p='+encodeURIComponent(m[1]):'')):'';
  let where=b?b.t:bk; if(k[0]==='v')where+=' · البيت '+arN(m[2]); else if(bk===B.key){const u=unit(m[1]); if(u)where+=' · '+u.label}
  return {href,where};
}
function go(bk,href){if(!href)return; UI().closeSheet(); if(bk===B.key){const h='#'+href.split('#')[1]; location.hash===h?dispatchEvent(new HashChangeEvent('hashchange')):location.hash=h}else location.href=href}
const unit=id=>{for(const c of B.chapters||[])for(const u of c.units)if(u.id===id)return u; return null};
// the words of a passage or verse of this page's text, in the same addressing as the marks
function wordsOf(k){
  let m=k.match(/^u:(.+)$/); if(m){const u=unit(m[1]); if(!u)return []; const out=[]; u.segs.forEach(([,t],si)=>t.split(' ').forEach((w,wi)=>out.push([si+'.'+wi,w]))); return out}
  m=k.match(/^v:([^:]*):(\d+)$/); if(!m||!B.poems)return [];
  const p=B.poems.find(x=>x.id===m[1])||B.poems[0], v=p.verses[+m[2]-1]; if(!v)return [];
  return v[0].split(' ').concat(v[1].split(' ')).map((w,i)=>[String(i),w]);
}
// coloured words of this text, joined into runs of the same colour, in reading order
function runs(){
  const out=[];
  Object.entries(book()).forEach(([k,d])=>{const h=d.h||{}; if(!Object.keys(h).length)return; let cur=null;
    wordsOf(k).forEach(([a,w])=>{const c=h[a]; if(c&&cur&&cur.c===c)cur.t+=' '+w; else{cur=c?{k,c,t:w}:null; if(cur)out.push(cur)}})});
  return out;
}
const CN=Object.fromEntries(COLORS);
// every note in every text, newest first, and the coloured words of this text, each linking to its place
function openAll(){
  const b=UI().sheet('ملاحظاتي'), all=[];
  Object.entries(A).forEach(([bk,cs])=>Object.entries(cs).forEach(([k,d])=>(d.n||[]).forEach(n=>all.push({bk,k,n}))));
  const hl=Object.values(A).reduce((s,cs)=>s+Object.values(cs).reduce((x,d)=>x+Object.keys(d.h||{}).length,0),0), R=runs();
  const s=document.createElement('div'); s.className='ui-hint';
  s.textContent=all.length||hl?`${arN(all.length)} ${all.length===1?'ملاحظة':'ملاحظات'} و${arN(hl)} كلمة ملوّنة بكل المتون.`:'لسا ما في ملاحظات. فعّل «🖍» واختار كلمة واضغط «📝 ملاحظة».';
  const tabs=document.createElement('div'); tabs.className='ann-row ann-tabs'; let tab='n';
  const tn=document.createElement('button'), th=document.createElement('button'), pr=document.createElement('button');
  [tn,th,pr].forEach(x=>{x.type='button';x.className='btn'}); tn.textContent='📝 الملاحظات'; th.textContent='🖍 الملوّن بهالمتن ('+arN(R.length)+')'; pr.textContent='🖨 اطبع أو احفظ PDF';
  tn.onclick=()=>{tab='n';render()}; th.onclick=()=>{tab='h';render()}; pr.onclick=printAll; tabs.append(tn,th,pr);
  const f=document.createElement('input'); f.type='search'; f.placeholder='دوّر بملاحظاتك…'; f.dir='auto'; f.className='ann-f';
  const list=document.createElement('div'); b.append(s,tabs); if(all.length>4)b.append(f); b.append(list);
  all.sort((x,y)=>String(y.n.at||'').localeCompare(String(x.n.at||''))||String(y.n.id).localeCompare(String(x.n.id)));
  const render=()=>{list.replaceChildren(); const q=f.value.trim(); tn.classList.toggle('primary',tab==='n'); th.classList.toggle('primary',tab==='h'); f.hidden=tab!=='n';
    if(tab==='h'){
      if(!R.length){const e=document.createElement('div');e.className='ui-hint';e.textContent='ما في كلمات ملوّنة بهالمتن.';list.append(e);return}
      R.forEach(r=>{const p=placeOf(B.key,r.k), d=document.createElement('div'); d.className='ann-note click ann-run';
        const w=document.createElement('small'); w.className='ann-where'; w.textContent=p.where+' · '+CN[r.c];
        const t=document.createElement('div'); t.className='ann-q'; t.dataset.noi18n=''; const sp=document.createElement('span'); sp.className='w hl-'+r.c; sp.textContent=r.t; t.append(sp);
        d.append(w,t); d.onclick=()=>go(B.key,p.href); list.append(d)});
      return}
    all.filter(o=>!q||(o.n.t+' '+o.n.q).includes(q)).forEach(o=>{
      const p=placeOf(o.bk,o.k), card=noteCard(o.n,p.href?()=>go(o.bk,p.href):null);
      const where=document.createElement('small'); where.className='ann-where'; where.textContent=p.where; card.prepend(where);
      list.append(card)})};
  f.oninput=render; render();
}
// a plain page with every note (and this text's coloured words), opened for printing or saving as PDF
function printAll(){
  const e=s=>esc(s), parts=[];
  Object.entries(A).forEach(([bk,cs])=>{const bt=(books().find(x=>x.key===bk)||{}).t||bk, ns=[];
    Object.entries(cs).forEach(([k,d])=>(d.n||[]).forEach(n=>ns.push({k,n})));
    const rs=bk===B.key?runs():[]; if(!ns.length&&!rs.length)return;
    parts.push(`<h2>${e(bt)}</h2>`);
    if(rs.length)parts.push('<h3>الكلمات الملوّنة</h3><ul>'+rs.map(r=>`<li><mark class="${r.c}">${e(r.t)}</mark> <small>${e(placeOf(bk,r.k).where)}</small></li>`).join('')+'</ul>');
    if(ns.length)parts.push('<h3>الملاحظات</h3>'+ns.map(({k,n})=>`<div class="n"><small>${e(placeOf(bk,k).where)} · ${e(n.at||'')}</small><div class="q">«${e(n.q)}»</div>`+(n.t?`<p>${e(n.t).replace(/\n/g,'<br>')}</p>`:'')+(n.d?svgOf(n.d,n.H||170):'')+'</div>').join(''));
  });
  if(!parts.length){UI().toast('ما في ملاحظات للطباعة');return}
  const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ملاحظاتي · حفظ المتون</title>
<link rel="stylesheet" href="${new URL('fonts.css',document.baseURI)}"><style>body{font-family:'Noto Kufi Arabic',sans-serif;color:#222;max-width:720px;margin:24px auto;padding:0 18px;line-height:1.8}
h1{font-family:Amiri,serif;color:#0E6B4F}h2{font-family:Amiri,serif;color:#0E6B4F;border-bottom:2px solid #A8812F;margin-top:28px}h3{font-size:15px;color:#A8812F}
.q{font-family:Amiri,serif;font-size:20px}.n{border:1px solid #ddd;border-radius:10px;padding:8px 12px;margin:8px 0;break-inside:avoid}small{color:#777;font-size:12px}
mark{font-family:Amiri,serif;font-size:19px;background:linear-gradient(transparent 55%,var(--c) 55%)}mark.y{--c:#ffd84d}mark.g{--c:#8fdca2}mark.b{--c:#9cc6ff}mark.p{--c:#d2b3f7}
svg{width:100%;max-width:360px;display:block;fill:none;stroke:#222;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}</style></head>
<body><h1>ملاحظاتي</h1>${parts.join('')}<script>addEventListener('load',()=>setTimeout(()=>print(),400))<\/script></body></html>`;
  const w=open('','_blank'); if(!w){UI().toast('المتصفح منع فتح الصفحة، اسمح بالنوافذ المنبثقة');return} w.document.write(html); w.document.close();
}

/* ---------- the floating 🖍 button (the app bar is already full on a phone) ---------- */
let btn=null;
function mount(){
  if(btn)return;
  btn=document.createElement('button'); btn.type='button'; btn.className='ann-btn'; btn.textContent='🖍'; btn.setAttribute('aria-label','لوّن واكتب ملاحظات');
  btn.onclick=()=>setOn(!ON); document.body.append(btn);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{mount();paint()}):(mount(),paint());
addEventListener('load',mount);
window.ANN={paint,openAll,on:setOn};
})();
