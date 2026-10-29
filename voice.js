/* ---------- matching what the recognizer heard against the text being recited ----------
   Shared by both engines. The browser's recognizer (Siri dictation on iPhone) writes modern spelling, drops or merges
   words and often confuses letters close in sound, so words are compared in a folded "sound" form and matched with a
   tolerant aligner. harakat() compares vowels when the heard text carries them (the browser recognizers do not).
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
  // the consonant skeleton: recognizers (Whisper above all) spell long vowels as they hear them («ماليكي» for «مالك»)
  const sk=x=>x[0]+x.slice(1).replace(/[اوي]/g,''), sa=sk(a), sb=sk(b);
  if(sa.length>=3&&sa===sb)return .8;
  if(Math.min(sa.length,sb.length)>=3){const rs=1-lev(sa,sb)/Math.max(sa.length,sb.length);if(rs>=.67)return .62}
  // the recognizer cut a long word short, or ran it on
  if(Math.min(a.length,b.length)>=3&&Math.min(a.length,b.length)/L>=.6&&(a.startsWith(b)||b.startsWith(a)))return .65;
  // below the bar: the raw similarity, for callers with a lower bar (two words heard as one)
  return Math.max(0,r);
}
const OK=.6, LOOK=5;
/* Walk the heard tokens against the expected words from the current position. A token may match the next word, two or
   three words run together, or (with the following token) a word the recognizer split. A token matching a word a few
   places ahead skips the words between, but only when the match is strong, so one stray word does not jump ahead.
   Tokens that match nothing are ignored: noise, repetitions, or a word the reader said twice. */
function align(rawTokens,exp,hints,start,map){
  const tok=[], idx=[]; rawTokens.forEach((x,i)=>{const f=fold(x);if(f){tok.push(f);idx.push(i)}});
  // map (optional) receives, for each word matched by a single heard token, that token's index in rawTokens
  const mark=(j,i)=>{if(map)map[j]=idx[i]};
  const E=exp.map(e=>({...e,f:fold(e.n)}));
  // words before the chosen starting point are left out of the recitation (status 4)
  const st=new Array(E.length).fill(0); let p=Math.max(0,Math.min(start||0,E.length)), pend=[]; for(let j=0;j<p;j++)st[j]=4;
  const skipHints=()=>{while(p<E.length&&hints&&hints.has(p)){st[p]=3;p++}};
  for(let i=0;i<tok.length;i++){
    skipHints(); if(p>=E.length)break;
    const t=tok[i];
    if(/^\d+$/.test(t)){if(E[p].num){while(p<E.length&&E[p].num){st[p]=1;p++}}continue}
    const sc=score(t,E[p].f);
    if(sc>=OK){mark(p,i);st[p++]=1;pend=[];continue}
    // a near miss in the right place counts when the next heard word lines up with the next expected word
    if(core(t).length>=2&&lev(core(t),core(E[p].f))<=Math.max(1,Math.floor(Math.max(core(t).length,core(E[p].f).length)/2))&&(i+1>=tok.length||(p+1<E.length&&score(tok[i+1],E[p+1].f)>=OK))){mark(p,i);st[p++]=1;pend=[];continue}
    // run together: «بسمالله»
    if(p+1<E.length){const two=E[p].f+E[p+1].f;if(score(t,two)>=(two.length>=6?.5:OK)){st[p]=st[p+1]=1;p+=2;continue}}
    if(p+2<E.length&&score(t,E[p].f+E[p+1].f+E[p+2].f)>=.7){st[p]=st[p+1]=st[p+2]=1;p+=3;continue}
    // split: «الرحمن» heard as «الرح من»
    if(i+1<tok.length&&score(t+tok[i+1],E[p].f)>=OK){st[p++]=1;i++;continue}
    // ahead: a confident match a few words on skips the words between
    if(core(t).length>=3){let k=-1,best=0;for(let j=1;j<=LOOK&&p+j<E.length;j++){const s=score(t,E[p+j].f);if(s>=.8&&s>best){best=s;k=p+j}if(s===1)break}
      // short words heard since the last match may belong to the gap: credit them in order before calling the rest skipped
      if(k>0){let q=0;for(let j=p;j<k;j++){let f=q;while(f<pend.length&&score(pend[f],E[j].f)<OK)f++;
        if(f<pend.length){st[j]=1;q=f+1}else st[j]=hints&&hints.has(j)?3:2}mark(k,i);st[k]=1;p=k+1;pend=[];continue}}
    pend.push(t);
  }
  skipHints(); return {st,p};
}
/* ---------- harakat (only when the recognizer wrote them: the Quran-trained model does) ----------
   A word is compared only when the heard word has exactly the same letters as the text, letter by letter, and only where
   both carry a vowel: a missing mark, a sukun or a shadda is never counted, nor the last letter's sukun of a pause. The
   vowel is compared by its class (a / u / i), so tanween against a plain vowel is not flagged either. */
const VCL={'َ':'a','ً':'a','ُ':'u','ٌ':'u','ِ':'i','ٍ':'i'};
function vowels(w){const out=[];for(const c of toAscii(w).replace(/[^ء-يٱً-ْ]/g,'')){if(/[ء-يٱ]/.test(c))out.push({c,v:''});else if(out.length&&VCL[c])out[out.length-1].v=VCL[c]}return out}
const hasHarakat=s=>/[ً-ِ]/.test(s);
function harakat(rawTokens,exp,hints,start){
  if(!hasHarakat(rawTokens.join(' ')))return [];
  const map=[]; align(rawTokens,exp,hints,start,map); const out=[];
  map.forEach((i,j)=>{if(i==null||!exp[j])return; const e=vowels(exp[j].n), h=vowels(rawTokens[i]);
    if(e.length!==h.length||e.some((x,k)=>norm(x.c)!==norm(h[k].c)))return;
    if(e.some((x,k)=>x.v&&h[k].v&&x.v!==h[k].v))out.push({j,e:exp[j].n,h:rawTokens[i]})});
  return out;
}
// after a recitation: remember which words to underline (VS.hk) and describe the first few
const arD=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
function harakNote(VS,exp){
  const hk=harakat(VS.finals.join(' ').split(/\s+/).filter(Boolean),exp,VS.hints,VS.start); VS.hk=new Set(hk.map(x=>x.j));
  if(!hk.length)return '';
  return 'انتبه لحركة '+arD(hk.length)+' كلمات (تجريبي): '+hk.slice(0,4).map(x=>'«'+x.e+'» قرأتها «'+x.h+'»').join('، ')+(hk.length>4?'…':'');
}
/* With several alternatives for one result, take the one that carries the recitation furthest. */
function best(prefixTokens,alts,exp,hints){
  let top=alts[0]||'',bp=-1;
  for(const a of alts){const r=align(prefixTokens.concat(a.split(/\s+/)),exp,hints);const sc=r.p*10+r.st.filter(x=>x===1).length;if(sc>bp){bp=sc;top=a}}
  return top;
}
// languages to try, Modern Standard Arabic first: dialect models (ar-JO) recognize classical text worse
const LANGS=['ar-SA','ar-AE','ar-EG','ar-JO'];
/* ---------- «سجّل واسمع»: record the recitation, then listen back with the text in front of you and mark your own slips ----------
   Chosen in settings or from the voice bar (localStorage ui_asrEngine = 'self'). Nothing is sent anywhere and no
   recognition runs: the page only records, so it works on any phone and without internet. */
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
const engine=()=>{let v='web';try{v=localStorage.getItem('ui_asrEngine')||'web'}catch(e){} return v==='web'?'web':'self'};
const setEngine=v=>{try{v==='web'?localStorage.removeItem('ui_asrEngine'):localStorage.setItem('ui_asrEngine',v)}catch(e){}};
const W={rec:null,stream:null,parts:[],
  async start(){
    this.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
    this.parts=[]; this.rec=new MediaRecorder(this.stream); this.rec.ondataavailable=e=>{if(e.data.size)this.parts.push(e.data)}; this.rec.start();
  },
  recording(){return !!(this.rec&&this.rec.state==='recording')},
  // stop and return the recording
  async stop(){
    if(!this.rec)return null;
    const rec=this.rec; this.rec=null;
    await new Promise(r=>{rec.onstop=r;try{rec.stop()}catch(e){r()}});
    try{this.stream.getTracks().forEach(t=>t.stop())}catch(e){}
    return new Blob(this.parts,{type:rec.mimeType||'audio/mp4'});
  },
  async cancel(){if(this.rec){try{this.rec.stop()}catch(e){}this.rec=null}try{this.stream&&this.stream.getTracks().forEach(t=>t.stop())}catch(e){}}
};
const RATES=[1,1.25,1.5,.75];
/* One session wired to a page's voice state through h = {VS, msg, update, stop, btn, words}.
   VS.self is 'rec' while recording and 'check' while listening back; VS.forced holds the word states then
   (1 = right, 2 = the reader marked a slip), and the page's own matching is skipped. */
function selfRec(h){
  const host=()=>h.btn.closest('.stepbar,.voicebar');
  function mark(e){
    if(h.VS.self!=='check')return; const w=e.target.closest('.w'); if(!w)return;
    const i=h.words().indexOf(w); if(i<h.VS.start||i<0)return;
    e.preventDefault(); e.stopPropagation();
    h.VS.forced[i]=h.VS.forced[i]===2?1:2; h.update();
    const n=h.VS.forced.filter(x=>x===2).length;
    h.msg(n?`علّمت ${n===1?'كلمة وحدة':n===2?'كلمتين':arN(n)+' '+(n<=10?'كلمات':'كلمة')}. لما تخلص اضغط «✓ خلصت التصحيح».`:'اسمع تسجيلك والنص قدامك، واضغط على أي كلمة غلطت فيها.');
  }
  document.addEventListener('click',mark,true);
  return {
    async start(){
      if(!navigator.mediaDevices||!window.MediaRecorder){h.msg('المتصفح هذا ما بيدعم التسجيل.');return}
      reset(h.VS);
      try{await W.start()}catch(e){h.msg('ما قدرت أشغّل المايك. اسمح للمتصفح يستعمله.');return}
      h.VS.self='rec'; h.btn.textContent='⏹ خلصت، خليني أسمع'; h.btn.classList.add('live');
      h.msg('سمّع من حفظك وأنا بسجّل. لما تخلص اضغط الزر.'); h.update();
    },
    async listen(){
      const blob=await W.stop(); h.btn.classList.remove('live');
      if(!blob||!blob.size){h.VS.self=null;h.btn.textContent='🎤 سجّل';h.msg('ما انسجّل شي. جرّب مرة ثانية.');return}
      const n=h.words().length; h.VS.forced=Array.from({length:n},(_,i)=>i<h.VS.start?4:1); h.VS.self='check';
      h.btn.textContent='✓ خلصت التصحيح'; h.update();
      const box=host(); if(box){
        box.querySelectorAll('.ui-myrec').forEach(x=>x.remove());
        const d=document.createElement('div'); d.className='ui-myrec';
        const au=document.createElement('audio'); au.controls=true; au.src=URL.createObjectURL(blob); au.setAttribute('playsinline','');
        const sp=document.createElement('button'); sp.className='btn'; sp.type='button'; let ri=0; sp.textContent='×١';
        sp.onclick=()=>{ri=(ri+1)%RATES.length; au.playbackRate=RATES[ri]; sp.textContent='×'+arN(RATES[ri]).replace('.','٫')};
        d.append(au,sp); box.append(d); au.play().catch(()=>{});
      }
      h.msg('اسمع تسجيلك والنص قدامك، واضغط على أي كلمة غلطت فيها.');
    },
    // hand the marks to the page's normal summary, which saves the slips like any recitation
    done(){h.VS.self=null; h.VS.on=true; h.btn.textContent='🎤 سجّل'; h.stop(false)},
    click(){const s=h.VS.self; s==='rec'?this.listen():s==='check'?this.done():this.start()}
  };
}
function reset(VS){VS.self=null;VS.forced=null;document.querySelectorAll('.ui-myrec').forEach(x=>x.remove());if(W.recording())W.cancel()}
// the small switch next to the mic button: live recognition ⇄ record and listen
function modeSwitch(btn,after){
  const b=document.createElement('button'); b.type='button'; b.className='btn ui-vmode';
  const paint=()=>{const s=engine()==='self'; b.textContent=s?'🎧 سجّل واسمع':'🗣 تعرّف تلقائي'; b.title='غيّر طريقة التسميع'; if(!btn.classList.contains('live'))btn.textContent=s?'🎤 سجّل':'🎤 ابدأ'};
  b.onclick=()=>{if(btn.classList.contains('live'))return; setEngine(engine()==='self'?'web':'self'); after&&after(); paint();
    window.UI&&window.UI.toast&&window.UI.toast(engine()==='self'?'سجّل واسمع: بتسمّع، وبعدين بتسمع حالك والنص قدامك وبتعلّم غلطاتك':'تعرّف تلقائي: بيسمعك وبيعلّم الكلمات وإنت بتقرأ')};
  // the same choice made in settings
  addEventListener('ui-asr',()=>{if(btn.classList.contains('live'))return; after&&after(); paint()});
  btn.after(b); paint(); return {paint};
}
const arN=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
window.VOICE={norm,fold,score,align,harakat,harakNote,best,LANGS,engine,setEngine,W,IOS,selfRec,reset,modeSwitch};
})();
