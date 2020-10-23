import { groupByArray } from 'lib/helpers';
import { logSearchNode, SearchNode } from './search_helpers';

export type SortedNodes = Array<{ key: number; values: SearchNode[] }>;
export type ExplorerNode = {
  node: SearchNode;
  semesters: number[];
  semester: number;
  dependants: ExplorerNode[];
};
export type Study = [
  ExplorerNode[],
  ExplorerNode[],
  ExplorerNode[],
  ExplorerNode[],
  ExplorerNode[],
  ExplorerNode[]
];

let debug = true;

///////////////////////////////////////////////////////////////////////////
// SORT METHODS
///////////////////////////////////////////////////////////////////////////

type TopoConfig = {
  explored: Set<number>;
  result: SearchNode[];
  nodes: SearchNode[];
};

function addDependency(node: SearchNode, dependency: SearchNode, config: TopoConfig) {
  if (!config.explored.has(dependency.id)) {
    // we still have not explored this node
    expandDependencies(dependency, config, 1);
  }

  if (dependency.level != null) {
    // if it it unexplored dependency, we shift it one level up, where dependant nodes reside
    if (dependency.level === 0) {
      console.log('Reposition from 0');
      dependency.level = 1;
    }
  } else {
    // we add dependency to level 1 where dependant nodes reside
    dependency.level = 1;
  }

  // if the original node is not there, we add it une level up
  if (node.level == null) {
    node.level = dependency.level + 1;
  } else {
    // we have the original node, we may need to move it
    if (node.level <= dependency.level) {
      node.level = dependency.level + 1;
    }
  }
}

const emptyArray = [];

function expandDependencies(node: SearchNode, config: TopoConfig, index = 0) {
  config.explored.add(node.id);

  // add unit dependencies
  for (let dependency of node.dependsOn) {
    // find if this depdency does not exists in
    addDependency(node, dependency, config);
  }

  // add unit block dependencies
  for (let block of node.blocks || emptyArray) {
    for (let bd of block.dependsOn.filter(b => b.unit.id !== block.unit.id)) {
      let blockUnitDependency = config.nodes.find(n => n.unit.id === bd.unit.id && n.block == null);
      addDependency(node, blockUnitDependency, config);
    }
  }

  // try to find if any of the dependencies is in the array

  // this node has not been processed with dependencies, we add it to the no-dependency collection
  config.result.push(node);

  // if (config.result.length > 1) {
  //   for (let i = 0; i < config.result.length - 1; i++) {
  //     for (let node of config.result[i]) {
  //       for (let j = i + 1; j < config.result.length; j++) {
  //         if (config.result[j].indexOf(node) !== -1) {
  //           throw new Error('Not good');
  //         }
  //       }
  //     }
  //   }
  // }
}

function topologicalSort(nodes: SearchNode[]) {
  let config: TopoConfig = { result: [], explored: new Set(), nodes };

  // we will continue until we use all the nodes
  for (let node of nodes) {
    if (!config.explored.has(node.id)) {
      node.level = 0;
      expandDependencies(node, config);
    }
  }

  // sort each layer so that assigned nodes nome first
  let groups = groupByArray<SearchNode, number>(config.result, 'level').sort((a, b) =>
    a.key < b.key ? -1 : 1
  );

  groups[0].values.sort((a, b) => (a.semester < b.semester ? -1 : 1));

  return groups;
}

function findMinimumSemester(node: SearchNode) {
  if (node.dependsOn.length === 0) {
    node.minSemester = 0;
    return;
  }

  let length = node.dependsOn.reduce((prev, next) => {
    // if unit is offered in both semesters the length is 1
    // if unit is offered in the same semester as any of its depenedencies the length will be 2 (e.g. unit and dependency are on offer in autumn)
    // if dependency has been processed we accept its length
    // we either take the maxLevel of the processed node or we calculate the length
    let current = next.minSemester + (node.offer === 2 || node.offer !== next.offer ? 1 : 2);
    return current > prev ? current : prev;
  }, 1);
  let parent = node;

  // increase
  while (parent != null) {
    parent.minSemester += length;
    parent = parent.parent;
  }

  // now process all dependencies
  for (let dependency of node.dependsOn) {
    if (!dependency.minSemester) {
      dependency.parent = node;
      findMinimumSemester(dependency);
    }
  }
}

function assignMinimumSemester(nodes: Array<{ key: number; values: SearchNode[] }>) {
  // we do this in two steps
  // 1. we explore all the dependency routes and count the path lengths to the latest nodes
  // 2. we position nodes from top level to end level

  // clear and set default values
  for (let group of nodes) {
    for (let node of group.values) {
      node.minSemester = 0;
    }
  }

  // 1. assign minimum semester
  for (let i = 0; i < nodes.length; i++) {
    // skip first two groups which have no dependencies
    if (i < 2) {
      continue;
    }
    for (let node of nodes[i].values) {
      if (!node.minSemester) {
        findMinimumSemester(node);
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////
// HELPER METHODS
///////////////////////////////////////////////////////////////////////////

function qLog(message: string) {
  // console.log(message);
  if (debug) {
    Explorer.log += message + '\n';
  }
}

/**
 * Calculates credits of a given semester assuming we add a new node
 * - If this is a unit node, we will ignore all block nodes from the same node
 * - If it is a block node
 * @param semester
 * @param node
 */
export function canPlaceInSemester(node: ExplorerNode, study: Study, semester: number) {
  return (
    study[semester].reduce(
      (prev, next) =>
        (next.node.block == null ||
        next.node.unit.id !== node.node.unit.id ||
        node.node.block != null
          ? next.node.credits
          : 0) + prev,
      0
    ) +
      node.node.credits <=
    40
  );
}

export function calculateCredits(semester: ExplorerNode[]) {
  return semester.reduce(
    (prev, next) =>
      (next.node.block == null ||
      semester.every(s => s.node.unit.id !== next.node.unit.id || s.node.block != null)
        ? next.node.credits
        : 0) + prev,
    0
  );
}

function addToSemester(node: ExplorerNode, study: Study, semester: number, alsoStudy = true) {
  if (alsoStudy) {
    study[semester].push(node);
  }
  node.semesters.push(semester);
  node.semester = semester;
  return true;
}

function cannotAddToSemester(node: ExplorerNode, semester: number) {
  node.semesters.push(semester);
  node.semester = null;
  return false;
}

function removeFromStudy(study: Study, node: ExplorerNode) {
  for (let s of study) {
    if (s.indexOf(node) >= 0) {
      s.splice(s.indexOf(node), 1);
      node.semester = null;
      break;
    }
  }
}

///////////////////////////////////////////////////////////////////////////
// CLASS
///////////////////////////////////////////////////////////////////////////

export class Explorer {
  static log = '';

  // check for combination and returns result immediately
  static checkCombination = (nodes: SearchNode[]) => {
    // create study
    let explorer = new Explorer(nodes);
    let study = explorer.fullSearch();

    if (study) {
      self.postMessage({ status: 'Result', study }, undefined);
      return true;
    }

    return false;
  };

  doing: ExplorerNode[];
  done: ExplorerNode[];
  study: Study = [[], [], [], [], [], []];

  autumnCredits: number;
  springCredits: number;

  nodes: SortedNodes;
  usePredefinedSemesters: boolean;

  constructor(combination: SearchNode[]) {
    // break into individual semesters
    this.nodes = topologicalSort(combination);

    // find the minimum semester for each node
    assignMinimumSemester(this.nodes);

    this.autumnCredits = combination
      .filter(d => d.unit.offer.indexOf('sp') === -1)
      .reduce((prev, next) => next.credits + prev, 0);

    this.springCredits = combination
      .filter(d => d.unit.offer.indexOf('au') === -1)
      .reduce((prev, next) => next.credits + prev, 0);

    this.init(true);
  }

  init(usePredefinedSemesters: boolean) {
    this.usePredefinedSemesters = usePredefinedSemesters;

    this.doing = [...this.nodes].flatMap(group =>
      group.values.map(node => ({
        node,
        semesters: [],
        dependants: [],
        semester: null
      }))
    );

    // add dependants (courtesy)
    for (let node of this.doing) {
      for (let dependency of node.node.dependsOn) {
        let dependant = this.doing.find(d => d.node.id === dependency.id);
        if (dependant.dependants.indexOf(node) === -1) {
          dependant.dependants.push(node);
        }
      }
    }

    this.done = [];
    this.study = [[], [], [], [], [], []];
  }

  checkNodesWithBothSemesters(node: ExplorerNode, study: Study, semester: number) {
    if (node.node.offer === 2) {
      // get total for given smeester for nodes that can be added to any semster
      let total = study.reduce(
        (prevSemester, nextSemester) =>
          prevSemester +
          nextSemester.reduce(
            (prevNode, nextNode) =>
              prevNode +
              (nextNode.node.offer === 2 && node.semester % 2 === semester % 2
                ? node.node.credits
                : 0),
            0
          ),
        0
      );

      // if we reached the limit for the given semester we will not consider it
      if (semester % 2 == 0) {
        // autumn semester
        if (total + this.autumnCredits > 120) {
          return false;
        }
      } else {
        // spring semester
        if (total + this.springCredits > 120) {
          return false;
        }
      }
    }
    return true;
  }

  // tryDifferentOne(study: Study, done: ExplorerNode[], doing: ExplorerNode[]) {
  //   qLog('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
  //   qLog('Trying a different option.');

  //   if (done.length === 0) {
  //     return false;
  //   }

  //   let canUse = false;
  //   do {
  //     let renew = done.pop();
  //     qLog(`\nREMOVING: ${logSearchNode(renew.node)}\n`);

  //     // remove elements from study
  //     removeFromStudy(study, renew);

  //     // add it back to processing
  //     doing.push(renew);

  //     canUse = this.tryPositionNode(renew, study);

  //     // erase its current use
  //     if (!canUse) {
  //       renew.semesters = [];
  //     }
  //   } while (done.length > 0 && canUse == false);

  //   if (!canUse) {
  //     console.log('Ran out of options');
  //     return false;
  //   }
  //   qLog('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
  //   return true;
  // }

  findPossibleSemester(node: ExplorerNode, study: Study) {
    // this will be the dependant that is in the lowest semester
    let dependant: ExplorerNode;

    // adding a block
    // if there is a unit already placed for this block node we add block to the same semester
    if (node.node.block != null) {
      let semester = study.findIndex(s =>
        s.some(n => n.node.unit.id === node.node.unit.id && n.node.block == null)
      );
      if (semester != -1) {
        return addToSemester(node, study, semester, false);
      }
      // find if there is another block from this unit
      // if there is, we must position it in the same semester
      semester = study.findIndex(s => s.some(n => n.node.unit.id === node.node.unit.id));
      if (semester != -1) {
        if (canPlaceInSemester(node, study, semester)) {
          return addToSemester(node, study, semester);
        }
        return cannotAddToSemester(node, semester);
      }
    }

    // adding a unit
    // if there is alrwady a block positioned, we remove it and try to position the whole unit there
    if (node.node.block == null) {
      let semester = study.findIndex(s =>
        s.some(n => n.node.unit.id === node.node.unit.id && n.node.block != null)
      );
      if (semester != -1) {
        // remove these blocks from the semester and try to replace them with
        let blocks = study[semester].filter(
          n => n.node.unit.id === node.node.unit.id && n.node.block != null
        );
        for (let block of blocks) {
          study[semester].splice(study[semester].indexOf(block), 1);
        }
        if (canPlaceInSemester(node, study, semester)) {
          return addToSemester(node, study, semester);
        }
        // add back the block nodes as we need to try a different strategy
        for (let block of blocks) {
          study[semester].push(block);
        }
        return cannotAddToSemester(node, semester);
      }
    }

    // find the dependant
    // it is either in the lower semster or in the same semester with longer path (semesters are equal)

    let minSemester = 0;

    // first we try with the proposed semester
    if (
      this.usePredefinedSemesters &&
      node.node.semester &&
      node.semesters.indexOf(node.node.semester - 1) === -1
    ) {
      if (
        this.checkNodesWithBothSemesters(node, study, node.node.semester - 1) &&
        canPlaceInSemester(node, study, node.node.semester - 1)
      ) {
        return addToSemester(node, study, node.node.semester - 1);
      }
    }
    // otherwise we find the best possible semester based on dependants

    for (let unit of node.dependants) {
      if (unit.semester == null) {
        throw new Error('All dependants must be positioned!');
      }
      if (
        dependant == null ||
        unit.semester < dependant.semester ||
        (unit.semester === dependant.semester &&
          unit.node.offer !== 2 &&
          unit.node.offer === dependant.node.offer)
      )
        dependant = unit;
    }

    // it is either the
    minSemester =
      dependant == null
        ? 5
        : dependant.semester -
          (dependant.node.offer === 2 || dependant.node.offer !== node.node.offer ? 1 : 2);

    for (let i = minSemester; i >= 0; i--) {
      // skip semesters when unit is not on offer
      if (i < node.node.minSemester) {
        break;
      }

      if (
        (i % 2 == 0 && node.node.unit.offer.indexOf('au') === -1) ||
        (i % 2 == 1 && node.node.unit.offer.indexOf('sp') === -1)
      ) {
        continue;
      }

      // if the unit can be positioned in both semesters make sure it is not positioned over the limit for that given semester
      if (!this.checkNodesWithBothSemesters(node, study, i)) {
        continue;
      }

      if (!canPlaceInSemester(node, study, i)) {
        continue;
      }

      if (node.semesters.indexOf(i) === -1) {
        return addToSemester(node, study, i);
      }
    }

    node.semester = null;
    return false;
  }

  tryPositionNode(current: ExplorerNode, study: Study) {
    qLog('============================');
    qLog('Positioning: ' + logSearchNode(current.node));
    qLog('============================');

    if (study.some(s => s.some(n => n === current))) {
      return true;
    }

    // Position unit in the study
    return this.findPossibleSemester(current, study);
  }

  step() {
    if (this.doing.length === 0) {
      qLog('Finished!');
      return true;
    }

    let current = this.doing.pop();
    this.done.push(current);

    // Add dependencies
    let positioned = this.tryPositionNode(current, this.study);

    // if we could not position of the required node we will try to position the parent node in a different semester
    if (!positioned) {
      // we try in a different semester
      // positioned = this.tryDifferentOne(this.study, this.done, this.doing);

      // if (!positioned) {
      //   // we could not position the node
      //   this.study = null;
      //   this.doing = [];
      //   qLog('Finished with no result');
      //   return;
      // }
      return false;
    }
    qLog('--------------------------------');
    return true;
  }

  fullSearch() {
    this.study = [[], [], [], [], [], []];

    while (this.doing.length > 0) {
      if (this.step() == false) {
        // we can try to not use predefined semesters and try to generate arbutraty schedulw
        if (this.usePredefinedSemesters) {
          this.init(false);
        } else {
          return null;
        }
      }
    }
    return this.study;
  }
}
