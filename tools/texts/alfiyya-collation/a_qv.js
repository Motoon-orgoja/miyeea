const clean=require('./a_clean.js');const q=require('./q.json');
const toInt=s=>parseInt(s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)),10);
const V=[];const H=[];let pending=null;
for(const r of q){if(r.page>409)continue;for(const l of r.lines){const m=l.match(/^([٠-٩]+) - (.*)$/);
 if(m){const n=toInt(m[1]);const [a,b]=m[2].split(' … ').map(clean);V.push({n,a,b,raw:m[2],page:r.page,notes:r.notes});if(pending){H.push([n,pending]);pending=null}continue}
 if(/^\* \* \*|^بسم|^تم بحمد|^[. ]+$/.test(l))continue;
 pending=clean(l).replace(/[\[\]()]/g,'').replace(/\s+/g,' ').trim();}}
module.exports={V,H};
