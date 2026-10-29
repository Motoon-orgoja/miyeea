/* ---------- interface language: عامية (the source strings) · فصحى · English ----------
   The pages are written with Jordanian-colloquial labels. For another language this file loads a dictionary
   (i18n/<lang>.js, built by tools/build-i18n.js) and translates the interface as it is drawn: text nodes, and the
   placeholder / aria-label / title attributes, watched with a MutationObserver. The texts being memorised (verses,
   hadith, commentary) are never touched. A string is first looked up whole; otherwise its parts between « · » are,
   and a part made of several known pieces (a message built from fragments and numbers) is translated piece by piece
   only when nothing Arabic is left over, so a chapter title is never half translated. */
(function(){
let lang='ar'; try{lang=JSON.parse(localStorage.getItem('mutoon_prefs')||'{}').lang||'ar'}catch(e){}
window.LANG=lang;
if(lang==='ar')return;
document.write('<script src="i18n/'+lang+'.js"><\/script>');
const root=document.documentElement;
if(lang==='en'){root.lang='en';root.dir='ltr'}
// what is being memorised or quoted stays as it is
const SKIP='.bayt,.utext,.gloss,.sharh,.ecard,.ui-hit-t,.ui-preview,.uhead>span:first-child,#cTitle,.pmeta b,.ptitle,textarea,script,style,[data-noi18n]';
const LET=/[ء-ي]/;
let D=null, RE=null;
function prep(){
  D=window.I18N||{}; const keys=Object.keys(D).filter(k=>k.length>1).sort((a,b)=>b.length-a.length);
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  RE=keys.length?new RegExp('(?<![\\u0621-\\u064A])(?:'+keys.map(esc).join('|')+')(?![\\u0621-\\u064A])','g'):null;
}
const enDigits=s=>lang==='en'?s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٪/g,'%').replace(/،/g,',').replace(/؟/g,'?').replace(/؛/g,';'):s;
function part(p){
  const t=p.trim(); if(!t||!LET.test(t))return p;
  const lead=p.slice(0,p.indexOf(t[0])), trail=p.slice(p.indexOf(t[0])+t.length);
  if(D[t]!=null)return lead+enDigits(D[t])+trail;
  if(!RE)return p;
  // pieces: accept only if every Arabic letter outside «quotes» was covered by a known piece
  const rest=t.replace(RE,'').replace(/«[^»]*»/g,'');
  if(LET.test(rest))return p;
  return lead+enDigits(t.replace(RE,m=>D[m]).replace(/«([^»]*)»/g,lang==='en'?'“$1”':'«$1»'))+trail;
}
function tr(s){
  if(!s||!LET.test(s))return s;
  const t=s.trim(); if(D[t]!=null)return s.replace(t,enDigits(D[t]));
  return s.split(' · ').map(part).join(' · ');
}
window.T=s=>D?tr(s):s;
const done=new WeakMap();
function node(n){
  if(n.nodeType===3){const p=n.parentElement; if(!p||p.closest(SKIP))return; const v=n.nodeValue; if(done.get(n)===v)return; const o=tr(v); if(o!==v)n.nodeValue=o; done.set(n,n.nodeValue);return}
  if(n.nodeType!==1||n.closest(SKIP))return;
  for(const a of ['placeholder','aria-label','title']){const v=n.getAttribute(a);if(v&&LET.test(v)){const o=tr(v);if(o!==v)n.setAttribute(a,o)}}
  for(const c of n.childNodes)node(c);
}
// dialogs and the tab title too
const _c=window.confirm.bind(window), _a=window.alert.bind(window), _p=window.prompt.bind(window);
window.confirm=m=>_c(window.T(m)); window.alert=m=>_a(window.T(m)); window.prompt=(m,d)=>_p(window.T(m),d);
function start(){
  prep(); node(document.body); document.title=tr(document.title);
  new MutationObserver(ms=>{for(const m of ms){
    if(m.type==='characterData')node(m.target);
    else if(m.type==='attributes')node(m.target);
    else m.addedNodes.forEach(node)}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start); else start();
})();
