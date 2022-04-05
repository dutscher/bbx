import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultList = 'default';
const defaultListName = 'Merkliste';
const defaultStore = [{ id: 0, d: true, t: defaultListName, i: [] }];
let lsStore = localStore.get(lsKey, defaultStore);

if (lsStore) {
  // fallback do migration / [103217] -> { default: {t:'Merkliste',i:[103217]} }
  if (Array.isArray(lsStore) && typeof lsStore[0] === 'number') {
    localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: defaultListName, i: lsStore } }));
    lsStore = localStore.get(lsKey);
    // fallback do migration / {"default":[104000,104185,105030,104953]} -> { default:{t:'Merkliste',i:[103217]} }
  } else if (defaultList in lsStore && Array.isArray(lsStore.default)) {
    localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: defaultListName, i: lsStore.default } }));
    lsStore = localStore.get(lsKey);
  } else if (defaultList in lsStore && !('id' in lsStore.default)) {
    // {default:{t:'Brauch ich unbedingt',i:[104000,104185,104953]}}} -> [{id:0,d:true,t:'Brauch ich unbedingt',i:[104000,104185,104953]}}]
    let newStore = [];
    Object.keys(lsStore).map((heartListName, id) => {
      const { t, i } = lsStore[heartListName];
      let newHeart = { id, t, i };
      if (heartListName === defaultList) {
        // @ts-ignore
        newHeart.d = true;
      }
      newStore.push(newHeart);
      return true;
    });
    localStore.set(lsKey, JSON.stringify(newStore));
    lsStore = localStore.get(lsKey);
  }
}

const { subscribe, set, update } = writable(lsStore);
export const storedHearts = {
  subscribe,
  set,
  update,
};
