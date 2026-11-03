module.exports=function clean(s){
  s=s.replace(/\s*\([٠-٩0-9]+\)/g,'');
  s=s.replace(/(\S)ـ\s*«/g,'$1«');                       // كَـ «x» / وَبِـ «x» → join
  s=s.replace(/(^|\s)([وفبكل][ً-ْ]*)\s+«/g,'$1$2«'); // وَ «أَلْ» → join
  s=s.replace(/ـ/g,'');
  s=s.replace(/[«»]/g,'');
  s=s.replace(/\s+-\s+|\s+-(?=[،\s]|$)|(^|\s)-\s+/g,' ');
  s=s.replace(/[،؛:.!؟]/g,'');
  return s.replace(/\s+/g,' ').trim();
};
