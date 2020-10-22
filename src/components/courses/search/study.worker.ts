import { Explorer } from './explorer';
import { SearchNode } from './search_helpers';
import { Validator } from './validator';

// src/workers/my-worker.ts
self.addEventListener(
  'message',
  function (e) {
    // check for combination and returns result immediately
    const checkCombination = (nodes: SearchNode[]) => {
      // create study
      let explorer = new Explorer(nodes.concat(e.data.requiredUnits));
      let study = explorer.fullSearch();

      if (study) {
        self.postMessage({ status: 'Result', study }, undefined);
        return true;
      }

      return false;
    };

    const validator = new Validator(e.data.requiredUnits, 100, checkCombination);
    validator.validate(e.data.combinations);
    self.postMessage({ status: 'Finished' }, undefined);
  },
  false
);

export default null;
