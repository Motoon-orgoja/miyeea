// Automatic sanity checks on the vocalized text of data/riyad.js (outside Qur'an segments and the unvocalized formulae)
const vm=require('vm'),fs=require('fs'),path=require('path');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','..','data','riyad.js'),'utf8'),ctx);const B=ctx.window.BOOK;
const F=/صلى الله عليه وسلم|رَ?ضِ?يَ? ?اللهُ? عَ?نْ?هُ?(?:مَا|م|ا)?|رضي الله عنه(?:ما|م|ا)?|عليه السلام/g;
const checks={
  'two vowels on one letter':/[ً-ِْ][ً-ِْ]/,
  'vowel before shadda':/[ً-ِْ]ّ/,
  'tanween on a word with the article':/^[وفبكل]?ال[ء-يً-ْ]*[ً-ٍ]$/,
  'haraka on a bare alif/ya/waw of prolongation after the matching vowel':/َا[َ-ِ]|ِي[َ-ِ]|ُو[َ-ِ]/,
  'no harakat at all (2+ letters)':/^[^ً-ْ]*$/,
  'sukun on the first letter':/^[ء-ي]ْ/
};
const res={};for(const k in checks)res[k]=[];
for(const c of B.chapters)for(const u of c.units)for(const [k,t] of u.segs){if(k==='aya')continue;
  for(const w0 of t.replace(F,' ').replace(/\[[^\]]*\]/g,' ').replace(/﴿[^﴾]*﴾/g,' ').split(/\s+/)){const w=w0.replace(/[^ء-يً-ْٰ]/g,'');if(!/[ء-ي]{2}/.test(w))continue;
    for(const [n,re] of Object.entries(checks))if(re.test(w))res[n].push(u.id+':'+w)}}
for(const [n,a] of Object.entries(res))console.log(n,a.length,a.slice(0,12).join(' '));
module.exports=res;
