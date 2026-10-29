// Stage B+C: collation of every hadith against two other witnesses, and harakat enrichment.
//  base     = al-Fahl's edition (IslamHouse .doc), stage A output tools/riyad-cache/units-a.json
//  witness1 = sunnah.com riyadussalihin (unvocalized; al-Fahl's numbering)
//  witness2 = riyadh.islamenc.com (IslamHouse «روح وريحان»; vocalized; standard numbering)
// Textual differences (folded skeleton): if both witnesses agree against the base on a short stretch inside the hadith,
// the base is corrected (islamenc's vocalized form is used); other differences are only logged.
// Harakat: where a base word and its islamenc counterpart have the same letters, the base gets islamenc's haraka on any
// letter it left bare; different harakat on the same letter are logged as conflicts (base kept, for the vocalization pass).
// Output: tools/riyad-cache/units-b.json and tools/riyad-cache/collation.json
const fs=require('fs'),path=require('path');const {strip,fold,words}=require('./lib.js');
const C=path.join(__dirname,'..','riyad-cache');
const U=JSON.parse(fs.readFileSync(path.join(C,'units-a.json'),'utf8'));
const SUN=require('./sunnah-parse.js')();
const HARS=/[ً-ْٰ]/;
// third check for substantive corrections: the words Ibn Allan quotes from the hadith in Dalil al-Falihin
const DP=JSON.parse(fs.readFileSync(path.join(C,'dalil.json'),'utf8')).paras,DA=JSON.parse(fs.readFileSync(path.join(C,'dalil-align.json'),'utf8')).hadiths;
const dalilText=n=>{const v=DA[n];if(!v)return null;let t='';for(let i=v.start;i<v.end;i++)t+=' '+DP[i].t;return ' '+fold(t).split(' ').map(w=>w.replace(/^ابن$/,'بن')).join(' ')+' '};

/* islamenc hadith texts by standard number */
const ISL={};
for(let p=5;p<=376;p++){const f=path.join(C,'islamenc',p+'.html');if(!fs.existsSync(f))continue;const d=fs.readFileSync(f,'utf8');
  const body=d.slice(d.indexOf('single-page-inner')).replace(/<br[^>]*>/g,' ').replace(/<\/(p|div|h\d)>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"');
  for(const line of body.split('\n')){const t=line.replace(/\s+/g,' ').trim();
    const mm=t.match(/^(?:(\d+)\s*\/\s*)?(\d+)\s*ـ+\s*/);if(mm){const n=+mm[2];if(!ISL[n])ISL[n]=t.slice(mm[0].length)}}}

/* word normalisation for collation */
const NORM=w=>fold(w).replace(/^ابن$/,'بن').replace(/رحمان/g,'رحمن').replace(/^(و?)(اسحاق|اسحق)$/,'$1اسحق');
// drop formulae that editions add or omit freely
const DROP=/^(صلي|الله|عليه|وسلم|رضي|عنه|عنها|عنهما|عنهم|تعالي|عز|وجل|سبحانه)$/;
function toks(text){const out=[];for(const w of text.split(/\s+/)){if(!/[ء-ي]/.test(w))continue;const n=NORM(w);for(const p of n.split(' '))if(p)out.push({w,n:p})}return out}
function lcs(a,b){ // word alignment; returns pairs [i|null, j|null]
  const n=a.length,m=b.length;if(n*m>4e6)return null;
  const L=Array.from({length:n+1},()=>new Int32Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i]===b[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
  const pr=[];let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){pr.push([i,j]);i++;j++}else if(L[i+1][j]>=L[i][j+1]){pr.push([i,null]);i++}else{pr.push([null,j]);j++}}
  while(i<n)pr.push([i++,null]);while(j<m)pr.push([null,j++]);return pr;}
// hunks of non-matching stretches between matched anchors
function hunks(pr){const H=[];let cur=null;for(const [i,j] of pr){if(i!=null&&j!=null){if(cur){H.push(cur);cur=null}continue}cur=cur||{a:[],b:[]};if(i!=null)cur.a.push(i);if(j!=null)cur.b.push(j)}if(cur)H.push(cur);return H}

/* harakat transfer between two spellings of the same word */
function letters(w){const out=[];for(const ch of w){if(HARS.test(ch)){if(out.length)out[out.length-1].h+=ch}else out.push({c:ch,h:''})}return out}
const canonH=h=>[...h].sort().join('');
function mergeWord(base,other,conf){
  const A=letters(base),B=letters(other);
  if(A.map(x=>x.c).join('')!==B.map(x=>x.c).join(''))return base;
  let changed=false;
  for(let k=0;k<A.length;k++){const a=A[k].h,b=B[k].h;if(!b||!/[ء-ي]/.test(A[k].c))continue;
    if(!a){A[k].h=b;changed=true}
    else if(canonH(a)!==canonH(b)){
      // the base has e.g. only shadda and the other shadda+vowel: complete it
      if([...a].every(x=>b.includes(x))){A[k].h=b;changed=true}
      else if(![...b].every(x=>a.includes(x)))conf.push({base,other})}}
  return changed?A.map(x=>x.c+x.h).join(''):base;}

const LOG={fixes:[],differences:[],noWitness:[],conflicts:0,merged:0,stats:{}};
const CONF=[];
const byN={};for(const c of U.chapters)for(const u of c.units)if(u.kind==='hadith')(byN[u.n]=byN[u.n]||[]).push(u);
for(const [N,us] of Object.entries(byN)){
  // flat list of base words with their location (unit, seg, word index); gloss is not part of the collated text
  const loc=[];us.forEach((u,ui)=>u.segs.forEach((s,si)=>words(s[1]).forEach((w,wi)=>loc.push({ui,si,wi,w}))));
  const baseT=[];loc.forEach((l,li)=>{for(const t of toks(l.w))baseT.push({...t,li})});
  const fn=us[0].fn;const sun=SUN[Math.floor(fn)]&&Math.floor(fn)===fn?SUN[fn]:null,isl=ISL[N]||null;
  if(!sun||!isl)LOG.noWitness.push({n:+N,sunnah:!!sun,islamenc:!!isl});
  const K=x=>x.filter(t=>!DROP.test(t.n));
  const B=K(baseT),S=sun?K(toks(sun)):[],I=isl?K(toks(isl)):[];
  const prS=sun?lcs(B.map(t=>t.n),S.map(t=>t.n)):null,prI=isl?lcs(B.map(t=>t.n),I.map(t=>t.n)):null;
  // islamenc counterpart for each base token
  const iOf=new Map();if(prI)for(const [i,j] of prI)if(i!=null&&j!=null)iOf.set(i,j);
  const sOf=new Map();if(prS)for(const [i,j] of prS)if(i!=null&&j!=null)sOf.set(i,j);
  // textual differences vs sunnah.com
  const edits=[];
  if(prS)for(const h of hunks(prS)){
    const ba=h.a.map(i=>B[i]),sb=h.b.map(j=>S[j]);
    if(!ba.length&&!sb.length)continue;
    // what does islamenc read here? (tokens between the islamenc counterparts of the anchors around the hunk)
    const before=h.a.length?h.a[0]-1:null;
    let i0=null,i1=null;{let k=(h.a.length?h.a[0]:(prS.findIndex(p=>p[1]===h.b[0])>0?null:null));}
    // locate anchors: last matched base index before the hunk and first after
    const firstB=h.a.length?h.a[0]:null;
    let prevB=-1,nextB=B.length;
    if(firstB!=null){prevB=firstB-1;nextB=h.a[h.a.length-1]+1}
    else{ // pure insertion in sunnah: find its position from the alignment
      const pos=prS.findIndex(p=>p[1]===h.b[0]);for(let k=pos;k>=0;k--)if(prS[k][0]!=null){prevB=prS[k][0];break}nextB=prevB+1}
    const ia=prevB>=0?iOf.get(prevB):-1,ib=nextB<B.length?iOf.get(nextB):I.length;
    let islRead=null;if(ia!=null&&ib!=null&&isl){islRead=I.slice((ia===-1?0:ia+1),ib)}
    const entry={n:+N,base:ba.map(t=>t.w).join(' '),sunnah:sb.map(t=>t.w).join(' '),islamenc:islRead?islRead.map(t=>t.w).join(' '):null};
    const fb=ba.map(t=>t.n).join(' '),fs_=sb.map(t=>t.n).join(' '),fi=islRead?islRead.map(t=>t.n).join(' '):null;
    // in the takhrij at the very end, editions word things differently: log only
    const inTakh=ba.length?us[loc[ba[0].li].ui].segs[loc[ba[0].li].si][0]==='takh':false;
    const oc=x=>x==null?null:x.replace(/ /g,'').replace(/مايه/g,'ميه').replace(/مايت/g,'ميت').replace(/ي$/,'ا');
    const glued=ba.length===1&&sb.length>1&&toks(loc[ba[0].li].w).length===1&&oc(fb)===oc(fs_)&&fb.length>=7&&sb.every(t=>t.n.length>=3);
    if(glued&&fi!=null&&fi===fs_){entry.decision='space restored (words run together in the base)';edits.push({type:'split',h,parts:sb.map(t=>t.n),entry})}
    else if(oc(fb)===oc(fs_)){entry.decision='orthographic only, kept'}
    else if(fi!=null&&fi===fs_&&fb!==fs_&&!inTakh&&Math.max(ba.length,sb.length)<=3&&prevB>=0&&ba.every(t=>toks(loc[t.li].w).length===1)){
      // Dalil al-Falihin decides when it quotes either reading with its left neighbour
      const dt=dalilText(+N);const left=prevB>=0?B[prevB].n:'';const right=nextB<B.length?B[nextB].n:'';
      const has=r=>dt&&(dt.includes(' '+[left,r].filter(Boolean).join(' ')+' ')||dt.includes(' '+[r,right].filter(Boolean).join(' ')+' '));
      const dB=fb&&has(fb),dW=fs_?has(fs_):(dt&&dt.includes(' '+left+' '+right+' '));
      entry.dalil=dt==null?'no passage':dW&&!dB?'supports sunnah.com + islamenc':dB&&!dW?'supports the base':dB&&dW?'both':'neither found';
      if(entry.dalil==='supports the base')entry.decision='kept (Dalil al-Falihin quotes the base reading)';
      else{entry.decision='corrected to the reading of sunnah.com + islamenc'+(entry.dalil==='supports sunnah.com + islamenc'?' (confirmed by Dalil al-Falihin)':'');edits.push({type:'replace',h,islRead,prevB,nextB,entry})}}
    else entry.decision=fi===fb?'kept (base = islamenc)':fi===fs_?(inTakh?'kept (takhrij wording)':'kept (long or unanchored stretch)'):'kept (three different readings)';
    (/^(corrected|space)/.test(entry.decision)?LOG.fixes:LOG.differences).push(entry);
  }
  // harakat enrichment from islamenc (before applying edits, on aligned words)
  const newW=loc.map(l=>l.w);
  if(prI)for(const [i,j] of prI){if(i==null||j==null)continue;const li=B[i].li;const bw=newW[li],iw=I[j].w;
    // only for words that are a single token on both sides
    if(toks(loc[li].w).length!==1)continue;
    const pre=bw.match(/^[^ء-ي]*/)[0],post=bw.match(/[^ء-يً-ْٰ]*$/)[0];
    const core=bw.slice(pre.length,bw.length-post.length),icore=iw.replace(/^[^ء-ي]*/,'').replace(/[^ء-يً-ْٰ]*$/,'');
    const c0=[];const m=mergeWord(core,icore,c0);if(c0.length)CONF.push({n:+N,...c0[0]});if(m!==core){newW[li]=pre+m+post;LOG.merged++}}
  // apply textual corrections (replace base words of the hunk by islamenc's words)
  for(const e of edits.reverse()){const ba=e.h.a.map(i=>B[i]);const lis=[...new Set(ba.map(t=>t.li))];
    if(e.type==='split'){const li=lis[0];const w=newW[li];const L=letters(w);let k=0,out='';const lens=e.parts.map(p=>p.replace(/ /g,'').length);
      // fold() may drop a hamza letter, so count base letters through fold of each letter
      let part=0,cnt=0;for(const x of L){const fx=fold(x.c);out+=x.c+x.h;if(/[ء-ي]/.test(x.c)&&fx)cnt++;if(part<lens.length-1&&cnt===lens[part]){out+=' ';part++;cnt=0}}
      newW[li]=out.trim();continue}
    const core=x=>x.replace(/^[^ء-ي]*/,'').replace(/[^ء-يً-ْٰ]*$/,'');
    const bw0=lis.length?newW[lis[0]]:'',bwL=lis.length?newW[lis[lis.length-1]]:'';
    const pre=lis.length?bw0.match(/^[^ء-ي]*/)[0]:'',post=lis.length?bwL.match(/[^ء-يً-ْٰ]*$/)[0]:'';
    const ins=pre+e.islRead.map(t=>core(t.w)).join(' ')+post;
    if(lis.length){const segKey=l=>loc[l].ui+'/'+loc[l].si;if(new Set(lis.map(segKey)).size>1){e.entry.decision='kept (crosses segments)';continue}
      newW[lis[0]]=ins;for(const l of lis.slice(1))newW[l]=null;}
    else{const li=B[e.prevB].li;newW[li]=newW[li]+' '+ins}}
  // write back
  us.forEach((u,ui)=>u.segs.forEach((s,si)=>{const ws=loc.map((l,k)=>l.ui===ui&&l.si===si?newW[k]:undefined).filter(x=>x!==undefined&&x!==null);s[1]=ws.join(' ')}));
}
LOG.conflicts=CONF.length;
LOG.stats={hadithNumbers:Object.keys(byN).length,wordFixes:LOG.fixes.filter(x=>x.decision.startsWith('corrected')).length,spacesRestored:LOG.fixes.filter(x=>x.decision.startsWith('space')).length,differencesLogged:LOG.differences.length,wordsGotHarakatFromIslamenc:LOG.merged,harakatConflicts:CONF.length};
fs.writeFileSync(path.join(C,'units-b.json'),JSON.stringify(U,null,1));
fs.writeFileSync(path.join(C,'collation.json'),JSON.stringify({...LOG,conflictList:CONF},null,1));
console.log(LOG.stats,'no witness',LOG.noWitness.length);
