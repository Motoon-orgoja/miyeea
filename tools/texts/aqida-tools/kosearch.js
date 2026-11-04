const get = require('./get.js');
(async () => { for (const q of process.argv.slice(2)) {
  const s = await get('https://backend.ketabonline.com/api/v2/books?q=' + encodeURIComponent(q) + '&limit=50');
  let j; try { j = JSON.parse(s) } catch (e) { console.log(s.slice(0, 300)); continue }
  const arr = j.data || j; console.log('##', q, Array.isArray(arr) ? arr.length : Object.keys(j));
  for (const b of (Array.isArray(arr) ? arr : [])) console.log(b.id, '|', b.title, '|', (b.authors || []).map(a => a.name).join(','), '|', b.publisher || '', '|', b.pages_count || b.page_count || '');
}})();
