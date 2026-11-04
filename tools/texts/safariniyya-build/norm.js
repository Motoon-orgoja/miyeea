// normalize for wording comparison: drop harakat/tatweel, unify alef/yaa/taa marbuta, glue detached proclitics (ب قدرة → بقدرة، فب القضاء → فبالقضاء)
module.exports = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^\u0621-\u064A\s]/g, ' ').replace(/\s+/g, ' ').trim().replace(/(^| )([وف]?[بكل]|ف) (?=\S)/g, '$1$2');
