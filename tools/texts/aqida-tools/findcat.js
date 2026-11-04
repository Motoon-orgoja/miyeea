const get = require('./get.js');
(async () => {
  for (const c of process.argv.slice(3)) {
    const s = await get('https://shamela.ws/category/' + c);
    console.log('cat', c, (s.match(/<title>([^<]*)/) || [])[1]);
    const re = /href="https:\/\/shamela.ws\/book\/(\d+)"[^>]*>([^<]*)/g; let m;
    while (m = re.exec(s)) if (new RegExp(process.argv[2]).test(m[2])) console.log(m[1], m[2].trim());
  }
})();
