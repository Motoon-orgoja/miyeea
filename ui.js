/* ---------- shared shell for every page ----------
   Loaded in <head> before anything else so the reader's display preferences apply before the first paint.
   Then it replaces each page's row of book links with one app bar (today · texts · settings), and provides the
   settings sheet (theme, text size, screen awake, daily reminder, one backup for every text) and small helpers
   (toast, sheet) that the engines may use through window.UI. */
(function(){
const PK='mutoon_prefs';
const DEF={lang:'ar',theme:'auto',vs:1,us:1,wake:true,remind:'20:00',fade:2,ret:0.9,paused:[],later:[],dropped:[]};
let P; try{P={...DEF,...JSON.parse(localStorage.getItem(PK)||'{}')}}catch(e){P={...DEF}}
const root=document.documentElement;
function apply(){
  if(P.theme==='auto')root.removeAttribute('data-theme'); else root.setAttribute('data-theme',P.theme);
  root.style.setProperty('--vs',P.vs); root.style.setProperty('--us',P.us);
  const m=document.querySelector('meta[name="theme-color"]'); if(m)m.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#0B7A55';
}
function save(){try{localStorage.setItem(PK,JSON.stringify(P))}catch(e){} apply(); dispatchEvent(new CustomEvent('prefs',{detail:P}))}
apply();

// every text the site teaches, in the order of the switcher
const BOOKS=[
  {key:'miyeea',c:'السيرة النبوية',lsk:'miyeea_progress_v1',url:'./',t:'الأرجوزة الميئية',d:'السيرة النبوية نظمًا · ١٠٠ بيت'},
  {key:'munajat',c:'الرقائق والأذكار',lsk:'mutoon_munajat_v1:',url:'munajat.html',t:'منظومات المناجاة',d:'٨ قصائد في الأنس بالله'},
  {key:'shatibiyya',c:'القراءات والتجويد',lsk:'mutoon_shatibiyya_v1',url:'shatibiyya.html',t:'الشاطبية',d:'حرز الأماني في القراءات السبع'},
  {key:'jazariyya',c:'القراءات والتجويد',lsk:'mutoon_jazariyya_v1',url:'jazariyya.html',t:'المقدمة الجزرية',d:'أحكام التجويد · ١٠٩ أبيات'},
  {key:'riyad',c:'الحديث',lsk:'mutoon_riyad91_v1',url:'riyad.html',t:'رياض الصالحين',d:'كامل: ٣٧٢ بابًا و١٨٩٦ حديثًا مشكولة، مع الشروح'},
  {key:'qudouri',c:'الفقه',lsk:'mutoon_qudouri_v1',url:'qudouri.html',t:'مختصر القدوري',d:'الفقه الحنفي · ١١٨ بابًا'},
  {key:'tuhfa',c:'القراءات والتجويد',lsk:'mutoon_tuhfa_v1',url:'tuhfa.html',t:'تحفة الأطفال',d:'تجويد للمبتدئين · ٦١ بيتًا'},
  {key:'bayquniyya',c:'مصطلح الحديث',lsk:'mutoon_bayquniyya_v1',url:'bayquniyya.html',t:'المنظومة البيقونية',d:'مصطلح الحديث · ٣٤ بيتًا'},
  {key:'nawawi',c:'الحديث',lsk:'mutoon_nawawi_v1',url:'nawawi.html',t:'الأربعون النووية',d:'أصول الدين في ٤٢ حديثًا'},
  {key:'ajurrumiyya',c:'النحو',lsk:'mutoon_ajurrumiyya_v1',url:'ajurrumiyya.html',t:'متن الآجرومية',d:'مبادئ النحو'},
  {key:'zubad',c:'الفقه',lsk:'mutoon_zubad_v1',url:'zubad.html',t:'صفوة الزبد',d:'الفقه الشافعي نظمًا · ١٠٨٠ بيتًا'},
  {key:'usul',c:'أصول الفقه',lsk:'mutoon_usul_v2',url:'usul.html',t:'تهذيب مسار الأصول',d:'أصول الفقه الحنفي · ٣٦١ معلومة مركزية'},
  {key:'umda',c:'الحديث',lsk:'mutoon_umda_v1',url:'umda.html',t:'عمدة الأحكام',d:'أحاديث الأحكام · ٤١٤ حديثًا'},
  {key:'rahabiyya',c:'الفرائض',lsk:'mutoon_rahabiyya_v1',url:'rahabiyya.html',t:'الرحبية',d:'علم المواريث نظمًا · ١٧٦ بيتًا'},
  {key:'durra',c:'القراءات والتجويد',lsk:'mutoon_durra_v1',url:'durra.html',t:'الدرة المضية',d:'القراءات الثلاث المتممة للعشر · ٢٤١ بيتًا'},
  {key:'alfiyya',c:'النحو',lsk:'mutoon_alfiyya_v1',url:'alfiyya.html',t:'ألفية ابن مالك',d:'النحو والصرف · ١٠٠٢ بيت'},
  {key:'sullam',c:'المنطق',lsk:'mutoon_sullam_v1',url:'sullam.html',t:'السُّلَّم المُنَوْرَق',d:'مبادئ المنطق · ١٤٤ بيتًا'},
  {key:'lamiyya',c:'الصرف',lsk:'mutoon_lamiyya_v1',url:'lamiyya.html',t:'لامية الأفعال',d:'أبنية الأفعال وتصريفها · ١١٤ بيتًا'},
  {key:'qatr',c:'النحو',lsk:'mutoon_qatr_v1',url:'qatr.html',t:'قطر الندى',d:'المتن المتوسط بعد الآجرومية · ٢٧ بابًا'},
  {key:'akhdari',c:'الفقه',lsk:'mutoon_akhdari_v1',url:'akhdari.html',t:'متن الأخضري',d:'فقه العبادات على مذهب مالك · ٨ فصول'},
  {key:'zamzami',c:'علوم القرآن',lsk:'mutoon_zamzami_v1',url:'zamzami.html',t:'منظومة الزمزمي',d:'أصول التفسير نظمًا · ١٥٨ بيتًا'},
  {key:'kharida',c:'العقيدة',lsk:'mutoon_kharida_v1',url:'kharida.html',t:'الخريدة البهية',d:'التوحيد على طريقة الأشاعرة · ٧١ بيتًا'},
  {key:'gharami',c:'مصطلح الحديث',lsk:'mutoon_gharami_v1',url:'gharami.html',t:'غرامي صحيح',d:'ألقاب الحديث في غزلية · ٢٠ بيتًا'},
  {key:'tahawiyya',c:'العقيدة',lsk:'mutoon_tahawiyya_v1',url:'tahawiyya.html',t:'العقيدة الطحاوية',d:'عقيدة أهل السنة والجماعة · ١٠٥ فقرات'},
  {key:'jawhara',c:'العقيدة',lsk:'mutoon_jawhara_v1',url:'jawhara.html',t:'جوهرة التوحيد',d:'التوحيد على طريقة الأشاعرة · ١٤٤ بيتًا'},
  {key:'amali',c:'العقيدة',lsk:'mutoon_amali_v1',url:'amali.html',t:'بدء الأمالي',d:'العقيدة على طريقة الماتريدية · ٦٧ بيتًا'},
  {key:'mulha',c:'النحو',lsk:'mutoon_mulha_v1',url:'mulha.html',t:'ملحة الإعراب',d:'النحو نظمًا للمبتدئين · ٣٨٠ بيتًا'},
  {key:'waraqat',c:'أصول الفقه',lsk:'mutoon_waraqat_v1',url:'waraqat.html',t:'الورقات',d:'مبادئ أصول الفقه للجويني · ٢١ بابًا'},
  {key:'imriti',c:'أصول الفقه',lsk:'mutoon_imriti_v1',url:'imriti.html',t:'نظم الورقات',d:'نظم الورقات · ٢١١ بيتًا'},
  {key:'abushuja',c:'الفقه',lsk:'mutoon_abushuja_v1',url:'abushuja.html',t:'متن أبي شجاع',d:'الفقه الشافعي المختصر (الغاية والتقريب)'},
  {key:'nuridah',c:'الفقه',lsk:'mutoon_nuridah_v1',url:'nuridah.html',t:'نور الإيضاح',d:'الفقه الحنفي: العبادات · ٩٩ بابًا وفصلًا'},
  {key:'bulugh',c:'الحديث',lsk:'mutoon_bulugh_v1',url:'bulugh.html',t:'بلوغ المرام',d:'أحاديث الأحكام · ١٥٨٢ حديثًا بترقيم الزهيري'},
  {key:'qawaid',c:'القواعد الفقهية',lsk:'mutoon_qawaid_v1',url:'qawaid.html',t:'منظومة القواعد الفقهية',d:'منظومة القواعد الفقهية للسعدي · ٤٩ بيتًا'},
  {key:'wardiyya',c:'الآداب والرقائق',lsk:'mutoon_wardiyya_v1',url:'wardiyya.html',t:'لامية ابن الوردي',d:'نصيحة الإخوان في الآداب · ٧٧ بيتًا'},
  {key:'tayyiba',c:'القراءات والتجويد',lsk:'mutoon_tayyiba_v1',url:'tayyiba.html',t:'طيبة النشر',d:'القراءات العشر الكبرى · ١٠١٥ بيتًا'},
  {key:'nukhba',c:'مصطلح الحديث',lsk:'mutoon_nukhba_v1',url:'nukhba.html',t:'نخبة الفكر',d:'مصطلح الحديث لابن حجر · ٤٣ فقرة'},
  {key:'ibnashir',c:'الفقه',lsk:'mutoon_ibnashir_v1',url:'ibnashir.html',t:'متن ابن عاشر',d:'العقيدة والفقه المالكي والتصوف · ٣١٧ بيتًا'},
  {key:'umdafiqh',c:'الفقه',lsk:'mutoon_umdafiqh_v1',url:'umdafiqh.html',t:'عمدة الفقه',d:'الفقه الحنبلي لابن قدامة · ٢٦ كتابًا'},
  {key:'ashmawiyya',c:'الفقه',lsk:'mutoon_ashmawiyya_v1',url:'ashmawiyya.html',t:'متن العشماوية',d:'فقه العبادات على مذهب مالك · ١٤ بابًا'},
  {key:'qawaidusul',c:'أصول الفقه',lsk:'mutoon_qawaidusul_v1',url:'qawaidusul.html',t:'قواعد الأصول ومعاقد الفصول',d:'أصول الفقه الحنبلي · ٢٢ فصلًا'},
  {key:'akhsar',c:'الفقه',lsk:'mutoon_akhsar_v1',url:'akhsar.html',t:'أخصر المختصرات',d:'الفقه الحنبلي · ١٨ كتابًا'},
  {key:'siraji',c:'الفرائض',lsk:'mutoon_siraji_v1',url:'siraji.html',t:'السراجية',d:'الفرائض على مذهب الحنفية · ١٠ أبواب'},
  {key:'risala',c:'الفقه',lsk:'mutoon_risala_v1',url:'risala.html',t:'الرسالة',d:'الفقه المالكي · المقدمة و٤٥ بابًا'},
  {key:'zad',c:'الفقه',lsk:'mutoon_zad_v1',url:'zad.html',t:'زاد المستقنع',d:'الفقه الحنبلي · ٢٨ كتابًا و١٢٩ بابًا و١٢٨ فصلًا'},
  {key:'safina',c:'الفقه',lsk:'mutoon_safina_v1',url:'safina.html',t:'سفينة النجاة',d:'الفقه الشافعي · ٦٥ فصلًا وخاتمة'},
  {key:'tuhfamuluk',c:'الفقه',lsk:'mutoon_tuhfamuluk_v1',url:'tuhfamuluk.html',t:'تحفة الملوك',d:'الفقه الحنفي · ١٠ كتب'},
  {key:'kanz',c:'الفقه',lsk:'mutoon_kanz_v1',url:'kanz.html',t:'كنز الدقائق',d:'الفقه الحنفي · ٥٧ كتابًا و١٤٢ بابًا و٥٩ فصلًا'},
  {key:'hadramiyya',c:'الفقه',lsk:'mutoon_hadramiyya_v1',url:'hadramiyya.html',t:'المقدمة الحضرمية',d:'الفقه الشافعي · ٤ كتب و١٥ بابًا و٩٨ فصلًا'},
  {key:'maraqi',c:'أصول الفقه',lsk:'mutoon_maraqi_v1',url:'maraqi.html',t:'مراقي السعود',d:'أصول الفقه المالكي · ١٠٠١ بيت'},
  {key:'thalatha',c:'العقيدة',lsk:'mutoon_thalatha_v1',url:'thalatha.html',t:'ثلاثة الأصول وأدلتها',d:'معرفة الرب والدين والنبي ﷺ بأدلتها · ٨٧ فقرة'},
  {key:'qawaidarba',c:'العقيدة',lsk:'mutoon_qawaidarba_v1',url:'qawaidarba.html',t:'القواعد الأربع',d:'التوحيد والشرك · ٤ قواعد في ٢٥ فقرة'},
  {key:'safariniyya',c:'العقيدة',lsk:'mutoon_safariniyya_v1',url:'safariniyya.html',t:'السفارينية',d:'العقيدة على مذهب أهل الأثر · ٢١٠ أبيات'},
  {key:'iraqi',c:'مصطلح الحديث',lsk:'mutoon_iraqi_v1',url:'iraqi.html',t:'ألفية العراقي',d:'مصطلح الحديث · ١٠٠٢ بيت'},
  {key:'tawhid',c:'العقيدة',lsk:'mutoon_tawhid_v1',url:'tawhid.html',t:'كتاب التوحيد',d:'التوحيد وما ينافيه · ٦٦ بابًا مع مسائلها'},
  {key:'wasitiyya',c:'العقيدة',lsk:'mutoon_wasitiyya_v1',url:'wasitiyya.html',t:'العقيدة الواسطية',d:'عقيدة أهل السنة والجماعة · ١٩٨ فقرة'},
  {key:'hairiyya',c:'العقيدة',lsk:'mutoon_hairiyya_v1',url:'hairiyya.html',t:'المنظومة الحائية',d:'العقيدة · ٣٣ بيتًا'},
  {key:'lumaa',c:'العقيدة',lsk:'mutoon_lumaa_v1',url:'lumaa.html',t:'لمعة الاعتقاد',d:'العقيدة · ٩٥ فقرة بترقيم ابن عثيمين'},
  {key:'usultafsir',c:'علوم القرآن',lsk:'mutoon_usultafsir_v1',url:'usultafsir.html',t:'مقدمة في أصول التفسير',d:'علوم القرآن · ١١ فصلًا'},
  {key:'adab',c:'الآداب والرقائق',lsk:'mutoon_adab_v1',url:'adab.html',t:'منظومة الآداب',d:'الآداب الشرعية · ٩٤٧ بيتًا'},
  {key:'durrabahiyya',c:'النحو',lsk:'mutoon_durrabahiyya_v1',url:'durrabahiyya.html',t:'الدرة البهية (نظم الآجرومية)',d:'نظم الآجرومية للعمريطي · ٢٥٤ بيتًا'},
  {key:'qurra',c:'السيرة النبوية',lsk:'mutoon_qurra_v1',url:'qurra.html',t:'قرة الأبصار',d:'السيرة النبوية · ٣٩٨ بيتًا'},
  {key:'jawharmaknun',c:'البلاغة',lsk:'mutoon_jawharmaknun_v1',url:'jawharmaknun.html',t:'الجوهر المكنون',d:'البلاغة · ٢٩١ بيتًا'},
  {key:'bina',c:'الصرف',lsk:'mutoon_bina_v1',url:'bina.html',t:'متن البناء',d:'الصرف · ٣٥ بابًا وتقسيم الفعل'},
  {key:'umdasalik',c:'الفقه',lsk:'mutoon_umdasalik_v1',url:'umdasalik.html',t:'عمدة السالك',d:'الفقه الشافعي · ١١ كتابًا و٧٥ بابًا و٥٧ فصلًا'},
  {key:'dalil',c:'الفقه',lsk:'mutoon_dalil_v1',url:'dalil.html',t:'دليل الطالب',d:'الفقه الحنبلي · ٣٧ كتابًا و١١٥ بابًا و٢٠٢ فصلًا'},
  {key:'qahtaniyya',c:'العقيدة',lsk:'mutoon_qahtaniyya_v1',url:'qahtaniyya.html',t:'نونية القحطاني',d:'العقيدة والآداب · ٦٨٩ بيتًا'},
  {key:'shudhur',c:'النحو',lsk:'mutoon_shudhur_v1',url:'shudhur.html',t:'شذور الذهب',d:'المتن الأوسع بعد قطر الندى · ١٧ بابًا وفصلًا'},
  {key:'nawaqid',c:'العقيدة',lsk:'mutoon_nawaqid_v1',url:'nawaqid.html',t:'نواقض الإسلام',d:'نواقض الإسلام العشرة · ١٦ فقرة'},
  {key:'shurut',c:'العقيدة',lsk:'mutoon_shurut_v1',url:'shurut.html',t:'شروط الصلاة وأركانها وواجباتها',d:'الفقه والعقيدة في الصلاة · ٩ شروط و١٤ ركنًا و٨ واجبات في ٨٥ فقرة'},
  {key:'usulsitta',c:'العقيدة',lsk:'mutoon_usulsitta_v1',url:'usulsitta.html',t:'الأصول الستة',d:'ستة أصول عظيمة · مقدمة و٦ أصول في ٢٣ فقرة (غير مشكول)'},
  {key:'kashf',c:'العقيدة',lsk:'mutoon_kashf_v1',url:'kashf.html',t:'كشف الشبهات',d:'التوحيد والرد على شبه المشركين · مقدمة وجواب مجمل و١٢ شبهة وخاتمة في ٢١٨ فقرة'},
  {key:'usulsunna',c:'العقيدة',lsk:'mutoon_usulsunna_v1',url:'usulsunna.html',t:'أصول السنة',d:'العقيدة · ٥٠ أصلًا بترقيم النشرات المتداولة'},
  {key:'sharhsunna',c:'العقيدة',lsk:'mutoon_sharhsunna_v1',url:'sharhsunna.html',t:'شرح السنة للمزني',d:'العقيدة · ٢٠ فقرة بترقيم المحقق'},
  {key:'aqila',c:'القراءات والتجويد',lsk:'mutoon_aqila_v1',url:'aqila.html',t:'عقيلة أتراب القصائد',d:'رسم المصحف · ٢٩٨ بيتًا'},
  {key:'rajab',c:'الحديث',lsk:'mutoon_rajab_v1',url:'rajab.html',t:'زوائد ابن رجب',d:'الحديث · ٨ أحاديث (٤٣–٥٠)'},
  {key:'lamiyyataymiyya',c:'العقيدة',lsk:'mutoon_lamiyyataymiyya_v1',url:'lamiyyataymiyya.html',t:'لامية ابن تيمية',d:'العقيدة · ١٦ بيتًا'},
  {key:'sullamwusul',c:'العقيدة',lsk:'mutoon_sullamwusul_v1',url:'sullamwusul.html',t:'سلم الوصول',d:'العقيدة · ٢٩٠ بيتًا'},
  {key:'isaghuji',c:'المنطق',lsk:'mutoon_isaghuji_v1',url:'isaghuji.html',t:'إيساغوجي',d:'المنطق · ٨ أبواب'},
  {key:'miatmaani',c:'البلاغة',lsk:'mutoon_miatmaani_v1',url:'miatmaani.html',t:'مائة المعاني والبيان',d:'البلاغة · ١٠٠ بيت'},
  {key:'durarlawami',c:'القراءات والتجويد',lsk:'mutoon_durarlawami_v1',url:'durarlawami.html',t:'الدرر اللوامع',d:'أصول قراءة نافع · ٢٧٣ بيتًا'},
  {key:'qawaidirab',c:'النحو',lsk:'mutoon_qawaidirab_v1',url:'qawaidirab.html',t:'قواعد الإعراب',d:'النحو · أربعة أبواب · ٥ بابًا'},
  {key:'maqsud',c:'الصرف',lsk:'mutoon_maqsud_v1',url:'maqsud.html',t:'المقصود',d:'الصرف · ١١ فصلًا'},
  {key:'amr',c:'الشعر العربي',lsk:'mutoon_amr_v1',url:'amr.html',t:'معلقة عمرو بن كلثوم',d:'الشعر العربي · ١٠٣ أبيات'},
  {key:'antara',c:'الشعر العربي',lsk:'mutoon_antara_v1',url:'antara.html',t:'معلقة عنترة بن شداد',d:'الشعر العربي · ٧٥ بيتًا'},
  {key:'harith',c:'الشعر العربي',lsk:'mutoon_harith_v1',url:'harith.html',t:'معلقة الحارث بن حلزة',d:'الشعر العربي · ٨٢ بيتًا'},
  {key:'imru',c:'الشعر العربي',lsk:'mutoon_imru_v1',url:'imru.html',t:'معلقة امرئ القيس',d:'الشعر العربي · ٧٩ بيتًا'},
  {key:'tarafa',c:'الشعر العربي',lsk:'mutoon_tarafa_v1',url:'tarafa.html',t:'معلقة طرفة بن العبد',d:'الشعر العربي · ١٠٣ أبيات'},
  {key:'zuhayr',c:'الشعر العربي',lsk:'mutoon_zuhayr_v1',url:'zuhayr.html',t:'معلقة زهير بن أبي سلمى',d:'الشعر العربي · ٦٢ بيتًا'},
  {key:'labid',c:'الشعر العربي',lsk:'mutoon_labid_v1',url:'labid.html',t:'معلقة لبيد بن ربيعة',d:'الشعر العربي · ٨٨ بيتًا'},
  {key:'lamiyyatarab',c:'الشعر العربي',lsk:'mutoon_lamiyyatarab_v1',url:'lamiyyatarab.html',t:'لامية العرب',d:'الشعر العربي · ٦٨ بيتًا'},
  {key:'ilbiri',c:'التزكية والرقائق',lsk:'mutoon_ilbiri_v1',url:'ilbiri.html',t:'تائية الإلبيري',d:'الوعظ والحث على العلم · ١١٢ بيتًا'},
  {key:'wasiyyasughra',c:'التزكية والرقائق',lsk:'mutoon_wasiyyasughra_v1',url:'wasiyyasughra.html',t:'الوصية الصغرى',d:'وصيته لأبي القاسم المغربي · ٩٧ فقرة'},
  {key:'lamiyyatajam',c:'الشعر العربي',lsk:'mutoon_lamiyyatajam_v1',url:'lamiyyatajam.html',t:'لامية العجم',d:'الشعر العربي · ٥٩ بيتًا'},
  {key:'bustiyya',c:'الشعر العربي',lsk:'mutoon_bustiyya_v1',url:'bustiyya.html',t:'نونية البستي',d:'الشعر العربي · ٦٣ بيتًا'},
  {key:'rundiyya',c:'الشعر العربي',lsk:'mutoon_rundiyya_v1',url:'rundiyya.html',t:'رثاء الأندلس',d:'الشعر العربي · ٤٣ بيتًا'},
  {key:'zuhdabulatahiya',c:'الشعر العربي',lsk:'mutoon_zuhdabulatahiya_v1',url:'zuhdabulatahiya.html',t:'زهدية أبي العتاهية',d:'الشعر العربي · ١٩ بيتًا'},
  {key:'mutanabbihikam',c:'الشعر العربي',lsk:'mutoon_mutanabbihikam_v1',url:'mutanabbihikam.html',t:'على قدر أهل العزم',d:'الشعر العربي · ٤٦ بيتًا'},
  {key:'shafiidiwan',c:'الشعر العربي',lsk:'mutoon_shafiidiwan_v1',url:'shafiidiwan.html',t:'مختارات من شعر الشافعي',d:'الشعر العربي · خمس مقطوعات · ٣٢ بيتًا'},
  {key:'bidaya',c:'التزكية والرقائق',lsk:'mutoon_bidaya_v1',url:'bidaya.html',t:'بداية الهداية',d:'الطاعات واجتناب المعاصي وآداب الصحبة · ٦١٨ فقرة'},
  {key:'banatsuad',c:'الشعر العربي',lsk:'mutoon_banatsuad_v1',url:'banatsuad.html',t:'بانت سعاد',d:'الشعر العربي · ٥٨ بيتًا'},
  {key:'ayyuhalwalad',c:'التزكية والرقائق',lsk:'mutoon_ayyuhalwalad_v1',url:'ayyuhalwalad.html',t:'أيها الولد',d:'رسالته في النصيحة لتلميذه · ١٧٠ فقرة'},
  {key:'mustarshidin',c:'التزكية والرقائق',lsk:'mutoon_mustarshidin_v1',url:'mustarshidin.html',t:'رسالة المسترشدين',d:'وصايا في السلوك والأدب · ٢٢٥ فقرة'},
  {key:'ibnabb',c:'النحو',lsk:'mutoon_ibnabb_v1',url:'ibnabb.html',t:'نظم الآجرومية لابن أبّ',d:'نظم الآجرومية لابن أبّ · ١٥٤ بيتًا'},
  {key:'samawal',c:'الشعر العربي',lsk:'mutoon_samawal_v1',url:'samawal.html',t:'لامية السموأل',d:'الشعر العربي · ٢٣ بيتًا'},
  {key:'ammuriyya',c:'الشعر العربي',lsk:'mutoon_ammuriyya_v1',url:'ammuriyya.html',t:'فتح عمورية',d:'الشعر العربي · ٧١ بيتًا'},
  {key:'abufiras',c:'الشعر العربي',lsk:'mutoon_abufiras_v1',url:'abufiras.html',t:'أراك عصي الدمع',d:'الشعر العربي · ٥٤ بيتًا'},
  {key:'malikrayb',c:'الشعر العربي',lsk:'mutoon_malikrayb_v1',url:'malikrayb.html',t:'يائية مالك بن الريب',d:'الشعر العربي · ٥٨ بيتًا'},
  {key:'munfarija',c:'التزكية والرقائق',lsk:'mutoon_munfarija_v1',url:'munfarija.html',t:'المنفرجة',d:'التزكية والرقائق · ٤٠ بيتًا'},
  {key:'waharraqalbah',c:'الشعر العربي',lsk:'mutoon_waharraqalbah_v1',url:'waharraqalbah.html',t:'وا حر قلباه',d:'الشعر العربي · ٣٨ بيتًا'},
  {key:'madaih',c:'الشعر العربي',lsk:'mutoon_madaih_v1',url:'madaih.html',t:'مختارات المدائح النبوية',d:'أشهر أبيات المديح النبوي · ٢٧ مقطوعة · ٢١٥ بيتًا'},
  {key:'khaqaniyya',c:'القراءات والتجويد',lsk:'mutoon_khaqaniyya_v1',url:'khaqaniyya.html',t:'رائية الخاقاني',d:'التجويد · ٥١ بيتًا'},
  {key:'sakhawiyya',c:'القراءات والتجويد',lsk:'mutoon_sakhawiyya_v1',url:'sakhawiyya.html',t:'نونية السخاوي',d:'التجويد · ٦٤ بيتًا'},
  {key:'kalwadhaniyya',c:'العقيدة',lsk:'mutoon_kalwadhaniyya_v1',url:'kalwadhaniyya.html',t:'دالية الكلوذاني',d:'العقيدة · ٤٥ بيتًا'},
  {key:'mimiyya',c:'التزكية والرقائق',lsk:'mutoon_mimiyya_v1',url:'mimiyya.html',t:'ميمية ابن القيم',d:'الرقائق · ٢٣٠ بيتًا'},
  {key:'farazdaq',c:'الشعر العربي',lsk:'mutoon_farazdaq_v1',url:'farazdaq.html',t:'ميمية الفرزدق',d:'الشعر العربي · ٢٩ بيتًا'},
  {key:'maarri',c:'الشعر العربي',lsk:'mutoon_maarri_v1',url:'maarri.html',t:'دالية المعري',d:'الشعر العربي · ٦٤ بيتًا'},
  {key:'ibnzurayq',c:'الشعر العربي',lsk:'mutoon_ibnzurayq_v1',url:'ibnzurayq.html',t:'عينية ابن زريق',d:'الشعر العربي · ٤٠ بيتًا'},
  {key:'abudhuayb',c:'الشعر العربي',lsk:'mutoon_abudhuayb_v1',url:'abudhuayb.html',t:'عينية أبي ذؤيب',d:'الشعر العربي · ٦٥ بيتًا'},
  {key:'khansa',c:'الشعر العربي',lsk:'mutoon_khansa_v1',url:'khansa.html',t:'رائية الخنساء',d:'الشعر العربي · ٣٦ بيتًا'},
  {key:'thana',c:'التزكية والرقائق',lsk:'mutoon_thana_v1',url:'thana.html',t:'الثناء على الله',d:'أشهر أبيات الثناء على الله · ٣١ مقطوعة · ١٨٧ بيتًا'},
  {key:'maqsura',c:'الشعر العربي',lsk:'mutoon_maqsura_v1',url:'maqsura.html',t:'مقصورة ابن دريد',d:'الشعر العربي · ٢٥٦ بيتًا'},
  {key:'muthallath',c:'النحو',lsk:'mutoon_muthallath_v1',url:'muthallath.html',t:'نظم مثلث قطرب',d:'اللغة (المثلثات) · ٦٤ بيتًا'},
  {key:'sayrsaadi',c:'التزكية والرقائق',lsk:'mutoon_sayrsaadi_v1',url:'sayrsaadi.html',t:'السير إلى الله والدار الآخرة',d:'منازل السائرين · ١٧ بيتًا'},
  {key:'taiyyaqadar',c:'العقيدة',lsk:'mutoon_taiyyaqadar_v1',url:'taiyyaqadar.html',t:'تائية ابن تيمية في القدر',d:'القدر · ١٢٥ بيتًا مع أبيات السؤال الثمانية'},
  {key:'hamasa',c:'الشعر العربي',lsk:'mutoon_hamasa_v1',url:'hamasa.html',t:'العزة والحماسة',d:'أشهر أبيات العزة والشجاعة · ٣٤ مقطوعة · ١٩٠ بيتًا'},
  {key:'lughatuna',c:'الشعر العربي',lsk:'mutoon_lughatuna_v1',url:'lughatuna.html',t:'اللغة العربية تنعى حظها',d:'الشعر العربي · ٢٣ بيتًا'},
  {key:'muallim',c:'الشعر العربي',lsk:'mutoon_muallim_v1',url:'muallim.html',t:'قم للمعلم',d:'الشعر العربي · ٣٣ بيتًا مختارة'},
  {key:'likullimri',c:'الشعر العربي',lsk:'mutoon_likullimri_v1',url:'likullimri.html',t:'دالية المتنبي',d:'الشعر العربي · ٤٢ بيتًا'},
  {key:'kalim',c:'الحديث',lsk:'mutoon_kalim_v1',url:'kalim.html',t:'الكلم الطيب',d:'الأذكار · ٢٥٤ حديثًا في ٦٢ فصلًا'},
  {key:'shabrawi',c:'النحو',lsk:'mutoon_shabrawi_v1',url:'shabrawi.html',t:'منظومة الشبراوي',d:'النحو · ٥١ بيتًا'},
  {key:'awam',c:'العقيدة',lsk:'mutoon_awam_v1',url:'awam.html',t:'عقيدة العوام',d:'العقيدة · ٥٧ بيتًا'},
  {key:'tajrid',c:'الحديث',lsk:'mutoon_tajrid_v1',url:'tajrid.html',t:'مختصر البخاري',d:'مختصر صحيح البخاري · ٢٢٥٤ حديثًا'},
  {key:'mundhiri',c:'الحديث',lsk:'mutoon_mundhiri_v1',url:'mundhiri.html',t:'مختصر مسلم',d:'مختصر صحيح مسلم · ٢١٧٩ حديثًا'},
  {key:'lulu',c:'الحديث',lsk:'mutoon_lulu_v1',url:'lulu.html',t:'اللؤلؤ والمرجان',d:'المتفق عليه · ١٩٠٦ أحاديث'},
  {key:'muharrar',c:'الحديث',lsk:'mutoon_muharrar_v1',url:'muharrar.html',t:'المحرر في الحديث',d:'أحاديث الأحكام · ١٣٠١ حديثًا'},
];
// the four schools and their texts (fiqh, usul, fara'id), for the «حسب المذهب» view of the texts sheet
const MADHAHIB=[['حنفي',['qudouri','nuridah','tuhfamuluk','kanz','usul','siraji']],['مالكي',['akhdari','ibnashir','ashmawiyya','risala','maraqi']],
  ['شافعي',['abushuja','safina','hadramiyya','umdasalik','zubad','waraqat','imriti','rahabiyya']],['حنبلي',['umdafiqh','akhsar','dalil','zad','qawaidusul']]];
// the order of fields in the texts sheet
const FIELDS=['القراءات والتجويد','علوم القرآن','العقيدة','الحديث','مصطلح الحديث','الفقه','أصول الفقه','القواعد الفقهية','الفرائض','النحو','الصرف','البلاغة','المنطق','السيرة النبوية','الرقائق والأذكار','الآداب والرقائق','التزكية والرقائق','الشعر العربي'];

/* ---------- small helpers ---------- */
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
let toastT=null;
// a short message at the bottom; with an action (e.g. «تراجع») it stays longer and takes taps
function toast(msg,action){
  let t=document.getElementById('uiToast'); if(!t){t=el('div','ui-toast');t.id='uiToast';t.setAttribute('role','status');document.body.append(t)}
  t.replaceChildren(el('span','',msg));
  if(action){const b=el('button','ui-toast-act',action.label);b.type='button';b.onclick=()=>{t.classList.remove('on');action.fn()};t.append(b)}
  t.classList.toggle('act',!!action); t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),action?6000:2600);
}
// a bottom sheet; returns its body to fill. Closing: the ✕, the backdrop, or Escape
function sheet(title){
  closeSheet(); if(window.vvFix)vvFix();
  const bd=el('div','ui-backdrop'); bd.id='uiSheet';
  const s=el('div','ui-sheet'); s.setAttribute('role','dialog'); s.setAttribute('aria-modal','true'); s.setAttribute('aria-label',title);
  const h=el('div','ui-sheet-h'); h.append(el('b','',title)); const x=el('button','ui-x','✕'); x.setAttribute('aria-label','سكّر'); x.onclick=closeSheet; h.append(x);
  const body=el('div','ui-sheet-b'); s.append(h,body); bd.append(s); document.body.append(bd);
  bd.addEventListener('click',e=>{if(e.target===bd)closeSheet()});
  requestAnimationFrame(()=>bd.classList.add('on')); document.body.classList.add('ui-locked');
  return body;
}
function closeSheet(){const s=document.getElementById('uiSheet');if(s){s.remove();document.body.classList.remove('ui-locked')}}
addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

/* ---------- keep the screen on while the page is open (iOS 16.4+, Chrome) ---------- */
let lock=null;
async function wake(){
  if(!P.wake||!('wakeLock' in navigator)||document.visibilityState!=='visible')return;
  try{if(!lock){lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',()=>lock=null)}}catch(e){}
}
function sleep(){try{lock&&lock.release()}catch(e){} lock=null}
document.addEventListener('visibilitychange',wake);
// browsers grant the lock only after a user gesture on some platforms
addEventListener('pointerdown',wake,{passive:true});

/* ---------- reporting a mistake in a text ----------
   Reports are kept on the device (and travel with the progress, so linked devices share them) until they are sent:
   through the phone's share sheet, or as a prefilled issue on the project's GitHub page. Nothing is sent by itself. */
const RK='mutoon_reports', REPO='https://github.com/Motoon-orgoja/miyeea';
const reports=()=>{try{return JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){return []}};
const setReports=a=>{try{a.length?localStorage.setItem(RK,JSON.stringify(a)):localStorage.removeItem(RK)}catch(e){}};
const KINDS=[['harakat','حركة'],['word','كلمة أو حرف'],['sharh','الشرح'],['other','غيره']];
function reportText(a){return 'بلاغات أخطاء · حفظ المتون\n\n'+a.map((r,i)=>(i+1)+'. '+r.title+' · '+r.label+' ('+r.id+')\nالنوع: '+(KINDS.find(k=>k[0]===r.kind)||KINDS[3])[1]+(r.word?'\nالكلمة: '+r.word:'')+'\nالملاحظة: '+r.note).join('\n\n')}
async function sendReports(){
  const a=reports(); if(!a.length){toast('ما في بلاغات محفوظة');return}
  const text=reportText(a);
  try{if(navigator.share){await navigator.share({title:'بلاغات أخطاء',text});toast('انبعتت ✓ امسحها لما تتأكد إنها وصلت');return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(text);toast('انتسخت البلاغات ✓ الصقها وين ما بدك تبعتها')}catch(e){toast('ما قدرت أنسخها')}
}
function reportsBox(){
  const box=el('div','ui-col'), a=reports();
  box.append(el('div','ui-hint',a.length?'عندك '+ar(a.length)+' بلاغ محفوظ على جهازك، لسا ما انبعت.':'ما في بلاغات محفوظة.'));
  if(a.length){const r=el('div','ui-row');
    const s=el('button','btn primary','📤 ابعث البلاغات'); s.onclick=sendReports;
    const g=el('a','btn','GitHub ↗'); g.target='_blank'; g.rel='noopener'; g.href=REPO+'/issues/new?title='+encodeURIComponent('بلاغات أخطاء ('+a.length+')')+'&body='+encodeURIComponent(reportText(a).slice(0,6000));
    const c=el('button','btn','امسحها'); c.onclick=()=>{if(confirm('تمسح البلاغات المحفوظة؟ امسحها بس بعد ما تبعثها.')){setReports([]);box.replaceWith(reportsBox())}};
    r.append(s,g,c); box.append(r)}
  return box;
}
// u: {book, title, id, label, text}
function report(u){
  const b=sheet('بلّغ عن خطأ');
  const pv=el('div','ui-preview',u.text); pv.dataset.noi18n=''; pv.style.textAlign='right';
  b.append(el('div','ui-hint',u.title+' · '+u.label),pv);
  let kind='harakat'; b.append(field('وين الخطأ؟',seg('نوع الخطأ',KINDS,kind,v=>kind=v)));
  const w=el('input'); w.type='text'; w.placeholder='الكلمة (اختياري)'; w.dir='rtl';
  const n=el('textarea'); n.rows=3; n.placeholder='شو الصح؟ ومن وين (إذا بتعرف)';
  b.append(field('التفاصيل',(()=>{const c=el('div','ui-col');c.append(w,n);return c})()));
  const ok=el('button','btn primary','حفظ البلاغ'); ok.onclick=()=>{
    if(!n.value.trim()&&!w.value.trim()){n.focus();return}
    const a=reports(); a.push({book:u.book,title:u.title,id:u.id,label:u.label,kind,word:w.value.trim(),note:n.value.trim(),at:new Date().toISOString().slice(0,10)}); setReports(a);
    closeSheet(); toast('انحفظ البلاغ ✓ ابعثه من الإعدادات أو من هون',{label:'ابعث هلأ',fn:sendReports})};
  b.append(ok, el('h3','ui-sec','البلاغات المحفوظة'), reportsBox());
}

/* ---------- backup of every text at once ---------- */

/* ---------- daily reminder as a calendar event (works on iPhone without a server) ---------- */
function reminderICS(time){
  const [h,m]=time.split(':').map(Number), d=new Date(); d.setHours(h,m,0,0); if(d<new Date())d.setDate(d.getDate()+1);
  const p=n=>String(n).padStart(2,'0'), dt=`${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(h)}${p(m)}00`;
  const url=new URL('home.html',location.href).href;
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Motoon//Hifz//AR','BEGIN:VEVENT','UID:hifz-daily-'+Date.now()+'@motoon',
    'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART:'+dt,'DURATION:PT20M','RRULE:FREQ=DAILY',
    'SUMMARY:ورد الحفظ اليومي','DESCRIPTION:افتح وردك: '+url,'URL:'+url,
    'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:ورد الحفظ','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
}

/* ---------- settings sheet ---------- */
function seg(name,opts,val,on){
  const w=el('div','ui-seg'); w.setAttribute('role','radiogroup'); w.setAttribute('aria-label',name);
  opts.forEach(([v,l])=>{const b=el('button','',l);b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',String(v===val));
    b.onclick=()=>{w.querySelectorAll('button').forEach(x=>x.setAttribute('aria-checked',String(x===b)));on(v)};w.append(b)});
  return w;
}
function field(label,ctrl,hint){const f=el('div','ui-field');f.append(el('div','ui-lbl',label),ctrl);if(hint)f.append(el('div','ui-hint',hint));return f}
function openSettings(){
  const b=sheet('الإعدادات');
  b.append(field('لغة الواجهة',seg('لغة الواجهة',[['ar','عامية'],['fus','فصحى'],['en','English']],P.lang||'ar',v=>{P.lang=v;save();setTimeout(()=>location.reload(),150)}),'المتون نفسها بتضل بالعربي.'));
  b.append(el('h3','ui-sec','القراءة والمظهر'));
  b.append(field('المظهر',seg('المظهر',[['auto','حسب الجهاز'],['light','فاتح'],['paper','ورقي'],['dark','غامق']],P.theme,v=>{P.theme=v;save()})));
  const prev=el('div','ui-preview','وَالْأَخْذُ بِالتَّجْوِيدِ حَتْمٌ لَازِمُ');
  const rng=(min,max,step,key,fmt)=>{const r=el('input');r.type='range';r.min=min;r.max=max;r.step=step;r.value=P[key];const o=el('span','ui-val',fmt(P[key]));
    r.oninput=()=>{P[key]=+r.value;o.textContent=fmt(P[key]);save()};const w=el('div','ui-range');w.append(r,o);return w};
  const pct=v=>ar(Math.round(v*100))+'٪';
  b.append(field('حجم خط المتن',rng(.8,1.6,.05,'vs',pct)),prev,field('حجم خط الأزرار والشرح',rng(.9,1.3,.05,'us',pct)));
  b.append(el('h3','ui-sec','المراجعة'));
  b.append(field('كثرة المراجعة',seg('كثرة المراجعة',[[0.85,'أقل'],[0.9,'متوازنة'],[0.95,'أكثر']],P.ret,v=>{P.ret=v;save()}),
    'مواعيد مراجعة الأبواب والمقاطع بتنحسب بخوارزمية FSRS حسب تقييمك لحالك. «أكثر» بتقرّب المواعيد وبتثبّت أكثر، و«أقل» بتبعّدها وبتوفّر وقت. التغيير بيأثر على المراجعات الجاية.'));
  // speech recognition language: Modern Standard Arabic suits classical texts best, but devices differ
  let asr=''; try{asr=localStorage.getItem('ui_asrLang')||''}catch(e){}
  b.append(el('h3','ui-sec','التسميع بالصوت'));
  b.append(field('لغة التعرّف على الصوت',seg('لغة التعرّف',[['','تلقائي'],['ar-SA','فصحى (السعودية)'],['ar-EG','مصر'],['ar-JO','الأردن']],asr,v=>{try{v?localStorage.setItem('ui_asrLang',v):localStorage.removeItem('ui_asrLang')}catch(e){}toast('بيتطبّق من التسميع الجاي')}),
    'إذا التسميع ما بيلتقط كلامك منيح، جرّب لغة ثانية. التلقائي بيبلّش بالفصحى.'));
  // how recitation is checked: live browser recognition, or record and listen back (the reader marks their own slips)
  const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
  const curEng=()=>(ls('ui_asrEngine')||'web')==='web'?'web':'self';
  b.append(field('طريقة التسميع بالصوت',seg('طريقة التسميع',[['web','تعرّف تلقائي'],['self','سجّل واسمع']],curEng(),v=>{ls('ui_asrEngine',v==='web'?null:v);dispatchEvent(new Event('ui-asr'))}),
    '«تعرّف تلقائي» بيسمعك وبيعلّم الكلمات وإنت بتقرأ (بيحتاج نت). «سجّل واسمع» بيسجّل تسميعك، وبعدين بتسمع حالك والنص قدامك وبتضغط على الكلمات اللي غلطت فيها، فبتنحفظ متل أغلاط التسميع. بيشتغل بدون نت وعلى أي جوال. بتقدر تبدّل كمان من الزر جنب المايك.'));
  const recB=el('button','btn','🗂 افتح تسجيلاتي'); recB.type='button'; recB.onclick=()=>openRecordings(window.BOOK&&window.BOOK.key);
  b.append(field('تسجيلاتي',recB,'كل تسميع بـ«سجّل واسمع» بينحفظ على جهازك، فبتقدر ترجع تسمعه وتقارن حالك مع الوقت، أو تبعثه لشيخك.'));
  const wk=el('label','ui-check'); const cb=el('input'); cb.type='checkbox'; cb.checked=P.wake; cb.onchange=()=>{P.wake=cb.checked;save();P.wake?wake():sleep()};
  wk.append(cb,document.createTextNode(' خلّي الشاشة شغّالة وأنا بحفظ'));
  const iv=el('button','btn','▶ شاهد الفيديو التعريفي');iv.type='button';iv.onclick=()=>{closeSheet();showIntro(false)};
  b.append(el('h3','ui-sec','مساعدة'),field('الفيديو التعريفي',iv,'دقيقتين بيشرحوا طريقة الحفظ وكل خصائص الموقع، بدون صوت.'));
  b.append(el('h3','ui-sec','الجهاز والبيانات'));
  b.append(field('الشاشة',wk,'wakeLock' in navigator?'بتمنع الجوال يطفّي الشاشة وإنت بتقرأ أو بتسمّع.':'متصفحك ما بيدعم هالخاصية.'));
  // reminder
  const rw=el('div','ui-row'); const ti=el('input'); ti.type='time'; ti.value=P.remind; ti.onchange=()=>{P.remind=ti.value;save()};
  const rb=el('button','btn','📅 أضف تذكير يومي للتقويم');
  rb.onclick=()=>{const blob=new Blob([reminderICS(ti.value||'20:00')],{type:'text/calendar'});const a=el('a');a.href=URL.createObjectURL(blob);a.download='تذكير-الحفظ.ics';document.body.append(a);a.click();a.remove();toast('افتح الملف واضغط «إضافة للتقويم»')};
  rw.append(ti,rb); b.append(field('تذكير يومي',rw,'إذا الإشعارات مفعّلة، بيوصلك تذكير بهالوقت إذا ما خلّصت وردك. وزر التقويم بينزّل موعد يومي لتقويم جوالك.'));
  // devices: linked sync when the server is set up, and a transfer code/file that merges (sync.js)
  if(window.SYNC&&SYNC.available)b.append(field('مزامنة الأجهزة',syncBox(),'بتربط جوالك وآيبادك وكمبيوترك بنفس الرمز، والتقدم بيتحدّث لحاله. المزامنة مشفّرة: الخادم ما بيقدر يقرأ تقدمك.'));
  const bk=el('div','ui-col');
  const out=el('textarea'); out.rows=3; out.readOnly=true; out.placeholder='كود النسخة الاحتياطية بيطلع هون';
  const eb=el('button','btn primary','انسخ نسخة احتياطية لكل المتون');
  const mark=()=>{try{localStorage.setItem('ui_lastBackup',String(Date.now()))}catch(e){}};
  eb.onclick=async()=>{out.value=await SYNC.exportCode();mark();try{await navigator.clipboard.writeText(out.value);toast('انتسخ الكود ✓ خزّنه بالملاحظات')}catch(e){out.select();toast('حدّد الكود وانسخه')}};
  const inp=el('textarea'); inp.rows=3; inp.placeholder='الصق كود نسخة احتياطية هون لترجّع كل تقدمك';
  const ib=el('button','btn','استرجع');
  // a new code merges (the newer progress of each text wins); an old one replaces, so it asks first
  async function restore(t){
    let o; try{o=await SYNC.readCode(t);if(o.app!=='mutoon-all'||!o.data)throw 0}catch(e){toast('الكود مش صحيح');return}
    if(!o.meta&&!confirm('رح يرجّع التقدم من النسخة ويستبدل تقدمك الحالي بالمتون اللي فيها. متأكد؟'))return;
    const r=await SYNC.importCode(t); toast(r.n?'رجع التقدم ✓ ('+ar(r.n)+')':'ما في شي أحدث من اللي عندك'); if(r.n)setTimeout(()=>location.reload(),700);
  }
  ib.onclick=()=>restore(inp.value);
  // the same backup as a file, easier to keep in iCloud/Files than a pasted code
  const fileRow=el('div','ui-row'); const fb=el('button','btn','💾 نزّل ملف نسخة'); const lb=el('label','btn','📂 افتح ملف نسخة'); const fi=el('input'); fi.type='file'; fi.accept='.txt,.json,text/plain'; fi.hidden=true; lb.append(fi);
  fb.onclick=async()=>{const code=await SYNC.exportCode();mark();const a=el('a');a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));a.download='نسخة-حفظ-المتون-'+new Date().toISOString().slice(0,10)+'.txt';document.body.append(a);a.click();a.remove();toast('نزل الملف ✓ خزّنه بمكان آمن')};
  fi.onchange=async()=>{const f=fi.files[0];if(f)restore((await f.text()).trim())};
  fileRow.append(fb,lb);
  bk.append(eb,out,fileRow,inp,ib);
  b.append(field('نقل التقدم والنسخة الاحتياطية',bk,'كود واحد فيه تقدمك بكل المتون. على الجهاز الثاني الصقه هون: بيدمج التقدمين، وبياخذ الأحدث بكل متن، فما بيضيع شي.'));
  b.append(field('بلاغات الأخطاء',reportsBox(),'إذا شفت خطأ بحركة أو كلمة أو شرح، اضغط «⚑ بلّغ» تحته بتبويب «الباب». البلاغات بتنحفظ هون لحد ما تبعثها.'));
  b.append(el('p','ui-hint',window.SYNC&&SYNC.linked()?'تقدمك محفوظ على هالجهاز وبيتزامن مع أجهزتك المربوطة. الموقع بيشتغل بدون نت بعد أول فتحة.':'تقدمك محفوظ على هالجهاز بس. الموقع بيشتغل بدون نت بعد أول فتحة.'));
}
/* ---------- linked devices (sync.js) ---------- */
function syncBox(){
  const w=el('div','ui-col');
  function paint(){
    w.replaceChildren();
    if(SYNC.linked()){
      const code=el('div','ui-code',SYNC.code()); code.setAttribute('data-noi18n','');
      const last=SYNC.last(), st=el('div','ui-hint',last?'آخر مزامنة: '+new Date(last).toLocaleString(LANG==='en'?'en':'ar'):'لسا ما تزامن');
      const now=el('button','btn primary','🔄 زامن هلأ'); now.onclick=async()=>{now.disabled=true;try{const n=await SYNC.sync();toast(n?'وصل تقدم جديد ✓':'كل شي محدّث ✓');if(n)setTimeout(()=>location.reload(),600)}catch(e){toast('ما زبطت المزامنة، تأكد من النت')}now.disabled=false;paint()};
      const cp=el('button','btn','📋 انسخ الرمز'); cp.onclick=async()=>{try{await navigator.clipboard.writeText(SYNC.code());toast('انتسخ الرمز ✓')}catch(e){toast(SYNC.code())}};
      const un=el('button','btn','افصل هالجهاز'); un.onclick=()=>{if(confirm('بدك تفصل هالجهاز عن المزامنة؟ تقدمك عليه بيضل.')){SYNC.unlink();paint()}};
      const row=el('div','ui-row'); row.append(now,cp);
      w.append(el('div','ui-lbl','رمز أجهزتك (اكتبه على الجهاز الثاني):'),code,st,row,un);
      return;
    }
    const mk=el('button','btn primary','✨ ابدأ المزامنة على هالجهاز');
    mk.onclick=async()=>{mk.disabled=true;try{await SYNC.link(SYNC.newSecret());toast('اشتغلت المزامنة ✓ اكتب الرمز على جهازك الثاني')}catch(e){SYNC.unlink();toast('ما زبط، تأكد من النت')}paint()};
    const inp=el('input','ui-search'); inp.placeholder='عندك رمز من جهاز ثاني؟ اكتبه هون'; inp.autocapitalize='characters'; inp.spellcheck=false;
    const go=el('button','btn','اربط'); go.onclick=async()=>{const c=inp.value.replace(/[^A-Za-z0-9]/g,'');if(c.length<20){toast('الرمز ناقص');return}go.disabled=true;
      try{const n=await SYNC.link(c);toast('انربط ✓');if(n)setTimeout(()=>location.reload(),600)}catch(e){SYNC.unlink();toast('ما زبط الربط، تأكد من الرمز والنت')}go.disabled=false;paint()};
    const row=el('div','ui-row'); row.append(inp,go);
    w.append(mk,row);
  }
  paint(); return w;
}
/* ---------- the texts the reader is working on now ----------
   A text counts once it has progress; the reader can pause any of them, and paused texts leave the daily ward
   (their progress stays, and they come back with one tap). */
/* A text the reader began is in one of four states: on (in the daily ward), paused (waits on the home page, no ward),
   later (put aside to come back to: out of the home page, listed under «برجعلها بعدين»), dropped (taken off the list as
   if never begun; the progress itself is kept, so beginning it again finds it). */
const STATES={on:['فعّال','بيطلع بوردي كل يوم'],paused:['موقوف مؤقتًا','بيضل بقائمتي بدون ورد، وبرجّعه بكبسة'],later:['برجعله بعدين','بيطلع من وردي وصفحتي الرئيسية، وبلاقيه بـ«برجعلها بعدين»'],dropped:['شيله من محفوظاتي','كأني ما بلّشت فيه. تقدمك بيضل محفوظ إذا رجعتله يومًا']};
const hasState=key=>{const b=BOOKS.find(x=>x.key===key);if(!b)return false;
  if(b.lsk.endsWith(':')){for(let i=0;i<localStorage.length;i++)if(localStorage.key(i).startsWith(b.lsk))return true;return false}
  return localStorage.getItem(b.lsk)!=null};
const status=key=>(P.dropped||[]).includes(key)?'dropped':(P.later||[]).includes(key)?'later':(P.paused||[]).includes(key)?'paused':'on';
function setStatus(key,st){['paused','later','dropped'].forEach(k=>{P[k]=(P[k]||[]).filter(x=>x!==key);if(k===st)P[k].push(key)});save()}
// begun and still on the reader's list (a dropped text counts as not begun)
function started(key){if(status(key)==='dropped')return false;const b=BOOKS.find(x=>x.key===key);if(!b)return false;
  if(b.lsk.endsWith(':')){for(let i=0;i<localStorage.length;i++)if(localStorage.key(i).startsWith(b.lsk))return true;return false}
  return localStorage.getItem(b.lsk)!=null}
const isPaused=key=>status(key)!=='on';
function setPaused(key,on){setStatus(key,on?'paused':'on')}
// the sheet where the reader says what a begun text is to them now
function openStatus(key,then){
  const x=BOOKS.find(z=>z.key===key),b=sheet('«'+x.t+'»'),cur=status(key);
  b.append(el('p','ui-hint','شو وضع هالمتن عندك؟'));
  Object.entries(STATES).forEach(([k,[t,d]])=>{const r=el('button','ui-book ui-st'+(k===cur?' cur':''));r.type='button';r.append(el('b','',(k===cur?'● ':'')+t),el('small','',d));
    r.onclick=()=>{setStatus(key,k);toast({on:'رجع لوردك اليومي ✓',paused:'وقّفته مؤقتًا',later:'انحط على جنب، بتلاقيه بـ«برجعلها بعدين»',dropped:'انشال من محفوظاتك'}[k]);(then||openBooks)()};b.append(r)});
  const back=el('button','btn','رجوع');back.onclick=()=>(then||openBooks)();b.append(back);
}
/* reading a text before deciding to memorise it: the whole text in a sheet, nothing saved, nothing added to the list */
function readText(){
  const B=window.BOOK;if(!B)return;const b=sheet('👁 '+(B.title||''));
  b.append(el('p','ui-hint','للاطّلاع بس: ما بينضاف لمحفوظاتك ولا لوردك. إذا عجبك، سكّر وابدأ الحفظ.'));
  const box=el('div','ui-read');
  if(B.poems)B.poems.forEach(p=>{if(B.poems.length>1)box.append(el('h3','ui-sec',p.title));
    p.verses.forEach((v,i)=>{const t=p.secs&&p.secs[i+1];if(t)box.append(el('div','ui-lbl',t));const r=el('p','ui-rv');r.append(el('span','',v[0]),el('span','',v[1]||''));box.append(r)})});
  else (B.chapters||[]).forEach(c=>{box.append(el('h3','ui-sec',c.title));(c.units||[]).forEach(u=>{const r=el('p','ui-rp');(u.segs||[]).forEach(([k,t])=>{const s=el('span',k==='matn'?'':'ui-rk',t+' ');r.append(s)});box.append(r)})});
  b.append(box);
}
// the welcome screen of a text not begun yet offers the reading first; a link with #read opens it at once
function readOffer(){
  const go=document.getElementById('welcomeGo');if(!go||!window.BOOK||CUR==='home')return;
  if(hasState(CUR)&&status(CUR)!=='dropped')return;
  const rb=el('button','btn','👁 اطّلع على المتن أول');rb.type='button';rb.onclick=readText;go.after(rb);
  if(location.hash==='#read'){history.replaceState(null,'',location.pathname+location.search);readText()}
}
function openBooks(){
  const b=sheet('المتون');
  b.append(el('p','ui-hint','المتون اللي بتحفظها بتطلع بـ«وردي اليوم». اكبس على وضع المتن (فعّال ▾) لتوقفه أو تحطّه على جنب أو تشيله. وأي متن جديد بتقدر تطّلع عليه قبل ما تبدأ فيه.'));
  // a filter box once the list is long; the texts being memorised come first, then every text grouped by field
  // (in the order of FIELDS, then any other field in the order it first appears)
  const q=el('input','ui-search'); q.type='search'; q.placeholder='🔍 دوّر على متن أو فن…';
  if(BOOKS.length>12)b.append(q);
  // two views: by field, or the four schools with each one's texts (the rest stay grouped by field after them)
  let by='field'; try{by=localStorage.getItem('ui_booksBy')||'field'}catch(e){}
  const tabs=el('div','ui-seg ui-by'), tb=[['field','حسب الفن'],['madh','حسب المذهب']].map(([k,t])=>{const x=el('button','',t);x.type='button';x.setAttribute('role','radio');x.onclick=()=>{by=k;try{localStorage.setItem('ui_booksBy',k)}catch(e){}paintTabs();draw()};tabs.append(x);return[k,x]});
  const paintTabs=()=>tb.forEach(([k,x])=>x.setAttribute('aria-checked',String(k===by))); tabs.setAttribute('role','radiogroup'); paintTabs(); b.append(tabs);
  // the daily tafsir ward lives on its own page
  const tfl=el('a','ui-book-link');tfl.href='tafsir.html';tfl.append(el('b','','📖 ورد التفسير'),el('small','','آيات كل يوم مع التفاسير اللي بتختارها'));const tfr=el('div','ui-book'+(CUR==='tafsir'?' cur':''));tfr.append(tfl);b.append(tfr);
  const list=el('div'); b.append(list);
  const fields=[...new Set([...FIELDS,...BOOKS.map(x=>x.c||'')])].filter(c=>BOOKS.some(x=>(x.c||'')===c));
  const norm=s=>s.replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
  function draw(){
    list.replaceChildren(); const w=norm(q.value.trim()), hit=x=>!w||norm(x.t+' '+x.d+' '+(x.c||'')).includes(w);
    const mine=w||by==='madh'?[]:BOOKS.filter(x=>started(x.key)&&status(x.key)!=='later'), aside=w||by==='madh'?[]:BOOKS.filter(x=>started(x.key)&&status(x.key)==='later');
    const madh=by==='madh'?MADHAHIB.flatMap(([m,ks])=>ks.map(k=>BOOKS.find(x=>x.key===k)).filter(x=>x&&hit(x)).map(x=>[x,'🕌 المذهب ال'+m])):[];
    const taken=[...mine,...aside,...madh.map(r=>r[0])], rest=fields.flatMap(c=>BOOKS.filter(x=>(x.c||'')===c&&hit(x)&&!taken.includes(x)).map(x=>[x,(madh.length?'مشترك · ':'')+c]));
    const rows=[...mine.map(x=>[x,'📖 اللي بحفظها']),...aside.map(x=>[x,'⏳ برجعلها بعدين']),...madh,...rest];
    if(!rows.length)list.append(el('p','ui-hint','ما لقيت متن بهالاسم.'));
    rows.forEach(([x,c],k)=>{if(c&&(k===0||rows[k-1][1]!==c))list.append(el('div','ui-lbl',c)); list.append(bookRow(x))});
  }
  q.oninput=draw; draw();
}
function bookRow(x){
    const row=el('div','ui-book'+(x.key===CUR?' cur':'')+(isPaused(x.key)?' paused':''));
    const a=el('a','ui-book-link');a.href=x.url;a.append(el('b','',x.t),el('small','',x.d));row.append(a);
    if(started(x.key)){const st=status(x.key),t=el('button','ui-switch'+(st==='on'?' on':''),{on:'فعّال',paused:'موقوف',later:'معلّق'}[st]+' ▾');t.type='button';t.title='غيّر وضع المتن';
      t.onclick=()=>openStatus(x.key);row.append(t)}
    else{const r=el('a','ui-peek','👁 اطّلع');r.href=x.url+'#read';row.append(r,el('span','ui-new','ابدأ'))}
    return row;
}
// on a paused text's own page, say so and offer to bring it back
function pausedBanner(){
  if(!CUR||CUR==='home'||!isPaused(CUR))return; const bar=document.querySelector('.ui-bar'); if(!bar)return;
  const st=status(CUR),n=el('div','ui-nudge'); n.append(el('span','',st==='dropped'?'شلت هالمتن من محفوظاتك. تقدمك القديم فيه لسا محفوظ.':st==='later'?'هالمتن حاطّه على جنب لترجعله بعدين، وما بيطلع بـ«وردي اليوم».':'هالمتن موقوف، وما بيطلع بـ«وردي اليوم».'));
  const go=el('button','btn primary',st==='dropped'?'رجّعه لمحفوظاتي':'رجّعه لوردي'); go.onclick=()=>{setPaused(CUR,false);n.remove();toast('رجع لوردك اليومي ✓')};
  const row=el('div','ui-row'); row.append(go); n.append(row); bar.after(n);
}

/* ---------- search across every text ----------
   Each text's data file is fetched on first search and read in its own scope (so the page's own BOOK stays untouched).
   Matching ignores harakat, tatweel and the usual spelling variants of alif, ya and ta marbuta, so «الصلاه» finds «الصَّلَاةِ».
   A hit opens its text at that verse (#v=) or passage (#u=). */
const FOLD=[[/[ً-ٰٟۖ-ۭـ]/g,''],[/[أإآٱ]/g,'ا'],[/ى/g,'ي'],[/ة/g,'ه'],[/ؤ/g,'و'],[/ئ/g,'ي'],[/ﷺ/g,'صلى الله عليه وسلم']];
const fold1=c=>FOLD.reduce((t,[a,b])=>t.replace(a,b),c);
// folded text plus, for every folded character, where it came from in the original
function foldMap(s){let out='',map=[];for(let i=0;i<s.length;i++){const f=fold1(s[i]);for(const ch of f){out+=ch;map.push(i)}}return {f:out,map}}
const dataUrl=b=>'data/'+b.key+'.js';
const IDX={};
async function loadIndex(b){
  if(IDX[b.key])return IDX[b.key];
  const code=await (await fetch(dataUrl(b))).text(), w={};
  new Function('window',code)(w); const B=w.BOOK, items=[];
  if(B.poems)B.poems.forEach(p=>{let sec='';p.verses.forEach((v,i)=>{if(p.secs&&p.secs[i+1])sec=p.secs[i+1];
    items.push({t:v.join(' ۞ '),where:(B.poems.length>1?p.title+' · ':'')+(sec&&sec!==p.title?sec+' · ':'')+'البيت '+ar(i+1),href:b.url+'#v='+(i+1)+(B.poems.length>1?'&p='+encodeURIComponent(p.id):'')})})});
  else (B.chapters||[]).forEach(c=>c.units.forEach(u=>items.push({t:u.segs.map(x=>x[1]).join(' '),where:c.title+' · '+u.label,href:b.url+'#u='+encodeURIComponent(u.id)})));
  items.forEach(x=>{const m=foldMap(x.t);x.f=m.f;x.map=m.map});
  return IDX[b.key]=items;
}
function snippet(x,a,len){
  const s=x.map[a], e=x.map[Math.min(a+len-1,x.map.length-1)]+1, from=Math.max(0,s-60), to=Math.min(x.t.length,e+80);
  const p=el('p','ui-hit-t');
  p.append((from?'… ':'')+x.t.slice(from,s)); p.append(el('mark','',x.t.slice(s,e))); p.append(x.t.slice(e,to)+(to<x.t.length?' …':''));
  return p;
}
function openSearch(){
  const body=sheet('ابحث في المتون');
  const inp=el('input','ui-search'); inp.type='search'; inp.placeholder='كلمة أو جملة… (بدون تشكيل)'; inp.setAttribute('aria-label','ابحث');
  const scope=el('div','ui-row');
  let only='';
  const mine=CUR&&CUR!=='home'?CUR:'';
  const segEl=seg('وين تبحث',[['','بكل المتون']].concat(mine?[[mine,'بهالمتن بس']]:[]),'',v=>{only=v;run()});
  scope.append(segEl);
  const out=el('div','ui-results');
  body.append(inp,scope,out);
  let tm=null,gen=0;
  inp.oninput=()=>{clearTimeout(tm);tm=setTimeout(run,250)};
  async function run(){
    const q=fold1(inp.value.trim()).replace(/\s+/g,' '); const my=++gen;
    if(q.length<2){out.replaceChildren(el('p','ui-hint','اكتب كلمتين أو ثلاث من البيت أو الحديث. البحث بيتجاهل التشكيل والهمزات.'));return}
    out.replaceChildren(el('p','ui-hint','عم يدوّر…'));
    const books=BOOKS.filter(b=>!only||b.key===only), frag=document.createDocumentFragment(); let n=0;
    for(const b of books){
      let items; try{items=await loadIndex(b)}catch(e){continue}
      if(my!==gen)return;
      const hits=[]; for(const x of items){const a=x.f.indexOf(q);if(a>=0){hits.push([x,a]);if(hits.length>=40)break}}
      if(!hits.length)continue; n+=hits.length;
      frag.append(el('div','ui-lbl',b.t+' ('+ar(hits.length)+(hits.length>=40?'+':'')+')'));
      hits.forEach(([x,a])=>{const r=el('a','ui-hit');r.href=x.href;r.append(el('small','',x.where),snippet(x,a,q.length));
        r.onclick=()=>{closeSheet();if(new URL(r.href,location.href).pathname===location.pathname){location.hash=r.hash;return false}};frag.append(r)});
    }
    if(my!==gen)return;
    out.replaceChildren(n?frag:el('p','ui-hint','ما لقيت شي. جرّب كلمة أقصر أو بإملاء ثاني.'));
  }
  run(); setTimeout(()=>inp.focus(),60);
}

/* ---------- the app bar replaces each page's list of book links ---------- */
let CUR='';
function mountBar(){
  const nav=document.querySelector('nav.books'); if(!nav)return;
  const c=nav.querySelector('[aria-current="page"]')||[...nav.querySelectorAll('a')].find(a=>a.dataset.book&&document.body.dataset.book===a.dataset.book);
  CUR=c?c.dataset.book:'';
  const bar=el('div','ui-bar');
  const home=el('a','ui-tab'+(CUR==='home'?' on':''));home.href='home.html';home.innerHTML='<span aria-hidden="true">☀︎</span> وردي اليوم';
  const books=el('button','ui-tab'+(CUR&&CUR!=='home'?' on':''));books.type='button';
  const cb=BOOKS.find(b=>b.key===CUR); books.innerHTML='<span aria-hidden="true">📚</span> '+(cb?cb.t:'المتون')+' <span class="ui-caret" aria-hidden="true">▾</span>';
  books.onclick=openBooks;
  const set=el('button','ui-ico');set.type='button';set.setAttribute('aria-label','الإعدادات');set.textContent='⚙︎';set.onclick=openSettings;
  // a listen button when the text has recordings (data/media.js)
  const lis=el('button','ui-ico');lis.type='button';lis.setAttribute('aria-label','استمع');lis.textContent='🎧';lis.onclick=openListen;
  lis.hidden=!(window.MEDIA&&window.MEDIA[CUR]);
  const sr=el('button','ui-ico');sr.type='button';sr.setAttribute('aria-label','ابحث');sr.textContent='🔍';sr.onclick=openSearch;
  bar.append(home,books,sr,lis,set); nav.replaceWith(bar);
}
/* ---------- self-recitation, word by word («كلمة كلمة») ----------
   Every word starts hidden. The reader recites from memory and reveals the next word to check it, or a whole verse /
   passage at once; «غلطت» marks the last revealed word as a slip (gold, for this session only). Tapping a hidden word
   reveals everything up to it. Works offline and needs no microphone. The page calls start(root) in this mode. */
const RV={root:null,ws:[],i:0,slips:new Set(),bar:null};
function rvBar(){
  if(RV.bar)return RV.bar;
  const b=el('div','stepbar ui-rbar'); b.hidden=true;
  b.innerHTML='<div class="in"><button class="btn" data-a="reset">من جديد</button><button class="btn gold" data-a="slip">غلطت</button><div class="vstat"><small data-k="count"></small><small data-k="hint" class="note"></small></div><button class="btn" data-a="line">البيت كامل</button><button class="btn primary big" data-a="next">الكلمة الجاية</button></div>';
  b.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;({next:rvNext,line:rvLine,slip:rvSlip,reset:rvReset})[a.dataset.a]()});
  document.body.append(b); RV.bar=b; return b;
}
const rvUnitOf=w=>w.closest('.v,.unit')||w.parentElement;
function rvPaint(){
  RV.ws.forEach((w,k)=>{w.classList.toggle('rv',k<RV.i);w.classList.toggle('slip',RV.slips.has(k));w.classList.toggle('cursor',k===RV.i)});
  const b=rvBar(), done=RV.i>=RV.ws.length;
  b.querySelector('[data-k="count"]').textContent=`${ar(RV.i)} / ${ar(RV.ws.length)} كلمة`+(RV.slips.size?` · غلطات ${ar(RV.slips.size)}`:'');
  b.querySelector('[data-k="hint"]').textContent=done?(RV.slips.size?'خلصت، راجع الكلمات الذهبية وسمّع مرة ثانية':'ما شاء الله، سمّعته كامل بدون غلط 🤍'):'سمّع الكلمة من حفظك، وبعدين اكشفها';
  b.querySelector('[data-a="next"]').disabled=done; b.querySelector('[data-a="line"]').disabled=done;
  const cur=RV.ws[RV.i]; if(cur){const r=cur.getBoundingClientRect(),h=b.getBoundingClientRect().height||90;if(r.bottom>innerHeight-h-30||r.top<80)cur.scrollIntoView({block:'center',behavior:'smooth'})}
}
function rvNext(){if(RV.i<RV.ws.length){RV.i++;rvPaint()}}
// the rest of the current verse (or passage) at once
function rvLine(){const w=RV.ws[RV.i];if(!w)return;const u=rvUnitOf(w);while(RV.i<RV.ws.length&&rvUnitOf(RV.ws[RV.i])===u)RV.i++;rvPaint()}
function rvSlip(){if(RV.i>0){const k=RV.i-1;RV.slips.has(k)?RV.slips.delete(k):RV.slips.add(k);rvPaint()}}
function rvReset(){RV.i=0;RV.slips.clear();rvPaint();RV.ws[0]&&RV.ws[0].scrollIntoView({block:'center',behavior:'smooth'})}
function rvClick(e){const w=e.target.closest('.w');if(!w||!RV.root)return;const k=RV.ws.indexOf(w);if(k>=RV.i){RV.i=k+1;rvPaint()}}
function rvKey(e){if(!RV.root||/input|textarea|select/i.test(e.target.tagName))return;if(e.key===' '||e.key==='Enter'){e.preventDefault();rvNext()}}
const reveal={
  start(root,line){if(!root)return;if(RV.root&&RV.root!==root)reveal.stop();
    RV.root=root; RV.ws=[...root.querySelectorAll('.w')]; RV.i=0; RV.slips=new Set();
    root.classList.add('m-reveal'); root.addEventListener('click',rvClick); addEventListener('keydown',rvKey);
    const bar=rvBar(); bar.querySelector('[data-a="line"]').textContent=line||'البيت كامل'; bar.hidden=false; rvPaint()},
  stop(){if(!RV.root)return; RV.root.classList.remove('m-reveal'); RV.root.removeEventListener('click',rvClick); removeEventListener('keydown',rvKey);
    RV.ws.forEach(w=>w.classList.remove('rv','slip','cursor')); RV.root=null; RV.ws=[]; if(RV.bar)RV.bar.hidden=true},
  // stop when the given element is (or holds, or sits inside) the active root
  stopIf(x){if(RV.root&&x&&(x===RV.root||x.contains(RV.root)||RV.root.contains(x)))reveal.stop()},
  active:()=>!!RV.root
};
/* ---------- listening: recitations, explanations, and listen-and-repeat ----------
   window.MEDIA (data/media.js) lists streams per text. One audio element serves the whole page; a slim player bar at the
   top shows what plays, with speed, loop over a chosen stretch (A→B), and a close button. A queue plays a list of
   verses, each repeated N times (talqin). */
const AU={a:null,bar:null,queue:[],qi:0,rep:1,ri:0,A:null,B:null,title:''};
function audioEl(){
  if(AU.a)return AU.a; const a=new Audio(); a.preload='none'; AU.a=a;
  a.addEventListener('timeupdate',()=>{if(AU.A!=null&&AU.B!=null&&a.currentTime>=AU.B)a.currentTime=AU.A;paintBar()});
  a.addEventListener('play',()=>paintBar()); a.addEventListener('pause',()=>paintBar());
  a.addEventListener('waiting',()=>paintBar('بيحمّل…')); a.addEventListener('playing',()=>paintBar());
  a.addEventListener('error',()=>paintBar('ما قدرت أشغّل الملف، تأكد من النت'));
  a.addEventListener('ended',()=>{
    if(AU.queue.length){AU.ri++; if(AU.ri>=AU.rep){AU.ri=0;AU.qi++} if(AU.qi<AU.queue.length){playItem();return} AU.queue=[]; toast('خلص الاستماع للورد 🤍')}
    paintBar()});
  return a;
}
const fmt=t=>{if(!isFinite(t))return '';t=Math.floor(t);return ar(Math.floor(t/60))+':'+ar(String(t%60).padStart(2,'0'))};
function playerBar(){
  if(AU.bar)return AU.bar;
  const b=el('div','ui-player'); b.hidden=true;
  b.innerHTML='<button class="ui-pp" data-a="pp" aria-label="شغّل أو وقّف">▶</button><div class="ui-pinfo"><b data-k="t"></b><small data-k="s"></small></div>'+
    '<button data-a="back" aria-label="رجوع ١٠ ثواني">↺١٠</button><button data-a="rate" aria-label="السرعة">١×</button><button data-a="ab" aria-label="كرّر مقطع">من…لـ</button><button data-a="x" aria-label="سكّر">✕</button>';
  b.addEventListener('click',e=>{const k=e.target.closest('[data-a]');if(!k)return;const a=audioEl();
    ({pp:()=>a.paused?a.play().catch(()=>{}):a.pause(),
      back:()=>{a.currentTime=Math.max(0,a.currentTime-10)},
      rate:()=>{const R=[0.75,1,1.25,1.5];a.playbackRate=R[(R.indexOf(a.playbackRate)+1)%R.length];P.speed=a.playbackRate;save()},
      ab:()=>{if(AU.A==null){AU.A=a.currentTime;toast('حدّدت البداية، اضغط مرة ثانية عند النهاية')}else if(AU.B==null){AU.B=Math.max(AU.A+1,a.currentTime);a.currentTime=AU.A;toast('بيكرر المقطع لحد ما تضغط مرة ثالثة')}else{AU.A=AU.B=null;toast('وقّف تكرار المقطع')}},
      x:()=>{a.pause();AU.queue=[];b.hidden=true;document.body.classList.remove('ui-playing')}})[k.dataset.a]();paintBar()});
  document.body.append(b); AU.bar=b; return b;
}
function paintBar(note){
  const b=playerBar(), a=audioEl(); if(b.hidden)return;
  b.querySelector('[data-a="pp"]').textContent=a.paused?'▶':'⏸';
  b.querySelector('[data-a="rate"]').textContent=ar(String(a.playbackRate).replace('.','٫'))+'×';
  b.querySelector('[data-a="ab"]').classList.toggle('on',AU.A!=null);
  b.querySelector('[data-k="t"]').textContent=AU.title;
  const it=AU.queue[AU.qi], q=AU.queue.length&&it?` · ${it.label||''}${AU.rep>1?' ('+ar(AU.ri+1)+'/'+ar(AU.rep)+')':''}`:'';
  b.querySelector('[data-k="s"]').textContent=typeof note==='string'?note:(fmt(a.currentTime)+(a.duration?' / '+fmt(a.duration):'')+q);
}
function play(url,title){
  const a=audioEl(); AU.queue=[]; AU.title=title||''; AU.A=AU.B=null; a.src=url; a.playbackRate=P.speed||1;
  playerBar().hidden=false; document.body.classList.add('ui-playing'); a.play().catch(()=>paintBar('اضغط ▶ للتشغيل')); paintBar('بيحمّل…');
}
function playItem(){const it=AU.queue[AU.qi];if(!it)return;const a=audioEl();a.src=it.url;a.playbackRate=P.speed||1;a.play().catch(()=>paintBar('اضغط ▶ للتشغيل'));paintBar()}
// listen-and-repeat: items [{url,label}], each played `rep` times
function playQueue(items,title,rep){
  if(!items.length)return; AU.queue=items; AU.qi=0; AU.ri=0; AU.rep=Math.max(1,rep||P.rep||1); AU.title=title; AU.A=AU.B=null;
  playerBar().hidden=false; document.body.classList.add('ui-playing'); playItem();
}
function mediaFor(key){const m=window.MEDIA&&window.MEDIA[key];if(!m)return null;
  if(m.poems){const id=document.body.dataset.poem;return m.poems[id]||null}return m}
function openListen(){
  const m=mediaFor(CUR); const b=sheet('استمع');
  if(!m){b.append(el('p','ui-hint','ما لقينا تسجيلات موثوقة لهالقصيدة لسا. جرّب قصيدة ثانية من «القصائد والترتيب».'));return}
  const row=it=>{
    const r=el('div','ui-track'); const info=el('div','ui-tinfo'); info.append(el('b','',it.t),el('small','',it.by||'')); r.append(info);
    if(it.yt){const a=el('a','btn','يوتيوب ↗');a.href=it.yt;a.target='_blank';a.rel='noopener';r.append(a)}
    else if(it.list){const sel=el('select');it.list.forEach((u,k)=>{const o=el('option','',it.names?it.names[k]:'الدرس '+ar(k+1));o.value=u;sel.append(o)});
      const p=el('button','btn primary','▶');p.setAttribute('aria-label','شغّل');p.onclick=()=>{play(sel.value,it.t+' · '+sel.selectedOptions[0].textContent);closeSheet()};r.append(sel,p)}
    else{const p=el('button','btn primary','▶');p.setAttribute('aria-label','شغّل');p.onclick=()=>{play(it.url,it.t+' · '+(it.by||''));closeSheet()};r.append(p)}
    return r};
  if(m.verse){b.append(field('الاستماع والترديد (تلقين)',seg('مرات التكرار',[[1,'مرة'],[2,'مرتين'],[3,'٣ مرات'],[5,'٥ مرات']],P.rep||1,v=>{P.rep=v;save()}),
    'من «ورد اليوم» اضغط «🎧 استمع للورد»: بيقرأ أبيات وردك بيت بيت بصوت '+m.verseBy+'، وبيكرر كل بيت هالعدد.'))}
  if(m.recite&&m.recite.length){b.append(el('div','ui-lbl','التلاوة والأداء'));m.recite.forEach(it=>b.append(row(it)))}
  if(m.sharh&&m.sharh.length){b.append(el('div','ui-lbl','الشروح'));m.sharh.forEach(it=>b.append(row(it)))}
  b.append(el('p','ui-hint','التسجيلات منشورة على أرشيف الإنترنت ويوتيوب بأسماء أصحابها، والموقع بيشغّلها من هناك. اسمع قبل الاعتماد على أي إنشاد.'));
}

/* ---------- «اختبرني»: the teacher's spot check ----------
   The page passes questions [{label, prompt, answer}] built from what the reader has memorised. One at a time, in a
   random order: the prompt shows (the start of a verse, a whole verse, or the opening words of a passage), the reader
   recites the continuation, reveals it and says whether they had it. A tally shows at the end. */
function quiz(items,title){
  if(!items.length){toast('لسا ما في محفوظ كافي للاختبار');return}
  const order=items.map((x,k)=>[Math.random(),k]).sort((a,b)=>a[0]-b[0]).map(x=>items[x[1]]).slice(0,Math.min(10,items.length));
  let i=0,ok=0,miss=[];
  const b=sheet(title||'اختبرني');
  const box=el('div','ui-quiz'); b.append(box);
  function show(){
    box.replaceChildren();
    if(i>=order.length){
      box.append(el('div','ui-qscore',`${ar(ok)} من ${ar(order.length)}`),el('p','ui-hint',ok===order.length?'ما شاء الله، كلها صح 🤍':'راجع اللي فاتك:'));
      miss.forEach(q=>box.append(el('div','ui-qmiss',q.label)));
      const again=el('button','btn primary','اختبار جديد'); again.onclick=()=>quiz(items,title); box.append(again); return}
    const q=order[i];
    box.append(el('div','ui-lbl',`سؤال ${ar(i+1)} من ${ar(order.length)} · ${q.label}`),el('div','ui-qask',q.ask||'كمّل من حفظك:'));
    const p=el('div','ui-qprompt'); p.textContent=q.prompt; box.append(p);
    const ans=el('div','ui-qans'); ans.textContent=q.answer; ans.hidden=true; box.append(ans);
    const reveal=el('button','btn primary','اكشف الجواب'); box.append(reveal);
    const grade=el('div','grades'); grade.hidden=true; grade.style.gridTemplateColumns='1fr 1fr';
    const yes=el('button','btn primary','حفظته ✓'), no=el('button','btn bad','غلطت ✗');
    yes.onclick=()=>{ok++;i++;show()}; no.onclick=()=>{miss.push(q);i++;show()}; grade.append(no,yes); box.append(grade);
    reveal.onclick=()=>{ans.hidden=false;reveal.hidden=true;grade.hidden=false};
  }
  show();
}

/* ---------- «المتشابهات»: verses that share most of their words, side by side ----------
   items: [{label, text}]. Two items are similar when they share at least three words and at least 40% of the shorter
   one's words (spelling-normalised). Each pair shows both texts with the words that differ marked, which is where
   reciters slip from one into the other. */
function similar(items,title){
  const N=w=>(window.VOICE?VOICE.norm(w):w).replace(/^و(?=...)/,'');
  // particles every verse has (من، في، على…) say nothing about similarity
  const STOP=new Set('من في على عن الي الى او ثم قد لا ما ان اذا لم لن كما مع هو هي كل بها به له لها ذا ذي تا يا'.split(' '));
  const sets=items.map(it=>{const ws=it.text.split(/\s+/);return {ws,set:new Set(ws.map(N).filter(x=>x.length>=2&&!STOP.has(x)))}});
  const pairs=[];
  for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++){
    const A=sets[i].set,B=sets[j].set; let c=0; A.forEach(x=>{if(B.has(x))c++});
    const sc=c/Math.min(A.size,B.size); if(c>=3&&sc>=.4)pairs.push({i,j,sc});
  }
  pairs.sort((a,b)=>b.sc-a.sc);
  const b=sheet(title||'المتشابهات');
  if(!pairs.length){b.append(el('p','ui-hint','ما في أبيات متشابهة كثير بهالجزء. 🤍'));return}
  b.append(el('p','ui-hint',(pairs.length===1?'زوج واحد متشابه.':pairs.length===2?'زوجين متشابهين.':`${ar(pairs.length)} ${pairs.length<=10?'أزواج متشابهة':'زوجًا متشابهًا'}.`)+` الكلمات الملوّنة هي اللي بيختلفوا فيها، وانتبه لها وإنت بتسمّع.`));
  const show=(k,other)=>{const d=el('div','ui-sim');d.append(el('small','',items[k].label));const t=el('div','ui-simt');
    sets[k].ws.forEach((w,x)=>{const s=el('span',other.has(N(w))?'':'diff',w);t.append(s,document.createTextNode(' '))});d.append(t);return d};
  pairs.slice(0,60).forEach(p=>{const card=el('div','ui-simpair');card.append(show(p.i,sets[p.j].set),show(p.j,sets[p.i].set));b.append(card)});
}

/* ---------- floating counter ----------
   The page marks its repetition counter with data-fab. When that counter scrolls out of view (while reading the verses
   further down), a round copy floats at the bottom corner, above any bottom bar, and taps the real one. */
function mountFab(){
  const fab=el('button','ui-fab'); fab.type='button'; fab.hidden=true; fab.setAttribute('aria-label','أضف تكرار'); document.body.append(fab);
  let raf=0;
  const update=()=>{raf=0;
    const t=document.querySelector('[data-fab]');
    const shown=t&&t.offsetParent!==null&&!document.getElementById('uiSheet');
    let off=false; if(shown){const r=t.getBoundingClientRect();off=r.bottom<60||r.top>innerHeight-40}
    // a bar at the bottom (step-by-step, voice recitation) lifts the floating buttons above it: this counter and the pen (annot.js)
    let h=0; document.querySelectorAll('.stepbar,.voicebar,.ui-rbar').forEach(b=>{if(!b.hidden&&getComputedStyle(b).display!=='none')h=Math.max(h,b.getBoundingClientRect().height)});
    const pen=document.querySelector('.ann-btn'); if(pen)pen.style.bottom=h?`calc(${Math.round(h)+12}px + env(safe-area-inset-bottom,0px))`:'';
    fab.hidden=!(shown&&off); if(fab.hidden)return;
    fab.innerHTML=t.innerHTML; fab.classList.toggle('full',t.classList.contains('full')||Number(t.dataset.fabFull)>0);
    fab.style.bottom=`calc(${Math.round(h)+16}px + env(safe-area-inset-bottom,0px))`;
  };
  const later=()=>{if(!raf)raf=setTimeout(update,60)};
  addEventListener('scroll',later,{passive:true}); addEventListener('resize',later);
  new MutationObserver(later).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
  fab.addEventListener('click',()=>{const t=document.querySelector('[data-fab]');if(t){t.click();later()}});
  later();
}

/* ---------- protect progress: ask the browser not to evict storage, nudge a weekly backup, explain installing ---------- */
const hasProgress=()=>{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!==PK&&!/^ui_/.test(k))return true}return false};
function nudges(){
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  const wrap=document.querySelector('.wrap'), bar=document.querySelector('.ui-bar'); if(!wrap||!bar||!hasProgress())return;
  if(!localStorage.getItem('ui_firstSeen'))localStorage.setItem('ui_firstSeen',String(Date.now()));
  // a week counts from the last backup, or from the first visit for someone who never took one
  const last=Math.max(+(localStorage.getItem('ui_lastBackup')||0),+localStorage.getItem('ui_firstSeen')), shown=+(localStorage.getItem('ui_backupNudge')||0), now=Date.now(), WEEK=7*864e5;
  const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
  let msg=null,act=null;
  if(ios&&!standalone&&!localStorage.getItem('ui_installTip')){msg='ثبّت الموقع على الشاشة الرئيسية ليضل تقدمك محفوظ: زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية».';act=()=>localStorage.setItem('ui_installTip','1')}
  else if(now-last>WEEK&&now-shown>2*864e5){msg='صارلك أسبوع بدون نسخة احتياطية. خذ نسخة لكل المتون بضغطة.';act=()=>localStorage.setItem('ui_backupNudge',String(now))}
  if(!msg)return;
  const n=el('div','ui-nudge'); n.append(el('span','',msg));
  const row=el('div','ui-row');
  if(msg.includes('نسخة')){const go=el('button','btn primary','خذ نسخة');go.onclick=()=>{act();n.remove();openSettings();setTimeout(()=>{const b=document.querySelector('.ui-sheet .btn.primary');b&&b.scrollIntoView({block:'center'})},50)};row.append(go)}
  const ok=el('button','btn',msg.includes('نسخة')?'بعدين':'تمام');ok.onclick=()=>{act();n.remove()};row.append(ok);
  n.append(row); bar.after(n);
}
const ready=f=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f):f();
/* ---------- the welcome video ----------
   Everyone new to the site watches it once, to the end, before using it (no sound: text and drawings only; source in the
   miyeea-video project, src/intro). Afterwards it plays only from the settings, where it can be skipped. Someone who already
   has progress here, or arrives on the iPhone icon carrying their progress from Safari (#link=…), is not new. */
const INTRO='ui_intro_seen';
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}}, lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
function introGate(){
  if(lsGet(INTRO))return;
  const known=BOOKS.some(b=>hasState(b.key))||['mutoon_circles','mutoon_tafsir_v1','mutoon_me','mutoon_sync'].some(k=>lsGet(k)!=null)||/#link=/.test(location.hash);
  if(known){lsSet(INTRO,'1');return}
  showIntro(true);
}
function showIntro(must){
  if(document.querySelector('.ui-intro'))return;
  const w=el('div','ui-intro'+(must?' must':''));w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-label','الفيديو التعريفي');
  const v=document.createElement('video');v.src='media/intro.mp4';v.poster='media/intro.jpg';v.muted=true;v.defaultMuted=true;v.playsInline=true;v.preload='auto';
  ['muted','playsinline','webkit-playsinline','disablepictureinpicture'].forEach(a=>v.setAttribute(a,''));v.setAttribute('controlslist','nodownload noplaybackrate noremoteplayback');
  if(!must)v.controls=true;
  const bar=el('div','ui-intro-bar'),fill=el('i');bar.append(fill);
  const left=el('span','ui-intro-left',must?'الفيديو التعريفي':''), foot=el('div','ui-intro-foot');
  const go=el('button','btn primary',must?'يلّا نبلّش':'سكّر');go.type='button';go.hidden=must;
  const play=el('button','ui-intro-play','▶ شغّل الفيديو');play.type='button';play.hidden=true;
  const note=el('div','ui-intro-note');note.hidden=true;
  foot.append(left,go);w.append(v,play,note,bar,foot);document.body.append(w);
  const root=document.documentElement,ov=root.style.overflow;root.style.overflow='hidden';
  const close=()=>{v.pause();w.remove();root.style.overflow=ov;document.removeEventListener('visibilitychange',vis);document.removeEventListener('keydown',key)};
  go.onclick=close;
  const key=e=>{if(e.key==='Escape'&&!must)close()};document.addEventListener('keydown',key);
  const fmt=s=>{s=Math.max(0,Math.ceil(s));return ar(Math.floor(s/60))+':'+ar(String(s%60).padStart(2,'0'))};
  let userPaused=false,lastT=0,lastMove=Date.now();
  const start=()=>v.play().then(()=>{play.hidden=true}).catch(()=>{play.hidden=false});
  play.onclick=()=>{userPaused=false;start()};
  // a tap pauses or resumes (it never skips)
  v.addEventListener('click',()=>{if(!must)return;if(v.paused){userPaused=false;start()}else{userPaused=true;v.pause();play.hidden=false}});
  v.addEventListener('timeupdate',()=>{const d=v.duration||0;if(v.currentTime!==lastT){lastT=v.currentTime;lastMove=Date.now();note.hidden=true}
    fill.style.width=(d?v.currentTime/d*100:0)+'%';if(must&&d)left.textContent='باقي '+fmt(d-v.currentTime)});
  v.addEventListener('ended',()=>{lsSet(INTRO,'1');fill.style.width='100%';left.textContent=must?'ما شاء الله، هيك بتبلّش':'';go.hidden=false;go.textContent=must?'يلّا نبلّش':'سكّر';try{go.focus()}catch(e){}});
  // when the video cannot play (no network, a blocked file), let the reader in; it is offered again on the next visit
  const fail=m=>{if(!must)return;note.hidden=false;note.textContent=m;go.hidden=false;go.textContent='كمّل بدون الفيديو'};
  v.addEventListener('error',()=>fail('ما قدرنا نشغّل الفيديو التعريفي هلأ. بيطلعلك مرة ثانية بعدين.'));
  const watch=setInterval(()=>{if(!document.body.contains(w)){clearInterval(watch);return}
    if(must&&!userPaused&&!v.ended&&document.visibilityState==='visible'&&Date.now()-lastMove>20000)fail('الفيديو بطيء بالتحميل. إذا بدك، كمّل وبيطلعلك بعدين.')},3000);
  const vis=()=>{if(document.visibilityState==='visible'&&!userPaused&&!v.ended)start()};document.addEventListener('visibilitychange',vis);
  start();
}
ready(()=>{mountBar();mountFab();wake();apply();pausedBanner();nudges();setTimeout(readOffer,0);introGate()});

/* ---------- graded fading: hide a growing share of the words (level 1–4 = a quarter … all) ----------
   The words hidden at a level stay hidden at every higher level, and words the reader slipped on before (.wk) hide first,
   so each step up only adds new gaps. Tapping a hidden word peeks at it. */
const FADE_N=4;
function fade(root,level){
  if(!root)return; const ws=root.querySelectorAll('.w');
  ws.forEach((w,i)=>{const h=Math.imul(i+1,2654435761)>>>0, cut=level>=FADE_N?1:level/FADE_N;
    w.classList.toggle('fz',w.classList.contains('wk')?level>0:(h%1000)/1000<cut); w.classList.remove('peek')});
}
/* the floating «الكلمة الجاية» of graded fading: shows while a faded text is on screen and peeks at its hidden words in
   reading order, like the button of «كلمة كلمة»; tapping a hidden word still peeks at that one word */
function mountFadeFab(){
  const b=el('div','stepbar ui-rbar ui-fbar'); b.hidden=true;
  b.innerHTML='<div class="in"><div class="vstat"><small data-k="count"></small></div><button class="btn primary big" data-a="next">الكلمة الجاية</button><button class="btn" data-a="line">الفقرة كاملة</button><button class="btn" data-a="reset">اخفِ من جديد</button></div>';
  document.body.append(b);
  const roots=()=>[...document.querySelectorAll('.m-fade')].filter(r=>r.offsetParent!==null&&!r.classList.contains('m-reveal'));
  const hidden=()=>roots().flatMap(r=>[...r.querySelectorAll('.w.fz:not(.peek)')]);
  const unitOf=w=>w.closest('.v,.unit')||w.parentElement;
  let raf=0;
  const paint=()=>{raf=0;
    const all=roots().flatMap(r=>[...r.querySelectorAll('.w.fz')]), left=all.filter(w=>!w.classList.contains('peek'));
    // only write what changed: the observer below watches the body, this bar included
    const set=(x,k,v)=>{if(x[k]!==v)x[k]=v};
    set(b,'hidden',!all.length||!!document.getElementById('uiSheet')||reveal.active()); if(b.hidden)return;
    set(b.querySelector('[data-k="count"]'),'textContent',`كشفت ${ar(all.length-left.length)} من ${ar(all.length)}`);
    set(b.querySelector('[data-a="next"]'),'disabled',!left.length); set(b.querySelector('[data-a="line"]'),'disabled',!left.length);
    set(b.querySelector('[data-a="line"]'),'textContent',left[0]&&left[0].closest('.v')?'البيت كامل':'الفقرة كاملة');
  };
  const later=()=>{if(!raf)raf=setTimeout(paint,60)};
  const show=w=>{if(!w)return;const r=w.getBoundingClientRect(),h=b.getBoundingClientRect().height||150;if(r.bottom>innerHeight-h-20||r.top<80)w.scrollIntoView({block:'center',behavior:'smooth'})};
  b.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const ws=hidden();
    if(a.dataset.a==='next'&&ws[0]){ws[0].classList.add('peek');show(ws[1]||ws[0])}
    else if(a.dataset.a==='line'&&ws[0]){const u=unitOf(ws[0]);ws.filter(w=>unitOf(w)===u).forEach(w=>w.classList.add('peek'));show(hidden()[0])}
    else if(a.dataset.a==='reset'){roots().forEach(r=>r.querySelectorAll('.w.peek').forEach(w=>w.classList.remove('peek')));show(hidden()[0])}
    paint()});
  addEventListener('scroll',later,{passive:true});
  new MutationObserver(later).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});
  later();
}
ready(mountFadeFab);
function fadeBar(onChange){
  const w=el('div','ui-fade'); const lv=()=>P.fade;
  const lbl=el('span','ui-fade-l'); const set=v=>{P.fade=Math.max(1,Math.min(FADE_N,v));save();paint();onChange(P.fade)};
  const minus=el('button','btn','أسهل'), plus=el('button','btn primary','أصعب'); minus.type=plus.type='button';
  minus.onclick=()=>set(lv()-1); plus.onclick=()=>set(lv()+1);
  function paint(){lbl.textContent=['','ربع الكلمات مخفي','نص الكلمات مخفي','ثلاث أرباعها مخفي','كلها مخفية'][lv()];minus.disabled=lv()<=1;plus.disabled=lv()>=FADE_N}
  // bars are rebuilt on each render, so a detached one stops listening
  const h=()=>{if(!w.isConnected){removeEventListener('prefs',h);return}paint()};
  paint(); addEventListener('prefs',h); w.append(minus,lbl,plus); return w;
}

/* ---------- «تسجيلاتي»: every «سجّل واسمع» recitation, kept on the device (IndexedDB mutoon_rec) ----------
   {id, book, title, label, at, type, blob, slips}. The newest RMAX are kept; each can be played, shared (to a teacher
   on WhatsApp, say) or deleted. Recordings stay on this device: they are not in the backup code or the sync. */
const RMAX=100;
function rdb(){return new Promise((ok,no)=>{if(!window.indexedDB)return no(new Error('no indexedDB'));const q=indexedDB.open('mutoon_rec',1);
  q.onupgradeneeded=()=>q.result.createObjectStore('recs',{keyPath:'id'});q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)})}
async function rtx(mode,fn){const db=await rdb();return new Promise((ok,no)=>{const t=db.transaction('recs',mode),s=t.objectStore('recs');let out;const r=fn(s);if(r)r.onsuccess=()=>out=r.result;t.oncomplete=()=>{db.close();ok(out)};t.onerror=t.onabort=()=>{db.close();no(t.error)}})}
const recAll=()=>rtx('readonly',s=>s.getAll()).then(a=>(a||[]).sort((x,y)=>y.id-x.id)).catch(()=>[]);
async function recSave(r){
  try{await rtx('readwrite',s=>s.put(r)); const all=await recAll(); for(const x of all.slice(RMAX))await rtx('readwrite',s=>s.delete(x.id)); return true}catch(e){return false}}
const recPatch=async(id,p)=>{try{const all=await recAll(),r=all.find(x=>x.id===id);if(r)await rtx('readwrite',s=>s.put(Object.assign(r,p)))}catch(e){}};
const recWhen=r=>{try{return new Intl.DateTimeFormat('ar-JO-u-nu-arab',{weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(new Date(r.at))}catch(e){return r.at}};
async function recShare(r){
  const ext=/mp4|aac|m4a/.test(r.type||r.blob.type)?'m4a':/ogg/.test(r.type||'')?'ogg':'webm';
  const name=('تسميع - '+r.title+' - '+r.label).replace(/[\\/:*?"<>|]/g,'')+'.'+ext;
  const file=new File([r.blob],name,{type:r.blob.type||'audio/mp4'}), text='تسميعي من «'+r.title+'» · '+r.label;
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text});return}}catch(e){if(e.name==='AbortError')return}
  const a=document.createElement('a');a.href=URL.createObjectURL(r.blob);a.download=name;document.body.append(a);a.click();a.remove();toast('انحفظ التسجيل كملف')}
function recRow(r,onDel){
  const d=el('div','ui-rec'); const h=el('div','ui-rec-h');
  const t=el('b','',r.label); t.dataset.noi18n=''; h.append(t,el('small','',r.title+' · '+recWhen(r)+(r.slips?' · '+(r.slips===1?'غلطة وحدة':r.slips===2?'غلطتين':ar(r.slips)+(r.slips<=10?' غلطات':' غلطة')):'')));
  const au=el('audio'); au.controls=true; au.preload='none'; au.setAttribute('playsinline',''); au.src=URL.createObjectURL(r.blob);
  const row=el('div','ui-row'), sh=el('button','btn','📤 ابعثه'), del=el('button','btn','🗑');
  sh.type=del.type='button'; sh.onclick=()=>recShare(r); del.setAttribute('aria-label','احذف التسجيل');
  del.onclick=async()=>{if(!confirm('تحذف هالتسجيل؟'))return;try{await rtx('readwrite',s=>s.delete(r.id))}catch(e){}d.remove();onDel&&onDel()};
  row.append(sh,del); d.append(h,au,row); return d;
}
async function openRecordings(book){
  const b=sheet('تسجيلاتي'); const all=await recAll(); let only=book&&all.some(r=>r.book===book)?book:'';
  const hint=el('div','ui-hint'), list=el('div','ui-col'), sw=el('div');
  const paint=()=>{const rs=all.filter(r=>!only||r.book===only); list.replaceChildren(...rs.map(r=>recRow(r,()=>{all.splice(all.indexOf(r),1);paint()})));
    hint.textContent=all.length?`${ar(rs.length)} تسجيل${only?' بهالمتن':''}. بيضلّوا على جهازك بس، وآخر ${ar(RMAX)} تسجيل بينحفظوا. «📤 ابعثه» بيبعثه لشيخك أو لصاحبك على واتساب.`:'لسا ما في تسجيلات. اختار «🎧 سجّل واسمع» من التسميع بالصوت، وكل تسميع بينحفظ هون.'};
  if(book&&all.some(r=>r.book!==book)){const s=seg('أي تسجيلات',[[book,'هالمتن'],['','كل المتون']],only,v=>{only=v;paint()});sw.append(s)}
  b.append(hint,sw,list); paint();
}

/* ---------- a certificate for finishing a text («شهادة ختم») ----------
   c = {title, what: e.g. "١٠٠ بيت", key}. Drawn on a canvas in Arabic (it is the text's own language), with the reader's
   name if they give one (kept on this device only), the Hijri and Gregorian dates, then shared or saved as a picture. */
function certificate(c){
  const b=sheet('شهادة الختم');
  const name=el('input'); name.type='text'; name.dir='rtl'; name.placeholder='اسمك على الشهادة (اختياري)'; name.value=P.certName||'';
  const img=el('img','ui-cert'); img.alt='شهادة ختم '+c.title;
  const go=el('button','btn primary','📤 احفظها أو شاركها'), note=el('div','ui-hint','الاسم بينحفظ على جهازك بس.');
  b.append(name,img,go,note);
  let blob=null;
  async function draw(){
    const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
    try{await Promise.all(['700 80px Amiri','400 40px Amiri','500 30px "Noto Kufi Arabic"'].map(f=>document.fonts.load(f)))}catch(e){}
    const gold='#A8812F', green='#0E6B4F', ink='#2A2A2A';
    g.fillStyle='#FBF7EE';g.fillRect(0,0,W,H);
    g.strokeStyle=gold;g.lineWidth=6;g.strokeRect(40,40,W-80,H-80);g.lineWidth=2;g.strokeRect(62,62,W-124,H-124);
    // an eight-pointed star in each corner and at the top
    const star=(x,y,r)=>{g.save();g.translate(x,y);g.fillStyle=gold;for(const a of [0,Math.PI/4]){g.save();g.rotate(a);g.fillRect(-r/2,-r/2,r,r);g.restore()}
      g.fillStyle='#FBF7EE';g.beginPath();g.arc(0,0,r*.28,0,7);g.fill();g.restore()};
    [[62,62],[W-62,62],[62,H-62],[W-62,H-62]].forEach(([x,y])=>star(x,y,34)); star(W/2,175,46);
    g.direction='rtl';g.textAlign='center';g.textBaseline='middle';
    const line=(t,y,font,col,max=W-220)=>{g.font=font;g.fillStyle=col;let s=t;while(g.measureText(s).width>max&&s.length>4)s=s.slice(0,-2);g.fillText(s===t?t:s+'…',W/2,y)};
    line('شهادة خَتْم',300,'700 92px Amiri',green);
    line('الحمد لله الذي بنعمته تتمّ الصالحات',400,'400 40px Amiri',ink);
    const nm=name.value.trim();
    line(nm?'بفضل الله وتوفيقه أتمّ':'بفضل الله وتوفيقه تمّ',500,'400 40px Amiri',ink);
    if(nm)line(nm,580,'700 64px Amiri',gold);
    line('حفظ',nm?660:570,'400 40px Amiri',ink);
    line('«'+c.title+'»',nm?760:670,'700 78px Amiri',green);
    if(c.what)line(c.what,nm?850:760,'500 30px "Noto Kufi Arabic"','#6B6B6B');
    const d=new Date(), f=(loc,o)=>{try{return new Intl.DateTimeFormat(loc,o).format(d)}catch(e){return ''}};
    const hij=f('ar-SA-u-ca-islamic-umalqura-nu-arab',{day:'numeric',month:'long',year:'numeric'}), gre=f('ar-JO-u-nu-arab',{day:'numeric',month:'long',year:'numeric'});
    g.strokeStyle=gold;g.lineWidth=2;g.beginPath();g.moveTo(W/2-200,960);g.lineTo(W/2+200,960);g.stroke();
    line('بتاريخ '+hij,1020,'400 38px Amiri',ink); if(gre)line('الموافق '+gre,1075,'400 32px Amiri','#6B6B6B');
    line('اللهم انفعني بما علّمتني، وعلّمني ما ينفعني، وزدني علمًا',1170,'400 34px Amiri',green);
    line('حفظ المتون',1245,'500 24px "Noto Kufi Arabic"',gold);
    blob=await new Promise(r=>cv.toBlob(r,'image/png')); if(img.src)URL.revokeObjectURL(img.src); img.src=URL.createObjectURL(blob);
  }
  let t=0; name.oninput=()=>{P.certName=name.value.trim();save();clearTimeout(t);t=setTimeout(draw,300)};
  go.onclick=async()=>{if(!blob)return; const file=new File([blob],'شهادة ختم - '+c.title+'.png',{type:'image/png'});
    try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'شهادة ختم '+c.title});return}}catch(e){if(e.name==='AbortError')return}
    const a=document.createElement('a');a.href=img.src;a.download=file.name;document.body.append(a);a.click();a.remove()};
  draw();
}

/* the iPhone (above all the home-screen app) can leave the bars fixed at the bottom where the keyboard pushed them,
   halfway up the screen, after it closes. --vvfix is how far the visible bottom lies below the layout bottom, and
   those bars, and the dimmed backdrop under a sheet, move down by it (ui.css); closing the keyboard also makes the page lay itself out again. */
if(window.visualViewport&&/iPad|iPhone|iPod/.test(navigator.userAgent)){
  const vv=visualViewport, root=document.documentElement;
  const fix=()=>{const d=Math.round(vv.offsetTop+vv.height-innerHeight);root.style.setProperty('--vvfix',(d>0?d:0)+'px')};
  vv.addEventListener('resize',fix); vv.addEventListener('scroll',fix); addEventListener('scroll',fix,{passive:true});
  addEventListener('focusout',()=>setTimeout(()=>{scrollTo(scrollX,scrollY);fix()},300));
  fix(); window.vvFix=fix;
}

window.UI={showIntro,status,setStatus,openStatus,readText,similar,quiz,play,playQueue,openListen,mediaFor:k=>mediaFor(k||CUR),toast,fade,fadeBar,fadeLevel:()=>P.fade,reveal,isPaused,setPaused,started,sheet,closeSheet,prefs:()=>P,setPref:(k,v)=>{P[k]=v;save()},openSettings,openBooks,openSearch,report,certificate,recSave,recPatch,recShare,openRecordings,BOOKS,FIELDS};
})();
