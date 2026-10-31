// checks every ﴿…﴾ [سورة: آية] quote in the transcription against the Uthmani text from api.quran.com (letters only)
// usage: node quran.js <pages dir>   (caches the mushaf in quran-cache.json)
const fs=require('fs'),path=require('path');
const dir=process.argv[2];
const SURAS='الفاتحة البقرة آل_عمران النساء المائدة الأنعام الأعراف الأنفال التوبة يونس هود يوسف الرعد إبراهيم الحجر النحل الإسراء الكهف مريم طه الأنبياء الحج المؤمنون النور الفرقان الشعراء النمل القصص العنكبوت الروم لقمان السجدة الأحزاب سبأ فاطر يس الصافات ص الزمر غافر فصلت الشورى الزخرف الدخان الجاثية الأحقاف محمد الفتح الحجرات ق الذاريات الطور النجم القمر الرحمن الواقعة الحديد المجادلة الحشر الممتحنة الصف الجمعة المنافقون التغابن الطلاق التحريم الملك القلم الحاقة المعارج نوح الجن المزمل المدثر القيامة الإنسان المرسلات النبأ النازعات عبس التكوير الانفطار المطففين الانشقاق البروج الطارق الأعلى الغاشية الفجر البلد الشمس الليل الضحى الشرح التين العلق القدر البينة الزلزلة العاديات التكاثر العصر الهمزة الفيل قريش الماعون الكوثر الكافرون النصر المسد الإخلاص الفلق الناس'.split(' ').map(s=>s.replace('_',' '));
const norm=s=>s.normalize('NFC').replace(/[ٱأإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^ء-ي]/g,'').replace(/[ءـ]/g,'').replace(/ا/g,'').replace(/ي/g,'').replace(/و/g,'');
const sNorm=s=>s.replace(/^(سورة\s+)/,'').replace(/[ًٌٍَُِّْ]/g,'').trim();
(async()=>{
  const cf=path.join(__dirname,'quran-cache.json'); let Q={};
  if(fs.existsSync(cf))Q=JSON.parse(fs.readFileSync(cf,'utf8'));
  else{for(let c=1;c<=114;c++){const j=await (await fetch('https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number='+c)).json();Q[c]=j.verses.map(v=>v.text_uthmani)}fs.writeFileSync(cf,JSON.stringify(Q))}
  let ok=0;const bad=[];
  for(const f of fs.readdirSync(dir).filter(f=>/^p\d{3}\.md$/.test(f)).sort()){
    const s=fs.readFileSync(path.join(dir,f),'utf8');
    for(const m of s.matchAll(/﴿([^﴾]+)﴾\s*\[([^\]:]+):\s*([٠-٩0-9]+)(?:\s*[-–،,]\s*([٠-٩0-9]+))?\]/g)){
      const name=sNorm(m[2]),c=SURAS.findIndex(x=>sNorm(x)===name||sNorm(x).replace(/^ال/,'')===name.replace(/^ال/,''))+1;
      const n=x=>+String(x).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      if(!c){bad.push(`${f} unknown sura «${m[2]}»`);continue}
      const a=n(m[3]),b=m[4]?n(m[4]):a, txt=norm((Q[c]||[]).slice(Math.max(0,a-2),b+1).join(' ')), q=norm(m[1]);
      if(txt.includes(q))ok++;else bad.push(`${f} [${m[2]}: ${m[3]}${m[4]?'-'+m[4]:''}] ${m[1].slice(0,80)}`);
    }
    // verses without a reference right after them
    for(const m of s.matchAll(/﴿([^﴾]+)﴾(?!\s*\[)/g))bad.push(`${f} (no ref) ${m[1].slice(0,60)}`);
  }
  console.log('verses ok',ok,'to check',bad.length);console.log(bad.join('\n'));
})();
