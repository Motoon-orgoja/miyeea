// usage: node vocpeek.js <shamelaBook> <page...> — prints vocalization ratio and a sample of each page
const { get } = require('./get.js');
(async () => {
  const [b, ...ps] = process.argv.slice(2);
  for (const p of ps) {
    const d = await get(`https://shamela.ws/book/${b}/${p}`);
    const t = d.slice(d.indexOf('class="nass')).split('id="appended_pages"')[0].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
    const L = (t.match(/[ء-ي]/g) || []).length, H = (t.match(/[ً-ْ]/g) || []).length;
    console.log('--', b, p, 'letters', L, 'harakat/letter', (H / L).toFixed(2), '\n', t.slice(0, 600));
  }
})();
