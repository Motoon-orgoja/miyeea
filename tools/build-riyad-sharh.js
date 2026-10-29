// Builds data/riyad-sharh/riyadN.json (one file per chapter) + index.json: verbatim commentary, lazy-loaded by the page.
//  - hadiths: Ibn Allan's Dalil al-Falihin passage on that hadith (shamela 140), cut between its marker and the next,
//    put on the hadith's LAST part; the cut is kept only if its opening quotes the hadith's first words.
//  - ayat: Ibn Kathir's tafsir of the verse(s) (api.quran.com tafsir 14, cached by tools/riyad-fetch.js tafsir …),
//    and Dalil al-Falihin's commentary on the chapter heading/ayat attached to the chapter's first unit.
//  - chapter 91: the richer hand-assembled riyad91-sharh.js, converted as is.
const fs=require('fs'),path=require('path'),vm=require('vm');const {fold,ar,strip}=require('./riyad/lib.js');
const C=path.join(__dirname,'riyad-cache'),OUT=path.join(__dirname,'..','data','riyad-sharh');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','data','riyad.js'),'utf8'),ctx);const B=ctx.window.BOOK;
const D=JSON.parse(fs.readFileSync(path.join(C,'dalil.json'),'utf8')).paras;
const A=JSON.parse(fs.readFileSync(path.join(C,'dalil-align.json'),'utf8'));
const UA=JSON.parse(fs.readFileSync(path.join(C,'units-a.json'),'utf8'));const REFS={};for(const c of UA.chapters)for(const u of c.units)if(u.refs)REFS[u.id]=u.refs;
const DAL='دليل الفالحين لطرق رياض الصالحين، لابن علّان الصدّيقي (ت ١٠٥٧هـ)';
const IK='تفسير القرآن العظيم، لابن كثير (ت ٧٧٤هـ)';
// cleaning as in tools/assemble-sharh.js: obvious typos of the digital text, and ﷺ where shamela dropped the salawat glyph
const FIX=[[/رسولالله/g,'رسول الله'],[/(محمد|العرباض|عمرو|عليّ|علي|خالد|سعد|مالك|عمر|ابن|جابر|زيد)بن /g,'$1 بن '],[/عبد ا\)/g,'عبد الله)'],[/عبد ا /g,'عبد الله '],[/- صلى الله عليه وسلم -/g,'ﷺ']];
const salla=t=>t.replace(/(?<!يا )(رسول الله|النبيّ|النبي)(?=[ )])(?! ?ﷺ)(?! ?صلى)/g,'$1 ﷺ');
const clean=s=>salla(FIX.reduce((t,[a,b])=>t.replace(a,b),s)).replace(/\n+/g,'\n\n').trim();
// print pages missing in shamela's copy (gaps in the page numbers of one volume)
const pnum={};for(let p=1;;p++){const f=path.join(C,'shamela140',p+'.html');if(!fs.existsSync(f))break;const d=fs.readFileSync(f,'utf8');const m=d.match(/data-page-num="(\d+)"/);const v=(d.match(/<title>ج(\d+)/)||[])[1];if(m)pnum[p]={v,n:+m[1]}}
function passage(s,e){const ps=[];for(let i=s;i<e;i++){const q=D[i];if(q.blk||q.sep)continue;ps.push(q)}if(!ps.length)return null;
  const pages=[...new Set(ps.map(q=>q.p))];const r0=ps[0].ref,r1=ps[ps.length-1].ref;
  const ref=r0===r1?r0:r0+' إلى '+r1.replace(/^ج[^-]*- /,'');
  let gap=false;for(let k=1;k<pages.length;k++){const a=pnum[pages[k-1]],b=pnum[pages[k]];if(a&&b&&a.v===b.v&&b.n>a.n+1)gap=true}
  return {text:ps.map(q=>q.t).join('\n\n'),ref,url:'https://shamela.ws/book/140/'+pages[0],gap};}
const STOP=new Set('عن وعن قال قالت رضي الله عنه عنها عنهما عنهم صلي عليه وسلم بن ابن ابي ام عبد وعنه'.split(' '));
const sig=t=>fold(t.replace(/([^\s])بن(?=\s)/g,'$1 بن')).split(' ').filter(w=>w.length>1&&!STOP.has(w)).map(w=>w.replace(/^و/,''));
function tafsir(key){const [s,a]=key.split(':');const f=path.join(C,'tafsir14',s+'_'+a+'.json');if(!fs.existsSync(f))return null;let j;try{j=JSON.parse(fs.readFileSync(f,'utf8')).tafsir}catch(e){return null}
  if(!j||!j.text)return null;return j.text.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replace(/ ([،؛:.)\]])/g,'$1').trim();}
const SURA=JSON.parse(fs.readFileSync(path.join(C,'quran','chapters.json'),'utf8')).chapters;
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(/^riyad\d+\.json$|^index\.json$/.test(f))fs.unlinkSync(path.join(OUT,f));
const stats={files:0,hadithEntries:0,hadithNoDalil:[],rejectedCuts:[],gapNotes:0,ayaEntries:0,ayaNoTafsir:[],headings:0};
const index=[];
for(const ch of B.chapters){
  const S={};
  if(ch.id==='riyad91'){const c2={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','riyad91-sharh.js'),'utf8'),c2);Object.assign(S,c2.window.SHARH)}
  else{
    const n=+ch.id.slice(5);
    // hadiths
    const groups={};for(const u of ch.units)if(u.kind==='hadith'){const N=u.id.replace(/[a-z]+$/,'');(groups[N]=groups[N]||[]).push(u)}
    for(const [N,us] of Object.entries(groups)){const last=us[us.length-1];const v=A.hadiths[N];
      if(!v){stats.hadithNoDalil.push(+N);continue}
      const p=passage(v.start,v.end);if(!p){stats.hadithNoDalil.push(+N);continue}
      // the cut must open with this hadith: its first words (narrator) among the first words Ibn Allan quotes
      const hw=sig(us[0].segs.map(s=>s[1]).join(' ')).slice(0,6),pw=sig(p.text.replace(/^[٠-٩]+\s*[-ـ–]\s*/,'')).slice(0,40);
      const hit=hw.filter(w=>pw.includes(w)).length;
      // the narrator named first in the hadith (its first two significant words) opens Ibn Allan's paragraph, or 3 of its first 6 words are quoted
      // Ibn Allan opens with a parenthesised quotation of the hadith's first words: «١٣ - (وعن أبي هريرة …)»
      const t0=D[v.start].t.replace(/^[٠-٩]+\s*[-ـ–]\s*/,'');const q0=t0.match(/^[^(]{0,25}\(([^()]{1,200})\)/);
      const H8=sig(us[0].segs.map(s=>s[1]).join(' ')).slice(0,10);const Q=q0?sig(q0[1]):[];const qh=Q.filter(w=>H8.includes(w)).length;
      const opens=Q.length>0&&qh>=Math.min(2,Q.length);
      if(!opens&&hit<Math.min(3,hw.length)){stats.rejectedCuts.push({N:+N,hit,start:D[v.start].t.slice(0,60)});continue}
      const text=clean(p.text.replace(/^[٠-٩]+\s*[-ـ–]\s*/,ar(N)+' - '));
      const e={title:'شرح الحديث '+ar(N)+(us.length>1?' (المقاطع '+ar(us.length)+')':''),secs:[{src:DAL,ref:p.ref,url:p.url,text}]};
      if(p.gap){e.note='تنبيه: في نسخة المكتبة الشاملة من «دليل الفالحين» صفحات ساقطة داخل هذا الموضع، فقد يكون الشرح هنا ناقصًا.';stats.gapNotes++}
      S[last.id]=e;stats.hadithEntries++;}
    // ayat
    for(const u of ch.units)if(u.kind==='aya'){const refs=/-\d+$/.test(u.id)&&ch.units.some(x=>x.id===u.id.replace(/-\d+$/,'')+'-'+(+u.id.match(/\d+$/)[0]+1))?[]:(REFS[u.id]||[]);/* split ayat: tafsir on the last part */const seen=new Set(),secs=[];
      for(const r of refs){const [s,ab]=r.split(':');const [a,b]=ab.split('-').map(Number);for(let x=a;x<=(b||a);x++){const t=tafsir(s+':'+x);if(!t||seen.has(t))continue;seen.add(t);
        secs.push({src:IK,ref:'سورة '+SURA[s-1].name_arabic+'، الآية '+ar(x),url:'https://quran.com/ar/'+s+':'+x+'/tafsirs/ar-tafsir-ibn-kathir',text:t})}}
      if(secs.length){S[u.id]={title:'تفسير الآية',secs};stats.ayaEntries++}else stats.ayaNoTafsir.push(u.id)}
    // Dalil on the chapter heading (and the ayat it explains there) → the chapter's first unit
    const h=A.chapters[n];if(h){const p=passage(h.start,h.end);if(p&&strip(p.text).length>40){const first=ch.units[0];const e=S[first.id]||{title:first.kind==='aya'?'تفسير الآية وشرح الترجمة':'شرح الترجمة',secs:[]};
      e.secs.unshift({src:DAL+': شرح ترجمة الباب'+(first.kind==='aya'?' وآياته':''),ref:p.ref,url:p.url,text:clean(p.text)});if(first.kind==='aya')e.title='تفسير الآية وشرح ترجمة الباب';S[first.id]=e;stats.headings++}}
  }
  if(Object.keys(S).length){fs.writeFileSync(path.join(OUT,ch.id+'.json'),JSON.stringify(S));index.push(ch.id);stats.files++}
}
fs.writeFileSync(path.join(OUT,'index.json'),JSON.stringify(index));
fs.writeFileSync(path.join(C,'sharh-report.json'),JSON.stringify(stats,null,1));
console.log({files:stats.files,hadithEntries:stats.hadithEntries,hadithNoDalil:stats.hadithNoDalil.length,rejectedCuts:stats.rejectedCuts.length,gapNotes:stats.gapNotes,ayaEntries:stats.ayaEntries,ayaNoTafsir:stats.ayaNoTafsir.length,headings:stats.headings});
