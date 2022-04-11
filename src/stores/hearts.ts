import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultList = 'default';
const defaultListName = 'Merkliste';
const defaultStore = [{ id: 0, d: true, t: defaultListName, i: [] }];
let lsStore = localStore.get(lsKey, defaultStore);

if (lsStore) {
  // fallback do migration / [103217] -> {"default":{"t":"Merkliste","i":[103217]}}
  if (Array.isArray(lsStore) && typeof lsStore[0] === 'number') {
    console.log('migration 1');
    localStore.set(lsKey, JSON.stringify([{ id: 0, d: true, t: defaultListName, i: lsStore }]));
    lsStore = localStore.get(lsKey);
    // fallback do migration / {"default":[104000,104185,105030,104953]} -> {"default":{"t":"Merkliste","i":[103217]}}
  } else if (defaultList in lsStore && Array.isArray(lsStore.default)) {
    console.log('migration 2');
    localStore.set(lsKey, JSON.stringify([{ id: 0, d: true, t: defaultListName, i: lsStore.default }]));
    lsStore = localStore.get(lsKey);
    // {default:{t:'Brauch ich unbedingt',i:[104000,104185,104953]}}} -> [{id:0,d:true,t:'Brauch ich unbedingt',i:[104000,104185,104953]}}]
  } else if (defaultList in lsStore && !('id' in lsStore.default)) {
    console.log('migration 3');
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
    // [{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Meine Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[{"id":0,"t":"Merkliste","i":[103764,104374,103217,102892,102912,103905,102787,104895,103336,104613],"d":true}],"d":true}],"d":true}],"d":true}],"d":true}],"d":true}],"d":true}],"d":true},104613,103336,102843,102892,102912,104374,104895,103764],"d":true}],"d":true},104613,103336,103764,103217,102843,102892,102912,104374,104895,105135],"d":true},102787,104613,103336,103764,103217,102843,102892,102912,104374,104895,105135,105226,103905,103251],"d":true}],"d":true},103251,103336,104613,102892,104374,102912,103905],"d":true}],"d":true},103251,102892,103336,104374],"d":true}]
  } else if (Array.isArray(lsStore) && 'id' in lsStore[0]) {
    const hasWrongMigrated = lsStore[0].i.some(item => typeof item !== 'number');
    if (hasWrongMigrated) {
      console.log('migration 4', hasWrongMigrated, lsStore);
      lsStore[0].i = lsStore[0].i.filter(item => typeof item === 'number');
      localStore.set(lsKey, JSON.stringify(lsStore));
      lsStore = localStore.get(lsKey);
    }
  }
}

const { subscribe, set, update } = writable({ reason: 'init', lists: lsStore });
export const storedHearts = {
  subscribe,
  set,
  update,
};
