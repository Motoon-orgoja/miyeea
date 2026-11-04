// Builds tools/texts/qurra.txt from
//   K (ketabonline 12554 = الشاملة الذهبية, ed. عبد الله ولد إسلم ولد فتى 1418هـ) for verses 1–342 and 395–398,
//   Q (archive.org qura_20210419, hand-transcribed from the page images) for verses 343–394, which K omits,
// with the word-level corrections listed in FIX (each one argued in qurra-sources.md). Prints a change log.
// usage: node build.js
const fs = require('fs'), path = require('path');
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'assembled.json'), 'utf8')); // [a,b] × 398, numbering = final numbering
// verse: [hemistich 'a'|'b', from, to]
const FIX = {
  4: [['b', 'مادارَ', 'ما دارَ']],                          // spacing (N «(ما دار) أي تقلب»)
  7: [['a', 'أُوِلي', 'أُولِي']],                           // kasra on the wrong letter
  21: [['a', 'إن استهم', 'أنِ استهم']],                     // N: «(أن) بفتح الهمزة تفسيرية»; Q
  28: [['a', 'وردُ', 'وَرَدْ']],                            // rhyme with «المُعْتَمَدْ» (Q)
  32: [['a', 'وحملةْ', 'وحَمَلَتْ']],                       // verb (N «وحملت آمنة», Q «وحَمَلَتْ»)
  17: [['b', 'همةْ', 'همّتْ']],                             // verb (N «همت بمنعه», Q «همّت»)
  57: [['a', 'خيرَُ', 'خيرَ']],                             // two vowels on one letter; N: «خير منصوب نعت»
  116: [['a', 'كما لها', 'كمْ لها']],                       // N «كم تكثيرية»; «كما» breaks the rajaz
  309: [['b', 'زكم', 'وكم']],                               // misprint (N «وكم من الأموات»)
  263: [['a', 'الُمد', 'المُد']],                    // damma misplaced on the lam of «ال»
  396: [['b', 'اسمى', 'أسمى']],                             // hamza (Q)
  59:[['b', 'إذ بنا الحجرْ', 'إذ بَنَى الحجرْ']],          // verb بنى (Q, N)
  72: [['b', 'أرْبا', 'أَرْبَى']],                          // verb أربى (N)
  73: [['b', 'ستاً', 'تسعاً']],                             // N + its commentary (49 years); K, Q: ستا
  74: [['a', 'وبعد ما', 'وبعدما']],                         // spacing (Q, N)
  83: [['b', 'يالها', 'يا لها']],                           // spacing (N)
  98: [['a', 'ثم بنا بها', 'ثم بَنَى بها']],                // verb بنى (N)
  168: [['a', 'بنا بزينب', 'بَنَى بزينب']],                 // verb بنى (N)
  248: [['b', 'والسغديهْ', 'والسعديهْ']],                  // name of the armour (N; sira sources)
  316: [['a', 'ضمئوا', 'ظمئوا']],                           // ظمئ = thirsted (N)
  322: [['b', 'مالم', 'ما لم']],                            // spacing (N)
  355: [['b', 'مدى الز', 'مدى الزمانِ']],                   // Q's line is cut off; N: «مدى الزمان»
  357: [['b', 'أنجم', 'أنجم السما']],                       // Q's line is cut off; N p453 and K's identical verse 342
  358: [['b', 'سيءٌ', 'مسيءٌ']],                            // N (commented: «قد سما صفة لقوله مسيء»)
  373: [['a', 'يا ربذ', 'يا ربّ']],                          // misprint in Q; N
  377: [['b', 'الممصطفى', 'المصطفى']],                       // misprint in Q; N
};
const log = [];
const out = V.map(([a, b], i) => {
  const n = i + 1, v = { a, b };
  for (const [k, from, to] of FIX[n] || []) {
    if (!v[k].includes(from)) throw new Error(`fix ${n}${k}: «${from}» not in «${v[k]}»`);
    v[k] = v[k].replace(from, to); log.push(`${n}${k}: ${from} → ${to}`);
  }
  for (const k of ['a', 'b']) {
    const before = v[k];
    v[k] = v[k].replace(/[()]/g, ' ')                      // brackets the editor put round abjad dates «(حيِّ)»
      .replace(/عبدالله/g, 'عبد الله').replace(/ـ/g, '')    // spacing; tatweel
      .replace(/\s+/g, ' ').trim();
    if (v[k] !== before && !/[()]/.test(before)) log.push(`${n}${k}: spacing/tatweel «${before}»`);
  }
  return v;
});
// headings: the poem's own chapter verses «بيان …» / «ذكر وفاته …» — the first hemistich is used as the heading
const lines = ['## المقدمة'];
out.forEach((v, i) => {
  if (/^بيانُ? |^ذكر (وفاته|دوابه)/.test(v.a)) lines.push('## ' + v.a);
  lines.push(v.a + ' | ' + v.b);
});
fs.writeFileSync(path.join(__dirname, '..', 'qurra.txt'), lines.join('\n') + '\n');
const all = out.map(v => v.a + v.b).join('');
const letters = (all.match(/[ء-ي]/g) || []).length, marks = (all.match(/[ً-ْ]/g) || []).length;
const words = out.flatMap(v => (v.a + ' ' + v.b).split(' ')), bare = words.filter(w => !/[ً-ْ]/.test(w)).length;
console.log('verses', out.length, 'headings', lines.filter(l => l.startsWith('## ')).length);
console.log(`marks per letter ${(marks / letters * 100).toFixed(1)}%  words with no mark ${bare}/${words.length}`);
fs.writeFileSync(path.join(__dirname, 'build-log.txt'), log.join('\n') + '\n');
console.log(log.join('\n'));
