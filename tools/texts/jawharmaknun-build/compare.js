// word-level LCS diff of base (takwin) against a check source, per hemistich
const N=require('./norm');
const base=require('./parse-takwin');
const src=process.argv[2];const chk=require('./'+src);
function diff(a,b){a=a.split(' ');b=b.split(' ');const n=a.length,m=b.length,L=[...Array(n+1)].map(()=>Array(m+1).fill(0));
for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i]===b[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
const o=[];let i=0,j=0,da=[],db=[];const fl=()=>{if(da.length||db.length)o.push(da.join(' ')+' → '+db.join(' '));da=[];db=[]};
while(i<n||j<m){if(i<n&&j<m&&a[i]===b[j]){fl();i++;j++}else if(j<m&&(i>=n||L[i][j+1]>=L[i+1][j]))db.push(b[j++]);else da.push(a[i++])}fl();return o}
let cnt=0;
for(let k=0;k<base.length;k++){const c=chk.find?chk[k]:null;if(!c||!c.a)continue;
 for(const h of ['a','b']){const d=diff(N(base[k][h]),N(c[h]||''));if(d.length){cnt++;console.log((k+1)+h+'\t'+d.join(' | ')+'\t«'+base[k][h]+'» / «'+c[h]+'»')}}}
console.error('hemistichs with differences:',cnt);
