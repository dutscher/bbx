import { writable } from 'svelte/store';
import { products } from '../../data/all-products.reducer';
import { getProductHref } from '../utils';
import { storedColors } from './colors';
import { ID_PARTS } from '../_interfaces';

let colors;
storedColors.subscribe(store => (colors = store));

const storedProductsSortingWriteable = writable({ sorting: '', sortTitle: '', sortDirection: 'desc' });
export const storedProductsSorting = {
  subscribe: storedProductsSortingWriteable.subscribe,
  set: storedProductsSortingWriteable.set,
  update: storedProductsSortingWriteable.update,
};

const storedFilteredProductsWriteable = writable([]);
export const storedFilteredProducts = {
  subscribe: storedFilteredProductsWriteable.subscribe,
  set: storedFilteredProductsWriteable.set,
  update: storedFilteredProductsWriteable.update,
};

const storedProductsWriteable = writable([]);
export const storedProducts = {
  subscribe: storedProductsWriteable.subscribe,
  set: storedProductsWriteable.set,
  update: storedProductsWriteable.update,
};
export const sortedProducts = products.map(product => {
  product.title = product.title.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace('&amp;', ' & ');
  product.pricePerPart = product.price && product.parts ? (product.price / product.parts) * 100 : 0;
  product.href = getProductHref(product);
  product.matchTo =
    product.title.toLowerCase() +
    ' ' +
    product.href
      .toLowerCase()
      .replace(/-/g, ' ')
      .replace(/bluebrixx/, '');
  // PLATE 1X1 X 200, Trans-Neon Green
  if (product.title.includes(',')) {
    // 200 Teile, Roof Slopes, gemischt, Rot;
    let potenialColor = product.title
      .toLowerCase()
      .replace(' (without minifigure)', '')
      .replace(' (10x)', '')
      .replace(' (5 x)', '')
      .replace(', 20x', '')
      .replace(' (old)', '')
      .replace(' (tan)', '')
      .replace(' (light bluish gray)', '')
      .replace(' (dark bluish gray)', '')
      .replace(' (dark tan)', '')
      .replace(' (reddish brown)', '')
      .replace(' (dark brown)', '')
      .replace(' (dark green)', '')
      .replace(' (dark red)', '')
      .replace(' (trans clear)', '')
      .replace(/-/g, ' ')
      .replace(', desert beige', ', tan')
      .replace(', sand beige', ', tan')
      .replace(', braun', ', reddish brown')
      .replace(', brown', ', reddish brown')
      .replace(', gold', ', pearl gold')
      .replace(', silver', ', flat silver')
      .replace(', dark gray', ', pearl dark gray')
      .replace(', met.gray', ', pearl dark gray')
      .replace(', met. grey', ', pearl dark gray')
      .replace(', dark bluish grey', ', pearl dark gray')
      .replace(', dunkelgrau', ', dark bluish gray')
      .replace(', hellgrau', ', light bluish gray')
      .replace(', grau', ', light bluish gray')
      .replace(', weiss', ', white')
      .replace(', light green', ', bright green')
      .split(', ')
      // get last element
      .slice(-1)
      .pop();

    const findColor = colors.find(
      color => color.name.toLowerCase() === potenialColor || color.de.toLowerCase() === potenialColor
    );
    //titleMatch(color, product);

    if (findColor) {
      product.partColor = findColor;
    }
  }
  // flags
  product.isPart = product.tags.includes(ID_PARTS);
  // changed in history-data.ts -> product-data.ts setFlags
  product.isNewSoon = false;
  product.isNew = false;
  product.isHot = false;

  if (!('parts' in product) || product.parts === undefined) {
    product.parts = 0;
  }

  return product;
});
storedProducts.set(sortedProducts);
export const rawProducts = products;
