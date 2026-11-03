const H=/[\u064B-\u0652\u0670\u0640]/g;
const norm=w=>w.replace(H,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^\u0621-\u064A0-9]/g,'');
const toks=s=>s.replace(/\.\.\./g,' ').split(/\s+/).map(w=>({w,n:norm(w)})).filter(t=>t.n);
function lcs(a,b){const n=a.length,m=b.length;const L=[];for(let i=0;i<=n;i++)L.push(new Uint16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i].n===b[j].n?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const map=new Array(n).fill(-1);let i=0,j=0;while(i<n&&j<m){if(a[i].n===b[j].n){map[i]=j;i++;j++}else if(L[i+1][j]>=L[i][j+1])i++;else j++;}return map;}
module.exports={norm,toks,lcs,H};
