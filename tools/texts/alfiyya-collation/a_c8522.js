const fs=require('fs');const L=fs.readFileSync('s8522.txt','utf8').split('\n');let page='';const out=[];let buf=null,prev=null;
for(let l of L){l=l.replace(/\s*<div$/,'').trim();if(l.startsWith('@@')){page=l.slice(2,5);prev=null;continue}if(+page<7)continue;
 if(buf){out.push({t:buf+' '+l,page});buf=null;prev=null;continue}
 if(/\.\.\.\s*$/.test(l)&&!/ \.\.\. \S/.test(l)){buf=l;continue}
 if(/^\.\.\./.test(l)){if(prev)out.push({t:prev+' '+l,page});prev=null;continue}
 if(/ \.\.\. /.test(l)){out.push({t:l,page});prev=null}else prev=l;}
fs.writeFileSync('c8522.json',JSON.stringify(out));console.log(out.length);
