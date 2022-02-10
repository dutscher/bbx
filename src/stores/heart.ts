import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultList = 'default';
let lsStore = localStore.get(lsKey);

// fallback do migration / [103217] -> { default: {title:'Merkliste',items:[103217]} }
if (Array.isArray(lsStore)) {
  localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: 'Merkliste', i: lsStore } }));
  lsStore = localStore.get(lsKey);
}

export const storedHearts = writable(lsStore || { [defaultList]: { t: 'Merkliste', i: [] } });
