// Builds tools/texts/jawharmaknun.txt from the takw.in base (parse-takwin.js) + the recorded corrections below.
// usage: node build.js   → writes ../jawharmaknun.txt and prints every change it made
const fs = require('fs'), path = require('path');
const base = require('./parse-takwin');
const log = [];

// 1) editorial cleanup: example brackets «كَـ(…)», «نَحْوُ (…)», «(…)» and tatweel
// mark order normalized to shadda-first (as in tuhfa.txt)
const ord = s => s.replace(/([ً-ِْ])ّ/g, 'ّ$1');
const clean = s => ord(s).replace(/ـ\(/g, '').replace(/ـ/g, '').replace(/[()]/g, '').replace(/\s+/g, ' ').trim();

// 2) wording/harakat corrections, keyed «verse+hemistich»: [from, to] (exact substrings of the cleaned base)
const FIX = require('./fixes');

// 3) heading cleanup (missing space after «:», missing shadda/sukun)
const HEAD = {
  'الْبَابُ الْخَامِسُ:الْقَصْرُ': 'الْبَابُ الْخَامِسُ: الْقَصْرُ',
  'الْبَابُ السَّابِعُ:الْفَصْلُ وَالْوَصْلُ': 'الْبَابُ السَّابِعُ: الْفَصْلُ وَالْوَصْلُ',
  'الْفَنُّ الثَّانِي:عِلْمُ الْبَيَانِ': 'الْفَنُّ الثَّانِي: عِلْمُ الْبَيَانِ',
  'الْبَابُ الأَوَّلُ:التَّشْبِيهُ': 'الْبَابُ الْأَوَّلُ: التَّشْبِيهُ',
  'الْبَابُ الْثَانِي: الْحَقِيقَةُ وَالْمَجَازُ': 'الْبَابُ الثَّانِي: الْحَقِيقَةُ وَالْمَجَازُ',
  'الفَنُّ الثَّالِثُ: عِلْمُ الْبَدِيعِ': 'الْفَنُّ الثَّالِثُ: عِلْمُ الْبَدِيعِ',
  'الضَرْبُ الْأَوَّلُ: الْمَعْنَوِيُّ': 'الضَّرْبُ الْأَوَّلُ: الْمَعْنَوِيُّ',
  'الضَّرْبُ الثَّانِي:اللَّفْظِيُّ': 'الضَّرْبُ الثَّانِي: اللَّفْظِيُّ',
};

const lines = [];
base.forEach((v, i) => {
  if (v.sec) { const h = HEAD[v.sec] || v.sec; if (h !== v.sec) log.push('head ' + (i + 1) + ': ' + v.sec + ' → ' + h); lines.push('## ' + h); }
  const out = {};
  for (const h of ['a', 'b']) {
    let s = clean(v[h]);
    if (s !== v[h]) log.push('clean ' + (i + 1) + h + ': ' + v[h] + ' → ' + s);
    for (let [from, to, why] of FIX[(i + 1) + h] || []) {
      from = ord(from); to = ord(to);
      if (!s.includes(from)) throw new Error('fix not applicable at ' + (i + 1) + h + ': «' + from + '» in «' + s + '»');
      s = s.replace(from, to); log.push('fix ' + (i + 1) + h + ': ' + from + ' → ' + to + (why ? '  (' + why + ')' : ''));
    }
    // a consonant before a madd alif that has no mark gets its (certain) fatha: «الْكَلامِ» → «الْكَلَامِ»
    s = s.replace(/([بتثجحخدذرزسشصضطظعغفقكلمنهي])ا/g, (m, c, o) => { log.push('fatha ' + (i + 1) + h + ': ' + c + 'ا'); return c + 'َا'; });
    out[h] = s;
  }
  lines.push(out.a + ' | ' + out.b);
});
for (const k of Object.keys(FIX)) if (!/^\d+[ab]$/.test(k) || +k.slice(0, -1) > base.length) throw new Error('bad key ' + k);
const txt = lines.join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, '..', 'jawharmaknun.txt'), txt);
fs.writeFileSync(path.join(__dirname, 'build-log.txt'), log.join('\n') + '\n');
console.log('verses', base.length, 'headings', lines.filter(l => l.startsWith('## ')).length, 'log lines', log.length);
