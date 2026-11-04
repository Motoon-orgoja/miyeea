// Extracts the verses of المرشد المعين from the archived Habous pages (raw/ibnashir/habous/<id>.html), in page order.
// out (stdout): "# <h1 title>" per page, "## <h2>" for in-page headings, "> <other paragraph>" for prose, verses as "a | b"
const fs=require('fs'),path=require('path');
const D=path.join(__dirname,'..','raw','ibnashir','habous');
const ids=fs.readdirSync(D).filter(f=>/^\d+\.html$/.test(f)).map(f=>parseInt(f)).sort((a,b)=>a-b);
const txt=h=>h.replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&amp;/g,'&').trim();
const out=[];
for(const id of ids){
  const d=fs.readFileSync(path.join(D,id+'.html'),'utf8');
  const i=d.indexOf('class="item-page"');const j=d.indexOf('id="box_social"',i);
  const b=d.slice(i,j>0?j:i+60000);
  out.push('# '+id+' '+txt((b.match(/<h1>([\s\S]*?)<\/h1>/)||[])[1]||'').replace(/\s+/g,' '));
  // verses are <p> lines on most pages, bare <div> lines on the last two
  const re=/<(h[2-6]|p)[^>]*>([\s\S]*?)<\/\1>|<div[^>]*>([^<]*)<\/div>/g;let m;
  while((m=re.exec(b))){
    if(m[3]!==undefined){m[1]='p';m[2]=m[3];}
    let t=txt(m[2]);if(!t.replace(/[\s ]/g,''))continue;
    if(m[1]!=='p'){out.push('## '+t.replace(/[\s ]+/g,' '));continue;}
    // hemistichs are separated by a run of (2+) spaces/nbsp, or by a tab-like gap
    const parts=t.split(/(?:[\s ]* [\s ]*){2,}|\s{3,}/).map(s=>s.replace(/[\s ]+/g,' ').trim()).filter(Boolean);
    if(parts.length===2)out.push(parts.join(' | '));else out.push('> '+parts.join(' ⟂ '));
  }
}
process.stdout.write(out.join('\n')+'\n');
