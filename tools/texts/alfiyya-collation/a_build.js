const fs=require('fs');const {V,H}=require('./a_qv.js');
const FIX={367:[['لِاللَّهِ','لِلَّهِ']],815:[['وَلِالْفُعَالِ','وَلِلْفُعَالِ']],80:[['وَهكَذَا','وَهَكَذَا']],161:[['وبَعْدَ','وَبَعْدَ']],293:[['كإِمَّا','كَإِمَّا']]};
const hs=new Map(H);hs.set(1,'مُقَدِّمَةٌ');const out=[];let applied=0;
for(const v of V){if(hs.has(v.n))out.push('## '+hs.get(v.n));let a=v.a,b=v.b;
 for(const [x,y] of FIX[v.n]||[]){const before=a+b;a=a.split(' ').map(w=>w===x?y:w).join(' ');b=b.split(' ').map(w=>w===x?y:w).join(' ');if(before!==a+b)applied++;else console.error('fix not applied',v.n,x)}
 if(/\|/.test(a+b))throw 'pipe';out.push(a+' | '+b);}
fs.writeFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/alfiyya.txt',out.join('\n')+'\n','utf8');console.log('lines',out.length,'fixes',applied);
