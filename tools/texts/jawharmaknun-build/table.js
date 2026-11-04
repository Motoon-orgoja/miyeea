// per hemistich: which witnesses agree with the base skeleton
const N=require('./norm');const W={T:require('./parse-takwin'),K:require('./parse-ko'),M:require('./parse-mq'),I:require('./parse-tk')};
const extra=process.argv.slice(2);for(const e of extra)W[e[0].toUpperCase()]=require('./parse-'+e);
const rows=[];
for(let i=0;i<291;i++)for(const h of ['a','b']){const t=N(W.T[i][h]);const r={};let d=false;
 for(const k of Object.keys(W)){if(k==='T')continue;const v=W[k][i]&&W[k][i][h];if(!v){r[k]='-';continue}const s=N(v);r[k]=s===t?'=':s;if(s!==t)d=true}
 if(d)rows.push((i+1)+h+'\tT:'+t+'\n'+Object.entries(r).filter(([k,v])=>v!=='=').map(([k,v])=>'\t'+k+':'+v).join('\n')+'\t['+Object.entries(r).filter(([k,v])=>v==='=').map(([k])=>k).join('')+' agree]')}
console.log(rows.join('\n'));
