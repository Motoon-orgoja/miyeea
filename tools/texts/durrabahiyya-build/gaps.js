const fs=require('fs');const M=/[\u064B-\u0652]/;
const lines=fs.readFileSync(process.argv[2],'utf8').split('\n');const out=[];
lines.forEach((l,i)=>{if(l.startsWith('##')||!l.trim())return;for(const w of l.split(' ')){if(w==='|')continue;const ch=[...w];
 for(let k=0;k<ch.length;k++){const c=ch[k];if(!/[\u0621-\u064A]/.test(c)||/[اىآٱ]/.test(c))continue;
  const nx=ch[k+1]||'';if(M.test(nx))continue;
  if(c==='ل'&&ch[k+1]==='ا')continue; // lam-alif (mark on alif)
  if(c==='ل'&&/^(وَ|فَ|بِ|كَ|لِ)?ال/.test(w.replace(/[\u064B-\u0652]/g,''))&&ch[k-1]==='ا')continue;
  const pv=ch[k-1];if((c==='و'&&pv==='ُ')||(c==='ي'&&pv==='ِ'))continue;
  if(k===ch.length-1&&c==='ة')continue;
  out.push((i+1)+':'+w);break}}});
console.log(out.length);console.log(out.join(' '));
