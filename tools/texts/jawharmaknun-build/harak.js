// letter-level harakat conflicts: T vs K and M on words with identical skeleton (same position in hemistich)
const N=require('./norm');const T=require('./parse-takwin'),K=require('./parse-ko'),M=require('./parse-mq');
const MK=/[\u064B-\u0652]/;
const letters=w=>{const r=[];for(const c of w.replace(/ـ/g,'')){if(MK.test(c)){if(r.length)r[r.length-1].m+=c}else r.push({c,m:''})}return r};
const norm1=c=>c.replace(/[أإآٱ]/,'ا').replace('ى','ي').replace('ة','ه');
const fin=m=>m.replace('\u0651','');// vowel part (ignore shadda presence)
const out=[];
for(let i=0;i<291;i++)for(const h of['a','b']){
 const tw=T[i][h].replace(/[()]/g,' ').replace(/ـ/g,'').split(/\s+/).filter(Boolean);
 const get=S=>S[i]&&S[i][h]?S[i][h].replace(/[()"]/g,' ').replace(/ـ/g,'').split(/\s+/).filter(Boolean):[];
 const ws={K:get(K),M:get(M)};
 tw.forEach((w,j)=>{const sk=N(w);const lt=letters(w);
  const conf={};for(const k of['K','M']){const o=ws[k].find(x=>N(x)===sk);if(!o)continue;const lo=letters(o);if(lo.length!==lt.length)continue;
   for(let p=0;p<lt.length;p++){const a=fin(lt[p].m),b=fin(lo[p].m);if(a&&b&&a!==b){conf[k]=o;break}}}
  if(conf.K&&conf.M)out.push((i+1)+h+'\tT:'+w+'\tK:'+conf.K+'\tM:'+conf.M);
  else if(conf.K||conf.M)out.push((i+1)+h+'\tT:'+w+'\t'+(conf.K?'K:'+conf.K:'M:'+conf.M)+'\t(one)');
 })}
console.log(out.join('\n'));
