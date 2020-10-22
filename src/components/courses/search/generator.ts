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
