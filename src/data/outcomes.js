const fs = require('fs');

const db = require('./db.json');
const files = fs.readdirSync('./units');
var s = require('./units/200022.json');

const ids = [];
for (let unitPath of files) {
  s = require('./units/' + unitPath);
  ids.push(s.lg.lg_id);
}

fs.writeFileSync('ids', JSON.stringify(ids));
