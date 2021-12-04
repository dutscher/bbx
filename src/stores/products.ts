import { writable } from 'svelte/store';
import { sortedStates } from './states';
//import productsJSON from '../data/all-products.json';
import { products } from '../../data/all-products.reducer';

export const storedFilteredProducts = writable([]);
export const storedProducts = writable([]);
export const sortedProducts = products.map(product => {
    product.title = product.title.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace('&amp;', ' & ');
    const state = sortedStates.find(state => state.id === product.state)

    const getHref = (product) => {
        // "href": "/103464/Klassischer-schwarzer-LKW-mit-Trailer-BlueBrixx-Special",
        const urlSafeTitle = product.title.replace(/ /g, '-').replace(/ß/g, 'ss');
        return `/${product.id}/${urlSafeTitle}`;
    }

    product.pricePerPart = product.price && product.parts ? (product.price / product.parts) * 100 : 0;

    product.state = state;
    product.href = getHref(product);
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
