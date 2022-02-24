import { writable } from 'svelte/store';
import { UNLOADED } from '../_interfaces';
import { capitalizeFirstLetter } from '../utils';

const storedActiveSelectionWritable = writable({
  loadedData: {
    changes: UNLOADED,
    inst: UNLOADED,
    movie: UNLOADED,
    history: UNLOADED,
  },
  lastCursor: {
    hash: '',
    dateStr: '',
  },
  tags: [],
  parts: [],
  partTypes: [],
  colors: [],
  states: [],
  search: '',
  reason: 'default',
  page: '',
});
export const storedActiveSelection = {
  subscribe: storedActiveSelectionWritable.subscribe,
  set: storedActiveSelectionWritable.set,
  update: storedActiveSelectionWritable.update,
};

const storedActiveProductWritable = writable({
  product: {
    id: 0,
    type: '', // product-type todaychanges, hearts etc.
  },
  reason: 'default',
});
export const storedActiveProduct = {
  subscribe: storedActiveProductWritable.subscribe,
  set: storedActiveProductWritable.set,
  update: storedActiveProductWritable.update,
};

import statesJSON from '../../data/states.json';

export const sortedStates = statesJSON.en.map((state, i) => {
  return {
    name: state,
    de: capitalizeFirstLetter(statesJSON.de[i].toLowerCase()),
    color: statesJSON.colors[i],
    id: i,
    api: statesJSON.api[i],
  };
});
const storedStatesWritable = writable(sortedStates);
export const storedStates = {
  subscribe: storedStatesWritable.subscribe,
  set: storedStatesWritable.set,
  update: storedStatesWritable.update,
};
