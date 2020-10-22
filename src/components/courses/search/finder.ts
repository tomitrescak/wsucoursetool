import fs from 'fs';
// expands options in the option array
// each semester has following properties:

import {
  buildProfile,
  clone,
  logSearchNode,
  mergeCompletionCriteria,
  SearchNode,
  TopicProfile
} from './search_helpers';
import { CourseCompletionCriteria } from 'components/types';
import { CourseList, Entity, MajorList, UnitList } from 'config/graphql';
import { extractCriteriaUnits } from 'lib/helpers';
import { createSearchNodes } from './search_structures';
import { Generator, GeneratorNode } from './generator';

function utility(
  a: SearchNode,
  completionCriteria: CourseCompletionCriteria,
  rarity: { [index: string]: { sources: number; credits: number } },
  profile: TopicProfile[]
) {
  return a.topics
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

function removeFromStudy(study: Study, node: SearchNode) {
  for (let s of study) {
    if (s.indexOf(node) >= 0) {
      s.splice(s.indexOf(node), 1);
      break;
    }
  }
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

function checkProblematicDependencies(requiredDoing: SearchNode[], optionalDoing: SearchNode[]) {
  // check all dependencies
  let problematic = requiredDoing.filter(r =>
    r.dependsOn.some(d => d.block == null && optionalDoing.some(o => o === d))
  );

  if (problematic.length > 0) {
    qLog(
      `[ERROR]: Following ${problematic.length} required units have dependenc(ies) which are considered optional`
    );
    problematic.forEach(p => {
      let badDeps = p.dependsOn.filter(d => d.block == null && optionalDoing.some(o => o === d));
      badDeps.forEach(bd => {
        qLog(logSearchNode(p, true) + ' -> ' + logSearchNode(bd, true));
        let index = optionalDoing.indexOf(p);
        if (index >= 0) {
          optionalDoing.splice(index, 1);
        }
      });
    });
  }
}

export type CombinationReport = {
  id: string;
  combinations: SearchNode[][];
  missing: number;
};

export class Finder {
  static log = '';

  requiredDoing: SearchNode[];
  requiredDone: SearchNode[] = [];
  optionalDoing: SearchNode[];
  optionalDone: SearchNode[] = [];
  optionalBlocks: SearchNode[] = [];
  requiredBlocks: SearchNode[] = [];
  study: Study;
  // dependencies: SearchNode[];
  courseCompletionCriteria: CourseCompletionCriteria;

  constructor(private topics: Entity[], private units: UnitList[]) {}

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
    let combinationReport: CombinationReport[] = [];

    let required = this.requiredDoing.concat(this.requiredDone);

    // in the temp study we keep a theoretical study which has all the core units + all the currently used optional units
    let study: Study = [
      required,
      [], // this.optionalDone,
      [],
      [],
      [],
      []
    ];

    //  this profile marks completion of all units that are mandatory included
    let profile = buildProfile(study, this.courseCompletionCriteria, this.topics).filter(t =>
      this.courseCompletionCriteria.topics.some(p => p.id === t.topicId)
    );

    for (let p of profile) {
      const unused = this.optionalDoing
        // .concat(finder.optionalBlocks)
        .filter(f => f.topics.some(t => t.id === p.topicId));

      const criteria = this.courseCompletionCriteria.topics.find(t => t.id === p.topicId);

      let combinations = [];

      const gNodes: GeneratorNode[] = unused
        .map(u => ({
          node: u,
          topicCredits: u.topics.find(t => t.id === p.topicId).credits
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

    // build new completion crieria, merging with all provided majors
    this.courseCompletionCriteria = mergeCompletionCriteria(
      clone(course.completionCriteria),
      ...majors.map(m => m.completionCriteria)
    );
    this.courseCompletionCriteria.topics.forEach(
      t => ((t as any).name = this.topics.find(tp => tp.id === t.id).name)
    );

    // isolate core units (required units)
    let coreUnits = potentialUnits.filter(u => courseUnits.some(c => c.id === u.unit.id));
    // isolate optional units
    let otherUnits = potentialUnits.filter(u => courseUnits.every(c => c.id !== u.unit.id));

    // add semester information and mark nodes as required
    for (let node of coreUnits) {
      let info = courseUnits.find(c => c.id === node.unit.id);
      node.semester = info.semester;
      node.isRequired = true;

      for (let block of node.blocks) {
        block.isRequired = true;
      }
    }

    // init structures

    this.requiredDoing = coreUnits;
    this.requiredDone = [];
    this.optionalDoing = otherUnits;
    this.optionalDone = [];
    this.requiredBlocks = coreUnits.flatMap(u => u.blocks);
    this.optionalBlocks = otherUnits.flatMap(u => u.blocks);
    this.study = [[], [], [], [], [], []];

    checkProblematicDependencies(this.requiredDoing, this.optionalDoing);
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
