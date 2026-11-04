const get = require('./get.js');
(async () => { const b = process.argv[2]; const s = await get('https://shamela.ws/book/' + b);
  const a = (s.match(/shamela.ws\/author\/(\d+)/) || [])[1]; console.log('author', a);
  const t = await get('https://shamela.ws/author/' + a);
  const re = /href="https:\/\/shamela.ws\/book\/(\d+)"[^>]*>([^<]*)/g; let m; while (m = re.exec(t)) console.log(m[1], m[2].trim()); })();
