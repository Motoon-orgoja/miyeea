// Sumay'i text pages 1-34 joined, lines with page markers dropped; @@ bold removed
const fs=require('fs');const t=fs.readFileSync('sumall.txt','utf8').split('\n').filter(l=>!/^=== page/.test(l)).join('\n').replace(/@@/g,'');
fs.writeFileSync('sum-clean.txt',t);
