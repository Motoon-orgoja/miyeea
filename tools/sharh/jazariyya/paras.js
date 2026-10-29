// Load all paragraphs of ketabonline book 102293 (المنح الفكرية، ن مكتب الرحاب) from the cache, in order.
// Each paragraph: {page, html, text} where text keeps the «(…)» quote markers as plain parentheses.
const fs=require('fs');const {ketabPage}=require('../fetch.js');
const BOOK=102293,PAGES=105;
async function load(){
  const out=[];
  for(let p=1;p<=PAGES;p++){const c=await ketabPage(BOOK,p,1,'jazariyya');if(!c)continue;
    const ps=[...c.matchAll(/<p class="g-paragraph[^>]*>([^]*?)<\/p>/g)].map(m=>m[1].replace(/<a href="#p[^]*?<\/a>/g,''));
    ps.forEach((h,k)=>{const quotes=[...h.matchAll(/<span class="g-parentheses[^"]*">([^]*?)<\/span>/g)].map(m=>m[1].replace(/<[^>]+>/g,''));
      const text=h.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
      out.push({page:p,k,text,quotes,first:k===0})})}
  return out;
}
module.exports={load,BOOK};
