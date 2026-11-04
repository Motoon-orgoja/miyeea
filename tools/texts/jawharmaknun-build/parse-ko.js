// ketabonline 25502 (الشاملة الذهبية, partly vocalized) -> [{n, sec, a, b}]
// pages 2-3: «N . .. sadr ... ajz» in one <p>; from page 4: «N sadr» then «ajz» in the next <p>.
const j=require('../raw/jawharmaknun/ko25502.json');
const lines=[];
for(const p of j.pages.filter(p=>p.content)){
  const h=p.content.replace(/<a [\s\S]*?<\/a>/g,'');
  const re=/<div class="g-title[^"]*">([\s\S]*?)<\/div>|<p[^>]*>([\s\S]*?)<\/p>/g;let m;
  while(m=re.exec(h)){
    if(m[1]!==undefined){lines.push({t:'H',x:m[1].replace(/<[^>]+>/g,'').trim(),page:p.page});continue}
    const t=m[2].replace(/<span class="g-list">([^<]*)<\/span>/,'$1').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
    if(t)lines.push({t:'P',x:t,page:p.page});
  }
}
const out=[],other=[];let sec=null;
for(let i=0;i<lines.length;i++){
  const L=lines[i];
  if(L.t==='H'){sec=L.x;continue}
  let m=L.x.match(/^(\d+)\s*\.\s*\.+\s*(.*)$/);
  if(m){const parts=m[2].split(/\s*\.\.\.\s*/);if(parts.length!==2)other.push('SPLIT '+L.x);out.push({n:+m[1],sec,a:parts[0],b:parts.slice(1).join(' '),page:L.page});sec=null;continue}
  m=L.x.match(/^(\d+)\s+(.*)$/);
  if(m){const nx=lines[i+1];
    // a stray footnote digit printed before the second hemistich (verse 127: «3 وبالذي…»)
    if(nx&&+m[1]>9&&/^\d\s/.test(nx.x)){other.push('STRAY-DIGIT '+nx.x);nx.x=nx.x.replace(/^\d\s+/,'')}
    if(!nx||nx.t!=='P'||/^\d+\s/.test(nx.x))other.push('NOAJZ '+L.x);out.push({n:+m[1],sec,a:m[2],b:nx?nx.x:'',page:L.page});i++;sec=null;continue}
  // heading-like lines: «{ المقدمة }», «) فصل: …(»
  const h=L.x.replace(/^[{)(\s]+|[})(\s]+$/g,'').trim();
  if(/^[{)(]/.test(L.x)){sec=h;continue}
  if(/^تم ولله الحمد/.test(L.x)){other.push('END '+L.page);break}
  other.push(L.page+': '+L.x);
}
const clean=x=>x.replace(/"/g,'').replace(/\s*كَـ\s*/g,' كَ').replace(/\s+/g,' ').trim();
out.forEach(v=>{v.a=clean(v.a);v.b=clean(v.b)});
module.exports=out;
if(require.main===module){console.log(out.length);out.forEach((v,i)=>{if(v.n!==i+1)console.log('num',i+1,'printed',v.n)});out.forEach(v=>v.sec&&console.log('##',out.indexOf(v)+1,v.sec));console.log('OTHER');other.forEach(x=>console.log(x))}
