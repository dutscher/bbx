import { writable } from 'svelte/store';

import dataJSON from '../../data/data.json';

export const storedGlobalData = writable({});
storedGlobalData.set(dataJSON);
