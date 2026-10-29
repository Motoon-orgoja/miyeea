// Parses the cached sunnah.com Riyad as-Salihin book pages → {sunnahNum: arabicText}. Their numbering is al-Fahl's.
const fs=require('fs'),path=require('path');
const C=path.join(__dirname,'..','riyad-cache','sunnah');
module.exports=function(){const out={};
  for(const f of fs.readdirSync(C)){const d=fs.readFileSync(path.join(C,f),'utf8');
    for(const blk of d.split('<!-- Begin hadith -->').slice(1)){const n=(blk.match(/hadith_reference_sticky">Riyad as-Salihin (\d+)/)||[])[1];if(!n)continue;
      const a=(blk.match(/<div class="arabic_hadith_full arabic">([\s\S]*?)<\/div>\s*<\/div>/)||blk.match(/<div class="arabic_hadith_full arabic">([\s\S]*?)<\/div>/)||[])[1];if(!a)continue;
      out[n]=a.replace(/<[^>]+>/g,' ').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/‏|‎/g,'').replace(/\s+/g,' ').trim();}}
  return out;};
if(require.main===module){const o=module.exports();const k=Object.keys(o).map(Number).sort((a,b)=>a-b);const miss=[];for(let i=1;i<=1896;i++)if(!o[i])miss.push(i);console.log(k.length,'missing',miss.length,miss.slice(0,50).join(','));console.log(o[1].slice(0,200))}
