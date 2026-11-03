const fs=require('fs');const lines=fs.readFileSync('final.txt','utf8').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
const ch=[];for(const l of lines){if(l.startsWith('## '))ch.push({title:l.slice(3).trim(),paras:[]});else ch[ch.length-1].paras.push(l.replace(/\s+/g,' '));}
const J={source:"https://shamela.ws/book/2135 (تعجيل الندى بشرح قطر الندى، عبد الله بن صالح الفوزان — the matn as quoted, vocalized, in the sharh; quotes extracted by script and joined in order)",
check:"https://shamela.ws/book/11376 (متن قطر الندى، دار الصميعي 1420هـ، partly vocalized; = ketabonline book 880) + https://shamela.ws/book/6970 (شرح قطر الندى لابن هشام، تحقيق محمد محيي الدين عبد الحميد، ط11 1383هـ، the ص segments) — word-by-word collation by script; see qatr-sources.md",
notes:"Chapter titles are applied (the matn has only «باب/فصل» markers, and many sections have none); the words «باب»/«فصل» at the start of a section are carried by the title, not repeated in the paragraph. Hemistichs of a full verse are joined with « * ».",
basmala:"بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",chapters:ch};
fs.writeFileSync('C:/Users/Mahmoud/Downloads/miyeea/tools/texts/qatr.json',JSON.stringify(J,null,1)+'\n');
let n=0,bad=[];ch.forEach(c=>c.paras.forEach(p=>{n++;const k=p.split(' ').length;if(k<8||k>45)bad.push(k+': '+p.slice(0,60))}));
console.log('chapters',ch.length,'paras',n,'words',ch.reduce((a,c)=>a+c.paras.join(' ').split(' ').length,0));console.log(bad.join('\n'));
