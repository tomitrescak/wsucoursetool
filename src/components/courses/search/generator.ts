import { SearchNode } from './search_helpers';

export type GeneratorNode = { node: SearchNode; topicCredits: number };

type GParent = {
  parent: GParent;
  generatorNode: GeneratorNode;
};

function isUnitInParent(parent: GParent, unitId: string) {
  if (parent == null) {
    return false;
  }
  if (parent.generatorNode.node.unit.id === unitId) {
    return true;
  }
  return isUnitInParent(parent.parent, unitId);
}

export class Generator {
  private sets: SearchNode[][];

  constructor(private nodes: GeneratorNode[], private min: number, private maxCombinations = 20) {}

  generate() {
    this.sets = [];
    this.generateCombinations();
    return this.sets;
  }

  private generateCombinations(
    currentNode: GParent = null,
    pos: number = 0,
    currentCredits: number = 0
  ) {
    if (this.sets.length > this.maxCombinations) {
      console.log('We reached the amount of combinations we are happy with ...');
      return;
    }

    let remainingCredits = this.nodes.reduce(
      (prev, next, i) => prev + (i < pos ? 0 : next.topicCredits),
      0
    );
    if (remainingCredits + currentCredits < this.min) {
      // console.log("Abrupt end, impossible to finish ...");
      return;
    }

    // resolve the combination and add all nodes
    if (currentCredits >= this.min) {
      let result: SearchNode[] = [];
      let p = currentNode;
      while (p != null && p.generatorNode != null) {
        result.push(p.generatorNode.node);
        p = p.parent;
      }
      this.sets.push(result);
      return;
    }

    for (let i = pos; i < this.nodes.length; i++) {
      if (this.sets.length > this.maxCombinations) {
        break;
      }

      const parentNode: GParent = {
        parent: currentNode,
        generatorNode: this.nodes[i]
      };

      // skip the block node if we have unit node in the current history
      if (
        parentNode.generatorNode.node.block &&
        isUnitInParent(currentNode, parentNode.generatorNode.node.unit.id)
      ) {
        continue;
      }

      this.generateCombinations(parentNode, i + 1, this.nodes[i].topicCredits + currentCredits);
    }
  }
}

type VParent = { parent: VParent; nodes: SearchNode[] };
type TopicCombination = { id: string; combinations: SearchNode[][] };
export class Validator {
  private maxViableCombinations = 5;
  private result: SearchNode[][];
  private combinations: TopicCombination[];
  private requiredCredits: number;

  constructor(requiredUnits: SearchNode[]) {
    this.requiredCredits = requiredUnits.reduce((prev, next) => next.credits + prev, 0);
  }

  validate(combinations: TopicCombination[]) {
    this.combinations = combinations;
    this.result = [];
    this.validatePosition(null);
    return this.result;
  }

  private validateSolution(parent: VParent) {
    let nodes: SearchNode[] = [];

    // reconstruct the study
    while (parent != null) {
      for (let node of parent.nodes) {
        // if we have a  unit node, remove all block nodes and keep only a unit node
        if (node.block == null && nodes.find(n => n.unit.id === node.unit.id)) {
          nodes = nodes.filter(n => n.unit.id !== node.unit.id);
        }

        // if we have a block node and we have a unit node already there we do not add it
        if (node.block != null && nodes.find(n => n.unit.id === node.unit.id && n.block == null)) {
          continue;
        }

        // add the node
        if (nodes.every(n => n != node)) {
          nodes.push(node);
        }

        // add all dependencies of this node that
        //  1. are not from required set
        //  2. [if it is unit or block] do not exist already in the node list
        //  3. [if it is block] do not exist in
        for (let dependency of node.dependsOn) {
          if (
            !dependency.isRequired &&
            nodes.every(
              n =>
                n != dependency &&
                (n.unit !== dependency.unit || (n.block != null && n.block !== dependency.block))
            )
          ) {
            nodes.push(dependency);
          }
        }
      }
      parent = parent.parent;
    }

    // the only validation criteria is that we are under 240 credits in total
    let totalCredits = nodes.reduce((prev, next) => prev + next.credits, 0);
    if (totalCredits + this.requiredCredits <= 240.1) {
      this.result.push(nodes);
    }
  }

  /** Checks the combinations and filters out those that require more than 240 credits to complete */
  private validatePosition(parent: VParent, pos: number = 0) {
    if (this.result.length >= this.maxViableCombinations) {
      return;
    }
    // we are at the end
    if (pos === this.combinations.length) {
      this.validateSolution(parent);
      return;
    }

    // recursively check all combination
    let item = this.combinations[pos];

    // if this item has no combinations we continue with the next one
    if (item.combinations.length == 0) {
      this.validatePosition(parent, pos + 1);
    } else {
      // we recursively check each possible combination
      for (let i = 0; i < item.combinations.length; i++) {
        if (this.result.length > this.maxViableCombinations) {
          break;
        }
        const node = { parent, nodes: item.combinations[i] || [] };
        this.validatePosition(node, pos + 1);
      }
    }
  }
}
