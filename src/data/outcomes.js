// const fs = require('fs');

// const db = require('./db.json');
// const files = fs.readdirSync('./units');
// var s = require('./units/200022.json');

// const ids = [];
// for (let unitPath of files) {
//   s = require('./units/' + unitPath);
//   ids.push(s.lg.lg_id);
// }

// fs.writeFileSync('ids', JSON.stringify(ids));

// ADD BLOCKS TO UNITS

const fs = require('fs');

const db = require('./db.json');

for (let unit of db.units) {
  let ix = 0;
  unit.blocks = unit.blocks.map(id => {
    const res = db.blocks.find(b => b.id == id);
    const origId = res.id;
    const newId = `${ix++}`;

    let cc = (unit.completionCriteria.criteria || []).find(c => c.id === origId);
    if (cc) {
      cc.id = newId;
    }

    res.id = newId;
    return res;
  });
}

fs.writeFileSync('./db1.json', JSON.stringify(db, null, 2));
