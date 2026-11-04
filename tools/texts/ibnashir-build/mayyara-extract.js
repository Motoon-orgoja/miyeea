// Extracts the verses of المرشد المعين from Mayyara's «الدر الثمين» (Shamela 14249, raw/ibnashir/s14249_<n>.html).
// The edition prints a verse either as one <p> «شطر ... شطر» (often unvocalized) or as two short vocalized <p> lines.
// out: raw/ibnashir/_mayyara.txt  ("@page" markers, verses "a | b", unpaired hemistichs as "? a")
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..','raw','ibnashir');
const out=[];let pend=null;
const stat=s=>({L:(s.match(/[ء-ي]/g)||[]).length,H:(s.match(/[ً-ْ]/g)||[]).length,W:s.split(/\s+/).length});
const isH=s=>{const {L,H,W}=stat(s);return L>=6&&W<=10&&H/L>0.3;};
const isV=s=>{const {L,W}=stat(s);return /\s\.\.\.\s/.test(s)&&L>=12&&W<=20&&s.split(/\s*\.\.\.\s*/).length===2;};
const flush=()=>{if(pend){out.push('? '+pend);pend=null;}};
for(let p=1;p<=619;p++){
  const f=path.join(R,'s14249_'+p+'.html');if(!fs.existsSync(f))continue;
  const d=fs.readFileSync(f,'utf8');
  let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
  t=t.split(/<hr/)[0];
  const P=t.split(/<p[ >]/).map(b=>b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
  out.push('@'+p);
  for(const l of P){
    if(isV(l)){flush();out.push(l.split(/\s*\.\.\.\s*/).join(' | '));continue;}
    if(isH(l)){if(pend){out.push(pend+' | '+l);pend=null;}else pend=l;continue;}
    flush();
  }
}
flush();
fs.writeFileSync(path.join(R,'_mayyara.txt'),out.join('\n')+'\n');
console.log('verses',out.filter(l=>l.includes(' | ')).length,'unpaired',out.filter(l=>l.startsWith('?')).length);
