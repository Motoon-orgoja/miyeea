module.exports=s=>s.replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
 .replace(/[«»"“”،؛:.!؟()\[\]\-…*]/g,' ').replace(/[٠-٩0-9]/g,' ').replace(/\s+/g,' ').trim()
 .replace(/(^| )([وفبكل]{1,2}) (?=\S)/g,'$1$2');
