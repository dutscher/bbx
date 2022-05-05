import { writable } from 'svelte/store';
import { capitalizeFirstLetter } from '@utils';

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
