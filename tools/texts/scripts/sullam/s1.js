const fs=require('fs'),{norm}=require('./norm.js');const R='C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/sullam/';
// wikisource
const W=[],WS={};for(const l of fs.readFileSync(R+'wikisource.wiki','utf8').split('\n')){let m=l.match(/^==(.+)==$/);if(m){WS[W.length+1]=m[1];continue}
 m=l.match(/^(\d+)-\s*(.+?)\s*\*\*\*\s*(.+)$/);if(m){if(+m[1]!==W.length+1)throw 'ws '+m[1];W.push([m[2].trim(),m[3].trim()])}}
// fatih
const F=[];for(const l of fs.readFileSync(R+'fatihsyuhud.txt','utf8').split('\n')){const m=l.match(/^(\d+) (.+)$/);if(m)F.push({n:+m[1],t:m[2].trim()})}
// hazimi candidates
const C=[];for(const [f,tag] of [['q.txt','36107'],['h.txt','36056']])for(const l of fs.readFileSync(f,'utf8').split('\n')){if(!l)continue;const [p,t]=l.split('\t');
 const parts=t.replace(/\s*<div$/,'').split(/\s*(?:\.\.\.|…)\s*/);if(parts.length!==2||/\.\s*\./.test(t.replace(/\.\.\./,'')))continue;C.push({tag,p,a:parts[0].trim(),b:parts[1].trim()})}
console.log('W',W.length,'F',F.length,'C',C.length);
fs.writeFileSync('sullam-parsed.json',JSON.stringify({W,WS,F,C}));
