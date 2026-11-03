// Fawzan matn quotes: whole-page text; a quote = balanced (...) right after «قوله:» or a «((» opener, or any c2 span >=4 words
const fs=require('fs');const dir=process.argv[2];const out=[];
const files=fs.readdirSync(dir).map(f=>parseInt(f)).filter(n=>n).sort((a,b)=>a-b);
for(const p of files){if(p<3)continue;const j=JSON.parse(fs.readFileSync(dir+'/'+p+'.json','utf8'));
 let h=j.nass.replace(/<a [\s\S]*?<\/a>/g,'');
 // drop footnote block (Shamela puts it after <hr> or in class hamesh)
 h=h.split(/<hr|class="hamesh"/)[0];
 let t=h.replace(/<span class="c3">([\s\S]*?)<\/span>/g,'﴿$1﴾').replace(/<\/p>/g,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
 t=t.replace(/\s*\([٠-٩0-9]+\)/g,'').replace(/﴿\{/g,'﴿').replace(/\}﴾/g,'﴾').replace(/\{([^}]*)\}/g,'﴿$1﴾');
 const re=/(قوله\s*:?\s*\(|\(\()/g;let m;
 while(m=re.exec(t)){let i=re.lastIndex,d=m[0]==='(('?2:1,s=m[0]==='(('?'(':'';while(i<t.length&&d>0){const c=t[i];if(c==='(')d++;if(c===')'){d--;if(!d)break}s+=c;i++}
   out.push({p,s:s.trim()});re.lastIndex=Math.max(re.lastIndex,i);}
}
fs.writeFileSync(process.argv[3],JSON.stringify(out));console.log(out.length);
