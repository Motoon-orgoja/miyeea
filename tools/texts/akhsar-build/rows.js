// base rows: Rakaiz text after the recorded fixes (fixes.js), then the common wording of the Ajami edition (ajami-readings.js)
const fs = require('fs'), path = require('path');
module.exports = (opt = {}) => {
  const rows = require('./fixes.js')(JSON.parse(fs.readFileSync(path.join(__dirname, 'out/rakaiz-rows.json'), 'utf8')));
  return opt.rakaizOnly ? rows : require('./ajami-readings.js')(rows);
};
