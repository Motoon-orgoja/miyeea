// share of consonants carrying a mark; list words with an unmarked consonant
const lines=require(process.argv[2]?require('path').resolve(process.argv[2]):'./parse-takwin');
const H=/[\u064B-\u0652]/;let tot=0,mk=0;const bare=[];
lines.forEach((v,i)=>{for(const h of ['a','b']){for(const w of (v[h]||'').split(' ')){const ch=[...w];let wb=false;
 for(let k=0;k<ch.length;k++){const c=ch[k];if(!/[\u0628-\u064A\u0621\u0623\u0625\u0624\u0626]/.test(c)||/[اىو ي]/.test(c)&&!H.test(ch[k+1]||''))continue;
  // skip madd letters and article alif/lam handled loosely
  tot++;if(H.test(ch[k+1]||'')||(ch[k+1]==='\u0651'))mk++;else wb=true}
 if(wb)bare.push((i+1)+h+' '+w)}}});
console.log('marked',mk,'/',tot,(100*mk/tot).toFixed(1)+'%');console.log(bare.length,'words with an unmarked consonant');console.log(bare.join('\n'));
