const fs=require('fs');const {norm,lcs}=require('./norm.js');
const pre=s=>s.replace(/\.\.\./g,' ').replace(/([كب]َ?ـ)\s*["«(]?\s*/g,'$1').replace(/ـ/g,'');
const glue=s=>s.replace(/["«»“”{}﴿﴾\[\]]/g,' ').replace(/(^|\s)(وَ?)\s+/g,'$1$2').replace(/(^|\s)(وَ?)(مَا|ما)\s+(?=(زَالَ|زال|فَتِئَ|فتئ|انْفَكَّ|انفك|بَرِحَ|برح|دَامَ|دام)[\s،,.])/g,(m,a,b,c)=>a+b+c);
const toks=(s,extra={})=>glue(pre(s)).split(/\s+/).map(w=>Object.assign({w,n:norm(w)},extra)).filter(t=>t.n);
const S=toks(fs.readFileSync('sum-clean.txt','utf8'));
const F=[];require('./fz3.json').forEach((q,qi)=>toks(q.s.replace(/[()]/g,' '),{q:qi,p:q.p}).forEach(t=>F.push(t)));
const M=[];require('./mh.json').forEach((q,qi)=>toks(q,{q:qi}).forEach(t=>M.push(t)));
const mf=lcs(S,F),mm=lcs(S,M);
// Build rows: walk S; between aligned anchors, emit F-inserts (same quote) and M-inserts
const rows=[];let lastF=-1,lastM=-1;
for(let i=0;i<S.length;i++){
  const fi=mf[i],mi=mm[i];
  const fins=[],mins=[];
  if(fi>=0&&lastF>=0&&fi-lastF>1&&fi-lastF<12&&F[fi].q===F[lastF].q)for(let k=lastF+1;k<fi;k++)fins.push(F[k].w);
  if(mi>=0&&lastM>=0&&mi-lastM>1&&mi-lastM<12&&M[mi].q===M[lastM].q)for(let k=lastM+1;k<mi;k++)mins.push(M[k].w);
  if(fins.length||mins.length)rows.push({ins:true,f:fins,m:mins,i});
  rows.push({i,s:S[i].w,f:fi>=0?F[fi].w:null,m:mi>=0?M[mi].w:null,fp:fi>=0?F[fi].p:null});
  if(fi>=0)lastF=fi;if(mi>=0)lastM=mi;
}
fs.writeFileSync('rows.json',JSON.stringify(rows));
// report
const rep=[];
for(const r of rows){if(r.ins)rep.push(`INS @${r.i}  F+[${r.f.join(' ')}]  M+[${r.m.join(' ')}]  ctx: ${S.slice(Math.max(0,r.i-4),r.i+3).map(t=>t.w).join(' ')}`);
 else if(!r.f||!r.m)rep.push(`S @${r.i} ${r.s}  F:${r.f||'-'}  M:${r.m||'-'}`);}
fs.writeFileSync('rep.txt',rep.join('\n'));
console.log('rows',rows.length,'S no F',rows.filter(r=>!r.ins&&!r.f).length,'S no M',rows.filter(r=>!r.ins&&!r.m).length,'ins',rows.filter(r=>r.ins).length);
