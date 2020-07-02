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
  let id = 0;
  for (let item of collection) {
    if (parseInt(item.id) >= id) {
      id = parseInt(item.id) + 1;
    }
  }
  return id.toString();
}

type Mapped<T> = {
  [P in keyof T]: any;
};

export function buildForm<T>(obj: T, keys: Array<keyof T>): Mapped<T> {
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
