// Turns the downloaded commentary pages into one plain reference text for the explanation writers.
// usage: node extract-ref.js <out.txt> <html files…>   (shamela: the .nass div; other sites: the long Arabic lines)
const fs = require('fs');
const [out, ...files] = process.argv.slice(2);
const pageNo = f => +(f.match(/(\d+)\.html$/) || [0, 0])[1];
const txt = files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map(f => {
  let h = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '');
  const m = h.match(/<div class="nass[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="text-center|<\/div>)/);
  if (m) h = m[1];
  const t = h.replace(/<br\s*\/?>|<\/p>|<\/div>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#\d+;/g, '')
    .split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(s => s.length > 25 && (s.match(/[ء-ي]/g) || []).length / s.length > .5);
  return '=== ص ' + pageNo(f) + '\n' + t.join('\n');
}).join('\n\n');
fs.writeFileSync(out, txt); console.log(out, txt.length);
