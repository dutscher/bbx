import { writable } from 'svelte/store';
import categoriesJSON from '../../data/categories.json';

const { subscribe, set, update } = writable([]);
export const storedCategories = {
  subscribe,
  set,
  update,
};
storedCategories.set(categoriesJSON);
