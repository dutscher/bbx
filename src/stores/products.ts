import { writable } from 'svelte/store';
import { sortedStates } from './states';
//import productsJSON from '../data/all-products.json';
import { products } from '../../data/all-products.reducer';
import { getProductHref } from "../utils";

export const storedFilteredProducts = writable([]);
export const storedProducts = writable([]);
export const sortedProducts = products.map(product => {
    product.title = product.title.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace('&amp;', ' & ');
    const state = sortedStates.find(state => state.id === product.state)

    product.pricePerPart = product.price && product.parts ? (product.price / product.parts) * 100 : 0;

    product.state = state;
    product.href = getProductHref(product);
    product.matchTo = (
        product.title.toLowerCase()
        + ' '
        + (product.href.toLowerCase()
            .replace(/-/g, ' ')
            .replace(/bluebrixx/, ''))
    )
    return product;
})
storedProducts.set(sortedProducts);
export const rawProducts = products;
