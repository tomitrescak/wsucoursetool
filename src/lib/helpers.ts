import { CourseCompletionCriteria, UnitCondition } from 'components/types';

export function url(str: string = '') {
  let result = str.replace(/:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);

  while (result[result.length - 1] === '-') {
    result = result.substring(0, result.length - 1);
  }

  return result.toLowerCase();
}

export function findMaxId(collection: any[]) {
  return findNumericMaxId(collection).toString();
}

export function findNumericMaxId(collection: any[]) {
  let id = 0;
  for (let item of collection) {
    if (parseInt(item.id) >= id) {
      id = parseInt(item.id) + 1;
    }
  }
  return id;
}

type Mapped<T> = {
  [P in keyof T]: any;
};

export function buildForm<T>(obj: T, keys: Array<keyof T>): Mapped<T> {
  if (obj == null) {
    return {} as any;
  }
  const result = {};
  for (let key of keys) {
    result[key as any] = (e: React.ChangeEvent<HTMLInputElement>) =>
      (obj[key as any] = e.currentTarget.value);
  }
  return result as any;
}

export function viewType() {
  return window.location.href.indexOf('/view/') > 0 ? 'view' : 'editor';
}

function processUnitCondition(u: UnitCondition) {
  if (u.id) {
    return u;
  } else if (u.or) {
    return u.or.flatMap(c => processUnitCondition(c));
  }
}

export function extractCriteriaUnits(criteria: CourseCompletionCriteria): UnitCondition[] {
  return criteria.units.flatMap(u => {
    return processUnitCondition(u);
  });
}

/*!
 * Group items from an array together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export const groupBy = function (arr, criteria) {
  return arr.reduce(function (obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    var key = typeof criteria === 'function' ? criteria(item) : item[criteria];

    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
};

export function groupByArray<T, U>(
  xs: T[],
  key: string | ((t: T) => boolean)
): Array<{ key: U; values: T[] }> {
  return xs.reduce(function (previous, current) {
    let v = key instanceof Function ? key(current) : current[key];
    let el = previous.find(r => r && r.key === v);
    if (el) {
      el.values.push(current);
    } else {
      previous.push({
        key: v,
        values: [current]
      });
    }
    return previous;
  }, []);
}
export default groupByArray;
