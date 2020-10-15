import {
  CourseConfig,
  Course,
  CompletionCriteria,
  CourseCompletionCriteria,
  Unit,
  Block,
  Prerequisite,
  BlockTopic,
  SfiaSkillMapping
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
  for (let topic of block.topics || []) {
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
function buildProfile(
  study: Array<Array<SearchNode>>,
  completionCriteria: CourseCompletionCriteria
): { [index: string]: { credits: number; name: string; completion: number } } {
  let topics = {};
  for (let semester of study) {
    for (let part of semester) {
      // if (Array.isArray(part)) {
      //   let block = getBlock(part);
      //   procesBlock(block, topics);
      // } else {
      let unit = part.unit; // getUnit(part);
      for (let block of unit.blocks) {
        procesBlock(block, topics);
      }
      // }
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

type SearchEdge = [SearchNode, SearchNode];

let searchBlockId = 0;
const unitNodes: SearchNode[] = db.units
  .filter(u => u.level < 7)
  .map(u => ({
    id: searchBlockId++,
    unit: {
      ...u,
      credits: u.blocks.reduce((prev, next) => next.credits + prev, 0)
    },
    dependsOn: [],
    topics: u.blocks.reduce((prev, next) => {
      for (let topic of next.topics || []) {
        let current = prev.find(p => p.id === topic.id);
        if (current) {
          current.ratio += topic.ratio;
        } else {
          prev.push({ ...topic });
        }
      }
      return prev;
    }, [] as BlockTopic[]),
    sfiaSkills: u.blocks.reduce((prev, next) => {
      for (let sfia of next.sfiaSkills || []) {
        let current = prev.find(p => p.id === sfia.id);
        if (current) {
          current.level += sfia.level;
        } else {
          prev.push({ ...sfia });
        }
      }
      return prev;
    }, [] as SfiaSkillMapping[])
  }));
const unitEdges: SearchEdge[] = [];

const blockNodes: SearchNode[] = db.units
  .filter(u => u.level < 7)
  .flatMap(u =>
    u.blocks.map(b => ({
      id: searchBlockId++,
      block: b,
      unit: u,
      dependsOn: [],
      topics: b.topics,
      sfiaSkills: b.sfiaSkills
    }))
  );
const blockEdges: SearchEdge[] = [];

function addPrerequisite(pre: Prerequisite, dependantNode: SearchNode) {
  if (pre.type === 'unit') {
    // find it in unit nodes
    const dependOnUnitNode = unitNodes.find(n => n.unit.id === pre.id);
    if (dependOnUnitNode == null) {
      throw new Error('Not found');
    }

    // the node is unit node or a block node
    if (unitNodes.indexOf(dependantNode) >= 0) {
      unitEdges.push([dependOnUnitNode, dependantNode]);
      dependantNode.dependsOn.push(dependOnUnitNode);

      // add dependency on each block of this unit
      for (let dependantBlock of dependantNode.unit.blocks) {
        let dependantBlockNode = blockNodes.find(
          n => n.unit.id === dependantNode.unit.id && n.block.id === dependantBlock.id
        );

        for (let dependOnBlock of dependOnUnitNode.unit.blocks) {
          let dependOnBlockNode = blockNodes.find(
            n => n.unit.id === dependOnUnitNode.unit.id && n.block.id === dependOnBlock.id
          );
          blockEdges.push([dependOnBlockNode, dependantBlockNode]);
          dependantBlockNode.dependsOn.push(dependOnBlockNode);
        }
      }
    } else {
      // it is only a block node that depends on the whole unit
      // add dependency on each block of this unit
      for (let block of dependOnUnitNode.unit.blocks) {
        let blockNode = blockNodes.find(
          n => n.unit.id === dependOnUnitNode.unit.id && n.block.id === block.id
        );
        blockEdges.push([blockNode, dependantNode]);
        dependantNode.dependsOn.push(blockNode);
      }
    }

    // set that unit must be present in the list of modules, we do not filter it out even if it has no depenedencies
    blockNodes.filter(n => n.unit.id === pre.id).forEach(n => (n.include = true));
    dependOnUnitNode.include = true;
  } else if (pre.type === 'block') {
    const dependOnUnitNode = unitNodes.find(n => n.unit.id === pre.unitId);
    const dependantUnitNode = unitNodes.find(n => n.unit.id === dependantNode.unit.id);
    const dependOnBlockNode = blockNodes.find(
      n => n.unit.id === pre.unitId && n.block.id === pre.id
    );

    if (dependOnBlockNode == null) {
      console.warn(`Dependency not found: ${pre.unitId} / ${pre.id}`);
      return;
      // throw new Error(`Not found`);
    }

    ///////////////////////
    // Unit Node
    if (unitNodes.indexOf(dependantNode) >= 0) {
      dependOnUnitNode.include = true;
      unitEdges.push([dependOnUnitNode, dependantNode]);
      dependantNode.dependsOn.push(dependOnUnitNode);

      // add dependenct for each block of this unit
      for (let block of dependantNode.unit.blocks) {
        let dependantBlockNode = blockNodes.find(
          n => n.unit.id === dependantNode.unit.id && n.block.id === block.id
        );
        blockEdges.push([dependOnBlockNode, dependantBlockNode]);
        dependantBlockNode.dependsOn.push(dependOnBlockNode);
      }
    }
    ///////////////////////
    // Block Node
    else {
      // add depenedcency for blocks
      dependOnBlockNode.include = true;
      blockEdges.push([dependOnBlockNode, dependantNode]);
      dependantNode.dependsOn.push(dependOnBlockNode);

      // add dependency for units (if a block node depenend on another block it  we also assume dependency on the whole unit)
      if (dependantUnitNode !== dependOnUnitNode) {
        unitEdges.push([dependOnUnitNode, dependantUnitNode]);
        dependantUnitNode.dependsOn.push(dependOnUnitNode);
      }
    }
  }
}

///////////////////////////////////////////////
// add unit prerequisites
///////////////////////////////////////////////

for (let node of unitNodes) {
  for (let pre of node.unit.prerequisites || []) {
    // add unit prerequisite
    addPrerequisite(pre, node);
  }
}

///////////////////////////////////////////////
// add block prerequisites
///////////////////////////////////////////////

for (let node of blockNodes) {
  for (let pre of node.block.prerequisites || []) {
    addPrerequisite(pre, node);
  }
}

type SearchNode = {
  id: number;
  block?: Block;
  unit: Unit;
  include?: boolean;
  dependsOn: SearchNode[];
  topics: BlockTopic[];
  sfiaSkills: SfiaSkillMapping[];
};

// sorted.reverse();
fs.writeFileSync(
  'block-edges.csv',
  `"From Unit", "From Block", "To Unit", "To Block"` +
    blockEdges
      .map(
        s =>
          '"' +
          s[0].unit.name +
          '","' +
          s[0].block.name +
          '","' +
          s[1].unit.name +
          '","' +
          s[1].block.name +
          '"'
      )
      .join('\n'),
  { encoding: 'utf-8' }
);

fs.writeFileSync(
  'unit-edges.csv',
  `"From Unit", "From Block", "To Unit", "To Block"` +
    unitEdges.map(s => '"' + s[0].unit.name + '","' + s[1].unit.name + '"').join('\n'),
  { encoding: 'utf-8' }
);

// we only want nodes that contribute to fulfilment
let sortedBlocks: SearchNode[] = toposort.array(blockNodes, blockEdges);
sortedBlocks = sortedBlocks.filter(n => n.include || n.topics?.length || n.sfiaSkills?.length);

let sortedUnits: SearchNode[] = toposort.array(unitNodes, unitEdges);
sortedUnits = sortedUnits.filter(n => n.include || n.topics?.length || n.sfiaSkills?.length);

fs.writeFileSync(
  'sorted-units.csv',
  sortedUnits
    .map(s => `"${s.unit.name}", "${(s.unit.name || '').replace(/\n/g, ' ').trim()}"`)
    .join('\n'),
  {
    encoding: 'utf-8'
  }
);

fs.writeFileSync(
  'sorted-blocks.csv',
  sortedBlocks
    .map(s => `"${s.unit.name}", "${(s.block.name || '').replace(/\n/g, ' ').trim()}"`)
    .join('\n'),
  {
    encoding: 'utf-8'
  }
);

fs.writeFileSync(
  'units.csv',
  sortedBlocks
    .map(s => s.unit.name)
    .filter((a, i) => sortedBlocks.findIndex(s => s.unit.name === a) === i)
    .join('\n'),
  {
    encoding: 'utf-8'
  }
);

function deDup(arr: any[]) {
  return Array.from(new Set(arr));
}

// this structure uses back references to know how the shape of the node changes
// we always know that in one stepwe only add a unit or a block into the semester
// thus, we can alsways reconstruct the current semester going backwards and adding the nodes as specified
type ExploreNode = [ExploreNode, number, ...number[]];

function createOption(node: ExploreNode) {
  let result: Array<Array<SearchNode>> = [[], [], [], [], [], []];
  let parent = node;
  do {
    for (let i = 2; i < parent.length; i++) {
      result[parent[1]].unshift(unitNodes.find(f => f.id === parent[i]));
    }
    parent = parent[0];
  } while (parent != null);
  return result;
}

// expands options in the option array
// each semester has following properties:
//  = can study max 40 credits
function exploreUnits(
  potentialNodes: SearchNode[],
  options: ExploreNode[],
  unitId: string,
  optional = false
): [ExploreNode[], SearchNode[]] {
  let unitNode = potentialNodes.find(n => n.unit.id === unitId);

  if (unitNode == null) {
    return [options, potentialNodes];
  }

  // check how many credits we contrinute
  const currentCredits = unitNode.unit.credits;

  // filter which nodes we will process further removing the current node
  potentialNodes = potentialNodes.filter(n => n.unit.id !== unitId);

  let result: ExploreNode[] = [];

  // init options if there are none
  if (options.length === 0) {
    for (let i = 0; i < 6; i++) {
      if (
        (i % 2 == 0 && unitNode.unit.offer.indexOf('au') >= 0) ||
        (i % 2 == 1 && unitNode.unit.offer.indexOf('sp') >= 0)
      ) {
        result.push([null, i, unitNode.id]);
      }
    }
  } else {
    // now explore each semester and try to push it
    for (let j = 0; j < options.length; j++) {
      let option = createOption(options[j]);
      let positioned = false;

      // we will expand each viable position
      // or we will remove if no viable position could have been found

      for (let i = 0; i < 6; i++) {
        if (
          (i % 2 == 0 && unitNode.unit.offer.indexOf('au') === -1) ||
          (i % 2 == 1 && unitNode.unit.offer.indexOf('sp') === -1)
        ) {
          // result.push(options[j]);
          continue;
        }

        let semester = option[i];
        let credits = semester.reduce((prev, next) => next.unit.credits + prev, 0);
        let checkCredits = credits + currentCredits <= 40;

        // check if the blocks that we are trying to add have any dependency in the same or higher semester
        let checkDependencies = option.every(
          (semesterBlocks, k) =>
            k < i /* It is either in the lower semester */ ||
            semesterBlocks.every(
              l => unitNode.dependsOn.indexOf(l) === -1
            ) /* Or it does not exist in the higher semester */
        );

        if (checkCredits && checkDependencies) {
          const newResult = [options[j], i, unitNode.id] as ExploreNode;

          const build = createOption(newResult);
          if (build.every(b => b.every(c => c.unit.id !== '100483'))) {
            throw new Error('Disappeared!!');
          }

          result.push(newResult);
          positioned = true;
        }
      }

      if (!positioned && optional) {
        result.push(options[j]);
      }

      // we may request to remove invalid configurations
      // if (!positioned) {
      //   option.invalid = true;

      //   // options.splice(j, 1);
      //   // console.log(
      //   //   'Removed invalid configuration: [[' +
      //   //     option.map(o => `${deDup(o.map(p => p.unit.id)).join(', ')}`).join('], [') +
      //   //     ']]'
      //   // );
      // }
    }
  }

  return [result, potentialNodes];
}

// function exploreOptions(
//   potentialNodes: SearchNode[],
//   options: ExploreNode[],
//   unitId: string,
//   blockId: string = null,
//   optional = false
// ) {
//   let blocks = blockId
//     ? potentialNodes.filter(n => n.unit.id === unitId && n.id === blockId)
//     : potentialNodes.filter(n => n.unit.id === unitId);

//   if (blocks.length === 0) {
//     return [options, potentialNodes];
//   }

//   // check how many credits we contrinute
//   const currentCredits = blocks.reduce((prev, next) => next.credits + prev, 0);

//   // filter which nodes we will process further
//   potentialNodes = potentialNodes.filter(
//     n => n.unit.id !== unitId || (blockId !== null && n.id !== blockId)
//   );

//   let result = [];

//   // init options if there are none
//   if (options.length === 0) {
//     for (let i = 0; i < 6; i++) {
//       let study = [[], [], [], [], [], []];
//       study[i] = [...blocks];
//       result.push(study);
//     }
//   } else {
//     // now explore each semester and try to push it
//     for (let j = 0; j < options.length; j++) {
//       let option = options[j];
//       let positioned = false;

//       // we will expand each viable position
//       // or we will remove if no viable position could have been found

//       for (let i = 0; i < 6; i++) {
//         let semester = option[i];
//         let credits = semester.reduce((prev, next) => next.credits + prev, 0);
//         let checkCredits = credits + currentCredits < 40;

//         // check if the blocks that we are trying to add have any dependency in the same or higher semester
//         let checkDependencies = option.every(
//           (semesterBlocks, k) =>
//             k < i /* It is either in the lower semester */ ||
//             semesterBlocks.every(l =>
//               blocks.every(b => b.dependsOn.indexOf(l) === -1)
//             ) /* Or it does not exist in the higher semester */
//         );

//         if (checkCredits && checkDependencies) {
//           let newOption = [...option];
//           newOption[i] = [...newOption[i], ...blocks];
//           result.push(newOption);
//           positioned = true;
//         }
//       }

//       if (!positioned && optional) {
//         result.push([...option]);
//       }

//       // we may request to remove invalid configurations
//       // if (!positioned) {
//       //   option.invalid = true;

//       //   // options.splice(j, 1);
//       //   // console.log(
//       //   //   'Removed invalid configuration: [[' +
//       //   //     option.map(o => `${deDup(o.map(p => p.unit.id)).join(', ')}`).join('], [') +
//       //   //     ']]'
//       //   // );
//       // }
//     }
//   }

//   return [potentialNodes, result];
// }

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
  let potentialBlocks = sortedBlocks.filter(s =>
    excludeBlocks.every(em => s.unit.id !== em[0] || s.block.id !== em[1])
  );

  // filter out all the nodes that we want to exclude
  let potentialUnits = sortedUnits.filter(s => excludeUnits.every(eu => s.unit.id !== eu));

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

  // let study = [[], [], [], [], [], []]; // 6 semesters

  let options = [];
  for (let unit of includeUnits) {
    console.log('Adding unit: ' + unit);
    const result = exploreUnits(potentialUnits, options, unit);
    potentialUnits = result[1];
    options = result[0];
    console.log('options: ' + options.length);

    // for (let rawOption of options) {
    //   const option = createOption(rawOption);
    //   const profile = buildProfile(option, completionCriteria);
    // }

    // for (let block of includeBlocks) {
    //   exploreOptions(blockNodes, options, block[0], block[1]);
    // }
  }

  // now browse all existing units in the potentialNodes queue
  while (potentialUnits.length > 0) {
    console.log('Potential Nodes: ' + potentialUnits.length);
    let node = potentialUnits[0];
    console.log('Unit: ' + node.unit.name);

    // check if the unit contributes to the
    let unit = node.unit;
    if (
      completionCriteria.topics.every(
        t => unit.topics == null || node.topics.every(tp => t.id !== tp.id)
      )
    ) {
      potentialUnits.shift();
      console.log('Skipped for no related topics: ' + unit.name);
      continue;
    }

    let result = exploreUnits(potentialUnits, options, node.unit.id, true);
    potentialUnits = result[1];
    options = result[0];
    console.log('options: ' + options.length);
  }

  console.log('+++++++++++++++++++++++++++++++++++');
  console.log(options.length);

  console.log('+++++++++++++++++++++++++++++++++++');
  console.log('CHECKING OPTIONS');

  let viableOptions = [];
  let b = 0;
  let max = 0;

  // const temp = options.map(o =>
  //   createOption(o)
  //     .flatMap(o => o.map(p => p.unit.id))
  //     .sort()
  //     .join(', ')
  // );

  for (let rawOption of options) {
    const option = createOption(rawOption);
    const profile = buildProfile(option, completionCriteria);

    // const units = option.flatMap(o => o.map(p => p.unit.id)).sort();

    let lines = Object.keys(profile).map(key => profile[key]);
    let completion = lines.reduce((prev, next) => (next.completion || 0) + prev, 0) / lines.length;

    if (lines.every(l => (l.completion || 0) >= 100)) {
      viableOptions.push(option);
    }

    if (completion > max) {
      max = completion;
      console.log('Completion: ' + max);
      // console.log(units.join(', '););

      for (let i = 0; i < 6; i++) {
        console.log(`Semester ${i + 1}: ` + option[i].map(p => p.unit.name).join(', '));
      }

      console.log(profile);
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
