// Base rows after fixes.js (text rows only — headings are collated too, they are part of the matn).
const fs = require('fs'), path = require('path');
module.exports = () => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/base-rows.json'), 'utf8'));
  const fx = path.join(__dirname, 'fixes.js');
  return fs.existsSync(fx) ? require(fx)(rows) : rows;
};
