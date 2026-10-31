// The book prints honorifics as glyphs of the AGA Arabesque font; the transcribers wrote them as words by guess.
// The text layer tells which glyph each one is, so: per page, when the transcription has as many honorific phrases as
// the page has glyphs, rewrite them in order with what each glyph says. Other pages are listed for a look.
// usage: node honor.js <pages dir> [--write]
const fs=require('fs'),path=require('path');
const P=require('./items.json'),dir=process.argv[2],write=process.argv.includes('--write');
const G={f072:'ﷺ',f074:'رضي الله عنه',f079:'رضي الله عنهم',f075:'عليه السلام',f059:'جل جلاله',f055:'عز وجل'};
const RX=/ﷺ|رضي الله (?:عنهما|عنهم|عنها|عنه)|عليهما السلام|عليهم السلام|عليه السلام|جل جلاله|جلّ جلاله|عز وجل|عزّ وجلّ|رحمهما الله|رحمهم الله|رحمه الله/g;
let ok=0,changed=0;const bad=[];
for(const f of fs.readdirSync(dir).filter(f=>/^p\d{3}\.md$/.test(f)).sort()){
  const p=+f.slice(1,4), glyphs=P[p-1].items.filter(i=>/Arabesque/.test(i.f)).flatMap(i=>[...i.s].map(c=>c.codePointAt(0).toString(16))).filter(g=>g!=='f05b'&&g!=='f05d'); // f05b/f05d are Quran brackets
  const src=fs.readFileSync(path.join(dir,f),'utf8'), found=src.match(RX)||[];
  if(!glyphs.length&&!found.length)continue;
  // «رضي الله عنها» is often printed in words (for Aisha): leave those out when that makes the counts agree
  const PRINTED=['رضي الله عنها','عليهم السلام'], words=found.length!==glyphs.length&&found.filter(m=>!PRINTED.includes(m)).length===glyphs.length;
  if(!words&&found.length!==glyphs.length||glyphs.some(g=>!G[g])){bad.push(`p${f.slice(1,4)}: ${glyphs.length} glyphs [${glyphs.map(g=>G[g]||g).join('، ')}] vs ${found.length} in text [${found.join('، ')}]`);continue}
  let i=0;const out=src.replace(RX,m=>{if(words&&PRINTED.includes(m))return m;const w=G[glyphs[i++]];if(w!==m)changed++;return w});
  ok++; if(write&&out!==src)fs.writeFileSync(path.join(dir,f),out);
}
console.log('pages aligned',ok,'phrases changed',changed,'pages to check',bad.length);
console.log(bad.join('\n'));
