/* ---------- matching what the recognizer heard against the text being recited ----------
   Shared by both engines. The browser's recognizer (Siri dictation on iPhone) writes modern spelling, drops or merges
   words and often confuses letters close in sound, so words are compared in a folded "sound" form and matched with a
   tolerant aligner. Nothing here judges harakat: the recognizer does not report them.
   Status of each expected word: 0 not reached, 1 said, 2 skipped (passed over), 3 shown as a hint, 4 before the start. */
(function(){
const H=/[ً-ٰٟۖ-ۭـ]/g;
const toAscii=s=>String(s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
// spelling: drop marks and punctuation, one form for alif, hamza seats, ta marbuta and alif maqsura
function norm(w){
  return toAscii(w).replace(H,'').replace(/[أإآٱ]/g,'ا').replace(/[ؤئء]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
    .replace(/[^ء-ي0-9]/g,'');
}
// sound: letters the recognizer mixes up share one form
const FOLD={'ث':'س','ص':'س','ذ':'ز','ظ':'ض','ط':'ت','ق':'ك','ح':'ه','ع':'ا','غ':'خ'};
const fold=w=>norm(w).replace(/[ثصذظطقحعغ]/g,c=>FOLD[c]).replace(/(.)\1+/g,'$1');
// the clitics that the recognizer attaches or splits differently: و ف ب ل ك and the article
const core=x=>x.replace(/^[وف](?=...)/,'').replace(/^[بلك](?=ال..)/,'').replace(/^ال(?=..)/,'').replace(/^ل(?=ل..)/,'');
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=[...Array(n+1).keys()];
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
// how well a heard token matches an expected word, 0..1 (both already folded)
function score(t,e){
  if(!t||!e)return 0; if(t===e)return 1;
  const a=core(t),b=core(e); if(a===b)return .95;
  const L=Math.max(a.length,b.length), d=lev(a,b);
  if(L<=3)return d<=1&&Math.min(a.length,b.length)>=2?.7:0;
  const r=1-d/L; if(r>=.6)return r;
  // the recognizer cut a long word short, or ran it on
  if(Math.min(a.length,b.length)>=4&&(a.startsWith(b)||b.startsWith(a)))return .65;
  return 0;
}
const OK=.6, LOOK=5;
/* Walk the heard tokens against the expected words from the current position. A token may match the next word, two or
   three words run together, or (with the following token) a word the recognizer split. A token matching a word a few
   places ahead skips the words between, but only when the match is strong, so one stray word does not jump ahead.
   Tokens that match nothing are ignored: noise, repetitions, or a word the reader said twice. */
function align(rawTokens,exp,hints,start){
  const tok=rawTokens.map(fold).filter(Boolean), E=exp.map(e=>({...e,f:fold(e.n)}));
  // words before the chosen starting point are left out of the recitation (status 4)
  const st=new Array(E.length).fill(0); let p=Math.max(0,Math.min(start||0,E.length)), pend=[]; for(let j=0;j<p;j++)st[j]=4;
  const skipHints=()=>{while(p<E.length&&hints&&hints.has(p)){st[p]=3;p++}};
  for(let i=0;i<tok.length;i++){
    skipHints(); if(p>=E.length)break;
    const t=tok[i];
    if(/^\d+$/.test(t)){if(E[p].num){while(p<E.length&&E[p].num){st[p]=1;p++}}continue}
    if(score(t,E[p].f)>=OK){st[p++]=1;pend=[];continue}
    // run together: «بسمالله»
    if(p+1<E.length&&score(t,E[p].f+E[p+1].f)>=OK){st[p]=st[p+1]=1;p+=2;continue}
    if(p+2<E.length&&score(t,E[p].f+E[p+1].f+E[p+2].f)>=.7){st[p]=st[p+1]=st[p+2]=1;p+=3;continue}
    // split: «الرحمن» heard as «الرح من»
    if(i+1<tok.length&&score(t+tok[i+1],E[p].f)>=OK){st[p++]=1;i++;continue}
    // ahead: a confident match a few words on skips the words between
    if(core(t).length>=3){let k=-1,best=0;for(let j=1;j<=LOOK&&p+j<E.length;j++){const s=score(t,E[p+j].f);if(s>=.8&&s>best){best=s;k=p+j}if(s===1)break}
      // short words heard since the last match may belong to the gap: credit them in order before calling the rest skipped
      if(k>0){let q=0;for(let j=p;j<k;j++){let f=q;while(f<pend.length&&score(pend[f],E[j].f)<OK)f++;
        if(f<pend.length){st[j]=1;q=f+1}else st[j]=hints&&hints.has(j)?3:2}st[k]=1;p=k+1;pend=[];continue}}
    pend.push(t);
  }
  skipHints(); return {st,p};
}
/* With several alternatives for one result, take the one that carries the recitation furthest. */
function best(prefixTokens,alts,exp,hints){
  let top=alts[0]||'',bp=-1;
  for(const a of alts){const r=align(prefixTokens.concat(a.split(/\s+/)),exp,hints);const sc=r.p*10+r.st.filter(x=>x===1).length;if(sc>bp){bp=sc;top=a}}
  return top;
}
// languages to try, Modern Standard Arabic first: dialect models (ar-JO) recognize classical text worse
const LANGS=['ar-SA','ar-AE','ar-EG','ar-JO'];
window.VOICE={norm,fold,score,align,best,LANGS};
})();
