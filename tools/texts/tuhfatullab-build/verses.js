const fs=require('fs');
const L=fs.readFileSync('vlines.txt','utf8').split('\n').map(l=>{const [p,y,x0,x1,g,s,t]=l.split('\t');return {p:+p,y:+y,x0:+x0,x1:+x1,t}});
// merge fragments on the same page and baseline
const M=[];for(const l of L){const m=M.find(o=>o.p===l.p&&Math.abs(o.y-l.y)<=3);if(m){m.parts.push(l)}else M.push({p:l.p,y:l.y,parts:[l]})}
for(const m of M){m.parts.sort((a,b)=>b.x0-a.x0);m.t=m.parts.map(x=>x.t).join(' ');m.x0=m.parts[0].x0;m.x1=Math.min(...m.parts.map(x=>x.x1))}
const V=[];for(const m of M){if(m.p<60)continue;const mm=m.t.match(/^([٠-٩]+) ?\|? ?- ?(.*)$/);if(mm)V.push({p:m.p,y:m.y,n:+mm[1].replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)),t:mm[2]})}
fs.writeFileSync('verses.json',JSON.stringify(V,null,0));
fs.writeFileSync('merged.json',JSON.stringify(M.map(m=>({p:m.p,y:m.y,x0:m.x0,x1:m.x1,t:m.t}))));
// numbering continuity
let prev=0,breaks=[];for(const v of V){if(v.n!==prev+1)breaks.push(v.p+':'+prev+'->'+v.n);prev=v.n}
console.log('verses',V.length);console.log(breaks.join('  '));
