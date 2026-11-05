// Builds the daily tafsir ward's data from tools/texts/raw/tafsir (tools/tafsir-fetch.js):
//   data/quran/index.js        window.QURAN = {suras:[[name, ayat]], tafasir:[{k,t,by,g,size}]} (g: the group in the settings)
//   data/quran/<s>.json         the Uthmani text of sura s (quran.com), one string per ayah
//   data/tafsir/<k>/<s>.json    one tafsir of sura s, one string per ayah: plain paragraphs (\n\n), Quran quoted as ﴿…﴾;
//                               "" where the tafsir explains this ayah together with an earlier one (quran.com groups them)
// usage: node tools/build-tafsir.js
const fs = require('fs'), path = require('path'), https = require('https');
const root = path.join(__dirname, '..'), R = path.join(__dirname, 'texts/raw/tafsir');
// id: a quran.com tafsir id, 'jalalayn' (api.quran-tafseer.com), 'app-<slug>' (tafsir.app, tools/tafsir-fetch-app.js)
// or 'qp-<book>' (Quranpedia's dumps, tools/tafsir-qp.js)
const S = 'تفاسير مختصرة', M = 'تفاسير معاصرة', L = 'تفاسير مطوّلة';
// specialized books (sp: an ayah they say nothing about is null, shown as such, not as part of an earlier passage)
const AS = 'أسباب النزول', MA = 'التفسير بالمأثور', GH = 'غريب القرآن ومعانيه', IR = 'إعراب القرآن', AH = 'أحكام القرآن', QR = 'القراءات', NS = 'الناسخ والمنسوخ', MN = 'منتقاة من كلام الأئمة';
const TAFASIR = [
  { k: 'muyassar', id: 16, g: S, t: 'التفسير الميسر', by: 'نخبة من العلماء · مجمع الملك فهد' },
  { k: 'mukhtasar', id: 'app-mukhtasar', g: S, t: 'المختصر في التفسير', by: 'مركز تفسير للدراسات القرآنية' },
  { k: 'mukhtasarik', id: 'qp-521', g: S, t: 'مختصر تفسير ابن كثير', by: 'اختصار محمد علي الصابوني' },
  { k: 'taysiraliy', id: 'qp-1575', g: S, t: 'تيسير العلي القدير لاختصار تفسير ابن كثير', by: 'محمد نسيب الرفاعي (ت ١٤١٢هـ)' },
  { k: 'muntakhab', id: 'qp-10', g: S, t: 'المنتخب في تفسير القرآن', by: 'لجنة من علماء الأزهر · المجلس الأعلى للشؤون الإسلامية' },
  { k: 'jalalayn', id: 'jalalayn', g: S, t: 'تفسير الجلالين', by: 'جلال الدين المحلي وجلال الدين السيوطي' },
  { k: 'wajeez', id: 'app-alwajeez', g: S, t: 'الوجيز', by: 'علي بن أحمد الواحدي (ت ٤٦٨هـ)' },
  { k: 'zimneen', id: 'app-zimneen', g: S, t: 'تفسير ابن أبي زمنين', by: 'محمد بن عبد الله بن أبي زمنين (ت ٣٩٩هـ) · مختصر تفسير يحيى بن سلام' },
  { k: 'tasheel', id: 'app-altasheel', g: S, t: 'التسهيل لعلوم التنزيل', by: 'ابن جزي الكلبي (ت ٧٤١هـ)' },
  { k: 'nasafi', id: 'app-alnasafi', g: S, t: 'تفسير النسفي (مدارك التنزيل)', by: 'أبو البركات النسفي (ت ٧١٠هـ)' },
  { k: 'baydawi', id: 'app-albaydawee', g: S, t: 'تفسير البيضاوي (أنوار التنزيل)', by: 'ناصر الدين البيضاوي (ت ٦٨٥هـ)' },
  { k: 'saadi', id: 91, g: M, t: 'تفسير السعدي', by: 'عبد الرحمن بن ناصر السعدي (ت ١٣٧٦هـ)' },
  { k: 'aysar', id: 'app-aysar-altafasir', g: M, t: 'أيسر التفاسير', by: 'أبو بكر جابر الجزائري (ت ١٤٣٩هـ)' },
  { k: 'tadabbur', id: 'app-tadabbur-wa-amal', g: M, t: 'تدبر وعمل', by: 'مركز تدبر' },
  { k: 'uthaymeen', id: 'app-ibn-uthaymeen', g: M, t: 'تفسير ابن عثيمين', by: 'محمد بن صالح العثيمين (ت ١٤٢١هـ) · ما فسّره من السور' },
  { k: 'safwa', id: 'qp-160', g: M, t: 'صفوة التفاسير', by: 'محمد علي الصابوني (ت ١٤٤٢هـ)' },
  { k: 'zuhaili', id: 'qp-70', g: M, t: 'التفسير الوسيط للزحيلي', by: 'وهبة الزحيلي (ت ١٤٣٦هـ)' },
  { k: 'shaarawi', id: 'qp-18', g: M, t: 'تفسير الشعراوي (خواطر)', by: 'محمد متولي الشعراوي (ت ١٤١٩هـ) · ما سُجّل من خواطره' },
  { k: 'wasit', id: 93, g: M, t: 'التفسير الوسيط', by: 'محمد سيد طنطاوي (ت ١٤٣١هـ)' },
  { k: 'adwaa', id: 'app-adwaa-albayan', g: M, t: 'أضواء البيان', by: 'محمد الأمين الشنقيطي (ت ١٣٩٣هـ)' },
  { k: 'ibnashur', id: 'app-ibn-aashoor', g: M, t: 'التحرير والتنوير', by: 'محمد الطاهر ابن عاشور (ت ١٣٩٣هـ)' },
  { k: 'qasimi', id: 'app-mahasin-altaweel', g: M, t: 'محاسن التأويل', by: 'جمال الدين القاسمي (ت ١٣٣٢هـ)' },
  { k: 'baghawi', id: 94, g: L, t: 'تفسير البغوي', by: 'الحسين بن مسعود البغوي (ت ٥١٦هـ)' },
  { k: 'ibnkathir', id: 14, g: L, t: 'تفسير ابن كثير', by: 'إسماعيل بن كثير (ت ٧٧٤هـ)' },
  { k: 'zad', id: 'app-zad-almaseer', g: L, t: 'زاد المسير', by: 'ابن الجوزي (ت ٥٩٧هـ)' },
  { k: 'qurtubi', id: 'app-qurtubi', g: L, t: 'تفسير القرطبي', by: 'محمد بن أحمد القرطبي (ت ٦٧١هـ)' },
  { k: 'fathqadeer', id: 'app-fath-alqadeer', g: L, t: 'فتح القدير', by: 'محمد بن علي الشوكاني (ت ١٢٥٠هـ)' },
  { k: 'tabari', id: 15, g: L, t: 'تفسير الطبري', by: 'محمد بن جرير الطبري (ت ٣١٠هـ)' },
  { k: 'wahidiasbab', id: 'qp-asbab-book-2919', g: AS, sp: 1, t: 'أسباب النزول للواحدي', by: 'علي بن أحمد الواحدي (ت ٤٦٨هـ)' },
  { k: 'muharrar', id: 'qp-asbab-book-460', g: AS, sp: 1, t: 'المحرر في أسباب نزول القرآن', by: 'خالد بن سليمان المزيني · من خلال الكتب التسعة' },
  { k: 'ibnabihatim', id: 'app-ibn-abi-hatim', g: MA, sp: 1, t: 'تفسير ابن أبي حاتم', by: 'ابن أبي حاتم الرازي (ت ٣٢٧هـ) · ما وصل منه' },
  { k: 'siraj', id: 'app-siraaj-ghareeb', g: GH, sp: 1, t: 'السراج في بيان غريب القرآن', by: 'محمد بن عبد العزيز الخضيري' },
  { k: 'muyassargharib', id: 'app-almuyassar-ghareeb', g: GH, sp: 1, t: 'الميسر في غريب القرآن', by: 'مركز الدراسات القرآنية · مجمع الملك فهد' },
  { k: 'ibnqutayba', id: 'app-ghareeb-ibn-qutaybah', g: GH, sp: 1, t: 'تفسير غريب القرآن لابن قتيبة', by: 'عبد الله بن مسلم بن قتيبة (ت ٢٧٦هـ)' },
  { k: 'farraa', id: 'app-farraa', g: GH, sp: 1, t: 'معاني القرآن للفراء', by: 'يحيى بن زياد الفراء (ت ٢٠٧هـ)' },
  { k: 'zajjaj', id: 'app-zajjaj', g: GH, sp: 1, t: 'معاني القرآن وإعرابه للزجاج', by: 'أبو إسحاق الزجاج (ت ٣١١هـ)' },
  { k: 'mujtaba', id: 'qp-e3rab-book-180', g: IR, sp: 1, t: 'المجتبى من مشكل إعراب القرآن', by: 'أحمد بن محمد الخراط' },
  { k: 'daas', id: 'app-iraab-daas', g: IR, sp: 1, t: 'إعراب القرآن للدعاس', by: 'أحمد عبيد الدعاس وأحمد محمد حميدان وإسماعيل محمود القاسم' },
  { k: 'darweesh', id: 'app-iraab-aldarweesh', g: IR, sp: 1, t: 'إعراب القرآن وبيانه', by: 'محيي الدين درويش (ت ١٤٠٣هـ)' },
  { k: 'ikleel', id: 'app-alikleel', g: AH, sp: 1, t: 'الإكليل في استنباط التنزيل', by: 'جلال الدين السيوطي (ت ٩١١هـ)' },
  { k: 'harrasi', id: 'app-ilkia-alharrasee', g: AH, sp: 1, t: 'أحكام القرآن للكيا الهراسي', by: 'إلكيا الهراسي الشافعي (ت ٥٠٤هـ)' },
  { k: 'jassas', id: 'app-aljasas', g: AH, sp: 1, t: 'أحكام القرآن للجصاص', by: 'أبو بكر الجصاص الحنفي (ت ٣٧٠هـ)' },
  { k: 'ibnalarabi', id: 'app-ahkam-ibn-alarabee', g: AH, sp: 1, t: 'أحكام القرآن لابن العربي', by: 'أبو بكر ابن العربي المالكي (ت ٥٤٣هـ)' },
  { k: 'nashr', id: 'app-alnashir', g: QR, sp: 1, t: 'النشر في القراءات العشر', by: 'ابن الجزري (ت ٨٣٣هـ) · فرش الحروف' },
  { k: 'tahbeer', id: 'app-tahbeer-altayseer', g: QR, sp: 1, t: 'تحبير التيسير في القراءات العشر', by: 'ابن الجزري (ت ٨٣٣هـ)' },
  { k: 'eedah', id: 'qp-nasekh-book-2391', g: NS, sp: 1, t: 'الإيضاح لناسخ القرآن ومنسوخه', by: 'مكي بن أبي طالب (ت ٤٣٧هـ)' },
  { k: 'ibnqayyim', id: 'app-ibn-alqayyim', g: MN, sp: 1, t: 'تفسير ابن القيم', by: 'ما جُمع من كلام ابن قيم الجوزية (ت ٧٥١هـ) في التفسير' },
];
// tafsir.app text: plain lines; drop the edition's page marks (p-٦٩٣) and the editors' notes [[…]]
const cleanApp = t => !t ? '' : t.replace(/\[\[[\s\S]*?\]\]/g, '').replace(/\(p-[٠-٩0-9]+\)/g, '').split(/\n+/).map(p => p.replace(/[ \t\r]+/g, ' ').trim()).filter(Boolean).join('\n\n');
const get = url => new Promise((ok, no) => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (motoon app build)' } }, r => {
  let s = ''; r.setEncoding('utf8'); r.on('data', d => s += d); r.on('end', () => ok(s)) }).on('error', no));
const num = s => +String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (a, n) => String.fromCharCode(+n));
// quran.com tafsir html -> plain paragraphs; a Quran quote ({ … } in a qpc-hafs span) becomes ﴿…﴾
function clean(h) {
  if (!h) return '';
  h = h.replace(/<span class="[^"]*qpc-hafs[^"]*">\s*\{\s*([\s\S]*?)\s*\}\s*<\/span>/g, '﴿$1﴾');
  h = h.replace(/<\/(p|div|h\d|li)>|<br\s*\/?>/gi, '\n\n').replace(/<[^>]+>/g, '');
  // al-Wasit's paragraphs come joined at a full stop («…النفس فضل تمكن .وجئ بالخبر…»)
  h = h.replace(/ ?\.(?=[ء-ي"(])/g, '.\n\n');
  return ent(h).split(/\n\s*\n/).map(p => p.replace(/[ \t\r\n]+/g, ' ').trim()).filter(Boolean).join('\n\n');
}
(async () => {
  const Q = JSON.parse(fs.readFileSync(path.join(R, 'quran.json'), 'utf8')).verses;
  const nf = path.join(R, 'chapter-names.json');
  if (!fs.existsSync(nf)) fs.writeFileSync(nf, await get('https://api.quran.com/api/v4/chapters?language=ar'));
  const CH = JSON.parse(fs.readFileSync(nf, 'utf8')).chapters;
  const qd = path.join(root, 'data/quran'); fs.mkdirSync(qd, { recursive: true });
  for (const c of CH) fs.writeFileSync(path.join(qd, c.id + '.json'), JSON.stringify(Q.filter(v => +v.verse_key.split(':')[0] === c.id).map(v => v.text_uthmani.trim())));
  const ready = [];
  for (const T of TAFASIR) {
    const src = path.join(R, String(T.id)); if (!fs.existsSync(src) || fs.readdirSync(src).length < 114) { console.log('skip', T.k, '(not downloaded)'); continue }
    const od = path.join(root, 'data/tafsir', T.k); fs.mkdirSync(od, { recursive: true }); let size = 0;
    for (const c of CH) {
      let out;
      if (String(T.id).startsWith('app-')) out = JSON.parse(fs.readFileSync(path.join(src, c.id + '.json'), 'utf8')).map(cleanApp);
      // Quranpedia: light html (<br />, the Quran in book-ayah spans already marked ﴿…﴾)
      else if (String(T.id).startsWith('qp-')) out = JSON.parse(fs.readFileSync(path.join(src, c.id + '.json'), 'utf8')).map(t => cleanApp(ent((t || '').replace(/<br\s*\/?>|\r/gi, '\n').replace(/<[^>]+>/g, ''))));
      else if (T.id === 'jalalayn') out = JSON.parse(fs.readFileSync(path.join(src, c.id + '.json'), 'utf8')).map(t => clean(t).replace(/«([^»]*)»/g, '﴿$1﴾'));
      else { out = Array(c.verses_count).fill('');
        for (const t of JSON.parse(fs.readFileSync(path.join(src, c.id + '.json'), 'utf8')).tafsirs) out[+t.verse_key.split(':')[1] - 1] = clean(t.text) }
      // a book that repeats a passage's text under each of its ayat: keep it once, on the first (the page shows it for the rest)
      // a specialized entry headed by its range («[البقرة: 183 - 184]», «[١-٢]») covers the ayat after it too
      if (T.sp) out.forEach((t, i) => { const m = t && /\[(?:[^\]:]{2,20}:\s*)?([0-9٠-٩]+)\s*[-–]\s*([0-9٠-٩]+)\]/.exec(t.slice(0, 800)); if (!m) return;
        const a = num(m[1]), b = num(m[2]); if (a !== i + 1 || b <= a || b - a > 20) return; for (let k = i + 1; k < Math.min(b, out.length); k++) if (!out[k]) out[k] = t });
      if (T.sp) out = out.map((t, i) => !t ? null : i && out[i - 1] === t ? '' : t);
      else out = out.map((t, i) => t && out.slice(0, i).lastIndexOf(t) >= 0 && out.slice(0, i).filter(Boolean).pop() === t ? '' : t);
      const j = JSON.stringify(out); size += Buffer.byteLength(j); fs.writeFileSync(path.join(od, c.id + '.json'), j);
    }
    ready.push({ k: T.k, t: T.t, by: T.by, g: T.g, ...(T.sp ? { sp: 1 } : {}), size: Math.round(size / 1048576 * 10) / 10 });
    console.log(T.k, (size / 1048576).toFixed(1) + 'MB');
  }
  fs.writeFileSync(path.join(qd, 'index.js'), '// Generated by tools/build-tafsir.js\nwindow.QURAN=' + JSON.stringify({ suras: CH.map(c => [c.name_arabic.replace(/^ابراهيم$/, 'إبراهيم'), c.verses_count]), tafasir: ready }) + ';\n');
})().catch(e => { console.error(e); process.exit(1) });
