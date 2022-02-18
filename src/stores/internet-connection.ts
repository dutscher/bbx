import { writable } from 'svelte/store';

const { subscribe, set, update } = writable({ isOnline: window.navigator.onLine });
export const internetConnection = {
  subscribe,
  set,
  update,
};

window.addEventListener('online', () => set({ isOnline: true }));
window.addEventListener('offline', () => set({ isOnline: false }));
