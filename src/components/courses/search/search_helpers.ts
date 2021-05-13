// fill the core
// use 180 credits

import { CourseCompletionCriteria, SfiaSkillMapping, Topic } from 'components/types';
import { Entity, UnitBlock, UnitList } from 'config/graphql';

export type TopicSummary = { id: string; credits: number };

export type SearchNode = {
  id: number;
  block?: UnitBlock;
  unit: UnitList;
  // include?: boolean;
  blocks?: SearchNode[];
  dependsOn: SearchNode[];
  topics: TopicSummary[];
  sfiaSkills: SfiaSkillMapping[];
  semester: number;
  credits: number;
  isRequired?: boolean;
  level?: number;
  minSemester?: number;
  parent?: SearchNode;
  /**
   * 0 - Autumn
   * 1 - Spring
   * 2 - Autumn and Spring
   */
  offer: 0 | 1 | 2;
};

// export const db: {
//   units: Array<{
//     id: string;
//     blocks: Array<{ id: string }>;
//   }>;
//   topics: Array<{ id: string; name: string }>;
// };

export function unique(arr: any[]) {
  return Array.from(new Set(arr));
}

export function clone<T>(item: T): T {
  return JSON.parse(JSON.stringify(item));
}

// export function getUnit(id: string) {
//   return db.units.find(u => u.id === id);
// }

// export function getBlock(address: [string, string]) {
//   return db.units.find(u => u.id === address[0]).blocks.find(b => b.id === address[1]);
// }

export function procesBlock(block, topics) {
  for (let topic of block.topics || []) {
    if (topics[topic.id] == null) {
      topics[topic.id] = { credits: 0 };
    }
    topics[topic.id].credits += block.credits * topic.ratio;
  }
}

export function mergeCompletionCriteria(
  c1: CourseCompletionCriteria,
  ...cs: CourseCompletionCriteria[]
) {
  c1.topics.forEach(t => (t.credits = parseFloat((t.credits as unknown) as string)));

  for (let c2 of cs) {
    c2.topics.forEach(t => (t.credits = parseFloat((t.credits as unknown) as string)));
    for (let t of c2.topics) {
      let existingTopic = c1.topics.find(ct => ct.id === t.id);
      if (existingTopic) {
        existingTopic.credits =
          existingTopic.credits < t.credits ? t.credits : existingTopic.credits;
      } else {
        c1.topics.push(clone(t));
      }
    }
  }

  c1.totalCredits = c1.topics.reduce((prev, next) => next.credits + prev, 0);

  return c1;
}

export type TopicProfile = {
  topicId: string;
  credits: number;
  missing: number;
  name: string;
  completion: number;
};

export function round(num: number, dec = 1) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

export function logSearchNode(node: SearchNode, id = false) {
  return (
    node.unit.name + (id ? ` (${node.unit.id})` : '') + (node.block ? ' > ' + node.block.name : '')
  );
}

function logDependencies(node: SearchNode, level = 2) {
  if (node.dependsOn.length === 0) {
    return '';
  }
  return node.dependsOn
    .map(
      n =>
        ''.padStart(level) +
        '+ ' +
        logSearchNode(n) +
        (n.dependsOn.length ? '\n' + logDependencies(n, level + 2) : '')
    )
    .join('\n');
}

export function inlineLogDependencies(node: SearchNode) {
  if (node.dependsOn.length === 0) {
    return '';
  }
  return node.dependsOn
    .map(n => logSearchNode(n) + (n.dependsOn.length ? ', ' + logDependencies(n) : ''))
    .join(', ');
}

/** Checks for completion criteria given a study profile */
export function buildProfile(
  study: Array<Array<SearchNode>>,
  completionCriteria: CourseCompletionCriteria,
  topics: Entity[]
): TopicProfile[] {
  let allTopics = {};
  // accumulate credits
  for (let semester of study) {
    // we will only consider unit members or block members that do not have the unit present in the semester
    for (let part of semester.filter(
      s => s.block == null || semester.every(t => t.unit.id !== s.unit.id || t.block != null)
    )) {
      // if (Array.isArray(part)) {
      //   let block = getBlock(part);
      //   procesBlock(block, topics);
      // } else {
      let unit = part.unit; // getUnit(part);
      for (let block of unit.blocks) {
        procesBlock(block, allTopics);
      }
      // }
    }
  }
  // calculate completion
  for (let key in allTopics) {
    let c = completionCriteria.topics.find(t => t.id === key);
    allTopics[key].name = topics.find(t => t.id === key).name;
    if (c) {
      allTopics[key].missing =
        c.credits - allTopics[key].credits > 0 ? c.credits - allTopics[key].credits : 0;

      // cut it at the top and do not allow overcompletion
      if (allTopics[key].credits > c.credits) {
        allTopics[key].credits = c.credits;
      }

      allTopics[key].completion = Math.round((allTopics[key].credits / c.credits) * 100);
    }
  }

  // add missing completion criteria
  for (let topic of completionCriteria.topics) {
    if (allTopics[topic.id] == null) {
      allTopics[topic.id] = {
        credits: 0,
        missing: topic.credits,
        name: topics.find(t => t.id === topic.id).name,
        completion: 0
      };
    }
  }
  return Object.keys(allTopics).map(key => ({
    ...allTopics[key],
    topicId: key
  }));
}
