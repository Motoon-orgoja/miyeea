// Writes tools/texts/safariniyya.txt from matched.json (Lawami' wording/vocalization) + headings.json,
// applying the documented corrections (see safariniyya-sources.md).
const fs = require('fs'), path = require('path');
const M = require('./matched.json'), H = require('./headings.json');
const V = M.map(r => r.law.map(s => s.trim()));
const fix = (n, half, from, to) => { if (!V[n - 1][half].includes(from)) throw new Error('fix ' + n + ': ' + from); V[n - 1][half] = V[n - 1][half].replace(from, to); };
const set = (n, half, to) => { V[n - 1][half] = to; };
// --- wording (each backed by the edition 6382 and/or Ibn Uthaymeen and/or Lawami's own commentary) ---
set(46, 1, 'فَثَابِتٌ مِنْ غَيْرِ مَا تَمْثِيلِ');            // Lawami p903 (the 213 quote drops «ما», meter breaks)
fix(77, 0, 'وَاجِبٌ', 'وَاجِبًا');                            // ED+UTH, خبر ليس
set(89, 0, 'كَمُلْحِدٍ وَسَاحِرٍ وَسَاحِرَةْ');              // full quote at Lawami p390 (script matched it short)
set(96, 0, 'وَنَحْنُ فِي إِيمَانِنَا نَسْتَثْنِي');          // «أيضا» not in ED/UTH nor in Lawami's own commentary; meter
fix(98, 0, 'نَقُلْ', 'تَقُلْ');                               // ED+UTH + Lawami commentary ((وَلَا تَقُلْ))
fix(100, 0, 'الرُّجُوعِ', 'الرُّكُوعِ');                      // ED+UTH + Lawami commentary (الركوع والسجود)
fix(120, 1, 'أَسْبَابِ', 'أَرْبَابِ');                        // ED+UTH + Lawami commentary «أرباب الوفا»
fix(123, 0, 'فِي كُلِّ', 'مِنْ كُلِّ');                       // ED+UTH + Lawami commentary ((مِنْ كُلِّ الْوَرَى))
fix(138, 0, 'وَالْمِعْرَاجِ', 'كَالْمِعْرَاجِ');              // ED+UTH
fix(141, 1, 'فِي غَيْرِ', 'مِنْ غَيْرِ');                     // ED+UTH + Lawami commentary ((مِنْ غَيْرِ امْتِرَا))
set(206, 1, 'وَمَالِكٍ مُحَمَّدِ الصِّنْوَانِ');              // ED+UTH + Lawami commentary (no «و»); tanween dropped for the meter
// --- vocalization / spelling ---
fix(13, 0, 'بِالدُّرَةِ', 'بِالدُّرَّةِ');
fix(18, 1, 'مَنَازِل ', 'مَنَازِلَ ');                        // Lawami commentary p70 (مَنَازِلَ الرِّضْوَانِ)
fix(164, 1, 'تَابَعُوهُمْ', 'تَابِعُوهُمْ');                  // noun (أتباع التابعين), Lawami commentary p840 «ثُمَّ تَابِعِيهِمْ»
fix(43, 1, 'الْعُلَى', 'الْعُلَا');                           // spelled with alif as in ED+UTH and Lawami v.15
const HFIX = { 19: 'مُقَدِّمَةٌ فِي تَرْجِيحِ مَذْهَبِ السَّلَفِ عَلَى مَذْهَبِ الْخَلَفِ',
  105: 'فَصْلٌ فِي ذِكْرِ الرُّوحِ وَالْكَلَامِ عَلَيْهَا', 115: 'فَصْلٌ فِي أَمْرِ الْمَعَادِ',
  184: 'الْخَاتِمَةُ نَسْأَلُ اللَّهَ تَعَالَى حُسْنَ الْخَاتِمَةِ فِي ذِكْرِ الْأَدِلَّةِ وَمَا يَتَعَلَّقُ بِهَا' };
const heads = {}; heads[1] = 'الدُّرَّةُ الْمُضِيَّةُ';
for (const h of H) {
  if (h.before === 58 && /الرزق/.test(h.ed)) continue;          // duplicated (misplaced) heading in 6382; the real one is before v.70
  if (h.before === 171 && /^فِي الْأَمر/.test(h.ed)) continue;   // sub-line under الباب السادس, repeats the فصل before v.179
  let t = HFIX[h.before] || h.voc;
  if (h.before === 43) t = t.replace('أَئِمَّةِ السَّلَفِ', 'أَئِمَّةُ السَّلَفِ');
  heads[h.before] = t;
}
const out = [];
V.forEach((v, i) => {
  if (heads[i + 1]) out.push('## ' + heads[i + 1]);
  if (v.length !== 2 || !v[0] || !v[1]) throw new Error('verse ' + (i + 1) + ' not two halves');
  out.push(v[0] + ' | ' + v[1]);
});
fs.writeFileSync(path.join(__dirname, '..', 'safariniyya.txt'), out.join('\n') + '\n');
console.log('verses', V.length, 'headings', Object.keys(heads).length);
