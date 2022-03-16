const pre = '[ServiceWorker]';
const debug = 'notification'.split(','); // message,install,activate,caching,push
// store svelte data

const store = {};
// Update cache names any time any of the cached files change.
// Add list of files to cache here.
const CACHE_NAME = 'cacheBuster-v1';

const IGNORE_REQUESTS = [
  'matomo.bbx.watch',
  'api.bbx.watch',
  'facebook.com',
  'facebook.net',
  'chrome-extension',
  'localhost',
];
// TODO: cache bb resource in different cache
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './favicon.ico',
  './service-worker.js?cb=1626458022163',
  './pwa/loader.js?cb=1626458022163',
  './data/inst.json?cb=1626458022163',
  './build/bundle.js?cb=1626458022163',
  './build/bundle.css?cb=1626458022163',
  './images/color-pearl-gold.jpg',
  './images/color-pearl-gray.jpg',
];

const log = (...args) => {
  if (debug.some(loggy => args[0].toLowerCase().includes(loggy))) {
    console.log(pre, ...args);
  }
};

self.addEventListener('install', e => {
  log('install', CACHE_NAME);

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(FILES_TO_CACHE);
    })()
  );

  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  log('activate', CACHE_NAME);
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            log('activate,Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', e => {
  log('fetch ', CACHE_NAME);
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      log(`fetch,Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      if (!IGNORE_REQUESTS.some(request => e.request.url.includes(request))) {
        const cache = await caches.open(CACHE_NAME);
        log(`fetch,Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
      }
      return response;
    })()
  );
});

self.addEventListener('message', event => {
  //const client = evt.source;
  //client.postMessage(`Pong: ${ evt.data }`);
  log('message', event.data);

  switch (event.data.type) {
    case 'update-store':
      store[event.data.key] = event.data.store;
      break;
    case 'send-notify':
      showNotification(event.data.data);
      break;
  }
});

self.addEventListener('push', function (event) {
  log('pushnotification');
  event.waitUntil(
    //getEndpoint()
    Promise.resolve().then(async function (endpoint) {
      showNotification(event.data);
    })
  );
});

// https://serviceworke.rs/push-get-payload_service-worker_doc.html
function getEndpoint() {
  return self.registration.pushManager.getSubscription().then(function (subscription) {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}

self.addEventListener('notificationclick', function (event) {
  log('notificationclick', event.notification);
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then(matchedClients => {
      // for (let client of matchedClients) {
      //   if (client.url.indexOf(rootUrl) >= 0) {
      //     return client.focus();
      //   }
      // }

      return clients.openWindow(event.notification.data).then(function (client) {
        if (client !== null) client.focus();
      });
    })
  );
});

async function sendMessageToSvelte(productID, title, notificationData) {
  clients.matchAll().then(matchedClients => {
    matchedClients[0].postMessage({
      type: 'GET_PRODUCT_INFO',
      productID,
      title,
      notificationData,
    });
  });
}

// Katze weiß + streckend : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//102046/.html -> jekca
// Dampflokomotive BR 89 : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//101019/.html
// NEU Buchfink (189 Teile) - Status: ANNOUNCEMENT - Link: https://www.bluebrixx.com/de//104804/.html
const notificationSendable = (productID, notificationBody) => {
  // TODO: store showed notification with id and timestamp
  // is product in store
  let isSendable = false;
  let isProductExists = 'products' in store && store.products.some(product => product.id === productID);
  let isProductInHearts = 'hearts' in store && store.hearts.default.i.includes(productID);
  let isMessageStateAvailable = notificationBody.includes('=> AVAILABLE') || notificationBody.includes('=> Verfügbar');
  let isMessageProductNew = notificationBody.includes('NEU ');
  if ((isProductExists && isProductInHearts && isMessageStateAvailable) || isMessageProductNew) {
    isSendable = true;
  }
  log('notificationSendable', {
    isSendable,
    isProductExists,
    isProductInHearts,
    isMessageStateAvailable,
    isMessageProductNew,
    productID,
    notificationBody,
  });
  return isSendable;
};

const showNotification = data => {
  let title = 'BBX Watcher';
  let body = data ? ('text' in data ? data.text() : data.body) : '';
  const [msg, url] = body.split(';');
  let tag = data.tag || 'bbx-notify-push-tag';
  let icon = '/ico/apple-icon-120x120.png';
  // Katze weiß + streckend : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//102046/.html
  const matches = /\/(\d+)\//.exec(body);
  let productID = matches ? parseInt(matches[1]) : -1;
  log('showNotification', { title, msg, tag, icon, data });
  if (notificationSendable(productID, msg)) {
    self.registration.showNotification(title, {
      body: msg,
      icon,
      vibrate: [500, 100, 500],
      data: url.trim() + store.AFF_LINK,
    });
  }
};
