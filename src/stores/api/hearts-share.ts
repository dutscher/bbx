import { writable } from 'svelte/store';
import { lsKey as lsKeyHeart, defaultStore } from '../hearts';
import { localStore } from '../local-storage';
import { storedHearts } from '../hearts';
import { API } from '@interfaces';

export const lsKey = 'heartsShare';
const api = `${API}/uapi/list`; // VFYNL
export const apiVersion = 2;
let lsStore = localStore.get(lsKey, { uuid: '', time: 0, apiVersion });

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
      // responseJSON = {"status":"ok","tokenstatus":"create","token":"CRFAE","payload":{"time":"1675411094000","data":[{"id":0,"d":true,"t":"Merkliste","i":[]}]}}
      const uuid = responseJSON.token;
      lsStore.uuid = uuid;
      storedHeartsShare.set({ uuid, time });
      localStore.set(lsKey, JSON.stringify({ uuid, time, apiVersion }));
      localStore.set(lsKeyHeart, JSON.stringify(data));
    });
}

export function getHeartCloud() {
  //console.log('getHeartCloud', lsStore);
  if (lsStore.uuid) {
    fetch(api + '/' + lsStore.uuid)
      .then(res => res.json())
      .then(cloudStore => {
        console.log('getHeartCloud', { cloudStore, lsStore, lsKey, lsKeyHeart });
        storedHeartsShare.set({ uuid: lsStore.uuid, time: parseInt(cloudStore.payload.time) });
        storedHearts.set({ reason: 'get-cloud', lists: cloudStore.payload.data });
        localStore.set(
          lsKey,
          JSON.stringify({ uuid: lsStore.uuid, time: parseInt(cloudStore.payload.time), apiVersion })
        );
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.payload.data));
      });
  }
}

export function updateHeartCloud(data) {
  //console.log({ time: new Date().getTime(), data });
  if (lsStore.uuid) {
    fetch(api + '/' + lsStore.uuid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time: new Date().getTime(), data }),
    })
      .then(res => res.json())
      .then(cloudStore => {
        //console.log('updateHeartCloud', cloudStore);
        storedHeartsShare.set({ uuid: lsStore.uuid, time: parseInt(cloudStore.payload.time) });
        localStore.set(
          lsKey,
          JSON.stringify({ uuid: lsStore.uuid, time: parseInt(cloudStore.payload.time), apiVersion })
        );
        localStore.set(lsKeyHeart, JSON.stringify(cloudStore.payload.data));
      });
  }
}

// import old localstorage and make a new uuid for that
if (!lsStore.apiVersion && !!lsStore.uuid || lsStore.apiVersion < apiVersion) {
  let lsStoreHearts = localStore.get(lsKeyHeart, defaultStore);
  generateHeartCloud(lsStoreHearts);
}
