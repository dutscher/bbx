const pre = '[ServiceWorker]';
// store svelte data
// TODO: store showed notification with id and timestamp
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
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './favicon.ico',
  './service-worker.js?cb=1626458022163',
  './pwa/loader.js?cb=1626458022163',
  './data/inst.json?cb=1626458022163',
  './build/bundle.js?cb=1626458022163',
  './build/bundle.css?cb=1626458022163',
  './images/icon-arrow.svg',
  './images/icon-cart.svg',
  './images/icon-cross.svg',
  './images/icon-flame.svg',
  './images/icon-heart.svg',
  './images/icon-manual.svg',
  './images/icon-new.svg',
  './images/pearl-gold.jpg',
  './images/pearl-gray.jpg',
  './images/spinner.svg',
];

self.addEventListener('install', e => {
  console.log(pre, 'install');

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(FILES_TO_CACHE);
    })()
  );

  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  console.log(pre, 'activate');
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      // console.log(pre, `Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      if (!IGNORE_REQUESTS.some(request => e.request.url.includes(request))) {
        const cache = await caches.open(CACHE_NAME);
        console.log(pre, `Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
      }
      return response;
    })()
  );
});

// Katze weiß + streckend : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//102046/.html -> jekca
// Dampflokomotive BR 89 : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//101019/.html
// NEU Buchfink (189 Teile) - Status: ANNOUNCEMENT - Link: https://www.bluebrixx.com/de//104804/.html
function notificationSendable(productID, notificationBody) {
  // TODO: sometimes products are not there
  // TODO: check notification settings
  // is product in store
  console.log(pre, 'notificationSendable', store);
  if (
    ('products' in store && store.products.some(product => product.id === productID)) ||
    notificationBody.includes('NEU ')
  ) {
    return true;
  }

  return false;
}

// https://serviceworke.rs/push-get-payload_service-worker_doc.html
function getEndpoint() {
  return self.registration.pushManager.getSubscription().then(function (subscription) {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}

async function sendMessage(productID, title, notificationData) {
  clients.matchAll().then(matchedClients => {
    matchedClients[0].postMessage({
      type: 'GET_PRODUCT_INFO',
      productID,
      title,
      notificationData,
    });
  });
}

const showNotification = data => {
  let title = 'BBX Watcher';
  let body = data ? ('text' in data ? data.text() : data.body) : '';
  const [msg, url] = body.split(';');
  let tag = data.tag || 'bbx-notify-push-tag';
  let icon = '/ico/apple-icon-120x120.png';
  // Katze weiß + streckend : state: BUYABLE => UNAVAILABLE;  https://www.bluebrixx.com/de//102046/.html
  const matches = /\/(\d+)\//.exec(body);
  let productID = matches ? parseInt(matches[1]) : -1;
  console.log(pre, 'showNotification', { title, msg, tag, icon, data });
  if (notificationSendable(productID, body)) {
    self.registration.showNotification(title, {
      body: msg,
      icon,
      vibrate: [500, 100, 500],
      data: url.trim() + store.AFF_LINK,
    });
  }
};

self.addEventListener('message', event => {
  //const client = evt.source;
  //client.postMessage(`Pong: ${ evt.data }`);
  console.log(pre, 'message', event.data);

  switch (event.data.type) {
    case 'update-store':
      store[event.data.key] = event.data.store;
      break;
    case 'send-notify':
      showNotification(event.data.data);
      break;
  }
});

// self.addEventListener("message", async (evt) => {
//     const messageSource = evt.source;
//     const clients = await self.clients.matchAll();
//     for (const client of clients) {
//         if (client !== messageSource) {
//             client.postMessage(`Message from ${ messageSource.id }: ${ evt.data }`);
//         }
//     }
// });

self.addEventListener('push', function (event) {
  console.log(pre, 'push');
  event.waitUntil(
    //getEndpoint()
    Promise.resolve().then(async function (endpoint) {
      showNotification(event.data);
    })
  );
});
// https://newbedev.com/how-can-i-initiate-a-pwa-progressive-webapp-open-from-a-click-on-a-push-notification
self.addEventListener('notificationclick', function (event) {
  console.log(pre, 'notificationclick', event.notification);
  //For root applications: just change "'./'" to "'/'"
  //Very important having the last forward slash on "new URL('./', location)..."
  const rootUrl = 'https://bbx.watch';
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
