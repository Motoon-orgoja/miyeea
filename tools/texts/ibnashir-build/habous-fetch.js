// Downloads each archived Habous (habous.gov.ma) page of المرشد المعين from the Wayback Machine (raw, id_ mode).
// usage: node habous-fetch.js <rawdir>   (reads <rawdir>/habous/_ids.json made from the CDX listing)
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const D=path.join(process.argv[2],'habous');const m=JSON.parse(fs.readFileSync(path.join(D,'_ids.json'),'utf8'));
for(const id of Object.keys(m).sort((a,b)=>a-b)){
  const f=path.join(D,id+'.html');if(fs.existsSync(f)&&fs.statSync(f).size>5000)continue;
  // prefer the newest full (non-xhtml) snapshot
  const s=m[id].s.filter(x=>!/device=xhtml/.test(x[1])).sort((a,b)=>b[0].localeCompare(a[0]))[0]||m[id].s[0];
  const u='https://web.archive.org/web/'+s[0]+'id_/'+s[1];
  try{execFileSync('curl',['-s','--max-time','90','-o',f,u]);console.log(id,s[0],fs.statSync(f).size);}catch(e){console.log(id,'FAIL');}
}
