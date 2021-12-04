import { storedActiveSelection, storedProducts } from "../../stores";
import { LOADED, LOADING } from "../../_interfaces";

export const loadInstData = async () => {
    storedActiveSelection.update(value => {
        value.loadedData.inst = LOADING;
        return value;
    });
    // @ts-ignore TS2339
    const data = await fetch(`/data/inst.json?cb=${window.cacheBuster}`).then(res => res.json());

    storedActiveSelection.update(value => {
        value.loadedData.inst = LOADED;
        return value;
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
}
