// harakat conflicts between base and check (same skeleton word, conflicting marks where both have a mark on same letter)
const fs=require('fs'),{norm}=require('./norm.js');
const split=w=>{const L=[];for(const ch of w.normalize('NFC')){if(/[ً-ْ]/.test(ch)){if(L.length)L[L.length-1].m+=ch}else if(ch!=='ـ')L.push({c:ch,m:''})}return L};
exports.conflicts=(a,b)=>{const A=a.split(' ').filter(x=>x!=='|'),B=b.split(' ').filter(x=>x!=='|');const out=[];
 if(A.length!==B.length)return null;
 A.forEach((w,i)=>{if(norm(w)!==norm(B[i]))return;const x=split(w),y=split(B[i]);if(x.length!==y.length)return;
  for(let k=0;k<x.length;k++){const mx=x[k].m.replace(/ّ/,''),my=y[k].m.replace(/ّ/,'');const sx=x[k].m.includes('ّ'),sy=y[k].m.includes('ّ');
   if((mx&&my&&mx!==my)||(sx!==sy&&x[k].m&&y[k].m)){out.push(w+' / '+B[i]);break}}});return out};
if(require.main===module){const P=JSON.parse(fs.readFileSync('sullam-pick.json','utf8')),R=JSON.parse(fs.readFileSync('sullam-Bmap.json','utf8'));
 P.forEach((p,i)=>{if(!p.a)return;const c=exports.conflicts(p.a+' | '+p.b,R[i].app.join(' | '));if(c&&c.length)console.log(p.n,c.join(' ; '))})}
