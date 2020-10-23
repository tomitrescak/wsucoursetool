import { Explorer } from './explorer';
import { SearchNode } from './search_helpers';
import { Validator } from './validator';

// src/workers/my-worker.ts
self.addEventListener(
  'message',
  function (e) {
    const validator = new Validator(e.data.requiredUnits, 100, Explorer.checkCombination);
    validator.validate(e.data.combinations);
    self.postMessage({ status: 'Finished' }, undefined);
  },
  false
);

export default null;
