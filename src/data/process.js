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
// g.__db = require('../data/db.json');
let id = 0;

// data.sfiaSkills = data.sfiaSkills.map(s => ({
//   id: s.id,
//   name: s.name,
//   url: s.url
// }));

data.units.forEach(u => {
  u.blocks.forEach(b => (b.id = b.blockId));
});

// data.units.forEach(u => {
//   if (u.blocks == null) {
//     u.blocks = [];
//   }
//   if (u.blocks.length) {
//     u.sfiaSkills = [];
//   }
//   // if (u.topics == null) {
//   //   u.topics = [];
//   // }
//   // u.credits = 10;

//   // u.blocks.forEach(b => {
//   //   b.blockId = u.id + '-' + id++;
//   //   if (b.credits == null) {
//   //     b.credits = 0;
//   //   }

//   //   // if we have a parent topics
//   //   if (u.topics && u.topics.length) {
//   //     b.topics = u.topics.map(t => ({ id: t, ratio: 1 / u.topics.length }));
//   //   } else {
//   //     b.topics = [{ id: 'n/a', ratio: 1 }];
//   //   }

//   //   if (b.prerequisites == null) {
//   //     b.prerequisites = [];
//   //   }
//   //   if (b.name == null) {
//   //     b.name = 'Empty';
//   //   }
//   // });

//   // if (u.blocks == null || u.blocks.length == 0) {
//   //   if (u.topics && u.topics.length) {
//   //     u.topics = u.topics.map(t => ({
//   //       id: t,
//   //       ratio: Math.round((1 / u.topics.length) * 100) / 100
//   //     }));
//   //   }
//   // } else {
//   //   u.topics = [];
//   // }
// });

fs.writeFileSync('./db.jar.json', JSON.stringify(data, null, 2), { encoding: 'utf-8' });
