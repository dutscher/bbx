// listen to messages from service worker
import { storedProducts } from './products';
import { storedHearts } from './hearts';
import { AFF_LINK } from '../_interfaces';
import { storedPermissions } from '../stores';

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

export const serviceWorkerSvelteSyncer = () => {
  if (navigator && 'serviceWorker' in navigator) {
    const pre = '[svelte-to-service-worker--store]';

    navigator.serviceWorker.addEventListener('message', event => {
      //console.log(pre, 'message', event);
      const eventData = event.data;
      new Notification(eventData.title, eventData.notificationData);
    });

    navigator.serviceWorker.ready.then(registration => {
      if (registration.active) {
        console.log(pre, 'sw ready');

        registration.active.postMessage({ type: 'update-store', key: 'AFF_LINK', store: AFF_LINK });

        storedHearts.subscribe(store => {
          registration.active.postMessage({ type: 'update-store', key: 'hearts', store });
        });

        storedProducts.subscribe(store => {
          //console.log(pre, 'send store message')

          store = store.map(product => ({
            id: product.id,
            title: product.title,
          }));

          registration.active.postMessage({ type: 'update-store', key: 'products', store });
        });
      }
    });
  }
};
