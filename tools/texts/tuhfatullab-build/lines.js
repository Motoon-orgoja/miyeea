const r=require('./all.json');const fm=require('./fontmap.json');const cl=require('./clusters.json');const M0=require('./maps.js');
const rep={2:'g_d0_f21',3:'g_d0_f23',5:'g_d0_f22'};const M={};
for(const k in rep){const idx=cl.findIndex(c=>c.fonts.includes(rep[k]));M[idx]=M0[k]}
// 'k' of the vocalization font is the double vowel: above the letter = fathatan, below = kasratan
function decode(g,base){const t=M[fm[g[5]]];if(!t)return null;if(g[0]==='k'&&t===M0[2]&&base&&g[3]>base[3])return 'ً';const v=t[g[0]];return v===undefined?'{'+g[0]+'}':v}
const out=[];const MK='\u0001';
for(const pg of r){let line=[],y=null;
 const flush=()=>{if(!line.length)return;const n=line.filter(g=>M[fm[g[5]]]).length;
  if(n>=line.length*0.9&&line.some(g=>g[1]===0)){
   let s='',prev=null,base=null,maxgap=0,x0=line.find(g=>g[1]>0)[2],x1=1e9,size=line[0][4];
   for(const g of line){const d=decode(g,base);if(d===null){s+='�';continue}const isMark=g[1]===0||d==='ـ';
    if(!isMark&&prev){const gap=prev.x-(g[2]+g[1]*g[4]);if(gap>maxgap)maxgap=gap;if(gap>1.0*size)s+=' '+MK+gap.toFixed(1)+MK+' ';else if(gap>0.12*g[4])s+=' ';}
    if(d!=='ـ')s+=d; if(g[1]>0){prev={x:g[2]};if(g[0]!=='v'){base=g;x1=Math.min(x1,g[2]);size=g[4]}}}
   // the widest gap (if wide enough) separates the hemistichs; other wide gaps are justification
   const re=new RegExp(MK+'([0-9.]+)'+MK,'g');
   const gs=[...s.matchAll(re)].map(m=>+m[1]);const mx=gs.length?Math.max(...gs):0;let used=false;
   s=s.replace(re,(m,g)=>{if(+g===mx&&!used&&mx>1.4*size){used=true;return '|'}return ''});
   out.push([pg.p,line[0][3].toFixed(0),x0.toFixed(0),x1.toFixed(0),(maxgap/size).toFixed(1),size,s.replace(/ +/g,' ').trim()].join('\t'));}
  line=[]};
 for(const g of pg.G){if(g[1]>0&&g[0]!=='v'&&y!==null&&Math.abs(g[3]-y)>4)flush();if(g[1]>0&&g[0]!=='v')y=g[3];line.push(g)}flush()}
require('fs').writeFileSync('vlines.txt',out.join('\n'));
module.exports={M,fm,decode};
