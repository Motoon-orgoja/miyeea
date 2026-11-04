// for each disputed hemistich: how often do the T and the K/M readings (or distinctive word pairs) occur in Hazimi's sharh (ketabonline 90602)
const N=require('./norm');const fs=require('fs');
const H=' '+N(fs.readFileSync(__dirname+'/'+(process.env.HZ||'ko90602.txt'),'utf8'))+' ';
const W={T:require('./parse-takwin'),K:require('./parse-ko'),M:require('./parse-mq')};
const cnt=s=>{if(!s)return 0;let c=0,i=0;while((i=H.indexOf(' '+s+' ',i))>=0){c++;i++}return c};
// distinctive window: the differing words plus one neighbour each side
function win(a,b){a=a.split(' ');b=b.split(' ');let p=0;while(p<a.length&&p<b.length&&a[p]===b[p])p++;let q=0;while(q<a.length-p&&q<b.length-p&&a[a.length-1-q]===b[b.length-1-q])q++;
 const s=Math.max(0,p-1);return [a.slice(s,Math.min(a.length,a.length-q+1)).join(' '),b.slice(s,Math.min(b.length,b.length-q+1)).join(' ')]}
for(let i=0;i<291;i++)for(const h of ['a','b']){const t=N(W.T[i][h]);for(const k of ['K','M']){const v=W[k][i]&&W[k][i][h];if(!v)continue;const o=N(v);if(o===t)continue;
 const [wt,wo]=win(t,o);console.log((i+1)+h+'\t'+k+'\tT«'+wt+'»='+cnt(wt)+'\t'+k+'«'+wo+'»='+cnt(wo)+'\tfullT='+cnt(t)+' full'+k+'='+cnt(o))}}
