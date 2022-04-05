import { LOADED, LOADING } from '@interfaces';
import { storedProducts } from '../products';
import { storedActiveSelection } from '../states';

export const loadInstData = async () => {
  storedActiveSelection.update(store => {
    store.loadedData.inst = LOADING;
    return store;
  });
  // @ts-ignore TS2339
  const data = await fetch(`/data/inst.json?cb=${window.cacheBuster}`).then(res => res.json());

  storedActiveSelection.update(store => {
    store.loadedData.inst = LOADED;
    return store;
  });

  // { "100247": "/100/100247 Tragschnabelwagen (36MB).pdf", ... }
  storedProducts.update(products => {
    return products.map(product => {
      if (product.id in data) {
        product.inst = data[product.id];
      }
      return product;
    });
  });
};
