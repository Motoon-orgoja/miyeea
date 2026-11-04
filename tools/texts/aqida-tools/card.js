const get = require('./get.js');
(async () => {
  for (const b of process.argv.slice(2)) {
    const s = await get('https://shamela.ws/book/' + b);
    const t = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const i = t.indexOf('الكتاب :');
    console.log('== ' + b + ': ' + t.slice(i, i + 900));
    const pages = [...s.matchAll(/shamela.ws\/book\/\d+\/(\d+)/g)].map(m => +m[1]);
    console.log('page ids', Math.min(...pages), Math.max(...pages), pages.length);
  }
})();
