import { writable } from 'svelte/store';
import { rawProducts } from './products';
import { ID_CATEGORY_BRIX } from '@interfaces';
import tagsJSON from '../../data/tags.json';

const sortedTags = tagsJSON.map((tag, i) => ({
  name: Array.isArray(tag) ? tag[0] : tag,
  seoName: (Array.isArray(tag) ? tag[0] : tag)
    // @ts-ignore TS2339
    .toLowerCase()
    .replace(' & ', '-')
    .replace('ä', 'ae')
    .replace('ö', 'oe')
    .replace('ü', 'ue')
    .replace('ß', 'ss')
    .replace(/ /g, '-'),
  de: Array.isArray(tag) ? tag[0] : tag,
  id: i,
  count: rawProducts.filter(product => {
    const tagName = Array.isArray(tag) ? tag[0] : tag;
    // count brix categories
    if (tagName === 'BRIX' && product.cats.includes(ID_CATEGORY_BRIX)) {
      return true;
    } else if (product.tags && product.tags.length > 0) {
      return product.tags.includes(i);
    } else return false;
  }).length,
}));

const { subscribe, set, update } = writable(sortedTags);
export const storedTags = {
  subscribe,
  set,
  update,
};
