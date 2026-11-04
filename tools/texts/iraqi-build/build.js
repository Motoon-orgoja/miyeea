// builds tools/texts/iraqi.txt from the parsed Qasim edition (shamela 354)
const clean=require('./clean'),fs=require('fs'),path=require('path');const {V,H}=require('./p354.json');
const c=s=>clean(s).replace(/(^|\s)-(\s|$)/g,' ').replace(/\s+/g,' ').trim();
// haraka completions (letters the base left bare; each certain, see iraqi-sources.md)
const FIX={32:[['أنْ','أَنْ']],51:[['التِّرمِذِيُّ','التِّرْمِذِيُّ']],107:[['إنْ','إِنْ']],216:[['بإِسْنَادٍ','بِإِسْنَادٍ']],
 324:[['وَأنَّهُ','وَأَنَّهُ']],345:[['بِمُنكَرِ','بِمُنْكَرِ']],446:[['لَبَطلَتْ','لَبَطَلَتْ']],542:[['جُرَيجٍ','جُرَيْجٍ']],
 598:[['وَإِن ','وَإِنْ ']],608:[['وَانطِقَنْ','وَانْطِقَنْ']],650:[['إذَا','إِذَا']],989:[['إذْ','إِذْ']]};
// readings of most MSS / common prints adopted over the Qasim text (decision 2026-11-04, see iraqi-sources.md)
const COMMON={334:'صُوَيْلِحٌ صَدُوقٌ انْ شَاءَ اللَّهْ | أَرْجُو بِأَنْ لَيْسَ بِهِ بَأْسٌ عَرَاهْ',992:'وَلِلرُّوَاةِ طَبَقَاتٌ تُعْرَفُ | بِالسِّنِّ وَالْأَخْذِ وَكَمْ مُصَنِّفُ'};
const WORD={273:[['إِذِ','إِذَا']]};
const heads={};for(const h of H)heads[h.n]=h.t.join(' ').replace(/\s*\([٠-٩]+\)/g,'').replace(/[\[\]«»]/g,'').replace(/\s+/g,' ').trim();
heads[1]='مُقَدِّمَةٌ';
const out=[];let applied=0;
for(const v of V){if(heads[v.n])out.push('## '+heads[v.n]);let line=c(v.a)+' | '+c(v.b);
 for(const [a,b] of FIX[v.n]||[]){const A=a.trim().normalize('NFD');let hit=0;line=line.split(' ').map(w=>(!hit&&w.normalize('NFD')===A)?(hit=1,b.trim()):w).join(' ');if(!hit)throw new Error('fix not found '+v.n+' '+a);applied++}
 if(/[^ء-يً-ْٰ |]/.test(line))throw new Error('stray char '+v.n+': '+line);
 for(const [a,b] of WORD[v.n]||[]){const A=a.normalize('NFD');let hit=0;line=line.split(' ').map(w=>(!hit&&w.normalize('NFD')===A)?(hit=1,b):w).join(' ');if(!hit)throw new Error('word not found '+v.n);applied++}
 if(COMMON[v.n]){line=COMMON[v.n];applied++}
 out.push(line);}
fs.writeFileSync(path.join(__dirname,'..','iraqi.txt'),out.join('\n')+'\n','utf8');
console.log('verses',V.length,'headings',Object.keys(heads).length,'fixes',applied);
