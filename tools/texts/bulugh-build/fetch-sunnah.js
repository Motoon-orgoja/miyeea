// Downloads sunnah.com/bulugh/<book> pages 1..16. usage: node fetch-sunnah.js <outdir>
const fs=require('fs'),path=require('path'),get=require('./get.js');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
(async()=>{for(let b=1;b<=16;b++){const f=path.join(out,b+'.html');if(fs.existsSync(f)&&fs.statSync(f).size>10000)continue;const d=await get('https://sunnah.com/bulugh/'+b);fs.writeFileSync(f,d);console.log(b,d.length,(d.match(/arabic_hadith_full/g)||[]).length)}})();
