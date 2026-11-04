// usage: node ko2txt.js <ko.json>  — one paragraph per line, page markers; ayah spans marked with {…}
const a = require(require('path').resolve(process.argv[2]));
for (const x of a) { if (!x || !x.content) continue; console.log('=== page ' + x.page);
  x.content.split(/<\/p>/).map(p => p.replace(/<a [^>]*class="g-copy[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()).filter(Boolean).forEach(p => console.log(p)); }
