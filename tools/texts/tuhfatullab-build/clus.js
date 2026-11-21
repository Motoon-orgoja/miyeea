const r=require('./all.json');const F={};const cnt={};
for(const pg of r)for(const g of pg.G){const f=g[5];F[f]=F[f]||{};F[f][g[0]]=g[1];cnt[f]=(cnt[f]||0)+1}
const names=Object.keys(F);const par={};const find=x=>par[x]===undefined||par[x]===x?(par[x]=x):(par[x]=find(par[x]));
function compat(a,b){let sh=0;for(const c in F[a])if(c in F[b]){sh++;if(Math.abs(F[a][c]-F[b][c])>0.004)return false}return sh>=8}
for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++)if(compat(names[i],names[j]))par[find(names[i])]=find(names[j]);
const cl={};for(const n of names){const k=find(n);(cl[k]=cl[k]||[]).push(n)}
const out=Object.values(cl).map(v=>({fonts:v,n:v.reduce((s,f)=>s+cnt[f],0)})).sort((a,b)=>b.n-a.n);
console.log(names.length,'fonts',out.length,'clusters');
for(const c of out){const ch={};for(const f of c.fonts)Object.assign(ch,F[f]);console.log(c.n,c.fonts.length,Object.keys(ch).sort().join(''))}
fs=require('fs');fs.writeFileSync('clusters.json',JSON.stringify(out));
