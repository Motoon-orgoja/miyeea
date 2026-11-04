// list words in the cleaned base with a consonant that carries no haraka (excl. lam shamsiyya, alif/waw/yaa of madd)
const clean=require('./clean');const {V}=require('./p354.json');
const H=/[ً-ْٰ]/;const out=[];let tot=0,bare=0;
for(const v of V){for(const w of (clean(v.a)+' '+clean(v.b)).replace(/(^|\s)-(\s|$)/g,' ').split(/\s+/)){
 const ch=[...w];for(let i=0;i<ch.length;i++){const c=ch[i];if(!/[ء-ي]/.test(c))continue;tot++;
  if(H.test(ch[i+1]||''))continue;
  if('اىآ'.includes(c))continue;
  if((c==='و'||c==='ي')&&i>0&&!/[َ-ْ]/.test('')&&( /[ُِ]/.test(ch[i-1]) || (i+1<ch.length&&ch[i+1]==='ا')))continue; // madd / wa-alif
  if(c==='ل'&&/[تثدذرزسشصضطظلن]/.test(ch[i+1]||'')&&ch[i+2]==='ّ')continue; // lam shamsiyya
  if(ch[i+1]==='ا'&&ch[i+2]==='ً')continue; if(ch[i+1]==='ى'&&ch[i+2]==='ً')continue; if(c==='ة')continue;
  if(c==='ل'&&ch[i-1]==='ا'&&/[تثدذرزسشصضطظلن]/.test(ch[i+1]||''))continue;
  if(c==='ا'||c==='ء')continue;
  bare++;out.push(v.n+':'+w);break;}}}
console.log('letters',tot,'bare words',out.length);console.log(out.join('  '));
