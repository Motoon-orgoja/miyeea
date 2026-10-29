// Stage A: al-Fahl structure → units (text as in the edition, Fahl's harakat), Qur'an quotations replaced by the
// api.quran.com imlaei text of the cited verses. Output: tools/riyad-cache/units-a.json + log lines in units-a.log.json
// Hadith ids use the standard numbering (tools/riyad/numbering.json maps al-Fahl's numbers to Dalil al-Falihin's).
const fs=require('fs'),path=require('path');
const {strip,fold,ar,words,tidy}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache');
const S=JSON.parse(fs.readFileSync(path.join(C,'fahl-struct.json'),'utf8'));
const NUM=fs.existsSync(path.join(__dirname,'numbering.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'numbering.json'),'utf8')):{};
const LOG={quran:[],notes:[]};

/* ---------- Qur'an ---------- */
const SURAS=JSON.parse(fs.readFileSync(path.join(C,'quran','chapters.json'),'utf8')).chapters;
const SNAME={};for(const s of SURAS)SNAME[fold(s.name_arabic).replace(/^ال/,'')]=s.id;
Object.assign(SNAME,{'قتال':47,'دهر':76,'ن':68,'قلم':68,'انسان':76,'اسراء':17,'بني اسراييل':17,'مومنون':23,'مومن':40,'غافر':40,'تحريم':66,'حم السجده':41,'فصلت':41,'سجده':32,'المنافقون':63,'منافقون':63});
function suraId(name){const k=fold(name.replace(/الآية|سورة/g,'')).replace(/ـ/g,'').trim().replace(/^ال/,'');if(SNAME[k])return SNAME[k];throw new Error('sura? '+name)}
function parseRef(r){ // "النحل: 125" | "آل عمران : 133-134" | "آل عمران : 190 ، 191"
  const m=r.match(/^(.+?)\s*:\s*(\d+)\s*(?:[-–،,]\s*(\d+))?\s*$/);if(!m)return null;
  const s=suraId(m[1]);const a=+m[2],b=m[3]?+m[3]:a;return {s,a,b,name:SURAS[s-1].name_arabic};
}
const QV={};
function verse(s,a){const k=s+'_'+a;if(QV[k])return QV[k];const f=path.join(C,'quran',k+'.json');
  if(!fs.existsSync(f)){NEED.add(s+':'+a);return null}
  const v=JSON.parse(fs.readFileSync(f,'utf8')).verse;
  const w=v.text_imlaei.replace(/[ۖ-ۭ]/g,'').replace(/\s+/g,' ').trim();
  return QV[k]={imlaei:w,uthmani:v.text_uthmani};}
const NEED=new Set();
const lev=(a,b)=>{const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]};
const qf=w=>fold(w).replace(/ا/g,'').replace(/^و?(ال)?/,'');
const wsim=(x,y)=>{const a=fold(x).replace(/ا/g,''),b=fold(y).replace(/ا/g,'');if(a===b)return 1;const l=lev(a,b);return l<=1&&Math.min(a.length,b.length)>=3?0.8:(l<=2&&Math.min(a.length,b.length)>=6?0.6:0)};
// local word alignment of quote q (words) inside verse words v; returns [start,end) in v and the score
function align(q,v){
  let best={sc:-1e9};
  const n=q.length,m=v.length,H=Array.from({length:n+1},()=>new Float64Array(m+1)),B=Array.from({length:n+1},()=>new Int32Array(m+1));
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){const s=wsim(q[i-1],v[j-1]);const diag=H[i-1][j-1]+(s?s:-1),up=H[i-1][j]-0.7,left=H[i][j-1]-0.7;
    let h=Math.max(0,diag,up,left);H[i][j]=h;B[i][j]=h===0?0:h===diag?1:h===up?2:3;if(h>best.sc)best={sc:h,i,j}}
  let i=best.i,j=best.j;while(i>0&&j>0&&B[i][j]){const b=B[i][j];if(b===1){i--;j--}else if(b===2)i--;else j--}
  return {start:j,end:best.j,qs:i,qe:best.i,sc:best.sc};
}
function quranText(quote,refs,where){
  // quote is the text inside ﴿ ﴾ as printed; replace it with the exact verse words it covers.
  // First the printed verses are tried; if the quotation is not fully covered (the printed number is sometimes off),
  // a window of ±3 verses, then the whole sura, is searched, and the reference is rebuilt from the verses matched.
  const pieces=quote.split(/\s*(?:\.\.\.|…)\s*/).filter(p=>words(strip(p)).length);
  const tryWin=win=>{const vw=[],vid=[];let miss=0;
    for(const [s,a0,a1] of win)for(let a=a0;a<=a1;a++){const v=verse(s,a);if(!v){miss++;continue}words(v.imlaei).forEach(w=>{vw.push(w);vid.push([s,a])})}
    if(miss)return 'miss';
    const out=[],cov=[];let from=0,full=true,diffs=[];
    for(const p of pieces){const q=words(p.replace(/[«»"]/g,''));
      if(q.length<2){out.push(p.trim());continue} // a one-word fragment («… إلى قوله: ﴿يعملون﴾») is kept as printed
      const sub=vw.slice(from);const r=align(q,sub);
      if(r.end<=r.start||r.qe-r.qs<Math.max(1,q.length*0.6))return null;
      if(r.qs>0||r.qe<q.length)full=false;
      for(let k=from+r.start;k<from+r.end;k++)cov.push(vid[k]);
      // unmatched words at the edges of the quotation (e.g. «أقم» for «وأقم») are kept as printed, never dropped
      const got=[...q.slice(0,r.qs),...sub.slice(r.start,r.end),...q.slice(r.qe)];
      if(fold(q.join(' ')).replace(/[اوي]/g,'')!==fold(got.join(' ')).replace(/[اوي]/g,''))diffs.push({printed:p,quran:got.join(' ')});
      out.push(got.join(' '));from+=r.end;}
    return {text:out.join(' ... '),cov,full,diffs};};
  const printed=refs.map(r=>[r.s,r.a,r.b]);
  let res=tryWin(printed);if(res==='miss')return null;
  if(!res||!res.full){const w=tryWin(refs.map(r=>[r.s,Math.max(1,r.a-3),Math.min(SURAS[r.s-1].verses_count,r.b+3)]));if(w==='miss')return null;if(w&&(!res||w.full))res=w;}
  if(!res||!res.full){const w=tryWin(refs.map(r=>[r.s,1,SURAS[r.s-1].verses_count]));if(w==='miss')return null;if(w&&(!res||w.full))res=w;}
  if(!res){LOG.quran.push({where,problem:'no good match',quote,refs:refs.map(r=>r.s+':'+r.a+'-'+r.b)});return null}
  for(const d of res.diffs)LOG.quran.push({where,...d});
  const inPrinted=res.cov.every(([s,a])=>refs.some(r=>r.s===s&&a>=r.a&&a<=r.b));
  let nr;if(inPrinted)nr=refs;else{nr=[];for(const [su,a] of res.cov){const l=nr[nr.length-1];if(l&&l.s===su&&(a===l.b||a===l.b+1))l.b=a;else if(!(l&&l.s===su&&a>=l.a&&a<=l.b))nr.push({s:su,a,b:a,name:SURAS[su-1].name_arabic})}
    LOG.quran.push({where,refFix:true,printedRef:refs.map(r=>r.s+':'+r.a+(r.b>r.a?'-'+r.b:'')).join(','),actual:nr.map(r=>r.s+':'+r.a+(r.b>r.a?'-'+r.b:'')).join(','),quote:quote.slice(0,60)})}
  return {text:res.text,refs:nr};
}

/* ---------- Qur'an quotations inside hadiths and notes: searched in the whole mushaf ---------- */
const ALLQ=JSON.parse(fs.readFileSync(path.join(C,'quran','all-imlaei.json'),'utf8')).verses;
const QW=[],QID=[];for(const v of ALLQ){const [s,a]=v.verse_key.split(':').map(Number);for(const w of words(v.text_imlaei.replace(/[\u06D6-\u06ED]/g,'')))if(/[\u0621-\u064A]/.test(w)){QW.push(w);QID.push([s,a])}}
const qk=w=>fold(w).replace(/ا/g,'');const QF=QW.map(qk);
const BIG={};for(let i=0;i+1<QF.length;i++){const k=QF[i]+' '+QF[i+1];(BIG[k]=BIG[k]||[]).push(i)}
function quranSearch(quote,where){
  const pieces=quote.split(/\s*(?:\.\.\.|…)\s*/).filter(p=>words(strip(p)).length);const out=[],cov=[];
  for(const p of pieces){const q=words(p.replace(/[«»"]/g,'')).filter(w=>/[\u0621-\u064A]/.test(w));if(q.length<2)return null;
    const qf=q.map(qk);const votes={};for(let i=0;i+1<qf.length;i++){for(const pos of BIG[qf[i]+' '+qf[i+1]]||[]){const st=pos-i;votes[st]=(votes[st]||0)+1}}
    const best=Object.entries(votes).sort((a,b)=>b[1]-a[1])[0];if(!best||best[1]<Math.max(1,(q.length-1)*0.5))return null;
    const st=Math.max(0,+best[0]-3),win=QW.slice(st,st+q.length+8);const r=align(q,win);
    if(r.qs!==0||r.qe!==q.length)return null;
    const got=win.slice(r.start,r.end);for(let k=st+r.start;k<st+r.end;k++)cov.push(QID[k]);
    if(qk(q.join(' '))!==qk(got.join(' ')))LOG.quran.push({where,inHadith:true,printed:p,quran:got.join(' ')});
    out.push(got.join(' '))}
  const nr=[];for(const [su,a] of cov){const l=nr[nr.length-1];if(l&&l.s===su&&(a===l.b||a===l.b+1))l.b=a;else if(!(l&&l.s===su&&a>=l.a&&a<=l.b))nr.push({s:su,a,b:a,name:SURAS[su-1].name_arabic})}
  return {text:out.join(' ... '),refs:nr};
}
function fixQuranInText(t,where){
  return t.replace(/﴿([^﴾]*)﴾(\s*\[[^\]]*\])?/g,(all,q,ref)=>{
    const P=ref?parseRef(ref.trim().slice(1,-1).replace(/\s+/g,' ')):null;
    let r=P?quranText(q,[P],where):null;if(!r)r=quranSearch(q,where);
    if(!r){if(words(strip(q)).length>=2)LOG.notes.push({where,note:"Qur'an quotation inside the text not matched in the mushaf; kept as printed",text:q});return all.replace(/\[[^\]]*\]/,x=>x.replace(/\d+/g,d=>ar(d)))}
    const rs='['+r.refs.map(x=>x.name+': '+(x.b>x.a?ar(x.a)+'–'+ar(x.b):ar(x.a))).join('؛ ')+']';
    return '﴿'+r.text+'﴾'+(ref?' '+rs:'');});
}
function P_ok(ref,r){const P=parseRef(ref.trim().slice(1,-1));if(!P)return false;return r.refs.every(x=>x.s===P.s&&x.a>=P.a&&x.b<=P.b)}

/* ---------- paragraphs with ayat ---------- */
// split a paragraph into [{kind:'prose',text}|{kind:'aya',segs}] pieces
function ayaPieces(t,where){
  t=tidy(t);
  const re=/﴿([^﴾]*)﴾\s*((?:الآية|الآيات|الآيتين|الآيَةَ|الآيَاتِ)\s*)?(\[[^\]]*\])?/g;const ms=[...t.matchAll(re)];
  if(!ms.length)return [{kind:'prose',text:t}];
  const out=[];let cur=null,pos=0;
  const pushProse=s=>{s=s.trim().replace(/^[،.؛\s]+/,'').trim();if(strip(s).replace(/[\s.،؛:]/g,''))out.push({kind:'prose',text:s})};
  for(let k=0;k<ms.length;k++){const m=ms[k];let pre=t.slice(pos,m.index);
    if(!cur){ // pre = [trailing of previous unit][intro of this one]
      let intro=pre;const colon=pre.lastIndexOf(':');
      if(colon>=0&&pre.slice(colon+1).trim()===''){const cut=Math.max(pre.lastIndexOf('،',colon),pre.lastIndexOf('.',colon),pre.lastIndexOf('؛',colon));
        if(cut>=0){const tail=pre.slice(0,cut+1);intro=pre.slice(cut+1);
          if(out.length&&out[out.length-1].kind==='aya'&&!/[«﴿]/.test(tail)&&words(tail).length<=12)out[out.length-1].segs.push(['takh',tail.trim().replace(/^[،.\s]+/,'')]);else pushProse(tail)}}
      else if(out.length&&out[out.length-1].kind==='aya'&&words(pre).length<=12&&!/:/.test(pre)){out[out.length-1].segs.push(['takh',pre.trim()]);intro=''}
      else if(words(pre).length>25){pushProse(pre);intro=''}
      cur={kind:'aya',segs:[],refs:[]};if(intro.trim().replace(/^[،.\s]+/,''))cur.segs.push(['rawi',intro.trim().replace(/^[،.\s]+/,'')]);
    }else if(pre.trim())cur.segs.push(['rawi',pre.trim()]);
    cur.segs.push(['aya',m[1].trim()]);if(m[2])cur.segs.push(['takh',m[2].trim()]);
    if(m[3]){const refTxt=m[3].slice(1,-1).trim();const refs=refTxt.split(/\s*[؛;]\s*/).map(parseRef).filter(Boolean);
      cur.refs.push(...refs);cur.refTxt=(cur.refTxt?cur.refTxt+'؛ ':'')+refTxt;
      cur.segs.push(['ref',refTxt]);out.push(cur);cur=null}
    pos=m.index+m[0].length;}
  if(cur){out.push(cur);LOG.notes.push({where,note:'ayah quotation without [sura: ayah] reference',text:cur.segs.map(s=>s[1]).join(' ')})}
  const rest=t.slice(pos).trim().replace(/^[.،\s]+$/,'');
  if(rest){if(out.length&&out[out.length-1].kind==='aya'&&words(rest).length<=12)out[out.length-1].segs.push(['takh',rest]);else pushProse(rest)}
  return out;
}
const refLabel=refs=>refs.map(r=>r.name.replace(/^سورة /,'')+' '+(r.b>r.a?ar(r.a)+'–'+ar(r.b):ar(r.a))).join('، ');
const NOREF={'وجاءكم النذير':'35:37','فخسفنا به وبداره الارض':'28:81','يستخفون من الناس':'4:108'};
function finishAya(p,where){
  if(!p.refs.length){const a=p.segs.find(s=>s[0]==='aya');const k=a&&Object.keys(NOREF).find(k=>fold(a[1]).startsWith(k));if(k){const [s,v]=NOREF[k].split(':').map(Number);p.refs=[{s,a:v,b:v,name:SURAS[s-1].name_arabic}];p.segs.push(['ref','']);LOG.notes.push({where,note:'reference supplied for an unreferenced quotation',text:k+' → '+NOREF[k]})}}
  // resolve each ﴿quote﴾ against the verses cited by the unit's references
  const segs=[];let refs=p.refs,newRefs=[];
  for(const [k,v] of p.segs){
    if(k==='aya'){const q=refs.length?quranText(v,refs,where):null;if(q)newRefs.push(...q.refs);else LOG.notes.push({where,note:'ayah kept as printed (no verse match)',text:v});segs.push(['aya','﴿'+(q?q.text:v)+'﴾'])}
    else if(k==='ref')segs.push(['ref',v]);
    else segs.push([k,v]);
  }
  const R=newRefs.length?newRefs:refs;
  const refStr='['+R.map(r=>r.name+': '+(r.b>r.a?ar(r.a)+'–'+ar(r.b):ar(r.a))).join('؛ ')+']';
  let put=false;const out=[];
  for(const sg of segs){if(sg[0]==='ref'){if(!put){out.push(['takh',refStr]);put=true}}else out.push(sg)}
  if(!put&&R.length&&newRefs.length)out.push(['takh',refStr]);
  const m=[];for(const s of out){if(m.length&&m[m.length-1][0]===s[0]&&s[0]==='takh')m[m.length-1][1]+=' '+s[1];else m.push(s)}
  return {segs:m,refs:R};
}

/* ---------- hadith ---------- */
function mapStripped(t){const idx=[];let s='';for(let i=0;i<t.length;i++){if(!/[ً-ْٰـ]/.test(t[i])){idx.push(i);s+=t[i]}}idx.push(t.length);return {s,idx}}
const TAKH=/(?:^|[.،!؟»)]\s*|\s)((?:متفق عليه|متفق علي|رواه|روى|أخرجه|ورواه)[^«»﴿﴾]*)$/;
function findTakh(t){
  // the takhrij: the earliest «متفق عليه / رواه …» after which no further words of the Prophet are quoted
  // (a quoted grading such as «حديث حسن صحيح» may follow)
  const {s,idx}=mapStripped(t);
  let k=-1;
  for(let p=0;p<s.length;p++){if(p>0&&!/[\s.،»)!؟]/.test(s[p-1]))continue;const sub=s.slice(p);if(!/^(?:متفق|رواه|روى|أخرجه|ورواه|رواهما|ورواهما|رواهن)/.test(sub))continue;
    const quotes=[...sub.matchAll(/«([^»]*)»?/g)].filter(q=>!/^\s*(هذا )?حديث|^\s*حسن|^\s*صحيح|^\s*إسناده/.test(q[1]));
    if(quotes.length)continue;if(words(sub).length>45)continue;k=p;break}
  if(k<0)return null;return {before:t.slice(0,idx[k]).trim(),takh:t.slice(idx[k]).trim()};
}
function splitMain(t){
  // returns {rawi, matn, takh}
  let takh='';const ft=findTakh(t);if(ft&&ft.before){takh=ft.takh;t=ft.before}
  // rawi: up to the first colon that closes a chain naming the narrator ("عن …"), before any quoted words
  const st=mapStripped(t);let rawi='';const firstQ=st.s.search(/[«﴿]/);const lim=firstQ<0?st.s.length:firstQ;
  const ws=st.s.slice(0,lim);let c=-1,from=0;
  while(true){const k=ws.indexOf(':',from);if(k<0)break;const head=ws.slice(0,k);if(/(^|\s|و)عن\s|حديث|^وعنه|^عنه|وعنها|^عنها/.test(head)||/^و?عن(ه|ها|هما|هم)\b/.test(head)){c=k;break}from=k+1}
  if(c>=0&&words(ws.slice(0,c)).length<=45)rawi=t.slice(0,st.idx[c+1]);
  else{const f=ws.match(/^[\s\S]{0,400}?رضي الله (?:عنهما|عنهم|عنها|عنه)\s*،?/);if(f&&/عن/.test(f[0])&&words(f[0]).length<=40)rawi=t.slice(0,st.idx[f[0].length])}
  const matn=t.slice(rawi.length).trim().replace(/^[،\s]+/,'');
  return {rawi:rawi.trim(),matn,takh};
}
const qBal=t=>(t.match(/«/g)||[]).length-(t.match(/»/g)||[]).length;
function glossPairs(t){
  const s=t.replace(/^(?:و|وَ)?(?:قَ?وْ?لُ?هُ?\s*(?:صلى الله عليه وسلم)?\s*:?\s*)?/,'');
  if(!/^(?:وَ?)?«/.test(s))return null;
  const pairs=[];for(const m of s.matchAll(/«([^«»]{1,80})»\s*([^«]*)/g)){const w=m[1].trim();if(words(w).length>6)return null;
    let mean=m[2].trim().replace(/^[:،\s]+/,'').replace(/[\s.،]*(?:وَ?|وقوله|وَقَوْلُهُ)?\s*$/,'').trim();
    if(/^(رواه|متفق)/.test(strip(mean)))return null;
    if(!mean)return null;pairs.push([w,mean.replace(/\.$/,'')]);}
  return pairs.length?pairs:null;
}
const RIWAYA=/^(?:وفي رواية|في رواية|وفي روايةٍ|وفي لفظ|ورواه|وفي حديث|وزاد|وفي أخرى|وفي رواية أخرى)/;
function hadithUnit(it,where){
  const p0=tidy(it.paras[0]);const {rawi,matn,takh}=splitMain(p0);
  const segs=[];if(rawi)segs.push(['rawi',rawi]);segs.push(['matn',matn]);if(takh)segs.push(['takh',takh]);
  let open=!takh;const gloss=[];
  for(let i=1;i<it.paras.length;i++){const t=tidy(it.paras[i]);const st=strip(t);
    if(open){ // the matn goes on until its takhrij
      const r=findTakh(t);if(r&&r.before){segs.push(['matn',r.before]);segs.push(['takh',r.takh]);open=false}else if(r){segs.push(['takh',r.takh]);open=false}else segs.push(['matn',t]);continue}
    const g=glossPairs(t);if(g){gloss.push(...g);continue}
    if(RIWAYA.test(st)){ // another wording of the hadith quoted by the author: «وفي رواية لمسلم: …»
      const c=st.indexOf(':');let intro='',rest=t;if(c>0&&words(st.slice(0,c)).length<=12){const mp=mapStripped(t);intro=t.slice(0,mp.idx[c+1]).trim();rest=t.slice(mp.idx[c+1]).trim()}
      const r=findTakh(rest);if(intro)segs.push(['rawi',intro]);if(r&&r.before){segs.push(['matn',r.before]);segs.push(['takh',r.takh])}else segs.push(['matn',rest]);continue}
    segs.push(['takh',t]); // the author's own remark
  }
  const m=[];for(const s of segs){if(!s[1])continue;if(m.length&&m[m.length-1][0]===s[0])m[m.length-1][1]+=' '+s[1];else m.push([s[0],s[1]])}
  for(const sg of m)if(/﴿/.test(sg[1]))sg[1]=fixQuranInText(sg[1],where);
  return {segs:m,gloss};
}

/* ---------- splitting long units ---------- */
const LIMIT=70,TARGET=45;
function splitSegs(segs){
  const toks=[];segs.forEach(([k,t],si)=>words(t).forEach(w=>toks.push({k,w,si})));
  const core=toks.filter(x=>x.k!=='rawi'&&!(x.k==='takh'&&x.si===segs.length-1&&words(segs[segs.length-1][1]).length<12)).length;
  if(core<=LIMIT)return [segs];
  const n=Math.max(2,Math.round(core/TARGET));const W=toks.length;
  const strong=i=>/[.؟!]["»)﴾\]]*$|[.؟!]$/.test(toks[i].w), weak=i=>/[؛]$/.test(toks[i].w), comma=i=>/[،:]$/.test(toks[i].w);
  const cuts=[];let last=0;
  for(let p=1;p<n;p++){const ideal=Math.round(W*p/n);let best=-1,bs=1e9;
    for(let i=last+12;i<W-12;i++){const d=Math.abs(i-ideal);const pen=strong(i)?0:weak(i)?6:comma(i)?14:1e6;const sc=d+pen;if(sc<bs){bs=sc;best=i}}
    if(best<0||bs>=1e6)break;cuts.push(best+1);last=best+1}
  if(!cuts.length)return [segs];
  const parts=[];let a=0;for(const b of [...cuts,W]){const slice=toks.slice(a,b);const ps=[];for(const t of slice){if(ps.length&&ps[ps.length-1][0]===t.k&&ps[ps.length-1].si===t.si)ps[ps.length-1][1]+=' '+t.w;else{const s=[t.k,t.w];s.si=t.si;ps.push(s)}}
    parts.push(ps.map(s=>[s[0],s[1]]));a=b}
  return parts;
}

/* ---------- build ---------- */
const chapters=[];const used=new Set();
function stdNum(fn,it){if(it&&it.std)return it.std;return NUM[fn]!=null?NUM[fn]:fn}
// numbering adjustments against the standard (islamenc) numbering
for(const c of S.chapters){const out=[];for(const it of c.items){
  if(it.t==='h'&&NUM[it.fn]===0){LOG.notes.push({where:'باب '+c.n,note:'hadith dropped: not in the standard text (al-Fahl '+it.fn+')',text:strip(it.paras[0]).slice(0,120)});continue}
  if(it.t==='h'&&NUM[it.fn+1]-NUM[it.fn]===2){const k=it.paras.findIndex((p,i)=>i>0&&/^(وفي الباب|حديث )/.test(strip(p).replace(/[⟦⟧]/g,'').trim()));
    if(k>0){out.push({...it,paras:it.paras.slice(0,k)});out.push({t:'h',fn:it.fn+0.5,std:NUM[it.fn]+1,paras:it.paras.slice(k)});LOG.notes.push({where:'باب '+c.n,note:'split into its own numbered entry as in the standard numbering',text:'std '+(NUM[it.fn]+1)});continue}}
  out.push(it)}c.items=out}
for(const c of S.chapters){
  const where0='باب '+c.n;const units=[];let ak=0,pend=[];
  const addProse=t0=>{const t=/﴿/.test(t0)?fixQuranInText(t0,where0):t0;const last=units[units.length-1];if(last)last.segs.push(['takh',t]);else pend.push(['takh',t])};
  const add=u=>{if(pend.length){u.segs=[...pend,...u.segs];pend=[]}units.push(u)};
  for(const it of c.items){
    if(it.t==='p'){for(const pc of ayaPieces(it.text,where0)){if(pc.kind==='prose')addProse(pc.text);else{const r=finishAya(pc,where0);ak++;
        const parts=splitSegs(r.segs);const base=c.n===91?'a'+ak:'c'+c.n+'a'+ak;
        parts.forEach((segs,pi)=>add({id:parts.length>1?base+'-'+(pi+1):base,kind:'aya',label:'آية · '+(r.refs.length?refLabel(r.refs):'')+(parts.length>1?' · المقطع '+ar(pi+1)+' من '+ar(parts.length):''),segs,refs:r.refs.map(x=>x.s+':'+x.a+(x.b>x.a?'-'+x.b:''))}))}}}
    else{const N=stdNum(it.fn,it);const where='حديث '+N+' (الفحل '+Math.floor(it.fn)+')';const h=hadithUnit(it,where);const parts=splitSegs(h.segs);
      parts.forEach((segs,pi)=>{const L=k=>String.fromCharCode(97+k);const id=parts.length>1?N+(pi<26?L(pi):L(Math.floor(pi/26)-1)+L(pi%26)):String(N);
        const u={id,kind:'hadith',label:'حديث '+ar(N)+(parts.length>1?' · المقطع '+ar(pi+1)+' من '+ar(parts.length):''),segs,fn:it.fn,n:N};
        add(u)});
      // gloss → the part that contains the word, else the last part
      const mine=units.filter(u=>u.fn===it.fn);
      for(const g of h.gloss){const k=fold(g[0]).replace(/^و/,'');let tgt=mine[mine.length-1];for(const u of mine)if(fold(u.segs.map(s=>s[1]).join(' ')).includes(k)){tgt=u;break}(tgt.gloss=tgt.gloss||[]).push(g)}
    }
  }
  if(pend.length){units.push({id:'c'+c.n+'t1',kind:'text',label:'كلام المصنف',segs:pend})}
  for(const u of units){if(used.has(u.id))LOG.notes.push({where:where0,note:'duplicate id '+u.id});used.add(u.id)}
  chapters.push({n:c.n,title:c.title,group:c.group,units});
}
// Nawawi's preface
const muq=S.muq.map(t=>tidy(t));
fs.writeFileSync(path.join(C,'units-a.json'),JSON.stringify({muq,chapters},null,1));
fs.writeFileSync(path.join(C,'units-a.log.json'),JSON.stringify(LOG,null,1));
if(NEED.size){fs.writeFileSync(path.join(C,'quran-need.json'),JSON.stringify([...NEED]));console.log('need verses',NEED.size,'→ node tools/riyad-fetch.js quran tools/riyad-cache/quran-need.json')}
const all=chapters.flatMap(c=>c.units);
console.log('chapters',chapters.length,'units',all.length,'aya',all.filter(u=>u.kind==='aya').length,'hadith units',all.filter(u=>u.kind==='hadith').length,'text',all.filter(u=>u.kind==='text').length,'quran log',LOG.quran.length,'notes',LOG.notes.length);
