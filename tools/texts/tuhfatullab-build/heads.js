const r=require('./all.json');const fs=require('fs');const H=[];
for(const pg of r){if(pg.p<60)continue;const by={};for(const g of pg.G){if(g[1]===0||g[4]<16.5)continue;const k=Math.round(g[3]/3);(by[k]=by[k]||[]).push(g)}
 for(const k in by){const gs=by[k];if(gs.length<3)continue;const xs=gs.map(g=>g[2]);H.push({p:pg.p,y:gs[0][3],size:gs[0][4],x0:Math.max(...xs),x1:Math.min(...xs),n:gs.length,raw:gs.map(g=>g[0]).join('')})}}
fs.writeFileSync('heads.json',JSON.stringify(H));console.log(H.length);
const S={};H.forEach(h=>S[h.size]=(S[h.size]||0)+1);console.log(S);
H.slice(0,15).forEach(h=>console.log(h.p,h.y,h.size,h.x0,h.x1,h.raw));
