import fs from 'fs';
// expands options in the option array
// each semester has following properties:

import {
  buildProfile,
  clone,
  fillMissingDependencies,
  logName,
  logSearchNode,
  logSimpleName,
  mergeCompletionCriteria,
  QNode,
  SearchNode,
  TopicProfile
} from './search_helpers';
import { CourseCompletionCriteria } from 'components/types';
import { CourseList, Entity, MajorList, UnitList } from 'config/graphql';
import { extractCriteriaUnits } from 'lib/helpers';
import { createSearchNodes } from './search_structures';
import { Generator, GeneratorNode } from './generator';

function utility(
  a: QNode,
  completionCriteria: CourseCompletionCriteria,
  rarity: { [index: string]: { sources: number; credits: number } },
  profile: TopicProfile[]
) {
  return a.node.topics
    .filter(t => completionCriteria.topics.some(c => c.id === t.id))
    .map(t => {
      // we only care about the remaining credits that the unit can provide, not all of them
      const missing = profile.find(p => p.topicId === t.id).missing;
      const credits = missing > t.credits ? t.credits : missing;
      return credits / rarity[t.id].credits;
    })
    .reduce((prev, next) => prev + next, 0);
}

function qLog(message: string) {
  // console.log(message);
  Finder.log += message + '\n';
}

/** Heuristically sorts the possible units
 * 
 * 1. Order nodes by their utility 
   2. Utility means, how much the unit is contributing to the completion criteria multiplied by "rareness / power" of this criteria (topic/sfia)
   3. Unit is "rare" or "powerful" when there is only a limited number of units that fulfile that given criteria (topic / sfia)
 */
function heuristicSort(
  nodes: QNode[],
  completionCriteria: CourseCompletionCriteria,
  profile: TopicProfile[],
  topics: Entity[]
) {
  // compute rarity for this copletion criteria
  const rarity = nodes.reduce((prev, next) => {
    for (let topic of next.node.topics) {
      if (prev[topic.id] == null) {
        prev[topic.id] = {
          sources: 0,
          credits: 0,
          name: topics.find(t => t.id === topic.id).name
        };
      }
      prev[topic.id].sources++;
      prev[topic.id].credits += topic.credits;
    }
    return prev;
  }, {} as { [index: string]: { sources: number; credits: number; name: string } });

  // filter out nodes who provide no value
  nodes = nodes.filter(n => utility(n, completionCriteria, rarity, profile) > 0);

  nodes.sort((a, b) => {
    const utilityA = utility(a, completionCriteria, rarity, profile);
    const utilityB = utility(b, completionCriteria, rarity, profile);
    return utilityA < utilityB ? -1 : 1;
  });

  // fs.writeFileSync(
  //   "./data/heuristic.csv",
  //   nodes
  //     .map(
  //       (n) =>
  //         n.node.unit.name +
  //         "," +
  //         utility(n, completionCriteria, rarity, profile)
  //     )
  //     .join("\n"),
  //   { encoding: "utf-8" }
  // );

  return nodes;
}

// function logOption(option: Study) {
//   qLog("--");
//   for (let i = 0; i < 6; i++) {
//     option[i].forEach((f, j) =>
//       qLog(
//         (j == 0 ? `Semester ${i + 1}: ` : "            ") +
//           f.unit.name +
//           (f.block ? " > " + f.block.name : "")
//       )
//     );
//   }
//   qLog("--");
// }

function sortNodes(
  study: Study,
  nodes: QNode[],
  completionCriteria: CourseCompletionCriteria,
  topics: Entity[]
): QNode[] {
  // 0. [TODO: if memory problems] filter the list of nodes to those which have not been used
  // 1. calculate current completion rate on a current node
  // 2. filter out completion criteria that no longer apply (are completed)
  // 3. sort current node list based on utility
  // 4. take the first node
  const profile = buildProfile(study, completionCriteria, topics);

  // 1
  const completed = profile.filter(p => p.completion >= 100);

  // 2
  // check if we have some completed topics here
  if (completionCriteria.topics.some(t => completed.some(c => c.topicId === t.id))) {
    // filter out the completed topics
    completionCriteria = {
      ...completionCriteria,
      topics: completionCriteria.topics.filter(t => completed.every(c => c.topicId !== t.id))
    };
  }

  // 3
  return heuristicSort(nodes, completionCriteria, profile, topics);
}

type Study = [SearchNode[], SearchNode[], SearchNode[], SearchNode[], SearchNode[], SearchNode[]];

export function calculateCredits(semester: SearchNode[]) {
  return semester.reduce(
    (prev, next) =>
      (next.block == null || semester.every(s => s.unit.id !== next.unit.id || s.block != null)
        ? next.credits
        : 0) + prev,
    0
  );
}

function checkPlacement(qnode: QNode, node: SearchNode, study: Study, semester: number) {
  // check if we have already considered this semester
  if (qnode.semesters.indexOf(semester) >= 0) {
    return false;
  }

  if (study[semester].some(s => s.id === node.id)) {
    qLog('Already in!');
    return true;
  }

  // tell that we have checked this semester
  qnode.semesters.push(semester);

  // temporarily push for calculation
  study[semester].push(node);

  // we consider only unique credits (if we have a unit and a block in the study we do not want to calculate the credit twice)
  let checkCredits = calculateCredits(study[semester]) <= 40;

  // remove it
  study[semester].pop();

  // check if the blocks that we are trying to add have any dependency in the same or higher semester
  let checkDependencies = study.every(
    (semesterBlocks, k) =>
      k < semester /* It is either in the lower semester */ ||
      semesterBlocks.every(
        laterUnit =>
          // does not depend on the previous node (unit/block) directly
          node.dependsOn.indexOf(laterUnit) === -1 &&
          // does not depend on block from a later unit
          (laterUnit.blocks || []).every(laterBlock => node.dependsOn.indexOf(laterBlock) === -1) &&
          // blocks from the unit do not depend on later units
          (node.blocks || []).every(
            earlierBlock => earlierBlock.dependsOn.indexOf(laterUnit) === -1
          ) &&
          // blocks from the node do not depend on any of the blocks from units in higher semester
          (laterUnit.blocks || []).every(laterBlock =>
            (node.blocks || []).every(
              earlierBlock => earlierBlock.dependsOn.indexOf(laterBlock) === -1
            )
          )
      ) /* Or it does not exist in the higher semester */
    // TODO: Add condition for blocks
  );

  qLog(
    `${checkCredits && checkDependencies ? '[OK]' : '[ERROR]'} Checking placement in semester ${
      semester + 1
    }. [Credits: ${checkCredits.toString()}, Depencencies: ${checkDependencies.toString()}]`
  );

  if (checkCredits && checkDependencies) {
    // add semester i
    study[semester].push(node);
    return true;
  }

  return false;
}

function checkSemestersPlacement(qnode: QNode, study: Study) {
  for (let i = 0; i < 6; i++) {
    // check if it is on offer in that perios
    if (
      (i % 2 == 0 && qnode.node.unit.offer.indexOf('au') === -1) ||
      (i % 2 == 1 && qnode.node.unit.offer.indexOf('sp') === -1)
    ) {
      // result.push(options[j]);
      continue;
    }

    if (checkPlacement(qnode, qnode.node, study, i)) {
      return true;
    }
  }
  return false;
}

function findPosition(qnode: QNode, node: SearchNode, study: Study): boolean {
  // node can already be positioned
  if (study.some(s => s.some(n => n === node))) {
    return true;
  }

  // node's unit can already be positioned, we do not have to position the block
  // if (
  //   study.some((s, i) =>
  //     s.some((n) => {
  //       if (n.unit.id === node.unit.id && n.block == null) {
  //         qnode.semesters.push(i);
  //         return true;
  //       }
  //       return false;
  //     })
  //   )
  // ) {
  //   return true;
  // }

  // we may be positioning unit over another block
  // check if we have a unit already there
  // in case we are adding a similar blovk or a unit, we must add it to the same semester
  if (study.some(s => s.some(n => n.unit.id === node.unit.id))) {
    return checkPlacement(
      qnode,
      node,
      study,
      study.findIndex(s => s.some(n => n.unit.id === node.unit.id))
    );
  }

  // we can initially "hard-code" the option for the semester providing the semester options
  if (node.semester > 0 && qnode.semesters.length === 0) {
    qLog('[OK] Hard semester: ' + node.semester);
    qnode.semesters.push(node.semester - 1);
    study[node.semester - 1].push(node);
    return true;
  }

  // find the best semester for the node
  // we will try to push it into one of the available six semesters

  if (node.unit.offer.length == 0) {
    throw new Error(`Trying to position '${node.unit.name}' which has no offer`);
  }

  if (checkSemestersPlacement(qnode, study)) {
    return true;
  }
  return false;
}

function removeFromStudy(study: Study, node: QNode) {
  for (let s of study) {
    if (s.indexOf(node.node) >= 0) {
      s.splice(s.indexOf(node.node), 1);
      break;
    }
  }
}

function tryDifferentOne(
  topics: Entity[],
  study: Study,
  done: QNode[],
  doing: QNode[],
  altDone?: QNode[],
  altDoing?: QNode[]
) {
  qLog('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
  qLog('Trying a diffrenet option.');

  if (done.length === 0 && altDone != null) {
    done = altDone;
    doing = altDoing;
  }

  // qLog('BEFORE DOING');
  // for (let node of doing) {
  //   qLog(logSimpleName(node) + ` [${node.semesters.join(', ')}]`);
  // }

  // qLog('\nBEFORE DONE');
  // for (let node of done) {
  //   qLog(logSimpleName(node) + ` [${node.semesters.join(', ')}]`);
  // }

  if (done.length === 0) {
    return false;
  }

  let canUse = false;
  do {
    let renew = done.pop();
    qLog(`\nREMOVING: ${logSimpleName(renew)}\n`);

    // remove elements from study
    removeFromStudy(study, renew);

    for (let dep of renew.addedDependencies) {
      removeFromStudy(study, dep);
    }
    // add it back to processing
    doing.push(renew);

    canUse = tryPositionNode(renew, study);

    // erase its current use
    if (!canUse) {
      renew.semesters = [];
      // erase all dependencies as well
      for (let dependency of renew.addedDependencies) {
        if (dependency.semesters.length) {
          dependency.semesters = [];
        }
      }
    }
  } while (done.length > 0 && canUse == false);

  if (!canUse) {
    console.log('Ran out of options');
    return false;
  }

  // qLog('AFTER DOING');
  // for (let node of doing) {
  //   qLog(logSimpleName(node) + ` [${node.semesters.join(', ')}]`);
  // }

  // qLog('\nAFTER DONE');
  // for (let node of done) {
  //   qLog(logSimpleName(node) + ` [${node.semesters.join(', ')}]`);
  // }
  qLog('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
  return true;
}

let success = 0;
function evaluateStudy(criteria: CourseCompletionCriteria, study: Study, topics: Entity[]) {
  const profile = buildProfile(study, criteria, topics);
  const available = study.reduce(
    (prev, next) => prev + (40 - next.reduce((sprev, snext) => sprev + snext.credits, 0)),
    0
  );
  const completed = profile.reduce((prev, next) => prev + next.credits, 0);
  const missing = criteria.totalCredits - completed;

  const completion = profile.reduce((prev, next) => prev + next.credits, 0) / criteria.totalCredits;
  // qLog(
  //   "Completion: " +
  //     Math.round(completion * 100) +
  //     `% [Completed: ${Math.round(completed)} / Total: ${
  //       criteria.totalCredits
  //     }] [Missing: ${missing} / Available: ${available}]`
  // );

  if (completion >= 1) {
    console.log(`Found ${++success} solutions\n\n`);
  }
}

function checkProblematicDependencies(requiredDoing: QNode[], optionalDoing: QNode[]) {
  // check all dependencies
  let problematic = requiredDoing.filter(r =>
    r.node.dependsOn.some(d => d.block == null && optionalDoing.some(o => o.node === d))
  );

  if (problematic.length > 0) {
    qLog(
      `[ERROR]: Following ${problematic.length} required units have dependenc(ies) which are considered optional`
    );
    problematic.forEach(p => {
      let badDeps = p.node.dependsOn.filter(
        d => d.block == null && optionalDoing.some(o => o.node === d)
      );
      badDeps.forEach(bd => {
        qLog(logSimpleName(p, true) + ' -> ' + logSearchNode(bd, true));
        let index = optionalDoing.indexOf(p);
        if (index >= 0) {
          optionalDoing.splice(index, 1);
        }
      });
    });
  }
}

function positionDepenedency(current: QNode, study: Study, level: number = 1) {
  let positioned = true;

  for (let dependency of current.dependencies) {
    qLog(''.padStart(level, '+') + ' ' + logName(dependency));

    // if it was already added we do not care
    if (study.some(s => s.some(n => n === dependency.node))) {
      continue;
    }
    // try to find a placement for this unit / modules (node)
    positioned = positioned && findPosition(dependency, dependency.node, study);

    // tell the node that it added the dependency
    if (positioned) {
      // logOption(study);
      current.addedDependencies.push(dependency);
    }

    qLog('-- ');

    if (dependency.dependencies) {
      positioned = positioned && positionDepenedency(dependency, study, level + 1);
    }
  }
  return positioned;
}

function tryPositionNode(current: QNode, study: Study) {
  let positioned = true;

  if (current.addedDependencies.length) {
    current.addedDependencies = [];
  }
  qLog('============================');
  qLog('Positioning: ' + logName(current));
  qLog('============================');

  positioned = positionDepenedency(current, study, 1);

  // Position unit in the study

  if (positioned) {
    positioned = findPosition(current, current.node, study);
  }

  return positioned;
}

export class Finder {
  static log = '';

  requiredDoing: QNode[];
  requiredDone: QNode[] = [];
  optionalDoing: QNode[];
  optionalDone: QNode[] = [];
  optionalBlocks: QNode[] = [];
  requiredBlocks: QNode[] = [];
  study: Study;
  // dependencies: SearchNode[];
  courseCompletionCriteria: CourseCompletionCriteria;

  constructor(private topics: Entity[], private units: UnitList[]) {}

  step() {
    if (this.requiredDoing.length === 0 && this.optionalDoing.length === 0) {
      qLog('Finished!');
      return;
    }

    let isRequired = this.requiredDoing.length > 0;
    let current = isRequired ? this.requiredDoing.pop() : this.optionalDoing.pop();

    if (isRequired) {
      this.requiredDone.push(current);
    } else {
      this.optionalDone.push(current);
    }

    // Add dependencies
    let positioned = tryPositionNode(current, this.study);

    // if we could not position of the required node we will try to position the parent node in a different semester
    if (!positioned && isRequired) {
      // we try in a different semester
      positioned = tryDifferentOne(this.topics, this.study, this.requiredDone, this.requiredDoing);

      if (!positioned) {
        // we could not position the node
        this.study = null;
        this.requiredDoing = [];
        qLog('Finished with no result');
        return;
      }
    }

    // if we could not find the position of the
    if (!positioned && !isRequired && this.optionalDoing.length === 0) {
      positioned = tryDifferentOne(
        this.topics,
        this.study,
        this.optionalDone,
        this.optionalDoing,
        this.requiredDone,
        this.requiredDoing
      );
    }

    // we have successfully positioned the node in the study
    // if there are oter possible placements we will add it back to the queue
    if (!positioned) {
      qLog('[WARN] Could not position: ' + logName(current));
    }

    //qLog("--------------------------------");
    if (positioned) {
      // logOption(this.study);
      evaluateStudy(this.courseCompletionCriteria, this.study, this.topics);
    }
    qLog('--------------------------------');
  }

  fullSearch() {
    this.study = [[], [], [], [], [], []];

    while (this.requiredDoing.length > 0 || this.optionalDoing.length > 0) {
      this.step();
    }
    return this.study;
  }

  evaluate(profile: TopicProfile[], study: Study) {
    // const profile = buildProfile(this.study, this.courseCompletionCriteria, this.topics).filter(p =>
    //   this.courseCompletionCriteria.topics.some(t => t.id === p.topicId)
    // );

    const available =
      240 -
      study.reduce((prev, next) => {
        const temp = next.reduce((sprev, snext) => sprev + snext.credits, 0);
        return prev + temp;
      }, 0);
    const completed = profile.reduce((prev, next) => prev + next.credits, 0);
    const missing = this.courseCompletionCriteria.totalCredits - completed;
    const completion =
      1 -
      profile.reduce((prev, next) => prev + next.missing, 0) /
        this.courseCompletionCriteria.totalCredits;

    return { available, completed, missing, completion };
  }

  combinationReport(maxCombinations) {
    let combinationReport: Array<{
      id: string;
      combinations: QNode[][];
      missing: number;
    }> = [];

    let required = this.requiredDoing.concat(this.requiredDone);

    // in the temp study we keep a theoretical study which has all the core units + all the currently used optional units
    let study: Study = [
      required.map(r => r.node),
      this.optionalDone.map(f => f.node),
      [],
      [],
      [],
      []
    ];
    let profile = buildProfile(study, this.courseCompletionCriteria, this.topics)
      //   .filter(
      //   p => p.topicId === '23'
      // );
      .filter(t => this.courseCompletionCriteria.topics.some(p => p.id === t.topicId));

    for (let p of profile) {
      const unused = this.optionalDoing
        // .concat(finder.optionalBlocks)
        .filter(f => f.node.topics.some(t => t.id === p.topicId));

      const criteria = this.courseCompletionCriteria.topics.find(t => t.id === p.topicId);

      let combinations = [];

      const gNodes: GeneratorNode[] = unused
        .map(u => ({
          qNode: u,
          topicCredits: u.node.topics.find(t => t.id === p.topicId).credits
        }))
        .sort((a, b) => (a.topicCredits < b.topicCredits ? 1 : -1));
      // console.log("=======================================");
      // console.log("Combinations for: " + p.name);
      // console.log("=======================================");

      if (criteria.credits - p.credits > 0) {
        const generator = new Generator(gNodes, criteria.credits - p.credits, maxCombinations);
        combinations = generator.generate();

        combinationReport.push({
          id: p.topicId,
          combinations,
          missing: criteria.credits - p.credits
        });
      } else {
        combinationReport.push({ id: p.topicId, combinations: [], missing: 0 });
        // console.log("No need: already completed");
      }
    }

    let totalCombinationCount = combinationReport.reduce(
      (prev, next) => (next.combinations.length || 1) * prev,
      1
    );

    return {
      combinationReport,
      totalCombinationCount,
      required,
      profile,
      ...this.evaluate(profile, study)
    };
  }

  initSearch({
    includeBlocks = [],
    includeUnits = [],
    excludeUnits = [],
    excludeBlocks = [],
    majors,
    course,
    jobs = []
  }: {
    course: CourseList;
    includeUnits: string[];
    excludeUnits: string[];
    includeBlocks: string[][];
    excludeBlocks: string[][];
    majors: MajorList[];
    jobs: string[];
  }) {
    let courseUnits = extractCriteriaUnits(course.completionCriteria);
    let { blockNodes, unitNodes } = createSearchNodes({ units: this.units });

    // add core units to mandatory include
    for (let unit of courseUnits) {
      if (includeUnits.indexOf(unit.id) === -1) {
        includeUnits.push(unit.id);
      }
    }

    // filter out all the nodes that we want to exclude
    let potentialBlocks = blockNodes.filter(s =>
      excludeBlocks.every(em => s.unit.id !== em[0] || s.block.id !== em[1])
    );

    // filter out all the nodes that we want to exclude
    let potentialUnits = unitNodes.filter(s => excludeUnits.every(eu => s.unit.id !== eu));

    // build new completion crieria, merging
    this.courseCompletionCriteria = mergeCompletionCriteria(
      clone(course.completionCriteria),
      ...majors.map(m => m.completionCriteria)
    );
    this.courseCompletionCriteria.topics.forEach(
      t => ((t as any).name = this.topics.find(tp => tp.id === t.id).name)
    );

    // heuristic sort of nodes
    let coreUnits = potentialUnits.filter(u => courseUnits.some(c => c.id === u.unit.id));

    // add semester information
    for (let node of coreUnits) {
      let info = courseUnits.find(c => c.id === node.unit.id);
      node.semester = info.semester;
    }

    let otherUnits = potentialUnits.filter(u => courseUnits.every(c => c.id !== u.unit.id));

    // init structures

    this.requiredDoing = coreUnits.map(r => ({
      node: r,
      semesters: [],
      dependencies: [],
      addedDependencies: [],
      isRequired: true
    }));
    this.requiredDone = [];
    this.optionalDoing = otherUnits.map(r => ({
      node: r,
      semesters: [],
      dependencies: [],
      addedDependencies: [],
      isRequired: false
    }));
    this.optionalDone = [];
    this.requiredBlocks = coreUnits.flatMap(u =>
      u.blocks.map(r => ({
        node: r,
        semesters: [],
        dependencies: [],
        addedDependencies: [],
        isRequired: true
      }))
    );
    this.optionalBlocks = otherUnits.flatMap(u =>
      u.blocks.map(r => ({
        node: r,
        semesters: [],
        dependencies: [],
        addedDependencies: [],
        isRequired: false
      }))
    );
    this.study = [[], [], [], [], [], []];

    // add the missing dependencies
    fillMissingDependencies(
      this.requiredDoing
        .concat(this.optionalDoing)
        .concat(this.optionalBlocks)
        .concat(this.requiredBlocks)
    );
    checkProblematicDependencies(this.requiredDoing, this.optionalDoing);

    // if it is not required we sort the optional units and modules by utility
    //if (!isRequired) {
    this.optionalDoing = sortNodes(
      this.study,
      this.optionalDoing,
      this.courseCompletionCriteria,
      this.topics
    );
  }
}

// search({
//   courseId: "3699",
//   majors: ["7600", "36992"],
//   includeUnits: [],
//   excludeUnits: [],
//   includeBlocks: [],
//   excludeBlocks: [],
//   jobs: [],
// });
