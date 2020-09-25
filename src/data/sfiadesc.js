const fs = require('fs');
const path = require('path');
const parser = require('csv-parse/lib/sync');

const db = JSON.parse(fs.readFileSync('./db.json', { encoding: 'utf-8' }));

/**************** SFIA SKILLS  *****************/

// async function process() {
//   for (let sfia of db.sfiaSkills) {
//     try {
//       if (sfia.url == null) {
//         sfia.url = `https://sfia-online.org/en/sfia-7/skills/${sfia.name
//           .split('(')[0]
//           .trim()
//           .toLowerCase()
//           .replace(/\W/g, '-')}`;
//       }
//       console.log('Processing: ' + sfia.url);
//       const result = await fetch(sfia.url, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'text/html'
//         },
//         referrerPolicy: 'no-referrer',
//         mode: 'cors'
//       });

//       const text = await result.text();

//       const root = parse(text);

//       const description = root.querySelector('article');
//       sfia.description = description.innerHTML;
//       console.log('Processed: ' + sfia.url);
//     } catch (ex) {
//       console.log('ERROR!: ' + ex.message);
//     }
//   }

//   fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
// }

// process();

// function addJobs() {
//   const content = fs.readFileSync('./aps_digital_career_pathways.csv', { encoding: 'utf-8' });
//   const data = parser(content);

//   data.shift();

//   function parseRequired(j) {
//     console.log(j);
//     const res = (j || '').split(':')[1];
//     return res ? [res] : [];
//   }

//   function parseSfia(job) {
//     const result = [];
//     for (let i = 0; i < 16; i++) {
//       let s = 16 + i * 3;
//       if (job[s]) {
//         result.push({
//           id: job[s],
//           level: parseInt(job[s + 1]),
//           critical: !!job[s + 2]
//         });
//       } else {
//         break;
//       }
//     }
//     return result;
//   }

//   const jobs = [];
//   let id = 0;
//   for (let job of data) {
//     const def = {
//       id: (id++).toString(),
//       name: job[0],
//       family: job[2],
//       familyFunction: job[3],
//       familyRole: job[4],
//       aps: job[5],
//       discipline: job[6],
//       aka: job[7],
//       description: job[8],
//       apsClassification: job[9],
//       knowledge: job[10],
//       spanOfInfluence: job[11],
//       required: parseRequired(job[12])
//         .concat(parseRequired(job[13]))
//         .concat(parseRequired(job[14])),
//       sfia: parseSfia(job),
//       skills: []
//     };
//     if (def.sfia.length) {
//       jobs.push(def);
//     }
//     // console.log(def);
//   }

//   db.jobs = jobs;
//   fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
// }

// addJobs();

function handleSkills(skills) {
  for (let i = (skills || []).length - 1; i >= 0; i--) {
    let idx = skills.findIndex(skill => skill.id === skills[i].id);
    if (idx !== i) {
      console.log('Duplicate');
      skills.splice(i, 1);
    } else {
      console.log('OK');
    }
  }
}

function defuck() {
  for (let unit of db.units) {
    console.log('Unit: ' + unit.name);
    handleSkills(unit.sfiaSkills);

    for (let block of unit.blocks) {
      handleSkills(block.sfiaSkills);
    }
  }
}
defuck();

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
