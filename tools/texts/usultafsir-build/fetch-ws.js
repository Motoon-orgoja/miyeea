// Downloads the Wikisource raw wikitext of «مقدمة في التفسير» (standalone) and the matching pages of مجموع الفتاوى ج13 into ../raw/usultafsir
const https = require('https'), fs = require('fs'), path = require('path');
const get = u => new Promise((ok, no) => https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => { const b = []; r.on('data', c => b.push(c)); r.on('end', () => ok(Buffer.concat(b).toString('utf8'))) }).on('error', no));
const R = path.join(__dirname, '../raw/usultafsir');
const M = ['مقدمة في التفسير وعلوم القرأن', 'فصل في أن النبي بين لأصحابه معاني القرآن كما بين لهم ألفاظه', 'فصل في ذكر خلاف السلف في التفسير', 'فصل في الاختلاف في التفسير',
  'فصل في ذكر النوع الثاني من الاختلاف في التفسير', 'فصل في قول القائل ما أحسن طرق التفسير', 'فصل في تفسير التابعين للقرآن الكريم', 'فصل في ذكر من انحرف عن القرآن الكريم',
  'فصل في حكم إجراء القرآن على الظاهر', 'سئل عمن فسر القرآن برأيه', 'سئل عمن نسخ القرآن والحديث بيده', 'سئل عن قول النبي أنزل القرآن على سبعة أحرف', 'سئل عن جمع القراءات السبع'];
(async () => {
  const raw = t => get('https://ar.wikisource.org/w/index.php?title=' + encodeURIComponent(t) + '&action=raw');
  fs.writeFileSync(path.join(R, 'wikisource-muqaddima-fi-tafsir.wiki'), await raw('مقدمة في التفسير'));
  let i = 0; for (const t of M) { i++; fs.writeFileSync(path.join(R, `wikisource-majmu13-${String(i).padStart(2, '0')}.wiki`), await raw('مجموع الفتاوى/المجلد الثالث عشر/' + t)); }
  console.log('ok');
})();
