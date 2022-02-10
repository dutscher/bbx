export const localStore = {
  set: (key: string, value?: any) => {
    return localStorage.setItem(key, value);
  },
  get: (key: string, defaultShizzle?: any) => {
    const lsShizzle = localStorage.getItem(key);
    return JSON.parse(lsShizzle);
  },
  remove: (key: string) => {
    return localStorage.removeItem(key);
  },
  visibility: (key: string, set?: boolean) => {
    const lsKey = 'visibility';
    const store = localStore.get(lsKey) || {};

    if (key === 'reset') {
      localStore.set(lsKey, '{}');
    } else {
      if (set === undefined) {
        return store[key] || null;
      } else {
        store[key] = set;
        localStore.set(lsKey, JSON.stringify(store));
      }
    }
  },
};
