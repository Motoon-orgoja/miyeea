// usage: node vocstat.js <txt> — share of Arabic words carrying at least one haraka, and of letters followed by a haraka
const t=require('fs').readFileSync(process.argv[2],'utf8');const w=t.match(/[ء-يً-ْٰ]+/g)||[];
let v=0,L=0,LV=0;for(const x of w){if(/[ً-ْ]/.test(x))v++;const s=x.replace(/[ً-ْٰ]/g,'');L+=s.length;LV+=(x.match(/[ء-ي][ً-ْ]/g)||[]).length}
console.log(process.argv[2],'words',w.length,'voc words',(100*v/w.length).toFixed(1)+'%','letters w/ haraka',(100*LV/L).toFixed(1)+'%');
