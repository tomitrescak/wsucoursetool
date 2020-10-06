import {
  CourseConfig,
  Course,
  CompletionCriteria,
  CourseCompletionCriteria,
  Unit,
  Block,
  Prerequisite
} from '../components/types';

const fs = require('fs');
const path = require('path');
const parser = require('csv-parse/lib/sync');
const toposort = require('toposort');

const db: CourseConfig = JSON.parse(fs.readFileSync('./src/data/db.json', { encoding: 'utf-8' }));

// fill the core
// use 180 credits

function clone<T>(item: T): T {
  return JSON.parse(JSON.stringify(item));
}

function getUnit(id) {
  return db.units.find(u => u.id === id);
}

function getBlock(address) {
  return db.units.find(u => u.id === address[0]).blocks.find(b => b.id === address[1]);
}

function procesBlock(block, topics) {
  for (let topic of block.topics) {
    if (topics[topic.id] == null) {
      topics[topic.id] = { credits: 0 };
    }
    topics[topic.id].credits += block.credits * topic.ratio;
  }
}

function mergeCompletionCriteria(c1: CourseCompletionCriteria, ...cs: CourseCompletionCriteria[]) {
  c1.topics.forEach(t => (t.credits = parseFloat(t.credits)));
  for (let c2 of cs) {
    c2.topics.forEach(t => (t.credits = parseFloat(t.credits)));
    for (let t of c2.topics) {
      let existingTopic = c1.topics.find(ct => ct.id === t.id);
      if (existingTopic) {
        existingTopic.credits += t.credits;
      } else {
        c1.topics.push(clone(t));
      }
    }
  }
  return c1;
}

/** Checks for completion criteria given a study profile */
function buildProfile(study, completionCriteria: CourseCompletionCriteria) {
  let topics = {};
  for (let semester of study) {
    for (let part of semester) {
      if (Array.isArray(part)) {
        let block = getBlock(part);
        procesBlock(block, topics);
      } else {
        let unit = getUnit(part);
        for (let block of unit.blocks) {
          procesBlock(block, topics);
        }
      }
    }
  }
  for (let key in topics) {
    let c = completionCriteria.topics.find(t => t.id === key);
    topics[key].name = db.topics.find(t => t.id === key).name;
    if (c) {
      topics[key].completion = Math.round((topics[key].credits / c.credits) * 100);
    }
  }

  for (let topic of completionCriteria.topics) {
    if (topics[topic.id] == null) {
      topics[topic.id] = {
        credits: 0,
        name: db.topics.find(t => t.id === topic.id).name,
        completion: 0
      };
    }
  }
  return topics;
}

// sort by dependency

const unitz = db.units.filter(u => u.level < 7);
const nodes: Array<[Unit, Block, boolean?]> = db.units
  .filter(u => u.level < 7)
  .flatMap(u => u.blocks.map(b => [u, b] as [Unit, Block]));
const edges = [];

function p(pre: Prerequisite, node: [Unit, Block?, boolean?]) {
  if (pre.type === 'unit') {
    const unit = unitz.find(n => n.id === pre.id);
    if (unit == null) {
      throw new Error('Not found');
    }

    for (let block of unit.blocks) {
      let blockNode = nodes.find(n => n[0].id === unit.id && n[1] && n[1].id === block.id);
      edges.push([blockNode, node]);
    }

    // set that unit must be present in the list of modules, we do not filter it out even if it has no depenedencies
    nodes.find(n => n[0].id === pre.id).forEach(n => (n[2] = true));
  } else if (pre.type === 'block') {
    const target = nodes.find(n => n[0].id === pre.unitId && n[1] != null && n[1].id === pre.id);
    if (target == null) {
      console.warn(`Dependency not found: ${pre.unitId} / ${pre.id}`);
      return;
      // throw new Error(`Not found`);
    }
    target[2] = true;
    edges.push([target, node]);
  }
}

// add unit prerequisites
for (let unit of unitz) {
  for (let pre of unit.prerequisites || []) {
    // add the same prerequisites to every block
    for (let block of unit.blocks || []) {
      let blockNode = nodes.find(n => n[0].id === unit.id && n[1] && n[1].id === block.id);
      p(pre, blockNode);
    }
  }
}

// add block prerequisites
for (let node of nodes) {
  for (let pre of node[1].prerequisites || []) {
    p(pre, node);
  }
}

type SearchNode = [Unit, Block?, boolean?];

// we only want nodes that contribute to fulfilment
let sorted: Array<[Unit, Block?, boolean?]> = toposort.array(nodes, edges);
sorted = sorted.filter(n => n[2] || n[1].topics?.length || n[1].sfiaSkills?.length);

// sorted.reverse();

console.log('====');
fs.writeFileSync(
  'edges.csv',
  `"From Unit", "From Block", "To Unit", "To Block"` +
    edges
      .map(
        s =>
          '"' +
          s[0][0].name +
          '","' +
          s[0][1].name +
          '","' +
          s[1][0].name +
          '","' +
          s[1][1].name +
          '"'
      )
      .join('\n'),
  { encoding: 'utf-8' }
);

fs.writeFileSync(
  'sorted.csv',
  sorted.map(s => `"${s[0].name}", "${(s[1].name || '').replace(/\n/g, ' ').trim()}"`).join('\n'),
  {
    encoding: 'utf-8'
  }
);

fs.writeFileSync(
  'units.csv',
  sorted
    .map(s => s[0].name)
    .filter((a, i) => sorted.findIndex(s => s[0].name === a) === i)
    .join('\n'),
  {
    encoding: 'utf-8'
  }
);

// expands options in the option array
// each semester has following properties:
//  = can study max 40 credits
function exploreOptions(
  potentialNodes: SearchNode[],
  options: Array<Array<Array<SearchNode>>>,
  unitId: string,
  blockId: string = null
) {
  let blocks = blockId
    ? potentialNodes.filter(n => n[0].id === unitId && n[1].id === blockId)
    : potentialNodes.filter(n => n[0].id === unitId);

  if (blocks.length === 0) {
    return [options, potentialNodes];
  }

  // check how many credits we contrinute
  const currentCredits = blocks.reduce((prev, next) => next[1].credits + prev, 0);

  // filter which nodes we will process
  potentialNodes = potentialNodes.filter(
    n => n[0].id !== unitId || blockId == null || n[1].id !== blockId
  );

  for (let option of options) {
    for (let semester of option) {
      let credits = semester.reduce((prev, next) => next[1].credits + prev, 0);
      if (credits + currentCredits < 40) {
        semester.push(...blocks);
      }
    }
  }

  return [options, potentialNodes];
}

function search({
  includeBlocks = [],
  includeUnits = [],
  excludeUnits = [],
  excludeBlocks = [],
  majors,
  courseId,
  jobs = []
}: {
  courseId: string;
  includeUnits: string[];
  excludeUnits: string[];
  includeBlocks: string[][];
  excludeBlocks: string[][];
  majors: string[];
  jobs: string[];
}) {
  let course = db.courses.find(c => c.id === courseId);

  // add core units to mandatory include
  for (let unit of course.core) {
    if (includeUnits.indexOf(unit.id) === -1) {
      includeUnits.push(unit.id);
    }
  }

  // filter out all the nodes that we want to exclude
  const potentialNodes = sorted.filter(
    s =>
      excludeUnits.every(eu => s[0].id !== eu) &&
      excludeBlocks.every(em => s[0].id !== em[0] || s[1].id !== em[1])
  );

  // add core units

  // build new completion crieria, merging
  let completionCriteria = mergeCompletionCriteria(
    clone(course.completionCriteria),
    ...majors.map(m => course.majors.find(cm => cm.id === m).completionCriteria)
  );
  completionCriteria.topics.forEach(
    t => ((t as any).name = db.topics.find(tp => tp.id === t.id).name)
  );

  console.log('============= COMPLETION CRITERIA ================');
  console.log(completionCriteria);

  // console.log('============= PLAN ================');
  // console.log(study);
  // console.log('============= FULLFILLMENT ================');
  // console.log(buildProfile(study, completionCriteria));

  let study = [[], [], [], [], [], []]; // 6 semesters

  for (let unit of includeUnits) {
    const [options, nodes] = exploreOptions(potentialNodes, [study], unit);
    for (let block of includeBlocks) {
      exploreOptions(nodes, options, block[0], block[1]);
    }
  }
}

search({
  courseId: '3699',
  majors: ['7600', '36992'],
  includeUnits: [],
  excludeUnits: [],
  includeBlocks: [],
  excludeBlocks: [],
  jobs: []
});
