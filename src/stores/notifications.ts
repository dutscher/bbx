import { writable } from 'svelte/store';
import { storedHearts } from './hearts';
import { storedGlobalData } from './global-data';

// @ts-ignore TS2339: Property 'mozNotification' does not exist on type 'Window & typeof globalThis'.
const Notification = window.Notification || window.mozNotification || window.webkitNotification;
const granted = 'granted';
const denied = 'denied';

const { subscribe, set, update } = writable({
  isGranted: Notification ? Notification.permission === granted : false,
  isDenied: Notification ? Notification.permission === denied : false,
});
export const storedPermissions = {
  subscribe,
  set,
  update,
};

export const promptThePermission = () => {
  Notification.requestPermission(permission => {
    storedPermissions.update(store => {
      store.isGranted = permission === granted;
      store.isDenied = permission === denied;
      return store;
    });

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' }).then(notificationPerm => {
        notificationPerm.onchange = () => {
          storedPermissions.set({
            isGranted: notificationPerm.state === granted,
            isDenied: notificationPerm.state === denied,
          });
        };
      });
    }
  });
};

let globalData: any;
let hearts = [];
let heartLists: any;

storedGlobalData.subscribe(store => (globalData = store));
storedHearts.subscribe(store => {
  hearts = store.lists;
  heartLists = Object.keys(hearts);
});

export const doNotify = (product, fetchTries) => {
  if (true && fetchTries === -1) {
    return;
  }

  if (heartLists.find(list => hearts[list].i.includes(product.id))) {
    serviceWorkerNotify({
      // 500 Stück, 2x4 Stein, Hellgrün : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//400132/.html
      body: product.title + ' => ' + product.state.de + '; ' + globalData.url + product.href,
      tag: 'bbx-notify-graphql-tag',
    });
  }
};

export const serviceWorkerNotify = data => {
  storedPermissions.subscribe(store => {
    if (store.isGranted) {
      if (navigator && 'serviceWorker' in navigator) {
        const pre = '[svelte-to-service-worker--notify]';
        navigator.serviceWorker.ready.then(registration => {
          if (registration.active) {
            console.log(pre, 'sw ready', data);
            registration.active.postMessage({ type: 'send-notify', data });
          }
        });
      }
    }
  });
};
