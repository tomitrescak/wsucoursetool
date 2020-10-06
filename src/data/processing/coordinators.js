const fs = require('fs');

const db = require('../db.json');
const unitList = require('../units.json');

for (let unit of db.units) {
  let u = unitList[unit.id];
  if (u) {
    console.log('Assigning: ' + unit.name);
    unit.coordinator = u.coordinator;
  } else {
    console.log('Missing: ' + unit.name);
  }
}

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
