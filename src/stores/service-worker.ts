// listen to messages from service worker
import { AFF_LINK } from '@interfaces';
import { storedProducts } from './products';
import { storedHearts } from './hearts';

export const serviceWorkerSvelteSyncer = () => {
  if (navigator && 'serviceWorker' in navigator) {
    const pre = '[SVELTE-TO-SERVICE-WORKER--STORE]';
    const debug = 'nono'.split(','); // message ready send

    const log = (...args) => {
      if (debug.some(loggy => args[0].toLowerCase().includes(loggy))) {
        console.log(pre, ...args);
      }
    };

    navigator.serviceWorker.addEventListener('message', event => {
      log('message', event);
      const eventData = event.data;
      new Notification(eventData.title, eventData.notificationData);
    });

    navigator.serviceWorker.ready.then(registration => {
      if (registration.active) {
        log('sw ready');

        registration.active.postMessage({ type: 'update-store', key: 'AFF_LINK', store: AFF_LINK });

        storedHearts.subscribe(store => {
          registration.active.postMessage({ type: 'update-store', key: 'hearts', store: store.lists });
        });

        storedProducts.subscribe(store => {
          log('send store');
          // reduce
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
