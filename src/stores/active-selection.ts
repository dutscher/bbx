import { writable } from 'svelte/store';
import { ID_PARTS, UNLOADED, urlKeyTags } from '@interfaces';
import { convertOldParams, getAllUrlParams, getUrlParam } from '@utils';
import { localStore } from './local-storage';
import { storedActiveProduct } from './active-product';

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
  parttypes: [],
  colors: [],
  states: [],
  designer: [],
  search: '',
  reason: 'default',
  site: '',
});
export const storedActiveSelection = {
  subscribe: storedActiveSelectionWritable.subscribe,
  set: storedActiveSelectionWritable.set,
  update: storedActiveSelectionWritable.update,
};

// ?tags=mittelalter,star-trek -> ?t=mittelalter,star-trek
convertOldParams();
// ?t=mittelalter,star-trek -> product page
if (!!getUrlParam(urlKeyTags)) {
  storedActiveSelection.update(store => {
    store.site = 'products';
    store.reason = 'init-tags-url';
    return store;
  });
}

const allParams = getAllUrlParams();
const queryProductId = getUrlParam('product');

// /?s=brickbar
// @ts-ignore
if ('site' in allParams && allParams.site === 'brickbar') {
  storedActiveSelection.update(store => {
    store.site = 'brickbar';
    store.reason = 'init-brickbar-url';
    store.tags = [ID_PARTS];
    return store;
  });
}

// ?s=products&q=Ulmer%20Münster
if (Object.keys(allParams).includes('search') && !queryProductId) {
  storedActiveSelection.update(store => {
    store.site = 'products';
    store.reason = 'init-search-url';
    return store;
  });
}
// ?s=products&q=Ulmer%20Münster&p=105709
if (Object.keys(allParams).some(param => ['site', 'product'].includes(param)) && !!queryProductId) {
  // close all toggles
  localStore.visibility('reset');
  // update search for product
  // open page
  storedActiveSelection.update(store => {
    store.site = 'products';
    store.search = queryProductId;
    store.reason = 'init-search-via-url';
    return store;
  });
  // open tooltip
  storedActiveProduct.update(store => {
    store.product = {
      id: parseInt(queryProductId),
      type: 'products',
    };
    store.reason = 'url-init';
    return store;
  });
}
