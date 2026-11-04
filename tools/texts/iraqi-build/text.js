// extracts the page text (nass) of a saved shamela page: lines = <p> blocks; footnotes separated
const fs=require('fs');
module.exports=f=>{const d=fs.readFileSync(f,'utf8');const i=d.indexOf('class="nass');if(i<0)return null;
 let t=d.slice(i).replace(/^[^>]*>/,'').split('id="appended_pages"')[0];
 const parts=t.split(/<p[ >]/).map(b=>b.replace(/<a [\s\S]*?<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/^[^>]*>/,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim().replace(/\s*<div$/,'')).filter(Boolean);
 return parts;};
if(require.main===module)console.log(module.exports(process.argv[2]).join('\n'));
