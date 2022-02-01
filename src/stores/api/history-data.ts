import { storedProducts } from '../products';
import { sortedStates, storedActiveSelection } from '../states';
import { LOADED, LOADING } from "../../_interfaces";
import { getDateTime } from "../../utils";

export const loadHistoryData = async () => {
    storedActiveSelection.update(value => {
        value.loadedData.history = LOADING;
        return value;
    });
    // @ts-ignore TS2339
    const data = await fetch(`/data/all-products-history.json?cb=${window.cacheBuster}`).then(res => res.json());

    // update store with history
    storedProducts.update(products => {
        const newStore = products.map(product => {
            // add history
            if (product.id in data) {
                product.history = {};
                const minHistory = data[product.id];
                Object.entries(minHistory).map(([timestamp, stateId]) => {
                    // all timestamps mulitply by 1000
                    // @ts-ignore
                    product.history[parseInt(timestamp) * 1000] = stateId;
                });
                // use last state out of history
                product.state = product.history[Object.keys(product.history).pop()]
                product.stateDate = parseInt(Object.keys(product.history).pop());
            }
            // set state object on product
            const state = sortedStates.find(state => state.id === product.state);
            product.state = state;
            // new products with history is ready
            return product;
        });

        storedActiveSelection.update(value => {
            value.loadedData.history = LOADED;
            return value;
        });

        return newStore;
    });
}
