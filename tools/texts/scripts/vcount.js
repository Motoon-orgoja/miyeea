// usage: node vcount.js <poem.txt>  -> share of letters carrying a mark (bare alif/alif maqsura and madd letters excluded) + unmarked words
const fs=require('fs');const M=/[ً-ْٰ]/;let tot=0,mk=0;const un=[];
fs.readFileSync(process.argv[2],'utf8').split('\n').forEach((l,i)=>{if(/^##/.test(l)||!l.trim())return;for(const w of l.split(/\s+/)){if(w==='|')continue;const ch=[...w];let bad=false;
 for(let k=0;k<ch.length;k++){const c=ch[k];if(!/[ء-ي]/.test(c))continue;if(/[اىآٱ]/.test(c))continue;const nx=ch[k+1]||'';
  const prev=ch.slice(0,k).reverse().find(x=>M.test(x)||/[ء-ي]/.test(x))||'';
  if(!M.test(nx)&&((c==='و'&&prev==='ُ')||(c==='ي'&&prev==='ِ')))continue; // madd
  if(!M.test(nx)&&c==='ل'&&/^(وَ|فَ|بِ|كَ|لِ)?ال/.test(w.replace(/[ً-ْ]/g,''))&&k<=3&&ch[k-1]==='ا')continue; // shamsi lam
  tot++;if(M.test(nx))mk++;else bad=true}
 if(bad)un.push((i)+':'+w)}});
console.log('marked',mk,'of',tot,(100*mk/tot).toFixed(1)+'%');console.log(un.join(' '));
