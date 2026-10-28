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
function align(rawTokens,exp,hints,start){
  const tok=rawTokens.map(fold).filter(Boolean), E=exp.map(e=>({...e,f:fold(e.n)}));
  // words before the chosen starting point are left out of the recitation (status 4)
  const st=new Array(E.length).fill(0); let p=Math.max(0,Math.min(start||0,E.length)), pend=[]; for(let j=0;j<p;j++)st[j]=4;
  const skipHints=()=>{while(p<E.length&&hints&&hints.has(p)){st[p]=3;p++}};
  for(let i=0;i<tok.length;i++){
    skipHints(); if(p>=E.length)break;
    const t=tok[i];
    if(/^\d+$/.test(t)){if(E[p].num){while(p<E.length&&E[p].num){st[p]=1;p++}}continue}
    const sc=score(t,E[p].f);
    if(sc>=OK){st[p++]=1;pend=[];continue}
    // a near miss in the right place counts when the next heard word lines up with the next expected word
    if(core(t).length>=2&&lev(core(t),core(E[p].f))<=Math.max(1,Math.floor(Math.max(core(t).length,core(E[p].f).length)/2))&&(i+1>=tok.length||(p+1<E.length&&score(tok[i+1],E[p+1].f)>=OK))){st[p++]=1;pend=[];continue}
    // run together: «بسمالله»
    if(p+1<E.length){const two=E[p].f+E[p+1].f;if(score(t,two)>=(two.length>=6?.5:OK)){st[p]=st[p+1]=1;p+=2;continue}}
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
/* ---------- the precise engine: record the whole recitation, then transcribe it on the device with Whisper ----------
   Chosen in settings (localStorage ui_asrEngine = 'whisper'). Audio is recorded at the device's own rate and resampled
   to 16 kHz with an OfflineAudioContext (custom-rate AudioContexts with a microphone are unreliable in Safari). */
const MODELS={base:'onnx-community/whisper-base',small:'onnx-community/whisper-small',quran:'iqbalaesthetic/Basira'};
const engine=()=>{try{return localStorage.getItem('ui_asrEngine')||'web'}catch(e){return 'web'}};
const modelId=()=>{try{return MODELS[localStorage.getItem('ui_asrModel')]||MODELS.base}catch(e){return MODELS.base}};
let worker=null, waiters=[], onProg=null;
function getWorker(){
  if(worker)return worker;
  worker=new Worker(new URL('whisper-worker.js',document.baseURI),{type:'module'});
  worker.onmessage=({data})=>{
    if(data.type==='progress'){onProg&&onProg(data);return}
    if(data.type==='ready'){try{localStorage.setItem('ui_asrReady',modelId())}catch(e){}}
    const w=waiters.shift(); if(!w)return;
    data.type==='error'?w.reject(new Error(data.message)):w.resolve(data);
  };
  worker.onerror=e=>{const w=waiters.shift();w&&w.reject(new Error(e.message||'worker'))};
  return worker;
}
function ask(msg,transfer){return new Promise((resolve,reject)=>{waiters.push({resolve,reject});getWorker().postMessage(msg,transfer||[])})}
const W={rec:null,stream:null,parts:[],
  // download (or open from cache) the model ahead of time, reporting progress as a percentage
  prepare(progress){onProg=progress?(p=>{if(p.total)progress(Math.round(p.loaded/p.total*100),p.file)}):null;return ask({type:'load',model:modelId()})},
  ready:()=>{try{return localStorage.getItem('ui_asrReady')===modelId()}catch(e){return false}},
  async start(){
    this.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
    this.parts=[]; this.rec=new MediaRecorder(this.stream); this.rec.ondataavailable=e=>{if(e.data.size)this.parts.push(e.data)}; this.rec.start();
  },
  recording(){return !!(this.rec&&this.rec.state==='recording')},
  // stop recording and return what was said, as plain text
  async stop(progress){
    if(!this.rec)return '';
    const rec=this.rec; this.rec=null;
    await new Promise(r=>{rec.onstop=r;try{rec.stop()}catch(e){r()}});
    try{this.stream.getTracks().forEach(t=>t.stop())}catch(e){}
    const blob=new Blob(this.parts,{type:rec.mimeType||'audio/mp4'}); this.lastBlob=blob;
    const ac=new (window.AudioContext||window.webkitAudioContext)();
    const buf=await ac.decodeAudioData(await blob.arrayBuffer()); try{ac.close()}catch(e){}
    const off=new OfflineAudioContext(1,Math.max(1,Math.ceil(buf.duration*16000)),16000);
    const src=off.createBufferSource(); src.buffer=buf; src.connect(off.destination); src.start();
    const audio=(await off.startRendering()).getChannelData(0);
    onProg=progress?(p=>{if(p.total)progress(Math.round(p.loaded/p.total*100))}):null;
    const res=await ask({type:'run',audio,model:modelId()},[audio.buffer]);
    return res.text||'';
  },
  async cancel(){if(this.rec){try{this.rec.stop()}catch(e){}this.rec=null}try{this.stream&&this.stream.getTracks().forEach(t=>t.stop())}catch(e){}}
};
const arN=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
/* One precise session, wired to a page's voice state through h = {VS, msg, update, stop, btn}:
   start() records (and starts the model download in the background the first time); finish() transcribes,
   hands the text to the page's normal matching, and ends the session with its usual summary. */
function precise(h){
  return {
    async start(){
      if(!navigator.mediaDevices||!window.MediaRecorder){h.msg('المتصفح هذا ما بيدعم التسجيل.');return}
      try{await W.start()}catch(e){h.msg('ما قدرت أشغّل المايك. اسمح للمتصفح يستعمله.');return}
      h.VS.on=true; h.VS.prev=[...h.VS.finals]; h.btn.textContent='⏹ خلصت، صحّح'; h.btn.classList.add('live');
      h.msg(W.ready()?'سمّع من حفظك، ولما تخلص اضغط «خلصت».':'سمّع من حفظك. وبنفس الوقت بنزّل نموذج التعرّف لأول مرة…');
      if(!W.ready())W.prepare(p=>{if(W.recording())h.msg('سمّع من حفظك · تنزيل النموذج '+arN(p)+'٪')}).catch(()=>{});
    },
    async finish(){
      h.btn.disabled=true; h.btn.textContent='⏳ بحلّل…'; h.msg('بحلّل تسميعك على جهازك…');
      try{
        const text=await W.stop(p=>h.msg('بنزّل نموذج التعرّف '+arN(p)+'٪ (مرة وحدة بس)'));
        h.VS.finals=[...h.VS.prev,text].filter(Boolean); h.VS.interim=''; h.update();
        h.btn.disabled=false; h.stop(false);
        // the reader can listen back to their own recitation, next to the marked text
        const host=h.btn.closest('.stepbar,.voicebar'); if(host&&W.lastBlob){host.querySelectorAll('.ui-myrec').forEach(x=>x.remove());
          const d=document.createElement('div');d.className='ui-myrec';const au=document.createElement('audio');au.controls=true;au.src=URL.createObjectURL(W.lastBlob);
          const l=document.createElement('small');l.textContent='اسمع تسميعك:';d.append(l,au);host.append(d)}
        if(!text)h.msg('ما التقطت كلام. قرّب الجوال وجرّب مرة ثانية.');
      }catch(e){
        h.btn.disabled=false; h.VS.on=true; h.stop(true);
        h.msg('ما زبط التحليل الدقيق على هالجهاز ('+(e.message||'')+'). جرّب «تعرّف المتصفح» من الإعدادات.');
      }
    }
  };
}
window.VOICE={norm,fold,score,align,best,LANGS,engine,W,MODELS,precise};
})();
