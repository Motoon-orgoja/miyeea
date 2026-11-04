// Cleaning of one al-Qasim line (everything here is orthographic or a logged fix; see the sources reports).
const { locate } = require('./quran');
const log = [];
function clean(line, key, no) {
  let t = line.normalize('NFC').replace(/^\*\s*/, '').trim();
  // Qur'an quotes -> Mushaf imla'i text between ﴿﴾
  t = t.replace(/\{([^}]*)\}/g, (_, q) => { const r = locate(q); log.push({ key, no, ref: r.ref, cost: r.cost, quote: q.trim(), mushaf: r.text }); return '﴿' + r.text + '﴾' });
  // tanween before alif written as in the Mushaf: «مُخْلِصاً» -> «مُخْلِصًا»
  t = t.replace(/اً/g, 'ًا');
  // the name of Allah with its shadda and dagger-less fatha everywhere: «اللهُ» -> «اللَّهُ»
  t = t.replace(/الله(?=[\u064E\u064F\u0650])/g, 'اللَّه');
  return t.replace(/\s+/g, ' ').trim();
}
module.exports = { clean, log };
