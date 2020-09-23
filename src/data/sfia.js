const parser = require('csv-parse/lib/sync');
const fs = require('fs');

const sfiaCategories = [
  {
    id: '0',
    name: 'Strategy and Architecture',
    subcategories: [
      { id: '0-0', name: 'Information Strategy' },
      { id: '0-1', name: 'Advice and Guidance' },
      { id: '0-2', name: 'Business Strategy and Planning' },
      { id: '0-3', name: 'Technical Strategy and Planning' }
    ]
  },
  {
    id: '1',
    name: 'Change and Transformation',
    subcategories: [
      { id: '1-0', name: 'Business Change Implementation' },
      { id: '1-1', name: 'Business Change Management' }
    ]
  },
  {
    id: '2',
    name: 'Development and Implementation',
    subcategories: [
      { id: '2-0', name: 'Systems Development' },
      { id: '2-1', name: 'User Experience' },
      { id: '2-2', name: 'Installation and Integration' }
    ]
  },
  {
    id: '3',
    name: 'Delivery and Operation',
    subcategories: [
      { id: '3-0', name: 'Service Design' },
      { id: '3-1', name: 'Service Transition' },
      { id: '3-2', name: 'Service Operation' }
    ]
  },
  {
    id: '4',
    name: 'Skills and Quality',
    subcategories: [
      { id: '4-0', name: 'Skills Management' },
      { id: '4-1', name: 'People Management' },
      { id: '4-2', name: 'Quality and Conformance' }
    ]
  },
  {
    id: '5',
    name: 'Relationships and Engagement',
    subcategories: [
      { id: '5-0', name: 'Stakeholder Management' },
      { id: '5-1', name: 'Sales and Marketing' }
    ]
  }
];

const content = fs.readFileSync('./SFIA.csv', { encoding: 'utf-8' });
const data = parser(content);
const db = JSON.parse(fs.readFileSync('./db.backup.json', { encoding: 'utf-8' }));

function niceName(name) {
  return name
    .split(' ')
    .map(s => (s.length < 4 ? s.toLowerCase() : s[0] + s.substring(1).toLowerCase()))
    .join(' ');
}

function findMaxId(collection) {
  return findNumericMaxId(collection).toString();
}

function findNumericMaxId(collection) {
  let id = 0;
  for (let item of collection) {
    if (parseInt(item.id) >= id) {
      id = parseInt(item.id) + 1;
    }
  }
  return id;
}

let category = '';
let subcategory = '';
let skill = '';
let code = '';
let level = -1;
let skillId = '';

for (let row of data) {
  if (row[0]) {
    category = niceName(row[0]).trim();
  }
  if (row[1]) {
    subcategory = niceName(row[1]).trim();
  }
  if (row[2]) {
    skill = niceName(row[2]).trim();
  }
  if (row[3] && code !== row[3]) {
    code = row[3];

    // add non existent skill
    let sfiaSkill = db.sfiaSkills.find(s => s.name.indexOf(`(${code})`) >= 0);

    if (sfiaSkill == null) {
      let cat = sfiaCategories.find(c => c.name === category);
      let sub = cat.subcategories.find(c => c.name === subcategory);
      sfiaSkill = {
        id: findMaxId(db.sfiaSkills),
        name: `${skill} (${code})`,
        description: '',
        acsSkillId: '',
        category: cat.id,
        url: `https://sfia-online.org/en/sfia-7/skills/${skill.toLowerCase().replace(/\W/g, '-')}`,
        subCategory: sub.id
      };
      db.sfiaSkills.push(sfiaSkill);
    }

    skillId = sfiaSkill.id;
    // console.log(`${category} > ${subcategory} > ${skill} > ${code}`);
  }

  level = -1;
  if (row[4]) {
    level = 1;
  } else if (row[5]) {
    level = 2;
  } else if (row[6]) {
    level = 3;
  } else if (row[7]) {
    level = 4;
  } else if (row[8]) {
    level = 5;
  } else if (row[9]) {
    level = 6;
  } else if (row[10]) {
    level = 7;
  }

  const units = row[11];
  if (units.trim()) {
    let value = units.trim().replace(/\*/g, '');
    let values = value
      .split(',')
      .flatMap(v => v.split(' '))
      .map(v => v.trim())
      .filter(v => v);

    for (let value of values) {
      let unit = db.units.find(u => u.id === value);
      if (unit == null) {
        console.log('Not found: ' + value);
        continue;
      }

      if (unit.sfiaSkills == null) {
        unit.sfiaSkills = [];
      }
      const newSkill = {
        id: skillId,
        level,
        flagged: true
      };
      unit.sfiaSkills.push(newSkill);
    }
  }
}
fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
