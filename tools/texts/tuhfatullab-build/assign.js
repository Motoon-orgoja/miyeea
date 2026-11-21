const r=require('./all.json');const cl=require('./clusters.json');const F={},cnt={};
for(const pg of r)for(const g of pg.G){F[g[5]]=F[g[5]]||{};F[g[5]][g[0]]=g[1];cnt[g[5]]=(cnt[g[5]]||0)+1}
const big=cl.map((c,i)=>c.fonts.length>=16?i:-1).filter(i=>i>=0);const W={};for(const b of big){W[b]={};for(const f of cl[b].fonts)Object.assign(W[b],F[f])}
const map={};big.forEach(b=>cl[b].fonts.forEach(f=>map[f]=b));const amb=[];
for(const f in F){if(map[f]!==undefined)continue;let best=null,bs=0,tie=false;
 for(const b of big){let sh=0,ok=true;for(const c in F[f])if(c in W[b]){if(Math.abs(W[b][c]-F[f][c])>0.004){ok=false;break}sh++}
  const tot=Object.keys(F[f]).length; if(ok&&sh===tot){if(sh>bs){best=b;bs=sh;tie=false}else if(sh===bs)tie=true}}
 if(best!==null&&!tie)map[f]=best;else amb.push(f+'('+cnt[f]+'):'+Object.keys(F[f]).join('')+(best!==null?' tie':''));}
require('fs').writeFileSync('fontmap.json',JSON.stringify(map));
console.log('assigned',Object.keys(map).length,'amb',amb.length);console.log(amb.join('\n'));
