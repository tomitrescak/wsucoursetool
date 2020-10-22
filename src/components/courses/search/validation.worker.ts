import { Validator } from './validator';

// src/workers/my-worker.ts
self.addEventListener(
  'message',
  function (e) {
    const validator = new Validator(e.data.requiredUnits, 100, null);
    const result = validator.validate(e.data.combinations);
    self.postMessage({ status: 'Finished', result }, undefined);
  },
  false
);

export default null;
