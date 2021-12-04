import { writable } from 'svelte/store';

import categoriesJSON from '../../data/categories.json';

export const storedCategories = writable({});
storedCategories.set(categoriesJSON);
