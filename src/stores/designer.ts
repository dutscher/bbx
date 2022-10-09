import { writable } from 'svelte/store';
import designerJSON from '../../data/designer.json';

export const sortedDesigner = designerJSON.map(designer => {
  return {
    id: designer.id,
    de: designer.name,
    seoName: designer.name.toLowerCase().replace(/ /g, '-').replace('.', ''),
  };
});

const { subscribe, set, update } = writable(sortedDesigner);
export const storedDesigner = {
  subscribe,
  set,
  update,
};
