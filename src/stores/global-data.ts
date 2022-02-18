import { writable } from 'svelte/store';
import dataJSON from '../../data/data.json';

const { subscribe, set, update } = writable(dataJSON);
export const storedGlobalData = {
  subscribe,
  set,
  update,
};
