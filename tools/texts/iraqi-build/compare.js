// word-level diff of base (354, cleaned) vs another parsed edition (by verse number)
const norm=require('./norm'),clean=require('./clean');
const A=require('./p354.json').V,B=require(process.argv[2]).V;
const c=s=>clean(s).replace(/(^|\s)-(\s|$)/g,' ').trim();
function lcs(a,b){const n=a.length,m=b.length,d=Array.from({length:n+1},()=>new Int16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)d[i][j]=a[i]===b[j]?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);
 const out=[];let i=0,j=0,da=[],db=[];const flush=()=>{if(da.length||db.length)out.push([da.join(' '),db.join(' ')]);da=[];db=[]};
 while(i<n||j<m){if(i<n&&j<m&&a[i]===b[j]){flush();i++;j++}else if(j>=m||(i<n&&d[i+1][j]>=d[i][j+1]))da.push(a[i++]);else db.push(b[j++]);}flush();return out;}
const bm=new Map(B.map(v=>[v.n,v]));let cnt=0;
for(const v of A){const w=bm.get(v.n);if(!w){console.log(v.n,'MISSING');continue}
 const a=norm(c(v.a)+' '+c(v.b)).split(' '),b=norm(w.raw.replace(/\([٠-٩0-9]+\)/g,'')).split(' ');
 const d=lcs(a,b);if(d.length){cnt++;console.log(v.n+'\t'+d.map(x=>x[0]+' ≠ '+x[1]).join(' ; ')+'\t|| '+c(v.a)+' | '+c(v.b)+'\t|| '+w.raw)}}
console.error('verses with diffs',cnt);
