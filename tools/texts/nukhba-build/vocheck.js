// lists words in nukhba.json with no harakat at all, or with a letter-run lacking marks
const j=require('../nukhba.json');const H=/[ً-ْ]/;
let tot=0,bad=[];
for(const c of [{title:'',paras:[j.basmala]},...j.chapters])for(const p of c.paras)for(const w of p.split(/\s+/)){const a=w.replace(/[^ء-ْٰ]/g,'');if(!a)continue;tot++;if(!H.test(a)&&a.length>1)bad.push(w);}
console.log('words',tot,'unvocalized',bad.length);console.log(bad.join(' '));
// also check tatweel and odd chars
const all=JSON.stringify(j);console.log('tatweel',(all.match(/ـ/g)||[]).length,'brackets',(all.match(/[\[\]\(\)\{\}]/g)||[]).length, 'digits',(all.match(/[0-9٠-٩]/g)||[]).length);
