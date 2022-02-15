import { writable } from 'svelte/store';
import { storedHearts } from './hearts';
import { storedGlobalData } from './global-data';
import { serviceWorkerNotify } from './service-worker';

// @ts-ignore TS2339: Property 'mozNotification' does not exist on type 'Window & typeof globalThis'.
const Notification = window.Notification || window.mozNotification || window.webkitNotification;
const granted = 'granted';
const denied = 'denied';

export const storedPermissions = writable({
  isGranted: Notification ? Notification.permission === granted : false,
  isDenied: Notification ? Notification.permission === denied : false,
});

export const promptThePermission = () => {
  Notification.requestPermission(permission => {
    storedPermissions.update(store => {
      store.isGranted = permission === granted;
      store.isDenied = permission === denied;
      console.log({ permission });
      return store;
    });

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' }).then(notificationPerm => {
        notificationPerm.onchange = () => {
          console.log({ stateChange: notificationPerm.state });
          storedPermissions.set({
            isGranted: notificationPerm.state === granted,
            isDenied: notificationPerm.state === denied,
          });
        };
      });
    }
  });
};

let data: any;
let hearts = [];
let heartLists: any;

storedGlobalData.subscribe(store => (data = store));
storedHearts.subscribe(store => {
  hearts = store;
  heartLists = Object.keys(hearts);
});

export const doNotify = (product, fetchTries) => {
  if (true && fetchTries === -1) {
    return;
  }

  if (heartLists.find(list => hearts[list].i.includes(product.id))) {
    serviceWorkerNotify({
      // 500 Stück, 2x4 Stein, Hellgrün : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//400132/.html
      body: product.title + ' => ' + product.state.de + '; ' + data.url + product.href,
      tag: 'bbx-notify-graphql-tag',
    });
  }
};
