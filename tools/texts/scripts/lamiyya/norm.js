const H=/[\u064B-\u0652\u0670\u0640]/g;
exports.norm=s=>s.replace(H,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
 .replace(/[«»"'(),.،:؛!?\[\]\-–…*٠-٩0-9]/g,' ').replace(/\s+/g,' ').trim();
exports.H=H;
