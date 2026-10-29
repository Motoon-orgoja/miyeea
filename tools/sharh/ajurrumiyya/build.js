// Builds data/ajurrumiyya-sharh/<chapterId>.json from tools/sharh-cache/ajurrumiyya/pages.json (run parse.js first).
// Source: حاشية الآجرومية لعبد الرحمن بن قاسم (shamela 7368). Each hashiya note is keyed in the edition by a footnote
// number placed in the matn; the matn of the edition is word-aligned to data/ajurrumiyya.js and each note goes to the
// unit holding the word its number follows. The note is prefixed by the matn words it is keyed to (from the previous
// number up to this one), in parentheses, as quoted in the same edition — the commentary itself is untouched apart from
// dropping the editor's i'rab-footnote numbers and joining paragraphs that the page break cut.
const fs=require('fs'),path=require('path');const {CACHE,BOOK}=require('./fetch.js');
const ROOT=path.join(__dirname,'..','..','..');const OUT=path.join(ROOT,'data','ajurrumiyya-sharh');
const w={};new Function('window',fs.readFileSync(path.join(ROOT,'data','ajurrumiyya.js'),'utf8'))(w);const B=w.BOOK;
const P=JSON.parse(fs.readFileSync(path.join(CACHE,'pages.json'),'utf8'));
const SRC='حاشية الآجرومية، لعبد الرحمن بن محمد بن قاسم العاصمي النجدي (ت ١٣٩٢هـ)';
const AR='٠١٢٣٤٥٦٧٨٩',ar=n=>String(n).replace(/\d/g,d=>AR[d]);
const fold=t=>t.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^ء-ي\s]/g,' ').split(/\s+/).filter(Boolean);
// ---- our text as a word stream (chapter titles map to the chapter's first unit)
const ours=[];for(const c of B.chapters){for(const x of fold(c.title))ours.push({w:x,u:c.units[0].id,ch:c.id});
  for(const u of c.units)for(const x of fold(u.segs.map(s=>s[1]).join(' ')))ours.push({w:x,u:u.id,ch:c.id});}
// ---- edition matn stream with note anchors; notes with their page
const ed=[];const notes=[];let cur=null;const orphan=[];
const endsSentence=t=>/[.:؛؟!»)\]}]\s*$/.test(t);
for(const pg of P.filter(p=>p.id>=3)){// page 2: the editor's note on Ibn Ajurrum, not commentary
  const local={};
  for(const para of pg.matn){for(const tok of para.replace(/⟦(\d+)⟧/g,' ⟦$1⟧ ').split(/\s+/).filter(Boolean)){
      const m=tok.match(/^⟦(\d+)⟧$/);if(m){local[m[1]]={at:ed.length-1,raw:ed.length};continue}
      ed.push({raw:tok,f:fold(tok)});}}
  for(let para of pg.hashiya){const m=para.match(/^⟦(\d+)⟧\s*/);
    if(m){cur={n:+m[1],page:pg,paras:[para.slice(m[0].length)],pages:[pg]};cur.anchor=local[m[1]];notes.push(cur);continue}
    if(!cur){orphan.push(para);continue}// intro before the first note (page 3: «مقدمة») — given to the first note
    para=para.replace(/^=\s*/,'');const last=cur.paras.length-1;
    if(!cur.pages.includes(pg)){cur.pages.push(pg);if(!endsSentence(cur.paras[last])){cur.paras[last]+=' '+para;continue}}
    cur.paras.push(para);}
}
// flatten edition words (a raw token may fold into several words)
const edw=[];ed.forEach((t,i)=>{t.start=edw.length;for(const x of t.f)edw.push({w:x,tok:i})});
// ---- LCS word alignment
const n=edw.length,m=ours.length;const L=Array.from({length:n+1},()=>new Uint16Array(m+1));
for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=edw[i].w===ours[j].w?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
const map=new Array(n).fill(-1);for(let i=0,j=0;i<n&&j<m;){if(edw[i].w===ours[j].w){map[i]=j;i++;j++}else if(L[i+1][j]>=L[i][j+1])i++;else j++}
const matched=map.filter(x=>x>=0).length;
function unitOfTok(ti){// last folded word of token ti (or nearest before / after) → our unit
  let k=ti<0?-1:(ed[ti].start+ed[ti].f.length-1);for(let i=k;i>=0;i--)if(map[i]>=0)return ours[map[i]].u;
  for(let i=Math.max(0,k);i<n;i++)if(map[i]>=0)return ours[map[i]].u;return B.chapters[0].units[0].id;}
// ---- assign notes
let prevRaw=0;const unanchored=[];
notes.forEach((nt,k)=>{if(nt.anchor){nt.unit=unitOfTok(nt.anchor.at);nt.phrase=ed.slice(prevRaw,nt.anchor.raw).map(t=>t.raw).join(' ');prevRaw=nt.anchor.raw}});
notes.forEach((nt,k)=>{if(nt.unit)return;unanchored.push(nt.page.id+':'+nt.n);
  const nx=notes.slice(k+1).find(x=>x.unit&&x.page===nt.page),pv=notes.slice(0,k).reverse().find(x=>x.unit);nt.unit=(nx||pv).unit;});
if(orphan.length)notes.unshift({n:0,page:notes[0].page,pages:[notes[0].page],paras:orphan,unit:notes[0].unit});// the hashiya's own preface («مقدمة»), before its first note
// ---- clean and emit
const clean=t=>/^[*\s]+$/.test(t)?'':t.replace(/\s*⟦\d+⟧\s*/g,' ').replace(/\s*\([٠-٩]+\)/g,'').replace(/- صلى الله عليه وسلم -/g,'ﷺ').replace(/ +([،,.:؛])/g,'$1').replace(/\s+\n/g,'\n').replace(/ {2,}/g,' ').trim();// «* * *»: end-of-chapter ornament
const phraseClean=t=>t.replace(/[()"]/g,'').replace(/^[\s،,.:؛]+|[\s،,؛]+$/g,'').replace(/\s+/g,' ');
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(/^a\d+\.json$/.test(f))fs.unlinkSync(path.join(OUT,f));
const byUnit={};for(const nt of notes)(byUnit[nt.unit]=byUnit[nt.unit]||[]).push(nt);
let covered=0,bytes=0;const empty=[],stat={};
for(const c of B.chapters){const S={};
  for(const u of c.units){const ns=byUnit[u.id];if(!ns){empty.push(u.id);continue}covered++;
    const pgs=[...new Set(ns.flatMap(x=>x.pages))].sort((a,b)=>a.id-b.id);const p0=pgs[0].num,p1=pgs[pgs.length-1].num;
    const text=ns.map(nt=>{const ph=nt.phrase?phraseClean(nt.phrase):'';const body=nt.paras.map(clean).filter(Boolean).join('\n\n');return ph?'('+ph+') '+body:body}).join('\n\n');
    S[u.id]={title:'شرح الفقرة',secs:[{src:SRC,ref:p0===p1?'ص'+ar(p0):'ص'+ar(p0)+' إلى ص'+ar(p1),url:`https://shamela.ws/book/${BOOK}/${pgs[0].id}`,text}]};
    stat[u.id]=ns.length;}
  const js=JSON.stringify(S);bytes+=Buffer.byteLength(js);fs.writeFileSync(path.join(OUT,c.id+'.json'),js);}
console.log(JSON.stringify({editionWords:n,ourWords:m,matched,notes:notes.length,unanchored,covered,units:B.chapters.reduce((a,c)=>a+c.units.length,0),empty,bytes,stat}));
