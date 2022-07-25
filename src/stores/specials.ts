import { writable } from 'svelte/store';
import dataJSON from '../../data/specials.json';

const { subscribe, set, update } = writable(dataJSON);
export const storedSpecialData = {
  subscribe,
  set,
  update,
};
