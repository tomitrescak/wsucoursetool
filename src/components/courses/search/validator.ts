import { SearchNode } from './search_helpers';

type VParent = { parent: VParent; nodes: SearchNode[] };
type TopicCombination = { id: string; combinations: SearchNode[][] };

type Checker = (combination: SearchNode[]) => boolean;

export class Validator {
  private currentCombinations = 0;
  private result: SearchNode[][];
  private combinations: TopicCombination[];
  private requiredCredits: number;

  constructor(
    requiredUnits: SearchNode[],
    private maxViableCombinations = 100,
    private checkCombination: Checker
  ) {
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
      if (this.checkCombination) {
        if (this.checkCombination(nodes)) {
          this.currentCombinations++;
        }
      } else {
        this.result.push(nodes);
        this.currentCombinations++;
      }
    }
  }

  /** Checks the combinations and filters out those that require more than 240 credits to complete */
  private validatePosition(parent: VParent, pos: number = 0) {
    if (this.currentCombinations > this.maxViableCombinations) {
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
        if (this.currentCombinations > this.maxViableCombinations) {
          break;
        }
        const node = { parent, nodes: item.combinations[i] || [] };
        this.validatePosition(node, pos + 1);
      }
    }
  }
}
