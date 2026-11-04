// usage: node apply-fixes.js in.txt out.txt  — applies fixes.js, removes editorial parentheses, collapses spaces
const fs=require('fs');const F=require('./fixes.js');const [i,o]=process.argv.slice(2);let vn=0;const log=[];
const out=fs.readFileSync(i,'utf8').split('\n').map(l=>{if(!l.includes(' | '))return l;vn++;let r=l;
 for(const [v,a,b] of F)if(v===vn){if(!r.includes(a))throw new Error('fix not found '+v+' '+a);r=r.replace(a,b);}
 r=r.replace(/[()]/g,'').replace(/ـ+/g,'').replace(/\s+/g,' ').trim();if(r!==l)log.push(vn+'\t'+l+'\n\t-> '+r);return r;});
fs.writeFileSync(o,out.join('\n'));console.log(log.join('\n'));
