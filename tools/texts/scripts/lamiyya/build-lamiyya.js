// Assembles tools/texts/lamiyya.txt from Shamela 344 (al-Qasim ed., «النظم مجردا», pp.30-44) parsed into lam-base.json
const fs=require('fs');const {V,S}=JSON.parse(fs.readFileSync('lam-base.json','utf8'));
const P='[\u064B-\u0652]*';
const clean=s=>s.replace(/<div/g,'').normalize('NFC').replace(/[«»"،:؛.!?\[\]()]/g,' ').replace(/(^|\s)-(?=\s|$)/g,' ').replace(/\s+/g,' ').trim()
 // one-letter proclitic left alone by quote removal («وَ «فَاعِلٌ»», «بِـ «فَعْلَلَ»») -> join to next word
 .replace(new RegExp('(^| )([وبلكف]'+P+')ـ? (?=[^ ])','g'),'$1$2');
const out=['## مُقَدِّمَةٌ'];const log=[]; // editorial: the edition has no heading before verse 1 (Awadi's ed. labels it «مقدمة»)
V.forEach(([a,b],i)=>{const n=i+1;if(S[n]&&!/^تَمَّ/.test(S[n]))out.push('## '+clean(S[n]).replace(/\s+/g,' '));
 a=clean(a);b=clean(b);const split=/ـ$/.test(a)||/^ـ/.test(b);
 a=a.replace(/ـ/g,'');b=b.replace(/ـ/g,'');if(split){a+='ـ';log.push(n)}
 if(/[0-9٠-٩]/.test(a+b))throw 'digit '+n;out.push(a+' | '+b)});
fs.writeFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/lamiyya.txt',out.join('\n').normalize('NFC')+'\n');
console.log('verses',V.length,'split-word verses',log.join(','));
