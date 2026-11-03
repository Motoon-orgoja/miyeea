const {V}=require('./a_qv.js');const a=require('./d9904.json'),b=require('./d8522.json');const A={},B={};for(const x of a)A[x.n]=x;for(const x of b)B[x.n]=x;
for(const n of process.argv.slice(2).map(Number)){const v=V[n-1];console.log('=== '+n+'  Q: '+v.raw);if(A[n])console.log('   IA: '+A[n].o);if(B[n])console.log('   T : '+B[n].o);
 // footnotes whose markers are in this verse
 const ms=[...v.raw.matchAll(/\(([٠-٩]+)\)/g)].map(m=>m[1]);for(const k of ms){const i=v.notes.findIndex(x=>x.startsWith('('+k+')'));if(i>=0){let t=v.notes[i];for(let j=i+1;j<v.notes.length&&!/^\([٠-٩]+\)/.test(v.notes[j]);j++)t+=' ⏎ '+v.notes[j];console.log('   fn'+k+': '+t.slice(0,+(process.env.L||420)))}}}
