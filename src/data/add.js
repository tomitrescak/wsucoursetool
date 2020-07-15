const fs = require('fs');

const db = require('./db.orig.json');
const files = fs.readdirSync('./units');
const unitList = require('./units.json');
var s = require('./units/200022.json');

const allowedUnits = Object.keys(unitList);

function findMaxId(collection) {
  let id = 0;
  for (let item of collection) {
    if (parseInt(item.id) >= id) {
      id = parseInt(item.id) + 1;
    }
  }
  return id;
}

function names(...acts) {
  for (let act of acts) {
    if (act) {
      return act.data;
    }
  }
  return '';
}

function processRequisites(val) {
  val = (val || '').trim();
  // val = val.replace(/(\d\d\d\d\d\d)/g, '<a href="/editor/units/prerequisite-$1">$1</a>');
  return val;
}

// let currentId = findMaxId(db.blocks);

let theory = ['exam', 'test', 'quiz'];

for (let unitPath of files) {
  s = require('./units/' + unitPath);
  console.log('Processing: ' + unitPath);

  let blockId = 0;

  if (allowedUnits.indexOf(s.lg.unit_code) === -1) {
    console.log(`Skipping ${s.lg.unit_code}: Not a CDMS unit`);
    continue;
  }

  if (s.lg.state !== 'Published') {
    console.log('Skipping: ' + s.lg.unit_code + ' ' + s.lg.unit_name);
    continue;
  }

  let savedUnit = db.units.find(u => u.id === s.lg.unit_code);
  if (savedUnit == null) {
    savedUnit = {
      id: s.lg.unit_code,
      blocks: []
    };
    console.log('Adding: ' + s.lg.unit_code);
    db.units.push(savedUnit);
  }

  savedUnit.description = s.lg.handbook_summary;
  savedUnit.assumedKnowledge = s.lg.assumed_knowledge;
  savedUnit.approachToLearning = s.lg.approach_to_learning;
  savedUnit.lgId = s.lg.lg_id;

  if (savedUnit.blocks && savedUnit.blocks.length) {
    console.log('Already processed: ' + savedUnit.id);
    continue;
  }

  let outcomes = fs.existsSync(`./outcomes/${s.lg.lg_id}.json`)
    ? require(`./outcomes/${s.lg.lg_id}.json`)
    : { outcomes: '' };

  savedUnit.name = s.lg.unit_name;
  savedUnit.outcome =
    (s.lg.learning_outcomes_intro || '') +
    (s.lg.learning_outcomes_intro ? '\n\n' : '') +
    outcomes.outcomes;

  if (s.lg.prerequisites) {
    savedUnit.unitPrerequisites = processRequisites(s.lg.prerequisites);
    savedUnit.prerequisite = Array.from(s.lg.prerequisites.matchAll(/\d\d\d\d\d\d/g)).map(
      o => o[0]
    );
  }
  if (s.lg.corequisites) {
    savedUnit.corequisites = processRequisites(s.lg.corequisites);
  }
  if (s.lg.incompatible) {
    savedUnit.incompatible = processRequisites(s.lg.incompatible);
  }
  savedUnit.passCriteria = s.lg.pass_criteria;
  savedUnit.credits = s.lg.credit_points;
  savedUnit.level = s.lg.unit_level;

  // console.log(JSON.stringify(savedUnit, null, 2));

  // parse lecture blocks

  s.data.forEach(
    data => (data.data = (data.data || '').replace('<p>', '').replace('<br></p>', ''))
  );

  for (let wk = 1; wk < 15; wk++) {
    let week = s.data.filter(w => parseInt(w.week) === wk);

    if (week.length === 0) {
      continue;
    }

    let topic = week.find(f => f.col_name === 'Topic');
    let activities = week.find(f => f.col_name === 'Activities');
    let lecture = week.find(f => f.col_name === 'Lecture');
    let tutorial = week.find(f => f.col_name === 'Tutorial');
    let workshop = week.find(f => f.col_name === 'Workshop');
    let practical = week.find(f => f.col_name === 'Prac/Lab');
    let instructions = week.find(f => f.col_name === 'Instructions');

    let block = {
      id: savedUnit.id + '_' + (++blockId).toString(),
      name: names(topic, lecture, activities, practical, tutorial, workshop),
      description: instructions ? instructions.data : '',
      week: wk
    };
    block.activities = [];
    let aid = 0;
    if (lecture || topic) {
      block.activities.push({
        id: aid++,
        type: 'knowledge',
        // name: 'Lecture',
        description: instructions ? instructions.data : '',
        name: 'Lecture: ' + (lecture ? lecture.data : topic.data),
        lengthHours: 2
      });
    }
    if (practical || tutorial || workshop) {
      block.activities.push({
        id: aid++,
        type: 'practical',
        // name: practical ? 'Practical' : tutorial ? 'Tutorial' : 'Workshop',
        // description: practical ? practical.data : tutorial ? tutorial.data : workshop.data,
        name:
          (practical ? 'Practical' : tutorial ? 'Tutorial' : 'Workshop') +
          ': ' +
          (practical ? practical.data : tutorial ? tutorial.data : workshop.data),
        lengthHours: 2
      });
    }
    savedUnit.blocks.push(block);
  }

  // parse asignment blocks and create completion criteria

  savedUnit.completionCriteria = {};
  savedUnit.completionCriteria.type = 'allOf';
  savedUnit.completionCriteria.criteria = [];

  for (let ass of s.ass_sum) {
    let asss = s.ass.filter(a => a.ass_id === ass.id);
    let week = asss.length === 1 ? parseInt(asss[0].week.match(/\d+/)[0]) : 15;

    // add block
    const assessmentBlock = {
      id: savedUnit.id + '_' + (++blockId).toString(),
      ass_id: ass.id,
      name: ass.name,
      weight: ass.weight,
      ulos: ass.ulos,
      threshold: ass.threshold,
      due_date: ass.due_date,
      week,
      activities: []
    };

    savedUnit.completionCriteria.criteria.push({
      weight: ass.weight,
      type: 'block',
      id: assessmentBlock.id
    });

    if (asss.length === 1) {
      let examType = theory.find(t => ass.name.toLowerCase().indexOf(t) >= 0);
      let type = examType ? 'exam' : 'assignment';
      assessmentBlock.activities.push({
        id: 0,
        type,
        // name: examType ? examType[0].toUpperCase() + examType.substring(1) : 'Assignment',
        name: ass.name,
        lengthHours: 2
      });
    }

    if (asss.length > 1) {
      let i = 1;
      for (let part of asss) {
        let name = part.name + ' ' + i + '.';
        let examType = theory.find(t => name.toLowerCase().indexOf(t) >= 0);
        let type = examType ? 'exam' : 'assignment';
        savedUnit.blocks.push({
          id: savedUnit.id + '_' + (++blockId).toString(),
          ass_id: ass.id,
          name,
          week: parseInt(part.week.match(/\d+/)[0]),
          activities: [
            {
              id: i,
              type,
              // name: examType ? examType[0].toUpperCase() + examType.substring(1) : 'Assignment',
              // description: name,
              name,
              lengthHours: 2
            }
          ]
        });

        assessmentBlock.activities.push({
          id: i,
          type,
          // name: examType[0].toUpperCase() + examType.substring(1),
          // description: name,
          name,
          lengthHours: 2
        });

        i++;
      }
    }

    savedUnit.blocks.push(assessmentBlock);
  }

  // sort by week
  savedUnit.blocks.sort((a, b) => (a.week < b.week ? -1 : 1));

  // add blocks to db
  db.blocks.push(...savedUnit.blocks);

  // remap
  savedUnit.blocks = savedUnit.blocks.map(b => b.id);
}

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });
