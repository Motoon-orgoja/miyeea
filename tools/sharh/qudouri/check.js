// Checks data/qudouri-sharh/*.json: parses, no HTML, no footnote numbers, every key is a real unit id; prints coverage.
const fs=require('fs'),path=require('path');
const D=path.join(__dirname,'..','..','..','data','qudouri-sharh');
const w={};new Function('window',fs.readFileSync(path.join(__dirname,'..','..','..','data','qudouri.js'),'utf8'))(w);
const ids=new Set();w.BOOK.chapters.forEach(c=>c.units.forEach(u=>ids.add(u.id)));
let n=0,bytes=0,bad=[];const chs=new Set();
for(const f of fs.readdirSync(D)){const s=fs.readFileSync(path.join(D,f),'utf8');bytes+=s.length;const j=JSON.parse(s);chs.add(f);
  for(const [k,v] of Object.entries(j)){n++;if(!ids.has(k))bad.push(k+' not a unit');if(!k.startsWith(f.replace('.json','')+'_'))bad.push(k+' wrong file');
    for(const sec of v.secs){const t=sec.text;if(/<[a-z\/][^>]*>|&[a-z]+;/i.test(t))bad.push(k+' html');if(/\([٠-٩0-9]+\)/.test(t))bad.push(k+' footnote? '+t.match(/.{0,20}\([٠-٩0-9]+\).{0,10}/)[0]);
      if(!/^https:\/\/shamela\.ws\/book\/21496\/\d+$/.test(sec.url))bad.push(k+' url');if(!t.trim())bad.push(k+' empty')}}}
console.log('files',chs.size,'entries',n,'/',ids.size,'chars',bytes);console.log(bad.length?bad.slice(0,30).join('\n'):'no problems',bad.length);
