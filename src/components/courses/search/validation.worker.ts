class Validator {
  maxViableCombinations = 5;
  result = null;
  combinations;
  requiredCredits;

  constructor(requiredUnits) {
    this.requiredCredits = requiredUnits.reduce((prev, next) => next.node.credits + prev, 0);
  }

  validate(combinations) {
    this.combinations = combinations;
    this.result = [];
    this.validatePosition(null);
    return this.result;
  }

  validateSolution(parent) {
    let nodes = [];

    // reconstruct the study
    while (parent != null) {
      for (let node of parent.nodes) {
        // if we have a  unit node, remove all block nodes and keep only a unit node
        if (node.node.block == null && nodes.find(n => n.node.unit.id === node.node.unit.id)) {
          nodes = nodes.filter(n => n.node.unit.id !== node.node.unit.id);
        }

        // if we have a block node and we have a unit node already there we do not add it
        if (
          node.node.block != null &&
          nodes.find(n => n.node.unit.id === node.node.unit.id && n.node.block == null)
        ) {
          continue;
        }

        // add the node
        if (nodes.every(n => n.node != node.node)) {
          nodes.push(node);
        }

        // add all dependencies of this node that
        //  1. are not from required set
        //  2. [if it is unit or block] do not exist already in the node list
        //  3. [if it is block] do not exist in
        for (let dependency of node.dependencies) {
          if (
            !dependency.isRequired &&
            nodes.every(
              n =>
                n.node != dependency.node &&
                (n.node.unit !== dependency.node.unit ||
                  (n.node.block != null && n.node.block !== dependency.node.block))
            )
          ) {
            nodes.push(dependency);
          }
        }
      }
      parent = parent.parent;
    }

    // the only validation criteria is that we are under 240 credits in total
    let totalCredits = nodes.reduce((prev, next) => prev + next.node.credits, 0);
    if (totalCredits + this.requiredCredits <= 240.1) {
      this.result.push(nodes);
    }
  }

  /** Checks the combinations and filters out those that require more than 240 credits to complete */
  validatePosition(parent, pos = 0) {
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

// src/workers/my-worker.ts
self.addEventListener(
  'message',
  function (e) {
    const validator = new Validator(e.data.requiredUnits);
    const result = validator.validate(e.data.combinations);
    self.postMessage({ status: 'Finished', result }, undefined);
  },
  false
);

export default null as any;
