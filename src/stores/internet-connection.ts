import { writable } from 'svelte/store';

export const internetConnection = writable({isOnline: window.navigator.onLine});

window.addEventListener('online', () => internetConnection.set({isOnline: true}));
window.addEventListener('offline', () => internetConnection.set({isOnline: false}));
