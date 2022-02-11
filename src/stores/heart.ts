import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultList = 'default';
let lsStore = localStore.get(lsKey);

// fallback do migration / [103217] -> { default: {t:'Merkliste',i:[103217]} }
if (Array.isArray(lsStore)) {
  localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: 'Merkliste', i: lsStore } }));
  lsStore = localStore.get(lsKey);
  // fallback do migration / {"default":[104000,104185,105030,104953]} -> { default:{t:'Merkliste',i:[103217]} }
} else if ('default' in lsStore && Array.isArray(lsStore.default)) {
  localStore.set(lsKey, JSON.stringify({ [defaultList]: { t: 'Merkliste', i: lsStore.default } }));
  lsStore = localStore.get(lsKey);
}
// {"default":{"t":"Merkliste","i":[104000,104185,104953]},"bingo":{"i":[103406,102818,101999,103360,102000,102035,102595,103285,102540,102531,103881,100249,101299,101066,103305,102497,100842,101478,102590,401172,100284],"t":"Zuhause"}}

export const storedHearts = writable(lsStore || { [defaultList]: { t: 'Merkliste', i: [] } });
