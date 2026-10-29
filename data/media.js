// Recitations and explanations for each text, streamed from where they are published (archive.org, YouTube); nothing is
// copied into the site. Every archive.org address below was checked against the item's file list. «verse» gives one
// file per verse (for listen-and-repeat), «series» a numbered set of lessons. Rights: see each item's page.
(function(){
const IA='https://archive.org/download/';
const f=(item,file)=>IA+item+'/'+encodeURIComponent(file);
const pad=(n,w)=>String(n).padStart(w,'0');
const series=(item,pat,from,to,w)=>({item,list:Array.from({length:to-from+1},(_,k)=>f(item,pat.replace('{n}',pad(from+k,w||2))))});
window.MEDIA={
  miyeea:{
    verse:i=>i>=1&&i<=100?f('orjoza-meeya','OrjozaMeeya-'+i+'.mp3'):null, verseBy:'مشروع حفّاظ السنة',
    recite:[
      {t:'المتن كامل (قراءة متقنة)',by:'ضمن شرح الشيخ عبد الرزاق البدر',url:f('Sharh_Urjuzah_al-Me3yah','00.mp3')},
      {t:'المتن كامل',by:'أداء صالح مامان',url:f('abd_396','الأرجوزة المـيـئيـة فـي ذكر حال أشرف البرية  أداء صالح.mp3')},
      {t:'المتن كامل',by:'مشروع حفّاظ السنة',url:f('orjoza-meeya','OrjozaMeeya.mp3')},
    ],
    sharh:[
      {t:'شرح الأرجوزة الميئية',by:'الشيخ عبد الرزاق البدر',...series('Sharh_Urjuzah_al-Me3yah','{n}.mp3',1,5)},
      {t:'شرح الأرجوزة الميئية',by:'الشيخ محمد بن خدة',...series('Arjouza','{n}_arjouza.mp3',1,26)},
      {t:'شرح الأرجوزة الميئية',by:'الشيخ عبد الغني يخلف',...series('Cheikh-Yekhlef__Alorjozah-al-miiyyah','Yekhlef__Alorjozah-al-miiyyah__{n}.mp3',1,58)},
      {t:'شرح الشيخ عبد الرزاق البدر (فيديو)',by:'يوتيوب',yt:'https://www.youtube.com/playlist?list=PLUtxhBXriVhPrT4GLNVmhQtgdb-QET2yg'},
    ]},
  munajat:{
    poems:{
      suhayli:{recite:[{t:'يا من يرى ما في الضمير ويسمع',by:'إنشاد (اسمعه قبل الاعتماد عليه)',url:f('NADERA','يا من يرى ما في الضمير.mp3')}]},
      shafii:{recite:[{t:'قلبي برحمتك اللهم ذو أنس',by:'إنشاد (اسمعه قبل الاعتماد عليه)',url:f('NADERA','قلبي برحمتك اللهم ذو انس.mp3')}]},
      munfarija:{recite:[{t:'المنفرجة',by:'أداء زكرياء الإدريسي',url:f('Forumbou_gmail_20190224','المنفرجة - أداء زكرياء الإدريسي.mp3')},{t:'القصيدة المنفرجة',by:'قراءة',url:f('saidarab8_yahoo','القصيدة المنفرجة.mp3')}],
        sharh:[{t:'شرح المنفرجة',by:'الشيخ عمار بن طوق المري (فيديو)',yt:'https://www.youtube.com/watch?v=a-gD_A5vJ74'},{t:'شرح المنفرجة',by:'الشيخ يسري جبر (فيديو)',yt:'https://www.youtube.com/watch?v=o82KlSd543I'},{t:'شرح المنفرجة',by:'الشيخ محمد الروكي (فيديو)',yt:'https://www.youtube.com/watch?v=2Tty2kynNOA'}]},
      abunuwas:{recite:[{t:'يا رب إن عظمت ذنوبي كثرة',by:'محمد أمين الترمذي',url:f('demmouche_20150226_2025','يا رب إن عظمت ذنوبي كثرة .mp3')}]},
      mimiyya:{recite:[{t:'الميمية كاملة',by:'سعيد شعلان',url:f('MimiaofIbnQayyim','mimia.mp3')}],
        sharh:[{t:'شرح الميمية',by:'الشيخ محمد بن صالح العثيمين',...series('Sharh_almimiah','{n}a.mp3',1,4,1)}]},
    }},
  shatibiyya:{
    // the site's 78 sections follow the reciter's files 02–78 in order (01 is his introduction)
    sec:k=>f('sh-ayman-sowaid-matn-ashshatebiih',pad(Math.min(k+2,78),2)+'.mp3'), secBy:'الشيخ أيمن رشدي سويد',
    recite:[
      {t:'المتن كامل',by:'الشيخ أيمن رشدي سويد',url:f('sh-ayman-sowaid-matn-ashshatebiih','00.mp3')},
      {t:'المتن بابًا بابًا',by:'الشيخ أيمن رشدي سويد',...series('sh-ayman-sowaid-matn-ashshatebiih','{n}.mp3',1,78)},
      {t:'المتن بابًا بابًا',by:'الشيخ مشاري العفاسي',...series('Chatibia_uP_bY_mUSLEm','{n}_uP_bY_mUSLEm.mp3',1,78)},
    ],
    sharh:[
      {t:'شرح الشاطبية',by:'الشيخ عبد الباسط هاشم',...series('SHATBIAH','{n}.mp3',1,63,3)},
      {t:'شرح الشاطبية',by:'الشيخ سيد لاشين أبو الفرح',...series('Shattebia_Lachine_uP_bY_mUSLEm','{n}_uP_bY_mUSLEm.mp3',1,40,3)},
      {t:'شرح الشاطبية (فيديو)',by:'الشيخ محمد عصام القضاة',yt:'https://www.youtube.com/playlist?list=PLlX1sKIV4qu8GILcKhyRyRvs2_N-H-ICv'},
    ]},
  jazariyya:{
    // the site's 17 sections against the reciter's 18 files (his «التفخيم والترقيق» also covers «استعمال الحروف»)
    sec:k=>f('sh-ayman-sowaid-matn-aljazareiiah',pad([2,3,4,5,6,6,7,8,9,10,12,13,14,15,16,17,18][k]||2,2)+'.mp3'), secBy:'الشيخ أيمن رشدي سويد',
    recite:[
      {t:'المتن كامل',by:'الشيخ أيمن رشدي سويد',url:f('sh-ayman-sowaid-matn-aljazareiiah','00.mp3')},
      {t:'المتن بابًا بابًا',by:'الشيخ أيمن رشدي سويد',...series('sh-ayman-sowaid-matn-aljazareiiah','{n}.mp3',1,18),
        names:['المقدمة','مقدمة المنظومة','باب مخارج الحروف','باب الصفات','باب التجويد','باب التفخيم والترقيق','باب الراءات','باب اللامات','باب الضاد والظاء','باب التحذيرات','باب الميم والنون المشددتين','باب حكم التنوين والنون الساكنة','باب المد والقصر','باب معرفة الوقوف','باب المقطوع والموصول','باب التاءات','باب همز الوصل','الخاتمة']},
      {t:'المتن كامل',by:'الشيخ سعد الغامدي',url:f('20230819_20230819_1347','001  1  متن الجزرية بصوت الشيخ سعد الغامدي.mp3')},
    ],
    sharh:[
      {t:'شرح الجزرية',by:'الشيخ وليد المنيسي',...series('minisi-jazariah','{n}.mp3',1,11)},
      {t:'الإتقان لتلاوة القرآن (فيديو)',by:'الشيخ أيمن سويد',yt:'https://www.youtube.com/playlist?list=PL5CF688ECD20085C4'},
    ]},
  riyad:{
    chap:{riyad91:f('Riad_Alsalheen__AlDuraihim','091.mp3')}, chapBy:'حمد الدريهم',
    recite:[
      {t:'باب الوعظ والاقتصاد فيه',by:'حمد الدريهم',url:f('Riad_Alsalheen__AlDuraihim','091.mp3')},
      {t:'باب الوعظ والاقتصاد فيه',by:'قراءة',url:f('Riyad-Saliheen_Book-audio-mp3','0091.mp3')},
    ],
    sharh:[
      {t:'شرح باب الوعظ والاقتصاد فيه',by:'الشيخ عبد الرزاق البدر',url:f('Sharh_Riyad_as-Salihin_al-Badr','155.mp3')},
      {t:'شرح رياض الصالحين (يبدأ الباب في هذا الشريط)',by:'الشيخ محمد بن صالح العثيمين',url:f('Riyad_As-Salihin_al-othaymeen','50b.mp3')},
      {t:'شرح الباب (فيديو)',by:'الشيخ محمد بن صالح العثيمين',yt:'https://www.youtube.com/watch?v=vkq5NiNygrE'},
    ]},
  tuhfa:{
    verse:i=>i>=1&&i<=61?f('tuhfatul_athfal',pad(i,2)+'.mp3'):null, verseBy:'الشيخ عبد القادر العثمان',
    recite:[
      {t:'المتن كامل',by:'الشيخ أيمن رشدي سويد',url:f('qurani-tohfat-alatfal','tohfa_ayman_swaid.mp3')},
      {t:'المتن كامل',by:'الشيخ سعد الغامدي',url:f('qurani-tohfat-alatfal','tohfa_saad_al_ghamdi.mp3')},
      {t:'المتن كامل',by:'إشهاد',url:f('pziulcmk_c1oramn','تحفة الأطفال والغلمان.mp3')},
    ],
    sharh:[
      {t:'شرح تحفة الأطفال (المقدمة)',by:'الشيخ محمد غندر',url:f('shar7-to7ft-ala6fal','001-moqadema.mp3')},
      {t:'شرح تحفة الأطفال',by:'الشيخ عبد المحسن العباد البدر',list:[1,2,3].map(n=>f('islami-538','شرح تحفة الاطفال  للشيخ عبد المحسن البدر -'+n+'.mp3'))},
    ]},
  zubad:{
    recite:[
      {t:'المتن كامل (تسجيل واحد، نحو ساعتين)',by:'قارئ غير مسمّى',url:f('golden_crown81_yahoo','صفوة الزبد في الفقه الشافعي.mp3')},
      {t:'المتن كامل (٤ أجزاء)',by:'قارئ غير مسمّى',list:[1,2,3,4].map(n=>f('golden_crown81_yahoo','zubad'+n+'.mp3'))},
    ],
    sharh:[
      {t:'فتح الصمد شرح صفوة الزبد',by:'الشيخ أحمد بن علي المقرمي',...series('Maqrami-zubad','{n}.mp3',1,16)},
      {t:'شرح نظم الزبد',by:'الشيخ عبد الله القادري',...series('Zubad_Qadiry','{n}.mp3',1,61)},
    ]},
  bayquniyya:{
    verse:i=>i>=1&&i<=34?f('albayqoneyyah','Albayqoneyyah/albayqoneyyah-'+i+'.mp3'):null, verseBy:'مشروع حفّاظ السنة',
    recite:[{t:'المتن كامل',by:'مشروع حفّاظ السنة',url:f('bayqoneyyah','bayqoneyyah-q2/bayqoneyyah.mp3')},{t:'المتن كامل',by:'أبو أحمد الشيظمي',url:f('shaydzmi1','baykouniah.mp3')}],
    sharh:[{t:'شرح البيقونية',by:'الشيخ محمد بن صالح العثيمين',list:['01A','01B','02A','02B','03A','03B','04A','04B','05A','05B','06A','06B','07A','07B'].map(x=>f('Sharh_Bayqoniyah','Bayqoniyah_'+x+'.mp3'))}]},
  nawawi:{
    chapN:k=>f('40nawawiyat','40Nawawiyat'+k+'.mp3'), chapBy:'قراءة',
    recite:[{t:'الأحاديث حديثًا حديثًا',by:'قراءة',...series('40nawawiyat','40Nawawiyat{n}.mp3',1,42,1)}],
    sharh:[
      {t:'شرح الأربعين النووية',by:'الشيخ عبد الرزاق البدر',...series('badr-sharh-al-arbain-al-nawawiyyah','{n}.mp3',1,36)},
      {t:'شرح الأربعين النووية',by:'الشيخ محمد بن صالح العثيمين',...series('Char7-40.Nawawia-Othaimin-Up-By-MusleM','{n}.mp3',1,19)},
      {t:'شرح الأربعين النووية',by:'الشيخ صالح آل الشيخ',...series('001_20210828_20210828','{n}.mp3',1,12,3)},
    ]},
  ajurrumiyya:{
    recite:[{t:'المتن كامل',by:'ياسر سرحان الديب',url:f('agromiya','agromiya.mp3')},{t:'المتن كامل',by:'قراءة',url:f('AlAjrumiyyah','Al-Ajrumiyyah.mp3')}],
    sharh:[
      {t:'شرح الآجرومية',by:'الشيخ محمد بن صالح العثيمين',...series('alajuroumia_ibn_otheimeen','{n}.mp3',1,16)},
      {t:'شرح الآجرومية',by:'الشيخ سليمان العيوني',...series('dawrat_matn_ajromiya','{n}.mp3',1,6)},
      {t:'شرح الآجرومية',by:'الشيخ عبد الكريم الخضير',...series('Sharh_Al-Ajromiah','Al-Ajromiah_{n}.mp3',1,8)},
    ]},
  qudouri:{
    recite:[
      {t:'المتن كامل (حوالي ٦ ساعات)',by:'قراءة',url:f('23997','كتاب_مختصر_القدوري_المعروف_بالكتاب_في_الفقه_الحنفي_كاملا 23997.mp3')},
      {t:'قراءة متن الكتاب',by:'على أجزاء',...series('jnnatalfirdos_gmail_01_201601','{n}.mp3',1,7)},
    ],
    sharh:[
      {t:'شرح مختصر القدوري',by:'الشيخ خالد المشيقح',...series('Qudori-sharh','{n}.mp3',1,45,3)},
      {t:'شرح مختصر القدوري (فيديو)',by:'الشيخ صلاح أبو الحاج',yt:'https://www.youtube.com/playlist?list=PLH77aiq9U4WNFIPGBC8B-Yt1FtB7oUmjs'},
    ]},
};
})();
