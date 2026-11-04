// Lists witness verse lines that match no base verse (word overlap < 50%): candidate verses missing from the base, or quotations.
// usage: node extra.js base.txt witness.lines.txt
const fs=require('fs');const norm=w=>w.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱء]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤئ]/g,'ا').replace(/[^ء-ي]/g,'');
const ws=l=>l.replace(/\|/g,' ').split(/\s+/).map(norm).filter(Boolean);
const B=fs.readFileSync(process.argv[2],'utf8').split('\n').filter(l=>l.includes(' | ')).map(ws);const idx={};B.forEach((w,i)=>new Set(w).forEach(x=>(idx[x]=idx[x]||[]).push(i)));
fs.readFileSync(process.argv[3],'utf8').split('\n').filter(l=>l.includes('|')).forEach(l=>{const t=l.split('\t');const w=ws(t[t.length-1]);if(w.length<5)return;const c={};new Set(w).forEach(x=>(idx[x]||[]).forEach(i=>c[i]=(c[i]||0)+1));
 const best=Math.max(0,...Object.entries(c).map(([i,v])=>v/Math.max(w.length,B[i].length)));if(best<0.5)console.log(l);});
