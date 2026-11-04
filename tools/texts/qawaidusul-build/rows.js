// base rows after the recorded fixes (fixes.js)
const fs = require('fs'), path = require('path');
module.exports = () => { const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/rakaiz-rows.json'), 'utf8')); return require('./fixes.js')(rows); };
