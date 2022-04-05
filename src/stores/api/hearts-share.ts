import { writable } from 'svelte/store';
import { lsKeyHeart } from '@stores';
import { localStore } from '../local-storage';
import { storedHearts } from '../hearts';

export const lsKey = 'heartsShare';
const api = '//myjson.dit.upm.es/api/bins/';
let lsStore = localStore.get(lsKey, { uuid: '', time: 0 });

const { subscribe, set, update } = writable(lsStore);
export const storedHeartsShare = {
  subscribe,
  set,
  update,
};

// store changes from tooltip or page
// storedHearts.subscribe(store => {
//   if (lsStore.uuid) {
//     updateHeartCloud(store);
//   }
// });

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
  if (lsStore.uuid) {
    fetch(api + lsStore.uuid)
      .then(res => res.json())
      .then(cloudStore => {
        console.log('getHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStore.uuid, time: cloudStore.time });
        storedHearts.set(cloudStore.data);
        localStore.set(lsKey, JSON.stringify({ uuid: lsStore.uuid, time: cloudStore.time }));
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}

export function updateHeartCloud(data) {
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
        console.log('updateHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStore.uuid, time: cloudStore.time });
        localStore.set(lsKey, JSON.stringify({ uuid: lsStore.uuid, time: cloudStore.time }));
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}
