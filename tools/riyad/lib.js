// Shared helpers for the Riyad as-Salihin build
const HAR=/[ً-ْٰ]/g; // tanwin, short vowels, shadda, sukun, dagger alif
const strip=s=>s.replace(HAR,'').replace(/ـ/g,'');
// consonantal skeleton for collation: no diacritics, folded alif/hamza/ya/ta-marbuta, no punctuation
const fold=s=>strip(s).replace(/[ﷺ]/g,' صلى الله عليه وسلم ').replace(/[أإآٱ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^ء-ي\s]/g,' ').replace(/\s+/g,' ').trim();
const AR='٠١٢٣٤٥٦٧٨٩';const ar=n=>String(n).replace(/\d/g,d=>AR[d]);
const words=s=>s.trim().split(/\s+/).filter(Boolean);
// Fahl/Word text → display text: «» for the Prophet's words, tight punctuation, written-out salawat like the existing chapter
function tidy(t){
  return t.replace(/[⟦⟧]/g,'').replace(/–/g,'-')
    .replace(/\(\(\s*/g,'«').replace(/\s*\)\)/g,'»')
    .replace(/ﷺ/g,'صلى الله عليه وسلم')
    .replace(/\s+([،؛:.!؟,)\]»﴾])/g,'$1').replace(/([(\[«﴿])\s+/g,'$1')
    .replace(/([،؛:!؟])(?=[^\s.،؛:!؟»)\]﴾"])/g,'$1 ')
    .replace(/\s+/g,' ').trim();
}
// orthographic normalisation to the style of the hand-checked chapter 91 (applied before and after vocalization)
function ortho(t){
  return t
    .replace(/ًاً/g,'ًا')
    .replace(/([ء-ي])َ?ا(?:َّ|َّ|ّ)/g,'$1َّا') // «إلاَّ» → «إلَّا»: the shadda is the lam's
    .replace(/ّ?َ?اَ?َّ?/g,m=>m) // placeholder
    .replace(/([ء-ي])َّا[َّ]+/g,'$1َّا')   // «إلَّاَّ» → «إلَّا»
    .replace(/َ?اً(?=$|[\s.،؛:!؟»)\]"])/g,'ًا')                     // «خَيْرَاً» → «خَيْرًا» as in chapter 91
    .replace(/ِيْ/g,'ِي').replace(/ُوْ/g,'ُو') // no sukun on a long vowel
    .replace(/ًىٰ/g,'ًى')                                            // «غِنًىٰ» → «غِنًى»
    .replace(/([ء-ي])َاَ/g,'$1َا')      // fatha written again on the alif after a fatha: «صَلاَة» → «صَلَاة»
    .replace(/([ء-ي]ّ?)اَ/g,'$1َا')             // «لاَ» → «لَا»: the fatha belongs to the letter before the alif
    .replace(/(رّ?َ?حْ?م)َ?ا(ن)/g,'$1َ$2')            // الرحمان → الرحمَن
    .replace(/َى(?=$|[\s.،؛:!؟»)\]"])/g,'َىٰ')                     // final alif maqsura after fatha: عَلَىٰ
    .replace(/([ً-ْ])\1+/g,'$1')                                          // doubled haraka
    .replace(/([ً-ِْ])ّ/g,'ّ$1');                           // shadda first, then the vowel
}
module.exports={strip,fold,ar,words,tidy,HAR,ortho};
