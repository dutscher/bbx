import { writable } from 'svelte/store';
import { products } from '../../data/all-products.reducer';
import { getProductHref } from '../utils';
import { storedColors } from './colors';

let colors;
storedColors.subscribe(store => (colors = store));

export const storedFilteredProducts = writable([]);
export const storedProducts = writable([]);
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
    const potenialColor = product.title
      .toLowerCase()
      .replace(' (10x)', '')
      .replace('desert beige', 'beige')
      .replace('grey', 'gray')
      .replace('met. grey', 'pearl dark gray')
      .replace('met.gray', 'pearl dark gray')
      .split(', ')
      .at(-1);
    const findColor = colors.find(
      color => color.name.toLowerCase() === potenialColor || color.de.toLowerCase() === potenialColor
    );
    //titleMatch(color, product);

    if (findColor) {
      product.partColor = findColor;
    }
  }

  return product;
});
storedProducts.set(sortedProducts);
export const rawProducts = products;
