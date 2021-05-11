// const fs = require('fs');
// const data = JSON.parse(fs.readFileSync('./db.json', { encoding: 'utf-8' }));
// const units = JSON.parse(fs.readFileSync('./units.json', { encoding: 'utf-8' }));

// data.units = data.units.filter(u => u.name.indexOf('(Advanced)') == -1).filter(u => u.level < 7);
// data.units = data.units.map(u => {
//   let un = units.find(f => f.id === u.id);
//   if (un) {
//     console.log('Doing: ' + un.name);
//   }
//   return {
//     id: u.id,
//     name: u.name,
//     blocks: u.blocks,
//     credits: u.credits,
//     level: u.level,
//     offer: u.offer,
//     prerequisites: u.prerequisites,
//     sfiaSkills: un?.sfiaSkills,
//     topics: u.topics
//   };
// });

// for (let unit of data.units) {
//   unit.blocks = unit.blocks.map(b => ({
//     id: b.id,
//     name: b.name,
//     credits: b.credits,
//     prerequisites: b.prerequisites?.length ? b.prerequisites : undefined,
//     sfiaSkills: b.sfiaSkills?.length ? b.sfiaSkills : undefined
//   }));
// }

// delete data.blocks;

// fs.writeFileSync('./db.jar.json', JSON.stringify(data.units, null, 2), { encoding: 'utf-8' });

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./db.jar.json', { encoding: 'utf-8' }));
data.sfia = data.sfiaSkills.map(s => {
  delete s.description;
  return s;
});
fs.writeFileSync('./db.jar.json', JSON.stringify(data, null, 2), { encoding: 'utf-8' });
