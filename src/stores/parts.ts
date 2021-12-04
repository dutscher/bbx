import { writable } from 'svelte/store';

import partsJSON from '../../data/parts.json';
import partTypesJSON from '../../data/parts-types.json';

const sortedParts = partsJSON.map((part, i) => {
    const name = Array.isArray(part) ? part[0].toString() : part;
    const lastElement = Array.isArray(part) ? part[part.length - 1] : null;
    return {
        name,
        seoName: Array.isArray(part) ? part[2] : name.toLowerCase(),
        de: Array.isArray(part) ? part[1] : '',
        matcher: Array.isArray(part) ? part : [part],
        ignores: Array.isArray(lastElement) ? part[part.length - 1] : [],
        id: i,
    }
});
export const storedParts = writable({});
storedParts.set(sortedParts);

const sortedPartTypes = partTypesJSON.map((part, i) => {
    const name = Array.isArray(part) ? part[0].toString() : part;
    const lastElement = Array.isArray(part) ? part[part.length - 1] : null;
    return {
        name,
        seoName: name.toLowerCase(),
        de: Array.isArray(part) ? part[1] : '',
        matcher: Array.isArray(part) ? part : [part],
        ignores: Array.isArray(lastElement) ? part[part.length - 1] : [],
        id: i,
    }
});
export const storedPartTypes = writable({});
storedPartTypes.set(sortedPartTypes);
