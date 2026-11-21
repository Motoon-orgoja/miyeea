const fs=require('fs');
const V=require('./verses.json');const Mg=require('./merged.json');
const H=require('./heads.json').filter(h=>h.y<630&&h.size>=18.5&&h.p<850);
const T=fs.readFileSync('heads_titles.txt','utf8').trim().split('\n');
// verses whose last word of the first hemistich was printed on the next line (overflow), checked on the page images
const FIX={110:['العصرِ',112],397:['المضاربهْ',223],637:['النّحرِ',303],1619:['الثّمَنْ',731],1835:['الصّبِي',809]};
const intro=Mg.filter(m=>m.p>=60&&m.p<=65&&m.t.includes('|')&&!m.t.startsWith('(')).map(m=>({p:m.p,y:m.y,n:0,t:m.t}));
const all=intro.concat(V);
const raw=[];
for(const v of all){let t=v.t.replace(/�/g,'');
  if(FIX[v.n]){const [w]=FIX[v.n];const parts=t.split(' ');
    // insert the overflow word before the second hemistich (the hemistich gap was lost on these lines)
    const after={110:'في',397:'وفي',637:'فجر',1619:'زيد',1835:'مال'}[v.n];const st=x=>x.replace(/[ً-ْ]/g,'');const ws=t.split(' ');const k=v.n===110?ws.map(st).lastIndexOf(after):ws.findIndex(x=>st(x)===after);if(k<0)throw new Error('fix '+v.n);ws.splice(k+1,0,w,'|');t=ws.join(' ');}
  if(v.n===233)t=t.replace('بالجمعِ صلاّهُ','بالجمعِ | صلاّهُ');
  raw.push({n:v.n,p:v.p,y:v.y,t});}
// clean editorial marks
function clean(t){return t.replace(/ك: ?»([^«]+)«/g,'ك$1').replace(/كَ: /g,'كَ').replace(/[»«()*]/g,'').replace(/[:،؛]/g,'').replace(/ +/g,' ').replace(/ \| /,' | ').trim()}
const out=[];let hi=0;const lines=[];
lines.push('## المقدمة');
for(const v of raw){while(hi<H.length&&(H[hi].p<v.p||(H[hi].p===v.p&&H[hi].y>v.y))){lines.push('## '+T[hi].replace(/[()]/g,''));hi++}
  const c=clean(v.t);if((c.match(/\|/g)||[]).length!==1)throw new Error('bad '+v.n+' '+c);
  lines.push(c);out.push({n:v.n,p:v.p,t:c,raw:v.t});}
fs.writeFileSync('draft.txt',lines.join('\n')+'\n');fs.writeFileSync('draft.json',JSON.stringify(out));
console.log('verses',out.length,'heads',hi);
