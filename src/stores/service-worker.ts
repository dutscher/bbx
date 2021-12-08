// listen to messages from service worker
import { storedProducts } from './products';

export default () => {
    if (navigator && 'serviceWorker' in navigator) {
        const pre = 'stores.ts';
        navigator.serviceWorker.addEventListener('message', (event) => {
            console.log(pre, 'message', event);
            const eventData = event.data;
            new Notification(eventData.title, eventData.notificationData);
        });

        navigator.serviceWorker.ready
            .then((registration) => {
                if (registration.active) {
                    // TODO: notifications settings
                    // product ids -> open bluebrixx
                    // new products -> open bluebrixx
                    // parts -> open bluebrixx
                    // all notifications -> open bluebrixx
                    console.log(pre, 'sw ready for message')
                    storedProducts.subscribe(store => {
                        console.log(pre, 'send store message')
                        // TODO: reduce product infos id, title, tags,
                        registration.active.postMessage({ type: 'update-products', store });
                    });
                }
            });
    }
}
