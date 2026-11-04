// list consonants without a mark, ignoring: article lam before a sun letter (shadda follows), lam of «الله/لله», tatweel
const lines=require(process.argv[2]?require('path').resolve(process.argv[2]):'./parse-takwin');
const M=/[\u064B-\u0652]/;const out=[];
lines.forEach((v,i)=>{for(const h of ['a','b']){for(const w of (v[h]||'').split(' ')){const c=[...w];
 for(let k=0;k<c.length;k++){const x=c[k];if(!/[بتثجحخدذرزسشصضطظعغفقكلمنهءأإؤئةي و]/.test(x)||x===' ')continue;
  const nx=c[k+1]||'';if(M.test(nx))continue;
  if((x==='و'||x==='ي')&&k>0&&!(k===0))continue; // madd letters (rough)
  if(x==='ل'&&c[k-1]==='ا'&&(c[k+2]==='\u0651'||(c[k+1]&&M.test(c[k+2]||'')&&c[k+2]==='\u0651')))continue;
  if(x==='ل'&&/لله|اللهِ|اللهُ|اللهَ|للهِ/.test(w))continue;
  if(x==='ة'&&k===c.length-1)continue;
  out.push((i+1)+h+'\t'+w+'\t'+x+(nx==='ا'?' (before alif)':''));break}}}});
console.log(out.length);console.log(out.join('\n'));
