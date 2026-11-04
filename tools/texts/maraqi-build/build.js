// Final assembly: h2.txt (wording fixed, marks from N then ko) -> mark fixes -> extra headings -> ../maraqi.txt
const fs=require('fs');
const norm=s=>s.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^ء-ي]/g,'');
// [verse, from, to, reason]
const MARKFIX=[
 [86,'والرُّخصَّةِ','والرُّخصةُ','N «والرُّخصَّةِ» خطأ طباعي (شدة على الصاد وكسرة)، والكلمة مبتدأ'],
 [151,'جَرْىٍ','جَرْيٍ','الياء المنونة تكتب ياء (N «جَرْيٍ»؛ الأساس «جرى»)'],
 [367,'خُصِّصِِ','خُصِّصِ','كسرتان مكررتان (من نسخة ketabonline)؛ الكسرة للتخلص من الساكنين قبل «التزامًا»'],
 [136,'تَجَلَّي','تَجَلَّى','الأساس «تجلَّي» بالياء؛ N وB «تجلّى» بالألف المقصورة'],
 [371,'وما أتي','وما أتى','رسم الألف المقصورة (B «أتى»؛ N «أتي»)'],
 [471,'الِخِفُّ','الخِفُّ','كسرة على لام التعريف خطأ طباعي في N'],
 [580,'تْعديلُهم','تعديلُهم','سكون على أول الكلمة خطأ طباعي في N'],
 [821,'الُمُدْرَك','المُدْرَك','ضمة على لام التعريف خطأ طباعي في N'],
 [856,'الُمُدرَكَ','المُدرَكَ','ضمة على لام التعريف خطأ طباعي في N'],
 [996,'الَّلامعا','اللَّامعا','الشدة على اللام الثانية لا على لام التعريف'],
 [563,'وِمَنْ','وَمَنْ','كسرة على واو العطف خطأ طباعي'],
 [563,'مَنْمًىً','مَنْمًى','تنوين مكرر على الألف المقصورة'],
 [134,'مَعْنًىً','مَعْنًى','تنوين مكرر على الألف المقصورة'],
];
// headings missing from the base (after «مسالك العلة»), from نشر البنود; each placed before the verse that opens with the given words
const HEADS=[
 ['منها وجود الوصف دون الحكم','القوادح'],
 ['وهو مفروض إذا لم يكن','خاتمة'],
 ['ما ليس بالنص من الدليل','كتاب الاستدلال'],
 ['ولا يجي تعارض إلا لما','كتاب التعادل والتراجيح'],
 ['قد جاء في المرجحات بالسند','الترجيح باعتبار حال الراوي'],
 ['وناقل ومثبت والآمر','الترجيح باعتبار حال المدلول'],
 ['رجح على النص الذي قد أجمعا','ترجيح الإجماعات'],
 ['بقوة المثبت ذا الأساس','ترجيح الأقيسة والحدود'],
 ['بذل الفقيه الوسع أن يحصلا','كتاب الاجتهاد في الفروع'],
 ['هو التزام مذهب الغير بلا','فصل في التقليد في الفروع'],
 ['أنهيت ما جمعه اجتهادي','خاتمة'],
];
const AFTER=[['وكونه أودع في الصحيح','الترجيح باعتبار حال المروي']]; // heading goes after this verse
// heading text cleanup: drop the commentator's explanatory parenthesis and the colon
const HEADFIX={'## النهي (أي النفسي عندهم)':'## النهي','## الركن الثاني: وهو الحكم':'## الركن الثاني وهو الحكم'};
let vn=0;const out=[];const used=new Set();
for(const l of fs.readFileSync('h2.txt','utf8').split('\n')){
  if(!l.trim())continue;
  if(l.startsWith('##')){out.push(HEADFIX[l]||l);continue;}
  vn++;let r=l;
  for(const [v,a,b] of MARKFIX)if(v===vn){if(!r.includes(a))throw new Error('markfix '+v);r=r.replace(a,b);}
  // tanween written twice (on the letter from N and on the alif from ko): keep the one on the letter
  r=r.replace(/ًاً/g,'ًا');
  // orthography: alif maqsura after a kasra is a yaa (المجلِّى -> المجلِّي)
  r=r.split(' ').map(w=>w.replace(/(ِ[ًٌٍَُِّْ]*)ى/g,'$1ي')).join(' ');
  for(const [w,h] of HEADS)if(norm(r).startsWith(norm(w))){out.push('## '+h);used.add(w);}
  out.push(r);
  for(const [w,h] of AFTER)if(norm(r).startsWith(norm(w))){out.push('## '+h);used.add(w);}
}
for(const [w] of HEADS.concat(AFTER))if(!used.has(w))throw new Error('heading anchor not found: '+w);
fs.writeFileSync('../maraqi.txt',out.join('\n')+'\n');
console.log('verses',vn,'headings',out.filter(l=>l.startsWith('##')).length);
