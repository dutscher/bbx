import { writable } from 'svelte/store';
import designerJSON from '../../data/designer.json';

export const sortedDesigner = designerJSON.map(designer => {
  return {
    id: designer.id,
    name: designer.name,
    url: designer.name.toLowerCase().replace(' ', '-').replace('.', ''),
  };
});

const { subscribe, set, update } = writable(sortedDesigner);
export const storedDesigner = {
  subscribe,
  set,
  update,
};
