/* ---------- review scheduling: FSRS-6 (open-spaced-repetition, MIT) for whole review blocks ----------
   A block (a finished chapter, or a slice of verses known from before) is one card: {s: stability in days, d: difficulty 1–10,
   last: day of the last review, due, lap: lapses, reps}. Grades: again 1, hard 2, good 3.
   The next interval is the time until recall is expected to drop to the target retention (the reader can choose it).
   Cards from the earlier fixed ladder ({st: stage 1..7}) are converted on first use. Formulas:
   https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm */
(function(){
const W=[0.212,1.2931,2.3065,8.2956,6.4133,0.8334,3.0194,0.001,1.8722,0.1666,0.796,1.4835,0.0614,0.2629,1.6483,0.6014,1.8729,0.5425,0.0912,0.0658,0.1542];
const DECAY=W[20], F=Math.pow(0.9,-1/DECAY)-1, MAX=60, LADDER=[1,2,4,7,15,30,60];
const clampD=d=>Math.min(10,Math.max(1,d));
const D0=g=>clampD(W[4]-Math.exp(W[5]*(g-1))+1);
const R=(t,s)=>Math.pow(1+F*t/s,-DECAY);
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const diff=(a,b)=>Math.round((new Date(a+'T12:00:00Z')-new Date(b+'T12:00:00Z'))/864e5);
// target retention from the reader's settings: 0.85 fewer reviews, 0.9 balanced, 0.95 more reviews
const target=()=>{try{return JSON.parse(localStorage.getItem('mutoon_prefs')||'{}').ret||0.9}catch(e){return 0.9}};
function days(s){const r=target();return Math.max(1,Math.min(MAX,Math.round(s/F*(Math.pow(r,-1/DECAY)-1))))}
// spread equal intervals a little so blocks learned together don't all fall due on the same day
function fuzz(n,seed){if(n<4)return n;const k=Math.max(1,Math.round(n*0.05));let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;return n-k+(h%(2*k+1))}
// a card from the old fixed ladder becomes a card of the same interval and middling difficulty
function migrate(c,today){
  if(c.s)return c;
  const st=Math.max(1,Math.min(LADDER.length,c.st||1)), s=LADDER[st-1];
  c.s=s; c.d=5; c.reps=c.reps||st; c.last=c.due?addDays(c.due,-s):today; delete c.st; return c;
}
function step(c,g,today){
  if(!c.reps){return {s:W[g-1],d:D0(g)}}
  const t=Math.max(0,diff(today,c.last||today)), r=R(t,c.s);
  let s;
  if(t===0)s=c.s*Math.exp(W[17]*(g-3+W[18]))*Math.pow(c.s,-W[19]);
  else if(g===1)s=Math.min(c.s,W[11]*Math.pow(c.d,-W[12])*(Math.pow(c.s+1,W[13])-1)*Math.exp(W[14]*(1-r)));
  else s=c.s*(1+Math.exp(W[8])*(11-c.d)*Math.pow(c.s,-W[9])*(Math.exp(W[10]*(1-r))-1)*(g===2?W[15]:1));
  const d1=c.d+(-W[6]*(g-3))*(10-c.d)/9, d=clampD(W[7]*D0(4)+(1-W[7])*d1);
  return {s:Math.max(0.1,s),d};
}
const GR={again:1,hard:2,good:3};
// grade a card in place; returns it
function review(c,grade,today,seed){
  migrate(c,today); const g=GR[grade]||grade, n=step(c,g,today);
  c.s=n.s; c.d=n.d; c.reps=(c.reps||0)+1; if(g===1)c.lap=(c.lap||0)+1; c.last=today;
  c.due=addDays(today,g===1?1:fuzz(days(c.s),seed||c.due)); delete c.old; return c;
}
// days until the next review for each grade, for the button labels
function preview(c,today){
  const x=migrate({...c},today), o={};
  for(const k of ['again','hard','good']){const n=step(x,GR[k],today);o[k]=GR[k]===1?1:days(n.s)}
  return o;
}
// a fresh card: a chapter just finished (first review tomorrow), or old memorisation by its strength
function fresh(today){return {s:1,d:5,reps:1,lap:0,last:today,due:addDays(today,1)}}
function known(strength,today,due){const s={strong:20,mid:8,weak:2.5}[strength]||8, d={strong:4,mid:5.5,weak:7}[strength]||5.5;
  return {s,d,reps:1,lap:0,last:today,due:due||addDays(today,1),old:1}}
// how often the block comes back now, in words for the reader
function label(c){const n=days(c.s||LADDER[Math.max(0,(c.st||1)-1)]);
  return n>=MAX?'ثابت، كل شهرين':`بيرجع كل ${n<=1?'يوم':n===2?'يومين':String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])+(n<=10?' أيام':' يوم')} تقريبًا`}
window.SRS={review,preview,fresh,known,migrate,label,days};
})();
