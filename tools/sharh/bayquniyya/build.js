// Build data/sharh/bayquniyya.json from Shamela book 5970:
// «التقريرات السنية شرح المنظومة البيقونية» لحسن بن محمد المشاط (ت ١٣٩٩هـ).
// (شرح الزرقاني is not on shamela.ws / ketabonline as text — see tools/texts/bayquniyya-sharh.md.)
// The sharh is mamzuj (verse words woven into the commentary) and is divided by headings, one per hadith type.
// Each section goes to the verse that defines that type; a section covering several verses goes to the last one.
const fs=require('fs'),path=require('path');
const {shamelaPage}=require('../fetch.js');
const {loadVerses,norm,ROOT}=require('../match.js');
const BOOK=5970,URL='https://shamela.ws/book/'+BOOK;
const clean=s=>s.replace(/\r/g,'').replace(/<a href="#[^"]*" class="btn_tag[^]*?<\/a>/g,'').replace(/<span[^>]*anchor[^>]*><\/span>/g,'');
const strip=s=>s.replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
// heading (normalised) -> our verse number (1-based)
const SECT=[['الحديث الصحيح',4],['الحديث الحسن',5],['الحديث الضعيف',6],['الحديث المرفوع',7],['الحديث المقطوع',7],
 ['الحديث المسند',8],['الحديث المتصل',9],['الحديث المسلسل',11],['الحديث العزيز',12],['الحديث المشهور',12],
 ['الحديث المعنعن',13],['الحديث المبهم',13],['الحديث العالي والحديث النازل',14],['الحديث الموقوف',15],
 ['الحديث المرسل',16],['الحديث الغريب',16],['الحديث المنقطع',17],['الحديث المعضل',18],['الحديث المدلس',20],
 ['الحديث الشاذ',21],['الحديث المقلوب',22],['الحديث الفرد',23],['الحديث المعلل',24],['الحديث المضطرب',25],
 ['المدرج في الحديث',26],['الحديث المدبج',27],['الحديث المتفق والمتفرق',28],['الحديث المؤتلف والمختلف',29],
 ['الحديث المنكر',30],['الحديث المتروك',31],['الحديث الموضوع',32]];
const HEAD=new Map(SECT.map(([h,v])=>[norm(h),v]));
// obvious typos of the digital text (fixed, listed in the .md)
const TYPO=[['بالتظر','بالنظر'],['مَقْرُونا بالنيان','مَقْرُونا بالبيان'],['سميتها أَي الأجوزة','سميتها أَي الأرجوزة'],['بالبناءللمجهول','بالبناء للمجهول']];
(async()=>{
  const {book,verses}=loadVerses('bayquniyya');
  // collect paragraphs with page info; join paragraphs split by a page break with a space
  const paras=[];let id=1;
  while(id){const j=await shamelaPage(BOOK,id,'bayquniyya');
    const ps=[...clean(j.nass).matchAll(/<p[^>]*>([^]*?)<\/p>/g)].map(m=>strip(m[1])).filter(Boolean);
    ps.forEach((t,k)=>paras.push({t,id,pg:j.pageNum,first:k===0}));id=j.nextId}
  // sections
  const sects=[];let cur={v:null,ps:[]};
  for(const p of paras){const h=HEAD.get(norm(p.t));
    if(h&&p.t.length<45){cur={v:h,head:p.t,ps:[]};sects.push(cur);continue}
    if(cur.v===null&&!sects.includes(cur)){cur.v=0;sects.push(cur)}
    cur.ps.push(p)}
  const out=verses.map(()=>null),log=[];
  const render=ps=>{let s='';ps.forEach((p,k)=>{s+=(k===0?'':(p.first?' ':'\n\n'))+p.t});for(const [a,b] of TYPO)s=s.split(a).join(b);return s.replace(/ +/g,' ').trim()};
  const refOf=ps=>{const a=ps[0].pg,b=ps[ps.length-1].pg;return a===b?'ص'+a:`ص${a}-${b}`};
  const put=(v,ps,extra='')=>{if(!ps.length)return;const t=render(ps);
    if(out[v-1]){out[v-1].t+='\n\n'+t;out[v-1].ref=out[v-1].ref.split('-')[0]+'-'+ps[ps.length-1].pg}
    else out[v-1]={t,ref:refOf(ps),url:`${URL}/${ps[0].id}`};log.push(`v${v} <- ${extra} ${refOf(ps)}`)};
  for(const s of sects){
    if(s.v===0){// preface (id1, skipped: commentator's khutba) + verses 1-2 (id2)
      const ps=s.ps.filter(p=>p.id>=2&&!/^بِسم الله/.test(p.t));
      const k=ps[0].t.indexOf('وَبعد ابتدائي');if(k<0)throw new Error('v1/v2 split point not found');
      put(1,[{...ps[0],t:ps[0].t.slice(0,k).trim()}],'intro');
      put(2,[{...ps[0],t:ps[0].t.slice(k)},...ps.slice(1)],'intro');continue}
    if(s.v===32){// الموضوع section also carries verses 33-34 at its end
      const all=render(s.ps);const a=all.indexOf('وَقد أَتَت أَي الْمَنْظُومَة'),b=all.indexOf('وَقَوله فَوق عقد الثَّلَاثِينَ');
      if(a<0||b<0)throw new Error('v33/34 split not found');
      const last=s.ps[s.ps.length-1];
      out[31]={t:all.slice(0,a).trim(),ref:refOf(s.ps),url:`${URL}/${s.ps[0].id}`};
      out[32]={t:all.slice(a,b).trim(),ref:'ص'+last.pg,url:`${URL}/${last.id}`};
      out[33]={t:all.slice(b).trim(),ref:'ص'+last.pg,url:`${URL}/${last.id}`};
      log.push('v32,33,34 <- '+s.head);continue}
    put(s.v,s.ps,s.head)}
  const res={name:'التقريرات السنية شرح المنظومة البيقونية',author:'حسن بن محمد المشاط المالكي',death:'١٣٩٩هـ',url:URL,v:out};
  fs.mkdirSync(path.join(ROOT,'data','sharh'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'data','sharh',book.key+'.json'),JSON.stringify(res));
  fs.writeFileSync(path.join(__dirname,'build.log'),log.join('\n'));
  console.log(log.join('\n'));console.log('sections',sects.length,'covered',out.filter(Boolean).length,'/',out.length);
})();
