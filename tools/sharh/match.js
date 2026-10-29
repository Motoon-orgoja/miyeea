// Shared helpers: load poem verses, normalise Arabic, fuzzy-match a verse line to our verse index.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','..');
function loadVerses(file){const w={};new Function('window',fs.readFileSync(path.join(ROOT,'data',file+'.js'),'utf8'))(w);return {book:w.BOOK,verses:w.BOOK.poems[0].verses}}
function norm(s){return String(s)
  .replace(/[ً-ٰٟۖ-ۭـ]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'')
  .replace(/[^ء-ي]/g,'')}
function grams(s){const g=new Map();for(let i=0;i<s.length-1;i++){const k=s.slice(i,i+2);g.set(k,(g.get(k)||0)+1)}return g}
function dice(a,b){if(a.length<2||b.length<2)return a===b?1:0;const A=grams(a),B=grams(b);let n=0;for(const [k,v] of A)n+=Math.min(v,B.get(k)||0);return 2*n/(a.length-1+b.length-1)}
// returns {i,score} best verse index for a text line containing (part of) a verse
function bestVerse(verses,line,{from=0}={}){const L=norm(line);let best={i:-1,score:0};
  verses.forEach((v,i)=>{if(i<from)return;const full=norm(v[0]+v[1]);const s=dice(L,full);if(s>best.score)best={i,score:s}});return best}
function shatrScore(verses,i,text){const t=norm(text);return Math.max(dice(t,norm(verses[i][0])),dice(t,norm(verses[i][1])),dice(t,norm(verses[i][0]+verses[i][1])))}
module.exports={loadVerses,norm,dice,bestVerse,shatrScore,ROOT};
