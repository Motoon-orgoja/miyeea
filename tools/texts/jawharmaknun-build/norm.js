// skeleton for wording comparison: drop harakat/tatweel/punct, unify alef/yaa/taa marbuta, glue detached و/ك
module.exports=s=>s.replace(/[\u064B-\u0652\u0670\u0640\u06E1\u0610-\u061A]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
 .replace(/[^\u0621-\u064A\s]/g,' ').replace(/\s+/g,' ').trim().replace(/(^| )([وك]) /g,'$1$2');
