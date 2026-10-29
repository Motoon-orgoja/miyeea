// Standard hadith numbering = the one of riyadh.islamenc.com (IslamHouse; same as Dalil al-Falihin and as the app's chapter 91).
// al-Fahl's edition (= sunnah.com's numbering) differs by one in chapters 54–132. This aligns the two per chapter by the
// opening words of each hadith and writes tools/riyad/numbering.json {fahlNum: standardNum}, plus a report.
const fs=require('fs'),path=require('path');const {fold,tidy}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache');
const S=JSON.parse(fs.readFileSync(path.join(C,'fahl-struct.json'),'utf8'));
const norm=s=>fold(s.replace(/صلى الله عليه وسلم|ﷺ/g,' ')).split(' ').filter(w=>w.length>1).map(w=>w.replace(/^و/,''));
const sim=(a,b)=>{let s=0;for(const w of a.slice(0,8))if(b.slice(0,14).includes(w))s++;return s/Math.max(1,Math.min(8,a.length))};
function isl(n){const f=path.join(C,'islamenc',(n+4)+'.html');if(!fs.existsSync(f))return null;
  const d=fs.readFileSync(f,'utf8');const title=((d.match(/<h1 class="title"[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'').replace(/<[^>]+>/g,'').trim();
  const body=d.replace(/<br[^>]*>/g,' ').replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');
  const hs=[];for(const m of body.matchAll(/(?:^|\n)\s*(\d+)\s*\/\s*(\d+)\s*ـ*\s*([^\n]*)/g))hs.push({k:+m[1],n:+m[2],w:norm(m[3]),t:m[3].trim()});
  return {title,hs};}
const map={},report=[];
for(const c of S.chapters){
  const fh=c.items.filter(x=>x.t==='h').map(x=>({fn:x.fn,w:norm(tidy(x.paras[0])),t:tidy(x.paras[0])}));
  const I=isl(c.n);if(!I){report.push('no islamenc page for chapter '+c.n);fh.forEach(h=>map[h.fn]=h.fn);continue}
  if(parseInt(I.title)!==c.n)report.push(`chapter ${c.n}: islamenc page title «${I.title.slice(0,40)}»`);
  // DP alignment allowing a Fahl hadith to have no islamenc counterpart and vice versa
  const A=fh,B=I.hs,n=A.length,m=B.length;const dp=Array.from({length:n+1},()=>Array(m+1).fill(-1e9)),bk=Array.from({length:n+1},()=>Array(m+1).fill(0));dp[0][0]=0;
  for(let i=0;i<=n;i++)for(let j=0;j<=m;j++){if(i&&j){const v=dp[i-1][j-1]+sim(A[i-1].w,B[j-1].w)*2-0.5;if(v>dp[i][j]){dp[i][j]=v;bk[i][j]=1}}
    if(i){const v=dp[i-1][j]-0.6;if(v>dp[i][j]){dp[i][j]=v;bk[i][j]=2}}if(j){const v=dp[i][j-1]-0.6;if(v>dp[i][j]){dp[i][j]=v;bk[i][j]=3}}}
  let i=n,j=m;const pairs=[];while(i||j){const b=bk[i][j];if(b===1){pairs.push([i-1,j-1]);i--;j--}else if(b===2){pairs.push([i-1,null]);i--}else{pairs.push([null,j-1]);j--}}
  pairs.reverse();
  for(const [a,b] of pairs){
    if(a!=null&&b!=null){map[A[a].fn]=B[b].n;if(sim(A[a].w,B[b].w)<0.4)report.push(`ch ${c.n}: weak match fahl ${A[a].fn} ↔ std ${B[b].n}: «${A[a].t.slice(0,50)}» / «${B[b].t.slice(0,50)}»`)}
    else if(a!=null){report.push(`ch ${c.n}: fahl ${A[a].fn} has no islamenc counterpart: «${A[a].t.slice(0,60)}»`);map[A[a].fn]=null}
    else report.push(`ch ${c.n}: islamenc ${B[b].n} has no Fahl counterpart: «${B[b].t.slice(0,80)}»`);
  }
}
// typos in islamenc's numbers (e.g. «321» printed for 326): a number that does not increase becomes previous+1
const fns=Object.keys(map).map(Number).sort((a,b)=>a-b);
for(let k=1;k<fns.length;k++){const f=fns[k],p=map[fns[k-1]];if(map[f]!=null&&p!=null&&map[f]<=p){report.push(`fahl ${f}: islamenc number ${map[f]} after ${p} → ${p+1}`);map[f]=p+1}}
// a Fahl hadith without counterpart: numbered from its neighbour if there is room, else it is not in the standard text (0 = drop)
for(let k=0;k<fns.length;k++){const f=fns[k];if(map[f]!=null)continue;const prev=k?map[fns[k-1]]:0,next=k+1<fns.length?map[fns[k+1]]:prev+2;
  if(next===prev+1){map[f]=0;report.push(`fahl ${f}: absent from the standard numbering (no room between ${prev} and ${next}) → dropped`)}else{map[f]=prev+1;report.push(`fahl ${f}: numbered ${map[f]} from its neighbours`)}}
let prev=0;for(const f of fns){if(!map[f])continue;if(map[f]<=prev)report.push(`non-increasing: fahl ${f} → ${map[f]} after ${prev}`);if(map[f]>prev+1)report.push(`gap before std ${map[f]} (fahl ${f})`);prev=map[f]}
fs.writeFileSync(path.join(__dirname,'numbering.json'),JSON.stringify(map));
fs.writeFileSync(path.join(C,'numbering-report.txt'),report.join('\n'));
const offs={};for(const f of fns){const o=map[f]-f;offs[o]=(offs[o]||0)+1}
console.log('mapped',fns.length,'offsets',offs,'report lines',report.length,'last std',map[fns[fns.length-1]]);
