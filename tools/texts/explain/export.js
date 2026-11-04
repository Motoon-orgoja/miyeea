// Writes one readable file per chapter of a built prose text for the explanation writers (BRIEF.md):
// <key>/src/<chapter id>.md with the chapter title and its units numbered [n] in order. usage: node export.js <key>
const fs = require('fs'), path = require('path'), key = process.argv[2];
global.window = {}; require(path.join(__dirname, '../../../data', key + '.js')); const B = window.BOOK;
const od = path.join(__dirname, key, 'src'); fs.mkdirSync(od, { recursive: true });
for (const c of B.chapters) fs.writeFileSync(path.join(od, c.id + '.md'), '# ' + c.title + (c.group ? '\n(' + c.group + ')' : '') + '\n\n'
  + c.units.map((u, i) => '[' + (i + 1) + '] ' + u.segs.map(s => s[1]).join(' ')).join('\n\n') + '\n');
console.log(key, B.chapters.length, 'chapters exported');
