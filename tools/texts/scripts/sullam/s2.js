const fs=require('fs'),{norm}=require('./norm.js');const {W,WS,F,C}=JSON.parse(fs.readFileSync('sullam-parsed.json','utf8'));
const words=s=>norm(s).split(' ');
const sim=(x,y)=>{const a=words(x),b=words(y);let s=0;const bb=[...b];for(const w of a){const i=bb.indexOf(w);if(i>=0){s++;bb.splice(i,1)}}return s/Math.max(a.length,b.length)};
const out=[];let miss=[];
W.forEach(([a,b],i)=>{const cs=C.map(c=>({c,s:(sim(c.a,a)+sim(c.b,b))/2})).filter(x=>x.s>=0.5).sort((x,y)=>y.s-x.s);
 out.push({n:i+1,ws:[a,b],cands:cs.map(x=>({tag:x.c.tag,p:x.c.p,a:x.c.a,b:x.c.b,s:+x.s.toFixed(2)}))});if(!cs.length)miss.push(i+1)});
console.log('missing',miss.length,miss.join(','));
fs.writeFileSync('sullam-match.json',JSON.stringify(out,null,1));
// count with exact (s==1) from 36107
console.log('s=1 any',out.filter(o=>o.cands.some(c=>c.s===1)).length,'s<1 best',out.filter(o=>o.cands.length&&!o.cands.some(c=>c.s===1)).map(o=>o.n+':'+o.cands[0].s).join(' '));
