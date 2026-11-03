const fs=require('fs');const {norm,lcs}=require('./norm.js');
const pre=s=>s.replace(/\.\.\./g,' ').replace(/([كب]َ?ـ)\s*["«(]?\s*/g,'$1').replace(/ـ/g,'');
const glue=s=>s.replace(/["«»“”{}﴿﴾\[\]*]/g,' ').replace(/(^|\s)(وَ?)\s+/g,'$1$2').replace(/(^|\s)(وَ?)(مَا|ما)\s+(?=(زَالَ|زال|فَتِئَ|فتئ|انْفَكَّ|انفك|بَرِحَ|برح|دَامَ|دام)[\s،,.])/g,(m,a,b,c)=>a+b+c);
const toks=(s,x={})=>glue(pre(s)).split(/\s+/).map(w=>Object.assign({w:w.replace(/[،.:؛,؟]/g,''),n:norm(w)},x)).filter(t=>t.n);
const fin=fs.readFileSync('final.txt','utf8').split('\n').filter(l=>!l.startsWith('##')).join(' ');
const P=toks(fin);const F=[];require('./fz3.json').forEach((q,qi)=>toks(q.s.replace(/[()]/g,' '),{q:qi}).forEach(t=>F.push(t)));
const m=lcs(P,F);
// canonical harakat compare: drop shadda/sukun order issues, alif-wasla, ignore difference of tanwin-alif placement and lam-alif hamza forms
const H=/[\u064B-\u0652]/;
const canon=w=>w.normalize('NFC').replace(/ٱ/g,'ا').replace(/([\u064B-\u0652]+)/g,m=>[...m].sort().join('')).replace(/\u0652/g,'');
const noH=w=>!H.test(w.replace(/^[وفبكل]َ?/,''));
let completed=[],changed=[],noF=0;
P.forEach((t,i)=>{if(m[i]<0){noF++;return}const f=F[m[i]].w;if(canon(f)===canon(t.w))return;
 if(noH(f))completed.push(t.w);else changed.push(f+' → '+t.w);});
console.log('final',P.length,'notInF',noF,'completed(F bare)',completed.length,'changed',changed.length);
fs.writeFileSync('hlog.txt','## changed\n'+changed.join('\n')+'\n## completed\n'+completed.join(' '));
// substantive: per-letter compare
const split=w=>{w=w.replace(/ٱ/g,'ا').replace(/([^\u064B-\u0652])ً?ا$/,(m)=>m).replace(/اً$/,'ًا').replace(/ىً$/,'ًى');const L=[];for(const c of w){if(/[\u064B-\u0652]/.test(c)){if(L.length)L[L.length-1].d.add(c)}else L.push({c,d:new Set()})}
 // move tanwin fath from final alif to previous letter
 if(L.length>1&&/[اى]/.test(L[L.length-1].c)&&L[L.length-1].d.has('ً')){L[L.length-1].d.delete('ً');L[L.length-2].d.add('ً')}
 L.forEach(x=>x.d.delete('\u0652'));return L};
const sub=[];
P.forEach((t,i)=>{if(m[i]<0)return;const f=F[m[i]].w;const a=split(f),b=split(t.w);if(a.length!==b.length){if(canon(f)!==canon(t.w))sub.push(f+' → '+t.w+'  [len]');return}
 for(let k=0;k<a.length;k++){const x=[...a[k].d].sort().join(''),y=[...b[k].d].sort().join('');if(x&&y&&x!==y){sub.push(f+' → '+t.w);return}}});
fs.writeFileSync('hsub.txt',sub.join('\n'));console.log('substantive',sub.length);
