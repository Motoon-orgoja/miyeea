const fs=require('fs'),{norm,H}=require('./norm.js');const M=JSON.parse(fs.readFileSync('sullam-match.json','utf8'));const {F}=JSON.parse(fs.readFileSync('sullam-parsed.json','utf8'));
const hcount=s=>(s.match(H)||[]).length;
const clean=s=>s.replace(/\s+/g,' ').trim();
const pick=[];const vocVar=[];
for(const o of M){
 const full=o.cands.filter(c=>c.s>=0.75);
 const by=t=>full.filter(c=>c.tag===t).sort((x,y)=>hcount(y.a+y.b)-hcount(x.a+x.b));
 const c=by('36107')[0]||by('36056')[0];
 // distinct vocalized forms among all good candidates
 const forms=[...new Set(full.map(c=>clean(c.a)+' | '+clean(c.b)))];
 if(forms.length>1)vocVar.push({n:o.n,forms:full.map(c=>c.tag+'/'+c.p+': '+clean(c.a)+' | '+clean(c.b))});
 pick.push({n:o.n,src:c?c.tag+'/'+c.p:'NONE',a:c?clean(c.a):null,b:c?clean(c.b):null,ws:o.ws});
}
fs.writeFileSync('sullam-pick.json',JSON.stringify(pick,null,1));fs.writeFileSync('sullam-vocvar.json',JSON.stringify(vocVar,null,1));
console.log('vocvar',vocVar.length);console.log(pick.filter(p=>p.src==='NONE').map(p=>p.n));
console.log(pick.reduce((m,p)=>(m[p.src.split('/')[0]]=(m[p.src.split('/')[0]]||0)+1,m),{}));
