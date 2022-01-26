import { writable } from 'svelte/store';
import { UNLOADED } from "../_interfaces";
import { capitalizeFirstLetter } from '../utils';

export const storedActiveSelection = writable({
    loadedData: {
        changes: UNLOADED,
        inst: UNLOADED,
        movie: UNLOADED,
        history: UNLOADED,
    },
    lastCursor: [],
    tags: [],
    parts: [],
    partTypes: [],
    colors: [],
    states: [],
    search: '',
    reason: 'default',
});

export const storedActiveProduct = writable({
    product: {
        id: 0,
        type: '', // product-type todaychanges, hearts etc.
    },
    reason: 'default',
});

import statesJSON from '../../data/states.json';

export const sortedStates = statesJSON.en.map((state, i) => {
    return {
        name: state,
        de: capitalizeFirstLetter(statesJSON.de[i].toLowerCase()),
        color: statesJSON.colors[i],
        id: i,
        api: statesJSON.api[i],
    }
});
export const storedStates = writable({});
storedStates.set(sortedStates);
