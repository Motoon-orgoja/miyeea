// map a list of [a,b] hemistich pairs (in text order, maybe with repeats/gaps) onto the 291 base verses
const N=require('./norm');const base=require('./parse-takwin');
const bg=s=>{const w=N(s).replace(/ /g,'');const g=new Set();for(let i=0;i<w.length-1;i++)g.add(w.slice(i,i+2));return g};
const sim=(x,y)=>{let c=0;for(const g of x)if(y.has(g))c++;return 2*c/((x.size+y.size)||1)};
const BG=base.map(v=>bg(v.a+' '+v.b));
module.exports=pairs=>{const out=Array(base.length).fill(null);const unmatched=[];
 for(const [a,b] of pairs){const g=bg(a+' '+b);let best=-1,bs=0;for(let k=0;k<base.length;k++){const s=sim(g,BG[k]);if(s>bs){bs=s;best=k}}
  if(bs<0.6){unmatched.push(bs.toFixed(2)+' '+a+' = '+b);continue}
  if(!out[best])out[best]={a,b,score:bs}}
 return {out,unmatched}};
