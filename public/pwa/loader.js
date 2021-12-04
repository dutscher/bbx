(() => {
    const pre = '[PWA Loader]';
    const api = '//bbx.willy-selma.de/push';
    const registerPushSubscriptionAfterPermissionGranted = (sw) => {
        console.log(pre, 'registerPushSubscriptionAfterPermissionGranted')
        let subscriptionExists = false;

        // https://serviceworke.rs/push-get-payload_index_doc.html
        // https://rossta.net/blog/using-the-web-push-api-with-vapid.html

        // Web-Push
        // Public base64 to Uint
        function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            let outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        sw.then(function (registration) {
            console.log(pre, 'is ready');

            return registration.pushManager.getSubscription()
                .then(async function (subscription) {
                    if (subscription) {
                        console.log(pre, 'subscription already there', subscription);
                        subscriptionExists = true;
                        return subscription;
                    }

                    const vapidPublicKey = await fetch(api + '/vapidPublicKey').then(res => res.text());
                    console.log(pre, 'create subscription', subscription);
                    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey,
                    });
                });
        })
            .then(async function (subscription) {
                if (!subscriptionExists) {
                    const dbsubscription = await fetch(api + '/register', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            subscription,
                        }),
                    }).then(res => res.json());
                    localStorage.setItem('subscriptionID', dbsubscription.id);
                    console.log(pre, 'subscriptionID is in localstorage', dbsubscription)
                }

                console.log(pre, 'window.notifyme(\'payload\')')
                window.notifyme = function (msg) {
                    const payload = msg || 'ich bin ein notify';
                    const ttl = 24 * 60 * 60;

                    fetch(api + '/sendNotification', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            payload,
                            ttl,
                        }),
                    });
                };
            });
    }

    window.addEventListener('DOMContentLoaded', () => {
        if ('serviceWorker' in navigator) {
            console.log(pre, 'init service worker')
            const sw = navigator.serviceWorker.register('./service-worker.js?cb=' + window.cacheBuster);

            // listen to messages
            // navigator.serviceWorker.addEventListener('message', (event) => {
            //     console.log(pre, 'message', event);
            // });
            // TODO: find out which call opens the chrome notificationshizzle

            if ('permissions' in navigator) {
                navigator.permissions.query({ name: 'notifications' })
                    .then(function (notificationPerm) {
                        console.log(pre, 'notification permission changed: ', notificationPerm.state)
                        if (notificationPerm.state === 'granted') {
                            registerPushSubscriptionAfterPermissionGranted(sw);
                        }

                        notificationPerm.onchange = function () {
                            if (notificationPerm.state === 'granted') {
                                console.log(pre, 'notification granted')
                                registerPushSubscriptionAfterPermissionGranted(sw);
                            }

                            const subscriptionID = localStorage.getItem('subscriptionID');
                            if (!!subscriptionID && (notificationPerm.state === 'prompt' || notificationPerm.state === 'denied')) {
                                fetch(api + '/unregister', {
                                    method: 'post',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        subscriptionID
                                    }),
                                });
                            }
                        }
                    });
            }
        }
    }, { once: true });
})()
