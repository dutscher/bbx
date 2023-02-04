import { writable } from 'svelte/store';
import { localStore } from './local-storage';

export const lsKey = 'hearts';
const defaultListName = 'Merkliste';
export const defaultStore = [{ id: 0, d: true, t: defaultListName, i: [] }];
export let lsStore = localStore.get(lsKey, defaultStore);

const { subscribe, set, update } = writable({ reason: 'init', lists: lsStore });
export const storedHearts = {
  subscribe,
  set,
  update,
};
