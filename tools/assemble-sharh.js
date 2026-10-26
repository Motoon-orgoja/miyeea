// Builds riyad91-sharh.js: verbatim passages from classical commentaries, fetched from shamela.ws and quran.com
const https=require('https'),fs=require('fs');
const get=u=>new Promise((ok,no)=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{const b=[];r.on('data',c=>b.push(c));r.on('end',()=>ok(Buffer.concat(b).toString('utf8')))}).on('error',no));
async function page(book,p){
  const d=await get(`https://shamela.ws/book/${book}/${p}`);
  const title=(d.match(/<title>([^<]*)/)||[])[1]||'';
  const ref=(title.match(/^(ج[^-]*- ص\d+)/)||[])[1]||'';
  let t=d.slice(d.indexOf('class="nass')).replace(/^[^>]*>/,'').split('تحميل الصفحة التالية')[0];
  t=t.replace(/<br\s*\/?>/g,'\n').replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/[ \t]+/g,' ');
  return {p,ref:ref.trim(),text:t.split('\n').map(l=>l.trim()).filter(Boolean).join('\n')};
}
async function pages(book,from,to){const o=[];for(let p=from;p<=to;p++)o.push(await page(book,p));return o}
const strip=s=>s.replace(/[\u064B-\u0652]/g,'');
// slice joined pages between two markers (diacritics ignored); returns text and the pages it spans
function cut(pgs,startMark,endMark){
  let joined='',map=[];for(const g of pgs){map.push([joined.length,g]);joined+=g.text+' '}
  const plain=strip(joined);const idx=[];for(let i=0;i<joined.length;i++)if(!/[\u064B-\u0652]/.test(joined[i]))idx.push(i);
  const find=(m,from)=>{const k=plain.indexOf(strip(m),from);return k<0?-1:k};
  const a=find(startMark,0);if(a<0)throw 'start not found: '+startMark;
  const b=endMark?find(endMark,a+1):-1;
  const A=idx[a],B=b<0?joined.length:idx[b];
  const span=map.filter(([o],i)=>o<B&&(i+1>=map.length||map[i+1][0]>A)).map(([,g])=>g);
  return {text:joined.slice(A,B).trim(),span};
}
const FIX=[[/رسولالله/g,'رسول الله'],[/(محمد|العرباض|عمرو|عليّ|علي|خالد)بن /g,'$1 بن '],[/\(رضي الله عنه قال: بيننا\)/g,'(رضي الله عنه قال: بينا)'],[/وإن كان في ذكل/g,'وإن كان في ذكر'],[/\(أوشك كما قال/g,'(أو كما قال'],[/\(وذرقت\)/g,'(وذرفت)'],[/بتقوى ا\)/g,'بتقوى الله)'],[/\n\(\n/g,'\n('],[/^[١٢٣٤](٦٩٩|٧٠[٠-٢]) - /,'$1 - ']];
const clean=s=>FIX.reduce((t,[a,b])=>t.replace(a,b),s).replace(/\n+/g,'\n\n');
const refOf=(span)=>{const r=span.map(g=>g.ref).filter(Boolean);return r.length?(r[0]===r[r.length-1]?r[0]:r[0]+' إلى '+r[r.length-1].replace(/^ج[^-]*- /,'')):''};
// shamela drops the salawat glyph in Dalil al-Falihin's text; put ﷺ back after the Prophet's name (not after a vocative)
const salla=t=>t.replace(/(?<!يا )(رسول الله|النبيّ|النبي)(?=[ )])(?! ?ﷺ)/g,'$1 ﷺ');
const sec=(name,book,c)=>({src:name,ref:refOf(c.span),url:`https://shamela.ws/book/${book}/${c.span[0].p}`,text:book===140?salla(clean(c.text)):clean(c.text)});
(async()=>{
  const D=await pages(140,1245,1251), DI=await pages(140,392,396);
  const N1=await pages(1711,963,966), N2=await pages(1711,1334,1335);
  const F=await pages(1673,648,650);
  const DAL='دليل الفالحين لطرق رياض الصالحين، لابن علّان الصدّيقي (ت ١٠٥٧هـ)';
  const NAW='المنهاج شرح صحيح مسلم بن الحجاج، للنووي (ت ٦٧٦هـ)';
  const FAT='فتح الباري شرح صحيح البخاري، لابن حجر العسقلاني (ت ٨٥٢هـ)';
  const tafsir=async(id)=>{const j=JSON.parse(await get(`https://api.quran.com/api/v4/tafsirs/${id}/by_ayah/16:125`)).tafsir;return j.text.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replace(/ ([،؛:.)\]])/g,'$1').trim()};
  const S={
    a1:{title:'شرح الآية ومقدمة الباب',secs:[
      sec(DAL,140,cut(D,'٩١ - باب الوعظ','١٦٩٩ -')),
      {src:'تفسير القرآن العظيم، لابن كثير (ت ٧٧٤هـ)',ref:'سورة النحل، الآية ١٢٥',url:'https://quran.com/ar/16:125/tafsirs/ar-tafsir-ibn-kathir',text:await tafsir(14)},
      {src:'الجامع لأحكام القرآن، للقرطبي (ت ٦٧١هـ): متى نزلت الآية',ref:'سورة النحل، الآية ١٢٥',url:'https://quran.com/ar/16:125/tafsirs/ar-tafsir-al-qurtubi',text:await tafsir(90)},
      {src:'معالم التنزيل، للبغوي (ت ٥١٦هـ)',ref:'سورة النحل، الآية ١٢٥',url:'https://quran.com/ar/16:125/tafsirs/ar-tafsir-al-baghawi',text:await tafsir(94)}],
      note:'سبب النزول: لم أقف في كتب أسباب النزول على سبب خاص لهذه الآية. وما ذكره القرطبي أعلاه عن وقت نزولها (بمكة، وقت الأمر بمهادنة قريش) هو المنقول هنا.'},
    '699':{title:'شرح الحديث ٦٩٩',secs:[
      sec(DAL,140,cut(D,'١٦٩٩ -','٢٧٠٠ -')),
      sec(FAT+': باب ما كان النبي ﷺ يتخوّلهم بالموعظة',1673,cut(F,'قَوْلُهُ: (بَابُ مَا كَانَ','قَوْلُهُ: (سُفْيَانُ)')),
      sec(FAT+' (تتمة)',1673,cut(F,'قَوْلُهُ: (كَانَ يَتَخَوَّلُنَا)','٦٩ - حَدَّثَنَا')),
      sec(FAT+': باب من جعل لأهل العلم يومًا معلومًا',1673,cut(F,'بَابُ مَنْ جَعَلَ لِأَهْلِ','قَوْلُهُ: (جَرِيرٌ)')),
      sec(FAT+' (تتمة)',1673,cut(F,'قَوْلُهُ: (فَقَالَ لَهُ رَجُلٌ)','وَالْإِسْنَادُ كُلُّهُ'))]},
    '700':{title:'شرح الحديث ٧٠٠',secs:[
      sec(DAL,140,cut(D,'٢٧٠٠ -','٣٧٠١ -')),
      sec(NAW+': كتاب الجمعة',1711,cut(N2,'قَوْلُهُ لَوْ كُنْتُ تَنَفَّسْتُ','قَوْلُهُ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَإِنَّ مِنَ الْبَيَانِ'))]},
    '701c':{title:'شرح الحديث ٧٠١ (المقاطع الثلاثة)',secs:[
      sec(DAL,140,cut(D,'٣٧٠١ -','٤٧٠٢ -')),
      sec(NAW+': باب تحريم الكلام في الصلاة',1711,cut(N1,'قَوْلُهُ وَاثُكْلَ','قَوْلُهُ وَكَانَتْ لِي جَارِيَةٌ'))]},
    '702':{title:'شرح الحديث ٧٠٢',secs:[
      sec(DAL,140,cut(D,'٤٧٠٢ -','٩٢ - باب')),
      sec(DAL+': شرح الحديث كاملًا في باب الأمر بالمحافظة على السنة',140,cut(DI,'١٥٧ -','١٥٨ -'))]}
  };
  fs.writeFileSync(process.argv[2],'// Verbatim commentary for Riyad as-Salihin ch.91, generated by assemble.js from shamela.ws and quran.com\nwindow.SHARH='+JSON.stringify(S,null,1)+';\n');
  for(const[k,v]of Object.entries(S))console.log(k,v.secs.map(s=>s.ref+' '+s.text.length).join(' | '));
})().catch(e=>{console.error('ERR',e);process.exit(1)});
