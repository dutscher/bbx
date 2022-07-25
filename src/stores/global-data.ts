import { writable } from 'svelte/store';
//import dataJSON from '../../data/data.json';

const dataJSON = {
  url: 'https://www.bluebrixx.com/de',
  instUrl: 'https://www.bluebrixx.com/data/files/manuals',
  partNr: 'https://www.bricklink.com/v2/catalog/catalogitem.page?P=',
};

// instUrl: ProductInst.svelte
// url: ProductMediaNavigation.svelte notifications.ts
// partNr: ProductTooltip.svelte

const { subscribe, set, update } = writable(dataJSON);
export const storedGlobalData = {
  subscribe,
  set,
  update,
};
