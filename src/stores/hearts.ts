import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultList = 'default';
let lsStore = localStore.get(lsKey);

// fallback do migration / [103217] -> { default: {t:'Merkliste',i:[103217]} }
if (lsStore) {
  if (Array.isArray(lsStore)) {
    localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: 'Merkliste', i: lsStore } }));
    lsStore = localStore.get(lsKey);
    // fallback do migration / {"default":[104000,104185,105030,104953]} -> { default:{t:'Merkliste',i:[103217]} }
  } else if ('default' in lsStore && Array.isArray(lsStore.default)) {
    localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: 'Merkliste', i: lsStore.default } }));
    lsStore = localStore.get(lsKey);
  }
}
export const storedHearts = writable(lsStore || { [defaultList]: { t: 'Merkliste', i: [] } });
