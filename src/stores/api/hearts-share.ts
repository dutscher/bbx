import { writable } from 'svelte/store';
import { lsKey as lsKeyHeart } from '../hearts';
import { localStore } from '../local-storage';
import { storedHearts } from '../hearts';

export const lsKey = 'heartsShare';
const api = '//myjson.dit.upm.es/api/bins/'; // bp9b
let lsStore = localStore.get(lsKey, { uuid: '', time: 0 });

const { subscribe, set, update } = writable(lsStore);
export const storedHeartsShare = {
  subscribe,
  set,
  update,
};

storedHeartsShare.subscribe(store => (lsStore = store));

// store changes from tooltip or page
storedHearts.subscribe(store => {
  //console.log('changes in da house', lsStore, store);
  if (lsStore.uuid && !['init', 'get-cloud'].includes(store.reason)) {
    updateHeartCloud(store.lists);
  }
});

export function generateHeartCloud(data) {
  const time = new Date().getTime();
  fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, data }),
  })
    .then(res => res.json())
    .then(responseJSON => {
      // responseJSON = {"uri":"https://myjson.dit.upm.es/api/bins//94nz"}
      const uuid = responseJSON.uri.split('/').pop();
      lsStore.uuid = uuid;
      storedHeartsShare.set({ uuid, time });
      localStore.set(lsKey, JSON.stringify({ uuid, time }));
      localStore.set(lsKeyHeart, JSON.stringify(data));
    });
}

export function getHeartCloud() {
  //console.log('getHeartCloud', lsStore);
  if (lsStore.uuid) {
    fetch(api + lsStore.uuid)
      .then(res => res.json())
      .then(cloudStore => {
        //console.log('getHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStore.uuid, time: cloudStore.time });
        storedHearts.set({ reason: 'get-cloud', lists: cloudStore.data });
        localStore.set(lsKey, JSON.stringify({ uuid: lsStore.uuid, time: cloudStore.time }));
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}

export function updateHeartCloud(data) {
  console.log({ time: new Date().getTime(), data });
  if (lsStore.uuid) {
    fetch(api + lsStore.uuid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time: new Date().getTime(), data }),
    })
      .then(res => res.json())
      .then(cloudStore => {
        //console.log('updateHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStore.uuid, time: cloudStore.time });
        localStore.set(lsKey, JSON.stringify({ uuid: lsStore.uuid, time: cloudStore.time }));
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}
