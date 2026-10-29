// Collects every Arabic interface string (JS string literals, HTML text and attributes) so they can be translated.
// usage: node tools/extract-ui-strings.js > tools/i18n/strings.json   (the text data files are not scanned: the texts stay Arabic)
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const AR=/[؀-ۿ]/, out=new Map();
const add=(s,ctx)=>{s=s.replace(/\s+/g,' ').trim();if(!AR.test(s))return;if(!out.has(s))out.set(s,ctx)};
for(const f of ['ui.js','engine.js','prose-engine.js','home.js','voice.js','srs.js','annot.js']){
  const lines=fs.readFileSync(path.join(root,f),'utf8').split('\n');
  lines.forEach((l,i)=>{
    if(/^\s*(\/\/|\/\*|\*)/.test(l))return;
    const code=l.replace(/\/\/ .*$/,'');
    for(const m of code.matchAll(/'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`|"((?:[^"\\]|\\.)*)"/g)){
      const s=m[1]??m[2]??m[3]; if(!AR.test(s))continue;
      // template pieces between ${…}, and the text between tags of an innerHTML string, each show up as their own text
      (m[2]!=null?s.split(/\$\{[^}]*\}/):[s]).forEach(p=>p.split(/<[^>]*>/).forEach(q=>add(q,f+':'+(i+1))));
    }
  });
}
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
  const src=fs.readFileSync(path.join(root,f),'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<nav class="books"[\s\S]*?<\/nav>/,'');
  for(const m of src.matchAll(/(?:placeholder|aria-label|title|content)="([^"]*)"/g))add(m[1],f);
  for(const m of src.matchAll(/>([^<>]+)</g))add(m[1],f);
}
console.log('['+[...out].map(([s,c])=>JSON.stringify({s,c})).join(',\n')+']');
