// takw.in and ketabonline 25829 are the same digital text (ketabonline joins the two hemistichs and keeps more marks).
// Copies ketabonline's marks onto takw.in's letters, verse by verse (same numbering), where the takw.in letter has no mark.
// Only when the two verses have exactly the same letters (spaces and punctuation ignored).
// usage: node ko-into-takwin.js takwin.verses.txt ko.lines.txt out.txt log.txt
const fs=require('fs');const [tf,kf,of,lf]=process.argv.slice(2);const MARK=/[ً-ْٰ]/;
const units=s=>{const u=[];for(const ch of s){if(MARK.test(ch)){if(u.length&&u[u.length-1].L)u[u.length-1].m+=ch;}else u.push({c:ch,m:'',L:/[ء-ي]/.test(ch)});}return u;};
const K={};fs.readFileSync(kf,'utf8').split('\n').forEach(l=>{const m=l.match(/^(\d+)\t(.*)/);if(m)K[m[1]]=m[2]});
const log=[];let vn=0,added=0;
const out=fs.readFileSync(tf,'utf8').split('\n').map(l=>{if(!l.includes(' | '))return l;vn++;const k=K[vn];if(!k){log.push(vn+' no ko');return l;}
 const tu=units(l),ku=units(k).filter(x=>x.L&&x.c!=='ـ');const tl=tu.filter(x=>x.L&&x.c!=='ـ');
 if(tl.map(x=>x.c).join('')!==ku.map(x=>x.c).join('')){log.push(vn+' letters differ: '+l+' // '+k);return l;}
 tl.forEach((x,i)=>{if(!x.m&&ku[i].m){x.m=ku[i].m;added++;}});
 const r=tu.map(x=>x.c+x.m).join('');if(r!==l)log.push(vn+' '+l+' -> '+r);return r;});
fs.writeFileSync(of,out.join('\n'));fs.writeFileSync(lf,log.join('\n')+'\n');console.log('verses',vn,'marks added',added);
