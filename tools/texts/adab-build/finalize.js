// filled.txt -> ../adab.txt : hemistich-split words marked «ـ» on both sides, the listed corrections applied (each logged).
const fs = require('fs'), path = require('path');
const P = f => path.join(__dirname, f);
const log = [];
const FIX = [ // [verse no., from, to, reason]
  [13, 'مِنْ كلُ أَمْجَدِ', 'مِنْ كُلِّ أَمْجَدِ', '«كلُ» بالضم لحن بعد «مِنْ» (ونقص الشدة)؛ في غذاء الألباب وموارد الظمآن «كُلِّ»'],
  [184, '{وَتَزَوَّدُوا}', '﴿وَتَزَوَّدُوا﴾', 'قوسا الآية'],
  [221, 'و (يس)', 'و«يس»', 'القوسان التحريريان حول اسم السورة'],
  [647, 'أو الـ | الحريمَ', 'أو الـ | حريمَ', 'تكرار «ال» عند قسمة الكلمة بين الشطرين في نص الشاملة'],
];
let vn = 0;
const out = fs.readFileSync(P('filled.txt'), 'utf8').split('\n').filter(l => l.trim()).map(l => {
  if (l.startsWith('##')) return l;
  vn++;
  for (const [n, a, b, why] of FIX) if (n === vn) {
    if (!l.includes(a)) throw new Error('fix ' + n + ' not found: ' + a + ' in ' + l);
    l = l.replace(a, b); log.push(`fix ${n}: «${a}» -> «${b}» (${why})`);
  }
  if (/ـ \| (?!ـ)/.test(l)) { l = l.replace(/ـ \| /, 'ـ | ـ'); log.push(`split ${vn}: added «ـ» at the start of the 2nd hemistich`); }
  return l;
});
fs.writeFileSync(path.join(__dirname, '..', 'adab.txt'), out.join('\n') + '\n');
fs.writeFileSync(P('finalize-log.txt'), log.join('\n') + '\n');
console.log('verses', vn, 'log', log.length);
