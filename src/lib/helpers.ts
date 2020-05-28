export function url(str: string) {
  let result = str.replace(/:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);
  return result.toLowerCase();
}

export function findMaxId(collection: any[]) {
  for (let i = 0; i < 10000; i++) {
    if (collection[i].id !== i.toString()) {
      return i.toString();
    }
  }
  return '0';
}
