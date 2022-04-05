import { writable } from 'svelte/store';
import { localStore } from '../local-storage';
import { storedHearts } from '../hearts';
import { lsKeyHeart } from '../../stores';

export const lsKey = 'heartsShare';
let lsStoreUuid = localStore.getRaw(lsKey);
const api = '//myjson.dit.upm.es/';
//const api = '//api.willy-selma.de/bbx/stores/';
const apiBins = api + 'api/bins/';

// https://myjson.dit.upm.es/
// http://myjson.dit.upm.es/api/bins/apor

const { subscribe, set, update } = writable({ uuid: lsStoreUuid, time: 0 });
export const storedHeartsShare = {
  subscribe,
  set,
  update,
};

export function generateHeartCloud(data) {
  const time = new Date().getTime();
  fetch(apiBins, {
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
      lsStoreUuid = uuid;
      storedHeartsShare.set({ uuid: lsStoreUuid, time });
      localStore.set(lsKey, lsStoreUuid);
      localStore.set(lsKeyHeart, JSON.stringify(data));
    });
}

export function getHeartCloud() {
  if (lsStoreUuid) {
    fetch(apiBins + lsStoreUuid)
      .then(res => res.json())
      .then(cloudStore => {
        console.log('getHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStoreUuid, time: cloudStore.time });
        storedHearts.set(cloudStore.data);
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}

export function updateHeartCloud(data) {
  if (lsStoreUuid) {
    fetch(apiBins + lsStoreUuid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time: new Date().getTime(), data }),
    })
      .then(res => res.json())
      .then(cloudStore => {
        console.log('updateHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStoreUuid, time: cloudStore.time });
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.data));
      });
  }
}
